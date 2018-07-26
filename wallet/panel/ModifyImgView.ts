/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 修改头像
    export class ModifyImgView extends ViewBase {

        private inputImg: HTMLInputElement
        private divImg: HTMLElement

        private filename: string;
        private reader: FileReader;

        private displayImg: HTMLImageElement

        constructor() {
            super()

            this.filename = "";

            this.reader = new FileReader();
            this.reader.onload = () => {
                // 验证文件格式、文件大小等
                var res = true
                if (!res) {
                    this.filename = "";
                    this.divImg.textContent = Main.langMgr.get("modifyImg_select")
                    this.displayImg.src = ""
                }
                else {
                    this.divImg.textContent = this.filename;
                    this.displayImg.src = this.reader.result;
                }
            };
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
            popupTitle.innerText = Main.langMgr.get("modifyImg") // "头像"
            this.ObjAppend(popupbox, popupTitle)

            // 头像容器
            var divImgBox = this.objCreate("div")
            divImgBox.classList.add("pc_modifyimg")
            this.ObjAppend(popupbox, divImgBox)

            // 头像
            this.divImg = this.objCreate("div")
            this.divImg.textContent = Main.langMgr.get("modifyImg_select") // 选择本地图片"
            this.ObjAppend(divImgBox, this.divImg)

            // 头像按钮
            this.inputImg = this.objCreate("input") as HTMLInputElement
            this.inputImg.type = "file"
            this.inputImg.onchange = () => {
                if (this.inputImg.files && this.inputImg.files.length > 0) {
                    this.filename = this.inputImg.files[0].name;
                    this.reader.readAsDataURL(this.inputImg.files[0]);
                }
                else {
                    this.divImg.textContent = Main.langMgr.get("modifyImg_select") // "请选择钱包文件"
                    this.filename = "";
                    this.displayImg.src = ""
                }
            }
            this.ObjAppend(divImgBox, this.inputImg)

            //头像显示
            this.displayImg = this.objCreate("img") as HTMLImageElement
            this.ObjAppend(divImgBox, this.displayImg)


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
            var res = await ApiTool.modUserIcon(Main.user.info.uid, Main.user.info.token, this.inputImg.files[0])
            if (res.r) {

                Main.showToast("modifyImg_succ")

                // 修改用户信息
                Main.user.setInfo('icon', res.data)

                this.remove()
                if (ModifyImgView.callback) {
                    ModifyImgView.callback();
                    ModifyImgView.callback = null;
                }
            }
            else {
                Main.showErrCode(res.errCode)
            }
        }
    }
}