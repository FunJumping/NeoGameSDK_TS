/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 钱包视图
    export class PayView extends ViewBase {

        // === 种类
        static tokens: Array<string> = ["blacat", "neo", "other"]
        // === 币种
        static tokens_coin: Array<Array<string>> = [
            ["bct", "bcp"],
            ["gas", "cgas", "neo", "cneo"],
            ["btc", "eth"],
        ]
        // === 老币种
        static tokens_old: Object = {
            neo: ["cgas", "cneo"],
        }

        // 钱包地址
        wallet_addr: string
        wallet_addr_other: any

        // 各种币
        // === blacat
        bct: number;
        bcp: number;
        // === neo
        gas: number;
        cgas: number;
        neo: number;
        cneo: number;
        // === other
        btc: number
        eth: number

        // cli高度
        height_clis: number;
        private divHeight_clis: HTMLElement;
        height_nodes: number;
        private divHeight_nodes: HTMLElement;

        // 记录每页显示数量
        listPageNum: number;

        // 钱包记录
        private walletListsHash: string;


        private divLists: HTMLDivElement;
        private divListsMore: HTMLElement;
        private divNetSelect: HTMLElement;

        private getWalletListsTimeout: number;
        private getWalletListsTimeout_min: number;
        private WalletListsNeedConfirm: boolean;

        private s_doGetWalletLists: any;

        private wallet_btn: HTMLElement;
        private assets_btn: HTMLElement;

        private game_assets_element: HTMLElement // 游戏assets视图
        private game_assets: any    // 游戏assets信息
        private game_assets_ts: any // 游戏assets获取时间
        private game_assets_update: number  // game_assets缓存时间
        private allnep5_balance: any // 所有nep5资产余额

        private pendingListsElement: HTMLElement; // 正在处理的记录

        reset() {

            // 数量归零
            PayView.tokens_coin.forEach((coins) => {
                coins.forEach((coin) => {
                    this[coin] = 0
                })
            })
            // 旧合约数量归零
            for (let token in PayView.tokens_old) {
                PayView.tokens_old[token].forEach((coin) => {
                    if (tools.CoinTool["id_" + coin.toUpperCase() + "_OLD"].length > 0) {
                        tools.CoinTool["id_" + coin.toUpperCase() + "_OLD"].forEach((old) => {
                            this[coin + "_old" + old] = 0
                            this["span" + coin.toUpperCase() + "_OLD" + old] = null
                        })
                    }
                })
            }
            
            // 高度归零
            this.height_clis = 0;
            this.height_nodes = 0;

            this.listPageNum = 10;
            this.walletListsHash = null

            this.getWalletListsTimeout = 20000; // 15s出块，所以最小间隔20s
            this.getWalletListsTimeout_min = 10000; // 在>1个块时间并且<3个出块时间内，最小时间
            this.WalletListsNeedConfirm = false;

            this.game_assets_update = 1000 * 5; // 5s缓存
            this.allnep5_balance = {}
            this.game_assets_ts = null

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
            this.div.classList.add("pc_bj", "pc_pay")

            //钱包标题
            var headerTitle = this.objCreate("div")
            headerTitle.classList.add("pc_header")
            this.ObjAppend(this.div, headerTitle)

            // 我的信息
            var myinfo_a = this.objCreate("a")
            myinfo_a.classList.add("iconfont", "icon-bc-touxiang")
            myinfo_a.onclick = () => {
                this.hidden()
                PersonalCenterView.refer = "PayView"
                Main.viewMgr.change("PersonalCenterView")
            }
            this.ObjAppend(headerTitle, myinfo_a)

            // nodes高度
            this.divHeight_nodes = this.objCreate("div")
            this.divHeight_nodes.classList.add("pc_payheighet", "iconfont", "icon-bc-blalian", "network")
            this.divHeight_nodes.style.top = "5px";
            this.divHeight_nodes.textContent = "n/a"
            this.divHeight_nodes.onclick = () => {
                this.hidden()
                ModifyNetworkLineView.refer = "PayView"

                ModifyNetworkLineView.defaultType = "nodes"
                Main.viewMgr.change("ModifyNetworkLineView")
            }
            this.ObjAppend(headerTitle, this.divHeight_nodes)

            // clis高度
            this.divHeight_clis = this.objCreate("div")
            this.divHeight_clis.classList.add("pc_payheighet", "iconfont", "icon-bc-neolian", "network")
            this.divHeight_clis.textContent = "n/a"
            this.divHeight_clis.onclick = () => {
                if (tools.WWW.api_clis && tools.WWW.api_clis != "") {
                    this.hidden()
                    ModifyNetworkLineView.refer = "PayView"

                    ModifyNetworkLineView.defaultType = "clis"
                    Main.viewMgr.change("ModifyNetworkLineView")
                }
            }
            this.ObjAppend(headerTitle, this.divHeight_clis)



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

            //返回游戏
            var aReturnGame = this.objCreate("i")
            aReturnGame.classList.add("pc_returngame", "iconfont", "icon-bc-fanhui1")
            aReturnGame.onclick = () => {
                BlackCat.SDK.showIcon()
            }
            if (!window.hasOwnProperty("BC_androidSDK")) {
                this.ObjAppend(headerTitle, aReturnGame)
            }

            // 钱包、虚拟资产按钮
            var btnbox = this.objCreate("div")
            this.ObjAppend(this.div, btnbox)
            btnbox.classList.add("pc_btnbox")
            // 钱包按钮
            this.wallet_btn = this.objCreate("button")
            this.wallet_btn.textContent = Main.langMgr.get("pay_walletbtn")
            this.wallet_btn.classList.add("pc_active")
            this.ObjAppend(btnbox, this.wallet_btn);
            this.wallet_btn.onclick = () => {
                this.game_assets_element.style.display = "none"
                paycard.style.display = "block"
                divCurrency.style.display = "block"
                this.divLists.style.display = "block"
                this.assets_btn.classList.remove("pc_active")
                this.wallet_btn.classList.add("pc_active")
            }
            // 虚拟资产
            this.assets_btn = this.objCreate("button")
            this.assets_btn.textContent = Main.langMgr.get("pay_assets")
            this.ObjAppend(btnbox, this.assets_btn);
            this.assets_btn.onclick = () => {
                this.game_assets_element.style.display = "block"
                paycard.style.display = "none"
                divCurrency.style.display = "none"
                this.divLists.style.display = "none"
                this.assets_btn.classList.add("pc_active")
                this.wallet_btn.classList.remove("pc_active")

                this.my_asset()
            }

            // 虚拟资产div
            // this.game_assets_element = this.objCreate("div")
            // this.game_assets_element.classList.add("pc_assets")
            // this.ObjAppend(this.div, this.game_assets_element)



            // 钱包卡片
            var paycard = this.objCreate("div")
            paycard.classList.add("pc_card")
            this.ObjAppend(this.div, paycard)

            // 详情
            var aWalletDetail = this.objCreate("a")
            aWalletDetail.classList.add("pc_mydetail", "iconfont", "icon-bc-xiangqing")
            aWalletDetail.onclick = () => {
                this.wallet_detail()
            }
            this.ObjAppend(paycard, aWalletDetail)

            // 通讯录
            var payAddressbook = this.objCreate("a")
            payAddressbook.classList.add("pc_mydetail", "iconfont", "icon-bc-tongxunlu")
            payAddressbook.onclick = () => {
                this.hidden()
                AddressbookView.refer = "PayView"
                Main.viewMgr.change("AddressbookView")
            }
            this.ObjAppend(paycard, payAddressbook)

            // 我的(缩略)钱包地址
            var divWallet = this.objCreate("div")
            divWallet.classList.add("pc_cardcon")
            divWallet.textContent = Main.user.info.wallet.substr(0, 4) + "****" + Main.user.info.wallet.substr(Main.user.info.wallet.length - 4)
            this.ObjAppend(paycard, divWallet)



            // 刷新
            var payRefresh = this.objCreate("div")
            payRefresh.classList.add("pc_cardrefresh")
            payRefresh.textContent = Main.langMgr.get("pay_refresh") // "刷新"
            payRefresh.onclick = async () => {
                Main.viewMgr.change("ViewLoading")
                await this.doGetBalances()
                await this.doGetWalletLists(1)
                Main.viewMgr.viewLoading.remove()
            }
            this.ObjAppend(paycard, payRefresh)

            //刷新图标            
            var iRefresh = this.objCreate("i")
            iRefresh.classList.add("iconfont", "icon-bc-shuaxin")
            this.ObjAppend(payRefresh, iRefresh)


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

            // 提现
            var makeTransferObj = this.objCreate("button")
            makeTransferObj.textContent = Main.langMgr.get("pay_send") //"提现"
            makeTransferObj.onclick = () => {
                this.doMakeTransfer()
            }
            this.ObjAppend(divWalletUser, makeTransferObj)


            // 代币
            var divCurrency = this.objCreate("div")
            divCurrency.classList.add("pc_currency")
            this.ObjAppend(this.div, divCurrency)

            // === 代币导航栏
            var divCurrencyNumber = this.objCreate("div")
            divCurrencyNumber.classList.add("pc_currencynumber")
            this.ObjAppend(divCurrency, divCurrencyNumber)

            for (let i = 0; i < PayView.tokens.length; i++) {
                let token = PayView.tokens[i]

                // 导航栏
                this["token_" + token] = this.objCreate("div")
                this["token_" + token].innerText = Main.langMgr.get("pay_coin_" + token)
                this["token_" + token].onclick = () => {
                    this.changeToken(token);
                }
                this.ObjAppend(divCurrencyNumber, this["token_" + token])

                // 数字币种list，默认不显示
                this["token_list_" + token] = this.objCreate("div")
                this["token_list_" + token].classList.add("pc_currencylist")
                this["token_list_" + token].style.display = "none"
                this.ObjAppend(divCurrency, this["token_list_" + token])

                // 数字币种具体
                for (let k = 0; k < PayView.tokens_coin[i].length; k++) {
                    let coin = PayView.tokens_coin[i][k]

                    let coinElement = this.objCreate("div")
                    coinElement.classList.add("coinli")
                    // 名称
                    coinElement.innerHTML = Main.langMgr.get(coin)
                    this.ObjAppend(this["token_list_" + token], coinElement)
                    // LOGO
                    let logoElement = this.objCreate("img") as HTMLImageElement
                    logoElement.src = Main.resHost + "res/img/" + coin + ".png"
                    logoElement.classList.add("coinlogo")
                    this.ObjAppend(coinElement, logoElement)
                    // ?号
                    let labelElement = this.objCreate("label")
                    labelElement.classList.add("iconfont", "icon-bc-help")
                    this.ObjAppend(coinElement, labelElement)
                    let descText = Main.langMgr.get("pay_" + coin + "_desc")
                    if (descText != "") {
                        // ?描述
                        let descElement = this.objCreate("div")
                        descElement.classList.add("pc_coincon")
                        descElement.textContent = Main.langMgr.get("pay_" + coin + "_desc")
                        this.ObjAppend(labelElement, descElement)
                    }
                    else {
                        labelElement.style.display = "none"
                    }
                    // 字体图标">"
                    let moreElement = this.objCreate("i")
                    moreElement.classList.add("iconfont", "icon-bc-gengduo")
                    this.ObjAppend(coinElement, moreElement)
                    // 余额
                    this["span" + coin.toUpperCase()] = this.objCreate("span")
                    this["span" + coin.toUpperCase()].textContent = "0"
                    this.ObjAppend(coinElement, this["span" + coin.toUpperCase()])
                    // 点击事件
                    coinElement.onclick = () => {
                        this["doExchange" + coin.toUpperCase()]()
                    }
                }
            }
            // 显示第一组代币
            this["token_" + PayView.tokens[0]].classList.add("active")
            this["token_list_" + PayView.tokens[0]].style.display = ""

            // cgas_old/cneo_old信息
            for (let token in PayView.tokens_old) {
                PayView.tokens_old[token].forEach((coin) => {
                    let coin_upcase = coin.toUpperCase() + "_OLD"
                    if (tools.CoinTool["id_" + coin_upcase].length > 0) {
                        tools.CoinTool["id_" + coin_upcase].forEach((old) => {
                            let coinElement = this.objCreate("div")
                            // 名称
                            coinElement.innerHTML = Main.langMgr.get("pay_" + coin)
                            this.ObjAppend(this["token_list_" + token], coinElement)
                            // LOGO
                            let logoElement = this.objCreate("img") as HTMLImageElement
                            logoElement.src = Main.resHost + "res/img/old" + coin + ".png"
                            logoElement.classList.add("coinlogo")
                            this.ObjAppend(coinElement, logoElement)
                            // ?号
                            let labelElement = this.objCreate("label")
                            labelElement.classList.add("iconfont", "icon-bc-help")
                            this.ObjAppend(coinElement, labelElement)
                            // ?描述
                            let descElement = this.objCreate("div")
                            descElement.classList.add("pc_coincon")
                            descElement.textContent = old
                            this.ObjAppend(labelElement, descElement)
                            // 字体图标">"
                            let moreElement = this.objCreate("i")
                            moreElement.classList.add("iconfont", "icon-bc-gengduo")
                            this.ObjAppend(coinElement, moreElement)
                            // 余额
                            this["span"+ coin_upcase + old] = this.objCreate("span")
                            this["span"+ coin_upcase + old].textContent = "0"
                            this.ObjAppend(coinElement, this["span" + coin_upcase + old])
                            // 点击事件
                            coinElement.onclick = () => {
                                this.doMakeRefundOld(old, coin_upcase)
                            }
                        })
                    }
                })
            }
             // 简化版虚拟资产div
            this.game_assets_element = this.objCreate("div")
            this.ObjAppend(this["token_list_" + PayView.tokens[0]], this.game_assets_element)
            
            // 钱包记录
            this.divLists = this.objCreate("ul") as HTMLDivElement
            this.divLists.classList.add("pc_paylists")
            this.ObjAppend(this.div, this.divLists)


            var liRecord = this.objCreate("li")
            liRecord.classList.add("pc_payrecord")
            // liRecord.innerText = Main.langMgr.get("pay_recentLists") //"近期记录"
            this.ObjAppend(this.divLists, liRecord)

            var spanRecord = this.objCreate("div")
            spanRecord.innerText = Main.langMgr.get("pay_recentLists") //"近期记录"
            this.ObjAppend(liRecord, spanRecord)

            // 更多钱包记录
            this.divListsMore = this.objCreate("button")
            this.divListsMore.classList.add("pc_paymore")
            this.divListsMore.textContent = Main.langMgr.get("pay_more") // "更多"
            this.divListsMore.onclick = () => {
                this.hidden()
                PayListMoreView.refer = "PayView"
                Main.viewMgr.change("PayListMoreView")
            }
            // this.divListsMore.style.display = "none"
            this.ObjAppend(liRecord, this.divListsMore)

            var iListsMore = this.objCreate("i")
            iListsMore.classList.add("iconfont", "icon-bc-sanjiaoxing")
            this.ObjAppend(this.divListsMore, iListsMore)

            // 正在处理的
            this.pendingListsElement = this.objCreate("div")
            this.ObjAppend(this.divLists, this.pendingListsElement)


            this.doGetBalances()
            this.doGetWalletLists(1)
            // 获取高度
            this.getHeight("nodes")
            if (tools.WWW.api_clis && tools.WWW.api_clis != "") {
                this.getHeight("clis")
            }
        }

        update() {
            var isHidden = this.isHidden();
            this.reset()
            super.update()
            if (isHidden) this.hidden()
        }

        key_esc() {

        }

        private clearTimeout() {
            if (this.s_doGetWalletLists) clearTimeout(this.s_doGetWalletLists)
        }

        async doGetBalances() {
            tools.CoinTool.initAllAsset();

            // 获得balance列表(gas)
            var balances = (await tools.WWW.api_getBalance(Main.user.info.wallet)) as tools.BalanceInfo[];
            if (balances) {
                //余额不唯空
                balances.map(item => (item.names = tools.CoinTool.assetID2name[item.asset])); //将列表的余额资产名称赋值
                await balances.forEach(
                    // 取GAS余额
                    balance => {
                        if (balance.asset == tools.CoinTool.id_GAS) {
                            this.gas = balance.balance;
                            // 判断一下有没有减号，不用科学计数法表示
                            this["spanGAS"].textContent = Main.getStringNumber(this.gas)
                        }
                        else if (balance.asset == tools.CoinTool.id_NEO) {
                            this.neo = balance.balance
                            this["spanNEO"].textContent = Main.getStringNumber(this.neo)
                        }
                    }
                );
            }
            else {
                this.gas = 0;
                this.neo = 0;
                this["spanGAS"].textContent = "0";
                this["spanNEO"].textContent = "0"
            }

            // 获取NEP5余额
            PayView.tokens_coin.forEach( token => {
                token.forEach( coin => {
                    if (coin != "gas" && coin != "neo") {
                        this.getNep5Balance(coin.toUpperCase())
                    }
                })
            })
            // 获取CGAS_OLD/CNEO_OLD余额
            for (let k in PayView.tokens_old) {
                PayView.tokens_old[k].forEach( coin => {
                    this.getNep5BalanceOld(coin.toUpperCase() + "_OLD")
                })
            }
            // MINI
            await this.my_asset()
        }

        private async getNep5BalanceOld(coin: string) {
            try {
                let coin_lowcase = coin.toLowerCase()
                await tools.CoinTool["id_" + coin].forEach(async (old) => {
                    this[coin_lowcase + old] = await Main["get" + coin + "BalanceByAddress"](old, Main.user.info.wallet)
                    this["span" + coin + old].textContent = Main.getStringNumber(this[coin_lowcase + old])
                })
            }
            catch (e) { }
        }

        private async getNep5Balance(coin: string) {
            try {
                let coin_lowcase = coin.toLowerCase()
                this[coin_lowcase] = await Main["get" + coin + "BalanceByAddress"](tools.CoinTool["id_" + coin], Main.user.info.wallet)
                this["span" + coin].textContent = Main.getStringNumber(this[coin_lowcase])

                // 通知其他界面更新余额
                Main.viewMgr.updateBalance()
            }
            catch (e) { }
        }

        private async doMakeRefundOld(id_old: string, type: string = "CGAS_OLD") {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 获取cgas合约地址
                // 暂时以第一个合约地址为准，后续如果多个，新开view显示
                let id_OLD = id_old

                // 获取cgas余额
                let balance = await Main["get" + type + "BalanceByAddress"](id_OLD, Main.user.info.wallet)
                let id_balance = balance.toString()

                // 打开输入数量
                ViewTransferCount.transType = "refund"
                ViewTransferCount.transNncOld = id_OLD

                if (type == "CGAS_OLD") {
                    ViewTransferCount.coinType = "CGAS"
                }
                else if (type == "CNEO_OLD") {
                    ViewTransferCount.coinType = "CNEO"
                }

                ViewTransferCount.refer = "PayView"
                ViewTransferCount.callback = () => {
                    this.makeRefundTransaction(id_old, type)
                }
                Main.viewMgr.change("ViewTransferCount")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doMakeRefundOld(id_old, type)
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }

        }

        private async doExchangeGAS() {
            this.doExchangeToken("CGAS")
        }

        private async doExchangeCNEO() {
            this.doExchangeToken("CNEO")
        }

        private async doExchangeBCT() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开输入数量
                PayExchangeBCTView.refer = "PayView"
                this.hidden()
                Main.viewMgr.change("PayExchangeBCTView")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doExchangeBCT();
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private async doExchangeBCP() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开输入数量
                PayExchangeView.refer = "PayView"
                this.hidden()
                PayExchangeView.type_src = "bcp"
                Main.viewMgr.change("PayExchangeView")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doExchangeBCP();
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private async doExchangeCGAS() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开输入数量
                PayExchangeView.refer = "PayView"
                this.hidden()
                PayExchangeView.type_src = "cgas"
                Main.viewMgr.change("PayExchangeView")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doExchangeCGAS()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private async doExchangeToken(coinType: string = "CGAS") {
            if (Main.isWalletOpen()) {
                // 打开钱包了
                // 打开输入数量
                ViewTransferCount.coinType = coinType
                ViewTransferCount.transType = ""
                ViewTransferCount.transNncOld = ""

                ViewTransferCount.refer = "PayView"
                ViewTransferCount.callback = () => {
                    switch (ViewTransferCount.transType) {
                        case "mint":
                            this.makeMintTokenTransaction(coinType)
                            break
                        case "refund":
                            this.makeRefundTransaction(tools.CoinTool["id_" + coinType], coinType)
                            break;
                    }
                }
                Main.viewMgr.change("ViewTransferCount")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doExchangeToken(coinType)
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private async doExchangeNEO() {

            this.hidden()

            var res: any = {}
            res['data'] = {
                address: Main.user.info.wallet
            }

            PayExchangeShowWalletView.refer = "PayView"
            PayExchangeShowWalletView.balance = Main.viewMgr.payView.neo
            PayExchangeShowWalletView.callback_params = {
                type_src: "NEO",
                data: res.data,
            }
            Main.viewMgr.change("PayExchangeShowWalletView")
        }

        private async doExchangeBTC() {
            this._doExchangeOther("btc")
        }

        private async doExchangeETH() {
            this._doExchangeOther("eth")
        }

        // 获取其他类型的交易钱包地址，注意：type是小写字符串
        async getWalletAddrOther(type: string) {
            if (!this.wallet_addr_other) {
                this.wallet_addr_other = {}
            }
            if (!this.wallet_addr_other.hasOwnProperty[type]) {
                Main.viewMgr.change("ViewLoading")
                try {
                    // 获取交易钱包地址
                    var res = await ApiTool.getOtherAddress(Main.user.info.uid, Main.user.info.token, type, Main.netMgr.type)
                }
                catch (e) {

                }
                Main.viewMgr.viewLoading.remove()

                if (!res || !res.r) {
                    // 获取失败
                    Main.showErrMsg("pay_exchange_create_wallet_fail")
                    return null
                }

                this.wallet_addr_other[type] = res.data.address
            }
            return this.wallet_addr_other[type]
        }

        // 交易钱包储值（btc/eth)，注意：type是小写字符串
        private async _doExchangeOther(type: string) {
            var address = await this.getWalletAddrOther(type)
            if (address) {
                this.hidden()
                PayExchangeShowWalletView.refer = "PayView"
                PayExchangeShowWalletView.balance = this[type]
                PayExchangeShowWalletView.callback_params = {
                    type_src: type.toUpperCase(),
                    data: {
                        address: address
                    }
                }
                Main.viewMgr.change("PayExchangeShowWalletView")
            }
        }

        private divLists_recreate() {
            this.pendingListsElement.innerHTML = "";
        }

        async doGetWalletLists(force = 0) {
            console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 获取交易记录，force => ', force)
            if (!Main.user.info.token) {
                console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 已退出登录，本次请求取消')
                return;
            }

            if (force == 0 && this.WalletListsNeedConfirm) {
                // 外部调用获取交易列表，当前又有待确认交易，取消本次查询，等待定时器自动刷新交易列表
                console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 有定时刷新，本次请求取消')
                return;
            }

            if (this.s_doGetWalletLists) {
                clearTimeout(this.s_doGetWalletLists)
                this.s_doGetWalletLists = null
            }

            // 获取pending数据
            var res = await ApiTool.getWalletListss(Main.user.info.uid, Main.user.info.token, 1, this.listPageNum, Main.netMgr.type, 1);

            if (res.r) {
                // 清理原始数据显示
                this.divLists_recreate()

                // 刷新icon
                Main.viewMgr.iconView.flushProcess(res.data.length)

                // 有待确认交易
                if (res.data && res.data.length > 0) {

                    // 刷新时间初始化
                    var next_timeout = this.getWalletListsTimeout; // 下次刷新间隔
                    var curr_ts = Math.round((new Date()).getTime() / 1000); // 当前时间戳

                    // 显示pending&优化刷新时间
                    await res.data.forEach(
                        list => {

                            // 优化间隔时间，此记录持续时间超过默认出块时间间隔，并且在3个出块时间内，使用最小刷新时间间隔
                            let last_ts = (curr_ts - list.ctm) * 1000 - Main.tsOffset
                            if (last_ts >= this.getWalletListsTimeout && last_ts < this.getWalletListsTimeout * 3) {
                                next_timeout = this.getWalletListsTimeout_min
                            }

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

                            // 时间
                            var content_ctm_span = this.objCreate("div")
                            content_ctm_span.classList.add("pc_listdate", "listCtm") // listCtm不要随便修改，后面刷新时间(flushListCtm)用到了这个class
                            content_ctm_span.textContent = this.getListCtmMsg(list)
                            content_ctm_span.setAttribute("ctm", list.ctm)
                            this.ObjAppend(state_cnts_div, content_ctm_span)

                            // 数量
                            var cnts = this.getListCnts(list)
                            if (cnts) {
                                this.ObjAppend(state_cnts_div, cnts);
                                var cnts_class = this.getListCntsClass(list);
                                if (cnts_class) state_cnts_div.classList.add(cnts_class)
                            }

                            // 状态
                            var state = this.getListState(list);
                            if (state) this.ObjAppend(state_cnts_div, state)
                            this.ObjAppend(listObj, state_cnts_div)

                            this.ObjAppend(this.pendingListsElement, listObj)
                        }
                    );

                    // 设置刷新任务
                    console.log('[BlaCat]', '[PayView]', 'doGetWalletLists, ', next_timeout / 1000, "(s)后再次获取")
                    this.s_doGetWalletLists = setTimeout(() => { this.doGetWalletLists(1) }, next_timeout);
                    this.WalletListsNeedConfirm = true
                }

                // 获取余额判定
                let walletListsHash_tmp = JSON.stringify(res.data)
                if (this.walletListsHash != null && walletListsHash_tmp != this.walletListsHash) {
                    // 第一次，不需要获取余额
                    console.log('[BlaCat]', '[PayView]', 'doGetWalletLists, 更新余额')
                    this.doGetBalances()
                }
                this.walletListsHash = walletListsHash_tmp
            }
            else {
                Main.showErrCode(res.errCode)
            }
        }

        /**
         * 获取币种图标
         * @param v 钱包交易记录list数据
         * @param type 币种，小写
         */
        private getCoinIcon(v, coin_type: string): string {
            try {
                var params = JSON.parse(v.params)
                if (params.hasOwnProperty("nnc")) {
                    params = [params]
                }
                if (params instanceof Array) {
                    for (let k in params) {
                        if (params[k].hasOwnProperty('nnc')) {
                            if (params[k].nnc == tools.CoinTool["id_" + coin_type.toUpperCase()]) {
                                return Main.resHost + "res/img/" + coin_type.toLowerCase() + ".png";
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', 'getListImg, v.type=' + v.type + ', error => ', e)
            }
            return Main.resHost + "res/img/old" + coin_type.toLowerCase() + ".png";
        }

        getListImg(v) {
            if (v.state == "0" && v.type == "5") {
                // 未确认，统一返回未确认图标
                return Main.resHost + "res/img/transconfirm.png";
            }

            switch (v.type) {
                case "1": // utxo->nep5(gas->cgas、neo->cneo)
                case "2": // nep5->utxo(cgas->gas、cneo->neo)
                case "3": // nep5(cgas、cneo）充值到游戏(nep5->game)
                case "4": // nep5(cgas、cneo）退款(game->nep5)
                    if (v.type_detail == "0") {
                        return this.getCoinIcon(v, 'cgas')
                    }
                    for (let k in PayTransferView.log_type_detail) {
                        if (PayTransferView.log_type_detail[k] == v.type_detail) {
                            return this.getCoinIcon(v, k)
                        }
                    }
                    break;
                case "5": // 游戏交易
                    // 判断params里面是否有cgas合约，有的话标记成cgas图标
                    var nep5Type = ['gas', 'cgas', 'neo', 'cneo', 'bcp', 'bct']
                    try {
                        var params = JSON.parse(v.params)
                        if (params.hasOwnProperty("nnc")) {
                            params = [params]
                        }
                        if (params instanceof Array) {
                            for (let k in params) {
                                if (params[k].hasOwnProperty('nnc')) {
                                    // CURR-NEP5
                                    for (let i = 0; i < nep5Type.length; i++) {
                                        if (params[k].nnc == tools.CoinTool["id_" + nep5Type[i].toUpperCase()]) {
                                            return Main.resHost + "res/img/" + nep5Type[i] + ".png"
                                        }
                                    }
                                    // CGAS_OLD
                                    for (let m = 0; m < tools.CoinTool.id_CGAS_OLD.length; m++) {
                                        if (params[k].nnc == tools.CoinTool.id_CGAS_OLD[m]) {
                                            return Main.resHost + "res/img/oldcgas.png"
                                        }
                                    }
                                    // CNEO_OLD
                                    for (let m = 0; m < tools.CoinTool.id_CNEO_OLD.length; m++) {
                                        if (params[k].nnc == tools.CoinTool.id_CNEO_OLD[m]) {
                                            return Main.resHost + "res/img/oldcneo.png"
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[PayView]', 'getListImg, v.type=5, error => ', e)
                    }
                    return this.getListGameIcon(v);
                case "6": // 转账
                    if (v.type_detail == "0") {
                        return Main.resHost + "res/img/gas.png"
                    }
                case "13": // 购买兑换
                case "16": // 购买会员vip
                    for (let k in PayTransferView.log_type_detail) {
                        if (PayTransferView.log_type_detail[k] == v.type_detail) {
                            // return Main.resHost + "res/img/" + k + ".png"
                            return this.getCoinIcon(v, k)
                        }
                    }
                    break;
                case "9": // 储值
                    switch (v.type_detail) {
                        case "1": // btc
                            return Main.resHost + "res/img/btc.png";
                        case "2": // eth
                            return Main.resHost + "res/img/eth.png";
                    }
                    break;
                case "10": // 交易钱包余额扣款
                case "12": // 交易钱包余额退款
                    var res = this.parseTypeDetailType10(v.type_detail)
                    switch (res.type_src) {
                        case "1": // btc
                            return Main.resHost + "res/img/btc.png";
                        case "2": // eth
                            return Main.resHost + "res/img/eth.png";
                        case "4": // bct
                            return Main.resHost + "res/img/bct.png";
                        case "5": // cneo
                            return Main.resHost + "res/img/cneo.png";
                    }
                    break;
                case "11": // 交易钱包余额购买结果
                    var res = this.parseTypeDetailType10(v.type_detail)
                    switch (res.type) {
                        case "1": // cgas
                            return Main.resHost + "res/img/cgas.png";
                        case "2": // bcp
                            return Main.resHost + "res/img/bcp.png";
                    }
                    break;
                case "14": // bancor合约交易转账
                    try {
                        var paramJson_tmp = JSON.parse(v.params)
                        if (paramJson_tmp['type'] == "1") {
                            // 消耗BCP购买代币，转BCP，显示BCP图标
                            return Main.resHost + "res/img/bcp.png"
                        }
                        else if (paramJson_tmp['type'] == "2") {
                            // 消耗代币购买BCP，转代币，显示代币图标
                            if (v.hasOwnProperty('asset_icon')) {
                                return v['asset_icon']
                            }
                        }
                    }
                    catch (e) {

                    }
                    break;
                case "15": // bancor合约交易发币
                    try {
                        var paramJson_tmp = JSON.parse(v.params)
                        if (paramJson_tmp['sbPushString'] == "sale") {
                            // 卖出代币获得BCP，获得BCP，显示BCP图标
                            return Main.resHost + "res/img/bcp.png"
                        }
                        else if (paramJson_tmp['sbPushString'] == "purchase") {
                            // 卖出BCP获得代币，获得代币，显示代币图标
                            if (v.hasOwnProperty('asset_icon')) {
                                return v['asset_icon']
                            }
                        }
                    }
                    catch (e) {

                    }
                    break;
            }
            return Main.resHost + "res/img/game0.png";
        }

        getListGameIcon(v) {
            try {
                var iconObj = JSON.parse(v.icon)
                if (iconObj.hasOwnProperty(Main.langMgr.type)) {
                    return iconObj[Main.langMgr.type]
                }
                else if (iconObj.hasOwnProperty(Main.applang)) {
                    return iconObj[Main.applang];
                }
            }
            catch (e) {
                // return v.name;
                console.log("[BlaCat]", '[PayView]', 'getListGameIcon, v', v, 'error => ', e.toString())
            }
            return v.icon
        }

        private getAppName(v) {
            var name = v.name;
            try {
                var nameObj = JSON.parse(name)
                if (nameObj.hasOwnProperty(Main.langMgr.type)) {
                    return nameObj[Main.langMgr.type]
                }
                else if (nameObj.hasOwnProperty(v.lang)) {
                    return nameObj[v.lang];
                }
            }
            catch (e) {
                // return v.name;
                console.log("[BlaCat]", '[PayView]', 'getName, name =>', name, 'error => ', e.toString())
            }
            return name
        }

        getListName(v) {
            if (v.g_id == "0") {
                return Main.platName;
            }
            return this.getAppName(v);
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

        // 扩展方法信息显示
        getListParamsMethods_extInfo(v): string {
            switch (v.type) {
                // bancor合约交易
                case "5":
                    try {
                        var paramJson_tmp = JSON.parse(v.params)
                        if (paramJson_tmp.hasOwnProperty('action') && Main.in_array(paramJson_tmp.action, ["buy", "upgrade"])) {
                            if (paramJson_tmp.action == "buy") {
                                if (paramJson_tmp.hasOwnProperty('inviter') && paramJson_tmp.inviter && paramJson_tmp.inviter != v.wallet) {
                                    // 购买合伙人证书
                                    return ": buyPartner"
                                }
                            }
                            else if (paramJson_tmp.action == "upgrade") {
                                if (paramJson_tmp.hasOwnProperty('lv') && paramJson_tmp.lv && Main.in_array(paramJson_tmp.lv, ["2", "3", "4"])) {
                                    // 购买合伙人证书
                                    return ": upgradePartner"
                                }
                            }
                        }
                    }
                    catch (e) {}
                    break;
                case "14":
                    try {
                        var paramJson_tmp = JSON.parse(v.params)
                        if (paramJson_tmp['type'] == "1") {
                            // 消耗BCP购买代币，转BCP
                            return ": purchase"
                        }
                        else if (paramJson_tmp['type'] == "2") {
                            // 消耗代币购买BCP，转代币
                            return ": sale"
                        }
                    }
                    catch (e) { }
                    break;
                // 购买会员
                case "16":
                    try {
                        var params = JSON.parse(v.params)
                        var month = params['month']
                        return ": buyVip_" + month
                    }
                    catch (e) { }
                    break;
                // 合伙人
                case "17":
                    switch (v.type_detail) {
                        case "1":
                            return ": buyPartner"
                        case "2":
                            return ": upgradePartner"
                        case "3":
                            return ": exchangePartner"
                    }
                    break;
            }
            return ""
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
                            method.push(params[k].sbPushString + this.getListParamsMethods_extInfo(v))
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
                console.log("[BlaCat]", '[PayView]', 'getListParamMethods, v', v, 'error => ', e.toString())
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
            if (v.type == "1"
                || (v.type == "5" && v.type_detail == "2")
                || v.type == "9"
                || v.type == "11"
                || v.type == "12"
                || v.type == "13"
                || v.type == "15"
            ) {
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

            switch (v.type) {
                case "2":   // 平台退款
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
                    break;
                case "9": // 交易钱包余额储值
                    if (v.state == "0") {
                        try {
                            var ext = JSON.parse(v.ext)
                            if (ext.hasOwnProperty("process")) {
                                pct = ext.process + "%";
                            }
                        }
                        catch (e) {

                        }
                    }
                    break;
            }

            switch (state) {
                case '0':
                    var state_button0 = this.objCreate("div")
                    state_button0.classList.add("pc_verification")
                    if (i == 1) {
                        state_button0.classList.add("iconfont", "icon-bc-dengdai")
                        state_button0.innerHTML = "<label>" + pct + "</label>"
                    } else {
                        // 感叹号
                        var obja = this.objCreate("a")
                        obja.classList.add("iconfont", "icon-bc-jinhangzhong")
                        obja.innerHTML = '<label>' + pct + '</label>';
                        obja.onclick = () => {
                            Main.continueWithOpenWallet();
                            event.stopPropagation();
                        }
                        this.ObjAppend(state_button0, obja);
                    }

                    return state_button0;
                case '1':
                    var state_a1 = this.objCreate("a")
                    state_a1.classList.add("iconfont", "icon-bc-gou")
                    return state_a1;
                case '2':
                    var state_a2 = this.objCreate("a")
                    state_a2.classList.add("iconfont", "icon-bc-chacha")
                    return state_a2;
            }
        }

        getListBlockindex(v) {
            if (v.hasOwnProperty('blockindex')) {
                return v["blockindex"]
            }
            return 0
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

        // gas -> cgas   neo -> cneo
        private async makeMintTokenTransaction(coinType: string = "CGAS") {
            Main.viewMgr.change("ViewLoading")

            var mintCount = Main.viewMgr.viewTransferCount.inputCount.value;
            var net_fee = Main.viewMgr.viewTransferCount.net_fee;// 手续费
            console.log("[BlaCat]", '[PayView]', '充值' + coinType + '，数量 => ', mintCount, '手续费netfee =>', net_fee)


            var login = tools.LoginInfo.getCurrentLogin();

            try {
                var utxos_assets = await tools.CoinTool.getassets();
                console.log("[BlaCat]", '[PayView]', 'utxos_assets => ', utxos_assets)

                if (coinType == "CGAS") {
                    var scriptaddress = tools.CoinTool.id_CGAS.hexToBytes().reverse();
                    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                    var makeTranRes: Result = tools.CoinTool.makeTran(
                        utxos_assets,
                        nepAddress,
                        tools.CoinTool.id_GAS,
                        Neo.Fixed8.fromNumber(Number(mintCount)),
                        Neo.Fixed8.fromNumber(Number(net_fee)),
                        0,
                        true, // 拆分gas的utxo，以便后续手续费
                    );
                }
                else {
                    // CNEO
                    var scriptaddress = tools.CoinTool.id_CNEO.hexToBytes().reverse();
                    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                    var makeTranRes: Result = tools.CoinTool.makeTran(
                        utxos_assets,
                        nepAddress,
                        tools.CoinTool.id_NEO,
                        Neo.Fixed8.fromNumber(Number(mintCount)),
                        //Neo.Fixed8.fromNumber(Number(net_fee)),
                        Neo.Fixed8.Zero,
                        0,
                        false, // 拆分gas的utxo，以便后续手续费
                    );

                    // 获取手续费
                    // 有网络手续费
                    if (Number(net_fee) > 0) {

                        // makeTranRes.info.tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                        try {
                            // 获取用户utxo : utos_assets
                            var user_makeTranRes: Result = tools.CoinTool.makeTran(
                                utxos_assets,
                                Main.user.info.wallet,
                                tools.CoinTool.id_GAS,
                                Neo.Fixed8.Zero,
                                Neo.Fixed8.fromNumber(Number(net_fee)),
                            );

                            // inputs、outputs、oldarr塞入
                            var user_tran = user_makeTranRes.info.tran
                            for (let i = 0; i < user_tran.inputs.length; i++) {
                                makeTranRes.info.tran.inputs.push(user_tran.inputs[i])
                            }
                            for (let i = 0; i < user_tran.outputs.length; i++) {
                                makeTranRes.info.tran.outputs.push(user_tran.outputs[i])
                            }
                            var user_oldarr = user_makeTranRes.info.oldarr
                            for (let i = 0; i < user_oldarr.length; i++) {
                                makeTranRes.info.oldarr.push(user_oldarr[i])
                            }
                            console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_makeTranRes => ', user_makeTranRes)
                        }
                        catch (e) {
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
                    }
                }
            }
            catch (e) {
                Main.viewMgr.viewLoading.remove()
                let errmsg = Main.langMgr.get(e.message);
                if (errmsg) {
                    Main.showErrMsg((e.message)); // "GAS余额不足"
                }
                else {
                    if (coinType == "CGAS") {
                        Main.showErrMsg("pay_makeMintGasNotEnough")
                    }
                    else {
                        Main.showErrMsg("pay_makeMintNeoNotEnough")
                    }
                }

                return;
            }

            // gas转cgas，如果inputs+outputs的数量>=60，会超GAS,需要提示用户自己给自己转账后再操作
            var inputs_counts: number = makeTranRes.info.tran.hasOwnProperty("inputs") ? makeTranRes.info.tran.inputs.length : 0;
            var outputs_counts: number = makeTranRes.info.tran.hasOwnProperty("outputs") ? makeTranRes.info.tran.outputs.length : 0;
            var utxo_counts = inputs_counts + outputs_counts
            if (utxo_counts >= 50) {
                Main.viewMgr.viewLoading.remove()
                if (coinType == "CGAS") {
                    Main.showErrMsg("pay_makeMintGasUtxoCountsLimit", () => {
                        PayTransferView.transferType_default = "GAS"
                        PayTransferView.callback = null
                        PayTransferView.address = Main.user.info.wallet
                        Main.viewMgr.change("PayTransferView")
                        Main.viewMgr.payTransferView.inputTransferCount.value = mintCount
                    }, { gas: mintCount })
                }
                else {
                    // CNEO
                    Main.showErrMsg("pay_makeMintNeoUtxoCountsLimit", () => {
                        PayTransferView.transferType_default = "NEO"
                        PayTransferView.callback = null
                        PayTransferView.address = Main.user.info.wallet
                        Main.viewMgr.change("PayTransferView")
                        Main.viewMgr.payTransferView.inputTransferCount.value = mintCount
                    }, { neo: mintCount })
                }
                return
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
            tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
            // if (Number(extgas) > 0) {
            //     // 添加了手续费，version = 1
            //     tran.version = 1;
            // }

            var msg = tran.GetMessage();
            var signdata = ThinNeo.Helper.Sign(msg, login.prikey);
            tran.AddWitness(signdata, login.pubkey, login.address);

            var txid = tran.GetHash().clone().reverse().toHexString();

            var data = tran.GetRawData();
            var r = await tools.WWW.api_postRawTransaction(data);
            if (r) {
                if (r["txid"] || r["sendrawtransactionresult"]) {
                    if (!r["txid"] || r["txid"] == "") {
                        r["txid"] = txid
                    }

                    var log_type = "1"
                    var log_nnc = tools.CoinTool["id_" + coinType]
                    // 成功，上报
                    var logRes = await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        r["txid"],
                        "0",
                        mintCount,
                        log_type,
                        '{"sbParamJson":"[]", "sbPushString": "mintTokens", "nnc": "' + log_nnc + '"}',
                        Main.netMgr.type,
                        "0",
                        net_fee,
                        PayTransferView.log_type_detail[coinType.toLowerCase()]
                    );
                    // if (logRes.r)
                    // {
                    //     Main.platWalletLogId = parseInt(logRes.data);
                    // }

                    // 记录使用的utxo，后面不再使用，需要记录高度
                    var height = await tools.WWW.api_getHeight_nodes();
                    oldarr.map(old => old.height = height);
                    tools.OldUTXO.oldutxosPush(oldarr);

                    // 重新获取记录
                    Main.viewMgr.viewLoading.remove()
                    this.doGetWalletLists(1);

                    // TODO: 更新记录状态
                    //this.makeMintTokenTransaction_confirm(txid);
                } else {
                    // 失败
                    Main.viewMgr.viewLoading.remove()
                    Main.showErrMsg("pay_makeMintDoFail")
                }
            } else {
                // 失败
                Main.viewMgr.viewLoading.remove()
                Main.showErrMsg("pay_makeMintDoFail2")
            }
        }

        // cgas -> gas cneo -> neo
        private async makeRefundTransaction(id_ASSET: string = tools.CoinTool.id_CGAS, coinType: string = "CGAS") {
            Main.viewMgr.change("ViewLoading")

            var refundCount = Main.viewMgr.viewTransferCount.inputCount.value;
            var sendCount = Neo.Fixed8.fromNumber(Number(refundCount))

            var net_fee = Main.viewMgr.viewTransferCount.net_fee;// 手续费
            // var net_fee = "0.00000001"
            console.log("[BlaCat]", '[PayView]', '退到gas/neo，数量 => ', refundCount, '手续费netfee =>', net_fee)

            // 查询余额
            var scriptaddress = id_ASSET.hexToBytes().reverse();

            var login = tools.LoginInfo.getCurrentLogin();

            //获取cgas/cneo合约地址的资产列表
            if (id_ASSET == '0x74f2dc36a68fdc4682034178eb2220729231db76') {
                // 注意，如果合约升级了，需要改动
                // 协调退款
                var utxos_assets = await tools.CoinTool.getCgasAssets(id_ASSET, Number(refundCount));
            }
            else {
                // cneo也可以用这个
                var utxos_assets = await tools.CoinTool.getNep5Assets(id_ASSET);
            }


            var log_type = "2"

            var coinType_asset = tools.CoinTool.id_GAS
            var not_enough_utxo_err = "pay_makeRefundCgasNotEnoughUtxo"
            var not_enough_err = "pay_makeRefundCgasNotEnough"
            if (coinType == "CNEO" || coinType == "CNEO_OLD") {
                coinType_asset = tools.CoinTool.id_NEO
                not_enough_utxo_err = "pay_makeRefundCneoNotEnoughUtxo"
                not_enough_err = "pay_makeRefundCneoNotEnough"
            }

            var us = utxos_assets[coinType_asset];
            if (us == undefined) {
                Main.viewMgr.viewLoading.remove()
                Main.showErrMsg(not_enough_utxo_err)
                return;
            }

            // 打乱us顺序，尽量避免一个块时间内，使用了重复的utxo，导致交易失败
            // 不能完全避免失败，但是可以提高并发成功率
            let us_random = []
            Main.randomSort(us, us_random)
            us = us_random

            console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, us.before => ', us);

            //检查cgas地址拥有的gas的utxo是否有被标记过
            var us_parse = [] // us处理后结果
            var count: Neo.Fixed8 = Neo.Fixed8.Zero;
            for (var i = us.length - 1; i >= 0; i--) {

                if (count.compareTo(sendCount) > 0) {
                    // 足够数量了，后面的直接剔除了
                    console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, enough us[' + i + '].delete => ', us[i]);
                    // delete us[i];
                    continue
                }

                if (us[i].n > 0) {
                    count = count.add(us[i].count)
                    us_parse.push(us[i])
                    continue;
                }

                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson(["(hex256)" + us[i].txid.toString()]);
                sb.EmitPushString("getRefundTarget");
                sb.EmitAppCall(scriptaddress);

                var data = sb.ToArray();
                var r = await tools.WWW.rpc_getInvokescript(data);
                if (r) {
                    var stack = r["stack"];
                    var value = stack[0]["value"].toString();
                    if (value.length > 0) {
                        console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, us[' + i + '].delete => ', us[i]);
                        // delete us[i];
                    }
                    else {
                        count = count.add(us[i].count)
                        us_parse.push(us[i])
                    }
                }
            }
            us = us_parse

            console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, us.after => ', us);

            utxos_assets[coinType_asset] = us;

            console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, utxos_assets.after => ', utxos_assets);

            // 生成交易请求

            //cgas 自己给自己转账   用来生成一个utxo  合约会把这个utxo标记给发起的地址使用
            try {
                var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                var makeTranRes: Result = tools.CoinTool.makeTran(
                    utxos_assets,
                    nepAddress,
                    coinType_asset,
                    Neo.Fixed8.fromNumber(Number(refundCount))
                );
                // 有网络手续费
                // ***************** CNEO退款暂时不支持支付GAS手续费 ****************************
                if (Number(net_fee) > 0) {

                    // makeTranRes.info.tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                    try {
                        // 获取用户utxo
                        var user_utxos_assets = await tools.CoinTool.getassets();
                        console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_utxos_assets => ', user_utxos_assets)

                        var user_makeTranRes: Result = tools.CoinTool.makeTran(
                            user_utxos_assets,
                            Main.user.info.wallet,
                            tools.CoinTool.id_GAS,
                            Neo.Fixed8.Zero,
                            Neo.Fixed8.fromNumber(Number(net_fee)),
                        );

                        // inputs、outputs、oldarr塞入
                        var user_tran = user_makeTranRes.info.tran
                        for (let i = 0; i < user_tran.inputs.length; i++) {
                            makeTranRes.info.tran.inputs.push(user_tran.inputs[i])
                        }
                        for (let i = 0; i < user_tran.outputs.length; i++) {
                            makeTranRes.info.tran.outputs.push(user_tran.outputs[i])
                        }
                        var user_oldarr = user_makeTranRes.info.oldarr
                        for (let i = 0; i < user_oldarr.length; i++) {
                            makeTranRes.info.oldarr.push(user_oldarr[i])
                        }
                        console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_makeTranRes => ', user_makeTranRes)
                    }
                    catch (e) {
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
                }
            }
            catch (e) {
                Main.viewMgr.viewLoading.remove()
                Main.showErrMsg(not_enough_err)
                return;
            }

            console.log(
                "[BlaCat]", "[payView]", "makeRefundTransaction, makeTranRes => ",
                makeTranRes
            );

            var r = await tools.WWW.api_getcontractstate(id_ASSET);
            if (r && r["script"]) {
                var Script = r["script"].hexToBytes();

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
                // 网络手续费
                if (Number(net_fee) > 0) tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));

                //附加鉴证
                tran.attributes = new Array<ThinNeo.Attribute>(1);
                tran.attributes[0] = new ThinNeo.Attribute();
                tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                tran.attributes[0].data = scriptHash;

                var wsb = new ThinNeo.ScriptBuilder();
                wsb.EmitPushString("whatever");
                wsb.EmitPushNumber(new Neo.BigInteger(250));
                tran.AddWitnessScript(Script, wsb.ToArray());

                //做提款人的签名
                var signdata = ThinNeo.Helper.Sign(tran.GetMessage(), login.prikey);
                tran.AddWitness(signdata, login.pubkey, login.address);

                var txid = tran.GetHash().clone().reverse().toHexString();

                var trandata = tran.GetRawData();

                console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, tran => ', tran);

                // 发送交易请求

                r = await tools.WWW.api_postRawTransaction(trandata);

                if (r) {
                    if (r.txid || r['sendrawtransactionresult']) {
                        if (!r["txid"] || r["txid"] == "") {
                            r["txid"] = txid
                        }
                        var paramJson_tmp = "(bytes)" + scriptHash.toHexString();
                        // 上报钱包操作记录
                        var logRes = await ApiTool.addUserWalletLogs(
                            Main.user.info.uid,
                            Main.user.info.token,
                            r.txid,
                            "0",
                            refundCount,
                            log_type,
                            // 塞入net_fee，以便退款第二步参考手续费
                            '{"sbParamJson":"' + paramJson_tmp + '", "sbPushString": "refund", "nnc": "' + id_ASSET + '", "net_fee": "' + net_fee + '"}',
                            Main.netMgr.type,
                            "0",
                            "",
                            PayTransferView.log_type_detail[coinType.toLowerCase()]
                        );
                        if (logRes.r) {
                            Main.platWalletLogId = parseInt(logRes.data);
                        }

                        // 记录使用的utxo，后面不再使用，需要记录高度
                        var height = await tools.WWW.api_getHeight_nodes();
                        oldarr.map(old => old.height = height);
                        tools.OldUTXO.oldutxosPush(oldarr);

                        // 等待交易确认
                        // this.makeRefundTransaction_confirm(r["txid"], refundCount);

                        // 刷新钱包记录，显示当前交易信息
                        Main.viewMgr.viewLoading.remove()
                        this.doGetWalletLists(1)

                    } else {
                        Main.viewMgr.viewLoading.remove()
                        // Main.showErrMsg("提取合约执行失败！请等待上个提现或兑换交易完成再操作！");
                        Main.showErrMsg(("pay_makeRefundDoFail"))
                    }
                    console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, api_postRawTransaction结果 => ', r);

                }
                else {
                    Main.viewMgr.viewLoading.remove()
                    // Main.showErrMsg("发送提取交易失败！请检查网络，稍候重试！");
                    Main.showErrMsg("pay_makeRefundDoFail2")
                }
            }
            else {
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg("获取提取合约失败！");
                Main.showErrMsg("pay_makeRefundGetScriptFail")
            }
        }

        //收款
        private async doMakeReceivables() {
            this.hidden()
            PayReceivablesView.refer = "PayView"
            Main.viewMgr.change("PayReceivablesView")
        }


        //转账
        private async doMakeTransfer() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开转账页
                PayTransferView.refer = "PayView"
                PayTransferView.callback = () => {
                    this.doGetWalletLists(1)
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
        private changeToken(type: string) {
            let types = ['blacat', 'neo', 'other']
            for (let i = 0; i < types.length; i++) {
                this["token_list_" + types[i]].style.display = "none"
                this["token_" + types[i]].classList.remove("active")
            }
            this["token_list_" + type].style.display = "block"
            this["token_" + type].classList.add("active")
        }

        flushListCtm() {
            var ctms = document.getElementsByClassName("listCtm")
            if (ctms && ctms.length > 0) {
                for (let k = 0; k < ctms.length; k++) {
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
                for (let i = 0; i < other.length; i++) {
                    this.ObjAppend(this.divNetSelect, this.getDivNetSelectType(other[i]))
                }
            }
        }

        private getDivNetSelectType(type: number) {
            var divObj = this.objCreate("div")
            divObj.textContent = Main.langMgr.get("pay_nettype_" + type)
            divObj.onclick = () => {
                Main.changeNetType(type)
            }
            return divObj;
        }

        checkTransCount(count: string): boolean {
            var regex = /(?!^0*(\.0{1,2})?$)^\d{1,14}(\.\d{1,8})?$/
            if (!regex.test(count)) {
                return false
            }
            if (Number(count) <= 0) {
                return false
            }
            return true
        }

        async getHeight(type: string) {
            var height = await tools.WWW["api_getHeight_" + type]()
            this.updateHeight(type, height)
        }
        updateHeight(type, height) {
            this["divHeight_" + type].textContent = height.toString()
            this["height_" + type] = height
        }

        parseTypeDetailType10(type_detail: string) {
            var res = { type: "0", type_src: "0" }
            var detail = parseInt(type_detail)
            res.type_src = Math.floor(detail / 1000).toString()
            res.type = (detail % 1000).toString()

            return res
        }

        // 虚拟资产
        private async my_asset() {
            var curr = Date.parse(new Date().toString())
            if (!this.game_assets_ts || curr - this.game_assets_ts > this.game_assets_update) {
                // 重新获取game_assets
                // Main.viewMgr.change("ViewLoading") // for MINI
                try {

                    // 筛选游戏资产
                    var game_assetids = []

                    var allNep5AssetsBalance = await tools.WWW.api_getAllNep5AssetBalanceOfAddress(Main.user.info.wallet)
                    if (allNep5AssetsBalance) {
                        for (let k in allNep5AssetsBalance) {
                            game_assetids.push(allNep5AssetsBalance[k]['assetid'])
                            this.allnep5_balance[allNep5AssetsBalance[k]['assetid']] = allNep5AssetsBalance[k]
                        }
                    }

                    // 数据筛选
                    // if (game_assetids.length > 0) { // for MINI
                        var res = await ApiTool.getGameAssets(Main.user.info.uid, Main.user.info.token, [], Main.appid)
                        console.log("[BlaCat]", '[PayView]', 'my_asset, getGameAssets res => ', res)
                        if (res.r) {
                            if (res.data) {
                                this.game_assets = res.data
                                this.game_assets_ts = curr
                                this.showGameAssets()
                            }
                        }
                        else {
                            // Main.viewMgr.viewLoading.remove() // for MINI
                            Main.showErrCode(res.errCode)
                            return
                        }
                    // } // for MINI
                }
                catch (e) { }
                // Main.viewMgr.viewLoading.remove() // for MINI
            }
            else {
                console.log("[BlaCat]", '[PayView]', 'my_asset, tm not reach, last ', curr - this.game_assets_ts, ', this.game_assets_update: ', this.game_assets_update)
            }
        }
        // 简化版显示虚拟资产
        private async showGameAssets() {
            if (this.game_assets) {
                // 清理
                this.game_assets_element.innerHTML = ""
                this.game_assets_element.classList.add("game_assets")
                for (let k in this.game_assets) {
                    // res.data.appid.coins/nfts/name/icon/lang/
                    // 虚拟资产div


                    // 应用名称
                    // var assets_title = this.objCreate("div")
                    // assets_title.textContent = this.getAppName(this.game_assets[k]['name'])
                    // assets_title.classList.add("pc_assets_title")
                    // this.ObjAppend(assets_li, assets_title)

                    // 应用代币
                    if (this.game_assets[k].hasOwnProperty('coins')) {
                        for (let m in this.game_assets[k]['coins']) {
                            var assets_balance = this.objCreate("div")
                            assets_balance.classList.add("mini_asset")
                            assets_balance.textContent = this.game_assets[k]['coins'][m]['symbol'] ? this.game_assets[k]['coins'][m]['symbol'] : this.allnep5_balance[this.game_assets[k]['coins'][m]['contract']]['symbol']
                            this.ObjAppend(this.game_assets_element, assets_balance)

                            // 代币图标
                            var img = this.objCreate("img") as HTMLImageElement
                            img.src = this.game_assets[k]['coins'][m]['icon']
                            this.ObjAppend(assets_balance, img)
                            // 字体图标">"
                            var asseticon = this.objCreate("i")
                            asseticon.classList.add("iconfont", "icon-bc-gengduo")
                            this.ObjAppend(assets_balance, asseticon)
                            // 代币余额
                            var balance = this.objCreate("span")
                            balance.textContent = "0"
                            this.ObjAppend(assets_balance, balance)
                            
                            if (this.allnep5_balance.hasOwnProperty(this.game_assets[k]['coins'][m]['contract'])) {
                                balance.textContent = Main.getStringNumber(this.allnep5_balance[this.game_assets[k]['coins'][m]['contract']]['balance'])
                            }
                        }
                    }

                    // 资产信息
                    if (this.game_assets[k].hasOwnProperty('nfts')) {
                        var assets_prop = this.objCreate("div")
                        assets_prop.classList.add("pc_assetsprop")
                        this.ObjAppend(this.game_assets_element, assets_prop)

                        for (var i = 0; i < 5; i++) {
                            var prop = this.objCreate("a")
                            prop.classList.add("pc_prop")
                            this.ObjAppend(assets_prop, prop)
                            var propimg = this.objCreate("img") as HTMLImageElement
                            propimg.src = Main.resHost + "res/img/game0.png"
                            this.ObjAppend(prop, propimg)
                            var propname = this.objCreate("span")
                            this.ObjAppend(prop, propname)
                            propname.textContent = "撒旦之力什么鬼"
                        }

                        // 更多
                        var assets_more = this.objCreate("div")
                        assets_more.classList.add("pc_assetsmore")
                        this.ObjAppend(this.game_assets_element, assets_more)
                        var more_btn = this.objCreate("button")
                        more_btn.classList.add("pc_assetsmorebtn", "iconfont", "icon-bc-gengduo1")
                        this.ObjAppend(assets_more, more_btn)
                    }
                }
            }
        }
    }
}