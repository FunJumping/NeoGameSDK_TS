/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 修改头像
    export class ModifyHeadImgView extends ViewBase {

        

        start() {
            super.start()
           
        }

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

            // 头像容器
            var divHeadImgBox = this.objCreate("div")
            divHeadImgBox.classList.add("pc_modifyheadimg")
            this.ObjAppend(popupbox, divHeadImgBox)

            // 头像
            var divHeadImg = this.objCreate("div")
            divHeadImg.textContent="选择本地图片"
            this.ObjAppend(divHeadImgBox, divHeadImg)

            // 头像按钮
            var inputHeadImg = this.objCreate("input")
            inputHeadImg.setAttribute("type", "file")
            inputHeadImg.setAttribute("value", "1")
            inputHeadImg.onclick = () => {
               
            }
            this.ObjAppend(divHeadImgBox, inputHeadImg)

           

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

            // var sexInputObj = this.divSex.getElementsByTagName("input")
            // for (var i = 0; i < sexInputObj.length; i++) {
            //     if (sexInputObj[i].checked) {
            //         var sexValue = sexInputObj[i].value;

            //         var res = await ApiTool.modUserSex(Main.user.info.uid, Main.user.info.token, sexValue)
            //         if (res.r) {

            //             Main.showToast("modifySex_succ")

            //             // 修改用户信息
            //             Main.user.setInfo('sex', sexValue)

            //             this.remove()
            //             if (ModifySexView.callback) {
            //                 ModifySexView.callback();
            //                 ModifySexView.callback = null;
            //             }
            //         }
            //         else {
            //             Main.showErrCode(res.errCode)
            //         }
            //         return sexValue;



            //     }
            // }


        }
    }
}