/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 我的信息
    export class AutoLogoutWalletView extends ViewBase {

        private logoutTime = [1, 5, 10, 30, 60, 120, 0]

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
            headerH1.textContent = Main.langMgr.get("security_title") // "安全中心"
            this.ObjAppend(header, headerH1)

            //自动登出钱包
            var divSecurity = this.objCreate("div")
            divSecurity.classList.add("pc_myinfolist")
            this.ObjAppend(this.div, divSecurity)

            var ulSecurity = this.objCreate("ul")
            this.ObjAppend(divSecurity, ulSecurity)


            // 时间
            var liveTimeMax = Main.getLiveTimeMax()
            this.logoutTime.forEach(
                ts => {
                    var liTime = this.objCreate("li")
                    if (ts * 60 * 1000 == liveTimeMax) {
                        liTime.classList.add("pc_active")
                    }
                    liTime.textContent = Main.viewMgr.securityCenterView.getWalletOutTimeMaxMsg(ts * 60 * 1000)
                    liTime.onclick = () => {
                        Main.setLiveTimeMax(ts)
                        ulSecurity.getElementsByClassName("pc_active")[0].classList.remove("pc_active")
                        liTime.classList.add("pc_active")
                        Main.viewMgr.securityCenterView.updateWalletOutTimeMaxMsg()
                        this.return()
                    }
                    this.ObjAppend(ulSecurity, liTime)

                    // 时间图标
                    var iTime = this.objCreate("i")
                    iTime.classList.add("iconfont", "icon-bc-gou")
                    this.ObjAppend(liTime, iTime)
                }
            )
        }

        toRefer() {
            Main.viewMgr.securityCenterView.show()
        }



    }
}