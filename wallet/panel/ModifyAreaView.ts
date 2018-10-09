/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 我的信息
    export class ModifyAreaView extends ViewBase {

        private AreaObj = AreaView.getAreaByLang(Main.langMgr.type)

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_logoutwallet")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            // 返回
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            // 标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("modifyArea") // "地区"
            this.ObjAppend(header, headerH1)

            // 选择地区
            var divArea = this.objCreate("div")
            divArea.classList.add("pc_myinfolist")
            this.ObjAppend(this.div, divArea)

            var ulArea = this.objCreate("ul")
            this.ObjAppend(divArea, ulArea)


            // 地区
            var liveArea = Main.user.info.region
            this.AreaObj.forEach(
                area => {
                    var liArea = this.objCreate("li")
                    if (area.codename == liveArea) {
                        liArea.classList.add("pc_active")
                    }
                    liArea.textContent = Main.langMgr.get("area_code_" + area.codename)
                    liArea.onclick = () => {
                        this.doArea(area)
                    }
                    this.ObjAppend(ulArea, liArea)

                    // 时间图标
                    var iArea = this.objCreate("i")
                    iArea.classList.add("iconfont", "icon-bc-gou")
                    this.ObjAppend(liArea, iArea)
                }
            )
        }

        toRefer() {
            Main.viewMgr.myInfoView.show()
        }

        private async doArea(area) {
            var res = await ApiTool.modUserArea(Main.user.info.uid, Main.user.info.token, area.codename)
            if (res.r) {
                Main.showToast("modifyArea_succ")

                // 修改用户信息
                Main.user.setInfo('region', area.codename)
                Main.viewMgr.myInfoView.modifyFee()
                this.return()
            }
            else {
                Main.showErrCode(res.errCode)
            }

        }

    }
}