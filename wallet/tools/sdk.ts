
namespace BlackCat {

    export class SDK {

        private static is_init: boolean = false;
        private static main: Main;

        // SDK初始化
        static init(appid, appkey, listener, lang = "cn"): void {
            console.log("[BlaCat]", '[SDK]', 'init ...')

            if (SDK.is_init === false) {
                SDK.main = new Main();
                SDK.main.init(appid, appkey, listener, lang);
            }
            SDK.is_init = true;
        }
        // 设置界面语言
        static setLang(type: string) {
            console.log("[BlaCat]", '[SDK]', 'setLang ...')

            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            this.main.setLang(type);
        }
        // 显示主界面
        static showMain() {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            this.main.showMain()
        }
        // 显示icon
        static showIcon() {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            this.main.showIcon()
        }
        // 登录
        static login(callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            SDK.main.start(callback);
        }
        // 合约读取
        static async invokescript(params, callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '请先登录')
                this.showMain()
                return;
            }
            var res = await SDK.main.invokescript(params);
            if (callback) callback(res)
        }
        // 合约交易
        static async makeRawTransaction(params, callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '请先登录')
                this.showMain()
                return;
            }
            SDK.main.makeRawTransaction(params, callback);
        }
        // 充值到游戏
        static async makeRecharge(params, callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '请先登录')
                this.showMain()
                return;
            }
            var res = await SDK.main.makeRecharge(params, callback);
        }
        // app确认notify
        static async confirmAppNotify(params, callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '请先登录')
                return;
            }
            var res = await SDK.main.confirmAppNotify(params)
            if (callback) callback(res)
        }
        // 获取余额
        static async getBalance(callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '请先登录')
                return;
            }
            var res = await SDK.main.getBalance();
            if (callback) callback(res)
        }
        // 获取登录用户信息
        static async getUserInfo(callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '请先登录')
            }
            var res = await SDK.main.getUserInfo();
            if (callback) callback(res)
        }
        // gas转账
        static async makeGasTransfer(params, callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '请先登录')
                this.showMain()
                return;
            }
            var res = await SDK.main.makeGasTransfer(params, callback);
        }
        // gas转账（批量）
        static async makeGasTransferMulti(params, callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '请先登录')
                this.showMain()
                return;
            }
            var res = await SDK.main.makeGasTransferMulti(params, callback);
        }
        // 查询网络类型
        static async getNetType(callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            var res = await SDK.main.getNetType();
            if (callback) callback(res)
        }
        // 设置默认网络
        static async setDefaultNetType(type) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init')
                return;
            }
            SDK.main.setDefaultNetType(type)
        }
    }

    export class Result {
        err: boolean;
        info: any;
    }
}