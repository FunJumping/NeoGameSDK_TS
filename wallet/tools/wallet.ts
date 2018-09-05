namespace BlackCat.tools {
    export class wallet {

        private wallet: ThinNeo.nep6wallet;
        private otcgo: WalletOtcgo;
        private isotc: boolean; // 是否是蓝鲸淘钱包

        filestr: string;
        wallet_addr: string;

        constructor() {
            this.wallet = new ThinNeo.nep6wallet();
            this.otcgo = new WalletOtcgo();

            this.filestr = "";
            this.isotc = false;

            this.wallet_addr = tools.LoginInfo.getCurrentAddress();
        }

        async setWalletStr(filestr) {
            this.filestr = filestr;
            return await this.readWalletFile(0);
        }

        // 读取钱包信息，type=0表示文件导入读取，type=1表示本地缓存读取
        async readWalletFile(type: number = 0) {
            // console.log("[BlaCat]", '[wallet] 读取钱包信息，读取方式 => ", type)
            if (type == 1) {
                this.filestr = await Main.user.getWalletFileCache();
            }

            if (this.filestr) {
                try {
                    this.isotc = !this.filestr.includes("accounts");
                    if (this.isotc) {
                        // console.log("[BlaCat]", '[wallet] 读取蓝鲸淘钱包")
                        this.wallet.accounts = undefined;
                        this.otcgo.fromJsonStr(this.filestr);
                        return true;
                    } else {
                        // console.log("[BlaCat]", '[wallet] 读取钱包")
                        this.otcgo.address = undefined;
                        this.wallet.fromJsonStr(this.filestr);
                        return true;
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[wallet]', 'readWalletFile, 钱包文件解析异常', this.filestr)
                    return false;
                }
            }
            return false;
        }

        async open(filepass: string) {
            if (!!this.wallet.accounts) {
                // console.log("[BlaCat]", '[wallet] 打开钱包文件")
                try {
                    let loginarray = await tools.neotools.nep6Load(
                        this.wallet,
                        filepass
                    ) as tools.LoginInfo[];

                    // console.log("[BlaCat]", '[wallet] 打开钱包文件，成功了")

                    await tools.StorageTool.setLoginArr(loginarray);
                    await tools.LoginInfo.setCurrentAddress(loginarray[0].address);

                    this.wallet_addr = loginarray[0].address;

                    return true;

                }
                catch (e) {
                    // Main.showErrMsg("请核对钱包文件或密码！");
                    Main.showErrMsg("wallet_open_check")
                    return false;
                }
            }
            if (!!this.otcgo.address) {
                console.log("[BlaCat]", '[wallet]', '打开蓝鲸淘钱包文件')
                try {
                    this.otcgo.otcgoDecrypt(filepass);
                    const result = this.otcgo.doValidatePwd();
                    if (result) {
                        var loginarray: tools.LoginInfo[] = new Array<tools.LoginInfo>();
                        loginarray.push(new tools.LoginInfo());
                        loginarray[0].address = this.otcgo.address;
                        loginarray[0].prikey = this.otcgo.prikey;
                        loginarray[0].pubkey = this.otcgo.pubkey;

                        tools.StorageTool.setLoginArr(loginarray);
                        tools.LoginInfo.setCurrentAddress(loginarray[0].address);

                        this.wallet_addr = this.otcgo.address;

                        return true;
                    } else {
                        // Main.showErrMsg("请核对蓝鲸淘钱包密码！");
                        Main.showErrMsg("wallet_open_check_otcgo_pwd")
                        return false;
                    }
                } catch (e) {
                    // Main.showErrMsg("请核对蓝鲸淘钱包文件！");
                    Main.showErrMsg(("wallet_open_check_otcgo"))
                    return false;
                }
            }
            console.log("[BlaCat]", '[wallet]', '无有效的钱包文件')
            return false;
        }

        isOpen() {
            var logined_addr = tools.LoginInfo.getCurrentAddress();

            this.wallet_addr = logined_addr;

            if (!logined_addr) {
                return false;
            }
            return true;
        }

        // 合约读取
        async invokescript(params: any) {
            var res: Result = new Result();

            // var callbackRes = { cmd: "invokescriptRes", data: res };

            var sb = new ThinNeo.ScriptBuilder();

            var scriptaddress = params.nnc.hexToBytes().reverse();
            //Parameter inversion
            sb.EmitParamJson(params.sbParamJson); //Parameter list
            if (params.hasOwnProperty('sbPushString')) sb.EmitPushString(params.sbPushString); //Method
            sb.EmitAppCall(scriptaddress); //Asset contract

            var data = sb.ToArray();
            // var scripthash = data.toHexString();

            var r = await tools.WWW.cli_getInvokescript(data);
            if (r) {
                // 成功
                res.err = false;
                res.info = r;
            } else {
                // 失败
                res.err = true;
                res.info = { error: "rpc getInvokescript error" };
            }
            return res;
        }

        // 合约交易
        async makeRawTransaction(params: any, trust: string = "0", net_fee: string) {
            var res: Result = new Result();

            var login = LoginInfo.getCurrentLogin();
            var addr = login.address;
            var tran: ThinNeo.Transaction = new ThinNeo.Transaction();

            // 合约类型
            tran.inputs = [];
            tran.outputs = [];
            tran.type = ThinNeo.TransactionType.InvocationTransaction;
            tran.extdata = new ThinNeo.InvokeTransData();

            // 手续费计算
            if (Number(net_fee) > 0) {
                (tran.extdata as ThinNeo.InvokeTransData).gas = Neo.Fixed8.fromNumber(Number(net_fee));
                // 有网络手续费
                try {
                    // 获取用户utxo
                    var user_utxos_assets = await tools.CoinTool.getassets();
                    console.log("[BlaCat]", '[wallet]', 'makeRawTransaction, user_utxos_assets => ', user_utxos_assets)

                    var user_makeTranRes: Result = tools.CoinTool.makeTran(
                        user_utxos_assets,
                        addr,
                        tools.CoinTool.id_GAS,
                        Neo.Fixed8.Zero,
                        Neo.Fixed8.fromNumber(Number(net_fee)),
                        0,
                        true, // 拆分gas的utxo，以便后续支付手续费
                    );

                    // inputs、outputs、oldarr塞入
                    var user_tran = user_makeTranRes.info.tran
                    var oldarr = user_makeTranRes.info.oldarr

                    tran.inputs = user_tran.inputs
                    tran.outputs = user_tran.outputs

                    console.log("[BlaCat]", '[wallet]', 'makeRawTransaction, user_makeTranRes => ', user_makeTranRes)
                }
                catch (e) {
                    res.err = true;
                    res.info = { error: "get_net_fee error" };

                    return res;
                }
            }

            var sb = new ThinNeo.ScriptBuilder();

            // 生成随机数
            var random_int: Neo.BigInteger;
            try {
                var array = new Uint8Array(2333);
                var random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(array);
                random_int = Neo.BigInteger.fromUint8Array(random_uint8);
            } catch (e) {
                var math_rand = parseInt((Math.random() * 10000000).toString());
                console.log("[BlaCat]", '[wallet]', 'makerawtransaction, math_rand => ', math_rand);
                random_int = new Neo.BigInteger(math_rand);
            }

            // 塞入随机数
            sb.EmitPushNumber(random_int);
            sb.Emit(ThinNeo.OpCode.DROP);

            if (params instanceof Array) {
                if (params.length > 2) {
                    // 不支持大于2步的操作
                    // 失败
                    res.err = true;
                    res.info = { error: "post raw transaction error, too many data params, only 2 " };

                    return res;
                }
                else {
                    // array(0)
                    var scriptaddress = params[0].nnc.hexToBytes().reverse();

                    //Parameter inversion
                    sb.EmitParamJson(params[0].sbParamJson); //Parameter list
                    sb.EmitPushString(params[0].sbPushString); //Method
                    sb.EmitAppCall(scriptaddress); //Asset contract

                    // array(1)
                    //这个方法是为了在同一笔交易中转账并充值
                    //当然你也可以分为两笔交易
                    //插入下述两条语句，能得到txid
                    sb.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                    sb.EmitSysCall("Neo.Transaction.GetHash");

                    sb.EmitPushBytes(
                        ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr)
                    );

                    //把TXID包进Array里
                    sb.EmitPushNumber(new Neo.BigInteger(2));
                    sb.Emit(ThinNeo.OpCode.PACK);

                    var scriptaddress_next = params[1].nnc.hexToBytes().reverse();

                    sb.EmitPushString(params[1].sbPushString); //Method
                    sb.EmitAppCall(scriptaddress_next);
                }
            } else {
                var scriptaddress = params.nnc.hexToBytes().reverse();

                //Parameter inversion
                sb.EmitParamJson(params.sbParamJson); //Parameter list
                sb.EmitPushString(params.sbPushString); //Method
                sb.EmitAppCall(scriptaddress); //Asset contract
            }

            let script = sb.ToArray();

            // 塞入脚本
            (tran.extdata as ThinNeo.InvokeTransData).script = script;
            tran.attributes = new Array<ThinNeo.Attribute>(1);
            tran.attributes[0] = new ThinNeo.Attribute();
            tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
            tran.attributes[0].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(
                addr
            );

            if (tran.witnesses == null) tran.witnesses = [];
            var msg = tran.GetMessage().clone();
            var pubkey = login.pubkey.clone();
            var prekey = login.prikey.clone();

            var signdata = ThinNeo.Helper.Sign(msg, prekey);
            tran.AddWitness(signdata, pubkey, addr);
            let txid = tran.GetHash().clone().reverse().toHexString();
            var data: Uint8Array = tran.GetRawData();

            var r = await tools.WWW.cli_postRawTransaction(data);
            if (r) {
                if (r["txid"] || r["sendrawtransactionresult"]) {
                    if (!r["txid"] || r["txid"] == "") {
                        r["txid"] = txid
                    }
                    // 成功
                    res.err = false;
                    res.info = { txid: r["txid"] };

                    // 上报数据
                    var logRes = await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        r["txid"],
                        Main.appid,
                        "",
                        "5",
                        JSON.stringify(params),
                        Main.netMgr.type,
                        trust,
                        net_fee,
                    );

                    // 记录使用的utxo，后面不再使用，需要记录高度
                    if (Number(net_fee) > 0) {
                        var height = await tools.WWW.api_getHeight_nodes();
                        oldarr.map(old => old.height = height);
                        tools.OldUTXO.oldutxosPush(oldarr);
                    }

                    Main.appWalletLogId = logRes.data;
                    if (trust == "1") {
                        Main.updateTrustNnc()
                    }
                } else {
                    // 失败
                    res.err = true;
                    res.info = { error: "post raw transaction error, no txid" };
                }
            } else {
                // 失败
                res.err = true;
                res.info = {
                    error: "post raw transaction error, maybe network err"
                };
            }
            return res;
        }

        // 充值到游戏
        async makeRecharge(params) {
            var res: Result = new Result();

            try {
                var t_addr = LoginInfo.getCurrentAddress();
                var t_taaddr = Main.app_recharge_addr;
                var t_asset = tools.CoinTool.id_SGAS;
                var t_amount = params.count.toString();

                // console.log("[main_gameplay][makeRecharge] t_addr => ", t_addr);
                // console.log("[main_gameplay][makeRecharge] t_taaddr => ", t_taaddr);
                // console.log("[main_gameplay][makeRecharge] t_asset => ", t_asset);
                // console.log("[main_gameplay][makeRecharge] t_amount => ", t_amount);

                var tranRes = await tools.CoinTool.nep5Transaction(
                    t_addr,
                    t_taaddr,
                    t_asset,
                    t_amount
                );
            } catch (e) {
                console.log("[BlaCat]", "[wallet]", "makeRecharge error => ", e.toString());

                res.err = true;
                res.info = { error: "post makeRecharge error" };

                return res;
            }

            if (!tranRes["err"]) {
                // 充值到游戏提交成功
                if (tranRes.info) {
                    res.err = false;
                    res.info = { txid: tranRes.info };

                    var logRes = await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        tranRes.info,
                        Main.appid,
                        params.count.toString(),
                        "3",
                        JSON.stringify(params),
                        Main.netMgr.type
                    );
                    Main.appWalletLogId = logRes.data;

                } else {
                    res.err = true;
                    res.info = { error: "post makeRecharge error, no txid" };

                    return res;
                }
            } else {
                res.err = true;
                res.info = { error: "post makeRecharge error, may be network error" };
            }

            console.log("[BlaCat]", "[wallet]", "makeRechargeRes => ", res);

            return res;
        }

        closeWallet() {
            // 清理打开的钱包
            tools.StorageTool.delStorage("current-address")
            tools.StorageTool.delStorage("login-info-arr")
            console.log("[BlaCat]", '[wallet]', 'closeWallet ...')
            if (Main.viewMgr.payWalletDetailView && Main.viewMgr.payWalletDetailView.isCreated && Main.viewMgr.payWalletDetailView.isHidden() == false) {
                Main.viewMgr.payWalletDetailView.return()
            }
        }
    }
}