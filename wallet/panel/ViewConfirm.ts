/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 确认视图
    export class ViewConfirm extends ViewBase {

        static content: string;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement

            this.div.classList.add("pc_alter", "pc_confirm")
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
            var lang_content = Main.langMgr.get(ViewConfirm.content);
            if (!lang_content) {
                lang_content = ViewConfirm.content
            }
            alterText.textContent = lang_content // "内容"

            this.ObjAppend(alter, alterText)


            // 弹窗按钮外框
            var popupbutbox = this.objCreate('div')
            popupbutbox.classList.add("pc_popupbutbox")
            this.ObjAppend(alter, popupbutbox)


            //取消
            var popupClose = this.objCreate("button")
            popupClose.classList.add("pc_cancel")
            popupClose.textContent = Main.langMgr.get("cancel") // "取消"
            popupClose.onclick = () => {
                this.doCancel()
            }
            this.ObjAppend(popupbutbox, popupClose)

            //确认
            var butConfirm = this.objCreate("button")
            butConfirm.textContent = Main.langMgr.get("ok") // "确认"
            butConfirm.onclick = () => {
                this.doConfirm()
            }
            this.ObjAppend(popupbutbox, butConfirm)

        }

        toRefer() {
            if (ViewConfirm.refer) {
                Main.viewMgr.change(ViewConfirm.refer);
                ViewConfirm.refer = null;
            }
        }

        private doConfirm() {
            this.remove(300);
            ViewConfirm.callback(ViewConfirm.callback_params)
            ViewConfirm.callback_params = null;
        }
        private doCancel() {
            this.remove(300)
            if (ViewConfirm.callback_cancel) {
                ViewConfirm.callback_cancel(ViewConfirm.callback_params)
            }
            ViewConfirm.callback_params = null;
        }
    }
}