
/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 钱包视图
    export class PayView extends ViewBase {
        // 钱包
        wallet_addr: string
        // 余额
        gas: number;
        sgas: number;
        listPageNum: number;

        private spanGas: HTMLElement;
        private spanSgas: HTMLElement;

        private walletLists: Array<walletLists>;
        private divLists: HTMLDivElement;
        private divListsMore: HTMLElement;
        private divNetSelect: HTMLElement;

        private getWalletListsTimeout: number;
        private WalletListsNeedConfirm: boolean;
        walletListsNeedConfirmCounts: number;
        private WalletListsHashString: string;

        private s_doGetWalletLists: any;

        reset() {
            this.gas = 0;
            this.sgas = 0;

            this.walletLists = new Array();
            this.listPageNum = 10;

            this.getWalletListsTimeout = 3000;
            this.WalletListsNeedConfirm = false;
            this.WalletListsHashString = "";
            
            this.walletListsNeedConfirmCounts = 0;

            this.clearTimeout()
        }

        start() {
            super.start()
            // 调用登录回调
            Main.loginCallback()

            // 登录完成后最小化
            // Main.viewMgr.mainView.hidden()
            // Main.viewMgr.change("IconView")
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_pay")

            //钱包标题
            var headerTitle = this.objCreate("div")
            headerTitle.classList.add("pc_header")
            this.ObjAppend(this.div, headerTitle)

            // 我的信息
            var myinfo_a = this.objCreate("a")
            myinfo_a.classList.add("iconfont", "icon-touxiang")
            myinfo_a.onclick = () => {
                this.hidden()
                MyInfoView.refer = "PayView"
                Main.viewMgr.change("MyInfoView")
            }
            this.ObjAppend(headerTitle, myinfo_a)

            // 钱包标题
            var headerh1 = this.objCreate("h1")
            headerh1.textContent = Main.platName;
            this.ObjAppend(headerTitle, headerh1)

            //切换网络
            var divNetType = this.objCreate("div")
            divNetType.classList.add("pc_net", "iconfont")
            divNetType.textContent = this.getNetTypeName() //Main.langMgr.get("nettype_" + Main.netMgr.type)
            divNetType.onclick = () => {
                this.showChangeNetType()
            }
            this.ObjAppend(headerTitle, divNetType)

            this.divNetSelect = this.objCreate("div")
            this.divNetSelect.classList.add("pc_netbox")
            this.ObjAppend(headerTitle, this.divNetSelect)

            // 钱包卡片
            var paycard = this.objCreate("div")
            paycard.classList.add("pc_card")
            this.ObjAppend(this.div, paycard)

            //我的钱包
            var payMyWallet = this.objCreate("div")
            payMyWallet.classList.add("pc_mywallet","iconfont","icon-qianbao")
            payMyWallet.textContent =  Main.user.info.name // "昵称"
            this.ObjAppend(paycard, payMyWallet)

            //刷新
            var payRefresh = this.objCreate("a")
            payRefresh.classList.add("iconfont")
            payRefresh.innerHTML = Main.langMgr.get("pay_refresh") //"刷新&#xe604;"
            payRefresh.onclick = () => {
                this.doGetBalances()
                this.doGetWalletLists()
            }
            this.ObjAppend(payMyWallet, payRefresh)

            // 我的(缩略)钱包地址
            var divWallet = this.objCreate("div")
            divWallet.classList.add("pc_cardcon")
            divWallet.textContent = Main.user.info.wallet.substr(0, 4) + "****" + Main.user.info.wallet.substr(Main.user.info.wallet.length - 4)
            this.ObjAppend(paycard, divWallet)



            // 详情
            var divWalletDetail=this.objCreate("div")
            divWalletDetail.classList.add("pc_carddetail")
            this.ObjAppend(paycard, divWalletDetail)

            var spanWalletDetail = this.objCreate("span")
            spanWalletDetail.classList.add("iconfont")
            spanWalletDetail.innerHTML = Main.langMgr.get("pay_wallet_detail") // "详情&#xe605;"
            spanWalletDetail.onclick = () => {
                this.wallet_detail()
            }
            this.ObjAppend(divWalletDetail, spanWalletDetail)

            
            //收款及转账
            var divWalletUser = this.objCreate("div")
            divWalletUser.classList.add("pc_cardtransaction")
            // divWalletUser.textContent = Main.user.info.name
            this.ObjAppend(paycard, divWalletUser)

            // 收款
            var butReceivables = this.objCreate("button")
            butReceivables.textContent = Main.langMgr.get("pay_received") //"收款"
            butReceivables.onclick = () => {
                this.doMakeReceivables()
            }
            this.ObjAppend(divWalletUser, butReceivables)

            // 转账
            var makeTransferObj = this.objCreate("button")
            makeTransferObj.textContent = Main.langMgr.get("pay_transfer") //"转账"
            makeTransferObj.onclick = () => {
                this.doMakeTransfer()
            }
            this.ObjAppend(divWalletUser, makeTransferObj)


            //
            var divCurrency = this.objCreate("div")
            divCurrency.classList.add("pc_currency")
            this.ObjAppend(this.div, divCurrency)


            // 代币
            var divCurrencyNumber = this.objCreate("div")
            divCurrencyNumber.classList.add("pc_currencynumber")
            this.ObjAppend(divCurrency, divCurrencyNumber)
            var spanCurrencyNumber= this.objCreate("span")
            spanCurrencyNumber.innerText = Main.langMgr.get("pay_coin_name") //"代币"
            this.ObjAppend(divCurrencyNumber, spanCurrencyNumber)


            // NEOGas余额
            var divGas = this.objCreate("div")
            divGas.innerHTML = Main.langMgr.get("pay_gas")//"Gas"
            this.ObjAppend(divCurrency, divGas)

            var labelGas = this.objCreate("label") 
            labelGas.classList.add("iconfont", "icon-help")
            this.ObjAppend(divGas, labelGas)


            this.spanGas = this.objCreate("span")
            this.spanGas.textContent = "0"
            this.ObjAppend(divGas, this.spanGas)

            var divSGascon = this.objCreate("div") 
            divSGascon.classList.add("pc_sgascon")
            divSGascon.textContent = Main.langMgr.get("pay_gas_desc") // "GAS是NEO链上的数字货币，可以通过交易所获取"
            this.ObjAppend(labelGas, divSGascon)

            // SGas余额
            var divSGas = this.objCreate("div")
            divSGas.innerHTML = Main.langMgr.get("pay_sgas") // "SGas"
            this.ObjAppend(divCurrency, divSGas)

            var labelSGas = this.objCreate("label")
            labelSGas.classList.add("iconfont", "icon-help")
            this.ObjAppend(divSGas, labelSGas)


            this.spanSgas = this.objCreate("span")
            this.spanSgas.textContent = "0"
            this.ObjAppend(divSGas, this.spanSgas)

            var divSGascon = this.objCreate("div")
            divSGascon.classList.add("pc_sgascon")
            divSGascon.textContent = Main.langMgr.get("pay_sgas_desc") //"SGas是Bla Cat提供给玩家消费用的通用筹码"
            this.ObjAppend(labelSGas, divSGascon)



            // 提现
            var makeRefundObj = this.objCreate("button")
            makeRefundObj.textContent = Main.langMgr.get("pay_refund") //"提现"
            makeRefundObj.onclick = () => {
                this.doMakeRefund()
            }
            this.ObjAppend(divGas, makeRefundObj)





            // 兑换
            var makeMintTokenObj = this.objCreate("button")
            makeMintTokenObj.textContent = Main.langMgr.get("pay_makeMint") //"兑换"
            makeMintTokenObj.onclick = () => {
                this.doMakeMintToken()
            }
            this.ObjAppend(divSGas, makeMintTokenObj)



            // 钱包记录
            this.divLists = this.objCreate("ul") as HTMLDivElement
            this.divLists.classList.add("pc_paylists")
            this.ObjAppend(this.div, this.divLists)



            this.doGetBalances()
            this.doGetWalletLists()
        }

        update() {
            var isHidden = this.isHidden();
            this.reset()
            super.update()
            if (isHidden) this.hidden()
        }

        clearTimeout() {
            if (this.s_doGetWalletLists) clearTimeout(this.s_doGetWalletLists)
        }

        async doGetBalances() {
            tools.CoinTool.initAllAsset();

            // 获得balance列表(gas)
            var balances = (await tools.WWW.api_getBalance(Main.user.info.wallet)) as tools.BalanceInfo[];
            var nep5balances = await tools.WWW.api_getnep5balanceofaddress(tools.CoinTool.id_SGAS, Main.user.info.wallet);

            if (balances) {
                //余额不唯空
                balances.map(item => (item.names = tools.CoinTool.assetID2name[item.asset])); //将列表的余额资产名称赋值
                await balances.forEach(
                    // 取GAS余额
                    balance => {
                        if (balance.asset == tools.CoinTool.id_GAS) {
                            this.gas = balance.balance;
                            // 判断一下有没有减号，不用科学计数法表示
                            var balanceAmount = balance.balance.toString();
                            if (balanceAmount.toString().indexOf('-') >= 0) {
                                balanceAmount = '0' + String(Number(balanceAmount) + 1).substr(1);
                            }
                            this.spanGas.textContent = balanceAmount;
                        }
                    }
                );
            }
            else {
                this.gas = 0;
                this.spanGas.textContent = "0";
            }

            // 获取sgas余额
            if (nep5balances) {
                this.sgas = nep5balances[0]['nep5balance'];
                this.spanSgas.textContent = nep5balances[0]['nep5balance'].toString();
            }
            else {
                this.sgas = 0;
                this.spanSgas.textContent = "0";
            }
        }

        private async doMakeMintToken() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开输入数量
                ViewTransCount.refer = "PayView"
                ViewTransCount.callback = () => {
                    this.makeMintTokenTransaction()
                }
                Main.viewMgr.change("ViewTransCount")
                // this.hidden()
                document.getElementById("pc_transfertype").innerHTML = "Gas  &#xe6a8; SGas"


            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doMakeMintToken()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private async doMakeRefund() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开输入数量
                ViewTransCount.refer = "PayView"
                ViewTransCount.callback = () => {
                    this.makeRefundTransaction()
                }
                Main.viewMgr.change("ViewTransCount")
                // this.hidden()
                document.getElementById("pc_transfertype").innerHTML = "SGas &#xe6a8; Gas"


            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doMakeRefund()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private divLists_recreate() {
            this.divLists.innerHTML = "";
            var liRecord = this.objCreate("li")
            liRecord.classList.add("pc_payrecord")
            // liRecord.innerText = Main.langMgr.get("pay_recentLists") //"近期记录"
            this.ObjAppend(this.divLists, liRecord)
            
            var spanRecord=this.objCreate("span")
            spanRecord.innerText = Main.langMgr.get("pay_recentLists") //"近期记录"
            this.ObjAppend(liRecord, spanRecord)

            // 更多钱包记录
            this.divListsMore = this.objCreate("button")
            this.divListsMore.classList.add("pc_paymore")
            this.divListsMore.textContent = Main.langMgr.get("more") // "更多"

            this.divListsMore.onclick = () => {
                this.hidden()
                Main.viewMgr.change("PayListMoreView")
            }
            this.divListsMore.style.display = "none"
            this.ObjAppend(liRecord, this.divListsMore)

        }

        async doGetWalletLists(isFromTimeout = 0) {
            console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, isFromTimeout => ', isFromTimeout)
            if (!Main.user.info.token) {
                console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 已退出登录，本次请求取消')
                return;
            }

            if (isFromTimeout == 0 && this.WalletListsNeedConfirm) {
                // 外部调用获取交易列表，当前又有待确认交易，取消本次查询，等待定时器自动刷新交易列表
                console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 有定时刷新，本次请求取消')
                return;
            }

            var res = await ApiTool.getWalletListss(Main.user.info.uid, Main.user.info.token, 1, this.listPageNum, Main.netMgr.type);

            if (res.r) {
                if (res.data && res.data.length > 0) {
                    Main.walletLogId = Number(res.data[0].id);
                    if (Main.walletLogId < Main.appWalletLogId || Main.walletLogId < Main.platWalletLogId) {
                        // 钱包记录数据不全，重新获取
                        console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 钱包记录要重新获取 ..')
                        this.doGetWalletLists(1);
                        return;
                    }

                    // 有无待确认交易，有的话，要重新获取
                    var hasNeedConfirm = false; // 是否有待确认的记录
                    this.walletListsNeedConfirmCounts = 0;
                    await res.data.forEach(
                        list => {
                            // WalletListsHashString_tmp += "[" + list.id + "_" + list.state + "]";
                            // 判断有没有待确认记录
                            if (list.state == '0') {
                                hasNeedConfirm = true;
                                this.walletListsNeedConfirmCounts += 1;
                            }
                            else if (list.type == "2") {
                                // 平台sgas->gas，特殊处理下
                                if (list.client_notify == "0") {
                                    this.walletListsNeedConfirmCounts += 1;
                                }
                            }
                        }
                    )
                    this.WalletListsNeedConfirm = hasNeedConfirm;
                    Main.viewMgr.iconView.flushProcess(this.walletListsNeedConfirmCounts)

                    if (this.WalletListsNeedConfirm) {
                        console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 有待确认交易，轮询查询')
                        // 有待确认，自己加刷新
                        this.s_doGetWalletLists = setTimeout(() => { this.doGetWalletLists(1) }, this.getWalletListsTimeout);
                    }

                    var WalletListsHashString_tmp: string = JSON.stringify(res.data); // 记录hash  
                    if (WalletListsHashString_tmp == this.WalletListsHashString) {
                        console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 交易记录没有更新 ..')
                        return;
                    }

                    // 交易记录有更新
                    console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 交易记录有更新')
                    // console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, WalletListsHashString_tmp => ', WalletListsHashString_tmp)
                    // console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, WalletListsHashString => ', this.WalletListsHashString)

                    // 是否第一次显示
                    var isFirstShow = false;
                    if (this.WalletListsHashString == "") {
                        // 是第一次显示
                        isFirstShow = true;
                    }
                    this.WalletListsHashString = WalletListsHashString_tmp;

                    if (!isFirstShow) {
                        // 第一次显示获取的余额已经是最新的了，不用再次刷新
                        console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 交易记录有更新，刷新余额')
                        this.doGetBalances()
                    }

                    // 清理原始数据显示
                    this.divLists_recreate()

                    if (res.data && res.data.length == this.listPageNum) {
                        // 要显示更多按钮
                        this.divListsMore.style.display = ""
                    }

                    await res.data.forEach(
                        list => {

                            // li
                            var listObj = this.objCreate("li")
                            listObj.onclick = () => {
                                this.hidden()
                                PayListDetailView.refer = "PayView"
                                PayListDetailView.list = list;
                                Main.viewMgr.change("PayListDetailView")
                            }

                            // img
                            var img_div = this.objCreate("div")
                            img_div.classList.add("pc_listimg")
                            var img = this.objCreate("img") as HTMLImageElement
                            img.src = this.getListImg(list)
                            this.ObjAppend(img_div, img)
                            this.ObjAppend(listObj, img_div)

                            // appname & date
                            var content_div = this.objCreate("div")
                            content_div.classList.add("pc_liftinfo")

                            var content_name_div = this.objCreate("div")
                            content_name_div.classList.add("pc_listname")
                            content_name_div.textContent = this.getListName(list)
                            this.ObjAppend(content_div, content_name_div)


                            //合约方法
                            var content_ctm_p = this.objCreate("p")
                            content_ctm_p.classList.add("pc_method")
                            content_ctm_p.textContent = this.getListParamMethods(list)
                            this.ObjAppend(content_div, content_ctm_p)

                            this.ObjAppend(listObj, content_div)

                            // cnts & state

                            var state_cnts_div = this.objCreate("div")
                            state_cnts_div.classList.add("pc_cnts")

                            //时间
                            var content_ctm_span = this.objCreate("div")
                            content_ctm_span.classList.add("pc_listdate", "listCtm") // listCtm不要随便修改，后面刷新时间(flushListCtm)用到了这个class
                            content_ctm_span.textContent = this.getListCtmMsg(list)
                            content_ctm_span.setAttribute("ctm", list.ctm)
                            this.ObjAppend(state_cnts_div, content_ctm_span)

                            var cnts = this.getListCnts(list)
                            if (cnts) {
                                this.ObjAppend(state_cnts_div, cnts);

                                var cnts_class = this.getListCntsClass(list);
                                if (cnts_class) state_cnts_div.classList.add(cnts_class)
                            }

                            var state = this.getListState(list);
                            if (state) this.ObjAppend(state_cnts_div, state)

                            this.ObjAppend(listObj, state_cnts_div)


                            this.ObjAppend(this.divLists, listObj)
                        }
                    );

                }
            }
            else {
                Main.showErrCode(res.errCode)
            }

        }

        getListImg(v) {
            if (v.state == "0") {
                // 未确认，统一返回未确认图标
                return Main.resHost + "res/img/transconfirm.png";
            }

            switch (v.type) {
                case "1": // gas->sgas
                case "2": // sgas->gas
                case "3": // sgas充值到游戏
                case "4": // game->sgas退款
                    return Main.resHost + "res/img/sgas.png";
                case "5": // 游戏交易
                    // 判断params里面是否有sgas合约，有的话标记成sgas图标
                    try {
                        var params = JSON.parse(v.params)
                        if (params.hasOwnProperty("nnc")) {
                            params = [params]
                        }
                        if (params instanceof Array) {
                            var nncs = new Array();
                            for (let k in params) {
                                if (params[k].hasOwnProperty('nnc') && params[k].nnc == tools.CoinTool.id_SGAS) {
                                    return Main.resHost + "res/img/sgas.png";
                                }
                            }
                        }
                    }
                    catch (e) {

                    }
                    return v.icon;
                case "6": // gas转账
                    // 显示gas图标
                    return Main.resHost + "res/img/gas.png";
                default:
                    // 默认
                    return Main.resHost + "res/img/game0.png";
            }
        }

        getListName(v) {
            if (v.g_id == "0") {
                return Main.platName;
            }
            else {
                // console.log('[Bla Cat]', '[PayView]', 'v.name => ', v.name)
                try {
                    var nameObj = JSON.parse(v.name)
                    if (nameObj.hasOwnProperty(Main.langMgr.type)) {
                        return nameObj[Main.langMgr.type]
                    }
                    else if (nameObj.hasOwnProperty("cn")) {
                        return nameObj.cn;
                    }
                }
                catch(e) {
                    // return v.name;
                }
            }
            return v.name;
        }

        getListCtm(v) {
            return Main.getDate(v.ctm)
        }

        getListCtmMsg(v) {
            var str = "";

            var timestamp = (new Date()).getTime();
            var ts = Math.round(timestamp / 1000);
            var last = ts - Number(v.ctm)

            var year = 60 * 60 * 24 * 365;
            var month = 60 * 60 * 24 * 30;
            var day = 60 * 60 * 24;
            var hour = 60 * 60;
            var minute = 60;

            if (last >= year) {
                var n = Math.floor(last / year);
                return Main.langMgr.get("paylist_ctm_year", { "year": n })
                // return n.toString() + "年前"
            }
            else if (last >= month) {
                var n = Math.floor(last / month);
                return Main.langMgr.get("paylist_ctm_month", { "month": n })
                // return n.toString() + "月前"
            }
            else if (last >= day) {
                var n = Math.floor(last / day);
                return Main.langMgr.get("paylist_ctm_day", { "day": n })
                // return n.toString() + "天前"
            }
            else if (last >= hour) {
                var n = Math.floor(last / hour);
                return Main.langMgr.get("paylist_ctm_hour", { "hour": n })
                // return n.toString() + "小时前"
            }
            else if (last >= minute) {
                var n = Math.floor(last / minute);
                return Main.langMgr.get("paylist_ctm_minute", { "minute": n })
                // return n.toString() + "分钟前"
            }
            else if (last >= 0) {
                return Main.langMgr.get("paylist_ctm_recent")
                // return "刚才"
            }
            else {
                // 负数？和服务器时间有差别，也返回刚才
                return Main.langMgr.get("paylist_ctm_recent")
                // return "刚才"
            }
        }

        getListParamMethods(v) {
            try {
                var params = JSON.parse(v.params)
                if (params.hasOwnProperty("sbPushString")) {
                    params = [params]
                }
                if (params instanceof Array) {
                    var method = new Array();
                    for (let k in params) {
                        if (params[k].hasOwnProperty("sbPushString")) {
                            method.push(params[k].sbPushString)
                        }
                    }
                    if (method.length > 1) {
                        return method[0] + ', ...';
                    }
                    else {
                        return method.toString()
                    }
                }
            }
            catch (e) {

            }
            return Main.langMgr.get("paylist_sbPushString_none")
        }

        getListCnts(v) {
            if (v.cnts && Number(v.cnts) != 0) {
                var state_cnts_span = this.objCreate("span")
                state_cnts_span.textContent = v.cnts
                return state_cnts_span;
            }
        }

        getListCntsClass(v) {
            if (v.type == "1" || (v.type == "5" && v.type_detail == "2")) {
                return 'pc_income';
            }
            else if (Number(v.cnts) > 0) {
                return 'pc_expenditure';
            }
            return "";
        }

        getListState(v) {
            var state = v.state;
            var pct = "50%"; // 只有state=0才生效
            var i = 1; // 只有state=0生效，=1转圈；=2感叹号

            if (v.type == "2") {
                pct = "25%"
                // 退款请求，特殊处理
                if (v.state == "1") {
                    state = '0';
                    pct = '50%'

                    if (v.ext != "") {
                        state = '0';
                        pct = "75%"
                        if (v.client_notify == "1") {
                            state = '1';
                        }
                    }
                    else {
                        // 判断是否开启钱包，钱包未开启，需要感叹号表示
                        if (!Main.isWalletOpen()) {
                            i = 2;
                        }
                    }
                }
            }

            switch (state) {
                case '0':
                    var state_button0 = this.objCreate("div")
                    state_button0.classList.add("pc_verification")
                    if (i == 1) {
                        state_button0.classList.add("iconfont", "icon-dengdai")
                        state_button0.innerHTML = "<label>" + pct + "</label>"
                    } else {
                        // 感叹号
                        var obja = this.objCreate("a")
                        obja.classList.add("iconfont", "icon-jinhangzhong")
                        obja.innerHTML = '<label>' + pct + '</label>';
                        obja.onclick = () => {
                            Main.continueRefund()
                            event.stopPropagation();
                        }
                        //state_button0.innerHTML = "<a class='iconfont icon-gantanhao'><label>"+pct+"</label></a>"
                        this.ObjAppend(state_button0, obja);
                    }

                    return state_button0;
                case '1':
                    var state_a1 = this.objCreate("a")
                    state_a1.classList.add("iconfont", "icon-gou")
                    return state_a1;
                case '2':
                    var state_a2 = this.objCreate("a")
                    state_a2.classList.add("iconfont", "icon-chacha")
                    return state_a2;
            }
        }

        private wallet_detail() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开详情页
                PayWalletDetailView.refer = "PayView"
                Main.viewMgr.change("PayWalletDetailView")
                this.hidden()

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.wallet_detail()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        // gas -> sgas
        private async makeMintTokenTransaction() {
            Main.viewMgr.change("ViewLoading")

            var mintCount = Main.viewMgr.viewTransCount.inputCount.value;
            console.log('[Bla Cat]', '[PayView]', '充值sgas，数量 => ', mintCount)

            var login = tools.LoginInfo.getCurrentLogin();

            try {
                var utxos_assets = await tools.CoinTool.getassets();
                console.log('[Bla Cat]', '[PayView]', 'utxos_assets => ', utxos_assets)

                var scriptaddress = tools.CoinTool.id_SGAS.hexToBytes().reverse();
                var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                var makeTranRes: Result = tools.CoinTool.makeTran(
                    utxos_assets,
                    nepAddress,
                    tools.CoinTool.id_GAS,
                    Neo.Fixed8.fromNumber(Number(mintCount))
                );
            } catch (e) {
                Main.viewMgr.viewLoading.remove()
                let errmsg = Main.langMgr.get(e.message);
                if (errmsg) {
                    Main.showErrMsg((e.message)); // "GAS余额不足"
                }
                else {
                    Main.showErrMsg(("pay_makeMintGasNotEnough"))
                }

                return;
            }

            var sb = new ThinNeo.ScriptBuilder();
            //Parameter inversion
            sb.EmitParamJson([]); //Parameter list
            sb.EmitPushString("mintTokens"); //Method
            sb.EmitAppCall(scriptaddress); //Asset contract

            var tran: any = makeTranRes.info.tran;
            var oldarr = makeTranRes.info.oldarr;

            tran.type = ThinNeo.TransactionType.InvocationTransaction;
            tran.extdata = new ThinNeo.InvokeTransData();
            tran.extdata.script = sb.ToArray();
            tran.extdata.gas = Neo.Fixed8.fromNumber(1.0);

            var msg = tran.GetMessage();
            var signdata = ThinNeo.Helper.Sign(msg, login.prikey);
            tran.AddWitness(signdata, login.pubkey, login.address);

            var txid = tran.GetHash().clone().reverse().toHexString();

            var data = tran.GetRawData();
            var r = await tools.WWW.api_postRawTransaction(data);
            if (r) {
                if (r["txid"]) {
                    // 成功，上报
                    var logRes = await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        r["txid"],
                        "0",
                        mintCount,
                        "1",
                        '{"sbParamJson":"[]", "sbPushString": "mintTokens", "nnc": "' + tools.CoinTool.id_SGAS + '"}',
                        Main.netMgr.type
                    );
                    // if (logRes.r)
                    // {
                    //     Main.platWalletLogId = parseInt(logRes.data);
                    // }

                    // 记录使用的utxo，后面不再使用，需要记录高度
                    var height = await tools.WWW.api_getHeight();
                    oldarr.map(old => old.height = height);
                    tools.OldUTXO.oldutxosPush(oldarr);

                    // 重新获取记录
                    Main.viewMgr.viewLoading.remove()
                    this.doGetWalletLists();

                    // TODO: 更新记录状态
                    //this.makeMintTokenTransaction_confirm(txid);
                    // mui.toast('充值成功！请稍候查询交易状态！')
                } else {
                    // 失败
                    Main.viewMgr.viewLoading.remove()
                    // Main.showErrMsg(
                    //     "充值[" +
                    //     mintCount +
                    //     "]sgas失败！" +
                    //     "\r\n充值合约执行失败！\r\n" +
                    //     "请等待上次充值确认后再操作！"
                    // );
                    Main.showErrMsg(("pay_makeMintDoFail"))
                }
            } else {
                // 失败
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg(
                //     "充值[" +
                //     mintCount +
                //     "]sgas失败！" +
                //     "\r\n发送充值请求失败！请检查网络，稍候重试！"
                // );
                Main.showErrMsg(("pay_makeMintDoFail2"))
            }
        }

        // sgas -> gas
        private async makeRefundTransaction() {
            Main.viewMgr.change("ViewLoading")

            var refundCount = Main.viewMgr.viewTransCount.inputCount.value;

            // 查询SGAS余额
            var scriptaddress = tools.CoinTool.id_SGAS.hexToBytes().reverse();

            var login = tools.LoginInfo.getCurrentLogin();

            //获取sgas合约地址的资产列表
            var utxos_assets = await tools.CoinTool.getsgasAssets();
            var us = utxos_assets[tools.CoinTool.id_GAS];
            if (us == undefined) {
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg("Sgas余额不足");
                Main.showErrMsg(("pay_makeRefundSgasNotEnough"))
                return;
            }

            console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, us.before => ', us);

            //检查sgas地址拥有的gas的utxo是否有被标记过
            for (var i = us.length - 1; i >= 0; i--) {
                if (us[i].n > 0) {
                    continue;
                }

                let script = null;

                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson(["(hex256)" + us[i].txid.toString()]);
                sb.EmitPushString("getRefundTarget");
                sb.EmitAppCall(scriptaddress);

                script = sb.ToArray();

                var data = sb.ToArray();
                var r = await tools.WWW.rpc_getInvokescript(data);
                if (r) {
                    var stack = r["stack"];
                    var value = stack[0]["value"].toString();
                    if (value.length > 0) {
                        console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, us[' + i + '].delete => ', us[i]);
                        delete us[i];
                    }
                }
            }

            console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, us.after => ', us);

            // 生成交易请求

            //sgas 自己给自己转账   用来生成一个utxo  合约会把这个utxo标记给发起的地址使用
            try {
                var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                var makeTranRes: Result = tools.CoinTool.makeTran(
                    utxos_assets,
                    nepAddress,
                    tools.CoinTool.id_GAS,
                    Neo.Fixed8.fromNumber(Number(refundCount))
                );
            } catch (e) {
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg("SGAS余额不足");
                Main.showErrMsg(("pay_makeRefundSgasNotEnough"))
                return;
            }

            console.log(
                "[Bla Cat]", "[payView]", "makeRefundTransaction, makeTranRes => ",
                makeTranRes
            );

            var r = await tools.WWW.api_getcontractstate(tools.CoinTool.id_SGAS);
            if (r && r["script"]) {
                var sgasScript = r["script"].hexToBytes();

                var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(
                    login.address
                );

                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson(["(bytes)" + scriptHash.toHexString()]);
                sb.EmitPushString("refund");
                sb.EmitAppCall(scriptaddress);

                var tran: any = makeTranRes.info.tran;
                var oldarr: Array<tools.OldUTXO> = makeTranRes.info.oldarr;

                tran.type = ThinNeo.TransactionType.InvocationTransaction;
                tran.extdata = new ThinNeo.InvokeTransData();
                tran.extdata.script = sb.ToArray();

                //附加鉴证
                tran.attributes = new Array<ThinNeo.Attribute>(1);
                tran.attributes[0] = new ThinNeo.Attribute();
                tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                tran.attributes[0].data = scriptHash;

                var wsb = new ThinNeo.ScriptBuilder();
                wsb.EmitPushString("whatever");
                wsb.EmitPushNumber(new Neo.BigInteger(250));
                tran.AddWitnessScript(sgasScript, wsb.ToArray());

                //做提款人的签名
                var signdata = ThinNeo.Helper.Sign(tran.GetMessage(), login.prikey);
                tran.AddWitness(signdata, login.pubkey, login.address);

                var txid = tran.GetHash().clone().reverse().toHexString();

                var trandata = tran.GetRawData();

                console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, tran => ', tran);

                // 发送交易请求

                r = await tools.WWW.api_postRawTransaction(trandata);

                if (r) {
                    if (r.txid) {
                        var paramJson_tmp = "(bytes)" + scriptHash.toHexString();
                        // 上报钱包操作记录
                        var logRes = await ApiTool.addUserWalletLogs(
                            Main.user.info.uid,
                            Main.user.info.token,
                            r.txid,
                            "0",
                            refundCount,
                            "2",
                            '{"sbParamJson":"' + paramJson_tmp + '", "sbPushString": "refund", "nnc": "' + tools.CoinTool.id_SGAS + '"}',
                            Main.netMgr.type
                        );
                        if (logRes.r) {
                            Main.platWalletLogId = parseInt(logRes.data);
                        }

                        // 记录使用的utxo，后面不再使用，需要记录高度
                        var height = await tools.WWW.api_getHeight();
                        oldarr.map(old => old.height = height);
                        tools.OldUTXO.oldutxosPush(oldarr);

                        // 等待交易确认
                        // this.makeRefundTransaction_confirm(r["txid"], refundCount);

                        // 刷新钱包记录，显示当前交易信息
                        Main.viewMgr.viewLoading.remove()
                        this.doGetWalletLists()

                    } else {
                        Main.viewMgr.viewLoading.remove()
                        // Main.showErrMsg("提取合约执行失败！请等待上个提现或兑换交易完成再操作！");
                        Main.showErrMsg(("pay_makeRefundDoFail"))
                    }
                    console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, api_postRawTransaction结果 => ', r);

                }
                else {
                    Main.viewMgr.viewLoading.remove()
                    // Main.showErrMsg("发送提取交易失败！请检查网络，稍候重试！");
                    Main.showErrMsg(("pay_makeRefundDoFail2"))
                }
            }
            else {
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg("获取提取合约失败！");
                Main.showErrMsg(("pay_makeRefundGetScriptFail"))
            }
        }

        //收款
        private async doMakeReceivables() {
            Main.viewMgr.change("PayReceivablesView")
        }


        //转账
        private async doMakeTransfer() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开转账页
                PayTransferView.refer = "PayView"
                PayTransferView.callback = () => {
                    this.doGetWalletLists()
                }
                Main.viewMgr.change("PayTransferView")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doMakeTransfer()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        flushListCtm()
        {
            var ctms = document.getElementsByClassName("listCtm")
            if (ctms && ctms.length > 0) {
                for (let k=0; k<ctms.length; k++) {
                    var list = {
                        ctm: ctms[k].getAttribute("ctm")
                    }
                    ctms[k].textContent = this.getListCtmMsg(list)
                }
            }
        }

        private getNetTypeName() {
            return Main.langMgr.get("pay_nettype_" + Main.netMgr.type);
        }

        private showChangeNetType() {
            if (this.divNetSelect.innerHTML.length > 0) {
                this.divNetSelect.innerHTML = "";
            }
            else {
                var other = Main.netMgr.getOtherTypes()
                for (let i = 0; i<other.length; i++) {
                    this.ObjAppend(this.divNetSelect, this.getDivNetSelectType(other[i]))
                }
            }
        }

        private getDivNetSelectType(type:number) {
            var divObj = this.objCreate("div")
            divObj.textContent = Main.langMgr.get("pay_nettype_"+type)
            divObj.onclick = () => {
                Main.changeNetType(type)
            }
            return divObj;
        }

    }
}