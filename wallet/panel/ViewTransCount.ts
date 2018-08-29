/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易数量视图
    export class ViewTransCount extends ViewBase {

        private selectTransfertype: HTMLSelectElement;
        private divtransfername: HTMLDivElement;
        private divHaveAmounts: HTMLDivElement;
        private spanHaveSGasAmounts: HTMLSpanElement;
        private spanHaveGasAmounts: HTMLSpanElement;
        private labeltransfername1: HTMLLabelElement;
        private labeltransfername2: HTMLLabelElement;


        private divSpeed: HTMLElement;
        private divHaveGasAmounts: HTMLDivElement;
        private divHaveSGasAmounts: HTMLDivElement;
        private inputFree: HTMLInputElement;
        private inputcharge: HTMLInputElement;
        private divServiceCharge: HTMLElement;

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
                itransfertype.classList.add("iconfont", "icon-jiantou2")
                this.ObjAppend(this.divtransfername, itransfertype)

                //代币名
                this.labeltransfername2 = this.objCreate("label") as HTMLLabelElement
                this.labeltransfername2.textContent = Main.langMgr.get("pay_transCount" + ViewTransCount.transTypename2)
                this.ObjAppend(this.divtransfername, this.labeltransfername2)
            } else {
                // 选择交易类型
                this.selectTransfertype = this.objCreate("select") as HTMLSelectElement
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
                optionSgas.innerHTML ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+  Main.langMgr.get("pay_transCountGAS2SGAS") // "SGAS"
                this.ObjAppend(this.selectTransfertype, optionSgas)

                // 选择GAS类型
                var optionGas = this.objCreate("option") as HTMLOptionElement
                optionGas.value = Main.langMgr.get("pay_transCountSGAS2GAS") // "GAS"
                optionGas.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ Main.langMgr.get("pay_transCountSGAS2GAS")
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

            // 拥有GAS
            this.divHaveGasAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveGasAmounts.textContent = "GAS：" + Main.getStringNumber(Main.viewMgr.payView.gas)
            this.ObjAppend(this.divHaveAmounts, this.divHaveGasAmounts)


            // 拥有SGAS
            this.divHaveSGasAmounts = this.objCreate("div") as HTMLDivElement
            if (ViewTransCount.transTypename1 == "SGASOLD2OLD") {
                this.divHaveSGasAmounts.textContent = "SGAS(old)：" + ViewTransCount.transBalances
            }else{
                this.divHaveSGasAmounts.textContent = "SGAS：" + Main.getStringNumber(Main.viewMgr.payView.sgas)
            }
            this.ObjAppend(this.divHaveAmounts, this.divHaveSGasAmounts)

            //交易速度
            this.divSpeed = this.objCreate("div") as HTMLElement;
            this.divSpeed.classList.add("pc_speed")
            this.ObjAppend(popupbox, this.divSpeed)

            var divSpeedtips = this.objCreate("ul")
            divSpeedtips.innerHTML =
                "<li>"
                + Main.langMgr.get('pay_transCountTips_free') + "</li><li>"
                + Main.langMgr.get('pay_transCountTips_slow') + "</li><li>"
                + Main.langMgr.get('pay_transCountTips_fast')
                + "</li>"
            this.ObjAppend(this.divSpeed, divSpeedtips)


            // 交易速度选择
            var divSpeedSelect = this.objCreate("div")
            divSpeedSelect.textContent = Main.langMgr.get("pay_transCount_speed") //交易速度
            this.ObjAppend(this.divSpeed, divSpeedSelect)

            // 免费选择
            this.inputFree = this.objCreate("input") as HTMLInputElement
            this.inputFree.classList.add("iconfont", "icon-shandian")
            this.inputFree.type = "radio"
            this.inputFree.onclick = () => {
                this.dofree()
            }
            this.ObjAppend(divSpeedSelect, this.inputFree)

            var divEllipsis = this.objCreate("div")
            divEllipsis.classList.add("pc_ellipsis")
            divEllipsis.innerHTML = "<label></label><label></label><label></label><label></label><label></label><label></label>"
            this.ObjAppend(divSpeedSelect, divEllipsis)

            // 收费选择
            this.inputcharge = this.objCreate("input") as HTMLInputElement
            this.inputcharge.type = "range"
            this.inputcharge.value = '0'
            this.inputcharge.max = "5"
            this.inputcharge.oninput = () => {
                this.dospeed()
            }
            this.inputcharge.onclick = () => {
                this.dospeed()
            }
            this.ObjAppend(divSpeedSelect, this.inputcharge)

            // 手续费
            this.divServiceCharge = this.objCreate("div")
            if (this.inputcharge.value == "0") {
                this.inputcharge.classList.add("pc_active")
                this.divServiceCharge.textContent = Main.langMgr.get("pay_transCount_cost") + "0.00000001" + Main.langMgr.get("gas")
            }
            this.ObjAppend(this.divSpeed, this.divServiceCharge)

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

            this.dospeed()
            this.doGetBalances()
        }

        toRefer() {
            if (ViewTransCount.refer) {
                Main.viewMgr.change(ViewTransCount.refer);
                ViewTransCount.refer = null;
            }
        }

        private dofree() {
            this.inputcharge.classList.remove("pc_active")
            this.net_fee = "0"
            this.divServiceCharge.textContent = Main.langMgr.get("pay_transCount_cost") + this.net_fee + " " + Main.langMgr.get("gas")
            var v = this.inputCount.value;
            if(v.length == 0 || v.replace(/(^s*)|(s*$)/g, "").length ==0){ 
                this.spanHaveGasAmounts.textContent = ""
            }else{
                this.divHaveAmounts.classList.add("pc_haveamountssgas")
                this.divHaveAmounts.classList.remove("pc_haveamountsgas")
                this.spanHaveGasAmounts.textContent = Main.getStringNumber(floatNum.plus( Number(this.inputCount.value) , Number(this.net_fee)));
            }
            
        }

        private dospeed() {
            this.inputcharge.classList.add("pc_active")
            this.inputFree.checked = false

            switch (this.inputcharge.value) {
                case "0":
                    this.net_fee = "0.00000001"
                    
                    break;
                case "1":
                    this.net_fee = "0.0000001"
                    break;
                case "2":
                    this.net_fee = "0.000001"
                    break;
                case "3":
                    this.net_fee = "0.00001"
                    break;
                case "4":
                    this.net_fee = "0.0001"
                    break;
                case "5":
                    this.net_fee = "0.001"
                    break;
            }
            this.divServiceCharge.textContent = Main.langMgr.get("pay_transCount_cost") + this.net_fee + " " + Main.langMgr.get("gas")
            if (ViewTransCount.transTypename1 == "GAS2SGAS") {
                var v = this.inputCount.value;
                if(v.length == 0 || v.replace(/(^s*)|(s*$)/g, "").length ==0){
                    this.spanHaveGasAmounts.textContent = ""
                }else{
                    this.divHaveAmounts.classList.add("pc_haveamountssgas")
                    this.divHaveAmounts.classList.remove("pc_haveamountsgas")
                    this.spanHaveGasAmounts.textContent = Main.getStringNumber(floatNum.plus( Number(this.inputCount.value) , Number(this.net_fee)));
                }
               
            }
        }

        private dotransfertype() {

            if (this.selectTransfertype.value == "GAS") {
                this.divHaveAmounts.classList.remove("pc_haveamountssgas")
                this.inputCount.value = ""
                ViewTransCount.transTypename1 = "SGAS2GAS"
                this.divSpeed.style.display = "none" //SGAS兑换GAS时隐藏手续费

            } else if (this.selectTransfertype.value == "SGAS") {
                this.divHaveAmounts.classList.remove("pc_haveamountsgas")
                this.inputCount.value = ""
                ViewTransCount.transTypename1 = "GAS2SGAS"
                this.divSpeed.style.display = "block" //GAS兑换SGAS时显示手续费

            }
            this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = ""
            this.inputCount.focus()
        }

        private doinputchange() {
            if (!Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                this.divHaveAmounts.classList.remove("pc_haveamountsgas", "pc_haveamountssgas")
                this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = ""
                return
            }
            if (ViewTransCount.transTypename1 == "SGAS2GAS") {
                this.divHaveAmounts.classList.add("pc_haveamountsgas")
                this.divHaveAmounts.classList.remove("pc_haveamountssgas")
                this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = this.inputCount.value;

            }
            if (ViewTransCount.transTypename1 == "GAS2SGAS") {
                this.divHaveAmounts.classList.add("pc_haveamountssgas")
                this.divHaveAmounts.classList.remove("pc_haveamountsgas")
                this.spanHaveSGasAmounts.textContent =  this.inputCount.value;
                this.spanHaveGasAmounts.textContent = Main.getStringNumber(floatNum.plus( Number(this.inputCount.value) , Number(this.net_fee)));
            }
            if (ViewTransCount.transTypename1 == "SGASOLD2OLD") {
                this.divHaveAmounts.classList.add("pc_haveamountsgas")
                this.spanHaveSGasAmounts.textContent = this.spanHaveGasAmounts.textContent = this.inputCount.value + this.net_fee;
            }

        }


        private doConfirm() {
            if (ViewTransCount.transTypename1 != "SGASOLD2OLD") {
                if (this.selectTransfertype.value != "GAS" && this.selectTransfertype.value != "SGAS") {
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
                    break;
                case 'GAS2SGAS':
                    if (Main.viewMgr.payView.gas < Number(this.inputCount.value)) {
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
                if (ViewTransCount.transTypename1 == "SGASOLD2OLD") {
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