/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 登录视图
    export class LoginView extends ViewBase {

        private selectArea: HTMLSelectElement;
        private divArea: HTMLDivElement;

        private inputAccount: HTMLInputElement;
        private inputPass: HTMLInputElement;

        private accountType: string;

        reset() {
            this.accountType = "user";
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement;
            this.div.classList.add("pc_bj", "pc_login")

            //登录logo
            var divLogo = this.objCreate("div")
            divLogo.classList.add("pc_login_logo", "iconfont", "icon-bc-blacat")
            // h1Title.innerText = Main.platName;
            this.ObjAppend(this.div, divLogo)

            //登录标题
            var divTitle = this.objCreate("div")
            divTitle.classList.add("pc_login_title")
            this.ObjAppend(this.div, divTitle)

            //登录
            var h1TitleType = this.objCreate("h1")
            h1TitleType.classList.add("pc_title_tyle")
            h1TitleType.textContent = Main.langMgr.get("login_doLogin") // "登录"
            this.ObjAppend(divTitle, h1TitleType)

            //登录方式切换
            var divTitleobj = this.objCreate("div")
            divTitleobj.classList.add("pc_title_switch")
            this.ObjAppend(divTitle, divTitleobj)

            // 用户名
            var aTiletUserName = this.objCreate("a")
            aTiletUserName.classList.add("pc_active")
            aTiletUserName.textContent = Main.langMgr.get("main_user") // 用户名
            aTiletUserName.onclick = () => {
                areaSelect.style.display = "none"
                aTiletUserName.classList.add("pc_active")
                aTiletMobile.classList.remove("pc_active")
                aTilEtEmail.classList.remove("pc_active")
                iIshurushouji.classList.add("icon-bc-my")
                iIshurushouji.classList.remove("icon-bc-shurushouji", "icon-bc-xinxi")

                this.inputAccount.value = ""
                this.inputPass.value = ""
                this.accountType = "user"
                this.inputAccount.placeholder = Main.langMgr.get("login_input" + this.accountType)
            }
            this.ObjAppend(divTitleobj, aTiletUserName)

            // 手机
            var aTiletMobile = this.objCreate("a")
            aTiletMobile.classList.add("pc_tiletmobile")
            aTiletMobile.textContent = Main.langMgr.get("main_phone") // 手机
            aTiletMobile.onclick = () => {
                areaSelect.style.display = "block"
                aTiletMobile.classList.add("pc_active")
                aTiletUserName.classList.remove("pc_active")
                aTilEtEmail.classList.remove("pc_active")
                iIshurushouji.classList.add("icon-bc-shurushouji")
                iIshurushouji.classList.remove("icon-bc-my", "icon-bc-xinxi")

                this.inputAccount.value = ""
                this.inputPass.value = ""
                this.accountType = "phone"
                this.inputAccount.placeholder = Main.langMgr.get("login_input" + this.accountType)
            }
            this.ObjAppend(divTitleobj, aTiletMobile)

            // 邮箱
            var aTilEtEmail = this.objCreate("a")
            aTilEtEmail.textContent = Main.langMgr.get("main_email") // 邮箱
            aTilEtEmail.onclick = () => {
                areaSelect.style.display = "none"
                aTilEtEmail.classList.add("pc_active")
                aTiletUserName.classList.remove("pc_active")
                aTiletMobile.classList.remove("pc_active")
                iIshurushouji.classList.add("icon-bc-xinxi")
                iIshurushouji.classList.remove("icon-bc-my", "icon-bc-shurushouji")

                this.inputAccount.value = ""
                this.inputPass.value = ""
                this.accountType = "email"
                this.inputAccount.placeholder = Main.langMgr.get("login_input" + this.accountType)

            }
            this.ObjAppend(divTitleobj, aTilEtEmail)


            //登录框
            var divInput = this.objCreate("div")
            divInput.classList.add("pc_login_input")
            this.ObjAppend(this.div, divInput)

            // 地区
            var areaSelect = this.objCreate("div")
            areaSelect.classList.add("pc_login_inputbox")
            areaSelect.style.display = "none"
            this.ObjAppend(divInput, areaSelect)

            // 地区 图标
            var iRegion = this.objCreate("i")
            iRegion.classList.add("iconfont", "icon-bc-diqiu")
            this.ObjAppend(areaSelect, iRegion)

            // 选择地区
            this.selectArea = this.objCreate("select") as HTMLSelectElement
            var areaInfo = AreaView.getAreaByLang(Main.langMgr.type)
            areaInfo.forEach(
                area => {
                    var option = this.objCreate("option") as HTMLOptionElement;
                    option.setAttribute("value", area.codename);
                    option.textContent = Main.langMgr.get("area_code_" + area.codename)
                    this.selectArea.options.add(option)

                }
            )
            this.selectArea.onchange = () => {
                areaInfo.forEach(
                    area => {
                        if (area.codename == this.selectArea.value) {
                            this.divArea.textContent = area.areacode
                        }
                    }
                )
            }
            this.ObjAppend(areaSelect, this.selectArea)

            // 地区区号
            this.divArea = this.objCreate("div") as HTMLDivElement
            this.divArea.classList.add("pc_area")
            areaInfo.forEach(
                area => {
                    if (area.codename == this.selectArea.value) {
                        this.divArea.textContent = area.areacode
                    }
                }
            )
            this.ObjAppend(areaSelect, this.divArea)

            // 地区下拉 图标
            var aArea = this.objCreate("a")
            aArea.classList.add("pc_areaa", "iconfont", "icon-bc-xiala")
            this.ObjAppend(areaSelect, aArea)

            // 用户名
            var divTel = this.objCreate("div")
            divTel.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, divTel)

            //  用户名 图标
            var iIshurushouji = this.objCreate("i")
            iIshurushouji.classList.add("iconfont", "icon-bc-my")
            this.ObjAppend(divTel, iIshurushouji)

            // 请输入用户名
            this.inputAccount = this.objCreate("input") as HTMLInputElement;
            this.inputAccount.type = "text"
            this.inputAccount.autocomplete = "off"
            this.inputAccount.placeholder = Main.langMgr.get("login_inputuser"); //"请输入用户名"
            this.ObjAppend(divTel, this.inputAccount)

            // 密码
            var divPass = this.objCreate("div")
            divPass.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, divPass)

            //密码图标
            var iPass = this.objCreate("i")
            iPass.classList.add("iconfont", "icon-bc-mima")
            this.ObjAppend(divPass, iPass)

            //请输入密码
            this.inputPass = this.objCreate("input") as HTMLInputElement
            this.inputPass.type = "password"
            this.inputPass.autocomplete = "off"
            this.inputPass.placeholder = Main.langMgr.get("login_inputPass"); // "请输入密码"
            this.ObjAppend(divPass, this.inputPass)




            //忘记密码
            var divForgetPass = this.objCreate("div")
            divForgetPass.classList.add("pc_login_forgetpass")
            this.ObjAppend(divInput, divForgetPass)

            var aForgetPass = this.objCreate("a")
            aForgetPass.textContent = Main.langMgr.get("login_textForgetpass")//"忘记密码"
            aForgetPass.onclick = () => {
                this.remove();
                Main.viewMgr.change("ForgetPasswordView")
            }
            this.ObjAppend(divForgetPass, aForgetPass)


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
                // "请输入手机号码/邮箱/账号"
                Main.showErrMsg("login_input" + this.accountType + "_err", () => {
                    this.inputAccount.focus()
                })
                return;
            }

            if ((await Main.validateFormat(this.accountType, this.inputAccount)) == false) {
                return
            }

            // 检查密码
            if (!this.verifyPass()) {
                // "请输入密码"
                Main.showErrMsg("login_inputPass_err", () => {
                    this.inputPass.focus()
                })
                return;
            }

            var res: any;
            switch (this.accountType) {
                case 'email': // 邮箱
                    res = await ApiTool.emailLoginPass(this.inputAccount.value, this.inputPass.value);
                    break;
                case 'phone': // phone
                    res = await ApiTool.phoneLoginPass(this.getPhone(), this.inputPass.value);
                    break;
                case 'user': // 用户名
                    res = await ApiTool.userLoginPass(this.inputAccount.value, this.inputPass.value);
                    break;
                default:
                    return;
            }

            if (res.r) {
                localStorage.setItem(Main.user.cacheKey, JSON.stringify(res.data));
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