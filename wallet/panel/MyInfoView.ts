/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 我的信息
    export class MyInfoView extends ViewBase {

        private myImg: HTMLImageElement;
        private myName: HTMLElement;
        private mySex: HTMLElement;
        private myArea: HTMLElement;
        private myFee: HTMLElement;

        private myNet_nodes: HTMLElement;
        private myNet_clis: HTMLElement

        private divHeight_nodes: HTMLElement
        private divHeight_clis: HTMLElement;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_myinfo")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
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

            var ulMyinfo = this.objCreate("ul")
            this.ObjAppend(myinfo, ulMyinfo)

            //头像
            var liMyinfoImg = this.objCreate("li")
            liMyinfoImg.classList.add("pc_myinfoimg")
            liMyinfoImg.onclick = () => {
                this.modifyImg()
            }
            liMyinfoImg.textContent = Main.langMgr.get("myinfo_headImg")

            //头像标签
            var iMyinfoimg = this.objCreate("i")
            iMyinfoimg.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfoImg, iMyinfoimg)

            var spanMyinfoimg = this.objCreate("span")
            this.ObjAppend(liMyinfoImg, spanMyinfoimg)

            //头像图片
            this.myImg = this.objCreate("img") as HTMLImageElement
            this.myImg.setAttribute("src", this.getImg())
            this.ObjAppend(spanMyinfoimg, this.myImg)

            this.ObjAppend(ulMyinfo, liMyinfoImg)

            //昵称
            var liMyinfoName = this.objCreate("li")
            liMyinfoName.textContent = Main.langMgr.get("myinfo_nickname")
            liMyinfoName.onclick = () => {
                this.modifyName()
            }
            this.ObjAppend(ulMyinfo, liMyinfoName)

            //昵称标签
            var iMyinfoName = this.objCreate("i")
            iMyinfoName.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfoName, iMyinfoName)

            //昵称内容
            this.myName = this.objCreate("span")
            this.myName.textContent = this.getName()
            this.ObjAppend(liMyinfoName, this.myName)



            //性别
            var liMyinfoSex = this.objCreate("li")
            liMyinfoSex.textContent = Main.langMgr.get("myinfo_sex")
            liMyinfoSex.onclick = () => {
                this.modifySex()
            }

            //性别标签
            var iMyinfoSex = this.objCreate("i")
            iMyinfoSex.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfoSex, iMyinfoSex)

            //性别内容
            this.mySex = this.objCreate("span")
            this.mySex.textContent = this.getSex()
            this.ObjAppend(liMyinfoSex, this.mySex)
            this.ObjAppend(ulMyinfo, liMyinfoSex)

            //账号
            var liMyinfoUid = this.objCreate("li")
            liMyinfoUid.style.cursor = "Default"
            liMyinfoUid.textContent = Main.langMgr.get("myinfo_uid")
            this.ObjAppend(ulMyinfo, liMyinfoUid)

            //账号内容
            var spanMyinfoUid = this.objCreate("span")
            spanMyinfoUid.textContent = this.getUid()
            this.ObjAppend(liMyinfoUid, spanMyinfoUid)

            //地区
            var liMyinfoArea = this.objCreate("li")
            liMyinfoArea.textContent = Main.langMgr.get("myinfo_area")
            liMyinfoArea.onclick = () => {
                this.hidden()
                Main.viewMgr.change("ModifyAreaView")
            }
            this.ObjAppend(ulMyinfo, liMyinfoArea)

            //地区标签
            var iMyinfoArea = this.objCreate("i")
            iMyinfoArea.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfoArea, iMyinfoArea)

            // 地区内容
            this.myArea = this.objCreate("span")
            this.myArea.textContent = this.getArea()
            this.ObjAppend(liMyinfoArea, this.myArea)


            //手续费
            var liMyinfofee = this.objCreate("li")
            liMyinfofee.textContent = Main.langMgr.get("myinfo_fee")
            liMyinfofee.onclick = () => {
                this.hidden()
                ModifyTransactionFeeView.refer = "MyInfoView"
                Main.viewMgr.change("ModifyTransactionFeeView")
            }

            //手续费标签
            var iMyinfofee = this.objCreate("i")
            iMyinfofee.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfofee, iMyinfofee)

            //手续费内容
            this.myFee = this.objCreate("span")
            this.myFee.textContent = this.getFee()
            this.ObjAppend(liMyinfofee, this.myFee)
            this.ObjAppend(ulMyinfo, liMyinfofee)


            //网络线路
            var liMyinfoNet = this.objCreate("li")
            liMyinfoNet.textContent = Main.langMgr.get("modifyNet")
            liMyinfoNet.onclick = () => {
                this.hidden()
                ModifyNetworkLineView.refer = "MyInfoView"
                ModifyNetworkLineView.defaultType = "nodes"
                Main.viewMgr.change("ModifyNetworkLineView")
            }
            this.ObjAppend(ulMyinfo, liMyinfoNet)

            //网络线路标签
            var iMyinfoNet = this.objCreate("i")
            iMyinfoNet.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfoNet, iMyinfoNet)

            // 网络线路内容
            var spanNet_nodes = this.objCreate("span")
            this.ObjAppend(liMyinfoNet, spanNet_nodes)
            spanNet_nodes.classList.add("pc_spannet")

            this.myNet_nodes = this.objCreate("div")
            this.myNet_nodes.textContent = "BlockAPI" // "中国—上海" //this.getArea()
            this.ObjAppend(spanNet_nodes, this.myNet_nodes)

            //网络线路高度
            this.divHeight_nodes = this.objCreate("div")
            this.divHeight_nodes.classList.add("iconfont", "icon-bc-blalian")
            this.divHeight_nodes.textContent = "n/a"
            this.ObjAppend(spanNet_nodes, this.divHeight_nodes)


            var spanNet_clis = this.objCreate("span")
            this.ObjAppend(liMyinfoNet, spanNet_clis)
            spanNet_clis.classList.add("pc_spannet", "pc_spannet_clis")

            this.myNet_clis = this.objCreate("div")
            this.myNet_clis.textContent = "NeoCli" // "中国—上海" //this.getArea()
            this.ObjAppend(spanNet_clis, this.myNet_clis)

            this.divHeight_clis = this.objCreate("div")
            this.divHeight_clis.classList.add("iconfont", "icon-bc-neolian")
            this.divHeight_clis.textContent = "n/a"
            this.ObjAppend(spanNet_clis, this.divHeight_clis)


            // 安全中心
            var liMyinfoTrust = this.objCreate("li")
            liMyinfoTrust.textContent = Main.langMgr.get("myinfo_security")
            liMyinfoTrust.onclick = () => {
                this.hidden()
                Main.viewMgr.change("SecurityCenterView")
            }
            this.ObjAppend(ulMyinfo, liMyinfoTrust)

            // 安全中心图标
            var iMyinfoTrust = this.objCreate("i")
            iMyinfoTrust.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfoTrust, iMyinfoTrust)

            // 安全中心设置
            var spanMyinfoTrust = this.objCreate("span")
            spanMyinfoTrust.textContent = Main.langMgr.get("myinfo_set")
            this.ObjAppend(liMyinfoTrust, spanMyinfoTrust)

            //退出账号
            var logout = this.objCreate("button")
            logout.textContent = Main.langMgr.get("myinfo_logout") //"退出账号"
            logout.onclick = () => {
                this.doLogout()
            }
            this.ObjAppend(myinfo, logout)

            this.ObjAppend(this.div, myinfo)


            // this.getNodeName("nodes")
            this.getNodeHeight("nodes")

            // this.getNodeName("clis")
            this.getNodeHeight("clis")

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
        private getFee() {
            if (Main.user.info.service_charge) {
                return Main.user.info.service_charge + " " + Main.langMgr.get("gas")
            } else {
                return Main.user.info.service_charge ? Main.user.info.service_charge : Main.langMgr.get("myinfo_fee_empty");
            }
        }

        private getArea() {
            return Main.langMgr.get("area_code_" + Main.user.info.region) ? Main.langMgr.get("area_code_" + Main.user.info.region) : Main.langMgr.get("myinfo_area_empty")
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

        private async modifyImg() {
            ModifyImgView.callback = () => {
                this.myImg.src = this.getImg()
            }
            Main.viewMgr.change("ModifyImgView")
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
        modifyFee() {
            this.myFee.textContent = this.getFee()
        }
        modifyArea() {
            this.myArea.textContent = this.getArea()
        }


        // private async getNodeName(type: string) {
        //     let currNodeInfo = Main.netMgr.getCurrNodeInfo(type)
        //     if (currNodeInfo) {
        //         let content = Main.langMgr.get("area_code_" + currNodeInfo[0])
        //         if (currNodeInfo[2]) {
        //             content += currNodeInfo[2]
        //         }
        //         this["myNet_" + type].textContent = content
        //     }
        // }
        private async getNodeHeight(type: string) {
            let height = Main.viewMgr.payView["height_" + type].toString()
            if (height > 0) {
                this["divHeight_" + type].textContent = height == 0 ? "n/a" : height
            }
        }

        updateNodeInfo() {
            // this.getNodeName(type)
            this.getNodeHeight("nodes")
            if (tools.WWW.api_clis && tools.WWW.api_clis != "") {
                this.getNodeHeight("clis")
            }
        }
    }
}