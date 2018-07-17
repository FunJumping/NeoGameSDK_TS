
/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 注册视图
    export class ForgetPasswordView extends ViewBase {
        private selectArea: HTMLSelectElement;
        private inputUid: HTMLInputElement;
        private inputAccount: HTMLInputElement;
        private inputCode: HTMLInputElement;
        private inputPass: HTMLInputElement;
        private inputVpass: HTMLInputElement;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement;
            this.div.classList.add("pc_login", "pc_register")

            //登录标题
            var h1Title = this.objCreate("h1")
            h1Title.classList.add("pc_login_title","iconfont","icon-blacat")
            // h1Title.innerText = Main.platName;
            this.ObjAppend(this.div, h1Title)

            //input 登录框
            var divInput = this.objCreate("div")
            divInput.classList.add("pc_login_input")
            this.ObjAppend(this.div, divInput)


            // 用户名
            var userName = this.objCreate("div")
            userName.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, userName)

            this.inputUid = this.objCreate("input") as HTMLInputElement;
            this.inputUid.type = "text"
            this.inputUid.placeholder = Main.langMgr.get("forgetpass_inputUid")
            // this.inputUid.onblur = () => {
            //     this.validateUid()
            // }
            this.ObjAppend(userName, this.inputUid)

            // 地区
            // var areaSelect = this.objCreate("div")
            // areaSelect.classList.add("pc_login_inputbox", "pc_region", "iconfont", "icon-xiala")
            // this.ObjAppend(divInput, areaSelect)

            // this.selectArea = this.objCreate("select") as HTMLSelectElement
            // AreaView.areaInfo.forEach(
            //     area => {
            //         var option = this.objCreate("option") as HTMLOptionElement;
            //         option.setAttribute("value", area.codename);
            //         option.textContent = Main.langMgr.get("area_code_" + area.codename)
            //         this.selectArea.options.add(option)
            //     }
            // )
            // this.ObjAppend(areaSelect, this.selectArea)

            // input 手机号码/邮箱
            var telInput = this.objCreate("div")
            telInput.classList.add("pc_login_inputbox", "pc_tel")
            this.ObjAppend(divInput, telInput)

            this.inputAccount = this.objCreate("input") as HTMLInputElement;
            this.inputAccount.type = "text"
            this.inputAccount.placeholder = Main.langMgr.get("forgetpass_inputAccount") // "请输入手机号码/邮箱"
            // this.inputAccount.onblur = () => {
            //     this.validateAccount();
            // }
            this.ObjAppend(telInput, this.inputAccount)

            // input 验证码
            var codeInput = this.objCreate("div");
            codeInput.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, codeInput)

            this.inputCode = this.objCreate("input") as HTMLInputElement
            this.inputCode.type = "text"
            this.inputCode.placeholder = Main.langMgr.get("forgetpass_inputCode"); // "请输入验证码"
            this.ObjAppend(codeInput, this.inputCode)

            // input 密码
            var passInput = this.objCreate("div")
            passInput.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, passInput)

            this.inputPass = this.objCreate("input") as HTMLInputElement
            this.inputPass.type = "password"
            this.inputPass.placeholder = Main.langMgr.get("forgetpass_inputPass") // 请输入密码
            this.ObjAppend(passInput, this.inputPass)

            // input 确认密码
            var vPassInput = this.objCreate("div")
            vPassInput.classList.add("pc_login_inputbox")
            this.ObjAppend(divInput, vPassInput)

            this.inputVpass = this.objCreate("input") as HTMLInputElement
            this.inputVpass.type = "password"
            this.inputVpass.placeholder = Main.langMgr.get("forgetpass_inputVpass") // 再次输入密码
            this.ObjAppend(vPassInput, this.inputVpass)

            //注册框图标
            var iUserName = this.objCreate("i")
            iUserName.classList.add("iconfont", "icon-my")
            this.ObjAppend(userName, iUserName)

            // var iRegion = this.objCreate("i")
            // iRegion.classList.add("iconfont", "icon-diqiu")
            // this.ObjAppend(areaSelect, iRegion)
            var iIshurushouji = this.objCreate("i")
            iIshurushouji.classList.add("iconfont", "icon-xinxi")
            this.ObjAppend(telInput, iIshurushouji)
            var iImima = this.objCreate("i")
            iImima.classList.add("iconfont", "icon-dunpai1")
            this.ObjAppend(codeInput, iImima)
            var iPaw1 = this.objCreate("i")
            iPaw1.classList.add("iconfont", "icon-mima")
            this.ObjAppend(passInput, iPaw1)
            var iPaw2 = this.objCreate("i")
            iPaw2.classList.add("iconfont", "icon-mima")
            this.ObjAppend(vPassInput, iPaw2)


            // getCode 获取验证码
            var getCode = this.objCreate("button");
            getCode.id="pc_getPhoneCode"
            getCode.textContent = Main.langMgr.get("forgetpass_getCode") //"获取验证码"
            getCode.onclick = () => {
                this.doGetCode();
            }
            this.ObjAppend(codeInput, getCode)


            // 验证码倒计时
            var getCodecount = this.objCreate("button");
            getCodecount.classList.add("pc_getPhoneCodecount");
            getCodecount.id="pc_getPhoneCodecount"
            getCodecount.textContent = Main.langMgr.get("forgetpass_getCodecount") // "重新获取(60)"
            // getCode.onclick = () => {
            //     this.doGetCode();
            // }
            this.ObjAppend(codeInput, getCodecount)

            //  直接登录
            var doForgetPassword = this.objCreate("button");
            doForgetPassword.classList.add("pc_doLogin")
            doForgetPassword.textContent = Main.langMgr.get("forgetpass_doDirectLogin"); // "确定"
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
            this.inputUid.focus()
        }

        private empty(value) {
            if (value.toString().length == 0) {
                return true;
            }
            return false;
        }

        private getPhone() {
            // 多地区支持，转换手机号码
            return Main.getPhone(this.selectArea.value, this.inputAccount.value)
        }

        private checkUidFormat() {
            var regex = /^[a-zA-Z0-9_]{4,16}$/
            if (regex.test(this.inputUid.value)) {
                return true;
            }
            return false;
        }

        private async validateAccount(emptySkip = true) {
            if (this.empty(this.inputAccount.value)) {
                if (emptySkip) return;
                Main.showErrMsg(("forgetpass_inputAccount_err"))
                return false;
            }
            return true
        }

        private async validateUid(emptySkip = true) {
            if (this.empty(this.inputUid.value)) {
                if (emptySkip) return false;
                Main.showErrMsg(("forgetpass_inputUid_err"))
                return false;
            }
            if (this.checkUidFormat() == false) {
                Main.showErrMsg(("forgetpass_inputUid_format_err"))
                return false;
            }
            return true
        }

        private async validateCode() {
            if (this.empty(this.inputCode.value)) {
                Main.showErrMsg(("forgetpass_inputCode_err"))
                return false
            }
            return true;
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

        private async doForgetPassword() {
            if (!(await this.validateUid(false))) return

            if (!(await this.validateAccount(false))) return

            if (!(await this.validateCode())) return

            if (!(await this.validatePass())) return

            if (!(await this.validateVpass())) return

            var accountType = Main.checkAccountTypeRegister(this.inputAccount.value)

            var res: any;
            switch (accountType) {
                case 'email':
                    res = await ApiTool.forgetPassByEmail(this.inputUid.value, this.inputAccount.value, this.inputCode.value, this.inputVpass.value);
                    break;
                case 'phone':
                    res = await ApiTool.forgetPassByPhone(this.inputUid.value, this.getPhone(), this.inputCode.value, this.inputVpass.value);
                    break;
                default:
                    return;
            }

            if (res.r) {
                Main.showInfo('forgetpass_do_ok', () => {
                    this.remove
                    Main.viewMgr.change("LoginView")
                })
            } else {
                // 失败
                Main.showErrCode(res.errCode);
            }
        }

        private count_down() {

            var i = 60;

            var time = setInterval(() => {
                if (i > 0 && document.getElementById("pc_getPhoneCodecount") != null) {
                    i--;
                    document.getElementById("pc_getPhoneCodecount").innerText = Main.langMgr.get("forgetpass_getCodecountRetry") + "(" + i + ")"
                } else if (document.getElementById("pc_getPhoneCodecount") != null) {
                    clearInterval(time);
                    document.getElementById("pc_getPhoneCodecount").style.display = "none";
                    document.getElementById("pc_getPhoneCode").style.display = "block";
                } else {
                    clearInterval(time);
                }
            }, 1000);
        }

        private async doGetCode() {

            if (this.empty(this.inputUid.value)) {
                // 请输入用户名
                Main.showErrMsg("forgetpass_inputUid_err", () => {
                    this.inputUid.focus()
                })
                return;
            }

            // 检查账号是否输入
            if (this.empty(this.inputAccount.value)) {
                // "请输入手机号码"
                Main.showErrMsg(("forgetpass_inputAccount_err"), () => {
                    this.inputAccount.focus()
                })
                return;
            }

            var accountType = Main.checkAccountTypeRegister(this.inputAccount.value)

            var res;
            switch (accountType) {
                case 'email':
                    res = await ApiTool.getForgetCodeByEmail(this.inputUid.value, this.inputAccount.value);
                    break;
                case 'phone':
                    res = await ApiTool.getForgetCodeByPhone(this.inputUid.value, this.inputAccount.value);
                    break;
                default:
                    return;
            }

            if (res.r) {
                this.count_down()
                // "验证码已成功发送"
                Main.showToast("forgetpass_getCodeSucc")
                document.getElementById("pc_getPhoneCode").style.display = "none";
                document.getElementById("pc_getPhoneCodecount").style.display = "block";
            }
            else {
                Main.showErrCode(res.errCode)
            }
        }
    }
}