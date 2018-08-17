/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 连接视图
    export class ViewConnecting extends ViewBase {

        static content: string;
        static callback_retry: Function;

        private showType: string;
        private showReturn: boolean = false;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_connecting")

            if (this.showType == "connecting") {
                this.showConnecting()
            }
            else if (this.showType == "retry") {
                this.showRetry(this.showReturn)
            }
        }

        showConnecting() {
            this.showType = "connecting"

            this.div.innerHTML = ""

            this.div.classList.add("pc_loading")

            var divConnecting = this.objCreate("div")
            divConnecting.classList.add("pc_loadingbox")

            divConnecting.innerHTML =
                "<div class='pc_loading1'></div>"
                + "<div class='pc_loading2'></div>"
                + "<div class='pc_loading3'></div>"
                + "<div class='pc_loading4'></div>"
                + "<div class='pc_loading5'></div>"
                + "<div class='pc_loading6'></div>"
                + "<div class='pc_loading7'></div>"
                + "<div class='pc_loading8'></div>"
                + "<div class='pc_loading9'></div>"
                + "<div class='pc_loading10'></div>"
                + "<div class='pc_loading11'></div>"
                + "<div class='pc_loading12'></div>"
                + "<p id='pc_loadingtext'>" + Main.langMgr.get("netmgr_connecting") + "</p>"
            this.ObjAppend(this.div, divConnecting)
        }

        showRetry(showReturn: boolean) {
            this.showType = "retry"
            this.showReturn = showReturn

            this.div.innerHTML = ""

            var divRetry = this.objCreate("div")
            divRetry.classList.add("pc_connectingtext")
            var descDiv = this.objCreate("div")
            var lang_key = "netmgr_connecting_fail"
            if (ViewConnecting.content) {
                lang_key = ViewConnecting.content
            }
            descDiv.textContent = Main.langMgr.get(lang_key)
            this.ObjAppend(divRetry, descDiv)



            // 返回
            if (showReturn) {
                var returnObj = this.objCreate("button")
                returnObj.classList.add("pc_cancel")
                returnObj.textContent = Main.langMgr.get("return")
                returnObj.onclick = () => {
                    this.return()
                }
                this.ObjAppend(divRetry, returnObj)
            }

            // 重试
            var retryObj = this.objCreate("button")
            retryObj.textContent = Main.langMgr.get("retry")
            retryObj.onclick = () => {
                if (ViewConnecting.callback_retry) ViewConnecting.callback_retry()
            }
            this.ObjAppend(divRetry, retryObj)


            this.ObjAppend(this.div, divRetry)
        }



    }
}