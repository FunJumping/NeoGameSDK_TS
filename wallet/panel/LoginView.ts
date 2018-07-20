/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 登录视图
    export class LoginView extends ViewBase {

        private selectArea: HTMLSelectElement;

        private inputAccount: HTMLInputElement;
        private inputPass: HTMLInputElement;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement;
            this.div.classList.add("pc_login")

            //登录标题
            var h1Title = this.objCreate("h1")
            h1Title.classList.add("pc_login_title", "iconfont", "icon-blacat")
            // h1Title.innerText = Main.platName;
            this.ObjAppend(this.div, h1Title)

            //input 登录框
            var divInput = this.objCreate("div")
            divInput.classList.add("pc_login_input")
            this.ObjAppend(this.div, divInput)


            // select 地区
            // var areaSelect = this.objCreate("div")
            // areaSelect.classList.add("pc_login_inputbox","pc_region","iconfont","icon-xiala")
            // this.ObjAppend(divInput, areaSelect)

            // this.selectArea = this.objCreate("select") as HTMLSelectElement
            // AreaView.areaInfo.forEach(
            //     area => {
            //         var option = this.objCreate("option") as HTMLOptionElement;
            //         option.setAttribute("value", area.codename);
            //         option.textContent = Main.langMgr.get("area_code_"+area.codename)
            //         this.selectArea.options.add(option)
            //     }
            // )
            // this.ObjAppend(areaSelect, this.selectArea)


            // input 手机号/邮箱
            var telInput = this.objCreate("div")
            telInput.classList.add("pc_login_inputbox", "pc_tel")
            this.ObjAppend(divInput, telInput)

            this.inputAccount = this.objCreate("input") as HTMLInputElement;
            this.inputAccount.type = "text"
            this.inputAccount.placeholder = Main.langMgr.get("login_inputAccount"); //"请输入手机号码/邮箱"
            this.ObjAppend(telInput, this.inputAccount)

            // input 密码
            var passInput = this.objCreate("div")
            passInput.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, passInput)

            this.inputPass = this.objCreate("input") as HTMLInputElement
            this.inputPass.type = "password"
            this.inputPass.placeholder = Main.langMgr.get("login_inputPass"); // "请输入密码"
            this.ObjAppend(passInput, this.inputPass)

            // 地区图标
            // var iRegion=this.objCreate("i")
            // iRegion.classList.add("iconfont","icon-diqiu")
            // this.ObjAppend(areaSelect, iRegion)

            var iIshurushouji = this.objCreate("i")
            iIshurushouji.classList.add("iconfont", "icon-my")
            this.ObjAppend(telInput, iIshurushouji)

            var iImima = this.objCreate("i")
            iImima.classList.add("iconfont", "icon-mima")
            this.ObjAppend(passInput, iImima)

            //忘记密码
            var passInput = this.objCreate("div")
            passInput.classList.add("pc_login_forgetpass")
            this.ObjAppend(divInput, passInput)

            var aForgetPass = this.objCreate("a")
            aForgetPass.textContent = Main.langMgr.get("login_textForgetpass")//"忘记密码"
            aForgetPass.onclick = () => {
                this.remove();
                Main.viewMgr.change("ForgetPasswordView")
            }
            this.ObjAppend(passInput, aForgetPass)


            // Login 登录
            var doLogin = this.objCreate("button");
            doLogin.classList.add("pc_doLogin")
            doLogin.textContent = Main.langMgr.get("login_doLogin"); // "登录"
            doLogin.onclick = () => {
                this.doLogin();
            }
            this.ObjAppend(divInput, doLogin)


            // register 注册
            var doRegister = this.objCreate("button");
            doRegister.classList.add("pc_doregister")
            doRegister.textContent = Main.langMgr.get("login_doRegister"); // "注册"
            doRegister.onclick = () => {
                this.remove();
                Main.viewMgr.change("RegisterView")
            }
            this.ObjAppend(divInput, doRegister)
        }

        start() {
            super.start()
            this.inputAccount.focus()
        }

        private getPhone() {
            // 多地区支持，转换手机号码
            return Main.getPhone(this.selectArea.value, this.inputAccount.value)
        }

        private verifyAccount() {
            var account = this.inputAccount.value;
            if (!account || account.toString().length == 0) {
                return false;
            }
            return true;
        }

        private verifyPass() {
            var pass = this.inputPass.value;
            if (!pass || pass.toString().length == 0) {
                return false;
            }
            return true;
        }

        private async doLogin() {
            // 检查phone&code
            if (!this.verifyAccount()) {
                // "请输入手机号码/邮箱"
                Main.showErrMsg("login_inputAccount_err", () => {
                    this.inputAccount.focus()
                })
                return;
            }

            // 检查密码
            if (!this.verifyPass()) {
                // "请输入密码"
                Main.showErrMsg("login_inputPass_err", () => {
                    this.inputPass.focus()
                })
                return;
            }

            var accountType = Main.checkAccountTypeLogin(this.inputAccount.value)

            var res: any;
            switch (accountType) {
                case 'email': // 邮箱
                    res = await ApiTool.emailLoginPass(this.inputAccount.value, this.inputPass.value);
                    break;
                // case 'phone': // phone
                //     res = await ApiTool.phoneLoginPass(this.getPhone(), this.inputPass.value);
                //     break;
                case 'user': // 用户名
                    res = await ApiTool.userLoginPass(this.inputAccount.value, this.inputPass.value);
                    break;
                default:
                    return;
            }

            if (res.r) {
                localStorage.setItem("userinfo", JSON.stringify(res.data));
                Main.user.getInfo();

                // 获取钱包文件
                if (res.data.wallet) {
                    var wallet_file = await ApiTool.getWalletFile(
                        res.data.uid,
                        res.data.token
                    );
                    if (wallet_file.r) {
                        localStorage.setItem(res.data.wallet, wallet_file.data);

                        // 跳转到主页面
                        this.remove();
                        Main.viewMgr.change("PayView")
                    } else {
                        // "钱包文件下载失败，请重新登录!"
                        Main.showErrMsg("login_walletDownloadFail");
                    }
                } else {
                    // 绑定钱包界面
                    this.remove();
                    Main.viewMgr.change("WalletView");
                }
            } else {
                // 登录失败
                Main.showErrCode(res.errCode);
                // Main.showErrMsg("login_loginFail");
            }
        }
    }
}