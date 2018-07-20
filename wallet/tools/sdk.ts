
namespace BlackCat {

    export class SDK {

        private static is_init: boolean = false;
        private static main: Main;

        // SDK初始化
        static init(appid, appkey, listener, lang = "cn"): void {
            console.log('[Bla Cat]', '[SDK]', 'init ...')

            if (SDK.is_init === false) {
                SDK.main = new Main();
                SDK.main.init(appid, appkey, listener, lang);
            }
            SDK.is_init = true;
        }
        // 设置界面语言
        static setLang(type: string) {
            console.log('[Bla Cat]', '[SDK]', 'setLang ...')

            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            this.main.setLang(type);
        }
        // 显示主界面
        static showMain() {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            this.main.showMain()
        }
        // 显示icon
        static showIcon() {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            this.main.showIcon()
        }
        // 登录
        static login(callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            SDK.main.start(callback);
        }
        // 合约读取
        static async invokescript(params, callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log('[Bla Cat]', '[SDK]', '请先登录')
                this.showMain()
                return;
            }
            var res = await SDK.main.invokescript(params);
            if (callback) callback(res)
        }
        // 合约交易
        static async makeRawTransaction(params, callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log('[Bla Cat]', '[SDK]', '请先登录')
                this.showMain()
                return;
            }
            SDK.main.makeRawTransaction(params, callback);
        }
        // 充值到游戏
        static async makeRecharge(params, callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log('[Bla Cat]', '[SDK]', '请先登录')
                this.showMain()
                return;
            }
            var res = await SDK.main.makeRecharge(params, callback);
        }
        // app确认notify
        static async confirmAppNotify(params, callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log('[Bla Cat]', '[SDK]', '请先登录')
                return;
            }
            var res = await SDK.main.confirmAppNotify(params)
            if (callback) callback(res)
        }
        // 获取余额
        static async getBalance(callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log('[Bla Cat]', '[SDK]', '请先登录')
                return;
            }
            var res = await SDK.main.getBalance();
            if (callback) callback(res)
        }
        // 获取登录用户信息
        static async getUserInfo(callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
            }
            if (!SDK.main.isLogined()) {
                console.log('[Bla Cat]', '[SDK]', '请先登录')
            }
            var res = await SDK.main.getUserInfo();
            if (callback) callback(res)
        }
        // gas转账
        static async makeGasTransfer(params, callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log('[Bla Cat]', '[SDK]', '请先登录')
                this.showMain()
                return;
            }
            var res = await SDK.main.makeGasTransfer(params, callback);
        }
        // 查询网络类型
        static async getNetType(callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init')
                return;
            }
            var res = await SDK.main.getNetType();
            if (callback) callback(res)
        }
    }

    export class NEOGAMESDK {
        private static is_init: boolean = false;

        private static callback_getUserInfo = {};
        private static callback_getSgasBalance = {};
        private static callback_invokescript = {};
        private static callback_makeRawTransaction = {};

        private static callback_makeRecharge = {};
        private static callback_getRecharge = {};
        // private static callback_makeRefundTransaction = {};
        // private static callback_makeTrans = {};
        // private static callback_getUTXO = {};


        public static getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) {
                return unescape(r[2]);
            }
            return null; //返回参数值
        }

        public static getUrlParams() {
            var url = location.search; //获取url中"?"符后的字串  
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }

        public static getRandom(callback) {
            var finished = false;
            do {
                var id = Math.random();
                if (!callback || !callback.hasOwnProperty(id)) {
                    finished = true;
                }
            }
            while (finished === false)

            return id;
        }

        private static postMessagge(event): void {
            if (event.data) {
                try {
                    var data = JSON.parse(event.data);
                    var cmd = data.cmd;
                }
                catch (e) {
                    return;
                }

                switch (cmd) {
                    case "getUserInfoRes":
                        // 获取登录用户信息
                        console.log('[Bla Cat]', '[NEOGAMESDK][postMessagge] getUserInfoRes[ ' + data.eventId + ' ] data => ', data.data)

                        NEOGAMESDK.callback_getUserInfo[data.eventId](data.data as Result);
                        delete NEOGAMESDK.callback_getUserInfo[data.eventId]
                        break;

                    case "getSgasBalanceRes":
                        // 获取sgas余额
                        console.log('[Bla Cat]', '[NEOGAMESDK][postMessagge] getSgasBalanceRes[ ' + data.eventId + ' ] data => ', data.data)

                        NEOGAMESDK.callback_getSgasBalance[data.eventId](data.data as Result);
                        delete NEOGAMESDK.callback_getSgasBalance[data.eventId]
                        break;

                    case "invokescriptRes":
                        // 合约读取
                        console.log('[Bla Cat]', '[NEOGAMESDK][postMessagge] invokescriptRes[ ' + data.eventId + ' ] data => ', data.data)

                        NEOGAMESDK.callback_invokescript[data.eventId](data.data as Result)
                        delete NEOGAMESDK.callback_invokescript[data.eventId]
                        break;

                    case "makeRawTransactionRes":
                        // 合约交易
                        console.log('[Bla Cat]', '[NEOGAMESDK][postMessagge] makeRawTransactionRes[ ' + data.eventId + ' ] data => ', data.data)

                        NEOGAMESDK.callback_makeRawTransaction[data.eventId](data.data as Result)
                        delete NEOGAMESDK.callback_makeRawTransaction[data.eventId]
                        break;

                    case "makeRechargeRes":
                        // 充值到游戏
                        console.log('[Bla Cat]', '[NEOGAMESDK][postMessagge] makeRechargeRes[ ' + data.eventId + ' ] data => ', data.data)

                        NEOGAMESDK.callback_makeRecharge[data.eventId](data.data as Result)
                        delete NEOGAMESDK.callback_makeRecharge[data.eventId]
                        break;

                    case "getRechargeRes":
                        // 充值到游戏查询
                        console.log('[Bla Cat]', '[NEOGAMESDK][postMessagge] getRechargeRes[ ' + data.eventId + ' ] data => ', data.data)

                        NEOGAMESDK.callback_getRecharge[data.eventId](data.data as Result)
                        delete NEOGAMESDK.callback_getRecharge[data.eventId]
                        break;
                    // case "makeRefundTransactionRes":
                    //     // 退款
                    //     console.log('[Bla Cat]', '[NEOGAMESDK][postMessagge] makeRefundTransactionRes[ ' + data.eventId + ' ] data => ', data.data)

                    //     NEOGAMESDK.callback_makeRefundTransaction[ data.eventId ](data.data as Result);
                    //     delete NEOGAMESDK.callback_makeRefundTransaction[ data.eventId ]
                    //     break;

                }
            }
        }




        public static init(): void {
            console.log('[Bla Cat]', '[NEOGAMESDK][init] start ...')

            if (NEOGAMESDK.is_init === false) {
                window.addEventListener("message", NEOGAMESDK.postMessagge)
            }
            NEOGAMESDK.is_init = true;
        }


        // 获取登录用户信息
        public static getUserInfo(callback: Function): void {
            console.log('[Bla Cat]', '[NEOGAMESDK][getUserInfo] start ...')

            if (NEOGAMESDK.is_init === false) {
                console.log("[NEOGAMESDK][getUserInfo] please use init first !")
                return;
            }

            let eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_getUserInfo);
            NEOGAMESDK.callback_getUserInfo[eventId] = callback;

            console.log('[Bla Cat]', '[NEOGAMESDK][getUserInfo] eventId => ', eventId)

            let cmd = { "cmd": "getUserInfo", "eventId": eventId }
            parent.window.postMessage(JSON.stringify(cmd), "*");
        }

        // 获取登录用户sgas余额
        public static getSgasBalance(callback: Function): void {
            console.log('[Bla Cat]', '[NEOGAMESDK][getSgasBalance] start ...')

            if (NEOGAMESDK.is_init === false) {
                console.log('[Bla Cat]', '[NEOGAMESDK][getSgasBalance] please use init first !');
                return;
            }

            let eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_getSgasBalance);
            NEOGAMESDK.callback_getSgasBalance[eventId] = callback;

            console.log('[Bla Cat]', '[NEOGAMESDK][getSgasBalance] eventId => ', eventId)

            let cmd = { "cmd": "getSgasBalance", "eventId": eventId }
            parent.window.postMessage(JSON.stringify(cmd), "*");
        }

        // 合约读取
        public static invokescript(data: invokescriptInfo, callback: Function) {
            console.log('[Bla Cat]', '[NEOGAMESDK][invokescript] start ...')

            if (NEOGAMESDK.is_init === false) {
                console.log("'[NEOGAMESDK][invokescript] please use init first !")
                return;
            }

            let eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_invokescript);
            NEOGAMESDK.callback_invokescript[eventId] = callback;

            console.log('[Bla Cat]', '[NEOGAMESDK][invokescript] eventId => ', eventId)

            let cmd = { "cmd": "invokescript", "eventId": eventId, "data": data }
            parent.window.postMessage(JSON.stringify(cmd), "*");
        }

        // 合约交易
        public static makeRawTransaction(data: RawTransInfo, callback: Function) {
            console.log('[Bla Cat]', '[NEOGAMESDK][makeRawTransaction] start ...')

            if (NEOGAMESDK.is_init === false) {
                console.log("[NEOGAMESDK][makeRawTransaction] please use init first !")
                return;
            }

            let eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_makeRawTransaction);
            NEOGAMESDK.callback_makeRawTransaction[eventId] = callback;

            console.log('[Bla Cat]', '[NEOGAMESDK][makeRawTransaction] eventId => ', eventId)

            let cmd = { "cmd": "makeRawTransaction", "eventId": eventId, "data": data }
            parent.window.postMessage(JSON.stringify(cmd), "*");
        }

        // 充值到游戏
        public static makeRecharge(data: MintTokenTransInfo, callback: Function) {
            console.log('[Bla Cat]', '[NEOGAMESDK][makeRecharge] start ... ')

            if (NEOGAMESDK.is_init === false) {
                console.log("[NEOGAMESDK][makeRecharge] please use init first !")
                return;
            }

            let eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_makeRecharge);
            NEOGAMESDK.callback_makeRecharge[eventId] = callback;

            console.log('[Bla Cat]', '[NEOGAMESDK][makeRecharge] eventId => ', eventId)

            let cmd = { "cmd": "makeRecharge", "eventId": eventId, "data": data }
            parent.window.postMessage(JSON.stringify(cmd), "*");
        }

        // 充值到游戏查询
        public static getRecharge(data: getMintTokenTransInfo, callback: Function) {
            console.log('[Bla Cat]', '[NEOGAMESDK][getRecharge] start ... ')

            if (NEOGAMESDK.is_init === false) {
                console.log("[NEOGAMESDK][getRecharge] please use init first !")
                return;
            }

            let eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_getRecharge);
            NEOGAMESDK.callback_getRecharge[eventId] = callback;

            console.log('[Bla Cat]', '[NEOGAMESDK][getRecharge] eventId => ', eventId)

            let cmd = { "cmd": "getRecharge", "eventId": eventId, "data": data }
            parent.window.postMessage(JSON.stringify(cmd), "*");
        }
        // 退款
        // public static makeRefundTransaction(data: RefundTransInfo, callback: Function)
        // {
        //     console.log('[Bla Cat]', '[NEOGAMESDK][makeRefundTransaction] start ...')

        //     if (NEOGAMESDK.is_init === false)
        //     {
        //         console.log("[NEOGAMESDK][makeRefundTransaction] please use init first !")
        //         return;
        //     }

        //     let eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_makeRefundTransaction);
        //     NEOGAMESDK.callback_makeRefundTransaction[ eventId ] = callback;

        //     console.log('[Bla Cat]', '[NEOGAMESDK][makeRefundTransaction] eventId => ', eventId)

        //     let cmd = { "cmd": "makeRefundTransaction", "eventId": eventId, "data": data }
        //     parent.window.postMessage(JSON.stringify(cmd), "*");
        // }

    }

    export class Result {
        err: boolean;
        info: any;
    }
}