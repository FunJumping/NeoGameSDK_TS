/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 个人中心
    export class PersonalCenterView extends ViewBase {

        private myVip: HTMLElement;
        private myFee: HTMLElement;
        private myInfo: HTMLElement;
        private liMyinfovip: HTMLElement;
        private iMyinfovip: HTMLElement;

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
            headerH1.textContent = Main.langMgr.get("personalcenter") // "个人中心"
            this.ObjAppend(header, headerH1)

            var myinfo = this.objCreate("div")
            myinfo.classList.add("pc_myinfolist")

            var ulMyinfo = this.objCreate("ul")
            this.ObjAppend(myinfo, ulMyinfo)


            //账号
            var liMyinfoUid = this.objCreate("li")
            liMyinfoUid.style.cursor = "Default"
            liMyinfoUid.textContent = Main.langMgr.get("myinfo_uid")
            this.ObjAppend(ulMyinfo, liMyinfoUid)

            //账号内容
            var spanMyinfoUid = this.objCreate("span")
            spanMyinfoUid.textContent = this.getUid()
            this.ObjAppend(liMyinfoUid, spanMyinfoUid)

            //等级
            var liMyinfoGrade = this.objCreate("li")
            liMyinfoGrade.style.cursor = "Default"
            liMyinfoGrade.textContent = Main.langMgr.get("myinfo_leve")
            this.ObjAppend(ulMyinfo, liMyinfoGrade)

            //等级内容
            var spanMyinfoGrade = this.objCreate("span")
            spanMyinfoGrade.textContent = "Lv" + Main.user.info.lv
            this.ObjAppend(liMyinfoGrade, spanMyinfoGrade)

            //我的信息
            var liMyinfo = this.objCreate("li")
            liMyinfo.textContent = Main.langMgr.get("myInfo")
            liMyinfo.onclick = () => {
                this.hidden()
                MyInfoView.refer = "PersonalCenterView"
                Main.viewMgr.change("MyInfoView")
            }
            this.ObjAppend(ulMyinfo, liMyinfo)

            //我的信息标签
            var iMyinfo = this.objCreate("i")
            iMyinfo.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfo, iMyinfo)

            // 我的信息内容
            this.myInfo = this.objCreate("span")
            this.myInfo.textContent = Main.langMgr.get("myinfo_modify")
            this.ObjAppend(liMyinfo, this.myInfo)

            //会员
            // this.liMyinfovip = this.objCreate("li")
            // this.liMyinfovip.textContent = Main.langMgr.get("myinfo_member")
            // this.liMyinfovip.onclick = () => {
            //     this.hidden()
            //     ModifyVipView.refer = "PersonalCenterView"
            //     Main.viewMgr.change("ModifyVipView")
            // }
            // this.ObjAppend(ulMyinfo, this.liMyinfovip)

            //会员标签
            // this.iMyinfovip = this.objCreate("i")
            // this.iMyinfovip.classList.add("iconfont", "icon-bc-gengduo")
            // this.ObjAppend(this.liMyinfovip, this.iMyinfovip)

            // 会员内容
            // this.myVip = this.objCreate("span")
            // this.updateVip()


            // this.ObjAppend(this.liMyinfovip, this.myVip)


            //手续费
            var liMyinfofee = this.objCreate("li")
            liMyinfofee.textContent = Main.langMgr.get("myinfo_fee")
            liMyinfofee.onclick = () => {
                this.hidden()
                ModifyTransactionFeeView.refer = "PersonalCenterView"
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
                ModifyNetworkLineView.refer = "PersonalCenterView"
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
                SecurityCenterView.refer = "PersonalCenterView"
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
            if (PersonalCenterView.refer) {
                Main.viewMgr.change(PersonalCenterView.refer)
                PersonalCenterView.refer = null;
            }
        }

        private getUid() {
            return Main.user.info.uid;
        }

        private getFee() {
            if (Main.user.info.service_charge) {
                return Main.user.info.service_charge + " " + Main.langMgr.get("gas")
            } else {
                return Main.user.info.service_charge ? Main.user.info.service_charge : Main.langMgr.get("myinfo_fee_empty");
            }
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

        modifyFee() {
            this.myFee.textContent = this.getFee()
        }

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

        updateVip() {
            if (Main.user.info.is_vip == "0") {
                this.myVip.textContent = Main.langMgr.get("myinfo_openmember")
            } else {
                this.myVip.textContent = Main.getDate(Main.user.info.vip_end_time)
            }
            if (Main.user.info.is_forever_vip == "1") {
                this.iMyinfovip.style.display = "none"
                this.myVip.textContent = Main.langMgr.get("myinfo_permanentmember")
                this.liMyinfovip.style.cursor = "default"
                this.liMyinfovip.onclick = () => {

                }
            }
        }
    }
}