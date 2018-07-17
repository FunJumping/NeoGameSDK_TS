/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 我的信息
    export class MyInfoView extends ViewBase {
        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_myinfo")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("myInfo") // "我的信息"
            this.ObjAppend(header, headerH1)

            var myinfo = this.objCreate("div")
            myinfo.classList.add("pc_myinfolist")
            myinfo.innerHTML
                = '<ul>'
                + '<li class="pc_myinfoimg">' + Main.langMgr.get("myinfo_headImg") + '<span><img src="' + this.getImg() + '"></span></li>'
                + '<li>' + Main.langMgr.get("myinfo_nickname") + '<span onclick="modifyName()">' + this.getName() + '</span></li>'
                + '<li>' + Main.langMgr.get("myinfo_sex") + '<span>' + this.getSex() + '</span></li>'
                + '<li>' + Main.langMgr.get("myinfo_uid") + '<span>' + this.getUid() + '</span></li>'
                + '<li>' + Main.langMgr.get("myinfo_area") + '<span>' + this.getArea() + '</span></li>'
                + '</ul>'

            var logout = this.objCreate("button")
            logout.textContent = Main.langMgr.get("myinfo_logout") //"退出账号"
            logout.onclick = () => {
                this.doLogout()
            }
            this.ObjAppend(myinfo, logout)

            this.ObjAppend(this.div, myinfo)

        }

        toRefer() {
            if (MyInfoView.refer) {
                Main.viewMgr.change(MyInfoView.refer)
                MyInfoView.refer = null;
            }
        }

        private getImg() {
            return Main.user.info.icon ? Main.user.info.icon : Main.resHost + "res/img/game0.png";
        }

        private getName() {
            return Main.user.info.name;
        }

        private getUid() {
            return Main.user.info.uid;
        }

        private getSex() {
            return Main.langMgr.get("gender_" + Main.user.info.sex)
        }

        private getArea() {
            return Main.langMgr.get("area_code_" + Main.user.info.area)
        }

        private doLogout() {

            ViewConfirm.callback = () => {
                this.makeLogout()
            }
            Main.showConFirm("myinfo_logoutConfirm")
        }


        private async makeLogout() {
            Main.user.logout()
            Main.viewMgr.removeAll();
            Main.viewMgr.change("LoginView")
            Main.logoutCallback()
        }

        private modifyName(){
            Main.viewMgr.change("ModifyName")

        }



    }
}