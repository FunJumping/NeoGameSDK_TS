/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 通讯录操作联系人信息
    export class AddressbookOpView extends ViewBase {
        private inputName: HTMLInputElement
        private textAddress: HTMLTextAreaElement
        private textDescribe: HTMLTextAreaElement

        static contact: contact;
        static opType: string;
        constructor() {
            super()
            if (!AddressbookOpView.contact) {
                AddressbookOpView.contact = new contact();
            }

        }
        start() {
            super.start()
            this.inputName.focus()
            if (AddressbookOpView.opType == "add") {
                this.inputName.value = ""
                this.textAddress.value = ""
                this.textDescribe.value = ""
            }
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_maillist_op")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            //返回
            var headerReturn = this.objCreate("a")
            headerReturn.classList.add("iconfont", "icon-bc-fanhui")
            headerReturn.textContent = Main.langMgr.get("return") // 返回
            headerReturn.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, headerReturn)


            //完成按钮
            var butHeader = this.objCreate("button")
            butHeader.classList.add("pc_returngame")
            butHeader.textContent = Main.langMgr.get("addressbook_op_button") // "完成"
            butHeader.onclick = () => {
                this.doFinished()
            }
            this.ObjAppend(header, butHeader)

            //联系人表单
            var divform = this.objCreate("div")
            divform.classList.add("pc_addressbookop")
            this.ObjAppend(this.div, divform)

            // 备注名 容器
            var divNameBox = this.objCreate("div")
            this.ObjAppend(divform, divNameBox)

            // 备注名
            var labelName = this.objCreate("label")
            labelName.textContent = Main.langMgr.get("addressbook_op_name") // "备注名"
            this.ObjAppend(divNameBox, labelName)

            // 备注名输入框
            this.inputName = this.objCreate("input") as HTMLInputElement
            this.inputName.placeholder = Main.langMgr.get("addressbook_op_inputName") // "输入备注名"
            this.inputName.value = AddressbookOpView.contact.address_name
            this.ObjAppend(divNameBox, this.inputName)

            // 钱包地址 容器
            var divAddressBox = this.objCreate("div")
            this.ObjAppend(divform, divAddressBox)

            // 钱包地址
            var labelAddress = this.objCreate("label")
            labelAddress.textContent = Main.langMgr.get("addressbook_op_address") // "钱包地址"
            this.ObjAppend(divAddressBox, labelAddress)

            // 钱包地址输入框
            this.textAddress = this.objCreate("textarea") as HTMLTextAreaElement
            this.textAddress.placeholder = Main.langMgr.get("addressbook_op_inputAddress") // "输入钱包地址"
            this.textAddress.value = AddressbookOpView.contact.address_wallet
            this.ObjAppend(divAddressBox, this.textAddress)

            // 钱包地址二维码
            var iAddress = this.objCreate("i")
            iAddress.classList.add("iconfont", "icon-bc-saomiao")
            this.ObjAppend(divAddressBox, iAddress)

            // 描述 容器
            var divDescribeBox = this.objCreate("div")
            this.ObjAppend(divform, divDescribeBox)

            // 描述
            var labelDescribe = this.objCreate("label")
            labelDescribe.textContent = Main.langMgr.get("addressbook_op_describe") // "描述"
            this.ObjAppend(divDescribeBox, labelDescribe)

            // 描述输入框
            this.textDescribe = this.objCreate("textarea") as HTMLTextAreaElement
            this.textDescribe.placeholder = Main.langMgr.get("addressbook_op_inputDescribe") // "输入描述"
            this.textDescribe.value = AddressbookOpView.contact.address_desc
            this.ObjAppend(divDescribeBox, this.textDescribe)

        }

        toRefer() {
            if (AddressbookOpView.refer) {
                Main.viewMgr.change(AddressbookOpView.refer)
                AddressbookOpView.refer = null;
            }
        }



        private async doFinished() {
            if (!this.inputName.value) {
                Main.showErrMsg("addressbook_op_inputName_err", () => {
                    this.inputName.focus()
                })
                return
            }
            if (!this.textAddress.value) {
                Main.showErrMsg("addressbook_op_inputAddress_err", () => {
                    this.textAddress.focus()
                })
                return
            }
            // 钱包地址验证
            var wallet_res = await Main.validateFormat("walletaddr", this.textAddress)
            if (wallet_res === false) {
                return
            }

            if (AddressbookOpView.opType == "add") {
                var res = await ApiTool.addAddrbook(Main.user.info.uid, Main.user.info.token, this.inputName.value, this.textAddress.value, this.textDescribe.value)

                if (res.r) {
                    this.return()
                    Main.showToast("addressbook_op_addSucc")
                    Main.viewMgr.addressbookView.getAddressbook()
                }
                else {
                    Main.showErrCode(res.errCode)
                }
            } else if (AddressbookOpView.opType == "update") {
                var res = await ApiTool.updateAddrbook(Main.user.info.uid, Main.user.info.token, this.inputName.value, this.textAddress.value, this.textDescribe.value, AddressbookOpView.contact.id)

                if (res.r) {
                    AddressbookOpView.contact.address_name = this.inputName.value
                    AddressbookOpView.contact.address_wallet = this.textAddress.value
                    AddressbookOpView.contact.address_desc = this.textDescribe.value
                    AddressbookDetailsView.contact = AddressbookOpView.contact

                    Main.showToast("addressbook_op_updateSucc")

                    Main.viewMgr.addressbookDetailsView.update()
                    this.return()
                    Main.viewMgr.addressbookView.getAddressbook()
                }
                else {
                    Main.showErrCode(res.errCode)
                }
            }

        }

    }
}