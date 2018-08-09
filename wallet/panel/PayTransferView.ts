/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 转账视图
    export class PayTransferView extends ViewBase {

        private inputGasCount: HTMLInputElement;
        private inputTransferAddr: HTMLInputElement;
        private divTransferAddr: HTMLDivElement;
        private labelName: HTMLLabelElement;

        private gasBalance: string;
        private toaddress: string;

        static address: string = "";
        static contact: contact;

        reset() {
            this.gasBalance = '0';
            this.toaddress = "";
        }

        start() {
            this.gasBalance = Main.viewMgr.payView.gas.toString();
            // 判断一下有没有减号，不用科学计数法表示
            var balanceAmount = Main.viewMgr.payView.gas.toString();
            if (balanceAmount.toString().indexOf('-') >= 0) {
                balanceAmount = '0' + String(Number(balanceAmount) + 1).substr(1);
            }
            this.gasBalance = balanceAmount;

            super.start()

            if (!this.toaddress) {
                this.inputTransferAddr.focus()
            }
            else {
                this.inputGasCount.focus()
            }
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_popup")

            //弹窗的框
            var popupbox = this.objCreate('div')
            popupbox.classList.add("pc_popupbox", "pc_transfer")
            this.ObjAppend(this.div, popupbox)

            // 弹窗的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_popup_title")
            popupTitle.innerText = Main.langMgr.get("pay_transfer") // "转账"
            this.ObjAppend(popupbox, popupTitle)



            //转账容器
            var divtransfer = this.objCreate("div")
            divtransfer.classList.add("pc_transferbox")
            this.ObjAppend(popupbox, divtransfer)

            // 类型
            var divtransfertype = this.objCreate("div")
            divtransfertype.classList.add("pc_transfertype")
            this.ObjAppend(divtransfer, divtransfertype)

            var gasBalancetype = this.objCreate("label");
            gasBalancetype.innerHTML = Main.langMgr.get("pay_transferType") //"转账类型：GAS  " 
            this.ObjAppend(divtransfertype, gasBalancetype)

            // 余额
            var gasBalanceObj = this.objCreate("span");
            gasBalanceObj.classList.add("pc_fr")
            gasBalanceObj.textContent = Main.langMgr.get("pay_transferBalance") + this.gasBalance;
            this.ObjAppend(divtransfertype, gasBalanceObj)


            //输入钱包地址
            this.divTransferAddr = this.objCreate("div") as HTMLDivElement
            this.divTransferAddr.classList.add("pc_transfertype")
            // divTransferAddr.innerText= Main.langMgr.get("pay_transferToAddr") //"转账地址："
            this.ObjAppend(divtransfer, this.divTransferAddr)

            //对方用户名
            this.labelName = this.objCreate("label") as HTMLLabelElement
            this.labelName.classList.add("pc_transfername")
            this.ObjAppend(this.divTransferAddr, this.labelName)

            this.inputTransferAddr = this.objCreate("input") as HTMLInputElement
            this.inputTransferAddr.classList.add("pc_transaddress")
            this.inputTransferAddr.placeholder = Main.langMgr.get("pay_transferToAddr") //"转账地址："
            this.inputTransferAddr.value = this.getAddress()
            this.inputTransferAddr.onfocus=()=>{
                this.inputTransferAddr.select()
            }
            this.inputTransferAddr.onchange=()=>{
                this.divTransferAddr.classList.remove("pc_transfer_active")
                this.inputTransferAddr.style.padding="0 35px 0 5px"
                this.inputTransferAddr.style.width="230px"
            }
            this.ObjAppend(this.divTransferAddr, this.inputTransferAddr)

            //跳到通讯录选择入口
            var aAddresbook = this.objCreate("a")
            aAddresbook.classList.add("pc_transferaddressbook", "iconfont", "icon-tongxunlu")
            aAddresbook.onclick = () => {
                this.hidden()
                Main.viewMgr.payView.hidden()
                AddressbookView.select = "select"
                Main.viewMgr.change("AddressbookView")
            }
            this.ObjAppend(this.divTransferAddr, aAddresbook)


            // 转账数量
            var divGasCount = this.objCreate("div")
            divGasCount.classList.add("pc_transfertype")
            // divGasCount.innerText= Main.langMgr.get("pay_transferCount") // "转账金额："
            this.ObjAppend(divtransfer, divGasCount)

            this.inputGasCount = this.objCreate("input") as HTMLInputElement
            this.inputGasCount.placeholder = Main.langMgr.get("pay_transferCount") // "转账金额："
            this.ObjAppend(divGasCount, this.inputGasCount)

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

            // 转账确认
            var transferObj = this.objCreate("button")
            transferObj.textContent = Main.langMgr.get("ok") // "确认"
            transferObj.onclick = () => {
                this.doTransfer()
            }
            this.ObjAppend(popupbutbox, transferObj)

        }

        toRefer() {
            if (PayTransferView.refer) {
                Main.viewMgr.change(PayTransferView.refer)
                PayTransferView.refer = null;
            }
        }

        private getAddress() {
            if (PayTransferView.address) {
                this.toaddress = PayTransferView.address
                PayTransferView.address = ""
            }
            return this.toaddress
        }

        gatSelect() {
            this.divTransferAddr.classList.add("pc_transfer_active")
            this.labelName.textContent = PayTransferView.contact.address_name+":"
            this.inputTransferAddr.value = PayTransferView.contact.address_wallet

            var labelNameW=this.labelName.clientWidth+10;
            var inputTransferAddrw=270-labelNameW-35;

            this.inputTransferAddr.style.width=inputTransferAddrw+"px"
            this.inputTransferAddr.style.padding="0 35px 0 "+labelNameW+"px"
            if(this.labelName){
                this.inputGasCount.focus()
            }
        }

        private async doTransfer() {
            var wallet_res = await Main.validateFormat("walletaddr", this.inputTransferAddr)
            if (wallet_res === false) {
                return
            }
            else if (wallet_res !== true) {
                this.toaddress = wallet_res
            }
            else {
                this.toaddress = this.inputTransferAddr.value;
            }

            if (!Main.viewMgr.payView.checkTransCount(this.inputGasCount.value)) {
                Main.showErrMsg("pay_transferCountError", () => {
                    this.inputGasCount.focus()
                })
                return;
            }

            Main.viewMgr.change("ViewLoading")

            try {
                var res: Result = await tools.CoinTool.rawTransaction(this.toaddress, tools.CoinTool.id_GAS, this.inputGasCount.value);
            }
            catch (e) {
                var res = new Result()
                res.err = true;
                res.info = e.toString();

                console.log('[Bla Cat]', '[PayTransferView]', 'doTransfer, tools.CoinTool.rawTransaction error => ', e.toString())
            }


            Main.viewMgr.viewLoading.remove()

            if (res) {
                console.log('[Bla Cat]', '[PayTransferView]', 'gas转账结果 => ', res)
                if (res.err == false) {
                    // 成功，上报
                    await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        res.info,
                        "0",
                        this.inputGasCount.value,
                        "6",
                        '{"sbPushString":"transfer", "toaddr":"' + this.toaddress + '", "count": "' + this.inputGasCount.value + '"}',
                        Main.netMgr.type
                    );

                    // "转账操作成功"
                    Main.showInfo(("pay_transferDoSucc"))

                    this.remove();
                    PayTransferView.callback();
                    PayTransferView.callback = null;
                }
                else {
                    // 转账失败
                    Main.showErrMsg(("pay_transferDoFail"))
                }
            }
            else {
                Main.showErrMsg(("pay_transferDoFail"))
            }
        }

    }
}