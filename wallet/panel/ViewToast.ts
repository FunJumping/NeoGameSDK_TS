/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // toast视图
    export class ViewToast extends ViewBase {

        showMsg: HTMLDivElement;

        static showTime: number = 2000;
        static content: string;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement

            this.div.classList.add("pc_alter", "pc_toast")

            var toast = this.objCreate("div")
            toast.classList.add("pc_alterbox")
            this.ObjAppend(this.div, toast)

            // 提示的标题
            // var popupTitle=this.objCreate('div')
            // popupTitle.classList.add("pc_altertitle")
            // popupTitle.innerText= Main.langMgr.get("info") // "提示"
            // this.ObjAppend(this.showMsg, popupTitle)

            // 提示内容
            var alterText = this.objCreate("div")
            alterText.classList.add("pc_altertext")
            alterText.textContent = Main.langMgr.get(ViewToast.content) // "内容"
            this.ObjAppend(toast, alterText)
        }

        show() {
            super.show()
            this.remove(ViewToast.showTime, null)
        }
    }
}