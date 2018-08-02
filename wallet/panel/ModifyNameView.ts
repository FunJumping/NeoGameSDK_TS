/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 修改昵称
    export class ModifyNameView extends ViewBase {

        private inputName: HTMLInputElement

        start() {
            super.start()
            this.inputName.focus()
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
            popupTitle.innerText = Main.langMgr.get("modifyName") // "修改昵称"
            this.ObjAppend(popupbox, popupTitle)


            this.inputName = this.objCreate("input") as HTMLInputElement
            this.inputName.type = "text"
            this.inputName.style.marginTop = "40px"
            this.inputName.placeholder = Main.langMgr.get("modifyName_input") // "请输入昵称"
            this.ObjAppend(popupbox, this.inputName)


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


            //确认
            var confirmObj = this.objCreate("button")
            confirmObj.textContent = Main.langMgr.get("ok") // "确认"
            confirmObj.onclick = () => {
                this.doConfirm()
            }
            this.ObjAppend(popupbutbox, confirmObj)
        }

        toRefer() {
            if (ModifyNameView.refer) {
                Main.viewMgr.change(ModifyNameView.refer);
                ModifyNameView.refer = null;
            }
        }


        private async doConfirm() {
            if (!this.inputName.value) {
                this.inputName.focus()
                return
            }

            var res = await ApiTool.modUserName(Main.user.info.uid, Main.user.info.token, this.inputName.value)
            if (res.r) {

                Main.showToast("modifyName_succ")

                // 修改用户信息
                Main.user.setInfo('name', this.inputName.value)

                this.remove()
                if (ModifyNameView.callback) {
                    ModifyNameView.callback();
                    ModifyNameView.callback = null;
                }
            }
            else {
                Main.showErrCode(res.errCode)
            }
        }
    }
}