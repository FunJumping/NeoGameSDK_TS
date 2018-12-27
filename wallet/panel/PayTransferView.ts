/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 转账视图
    export class PayTransferView extends ViewBase {

        inputTransferCount: HTMLInputElement;
        private inputTransferAddr: HTMLInputElement;
        private divTransferAddr: HTMLDivElement;
        private labelName: HTMLLabelElement;

        private divHaveAmounts: HTMLDivElement; // 余额信息
        private divHaveBalanceAmounts: HTMLDivElement;  // 余额

        private spanBalance: HTMLSpanElement;   //余额
        private selectType: HTMLSelectElement;  //选择类型

        private netFeeCom: NetFeeComponent; // 手续费组件

        private Balances = {
            gas: "0",
            neo: "0",
            cgas: "0",
            cneo: "0",
            bcp: "0",
            bct: "0",
        }; // 可转账的类型

        static log_type_detail = {
            gas:  "1",
            neo:  "2",
            cgas: "3",
            cneo: "4",
            bcp:  "5",
            bct:  "6",
            btc:  "7",
            eth:  "8",
        }

        private toaddress: string;

        private transferType: string;   //转账类型

        static address: string = "";
        static contact: contact;
        static transferType_default: string;

        inputCount: HTMLInputElement // 提款金额
        net_fee: string // 网络交易费

        reset() {
            for (let k in this.Balances) {
                this.Balances[k] = "0"
            }
            this.toaddress = "";
        }

        start() {
            for (let k in this.Balances) {
                this.Balances[k] = Main.getStringNumber(Main.viewMgr.payView[k])
            }

            if (PayTransferView.transferType_default) {
                this.transferType = PayTransferView.transferType_default
            }
            else {
                this.transferType = "GAS";
            }

            super.start()

            if (!this.toaddress) {
                this.inputTransferAddr.focus()
            }
            else {
                this.inputTransferCount.focus()
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
            var divtransferdiv = this.objCreate("div")
            divtransferdiv.classList.add("pc_transfertype")
            this.ObjAppend(divtransfer, divtransferdiv)

            var balancetype = this.objCreate("label");
            balancetype.innerHTML = Main.langMgr.get("pay_transferType") //"转账类型：GAS  " 
            this.ObjAppend(divtransferdiv, balancetype)

            // 类型
            //var divtransfertype = this.objCreate("div")
            this.selectType = this.objCreate("select") as HTMLSelectElement
            this.selectType.classList.add("pc_transfertypes")
            this.ObjAppend(divtransferdiv, this.selectType)

            this.selectType.onchange = () => {
                this.transferType = this.selectType.value;
                var trans_type = this.transferType.toLowerCase()
                this.spanBalance.innerText = this.transferType + ": " + this.Balances[trans_type]
                this.inputTransferCount.value = ""
            }

            for (let k in this.Balances) {
                var option = this.objCreate("option") as HTMLOptionElement
                option.value = Main.langMgr.get(k)
                option.innerHTML = Main.langMgr.get(k)
                this.ObjAppend(this.selectType, option)
            }

            // 余额
            this.spanBalance = this.objCreate('span');
            this.spanBalance.classList.add('pc_gasbalancespan');  //添加类样式
            var type_lowcase = this.transferType.toLowerCase()
            this.spanBalance.innerText = Main.langMgr.get(type_lowcase) + ": " + this.Balances[type_lowcase];

            this.ObjAppend(divtransferdiv, this.spanBalance);

            //输入钱包地址
            this.divTransferAddr = this.objCreate("div") as HTMLDivElement
            this.divTransferAddr.classList.add("pc_transfertype")
            this.ObjAppend(divtransfer, this.divTransferAddr)

            //对方用户名
            this.labelName = this.objCreate("label") as HTMLLabelElement
            this.labelName.classList.add("pc_transfername")
            this.ObjAppend(this.divTransferAddr, this.labelName)

            this.inputTransferAddr = this.objCreate("input") as HTMLInputElement
            this.inputTransferAddr.classList.add("pc_transaddress")
            this.inputTransferAddr.placeholder = Main.langMgr.get("pay_transferToAddr") //"转账地址："
            this.inputTransferAddr.value = this.getAddress()
            this.inputTransferAddr.onfocus = () => {
                this.inputTransferAddr.select()
            }
            this.inputTransferAddr.onchange = () => {
                this.divTransferAddr.classList.remove("pc_transfer_active")
                this.inputTransferAddr.style.padding = "0 35px 0 5px"
                this.inputTransferAddr.style.width = "85%"
            }
            this.ObjAppend(this.divTransferAddr, this.inputTransferAddr)

            //跳到通讯录选择入口
            var aAddresbook = this.objCreate("a")
            aAddresbook.classList.add("pc_transferaddressbook", "iconfont", "icon-bc-tongxunlu")
            aAddresbook.onclick = () => {
                this.hidden()
                Main.viewMgr.payView.hidden()
                AddressbookView.select = "select"
                Main.viewMgr.change("AddressbookView")
            }
            this.ObjAppend(this.divTransferAddr, aAddresbook)


            // 转账数量
            var divTransferCount = this.objCreate("div")
            divTransferCount.classList.add("pc_transfertype")
            this.ObjAppend(divtransfer, divTransferCount)

            this.inputTransferCount = this.objCreate("input") as HTMLInputElement
            this.inputTransferCount.placeholder = Main.langMgr.get("pay_transferCount")
            this.ObjAppend(divTransferCount, this.inputTransferCount)
            this.inputTransferCount.onkeyup = () => {
                this.doinputchange()
            }

            // 拥有数量
            this.divHaveAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveAmounts.classList.add("pc_haveamounts")
            this.ObjAppend(popupbox, this.divHaveAmounts)

            // 拥有数量
            this.divHaveBalanceAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveBalanceAmounts.textContent = "";
            this.ObjAppend(this.divHaveAmounts, this.divHaveBalanceAmounts)

            // 手续费
            this.netFeeCom = new NetFeeComponent(popupbox, (net_fee) => {
                this.netFeeChange(net_fee)
            })
            this.netFeeCom.setFeeDefault()
            this.netFeeCom.createDiv()



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
                this.doTransfer()   //gas转账
            }
            this.ObjAppend(popupbutbox, transferObj)

        }

        toRefer() {
            if (PayTransferView.refer) {
                Main.viewMgr.change(PayTransferView.refer)
                PayTransferView.refer = null;
            }
        }

        key_esc() {
            
        }

        private getAddress() {
            if (PayTransferView.address) {
                this.toaddress = PayTransferView.address
                PayTransferView.address = ""
            }
            return this.toaddress
        }


        private doinputchange() {
            if (this.transferType == "NEO") {
                // NEO只能整数
                var neo_int = parseInt(this.inputTransferCount.value)
                if (neo_int > 0) {
                    this.inputTransferCount.value = parseInt(this.inputTransferCount.value).toString()
                }
                else {
                    this.inputTransferCount.value = ""
                }
            }
            if (!Main.viewMgr.payView.checkTransCount(this.inputTransferCount.value)) {
                return
            }
        }

        gatSelect() {
            this.divTransferAddr.classList.add("pc_transfer_active")
            this.labelName.textContent = PayTransferView.contact.address_name + ":"
            this.inputTransferAddr.value = PayTransferView.contact.address_wallet

            var labelNameW = this.labelName.clientWidth + 10;
            var inputTransferAddrw = labelNameW + 35;

            this.inputTransferAddr.style.width = "calc( 100% - " + inputTransferAddrw + "px"
            this.inputTransferAddr.style.padding = "0 35px 0 " + labelNameW + "px"
            if (this.labelName) {
                this.inputTransferCount.focus()
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

            if (!Main.viewMgr.payView.checkTransCount(this.inputTransferCount.value)) {
                Main.showErrMsg("pay_transferCountError", () => {
                    this.inputTransferCount.focus()
                })
                return;
            }

            // 手续费
            var net_fee = this.net_fee

            // 余额判断
            switch (this.transferType) {
                case 'GAS':
                    //gas转账
                    if (Number(this.inputTransferCount.value) + Number(net_fee) > Number(this.Balances.gas)) {
                        Main.showErrMsg("pay_transferGasNotEnough", () => {
                            this.inputTransferCount.focus()
                        })
                        return
                    }
                    break;
                case "NEO": // NEO转账
                case "BCP": // BCP转账
                case 'BCT': // BCT转账
                case "CNEO": // CNEO转账
                case "CGAS": // CGAS转账
                    if (Number(net_fee) > Number(this.Balances.gas)) {
                        Main.showErrMsg("pay_transferGasNotEnough", () => {
                            this.inputTransferCount.focus()
                        })
                        return
                    }
                    if (Number(this.inputTransferCount.value) > Number(this.Balances[this.transferType.toLowerCase()])) {
                        Main.showErrMsg("pay_transfer" + this.transferType + "NotEnough", () => {
                            this.inputTransferCount.focus()
                        })
                        return
                    }
                    break;
            }



            Main.viewMgr.change("ViewLoading")
            var api_type: string = "6";

            try {
                switch (this.transferType) {
                    case 'GAS': // gas转账 1
                    case "NEO": // neo转账 2
                        var res: Result = await tools.CoinTool.rawTransaction(this.toaddress, tools.CoinTool["id_" + this.transferType], this.inputTransferCount.value, Neo.Fixed8.fromNumber(Number(net_fee)));
                        break;
                    case 'CGAS': // CGAS 3
                    case "CNEO": // CNEO 4
                    case 'BCP': // BCP 5
                    case "BCT": // BCT 6
                        var res: Result = await tools.CoinTool.nep5Transaction(Main.user.info.wallet, this.toaddress, tools.CoinTool["id_" + this.transferType], this.inputTransferCount.value, net_fee);
                        break;
                }
            }
            catch (e) {
                var res = new Result()
                res.err = true;
                res.info = e.toString();

                console.log("[BlaCat]", '[PayTransferView]', 'doTransfer, tools.CoinTool.rawTransaction error => ', e.toString())
            }


            Main.viewMgr.viewLoading.remove()

            if (res) {
                console.log("[BlaCat]", '[PayTransferView]', '转账结果 => ', res)
                if (res.err == false) {
                    // 成功，上报
                    await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        res.info,
                        "0",
                        this.inputTransferCount.value,
                        "6",
                        '{"sbPushString":"transfer", "toaddr":"' + this.toaddress + '", "count": "' + this.inputTransferCount.value + '", "nnc": "' + tools.CoinTool["id_" + this.transferType] + '"}',
                        Main.netMgr.type,
                        "0",
                        net_fee,
                        PayTransferView.log_type_detail[this.transferType.toLowerCase()]
                    );

                    // "转账操作成功"
                    Main.showInfo(("pay_transferDoSucc"))

                    this.remove();
                    if (PayTransferView.callback) PayTransferView.callback();
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

        private netFeeChange(net_fee) {
            this.net_fee = net_fee

            var v = this.inputTransferCount.value;
            // 没有输入值，返回
            if (v.length == 0 || v.replace(/(^s*)|(s*$)/g, "").length == 0) {
                return
            }
        }

        updateBalance() {
            for (let k in this.Balances) {
                this.Balances[k] = Main.getStringNumber(Main.viewMgr.payView[k])
            }
            let type_lowcase = this.transferType.toLowerCase()
            this.spanBalance.innerText = Main.langMgr.get(type_lowcase) + ": " + this.Balances[type_lowcase];
        }

    }
}