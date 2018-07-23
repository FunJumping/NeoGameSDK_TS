/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 收款视图
    export class PayReceivablesView extends ViewBase {

        private inputGasCount: HTMLInputElement;
        private inputTransferAddr: HTMLInputElement;
        private textareaAddress: HTMLElement

        private gasBalance: number;
        private toaddress: string;
        private isDomain: boolean;
        private addrerr: string;


        constructor() {
            super();

            this.gasBalance = Main.viewMgr.payView.gas;
            this.toaddress = "";
            this.isDomain = false;
            this.addrerr = "";
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
            popupTitle.innerText = Main.langMgr.get("pay_received") // "收款"
            this.ObjAppend(popupbox, popupTitle)



            //转账容器
            this.textareaAddress = this.objCreate("textarea")
            this.textareaAddress.classList.add("pc_receivables")
            this.textareaAddress.setAttribute("readonly", "readonly")
            this.textareaAddress.innerHTML = Main.user.info.wallet
            this.ObjAppend(popupbox, this.textareaAddress)


            // 弹窗按钮的框
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

            // 复制
            var butreceivables = this.objCreate("button")
            butreceivables.textContent = Main.langMgr.get("copy") //"复制"
            butreceivables.onclick = () => {
                var idcopy = this.textareaAddress as HTMLInputElement;
                idcopy.select();
                document.execCommand("Copy");
            }
            this.ObjAppend(popupbutbox, butreceivables)
        }

        toRefer() {
            if (PayTransferView.refer) {
                Main.viewMgr.change(PayTransferView.refer)
                PayTransferView.refer = null;
            }
        }


    }
}