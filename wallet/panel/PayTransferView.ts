/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 转账视图
    export class PayTransferView extends ViewBase {
        private inputGasCount: HTMLInputElement;
        private inputTransferAddr: HTMLInputElement;

        private gasBalance: string;
        private toaddress: string;
        private isDomain: boolean;
        private addrerr: string;

        constructor() {
            super();

            this.gasBalance = '0';
            this.toaddress = "";
            this.isDomain = false;
            this.addrerr = "";
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
            this.inputTransferAddr.focus()
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
            var divTransferAddr = this.objCreate("div")
            divTransferAddr.classList.add("pc_transfertype")
            // divTransferAddr.innerText= Main.langMgr.get("pay_transferToAddr") //"转账地址："
            this.ObjAppend(divtransfer, divTransferAddr)

            this.inputTransferAddr = this.objCreate("input") as HTMLInputElement
            this.inputTransferAddr.placeholder = Main.langMgr.get("pay_transferToAddr") //"转账地址："
            this.ObjAppend(divTransferAddr, this.inputTransferAddr)

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
                Main.viewMgr.payTransferView.div.classList.add("pc_fadeindown")
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

        private async doTransfer() {
            if (!await this.verify_addr()) {
                Main.showErrMsg("pay_transferToAddrError", () => {
                    this.inputTransferAddr.focus()
                })
                return;
            }

            var regex = /(?!^0*(\.0{1,2})?$)^\d{1,14}(\.\d{1,8})?$/
            if (!this.verify_Amount()||!regex.test(this.inputGasCount.value)) {
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
                res.info = e;
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

        // 验证地址
        private async verify_addr() {
            let isDomain = tools.NNSTool.verifyDomain(this.inputTransferAddr.value);
            let isAddress = tools.NNSTool.verifyAddr(this.inputTransferAddr.value);
            if (isDomain) {
                try {
                    this.inputTransferAddr.value = this.inputTransferAddr.value.toLowerCase();
                    let addr = await tools.NNSTool.resolveData(this.inputTransferAddr.value);
                    if (addr) {
                        this.toaddress = addr;
                        this.isDomain = true;
                        this.addrerr = 'false';
                        return true;
                    }
                    else {
                        this.toaddress = "";
                        this.addrerr = 'true';
                        return false;
                    }
                }
                catch (e) {
                    console.log('[Bla Cat]', '[PayTransferView]', '钱包地址错误 => ', e)
                    return false;
                }

            }
            else if (isAddress) {
                try {
                    if (tools.neotools.verifyPublicKey(this.inputTransferAddr.value)) {
                        this.toaddress = this.inputTransferAddr.value;
                        this.addrerr = 'false';
                        return true;
                    }
                }
                catch (e) {
                    console.log('[Bla Cat]', '[PayTransferView]', '钱包地址错误 => ', e)
                    return false;
                }
            }
            else {
                this.addrerr = 'true';
                this.toaddress = "";
                return false;
            }
        }

        // 验证数量
        private verify_Amount() {
            let balancenum = Neo.Fixed8.parse(this.gasBalance + '');
            let inputamount = Neo.Fixed8.parse(this.inputGasCount.value);
            let compare = balancenum.compareTo(inputamount);
            if (compare >= 1) {
                return true;
            }
            return false;
        }
    }
}