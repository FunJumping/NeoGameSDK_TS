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


            //地区
            var liMyinfoArea = this.objCreate("li")
            liMyinfoArea.textContent = Main.langMgr.get("myinfo_area")
            liMyinfoArea.onclick = () => {
                this.hidden()

                ModifyAreaView.refer = "MyInfoView"

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

        private async modifyImg() {
            ModifyImgView.callback = () => {
                this.myImg.src = this.getImg()
                this.div.focus()
            }
            ModifyImgView.callback_cancel = () => {
                this.div.focus()
            }
            Main.viewMgr.change("ModifyImgView")
        }

        private async modifyName() {
            ModifyNameView.callback = () => {
                this.myName.textContent = this.getName()
                this.div.focus()
            }
            ModifyNameView.callback_cancel = () => {
                this.div.focus()
            }
            Main.viewMgr.change("ModifyNameView")
        }
        private async modifySex() {
            ModifySexView.callback = () => {
                this.mySex.textContent = this.getSex()
                this.div.focus()
            }
            ModifySexView.callback_cancel = () => {
                this.div.focus()
            }
            Main.viewMgr.change("ModifySexView")
        }
        modifyFee() {
            this.myFee.textContent = this.getFee()
        }
        modifyArea() {
            this.myArea.textContent = this.getArea()
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
    }
}