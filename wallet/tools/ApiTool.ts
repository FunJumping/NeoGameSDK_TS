namespace BlackCat {
    export class ApiTool {

        // 外网
        static base_url: string = ''
        // static readonly base_url: string = 'http://47.52.60.231/apic/apic_user.php'

        // 内网测试
        // static readonly base_url: string = 'http://10.1.8.132/new/nel/api_c/apic_user.php'

        static makeUrl(cmd: string) {
            return this.base_url + '?cmd=' + cmd;
        }

        static async common(cmd: string, post: object) {
            let formData = new FormData();
            for (let i in post) {
                formData.append(i, post[i]);
            }
            var result = await fetch(this.makeUrl(cmd), {
                method: 'post',
                body: formData
            })
            var json = await result.json();
            return json;

        }
        static async isLogined(uid: string, token: string) {
            return this.common('user.isLogined', { uid: uid, token: token });
        }

        static async getPhoneCode(phone: string) {
            return this.common('user_phone.get_code', { phone: phone });
        }

        static async getGameIndex() {
            return this.common('nelapp_game.index', {});
        }

        static async phoneLogin(phone: string, code: string) {
            return this.common('user_phone.login', { phone: phone, code: code })
        }

        static async bindWallet(uid: string, token: string, wallet: string) {
            return this.common('user.bind_wallet', { uid: uid, token: token, wallet: wallet });
        }

        static async getWalletFile(uid: string, token: string) {
            return this.common('user.get_wallet_file', { uid: uid, token: token });
        }

        static async getEntergameParam(uid: string, token: string, g_id: string) {
            return this.common('user.get_entergame_param', { uid: uid, token: token, g_id: g_id });
        }

        static async addUserWalletLogs(uid: string, token: string, txid: string, g_id: string, cnts: string, type: string, params: string, net_type: number) {
            return this.common('user_wallet.logss', { uid: uid, token: token, txid: txid, g_id: g_id, cnts: cnts, type: type, params: params, net_type: net_type });
        }

        static async getWalletListss(uid: string, token: string, page: number, num: number, net_type: number) {
            return this.common('user_wallet.listss', { uid: uid, token: token, page: page, num: num, net_type: net_type })
        }

        static async walletNotify(uid: string, token: string, txid: string, net_type: number) {
            return this.common('user_wallet.notify', { uid: uid, token: token, txid: txid, net_type: net_type });
        }

        static async getAppWalletNotifys(uid: string, token: string, g_id: string, net_type: number) {
            return this.common('user_wallet.get_notify', { uid: uid, token: token, g_id: g_id, net_type: net_type });
        }

        static async getPlatWalletNotifys(uid: string, token: string, net_type: number) {
            return this.common('user_wallet.get_notify_plat', { uid: uid, token: token, net_type: net_type })
        }

        static async walletNotifyExt(uid: string, token: string, txid: string, ext: string, net_type: number) {
            return this.common('user_wallet.notify_ext', { uid: uid, token: token, txid: txid, ext: ext, net_type: net_type })
        }

        static async getEnterParams(uid: string, token: string, g_id: string) {
            return this.common('user.get_enter_params', { uid: uid, token: token, g_id: g_id });
        }

        static async registerByPhone(phone: string, code: string, pwd: string, region: string, uid: string) {
            return this.common('user_phone.register_pass', { phone: phone, code: code, pwd: pwd, region: region, uid: uid })
        }

        static async validPhone(phone: string) {
            return this.common('user_phone.valid_register', { phone: phone })
        }

        static async validUid(uid: string) {
            return this.common('user.valid_register', { uid: uid })
        }

        static async registerByEmail(email: string, code: string, pwd: string, region: string, uid: string) {
            return this.common('user_email.register_pass', { email: email, code: code, pwd: pwd, region: region, uid: uid })
        }

        static async validEmail(email: string) {
            return this.common('user_email.valid_register', { email: email })
        }

        static async phoneLoginPass(phone: string, pwd: string) {
            return this.common('user_phone.login_pass', { phone: phone, pwd: pwd })
        }

        static async emailLoginPass(email: string, pwd: string) {
            return this.common('user_email.login_pass', { email: email, pwd: pwd })
        }

        static async getEmailCode(email: string) {
            return this.common('user_email.get_code', { email: email })
        }

        static async userLoginPass(uid: string, pwd: string) {
            return this.common('user.login', { uid: uid, pwd: pwd })
        }

        static async modUserName(uid: string, token: string, name: string) {
            return this.common('user.mod_name', { uid: uid, token: token, name: name })
        }

        static async modUserSex(uid: string, token: string, sex: string) {
            return this.common('user.mod_sex', { uid: uid, token: token, sex: sex })
        }

        static async forgetPassByPhone(uid: string, phone_raw: string, code: string, new_pwd: string) {
            return this.common('user_phone.mod_pwd', { uid: uid, phone: phone_raw, code: code, new_pwd: new_pwd })
        }

        static async forgetPassByEmail(uid: string, email: string, code: string, new_pwd: string) {
            return this.common('user_email.mod_pwd', { uid: uid, email: email, code: code, new_pwd: new_pwd })
        }

        static async getForgetCodeByPhone(uid: string, phone_raw: string) {
            return this.common('user_phone.get_forget_code', { uid: uid, phone: phone_raw })
        }

        static async getForgetCodeByEmail(uid: string, email: string) {
            return this.common('user_email.get_forget_code', { uid: uid, email: email })
        }
    }

    export class StorageTool {
        static setStorage(key: string, value: string) {
            sessionStorage.setItem(key, value)
        }
        static getStorage(key: string): string {
            return sessionStorage.getItem(key);
        }

    }
}