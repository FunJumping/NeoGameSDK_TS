
namespace BlackCat {
    export class Main {

        static readonly platName = "Bla Cat"
        static platLoginType = 0; // 0，SDK；1：PAGE

        // 资源图标前缀路径
        static resHost = ''

        // SDK相关
        static appid: string;
        static appkey: string;
        static appname: string;
        static appicon: string;
        static app_recharge_addr: string;

        static user: User;
        static wallet: tools.wallet;
        static viewMgr: ViewMgr;
        static langMgr: LangMgr;
        static netMgr: NetMgr;


        static walletLogId: number; // 当前logid最大值(walletLists获取到的)

        static appWalletLogId: number; // 应用相关的logId最大值（makeRawTransaction/makeRecharge)
        static appWalletNotifyId: number; // 应用相关的notifyId最大值
        static needGetAppNotifys: boolean; // 是否需要获取notify数据
        private static appNotifyTxids: any; // 已经通知应用的txids列表

        static platWalletLogId: number; // 平台相关logid最大值（makeRefund）
        static platWalletNotifyId: number; // 平台相关notifyid最大值（主要是退款功能）
        static needGetPlatNotifys: boolean; // 平台是否需要获取notify数据
        static platNotifyTxids: any; // 平台已经通知的txids列表（refund)


        private static callback: Function; // 统一sdk调用回调接口，即sdk的listener
        private static transCallback: Function; // 接口makeRawTransaction/makeRecharge回调函数
        private static transGasCallback: Function; // 接口makeGasTransfer回调函数
        private static transGasMultiCallback: Function; // 接口makeGasTransferMulti回调函数
        private static loginFunctionCallback: Function; // 接口login的回调函数

        private static isLoginCallback: boolean;
        private static isCreated: boolean;

        private static s_update: any;


        private update_timeout_max: number;
        private update_timeout_min: number;


        constructor() {
            Main.netMgr = new NetMgr();
            Main.user = new User();
            Main.wallet = new tools.wallet();
            Main.viewMgr = new ViewMgr();
            Main.langMgr = new LangMgr();

            Main.reset()

            this.update_timeout_max = 5000;
            this.update_timeout_min = 300;

            Main.isCreated = false;

            Neo.Cryptography.RandomNumberGenerator.startCollectors();
        }

        static reset() {
            Main.appWalletLogId = 0;
            Main.appWalletNotifyId = 0;
            Main.needGetAppNotifys = false;
            Main.appNotifyTxids = {};

            Main.platWalletLogId = 0;
            Main.platWalletNotifyId = 0;
            Main.needGetPlatNotifys = false;
            Main.platNotifyTxids = {};

            Main.clearTimeout()
        }

        static clearTimeout() {
            if (Main.s_update) clearTimeout(Main.s_update)
        }

        // SDK初始化
        init(appid, appkey, callback, lang) {
            Main.appid = appid;
            Main.appkey = appkey;
            Main.callback = callback;
            Main.langMgr.setType(lang);
        }
        // SDK设置语言
        setLang(type) {
            if (Main.langMgr.setType(type) === true) {
                Main.viewMgr.update()
            }
        }
        // 显示SDK界面
        showMain() {
            if (Main.viewMgr.mainView.div.innerHTML == "") {
                return;
            }
            if (Main.viewMgr.iconView) {
                Main.viewMgr.iconView.hidden();
            }
            Main.viewMgr.mainView.show()
        }
        // 显示icon界面
        showIcon() {
            if (Main.viewMgr.mainView.div.innerHTML == "") {
                return;
            }
            Main.viewMgr.mainView.hidden()
            Main.viewMgr.change("IconView")
        }
        // 获取余额
        async getBalance() {
            var sgas = 0;
            var gas = 0;
            var balances = (await tools.WWW.api_getBalance(Main.user.info.wallet)) as tools.BalanceInfo[];
            var nep5balances = await tools.WWW.api_getnep5balanceofaddress(tools.CoinTool.id_SGAS, Main.user.info.wallet);

            if (balances) {
                //余额不唯空
                balances.map(item => (item.names = tools.CoinTool.assetID2name[item.asset])); //将列表的余额资产名称赋值
                await balances.forEach(
                    // 取GAS余额
                    balance => {
                        if (balance.asset == tools.CoinTool.id_GAS) {
                            gas = balance.balance;
                        }
                    }
                );
            }

            if (nep5balances) {
                sgas = Number(nep5balances[0]['nep5balance'])
            }
            var callback_data = {
                sgas: sgas,
                gas: gas
            }
            this.listenerCallback("getBalanceRes", callback_data);
            return callback_data;
        }

