/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 注册视图
    export class ForgetPasswordView extends ViewBase {

        private selectArea: HTMLSelectElement;
        private divArea: HTMLDivElement
        private inputUid: HTMLInputElement;
        private inputAccount: HTMLInputElement;
        private inputCode: HTMLInputElement;
        private inputPass: HTMLInputElement;
        private inputVpass: HTMLInputElement;

        private getCodeCount: HTMLElement;
        private getCode: HTMLElement

        private s_getCodeCountRetry: any;
        private getCodeRetryMax: number;
        private getCodeRetry_curr: number;

        private accountType: string;

        constructor() {
            super()

            this.getCodeRetryMax = 60;
            this.getCodeRetry_curr = 0;
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement;
            this.div.classList.add("pc_bj", "pc_login", "pc_register")

            // 找回密码logo
            var divLogo = this.objCreate("div")
            divLogo.classList.add("pc_login_logo", "iconfont", "icon-bc-blacat")
            // h1Title.innerText = Main.platName;
            this.ObjAppend(this.div, divLogo)

            //注册标题
            var divTitle = this.objCreate("div")
            divTitle.classList.add("pc_login_title")
            this.ObjAppend(this.div, divTitle)

            //注册
            var h1TitleType = this.objCreate("h1")
            h1TitleType.classList.add("pc_title_tyle")
            h1TitleType.textContent = Main.langMgr.get("forgetpass_title") // "注册"
            this.ObjAppend(divTitle, h1TitleType)

            //注册方式切换
            var divTitleobj = this.objCreate("div")
            divTitleobj.classList.add("pc_title_switch")
            this.ObjAppend(divTitle, divTitleobj)


            // 手机
            var aTiletMobile = this.objCreate("a")
            aTiletMobile.classList.add("pc_tiletmobile", "pc_active")
            aTiletMobile.style.borderLeft = "0"
            aTiletMobile.textContent = Main.langMgr.get("main_phone") // 手机
            aTiletMobile.onclick = () => {
                areaSelect.style.display = "block"
                aTiletMobile.classList.add("pc_active")
                aTilEtEmail.classList.remove("pc_active")
                iIshurushouji.classList.add("icon-bc-shurushouji")
                iIshurushouji.classList.remove("icon-bc-xinxi")

                this.inputAccount.value = ""
                this.inputCode.value = ""
                this.accountType = "phone"
                this.inputAccount.placeholder = Main.langMgr.get("forgetpass_input" + this.accountType)
            }
            this.ObjAppend(divTitleobj, aTiletMobile)

            // 邮箱
            var aTilEtEmail = this.objCreate("a")
            aTilEtEmail.textContent = Main.langMgr.get("main_email") // 邮箱
            aTilEtEmail.onclick = () => {
                areaSelect.style.display = "none"
                aTilEtEmail.classList.add("pc_active")
                aTiletMobile.classList.remove("pc_active")
                iIshurushouji.classList.add("icon-bc-xinxi")
                iIshurushouji.classList.remove("icon-bc-shurushouji")

                this.inputAccount.value = ""
                this.inputCode.value = ""
                this.accountType = "email"
                this.inputAccount.placeholder = Main.langMgr.get("forgetpass_input" + this.accountType)
            }
            this.ObjAppend(divTitleobj, aTilEtEmail)

            // 找回密码框
            var divInput = this.objCreate("div")
            divInput.classList.add("pc_login_input")
            this.ObjAppend(this.div, divInput)

            // 地区
            var areaSelect = this.objCreate("div")
            areaSelect.classList.add("pc_login_inputbox")
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
                    if (area.codename == "CN") {
                        option.setAttribute("selected", "selected")
                    }
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

            // 手机号码/邮箱
            var divTel = this.objCreate("div")
            divTel.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, divTel)

            // 手机号码/邮箱 图标
            var iIshurushouji = this.objCreate("i")
            iIshurushouji.classList.add("iconfont", "icon-bc-shurushouji")
            this.ObjAppend(divTel, iIshurushouji)

            // 请输入手机号码/邮箱
            this.inputAccount = this.objCreate("input") as HTMLInputElement;
            this.inputAccount.type = "text"
            this.inputAccount.placeholder = Main.langMgr.get("forgetpass_inputphone") // "请输入手机号码"
            this.ObjAppend(divTel, this.inputAccount)

            // 验证码
            var divCode = this.objCreate("div");
            divCode.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, divCode)

            //  验证码 图标
            var iCode = this.objCreate("i")
            iCode.classList.add("iconfont", "icon-bc-dunpai1")
            this.ObjAppend(divCode, iCode)

            // 请输入验证码
            this.inputCode = this.objCreate("input") as HTMLInputElement
            this.inputCode.type = "text"
            this.inputCode.style.width = "60%"
            this.inputCode.placeholder = Main.langMgr.get("forgetpass_inputCode"); // "请输入验证码"
            this.ObjAppend(divCode, this.inputCode)

            // 密码
            var divPass = this.objCreate("div")
            divPass.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, divPass)

            // 密码 图标
            var iPass = this.objCreate("i")
            iPass.classList.add("iconfont", "icon-bc-mima")
            this.ObjAppend(divPass, iPass)

            // 请输入密码
            this.inputPass = this.objCreate("input") as HTMLInputElement
            this.inputPass.type = "password"
            this.inputPass.placeholder = Main.langMgr.get("forgetpass_inputPass") // 请输入密码
            this.ObjAppend(divPass, this.inputPass)

            // 确认密码
            var divVPass = this.objCreate("div")
            divVPass.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, divVPass)

            // 确认密码 图标
            var iVPass = this.objCreate("i")
            iVPass.classList.add("iconfont", "icon-bc-mima")
            this.ObjAppend(divVPass, iVPass)

            // 再次确认密码
            this.inputVpass = this.objCreate("input") as HTMLInputElement
            this.inputVpass.type = "password"
            this.inputVpass.placeholder = Main.langMgr.get("forgetpass_inputVpass") // 再次输入密码
            this.ObjAppend(divVPass, this.inputVpass)

            // getCode 获取验证码
            this.getCode = this.objCreate("button");
            this.getCode.textContent = Main.langMgr.get("forgetpass_getCode") //"获取验证码"
            this.getCode.onclick = () => {
                this.doGetCode();
            }
            this.ObjAppend(divCode, this.getCode)


            // 验证码倒计时
            this.getCodeCount = this.objCreate("button");
            this.getCodeCount.classList.add("pc_getPhoneCodecount");
            this.getCodeCount.textContent = Main.langMgr.get("forgetpass_getCodecount") // "重新获取(60)"
            this.ObjAppend(divCode, this.getCodeCount)

            //  直接登录
            var doForgetPassword = this.objCreate("button");
            doForgetPassword.classList.add("pc_doLogin")
            doForgetPassword.textContent = Main.langMgr.get("forgetpass_do"); // "确定"
            doForgetPassword.onclick = () => {
                this.doForgetPassword();
            }
            this.ObjAppend(divInput, doForgetPassword)

            // 返回登录
            var doLogin = this.objCreate("button");
            doLogin.classList.add("pc_loginregion")
            doLogin.textContent = Main.langMgr.get("forgetpass_doLogin"); // "返回登录"
            doLogin.onclick = () => {
                this.remove()
                Main.viewMgr.change("LoginView")
            }
            this.ObjAppend(divInput, doLogin)
        }

        start() {
            super.start()
            this.inputAccount.focus()
        }

        update() {
            super.update()
            this.doRetryCount(0)
        }

        reset() {
            if (this.s_getCodeCountRetry) clearInterval(this.s_getCodeCountRetry);
            this.accountType = "phone"
        }

        private empty(value) {
            if (value.toString().length == 0) {
                return true;
            }
            return false;
        }

        // private checkUidFormat() {
        //     var regex = /^[a-zA-Z0-9_]{4,16}$/
        //     if (regex.test(this.inputUid.value)) {
        //         return true;
        //     }
        //     return false;
        // }

        private async validateAccount(emptySkip = true) {
            if (this.empty(this.inputAccount.value)) {
                if (emptySkip) return;
                Main.showErrMsg(("forgetpass_input" + this.accountType + "_err"))
                return false;
            }
            if ((await Main.validateFormat(this.accountType, this.inputAccount)) == false) {
                return false
            }

            return await this.checkAccountFromApi();
        }

        private async validateCode() {
            if (this.empty(this.inputCode.value)) {
                Main.showErrMsg(("forgetpass_inputCode_err"))
                return false
            }
            return await Main.validateFormat("vcode", this.inputCode)
        }

        private async validatePass() {
            if (this.empty(this.inputPass.value)) {
                Main.showErrMsg(("forgetpass_inputPass_err"))
                return false
            }
            return true;
        }

        private async validateVpass() {
            if (this.empty(this.inputVpass.value)) {
                Main.showErrMsg(("forgetpass_inputVpass_err"))
                return false;
            }
            if (this.inputVpass.value != this.inputPass.value) {
                Main.showErrMsg(("forgetpass_inputVpass_inputPass_err"))
                return false;
            }
            return true;
        }

        // 返回true，验证成功，可以继续
        private async checkAccountFromApi() {

            var res: any;
            switch (this.accountType) {
                case 'email':
                    res = await ApiTool.validEmail(this.inputAccount.value)
                    break;
                case 'phone':
                    res = await ApiTool.validPhone(this.getPhone())
                    break;
                default:
                    return;
            }
            if (res.r) {
                // 账号未注册
                Main.showErrMsg('forgetpass_input' + this.accountType + '_notexist')
                return false
            }
            return true
        }

        private async doForgetPassword() {
            // if (!(await this.validateUid(false))) return

            if (!(await this.validateAccount(false))) return

            if (!(await this.validateCode())) return

            if (!(await this.validatePass())) return

            if (!(await this.validateVpass())) return

            if (this.inputPass.value.length > 32) {
                // 设置密码不能超过32个字符
                Main.showErrMsg(("forgetpass_exceed"), () => {
                    this.inputPass.focus()
                })
                return;
            }

            var res: any;
            switch (this.accountType) {
                case 'email':
                    res = await ApiTool.forgetPassByEmail(this.inputAccount.value, this.inputCode.value, this.inputVpass.value);
                    break;
                case 'phone':
                    res = await ApiTool.forgetPassByPhone(this.getPhone(), this.inputCode.value, this.inputVpass.value);
                    break;
                default:
                    return;
            }

            if (res.r) {
                Main.showInfo('forgetpass_do_ok', () => {
                    this.remove()
                    Main.viewMgr.change("LoginView")
                })
            } else {
                // 失败
                Main.showErrCode(res.errCode);
            }
        }

        private doRetryCount(type: number) {

            switch (type) {
                case 0:
                    // 页面创建时
                    if (this.s_getCodeCountRetry) {
                        this.getCode.style.display = "none";
                        this.getCodeCount.style.display = "block";
                    }
                    break;
                case 1:
                    // 发送验证码成功后
                    this.getCodeRetry_curr = this.getCodeRetryMax
                    this.getCode.style.display = "none";
                    this.getCodeCount.style.display = "block";
                    this.s_getCodeCountRetry = setInterval(() => {
                        this._doRetryCount()
                    }, 1000)
                    break;
            }
        }

        private _doRetryCount() {
            if (this.getCodeRetry_curr > 0 && this.getCodeCount != null) {
                this.getCodeRetry_curr--;
                this.getCodeCount.innerText = Main.langMgr.get("forgetpass_getCodecountRetry") + "(" + this.getCodeRetry_curr + ")"
            } else if (this.getCodeCount != null) {
                clearInterval(this.s_getCodeCountRetry);
                this.getCodeCount.style.display = "none";
                this.getCode.style.display = "block";
                this.getCodeRetry_curr = 0
            } else {
                clearInterval(this.s_getCodeCountRetry);
                this.getCodeRetry_curr = 0
            }
        }

        private async doGetCode() {

            // if (this.empty(this.inputUid.value)) {
            //     // 请输入用户名
            //     Main.showErrMsg("forgetpass_inputUid_err", () => {
            //         this.inputUid.focus()
            //     })
            //     return;
            // }

            // 检查账号
            if (!(await this.validateAccount(false))) return

            Main.viewMgr.change("ViewLoading")

            try {
                var res;
                switch (this.accountType) {
                    case 'email':
                        res = await ApiTool.getEmailCode(this.inputAccount.value, Main.langMgr.type);
                        break;
                    case 'phone':
                        res = await ApiTool.getPhoneCode(this.getPhone());
                        break;
                    default:
                        return;
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[ForgetPasswordView]', 'doGetCode, ApiTool ' + this.accountType + 'error => ', e.toString())
            }

            Main.viewMgr.viewLoading.remove()

            if (res.r) {
                this.doRetryCount(1)
                // "验证码已成功发送"
                Main.showToast("forgetpass_getCodeSucc")
                this.getCode.style.display = "none";
                this.getCodeCount.style.display = "block";
            }
            else {
                Main.showErrCode(res.errCode)
            }
        }

        private getPhone() {
            // 多地区支持，转换手机号码
            return Main.getPhone(this.selectArea.value, this.inputAccount.value)
        }
    }
}