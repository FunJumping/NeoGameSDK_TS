/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易所购买详情
    export class PayExchangeDetailView extends ViewBase {

        private inputGas: HTMLInputElement;
        private inputNEO: HTMLInputElement;


        private balanceHtmlElement: HTMLElement
        private balance: number = 0

        private netFeeCom: NetFeeComponent; // 手续费组件

        private net_fee: string;

        private nnc: string;
        private destoryAddr: string;
        private buyFail: string;

        private s_getWalletLists = {};


        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_exchangedetail", "buygas")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            //返回
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.doCancel()
            }
            this.ObjAppend(header, returnA)

            //标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("pay_exchange_" + PayExchangeDetailView.callback_params.type.toLowerCase()) // "购买XX"
            this.ObjAppend(header, headerH1)

            //交易所类型
            var divExchange = this.objCreate("div")
            divExchange.classList.add("pc_exchangetitle")
            this.ObjAppend(this.div, divExchange)

            //交易所类型详情
            var divEcvhangeObj = this.objCreate("div")
            divEcvhangeObj.classList.add("pc_exchangelist")
            this.ObjAppend(divExchange, divEcvhangeObj)
            //名称
            var divExchangeName = this.objCreate("div")
            divExchangeName.classList.add("pc_exchangename")


            //名称类型
            var pExchangeName = this.objCreate("p")
            pExchangeName.textContent = PayExchangeDetailView.callback_params.type + "/" + PayExchangeDetailView.callback_params.type_src
            this.ObjAppend(divExchangeName, pExchangeName)

            this.ObjAppend(divEcvhangeObj, divExchangeName)


            //最新价
            var divNewPrice = this.objCreate("div")
            divNewPrice.classList.add("pc_exchangeprice")

            //最新价名称
            var divNewPriceName = this.objCreate("label")
            divNewPriceName.textContent = Main.langMgr.get("pay_exchange_price") // "最新价"
            this.ObjAppend(divNewPrice, divNewPriceName)

            //最新价格
            var pNewPrice = this.objCreate("p")
            pNewPrice.textContent = PayExchangeDetailView.callback_params.price;
            this.ObjAppend(divNewPrice, pNewPrice)

            this.ObjAppend(divEcvhangeObj, divNewPrice)

            //余额
            var divBalance = this.objCreate("div")
            divBalance.classList.add("pc_exchangeprice")

            var labelBalanceName = this.objCreate("label")
            labelBalanceName.textContent = PayExchangeDetailView.callback_params.type_src + Main.langMgr.get("pay_exchange_balance") // "余额"
            this.ObjAppend(divBalance, labelBalanceName)

            // 余额
            this.balanceHtmlElement = this.objCreate("p")
            this.balanceHtmlElement.textContent = "0"
            this.ObjAppend(divBalance, this.balanceHtmlElement)

            var divBalanceObj = this.objCreate("div")
            divBalanceObj.classList.add("pc_exchangelist", "balance")
            this.ObjAppend(this.div, divBalanceObj)

            this.ObjAppend(divBalanceObj, divBalance)

            // 购买GAS
            var divGas = this.objCreate("div")
            divGas.classList.add("pc_exc_purchases")
            // 消耗
            var divConsume = this.objCreate("div")
            divConsume.classList.add("pc_exc_consume")
            this.ObjAppend(divGas, divConsume)

            if (PayExchangeDetailView.callback_params.type_src != "CNEO") {
                // CNEO的暂时先隐藏
                var labelconsume = this.objCreate("a")
                labelconsume.textContent = Main.langMgr.get("pay_exchange_getmore", {type: PayExchangeDetailView.callback_params.type_src})
                this.ObjAppend(divConsume, labelconsume)
    
                labelconsume.onclick = async () => {
                    if(PayExchangeDetailView.callback_params.type_src == 'BCT')
                    {
                        this.hidden()
                        PayExchangeBCTView.refer = "PayExchangeDetailView"
                        Main.viewMgr.change("PayExchangeBCTView")
                    }else{
                        this.showGetMore()
                    }  
                }
            }

            //数量框
            var divGasObj = this.objCreate("div")
            divGasObj.classList.add("pc_exc_inputpurchases")
            var spanGas = this.objCreate("span")
            spanGas.classList.add("buygasspan")

            spanGas.textContent = PayExchangeDetailView.callback_params.type

            this.ObjAppend(divGasObj, spanGas)
            this.ObjAppend(divGas, divGasObj)


            // 购买输入框
            this.inputGas = this.objCreate("input") as HTMLInputElement
            this.inputGas.classList.add("buygasinput")
            this.inputGas.placeholder = Main.langMgr.get("pay_exchange_placeholderconfirm")

            this.ObjAppend(divGasObj, this.inputGas)


            // 数量框
            var divGasObj = this.objCreate("div")
            divGasObj.classList.add("pc_exc_inputpurchases")
            var spanGas = this.objCreate("span")
            spanGas.classList.add("buygasspan")

            spanGas.textContent = PayExchangeDetailView.callback_params.type_src

            this.ObjAppend(divGasObj, spanGas)
            this.ObjAppend(divGas, divGasObj)

            // 购买输入框
            this.inputNEO = this.objCreate("input") as HTMLInputElement
            this.inputNEO.classList.add("buygasinput")
            this.inputNEO.placeholder = Main.langMgr.get("pay_exchange_buyNEO")

            this.ObjAppend(divGasObj, this.inputNEO)

            this.inputGas.onkeyup = () => {
                var price = PayExchangeDetailView.callback_params.price
                var count = this.inputGas.value
                var spent = this.getSpent(price, count)           
                this.inputNEO.value = Main.getStringNumber(spent)
            }
            this.inputNEO.onkeyup = () => {
                var price = PayExchangeDetailView.callback_params.price
                var count = this.inputNEO.value
                var payment = this.getpayment(count, price)           
                this.inputGas.value = Main.getStringNumber(payment)
            }
 
            // 是否可以输入
            if (PayExchangeDetailView.callback_params.type_src == "NEO") {
                this.inputGas.disabled = true
                this.inputGas.value = "0"
            }
            else {
                this.inputNEO.disabled = true
                this.inputNEO.value = "0"
            }


            // 手续费
            this.netFeeCom = new NetFeeComponent(divGasObj, (net_fee) => {
                this.net_fee = net_fee
            })
            this.netFeeCom.setFeeDefault()
            this.netFeeCom.createDiv()


            // 购买按钮
            var btnGas = this.objCreate("button")
            btnGas.textContent = Main.langMgr.get("pay_exchange_confirmbuy")
            btnGas.onclick = () => {
                this.buy()
            }
            this.ObjAppend(divGasObj, btnGas)


            this.ObjAppend(this.div, divGas)




            // 获取nep5映射合约、销毁地址
            this.nnc = tools.CoinTool["id_" + PayExchangeDetailView.callback_params.type_src ]

            this.destoryAddr = tools.CoinTool["id_" + PayExchangeDetailView.callback_params.type_src + "_DESTROY"]
            this.buyFail = "pay_exchange_detail_buy_" + PayExchangeDetailView.callback_params.type + "_fail"

            // 获取余额
            this.getBalance()

        }

        toRefer() {
            if (PayExchangeDetailView.refer) {
                Main.viewMgr.change(PayExchangeDetailView.refer)
                PayExchangeDetailView.refer = null;
            }
        }

        key_esc() {
            this.doCancel()
        }

        private doCancel() {
            this.addGetWalletLists()
            this.return()
        }

        //转账
        private async doMakeTransfer() {


            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开转账页
                PayTransferView.callback = () => {
                    Main.viewMgr.payView.doGetWalletLists(1)

                }
                // PayTransferView.address = AddressbookDetailsView.contact.address_wallet
                Main.viewMgr.change("PayTransferView")


            } else {
                // 未打开钱包
                ViewWalletOpen.callback = () => {
                    this.doMakeTransfer()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private checkTransCount(count: string): boolean {
            var regex = /(?!^0*(\.0{1,2})?$)^\d{1,14}(\.\d{1,8})?$/
            if (!regex.test(count)) {
                return false
            }
            if (Number(count) <= 0) {
                return false
            }
            return true
        }

        private async getBalance() {
            if (this.nnc && this.nnc != "") {
                this.balance = Main.viewMgr.payView[PayExchangeDetailView.callback_params.data.type_src]
                this.balanceHtmlElement.textContent = Main.getStringNumber(this.balance)
            }
        }

        private async buy() {
            var price = PayExchangeDetailView.callback_params.price
            var count = this.inputGas.value
            var spent = this.getSpent(price, count)
            var src_count = Main.getStringNumber(spent)

            // 交易数量格式判定
            if (this.checkTransCount(count) === false) {
                this.inputGas.focus()
                return
            }

            // 余额判断
            if (floatNum.times(Number(price), Number(count)) > this.balance) {
                Main.showErrMsg('pay_exchange_balance_not_enough', () => {
                    this.inputGas.focus()
                })
                return
            }

            // 花费最小金额
            var min_count = 0.00000001
            if (PayExchangeDetailView.callback_params.type_src.toLowerCase() == "bct") {
                min_count = 0.0001
            }
            if (floatNum.times(Number(price), Number(count)) < min_count) {
                Main.showErrMsg('pay_exchange_spent_not_enough', () => {
                    this.inputGas.focus()
                })
                return
            }

            var cHash = this.getBuyContractHash()
            if (cHash == "") {
                return
            }

            Main.viewMgr.change("ViewLoading")
            // 购买
            // 1、获取交易txid
            var net_fee = this.net_fee
            var res: any = null


            res = await tools.CoinTool.nep5Transaction(Main.user.info.wallet, this.destoryAddr, this.nnc, src_count, net_fee, true);
            if (res) {
                console.log("[BlaCat]", '[PayExchangeDetailView]', '购买结果 => ', res)
                if (res.err == false) {
                    // 购买
                    var buy_res = await ApiTool.transferByOther(
                        Main.user.info.uid,
                        Main.user.info.token,
                        PayExchangeDetailView.callback_params.type_src.toLowerCase(),
                        PayExchangeDetailView.callback_params.type.toLowerCase(),
                        price,
                        count,
                        Main.netMgr.type,
                        res.info,
                        cHash
                    )
                    if (buy_res) {
                        if (buy_res.r) {
                            if (buy_res.data) {
                                // 发起交易 & 记录oldarr
                                var result = await tools.WWW.api_postRawTransaction(res['data']);
                                if (result["sendrawtransactionresult"]) {
                                    // 记录使用的utxo，后面不再使用，需要记录高度
                                    if (res['oldarr']) {
                                        tools.OldUTXO.oldutxosPush(res['oldarr']);
                                    }
                                }
                                Main.viewMgr.viewLoading.remove()
                                Main.showInfo('pay_exchange_buy_ok', () => {
                                    Main.viewMgr.payView.doGetWalletLists(1)

                                    // 退回到主界面
                                    Main.viewMgr.payExchangeDetailView.return()
                                    Main.viewMgr.payExchangeView.return()
                                })
                                return
                            }
                        }
                        else {
                            Main.viewMgr.viewLoading.remove()
                            Main.showErrCode(buy_res.errCode)
                            return
                        }
                    }
                }
            }

            Main.viewMgr.viewLoading.remove()
            Main.showErrMsg(this.buyFail)
        }
        private getSpent(price: string, count: string, float: number = 100000000): number {
            var tmp = floatNum.times(Number(price), Number(count))
            if (PayExchangeDetailView.callback_params.type_src.toLowerCase() == "bct") {
                float = 10000; // bct 4位精度
            }
            return Math.round(tmp * float) / float
        }
        private getpayment(count: string, price: string, float: number = 100000000 ): number {
            var tmp = floatNum.divide(Number(count), Number(price))
            return Math.round(tmp * float) / float
        }

        private getBuyContractHash() {
            var cHash = ""
            if (tools.CoinTool.hasOwnProperty("id_" + PayExchangeDetailView.callback_params.type)) {
                cHash = tools.CoinTool["id_" + PayExchangeDetailView.callback_params.type]
            }
            return cHash
        }

        // 延时一段时间刷新交易记录
        private addGetWalletLists() {
            var type = PayExchangeDetailView.callback_params.type_src
            var timeout = 1000;
            switch (type) {
                case "BTC":
                    timeout = 15 * 60 * 1000; // 15分钟
                    break;
                case "ETH":
                    timeout = 3 * 60 * 1000; // 3分钟
                    break;
                default:
                    timeout = 2 * 60 * 1000; // 2分钟
                    break;
            }

            if (this.s_getWalletLists.hasOwnProperty(type)) {
                if (this.s_getWalletLists[type]) {
                    clearTimeout(this.s_getWalletLists[type])
                }
            }
            this.s_getWalletLists[type] = setTimeout(() => {
                Main.viewMgr.payView.doGetWalletLists()
            }, timeout);
        }

        private async showGetMore() {
            this.hidden()
            PayExchangeShowWalletView.refer = "PayExchangeDetailView"
            PayExchangeShowWalletView.callback_params = PayExchangeDetailView.callback_params
            PayExchangeShowWalletView.balance = this.balance
            Main.viewMgr.change("PayExchangeShowWalletView")
        }

        updateBalance() {
            this.getBalance()
        }
    }
}