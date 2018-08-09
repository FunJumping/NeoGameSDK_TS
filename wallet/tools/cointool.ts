

// /// <reference path="./importpack.ts" />

namespace BlackCat.tools
{
    export class CoinTool
    {
        static readonly id_GAS: string = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
        static readonly id_NEO: string = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
        static id_SGAS: string = "";
        static id_SGAS_OLD: Array<string> = [];
        
        // static readonly id_SGAS_RATE: number = 100000000;
        static assetID2name: { [ id: string ]: string } = {};
        static name2assetID: { [ id: string ]: string } = {};
        static async initAllAsset()
        {
            var allassets = await tools.WWW.api_getAllAssets();
            for (var a in allassets)
            {
                var asset = allassets[ a ];
                var names = asset.name;
                var id = asset.id;
                var name: string = "";
                if (id == CoinTool.id_GAS)
                {
                    name = "GAS";
                }
                else if (id == CoinTool.id_NEO)
                {
                    name = "NEO";
                }
                else
                {
                    for (var i in names)
                    {
                        name = names[ i ].name;
                        if (names[ i ].lang == "en")
                            break;
                    }
                }
                CoinTool.assetID2name[ id ] = name;
                CoinTool.name2assetID[ name ] = id;
            }
        }

        /**
         * 获得utxos
         */
        static async getassets(): Promise<{ [ id: string ]: UTXO[] }>
        {
            //获得高度
            var height = await tools.WWW.api_getHeight();
            var utxos = await tools.WWW.api_getUTXO(tools.StorageTool.getStorage("current-address"));   //获得utxo
            var olds = OldUTXO.getOldutxos();       //获得以标记的utxo(交易过的utxo 存储在本地的标记)

            var olds2 = new Array<OldUTXO>();       //
            for (let n = 0; n < olds.length; n++)
            {
                const old = olds[ n ];
                let findutxo = false;
                for (let i = 0; i < utxos.length; i++)
                {
                    let utxo = utxos[ i ];

                    // console.log('utxo=> ', utxo, ', old => ', old)

                    if (utxo.txid == old.txid && old.n == utxo.n && height - old.height <= 2)
                    {
                        findutxo = true;
                        utxos.splice(i, 1);
                    }
                }
                if (findutxo)
                {
                    olds2.push(old);
                }
            }
            OldUTXO.setOldutxos(olds2);
            var assets = {};        //对utxo进行归类，并且将count由string转换成 Neo.Fixed8
            for (var i in utxos)
            {
                var item = utxos[ i ];
                var asset = item.asset;
                if (assets[ asset ] == undefined || assets[ asset ] == null)
                {
                    assets[ asset ] = [];
                }
                let utxo = new UTXO();
                utxo.addr = item.addr;
                utxo.asset = item.asset;
                utxo.n = item.n;
                utxo.txid = item.txid;
                utxo.count = Neo.Fixed8.parse(item.value);
                assets[ asset ].push(utxo);
            }
            // }
            return assets;
        }

