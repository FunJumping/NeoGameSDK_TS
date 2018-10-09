/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 安全中心
    export class SecurityCenterView extends ViewBase {

        spanSignOut: HTMLElement;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_security")

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

            var divSecurity = this.objCreate("div")
            divSecurity.classList.add("pc_myinfolist")
            this.ObjAppend(this.div, divSecurity)

            var ulSecurity = this.objCreate("ul")
            this.ObjAppend(divSecurity, ulSecurity)


            //  信任合约
            var liTrust = this.objCreate("li")
            liTrust.style.cursor = "pointer"
            liTrust.textContent = Main.langMgr.get("security_trust") // "信任合约"
            liTrust.onclick = () => {
                this.hidden()
                Main.viewMgr.change("TrustContractView")
            }
            this.ObjAppend(ulSecurity, liTrust)

            // 信任合约图标
            var iTrust = this.objCreate("i")
            iTrust.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liTrust, iTrust)

            // 信任合约管理
            var spanTrust = this.objCreate("span")
            spanTrust.textContent = Main.langMgr.get("security_trust_admin") // "管理"
            this.ObjAppend(liTrust, spanTrust)

            //  自动登出钱包设置时间
            var liSignOut = this.objCreate("li")
            liSignOut.style.cursor = "pointer"
            liSignOut.textContent = Main.langMgr.get("security_walletOut") // "自动登出钱包"
            liSignOut.onclick = () => {
                this.hidden()
                Main.viewMgr.change("AutoLogoutWalletView")
            }
            this.ObjAppend(ulSecurity, liSignOut)

            // 自动登出钱包设置时间图标
            var iSignOut = this.objCreate("i")
            iSignOut.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liSignOut, iSignOut)

            // 自动登出钱包设置时间
            this.spanSignOut = this.objCreate("span")
            this.spanSignOut.textContent = this.getWalletOutTimeMaxMsg(Main.getLiveTimeMax()) // "N小时/分钟/永不"
            this.ObjAppend(liSignOut, this.spanSignOut)

            // 自动登出钱包设置时间 提示
            var divwalletOutTips = this.objCreate("div")
            divwalletOutTips.classList.add("pc_signout_tips")
            divwalletOutTips.textContent = Main.langMgr.get("security_walletOut_toast") // "当超过一定时间未操作钱包，将会自动登出，需要重新输入密码"
            this.ObjAppend(liSignOut, divwalletOutTips)

        }

        toRefer() {
            Main.viewMgr.myInfoView.show()
        }

        getWalletOutTimeMaxMsg(liveTimeMax: number) {
            if (liveTimeMax >= (60 * 60 * 1000)) {
                let hour = liveTimeMax / (60 * 60 * 1000)
                return Main.langMgr.get("security_walletOut_admin_h", { hours: hour }) // "N小时"
            }
            else if (liveTimeMax > 0) {
                let minute = liveTimeMax / (60 * 1000)
                return Main.langMgr.get("security_walletOut_admin_m", { minutes: minute }) // "N分钟"
            }
            return Main.langMgr.get("security_walletOut_admin") // "永不"
        }

        updateWalletOutTimeMaxMsg() {
            this.spanSignOut.textContent = this.getWalletOutTimeMaxMsg(Main.getLiveTimeMax())
        }
    }
}