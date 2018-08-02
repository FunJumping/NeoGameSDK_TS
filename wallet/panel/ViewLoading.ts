/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 加载视图
    export class ViewLoading extends ViewBase {

        static content: string = "";

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_loading")
            //loading

            var divLoading = this.objCreate("div")
            divLoading.classList.add("pc_loadingbox")

            var lang_content = Main.langMgr.get(ViewLoading.content)
            if (!lang_content) {
                lang_content = ViewLoading.content
            }

            divLoading.innerHTML =
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
                + "<p id='pc_loadingtext'>" + lang_content + "</p>"
            this.ObjAppend(this.div, divLoading)

        }




    }
}