        /**
         * @method 创建交易对象 ThinNeo.Transaction
         * @param utxos utxo列表
         * @param targetaddr 对方地址
         * @param assetid 资产id
         * @param sendcount 金额
         */
        static makeTran(utxos: { [ id: string ]: UTXO[] }, targetaddr: string, assetid: string, sendcount: Neo.Fixed8): Result
        {
            //if (sendcount.compareTo(Neo.Fixed8.Zero) <= 0)
            //    throw new Error("can not send zero.");
            var res = new Result();
            var us = utxos[ assetid ];
            if (us == undefined)
            {
                // res.err = true;
                // res.info = "no enough money.";
                throw new Error("pay_not_enough_utxo");
            }

            var tran = new ThinNeo.Transaction();
            tran.type = ThinNeo.TransactionType.ContractTransaction;
            tran.version = 0;//0 or 1
            tran.extdata = null;

            tran.attributes = [];

            tran.inputs = [];
            var scraddr: string = "";
            utxos[ assetid ].sort((a, b) =>
            {
                return a.count.compareTo(b.count);
            });
            var count: Neo.Fixed8 = Neo.Fixed8.Zero;
            var clonearr = [].concat(us);       //用于返回剩余可用的utxo
            var old: OldUTXO[] = []
            for (var i = 0; i < us.length; i++)
            {
                var input = new ThinNeo.TransactionInput();
                input.hash = us[ i ].txid.hexToBytes().reverse();
                input.index = us[ i ].n;
                input[ "_addr" ] = us[ i ].addr;//利用js的隨意性，臨時傳個值
                tran.inputs.push(input);        //将utxo塞入input
                count = count.add(us[ i ].count);//添加至count中
                scraddr = us[ i ].addr;
                clonearr.shift();               //删除已塞入的utxo
                old.push(new OldUTXO(us[ i ].txid, us[ i ].n));
                if (count.compareTo(sendcount) > 0) //判断输入是否足够
                {
                    break;      //如果足够则跳出循环
                }
            }


            if (count.compareTo(sendcount) >= 0)//输入大于等于输出
            {
                tran.outputs = [];
                //输出
                if (sendcount.compareTo(Neo.Fixed8.Zero) > 0)
                {
                    var output = new ThinNeo.TransactionOutput();
                    output.assetId = assetid.hexToBytes().reverse();
                    output.value = sendcount;
                    output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                    tran.outputs.push(output);
                }

                //找零
                var change = count.subtract(sendcount);
                if (change.compareTo(Neo.Fixed8.Zero) > 0)
                {
                    var outputchange = new ThinNeo.TransactionOutput();
                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                    outputchange.value = change;
                    outputchange.assetId = assetid.hexToBytes().reverse();
                    tran.outputs.push(outputchange);

                }
                res.err = false;
                res.info = { "tran": tran, "oldarr": old };

                // console.log("[Bla Cat]", "[cointool]", "oldarr => ", old)

                // if (tran.inputs) {
                //     for (let i in tran.inputs) {
                //         console.log("================== tran.input["+i+"]  => ", tran.inputs[i])
                //         console.log("================== tran.inputs["+i+"].hash => ", tran.inputs[i].hash.toHexString())
                //     }
                // }
            }
            else
            {
                throw new Error("pay_not_enough_money");
            }
            return res;
        }

        /**
         * @method 创建批量交易对象 ThinNeo.Transaction
         * @param utxos utxo列表
         * @param targets 信息数组
         * @param assetid 资产id
         */
        static makeTranMulti(utxos: { [ id: string ]: UTXO[] }, targets: Array<{toaddr:string, count:string}>, assetid: string): Result
        {
            // 计算总count
            var _count:number = 0;
            for (let i=0; i< targets.length; i++) {
                _count += Number(targets[i].count)
            }
            if (_count <= 0) {
                throw new Error("can_not_send_zero");
            }
            var sendcount = Neo.Fixed8.fromNumber(_count)

            var res = new Result();
            var us = utxos[ assetid ];
            if (us == undefined)
            {
                // res.err = true;
                // res.info = "no enough money.";
                throw new Error("pay_not_enough_utxo");
            }

            var tran = new ThinNeo.Transaction();
            tran.type = ThinNeo.TransactionType.ContractTransaction;
            tran.version = 0;//0 or 1
            tran.extdata = null;

            tran.attributes = [];

            tran.inputs = [];
            var scraddr: string = "";
            utxos[ assetid ].sort((a, b) =>
            {
                return a.count.compareTo(b.count);
            });
            var count: Neo.Fixed8 = Neo.Fixed8.Zero;
            var clonearr = [].concat(us);       //用于返回剩余可用的utxo
            var old: OldUTXO[] = []
            for (var i = 0; i < us.length; i++)
            {
                var input = new ThinNeo.TransactionInput();
                input.hash = us[ i ].txid.hexToBytes().reverse();
                input.index = us[ i ].n;
                input[ "_addr" ] = us[ i ].addr;//利用js的隨意性，臨時傳個值
                tran.inputs.push(input);        //将utxo塞入input
                count = count.add(us[ i ].count);//添加至count中
                scraddr = us[ i ].addr;
                clonearr.shift();               //删除已塞入的utxo
                old.push(new OldUTXO(us[ i ].txid, us[ i ].n));
                if (count.compareTo(sendcount) > 0) //判断输入是否足够
                {
                    break;      //如果足够则跳出循环
                }
            }


            if (count.compareTo(sendcount) >= 0)//输入大于等于输出
            {
                tran.outputs = [];
                //输出
                if (sendcount.compareTo(Neo.Fixed8.Zero) > 0)
                {
                    for (let k=0; k < targets.length; k++) {
                        var output = new ThinNeo.TransactionOutput();
                        output.assetId = assetid.hexToBytes().reverse();
                        output.value = Neo.Fixed8.parse(targets[k].count + "") // sendcount;
                        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targets[k].toaddr);
                        tran.outputs.push(output);
                    }
                }

                //找零
                var change = count.subtract(sendcount);
                if (change.compareTo(Neo.Fixed8.Zero) > 0)
                {
                    var outputchange = new ThinNeo.TransactionOutput();
                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                    outputchange.value = change;
                    outputchange.assetId = assetid.hexToBytes().reverse();
                    tran.outputs.push(outputchange);

                }
                res.err = false;
                res.info = { "tran": tran, "oldarr": old };

                // console.log("[Bla Cat]", "[cointool]", "oldarr => ", old)

                // if (tran.inputs) {
                //     for (let i in tran.inputs) {
                //         console.log("================== tran.input["+i+"]  => ", tran.inputs[i])
                //         console.log("================== tran.inputs["+i+"].hash => ", tran.inputs[i].hash.toHexString())
                //     }
                // }
            }
            else
            {
                throw new Error("pay_not_enough_money");
            }
            return res;
        }

