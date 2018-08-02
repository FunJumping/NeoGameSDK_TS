/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 警告
    export class ViewAlert extends ViewBase {

        static content: string;
        static content_ext: any;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_alter")
            //提示的框
            var alter = this.objCreate('div')
            alter.classList.add("pc_alterbox")
            this.ObjAppend(this.div, alter)

            // 提示的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_altertitle")
            popupTitle.innerText = Main.langMgr.get("info") //"提示"
            this.ObjAppend(alter, popupTitle)

            // 提示内容
            var alterText = this.objCreate("div")
            alterText.classList.add("pc_altertext")
            var lang_content = Main.langMgr.get(ViewAlert.content, ViewAlert.content_ext)
            if (!lang_content) {
                lang_content = ViewAlert.content
            }
            alterText.textContent = lang_content //"内容"
            this.ObjAppend(alter, alterText)

            // 弹窗按钮外框
            var popupbutbox = this.objCreate('div')
            popupbutbox.classList.add("pc_popupbutbox")
            this.ObjAppend(alter, popupbutbox)



            //确认
            var butConfirm = this.objCreate("button")
            butConfirm.textContent = Main.langMgr.get("ok") //"确认"
            butConfirm.onclick = () => {
                this.doConfirm()
            }
            this.ObjAppend(popupbutbox, butConfirm)
        }

        toRefer() {
            if (ViewAlert.refer) {
                Main.viewMgr.change(ViewAlert.refer);
                ViewAlert.refer = null;
            }
        }


        private doConfirm() {
            this.remove(300)
            if (ViewAlert.callback) {
                ViewAlert.callback()
                ViewAlert.callback = null;
            }
        }
    }
}