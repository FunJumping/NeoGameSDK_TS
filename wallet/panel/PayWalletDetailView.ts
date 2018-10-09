/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 钱包详情
    export class PayWalletDetailView extends ViewBase {

        private wallet_addr: string;
        private public_key: string;
        private private_wif: string;
        private private_hex: string;

        private walletExport: HTMLElement;

        reset() {
            this.private_wif = ""
            this.private_hex = ""
        }

        create() {
            this.getWalletInfo();

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_walletdetail")

            // header 
            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            // 返回按钮
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") //"返回"
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            // h1标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("pay_walletDetail") // "钱包详情"
            this.ObjAppend(header, headerH1)


            var content = this.objCreate("div")
            content.classList.add("pc_paydetail")
            content.innerHTML
                = "<ul><li>" + Main.langMgr.get("pay_walletDetail_addr") + "<p>" + this.wallet_addr + "</p></li>"
                + "<li>" + Main.langMgr.get("pay_walletDetail_key") + "<p>" + this.public_key + "</p></li>"
                + "<li class='pc_detailhide'>" + Main.langMgr.get("pay_walletDetail_hex") + "<p>" + this.private_hex + "</p></li>"
                + "<li class='pc_detailhide'>" + Main.langMgr.get("pay_walletDetail_wif") + "<p>" + this.private_wif + "</p></li>"
            this.ObjAppend(this.div, content)

            //提示
            var divNotes = this.objCreate("div")
            divNotes.classList.add("pc_paydetailnotes")
            divNotes.innerText = Main.langMgr.get("pay_walletDetail_notice") //"为避免财产损失，展开密钥时请防止泄露。"
            this.ObjAppend(content, divNotes)

            var iMoreshow = this.objCreate("i")
            iMoreshow.classList.add("iconfont", "icon-bc-gengduo1")
            iMoreshow.onclick = () => {
                content.classList.add("pc_paydetailshow")
                iMoreshow.style.display = "none"
                iMorehide.style.display = "block"
            }
            this.ObjAppend(divNotes, iMoreshow)
            var iMorehide = this.objCreate("i")
            iMorehide.style.display = "none"
            iMorehide.classList.add("iconfont", "icon-bc-gengduo1")
            iMorehide.onclick = () => {
                content.classList.remove("pc_paydetailshow")
                iMorehide.style.display = "none"
                iMoreshow.style.display = "block"
            }
            this.ObjAppend(divNotes, iMorehide)


            // 导出钱包
            this.walletExport = this.objCreate("a")
            this.walletExport.classList.add("pc_walletExport")
            this.walletExport.textContent = Main.langMgr.get("pay_walletDetail_export") //"导出钱包"
            this.walletExport.setAttribute("download", this.wallet_addr + ".json")
            this.ObjAppend(this.div, this.walletExport)
            this.exportWallet();

            var iWalletExport = this.objCreate("i")
            iWalletExport.classList.add("iconfont", "icon-bc-daochuqianbao")
            this.ObjAppend(this.walletExport, iWalletExport)

        }

        toRefer() {
            if (PayWalletDetailView.refer) {
                Main.viewMgr.change(PayWalletDetailView.refer);
                PayWalletDetailView.refer = null;
            }
        }



        private getWalletInfo() {
            var login: tools.LoginInfo = tools.LoginInfo.getCurrentLogin();

            this.wallet_addr = tools.LoginInfo.getCurrentAddress();
            this.public_key = login.pubkey.toHexString();
            this.private_wif = ThinNeo.Helper.GetWifFromPrivateKey(login.prikey);
            this.private_hex = login.prikey.toHexString();
        }

        private async exportWallet() {
            if (Main.wallet.filestr || await Main.wallet.readWalletFile(1)) {
                var blob = new Blob([ThinNeo.Helper.String2Bytes(Main.wallet.filestr)]);
                var url = URL.createObjectURL(blob);
                this.walletExport.setAttribute('href', url)
            }
        }
    }
}