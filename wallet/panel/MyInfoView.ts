/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 我的信息
    export class MyInfoView extends ViewBase {

        myName: HTMLElement;
        mySex: HTMLElement;

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
            // myinfo.innerHTML
            //     = '<ul>'
            //     + '<li class="pc_myinfoimg">' + Main.langMgr.get("myinfo_headImg") + '<span><img src="' + this.getImg() + '"></span></li>'
            //     + '<li>' + Main.langMgr.get("myinfo_nickname") + '<span onclick="modifyName()">' + this.getName() + '</span></li>'
            //     + '<li>' + Main.langMgr.get("myinfo_sex") + '<span>' + this.getSex() + '</span></li>'
            //     + '<li>' + Main.langMgr.get("myinfo_uid") + '<span>' + this.getUid() + '</span></li>'
            //     + '<li>' + Main.langMgr.get("myinfo_area") + '<span>' + this.getArea() + '</span></li>'
            //     + '</ul>'

            var ulMyinfo = this.objCreate("ul")
            this.ObjAppend(myinfo, ulMyinfo)

            //头像
            var liMyinfoImg = this.objCreate("li")
            liMyinfoImg.classList.add("pc_myinfoimg")
            liMyinfoImg.style.cursor = "pointer"
            liMyinfoImg.textContent = Main.langMgr.get("myinfo_headImg")

            var iMyinfoimg = this.objCreate("i")
            iMyinfoimg.classList.add("iconfont", "icon-gengduo")
            this.ObjAppend(liMyinfoImg, iMyinfoimg)

            var spanMyinfoimg = this.objCreate("span")
            this.ObjAppend(liMyinfoImg, spanMyinfoimg)

            var imgMyinfoimg = this.objCreate("img")
            imgMyinfoimg.setAttribute("src", this.getImg())
            this.ObjAppend(spanMyinfoimg, imgMyinfoimg)

            this.ObjAppend(ulMyinfo, liMyinfoImg)

            //昵称
            var liMyinfoName = this.objCreate("li")
            liMyinfoName.style.cursor = "pointer"
            liMyinfoName.textContent = Main.langMgr.get("myinfo_nickname")
            liMyinfoName.onclick = () => {
                this.modifyName()
            }
            var iMyinfoName = this.objCreate("i")
            iMyinfoName.classList.add("iconfont", "icon-gengduo")
            this.ObjAppend(liMyinfoName, iMyinfoName)

            this.myName = this.objCreate("span")
            this.myName.textContent = this.getName()
            this.ObjAppend(liMyinfoName, this.myName)

            this.ObjAppend(ulMyinfo, liMyinfoName)


            //性别
            var liMyinfoSex = this.objCreate("li")
            liMyinfoSex.style.cursor = "pointer"
            liMyinfoSex.textContent = Main.langMgr.get("myinfo_sex")
            liMyinfoSex.onclick = () => {
                this.modifySex()
            }
            this.mySex = this.objCreate("span")
            this.mySex.textContent = this.getSex()
            this.ObjAppend(liMyinfoSex, this.mySex)
            this.ObjAppend(ulMyinfo, liMyinfoSex)

            //账号
            var liMyinfoUid = this.objCreate("li")
            liMyinfoUid.textContent = Main.langMgr.get("myinfo_uid")
            var spanMyinfoUid = this.objCreate("span")
            spanMyinfoUid.textContent = this.getUid()
            this.ObjAppend(liMyinfoUid, spanMyinfoUid)
            this.ObjAppend(ulMyinfo, liMyinfoUid)

            //地区
            var liMyinfoArea = this.objCreate("li")
            liMyinfoArea.textContent = Main.langMgr.get("myinfo_area")
            var spanMyinfoArea = this.objCreate("span")
            spanMyinfoArea.textContent = this.getArea()
            this.ObjAppend(liMyinfoArea, spanMyinfoArea)
            this.ObjAppend(ulMyinfo, liMyinfoArea)

            //退出账号
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
            return Main.langMgr.get("myinfo_sex_" + Main.user.info.sex);
        }

        private getArea() {
            return Main.langMgr.get("area_code_" + Main.user.info.region)
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

        private async modifyName() {
            ModifyNameView.callback = () => {
                this.myName.textContent = this.getName()
                Main.viewMgr.payView.payMyWallet.textContent = this.getName()
            }
            Main.viewMgr.change("ModifyNameView")
        }
        private async modifySex() {
            ModifySexView.callback = () => {
                this.mySex.textContent = this.getSex()
            }
            Main.viewMgr.change("ModifySexView")
        }


    }
}