        /**
         * utxo转账方法
         * @param targetaddr 转入的地址
         * @param asset 资产
         * @param count 金额
         */
        static async rawTransaction(targetaddr: string, asset: string, count: string): Promise<Result>
        {

            var arr = tools.StorageTool.getLoginArr();
            var add = tools.StorageTool.getStorage("current-address")
            //var n = arr.findIndex(login => login.address == add);
            try
            {
                var n: number = arr.findIndex(login => login.address == add);
            }
            catch (e)
            {
                var n: number;
                for (let i = 0; i < arr.length; i++)
                {
                    if (add == arr[ i ].address)
                    {
                        n = i;
                        break;
                    }
                }
            }
            var _count = Neo.Fixed8.parse(count + "");
            var utxos = await CoinTool.getassets();
            try
            {
                var tranres = CoinTool.makeTran(utxos, targetaddr, asset, _count);  //获得tran和改变后的utxo
                var tran: ThinNeo.Transaction = tranres.info[ 'tran' ];

                if (tran.witnesses == null)
                    tran.witnesses = [];
                let txid = tran.GetHash().clone().reverse().toHexString();
                var msg = tran.GetMessage().clone();
                var pubkey = arr[ n ].pubkey.clone();
                var prekey = arr[ n ].prikey.clone();
                var addr = arr[ n ].address;
                var signdata = ThinNeo.Helper.Sign(msg, prekey);
                tran.AddWitness(signdata, pubkey, addr);

                var data: Uint8Array = tran.GetRawData();

                var res: Result = new Result();
                var height = await tools.WWW.api_getHeight();
                var result = await tools.WWW.api_postRawTransaction(data);
                if (result[ "sendrawtransactionresult" ])
                {
                    res.err = !result;
                    res.info = txid;
                    let olds = tranres.info[ 'oldarr' ] as OldUTXO[];
                    olds.map(old => old.height = height);
                    OldUTXO.oldutxosPush(olds);
                }
                else {
                    res.err = true;
                    res.info = "no txid"
                }
                return res;
            } catch (error) 
            {
                throw error;
            }
        }

        /**
         * utxo转账方法
         * @param targets 批量转账信息数组
         * @param asset 资产
         */
        static async rawTransactionMulti(targets: Array<any>, asset: string): Promise<Result>
        {

            var arr = tools.StorageTool.getLoginArr();
            var add = tools.StorageTool.getStorage("current-address")
            //var n = arr.findIndex(login => login.address == add);
            try
            {
                var n: number = arr.findIndex(login => login.address == add);
            }
            catch (e)
            {
                var n: number;
                for (let i = 0; i < arr.length; i++)
                {
                    if (add == arr[ i ].address)
                    {
                        n = i;
                        break;
                    }
                }
            }

            var utxos = await CoinTool.getassets();
            try
            {
                var tranres = CoinTool.makeTranMulti(utxos, targets, asset);  //获得tran和改变后的utxo
                var tran: ThinNeo.Transaction = tranres.info[ 'tran' ];

                if (tran.witnesses == null)
                    tran.witnesses = [];
                let txid = tran.GetHash().clone().reverse().toHexString();
                var msg = tran.GetMessage().clone();
                var pubkey = arr[ n ].pubkey.clone();
                var prekey = arr[ n ].prikey.clone();
                var addr = arr[ n ].address;
                var signdata = ThinNeo.Helper.Sign(msg, prekey);
                tran.AddWitness(signdata, pubkey, addr);

                var data: Uint8Array = tran.GetRawData();

                var res: Result = new Result();
                var height = await tools.WWW.api_getHeight();
                var result = await tools.WWW.api_postRawTransaction(data);
                if (result[ "sendrawtransactionresult" ])
                {
                    res.err = !result;
                    res.info = txid;
                    let olds = tranres.info[ 'oldarr' ] as OldUTXO[];
                    olds.map(old => old.height = height);
                    OldUTXO.oldutxosPush(olds);
                }
                else {
                    res.err = true;
                    res.info = "no txid"
                }
                return res;
            } catch (error) 
            {
                throw error;
            }
        }

