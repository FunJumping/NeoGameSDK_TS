/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 通讯录
    export class AddressbookAddView extends ViewBase {
        private inputName: HTMLInputElement
        private textAddress: HTMLTextAreaElement
        private textDescribe: HTMLTextAreaElement


        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_maillist")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            //返回
            var headerReturn = this.objCreate("a")
            headerReturn.classList.add("iconfont", "icon-fanhui")
            headerReturn.textContent = Main.langMgr.get("return") // 返回
            headerReturn.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, headerReturn)


            //完成按钮
            var butHeader = this.objCreate("button")
            butHeader.classList.add("pc_returngame")
            butHeader.textContent = Main.langMgr.get("addressbook_add_button") // "完成"
            butHeader.onclick = () => {
                this.butHeader()
            }
            this.ObjAppend(header, butHeader)

            //添加联系人表单
            var divform = this.objCreate("div")
            divform.classList.add("pc_addressbookadd")
            this.ObjAppend(this.div, divform)

            // 备注名 容器
            var divNameBox = this.objCreate("div")
            this.ObjAppend(divform, divNameBox)

            // 备注名
            var labelName = this.objCreate("label")
            labelName.textContent = Main.langMgr.get("addressbook_add_name") // "备注名"
            this.ObjAppend(divNameBox, labelName)

            // 备注名输入框
            this.inputName = this.objCreate("input") as HTMLInputElement
            this.inputName.placeholder = Main.langMgr.get("addressbook_add_inputName") // "输入备注名"
            this.ObjAppend(divNameBox, this.inputName)

            // 钱包地址 容器
            var divAddressBox = this.objCreate("div")
            this.ObjAppend(divform, divAddressBox)

            // 钱包地址
            var labelAddress = this.objCreate("label")
            labelAddress.textContent = Main.langMgr.get("addressbook_add_address") // "钱包地址"
            this.ObjAppend(divAddressBox, labelAddress)

            // 钱包地址输入框
            this.textAddress = this.objCreate("textarea") as HTMLTextAreaElement
            this.textAddress.placeholder = Main.langMgr.get("addressbook_add_inputAddress") // "输入钱包地址"
            this.ObjAppend(divAddressBox, this.textAddress)

            // 钱包地址二维码
            var iAddress = this.objCreate("i")
            iAddress.classList.add("iconfont", "icon-saomiao")
            this.ObjAppend(divAddressBox, iAddress)

            // 描述 容器
            var divDescribeBox = this.objCreate("div")
            this.ObjAppend(divform, divDescribeBox)

            // 描述
            var labelDescribe = this.objCreate("label")
            labelDescribe.textContent = Main.langMgr.get("addressbook_add_describe") // "描述"
            this.ObjAppend(divDescribeBox, labelDescribe)

            // 描述输入框
            this.textDescribe = this.objCreate("textarea") as HTMLTextAreaElement
            this.textDescribe.placeholder = Main.langMgr.get("addressbook_add_inputDescribe") // "输入描述"
            this.ObjAppend(divDescribeBox, this.textDescribe)

        }

        toRefer() {
            if (AddressbookAddView.refer) {
                Main.viewMgr.change(AddressbookAddView.refer)
                AddressbookAddView.refer = null;
            }
        }


        private async butHeader() {
            if (!this.inputName.value) {
                Main.showErrMsg("addressbook_add_inputName_err", () => {
                    this.inputName.focus()
                })
                return
            }
            if (!this.textAddress.value) {
                Main.showErrMsg("addressbook_add_inputAddress_err", () => {
                    this.textAddress.focus()
                })
                return
            }
            if (!this.textDescribe.value) {
                Main.showErrMsg("addressbook_add_inputDescribe_err", () => {
                    this.textDescribe.focus()
                })
                return
            }
            var res = await ApiTool.addAddrbook(Main.user.info.uid, Main.user.info.token, this.inputName.value, this.textAddress.value, this.textDescribe.value)

            if (res.r) {
                this.return()
                Main.showToast("addressbook_add_succ")
                Main.viewMgr.addressbookView.getAddressbook()
            }
            else {
                Main.showErrCode(res.errCode)
            }

        }

    }
}