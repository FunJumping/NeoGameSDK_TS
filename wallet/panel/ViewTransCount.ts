/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易数量视图
    export class ViewTransCount extends ViewBase {

        private selectTransfertype: HTMLSelectElement;
        private divtransfername: HTMLDivElement;


        private labeltransfername1: HTMLLabelElement;
        private labeltransfername2: HTMLLabelElement;

        private divHaveAmounts: HTMLDivElement; // 余额信息
        private divHaveGasAmounts: HTMLDivElement;  // GAS余额
        private spanHaveGasAmounts: HTMLSpanElement;    // GAS变化
        private divHaveSGasAmounts: HTMLDivElement; // SGAS余额
        private spanHaveSGasAmounts: HTMLSpanElement; // SGAS变化

        private netFeeCom: NetFeeComponent; // 手续费组件


        static transTypename1: string;
        static transTypename2: string;
        static transBalances: string;

        inputCount: HTMLInputElement
        net_fee: string // 网络交易费

        start() {
            super.start()

            if (ViewTransCount.transTypename1 == "SGASOLD2OLD") {
                this.inputCount.focus()
            }

        }
        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_popup")
            //弹窗的框
            var popupbox = this.objCreate('div')
            popupbox.classList.add("pc_popupbox")
            this.ObjAppend(this.div, popupbox)

            // 弹窗的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_popup_title")
            popupTitle.innerText = Main.langMgr.get("pay_transCount_count") // "兑换"
            this.ObjAppend(popupbox, popupTitle)



            // 类型
            var divtransfertype = this.objCreate("div")
            divtransfertype.classList.add("pc_transfertype", "pc_token")
            this.ObjAppend(popupbox, divtransfertype)




            if (ViewTransCount.transTypename1 == "SGASOLD2OLD") {
                this.divtransfername = this.objCreate("div") as HTMLDivElement
                this.ObjAppend(divtransfertype, this.divtransfername)

                //代币名
                this.labeltransfername1 = this.objCreate("label") as HTMLLabelElement
                this.labeltransfername1.textContent = Main.langMgr.get("pay_transCount" + ViewTransCount.transTypename1)
                this.ObjAppend(this.divtransfername, this.labeltransfername1)

                //转换标签
                var itransfertype = this.objCreate("i")
                itransfertype.classList.add("iconfont", "icon-bc-jiantou1")
                this.ObjAppend(this.divtransfername, itransfertype)

                //代币名
                this.labeltransfername2 = this.objCreate("label") as HTMLLabelElement
                this.labeltransfername2.textContent = Main.langMgr.get("pay_transCount" + ViewTransCount.transTypename2)
                this.ObjAppend(this.divtransfername, this.labeltransfername2)
            } else {
                // 选择交易类型
                this.selectTransfertype = this.objCreate("select") as HTMLSelectElement
                this.selectTransfertype.classList.add("iconfont")
                this.selectTransfertype.onchange = () => {
                    this.dotransfertype()
                }
                this.ObjAppend(divtransfertype, this.selectTransfertype)

                // 选择类型提示
                var optionTips = this.objCreate("option") as HTMLOptionElement
                optionTips.innerHTML = Main.langMgr.get("pay_transCount_tips") // "选择您要兑换的代币"
                optionTips.selected = true
                optionTips.disabled = true
                optionTips.style.display = "none"
                this.ObjAppend(this.selectTransfertype, optionTips)

                // 选择SGAS类型
                var optionSgas = this.objCreate("option") as HTMLOptionElement
                optionSgas.value = Main.langMgr.get("pay_transCountGAS2SGAS") // "SGAS"
                optionSgas.innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ Main.langMgr.get("pay_transCountSGAS2GAS") +"&#xbc635;"+ Main.langMgr.get("pay_transCountGAS2SGAS") // "SGAS"
                this.ObjAppend(this.selectTransfertype, optionSgas)

                // 选择GAS类型
                var optionGas = this.objCreate("option") as HTMLOptionElement
                optionGas.value = Main.langMgr.get("pay_transCountSGAS2GAS") // "GAS"
                optionGas.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + Main.langMgr.get("pay_transCountGAS2SGAS") +"&#xbc635;"+Main.langMgr.get("pay_transCountSGAS2GAS")
                this.ObjAppend(this.selectTransfertype, optionGas)

            }
            // 输入数量框
            this.inputCount = this.objCreate("input") as HTMLInputElement
            this.inputCount.type = "text"
            this.inputCount.style.margin = "0 auto 10px"
            this.inputCount.style.width = "80%"
            this.inputCount.placeholder = Main.langMgr.get("pay_transCount_inputCount") // "请输入数量"
            this.inputCount.onkeyup = () => {
                this.doinputchange()
            }
            this.ObjAppend(popupbox, this.inputCount)

            // 拥有GAS和SGAS数量
            this.divHaveAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveAmounts.classList.add("pc_haveamounts")
            this.ObjAppend(popupbox, this.divHaveAmounts)


            // 拥有SGAS
            this.divHaveSGasAmounts = this.objCreate("div") as HTMLDivElement
            if (ViewTransCount.transTypename1 == "SGASOLD2OLD") {
                this.divHaveSGasAmounts.textContent = Main.langMgr.get("pay_transCountSGASOLD") + ViewTransCount.transBalances
            } else {
                this.divHaveSGasAmounts.textContent = Main.langMgr.get("pay_transCountSGAS") + Main.getStringNumber(Main.viewMgr.payView.sgas)
            }
            this.ObjAppend(this.divHaveAmounts, this.divHaveSGasAmounts)

            // SGAS交易数量
            this.spanHaveSGasAmounts = this.objCreate("span")
            this.ObjAppend(this.divHaveSGasAmounts, this.spanHaveSGasAmounts)

            // 拥有GAS
            this.divHaveGasAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveGasAmounts.textContent = Main.langMgr.get("pay_transCountGAS") + Main.getStringNumber(Main.viewMgr.payView.gas)
            this.ObjAppend(this.divHaveAmounts, this.divHaveGasAmounts)

            // GAS交易数量
            this.spanHaveGasAmounts = this.objCreate("span")
            this.ObjAppend(this.divHaveGasAmounts, this.spanHaveGasAmounts)

            // 手续费组件
            if (this.showNetFee()) {
                // 手续费
                this.netFeeCom = new NetFeeComponent(popupbox, (net_fee) => {
                    this.netFeeChange(net_fee)
                })
                this.netFeeCom.setFeeDefault()
                this.netFeeCom.createDiv()
            }
            else {
                this.net_fee = "0"
            }


            // 弹窗按钮外框
            var popupbutbox = this.objCreate('div')
            popupbutbox.classList.add("pc_popupbutbox")
            this.ObjAppend(popupbox, popupbutbox)

            // 取消
            var popupClose = this.objCreate('button')
            popupClose.classList.add("pc_cancel")
            popupClose.textContent = Main.langMgr.get("cancel") // "取消"
            popupClose.onclick = () => {
                this.remove(300)
            }
            this.ObjAppend(popupbutbox, popupClose)

            var confirmObj = this.objCreate("button")
            confirmObj.textContent = Main.langMgr.get("ok") // "确认"
            confirmObj.onclick = () => {
                this.doConfirm()
            }
            this.ObjAppend(popupbutbox, confirmObj)
        }

        toRefer() {
            if (ViewTransCount.refer) {
                Main.viewMgr.change(ViewTransCount.refer);
                ViewTransCount.refer = null;
            }
        }

        private dotransfertype() {

            if (this.selectTransfertype.value == Main.langMgr.get("pay_transCountSGAS2GAS")) {
                this.divHaveGasAmounts.classList.remove("pc_income", "pc_expenditure")
                this.divHaveSGasAmounts.classList.remove("pc_income", "pc_expenditure")
                this.inputCount.value = ""
                ViewTransCount.transTypename1 = "SGAS2GAS"
                if (this.showNetFeeSGAS2GAS() === false) {
                    this.netFeeCom.hidden() //SGAS兑换GAS时隐藏手续费
                }
                else {
                    this.netFeeCom.setNetFeeShowRate(2)
                }
            } else if (this.selectTransfertype.value == Main.langMgr.get("pay_transCountGAS2SGAS")) {
                this.divHaveGasAmounts.classList.remove("pc_income", "pc_expenditure")
                this.divHaveSGasAmounts.classList.remove("pc_income", "pc_expenditure")
                this.inputCount.value = ""
                ViewTransCount.transTypename1 = "GAS2SGAS"
                this.netFeeCom.setNetFeeShowRate(1)
                this.netFeeCom.show() //GAS兑换SGAS时显示手续费
            }
            this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = ""
            this.inputCount.focus()
        }

        private doinputchange() {
            if (!Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                this.divHaveGasAmounts.classList.remove("pc_income", "pc_expenditure")
                this.divHaveSGasAmounts.classList.remove("pc_income", "pc_expenditure")
                this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = ""
                return
            }
            if (ViewTransCount.transTypename1 == "SGAS2GAS" || ViewTransCount.transTypename1 == "SGASOLD2OLD") {

                if (Number(this.inputCount.value) - Number(this.net_fee) * 2 <= 0 ) {
                    // 如果有手续费，并且手续费大于兑换金额，提示错误
                    Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                        this.inputCount.focus()
                    })
                    return
                }

                this.divHaveGasAmounts.classList.add("pc_income")
                this.divHaveSGasAmounts.classList.add("pc_expenditure")
                this.spanHaveSGasAmounts.textContent = this.inputCount.value;
                this.spanHaveGasAmounts.textContent = Main.getStringNumber(floatNum.minus(Number(this.inputCount.value), Number(this.net_fee)*2));
            }
            else if (ViewTransCount.transTypename1 == "GAS2SGAS") {
                this.divHaveGasAmounts.classList.add("pc_expenditure")
                this.divHaveSGasAmounts.classList.add("pc_income")
                this.spanHaveSGasAmounts.textContent = this.inputCount.value;
                this.spanHaveGasAmounts.textContent = Main.getStringNumber(floatNum.plus(Number(this.inputCount.value), Number(this.net_fee)));
            }
        }


        private doConfirm() {
            if (ViewTransCount.transTypename1 != "SGASOLD2OLD") {
                if (this.selectTransfertype.value != Main.langMgr.get("pay_transCountSGAS2GAS") && this.selectTransfertype.value !=  Main.langMgr.get("pay_transCountGAS2SGAS") ) {
                    Main.showErrMsg('pay_transCount_tips_err', () => {
                        this.inputCount.focus()
                    })
                    return
                }
            }
            if (!this.inputCount.value) {
                this.inputCount.focus()
                return
            }

            if (!Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                Main.showErrMsg('pay_transCount_err', () => {
                    this.inputCount.focus()
                })
                return
            }

            // 余额判断
            switch (ViewTransCount.transTypename1) {
                case 'SGAS2GAS':
                    if (Main.viewMgr.payView.sgas < Number(this.inputCount.value)) {
                        Main.showErrMsg('pay_makeRefundSgasNotEnough', () => {
                            this.inputCount.focus()
                        })
                        return
                    }
                    // 手续费判断
                    if (Number(this.net_fee) > 0) {
                        if (Main.viewMgr.payView.gas < Number(this.net_fee)) {
                            Main.showErrMsg("pay_makeRefundGasFeeNotEnough", () => {
                                this.inputCount.focus()
                            })
                            return
                        }

                        if (Number(this.inputCount.value) - Number(this.net_fee) * 2 <= 0 ) {
                            // 如果有手续费，并且手续费大于兑换金额，提示错误
                            Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                                this.inputCount.focus()
                            })
                            return
                        }
                    }
                    break;
                case 'GAS2SGAS':
                    if (Main.viewMgr.payView.gas < Number(this.inputCount.value) + Number(this.net_fee)) {
                        Main.showErrMsg('pay_makeMintGasNotEnough', () => {
                            this.inputCount.focus()
                        })
                        return
                    }
                    break;
                case 'SGASOLD2OLD':
                    if (Number(ViewTransCount.transBalances) < Number(this.inputCount.value)) {
                        Main.showErrMsg('pay_makeRefundSgasOldNotEnough', () => {
                            this.inputCount.focus()
                        })
                        return
                    }
                    // 手续费判断
                    if (Number(this.net_fee) > 0) {
                        if (Main.viewMgr.payView.gas < Number(this.net_fee)) {
                            Main.showErrMsg("pay_makeRefundGasFeeNotEnough", () => {
                                this.inputCount.focus()
                            })
                            return
                        }

                        if (Number(this.inputCount.value) - Number(this.net_fee)*2 <= 0 ) {
                            // 如果有手续费，并且手续费大于兑换金额，提示错误
                            Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                                this.inputCount.focus()
                            })
                            return
                        }
                    }
                    break;
            }

            this.remove(300)

            ViewTransCount.callback();
            ViewTransCount.callback = null;
        }
        // 是否加载&显示手续费组件
        private showNetFee(): boolean {
            if (ViewTransCount.transTypename1 == "SGASOLD2OLD") {
                if (tools.CoinTool.id_SGAS_OLD[0] == "0x961e628cc93d61bf636dc0443cf0548947a50dbe") {
                    return false
                }
            }
            return true
        }
        // SGAS2GAS手续费是否显示
        private showNetFeeSGAS2GAS(): boolean {
            if (tools.CoinTool.id_SGAS == "0x961e628cc93d61bf636dc0443cf0548947a50dbe") {
                return false
            }
            return true
        }

        private netFeeChange(net_fee) {

            this.net_fee = net_fee

            var v = this.inputCount.value;
            // 没有输入值，返回
            if (v.length == 0 || v.replace(/(^s*)|(s*$)/g, "").length == 0) {
                return
            }
            // 修改GAS值
            if (ViewTransCount.transTypename1 == "SGAS2GAS" || ViewTransCount.transTypename1 == "SGASOLD2OLD") {
                // 退回GAS，需要减去手续费到GAS
                if (Number(v) - Number(this.net_fee)*2 <= 0 ) {
                    // 如果有手续费，并且手续费大于兑换金额，提示错误
                    Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                        this.inputCount.focus()

                        this.divHaveGasAmounts.classList.remove("pc_income")
                        this.divHaveSGasAmounts.classList.remove("pc_expenditure")

                        this.spanHaveSGasAmounts.textContent = ""
                        this.spanHaveGasAmounts.textContent = ""
                    })
                    return
                }

                this.divHaveGasAmounts.classList.add("pc_income")
                this.divHaveSGasAmounts.classList.add("pc_expenditure")
                this.spanHaveSGasAmounts.textContent = this.inputCount.value;
                this.spanHaveGasAmounts.textContent = Main.getStringNumber(floatNum.minus(Number(this.inputCount.value), Number(this.net_fee)*2));
            }
            else {
                // 兑换SGAS，需要加上手续费到GAS
                this.spanHaveGasAmounts.textContent = Main.getStringNumber(floatNum.plus(Number(v), Number(this.net_fee)));
            }
        }

        updateBalance() {
            // gas
            this.divHaveGasAmounts.textContent = Main.langMgr.get("pay_transCountGAS") + Main.getStringNumber(Main.viewMgr.payView.gas)
            // sgas
            if (ViewTransCount.transTypename1 == "SGASOLD2OLD") {
                this.divHaveSGasAmounts.textContent = Main.langMgr.get("pay_transCountSGASOLD") + ViewTransCount.transBalances
            } else {
                this.divHaveSGasAmounts.textContent = Main.langMgr.get("pay_transCountSGAS") + Main.getStringNumber(Main.viewMgr.payView.sgas)
            }
        }
    }
}