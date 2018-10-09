/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />
/// <reference path="../tools/entity.ts" />


namespace BlackCat {
    // 导入钱包视图
    export class WalletImportView extends ViewBase {

        private inputFile: HTMLInputElement;
        private inputFileText: HTMLInputElement;
        private inputPwd: HTMLInputElement;

        private filename: string;
        private filepass: string;

        private reader: FileReader;

        constructor() {
            super();

            this.filename = "";

            this.reader = new FileReader();
            this.reader.onload = async () => {
                var res = await Main.wallet.setWalletStr(this.reader.result as string);
                if (!res) {
                    // Main.showErrMsg("请选择有效的钱包文件")
                    Main.showErrMsg(("walletImport_invalid_file"))
                    this.filename = "";
                    this.inputFileText.placeholder = Main.langMgr.get("walletImport_select_file") // "请选择钱包文件"
                }
                else {
                    this.inputFileText.placeholder = this.filename;
                }
            };
            this.filepass = "";


        }

        create() {
            // console.log("[BlaCat]", '[WalletImportView] 创建 ...")

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_popup")

            //弹窗的框
            var popupbox = this.objCreate('div')
            popupbox.classList.add("pc_popupbox")
            this.ObjAppend(this.div, popupbox)

            // 弹窗的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_popup_title")
            popupTitle.innerText = Main.langMgr.get("walletImport_import") // "导入钱包"
            this.ObjAppend(popupbox, popupTitle)


            // 导入钱包文件名
            this.inputFileText = this.objCreate("input") as HTMLInputElement
            this.inputFileText.classList.add("pc_filetitle")
            this.inputFileText.type = "text"
            this.inputFileText.placeholder = Main.langMgr.get("walletImport_select_file") // "请选择钱包文件"
            this.ObjAppend(popupbox, this.inputFileText)

            // 导入钱包图标
            var inputFileI = this.objCreate("i")
            // inputFileI.type = "text"
            inputFileI.classList.add("pc_upload", "iconfont", "icon-bc-wenjianjia")
            this.ObjAppend(popupbox, inputFileI)

            // 导入钱包
            this.inputFile = this.objCreate("input") as HTMLInputElement
            this.inputFile.type = "file"
            this.inputFile.onchange = () => {
                if (this.inputFile.files && this.inputFile.files.length > 0) {
                    this.filename = this.inputFile.files[0].name;
                    this.reader.readAsText(this.inputFile.files[0]);
                }
                else {
                    this.inputFileText.placeholder = Main.langMgr.get("walletImport_select_file") // "请选择钱包文件"
                    this.filename = "";
                }
            }
            this.ObjAppend(popupbox, this.inputFile)

            // 输入密码
            this.inputPwd = this.objCreate("input") as HTMLInputElement
            this.inputPwd.placeholder = Main.langMgr.get("walletImport_password") // "请输入密码"
            this.inputPwd.type = "password"
            this.ObjAppend(popupbox, this.inputPwd)


            // 弹窗按钮外框
            var popupbutbox = this.objCreate('div')
            popupbutbox.classList.add("pc_popupbutbox")
            this.ObjAppend(popupbox, popupbutbox)


            // 弹窗的关闭按钮
            var popupClose = this.objCreate('button')
            popupClose.classList.add("pc_cancel")
            popupClose.textContent = Main.langMgr.get("cancel") // "取消"
            popupClose.onclick = () => {
                this.remove(300)
            }
            this.ObjAppend(popupbutbox, popupClose)

            // 绑定钱包按钮
            var bindobj = this.objCreate("button")
            bindobj.textContent = Main.langMgr.get("walletImport_doImport") // "绑定钱包"
            bindobj.onclick = () => {
                this.doBindWallet();
            }
            this.ObjAppend(popupbutbox, bindobj)
        }

        private async doBindWallet() {
            if (!this.filename) {
                // Main.showErrMsg("请选择钱包文件")
                Main.showErrMsg(("walletImport_select_file"))
                return;
            }

            this.filepass = this.inputPwd.value;
            if (!this.filepass || this.filepass.toString().length == 0) {
                // "请输入钱包密码"
                Main.showErrMsg(("walletImport_password"), () => {
                    this.inputPwd.focus()
                })
                return;
            }

            Main.viewMgr.change("ViewLoading")

            var res = await Main.wallet.open(this.filepass)
            if (res) {
                this.bindWallet(Main.wallet.filestr)
            }

            Main.viewMgr.viewLoading.remove()
        }

        private async bindWallet(walletStr: string) {
            var wallet_bind_res: any = await ApiTool.bindWallet(
                Main.user.info.uid,
                Main.user.info.token,
                walletStr
                //JSON.stringify(this.wallet.toJson())
            );

            if (wallet_bind_res.r) {
                // Main.showToast("绑定钱包成功！");
                Main.showToast("walletImport_bind_succ")

                Main.viewMgr.walletView.remove()
                this.remove();
                Main.validateLogin();

            } else {
                Main.showErrCode(wallet_bind_res.errCode);
            }
        }

    }
}