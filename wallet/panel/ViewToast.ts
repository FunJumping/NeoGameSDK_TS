/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // toast视图
    export class ViewToast extends ViewBase {

        static showTime: number = 2500;
        static content: string;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement

            this.div.classList.add("pc_alter", "pc_toast")

            var toast = this.objCreate("div")
            toast.classList.add("pc_alterbox")
            this.ObjAppend(this.div, toast)

            // 提示内容
            var alterText = this.objCreate("div")
            alterText.classList.add("pc_altertext")
            var lang_content = Main.langMgr.get(ViewToast.content);
            if (!lang_content) {
                lang_content = ViewToast.content
            }
            alterText.textContent = lang_content  // "内容"
            this.ObjAppend(toast, alterText)
        }

        show() {
            super.show()
            this.remove(ViewToast.showTime, null)
        }
    }
}