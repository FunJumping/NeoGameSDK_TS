/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易数量视图
    export class ViewTransCount extends ViewBase {

        private divHaveAmounts: HTMLDivElement;
        private spanHaveSGasAmounts: HTMLSpanElement;
        private spanHaveGasAmounts: HTMLSpanElement;
        private labeltransfername1: HTMLLabelElement;
        private labeltransfername2: HTMLLabelElement;

        private divHaveGasAmounts: HTMLDivElement;
        private divHaveSGasAmounts: HTMLDivElement;

        static transTypename1: string;
        static transTypename2: string;
        static transAmountsType: string;
        static transBalances: string;

        inputCount: HTMLInputElement

        start() {
            super.start()
            this.inputCount.focus()

            if (ViewTransCount.transTypename1 == "OLD") {
                this.div.classList.add("pc_old")
                this.labeltransfername1.textContent = Main.langMgr.get("pay_transCount" + ViewTransCount.transTypename1)
                this.labeltransfername2.textContent = Main.langMgr.get("pay_transCount" + ViewTransCount.transTypename2)
                this.divHaveSGasAmounts.textContent = "SGAS(old)：" + ViewTransCount.transBalances
                this.divHaveGasAmounts.textContent = "GAS：" + Main.getStringNumber(Main.viewMgr.payView.gas)

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

            //代币名
            this.labeltransfername1 = this.objCreate("label") as HTMLLabelElement
            this.labeltransfername1.textContent = Main.langMgr.get("pay_transCount" + ViewTransCount.transTypename1)
            this.ObjAppend(divtransfertype, this.labeltransfername1)

            //转换标签
            var itransfertype = this.objCreate("i")
            itransfertype.classList.add("iconfont")
            if (ViewTransCount.transTypename1 == "OLD") {
                itransfertype.classList.add("icon-jiantou2")
            } else {
                itransfertype.classList.add("icon-jiantou")
            }

            itransfertype.onclick = () => {
                this.dotransfertype()
            }
            this.ObjAppend(divtransfertype, itransfertype)

            //代币名
            this.labeltransfername2 = this.objCreate("label") as HTMLLabelElement
            this.labeltransfername2.textContent = Main.langMgr.get("pay_transCount" + ViewTransCount.transTypename2)
            this.ObjAppend(divtransfertype, this.labeltransfername2)

            // 输入数量框
            this.inputCount = this.objCreate("input") as HTMLInputElement
            this.inputCount.type = "text"
            this.inputCount.style.margin = "0 auto 10px"
            this.inputCount.style.width = "80%"
            this.inputCount.placeholder = Main.langMgr.get("pay_transCount_input" + ViewTransCount.transAmountsType) // "请输入数量"
            this.inputCount.onkeyup = () => {
                this.doinputchange()
            }
            this.ObjAppend(popupbox, this.inputCount)

            // 拥有GAS和SGAS数量
            this.divHaveAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveAmounts.classList.add("pc_haveamounts")
            this.ObjAppend(popupbox, this.divHaveAmounts)

            // 拥有GAS
            this.divHaveGasAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveGasAmounts.textContent = "GAS：" + Main.getStringNumber(Main.viewMgr.payView.gas)
            this.ObjAppend(this.divHaveAmounts, this.divHaveGasAmounts)

          

            // 拥有SGAS
            this.divHaveSGasAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveSGasAmounts.textContent = "SGAS：" + Main.getStringNumber(Main.viewMgr.payView.sgas)
            this.ObjAppend(this.divHaveAmounts, this.divHaveSGasAmounts)

           
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

            this.doGetBalances()
        }

        toRefer() {
            if (ViewTransCount.refer) {
                Main.viewMgr.change(ViewTransCount.refer);
                ViewTransCount.refer = null;
            }
        }
        private dotransfertype() {

            if (ViewTransCount.transTypename1 == "GAS") {
                ViewTransCount.transTypename2 = "GAS"
                ViewTransCount.transTypename1 = "SGAS"
                this.labeltransfername1.textContent = ViewTransCount.transTypename1
                this.labeltransfername2.textContent = ViewTransCount.transTypename2
                this.divHaveAmounts.classList.remove("pc_haveamountssgas")
                this.inputCount.value = ""
                this.inputCount.placeholder = Main.langMgr.get("pay_transCount_inputGASCount") // "请输入数量"
            } else if (ViewTransCount.transTypename1 == "SGAS") {
                ViewTransCount.transTypename2 = "SGAS"
                ViewTransCount.transTypename1 = "GAS"
                this.labeltransfername1.textContent = ViewTransCount.transTypename1
                this.labeltransfername2.textContent = ViewTransCount.transTypename2
                this.divHaveAmounts.classList.remove("pc_haveamountsgas")
                this.inputCount.value = ""
                this.inputCount.placeholder = Main.langMgr.get("pay_transCount_inputSGASCount") // "请输入数量"
            }
            this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = ""
        }

        private doinputchange() {
            if (!Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                this.divHaveAmounts.classList.remove("pc_haveamountsgas", "pc_haveamountssgas")
                this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = ""
                return
            }
            if (ViewTransCount.transTypename1 == "GAS") {
                this.divHaveAmounts.classList.add("pc_haveamountssgas")
                this.divHaveAmounts.classList.remove("pc_haveamountsgas")
                this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = this.inputCount.value

            }
            if (ViewTransCount.transTypename1 == "SGAS") {
                this.divHaveAmounts.classList.add("pc_haveamountsgas")
                this.divHaveAmounts.classList.remove("pc_haveamountssgas")
                this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = this.inputCount.value
            }
            if (ViewTransCount.transTypename1 == "OLD") {
                this.divHaveAmounts.classList.add("pc_haveamountsgas")
                this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = this.inputCount.value

            }

        }


        private doConfirm() {
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
                case 'SGAS':
                    if (Main.viewMgr.payView.sgas < Number(this.inputCount.value)) {
                        Main.showErrMsg('pay_makeRefundSgasNotEnough', () => {
                            this.inputCount.focus()
                        })
                        return
                    }
                    break;
                case 'GAS':
                    if (Main.viewMgr.payView.gas < Number(this.inputCount.value)) {
                        Main.showErrMsg('pay_makeMintGasNotEnough', () => {
                            this.inputCount.focus()
                        })
                        return
                    }
                    break;
                case 'OLD':
                    if (Number(ViewTransCount.transBalances) < Number(this.inputCount.value)) {
                        Main.showErrMsg('pay_makeRefundSgasOldNotEnough', () => {
                            this.inputCount.focus()
                        })
                        return
                    }
                    break;
            }

            this.remove(300)

            ViewTransCount.callback();
            ViewTransCount.callback = null;
        }

        async doGetBalances() {
            setTimeout(() => {
                this.divHaveSGasAmounts.innerHTML = "SGAS：" + Main.getStringNumber(Main.viewMgr.payView.sgas)
                this.divHaveGasAmounts.innerHTML = "GAS：" + Main.getStringNumber(Main.viewMgr.payView.gas)
                if (ViewTransCount.transTypename1 == "OLD") {
                    this.divHaveSGasAmounts.textContent = "SGAS(old)：" + ViewTransCount.transBalances
                }
                  // GAS交易数量
                this.spanHaveGasAmounts = this.objCreate("span")
                this.ObjAppend(this.divHaveGasAmounts, this.spanHaveGasAmounts)

                // SGAS交易数量
                this.spanHaveSGasAmounts = this.objCreate("span")
                this.ObjAppend(this.divHaveSGasAmounts, this.spanHaveSGasAmounts)
                }, 100)

        }
    }
}