        // SDK登录
        async start(callback = null) {
            Main.loginFunctionCallback = callback;
            // 创建遮罩层
            Main.viewMgr.mainView.createMask()

            if (Main.isCreated == false) {
                // 创建定时器
                this.update();

                Main.isCreated = true;
            }
            // 检查登录
            Main.validateLogin();
        }
        // SDK登录回调
        static async loginCallback() {
            if (!Main.isLoginCallback) {
                var res = await ApiTool.getEnterParams(Main.user.info.uid, Main.user.info.token, Main.appid);
                if (res.r) {
                    Main.setGameInfo(res.data.gameParam);
                    // listener回调
                    var callback_data = {
                        cmd: "loginRes",
                        data: res.data.loginParam
                    }
                    Main.callback(JSON.stringify(callback_data));
                    // function回调
                    if (Main.loginFunctionCallback) Main.loginFunctionCallback(res.data.loginParam)

                    Main.isLoginCallback = true;
                    // 首次登录，获取应用notify
                    Main.needGetAppNotifys = true;
                    // 首次登录，获取平台notify
                    Main.needGetPlatNotifys = true;
                    console.log('[Bla Cat]', '[main]', 'loginCallback，轮询平台notify和应用notify')
                }
                else {
                    Main.showErrCode(res.errCode);
                }
            }
        }
        // SDK设置游戏信息
        static async setGameInfo(param) {
            Main.appname = param.name;
            Main.appicon = param.icon;
            Main.app_recharge_addr = param.recharge_addr;
        }
        // SDK判断是否登录
        isLogined() {
            return Main.isLoginCallback;
        }
        // SDK获取用户信息
        getUserInfo() {
            this.listenerCallback("getUserInfoRes", Main.user.info)
            return Main.user.info;
        }
        // SDK登出回调
        static async logoutCallback() {
            Main.isLoginCallback = false;
            var callback_data = {
                cmd: "logoutRes"
            }
            Main.callback(JSON.stringify(callback_data));

            // 信息清理
            Main.reset()

            // 页面登录的退回
            if (Main.platLoginType === 1) {
                window.history.back();
            }
        }
        // SDK回调
        async listenerCallback(cmd, data) {
            var callback_data = {
                cmd: cmd,
                data: data
            }
            Main.callback(JSON.stringify(callback_data));
        }
        // SDK合约读取
        async invokescript(params) {
            var res = await Main.wallet.invokescript(params)
            var callback_data = {
                params: params,
                res: res
            }
            this.listenerCallback("invokescriptRes", callback_data);
            return res;
        }
        // SDK合约交易
        async makeRawTransaction(params, callback) {
            if (Main.viewMgr.mainView.isHidden()) {
                // 如果mainView隐藏，显示出来
                Main.viewMgr.mainView.show()
                Main.viewMgr.iconView.hidden()
            }

            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 记录回调，锁定状态，当前不接收makerawtransaction请求了
                if (Main.transCallback) {
                    // 已经有请求在处理，返回
                    // Main.showErrMsg("请先确认或者取消上个交易请求再执行")
                    Main.showErrMsg("main_wait_for_last_tran")
                    return;
                }
                Main.transCallback = callback;

                // 打开确认页

                var list = new walletLists();
                list.params = JSON.stringify(params);
                list.wallet = Main.user.info.wallet;
                list.icon = Main.appicon;
                list.name = Main.appname;
                list.ctm = Math.round(new Date().getTime() / 1000).toString();
                list.cnts = "0"
                list.type = "5"

                ViewTransConfirm.list = list;
                ViewTransConfirm.refer = ""
                ViewTransConfirm.callback_params = params;

                ViewTransConfirm.callback = async (params) => {
                    console.log('[Bla Cat]', '[main]', 'makeRawTransaction交易确认..')

                    Main.viewMgr.change("ViewLoading")

                    setTimeout(async () => {
                        try {
                            var res = await Main.wallet.makeRawTransaction(params);
                        }
                        catch (e) {
                            var res = new Result()
                            res.err = true
                            res.info = e.toString()
                         }

                        // function回调
                        if (Main.transCallback) Main.transCallback(res);
                        Main.transCallback = null;
                        // listener回调
                        var callback_data = {
                            params: params,
                            res: res
                        }
                        this.listenerCallback("makeRawTransactionRes", callback_data);
                        // 重新获取钱包记录
                        await Main.viewMgr.payView.doGetWalletLists(1)
                        Main.viewMgr.viewLoading.remove()

                    }, 300);
                }
                ViewTransConfirm.callback_cancel = () => {
                    console.log('[Bla Cat]', '[main]', 'makeRawTransaction交易取消..')

                    var res = new Result();
                    res.err = true;
                    res.info = 'cancel';
                    if (Main.transCallback) Main.transCallback(res);
                    Main.transCallback = null;
                    // listener回调
                    var callback_data = {
                        params: params,
                        res: res
                    }
                    this.listenerCallback("makeRawTransactionRes", callback_data);
                    Main.transCallback = null;
                }
                Main.viewMgr.change("ViewTransConfirm")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = ""
                ViewWalletOpen.callback_params = params;
                ViewWalletOpen.callback_callback = callback;
                ViewWalletOpen.callback = (params, callback) => {
                    this.makeRawTransaction(params, callback)
                }
                ViewWalletOpen.callback_cancel = (params, callback) => {
                    var res: Result = new Result();
                    res.err = true;
                    res.info = 'cancel'

                    var callback_data = {
                        params: params,
                        res: res
                    }
                    this.listenerCallback("makeRawTransactionRes", callback_data);
                    callback(res)
                }
                Main.viewMgr.change("ViewWalletOpen")
            }
        }
        // 充值到游戏
        async makeRecharge(params, callback) {
            // 判断后台有没有配置地址，没有配置返回错误
            if (!Main.app_recharge_addr) {
                // Main.showErrMsg("应用没有配置收款钱包地址，无法充值")
                Main.showErrMsg(("main_no_app_wallet"))
                return;
            }

            if (Main.viewMgr.mainView.isHidden()) {
                // 如果mainView隐藏，显示出来
                Main.viewMgr.mainView.show()
                Main.viewMgr.iconView.hidden()
            }

            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 记录回调，锁定状态，当前不接收makerawtransaction请求了
                if (Main.transCallback) {
                    // 已经有请求在处理，返回
                    // Main.showErrMsg("请先确认或者取消上个交易请求再执行")
                    Main.showErrMsg(("main_wait_for_last_tran"))
                    return;
                }
                Main.transCallback = callback;

                // 打开确认页

                var list = new walletLists();

                if (!params.hasOwnProperty("nnc")) params['nnc'] = tools.CoinTool.id_SGAS;
                if (!params.hasOwnProperty("sbParamJson")) params['sbParamJson'] = ["(address)" + Main.user.info.wallet, "(address)" + Main.app_recharge_addr, "(integer)" + params.count * 100000000]
                if (!params.hasOwnProperty("sbPushString")) params['sbPushString'] = "transfer"

                list.params = JSON.stringify(params);
                list.wallet = Main.user.info.wallet;
                list.icon = Main.appicon;
                list.name = Main.appname;
                list.ctm = Math.round(new Date().getTime() / 1000).toString();
                list.cnts = params.count.toString();
                list.type = "3";

                ViewTransConfirm.list = list;
                ViewTransConfirm.refer = ""
                ViewTransConfirm.callback_params = params;

                ViewTransConfirm.callback = async (params) => {
                    console.log('[Bla Cat]', '[main]', 'makeRecharge交易确认..')

                    Main.viewMgr.change("ViewLoading")

                    setTimeout(async () => {
                        try {
                            var res = await Main.wallet.makeRecharge(params);
                        }
                        catch(e) {
                            var res = new Result()
                            res.err = true
                            res.info = e.toString()
                        }
                        
                        // function回调
                        if (Main.transCallback) Main.transCallback(res);
                        Main.transCallback = null;
                        // listener回调
                        var callback_data = {
                            params: params,
                            res: res
                        }
                        this.listenerCallback("makeRechargeRes", callback_data);
                        // 重新获取钱包记录
                        await Main.viewMgr.payView.doGetWalletLists(1)

                        Main.viewMgr.viewLoading.remove()

                    }, 300);
                    
                }
                ViewTransConfirm.callback_cancel = () => {
                    console.log('[Bla Cat]', '[main]', 'makeRecharge交易取消..')
                    var res = new Result();
                    res.err = true;
                    res.info = 'cancel';

                    if (Main.transCallback) Main.transCallback(res);
                    Main.transCallback = null;
                    // listener回调
                    var callback_data = {
                        params: params,
                        res: res
                    }
                    this.listenerCallback("makeRechargeRes", callback_data);
                    Main.transCallback = null;
                }
                Main.viewMgr.change("ViewTransConfirm")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = ""
                ViewWalletOpen.callback_params = params;
                ViewWalletOpen.callback_callback = callback;
                ViewWalletOpen.callback = (params, callback) => {
                    this.makeRecharge(params, callback)
                }
                ViewWalletOpen.callback_cancel = (params, callback) => {
                    var res: Result = new Result();
                    res.err = true;
                    res.info = 'cancel'

                    var callback_data = {
                        params: params,
                        res: res
                    }
                    this.listenerCallback("makeRechargeRes", callback_data);
                    callback(res)
                }
                Main.viewMgr.change("ViewWalletOpen")
            }
        }
        // gas转账
        async makeGasTransfer(params, callback = null) {
            if (Main.viewMgr.mainView.isHidden()) {
                // 如果mainView隐藏，显示出来
                Main.viewMgr.mainView.show()
                Main.viewMgr.iconView.hidden()
            }

            if (Main.isWalletOpen()) {
                // 打开钱包了
                // 记录回调，锁定状态，当前不接收makeGasTransfer请求了
                if (Main.transGasCallback) {
                    // 已经有请求在处理，返回
                    // Main.showErrMsg("请先确认或者取消上个交易请求再执行")
                    Main.showErrMsg(("main_wait_for_last_tran"))
                    return;
                }
                Main.transGasCallback = callback;

                // 打开确认页

                var list = new walletLists();

                // if (!params.hasOwnProperty("nnc")) params['nnc'] = tools.CoinTool.id_SGAS;
                // if (!params.hasOwnProperty("sbParamJson")) params['sbParamJson'] = [ "(address)" + Main.user.info.wallet, "(address)" + Main.app_recharge_addr, "(integer)" + params.count * 100000000 ]
                // if (!params.hasOwnProperty("sbPushString")) params['sbPushString'] = "transfer"

                list.params = JSON.stringify(params);
                list.wallet = Main.user.info.wallet;
                list.icon = Main.appicon;
                list.name = Main.appname;
                list.ctm = Math.round(new Date().getTime() / 1000).toString();
                list.cnts = params.count.toString();
                list.type = "6";

                ViewTransConfirmGas.list = list;
                ViewTransConfirmGas.refer = ""
                ViewTransConfirmGas.callback_params = params;

                ViewTransConfirmGas.callback = async (params) => {
                    console.log('[Bla Cat]', '[main]', 'makeGasTransfer交易确认..')

                    Main.viewMgr.change("ViewLoading")

                    setTimeout(async () => {
                        try {
                            var res: Result = await tools.CoinTool.rawTransaction(params.toaddr, tools.CoinTool.id_GAS, params.count);
                            if (res.err == false) {
                                params.sbPushString = "transfer"
                                // 成功，上报
                                await ApiTool.addUserWalletLogs(
                                    Main.user.info.uid,
                                    Main.user.info.token,
                                    res.info,
                                    Main.appid,
                                    params.count.toString(),
                                    "6",
                                    JSON.stringify(params),
                                    Main.netMgr.type
                                );
                                // 重新获取钱包记录
                                await Main.viewMgr.payView.doGetWalletLists(1)
                            }
                        }
                        catch (e) {
                            var res: Result = new Result();
                            res.err = true;
                            res.info = 'make trans err'
                            res['ext'] = e.toString()
                        }
    
                        // function回调
                        if (Main.transGasCallback) Main.transGasCallback(res);
                        Main.transGasCallback = null;
                        // listener回调
                        var callback_data = {
                            params: params,
                            res: res
                        }
                        this.listenerCallback("makeGasTransferRes", callback_data);
    
                        Main.viewMgr.viewLoading.remove()
                    }, 300);
                }
                ViewTransConfirmGas.callback_cancel = () => {
                    console.log('[Bla Cat]', '[main]', 'makeGasTransfer交易取消..')

                    var res = new Result();
                    res.err = true;
                    res.info = 'cancel';

                    if (Main.transGasCallback) {
                        Main.transGasCallback(res);
                        Main.transGasCallback = null;
                    }
                    // listener回调
                    var callback_data = {
                        params: params,
                        res: res
                    }
                    this.listenerCallback("makeRechargeRes", callback_data);
                }
                Main.viewMgr.change("ViewTransConfirmGas")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = ""
                ViewWalletOpen.callback_params = params;
                ViewWalletOpen.callback_callback = callback;
                ViewWalletOpen.callback = (params, callback) => {
                    this.makeGasTransfer(params, callback)
                }
                ViewWalletOpen.callback_cancel = (params, callback) => {
                    var res: Result = new Result();
                    res.err = true;
                    res.info = 'cancel'

                    var callback_data = {
                        params: params,
                        res: res
                    }
                    this.listenerCallback("makeGasTransferRes", callback_data);
                    callback(res)
                }
                Main.viewMgr.change("ViewWalletOpen")
            }
        }

        // gas转账（批量）
        async makeGasTransferMulti(params, callback = null) {
            if (Main.viewMgr.mainView.isHidden()) {
                // 如果mainView隐藏，显示出来
                Main.viewMgr.mainView.show()
                Main.viewMgr.iconView.hidden()
            }

            if (Main.isWalletOpen()) {
                // 打开钱包了
                // 记录回调，锁定状态，当前不接收makeGasTransferMulti请求了
                if (Main.transGasMultiCallback) {
                    // 已经有请求在处理，返回
                    // Main.showErrMsg("请先确认或者取消上个交易请求再执行")
                    Main.showErrMsg(("main_wait_for_last_tran"))
                    return;
                }
                Main.transGasMultiCallback = callback;

                // 打开确认页

                // 计算交易金额
                var _count:number = 0;
                for (let i=0; i< params.length; i++) {
                    _count += Number(params[i].count)
                }

                var list = new walletLists();

                // if (!params.hasOwnProperty("nnc")) params['nnc'] = tools.CoinTool.id_SGAS;
                // if (!params.hasOwnProperty("sbParamJson")) params['sbParamJson'] = [ "(address)" + Main.user.info.wallet, "(address)" + Main.app_recharge_addr, "(integer)" + params.count * 100000000 ]
                // if (!params.hasOwnProperty("sbPushString")) params['sbPushString'] = "transfer"

                list.params = JSON.stringify(params);
                list.wallet = Main.user.info.wallet;
                list.icon = Main.appicon;
                list.name = Main.appname;
                list.ctm = Math.round(new Date().getTime() / 1000).toString();
                list.cnts = _count.toString(); // params.count.toString();
                list.type = "6";

                ViewTransConfirmGas.list = list;
                ViewTransConfirmGas.refer = ""
                ViewTransConfirmGas.callback_params = params;

                ViewTransConfirmGas.callback = async (params) => {
                    console.log('[Bla Cat]', '[main]', 'makeGasTransferMulti交易确认..')

                    Main.viewMgr.change("ViewLoading")

                    setTimeout(async () => {
                        try {
                            var res: Result = await tools.CoinTool.rawTransactionMulti(params, tools.CoinTool.id_GAS);
                            if (res.err == false) {
                                params.map(item => (item.sbPushString = "transfer"))
                                // 成功，上报
                                await ApiTool.addUserWalletLogs(
                                    Main.user.info.uid,
                                    Main.user.info.token,
                                    res.info,
                                    Main.appid,
                                    _count.toString(),
                                    "6",
                                    JSON.stringify(params),
                                    Main.netMgr.type
                                );
                                // 重新获取钱包记录
                                await Main.viewMgr.payView.doGetWalletLists(1)
                            }
                        }
                        catch (e) {
                            var res: Result = new Result();
                            res.err = true;
                            res.info = 'make trans err'
                            res['ext'] = e.toString()
                        }
    
                        // function回调
                        if (Main.transGasMultiCallback) Main.transGasMultiCallback(res);
                        Main.transGasMultiCallback = null;
                        // listener回调
                        var callback_data = {
                            params: params,
                            res: res
                        }
                        this.listenerCallback("makeGasTransferMultiRes", callback_data);
    
                        Main.viewMgr.viewLoading.remove()
                    }, 300);
                }
                ViewTransConfirmGas.callback_cancel = () => {
                    console.log('[Bla Cat]', '[main]', 'makeGasTransfer交易取消..')

                    var res = new Result();
                    res.err = true;
                    res.info = 'cancel';

                    if (Main.transGasMultiCallback) {
                        Main.transGasMultiCallback(res);
                        Main.transGasMultiCallback = null;
                    }
                    // listener回调
                    var callback_data = {
                        params: params,
                        res: res
                    }
                    this.listenerCallback("makeRechargeRes", callback_data);
                }
                Main.viewMgr.change("ViewTransConfirmGas")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = ""
                ViewWalletOpen.callback_params = params;
                ViewWalletOpen.callback_callback = callback;
                ViewWalletOpen.callback = (params, callback) => {
                    this.makeGasTransferMulti(params, callback)
                }
                ViewWalletOpen.callback_cancel = (params, callback) => {
                    var res: Result = new Result();
                    res.err = true;
                    res.info = 'cancel'

                    var callback_data = {
                        params: params,
                        res: res
                    }
                    this.listenerCallback("makeGasTransferMultiRes", callback_data);
                    callback(res)
                }
                Main.viewMgr.change("ViewWalletOpen")
            }
        }

        async update() {
            // console.log('[Bla Cat]', '[main]', 'update ...')

            await this.getAppNotifys();
            await this.getPlatNotifys();

            // 更新payView的List时间
            if (Main.viewMgr.payView && Main.viewMgr.payView.isCreated && !Main.viewMgr.payView.isHidden()) {
                Main.viewMgr.payView.flushListCtm()
            }

            var timeout = this.update_timeout_min;
            if (this.isLogined()) {
                timeout = this.update_timeout_max;
            }
            Main.s_update = setTimeout(() => { this.update() }, timeout);
        }


        // SDK客户端合约确认回调
        async confirmAppNotify(params) {
            var data_res = await ApiTool.walletNotify(Main.user.info.uid, Main.user.info.token, params.txid, Main.netMgr.type);

            var res = new Result();

            if (data_res.r) {
                res.err = false;
                res.info = data_res.data

                var callback_data = {
                    params: params,
                    res: res
                }
                this.listenerCallback("confirmAppNotifyRes", callback_data);
                // 删除notiyTxids里面的记录
                delete Main.appNotifyTxids[params.txid];
            }
            else {
                res.err = true;
                res.info = data_res.errCode;

                var callback_data = {
                    params: params,
                    res: res
                }

                this.listenerCallback("confirmAppNotifyRes", callback_data);
            }

            return res;
        }
        // main获取交易确认通知记录
        async getAppNotifys(): Promise<boolean> {
            // 开启获取、已经有上报记录，并且没有获取到notify时开启
            if (Main.needGetAppNotifys == true || (Main.appWalletLogId && Main.appWalletLogId > Main.appWalletNotifyId)) {
                console.log('[Bla Cat]', '[main]', 'getAppNotifys, 执行前，是否获取: ' + Main.needGetAppNotifys
                    + ", 最近记录ID: " + Main.appWalletLogId
                    + ", 最近通知ID: " + Main.appWalletNotifyId)

                var res = await ApiTool.getAppWalletNotifys(Main.user.info.uid, Main.user.info.token, Main.appid, Main.netMgr.type);
                if (res.r) {
                    // 有待通知列表，找出待通知列表中记录最大ID
                    if (res.data.pending.length > 0) {
                        await res.data.pending.forEach(
                            list => {
                                var list_id = parseInt(list.id)
                                if (Main.appWalletLogId < list_id) {
                                    Main.appWalletLogId = list_id
                                }
                            }
                        )
                    }
                    else {
                        // 没有pending数据，定时获取关闭
                        console.log('[Bla Cat]', '[main]', 'getAppNotifys, 没有等待确认的数据，关闭轮询')
                        Main.needGetAppNotifys = false;
                    }

                    // 有待通知列表
                    if (res.data.complete.length > 0) {
                        var new_app_notifys = new Array();

                        // 和notifyTxids比较，看是否有新通知数据，更新最近记录ID，更新最近通知ID
                        await res.data.complete.forEach(
                            list => {
                                var list_id = parseInt(list.id)

                                if (!Main.appNotifyTxids.hasOwnProperty(list.txid)) {
                                    new_app_notifys.push(list);
                                }

                                if (Main.appWalletNotifyId < list_id) Main.appWalletNotifyId = list_id;
                                if (Main.appWalletLogId < list_id) Main.appWalletLogId = list_id;

                                // 记录数据，以便比较后发给客户端，避免后续重复发送
                                Main.appNotifyTxids[list.txid] = 1;
                            }
                        )

                        if (new_app_notifys.length > 0) {
                            console.log('[Bla Cat]', '[main]', 'getAppNotifys, 需要回调数据 => ', new_app_notifys)
                            // 有新数据
                            this.listenerCallback("getAppNotifysRes", new_app_notifys);
                        }
                    }
                }

                console.log('[Bla Cat]', '[main]', 'getAppNotifys，执行后，是否获取: ' + Main.needGetAppNotifys
                    + ", 最近记录ID: " + Main.appWalletLogId
                    + ", 最近通知ID: " + Main.appWalletNotifyId)

                return true;
            }
            return false;
        }

        private async doPlatNotify(params: Array<any>) {
            console.log('[Bla Cat]', '[main]', 'doPlatNotify, params => ', params)
            var openTask = null; // 打开钱包任务
            for (let k in params) {
                switch (params[k].type) {
                    case "2": // sgas->gas退款
                        if (params[k].state == "1") {
                            if (params[k].ext) {
                                // utxo->gas提交成功，循环获取结果，不需要开钱包
                                this.doPlatNotifyRefundRes(params[k], params[k].ext)
                            }
                            else {
                                if (!Main.isWalletOpen()) {
                                    console.log('[Bla Cat]', '[main]', '***getPlatNotifys，钱包未打开，收集数据')

                                    if (!openTask) {
                                        openTask = new Array();
                                    }
                                    openTask.push(params[k]);
                                    break;
                                }
                                // sgas->utxo确定，发起utxo->gas请求，需要打开钱包
                                this.doPlatNotiyRefund(params[k])
                            }
                        }
                        else {
                            // 失败的，直接回调
                            this.confirmPlatNotify(params[k])
                        }
                        break;
                }
            }

            if (openTask) {
                // 钱包未打开，有需要打开钱包的操作
                ViewConfirm.callback_params = openTask;
                ViewConfirm.callback = (params) => {
                    // 确认打开钱包，去打开钱包
                    ViewWalletOpen.callback_params = params;
                    ViewWalletOpen.callback = (params) => {
                        // 打开钱包完成
                        this.doPlatNotify(params)
                    }
                    ViewWalletOpen.callback_cancel = (params) => {
                        // 打开钱包取消
                        // 不打开钱包，记录一个钱包打开任务标识
                        ViewWalletOpen.addTask("getPlatNotifys", params)
                    }
                    Main.viewMgr.change("ViewWalletOpen")
                }
                ViewConfirm.callback_cancel = (params) => {
                    // 不打开钱包，记录一个钱包打开任务标识
                    ViewWalletOpen.addTask("getPlatNotifys", params)
                }
                // Main.showConFirm("提现操作需要打开钱包，是否立即打开？")
                Main.showConFirm("main_need_open_wallet_confirm")
            }
        }
        static async continueRefund() {
            // 钱包未打开，有需要打开钱包的操作
            ViewConfirm.callback = () => {
                // 确认打开钱包，去打开钱包
                Main.viewMgr.change("ViewWalletOpen")
            }
            // Main.showConFirm("提现操作需要打开钱包，是否立即打开？")
            Main.showConFirm("main_need_open_wallet_confirm")
        }

        private async doPlatNotiyRefund(params) {
            //tx的第一个utxo就是给自己的
            var utxo: tools.UTXO = new tools.UTXO();
            utxo.addr = Main.user.info.wallet;
            utxo.txid = params.txid;
            utxo.asset = tools.CoinTool.id_GAS;
            utxo.count = Neo.Fixed8.parse(params.cnts.toString());
            utxo.n = 0;

            // 生成转换请求
            var utxos_assets = {};
            utxos_assets[tools.CoinTool.id_GAS] = [];
            utxos_assets[tools.CoinTool.id_GAS].push(utxo);

            console.log('[Bla Cat]', '[main]', 'doPlatNotiyRefund, utxos_assets => ', utxos_assets);

            try {
                var makeTranRes: Result = tools.CoinTool.makeTran(
                    utxos_assets,
                    Main.user.info.wallet,
                    tools.CoinTool.id_GAS,
                    Neo.Fixed8.fromNumber(Number(params.cnts))
                );
            } catch (e) {
                // Main.showErrMsg("生成转换请求（utxo->gas）失败");
                Main.showErrMsg(("main_refund_second_fail"))
                return;
            }

            var tran: any = makeTranRes.info.tran;
            var oldarr: Array<tools.OldUTXO> = makeTranRes.info.oldarr;

            tran.type = ThinNeo.TransactionType.ContractTransaction;
            tran.version = 0;

            //sign and broadcast
            //做智能合约的签名
            var r = await tools.WWW.api_getcontractstate(tools.CoinTool.id_SGAS);

            if (r && r["script"]) {
                var sgasScript = r["script"].hexToBytes();

                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitPushNumber(new Neo.BigInteger(0));
                sb.EmitPushNumber(new Neo.BigInteger(0));
                tran.AddWitnessScript(sgasScript, sb.ToArray());

                var txid = tran.GetHash().clone().reverse().toHexString();

                var trandata = tran.GetRawData();

                // 发送转换请求
                r = await tools.WWW.api_postRawTransaction(trandata);
                if (r) {
                    console.log('[Bla Cat]', '[main]', 'doPlatNotiyRefund, api_postRawTransaction.r => ', r);

                    // 成功
                    if (r.txid) {
                        console.log('[Bla Cat]', '[main]', 'doPlatNotiyRefund, txid => ', r.txid);
                        // 确认转换请求
                        // this.confirmPlatNotifyExt(params)
                        var res = await this.confirmPlatNotifyExt(params, r.txid);
                        // 轮询请求r.txid的交易状态
                        this.doPlatNotifyRefundRes(params, r.txid)
                        // 记录使用的utxo，后面不再使用，需要记录高度
                        var height = await tools.WWW.api_getHeight();
                        oldarr.map(old => old.height = height);
                        tools.OldUTXO.oldutxosPush(oldarr);

                        // 刷新payView的状态
                        Main.viewMgr.payView.doGetWalletLists();

                    } else {
                        // this.confirmPlatNotify(params)
                        // Main.showErrMsg("转换合约执行失败！");
                        Main.showErrMsg(("main_refund_doFail"))
                    }
                } else {
                    // Main.showErrMsg("发送转换请求失败！");
                    Main.showErrMsg(("main_refund_sendRequest_err"))
                }
            } else {
                // Main.showErrMsg("获取转换合约失败！");
                Main.showErrMsg(("main_refund_getScript_err"))
            }
        }
        private async doPlatNotifyRefundRes(params, txid) {
            var r = await tools.WWW.getrawtransaction(txid)
            if (r) {
                console.log('[Bla Cat]', '[main]', 'doPlatNotifyRefundRes, txid: ' + txid + ", r => ", r)
                await this.confirmPlatNotify(params)
                // 刷新payview交易状态
                Main.viewMgr.payView.doGetWalletLists()
            }
            else {
                setTimeout(() => {
                    this.doPlatNotifyRefundRes(params, txid)
                }, 10000);
            }
        }
        // 确认回调
        private async confirmPlatNotify(params) {
            var res = await ApiTool.walletNotify(Main.user.info.uid, Main.user.info.token, params.txid, Main.netMgr.type);
            // 删除notiyTxids里面的记录
            delete Main.platNotifyTxids[params.txid];
            return res;
        }
        // 退款状态
        private async confirmPlatNotifyExt(params, ext) {
            var res = await ApiTool.walletNotifyExt(Main.user.info.uid, Main.user.info.token, params.txid, ext, Main.netMgr.type)
            return res;
        }
        // 获取平台notifys
        async getPlatNotifys(): Promise<boolean> {
            // 开启获取、已经有上报记录，并且没有获取到notify时开启
            if (Main.needGetPlatNotifys == true || (Main.platWalletLogId && Main.platWalletLogId > Main.platWalletNotifyId)) {
                console.log('[Bla Cat]', '[main]', '***getPlatNotifys, 执行前，是否获取: ' + Main.needGetPlatNotifys
                    + ', 最近记录ID: ' + Main.platWalletLogId
                    + ', 最近处理ID: ' + Main.platWalletNotifyId)

                var res = await ApiTool.getPlatWalletNotifys(Main.user.info.uid, Main.user.info.token, Main.netMgr.type);
                if (res.r) {
                    if (res.data.pending.length > 0) {
                        await res.data.pending.forEach(
                            list => {
                                var list_id = parseInt(list.id)
                                if (Main.platWalletLogId < list_id) {
                                    Main.platWalletLogId = list_id
                                }
                            }
                        )
                    }
                    else {
                        // 没有pending数据，定时获取关闭
                        console.log('[Bla Cat]', '[main]', 'getPlatNotifys, 没有等待确认的数据，关闭轮询')
                        Main.needGetPlatNotifys = false;
                    }


                    if (res.data.complete.length > 0) {
                        // 和notifyTxids比较，看是否有新通知数据
                        var new_plat_notifys = new Array();

                        await res.data.complete.forEach(
                            list => {
                                var list_id = parseInt(list.id)

                                if (!Main.platNotifyTxids.hasOwnProperty(list.txid)) {
                                    new_plat_notifys.push(list);
                                }

                                if (Main.platWalletNotifyId <= parseInt(list.id)) Main.platWalletNotifyId = parseInt(list.id);
                                if (Main.platWalletLogId < list_id) Main.platWalletLogId = list_id;

                                Main.platNotifyTxids[list.txid] = 1;
                            }
                        )
                        if (new_plat_notifys.length > 0) {
                            console.log('[Bla Cat]', '[main]', '***getPlatNotifys, 有新数据 => ', new_plat_notifys)
                            // 有新数据
                            this.doPlatNotify(new_plat_notifys)

                            // 更新PayView
                            // if (isFirst == false) Main.viewMgr.payView.doGetWalletLists()
                        }
                    }
                }

                console.log('[Bla Cat]', '[main]', '***getPlatNotifys, 执行后，是否获取: ' + Main.needGetPlatNotifys
                    + ', 最近记录ID: ' + Main.platWalletLogId
                    + ', 最近处理ID: ' + Main.platWalletNotifyId)

                return true;
            }
            return false;
        }

        // 获取网络类型
        async getNetType() {
            let type = Main.netMgr.type;
            this.listenerCallback("getNetTypeRes", type)
            return type;
        }

        static changeNetType(type: number) {
            var res = Main.netMgr.chang(type)

            var callback_data = {
                cmd: "changeNetTypeRes",
                data: type
            }
            Main.callback(JSON.stringify(callback_data));

            if (res) {
                // 替换底色
                Main.viewMgr.mainView.changNetType()
                // 刷新视图
                Main.viewMgr.update()
                // 重置
                Main.reset()
            }
        }

        static getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) {
                return unescape(r[2]);
            }
            return null; //返回参数值
        }

        static async validateLogin() {
            // 判断是否从页面登录
            var uid = Main.getUrlParam('uid');
            var token = Main.getUrlParam('token');
            if (uid && token) {
                var res_isLogined = await ApiTool.isLogined(uid, token);
                if (res_isLogined.r) {
                    localStorage.setItem("userinfo", JSON.stringify(res_isLogined.data));
                    this.user.getInfo()
                    Main.platLoginType = 1;

                    // 获取钱包文件
                    var new_wallet_file = await this.user.getWalletFile();

                    if (new_wallet_file != null) {
                        // 设置钱包文件缓存
                        localStorage.setItem(this.user.info.wallet, new_wallet_file);
                    }
                }
            }

            var res = await Main.user.validateLogin();
            switch (res) {
                case 0:
                    // 登录
                    console.log('[Bla Cat]', '[main]', '未登录 ...');
                    Main.viewMgr.change("LoginView");
                    break;
                case 1:
                    // 主页
                    console.log('[Bla Cat]', '[main]', '已登录，已绑定钱包 ...')
                    Main.viewMgr.change("PayView");
                    break;
                case -1:
                    // 绑定&导入钱包
                    console.log('[Bla Cat]', '[main]', '已登录，未绑定钱包 ...')
                    Main.viewMgr.change("WalletView");
                    break;
            }
        }

        static async showErrCode(errCode: number, callback = null) {
            var msgId = "errCode_" + errCode.toString();

            var msg = Main.langMgr.get(msgId);
            if (msg == "") {
                // "未知错误！错误码："
                msgId = "errCode_default";
                msg = Main.langMgr.get("errCode_default") + errCode;
                this.showErrMsg(msgId, callback, { errCode: errCode })
                return
            }
            if (errCode == 100701) {
                // msg = "登录失效，请重新登录";
                this.showErrMsg(msgId, () => {
                    Main.viewMgr.removeAll();
                    Main.viewMgr.change("LoginView")
                })
                Main.user.logout()
                Main.logoutCallback()
                return
            }
            this.showErrMsg(msgId, callback)
        }

        static async showErrMsg(errMsgKey: string, callback = null, content_ext = null) {
            // alert(errMsg)
            ViewAlert.content = errMsgKey;
            ViewAlert.content_ext = content_ext;
            ViewAlert.callback = callback
            Main.viewMgr.change("ViewAlert")
        }

        static async showToast(msgKey: string, showTime: number = 2500) {
            // alert(msg)
            ViewToast.content = msgKey;
            ViewToast.showTime = showTime;
            Main.viewMgr.change("ViewToast")
        }

        static async showInfo(msgKey: string, callback = null, content_ext = null) {
            // alert(msg)
            ViewAlert.content = msgKey;
            ViewAlert.content_ext = content_ext;
            ViewAlert.callback = callback
            Main.viewMgr.change("ViewAlert")
        }
        static async showConFirm(msgKey: string) {
            // alert(errMsg)
            ViewConfirm.content = msgKey;
            Main.viewMgr.change("ViewConfirm")
        }
        static async showLoading(msgKey: string) {
            // alert(errMsg)
            ViewLoading.content = msgKey;
            Main.viewMgr.change("ViewLoading")
        }

        static isWalletOpen(): boolean {
            if (Main.wallet.isOpen() && Main.user.info.wallet == Main.wallet.wallet_addr) {
                return true;
            }
            return false;
        }

        static checkAccountTypeLogin(account: string) {
            var type = "";
            var regex = /^([0-9A-Za-z\-_\.]+)@([0-9A-Za-z]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?)$/g;
            if (regex.test(account)) {
                type = "email";
            }
            else {
                type = "user";
            }
            console.log('[Bla Cat]', '[main]', 'checkAccountTypeLogin => ', type)
            return type;
        }

        static checkAccountTypeRegister(account: string) {
            var type = "";
            var regex = /^([0-9A-Za-z\-_\.]+)@([0-9A-Za-z]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?)$/g;
            if (regex.test(account)) {
                type = "email";
            }
            else {
                type = "phone";
            }
            console.log('[Bla Cat]', '[main]', 'checkAccountTypeRegister => ', type)
            return type;
        }

        static getPhone(selectArea: string, phone: string) {
            // 多地区支持，转换手机号码
            var area = AreaView.getByCodeName(selectArea)
            if (!area) return null;
            var phoneMerge = phone + '@' + area.areacode;
            return phoneMerge;
        }

        static getDate(timeString: string) {
            if (timeString != "0" && timeString != "") {
                var date = new Date(parseInt(timeString) * 1000);
                var fmt = "yyyy-MM-dd hh:mm:ss";
                var o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    S: date.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
                    );
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(
                            RegExp.$1,
                            RegExp.$1.length == 1
                                ? o[k]
                                : ("00" + o[k]).substr(("" + o[k]).length)
                        );
                return fmt;
            }
            return "";
        }

        static getObjectClass(obj) {
            if (obj && obj.constructor && obj.constructor.toString()) {
                /*
                 * for browsers which have name property in the constructor
                 * of the object,such as chrome 
                 */
                if (obj.constructor.name) {
                    return obj.constructor.name;
                }
                var str = obj.constructor.toString();
                /*
                 * executed if the return of object.constructor.toString() is 
                 * "[object objectClass]"
                 */
                if (str.charAt(0) == '[') {
                    var arr = str.match(/\[\w+\s*(\w+)\]/);
                } else {
                    /*
                     * executed if the return of object.constructor.toString() is 
                     * "function objectClass () {}"
                     * for IE Firefox
                     */
                    var arr = str.match(/function\s*(\w+)/);
                }
                if (arr && arr.length == 2) {
                    return arr[1];
                }
            }
            return undefined;
        };
    }
}