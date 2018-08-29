/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />
/// <reference path="../tools/neo-ts.d.ts"/>

namespace BlackCat {
    // 创建钱包视图
    export class WalletCreateView extends ViewBase {

        private inputPwd: HTMLInputElement;
        private inputVwd: HTMLInputElement;

        private wallet: ThinNeo.nep6wallet;

        constructor() {
            super();
            this.wallet = new ThinNeo.nep6wallet();
        }

        create() {
            // console.log("[BlaCat]", '[WalletCreateView] 创建 ...")

            this.div = this.objCreate('div') as HTMLDivElement
            this.div.classList.add("pc_popup")
            //弹窗的框
            var popupbox = this.objCreate('div')
            popupbox.classList.add("pc_popupbox")
            this.ObjAppend(this.div, popupbox)

            // 弹窗的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_popup_title")
            popupTitle.innerText = Main.langMgr.get("walletCreate_create") // "创建钱包"
            this.ObjAppend(popupbox, popupTitle)




            this.inputPwd = this.objCreate("input") as HTMLInputElement
            this.inputPwd.type = "password";
            this.inputPwd.placeholder = Main.langMgr.get("walletCreate_password") // "输入密码"
            this.ObjAppend(popupbox, this.inputPwd)


            this.inputVwd = this.objCreate("input") as HTMLInputElement
            this.inputVwd.type = "password"
            this.inputVwd.placeholder = Main.langMgr.get("walletCreate_vpass") // "确认密码"
            this.ObjAppend(popupbox, this.inputVwd)

            var createPrompt = this.objCreate("div")
            createPrompt.classList.add("pc_prompt")
            createPrompt.textContent = Main.langMgr.get("walletCreate_password_notice") //"*密码若丢失将无法找回，请谨慎保管"
            this.ObjAppend(popupbox, createPrompt)


            // 弹窗按钮外框
            var popupbutbox = this.objCreate('div')
            popupbutbox.classList.add("pc_popupbutbox")
            this.ObjAppend(popupbox, popupbutbox)

            // 取消
            var popupClose = this.objCreate('button')
            popupClose.classList.add("pc_cancel")
            popupClose.textContent = Main.langMgr.get("cancel") // "取消"
            popupClose.onclick = () => {
                this.remove(300)
            }
            this.ObjAppend(popupbutbox, popupClose)

            var doCreate = this.objCreate("button")
            doCreate.textContent = Main.langMgr.get("walletCreate_doCreate") // "创建"
            doCreate.onclick = () => {
                this.doCreate();
            }
            this.ObjAppend(popupbutbox, doCreate)
        }

        show() {
            super.show()
            this.inputPwd.focus()
        }

        private createVerifyPwd() {
            var pwd = this.inputPwd.value;
            if (!pwd || pwd.toString().length == 0) {
                return false;
            }
            return true;
        }

        private createVerifyVwd() {
            var pwd = this.inputPwd.value;
            var vwd = this.inputVwd.value;
            if (!vwd || vwd.toString().length == 0 || pwd != vwd) {
                return false;
            }
            return true;
        }

        private doCreate() {

            if (!this.createVerifyPwd()) {
                // "请检查输入密码"
                Main.showErrMsg(("walletCreate_check_pass"), () => {
                    this.inputPwd.focus()
                })
                return;
            }

            if (!this.createVerifyVwd()) {
                // "请检查确认密码"
                Main.showErrMsg(("walletCreate_check_vpass"), () => {
                    this.inputVwd.focus()
                })
                return;
            }
            if (this.inputPwd.value.length > 32) {
                // 设置密码不能超过32个字符
                Main.showErrMsg(("walletCreate_check_exceed"), () => {
                    this.inputPwd.focus()
                })
                return;
            }

            Main.viewMgr.change("ViewLoading")

            setTimeout(() => {

                var array = new Uint8Array(32);
                var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(array)
                var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
                var addr = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);

                this.wallet.scrypt = new ThinNeo.nep6ScryptParameters();
                this.wallet.scrypt.N = 16384;
                this.wallet.scrypt.r = 8;
                this.wallet.scrypt.p = 1;
                this.wallet.accounts = [];
                this.wallet.accounts[0] = new ThinNeo.nep6account();
                this.wallet.accounts[0].address = addr;

                try {
                    ThinNeo.Helper.GetNep2FromPrivateKey(
                        key,
                        this.inputPwd.value,
                        this.wallet.scrypt.N,
                        this.wallet.scrypt.r,
                        this.wallet.scrypt.p,
                        async (info, result) => {
                            if (info == "finish") {

                                this.wallet.accounts[0].nep2key = result;
                                this.wallet.accounts[0].contract = new ThinNeo.contract();
                                var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
                                this.wallet.accounts[0].contract.script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey).toHexString();
                                var jsonstr = JSON.stringify(this.wallet.toJson());

                                // 绑定钱包
                                await this.doBindWallet();
                            }
                            Main.viewMgr.viewLoading.remove()
                        }
                    );
                }
                catch (e) {
                    Main.viewMgr.viewLoading.remove()
                    console.log("[BlaCat]", '[WalletCreateView]', 'doCreate, ThinNeo.Helper.GetNep2FromPrivateKey error => ', e.toString())
                }

            }, 300);

        }

        private async doBindWallet() {
            var wallet_bind_res: any = await ApiTool.bindWallet(
                Main.user.info.uid,
                Main.user.info.token,
                JSON.stringify(this.wallet.toJson())
            );

            if (wallet_bind_res.r) {
                Main.validateLogin();
                this.remove();
                Main.viewMgr.walletView.remove();
            } else {
                Main.showErrCode(wallet_bind_res.errCode);
            }
        }

    }
}