/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 修改性别
    export class ModifySexView extends ViewBase {

        private divSex: HTMLDivElement
        private inputSex1Obj: HTMLDivElement
        private inputSex2Obj: HTMLDivElement

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_popup")
            // 弹窗的框
            var popupbox = this.objCreate('div')
            popupbox.classList.add("pc_popupbox")
            this.ObjAppend(this.div, popupbox)

            // 弹窗的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_popup_title")
            popupTitle.innerText = Main.langMgr.get("modifySex") // "性别"
            this.ObjAppend(popupbox, popupTitle)

            // 男女容器
            this.divSex = this.objCreate("div") as HTMLDivElement
            this.divSex.classList.add("pc_modifysex")
            this.ObjAppend(popupbox, this.divSex)

            // 男
            this.inputSex1Obj = this.objCreate("div") as HTMLDivElement
            this.inputSex1Obj.classList.add("iconfont", "icon-bc-nan1")
            this.ObjAppend(this.divSex, this.inputSex1Obj)

            // 男单选按钮
            var inputSex1 = this.objCreate("input") as HTMLInputElement
            inputSex1.setAttribute("type", "radio")
            inputSex1.setAttribute("value", "1")
            inputSex1.setAttribute("name", "pc_sex")
            inputSex1.onclick = () => {
                this.inputSex1Obj.classList.add("pc_modifysex_active")
                this.inputSex2Obj.classList.remove("pc_modifysex_active")
            }
            if (Main.user.info.sex == "1") {
                inputSex1.setAttribute("checked", "true")
                this.inputSex1Obj.classList.add("pc_modifysex_active")
            }
            this.ObjAppend(this.inputSex1Obj, inputSex1)

            // 女
            this.inputSex2Obj = this.objCreate("div") as HTMLDivElement
            this.inputSex2Obj.classList.add("iconfont", "icon-bc-nv1")
            this.ObjAppend(this.divSex, this.inputSex2Obj)


            // 女单选按钮
            var inputSex2 = this.objCreate("input")
            inputSex2.setAttribute("type", "radio")
            inputSex2.setAttribute("value", "2")
            inputSex2.setAttribute("name", "pc_sex")
            inputSex2.onclick = () => {
                this.inputSex2Obj.classList.add("pc_modifysex_active")
                this.inputSex1Obj.classList.remove("pc_modifysex_active")
            }
            if (Main.user.info.sex == "2") {
                inputSex2.setAttribute("checked", "true")
                this.inputSex2Obj.classList.add("pc_modifysex_active")
            }
            this.ObjAppend(this.inputSex2Obj, inputSex2)



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
            if (ModifySexView.refer) {
                Main.viewMgr.change(ModifySexView.refer);
                ModifySexView.refer = null;
            }
        }



        private async doConfirm() {
            // if (!this.inputSex.value) {
            //     this.inputSex.focus()
            //     return
            // }

            var sexInputObj = this.divSex.getElementsByTagName("input")
            for (var i = 0; i < sexInputObj.length; i++) {
                if (sexInputObj[i].checked) {
                    var sexValue = sexInputObj[i].value;

                    var res = await ApiTool.modUserSex(Main.user.info.uid, Main.user.info.token, sexValue)
                    if (res.r) {

                        Main.showToast("modifySex_succ")

                        // 修改用户信息
                        Main.user.setInfo('sex', sexValue)

                        this.remove()
                        if (ModifySexView.callback) {
                            ModifySexView.callback();
                            ModifySexView.callback = null;
                        }
                    }
                    else {
                        Main.showErrCode(res.errCode)
                    }
                    return sexValue;



                }
            }
        }
    }
}