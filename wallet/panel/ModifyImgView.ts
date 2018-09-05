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
            this.divImg.classList.add("pc_text_nowrap1")
            this.divImg.textContent = Main.langMgr.get("modifyImg_select") // 选择本地图片"
            this.ObjAppend(divImgBox, this.divImg)

            // 头像按钮
            this.inputImg = this.objCreate("input") as HTMLInputElement
            this.inputImg.type = "file"
            this.inputImg.accept = "image/png,image/jpeg"
            this.inputImg.onchange = () => {
                this.changeInputImg()
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

        private async changeInputImg() {
            this.filename = "";
            this.reader = new FileReader();
            this.reader.onload = () => {
                this.divImg.textContent = this.filename;
                this.displayImg.src = this.reader.result as string;
                this.displayImg.style.display = "inline-block"
            };

            if (this.inputImg.files[0] != undefined) {
                if (this.inputImg.files[0].size >= 102400) {
                    Main.showToast("modifyImg_selectSize_err")
                    this.divImg.textContent = Main.langMgr.get("modifyImg_select") // "选择本地图片"
                    this.filename = "";
                    this.displayImg.src = ""
                    this.displayImg.style.display = "none"
                    return

                }
                var regex = /\.(jpg|png|jpeg)+$/;
                var current = regex.test(this.inputImg.files[0].name)
                if (!current) {
                    Main.showToast("modifyImg_selectType_err")
                    this.divImg.textContent = Main.langMgr.get("modifyImg_select") // "选择本地图片"
                    this.filename = "";
                    this.displayImg.src = ""
                    this.displayImg.style.display = "none"
                    return
                }
                if (this.inputImg.files && this.inputImg.files.length > 0) {
                    this.filename = this.inputImg.files[0].name;
                    this.reader.readAsDataURL(this.inputImg.files[0]);
                } else {
                    this.divImg.textContent = Main.langMgr.get("modifyImg_select") // "选择本地图片"
                    this.filename = "";
                    this.displayImg.src = ""
                    this.displayImg.style.display = "none"
                }
            } else {
                this.divImg.textContent = Main.langMgr.get("modifyImg_select") // "选择本地图片"
                this.filename = "";
                this.displayImg.src = ""
                this.displayImg.style.display = "none"
            }
        }

        private async doConfirm() {
            if (this.inputImg.files[0] != undefined) {
                if (this.inputImg.files[0].size >= 102400) {
                    Main.showToast("modifyImg_select_err")// "请选择本地图片"
                    return
                }
                var regex = /\.(jpg|png|jpeg)+$/;
                var current = regex.test(this.inputImg.files[0].name)
                if (!current) {
                    Main.showToast("modifyImg_select_err")// "请选择本地图片"
                    return
                }

                Main.viewMgr.change("ViewLoading")

                try {
                    var res = await ApiTool.modUserIcon(Main.user.info.uid, Main.user.info.token, this.inputImg.files[0])
                }
                catch (e) {
                    console.log("[BlaCat]", '[ModifyImgView]', 'doConfirm, ApiTool.modUserIcon error => ', e.toString())
                }

                Main.viewMgr.viewLoading.remove()

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
            } else {
                Main.showToast("modifyImg_select_err") // "请选择本地图片"
            }
        }
    }
}