        /**
         * 领取gas
         */
        static async claimgas()
        {
            let claimtxhex: string = await tools.WWW.api_getclaimtxhex(LoginInfo.getCurrentAddress());

            //对象化交易体
            var tran = new ThinNeo.Transaction();
            var buf = claimtxhex.hexToBytes();
            tran.Deserialize(new Neo.IO.BinaryReader(new Neo.IO.MemoryStream(buf.buffer, 0, buf.byteLength)));
            var current = LoginInfo.getCurrentLogin();
            var msg = tran.GetMessage().clone();
            var signdata = ThinNeo.Helper.Sign(msg, current.prikey);
            tran.AddWitness(signdata, current.pubkey, current.address);

            var data: Uint8Array = tran.GetRawData();

            var result = await tools.WWW.api_postRawTransaction(data);
            return result
        }

        static async claimGas()
        {
            var current = LoginInfo.getCurrentLogin();
            let claimsstr = await tools.WWW.api_getclaimgas(current.address, 0);
            let claims = claimsstr[ "claims" ] as Claim[];
            let sum = claimsstr[ "gas" ].toFixed(8);

            var tran = new ThinNeo.Transaction();
            //交易类型为合约交易
            tran.type = ThinNeo.TransactionType.ClaimTransaction;
            tran.version = 0;//0 or 1
            tran.extdata = new ThinNeo.ClaimTransData(); //JSON.parse(JSON.stringify(claims));
            (tran.extdata as ThinNeo.ClaimTransData).claims = []
            tran.attributes = [];
            tran.inputs = [];
            for (let i in claims)
            {
                let claim = (claims[ i ] as Claim);
                var input = new ThinNeo.TransactionInput();
                input.hash = (claim.txid).hexToBytes().reverse();
                input.index = claim.n;
                input[ "_addr" ] = claim.addr;
                (tran.extdata as ThinNeo.ClaimTransData).claims.push(input);
            }
            var output = new ThinNeo.TransactionOutput();
            output.assetId = (CoinTool.id_GAS).hexToBytes().reverse();
            output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(current.address)
            output.value = Neo.Fixed8.parse(sum);
            tran.outputs = [];
            tran.outputs.push(output);
            var msg = tran.GetMessage().clone();
            var signdata = ThinNeo.Helper.Sign(msg, current.prikey);
            tran.AddWitness(signdata, current.pubkey, current.address);

            var data: Uint8Array = tran.GetRawData();
            var result = await tools.WWW.api_postRawTransaction(data);
            return result
        }

        /**
         * invokeTrans 方式调用合约塞入attributes
         * @param script 合约的script
         */
        static async contractInvokeTrans_attributes(script: Uint8Array)
        {
            let current: LoginInfo = LoginInfo.getCurrentLogin();
            var addr = current.address;
            var tran: ThinNeo.Transaction = new ThinNeo.Transaction();
            //合约类型
            tran.inputs = [];
            tran.outputs = [];
            tran.type = ThinNeo.TransactionType.InvocationTransaction;
            tran.extdata = new ThinNeo.InvokeTransData();
            //塞入脚本
            (tran.extdata as ThinNeo.InvokeTransData).script = script;
            tran.attributes = new Array<ThinNeo.Attribute>(1);
            tran.attributes[ 0 ] = new ThinNeo.Attribute();
            tran.attributes[ 0 ].usage = ThinNeo.TransactionAttributeUsage.Script;
            tran.attributes[ 0 ].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr);

            if (tran.witnesses == null)
                tran.witnesses = [];
            var msg = tran.GetMessage().clone();
            var pubkey = current.pubkey.clone();
            var prekey = current.prikey.clone();
            var signdata = ThinNeo.Helper.Sign(msg, prekey);
            tran.AddWitness(signdata, pubkey, addr);
            var data: Uint8Array = tran.GetRawData();

            var res: Result = new Result();
            var result = await tools.WWW.api_postRawTransaction(data);
            res.err = !result[ "sendrawtransactionresult" ];
            res.info = result[ "txid" ];
            return res;
        }

        /**
         * invokeTrans 方式调用合约塞入attributes
         * @param script 合约的script
         */
        static async contractInvokeTrans(script: Uint8Array)
        {
            let current: LoginInfo = LoginInfo.getCurrentLogin();
            var addr = current.address;
            let assetid = CoinTool.id_GAS;
            //let _count = Neo.Fixed8.Zero;   //十个gas内都不要钱滴
            var utxos = await CoinTool.getassets();
            let tranmsg = CoinTool.makeTran(utxos, current.address, assetid, Neo.Fixed8.Zero);
            let tran: ThinNeo.Transaction = tranmsg.info[ 'tran' ];
            tran.type = ThinNeo.TransactionType.InvocationTransaction;
            tran.extdata = new ThinNeo.InvokeTransData();
            //塞入脚本
            (tran.extdata as ThinNeo.InvokeTransData).script = script;
            // (tran.extdata as ThinNeo.InvokeTransData).gas = Neo.Fixed8.fromNumber(1.0);

            if (tran.witnesses == null)
                tran.witnesses = [];
            var msg = tran.GetMessage().clone();
            var pubkey = current.pubkey.clone();
            var prekey = current.prikey.clone();
            var signdata = ThinNeo.Helper.Sign(msg, prekey);
            tran.AddWitness(signdata, pubkey, addr);
            var data: Uint8Array = tran.GetRawData();
            console.log(data);
            var res: Result = new Result();
            var result = await tools.WWW.api_postRawTransaction(data);
            res.err = !result;
            res.info = "成功";
            return res;
        }

        /**
         * nep5转账
         * @param address 自己的地址
         * @param tatgeraddr 转账的地址
         * @param asset nep5资产id
         * @param amount 转账数额
         */
        static async nep5Transaction(address: string, tatgeraddr, asset: string, amount: string)
        {
            let res = await tools.WWW.getNep5Asset(asset);
            var decimals = res[ "decimals" ] as number;
            var numarr = amount.split(".");
            decimals -= (numarr.length == 1 ? 0 : numarr[ 1 ].length);

            var v = 1;
            for (var i = 0; i < decimals; i++)
                v *= 10;
            var bnum = new Neo.BigInteger(amount.replace(".", ""));
            var intv = bnum.multiply(v).toString();

            var sb = new ThinNeo.ScriptBuilder();
            var scriptaddress = asset.hexToBytes().reverse();
            //生成随机数
            var random_int: Neo.BigInteger;
            try
            {
                var random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(new Uint8Array(32));
                random_int = Neo.BigInteger.fromUint8Array(random_uint8);
            }
            catch (e)
            {
                var math_rand = parseInt((Math.random() * 10000000).toString());
                console.log('[Bla Cat]', '[cointool]', '[nep5Transaction] random_int from js random => ', math_rand)
                random_int = new Neo.BigInteger(math_rand);
            }

            //塞入随机数
            sb.EmitPushNumber(random_int);
            sb.Emit(ThinNeo.OpCode.DROP);
            //塞值
            sb.EmitParamJson([ "(address)" + address, "(address)" + tatgeraddr, "(integer)" + intv ]);//第二个参数是个数组
            sb.EmitPushString("transfer");
            sb.EmitAppCall(scriptaddress);
            var result = await CoinTool.contractInvokeTrans_attributes(sb.ToArray())
            return result;
        }



        /**
         * 获得utxos
         */
        static async getsgasAssets(id_SGAS: string = this.id_SGAS): Promise<{ [ id: string ]: UTXO[] }>
        {
            //获得高度
            var height = await tools.WWW.api_getHeight();
            var scriptHash = ThinNeo.Helper.GetAddressFromScriptHash(id_SGAS.hexToBytes().reverse())
            var utxos = await tools.WWW.api_getUTXO(scriptHash);   //获得utxo

            var olds = OldUTXO.getOldutxos();       //获得以标记的utxo(交易过的utxo 存储在本地的标记)
            var olds2 = new Array<OldUTXO>();       //
            for (let n = 0; n < olds.length; n++)
            {
                const old = olds[ n ];
                let findutxo = false;
                for (let i = 0; i < utxos.length; i++)
                {
                    let utxo = utxos[ i ];
                    if (utxo.txid == old.txid && old.n == utxo.n && height - old.height <= 2)
                    {
                        findutxo = true;
                        utxos.splice(i, 1);
                    }
                }
                if (findutxo)
                {
                    olds2.push(old);
                }
            }
            OldUTXO.setOldutxos(olds2);
            var assets = {};        //对utxo进行归类，并且将count由string转换成 Neo.Fixed8
            for (var i in utxos)
            {
                var item = utxos[ i ];
                var asset = item.asset;
                if (assets[ asset ] == undefined || assets[ asset ] == null)
                {
                    assets[ asset ] = [];
                }
                let utxo = new UTXO();
                utxo.addr = item.addr;
                utxo.asset = item.asset;
                utxo.n = item.n;
                utxo.txid = item.txid;
                utxo.count = Neo.Fixed8.parse(item.value);
                assets[ asset ].push(utxo);
            }

            return assets;
        }
    }
}