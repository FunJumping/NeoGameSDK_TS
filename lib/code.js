var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var BlackCat;
(function (BlackCat) {
    var BC_scriptSrc = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1].src;
    var BC_scriptName = BC_scriptSrc.split('/')[BC_scriptSrc.split('/').length - 1];
    var BC_path = BC_scriptSrc.replace(BC_scriptName, '');
    class Main {
        constructor() {
            Main.netMgr = new BlackCat.NetMgr();
            Main.user = new BlackCat.User();
            Main.wallet = new BlackCat.tools.wallet();
            Main.viewMgr = new BlackCat.ViewMgr();
            Main.langMgr = new BlackCat.LangMgr();
            Main.reset(0);
            Main.update_timeout_max = 5000;
            Main.update_timeout_min = 300;
            Main.isCreated = false;
            Neo.Cryptography.RandomNumberGenerator.startCollectors();
        }
        static reset(type = 0) {
            Main.appWalletLogId = 0;
            Main.appWalletNotifyId = 0;
            Main.appNotifyTxids = {};
            Main.platWalletLogId = 0;
            Main.platWalletNotifyId = 0;
            Main.platNotifyTxids = {};
            Main.clearTimeout();
            if (type == 0) {
                Main.needGetAppNotifys = false;
                Main.needGetPlatNotifys = false;
            }
            else {
                Main.needGetAppNotifys = true;
                Main.needGetPlatNotifys = true;
            }
        }
        static clearTimeout() {
            if (Main.s_update) {
                clearTimeout(Main.s_update);
                Main.update();
            }
        }
        init(appid, appkey, callback, lang) {
            Main.appid = appid;
            Main.appkey = appkey;
            Main.callback = callback;
            Main.langMgr.setType(lang);
        }
        start(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                Main.loginFunctionCallback = callback;
                Main.viewMgr.mainView.createMask();
                if (Main.isCreated == false) {
                    Main.netMgr.selectApi(() => {
                        Main.netMgr.change(() => {
                            Main.viewMgr.iconView.showSucc();
                            Main.viewMgr.iconView.removeState();
                            Main.viewMgr.mainView.changNetType();
                            Main.update();
                            Main.isCreated = true;
                            Main.validateLogin();
                        });
                    });
                    return;
                }
                Main.validateLogin();
            });
        }
        setLang(type) {
            if (Main.langMgr.setType(type) === true) {
                Main.viewMgr.update();
            }
        }
        setDefaultNetType(type) {
            Main.netMgr.setDefault(type);
        }
        showMain() {
            if (Main.viewMgr.mainView.div.innerHTML == "") {
                return;
            }
            if (Main.viewMgr.iconView) {
                Main.viewMgr.iconView.hidden();
            }
            Main.viewMgr.mainView.show();
        }
        showIcon() {
            if (Main.viewMgr.mainView.div.innerHTML == "") {
                return;
            }
            Main.viewMgr.mainView.hidden();
            Main.viewMgr.change("IconView");
        }
        getBalance() {
            return __awaiter(this, void 0, void 0, function* () {
                var sgas = 0;
                var gas = 0;
                var balances = (yield BlackCat.tools.WWW.api_getBalance(Main.user.info.wallet));
                var nep5balances = yield BlackCat.tools.WWW.api_getnep5balanceofaddress(BlackCat.tools.CoinTool.id_SGAS, Main.user.info.wallet);
                if (balances) {
                    balances.map(item => (item.names = BlackCat.tools.CoinTool.assetID2name[item.asset]));
                    yield balances.forEach(balance => {
                        if (balance.asset == BlackCat.tools.CoinTool.id_GAS) {
                            gas = balance.balance;
                        }
                    });
                }
                if (nep5balances) {
                    sgas = Number(nep5balances[0]['nep5balance']);
                }
                var callback_data = {
                    sgas: sgas,
                    gas: gas
                };
                Main.listenerCallback("getBalanceRes", callback_data);
                return callback_data;
            });
        }
        getUserInfo() {
            Main.listenerCallback("getUserInfoRes", Main.user.info);
            return Main.user.info;
        }
        getNetType() {
            let type = Main.netMgr.type;
            Main.listenerCallback("getNetTypeRes", type);
            return type;
        }
        invokescript(params) {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield Main.wallet.invokescript(params);
                var callback_data = {
                    params: params,
                    res: res
                };
                Main.listenerCallback("invokescriptRes", callback_data);
                return res;
            });
        }
        makeRawTransaction(params, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Main.isWalletOpen()) {
                    let unTrust = Main.getUnTrustNnc(params);
                    if (unTrust.length == 0) {
                        console.log('[Bla Cat]', '[main]', 'makeRawTransaction, trust nnc ...');
                        this._makeRawTransaction(params, "0", callback);
                        return;
                    }
                    if (Main.viewMgr.mainView.isHidden()) {
                        Main.viewMgr.mainView.show();
                        Main.viewMgr.iconView.hidden();
                    }
                    if (Main.transCallback) {
                        Main.showErrMsg("main_wait_for_last_tran");
                        return;
                    }
                    Main.transCallback = callback;
                    var list = new BlackCat.walletLists();
                    list.params = JSON.stringify(params);
                    list.wallet = Main.user.info.wallet;
                    list.icon = Main.appicon;
                    list.name = Main.appname;
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = "0";
                    list.type = "5";
                    BlackCat.ViewTransConfirm.list = list;
                    BlackCat.ViewTransConfirm.refer = "";
                    BlackCat.ViewTransConfirm.callback_params = params;
                    BlackCat.ViewTransConfirm.callback = (params, trust) => __awaiter(this, void 0, void 0, function* () {
                        console.log('[Bla Cat]', '[main]', 'makeRawTransaction交易确认..');
                        Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                yield this._makeRawTransaction(params, trust, Main.transCallback);
                            }
                            catch (e) {
                                console.log('[Bla Cat]', '[main]', 'makeRawTransaction, _makeRawTransaction(params, trust) error, params => ', params, 'trust =>', trust, 'error => ', e.toString());
                            }
                            Main.viewMgr.viewLoading.remove();
                        }), 300);
                    });
                    BlackCat.ViewTransConfirm.callback_cancel = () => {
                        console.log('[Bla Cat]', '[main]', 'makeRawTransaction交易取消..');
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        if (Main.transCallback)
                            Main.transCallback(res);
                        Main.transCallback = null;
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRawTransactionRes", callback_data);
                        Main.transCallback = null;
                    };
                    Main.viewMgr.change("ViewTransConfirm");
                }
                else {
                    if (Main.viewMgr.mainView.isHidden()) {
                        Main.viewMgr.mainView.show();
                        Main.viewMgr.iconView.hidden();
                    }
                    BlackCat.ViewWalletOpen.refer = "";
                    BlackCat.ViewWalletOpen.callback_params = params;
                    BlackCat.ViewWalletOpen.callback_callback = callback;
                    BlackCat.ViewWalletOpen.callback = (params, callback) => {
                        this.makeRawTransaction(params, callback);
                    };
                    BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRawTransactionRes", callback_data);
                        callback(res);
                    };
                    Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        _makeRawTransaction(params, trust = "0", callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                Main.setLiveTime();
                try {
                    var res = yield Main.wallet.makeRawTransaction(params, trust);
                }
                catch (e) {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = e.toString();
                    console.log('[Bla Cat]', '[main]', '_makeRawTransaction, Main.wallet.makeRawTransaction(params, trust) error, params => ', params, 'trust =>', trust, 'e => ', e.toString());
                }
                if (callback)
                    callback(res);
                Main.transCallback = null;
                var callback_data = {
                    params: params,
                    res: res
                };
                Main.listenerCallback("makeRawTransactionRes", callback_data);
                yield Main.viewMgr.payView.doGetWalletLists(1);
            });
        }
        makeRecharge(params, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Main.viewMgr.mainView.isHidden()) {
                    Main.viewMgr.mainView.show();
                    Main.viewMgr.iconView.hidden();
                }
                if (!Main.app_recharge_addr) {
                    Main.showErrMsg("main_no_app_wallet");
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = "app_wallet_not_config";
                    callback(res);
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("makeRechargeRes", callback_data);
                    return;
                }
                if (Main.viewMgr.payView && Main.viewMgr.payView.sgas < Number(params.count)) {
                    Main.showErrMsg('pay_not_enough_money');
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = "not_enough_sgas";
                    callback(res);
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("makeRechargeRes", callback_data);
                    return;
                }
                if (Main.isWalletOpen()) {
                    if (Main.transCallback) {
                        Main.showErrMsg(("main_wait_for_last_tran"));
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = "wait_for_last_tran";
                        callback(res);
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRechargeRes", callback_data);
                        return;
                    }
                    Main.transCallback = callback;
                    var list = new BlackCat.walletLists();
                    if (!params.hasOwnProperty("nnc"))
                        params['nnc'] = BlackCat.tools.CoinTool.id_SGAS;
                    if (!params.hasOwnProperty("sbParamJson"))
                        params['sbParamJson'] = ["(address)" + Main.user.info.wallet, "(address)" + Main.app_recharge_addr, "(integer)" + params.count * 100000000];
                    if (!params.hasOwnProperty("sbPushString"))
                        params['sbPushString'] = "transfer";
                    list.params = JSON.stringify(params);
                    list.wallet = Main.user.info.wallet;
                    list.icon = Main.appicon;
                    list.name = Main.appname;
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = params.count.toString();
                    list.type = "3";
                    BlackCat.ViewTransConfirm.list = list;
                    BlackCat.ViewTransConfirm.refer = "";
                    BlackCat.ViewTransConfirm.callback_params = params;
                    BlackCat.ViewTransConfirm.callback = (params) => __awaiter(this, void 0, void 0, function* () {
                        console.log('[Bla Cat]', '[main]', 'makeRecharge交易确认..');
                        Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                var res = yield Main.wallet.makeRecharge(params);
                            }
                            catch (e) {
                                var res = new BlackCat.Result();
                                res.err = true;
                                res.info = e.toString();
                                console.log('[Bla Cat]', '[main]', 'makeRecharge, Main.wallet.makeRecharge(params) error, params => ', params, 'e => ', e.toString());
                            }
                            if (Main.transCallback)
                                Main.transCallback(res);
                            Main.transCallback = null;
                            var callback_data = {
                                params: params,
                                res: res
                            };
                            Main.listenerCallback("makeRechargeRes", callback_data);
                            yield Main.viewMgr.payView.doGetWalletLists(1);
                            Main.viewMgr.viewLoading.remove();
                        }), 300);
                    });
                    BlackCat.ViewTransConfirm.callback_cancel = () => {
                        console.log('[Bla Cat]', '[main]', 'makeRecharge交易取消..');
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        if (Main.transCallback)
                            Main.transCallback(res);
                        Main.transCallback = null;
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRechargeRes", callback_data);
                        Main.transCallback = null;
                    };
                    Main.viewMgr.change("ViewTransConfirm");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "";
                    BlackCat.ViewWalletOpen.callback_params = params;
                    BlackCat.ViewWalletOpen.callback_callback = callback;
                    BlackCat.ViewWalletOpen.callback = (params, callback) => {
                        this.makeRecharge(params, callback);
                    };
                    BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRechargeRes", callback_data);
                        callback(res);
                    };
                    Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        makeGasTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Main.viewMgr.mainView.isHidden()) {
                    Main.viewMgr.mainView.show();
                    Main.viewMgr.iconView.hidden();
                }
                if (Main.viewMgr.payView && Main.viewMgr.payView.gas < Number(params.count)) {
                    Main.showErrMsg('pay_not_enough_money');
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = "not_enough_gas";
                    callback(res);
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("makeGasTransferRes", callback_data);
                    return;
                }
                if (Main.isWalletOpen()) {
                    if (Main.transGasCallback) {
                        Main.showErrMsg(("main_wait_for_last_tran"));
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = "wait_for_last_tran";
                        callback(res);
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeGasTransferRes", callback_data);
                        return;
                    }
                    Main.transGasCallback = callback;
                    var list = new BlackCat.walletLists();
                    list.params = JSON.stringify(params);
                    list.wallet = Main.user.info.wallet;
                    list.icon = Main.appicon;
                    list.name = Main.appname;
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = params.count.toString();
                    list.type = "6";
                    BlackCat.ViewTransConfirmGas.list = list;
                    BlackCat.ViewTransConfirmGas.refer = "";
                    BlackCat.ViewTransConfirmGas.callback_params = params;
                    BlackCat.ViewTransConfirmGas.callback = (params) => __awaiter(this, void 0, void 0, function* () {
                        console.log('[Bla Cat]', '[main]', 'makeGasTransfer交易确认..');
                        Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                var res = yield BlackCat.tools.CoinTool.rawTransaction(params.toaddr, BlackCat.tools.CoinTool.id_GAS, params.count);
                                if (res.err == false) {
                                    params.sbPushString = "transfer";
                                    var logRes = yield BlackCat.ApiTool.addUserWalletLogs(Main.user.info.uid, Main.user.info.token, res.info, Main.appid, params.count.toString(), "6", JSON.stringify(params), Main.netMgr.type);
                                    Main.appWalletLogId = logRes.data;
                                    yield Main.viewMgr.payView.doGetWalletLists(1);
                                }
                            }
                            catch (e) {
                                var res = new BlackCat.Result();
                                res.err = true;
                                res.info = 'make trans err';
                                res['ext'] = e.toString();
                                console.log('[Bla Cat]', '[main]', 'makeGasTransfer, ViewTransConfirmGas.callback error, params => ', params, 'e => ', e.toString());
                            }
                            if (Main.transGasCallback)
                                Main.transGasCallback(res);
                            Main.transGasCallback = null;
                            var callback_data = {
                                params: params,
                                res: res
                            };
                            Main.listenerCallback("makeGasTransferRes", callback_data);
                            Main.viewMgr.viewLoading.remove();
                        }), 300);
                    });
                    BlackCat.ViewTransConfirmGas.callback_cancel = () => {
                        console.log('[Bla Cat]', '[main]', 'makeGasTransfer交易取消..');
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        if (Main.transGasCallback) {
                            Main.transGasCallback(res);
                            Main.transGasCallback = null;
                        }
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeGasTransferRes", callback_data);
                    };
                    Main.viewMgr.change("ViewTransConfirmGas");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "";
                    BlackCat.ViewWalletOpen.callback_params = params;
                    BlackCat.ViewWalletOpen.callback_callback = callback;
                    BlackCat.ViewWalletOpen.callback = (params, callback) => {
                        this.makeGasTransfer(params, callback);
                    };
                    BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeGasTransferRes", callback_data);
                        callback(res);
                    };
                    Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        makeGasTransferMulti(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Main.viewMgr.mainView.isHidden()) {
                    Main.viewMgr.mainView.show();
                    Main.viewMgr.iconView.hidden();
                }
                var _count = 0;
                for (let i = 0; i < params.length; i++) {
                    _count += Number(params[i].count);
                }
                if (Main.viewMgr.payView && Main.viewMgr.payView.gas < Number(_count)) {
                    Main.showErrMsg('pay_not_enough_money');
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = "not_enough_gas";
                    callback(res);
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("makeGasTransferMultiRes", callback_data);
                    return;
                }
                if (Main.isWalletOpen()) {
                    if (Main.transGasMultiCallback) {
                        Main.showErrMsg(("main_wait_for_last_tran"));
                        return;
                    }
                    Main.transGasMultiCallback = callback;
                    var list = new BlackCat.walletLists();
                    list.params = JSON.stringify(params);
                    list.wallet = Main.user.info.wallet;
                    list.icon = Main.appicon;
                    list.name = Main.appname;
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = _count.toString();
                    list.type = "6";
                    BlackCat.ViewTransConfirmGas.list = list;
                    BlackCat.ViewTransConfirmGas.refer = "";
                    BlackCat.ViewTransConfirmGas.callback_params = params;
                    BlackCat.ViewTransConfirmGas.callback = (params) => __awaiter(this, void 0, void 0, function* () {
                        console.log('[Bla Cat]', '[main]', 'makeGasTransferMulti交易确认..');
                        Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                var res = yield BlackCat.tools.CoinTool.rawTransactionMulti(params, BlackCat.tools.CoinTool.id_GAS);
                                if (res.err == false) {
                                    params.map(item => (item.sbPushString = "transfer"));
                                    yield BlackCat.ApiTool.addUserWalletLogs(Main.user.info.uid, Main.user.info.token, res.info, Main.appid, _count.toString(), "6", JSON.stringify(params), Main.netMgr.type);
                                    yield Main.viewMgr.payView.doGetWalletLists(1);
                                }
                            }
                            catch (e) {
                                var res = new BlackCat.Result();
                                res.err = true;
                                res.info = 'make trans err';
                                res['ext'] = e.toString();
                                console.log('[Bla Cat]', '[main]', 'makeGasTransferMulti, ViewTransConfirmGas.callback error, params => ', params, 'e => ', e.toString());
                            }
                            if (Main.transGasMultiCallback)
                                Main.transGasMultiCallback(res);
                            Main.transGasMultiCallback = null;
                            var callback_data = {
                                params: params,
                                res: res
                            };
                            Main.listenerCallback("makeGasTransferMultiRes", callback_data);
                            Main.viewMgr.viewLoading.remove();
                        }), 300);
                    });
                    BlackCat.ViewTransConfirmGas.callback_cancel = () => {
                        console.log('[Bla Cat]', '[main]', 'makeGasTransfer交易取消..');
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        if (Main.transGasMultiCallback) {
                            Main.transGasMultiCallback(res);
                            Main.transGasMultiCallback = null;
                        }
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRechargeRes", callback_data);
                    };
                    Main.viewMgr.change("ViewTransConfirmGas");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "";
                    BlackCat.ViewWalletOpen.callback_params = params;
                    BlackCat.ViewWalletOpen.callback_callback = callback;
                    BlackCat.ViewWalletOpen.callback = (params, callback) => {
                        this.makeGasTransferMulti(params, callback);
                    };
                    BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeGasTransferMultiRes", callback_data);
                        callback(res);
                    };
                    Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        confirmAppNotify(params) {
            return __awaiter(this, void 0, void 0, function* () {
                var data_res = yield BlackCat.ApiTool.walletNotify(Main.user.info.uid, Main.user.info.token, params.txid, Main.netMgr.type);
                var res = new BlackCat.Result();
                if (data_res.r) {
                    res.err = false;
                    res.info = data_res.data;
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("confirmAppNotifyRes", callback_data);
                    delete Main.appNotifyTxids[params.txid];
                }
                else {
                    res.err = true;
                    res.info = data_res.errCode;
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("confirmAppNotifyRes", callback_data);
                }
                return res;
            });
        }
        static loginCallback() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!Main.isLoginCallback) {
                    var res = yield BlackCat.ApiTool.getEnterParams(Main.user.info.uid, Main.user.info.token, Main.appid);
                    if (res.r) {
                        Main.setGameInfo(res.data.gameParam);
                        var res_nncs = yield BlackCat.ApiTool.getTrustNncs(Main.user.info.uid, Main.user.info.token, Main.appid);
                        if (res_nncs.r) {
                            Main.app_trust = res_nncs.data;
                        }
                        else {
                            Main.app_trust = [];
                        }
                        Main.listenerCallback("loginRes", res.data.loginParam);
                        if (Main.loginFunctionCallback)
                            Main.loginFunctionCallback(res.data.loginParam);
                        Main.isLoginCallback = true;
                        Main.needGetAppNotifys = true;
                        Main.needGetPlatNotifys = true;
                        console.log('[Bla Cat]', '[main]', 'loginCallback，轮询平台notify和应用notify');
                    }
                    else {
                        Main.showErrCode(res.errCode);
                    }
                }
            });
        }
        static setGameInfo(param) {
            Main.appname = param.name;
            Main.appicon = param.icon;
            Main.app_recharge_addr = param.recharge_addr;
        }
        isLogined() {
            return Main.isLoginCallback;
        }
        static logoutCallback() {
            return __awaiter(this, void 0, void 0, function* () {
                Main.isLoginCallback = false;
                Main.listenerCallback("logoutRes", null);
                Main.reset();
                if (Main.platLoginType === 1) {
                    window.history.back();
                }
            });
        }
        static listenerCallback(cmd, data) {
            return __awaiter(this, void 0, void 0, function* () {
                var callback_data = {
                    cmd: cmd,
                    data: data
                };
                Main.callback(JSON.stringify(callback_data));
            });
        }
        static update() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield Main.getAppNotifys();
                }
                catch (e) {
                    console.log('[Bla Cat]', '[main]', 'update, Main.getAppNotifys() error => ', e.toString());
                }
                try {
                    yield Main.getPlatNotifys();
                }
                catch (e) {
                    console.log('[Bla Cat]', '[main]', 'update, Main.getPlatNotifys() error => ', e.toString());
                }
                if (Main.viewMgr.payView && Main.viewMgr.payView.isCreated && !Main.viewMgr.payView.isHidden()) {
                    try {
                        Main.viewMgr.payView.flushListCtm();
                    }
                    catch (e) {
                        console.log('[Bla Cat]', '[main]', 'update, Main.viewMgr.payView.flushListCtm() error => ', e.toString());
                    }
                }
                if (Main.liveTime && Main.liveTime > 0 && Main.liveTimeMax != 0) {
                    if (Main.isWalletOpen() == true) {
                        var cur_ts = new Date().getTime();
                        if (cur_ts - Main.liveTime > Main.liveTimeMax) {
                            Main.wallet.closeWallet();
                        }
                    }
                }
                var timeout = Main.update_timeout_min;
                if (Main.isLoginCallback) {
                    timeout = Main.update_timeout_max;
                }
                Main.s_update = setTimeout(() => { this.update(); }, timeout);
            });
        }
        static getAppNotifys() {
            return __awaiter(this, void 0, void 0, function* () {
                if (Main.needGetAppNotifys == true || (Main.appWalletLogId && Main.appWalletLogId > Main.appWalletNotifyId)) {
                    console.log('[Bla Cat]', '[main]', 'getAppNotifys, 执行前，是否获取: ' + Main.needGetAppNotifys
                        + ", 最近记录ID: " + Main.appWalletLogId
                        + ", 最近通知ID: " + Main.appWalletNotifyId);
                    var res = yield BlackCat.ApiTool.getAppWalletNotifys(Main.user.info.uid, Main.user.info.token, Main.appid, Main.netMgr.type);
                    if (res.r) {
                        if (res.data.pending.length > 0) {
                            yield res.data.pending.forEach(list => {
                                var list_id = parseInt(list.id);
                                if (Main.appWalletLogId < list_id) {
                                    Main.appWalletLogId = list_id;
                                }
                            });
                        }
                        else {
                            console.log('[Bla Cat]', '[main]', 'getAppNotifys, 没有等待确认的数据，关闭轮询');
                            Main.needGetAppNotifys = false;
                        }
                        if (res.data.complete.length > 0) {
                            var new_app_notifys = new Array();
                            yield res.data.complete.forEach(list => {
                                var list_id = parseInt(list.id);
                                if (!Main.appNotifyTxids.hasOwnProperty(list.txid)) {
                                    new_app_notifys.push(list);
                                }
                                if (Main.appWalletNotifyId < list_id)
                                    Main.appWalletNotifyId = list_id;
                                if (Main.appWalletLogId < list_id)
                                    Main.appWalletLogId = list_id;
                                Main.appNotifyTxids[list.txid] = 1;
                            });
                            if (new_app_notifys.length > 0) {
                                console.log('[Bla Cat]', '[main]', 'getAppNotifys, 需要回调数据 => ', new_app_notifys);
                                Main.listenerCallback("getAppNotifysRes", new_app_notifys);
                            }
                        }
                    }
                    console.log('[Bla Cat]', '[main]', 'getAppNotifys，执行后，是否获取: ' + Main.needGetAppNotifys
                        + ", 最近记录ID: " + Main.appWalletLogId
                        + ", 最近通知ID: " + Main.appWalletNotifyId);
                    return true;
                }
                return false;
            });
        }
        static doPlatNotify(params) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[Bla Cat]', '[main]', 'doPlatNotify, params => ', params);
                var openTask = null;
                for (let k in params) {
                    switch (params[k].type) {
                        case "2":
                            if (params[k].state == "1") {
                                if (params[k].ext) {
                                    Main.doPlatNotifyRefundRes(params[k], params[k].ext);
                                }
                                else {
                                    if (!Main.isWalletOpen()) {
                                        console.log('[Bla Cat]', '[main]', '***getPlatNotifys，钱包未打开，收集数据');
                                        if (!openTask) {
                                            openTask = new Array();
                                        }
                                        openTask.push(params[k]);
                                        break;
                                    }
                                    Main.doPlatNotiyRefund(params[k]);
                                }
                            }
                            else {
                                this.confirmPlatNotify(params[k]);
                            }
                            break;
                    }
                }
                if (openTask) {
                    BlackCat.ViewConfirm.callback_params = openTask;
                    BlackCat.ViewConfirm.callback = (params) => {
                        BlackCat.ViewWalletOpen.callback_params = params;
                        BlackCat.ViewWalletOpen.callback = (params) => {
                            this.doPlatNotify(params);
                        };
                        BlackCat.ViewWalletOpen.callback_cancel = (params) => {
                            BlackCat.ViewWalletOpen.addTask("getPlatNotifys", params);
                        };
                        Main.viewMgr.change("ViewWalletOpen");
                    };
                    BlackCat.ViewConfirm.callback_cancel = (params) => {
                        BlackCat.ViewWalletOpen.addTask("getPlatNotifys", params);
                    };
                    Main.showConFirm("main_need_open_wallet_confirm");
                }
            });
        }
        static continueRefund() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewConfirm.callback = () => {
                    Main.viewMgr.change("ViewWalletOpen");
                };
                Main.showConFirm("main_need_open_wallet_confirm");
            });
        }
        static doPlatNotiyRefund(params) {
            return __awaiter(this, void 0, void 0, function* () {
                var utxo = new BlackCat.tools.UTXO();
                utxo.addr = Main.user.info.wallet;
                utxo.txid = params.txid;
                utxo.asset = BlackCat.tools.CoinTool.id_GAS;
                utxo.count = Neo.Fixed8.parse(params.cnts.toString());
                utxo.n = 0;
                var utxos_assets = {};
                utxos_assets[BlackCat.tools.CoinTool.id_GAS] = [];
                utxos_assets[BlackCat.tools.CoinTool.id_GAS].push(utxo);
                console.log('[Bla Cat]', '[main]', 'doPlatNotiyRefund, utxos_assets => ', utxos_assets);
                try {
                    var makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, Main.user.info.wallet, BlackCat.tools.CoinTool.id_GAS, Neo.Fixed8.fromNumber(Number(params.cnts)));
                }
                catch (e) {
                    Main.showErrMsg(("main_refund_second_fail"));
                    return;
                }
                var tran = makeTranRes.info.tran;
                var oldarr = makeTranRes.info.oldarr;
                tran.type = ThinNeo.TransactionType.ContractTransaction;
                tran.version = 0;
                let id_SGAS = BlackCat.tools.CoinTool.id_SGAS;
                try {
                    let params_decode = JSON.parse(params.params);
                    if (params_decode && params_decode.hasOwnProperty("nnc")) {
                        id_SGAS = params_decode.nnc;
                    }
                }
                catch (e) { }
                var r = yield BlackCat.tools.WWW.api_getcontractstate(id_SGAS);
                if (r && r["script"]) {
                    var sgasScript = r["script"].hexToBytes();
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitPushNumber(new Neo.BigInteger(0));
                    sb.EmitPushNumber(new Neo.BigInteger(0));
                    tran.AddWitnessScript(sgasScript, sb.ToArray());
                    var txid = tran.GetHash().clone().reverse().toHexString();
                    var trandata = tran.GetRawData();
                    r = yield BlackCat.tools.WWW.api_postRawTransaction(trandata);
                    if (r) {
                        console.log('[Bla Cat]', '[main]', 'doPlatNotiyRefund, api_postRawTransaction.r => ', r);
                        if (r.txid) {
                            console.log('[Bla Cat]', '[main]', 'doPlatNotiyRefund, txid => ', r.txid);
                            var res = yield Main.confirmPlatNotifyExt(params, r.txid);
                            this.doPlatNotifyRefundRes(params, r.txid);
                            var height = yield BlackCat.tools.WWW.api_getHeight();
                            oldarr.map(old => old.height = height);
                            BlackCat.tools.OldUTXO.oldutxosPush(oldarr);
                            Main.viewMgr.payView.doGetWalletLists();
                        }
                        else {
                            Main.showErrMsg(("main_refund_doFail"));
                        }
                    }
                    else {
                        Main.showErrMsg(("main_refund_sendRequest_err"));
                    }
                }
                else {
                    Main.showErrMsg(("main_refund_getScript_err"));
                }
            });
        }
        static doPlatNotifyRefundRes(params, txid) {
            return __awaiter(this, void 0, void 0, function* () {
                var r = yield BlackCat.tools.WWW.getrawtransaction(txid);
                if (r) {
                    console.log('[Bla Cat]', '[main]', 'doPlatNotifyRefundRes, txid: ' + txid + ", r => ", r);
                    yield Main.confirmPlatNotify(params);
                    Main.viewMgr.payView.doGetWalletLists();
                }
                else {
                    setTimeout(() => {
                        this.doPlatNotifyRefundRes(params, txid);
                    }, 10000);
                }
            });
        }
        static confirmPlatNotify(params) {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.walletNotify(Main.user.info.uid, Main.user.info.token, params.txid, Main.netMgr.type);
                delete Main.platNotifyTxids[params.txid];
                return res;
            });
        }
        static confirmPlatNotifyExt(params, ext) {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.walletNotifyExt(Main.user.info.uid, Main.user.info.token, params.txid, ext, Main.netMgr.type);
                return res;
            });
        }
        static getPlatNotifys() {
            return __awaiter(this, void 0, void 0, function* () {
                if (Main.needGetPlatNotifys == true || (Main.platWalletLogId && Main.platWalletLogId > Main.platWalletNotifyId)) {
                    console.log('[Bla Cat]', '[main]', '***getPlatNotifys, 执行前，是否获取: ' + Main.needGetPlatNotifys
                        + ', 最近记录ID: ' + Main.platWalletLogId
                        + ', 最近处理ID: ' + Main.platWalletNotifyId);
                    var res = yield BlackCat.ApiTool.getPlatWalletNotifys(Main.user.info.uid, Main.user.info.token, Main.netMgr.type);
                    if (res.r) {
                        if (res.data.pending.length > 0) {
                            yield res.data.pending.forEach(list => {
                                var list_id = parseInt(list.id);
                                if (Main.platWalletLogId < list_id) {
                                    Main.platWalletLogId = list_id;
                                }
                            });
                        }
                        else {
                            console.log('[Bla Cat]', '[main]', 'getPlatNotifys, 没有等待确认的数据，关闭轮询');
                            Main.needGetPlatNotifys = false;
                        }
                        if (res.data.complete.length > 0) {
                            var new_plat_notifys = new Array();
                            yield res.data.complete.forEach(list => {
                                var list_id = parseInt(list.id);
                                if (!Main.platNotifyTxids.hasOwnProperty(list.txid)) {
                                    new_plat_notifys.push(list);
                                }
                                if (Main.platWalletNotifyId <= parseInt(list.id))
                                    Main.platWalletNotifyId = parseInt(list.id);
                                if (Main.platWalletLogId < list_id)
                                    Main.platWalletLogId = list_id;
                                Main.platNotifyTxids[list.txid] = 1;
                            });
                            if (new_plat_notifys.length > 0) {
                                console.log('[Bla Cat]', '[main]', '***getPlatNotifys, 有新数据 => ', new_plat_notifys);
                                Main.doPlatNotify(new_plat_notifys);
                            }
                        }
                    }
                    console.log('[Bla Cat]', '[main]', '***getPlatNotifys, 执行后，是否获取: ' + Main.needGetPlatNotifys
                        + ', 最近记录ID: ' + Main.platWalletLogId
                        + ', 最近处理ID: ' + Main.platWalletNotifyId);
                    return true;
                }
                return false;
            });
        }
        static changeNetType(type) {
            Main.netMgr.change(() => {
                Main.listenerCallback('changeNetTypeRes', type);
                Main.viewMgr.mainView.changNetType();
                Main.viewMgr.update();
                Main.reset(1);
            }, type);
        }
        static getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }
        static validateLogin() {
            return __awaiter(this, void 0, void 0, function* () {
                var uid = Main.getUrlParam('uid');
                var token = Main.getUrlParam('token');
                if (uid && token) {
                    var res_isLogined = yield BlackCat.ApiTool.isLogined(uid, token);
                    if (res_isLogined.r) {
                        localStorage.setItem(this.user.cacheKey, JSON.stringify(res_isLogined.data));
                        this.user.getInfo();
                        Main.platLoginType = 1;
                        var new_wallet_file = yield this.user.getWalletFile();
                        if (new_wallet_file != null) {
                            localStorage.setItem(this.user.info.wallet, new_wallet_file);
                        }
                    }
                }
                var res = yield Main.user.validateLogin();
                switch (res) {
                    case 0:
                        console.log('[Bla Cat]', '[main]', '未登录 ...');
                        Main.viewMgr.change("LoginView");
                        break;
                    case 1:
                        console.log('[Bla Cat]', '[main]', '已登录，已绑定钱包 ...');
                        Main.viewMgr.change("PayView");
                        break;
                    case -1:
                        console.log('[Bla Cat]', '[main]', '已登录，未绑定钱包 ...');
                        Main.viewMgr.change("WalletView");
                        break;
                }
            });
        }
        static showErrCode(errCode, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                var msgId = "errCode_" + errCode.toString();
                var msg = Main.langMgr.get(msgId);
                if (msg == "") {
                    msgId = "errCode_default";
                    msg = Main.langMgr.get("errCode_default") + errCode;
                    this.showErrMsg(msgId, callback, { errCode: errCode });
                    return;
                }
                if (errCode == 100701) {
                    this.showErrMsg(msgId, () => {
                        Main.viewMgr.removeAll();
                        Main.viewMgr.change("LoginView");
                    });
                    Main.user.logout();
                    Main.logoutCallback();
                    return;
                }
                this.showErrMsg(msgId, callback);
            });
        }
        static showErrMsg(errMsgKey, callback = null, content_ext = null) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewAlert.content = errMsgKey;
                BlackCat.ViewAlert.content_ext = content_ext;
                BlackCat.ViewAlert.callback = callback;
                Main.viewMgr.change("ViewAlert");
            });
        }
        static showToast(msgKey, showTime = 2500) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewToast.content = msgKey;
                BlackCat.ViewToast.showTime = showTime;
                Main.viewMgr.change("ViewToast");
            });
        }
        static showInfo(msgKey, callback = null, content_ext = null) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewAlert.content = msgKey;
                BlackCat.ViewAlert.content_ext = content_ext;
                BlackCat.ViewAlert.callback = callback;
                Main.viewMgr.change("ViewAlert");
            });
        }
        static showConFirm(msgKey) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewConfirm.content = msgKey;
                Main.viewMgr.change("ViewConfirm");
            });
        }
        static showLoading(msgKey) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewLoading.content = msgKey;
                Main.viewMgr.change("ViewLoading");
            });
        }
        static isWalletOpen() {
            if (Main.wallet.isOpen() && Main.user.info.wallet == Main.wallet.wallet_addr) {
                return true;
            }
            return false;
        }
        static isLoginInit() {
            if (BlackCat.tools.WWW.api) {
                return false;
            }
            return true;
        }
        static validateFormat(type, inputElement) {
            return __awaiter(this, void 0, void 0, function* () {
                var regex;
                switch (type) {
                    case "user":
                        regex = /^[a-zA-Z0-9_]{4,16}$/;
                        break;
                    case "email":
                        regex = /^([0-9A-Za-z\-_\.]+)@([0-9A-Za-z]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?)$/g;
                        break;
                    case "phone":
                        regex = /^\d{4,}$/;
                        break;
                    case "vcode":
                        regex = /^\d{6}$/;
                        break;
                    case "walletaddr":
                        let isAddress = BlackCat.tools.NNSTool.verifyAddr(inputElement.value);
                        if (isAddress) {
                            try {
                                if (BlackCat.tools.neotools.verifyPublicKey(inputElement.value)) {
                                    return true;
                                }
                            }
                            catch (e) {
                            }
                        }
                        else {
                            let isDomain = BlackCat.tools.NNSTool.verifyDomain(inputElement.value);
                            if (isDomain) {
                                try {
                                    inputElement.value = inputElement.value.toLowerCase();
                                    let addr = yield BlackCat.tools.NNSTool.resolveData(inputElement.value);
                                    if (addr) {
                                        return addr;
                                    }
                                }
                                catch (e) {
                                }
                            }
                        }
                        break;
                }
                if (regex) {
                    if (regex.test(inputElement.value)) {
                        return true;
                    }
                }
                Main.showErrMsg('main_' + type + '_format_err', () => {
                    inputElement.focus();
                });
                return false;
            });
        }
        static getPhone(selectArea, phone) {
            var area = BlackCat.AreaView.getByCodeName(selectArea);
            if (!area)
                return null;
            var phoneMerge = phone + '@' + area.areacode;
            return phoneMerge;
        }
        static getDate(timeString) {
            if (timeString != "0" && timeString != "") {
                var date = new Date(parseInt(timeString) * 1000);
                var fmt = "yyyy-MM-dd hh:mm:ss";
                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    S: date.getMilliseconds()
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1
                            ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length));
                return fmt;
            }
            return "";
        }
        static getObjectClass(obj) {
            if (obj && obj.constructor && obj.constructor.toString()) {
                if (obj.constructor.name) {
                    return obj.constructor.name;
                }
                var str = obj.constructor.toString();
                if (str.charAt(0) == '[') {
                    var arr = str.match(/\[\w+\s*(\w+)\]/);
                }
                else {
                    var arr = str.match(/function\s*(\w+)/);
                }
                if (arr && arr.length == 2) {
                    return arr[1];
                }
            }
            return undefined;
        }
        ;
        static getUnTrustNnc(params) {
            var result = [];
            if (params.hasOwnProperty('nnc')) {
                params = [params];
            }
            if (params instanceof Array) {
                for (let i = 0; i < params.length; i++) {
                    if (params[i].hasOwnProperty('nnc')) {
                        let nnc = params[i]['nnc'];
                        if (Main.app_trust.length == 0) {
                            result.push(nnc);
                        }
                        else {
                            var isTrust = false;
                            for (let m = 0; m < Main.app_trust.length; m++) {
                                if (Main.app_trust[m] && nnc == Main.app_trust[m]['nnc']) {
                                    isTrust = true;
                                    break;
                                }
                            }
                            if (isTrust == false) {
                                result.push(nnc);
                            }
                        }
                    }
                }
            }
            return result;
        }
        static updateTrustNnc() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var res_nncs = yield BlackCat.ApiTool.getTrustNncs(Main.user.info.uid, Main.user.info.token, Main.appid);
                    if (res_nncs.r) {
                        Main.app_trust = res_nncs.data;
                        if (Main.viewMgr.trustContractView && !Main.viewMgr.trustContractView.isHidden()) {
                            Main.viewMgr.trustContractView.remove();
                        }
                    }
                    else {
                        Main.app_trust = [];
                    }
                }
                catch (e) {
                    console.log('[Bla Cat]', '[main]', 'updateTrustNnc, ApiTool.getTrustNncs error => ', e.toString());
                }
            });
        }
        static removeTrustNnc(nnc) {
            if (Main.app_trust.length > 0) {
                for (let k = 0; k < Main.app_trust.length; k++) {
                    if (Main.app_trust[k] && Main.app_trust[k]['nnc'] == nnc) {
                        delete Main.app_trust[k];
                        break;
                    }
                }
            }
        }
        static setLiveTime() {
            Main.liveTime = new Date().getTime();
        }
        static setLiveTimeMax(minutes) {
            Main.liveTimeMax = minutes * 60 * 1000;
        }
        static getLiveTimeMax() {
            return Main.liveTimeMax;
        }
    }
    Main.platName = "Bla Cat";
    Main.platLoginType = 0;
    Main.resHost = BC_path + "../";
    Main.liveTimeMax = 60 * 60 * 1000;
    BlackCat.Main = Main;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangBase {
        get(key) {
            if (this.lang.hasOwnProperty(key)) {
                return this.lang[key];
            }
            return "";
        }
    }
    BlackCat.LangBase = LangBase;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangCN extends BlackCat.LangBase {
        constructor() {
            super(...arguments);
            this.lang = {
                return: "返回",
                copy: "复制",
                ok: "确定",
                cancel: "取消",
                more: "更多",
                info: "提示",
                content: "内容",
                retry: "重试",
                area_code_CN: "中国",
                area_code_AD: '安道尔',
                area_code_AE: '阿拉伯联合酋长国',
                area_code_AF: '阿富汗',
                area_code_AG: '安提瓜和巴布达',
                area_code_AI: '安圭拉',
                area_code_AL: '阿尔巴尼亚',
                area_code_AM: '亚美尼亚',
                area_code_AO: '安哥拉',
                area_code_AR: '阿根廷',
                area_code_AS: '美属萨摩亚',
                area_code_AT: '奥地利',
                area_code_AU: '澳大利亚',
                area_code_AW: '阿鲁巴',
                area_code_AZ: '阿塞拜疆',
                area_code_BA: '波斯尼亚和黑塞哥维那',
                area_code_BB: '巴巴多斯',
                area_code_BD: '孟加拉国',
                area_code_BE: '比利时',
                area_code_BF: '布基纳法索',
                area_code_BG: '保加利亚',
                area_code_BH: '巴林',
                area_code_BI: '布隆迪',
                area_code_BJ: '贝宁',
                area_code_BM: '百慕大群岛',
                area_code_BN: '文莱',
                area_code_BO: '玻利维亚',
                area_code_BQ: '荷兰加勒比',
                area_code_BR: '巴西',
                area_code_BS: '巴哈马',
                area_code_BT: '不丹',
                area_code_BW: '博茨瓦纳',
                area_code_BY: '白俄罗斯',
                area_code_BZ: '伯利兹',
                area_code_CA: '加拿大',
                area_code_CD: '刚果民主共和国',
                area_code_CF: '中非共和国',
                area_code_CG: '刚果共和国',
                area_code_CH: '瑞士',
                area_code_CI: '象牙海岸',
                area_code_CK: '库克群岛',
                area_code_CL: '智利',
                area_code_CM: '喀麦隆',
                area_code_CO: '哥伦比亚',
                area_code_CR: '哥斯达黎加',
                area_code_CU: '古巴',
                area_code_CV: '开普',
                area_code_CW: '库拉索',
                area_code_CY: '塞浦路斯',
                area_code_CZ: '捷克',
                area_code_DE: '德国',
                area_code_DJ: '吉布提',
                area_code_DK: '丹麦',
                area_code_DM: '多米尼加',
                area_code_DO: '多米尼加共和国',
                area_code_DZ: '阿尔及利亚',
                area_code_EC: '厄瓜多尔',
                area_code_EE: '爱沙尼亚',
                area_code_EG: '埃及',
                area_code_ER: '厄立特里亚',
                area_code_ES: '西班牙',
                area_code_ET: '埃塞俄比亚',
                area_code_FI: '芬兰',
                area_code_FJ: '斐济',
                area_code_FM: '密克罗尼西亚',
                area_code_FO: '法罗群岛',
                area_code_FR: '法国',
                area_code_GA: '加蓬',
                area_code_GB: '英国',
                area_code_GD: '格林纳达',
                area_code_GE: '格鲁吉亚',
                area_code_GF: '法属圭亚那',
                area_code_GH: '加纳',
                area_code_GI: '直布罗陀',
                area_code_GL: '格陵兰岛',
                area_code_GM: '冈比亚',
                area_code_GN: '几内亚',
                area_code_GP: '瓜德罗普岛',
                area_code_GQ: '赤道几内亚',
                area_code_GR: '希腊',
                area_code_GT: '瓜地马拉',
                area_code_GU: '关岛',
                area_code_GW: '几内亚比绍共和国',
                area_code_GY: '圭亚那',
                area_code_HK: '中国香港',
                area_code_HN: '洪都拉斯',
                area_code_HR: '克罗地亚',
                area_code_HT: '海地',
                area_code_HU: '匈牙利',
                area_code_ID: '印度尼西亚',
                area_code_IE: '爱尔兰',
                area_code_IL: '以色列',
                area_code_IN: '印度',
                area_code_IQ: '伊拉克',
                area_code_IR: '伊朗',
                area_code_IS: '冰岛',
                area_code_IT: '意大利',
                area_code_JM: '牙买加',
                area_code_JO: '约旦',
                area_code_JP: '日本',
                area_code_KE: '肯尼亚',
                area_code_KG: '吉尔吉斯斯坦',
                area_code_KH: '柬埔寨',
                area_code_KI: '基里巴斯',
                area_code_KM: '科摩罗',
                area_code_KN: '圣基茨和尼维斯',
                area_code_KP: '朝鲜',
                area_code_KR: '韩国',
                area_code_KW: '科威特',
                area_code_KY: '开曼群岛',
                area_code_KZ: '哈萨克斯坦',
                area_code_LA: '老挝',
                area_code_LB: '黎巴嫩',
                area_code_LC: '圣露西亚',
                area_code_LI: '列支敦士登',
                area_code_LK: '斯里兰卡',
                area_code_LR: '利比里亚',
                area_code_LS: '莱索托',
                area_code_LT: '立陶宛',
                area_code_LU: '卢森堡',
                area_code_LV: '拉脱维亚',
                area_code_LY: '利比亚',
                area_code_MA: '摩洛哥',
                area_code_MC: '摩纳哥',
                area_code_MD: '摩尔多瓦',
                area_code_ME: '黑山',
                area_code_MG: '马达加斯加',
                area_code_MH: '马绍尔群岛',
                area_code_MK: '马其顿',
                area_code_ML: '马里',
                area_code_MM: '缅甸',
                area_code_MN: '蒙古',
                area_code_MO: '中国澳门',
                area_code_MR: '毛里塔尼亚',
                area_code_MS: '蒙特塞拉特岛',
                area_code_MT: '马耳他',
                area_code_MU: '毛里求斯',
                area_code_MV: '马尔代夫',
                area_code_MW: '马拉维',
                area_code_MX: '墨西哥',
                area_code_MY: '马来西亚',
                area_code_MZ: '莫桑比克',
                area_code_NA: '纳米比亚',
                area_code_NC: '新喀里多尼亚',
                area_code_NE: '尼日尔',
                area_code_NG: '尼日利亚',
                area_code_NI: '尼加拉瓜',
                area_code_NL: '荷兰',
                area_code_NO: '挪威',
                area_code_NP: '尼泊尔',
                area_code_NR: '拿鲁岛',
                area_code_NZ: '新西兰',
                area_code_OM: '阿曼',
                area_code_PA: '巴拿马',
                area_code_PE: '秘鲁',
                area_code_PF: '法属波利尼西亚',
                area_code_PG: '巴布亚新几内亚',
                area_code_PH: '菲律宾',
                area_code_PK: '巴基斯坦',
                area_code_PL: '波兰',
                area_code_PM: '圣彼埃尔和密克隆岛',
                area_code_PR: '波多黎各',
                area_code_PT: '葡萄牙',
                area_code_PW: '帕劳',
                area_code_PY: '巴拉圭',
                area_code_QA: '卡塔尔',
                area_code_RE: '留尼汪',
                area_code_RO: '罗马尼亚',
                area_code_RS: '塞尔维亚',
                area_code_RU: '俄罗斯',
                area_code_RW: '卢旺达',
                area_code_SA: '沙特阿拉伯',
                area_code_SB: '所罗门群岛',
                area_code_SC: '塞舌尔',
                area_code_SD: '苏丹',
                area_code_SE: '瑞典',
                area_code_SG: '新加坡',
                area_code_SI: '斯洛文尼亚',
                area_code_SK: '斯洛伐克',
                area_code_SL: '塞拉利昂',
                area_code_SM: '圣马力诺',
                area_code_SN: '塞内加尔',
                area_code_SO: '索马里',
                area_code_SR: '苏里南',
                area_code_ST: '圣多美和普林西比',
                area_code_SV: '萨尔瓦多',
                area_code_SY: '叙利亚',
                area_code_SZ: '斯威士兰',
                area_code_TC: '特克斯和凯科斯群岛',
                area_code_TD: '乍得',
                area_code_TG: '多哥',
                area_code_TH: '泰国',
                area_code_TJ: '塔吉克斯坦',
                area_code_TL: '东帝汶',
                area_code_TM: '土库曼斯坦',
                area_code_TN: '突尼斯',
                area_code_TO: '汤加',
                area_code_TR: '土耳其',
                area_code_TT: '特立尼达和多巴哥',
                area_code_TW: '中国台湾',
                area_code_TZ: '坦桑尼亚',
                area_code_UA: '乌克兰',
                area_code_UG: '乌干达',
                area_code_US: '美国',
                area_code_UY: '乌拉圭',
                area_code_UZ: '乌兹别克斯坦',
                area_code_VC: '圣文森特和格林纳丁斯',
                area_code_VE: '委内瑞拉',
                area_code_VG: '英属处女群岛',
                area_code_VN: '越南',
                area_code_VU: '瓦努阿图',
                area_code_WS: '萨摩亚',
                area_code_YE: '也门',
                area_code_YT: '马约特',
                area_code_ZA: '南非',
                area_code_ZM: '赞比亚',
                area_code_ZW: '津巴布韦',
                main_user_format_err: "用户名格式不正确！只能使用4-16位英文字母、数字、下划线！",
                main_email_format_err: "邮件地址格式不正确！",
                main_phone_format_err: "手机号码格式不正确！",
                main_vcode_format_err: "验证码格式不正确！",
                main_walletaddr_format_err: "钱包地址格式不正确！",
                main_phone: "手机",
                main_email: "邮箱",
                main_user: "用户名",
                register_title: "注册",
                register_inputphone: "请输入手机号码",
                register_inputphone_err: "请输入手机号码",
                register_inputemail: "请输入邮箱",
                register_inputemail_err: "请输入邮箱",
                register_inputUid: "请输入用户名",
                register_inputUid_err: "请输入用户名",
                register_inputCode: "请输入验证码",
                register_inputCode_err: "请输入验证码",
                register_inputPass: "请输入密码",
                register_inputPass_err: "请输入密码",
                register_inputVpass: "再次输入密码",
                register_inputVpass_err: "请再次输入密码",
                register_inputVpass_inputPass_err: "密码输入不一致！",
                register_getCodeSucc: "验证码已成功发送",
                register_getCode: "获取验证码",
                register_getCodecount: "重新获取(60)",
                register_getCodecountRetry: "重新获取",
                register_doLogin: "<<返回登录",
                register_doRegister: "立即注册",
                login_inputuser: "请输入用户名",
                login_inputuser_err: "请输入用户名",
                login_inputphone: "请输入手机号码",
                login_inputphone_err: "请输入手机号码",
                login_inputemail: "请输入邮箱",
                login_inputemail_err: "请输入邮箱",
                login_inputPass: "请输入密码",
                login_inputPass_err: "请输入密码",
                login_textForgetpass: "忘记密码？",
                login_doLogin: "登录",
                login_doRegister: "注册",
                login_walletDownloadFail: "钱包文件下载失败，请重新登录!",
                login_loginFail: "登录失败",
                forgetpass_title: "找回密码",
                forgetpass_inputphone: "请输入手机号码",
                forgetpass_inputphone_err: "请输入手机号码",
                forgetpass_inputemail: "请输入邮箱",
                forgetpass_inputemail_err: "请输入邮箱",
                forgetpass_inputUid: "请输入用户名",
                forgetpass_inputUid_err: "请输入用户名",
                forgetpass_inputUid_validate_err: "无效的用户名",
                forgetpass_inputAccount: "请输入手机号码/邮箱",
                forgetpass_inputAccount_err: "请输入手机号码/邮箱",
                forgetpass_inputAccount_err_type: "手机号码/邮箱格式不正确，请检查",
                forgetpass_inputAccount_validate_err: "无效的手机号码/邮箱",
                forgetpass_inputphone_notexist: "手机未注册，请先注册！",
                forgetpass_inputemail_notexist: "邮箱未注册，请先注册！",
                forgetpass_inputCode: "请输入验证码",
                forgetpass_inputCode_err: "请输入验证码",
                forgetpass_inputPass: "请输入新密码",
                forgetpass_inputPass_err: "请输入新密码",
                forgetpass_inputVpass: "再次输入新密码",
                forgetpass_inputVpass_err: "请再次输入新密码",
                forgetpass_inputVpass_inputPass_err: "密码输入不一致！",
                forgetpass_getCodeSucc: "验证码已成功发送",
                forgetpass_getCode: "获取验证码",
                forgetpass_getCodecount: "重新获取(60)",
                forgetpass_getCodecountRetry: "重新获取",
                forgetpass_doLogin: "<<返回登录",
                forgetpass_do: "确定",
                forgetpass_do_ok: "重置成功，请重新登录！",
                myInfo: "我的信息",
                myinfo_headImg: "头像",
                myinfo_nickname: "昵称",
                myinfo_sex: "性别",
                myinfo_sex_0: "请选择",
                myinfo_sex_1: "男",
                myinfo_sex_2: "女",
                myinfo_uid: "账号",
                myinfo_area: "地区",
                myinfo_security: "安全中心",
                myinfo_set: "设置",
                myinfo_logout: "退出账号",
                myinfo_logoutConfirm: "确定要退出登录么",
                modifyImg: "头像",
                modifyImg_succ: "头像修改成功",
                modifyImg_select: "选择本地图片",
                modifyImg_select_err: "请选择本地图片",
                modifyImg_selectSize_err: "选择的图片，大小不要超过100kb",
                modifyImg_selectType_err: "图片的格式不对，请使用jpg、jpeg或png图片",
                modifyName: "昵称",
                modifyName_input: "请输入昵称",
                modifyName_succ: "昵称修改成功！",
                modifySex: "性别",
                modifySex_succ: "性别修改成功",
                security_title: "安全中心",
                security_trust: " 信任合约",
                security_trust_admin: "管理",
                security_walletOut: "自动登出钱包",
                security_walletOut_admin: "永不",
                security_walletOut_admin_m: "%minutes% 分钟",
                security_walletOut_admin_h: "%hours% 小时",
                security_walletOut_toast: "当超过一定时间未操作钱包，将会自动登出，需要重新输入密码",
                trust_title: "信任合约",
                trust_relieve_succ: "解除合约成功",
                paylist_txid: "交易单号：",
                paylist_wallet: "我的钱包：",
                paylist_nnc: "合约地址：",
                paylist_sbParamJson: "合约参数：",
                paylist_sbPushString: "合约方法：",
                paylist_sbPushString_none: "无",
                paylist_ctm_year: "%year%年前",
                paylist_ctm_month: "%month%月前",
                paylist_ctm_day: "%day%天前",
                paylist_ctm_hour: "%hour%小时前",
                paylist_ctm_minute: "%minute%分钟前",
                paylist_ctm_recent: "刚刚",
                paylist_noMore: "没有记录了",
                paylist_getMore: "点击加载更多记录",
                paylist_noRecord: "没有记录信息",
                pay_received: "收款",
                pc_receivables_download: "下载二维码",
                pc_receivables_address: "钱包地址",
                pc_receivables_copy: "复制成功",
                pay_transfer: "转账",
                pay_transferType: "代币：GAS",
                pay_transferBalance: "余额：",
                pay_transferToAddr: "转账地址",
                pay_transferCount: "转账金额",
                pay_transferToAddrError: "转账地址错误",
                pay_transferCountError: "转账金额错误",
                pay_transferDoSucc: "转账操作成功",
                pay_transferDoFail: "转账失败",
                pay_wallet: "我的钱包",
                pay_refresh: "刷新",
                pay_wallet_detail: "详情",
                pay_coin_name: "代币",
                pay_coin_old: "SGAS(旧)提现",
                pay_gas: "Gas",
                pay_gas_desc: "GAS是NEO链上的数字货币，可以通过交易所获取",
                pay_sgas: "SGas",
                pay_sgas_desc: "SGas是Bla Cat提供给玩家消费用的通用筹码",
                pay_refund: "提现",
                pay_makeMint: "兑换",
                pay_recentLists: "近期记录",
                pay_makeMintGasNotEnough: "GAS余额不足",
                pay_makeMintDoFail: "充值sgas失败！\r\n充值合约执行失败！\r\n请等待上次充值确认后再操作！",
                pay_makeMintDoFail2: "充值sgas失败！\r\n发送充值请求失败！请检查网络，稍候重试！",
                pay_makeRefundSgasNotEnough: "Sgas余额不足",
                pay_makeRefundDoFail: "提取合约执行失败！请等待上个提现或兑换交易完成再操作！",
                pay_makeRefundDoFail2: "发送提取交易失败！请检查网络，稍候重试！",
                pay_makeRefundGetScriptFail: "获取提取合约失败！",
                pay_not_enough_money: "余额不足",
                pay_not_enough_utxo: "请等待上次交易完成再执行！",
                pay_nettype_1: "主网",
                pay_nettype_2: "测试网",
                pay_walletDetail: "钱包详情",
                pay_walletDetail_addr: "地址：",
                pay_walletDetail_key: "公钥：",
                pay_walletDetail_hex: "密钥HEX：",
                pay_walletDetail_wif: "密钥WIF：",
                pay_walletDetail_notice: "为避免财产损失，展开密钥时请防止泄露。",
                pay_walletDetail_export: "导出钱包",
                pay_makerawtrans_err: "交易发起失败",
                addressbook_title: "通讯录",
                addressbook_search: "搜索",
                addressbook_det_title: "通讯录",
                addressbook_det_transfer: "转账",
                addressbook_det_address: "钱包地址",
                addressbook_det_download: "下载二维码",
                addressbook_det_describe: "描述",
                addressbook_det_empty: "空",
                addressbook_det_del: "删除联系人",
                addressbook_det_del_title: "删除",
                addressbook_det_del_tips: "您确认删除联系人？",
                addressbook_det_del_succ: "删除成功",
                addressbook_op_button: "完成",
                addressbook_op_name: "联系人",
                addressbook_op_inputName: "输入联系人",
                addressbook_op_inputName_err: "请输入联系人",
                addressbook_op_address: "钱包地址",
                addressbook_op_inputAddress: "输入钱包地址",
                addressbook_op_inputAddress_err: "请输入钱包地址",
                addressbook_op_describe: "描述",
                addressbook_op_inputDescribe: "输入描述",
                addressbook_op_inputDescribe_err: "请输入描述",
                addressbook_op_addSucc: "联系人添加成功",
                addressbook_op_updateSucc: "联系人修改成功",
                pay_makeRecharge: "充值",
                pay_trust_tips: "信任合约",
                pay_trust_Vice_tips: "（本合约交易不再弹出此窗口）",
                pay_transferGas_toaddr: "转账地址",
                pay_transferGas_count: "转账金额",
                pay_transCount_count: "金额",
                pay_transCount_inputCount: "请输入金额",
                pay_transCount_err: "请输入正确的金额",
                pay_sgas2gas: "SGas &#xe6a8; Gas",
                pay_gas2sgas: "Gas &#xe6a8; SGas",
                pay_old: "SGAS（旧）余额：",
                pay_walletOpen_password: "密码",
                pay_walletOpen_inputPassword: "请输入钱包密码",
                pay_walletOpen_inputPassword_err: "请输入钱包密码",
                pay_walletOpen_file_error: "钱包文件解析异常，请重新登录",
                pay_walletOpen_openFail: "打开钱包失败！请确认密码后重试！",
                walletCreate_create: "创建钱包",
                walletCreate_password: "输入密码",
                walletCreate_vpass: "确认密码",
                walletCreate_password_notice: "*密码若丢失将无法找回，请谨慎保管",
                walletCreate_doCreate: "创建",
                walletCreate_check_pass: "请检查输入密码",
                walletCreate_check_vpass: "请检查确认密码",
                walletImport_invalid_file: "请选择有效的钱包文件",
                walletImport_select_file: "请选择钱包文件",
                walletImport_import: "导入钱包",
                walletImport_password: "请输入密码",
                walletImport_doImport: "绑定钱包",
                walletImport_bind_succ: "绑定钱包成功！",
                walletView_info: "做不一样，但好玩的游戏！",
                walletView_create: "创建钱包",
                walletView_import: "导入钱包",
                main_wait_for_last_tran: "请先确认或者取消上个交易请求再执行",
                main_no_app_wallet: "应用没有配置收款钱包地址，无法充值",
                main_need_open_wallet_confirm: "提现操作需要打开钱包，是否立即打开？",
                main_refund_second_fail: "生成转换请求（utxo->gas）失败",
                main_refund_getScript_err: "获取转换合约失败！",
                main_refund_sendRequest_err: "发送转换请求失败！",
                main_refund_doFail: "转换合约执行失败！",
                errCode_1101: "请求接口参数错误",
                errCode_1005: "您访问太频繁了，请休息一下！",
                errCode_100601: "获取短信验证码失败！请检查地区与手机号码！",
                errCode_100602: "短信验证码错误！",
                errCode_100605: "手机已注册！",
                errCode_100606: "手机未注册，请先注册",
                errCode_100607: "用户名或手机错误！",
                errCode_100608: "手机或密码错误！",
                errCode_100801: "获取邮箱验证码失败！",
                errcode_100802: "邮箱验证码错误！",
                errCode_100805: "邮箱已注册！",
                errCode_100806: "邮箱未注册，请先注册",
                errCode_100807: "用户名或邮箱错误！",
                errCode_100808: "邮箱或密码错误！",
                errCode_100700: "账号或密码错误！",
                errCode_100701: "登录失效，请重新登录",
                errCode_100702: "账号或密码错误，请重试",
                errCode_100707: "用户名已存在！",
                errCode_8100000: "已经绑定过钱包了，不需要再次绑定！",
                errCode_8100001: "上传绑定的钱包格式错误，请检查钱包文件！",
                errCode_8100002: "系统错误，钱包绑定失败！",
                errCode_8100003: "该钱包已经被其他用户绑定了！",
                errCode_8100004: "头像文件格式不支持！",
                errcode_8100005: "头像文件上传失败！",
                errcode_8100006: "头像文件大小不能超过100kb！",
                errCode_8100007: "联系人已存在！",
                errCode_default: "未知错误！错误码： %errCode%",
                wallet_open_check: "请核对钱包文件或密码！",
                wallet_open_check_otcgo: "请核对蓝鲸淘钱包文件！",
                wallet_open_check_otcgo_pwd: "请核对蓝鲸淘钱包密码！",
                netmgr_select_api_slow: "与服务器连接异常或缓慢，请检查网络后重试！",
                netmgr_select_node_slow: "与链上节点通讯异常或缓慢，请检查网络后重试！",
                netmgr_connecting: "连接中，请稍候...",
                netmgr_connecting_fail: "连接失败，请检查网络后重试。",
            };
        }
    }
    BlackCat.LangCN = LangCN;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangEN extends BlackCat.LangBase {
        constructor() {
            super(...arguments);
            this.lang = {
                return: "Back",
                copy: "Copy",
                ok: "OK",
                cancel: "Cancel",
                more: "More",
                info: "Information",
                content: "Content",
                retry: "Retry",
                area_code_CN: 'China',
                area_code_AD: 'Andorra',
                area_code_AE: 'United Arab Emirates',
                area_code_AF: 'Afghanistan',
                area_code_AG: 'Antigua and Barbuda',
                area_code_AI: 'Anguilla',
                area_code_AL: 'Albania',
                area_code_AM: 'Armenia',
                area_code_AO: 'Angola',
                area_code_AR: 'Argentina',
                area_code_AS: 'American Samoa',
                area_code_AT: 'Austria',
                area_code_AU: 'Australia',
                area_code_AW: 'Aruba',
                area_code_AZ: 'Azerbaijan',
                area_code_BA: 'Bosniaand Herzegovina',
                area_code_BB: 'Barbados',
                area_code_BD: 'Bangladesh',
                area_code_BE: 'Belgium',
                area_code_BF: 'Burkina Faso',
                area_code_BG: 'Bulgaria',
                area_code_BH: 'Bahrain',
                area_code_BI: 'Burundi',
                area_code_BJ: 'Benin',
                area_code_BM: 'Bermuda',
                area_code_BN: 'Brunei',
                area_code_BO: 'Bolivia',
                area_code_BQ: 'Caribisch Nederland',
                area_code_BR: 'Brazil',
                area_code_BS: 'Bahamas',
                area_code_BT: 'Bhutan',
                area_code_BW: 'Botswana',
                area_code_BY: 'Belarus',
                area_code_BZ: 'Belize',
                area_code_CA: 'Canada',
                area_code_CD: 'Democratic Republic of theCongo',
                area_code_CF: 'Central African Republic',
                area_code_CG: 'Republic Of The Congo',
                area_code_CH: 'Switzerland',
                area_code_CI: 'Ivory Coast',
                area_code_CK: 'Cook Islands',
                area_code_CL: 'Chile',
                area_code_CM: 'Cameroon',
                area_code_CO: 'Colombia',
                area_code_CR: 'CostaRica',
                area_code_CU: 'Cuba',
                area_code_CV: 'Cape Verde',
                area_code_CW: 'Curacao',
                area_code_CY: 'Cyprus',
                area_code_CZ: 'Czech',
                area_code_DE: 'Germany',
                area_code_DJ: 'Djibouti',
                area_code_DK: 'Denmark',
                area_code_DM: 'Dominica',
                area_code_DO: 'dominican republic',
                area_code_DZ: 'Algeria',
                area_code_EC: 'Ecuador',
                area_code_EE: 'Estonia',
                area_code_EG: 'Egypt',
                area_code_ER: 'Eritrea',
                area_code_ES: 'Spain',
                area_code_ET: 'Ethiopia',
                area_code_FI: 'Finland',
                area_code_FJ: 'Fiji',
                area_code_FM: 'Micronesia',
                area_code_FO: 'Faroe Islands',
                area_code_FR: 'France',
                area_code_GA: 'Gabon',
                area_code_GB: 'United Kingdom',
                area_code_GD: 'Grenada',
                area_code_GE: 'Georgia',
                area_code_GF: 'French Guiana',
                area_code_GH: 'Ghana',
                area_code_GI: 'Gibraltar',
                area_code_GL: 'Greenland',
                area_code_GM: 'Gambia',
                area_code_GN: 'Guinea',
                area_code_GP: 'Guadeloupe',
                area_code_GQ: 'Equatorial Guinea',
                area_code_GR: 'Greece',
                area_code_GT: 'Guatemala',
                area_code_GU: 'Guam',
                area_code_GW: 'Guinea-Bissau',
                area_code_GY: 'Guyana',
                area_code_HK: 'Hong Kong',
                area_code_HN: 'Honduras',
                area_code_HR: 'Croatia',
                area_code_HT: 'Haiti',
                area_code_HU: 'Hungary',
                area_code_ID: 'Indonesia',
                area_code_IE: 'Ireland',
                area_code_IL: 'Israel',
                area_code_IN: 'India',
                area_code_IQ: 'Iraq',
                area_code_IR: 'Iran',
                area_code_IS: 'Iceland',
                area_code_IT: 'Italy',
                area_code_JM: 'Jamaica',
                area_code_JO: 'Jordan',
                area_code_JP: 'Japan',
                area_code_KE: 'Kenya',
                area_code_KG: 'Kyrgyzstan',
                area_code_KH: 'Cambodia',
                area_code_KI: 'Kiribati',
                area_code_KM: 'Comoros',
                area_code_KN: 'Saint Kitts and Nevis',
                area_code_KP: 'Korea Democratic Rep.',
                area_code_KR: 'South Korea',
                area_code_KW: 'Kuwait',
                area_code_KY: 'Cayman Islands',
                area_code_KZ: 'Kazakhstan',
                area_code_LA: 'Laos',
                area_code_LB: 'Lebanon',
                area_code_LC: 'Saint Lucia',
                area_code_LI: 'Liechtenstein',
                area_code_LK: 'Sri Lanka',
                area_code_LR: 'Liberia',
                area_code_LS: 'Lesotho',
                area_code_LT: 'Lithuania',
                area_code_LU: 'Luxembourg',
                area_code_LV: 'Latvia',
                area_code_LY: 'Libya',
                area_code_MA: 'Morocco',
                area_code_MC: 'Monaco',
                area_code_MD: 'Moldova',
                area_code_ME: 'Montenegro',
                area_code_MG: 'Madagascar',
                area_code_MH: 'Marshall Islands',
                area_code_MK: 'Macedonia',
                area_code_ML: 'Mali',
                area_code_MM: 'Myanmar',
                area_code_MN: 'Mongolia',
                area_code_MO: 'Macau',
                area_code_MR: 'Mauritania',
                area_code_MS: 'Montserrat',
                area_code_MT: 'Malta',
                area_code_MU: 'Mauritius',
                area_code_MV: 'Maldives',
                area_code_MW: 'Malawi',
                area_code_MX: 'Mexico',
                area_code_MY: 'Malaysia',
                area_code_MZ: 'Mozambique',
                area_code_NA: 'Namibia',
                area_code_NC: 'New Caledonia',
                area_code_NE: 'Niger',
                area_code_NG: 'Nigeria',
                area_code_NI: 'Nicaragua',
                area_code_NL: 'Netherlands',
                area_code_NO: 'Norway',
                area_code_NP: 'Nepal',
                area_code_NR: 'Nauru',
                area_code_NZ: 'New Zealand',
                area_code_OM: 'Oman',
                area_code_PA: 'Panama',
                area_code_PE: 'Peru',
                area_code_PF: 'French Polynesia',
                area_code_PG: 'Papua New Guinea',
                area_code_PH: 'Philippines',
                area_code_PK: 'Pakistan',
                area_code_PL: 'Poland',
                area_code_PM: 'Saint Pierreand Miquelon',
                area_code_PR: 'Puerto Rico',
                area_code_PT: 'Portugal',
                area_code_PW: 'Palau',
                area_code_PY: 'Paraguay',
                area_code_QA: 'Qatar',
                area_code_RE: 'Réunion Island',
                area_code_RO: 'Romania',
                area_code_RS: 'Serbia',
                area_code_RU: 'Russia',
                area_code_RW: 'Rwanda',
                area_code_SA: 'Saudi Arabia',
                area_code_SB: 'Solomon Islands',
                area_code_SC: 'Seychelles',
                area_code_SD: 'Sudan',
                area_code_SE: 'Sweden',
                area_code_SG: 'Singapore',
                area_code_SI: 'Slovenia',
                area_code_SK: 'Slovakia',
                area_code_SL: 'Sierra Leone',
                area_code_SM: 'San Marino',
                area_code_SN: 'Senegal',
                area_code_SO: 'Somalia',
                area_code_SR: 'Suriname',
                area_code_ST: 'Sao Tome and Principe',
                area_code_SV: 'ElSalvador',
                area_code_SY: 'Syria',
                area_code_SZ: 'Swaziland',
                area_code_TC: 'Turksand Caicos Islands',
                area_code_TD: 'Chad',
                area_code_TG: 'Togo',
                area_code_TH: 'Thailand',
                area_code_TJ: 'Tajikistan',
                area_code_TL: 'East Timor',
                area_code_TM: 'Turkmenistan',
                area_code_TN: 'Tunisia',
                area_code_TO: 'Tonga',
                area_code_TR: 'Turkey',
                area_code_TT: 'Trinidadand Tobago',
                area_code_TW: 'Taiwan',
                area_code_TZ: 'Tanzania',
                area_code_UA: 'Ukraine',
                area_code_UG: 'Uganda',
                area_code_US: 'United States',
                area_code_UY: 'Uruguay',
                area_code_UZ: 'Uzbekistan',
                area_code_VC: 'Saint Vincent and The Grenadines',
                area_code_VE: 'Venezuela',
                area_code_VG: 'VirginIslands,British',
                area_code_VN: 'Vietnam',
                area_code_VU: 'Vanuatu',
                area_code_WS: 'Samoa',
                area_code_YE: 'Yemen',
                area_code_YT: 'Mayotte',
                area_code_ZA: 'South Africa',
                area_code_ZM: 'Zambia',
                area_code_ZW: 'Zimbabwe',
                main_user_format_err: "Username format is incorrect! Only use 4-16 digits of English letters, numbers, underscores!",
                main_email_format_err: "Email address format is incorrect!",
                main_phone_format_err: "Phone number format is incorrect!",
                main_vcode_format_err: "Verification code format is incorrect!",
                main_walletaddr_format_err: "Wallet address format is incorrect!",
                main_phone: "Phone",
                main_email: "Email",
                main_user: "UserName",
                register_title: "Register",
                register_inputphone: "Please input phone number",
                register_inputphone_err: "Please input phone number",
                register_inputemail: "Please input email address",
                register_inputemail_err: "Please input email address",
                register_inputUid: "Username",
                register_inputUid_err: "Please input username",
                register_inputCode: "Verification code",
                register_inputCode_err: "Please input verification code!",
                register_inputPass: "Password",
                register_inputPass_err: "Please input password",
                register_inputVpass: "Password again",
                register_inputVpass_err: "Please input password again",
                register_inputVpass_inputPass_err: "Inconsistent password!",
                register_getCodeSucc: "Verification code was successfully sent",
                register_getCode: "Get Code",
                register_getCodecount: "Retry(60)",
                register_getCodecountRetry: "Retry",
                register_doLogin: "<<back",
                register_doRegister: "sign up",
                login_inputuser: "Username",
                login_inputuser_err: "Please input username",
                login_inputphone: "Phone number",
                login_inputphone_err: "Please input phone number",
                login_inputemail: "Email address",
                login_inputemail_err: "Please input email address",
                login_inputPass: "Password",
                login_inputPass_err: "Please input password",
                login_textForgetpass: "Forget Password?",
                login_doLogin: "Login",
                login_doRegister: "Register",
                login_walletDownloadFail: "Download failed , please log in again!",
                login_loginFail: "Login failed",
                forgetpass_title: "Find Password",
                forgetpass_inputphone: "Please input phone number",
                forgetpass_inputphone_err: "Please input phone number",
                forgetpass_inputemail: "Please input email address",
                forgetpass_inputemail_err: "Please input email address",
                forgetpass_inputUid: "Username",
                forgetpass_inputUid_err: "Please input username",
                forgetpass_inputUid_validate_err: "Invalid username",
                forgetpass_inputAccount: "Phone number / email",
                forgetpass_inputAccount_err: "Please input phone number / email address",
                forgetpass_inputAccount_err_type: "Incorrect phone number / email address,please try it again",
                forgetpass_inputAccount_validate_err: "Invalid phone number or email address",
                forgetpass_inputphone_notexist: "Please register first!",
                forgetpass_inputemail_notexist: "Please register first!",
                forgetpass_inputCode: "Verification code",
                forgetpass_inputCode_err: "Please input verification code!",
                forgetpass_inputPass: "New Password",
                forgetpass_inputPass_err: "New Please input password",
                forgetpass_inputVpass: "New Password again",
                forgetpass_inputVpass_err: "New Please input password again",
                forgetpass_inputVpass_inputPass_err: "Inconsistent password!",
                forgetpass_getCodeSucc: "Verification code was successfully sent",
                forgetpass_getCode: "Get Code",
                forgetpass_getCodecount: "Retry(60)",
                forgetpass_getCodecountRetry: "Retry",
                forgetpass_doLogin: "<<back",
                forgetpass_do: "OK",
                forgetpass_do_ok: "Modified successfully, please login again",
                myInfo: "my information",
                myinfo_headImg: "Avatar",
                myinfo_nickname: "Nickname",
                myinfo_sex: "Gender",
                myinfo_sex_0: "Please choose",
                myinfo_sex_1: "Male",
                myinfo_sex_2: "Female",
                myinfo_uid: "Account",
                myinfo_area: "Area",
                myinfo_security: "Security Center",
                myinfo_set: "Set",
                myinfo_logout: "Logout",
                myinfo_logoutConfirm: "Are you sure to log out?",
                modifyImg: "Head portrait",
                modifyImg_succ: "Head portrait modified successfully!",
                modifyImg_select: "Please choose local image",
                modifyImg_select_err: "Please choose local image",
                modifyImg_selectSize_err: "Image size must be less than 100Kb",
                modifyImg_selectType_err: "Image format must be jpg., jpge. or png",
                modifyName: "Nickname",
                modifyName_input: "Please input nickname",
                modifyName_succ: "Nickname modified successfully!",
                modifySex: "Gender",
                modifySex_succ: "Gender modified successfully!",
                security_title: "Security Center",
                security_trust: " Trust contract",
                security_trust_admin: "Administration",
                security_walletOut: "Automatically log out",
                security_walletOut_admin: "Never",
                security_walletOut_admin_m: "%minutes% minute(s)",
                security_walletOut_admin_h: "%hours% hour(s)",
                security_walletOut_toast: "When the wallet is not operated for more than a certain period of time, it will be automatically logged out and the password needs to be re-inputted",
                trust_title: "Trust contract",
                trust_relieve_succ: "Successful contracts cancellation",
                paylist_txid: "Trading order number:",
                paylist_wallet: "My wallet:",
                paylist_nnc: "Contract address:",
                paylist_sbParamJson: "Contract parameters:",
                paylist_sbPushString: "Contract method:",
                paylist_sbPushString_none: "None",
                paylist_ctm_year: "%year% year(s) ago",
                paylist_ctm_month: "%month% month(s) ago",
                paylist_ctm_day: "%day% day(s) ago",
                paylist_ctm_hour: "%hour% hour(s) ago",
                paylist_ctm_minute: "%minute% minute(s) ago",
                paylist_ctm_recent: "Just now",
                paylist_noMore: "No more records",
                paylist_getMore: "Click to load more records",
                paylist_noRecord: "No record",
                pay_received: "Receive",
                pc_receivables_download: "Download QR Code",
                pc_receivables_address: "Wallet address",
                pc_receivables_copy: "Copy success",
                pay_transfer: "Transfer",
                pay_transferType: "Token：GAS",
                pay_transferBalance: "Balance:",
                pay_transferToAddr: "Address",
                pay_transferCount: "Amounts",
                pay_transferToAddrError: "The transfer address is incorrect!",
                pay_transferCountError: "The number of transfers is incorrect!",
                pay_transferDoSucc: "Transfer success",
                pay_transferDoFail: "Transfer failed!",
                pay_wallet: "My Wallet",
                pay_refresh: "Refresh",
                pay_wallet_detail: "Details",
                pay_coin_name: "Token",
                pay_coin_old: "SGAS(old)Withdraw",
                pay_gas: "Gas",
                pay_gas_desc: "GAS is a digital currency on NEO chain that can be obtained through exchanges",
                pay_sgas: "SGas",
                pay_sgas_desc: "SGas is a universal chip that Bla Cat offers to players.",
                pay_refund: "Withdraw",
                pay_makeMint: "Exchange",
                pay_recentLists: "Recent records",
                pay_makeMintGasNotEnough: "GAS balance is insufficient",
                pay_makeMintDoFail: "Recharge sgas failed!\r\n Recharge contract execution failed!\r\nPlease wait for the last recharge confirmation before proceeding!",
                pay_makeMintDoFail2: "Recharge sgas failed! \r\nFailed to send recharge request! Please check network and try again later!",
                pay_makeRefundSgasNotEnough: "Sgas balance is insufficient",
                pay_makeRefundDoFail: "The extraction contract execution failed! Please wait for the last withdrawal or redemption transaction to complete!",
                pay_makeRefundDoFail2: "Sending an extraction transaction failed! Please check network and try again later!",
                pay_makeRefundGetScriptFail: "Getting extraction contract failed!",
                pay_not_enough_money: "Insufficient balance",
                pay_not_enough_utxo: "Please wait for the last transaction to complete before executing!",
                pay_nettype_1: "Mainnet",
                pay_nettype_2: "Testnet",
                pay_walletDetail: "Wallet details",
                pay_walletDetail_addr: "Address:",
                pay_walletDetail_key: "Public Key:",
                pay_walletDetail_hex: "KEY HEX:",
                pay_walletDetail_wif: "KEY WIF:",
                pay_walletDetail_notice: "To avoid property damage, please prevent leakage when you open the key.",
                pay_walletDetail_export: "Export wallet",
                pay_makerawtrans_err: "Transaction failed!",
                addressbook_title: "Mail list",
                addressbook_search: "Search",
                addressbook_det_title: "Mail list",
                addressbook_det_transfer: "Transfer",
                addressbook_det_address: "Wallet address",
                addressbook_det_download: "Download QR Code",
                addressbook_det_describe: "Describe",
                addressbook_det_empty: "Empty",
                addressbook_det_del: "Delete Contact",
                addressbook_det_del_title: "Delete",
                addressbook_det_del_tips: "Confirm to delete this contact?",
                addressbook_det_del_succ: "Delete success",
                addressbook_op_button: "Complete",
                addressbook_op_name: "Contacts",
                addressbook_op_inputName: "Please input Contacts",
                addressbook_op_inputName_err: "Please input Contacts",
                addressbook_op_address: "Wallet address",
                addressbook_op_inputAddress: "Please input wallet address",
                addressbook_op_inputAddress_err: "Please input wallet address",
                addressbook_op_describe: "Describe",
                addressbook_op_inputDescribe: "Please input Describe",
                addressbook_op_inputDescribe_err: "Please input Describe",
                addressbook_op_addSucc: "Contact added success",
                addressbook_op_updateSucc: "Contact modify success",
                pay_makeRecharge: "Recharge",
                pay_trust_tips: "Trust contracts",
                pay_trust_Vice_tips: "(no longer pops out)",
                pay_transferGas_toaddr: "transfer address",
                pay_transferGas_count: "Transfer amounts",
                pay_transCount_count: "Amounts",
                pay_transCount_inputCount: "Please enter the amounts",
                pay_transCount_err: "Please input correct sums of amounts",
                pay_sgas2gas: "SGas &#xe6a8; Gas",
                pay_gas2sgas: "Gas &#xe6a8; SGas",
                pay_old: "SGAS(old)Amounts：",
                pay_walletOpen_password: "password",
                pay_walletOpen_inputPassword: "wallet password",
                pay_walletOpen_inputPassword_err: "Please enter the wallet password",
                pay_walletOpen_file_error: "Wallet file parsing is abnormal, please log in again",
                pay_walletOpen_openFail: "Fail to open wallet!Please try it again!",
                walletCreate_create: "Create a wallet",
                walletCreate_password: "enter password",
                walletCreate_vpass: "confirm password",
                walletCreate_password_notice: "*Password can not be retrieved. Please keep it carefully.",
                walletCreate_doCreate: "Create",
                walletCreate_check_pass: "Please check the input password",
                walletCreate_check_vpass: "Please check the confirmation password",
                walletImport_invalid_file: "Please select a valid wallet file",
                walletImport_select_file: "Please select the wallet file",
                walletImport_import: "Import wallet",
                walletImport_password: "Please enter the password",
                walletImport_doImport: "Bind wallet",
                walletImport_bind_succ: "Bind the wallet successfully!",
                walletView_info: "Do a game different and fun!",
                walletView_create: "Create Wallet",
                walletView_import: "Import Wallet",
                main_wait_for_last_tran: "Please confirm or cancel the previous transaction request and then execute",
                main_no_app_wallet: "The app does not have a billing wallet address configured and cannot be recharged.",
                main_need_open_wallet_confirm: "The withdrawal operation needs to open the wallet, is it open immediately? ",
                main_refund_second_fail: "Generate conversion request (utxo->gas) failed",
                main_refund_getScript_err: "Failed to get conversion contract!",
                main_refund_sendRequest_err: "Sending a conversion request failed!",
                main_refund_doFail: "Conversion contract execution failed!",
                errCode_1101: "Request interface parameter error",
                errCode_1005: "You visit too often, please take a break!",
                errCode_100601: "Failed to get SMS verification code! Please check your country and mobile number!",
                errCode_100602: "Incorrect verification code!",
                errCode_100605: "This phone number has been registered!",
                errCode_100606: "Please register first",
                errCode_100607: "Wrong username or telephone number!",
                errCode_100608: "Wrong phone number or password!",
                errCode_100801: "Failed to get email verification code!",
                errcode_100802: "Incorrect verification code!",
                errCode_100805: "This email address has been registered!",
                errCode_100806: "Please register first",
                errCode_100807: "Wrong username or email address!",
                errCode_100808: "Wrong email address or password!",
                errCode_100700: "Incorrect account or password!",
                errCode_100701: "Login is invalid, please log in again",
                errCode_100702: "Incorrect account or password,please try it again",
                errCode_100707: "Username already existed!",
                errCode_8100000: "Your have already bundled my wallet and don't need to bind again!",
                errCode_8100001: "The format of the uploaded wallet is incorrect. Please check the wallet file!",
                errCode_8100002: "System error, wallet binding failed!",
                errCode_8100003: "The wallet has been bound by other users!",
                errCode_8100004: "Incorrect format!",
                errcode_8100005: "Upload failed!",
                errcode_8100006: "Image size must be less than 100Kb.",
                errCode_8100007: "The contact already exists!",
                errCode_default: "Unknown error! Error code: %errCode%",
                wallet_open_check: "Please check your wallet file or password!",
                wallet_open_check_otcgo: "Please check the Otcgo wallet file!",
                wallet_open_check_otcgo_pwd: "Please check the Otcgo wallet password!",
                netmgr_select_api_slow: "Connection to the server is abnormal or slow, please check the network and try it again!",
                netmgr_select_node_slow: "Communication with the nodes on the chain is abnormal or slow, please check the network and try it later!",
                netmgr_connecting: "Connecting ...",
                netmgr_connecting_fail: "Connection failed. Please check the network and try it again!",
            };
        }
    }
    BlackCat.LangEN = LangEN;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangMgr {
        constructor(type = "") {
        }
        setType(type) {
            console.log('[Bla Cat]', '[LangMgr]', 'setType, type => ', type, ', this.type => ', this.type);
            if (this.type == type) {
                return false;
            }
            switch (type) {
                case "en":
                    this.lang = new BlackCat.LangEN();
                    this.type = type;
                    break;
                default:
                    this.lang = new BlackCat.LangCN();
                    this.type = "cn";
                    break;
            }
            return true;
        }
        get(key, ext = null) {
            var src = this.lang.get(key);
            if (ext) {
                for (let k in ext) {
                    let rk = '%' + k + '%';
                    src = src.replace(rk, ext[k]);
                }
            }
            return src;
        }
    }
    BlackCat.LangMgr = LangMgr;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class Connector {
        constructor(hosts, check_params) {
            this.hosts = hosts;
            this.check_params = check_params;
            this.fetch_error = [];
        }
        getOne(callback) {
            try {
                var protocol = "";
                if (window.location.protocol == "file:") {
                    protocol = "http:";
                }
                this.hosts.forEach(host => {
                    let url_head = "";
                    if (host.substr(0, 2) === "//") {
                        url_head = protocol;
                    }
                    let url = url_head + host + this.check_params;
                    fetch(url).then(response => {
                        if (response.ok) {
                            if (!this.first_host) {
                                this.first_host = url_head + host;
                                callback(this.first_host);
                            }
                        }
                        else {
                            this.fetch_error.push(host);
                        }
                    }, error => {
                        this.fetch_error.push(host);
                        console.log('[Bla Cat]', '[Connector]', 'getOne, fetch err => ', error);
                    });
                });
            }
            catch (e) {
                console.log('[Bla Cat]', '[Connector]', 'getOne, error => ', e.toString());
            }
            this.check_results(callback);
        }
        check_results(callback) {
            console.log('[Bla Cat]', '[Connector]', 'do check_results ...');
            setTimeout(() => {
                if (!this.first_host) {
                    if (this.fetch_error.length == this.hosts.length) {
                        console.log('[Bla Cat]', '[Connector]', 'check_results, all fetch_error => ', this.fetch_error);
                        callback(false);
                    }
                    else {
                        this.check_results(callback);
                    }
                }
            }, 500);
        }
    }
    BlackCat.Connector = Connector;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class NetMgr {
        constructor() {
            this.types = [1, 2];
            this.nodes = {};
            this.nodes[1] = [
                "https://api.nel.group/api/mainnet",
                "https://nelnode01.blacat.org/api/mainnet",
            ];
            this.nodes[2] = [
                "https://nelnode00.9191wyx.com/api/testnet",
                "https://api.nel.group/api/testnet",
                "https://nelnode00.blacat.org/api/testnet",
            ];
            this.apis = [
                "//api00.9191wyx.com/apic_v2/",
            ];
            this.node_server = {};
            this.default_type = 1;
        }
        selectApi(callback) {
            if (this.api_server) {
                BlackCat.ApiTool.base_url = this.api_server;
                callback();
                return;
            }
            BlackCat.Main.viewMgr.change("ViewConnecting");
            BlackCat.ViewConnecting.callback_retry = () => {
                this._selectApi(callback);
            };
            this._selectApi(callback);
        }
        _selectApi(callback) {
            BlackCat.Main.viewMgr.viewConnecting.showConnecting();
            BlackCat.Main.viewMgr.iconView.showState();
            var conn = new BlackCat.Connector(this.apis, "apic_test.php");
            conn.getOne((res) => {
                if (res === false) {
                    BlackCat.ViewConnecting.content = "netmgr_select_api_slow";
                    BlackCat.Main.viewMgr.viewConnecting.showRetry(false);
                    BlackCat.Main.viewMgr.iconView.hiddenState();
                    if (BlackCat.Main.isLoginInit() === true)
                        BlackCat.Main.viewMgr.iconView.showFail();
                    return;
                }
                console.log('[Bla Cat]', '[NetMgr]', 'api => ', res);
                this.api_server = res + "apic_user.php";
                BlackCat.ApiTool.base_url = this.api_server;
                callback();
            });
        }
        selectNode(callback, type) {
            if (this.node_server && this.node_server.hasOwnProperty(type) && this.node_server[type]) {
                BlackCat.tools.WWW.api = this.node_server[type];
                callback();
                return;
            }
            BlackCat.Main.viewMgr.change("ViewConnecting");
            BlackCat.ViewConnecting.callback_retry = () => {
                this._selectNode(callback, type);
            };
            this._selectNode(callback, type);
        }
        _selectNode(callback, type) {
            BlackCat.Main.viewMgr.viewConnecting.showConnecting();
            BlackCat.Main.viewMgr.iconView.showState();
            var conn = new BlackCat.Connector(this.nodes[type], "?jsonrpc=2.0&id=1&method=getblockcount&params=[]");
            conn.getOne((res) => {
                if (res === false) {
                    BlackCat.ViewConnecting.content = "netmgr_select_node_slow";
                    var showReturn = !BlackCat.Main.isLoginInit();
                    BlackCat.Main.viewMgr.viewConnecting.showRetry(showReturn);
                    BlackCat.Main.viewMgr.iconView.hiddenState();
                    if (BlackCat.Main.isLoginInit() === true)
                        BlackCat.Main.viewMgr.iconView.showFail();
                    return;
                }
                console.log('[Bla Cat]', '[NetMgr]', 'node => ', res);
                this.node_server[type] = res;
                BlackCat.tools.WWW.api = this.node_server[type];
                callback();
                if (BlackCat.Main.viewMgr.viewConnecting.isCreated)
                    BlackCat.Main.viewMgr.viewConnecting.remove();
                BlackCat.Main.viewMgr.iconView.hiddenState();
                BlackCat.Main.viewMgr.iconView.showSucc();
            });
        }
        change(callback, type = null) {
            if (!type) {
                type = this.default_type;
            }
            if (this.type != type) {
                console.log('[Bla Cat]', '[NetType]', ' change to type => ', type);
                switch (type) {
                    case 1:
                        this.change2Main(callback);
                        break;
                    case 2:
                        this.change2test(callback);
                        break;
                }
            }
        }
        setDefault(type) {
            console.log('[Bla Cat]', '[NetType]', ' default type => ', type);
            this.default_type = type;
        }
        change2test(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                this.selectNode(() => {
                    this.type = 2;
                    BlackCat.tools.CoinTool.id_SGAS = "0x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54";
                    BlackCat.tools.CoinTool.id_SGAS_OLD = [];
                    callback();
                }, 2);
            });
        }
        change2Main(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                this.selectNode(() => {
                    this.type = 1;
                    BlackCat.tools.CoinTool.id_SGAS = "";
                    BlackCat.tools.CoinTool.id_SGAS_OLD = [];
                    callback();
                }, 1);
            });
        }
        getOtherTypes() {
            var res = new Array();
            for (let k = 0; k < this.types.length; k++) {
                if (this.types[k] !== this.type) {
                    res.push(this.types[k]);
                }
            }
            return res;
        }
    }
    BlackCat.NetMgr = NetMgr;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewBase {
        constructor() {
            this.isCreated = false;
            this.reset();
        }
        create() { }
        toRefer() { }
        reset() { { } }
        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.parentAdd(this.div);
            }
            this.show();
        }
        remove(timeout = 0, fadeClass = "pc_fadeindown") {
            if (this.s_timeout_remove) {
                return;
            }
            if (timeout) {
                if (fadeClass)
                    this.div.classList.add("pc_fadeindown");
                this.s_timeout_remove = setTimeout(() => {
                    this._remove();
                }, timeout);
            }
            else {
                this._remove();
            }
        }
        _remove() {
            this.s_timeout_remove = null;
            this.parentRemove(this.div);
            this.isCreated = false;
            this.reset();
        }
        return(timeout = 0) {
            this.remove(timeout);
            this.toRefer();
        }
        hidden() {
            this.div.style.display = "none";
        }
        show() {
            this.div.style.display = "";
        }
        isHidden() {
            if (this.div && this.div.style.display == "none") {
                return true;
            }
            return false;
        }
        update() {
            this.parentRemove(this.div);
            this.create();
            this.parentAdd(this.div);
        }
        objCreate(tag) {
            var addElement = document.createElement(tag);
            return addElement;
        }
        ObjAppend(o, tag) {
            o.appendChild(tag);
        }
        objRemove(o, tag) {
            o.removeChild(tag);
        }
        parentAdd(tag) {
            this.ObjAppend(BlackCat.Main.viewMgr.mainView.div, tag);
        }
        parentRemove(tag) {
            this.objRemove(BlackCat.Main.viewMgr.mainView.div, tag);
        }
        bodyAppend(tag) {
            document.body.appendChild(tag);
        }
        bodyRemove(tag) {
            document.body.removeChild(tag);
        }
    }
    BlackCat.ViewBase = ViewBase;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class AddressbookDetailsView extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!AddressbookDetailsView.contact) {
                AddressbookDetailsView.contact = new BlackCat.contact();
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_maillist", "pc_maillist_details");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var headerReturn = this.objCreate("a");
            headerReturn.classList.add("iconfont", "icon-fanhui");
            headerReturn.textContent = BlackCat.Main.langMgr.get("return");
            headerReturn.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, headerReturn);
            var headerTitle = this.objCreate("h1");
            headerTitle.textContent = BlackCat.Main.langMgr.get("addressbook_det_title");
            this.ObjAppend(header, headerTitle);
            var iHeader = this.objCreate("i");
            iHeader.classList.add("pc_returngame", "iconfont", "icon-qianbi");
            iHeader.onclick = () => {
                this.hidden();
                BlackCat.AddressbookOpView.refer = "AddressbookDetailsView";
                BlackCat.AddressbookOpView.contact = AddressbookDetailsView.contact;
                BlackCat.AddressbookOpView.opType = "update";
                BlackCat.Main.viewMgr.change("AddressbookOpView");
            };
            this.ObjAppend(header, iHeader);
            var divObj = this.objCreate("div");
            divObj.classList.add("pc_addressbookdet");
            this.ObjAppend(this.div, divObj);
            var divName = this.objCreate("div");
            divName.classList.add("pc_addressbookname");
            divName.textContent = AddressbookDetailsView.contact.address_name;
            this.ObjAppend(divObj, divName);
            var divAddressTitle = this.objCreate("div");
            divAddressTitle.classList.add("pc_addresstitle");
            this.ObjAppend(divObj, divAddressTitle);
            var labelAddressTitle = this.objCreate("label");
            labelAddressTitle.textContent = BlackCat.Main.langMgr.get("addressbook_det_address");
            this.ObjAppend(divAddressTitle, labelAddressTitle);
            var butCopy = this.objCreate("button");
            butCopy.textContent = BlackCat.Main.langMgr.get("copy");
            butCopy.onclick = () => {
                var inputCooy = this.objCreate("input");
                inputCooy.value = this.divAddress.innerText;
                this.ObjAppend(divObj, inputCooy);
                inputCooy.select();
                document.execCommand("Copy");
                inputCooy.remove();
                BlackCat.Main.showToast("pc_receivables_copy", 1500);
            };
            this.ObjAppend(divAddressTitle, butCopy);
            var butMakeTransfer = this.objCreate("button");
            butMakeTransfer.textContent = BlackCat.Main.langMgr.get("addressbook_det_transfer");
            butMakeTransfer.onclick = () => {
                this.doMakeTransfer();
            };
            this.ObjAppend(divAddressTitle, butMakeTransfer);
            this.divAddress = this.objCreate("div");
            this.divAddress.classList.add("pc_receivables");
            this.divAddress.textContent = AddressbookDetailsView.contact.address_wallet;
            this.ObjAppend(divObj, this.divAddress);
            var divQRCode = this.objCreate("div");
            divQRCode.classList.add("pc_qrcode");
            this.ObjAppend(divObj, divQRCode);
            var qrObj = this.objCreate("img");
            QrCodeWithLogo.toImage({
                image: qrObj,
                content: AddressbookDetailsView.contact.address_wallet
            }).then(() => {
                var url = URL.createObjectURL(this.base64ToBlob(qrObj.src));
                qr_download.setAttribute('href', url);
                qr_download.setAttribute("download", AddressbookDetailsView.contact.address_wallet + ".png");
            });
            this.ObjAppend(divQRCode, qrObj);
            var qr_download = this.objCreate("a");
            qr_download.classList.add("iconfont", "icon-xiazai");
            qr_download.textContent = BlackCat.Main.langMgr.get("addressbook_det_download");
            this.ObjAppend(divQRCode, qr_download);
            var divDescribeTitle = this.objCreate("div");
            divDescribeTitle.classList.add("pc_addresstitle");
            divDescribeTitle.textContent = BlackCat.Main.langMgr.get("addressbook_det_describe");
            this.ObjAppend(divObj, divDescribeTitle);
            var divDescribeText = this.objCreate("div");
            divDescribeText.classList.add("pc_describetext");
            divDescribeText.textContent = AddressbookDetailsView.contact.address_desc ? AddressbookDetailsView.contact.address_desc : BlackCat.Main.langMgr.get("addressbook_det_empty");
            this.ObjAppend(divObj, divDescribeText);
            var btnDel = this.objCreate("button");
            btnDel.classList.add("pc_addressbookdel");
            btnDel.textContent = BlackCat.Main.langMgr.get("addressbook_det_del");
            btnDel.onclick = () => {
                this.dodel();
            };
            this.ObjAppend(divObj, btnDel);
        }
        toRefer() {
            if (AddressbookDetailsView.refer) {
                BlackCat.Main.viewMgr.change(AddressbookDetailsView.refer);
                AddressbookDetailsView.refer = null;
            }
        }
        dodel() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewConfirm.callback = () => {
                    this.makedel();
                };
                BlackCat.Main.showConFirm("addressbook_det_del_tips");
            });
        }
        makedel() {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.delAddrbook(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, AddressbookDetailsView.contact.id);
                if (res.r) {
                    BlackCat.Main.showToast("addressbook_det_del_succ");
                    this.return();
                    BlackCat.Main.viewMgr.addressbookView.getAddressbook();
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        doMakeTransfer() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.PayTransferView.callback = () => {
                        BlackCat.Main.viewMgr.payView.doGetWalletLists();
                    };
                    BlackCat.PayTransferView.address = AddressbookDetailsView.contact.address_wallet;
                    BlackCat.Main.viewMgr.change("PayTransferView");
                }
                else {
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doMakeTransfer();
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        }
    }
    BlackCat.AddressbookDetailsView = AddressbookDetailsView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class AddressbookOpView extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!AddressbookOpView.contact) {
                AddressbookOpView.contact = new BlackCat.contact();
            }
        }
        start() {
            super.start();
            this.inputName.focus();
            if (AddressbookOpView.opType == "add") {
                this.inputName.value = "";
                this.textAddress.value = "";
                this.textDescribe.value = "";
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_maillist", "pc_maillist_op");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var headerReturn = this.objCreate("a");
            headerReturn.classList.add("iconfont", "icon-fanhui");
            headerReturn.textContent = BlackCat.Main.langMgr.get("return");
            headerReturn.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, headerReturn);
            var butHeader = this.objCreate("button");
            butHeader.classList.add("pc_returngame");
            butHeader.textContent = BlackCat.Main.langMgr.get("addressbook_op_button");
            butHeader.onclick = () => {
                this.doFinished();
            };
            this.ObjAppend(header, butHeader);
            var divform = this.objCreate("div");
            divform.classList.add("pc_addressbookop");
            this.ObjAppend(this.div, divform);
            var divNameBox = this.objCreate("div");
            this.ObjAppend(divform, divNameBox);
            var labelName = this.objCreate("label");
            labelName.textContent = BlackCat.Main.langMgr.get("addressbook_op_name");
            this.ObjAppend(divNameBox, labelName);
            this.inputName = this.objCreate("input");
            this.inputName.placeholder = BlackCat.Main.langMgr.get("addressbook_op_inputName");
            this.inputName.value = AddressbookOpView.contact.address_name;
            this.ObjAppend(divNameBox, this.inputName);
            var divAddressBox = this.objCreate("div");
            this.ObjAppend(divform, divAddressBox);
            var labelAddress = this.objCreate("label");
            labelAddress.textContent = BlackCat.Main.langMgr.get("addressbook_op_address");
            this.ObjAppend(divAddressBox, labelAddress);
            this.textAddress = this.objCreate("textarea");
            this.textAddress.placeholder = BlackCat.Main.langMgr.get("addressbook_op_inputAddress");
            this.textAddress.value = AddressbookOpView.contact.address_wallet;
            this.ObjAppend(divAddressBox, this.textAddress);
            var iAddress = this.objCreate("i");
            iAddress.classList.add("iconfont", "icon-saomiao");
            this.ObjAppend(divAddressBox, iAddress);
            var divDescribeBox = this.objCreate("div");
            this.ObjAppend(divform, divDescribeBox);
            var labelDescribe = this.objCreate("label");
            labelDescribe.textContent = BlackCat.Main.langMgr.get("addressbook_op_describe");
            this.ObjAppend(divDescribeBox, labelDescribe);
            this.textDescribe = this.objCreate("textarea");
            this.textDescribe.placeholder = BlackCat.Main.langMgr.get("addressbook_op_inputDescribe");
            this.textDescribe.value = AddressbookOpView.contact.address_desc;
            this.ObjAppend(divDescribeBox, this.textDescribe);
        }
        toRefer() {
            if (AddressbookOpView.refer) {
                BlackCat.Main.viewMgr.change(AddressbookOpView.refer);
                AddressbookOpView.refer = null;
            }
        }
        doFinished() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.inputName.value) {
                    BlackCat.Main.showErrMsg("addressbook_op_inputName_err", () => {
                        this.inputName.focus();
                    });
                    return;
                }
                if (!this.textAddress.value) {
                    BlackCat.Main.showErrMsg("addressbook_op_inputAddress_err", () => {
                        this.textAddress.focus();
                    });
                    return;
                }
                var wallet_res = yield BlackCat.Main.validateFormat("walletaddr", this.textAddress);
                if (wallet_res === false) {
                    return;
                }
                if (AddressbookOpView.opType == "add") {
                    var res = yield BlackCat.ApiTool.addAddrbook(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, this.inputName.value, this.textAddress.value, this.textDescribe.value);
                    if (res.r) {
                        this.return();
                        BlackCat.Main.showToast("addressbook_op_addSucc");
                        BlackCat.Main.viewMgr.addressbookView.getAddressbook();
                    }
                    else {
                        BlackCat.Main.showErrCode(res.errCode);
                    }
                }
                else if (AddressbookOpView.opType == "update") {
                    var res = yield BlackCat.ApiTool.updateAddrbook(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, this.inputName.value, this.textAddress.value, this.textDescribe.value, AddressbookOpView.contact.id);
                    if (res.r) {
                        AddressbookOpView.contact.address_name = this.inputName.value;
                        AddressbookOpView.contact.address_wallet = this.textAddress.value;
                        AddressbookOpView.contact.address_desc = this.textDescribe.value;
                        BlackCat.AddressbookDetailsView.contact = AddressbookOpView.contact;
                        BlackCat.Main.showToast("addressbook_op_updateSucc");
                        BlackCat.Main.viewMgr.addressbookDetailsView.update();
                        this.return();
                        BlackCat.Main.viewMgr.addressbookView.getAddressbook();
                    }
                    else {
                        BlackCat.Main.showErrCode(res.errCode);
                    }
                }
            });
        }
    }
    BlackCat.AddressbookOpView = AddressbookOpView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class AddressbookView extends BlackCat.ViewBase {
        reset() {
            this.addressbook = {};
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_maillist");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var headerReturn = this.objCreate("a");
            headerReturn.classList.add("iconfont", "icon-fanhui");
            headerReturn.textContent = BlackCat.Main.langMgr.get("return");
            headerReturn.onclick = () => {
                if (AddressbookView.select) {
                    this.remove();
                    BlackCat.Main.viewMgr.payView.show();
                    BlackCat.Main.viewMgr.payTransferView.show();
                }
                else {
                    this.return();
                }
            };
            this.ObjAppend(header, headerReturn);
            var headerTitle = this.objCreate("h1");
            headerTitle.textContent = BlackCat.Main.langMgr.get("addressbook_title");
            this.ObjAppend(header, headerTitle);
            var iHeader = this.objCreate("i");
            iHeader.classList.add("pc_returngame", "iconfont", "icon-jiahao");
            iHeader.onclick = () => {
                this.hidden();
                BlackCat.AddressbookOpView.refer = "AddressbookView";
                BlackCat.AddressbookOpView.opType = "add";
                BlackCat.Main.viewMgr.change("AddressbookOpView");
            };
            this.ObjAppend(headerTitle, iHeader);
            var divSearch = this.objCreate("div");
            divSearch.classList.add("pc_search");
            this.ObjAppend(this.div, divSearch);
            var iSearch = this.objCreate("i");
            iSearch.classList.add("iconfont", "icon-sousuo");
            this.ObjAppend(divSearch, iSearch);
            this.inputSearch = this.objCreate("input");
            this.inputSearch.placeholder = BlackCat.Main.langMgr.get("addressbook_search");
            this.inputSearch.onkeyup = () => {
                this.searchAddressbook();
            };
            this.ObjAppend(divSearch, this.inputSearch);
            this.ulAddressbook = this.objCreate("ul");
            this.ulAddressbook.classList.add("pc_addressbooklist");
            this.ObjAppend(this.div, this.ulAddressbook);
            this.getAddressbook();
        }
        toRefer() {
            if (AddressbookView.refer) {
                BlackCat.Main.viewMgr.change(AddressbookView.refer);
                AddressbookView.refer = null;
            }
        }
        getAddressbook() {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.getAddrbook(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token);
                console.log('[Bla Cat]', '[AddressbookView]', 'getAddressbook, res =>', res);
                if (res.r) {
                    this.addressbook = res.data;
                    if (this.addressbook.hasOwnProperty("")) {
                        var undata = this.addressbook[""];
                        delete this.addressbook[""];
                        this.addressbook["#"] = undata;
                    }
                    this.ulAddressbook.innerHTML = "";
                    for (let k in this.addressbook) {
                        this.getAddressElement(k, this.addressbook[k]);
                    }
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        searchAddressbook() {
            var search_str = this.inputSearch.value;
            var search_data = {};
            for (let k in this.addressbook) {
                for (let i = 0; i < this.addressbook[k].length; i++) {
                    let name = this.addressbook[k][i]['address_name'];
                    if (name.indexOf(search_str) != -1) {
                        if (!search_data.hasOwnProperty(k)) {
                            search_data[k] = [];
                        }
                        search_data[k].push(this.addressbook[k][i]);
                    }
                }
            }
            var contacts = this.ulAddressbook.getElementsByTagName("li");
            for (let l = 0; l < contacts.length; l++) {
                var li = contacts[l];
                let type = li.getAttribute("data-type");
                if (type == "title") {
                    let k = li.getAttribute("data-value");
                    if (search_data.hasOwnProperty(k)) {
                        li.style.display = "";
                    }
                    else {
                        li.style.display = "none";
                    }
                }
                else if (type == "contact") {
                    let k = li.getAttribute("data-title");
                    if (search_data.hasOwnProperty(k)) {
                        let id = li.getAttribute("data-value");
                        var isMatch = 0;
                        for (let i = 0; i < search_data[k].length; i++) {
                            if (search_data[k][i]["id"] == id) {
                                isMatch = 1;
                                break;
                            }
                        }
                        if (li.style.display == "") {
                            if (isMatch == 0) {
                                li.style.display = "none";
                            }
                        }
                        else {
                            if (isMatch == 1) {
                                li.style.display = "";
                            }
                        }
                    }
                    else {
                        li.style.display = "none";
                    }
                }
            }
        }
        getAddressElement(k, addrs) {
            var liAddressbook = this.objCreate("li");
            liAddressbook.classList.add("pc_addressbooktitle");
            liAddressbook.textContent = k;
            liAddressbook.setAttribute("data-type", "title");
            liAddressbook.setAttribute("data-value", k);
            this.ObjAppend(this.ulAddressbook, liAddressbook);
            for (let i = 0; i < addrs.length; i++) {
                var liAddressbook = this.objCreate("li");
                liAddressbook.textContent = addrs[i]["address_name"];
                liAddressbook.setAttribute("data-title", k);
                liAddressbook.setAttribute("data-type", "contact");
                liAddressbook.setAttribute("data-value", addrs[i]["id"]);
                liAddressbook.onclick = () => {
                    if (AddressbookView.select) {
                        this.remove();
                        BlackCat.Main.viewMgr.payView.show();
                        BlackCat.Main.viewMgr.payTransferView.show();
                        BlackCat.PayTransferView.contact = addrs[i];
                        BlackCat.Main.viewMgr.payTransferView.gatSelect();
                        AddressbookView.select = "";
                    }
                    else {
                        this.hidden();
                        BlackCat.AddressbookDetailsView.refer = "AddressbookView";
                        BlackCat.AddressbookDetailsView.contact = addrs[i];
                        BlackCat.Main.viewMgr.change("AddressbookDetailsView");
                    }
                };
                this.ObjAppend(this.ulAddressbook, liAddressbook);
            }
        }
    }
    BlackCat.AddressbookView = AddressbookView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class AreaView extends BlackCat.ViewBase {
        static getByAreaCode(areaCode) {
            var areaInfo = null;
            AreaView.areaInfo.forEach(area => {
                if (area.areacode == areaCode) {
                    areaInfo = area;
                }
            });
            return areaInfo;
        }
        static getByCodeName(codeName) {
            var areaInfo = null;
            AreaView.areaInfo.forEach(area => {
                if (area.codename == codeName) {
                    areaInfo = area;
                }
            });
            return areaInfo;
        }
    }
    AreaView.areaInfo = [
        { "area": "中国", "areacode": "86", "codename": "CN" },
        { "area": "安道尔", "areacode": "376", "codename": "AD" },
        { "area": "阿拉伯联合酋长国", "areacode": "971", "codename": "AE" },
        { "area": "阿富汗", "areacode": "93", "codename": "AF" },
        { "area": "安提瓜和巴布达", "areacode": "1268", "codename": "AG" },
        { "area": "安圭拉", "areacode": "1264", "codename": "AI" },
        { "area": "阿尔巴尼亚", "areacode": "355", "codename": "AL" },
        { "area": "亚美尼亚", "areacode": "374", "codename": "AM" },
        { "area": "安哥拉", "areacode": "244", "codename": "AO" },
        { "area": "阿根廷", "areacode": "54", "codename": "AR" },
        { "area": "美属萨摩亚", "areacode": "1684", "codename": "AS" },
        { "area": "奥地利", "areacode": "43", "codename": "AT" },
        { "area": "澳大利亚", "areacode": "61", "codename": "AU" },
        { "area": "阿鲁巴", "areacode": "297", "codename": "AW" },
        { "area": "阿塞拜疆", "areacode": "994", "codename": "AZ" },
        { "area": "波斯尼亚和黑塞哥维那", "areacode": "387", "codename": "BA" },
        { "area": "巴巴多斯", "areacode": "1246", "codename": "BB" },
        { "area": "孟加拉国", "areacode": "880", "codename": "BD" },
        { "area": "比利时", "areacode": "32", "codename": "BE" },
        { "area": "布基纳法索", "areacode": "226", "codename": "BF" },
        { "area": "保加利亚", "areacode": "359", "codename": "BG" },
        { "area": "巴林", "areacode": "973", "codename": "BH" },
        { "area": "布隆迪", "areacode": "257", "codename": "BI" },
        { "area": "贝宁", "areacode": "229", "codename": "BJ" },
        { "area": "百慕大群岛", "areacode": "1441", "codename": "BM" },
        { "area": "文莱", "areacode": "673", "codename": "BN" },
        { "area": "玻利维亚", "areacode": "591", "codename": "BO" },
        { "area": "荷兰加勒比", "areacode": "599", "codename": "BQ" },
        { "area": "巴西", "areacode": "55", "codename": "BR" },
        { "area": "巴哈马", "areacode": "1242", "codename": "BS" },
        { "area": "不丹", "areacode": "975", "codename": "BT" },
        { "area": "博茨瓦纳", "areacode": "267", "codename": "BW" },
        { "area": "白俄罗斯", "areacode": "375", "codename": "BY" },
        { "area": "伯利兹", "areacode": "501", "codename": "BZ" },
        { "area": "加拿大", "areacode": "1", "codename": "CA" },
        { "area": "刚果民主共和国", "areacode": "243", "codename": "CD" },
        { "area": "中非共和国", "areacode": "236", "codename": "CF" },
        { "area": "刚果共和国", "areacode": "242", "codename": "CG" },
        { "area": "瑞士", "areacode": "41", "codename": "CH" },
        { "area": "象牙海岸", "areacode": "225", "codename": "CI" },
        { "area": "库克群岛", "areacode": "682", "codename": "CK" },
        { "area": "智利", "areacode": "56", "codename": "CL" },
        { "area": "喀麦隆", "areacode": "237", "codename": "CM" },
        { "area": "哥伦比亚", "areacode": "57", "codename": "CO" },
        { "area": "哥斯达黎加", "areacode": "506", "codename": "CR" },
        { "area": "古巴", "areacode": "53", "codename": "CU" },
        { "area": "开普", "areacode": "238", "codename": "CV" },
        { "area": "库拉索", "areacode": "599", "codename": "CW" },
        { "area": "塞浦路斯", "areacode": "357", "codename": "CY" },
        { "area": "捷克", "areacode": "420", "codename": "CZ" },
        { "area": "德国", "areacode": "49", "codename": "DE" },
        { "area": "吉布提", "areacode": "253", "codename": "DJ" },
        { "area": "丹麦", "areacode": "45", "codename": "DK" },
        { "area": "多米尼加", "areacode": "1767", "codename": "DM" },
        { "area": "多米尼加共和国", "areacode": "1809", "codename": "DO" },
        { "area": "阿尔及利亚", "areacode": "213", "codename": "DZ" },
        { "area": "厄瓜多尔", "areacode": "593", "codename": "EC" },
        { "area": "爱沙尼亚", "areacode": "372", "codename": "EE" },
        { "area": "埃及", "areacode": "20", "codename": "EG" },
        { "area": "厄立特里亚", "areacode": "291", "codename": "ER" },
        { "area": "西班牙", "areacode": "34", "codename": "ES" },
        { "area": "埃塞俄比亚", "areacode": "251", "codename": "ET" },
        { "area": "芬兰", "areacode": "358", "codename": "FI" },
        { "area": "斐济", "areacode": "679", "codename": "FJ" },
        { "area": "密克罗尼西亚", "areacode": "691", "codename": "FM" },
        { "area": "法罗群岛", "areacode": "298", "codename": "FO" },
        { "area": "法国", "areacode": "33", "codename": "FR" },
        { "area": "加蓬", "areacode": "241", "codename": "GA" },
        { "area": "英国", "areacode": "44", "codename": "GB" },
        { "area": "格林纳达", "areacode": "1473", "codename": "GD" },
        { "area": "格鲁吉亚", "areacode": "995", "codename": "GE" },
        { "area": "法属圭亚那", "areacode": "594", "codename": "GF" },
        { "area": "加纳", "areacode": "233", "codename": "GH" },
        { "area": "直布罗陀", "areacode": "350", "codename": "GI" },
        { "area": "格陵兰岛", "areacode": "299", "codename": "GL" },
        { "area": "冈比亚", "areacode": "220", "codename": "GM" },
        { "area": "几内亚", "areacode": "224", "codename": "GN" },
        { "area": "瓜德罗普岛", "areacode": "590", "codename": "GP" },
        { "area": "赤道几内亚", "areacode": "240", "codename": "GQ" },
        { "area": "希腊", "areacode": "30", "codename": "GR" },
        { "area": "瓜地马拉", "areacode": "502", "codename": "GT" },
        { "area": "关岛", "areacode": "1671", "codename": "GU" },
        { "area": "几内亚比绍共和国", "areacode": "245", "codename": "GW" },
        { "area": "圭亚那", "areacode": "592", "codename": "GY" },
        { "area": "中国香港", "areacode": "852", "codename": "HK" },
        { "area": "洪都拉斯", "areacode": "504", "codename": "HN" },
        { "area": "克罗地亚", "areacode": "385", "codename": "HR" },
        { "area": "海地", "areacode": "509", "codename": "HT" },
        { "area": "匈牙利", "areacode": "36", "codename": "HU" },
        { "area": "印度尼西亚", "areacode": "62", "codename": "ID" },
        { "area": "爱尔兰", "areacode": "353", "codename": "IE" },
        { "area": "以色列", "areacode": "972", "codename": "IL" },
        { "area": "印度", "areacode": "91", "codename": "IN" },
        { "area": "伊拉克", "areacode": "964", "codename": "IQ" },
        { "area": "伊朗", "areacode": "98", "codename": "IR" },
        { "area": "冰岛", "areacode": "354", "codename": "IS" },
        { "area": "意大利", "areacode": "39", "codename": "IT" },
        { "area": "牙买加", "areacode": "1876", "codename": "JM" },
        { "area": "约旦", "areacode": "962", "codename": "JO" },
        { "area": "日本", "areacode": "81", "codename": "JP" },
        { "area": "肯尼亚", "areacode": "254", "codename": "KE" },
        { "area": "吉尔吉斯斯坦", "areacode": "996", "codename": "KG" },
        { "area": "柬埔寨", "areacode": "855", "codename": "KH" },
        { "area": "基里巴斯", "areacode": "686", "codename": "KI" },
        { "area": "科摩罗", "areacode": "269", "codename": "KM" },
        { "area": "圣基茨和尼维斯", "areacode": "1869", "codename": "KN" },
        { "area": "朝鲜", "areacode": "850", "codename": "KP" },
        { "area": "韩国", "areacode": "82", "codename": "KR" },
        { "area": "科威特", "areacode": "965", "codename": "KW" },
        { "area": "开曼群岛", "areacode": "1345", "codename": "KY" },
        { "area": "哈萨克斯坦", "areacode": "7", "codename": "KZ" },
        { "area": "老挝", "areacode": "856", "codename": "LA" },
        { "area": "黎巴嫩", "areacode": "961", "codename": "LB" },
        { "area": "圣露西亚", "areacode": "1758", "codename": "LC" },
        { "area": "列支敦士登", "areacode": "423", "codename": "LI" },
        { "area": "斯里兰卡", "areacode": "94", "codename": "LK" },
        { "area": "利比里亚", "areacode": "231", "codename": "LR" },
        { "area": "莱索托", "areacode": "266", "codename": "LS" },
        { "area": "立陶宛", "areacode": "370", "codename": "LT" },
        { "area": "卢森堡", "areacode": "352", "codename": "LU" },
        { "area": "拉脱维亚", "areacode": "371", "codename": "LV" },
        { "area": "利比亚", "areacode": "218", "codename": "LY" },
        { "area": "摩洛哥", "areacode": "212", "codename": "MA" },
        { "area": "摩纳哥", "areacode": "377", "codename": "MC" },
        { "area": "摩尔多瓦", "areacode": "373", "codename": "MD" },
        { "area": "黑山", "areacode": "382", "codename": "ME" },
        { "area": "马达加斯加", "areacode": "261", "codename": "MG" },
        { "area": "马绍尔群岛", "areacode": "692", "codename": "MH" },
        { "area": "马其顿", "areacode": "389", "codename": "MK" },
        { "area": "马里", "areacode": "223", "codename": "ML" },
        { "area": "缅甸", "areacode": "95", "codename": "MM" },
        { "area": "蒙古", "areacode": "976", "codename": "MN" },
        { "area": "中国澳门", "areacode": "853", "codename": "MO" },
        { "area": "毛里塔尼亚", "areacode": "222", "codename": "MR" },
        { "area": "蒙特塞拉特岛", "areacode": "1664", "codename": "MS" },
        { "area": "马耳他", "areacode": "356", "codename": "MT" },
        { "area": "毛里求斯", "areacode": "230", "codename": "MU" },
        { "area": "马尔代夫", "areacode": "960", "codename": "MV" },
        { "area": "马拉维", "areacode": "265", "codename": "MW" },
        { "area": "墨西哥", "areacode": "52", "codename": "MX" },
        { "area": "马来西亚", "areacode": "60", "codename": "MY" },
        { "area": "莫桑比克", "areacode": "258", "codename": "MZ" },
        { "area": "纳米比亚", "areacode": "264", "codename": "NA" },
        { "area": "新喀里多尼亚", "areacode": "687", "codename": "NC" },
        { "area": "尼日尔", "areacode": "227", "codename": "NE" },
        { "area": "尼日利亚", "areacode": "234", "codename": "NG" },
        { "area": "尼加拉瓜", "areacode": "505", "codename": "NI" },
        { "area": "荷兰", "areacode": "31", "codename": "NL" },
        { "area": "挪威", "areacode": "47", "codename": "NO" },
        { "area": "尼泊尔", "areacode": "977", "codename": "NP" },
        { "area": "拿鲁岛", "areacode": "674", "codename": "NR" },
        { "area": "新西兰", "areacode": "64", "codename": "NZ" },
        { "area": "阿曼", "areacode": "968", "codename": "OM" },
        { "area": "巴拿马", "areacode": "507", "codename": "PA" },
        { "area": "秘鲁", "areacode": "51", "codename": "PE" },
        { "area": "法属波利尼西亚", "areacode": "689", "codename": "PF" },
        { "area": "巴布亚新几内亚", "areacode": "675", "codename": "PG" },
        { "area": "菲律宾", "areacode": "63", "codename": "PH" },
        { "area": "巴基斯坦", "areacode": "92", "codename": "PK" },
        { "area": "波兰", "areacode": "48", "codename": "PL" },
        { "area": "圣彼埃尔和密克隆岛", "areacode": "508", "codename": "PM" },
        { "area": "波多黎各", "areacode": "1787", "codename": "PR" },
        { "area": "葡萄牙", "areacode": "351", "codename": "PT" },
        { "area": "帕劳", "areacode": "680", "codename": "PW" },
        { "area": "巴拉圭", "areacode": "595", "codename": "PY" },
        { "area": "卡塔尔", "areacode": "974", "codename": "QA" },
        { "area": "留尼汪", "areacode": "262", "codename": "RE" },
        { "area": "罗马尼亚", "areacode": "40", "codename": "RO" },
        { "area": "塞尔维亚", "areacode": "381", "codename": "RS" },
        { "area": "俄罗斯", "areacode": "7", "codename": "RU" },
        { "area": "卢旺达", "areacode": "250", "codename": "RW" },
        { "area": "沙特阿拉伯", "areacode": "966", "codename": "SA" },
        { "area": "所罗门群岛", "areacode": "677", "codename": "SB" },
        { "area": "塞舌尔", "areacode": "248", "codename": "SC" },
        { "area": "苏丹", "areacode": "249", "codename": "SD" },
        { "area": "瑞典", "areacode": "46", "codename": "SE" },
        { "area": "新加坡", "areacode": "65", "codename": "SG" },
        { "area": "斯洛文尼亚", "areacode": "386", "codename": "SI" },
        { "area": "斯洛伐克", "areacode": "421", "codename": "SK" },
        { "area": "塞拉利昂", "areacode": "232", "codename": "SL" },
        { "area": "圣马力诺", "areacode": "378", "codename": "SM" },
        { "area": "塞内加尔", "areacode": "221", "codename": "SN" },
        { "area": "索马里", "areacode": "252", "codename": "SO" },
        { "area": "苏里南", "areacode": "597", "codename": "SR" },
        { "area": "圣多美和普林西比", "areacode": "239", "codename": "ST" },
        { "area": "萨尔瓦多", "areacode": "503", "codename": "SV" },
        { "area": "叙利亚", "areacode": "963", "codename": "SY" },
        { "area": "斯威士兰", "areacode": "268", "codename": "SZ" },
        { "area": "特克斯和凯科斯群岛", "areacode": "1649", "codename": "TC" },
        { "area": "乍得", "areacode": "235", "codename": "TD" },
        { "area": "多哥", "areacode": "228", "codename": "TG" },
        { "area": "泰国", "areacode": "66", "codename": "TH" },
        { "area": "塔吉克斯坦", "areacode": "992", "codename": "TJ" },
        { "area": "东帝汶", "areacode": "670", "codename": "TL" },
        { "area": "土库曼斯坦", "areacode": "993", "codename": "TM" },
        { "area": "突尼斯", "areacode": "216", "codename": "TN" },
        { "area": "汤加", "areacode": "676", "codename": "TO" },
        { "area": "土耳其", "areacode": "90", "codename": "TR" },
        { "area": "特立尼达和多巴哥", "areacode": "1868", "codename": "TT" },
        { "area": "中国台湾", "areacode": "886", "codename": "TW" },
        { "area": "坦桑尼亚", "areacode": "255", "codename": "TZ" },
        { "area": "乌克兰", "areacode": "380", "codename": "UA" },
        { "area": "乌干达", "areacode": "256", "codename": "UG" },
        { "area": "美国", "areacode": "1", "codename": "US" },
        { "area": "乌拉圭", "areacode": "598", "codename": "UY" },
        { "area": "乌兹别克斯坦", "areacode": "998", "codename": "UZ" },
        { "area": "圣文森特和格林纳丁斯", "areacode": "1784", "codename": "VC" },
        { "area": "委内瑞拉", "areacode": "58", "codename": "VE" },
        { "area": "英属处女群岛", "areacode": "1284", "codename": "VG" },
        { "area": "越南", "areacode": "84", "codename": "VN" },
        { "area": "瓦努阿图", "areacode": "678", "codename": "VU" },
        { "area": "萨摩亚", "areacode": "685", "codename": "WS" },
        { "area": "也门", "areacode": "967", "codename": "YE" },
        { "area": "马约特", "areacode": "269", "codename": "YT" },
        { "area": "南非", "areacode": "27", "codename": "ZA" },
        { "area": "赞比亚", "areacode": "260", "codename": "ZM" },
        { "area": "津巴布韦", "areacode": "263", "codename": "ZW" }
    ];
    BlackCat.AreaView = AreaView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class AutoLogoutWalletView extends BlackCat.ViewBase {
        constructor() {
            super(...arguments);
            this.logoutTime = [1, 5, 10, 30, 60, 120, 0];
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_myinfo", "pc_logoutwallet");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("security_title");
            this.ObjAppend(header, headerH1);
            var divSecurity = this.objCreate("div");
            divSecurity.classList.add("pc_myinfolist");
            this.ObjAppend(this.div, divSecurity);
            var ulSecurity = this.objCreate("ul");
            this.ObjAppend(divSecurity, ulSecurity);
            var liveTimeMax = BlackCat.Main.getLiveTimeMax();
            this.logoutTime.forEach(ts => {
                var liTime = this.objCreate("li");
                if (ts * 60 * 1000 == liveTimeMax) {
                    liTime.classList.add("pc_active");
                }
                liTime.textContent = BlackCat.Main.viewMgr.securityCenterView.getWalletOutTimeMaxMsg(ts * 60 * 1000);
                liTime.onclick = () => {
                    BlackCat.Main.setLiveTimeMax(ts);
                    ulSecurity.getElementsByClassName("pc_active")[0].classList.remove("pc_active");
                    liTime.classList.add("pc_active");
                    BlackCat.Main.viewMgr.securityCenterView.updateWalletOutTimeMaxMsg();
                    this.return();
                };
                this.ObjAppend(ulSecurity, liTime);
                var iTime = this.objCreate("i");
                iTime.classList.add("iconfont", "icon-gou");
                this.ObjAppend(liTime, iTime);
            });
        }
        toRefer() {
            BlackCat.Main.viewMgr.securityCenterView.show();
        }
    }
    BlackCat.AutoLogoutWalletView = AutoLogoutWalletView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ForgetPasswordView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.getCodeRetryMax = 60;
            this.getCodeRetry_curr = 0;
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_login", "pc_register");
            var divLogo = this.objCreate("div");
            divLogo.classList.add("pc_login_logo", "iconfont", "icon-blacat");
            this.ObjAppend(this.div, divLogo);
            var divTitle = this.objCreate("div");
            divTitle.classList.add("pc_login_title");
            this.ObjAppend(this.div, divTitle);
            var h1TitleType = this.objCreate("h1");
            h1TitleType.classList.add("pc_title_tyle");
            h1TitleType.textContent = BlackCat.Main.langMgr.get("forgetpass_title");
            this.ObjAppend(divTitle, h1TitleType);
            var divTitleobj = this.objCreate("div");
            divTitleobj.classList.add("pc_title_switch");
            this.ObjAppend(divTitle, divTitleobj);
            var aTiletMobile = this.objCreate("a");
            aTiletMobile.classList.add("pc_tiletmobile", "pc_active");
            aTiletMobile.style.borderLeft = "0";
            aTiletMobile.textContent = BlackCat.Main.langMgr.get("main_phone");
            aTiletMobile.onclick = () => {
                areaSelect.style.display = "block";
                aTiletMobile.classList.add("pc_active");
                aTilEtEmail.classList.remove("pc_active");
                iIshurushouji.classList.add("icon-shurushouji");
                iIshurushouji.classList.remove("icon-xinxi");
                this.inputAccount.value = "";
                this.inputCode.value = "";
                this.accountType = "phone";
                this.inputAccount.placeholder = BlackCat.Main.langMgr.get("forgetpass_input" + this.accountType);
            };
            this.ObjAppend(divTitleobj, aTiletMobile);
            var aTilEtEmail = this.objCreate("a");
            aTilEtEmail.textContent = BlackCat.Main.langMgr.get("main_email");
            aTilEtEmail.onclick = () => {
                areaSelect.style.display = "none";
                aTilEtEmail.classList.add("pc_active");
                aTiletMobile.classList.remove("pc_active");
                iIshurushouji.classList.add("icon-xinxi");
                iIshurushouji.classList.remove("icon-shurushouji");
                this.inputAccount.value = "";
                this.inputCode.value = "";
                this.accountType = "email";
                this.inputAccount.placeholder = BlackCat.Main.langMgr.get("forgetpass_input" + this.accountType);
            };
            this.ObjAppend(divTitleobj, aTilEtEmail);
            var divInput = this.objCreate("div");
            divInput.classList.add("pc_login_input");
            this.ObjAppend(this.div, divInput);
            var areaSelect = this.objCreate("div");
            areaSelect.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, areaSelect);
            var iRegion = this.objCreate("i");
            iRegion.classList.add("iconfont", "icon-diqiu");
            this.ObjAppend(areaSelect, iRegion);
            this.selectArea = this.objCreate("select");
            BlackCat.AreaView.areaInfo.forEach(area => {
                var option = this.objCreate("option");
                option.setAttribute("value", area.codename);
                option.textContent = BlackCat.Main.langMgr.get("area_code_" + area.codename);
                this.selectArea.options.add(option);
            });
            this.selectArea.onchange = () => {
                BlackCat.AreaView.areaInfo.forEach(area => {
                    if (area.codename == this.selectArea.value) {
                        this.divArea.textContent = area.areacode;
                    }
                });
            };
            this.ObjAppend(areaSelect, this.selectArea);
            this.divArea = this.objCreate("div");
            this.divArea.classList.add("pc_area");
            BlackCat.AreaView.areaInfo.forEach(area => {
                if (area.codename == this.selectArea.value) {
                    this.divArea.textContent = area.areacode;
                }
            });
            this.ObjAppend(areaSelect, this.divArea);
            var aArea = this.objCreate("a");
            aArea.classList.add("pc_areaa", "iconfont", "icon-xiala");
            this.ObjAppend(areaSelect, aArea);
            var divTel = this.objCreate("div");
            divTel.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divTel);
            var iIshurushouji = this.objCreate("i");
            iIshurushouji.classList.add("iconfont", "icon-shurushouji");
            this.ObjAppend(divTel, iIshurushouji);
            this.inputAccount = this.objCreate("input");
            this.inputAccount.type = "text";
            this.inputAccount.placeholder = BlackCat.Main.langMgr.get("forgetpass_inputphone");
            this.ObjAppend(divTel, this.inputAccount);
            var divCode = this.objCreate("div");
            divCode.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divCode);
            var iCode = this.objCreate("i");
            iCode.classList.add("iconfont", "icon-dunpai1");
            this.ObjAppend(divCode, iCode);
            this.inputCode = this.objCreate("input");
            this.inputCode.type = "text";
            this.inputCode.style.width = "60%";
            this.inputCode.placeholder = BlackCat.Main.langMgr.get("forgetpass_inputCode");
            this.ObjAppend(divCode, this.inputCode);
            var divPass = this.objCreate("div");
            divPass.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divPass);
            var iPass = this.objCreate("i");
            iPass.classList.add("iconfont", "icon-mima");
            this.ObjAppend(divPass, iPass);
            this.inputPass = this.objCreate("input");
            this.inputPass.type = "password";
            this.inputPass.placeholder = BlackCat.Main.langMgr.get("forgetpass_inputPass");
            this.ObjAppend(divPass, this.inputPass);
            var divVPass = this.objCreate("div");
            divVPass.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divVPass);
            var iVPass = this.objCreate("i");
            iVPass.classList.add("iconfont", "icon-mima");
            this.ObjAppend(divVPass, iVPass);
            this.inputVpass = this.objCreate("input");
            this.inputVpass.type = "password";
            this.inputVpass.placeholder = BlackCat.Main.langMgr.get("forgetpass_inputVpass");
            this.ObjAppend(divVPass, this.inputVpass);
            this.getCode = this.objCreate("button");
            this.getCode.textContent = BlackCat.Main.langMgr.get("forgetpass_getCode");
            this.getCode.onclick = () => {
                this.doGetCode();
            };
            this.ObjAppend(divCode, this.getCode);
            this.getCodeCount = this.objCreate("button");
            this.getCodeCount.classList.add("pc_getPhoneCodecount");
            this.getCodeCount.textContent = BlackCat.Main.langMgr.get("forgetpass_getCodecount");
            this.ObjAppend(divCode, this.getCodeCount);
            var doForgetPassword = this.objCreate("button");
            doForgetPassword.classList.add("pc_doLogin");
            doForgetPassword.textContent = BlackCat.Main.langMgr.get("forgetpass_do");
            doForgetPassword.onclick = () => {
                this.doForgetPassword();
            };
            this.ObjAppend(divInput, doForgetPassword);
            var doLogin = this.objCreate("button");
            doLogin.classList.add("pc_loginregion");
            doLogin.textContent = BlackCat.Main.langMgr.get("forgetpass_doLogin");
            doLogin.onclick = () => {
                this.remove();
                BlackCat.Main.viewMgr.change("LoginView");
            };
            this.ObjAppend(divInput, doLogin);
        }
        start() {
            super.start();
            this.inputAccount.focus();
        }
        update() {
            super.update();
            this.doRetryCount(0);
        }
        reset() {
            if (this.s_getCodeCountRetry)
                clearInterval(this.s_getCodeCountRetry);
            this.accountType = "phone";
        }
        empty(value) {
            if (value.toString().length == 0) {
                return true;
            }
            return false;
        }
        validateAccount(emptySkip = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputAccount.value)) {
                    if (emptySkip)
                        return;
                    BlackCat.Main.showErrMsg(("forgetpass_input" + this.accountType + "_err"));
                    return false;
                }
                if ((yield BlackCat.Main.validateFormat(this.accountType, this.inputAccount)) == false) {
                    return false;
                }
                return yield this.checkAccountFromApi();
            });
        }
        validateCode() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputCode.value)) {
                    BlackCat.Main.showErrMsg(("forgetpass_inputCode_err"));
                    return false;
                }
                return yield BlackCat.Main.validateFormat("vcode", this.inputCode);
            });
        }
        validatePass() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputPass.value)) {
                    BlackCat.Main.showErrMsg(("forgetpass_inputPass_err"));
                    return false;
                }
                return true;
            });
        }
        validateVpass() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputVpass.value)) {
                    BlackCat.Main.showErrMsg(("forgetpass_inputVpass_err"));
                    return false;
                }
                if (this.inputVpass.value != this.inputPass.value) {
                    BlackCat.Main.showErrMsg(("forgetpass_inputVpass_inputPass_err"));
                    return false;
                }
                return true;
            });
        }
        checkAccountFromApi() {
            return __awaiter(this, void 0, void 0, function* () {
                var res;
                switch (this.accountType) {
                    case 'email':
                        res = yield BlackCat.ApiTool.validEmail(this.inputAccount.value);
                        break;
                    case 'phone':
                        res = yield BlackCat.ApiTool.validPhone(this.getPhone());
                        break;
                    default:
                        return;
                }
                if (res.r) {
                    BlackCat.Main.showErrMsg('forgetpass_input' + this.accountType + '_notexist');
                    return false;
                }
                return true;
            });
        }
        doForgetPassword() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.validateAccount(false)))
                    return;
                if (!(yield this.validateCode()))
                    return;
                if (!(yield this.validatePass()))
                    return;
                if (!(yield this.validateVpass()))
                    return;
                var res;
                switch (this.accountType) {
                    case 'email':
                        res = yield BlackCat.ApiTool.forgetPassByEmail(this.inputAccount.value, this.inputCode.value, this.inputVpass.value);
                        break;
                    case 'phone':
                        res = yield BlackCat.ApiTool.forgetPassByPhone(this.getPhone(), this.inputCode.value, this.inputVpass.value);
                        break;
                    default:
                        return;
                }
                if (res.r) {
                    BlackCat.Main.showInfo('forgetpass_do_ok', () => {
                        this.remove();
                        BlackCat.Main.viewMgr.change("LoginView");
                    });
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        doRetryCount(type) {
            switch (type) {
                case 0:
                    if (this.s_getCodeCountRetry) {
                        this.getCode.style.display = "none";
                        this.getCodeCount.style.display = "block";
                    }
                    break;
                case 1:
                    this.getCodeRetry_curr = this.getCodeRetryMax;
                    this.getCode.style.display = "none";
                    this.getCodeCount.style.display = "block";
                    this.s_getCodeCountRetry = setInterval(() => {
                        this._doRetryCount();
                    }, 1000);
                    break;
            }
        }
        _doRetryCount() {
            if (this.getCodeRetry_curr > 0 && this.getCodeCount != null) {
                this.getCodeRetry_curr--;
                this.getCodeCount.innerText = BlackCat.Main.langMgr.get("forgetpass_getCodecountRetry") + "(" + this.getCodeRetry_curr + ")";
            }
            else if (this.getCodeCount != null) {
                clearInterval(this.s_getCodeCountRetry);
                this.getCodeCount.style.display = "none";
                this.getCode.style.display = "block";
                this.getCodeRetry_curr = 0;
            }
            else {
                clearInterval(this.s_getCodeCountRetry);
                this.getCodeRetry_curr = 0;
            }
        }
        doGetCode() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.validateAccount(false)))
                    return;
                BlackCat.Main.viewMgr.change("ViewLoading");
                try {
                    var res;
                    switch (this.accountType) {
                        case 'email':
                            res = yield BlackCat.ApiTool.getEmailCode(this.inputAccount.value, BlackCat.Main.langMgr.type);
                            break;
                        case 'phone':
                            res = yield BlackCat.ApiTool.getPhoneCode(this.inputAccount.value);
                            break;
                        default:
                            return;
                    }
                }
                catch (e) {
                    console.log('[Bla Cat]', '[ForgetPasswordView]', 'doGetCode, ApiTool ' + this.accountType + 'error => ', e.toString());
                }
                BlackCat.Main.viewMgr.viewLoading.remove();
                if (res.r) {
                    this.doRetryCount(1);
                    BlackCat.Main.showToast("forgetpass_getCodeSucc");
                    this.getCode.style.display = "none";
                    this.getCodeCount.style.display = "block";
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        getPhone() {
            return BlackCat.Main.getPhone(this.selectArea.value, this.inputAccount.value);
        }
    }
    BlackCat.ForgetPasswordView = ForgetPasswordView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class IconView extends BlackCat.ViewBase {
        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.bodyAppend(this.div);
                this.onResize();
            }
            this.show();
        }
        reset() {
            this.doDragMove = false;
            if (this.div)
                this.flushProcess(0);
        }
        update() {
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_icon");
            this.showFail();
            this.div.onclick = () => {
                console.log('[Bla Cat]', '[IconView]', 'onclick, this.doDragMove => ', this.doDragMove);
                if (this.doDragMove == true) {
                    return false;
                }
                this.hidden();
                BlackCat.Main.viewMgr.mainView.div.classList.remove("pc_windowhide");
                BlackCat.Main.viewMgr.mainView.show();
            };
            this.div.onmousemove = () => {
                this.drag();
            };
            this.div.ontouchstart = (ev) => {
                this.dragTouch(ev);
            };
            this.processDiv = this.objCreate("div");
            this.ObjAppend(this.div, this.processDiv);
            this.showState();
        }
        remove() {
            this.bodyRemove(this.div);
        }
        showState() {
            if (!this.stateDiv) {
                this.stateDiv = this.objCreate("div");
                this.stateDiv.classList.add("pc_iconstate");
                var imgStateIcon = this.objCreate("img");
                imgStateIcon.src = BlackCat.Main.resHost + "res/img/BlackCaticon.gif";
                this.ObjAppend(this.stateDiv, imgStateIcon);
                this.ObjAppend(this.div, this.stateDiv);
            }
            this.stateDiv.style.display = "";
        }
        removeState() {
            if (this.stateDiv)
                this.objRemove(this.div, this.stateDiv);
        }
        hiddenState() {
            if (this.stateDiv)
                this.stateDiv.style.display = "none";
        }
        showFail() {
            this.div.classList.add("pc_iconfail");
        }
        showSucc() {
            this.div.classList.remove("pc_iconfail");
        }
        flushProcess(count) {
            console.log('[Bla Cat]', '[IconView]', 'flushProcess, count => ', count);
            if (count > 0) {
                this.div.classList.add("pc_iconRecord");
            }
            else {
                this.div.classList.remove("pc_iconRecord");
            }
        }
        dragTouch(ev) {
            var sent = {
                l: 0,
                r: window.innerWidth - this.div.offsetWidth,
                t: 0,
                b: window.innerHeight - this.div.offsetHeight
            };
            var dmW = document.documentElement.clientWidth || document.body.clientWidth;
            var dmH = document.documentElement.clientHeight || document.body.clientHeight;
            var l = sent.l || 0;
            var r = sent.r || dmW - this.div.offsetWidth;
            var t = sent.t || 0;
            var b = sent.b || dmH - this.div.offsetHeight;
            this.doDragMove = false;
            var oEvent = ev.touches[0];
            var sentX = oEvent.clientX - this.div.offsetLeft;
            var sentY = oEvent.clientY - this.div.offsetTop;
            document.ontouchmove = (ev) => {
                var mEvent = ev.touches[0];
                var slideLeft = mEvent.clientX - sentX;
                var slideTop = mEvent.clientY - sentY;
                if (slideLeft <= l) {
                    slideLeft = l;
                }
                if (slideLeft >= r) {
                    slideLeft = r;
                }
                if (slideTop <= t) {
                    slideTop = t;
                }
                if (slideTop >= b) {
                    slideTop = b;
                }
                this.div.style.left = slideLeft + 'px';
                this.div.style.top = slideTop + 'px';
                if (oEvent.clientX != mEvent.clientX || oEvent.clientY != mEvent.clientY) {
                    this.doDragMove = true;
                }
            };
            document.ontouchend = () => {
                document.ontouchmove = null;
            };
        }
        drag() {
            var sent = {
                l: 0,
                r: window.innerWidth - this.div.offsetWidth,
                t: 0,
                b: window.innerHeight - this.div.offsetHeight
            };
            var dmW = document.documentElement.clientWidth || document.body.clientWidth;
            var dmH = document.documentElement.clientHeight || document.body.clientHeight;
            var l = sent.l || 0;
            var r = sent.r || dmW - this.div.offsetWidth;
            var t = sent.t || 0;
            var b = sent.b || dmH - this.div.offsetHeight;
            this.div.onmousedown = (ev) => {
                this.doDragMove = false;
                var oEvent = ev;
                var sentX = oEvent.clientX - this.div.offsetLeft;
                var sentY = oEvent.clientY - this.div.offsetTop;
                document.onmousemove = (ev) => {
                    var mEvent = ev;
                    var slideLeft = mEvent.clientX - sentX;
                    var slideTop = mEvent.clientY - sentY;
                    if (slideLeft <= l) {
                        slideLeft = l;
                    }
                    if (slideLeft >= r) {
                        slideLeft = r;
                    }
                    if (slideTop <= t) {
                        slideTop = t;
                    }
                    if (slideTop >= b) {
                        slideTop = b;
                    }
                    this.div.style.left = slideLeft + 'px';
                    this.div.style.top = slideTop + 'px';
                    if (oEvent.clientX != mEvent.clientX || oEvent.clientY != mEvent.clientY) {
                        this.doDragMove = true;
                    }
                };
                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            };
        }
        onResize() {
            window.onresize = () => {
                var windowWidth = window.innerWidth;
                if (parseInt(this.div.style.left) + 64 >= windowWidth) {
                    this.div.style.left = "auto";
                }
            };
        }
    }
    BlackCat.IconView = IconView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LoginView extends BlackCat.ViewBase {
        reset() {
            this.accountType = "user";
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_login");
            var divLogo = this.objCreate("div");
            divLogo.classList.add("pc_login_logo", "iconfont", "icon-blacat");
            this.ObjAppend(this.div, divLogo);
            var divTitle = this.objCreate("div");
            divTitle.classList.add("pc_login_title");
            this.ObjAppend(this.div, divTitle);
            var h1TitleType = this.objCreate("h1");
            h1TitleType.classList.add("pc_title_tyle");
            h1TitleType.textContent = BlackCat.Main.langMgr.get("login_doLogin");
            this.ObjAppend(divTitle, h1TitleType);
            var divTitleobj = this.objCreate("div");
            divTitleobj.classList.add("pc_title_switch");
            this.ObjAppend(divTitle, divTitleobj);
            var aTiletUserName = this.objCreate("a");
            aTiletUserName.classList.add("pc_active");
            aTiletUserName.textContent = BlackCat.Main.langMgr.get("main_user");
            aTiletUserName.onclick = () => {
                areaSelect.style.display = "none";
                aTiletUserName.classList.add("pc_active");
                aTiletMobile.classList.remove("pc_active");
                aTilEtEmail.classList.remove("pc_active");
                iIshurushouji.classList.add("icon-my");
                iIshurushouji.classList.remove("icon-shurushouji", "icon-xinxi");
                this.inputAccount.value = "";
                this.inputPass.value = "";
                this.accountType = "user";
                this.inputAccount.placeholder = BlackCat.Main.langMgr.get("login_input" + this.accountType);
            };
            this.ObjAppend(divTitleobj, aTiletUserName);
            var aTiletMobile = this.objCreate("a");
            aTiletMobile.classList.add("pc_tiletmobile");
            aTiletMobile.textContent = BlackCat.Main.langMgr.get("main_phone");
            aTiletMobile.onclick = () => {
                areaSelect.style.display = "block";
                aTiletMobile.classList.add("pc_active");
                aTiletUserName.classList.remove("pc_active");
                aTilEtEmail.classList.remove("pc_active");
                iIshurushouji.classList.add("icon-shurushouji");
                iIshurushouji.classList.remove("icon-my", "icon-xinxi");
                this.inputAccount.value = "";
                this.inputPass.value = "";
                this.accountType = "phone";
                this.inputAccount.placeholder = BlackCat.Main.langMgr.get("login_input" + this.accountType);
            };
            this.ObjAppend(divTitleobj, aTiletMobile);
            var aTilEtEmail = this.objCreate("a");
            aTilEtEmail.textContent = BlackCat.Main.langMgr.get("main_email");
            aTilEtEmail.onclick = () => {
                areaSelect.style.display = "none";
                aTilEtEmail.classList.add("pc_active");
                aTiletUserName.classList.remove("pc_active");
                aTiletMobile.classList.remove("pc_active");
                iIshurushouji.classList.add("icon-xinxi");
                iIshurushouji.classList.remove("icon-my", "icon-shurushouji");
                this.inputAccount.value = "";
                this.inputPass.value = "";
                this.accountType = "email";
                this.inputAccount.placeholder = BlackCat.Main.langMgr.get("login_input" + this.accountType);
            };
            this.ObjAppend(divTitleobj, aTilEtEmail);
            var divInput = this.objCreate("div");
            divInput.classList.add("pc_login_input");
            this.ObjAppend(this.div, divInput);
            var areaSelect = this.objCreate("div");
            areaSelect.classList.add("pc_login_inputbox");
            areaSelect.style.display = "none";
            this.ObjAppend(divInput, areaSelect);
            var iRegion = this.objCreate("i");
            iRegion.classList.add("iconfont", "icon-diqiu");
            this.ObjAppend(areaSelect, iRegion);
            this.selectArea = this.objCreate("select");
            BlackCat.AreaView.areaInfo.forEach(area => {
                var option = this.objCreate("option");
                option.setAttribute("value", area.codename);
                option.textContent = BlackCat.Main.langMgr.get("area_code_" + area.codename);
                this.selectArea.options.add(option);
            });
            this.selectArea.onchange = () => {
                BlackCat.AreaView.areaInfo.forEach(area => {
                    if (area.codename == this.selectArea.value) {
                        this.divArea.textContent = area.areacode;
                    }
                });
            };
            this.ObjAppend(areaSelect, this.selectArea);
            this.divArea = this.objCreate("div");
            this.divArea.classList.add("pc_area");
            BlackCat.AreaView.areaInfo.forEach(area => {
                if (area.codename == this.selectArea.value) {
                    this.divArea.textContent = area.areacode;
                }
            });
            this.ObjAppend(areaSelect, this.divArea);
            var aArea = this.objCreate("a");
            aArea.classList.add("pc_areaa", "iconfont", "icon-xiala");
            this.ObjAppend(areaSelect, aArea);
            var divTel = this.objCreate("div");
            divTel.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divTel);
            var iIshurushouji = this.objCreate("i");
            iIshurushouji.classList.add("iconfont", "icon-my");
            this.ObjAppend(divTel, iIshurushouji);
            this.inputAccount = this.objCreate("input");
            this.inputAccount.type = "text";
            this.inputAccount.autocomplete = "off";
            this.inputAccount.placeholder = BlackCat.Main.langMgr.get("login_inputuser");
            this.ObjAppend(divTel, this.inputAccount);
            var divPass = this.objCreate("div");
            divPass.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divPass);
            var iPass = this.objCreate("i");
            iPass.classList.add("iconfont", "icon-mima");
            this.ObjAppend(divPass, iPass);
            this.inputPass = this.objCreate("input");
            this.inputPass.type = "password";
            this.inputPass.autocomplete = "off";
            this.inputPass.placeholder = BlackCat.Main.langMgr.get("login_inputPass");
            this.ObjAppend(divPass, this.inputPass);
            var divForgetPass = this.objCreate("div");
            divForgetPass.classList.add("pc_login_forgetpass");
            this.ObjAppend(divInput, divForgetPass);
            var aForgetPass = this.objCreate("a");
            aForgetPass.textContent = BlackCat.Main.langMgr.get("login_textForgetpass");
            aForgetPass.onclick = () => {
                this.remove();
                BlackCat.Main.viewMgr.change("ForgetPasswordView");
            };
            this.ObjAppend(divForgetPass, aForgetPass);
            var doLogin = this.objCreate("button");
            doLogin.classList.add("pc_doLogin");
            doLogin.textContent = BlackCat.Main.langMgr.get("login_doLogin");
            doLogin.onclick = () => {
                this.doLogin();
            };
            this.ObjAppend(divInput, doLogin);
            var doRegister = this.objCreate("button");
            doRegister.classList.add("pc_doregister");
            doRegister.textContent = BlackCat.Main.langMgr.get("login_doRegister");
            doRegister.onclick = () => {
                this.remove();
                BlackCat.Main.viewMgr.change("RegisterView");
            };
            this.ObjAppend(divInput, doRegister);
        }
        start() {
            super.start();
            this.inputAccount.focus();
        }
        getPhone() {
            return BlackCat.Main.getPhone(this.selectArea.value, this.inputAccount.value);
        }
        verifyAccount() {
            var account = this.inputAccount.value;
            if (!account || account.toString().length == 0) {
                return false;
            }
            return true;
        }
        verifyPass() {
            var pass = this.inputPass.value;
            if (!pass || pass.toString().length == 0) {
                return false;
            }
            return true;
        }
        doLogin() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.verifyAccount()) {
                    BlackCat.Main.showErrMsg("login_input" + this.accountType + "_err", () => {
                        this.inputAccount.focus();
                    });
                    return;
                }
                if ((yield BlackCat.Main.validateFormat(this.accountType, this.inputAccount)) == false) {
                    return;
                }
                if (!this.verifyPass()) {
                    BlackCat.Main.showErrMsg("login_inputPass_err", () => {
                        this.inputPass.focus();
                    });
                    return;
                }
                var res;
                switch (this.accountType) {
                    case 'email':
                        res = yield BlackCat.ApiTool.emailLoginPass(this.inputAccount.value, this.inputPass.value);
                        break;
                    case 'phone':
                        res = yield BlackCat.ApiTool.phoneLoginPass(this.getPhone(), this.inputPass.value);
                        break;
                    case 'user':
                        res = yield BlackCat.ApiTool.userLoginPass(this.inputAccount.value, this.inputPass.value);
                        break;
                    default:
                        return;
                }
                if (res.r) {
                    localStorage.setItem(BlackCat.Main.user.cacheKey, JSON.stringify(res.data));
                    BlackCat.Main.user.getInfo();
                    if (res.data.wallet) {
                        var wallet_file = yield BlackCat.ApiTool.getWalletFile(res.data.uid, res.data.token);
                        if (wallet_file.r) {
                            localStorage.setItem(res.data.wallet, wallet_file.data);
                            this.remove();
                            BlackCat.Main.viewMgr.change("PayView");
                        }
                        else {
                            BlackCat.Main.showErrMsg("login_walletDownloadFail");
                        }
                    }
                    else {
                        this.remove();
                        BlackCat.Main.viewMgr.change("WalletView");
                    }
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
    }
    BlackCat.LoginView = LoginView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class MainView extends BlackCat.ViewBase {
        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.bodyAppend(this.div);
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_window");
            this.div.style.display = "none";
            this.div.onclick = () => {
                event.stopPropagation();
                BlackCat.Main.setLiveTime();
            };
        }
        createMask() {
            if (!this.divMask) {
                BlackCat.Main.viewMgr.change("IconView");
                this.divMask = this.objCreate("div");
                this.divMask.classList.add("pc_window_mask");
                this.divMask.onclick = () => {
                    BlackCat.SDK.showIcon();
                };
                this.ObjAppend(this.div, this.divMask);
            }
        }
        changNetType() {
            switch (BlackCat.Main.netMgr.type) {
                case 1:
                    this.div.classList.remove("pc_windowtest2");
                    break;
                case 2:
                    this.div.classList.add("pc_windowtest2");
                    break;
            }
        }
        remove() {
            this.bodyRemove(this.div);
        }
        hidden() {
            this.div.classList.add("pc_windowhide");
            this.s_timeout_hidden = setTimeout(() => {
                this.div.style.display = "none";
            }, 300);
        }
        show() {
            if (this.s_timeout_hidden)
                clearTimeout(this.s_timeout_hidden);
            this.div.classList.remove("pc_windowhide");
            this.div.style.display = "";
        }
    }
    BlackCat.MainView = MainView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ModifyImgView extends BlackCat.ViewBase {
        constructor() {
            super();
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("modifyImg");
            this.ObjAppend(popupbox, popupTitle);
            var divImgBox = this.objCreate("div");
            divImgBox.classList.add("pc_modifyimg");
            this.ObjAppend(popupbox, divImgBox);
            this.divImg = this.objCreate("div");
            this.divImg.classList.add("pc_text_nowrap1");
            this.divImg.textContent = BlackCat.Main.langMgr.get("modifyImg_select");
            this.ObjAppend(divImgBox, this.divImg);
            this.inputImg = this.objCreate("input");
            this.inputImg.type = "file";
            this.inputImg.accept = "image/png,image/jpeg";
            this.inputImg.onchange = () => {
                this.changeInputImg();
            };
            this.ObjAppend(divImgBox, this.inputImg);
            this.displayImg = this.objCreate("img");
            this.ObjAppend(divImgBox, this.displayImg);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var confirmObj = this.objCreate("button");
            confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
            confirmObj.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, confirmObj);
        }
        toRefer() {
            if (BlackCat.ModifySexView.refer) {
                BlackCat.Main.viewMgr.change(BlackCat.ModifySexView.refer);
                BlackCat.ModifySexView.refer = null;
            }
        }
        changeInputImg() {
            return __awaiter(this, void 0, void 0, function* () {
                this.filename = "";
                this.reader = new FileReader();
                this.reader.onload = () => {
                    this.divImg.textContent = this.filename;
                    this.displayImg.src = this.reader.result;
                    this.displayImg.style.display = "inline-block";
                };
                if (this.inputImg.files[0] != undefined) {
                    if (this.inputImg.files[0].size >= 102400) {
                        BlackCat.Main.showToast("modifyImg_selectSize_err");
                        this.divImg.textContent = BlackCat.Main.langMgr.get("modifyImg_select");
                        this.filename = "";
                        this.displayImg.src = "";
                        this.displayImg.style.display = "none";
                        return;
                    }
                    var regex = /\.(jpg|png|jpeg)+$/;
                    var current = regex.test(this.inputImg.files[0].name);
                    if (!current) {
                        BlackCat.Main.showToast("modifyImg_selectType_err");
                        this.divImg.textContent = BlackCat.Main.langMgr.get("modifyImg_select");
                        this.filename = "";
                        this.displayImg.src = "";
                        this.displayImg.style.display = "none";
                        return;
                    }
                    if (this.inputImg.files && this.inputImg.files.length > 0) {
                        this.filename = this.inputImg.files[0].name;
                        this.reader.readAsDataURL(this.inputImg.files[0]);
                    }
                    else {
                        this.divImg.textContent = BlackCat.Main.langMgr.get("modifyImg_select");
                        this.filename = "";
                        this.displayImg.src = "";
                        this.displayImg.style.display = "none";
                    }
                }
                else {
                    this.divImg.textContent = BlackCat.Main.langMgr.get("modifyImg_select");
                    this.filename = "";
                    this.displayImg.src = "";
                    this.displayImg.style.display = "none";
                }
            });
        }
        doConfirm() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.inputImg.files[0] != undefined) {
                    if (this.inputImg.files[0].size >= 102400) {
                        BlackCat.Main.showToast("modifyImg_select_err");
                        return;
                    }
                    var regex = /\.(jpg|png|jpeg)+$/;
                    var current = regex.test(this.inputImg.files[0].name);
                    if (!current) {
                        BlackCat.Main.showToast("modifyImg_select_err");
                        return;
                    }
                    BlackCat.Main.viewMgr.change("ViewLoading");
                    try {
                        var res = yield BlackCat.ApiTool.modUserIcon(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, this.inputImg.files[0]);
                    }
                    catch (e) {
                        console.log('[Bla Cat]', '[ModifyImgView]', 'doConfirm, ApiTool.modUserIcon error => ', e.toString());
                    }
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    if (res.r) {
                        BlackCat.Main.showToast("modifyImg_succ");
                        BlackCat.Main.user.setInfo('icon', res.data);
                        this.remove();
                        if (ModifyImgView.callback) {
                            ModifyImgView.callback();
                            ModifyImgView.callback = null;
                        }
                    }
                    else {
                        BlackCat.Main.showErrCode(res.errCode);
                    }
                }
                else {
                    BlackCat.Main.showToast("modifyImg_select_err");
                }
            });
        }
    }
    BlackCat.ModifyImgView = ModifyImgView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ModifyNameView extends BlackCat.ViewBase {
        start() {
            super.start();
            this.inputName.focus();
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("modifyName");
            this.ObjAppend(popupbox, popupTitle);
            this.inputName = this.objCreate("input");
            this.inputName.type = "text";
            this.inputName.style.marginTop = "40px";
            this.inputName.placeholder = BlackCat.Main.langMgr.get("modifyName_input");
            this.ObjAppend(popupbox, this.inputName);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var confirmObj = this.objCreate("button");
            confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
            confirmObj.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, confirmObj);
        }
        toRefer() {
            if (ModifyNameView.refer) {
                BlackCat.Main.viewMgr.change(ModifyNameView.refer);
                ModifyNameView.refer = null;
            }
        }
        doConfirm() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.inputName.value) {
                    this.inputName.focus();
                    return;
                }
                var res = yield BlackCat.ApiTool.modUserName(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, this.inputName.value);
                if (res.r) {
                    BlackCat.Main.showToast("modifyName_succ");
                    BlackCat.Main.user.setInfo('name', this.inputName.value);
                    this.remove();
                    if (ModifyNameView.callback) {
                        ModifyNameView.callback();
                        ModifyNameView.callback = null;
                    }
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
    }
    BlackCat.ModifyNameView = ModifyNameView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ModifySexView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("modifySex");
            this.ObjAppend(popupbox, popupTitle);
            this.divSex = this.objCreate("div");
            this.divSex.classList.add("pc_modifysex");
            this.ObjAppend(popupbox, this.divSex);
            this.inputSex1Obj = this.objCreate("div");
            this.inputSex1Obj.classList.add("iconfont", "icon-nan1");
            this.ObjAppend(this.divSex, this.inputSex1Obj);
            var inputSex1 = this.objCreate("input");
            inputSex1.setAttribute("type", "radio");
            inputSex1.setAttribute("value", "1");
            inputSex1.setAttribute("name", "pc_sex");
            inputSex1.onclick = () => {
                this.inputSex1Obj.classList.add("pc_modifysex_active");
                this.inputSex2Obj.classList.remove("pc_modifysex_active");
            };
            if (BlackCat.Main.user.info.sex == "1") {
                inputSex1.setAttribute("checked", "true");
                this.inputSex1Obj.classList.add("pc_modifysex_active");
            }
            this.ObjAppend(this.inputSex1Obj, inputSex1);
            this.inputSex2Obj = this.objCreate("div");
            this.inputSex2Obj.classList.add("iconfont", "icon-nv1");
            this.ObjAppend(this.divSex, this.inputSex2Obj);
            var inputSex2 = this.objCreate("input");
            inputSex2.setAttribute("type", "radio");
            inputSex2.setAttribute("value", "2");
            inputSex2.setAttribute("name", "pc_sex");
            inputSex2.onclick = () => {
                this.inputSex2Obj.classList.add("pc_modifysex_active");
                this.inputSex1Obj.classList.remove("pc_modifysex_active");
            };
            if (BlackCat.Main.user.info.sex == "2") {
                inputSex2.setAttribute("checked", "true");
                this.inputSex2Obj.classList.add("pc_modifysex_active");
            }
            this.ObjAppend(this.inputSex2Obj, inputSex2);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var confirmObj = this.objCreate("button");
            confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
            confirmObj.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, confirmObj);
        }
        toRefer() {
            if (ModifySexView.refer) {
                BlackCat.Main.viewMgr.change(ModifySexView.refer);
                ModifySexView.refer = null;
            }
        }
        doConfirm() {
            return __awaiter(this, void 0, void 0, function* () {
                var sexInputObj = this.divSex.getElementsByTagName("input");
                for (var i = 0; i < sexInputObj.length; i++) {
                    if (sexInputObj[i].checked) {
                        var sexValue = sexInputObj[i].value;
                        var res = yield BlackCat.ApiTool.modUserSex(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, sexValue);
                        if (res.r) {
                            BlackCat.Main.showToast("modifySex_succ");
                            BlackCat.Main.user.setInfo('sex', sexValue);
                            this.remove();
                            if (ModifySexView.callback) {
                                ModifySexView.callback();
                                ModifySexView.callback = null;
                            }
                        }
                        else {
                            BlackCat.Main.showErrCode(res.errCode);
                        }
                        return sexValue;
                    }
                }
            });
        }
    }
    BlackCat.ModifySexView = ModifySexView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class MyInfoView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_myinfo");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("myInfo");
            this.ObjAppend(header, headerH1);
            var myinfo = this.objCreate("div");
            myinfo.classList.add("pc_myinfolist");
            var ulMyinfo = this.objCreate("ul");
            this.ObjAppend(myinfo, ulMyinfo);
            var liMyinfoImg = this.objCreate("li");
            liMyinfoImg.classList.add("pc_myinfoimg");
            liMyinfoImg.style.cursor = "pointer";
            liMyinfoImg.onclick = () => {
                this.modifyImg();
            };
            liMyinfoImg.textContent = BlackCat.Main.langMgr.get("myinfo_headImg");
            var iMyinfoimg = this.objCreate("i");
            iMyinfoimg.classList.add("iconfont", "icon-gengduo");
            this.ObjAppend(liMyinfoImg, iMyinfoimg);
            var spanMyinfoimg = this.objCreate("span");
            this.ObjAppend(liMyinfoImg, spanMyinfoimg);
            this.myImg = this.objCreate("img");
            this.myImg.setAttribute("src", this.getImg());
            this.ObjAppend(spanMyinfoimg, this.myImg);
            this.ObjAppend(ulMyinfo, liMyinfoImg);
            var liMyinfoName = this.objCreate("li");
            liMyinfoName.style.cursor = "pointer";
            liMyinfoName.textContent = BlackCat.Main.langMgr.get("myinfo_nickname");
            liMyinfoName.onclick = () => {
                this.modifyName();
            };
            this.ObjAppend(ulMyinfo, liMyinfoName);
            var iMyinfoName = this.objCreate("i");
            iMyinfoName.classList.add("iconfont", "icon-gengduo");
            this.ObjAppend(liMyinfoName, iMyinfoName);
            this.myName = this.objCreate("span");
            this.myName.textContent = this.getName();
            this.ObjAppend(liMyinfoName, this.myName);
            var liMyinfoSex = this.objCreate("li");
            liMyinfoSex.style.cursor = "pointer";
            liMyinfoSex.textContent = BlackCat.Main.langMgr.get("myinfo_sex");
            liMyinfoSex.onclick = () => {
                this.modifySex();
            };
            var iMyinfoSex = this.objCreate("i");
            iMyinfoSex.classList.add("iconfont", "icon-gengduo");
            this.ObjAppend(liMyinfoSex, iMyinfoSex);
            this.mySex = this.objCreate("span");
            this.mySex.textContent = this.getSex();
            this.ObjAppend(liMyinfoSex, this.mySex);
            this.ObjAppend(ulMyinfo, liMyinfoSex);
            var liMyinfoUid = this.objCreate("li");
            liMyinfoUid.textContent = BlackCat.Main.langMgr.get("myinfo_uid");
            this.ObjAppend(ulMyinfo, liMyinfoUid);
            var spanMyinfoUid = this.objCreate("span");
            spanMyinfoUid.textContent = this.getUid();
            this.ObjAppend(liMyinfoUid, spanMyinfoUid);
            var liMyinfoArea = this.objCreate("li");
            liMyinfoArea.textContent = BlackCat.Main.langMgr.get("myinfo_area");
            this.ObjAppend(ulMyinfo, liMyinfoArea);
            var spanMyinfoArea = this.objCreate("span");
            spanMyinfoArea.textContent = this.getArea();
            this.ObjAppend(liMyinfoArea, spanMyinfoArea);
            var liMyinfoTrust = this.objCreate("li");
            liMyinfoTrust.style.cursor = "pointer";
            liMyinfoTrust.textContent = BlackCat.Main.langMgr.get("myinfo_security");
            liMyinfoTrust.onclick = () => {
                this.hidden();
                BlackCat.Main.viewMgr.change("SecurityCenterView");
            };
            this.ObjAppend(ulMyinfo, liMyinfoTrust);
            var iMyinfoTrust = this.objCreate("i");
            iMyinfoTrust.classList.add("iconfont", "icon-gengduo");
            this.ObjAppend(liMyinfoTrust, iMyinfoTrust);
            var spanMyinfoTrust = this.objCreate("span");
            spanMyinfoTrust.textContent = BlackCat.Main.langMgr.get("myinfo_set");
            this.ObjAppend(liMyinfoTrust, spanMyinfoTrust);
            var logout = this.objCreate("button");
            logout.textContent = BlackCat.Main.langMgr.get("myinfo_logout");
            logout.onclick = () => {
                this.doLogout();
            };
            this.ObjAppend(myinfo, logout);
            this.ObjAppend(this.div, myinfo);
        }
        toRefer() {
            if (MyInfoView.refer) {
                BlackCat.Main.viewMgr.change(MyInfoView.refer);
                MyInfoView.refer = null;
            }
        }
        getImg() {
            return BlackCat.Main.user.info.icon ? BlackCat.Main.user.info.icon : BlackCat.Main.resHost + "res/img/game0.png";
        }
        getName() {
            return BlackCat.Main.user.info.name;
        }
        getUid() {
            return BlackCat.Main.user.info.uid;
        }
        getSex() {
            return BlackCat.Main.langMgr.get("myinfo_sex_" + BlackCat.Main.user.info.sex);
        }
        getArea() {
            return BlackCat.Main.langMgr.get("area_code_" + BlackCat.Main.user.info.region);
        }
        doLogout() {
            BlackCat.ViewConfirm.callback = () => {
                this.makeLogout();
            };
            BlackCat.Main.showConFirm("myinfo_logoutConfirm");
        }
        makeLogout() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.user.logout();
                BlackCat.Main.viewMgr.removeAll();
                BlackCat.Main.viewMgr.change("LoginView");
                BlackCat.Main.logoutCallback();
            });
        }
        modifyImg() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ModifyImgView.callback = () => {
                    this.myImg.src = this.getImg();
                };
                BlackCat.Main.viewMgr.change("ModifyImgView");
            });
        }
        modifyName() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ModifyNameView.callback = () => {
                    this.myName.textContent = this.getName();
                    BlackCat.Main.viewMgr.payView.payMyWallet.textContent = this.getName();
                };
                BlackCat.Main.viewMgr.change("ModifyNameView");
            });
        }
        modifySex() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ModifySexView.callback = () => {
                    this.mySex.textContent = this.getSex();
                };
                BlackCat.Main.viewMgr.change("ModifySexView");
            });
        }
    }
    BlackCat.MyInfoView = MyInfoView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayListDetailView extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!PayListDetailView.list) {
                PayListDetailView.list = new BlackCat.walletLists();
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_listdetail");
            if (PayListDetailView.list && PayListDetailView.list.hasOwnProperty("wallet")) {
                var headerObj = this.objCreate("div");
                headerObj.classList.add("pc_header");
                var returnBtn = this.objCreate("a");
                returnBtn.classList.add("iconfont", "icon-fanhui");
                returnBtn.textContent = BlackCat.Main.langMgr.get("return");
                returnBtn.onclick = () => {
                    this.return();
                };
                this.ObjAppend(headerObj, returnBtn);
                var h1Obj = this.objCreate("h1");
                h1Obj.textContent = BlackCat.Main.platName;
                this.ObjAppend(headerObj, h1Obj);
                this.ObjAppend(this.div, headerObj);
                var contentObj = this.objCreate("div");
                contentObj.classList.add("pc_detail");
                contentObj.innerHTML
                    = '<ul>'
                        + '<li>'
                        + '<div class="pc_listimg">'
                        + '<img src="' + BlackCat.Main.viewMgr.payView.getListImg(PayListDetailView.list) + '">'
                        + '</div>'
                        + '<div class="pc_liftinfo">'
                        + '<div class="pc_listname">' + BlackCat.Main.viewMgr.payView.getListName(PayListDetailView.list) + '</div>'
                        + '<span class="pc_listdate">' + BlackCat.Main.viewMgr.payView.getListCtm(PayListDetailView.list) + '</span>'
                        + '</div>'
                        + '<div class="pc_cnts ' + BlackCat.Main.viewMgr.payView.getListCntsClass(PayListDetailView.list) + ' "><span>'
                        + this.getCnts()
                        + '</span>'
                        + BlackCat.Main.viewMgr.payView.getListState(PayListDetailView.list).outerHTML
                        + '</div>'
                        + '</li>'
                        + '<li><label>' + BlackCat.Main.langMgr.get("paylist_txid") + '</label><p>' + this.getTxid() + '</p></li>'
                        + '<li><label>' + BlackCat.Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                        + this.getParams()
                        + '</ul>';
                this.ObjAppend(this.div, contentObj);
            }
        }
        toRefer() {
            if (PayListDetailView.refer) {
                BlackCat.Main.viewMgr.change(PayListDetailView.refer);
                PayListDetailView.refer = null;
            }
        }
        getCnts() {
            return PayListDetailView.list.cnts;
        }
        getTxid() {
            return PayListDetailView.list.txid;
        }
        getWallet() {
            return PayListDetailView.list.wallet;
        }
        getParams() {
            var html = "";
            var params = PayListDetailView.list.params;
            if (params) {
                try {
                    params = JSON.parse(params);
                    if (params.hasOwnProperty("nnc")) {
                        params = [params];
                    }
                    if (params instanceof Array) {
                        if (PayListDetailView.list.type == "6") {
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("pay_transferGas_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("pay_transferGas_count") + '</label><p>' + params[k].count + '</p></div>'
                                    + '</li>';
                            }
                        }
                        else {
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("paylist_nnc") + '</label><p>' + params[k].nnc + '</p></div>'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbParamJson") + '</label><p>' + params[k].sbParamJson + '</p></div>'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbPushString") + '</label><p>' + params[k].sbPushString + '</p></div>'
                                    + '</li>';
                            }
                        }
                    }
                }
                catch (e) {
                    console.log('[Bla Cat]', '[PayListDetailView]', 'getParams error => ', e.toString());
                }
            }
            return html;
        }
    }
    BlackCat.PayListDetailView = PayListDetailView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayListMoreView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.page = 1;
            this.num = BlackCat.Main.viewMgr.payView.listPageNum;
            this.isLast = false;
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_paylist");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.platName;
            this.ObjAppend(header, headerH1);
            this.listsDiv = this.objCreate("ul");
            this.ObjAppend(this.div, this.listsDiv);
            this.getMoreDiv = this.objCreate("div");
            this.getMoreDiv.classList.add("pc_listmore");
            this.getMoreDiv.onclick = () => {
                this.doGetWalletLists();
            };
            this.ObjAppend(this.div, this.getMoreDiv);
            this.doGetWalletLists();
        }
        remove() {
            super.remove();
            this.reset();
        }
        toRefer() {
            BlackCat.Main.viewMgr.change("PayView");
        }
        reset() {
            this.page = 1;
            this.isLast = false;
        }
        doGetWalletLists() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isLast) {
                    return;
                }
                var res = yield BlackCat.ApiTool.getWalletListss(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, this.page, this.num, BlackCat.Main.netMgr.type);
                if (res.r) {
                    if (res.data && res.data.length >= 1) {
                        if (res.data.length < this.num) {
                            this.isLast = true;
                            this.getMoreDiv.textContent = BlackCat.Main.langMgr.get("paylist_noMore");
                        }
                        else {
                            this.page += 1;
                            this.getMoreDiv.textContent = BlackCat.Main.langMgr.get("paylist_getMore");
                        }
                        yield res.data.forEach(list => {
                            var listObj = this.objCreate("li");
                            listObj.onclick = () => {
                                this.hidden();
                                BlackCat.PayListDetailView.refer = "PayListMoreView";
                                BlackCat.PayListDetailView.list = list;
                                BlackCat.Main.viewMgr.change("PayListDetailView");
                            };
                            var img_div = this.objCreate("div");
                            img_div.classList.add("pc_listimg");
                            var img = this.objCreate("img");
                            img.src = BlackCat.Main.viewMgr.payView.getListImg(list);
                            this.ObjAppend(img_div, img);
                            this.ObjAppend(listObj, img_div);
                            var content_div = this.objCreate("div");
                            content_div.classList.add("pc_liftinfo");
                            var content_name_div = this.objCreate("div");
                            content_name_div.classList.add("pc_listname");
                            content_name_div.textContent = BlackCat.Main.viewMgr.payView.getListName(list);
                            this.ObjAppend(content_div, content_name_div);
                            var content_ctm_p = this.objCreate("p");
                            content_ctm_p.classList.add("pc_method");
                            content_ctm_p.textContent = BlackCat.Main.viewMgr.payView.getListParamMethods(list);
                            this.ObjAppend(content_div, content_ctm_p);
                            this.ObjAppend(listObj, content_div);
                            var state_cnts_div = this.objCreate("div");
                            state_cnts_div.classList.add("pc_cnts");
                            var content_ctm_span = this.objCreate("div");
                            content_ctm_span.classList.add("pc_listdate");
                            content_ctm_span.textContent = BlackCat.Main.viewMgr.payView.getListCtmMsg(list);
                            this.ObjAppend(state_cnts_div, content_ctm_span);
                            var cnts = BlackCat.Main.viewMgr.payView.getListCnts(list);
                            if (cnts) {
                                this.ObjAppend(state_cnts_div, cnts);
                                var cnts_class = BlackCat.Main.viewMgr.payView.getListCntsClass(list);
                                if (cnts_class)
                                    state_cnts_div.classList.add(cnts_class);
                            }
                            var state = BlackCat.Main.viewMgr.payView.getListState(list);
                            if (state)
                                this.ObjAppend(state_cnts_div, state);
                            this.ObjAppend(listObj, state_cnts_div);
                            this.ObjAppend(this.listsDiv, listObj);
                        });
                    }
                    else {
                        this.getMoreDiv.textContent = BlackCat.Main.langMgr.get("paylist_noRecord");
                    }
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
    }
    BlackCat.PayListMoreView = PayListMoreView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayReceivablesView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_maillist");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("pay_received");
            this.ObjAppend(header, headerH1);
            var divObj = this.objCreate("div");
            divObj.classList.add("pc_qrcode");
            divObj.style.marginTop = "100px";
            this.ObjAppend(this.div, divObj);
            var qrObj = this.objCreate("img");
            QrCodeWithLogo.toImage({
                image: qrObj,
                content: BlackCat.Main.user.info.wallet
            }).then(() => {
                var url = URL.createObjectURL(this.base64ToBlob(qrObj.src));
                qr_download.setAttribute('href', url);
                qr_download.setAttribute("download", BlackCat.Main.user.info.wallet + ".png");
            });
            this.ObjAppend(divObj, qrObj);
            var qr_download = this.objCreate("a");
            qr_download.classList.add("iconfont", "icon-xiazai");
            qr_download.textContent = BlackCat.Main.langMgr.get("pc_receivables_download");
            this.ObjAppend(divObj, qr_download);
            this.divAddress = this.objCreate("div");
            this.divAddress.classList.add("pc_receivables");
            this.divAddress.textContent = BlackCat.Main.user.info.wallet;
            this.ObjAppend(divObj, this.divAddress);
            var butCopy = this.objCreate("button");
            butCopy.classList.add("pc_receivablescopy");
            butCopy.textContent = BlackCat.Main.langMgr.get("copy");
            butCopy.onclick = () => {
                var inputCooy = this.objCreate("input");
                inputCooy.value = this.divAddress.innerText;
                this.ObjAppend(divObj, inputCooy);
                inputCooy.select();
                document.execCommand("Copy");
                inputCooy.remove();
                BlackCat.Main.showToast("pc_receivables_copy", 1500);
            };
            this.ObjAppend(divObj, butCopy);
        }
        toRefer() {
            if (PayReceivablesView.refer) {
                BlackCat.Main.viewMgr.change(PayReceivablesView.refer);
                PayReceivablesView.refer = null;
            }
        }
        base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        }
    }
    BlackCat.PayReceivablesView = PayReceivablesView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayTransferView extends BlackCat.ViewBase {
        reset() {
            this.gasBalance = '0';
            this.toaddress = "";
        }
        start() {
            this.gasBalance = BlackCat.Main.viewMgr.payView.gas.toString();
            var balanceAmount = BlackCat.Main.viewMgr.payView.gas.toString();
            if (balanceAmount.toString().indexOf('-') >= 0) {
                balanceAmount = '0' + String(Number(balanceAmount) + 1).substr(1);
            }
            this.gasBalance = balanceAmount;
            super.start();
            if (!this.toaddress) {
                this.inputTransferAddr.focus();
            }
            else {
                this.inputGasCount.focus();
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox", "pc_transfer");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("pay_transfer");
            this.ObjAppend(popupbox, popupTitle);
            var divtransfer = this.objCreate("div");
            divtransfer.classList.add("pc_transferbox");
            this.ObjAppend(popupbox, divtransfer);
            var divtransfertype = this.objCreate("div");
            divtransfertype.classList.add("pc_transfertype");
            this.ObjAppend(divtransfer, divtransfertype);
            var gasBalancetype = this.objCreate("label");
            gasBalancetype.innerHTML = BlackCat.Main.langMgr.get("pay_transferType");
            this.ObjAppend(divtransfertype, gasBalancetype);
            var gasBalanceObj = this.objCreate("span");
            gasBalanceObj.classList.add("pc_fr");
            gasBalanceObj.textContent = BlackCat.Main.langMgr.get("pay_transferBalance") + this.gasBalance;
            this.ObjAppend(divtransfertype, gasBalanceObj);
            this.divTransferAddr = this.objCreate("div");
            this.divTransferAddr.classList.add("pc_transfertype");
            this.ObjAppend(divtransfer, this.divTransferAddr);
            this.labelName = this.objCreate("label");
            this.labelName.classList.add("pc_transfername");
            this.ObjAppend(this.divTransferAddr, this.labelName);
            this.inputTransferAddr = this.objCreate("input");
            this.inputTransferAddr.classList.add("pc_transaddress");
            this.inputTransferAddr.placeholder = BlackCat.Main.langMgr.get("pay_transferToAddr");
            this.inputTransferAddr.value = this.getAddress();
            this.inputTransferAddr.onfocus = () => {
                this.inputTransferAddr.select();
            };
            this.inputTransferAddr.onchange = () => {
                this.divTransferAddr.classList.remove("pc_transfer_active");
                this.inputTransferAddr.style.padding = "0 35px 0 5px";
                this.inputTransferAddr.style.width = "230px";
            };
            this.ObjAppend(this.divTransferAddr, this.inputTransferAddr);
            var aAddresbook = this.objCreate("a");
            aAddresbook.classList.add("pc_transferaddressbook", "iconfont", "icon-tongxunlu");
            aAddresbook.onclick = () => {
                this.hidden();
                BlackCat.Main.viewMgr.payView.hidden();
                BlackCat.AddressbookView.select = "select";
                BlackCat.Main.viewMgr.change("AddressbookView");
            };
            this.ObjAppend(this.divTransferAddr, aAddresbook);
            var divGasCount = this.objCreate("div");
            divGasCount.classList.add("pc_transfertype");
            this.ObjAppend(divtransfer, divGasCount);
            this.inputGasCount = this.objCreate("input");
            this.inputGasCount.placeholder = BlackCat.Main.langMgr.get("pay_transferCount");
            this.ObjAppend(divGasCount, this.inputGasCount);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var transferObj = this.objCreate("button");
            transferObj.textContent = BlackCat.Main.langMgr.get("ok");
            transferObj.onclick = () => {
                this.doTransfer();
            };
            this.ObjAppend(popupbutbox, transferObj);
        }
        toRefer() {
            if (PayTransferView.refer) {
                BlackCat.Main.viewMgr.change(PayTransferView.refer);
                PayTransferView.refer = null;
            }
        }
        getAddress() {
            if (PayTransferView.address) {
                this.toaddress = PayTransferView.address;
                PayTransferView.address = "";
            }
            return this.toaddress;
        }
        gatSelect() {
            this.divTransferAddr.classList.add("pc_transfer_active");
            this.labelName.textContent = PayTransferView.contact.address_name + ":";
            this.inputTransferAddr.value = PayTransferView.contact.address_wallet;
            var labelNameW = this.labelName.clientWidth + 10;
            var inputTransferAddrw = 270 - labelNameW - 35;
            this.inputTransferAddr.style.width = inputTransferAddrw + "px";
            this.inputTransferAddr.style.padding = "0 35px 0 " + labelNameW + "px";
            if (this.labelName) {
                this.inputGasCount.focus();
            }
        }
        doTransfer() {
            return __awaiter(this, void 0, void 0, function* () {
                var wallet_res = yield BlackCat.Main.validateFormat("walletaddr", this.inputTransferAddr);
                if (wallet_res === false) {
                    return;
                }
                else if (wallet_res !== true) {
                    this.toaddress = wallet_res;
                }
                else {
                    this.toaddress = this.inputTransferAddr.value;
                }
                if (!BlackCat.Main.viewMgr.payView.checkTransCount(this.inputGasCount.value)) {
                    BlackCat.Main.showErrMsg("pay_transferCountError", () => {
                        this.inputGasCount.focus();
                    });
                    return;
                }
                BlackCat.Main.viewMgr.change("ViewLoading");
                try {
                    var res = yield BlackCat.tools.CoinTool.rawTransaction(this.toaddress, BlackCat.tools.CoinTool.id_GAS, this.inputGasCount.value);
                }
                catch (e) {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = e.toString();
                    console.log('[Bla Cat]', '[PayTransferView]', 'doTransfer, tools.CoinTool.rawTransaction error => ', e.toString());
                }
                BlackCat.Main.viewMgr.viewLoading.remove();
                if (res) {
                    console.log('[Bla Cat]', '[PayTransferView]', 'gas转账结果 => ', res);
                    if (res.err == false) {
                        yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, res.info, "0", this.inputGasCount.value, "6", '{"sbPushString":"transfer", "toaddr":"' + this.toaddress + '", "count": "' + this.inputGasCount.value + '"}', BlackCat.Main.netMgr.type);
                        BlackCat.Main.showInfo(("pay_transferDoSucc"));
                        this.remove();
                        PayTransferView.callback();
                        PayTransferView.callback = null;
                    }
                    else {
                        BlackCat.Main.showErrMsg(("pay_transferDoFail"));
                    }
                }
                else {
                    BlackCat.Main.showErrMsg(("pay_transferDoFail"));
                }
            });
        }
    }
    PayTransferView.address = "";
    BlackCat.PayTransferView = PayTransferView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayView extends BlackCat.ViewBase {
        reset() {
            this.gas = 0;
            this.sgas = 0;
            this.listPageNum = 10;
            this.getWalletListsTimeout = 3000;
            this.WalletListsNeedConfirm = false;
            this.WalletListsHashString = "";
            this.walletListsNeedConfirmCounts = 0;
            this.clearTimeout();
        }
        start() {
            super.start();
            BlackCat.Main.loginCallback();
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_pay");
            var headerTitle = this.objCreate("div");
            headerTitle.classList.add("pc_header");
            this.ObjAppend(this.div, headerTitle);
            var myinfo_a = this.objCreate("a");
            myinfo_a.classList.add("iconfont", "icon-touxiang");
            myinfo_a.onclick = () => {
                this.hidden();
                BlackCat.MyInfoView.refer = "PayView";
                BlackCat.Main.viewMgr.change("MyInfoView");
            };
            this.ObjAppend(headerTitle, myinfo_a);
            var headerh1 = this.objCreate("h1");
            headerh1.textContent = BlackCat.Main.platName;
            this.ObjAppend(headerTitle, headerh1);
            var divNetType = this.objCreate("div");
            divNetType.classList.add("pc_net", "iconfont");
            divNetType.textContent = this.getNetTypeName();
            divNetType.onclick = () => {
                this.showChangeNetType();
            };
            this.ObjAppend(headerTitle, divNetType);
            this.divNetSelect = this.objCreate("div");
            this.divNetSelect.classList.add("pc_netbox");
            this.ObjAppend(headerTitle, this.divNetSelect);
            var aReturnGame = this.objCreate("i");
            aReturnGame.classList.add("pc_returngame", "iconfont", "icon-fanhui1");
            aReturnGame.onclick = () => {
                BlackCat.SDK.showIcon();
            };
            this.ObjAppend(headerTitle, aReturnGame);
            var paycard = this.objCreate("div");
            paycard.classList.add("pc_card");
            this.ObjAppend(this.div, paycard);
            var aWalletDetail = this.objCreate("a");
            aWalletDetail.classList.add("pc_mydetail", "iconfont", "icon-xiangqing");
            aWalletDetail.onclick = () => {
                this.wallet_detail();
            };
            this.ObjAppend(paycard, aWalletDetail);
            var payAddressbook = this.objCreate("a");
            payAddressbook.classList.add("pc_mydetail", "iconfont", "icon-tongxunlu");
            payAddressbook.onclick = () => {
                this.hidden();
                BlackCat.AddressbookView.refer = "PayView";
                BlackCat.Main.viewMgr.change("AddressbookView");
            };
            this.ObjAppend(paycard, payAddressbook);
            var divWallet = this.objCreate("div");
            divWallet.classList.add("pc_cardcon");
            divWallet.textContent = BlackCat.Main.user.info.wallet.substr(0, 4) + "****" + BlackCat.Main.user.info.wallet.substr(BlackCat.Main.user.info.wallet.length - 4);
            this.ObjAppend(paycard, divWallet);
            var payRefresh = this.objCreate("div");
            payRefresh.classList.add("pc_cardrefresh");
            payRefresh.textContent = BlackCat.Main.langMgr.get("pay_refresh");
            payRefresh.onclick = () => {
                this.doGetBalances();
                this.doGetWalletLists();
            };
            this.ObjAppend(paycard, payRefresh);
            var iRefresh = this.objCreate("i");
            iRefresh.classList.add("iconfont", "icon-shuaxin");
            this.ObjAppend(payRefresh, iRefresh);
            var divWalletUser = this.objCreate("div");
            divWalletUser.classList.add("pc_cardtransaction");
            this.ObjAppend(paycard, divWalletUser);
            var butReceivables = this.objCreate("button");
            butReceivables.textContent = BlackCat.Main.langMgr.get("pay_received");
            butReceivables.onclick = () => {
                this.doMakeReceivables();
            };
            this.ObjAppend(divWalletUser, butReceivables);
            var makeTransferObj = this.objCreate("button");
            makeTransferObj.textContent = BlackCat.Main.langMgr.get("pay_transfer");
            makeTransferObj.onclick = () => {
                this.doMakeTransfer();
            };
            this.ObjAppend(divWalletUser, makeTransferObj);
            var divCurrency = this.objCreate("div");
            divCurrency.classList.add("pc_currency");
            this.ObjAppend(this.div, divCurrency);
            var divCurrencyNumber = this.objCreate("div");
            divCurrencyNumber.classList.add("pc_currencynumber");
            this.ObjAppend(divCurrency, divCurrencyNumber);
            var spanCurrencyNumber = this.objCreate("div");
            spanCurrencyNumber.innerText = BlackCat.Main.langMgr.get("pay_coin_name");
            this.ObjAppend(divCurrencyNumber, spanCurrencyNumber);
            if (BlackCat.tools.CoinTool.id_SGAS_OLD && BlackCat.tools.CoinTool.id_SGAS_OLD.length > 0) {
                var bntCurrencyNumber = this.objCreate("button");
                bntCurrencyNumber.textContent = BlackCat.Main.langMgr.get("pay_coin_old");
                bntCurrencyNumber.onclick = () => {
                    this.doMakeRefundOld();
                };
                this.ObjAppend(divCurrencyNumber, bntCurrencyNumber);
            }
            var divGas = this.objCreate("div");
            divGas.innerHTML = BlackCat.Main.langMgr.get("pay_gas");
            this.ObjAppend(divCurrency, divGas);
            var labelGas = this.objCreate("label");
            labelGas.classList.add("iconfont", "icon-help");
            this.ObjAppend(divGas, labelGas);
            this.spanGas = this.objCreate("span");
            this.spanGas.textContent = "0";
            this.ObjAppend(divGas, this.spanGas);
            var divSGascon = this.objCreate("div");
            divSGascon.classList.add("pc_sgascon");
            divSGascon.textContent = BlackCat.Main.langMgr.get("pay_gas_desc");
            this.ObjAppend(labelGas, divSGascon);
            var divSGas = this.objCreate("div");
            divSGas.innerHTML = BlackCat.Main.langMgr.get("pay_sgas");
            this.ObjAppend(divCurrency, divSGas);
            var labelSGas = this.objCreate("label");
            labelSGas.classList.add("iconfont", "icon-help");
            this.ObjAppend(divSGas, labelSGas);
            this.spanSgas = this.objCreate("span");
            this.spanSgas.textContent = "0";
            this.ObjAppend(divSGas, this.spanSgas);
            var divSGascon = this.objCreate("div");
            divSGascon.classList.add("pc_sgascon");
            divSGascon.textContent = BlackCat.Main.langMgr.get("pay_sgas_desc");
            this.ObjAppend(labelSGas, divSGascon);
            var makeRefundObj = this.objCreate("button");
            makeRefundObj.textContent = BlackCat.Main.langMgr.get("pay_refund");
            makeRefundObj.onclick = () => {
                this.doMakeRefund();
            };
            this.ObjAppend(divGas, makeRefundObj);
            var makeMintTokenObj = this.objCreate("button");
            makeMintTokenObj.textContent = BlackCat.Main.langMgr.get("pay_makeMint");
            makeMintTokenObj.onclick = () => {
                this.doMakeMintToken();
            };
            this.ObjAppend(divSGas, makeMintTokenObj);
            this.divLists = this.objCreate("ul");
            this.divLists.classList.add("pc_paylists");
            this.ObjAppend(this.div, this.divLists);
            this.doGetBalances();
            this.doGetWalletLists();
        }
        update() {
            var isHidden = this.isHidden();
            this.reset();
            super.update();
            if (isHidden)
                this.hidden();
        }
        clearTimeout() {
            if (this.s_doGetWalletLists)
                clearTimeout(this.s_doGetWalletLists);
        }
        doGetBalances() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.tools.CoinTool.initAllAsset();
                var balances = (yield BlackCat.tools.WWW.api_getBalance(BlackCat.Main.user.info.wallet));
                var nep5balances = yield BlackCat.tools.WWW.api_getnep5balanceofaddress(BlackCat.tools.CoinTool.id_SGAS, BlackCat.Main.user.info.wallet);
                if (balances) {
                    balances.map(item => (item.names = BlackCat.tools.CoinTool.assetID2name[item.asset]));
                    yield balances.forEach(balance => {
                        if (balance.asset == BlackCat.tools.CoinTool.id_GAS) {
                            this.gas = balance.balance;
                            var balanceAmount = balance.balance.toString();
                            if (balanceAmount.toString().indexOf('-') >= 0) {
                                balanceAmount = '0' + String(Number(balanceAmount) + 1).substr(1);
                            }
                            this.spanGas.textContent = balanceAmount;
                        }
                    });
                }
                else {
                    this.gas = 0;
                    this.spanGas.textContent = "0";
                }
                if (nep5balances) {
                    this.sgas = nep5balances[0]['nep5balance'];
                    this.spanSgas.textContent = nep5balances[0]['nep5balance'].toString();
                }
                else {
                    this.sgas = 0;
                    this.spanSgas.textContent = "0";
                }
            });
        }
        doMakeRefundOld() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    let id_SGAS = BlackCat.tools.CoinTool.id_SGAS_OLD[0];
                    let id_SGAS_balance = "0";
                    let id_SGAS_balances = yield BlackCat.tools.WWW.api_getnep5balanceofaddress(id_SGAS, BlackCat.Main.user.info.wallet);
                    if (id_SGAS_balances) {
                        id_SGAS_balance = id_SGAS_balances[0]['nep5balance'].toString();
                    }
                    BlackCat.ViewTransCount.transType = "old";
                    BlackCat.ViewTransCount.transBalances = id_SGAS_balance;
                    BlackCat.ViewTransCount.refer = "PayView";
                    BlackCat.ViewTransCount.callback = () => {
                        this.makeRefundTransaction(id_SGAS);
                    };
                    BlackCat.Main.viewMgr.change("ViewTransCount");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doMakeRefundOld();
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        doMakeMintToken() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.ViewTransCount.transType = "gas2sgas";
                    BlackCat.ViewTransCount.refer = "PayView";
                    BlackCat.ViewTransCount.callback = () => {
                        this.makeMintTokenTransaction();
                    };
                    BlackCat.Main.viewMgr.change("ViewTransCount");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doMakeMintToken();
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        doMakeRefund() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.ViewTransCount.transType = "sgas2gas";
                    BlackCat.ViewTransCount.refer = "PayView";
                    BlackCat.ViewTransCount.callback = () => {
                        this.makeRefundTransaction();
                    };
                    BlackCat.Main.viewMgr.change("ViewTransCount");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doMakeRefund();
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        divLists_recreate() {
            this.divLists.innerHTML = "";
            var liRecord = this.objCreate("li");
            liRecord.classList.add("pc_payrecord");
            this.ObjAppend(this.divLists, liRecord);
            var spanRecord = this.objCreate("div");
            spanRecord.innerText = BlackCat.Main.langMgr.get("pay_recentLists");
            this.ObjAppend(liRecord, spanRecord);
            this.divListsMore = this.objCreate("button");
            this.divListsMore.classList.add("pc_paymore");
            this.divListsMore.textContent = BlackCat.Main.langMgr.get("more");
            this.divListsMore.onclick = () => {
                this.hidden();
                BlackCat.Main.viewMgr.change("PayListMoreView");
            };
            this.divListsMore.style.display = "none";
            this.ObjAppend(liRecord, this.divListsMore);
            var iListsMore = this.objCreate("i");
            iListsMore.classList.add("iconfont", "icon-sanjiaoxing");
            this.ObjAppend(this.divListsMore, iListsMore);
        }
        doGetWalletLists(force = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, force => ', force);
                if (!BlackCat.Main.user.info.token) {
                    console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 已退出登录，本次请求取消');
                    return;
                }
                if (force == 0 && this.WalletListsNeedConfirm) {
                    console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 有定时刷新，本次请求取消');
                    return;
                }
                if (this.s_doGetWalletLists) {
                    clearTimeout(this.s_doGetWalletLists);
                    this.s_doGetWalletLists = null;
                }
                var res = yield BlackCat.ApiTool.getWalletListss(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, 1, this.listPageNum, BlackCat.Main.netMgr.type);
                if (res.r) {
                    if (res.data && res.data.length > 0) {
                        BlackCat.Main.walletLogId = Number(res.data[0].id);
                        if (BlackCat.Main.walletLogId < BlackCat.Main.appWalletLogId || BlackCat.Main.walletLogId < BlackCat.Main.platWalletLogId) {
                            console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 钱包记录要重新获取 ..');
                            this.doGetWalletLists(1);
                            return;
                        }
                        var hasNeedConfirm = false;
                        this.walletListsNeedConfirmCounts = 0;
                        yield res.data.forEach(list => {
                            if (list.state == '0') {
                                hasNeedConfirm = true;
                                this.walletListsNeedConfirmCounts += 1;
                            }
                            else if (list.type == "2") {
                                if (list.client_notify == "0") {
                                    this.walletListsNeedConfirmCounts += 1;
                                }
                            }
                        });
                        this.WalletListsNeedConfirm = hasNeedConfirm;
                        BlackCat.Main.viewMgr.iconView.flushProcess(this.walletListsNeedConfirmCounts);
                        if (this.WalletListsNeedConfirm) {
                            console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 有待确认交易，轮询查询');
                            this.s_doGetWalletLists = setTimeout(() => { this.doGetWalletLists(1); }, this.getWalletListsTimeout);
                        }
                        var WalletListsHashString_tmp = JSON.stringify(res.data);
                        if (WalletListsHashString_tmp == this.WalletListsHashString) {
                            console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 交易记录没有更新 ..');
                            return;
                        }
                        console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 交易记录有更新');
                        var isFirstShow = false;
                        if (this.WalletListsHashString == "") {
                            isFirstShow = true;
                        }
                        this.WalletListsHashString = WalletListsHashString_tmp;
                        if (!isFirstShow) {
                            console.log('[Bla Cat]', '[PayView]', 'doGetWalletLists, 交易记录有更新，刷新余额');
                            this.doGetBalances();
                        }
                        this.divLists_recreate();
                        if (res.data && res.data.length == this.listPageNum) {
                            this.divListsMore.style.display = "";
                        }
                        yield res.data.forEach(list => {
                            var listObj = this.objCreate("li");
                            listObj.onclick = () => {
                                this.hidden();
                                BlackCat.PayListDetailView.refer = "PayView";
                                BlackCat.PayListDetailView.list = list;
                                BlackCat.Main.viewMgr.change("PayListDetailView");
                            };
                            var img_div = this.objCreate("div");
                            img_div.classList.add("pc_listimg");
                            var img = this.objCreate("img");
                            img.src = this.getListImg(list);
                            this.ObjAppend(img_div, img);
                            this.ObjAppend(listObj, img_div);
                            var content_div = this.objCreate("div");
                            content_div.classList.add("pc_liftinfo");
                            var content_name_div = this.objCreate("div");
                            content_name_div.classList.add("pc_listname");
                            content_name_div.textContent = this.getListName(list);
                            this.ObjAppend(content_div, content_name_div);
                            var content_ctm_p = this.objCreate("p");
                            content_ctm_p.classList.add("pc_method");
                            content_ctm_p.textContent = this.getListParamMethods(list);
                            this.ObjAppend(content_div, content_ctm_p);
                            this.ObjAppend(listObj, content_div);
                            var state_cnts_div = this.objCreate("div");
                            state_cnts_div.classList.add("pc_cnts");
                            var content_ctm_span = this.objCreate("div");
                            content_ctm_span.classList.add("pc_listdate", "listCtm");
                            content_ctm_span.textContent = this.getListCtmMsg(list);
                            content_ctm_span.setAttribute("ctm", list.ctm);
                            this.ObjAppend(state_cnts_div, content_ctm_span);
                            var cnts = this.getListCnts(list);
                            if (cnts) {
                                this.ObjAppend(state_cnts_div, cnts);
                                var cnts_class = this.getListCntsClass(list);
                                if (cnts_class)
                                    state_cnts_div.classList.add(cnts_class);
                            }
                            var state = this.getListState(list);
                            if (state)
                                this.ObjAppend(state_cnts_div, state);
                            this.ObjAppend(listObj, state_cnts_div);
                            this.ObjAppend(this.divLists, listObj);
                        });
                    }
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        getListImg(v) {
            if (v.state == "0") {
                return BlackCat.Main.resHost + "res/img/transconfirm.png";
            }
            switch (v.type) {
                case "1":
                case "2":
                case "3":
                case "4":
                    return BlackCat.Main.resHost + "res/img/sgas.png";
                case "5":
                    try {
                        var params = JSON.parse(v.params);
                        if (params.hasOwnProperty("nnc")) {
                            params = [params];
                        }
                        if (params instanceof Array) {
                            var nncs = new Array();
                            for (let k in params) {
                                if (params[k].hasOwnProperty('nnc') && params[k].nnc == BlackCat.tools.CoinTool.id_SGAS) {
                                    return BlackCat.Main.resHost + "res/img/sgas.png";
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log('[Bla Cat]', '[PayView]', 'getListImg, v.type=5, error => ', e);
                    }
                    return v.icon;
                case "6":
                    return BlackCat.Main.resHost + "res/img/gas.png";
                default:
                    return BlackCat.Main.resHost + "res/img/game0.png";
            }
        }
        getListName(v) {
            if (v.g_id == "0") {
                return BlackCat.Main.platName;
            }
            else {
                try {
                    var nameObj = JSON.parse(v.name);
                    if (nameObj.hasOwnProperty(BlackCat.Main.langMgr.type)) {
                        return nameObj[BlackCat.Main.langMgr.type];
                    }
                    else if (nameObj.hasOwnProperty("cn")) {
                        return nameObj.cn;
                    }
                }
                catch (e) {
                    console.log('[Bla Cat]', '[PayView]', 'getListName, v', v, 'error => ', e.toString());
                }
            }
            return v.name;
        }
        getListCtm(v) {
            return BlackCat.Main.getDate(v.ctm);
        }
        getListCtmMsg(v) {
            var str = "";
            var timestamp = (new Date()).getTime();
            var ts = Math.round(timestamp / 1000);
            var last = ts - Number(v.ctm);
            var year = 60 * 60 * 24 * 365;
            var month = 60 * 60 * 24 * 30;
            var day = 60 * 60 * 24;
            var hour = 60 * 60;
            var minute = 60;
            if (last >= year) {
                var n = Math.floor(last / year);
                return BlackCat.Main.langMgr.get("paylist_ctm_year", { "year": n });
            }
            else if (last >= month) {
                var n = Math.floor(last / month);
                return BlackCat.Main.langMgr.get("paylist_ctm_month", { "month": n });
            }
            else if (last >= day) {
                var n = Math.floor(last / day);
                return BlackCat.Main.langMgr.get("paylist_ctm_day", { "day": n });
            }
            else if (last >= hour) {
                var n = Math.floor(last / hour);
                return BlackCat.Main.langMgr.get("paylist_ctm_hour", { "hour": n });
            }
            else if (last >= minute) {
                var n = Math.floor(last / minute);
                return BlackCat.Main.langMgr.get("paylist_ctm_minute", { "minute": n });
            }
            else if (last >= 0) {
                return BlackCat.Main.langMgr.get("paylist_ctm_recent");
            }
            else {
                return BlackCat.Main.langMgr.get("paylist_ctm_recent");
            }
        }
        getListParamMethods(v) {
            try {
                var params = JSON.parse(v.params);
                if (params.hasOwnProperty("sbPushString")) {
                    params = [params];
                }
                if (params instanceof Array) {
                    var method = new Array();
                    for (let k in params) {
                        if (params[k].hasOwnProperty("sbPushString")) {
                            method.push(params[k].sbPushString);
                        }
                    }
                    if (method.length > 1) {
                        return method[0] + ', ...';
                    }
                    else {
                        return method.toString();
                    }
                }
            }
            catch (e) {
                console.log('[Bla Cat]', '[PayView]', 'getListParamMethods, v', v, 'error => ', e.toString());
            }
            return BlackCat.Main.langMgr.get("paylist_sbPushString_none");
        }
        getListCnts(v) {
            if (v.cnts && Number(v.cnts) != 0) {
                var state_cnts_span = this.objCreate("span");
                state_cnts_span.textContent = v.cnts;
                return state_cnts_span;
            }
        }
        getListCntsClass(v) {
            if (v.type == "1" || (v.type == "5" && v.type_detail == "2")) {
                return 'pc_income';
            }
            else if (Number(v.cnts) > 0) {
                return 'pc_expenditure';
            }
            return "";
        }
        getListState(v) {
            var state = v.state;
            var pct = "50%";
            var i = 1;
            if (v.type == "2") {
                pct = "25%";
                if (v.state == "1") {
                    state = '0';
                    pct = '50%';
                    if (v.ext != "") {
                        state = '0';
                        pct = "75%";
                        if (v.client_notify == "1") {
                            state = '1';
                        }
                    }
                    else {
                        if (!BlackCat.Main.isWalletOpen()) {
                            i = 2;
                        }
                    }
                }
            }
            switch (state) {
                case '0':
                    var state_button0 = this.objCreate("div");
                    state_button0.classList.add("pc_verification");
                    if (i == 1) {
                        state_button0.classList.add("iconfont", "icon-dengdai");
                        state_button0.innerHTML = "<label>" + pct + "</label>";
                    }
                    else {
                        var obja = this.objCreate("a");
                        obja.classList.add("iconfont", "icon-jinhangzhong");
                        obja.innerHTML = '<label>' + pct + '</label>';
                        obja.onclick = () => {
                            BlackCat.Main.continueRefund();
                            event.stopPropagation();
                        };
                        this.ObjAppend(state_button0, obja);
                    }
                    return state_button0;
                case '1':
                    var state_a1 = this.objCreate("a");
                    state_a1.classList.add("iconfont", "icon-gou");
                    return state_a1;
                case '2':
                    var state_a2 = this.objCreate("a");
                    state_a2.classList.add("iconfont", "icon-chacha");
                    return state_a2;
            }
        }
        wallet_detail() {
            if (BlackCat.Main.isWalletOpen()) {
                BlackCat.PayWalletDetailView.refer = "PayView";
                BlackCat.Main.viewMgr.change("PayWalletDetailView");
                this.hidden();
            }
            else {
                BlackCat.ViewWalletOpen.refer = "PayView";
                BlackCat.ViewWalletOpen.callback = () => {
                    this.wallet_detail();
                };
                BlackCat.Main.viewMgr.change("ViewWalletOpen");
            }
        }
        makeMintTokenTransaction() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                var mintCount = BlackCat.Main.viewMgr.viewTransCount.inputCount.value;
                console.log('[Bla Cat]', '[PayView]', '充值sgas，数量 => ', mintCount);
                var login = BlackCat.tools.LoginInfo.getCurrentLogin();
                try {
                    var utxos_assets = yield BlackCat.tools.CoinTool.getassets();
                    console.log('[Bla Cat]', '[PayView]', 'utxos_assets => ', utxos_assets);
                    var scriptaddress = BlackCat.tools.CoinTool.id_SGAS.hexToBytes().reverse();
                    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                    var makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, nepAddress, BlackCat.tools.CoinTool.id_GAS, Neo.Fixed8.fromNumber(Number(mintCount)));
                }
                catch (e) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    let errmsg = BlackCat.Main.langMgr.get(e.message);
                    if (errmsg) {
                        BlackCat.Main.showErrMsg((e.message));
                    }
                    else {
                        BlackCat.Main.showErrMsg(("pay_makeMintGasNotEnough"));
                    }
                    return;
                }
                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson([]);
                sb.EmitPushString("mintTokens");
                sb.EmitAppCall(scriptaddress);
                var tran = makeTranRes.info.tran;
                var oldarr = makeTranRes.info.oldarr;
                tran.type = ThinNeo.TransactionType.InvocationTransaction;
                tran.extdata = new ThinNeo.InvokeTransData();
                tran.extdata.script = sb.ToArray();
                tran.extdata.gas = Neo.Fixed8.fromNumber(1.0);
                var msg = tran.GetMessage();
                var signdata = ThinNeo.Helper.Sign(msg, login.prikey);
                tran.AddWitness(signdata, login.pubkey, login.address);
                var data = tran.GetRawData();
                var r = yield BlackCat.tools.WWW.api_postRawTransaction(data);
                if (r) {
                    if (r["txid"]) {
                        var logRes = yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, r["txid"], "0", mintCount, "1", '{"sbParamJson":"[]", "sbPushString": "mintTokens", "nnc": "' + BlackCat.tools.CoinTool.id_SGAS + '"}', BlackCat.Main.netMgr.type);
                        var height = yield BlackCat.tools.WWW.api_getHeight();
                        oldarr.map(old => old.height = height);
                        BlackCat.tools.OldUTXO.oldutxosPush(oldarr);
                        BlackCat.Main.viewMgr.viewLoading.remove();
                        this.doGetWalletLists();
                    }
                    else {
                        BlackCat.Main.viewMgr.viewLoading.remove();
                        BlackCat.Main.showErrMsg("pay_makeMintDoFail");
                    }
                }
                else {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg("pay_makeMintDoFail2");
                }
            });
        }
        makeRefundTransaction(id_SGAS = BlackCat.tools.CoinTool.id_SGAS) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                var refundCount = BlackCat.Main.viewMgr.viewTransCount.inputCount.value;
                var scriptaddress = id_SGAS.hexToBytes().reverse();
                var login = BlackCat.tools.LoginInfo.getCurrentLogin();
                var utxos_assets = yield BlackCat.tools.CoinTool.getsgasAssets(id_SGAS);
                var us = utxos_assets[BlackCat.tools.CoinTool.id_GAS];
                if (us == undefined) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg("pay_makeRefundSgasNotEnough");
                    return;
                }
                console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, us.before => ', us);
                var count = Neo.Fixed8.Zero;
                var sendCount = Neo.Fixed8.fromNumber(Number(refundCount));
                for (var i = us.length - 1; i >= 0; i--) {
                    if (count.compareTo(sendCount) > 0) {
                        console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, enough us[' + i + '].delete => ', us[i]);
                        delete us[i];
                        continue;
                    }
                    if (us[i].n > 0) {
                        count = count.add(us[i].count);
                        continue;
                    }
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(["(hex256)" + us[i].txid.toString()]);
                    sb.EmitPushString("getRefundTarget");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    var r = yield BlackCat.tools.WWW.rpc_getInvokescript(data);
                    if (r) {
                        var stack = r["stack"];
                        var value = stack[0]["value"].toString();
                        if (value.length > 0) {
                            console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, us[' + i + '].delete => ', us[i]);
                            delete us[i];
                        }
                        else {
                            count = count.add(us[i].count);
                        }
                    }
                }
                console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, us.after => ', us);
                try {
                    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                    var makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, nepAddress, BlackCat.tools.CoinTool.id_GAS, Neo.Fixed8.fromNumber(Number(refundCount)));
                }
                catch (e) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg("pay_makeRefundSgasNotEnough");
                    return;
                }
                console.log("[Bla Cat]", "[payView]", "makeRefundTransaction, makeTranRes => ", makeTranRes);
                var r = yield BlackCat.tools.WWW.api_getcontractstate(id_SGAS);
                if (r && r["script"]) {
                    var sgasScript = r["script"].hexToBytes();
                    var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(login.address);
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(["(bytes)" + scriptHash.toHexString()]);
                    sb.EmitPushString("refund");
                    sb.EmitAppCall(scriptaddress);
                    var tran = makeTranRes.info.tran;
                    var oldarr = makeTranRes.info.oldarr;
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    tran.extdata.script = sb.ToArray();
                    tran.attributes = new Array(1);
                    tran.attributes[0] = new ThinNeo.Attribute();
                    tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                    tran.attributes[0].data = scriptHash;
                    var wsb = new ThinNeo.ScriptBuilder();
                    wsb.EmitPushString("whatever");
                    wsb.EmitPushNumber(new Neo.BigInteger(250));
                    tran.AddWitnessScript(sgasScript, wsb.ToArray());
                    var signdata = ThinNeo.Helper.Sign(tran.GetMessage(), login.prikey);
                    tran.AddWitness(signdata, login.pubkey, login.address);
                    var txid = tran.GetHash().clone().reverse().toHexString();
                    var trandata = tran.GetRawData();
                    console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, tran => ', tran);
                    r = yield BlackCat.tools.WWW.api_postRawTransaction(trandata);
                    if (r) {
                        if (r.txid) {
                            var paramJson_tmp = "(bytes)" + scriptHash.toHexString();
                            var logRes = yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, r.txid, "0", refundCount, "2", '{"sbParamJson":"' + paramJson_tmp + '", "sbPushString": "refund", "nnc": "' + id_SGAS + '"}', BlackCat.Main.netMgr.type);
                            if (logRes.r) {
                                BlackCat.Main.platWalletLogId = parseInt(logRes.data);
                            }
                            var height = yield BlackCat.tools.WWW.api_getHeight();
                            oldarr.map(old => old.height = height);
                            BlackCat.tools.OldUTXO.oldutxosPush(oldarr);
                            BlackCat.Main.viewMgr.viewLoading.remove();
                            this.doGetWalletLists();
                        }
                        else {
                            BlackCat.Main.viewMgr.viewLoading.remove();
                            BlackCat.Main.showErrMsg(("pay_makeRefundDoFail"));
                        }
                        console.log('[Bla Cat]', '[payView]', 'makeRefundTransaction, api_postRawTransaction结果 => ', r);
                    }
                    else {
                        BlackCat.Main.viewMgr.viewLoading.remove();
                        BlackCat.Main.showErrMsg("pay_makeRefundDoFail2");
                    }
                }
                else {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg("pay_makeRefundGetScriptFail");
                }
            });
        }
        doMakeReceivables() {
            return __awaiter(this, void 0, void 0, function* () {
                this.hidden();
                BlackCat.PayReceivablesView.refer = "PayView";
                BlackCat.Main.viewMgr.change("PayReceivablesView");
            });
        }
        doMakeTransfer() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.PayTransferView.refer = "PayView";
                    BlackCat.PayTransferView.callback = () => {
                        this.doGetWalletLists();
                    };
                    BlackCat.Main.viewMgr.change("PayTransferView");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doMakeTransfer();
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        flushListCtm() {
            var ctms = document.getElementsByClassName("listCtm");
            if (ctms && ctms.length > 0) {
                for (let k = 0; k < ctms.length; k++) {
                    var list = {
                        ctm: ctms[k].getAttribute("ctm")
                    };
                    ctms[k].textContent = this.getListCtmMsg(list);
                }
            }
        }
        getNetTypeName() {
            return BlackCat.Main.langMgr.get("pay_nettype_" + BlackCat.Main.netMgr.type);
        }
        showChangeNetType() {
            if (this.divNetSelect.innerHTML.length > 0) {
                this.divNetSelect.innerHTML = "";
            }
            else {
                var other = BlackCat.Main.netMgr.getOtherTypes();
                for (let i = 0; i < other.length; i++) {
                    this.ObjAppend(this.divNetSelect, this.getDivNetSelectType(other[i]));
                }
            }
        }
        getDivNetSelectType(type) {
            var divObj = this.objCreate("div");
            divObj.textContent = BlackCat.Main.langMgr.get("pay_nettype_" + type);
            divObj.onclick = () => {
                BlackCat.Main.changeNetType(type);
            };
            return divObj;
        }
        checkTransCount(count) {
            var regex = /(?!^0*(\.0{1,2})?$)^\d{1,14}(\.\d{1,8})?$/;
            if (!regex.test(count)) {
                return false;
            }
            if (Number(count) <= 0) {
                return false;
            }
            return true;
        }
    }
    BlackCat.PayView = PayView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayWalletDetailView extends BlackCat.ViewBase {
        reset() {
            this.private_wif = "";
            this.private_hex = "";
        }
        create() {
            this.getWalletInfo();
            this.div = this.objCreate("div");
            this.div.classList.add("pc_walletdetail");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("pay_walletDetail");
            this.ObjAppend(header, headerH1);
            var content = this.objCreate("div");
            content.classList.add("pc_paydetail");
            content.innerHTML
                = "<ul><li>" + BlackCat.Main.langMgr.get("pay_walletDetail_addr") + "<p>" + this.wallet_addr + "</p></li>"
                    + "<li>" + BlackCat.Main.langMgr.get("pay_walletDetail_key") + "<p>" + this.public_key + "</p></li>"
                    + "<li class='pc_detailhide'>" + BlackCat.Main.langMgr.get("pay_walletDetail_hex") + "<p>" + this.private_hex + "</p></li>"
                    + "<li class='pc_detailhide'>" + BlackCat.Main.langMgr.get("pay_walletDetail_wif") + "<p>" + this.private_wif + "</p></li>";
            this.ObjAppend(this.div, content);
            var divNotes = this.objCreate("div");
            divNotes.classList.add("pc_paydetailnotes");
            divNotes.innerText = BlackCat.Main.langMgr.get("pay_walletDetail_notice");
            this.ObjAppend(content, divNotes);
            var iMoreshow = this.objCreate("i");
            iMoreshow.classList.add("iconfont", "icon-gengduo1");
            iMoreshow.onclick = () => {
                content.classList.add("pc_paydetailshow");
                iMoreshow.style.display = "none";
                iMorehide.style.display = "block";
            };
            this.ObjAppend(divNotes, iMoreshow);
            var iMorehide = this.objCreate("i");
            iMorehide.style.display = "none";
            iMorehide.classList.add("iconfont", "icon-gengduo1");
            iMorehide.onclick = () => {
                content.classList.remove("pc_paydetailshow");
                iMorehide.style.display = "none";
                iMoreshow.style.display = "block";
            };
            this.ObjAppend(divNotes, iMorehide);
            this.walletExport = this.objCreate("a");
            this.walletExport.classList.add("pc_walletExport");
            this.walletExport.textContent = BlackCat.Main.langMgr.get("pay_walletDetail_export");
            this.walletExport.setAttribute("download", this.wallet_addr + ".json");
            this.ObjAppend(this.div, this.walletExport);
            this.exportWallet();
            var iWalletExport = this.objCreate("i");
            iWalletExport.classList.add("iconfont", "icon-daochuqianbao");
            this.ObjAppend(this.walletExport, iWalletExport);
        }
        toRefer() {
            if (PayWalletDetailView.refer) {
                BlackCat.Main.viewMgr.change(PayWalletDetailView.refer);
                PayWalletDetailView.refer = null;
            }
        }
        getWalletInfo() {
            var login = BlackCat.tools.LoginInfo.getCurrentLogin();
            this.wallet_addr = BlackCat.tools.LoginInfo.getCurrentAddress();
            this.public_key = login.pubkey.toHexString();
            this.private_wif = ThinNeo.Helper.GetWifFromPrivateKey(login.prikey);
            this.private_hex = login.prikey.toHexString();
        }
        exportWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.wallet.filestr || (yield BlackCat.Main.wallet.readWalletFile(1))) {
                    var blob = new Blob([ThinNeo.Helper.String2Bytes(BlackCat.Main.wallet.filestr)]);
                    var url = URL.createObjectURL(blob);
                    this.walletExport.setAttribute('href', url);
                }
            });
        }
    }
    BlackCat.PayWalletDetailView = PayWalletDetailView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class RegisterView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.getCodeRetryMax = 60;
            this.getCodeRetry_curr = 0;
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_login", "pc_register");
            var divLogo = this.objCreate("div");
            divLogo.classList.add("pc_login_logo", "iconfont", "icon-blacat");
            this.ObjAppend(this.div, divLogo);
            var divTitle = this.objCreate("div");
            divTitle.classList.add("pc_login_title");
            this.ObjAppend(this.div, divTitle);
            var h1TitleType = this.objCreate("h1");
            h1TitleType.classList.add("pc_title_tyle");
            h1TitleType.textContent = BlackCat.Main.langMgr.get("register_title");
            this.ObjAppend(divTitle, h1TitleType);
            var divTitleobj = this.objCreate("div");
            divTitleobj.classList.add("pc_title_switch");
            this.ObjAppend(divTitle, divTitleobj);
            var aTiletMobile = this.objCreate("a");
            aTiletMobile.classList.add("pc_tiletmobile", "pc_active");
            aTiletMobile.style.borderLeft = "0";
            aTiletMobile.textContent = BlackCat.Main.langMgr.get("main_phone");
            aTiletMobile.onclick = () => {
                areaSelect.style.display = "block";
                aTiletMobile.classList.add("pc_active");
                aTilEtEmail.classList.remove("pc_active");
                iIshurushouji.classList.add("icon-shurushouji");
                iIshurushouji.classList.remove("icon-xinxi");
                this.inputAccount.value = "";
                this.inputCode.value = "";
                this.accountType = "phone";
                this.inputAccount.placeholder = BlackCat.Main.langMgr.get("register_input" + this.accountType);
            };
            this.ObjAppend(divTitleobj, aTiletMobile);
            var aTilEtEmail = this.objCreate("a");
            aTilEtEmail.textContent = BlackCat.Main.langMgr.get("main_email");
            aTilEtEmail.onclick = () => {
                areaSelect.style.display = "none";
                aTilEtEmail.classList.add("pc_active");
                aTiletMobile.classList.remove("pc_active");
                iIshurushouji.classList.add("icon-xinxi");
                iIshurushouji.classList.remove("icon-shurushouji");
                this.inputAccount.value = "";
                this.inputCode.value = "";
                this.accountType = "email";
                this.inputAccount.placeholder = BlackCat.Main.langMgr.get("register_input" + this.accountType);
            };
            this.ObjAppend(divTitleobj, aTilEtEmail);
            var divInput = this.objCreate("div");
            divInput.classList.add("pc_login_input");
            this.ObjAppend(this.div, divInput);
            var userName = this.objCreate("div");
            userName.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, userName);
            var iUserName = this.objCreate("i");
            iUserName.classList.add("iconfont", "icon-my");
            this.ObjAppend(userName, iUserName);
            this.inputUid = this.objCreate("input");
            this.inputUid.type = "text";
            this.inputUid.placeholder = BlackCat.Main.langMgr.get("register_inputUid");
            this.inputUid.onblur = () => {
                this.validateUid();
            };
            this.ObjAppend(userName, this.inputUid);
            var areaSelect = this.objCreate("div");
            areaSelect.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, areaSelect);
            var iRegion = this.objCreate("i");
            iRegion.classList.add("iconfont", "icon-diqiu");
            this.ObjAppend(areaSelect, iRegion);
            this.selectArea = this.objCreate("select");
            BlackCat.AreaView.areaInfo.forEach(area => {
                var option = this.objCreate("option");
                option.setAttribute("value", area.codename);
                option.textContent = BlackCat.Main.langMgr.get("area_code_" + area.codename);
                this.selectArea.options.add(option);
            });
            this.selectArea.onchange = () => {
                BlackCat.AreaView.areaInfo.forEach(area => {
                    if (area.codename == this.selectArea.value) {
                        this.divArea.textContent = area.areacode;
                    }
                });
            };
            this.ObjAppend(areaSelect, this.selectArea);
            this.divArea = this.objCreate("div");
            this.divArea.classList.add("pc_area");
            BlackCat.AreaView.areaInfo.forEach(area => {
                if (area.codename == this.selectArea.value) {
                    this.divArea.textContent = area.areacode;
                }
            });
            this.ObjAppend(areaSelect, this.divArea);
            var aArea = this.objCreate("a");
            aArea.classList.add("pc_areaa", "iconfont", "icon-xiala");
            this.ObjAppend(areaSelect, aArea);
            var divTel = this.objCreate("div");
            divTel.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divTel);
            var iIshurushouji = this.objCreate("i");
            iIshurushouji.classList.add("iconfont", "icon-shurushouji");
            this.ObjAppend(divTel, iIshurushouji);
            this.inputAccount = this.objCreate("input");
            this.inputAccount.type = "text";
            this.inputAccount.placeholder = BlackCat.Main.langMgr.get("register_inputphone");
            this.inputAccount.onblur = () => {
                this.validateAccount();
            };
            this.ObjAppend(divTel, this.inputAccount);
            var divCode = this.objCreate("div");
            divCode.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divCode);
            var iDivCode = this.objCreate("i");
            iDivCode.classList.add("iconfont", "icon-dunpai1");
            this.ObjAppend(divCode, iDivCode);
            this.inputCode = this.objCreate("input");
            this.inputCode.type = "text";
            this.inputCode.style.width = "60%";
            this.inputCode.placeholder = BlackCat.Main.langMgr.get("register_inputCode");
            this.ObjAppend(divCode, this.inputCode);
            var divPass = this.objCreate("div");
            divPass.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divPass);
            var iPass = this.objCreate("i");
            iPass.classList.add("iconfont", "icon-mima");
            this.ObjAppend(divPass, iPass);
            this.inputPass = this.objCreate("input");
            this.inputPass.type = "password";
            this.inputPass.placeholder = BlackCat.Main.langMgr.get("register_inputPass");
            this.ObjAppend(divPass, this.inputPass);
            var divVPass = this.objCreate("div");
            divVPass.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divVPass);
            var iVPass = this.objCreate("i");
            iVPass.classList.add("iconfont", "icon-mima");
            this.ObjAppend(divVPass, iVPass);
            this.inputVpass = this.objCreate("input");
            this.inputVpass.type = "password";
            this.inputVpass.placeholder = BlackCat.Main.langMgr.get("register_inputVpass");
            this.ObjAppend(divVPass, this.inputVpass);
            this.getCode = this.objCreate("button");
            this.getCode.textContent = BlackCat.Main.langMgr.get("register_getCode");
            this.getCode.onclick = () => {
                this.doGetCode();
            };
            this.ObjAppend(divCode, this.getCode);
            this.getCodeCount = this.objCreate("button");
            this.getCodeCount.classList.add("pc_getPhoneCodecount");
            this.getCodeCount.textContent = BlackCat.Main.langMgr.get("register_getCodecount");
            this.ObjAppend(divCode, this.getCodeCount);
            var doRegister = this.objCreate("button");
            doRegister.classList.add("pc_doLogin");
            doRegister.textContent = BlackCat.Main.langMgr.get("register_doRegister");
            doRegister.onclick = () => {
                this.doRegister();
            };
            this.ObjAppend(divInput, doRegister);
            var doLogin = this.objCreate("button");
            doLogin.classList.add("pc_loginregion");
            doLogin.textContent = BlackCat.Main.langMgr.get("register_doLogin");
            doLogin.onclick = () => {
                this.remove();
                BlackCat.Main.viewMgr.change("LoginView");
            };
            this.ObjAppend(divInput, doLogin);
        }
        start() {
            super.start();
            this.inputUid.focus();
        }
        update() {
            super.update();
            this.doRetryCount(0);
        }
        reset() {
            if (this.s_getCodeCountRetry)
                clearInterval(this.s_getCodeCountRetry);
            this.accountType = "phone";
        }
        empty(value) {
            if (value.toString().length == 0) {
                return true;
            }
            return false;
        }
        getPhone() {
            return BlackCat.Main.getPhone(this.selectArea.value, this.inputAccount.value);
        }
        checkAccountFromApi() {
            return __awaiter(this, void 0, void 0, function* () {
                var res;
                switch (this.accountType) {
                    case 'email':
                        res = yield BlackCat.ApiTool.validEmail(this.inputAccount.value);
                        break;
                    case 'phone':
                        res = yield BlackCat.ApiTool.validPhone(this.getPhone());
                        break;
                    default:
                        return;
                }
                if (!res.r) {
                    BlackCat.Main.showErrCode(res.errCode);
                    return false;
                }
                return true;
            });
        }
        checkUidFromApi() {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.validUid(this.inputUid.value);
                if (!res.r) {
                    BlackCat.Main.showErrCode(res.errCode);
                    return false;
                }
                return true;
            });
        }
        validateAccount(emptySkip = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputAccount.value)) {
                    if (emptySkip)
                        return;
                    BlackCat.Main.showErrMsg(("register_input" + this.accountType + "_err"));
                    return false;
                }
                if ((yield BlackCat.Main.validateFormat(this.accountType, this.inputAccount)) == false) {
                    return false;
                }
                return yield this.checkAccountFromApi();
            });
        }
        validateUid(emptySkip = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputUid.value)) {
                    if (emptySkip)
                        return false;
                    BlackCat.Main.showErrMsg(("register_inputUid_err"));
                    return false;
                }
                if ((yield BlackCat.Main.validateFormat("user", this.inputUid)) == false) {
                    return false;
                }
                return yield this.checkUidFromApi();
            });
        }
        validateCode() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputCode.value)) {
                    BlackCat.Main.showErrMsg(("register_inputCode_err"));
                    return false;
                }
                return yield BlackCat.Main.validateFormat("vcode", this.inputCode);
            });
        }
        validatePass() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputPass.value)) {
                    BlackCat.Main.showErrMsg(("register_inputPass_err"));
                    return false;
                }
                return true;
            });
        }
        validateVpass() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputVpass.value)) {
                    BlackCat.Main.showErrMsg(("register_inputVpass_err"));
                    return false;
                }
                if (this.inputVpass.value != this.inputPass.value) {
                    BlackCat.Main.showErrMsg(("register_inputVpass_inputPass_err"));
                    return false;
                }
                return true;
            });
        }
        doRegister() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.validateUid(false)))
                    return;
                if (!(yield this.validateAccount(false)))
                    return;
                if (!(yield this.validateCode()))
                    return;
                if (!(yield this.validatePass()))
                    return;
                if (!(yield this.validateVpass()))
                    return;
                var res;
                switch (this.accountType) {
                    case 'email':
                        res = yield BlackCat.ApiTool.registerByEmail(this.inputAccount.value, this.inputCode.value, this.inputVpass.value, this.selectArea.value, this.inputUid.value);
                        break;
                    case 'phone':
                        res = yield BlackCat.ApiTool.registerByPhone(this.getPhone(), this.inputCode.value, this.inputVpass.value, this.selectArea.value, this.inputUid.value);
                        break;
                    default:
                        return;
                }
                if (res.r) {
                    localStorage.setItem(BlackCat.Main.user.cacheKey, JSON.stringify(res.data));
                    BlackCat.Main.user.getInfo();
                    if (res.data.wallet) {
                        var wallet_file = yield BlackCat.ApiTool.getWalletFile(res.data.uid, res.data.token);
                        if (wallet_file.r) {
                            localStorage.setItem(res.data.wallet, wallet_file.data);
                            this.remove();
                            BlackCat.Main.viewMgr.change("PayView");
                        }
                        else {
                            BlackCat.Main.showErrMsg(("login_walletDownloadFail"));
                        }
                    }
                    else {
                        this.remove();
                        BlackCat.Main.viewMgr.change("WalletView");
                    }
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        doRetryCount(type) {
            switch (type) {
                case 0:
                    if (this.s_getCodeCountRetry) {
                        this.getCode.style.display = "none";
                        this.getCodeCount.style.display = "block";
                    }
                    break;
                case 1:
                    this.getCodeRetry_curr = this.getCodeRetryMax;
                    this.getCode.style.display = "none";
                    this.getCodeCount.style.display = "block";
                    this.s_getCodeCountRetry = setInterval(() => {
                        this._doRetryCount();
                    }, 1000);
                    break;
            }
        }
        _doRetryCount() {
            if (this.getCodeRetry_curr > 0 && this.getCodeCount != null) {
                this.getCodeRetry_curr--;
                this.getCodeCount.innerText = BlackCat.Main.langMgr.get("register_getCodecountRetry") + "(" + this.getCodeRetry_curr + ")";
            }
            else if (this.getCodeCount != null) {
                clearInterval(this.s_getCodeCountRetry);
                this.getCodeCount.style.display = "none";
                this.getCode.style.display = "block";
                this.getCodeRetry_curr = 0;
            }
            else {
                clearInterval(this.s_getCodeCountRetry);
                this.getCodeRetry_curr = 0;
            }
        }
        doGetCode() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.empty(this.inputAccount.value)) {
                    BlackCat.Main.showErrMsg(("register_input" + this.accountType + "_err"), () => {
                        this.inputAccount.focus();
                    });
                    return;
                }
                BlackCat.Main.viewMgr.change("ViewLoading");
                if (!(yield this.checkAccountFromApi())) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    return;
                }
                try {
                    var res;
                    switch (this.accountType) {
                        case 'email':
                            res = yield BlackCat.ApiTool.getEmailCode(this.inputAccount.value, BlackCat.Main.langMgr.type);
                            break;
                        case 'phone':
                            res = yield BlackCat.ApiTool.getPhoneCode(this.getPhone());
                            break;
                        default:
                            return;
                    }
                }
                catch (e) {
                    console.log('[Bla Cat]', '[RegisterView]', 'doGetCode, ApiTool.getxxCode', 'error => ', e.toString());
                }
                BlackCat.Main.viewMgr.viewLoading.remove();
                if (res.r) {
                    this.doRetryCount(1);
                    BlackCat.Main.showToast("register_getCodeSucc");
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
    }
    BlackCat.RegisterView = RegisterView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class SecurityCenterView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_security");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("security_title");
            this.ObjAppend(header, headerH1);
            var divSecurity = this.objCreate("div");
            divSecurity.classList.add("pc_myinfolist");
            this.ObjAppend(this.div, divSecurity);
            var ulSecurity = this.objCreate("ul");
            this.ObjAppend(divSecurity, ulSecurity);
            var liTrust = this.objCreate("li");
            liTrust.style.cursor = "pointer";
            liTrust.textContent = BlackCat.Main.langMgr.get("security_trust");
            liTrust.onclick = () => {
                this.hidden();
                BlackCat.Main.viewMgr.change("TrustContractView");
            };
            this.ObjAppend(ulSecurity, liTrust);
            var iTrust = this.objCreate("i");
            iTrust.classList.add("iconfont", "icon-gengduo");
            this.ObjAppend(liTrust, iTrust);
            var spanTrust = this.objCreate("span");
            spanTrust.textContent = BlackCat.Main.langMgr.get("security_trust_admin");
            this.ObjAppend(liTrust, spanTrust);
            var liSignOut = this.objCreate("li");
            liSignOut.style.cursor = "pointer";
            liSignOut.textContent = BlackCat.Main.langMgr.get("security_walletOut");
            liSignOut.onclick = () => {
                this.hidden();
                BlackCat.Main.viewMgr.change("AutoLogoutWalletView");
            };
            this.ObjAppend(ulSecurity, liSignOut);
            var iSignOut = this.objCreate("i");
            iSignOut.classList.add("iconfont", "icon-gengduo");
            this.ObjAppend(liSignOut, iSignOut);
            this.spanSignOut = this.objCreate("span");
            this.spanSignOut.textContent = this.getWalletOutTimeMaxMsg(BlackCat.Main.getLiveTimeMax());
            this.ObjAppend(liSignOut, this.spanSignOut);
            var divwalletOutTips = this.objCreate("div");
            divwalletOutTips.classList.add("pc_signout_tips");
            divwalletOutTips.textContent = BlackCat.Main.langMgr.get("security_walletOut_toast");
            this.ObjAppend(liSignOut, divwalletOutTips);
        }
        toRefer() {
            BlackCat.Main.viewMgr.myInfoView.show();
        }
        getWalletOutTimeMaxMsg(liveTimeMax) {
            if (liveTimeMax >= (60 * 60 * 1000)) {
                let hour = liveTimeMax / (60 * 60 * 1000);
                return BlackCat.Main.langMgr.get("security_walletOut_admin_h", { hours: hour });
            }
            else if (liveTimeMax > 0) {
                let minute = liveTimeMax / (60 * 1000);
                return BlackCat.Main.langMgr.get("security_walletOut_admin_m", { minutes: minute });
            }
            return BlackCat.Main.langMgr.get("security_walletOut_admin");
        }
        updateWalletOutTimeMaxMsg() {
            this.spanSignOut.textContent = this.getWalletOutTimeMaxMsg(BlackCat.Main.getLiveTimeMax());
        }
    }
    BlackCat.SecurityCenterView = SecurityCenterView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class TrustContractView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.num = BlackCat.Main.viewMgr.payView.listPageNum;
            this.reset();
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_paylist", "pc_trustcontract");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
                BlackCat.Main.viewMgr.securityCenterView.show();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("trust_title");
            this.ObjAppend(header, headerH1);
            this.listsDiv = this.objCreate("ul");
            this.ObjAppend(this.div, this.listsDiv);
            this.getMoreDiv = this.objCreate("div");
            this.getMoreDiv.classList.add("pc_listmore");
            this.getMoreDiv.onclick = () => {
                this.doGetTrustLists();
            };
            this.ObjAppend(this.div, this.getMoreDiv);
            this.doGetTrustLists();
        }
        remove() {
            super.remove();
            this.reset();
        }
        reset() {
            this.offset = 0;
            this.isLast = false;
        }
        doGetTrustLists() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isLast) {
                    return;
                }
                var res = yield BlackCat.ApiTool.getTrustLists(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, this.offset, this.num);
                if (res.r) {
                    if (res.data && res.data.length >= 1) {
                        if (res.data.length < this.num) {
                            this.isLast = true;
                            this.getMoreDiv.textContent = BlackCat.Main.langMgr.get("paylist_noMore");
                        }
                        else {
                            this.offset += this.num;
                            this.getMoreDiv.textContent = BlackCat.Main.langMgr.get("paylist_getMore");
                        }
                        yield res.data.forEach(list => {
                            var listObj = this.objCreate("li");
                            var img_div = this.objCreate("div");
                            img_div.classList.add("pc_listimg");
                            var img = this.objCreate("img");
                            img.src = this.getListImg(list);
                            this.ObjAppend(img_div, img);
                            this.ObjAppend(listObj, img_div);
                            var content_div = this.objCreate("div");
                            content_div.classList.add("pc_liftinfo");
                            var content_name_div = this.objCreate("div");
                            content_name_div.classList.add("pc_listname");
                            content_name_div.textContent = BlackCat.Main.viewMgr.payView.getListName(list);
                            this.ObjAppend(content_div, content_name_div);
                            var content_ctm_p = this.objCreate("p");
                            content_ctm_p.classList.add("pc_method");
                            content_ctm_p.textContent = this.getListNnc(list);
                            this.ObjAppend(content_div, content_ctm_p);
                            this.ObjAppend(listObj, content_div);
                            var trustObj = this.objCreate("a");
                            trustObj.onclick = () => {
                                listObj.remove();
                                this.doDelList(list);
                            };
                            trustObj.classList.add("pc_switch", "pc_switch_active");
                            var spanSwitchBut = this.objCreate("span");
                            this.ObjAppend(trustObj, spanSwitchBut);
                            this.ObjAppend(listObj, trustObj);
                            this.ObjAppend(this.listsDiv, listObj);
                        });
                    }
                    else {
                        this.getMoreDiv.textContent = BlackCat.Main.langMgr.get("paylist_noRecord");
                    }
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        getListImg(v) {
            return v.icon;
        }
        getListNnc(v) {
            return v.nnc;
        }
        doDelList(v) {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.delTrustNncs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, v.id);
                if (res.r) {
                    BlackCat.Main.removeTrustNnc(v.nnc);
                    this.offset -= 1;
                    BlackCat.Main.showToast("trust_relieve_succ");
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
    }
    BlackCat.TrustContractView = TrustContractView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewAlert extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_alter");
            var alter = this.objCreate('div');
            alter.classList.add("pc_alterbox");
            this.ObjAppend(this.div, alter);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_altertitle");
            popupTitle.innerText = BlackCat.Main.langMgr.get("info");
            this.ObjAppend(alter, popupTitle);
            var alterText = this.objCreate("div");
            alterText.classList.add("pc_altertext");
            var lang_content = BlackCat.Main.langMgr.get(ViewAlert.content, ViewAlert.content_ext);
            if (!lang_content) {
                lang_content = ViewAlert.content;
            }
            alterText.textContent = lang_content;
            this.ObjAppend(alter, alterText);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(alter, popupbutbox);
            var butConfirm = this.objCreate("button");
            butConfirm.textContent = BlackCat.Main.langMgr.get("ok");
            butConfirm.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, butConfirm);
        }
        toRefer() {
            if (ViewAlert.refer) {
                BlackCat.Main.viewMgr.change(ViewAlert.refer);
                ViewAlert.refer = null;
            }
        }
        doConfirm() {
            this.remove(300);
            if (ViewAlert.callback) {
                ViewAlert.callback();
                ViewAlert.callback = null;
            }
        }
    }
    BlackCat.ViewAlert = ViewAlert;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewConfirm extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_alter", "pc_confirm");
            var alter = this.objCreate('div');
            alter.classList.add("pc_alterbox");
            this.ObjAppend(this.div, alter);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_altertitle");
            popupTitle.innerText = BlackCat.Main.langMgr.get("info");
            this.ObjAppend(alter, popupTitle);
            var alterText = this.objCreate("div");
            alterText.classList.add("pc_altertext");
            var lang_content = BlackCat.Main.langMgr.get(ViewConfirm.content);
            if (!lang_content) {
                lang_content = ViewConfirm.content;
            }
            alterText.textContent = lang_content;
            this.ObjAppend(alter, alterText);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(alter, popupbutbox);
            var popupClose = this.objCreate("button");
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.doCancel();
            };
            this.ObjAppend(popupbutbox, popupClose);
            var butConfirm = this.objCreate("button");
            butConfirm.textContent = BlackCat.Main.langMgr.get("ok");
            butConfirm.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, butConfirm);
        }
        toRefer() {
            if (ViewConfirm.refer) {
                BlackCat.Main.viewMgr.change(ViewConfirm.refer);
                ViewConfirm.refer = null;
            }
        }
        doConfirm() {
            this.remove(300);
            ViewConfirm.callback(ViewConfirm.callback_params);
            ViewConfirm.callback_params = null;
        }
        doCancel() {
            this.remove(300);
            if (ViewConfirm.callback_cancel) {
                ViewConfirm.callback_cancel(ViewConfirm.callback_params);
            }
            ViewConfirm.callback_params = null;
        }
    }
    BlackCat.ViewConfirm = ViewConfirm;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewConnecting extends BlackCat.ViewBase {
        constructor() {
            super(...arguments);
            this.showReturn = false;
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_login", "pc_connecting");
            if (this.showType == "connecting") {
                this.showConnecting();
            }
            else if (this.showType == "retry") {
                this.showRetry(this.showReturn);
            }
        }
        showConnecting() {
            this.showType = "connecting";
            this.div.innerHTML = "";
            this.div.classList.add("pc_loading");
            var divConnecting = this.objCreate("div");
            divConnecting.classList.add("pc_loadingbox");
            divConnecting.innerHTML =
                "<div class='pc_loading1'></div>"
                    + "<div class='pc_loading2'></div>"
                    + "<div class='pc_loading3'></div>"
                    + "<div class='pc_loading4'></div>"
                    + "<div class='pc_loading5'></div>"
                    + "<div class='pc_loading6'></div>"
                    + "<div class='pc_loading7'></div>"
                    + "<div class='pc_loading8'></div>"
                    + "<div class='pc_loading9'></div>"
                    + "<div class='pc_loading10'></div>"
                    + "<div class='pc_loading11'></div>"
                    + "<div class='pc_loading12'></div>"
                    + "<p id='pc_loadingtext'>" + BlackCat.Main.langMgr.get("netmgr_connecting") + "</p>";
            this.ObjAppend(this.div, divConnecting);
        }
        showRetry(showReturn) {
            this.showType = "retry";
            this.showReturn = showReturn;
            this.div.innerHTML = "";
            var divRetry = this.objCreate("div");
            divRetry.classList.add("pc_connectingtext");
            var descDiv = this.objCreate("div");
            var lang_key = "netmgr_connecting_fail";
            if (ViewConnecting.content) {
                lang_key = ViewConnecting.content;
            }
            descDiv.textContent = BlackCat.Main.langMgr.get(lang_key);
            this.ObjAppend(divRetry, descDiv);
            if (showReturn) {
                var returnObj = this.objCreate("button");
                returnObj.classList.add("pc_cancel");
                returnObj.textContent = BlackCat.Main.langMgr.get("return");
                returnObj.onclick = () => {
                    this.return();
                };
                this.ObjAppend(divRetry, returnObj);
            }
            var retryObj = this.objCreate("button");
            retryObj.textContent = BlackCat.Main.langMgr.get("retry");
            retryObj.onclick = () => {
                if (ViewConnecting.callback_retry)
                    ViewConnecting.callback_retry();
            };
            this.ObjAppend(divRetry, retryObj);
            this.ObjAppend(this.div, divRetry);
        }
    }
    BlackCat.ViewConnecting = ViewConnecting;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewLoading extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_loading");
            var divLoading = this.objCreate("div");
            divLoading.classList.add("pc_loadingbox");
            var lang_content = BlackCat.Main.langMgr.get(ViewLoading.content);
            if (!lang_content) {
                lang_content = ViewLoading.content;
            }
            divLoading.innerHTML =
                "<div class='pc_loading1'></div>"
                    + "<div class='pc_loading2'></div>"
                    + "<div class='pc_loading3'></div>"
                    + "<div class='pc_loading4'></div>"
                    + "<div class='pc_loading5'></div>"
                    + "<div class='pc_loading6'></div>"
                    + "<div class='pc_loading7'></div>"
                    + "<div class='pc_loading8'></div>"
                    + "<div class='pc_loading9'></div>"
                    + "<div class='pc_loading10'></div>"
                    + "<div class='pc_loading11'></div>"
                    + "<div class='pc_loading12'></div>"
                    + "<p id='pc_loadingtext'>" + lang_content + "</p>";
            this.ObjAppend(this.div, divLoading);
        }
    }
    ViewLoading.content = "";
    BlackCat.ViewLoading = ViewLoading;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewMgr {
        constructor() {
            this.mainView = new BlackCat.MainView();
            this.mainView.start();
            this.views = {};
        }
        change(type) {
            switch (type) {
                case "ViewWalletOpen":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示打开钱包输入密码界面(' + type + ') ...');
                    if (!this.viewWalletOpen) {
                        this.viewWalletOpen = new BlackCat.ViewWalletOpen();
                        this.views[type] = this.viewWalletOpen;
                    }
                    this.viewWalletOpen.start();
                    break;
                case "ViewTransCount":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示输入交易数量界面(' + type + ') ...');
                    if (!this.viewTransCount) {
                        this.viewTransCount = new BlackCat.ViewTransCount();
                        this.views[type] = this.viewTransCount;
                    }
                    this.viewTransCount.start();
                    break;
                case "ViewTransConfirm":
                    console.log('[Bla Cat]', '[viewMgr]', '显示确认交易界面(' + type + ') ...');
                    if (!this.viewTransConfirm) {
                        this.viewTransConfirm = new BlackCat.ViewTransConfirm();
                        this.views[type] = this.viewTransConfirm;
                    }
                    this.viewTransConfirm.start();
                    break;
                case "IconView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示SDK图标(' + type + ') ...');
                    if (!this.iconView) {
                        this.iconView = new BlackCat.IconView();
                        this.views[type] = this.iconView;
                    }
                    this.iconView.start();
                    break;
                case "LoginView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示登录(' + type + ') ...');
                    if (!this.loginView) {
                        this.loginView = new BlackCat.LoginView();
                        this.views[type] = this.loginView;
                    }
                    this.loginView.start();
                    break;
                case "WalletView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示绑定&导入钱包(' + type + ') ...');
                    if (!this.walletView) {
                        this.walletView = new BlackCat.WalletView();
                        this.views[type] = this.walletView;
                    }
                    this.walletView.start();
                    break;
                case "WalletCreateView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示新建钱包(' + type + ') ...');
                    if (!this.walletCreateView) {
                        this.walletCreateView = new BlackCat.WalletCreateView();
                        this.views[type] = this.walletCreateView;
                    }
                    this.walletCreateView.start();
                    break;
                case "WalletImportView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示导入钱包(' + type + ') ...');
                    if (!this.walletImportView) {
                        this.walletImportView = new BlackCat.WalletImportView();
                        this.views[type] = this.walletImportView;
                    }
                    this.walletImportView.start();
                    break;
                case "PayView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示钱包页(' + type + ') ...');
                    if (!this.payView) {
                        this.payView = new BlackCat.PayView();
                        this.views[type] = this.payView;
                    }
                    this.payView.start();
                    break;
                case "PayListDetailView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示交易详情(' + type + ') ...');
                    if (!this.payListDetailView) {
                        this.payListDetailView = new BlackCat.PayListDetailView();
                        this.views[type] = this.payListDetailView;
                    }
                    this.payListDetailView.start();
                    break;
                case "PayListMoreView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示更多记录(' + type + ') ...');
                    if (!this.payListMoreView) {
                        this.payListMoreView = new BlackCat.PayListMoreView();
                        this.views[type] = this.payListMoreView;
                    }
                    this.payListMoreView.start();
                    break;
                case "MyInfoView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示我的信息(' + type + ') ...');
                    if (!this.myInfoView) {
                        this.myInfoView = new BlackCat.MyInfoView();
                        this.views[type] = this.myInfoView;
                    }
                    this.myInfoView.start();
                    break;
                case "PayWalletDetailView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示钱包详情(' + type + ') ...');
                    if (!this.payWalletDetailView) {
                        this.payWalletDetailView = new BlackCat.PayWalletDetailView();
                        this.views[type] = this.payWalletDetailView;
                    }
                    this.payWalletDetailView.start();
                    break;
                case "PayReceivablesView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示收款(' + type + ') ...');
                    if (!this.payReceivablesView) {
                        this.payReceivablesView = new BlackCat.PayReceivablesView();
                        this.views[type] = this.payReceivablesView;
                    }
                    this.payReceivablesView.start();
                    break;
                case "PayTransferView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示转账(' + type + ') ...');
                    if (!this.payTransferView) {
                        this.payTransferView = new BlackCat.PayTransferView();
                        this.views[type] = this.payTransferView;
                    }
                    this.payTransferView.start();
                    break;
                case "ViewAlert":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示提示(' + type + ') ...');
                    if (!this.viewAlert) {
                        this.viewAlert = new BlackCat.ViewAlert();
                        this.views[type] = this.viewAlert;
                    }
                    this.viewAlert.start();
                    break;
                case "ViewConfirm":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示确认(' + type + ') ...');
                    if (!this.viewConfirm) {
                        this.viewConfirm = new BlackCat.ViewConfirm();
                        this.views[type] = this.viewConfirm;
                    }
                    this.viewConfirm.start();
                    break;
                case "ViewToast":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示Toast(' + type + ') ...');
                    if (!this.viewToast) {
                        this.viewToast = new BlackCat.ViewToast();
                    }
                    this.viewToast.start();
                    break;
                case "ViewLoading":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示Loading(' + type + ') ...');
                    if (!this.viewLoading) {
                        this.viewLoading = new BlackCat.ViewLoading();
                        this.views[type] = this.viewLoading;
                    }
                    this.viewLoading.start();
                    break;
                case "ViewTransConfirmGas":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示Gas转账确认(' + type + ') ...');
                    if (!this.viewTransConfirmGas) {
                        this.viewTransConfirmGas = new BlackCat.ViewTransConfirmGas();
                        this.views[type] = this.viewTransConfirmGas;
                    }
                    this.viewTransConfirmGas.start();
                    break;
                case "RegisterView":
                    console.log('[Bla Cat]', '[ViewMgr]', '注册(' + type + ') ...');
                    if (!this.registerView) {
                        this.registerView = new BlackCat.RegisterView();
                        this.views[type] = this.registerView;
                    }
                    this.registerView.start();
                    break;
                case "ForgetPasswordView":
                    console.log('[Bla Cat]', '[ViewMgr]', '忘记密码(' + type + ') ...');
                    if (!this.forgetPasswordView) {
                        this.forgetPasswordView = new BlackCat.ForgetPasswordView();
                        this.views[type] = this.forgetPasswordView;
                    }
                    this.forgetPasswordView.start();
                    break;
                case "ModifyImgView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示修改头像(' + type + ') ...');
                    if (!this.modifyImgView) {
                        this.modifyImgView = new BlackCat.ModifyImgView();
                        this.views[type] = this.modifyImgView;
                    }
                    this.modifyImgView.start();
                    break;
                case "ModifyNameView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示修改昵称(' + type + ') ...');
                    if (!this.modifyNameView) {
                        this.modifyNameView = new BlackCat.ModifyNameView();
                        this.views[type] = this.modifyNameView;
                    }
                    this.modifyNameView.start();
                    break;
                case "ModifySexView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示修改性别(' + type + ') ...');
                    if (!this.modifySexView) {
                        this.modifySexView = new BlackCat.ModifySexView();
                        this.views[type] = this.modifySexView;
                    }
                    this.modifySexView.start();
                    break;
                case "SecurityCenterView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示安全中心(' + type + ') ...');
                    if (!this.securityCenterView) {
                        this.securityCenterView = new BlackCat.SecurityCenterView();
                        this.views[type] = this.securityCenterView;
                    }
                    this.securityCenterView.start();
                    break;
                case "TrustContractView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示信任合约(' + type + ') ...');
                    if (!this.trustContractView) {
                        this.trustContractView = new BlackCat.TrustContractView();
                        this.views[type] = this.trustContractView;
                    }
                    this.trustContractView.start();
                    break;
                case "AutoLogoutWalletView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示自动登出钱包(' + type + ') ...');
                    if (!this.autoLogoutWalletView) {
                        this.autoLogoutWalletView = new BlackCat.AutoLogoutWalletView();
                        this.views[type] = this.autoLogoutWalletView;
                    }
                    this.autoLogoutWalletView.start();
                    break;
                case "AddressbookView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示通讯录(' + type + ') ...');
                    if (!this.addressbookView) {
                        this.addressbookView = new BlackCat.AddressbookView();
                        this.views[type] = this.addressbookView;
                    }
                    this.addressbookView.start();
                    break;
                case "AddressbookDetailsView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示通讯录详情(' + type + ') ...');
                    if (!this.addressbookDetailsView) {
                        this.addressbookDetailsView = new BlackCat.AddressbookDetailsView();
                        this.views[type] = this.addressbookDetailsView;
                    }
                    this.addressbookDetailsView.start();
                    break;
                case "AddressbookOpView":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示通讯录操作联系人信息(' + type + ') ...');
                    if (!this.addressbookOpView) {
                        this.addressbookOpView = new BlackCat.AddressbookOpView();
                        this.views[type] = this.addressbookOpView;
                    }
                    this.addressbookOpView.start();
                    break;
                case "ViewConnecting":
                    console.log('[Bla Cat]', '[ViewMgr]', '显示连接中(' + type + ') ...');
                    if (!this.viewConnecting) {
                        this.viewConnecting = new BlackCat.ViewConnecting();
                        this.views[type] = this.viewConnecting;
                    }
                    this.viewConnecting.start();
                    break;
            }
        }
        removeAll() {
            for (let className in this.views) {
                let v = this.views[className];
                console.log('[Bla Cat]', '[ViewMgr]', 'removeAll, view => ', v);
                switch (className) {
                    case "IconView":
                        v.reset();
                        break;
                    default:
                        if (v.isCreated) {
                            v.remove();
                        }
                        break;
                }
            }
        }
        update() {
            console.log('[Bla Cat]', '[ViewMgr]', 'update ...');
            for (let className in this.views) {
                let v = this.views[className];
                console.log('[Bla Cat]', '[ViewMgr]', 'update, v =>', v);
                switch (className) {
                    case "PayView":
                        if (v.isCreated) {
                            v.update();
                        }
                        break;
                    default:
                        if (v.isCreated && !v.isHidden()) {
                            v.update();
                        }
                        break;
                }
            }
        }
    }
    BlackCat.ViewMgr = ViewMgr;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewToast extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_alter", "pc_toast");
            var toast = this.objCreate("div");
            toast.classList.add("pc_alterbox");
            this.ObjAppend(this.div, toast);
            var alterText = this.objCreate("div");
            alterText.classList.add("pc_altertext");
            var lang_content = BlackCat.Main.langMgr.get(ViewToast.content);
            if (!lang_content) {
                lang_content = ViewToast.content;
            }
            alterText.textContent = lang_content;
            this.ObjAppend(toast, alterText);
        }
        show() {
            super.show();
            this.remove(ViewToast.showTime, null);
        }
    }
    ViewToast.showTime = 1500;
    BlackCat.ViewToast = ViewToast;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewTransConfirm extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!ViewTransConfirm.list) {
                ViewTransConfirm.list = new BlackCat.walletLists();
            }
        }
        start() {
            if (this.isCreated) {
                this.remove();
            }
            super.start();
            if (this.div.clientHeight < 667) {
                this.divConfirmSelect.style.top = "auto";
                this.divConfirmSelect.style.bottom = "0";
            }
            this.trust = "0";
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_listdetail", "pc_tradeconfirm", "pc_trust");
            if (ViewTransConfirm.list && ViewTransConfirm.list.hasOwnProperty("wallet")) {
                var headerTitle = this.objCreate("div");
                headerTitle.classList.add("pc_header");
                var returnBtn = this.objCreate("a");
                returnBtn.classList.add("iconfont", "icon-fanhui");
                returnBtn.textContent = BlackCat.Main.langMgr.get("return");
                returnBtn.onclick = () => {
                    this.return();
                    if (ViewTransConfirm.callback_cancel) {
                        ViewTransConfirm.callback_cancel();
                        ViewTransConfirm.callback_cancel = null;
                    }
                };
                this.ObjAppend(headerTitle, returnBtn);
                var h1Obj = this.objCreate("h1");
                h1Obj.textContent = BlackCat.Main.platName;
                this.ObjAppend(headerTitle, h1Obj);
                this.ObjAppend(this.div, headerTitle);
                var contentObj = this.objCreate("div");
                contentObj.classList.add("pc_detail");
                contentObj.style.paddingBottom = "120px";
                contentObj.innerHTML
                    = '<ul>'
                        + '<li>'
                        + '<div class="pc_listimg">'
                        + '<img src="' + BlackCat.Main.viewMgr.payView.getListImg(ViewTransConfirm.list) + '">'
                        + '</div>'
                        + '<div class="pc_liftinfo">'
                        + '<div class="pc_listname">' + BlackCat.Main.viewMgr.payView.getListName(ViewTransConfirm.list) + '</div>'
                        + '<span class="pc_listdate">' + BlackCat.Main.viewMgr.payView.getListCtm(ViewTransConfirm.list) + '</span>'
                        + '</div>'
                        + '<div class="pc_cnts ' + BlackCat.Main.viewMgr.payView.getListCntsClass(ViewTransConfirm.list) + ' ">'
                        + this.getCnts()
                        + '</div>'
                        + '</li>'
                        + '<li><label>' + BlackCat.Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                        + this.getParams()
                        + '</ul>';
                this.ObjAppend(this.div, contentObj);
                this.divConfirmSelect = this.objCreate("div");
                this.divConfirmSelect.classList.add("pc_tradeconfirmbut");
                this.ObjAppend(this.div, this.divConfirmSelect);
                this.divTrust = this.objCreate("div");
                this.divTrust.classList.add("pc_switchbox");
                this.divTrust.textContent = BlackCat.Main.langMgr.get("pay_trust_tips");
                this.ObjAppend(this.divConfirmSelect, this.divTrust);
                var labelTrust = this.objCreate("label");
                labelTrust.textContent = BlackCat.Main.langMgr.get("pay_trust_Vice_tips");
                this.ObjAppend(this.divTrust, labelTrust);
                var trustObj = this.objCreate("a");
                trustObj.classList.add("pc_switch");
                trustObj.onclick = () => {
                    if (this.trust == "0") {
                        this.trust = "1";
                        trustObj.classList.add("pc_switch_active");
                    }
                    else {
                        this.trust = "0";
                        trustObj.classList.remove("pc_switch_active");
                    }
                };
                this.ObjAppend(this.divTrust, trustObj);
                var spanSwitchBut = this.objCreate("span");
                this.ObjAppend(trustObj, spanSwitchBut);
                var cancelObj = this.objCreate("button");
                cancelObj.classList.add("pc_cancel");
                cancelObj.textContent = BlackCat.Main.langMgr.get("cancel");
                cancelObj.onclick = () => {
                    console.log('[Bla Cat]', '[ViewTransConfirm]', '交易取消..');
                    if (ViewTransConfirm.callback_cancel) {
                        ViewTransConfirm.callback_cancel(ViewTransConfirm.callback_params);
                        ViewTransConfirm.callback_cancel = null;
                    }
                    this.remove();
                };
                this.ObjAppend(this.divConfirmSelect, cancelObj);
                var confirmObj = this.objCreate("button");
                if (ViewTransConfirm.list.type == "3") {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("pay_makeRecharge");
                }
                else {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
                }
                confirmObj.onclick = () => {
                    console.log('[Bla Cat]', '[ViewTransConfirm]', '交易确认..');
                    ViewTransConfirm.callback(ViewTransConfirm.callback_params, this.trust);
                    ViewTransConfirm.callback = null;
                    this.remove(300);
                };
                this.ObjAppend(this.divConfirmSelect, confirmObj);
            }
        }
        toRefer() {
            if (ViewTransConfirm.refer) {
                BlackCat.Main.viewMgr.change(ViewTransConfirm.refer);
                ViewTransConfirm.refer = null;
            }
        }
        getCnts() {
            return ViewTransConfirm.list.cnts != '0' ? ViewTransConfirm.list.cnts : "";
        }
        getWallet() {
            return ViewTransConfirm.list.wallet;
        }
        getParams() {
            var html = "";
            var params = ViewTransConfirm.list.params;
            console.log('[Bla Cat]', '[ViewTransConfirm]', 'getParams, params => ', params);
            if (params) {
                try {
                    params = JSON.parse(params);
                    if (params.hasOwnProperty("nnc")) {
                        params = [params];
                    }
                    if (params instanceof Array) {
                        for (let k in params) {
                            html += '<li class="pc_contractAddress">'
                                + '<div><label>' + BlackCat.Main.langMgr.get("paylist_nnc") + '</label><p>' + params[k].nnc + '</p></div>'
                                + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbParamJson") + '</label><p>' + params[k].sbParamJson + '</p></div>'
                                + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbPushString") + '</label><p>' + params[k].sbPushString + '</p></div>'
                                + '</li>';
                        }
                    }
                }
                catch (e) {
                    console.log('[Bla Cat]', '[ViewTransConfirm]', 'getParams error => ', e.toString());
                }
            }
            return html;
        }
    }
    BlackCat.ViewTransConfirm = ViewTransConfirm;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewTransConfirmGas extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!ViewTransConfirmGas.list) {
                ViewTransConfirmGas.list = new BlackCat.walletLists();
            }
        }
        start() {
            if (this.isCreated) {
                this.remove();
            }
            super.start();
            if (this.div.clientHeight < 667) {
                this.divConfirmSelect.style.top = "auto";
                this.divConfirmSelect.style.bottom = "0";
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_listdetail", "pc_tradeconfirm");
            if (ViewTransConfirmGas.list && ViewTransConfirmGas.list.hasOwnProperty("wallet")) {
                var headerTitle = this.objCreate("div");
                headerTitle.classList.add("pc_header");
                var returnBtn = this.objCreate("a");
                returnBtn.classList.add("iconfont", "icon-fanhui");
                returnBtn.textContent = BlackCat.Main.langMgr.get("return");
                returnBtn.onclick = () => {
                    this.return();
                    if (ViewTransConfirmGas.callback_cancel) {
                        ViewTransConfirmGas.callback_cancel();
                        ViewTransConfirmGas.callback_cancel = null;
                    }
                };
                this.ObjAppend(headerTitle, returnBtn);
                var h1Obj = this.objCreate("h1");
                h1Obj.textContent = BlackCat.Main.platName;
                this.ObjAppend(headerTitle, h1Obj);
                this.ObjAppend(this.div, headerTitle);
                var contentObj = this.objCreate("div");
                contentObj.classList.add("pc_detail");
                contentObj.style.paddingBottom = "90px";
                contentObj.innerHTML
                    = '<ul>'
                        + '<li>'
                        + '<div class="pc_listimg">'
                        + '<img src="' + BlackCat.Main.viewMgr.payView.getListImg(ViewTransConfirmGas.list) + '">'
                        + '</div>'
                        + '<div class="pc_liftinfo">'
                        + '<div class="pc_listname">' + BlackCat.Main.viewMgr.payView.getListName(ViewTransConfirmGas.list) + '</div>'
                        + '<span class="pc_listdate">' + BlackCat.Main.viewMgr.payView.getListCtm(ViewTransConfirmGas.list) + '</span>'
                        + '</div>'
                        + '<div class="pc_cnts ' + BlackCat.Main.viewMgr.payView.getListCntsClass(ViewTransConfirmGas.list) + ' ">'
                        + this.getCnts()
                        + '</div>'
                        + '</li>'
                        + '<li><label>' + BlackCat.Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                        + this.getParams()
                        + '</ul>';
                this.ObjAppend(this.div, contentObj);
                this.divConfirmSelect = this.objCreate("div");
                this.divConfirmSelect.classList.add("pc_tradeconfirmbut");
                this.ObjAppend(this.div, this.divConfirmSelect);
                var cancelObj = this.objCreate("button");
                cancelObj.classList.add("pc_cancel");
                cancelObj.textContent = BlackCat.Main.langMgr.get("cancel");
                cancelObj.onclick = () => {
                    console.log('[Bla Cat]', '[ViewTransConfirmGas]', 'PayTransfer交易取消..');
                    if (ViewTransConfirmGas.callback_cancel) {
                        ViewTransConfirmGas.callback_cancel(ViewTransConfirmGas.callback_params);
                        ViewTransConfirmGas.callback_cancel = null;
                    }
                    this.remove();
                };
                this.ObjAppend(this.divConfirmSelect, cancelObj);
                var confirmObj = this.objCreate("button");
                if (ViewTransConfirmGas.list.type == "3") {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("pay_makeRecharge");
                }
                else {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
                }
                confirmObj.onclick = () => {
                    console.log('[Bla Cat]', '[ViewTransConfirmGas]', 'PayTransfer交易确认..');
                    ViewTransConfirmGas.callback(ViewTransConfirmGas.callback_params);
                    ViewTransConfirmGas.callback = null;
                    this.remove(300);
                };
                this.ObjAppend(this.divConfirmSelect, confirmObj);
            }
        }
        toRefer() {
            if (ViewTransConfirmGas.refer) {
                BlackCat.Main.viewMgr.change(ViewTransConfirmGas.refer);
                ViewTransConfirmGas.refer = null;
            }
        }
        getCnts() {
            return ViewTransConfirmGas.list.cnts != '0' ? ViewTransConfirmGas.list.cnts : "";
        }
        getWallet() {
            return ViewTransConfirmGas.list.wallet;
        }
        getParams() {
            var html = "";
            var params = ViewTransConfirmGas.list.params;
            console.log('[Bla Cat]', '[ViewTransConfirmGas]', 'getParams, params => ', params);
            if (params) {
                try {
                    params = JSON.parse(params);
                    if (params.hasOwnProperty("toaddr")) {
                        params = [params];
                    }
                    if (params instanceof Array) {
                        for (let k in params) {
                            html += '<li class="pc_contractAddress">'
                                + '<div><label>' + BlackCat.Main.langMgr.get("pay_transferGas_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                + '<div><label>' + BlackCat.Main.langMgr.get("pay_transferGas_count") + '</label><p>' + params[k].count + '</p></div>'
                                + '</li>';
                        }
                    }
                }
                catch (e) {
                    console.log('[Bla Cat]', '[ViewTransConfirmGas]', 'getParams error => ', e.toString());
                }
            }
            return html;
        }
    }
    BlackCat.ViewTransConfirmGas = ViewTransConfirmGas;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewTransCount extends BlackCat.ViewBase {
        start() {
            super.start();
            this.inputCount.focus();
            if (ViewTransCount.transType == "old") {
                this.div.classList.add("pc_old");
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("pay_transCount_count");
            this.ObjAppend(popupbox, popupTitle);
            var divtransfertype = this.objCreate("div");
            divtransfertype.classList.add("pc_transfertype", "pc_token", "iconfont");
            divtransfertype.innerHTML = BlackCat.Main.langMgr.get("pay_" + ViewTransCount.transType);
            if (ViewTransCount.transType == "old") {
                divtransfertype.innerHTML += ViewTransCount.transBalances;
            }
            this.ObjAppend(popupbox, divtransfertype);
            this.inputCount = this.objCreate("input");
            this.inputCount.type = "text";
            this.inputCount.style.marginTop = "0";
            this.inputCount.placeholder = BlackCat.Main.langMgr.get("pay_transCount_inputCount");
            this.ObjAppend(popupbox, this.inputCount);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var confirmObj = this.objCreate("button");
            confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
            confirmObj.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, confirmObj);
        }
        toRefer() {
            if (ViewTransCount.refer) {
                BlackCat.Main.viewMgr.change(ViewTransCount.refer);
                ViewTransCount.refer = null;
            }
        }
        doConfirm() {
            if (!this.inputCount.value) {
                this.inputCount.focus();
                return;
            }
            if (!BlackCat.Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                BlackCat.Main.showErrMsg('pay_transCount_err', () => {
                    this.inputCount.focus();
                });
                return;
            }
            switch (ViewTransCount.transType) {
                case 'sgas2gas':
                    if (BlackCat.Main.viewMgr.payView.sgas < Number(this.inputCount.value)) {
                        BlackCat.Main.showErrMsg('pay_makeRefundSgasNotEnough', () => {
                            this.inputCount.focus();
                        });
                        return;
                    }
                    break;
                case 'gas2sgas':
                    if (BlackCat.Main.viewMgr.payView.gas < Number(this.inputCount.value)) {
                        BlackCat.Main.showErrMsg('pay_makeMintGasNotEnough', () => {
                            this.inputCount.focus();
                        });
                        return;
                    }
                    break;
            }
            this.remove(300);
            ViewTransCount.callback();
            ViewTransCount.callback = null;
        }
    }
    BlackCat.ViewTransCount = ViewTransCount;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewWalletOpen extends BlackCat.ViewBase {
        start() {
            super.start();
            this.inputPassword.focus();
        }
        create() {
            this.doReadWalletFile();
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("pay_walletOpen_password");
            this.ObjAppend(popupbox, popupTitle);
            this.inputPassword = this.objCreate("input");
            this.inputPassword.type = "password";
            this.inputPassword.style.marginTop = "40px";
            this.inputPassword.style.width = "60%";
            this.inputPassword.placeholder = BlackCat.Main.langMgr.get("pay_walletOpen_inputPassword");
            this.ObjAppend(popupbox, this.inputPassword);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
                if (ViewWalletOpen.callback_cancel) {
                    if (ViewWalletOpen.callback_callback) {
                        ViewWalletOpen.callback_cancel(ViewWalletOpen.callback_params, ViewWalletOpen.callback_callback);
                    }
                    else {
                        ViewWalletOpen.callback_cancel(ViewWalletOpen.callback_params);
                    }
                }
                ViewWalletOpen.callback_cancel = null;
                ViewWalletOpen.callback_params = null;
                ViewWalletOpen.callback_callback = null;
            };
            this.ObjAppend(popupbutbox, popupClose);
            var confirmObj = this.objCreate("button");
            confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
            confirmObj.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, confirmObj);
        }
        toRefer() {
            if (ViewWalletOpen.refer) {
                BlackCat.Main.viewMgr.change(ViewWalletOpen.refer);
                ViewWalletOpen.refer = null;
            }
        }
        doConfirm() {
            if (!this.inputPassword.value) {
                BlackCat.Main.showErrMsg('pay_walletOpen_inputPassword_err', () => {
                    this.inputPassword.focus();
                });
                return;
            }
            this.doOpenWallet();
        }
        doReadWalletFile() {
            return __awaiter(this, void 0, void 0, function* () {
                var readfile = yield BlackCat.Main.wallet.readWalletFile(1);
                if (!readfile) {
                    BlackCat.Main.showErrMsg(("pay_walletOpen_file_error"));
                    return;
                }
            });
        }
        doOpenWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                var open = yield BlackCat.Main.wallet.open(this.inputPassword.value);
                BlackCat.Main.viewMgr.viewLoading.remove();
                if (!open) {
                    BlackCat.Main.showErrMsg(("pay_walletOpen_openFail"));
                    return;
                }
                this.remove();
                if (ViewWalletOpen.callback) {
                    if (ViewWalletOpen.callback_callback) {
                        ViewWalletOpen.callback(ViewWalletOpen.callback_params, ViewWalletOpen.callback_callback);
                    }
                    else {
                        ViewWalletOpen.callback(ViewWalletOpen.callback_params);
                    }
                }
                ViewWalletOpen.callback = null;
                ViewWalletOpen.callback_params = null;
                ViewWalletOpen.callback_callback = null;
                if (ViewWalletOpen.tasks) {
                    this.doOpenTasks();
                }
            });
        }
        static addTask(type, params) {
            if (!ViewWalletOpen.tasks) {
                ViewWalletOpen.tasks = {};
            }
            if (ViewWalletOpen.tasks[type]) {
                for (let k in params) {
                    ViewWalletOpen.tasks[type].push(params[k]);
                }
            }
            else {
                ViewWalletOpen.tasks[type] = params;
            }
            console.log('[Bla Cat]', '[ViewWalletOpen]', 'addTask, tasks => ', ViewWalletOpen.tasks);
        }
        static removeTask(type) {
            delete ViewWalletOpen.tasks[type];
        }
        doOpenTasks() {
            console.log('[Bla Cat]', '[ViewWalletOpen]', 'doOpenTasks, tasks => ', ViewWalletOpen.tasks);
            for (let k in ViewWalletOpen.tasks) {
                if (ViewWalletOpen.tasks[k]) {
                    switch (k) {
                        case "getPlatNotifys":
                            for (let i in ViewWalletOpen.tasks[k]) {
                                let params = ViewWalletOpen.tasks[k][i];
                                delete BlackCat.Main.platNotifyTxids[params.txid];
                            }
                            BlackCat.Main.needGetPlatNotifys = true;
                            break;
                    }
                }
            }
        }
    }
    BlackCat.ViewWalletOpen = ViewWalletOpen;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class WalletCreateView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.wallet = new ThinNeo.nep6wallet();
        }
        create() {
            this.div = this.objCreate('div');
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("walletCreate_create");
            this.ObjAppend(popupbox, popupTitle);
            this.inputPwd = this.objCreate("input");
            this.inputPwd.type = "password";
            this.inputPwd.placeholder = BlackCat.Main.langMgr.get("walletCreate_password");
            this.ObjAppend(popupbox, this.inputPwd);
            this.inputVwd = this.objCreate("input");
            this.inputVwd.type = "password";
            this.inputVwd.placeholder = BlackCat.Main.langMgr.get("walletCreate_vpass");
            this.ObjAppend(popupbox, this.inputVwd);
            var createPrompt = this.objCreate("div");
            createPrompt.classList.add("pc_prompt");
            createPrompt.textContent = BlackCat.Main.langMgr.get("walletCreate_password_notice");
            this.ObjAppend(popupbox, createPrompt);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var doCreate = this.objCreate("button");
            doCreate.textContent = BlackCat.Main.langMgr.get("walletCreate_doCreate");
            doCreate.onclick = () => {
                this.doCreate();
            };
            this.ObjAppend(popupbutbox, doCreate);
        }
        show() {
            super.show();
            this.inputPwd.focus();
        }
        createVerifyPwd() {
            var pwd = this.inputPwd.value;
            if (!pwd || pwd.toString().length == 0) {
                return false;
            }
            return true;
        }
        createVerifyVwd() {
            var pwd = this.inputPwd.value;
            var vwd = this.inputVwd.value;
            if (!vwd || vwd.toString().length == 0 || pwd != vwd) {
                return false;
            }
            return true;
        }
        doCreate() {
            if (!this.createVerifyPwd()) {
                BlackCat.Main.showErrMsg(("walletCreate_check_pass"), () => {
                    this.inputPwd.focus();
                });
                return;
            }
            if (!this.createVerifyVwd()) {
                BlackCat.Main.showErrMsg(("walletCreate_check_vpass"), () => {
                    this.inputVwd.focus();
                });
                return;
            }
            BlackCat.Main.viewMgr.change("ViewLoading");
            setTimeout(() => {
                var array = new Uint8Array(32);
                var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues(array);
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
                    ThinNeo.Helper.GetNep2FromPrivateKey(key, this.inputPwd.value, this.wallet.scrypt.N, this.wallet.scrypt.r, this.wallet.scrypt.p, (info, result) => __awaiter(this, void 0, void 0, function* () {
                        if (info == "finish") {
                            this.wallet.accounts[0].nep2key = result;
                            this.wallet.accounts[0].contract = new ThinNeo.contract();
                            var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
                            this.wallet.accounts[0].contract.script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey).toHexString();
                            var jsonstr = JSON.stringify(this.wallet.toJson());
                            yield this.doBindWallet();
                        }
                        BlackCat.Main.viewMgr.viewLoading.remove();
                    }));
                }
                catch (e) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    console.log('[Bla Cat]', '[WalletCreateView]', 'doCreate, ThinNeo.Helper.GetNep2FromPrivateKey error => ', e.toString());
                }
            }, 300);
        }
        doBindWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                var wallet_bind_res = yield BlackCat.ApiTool.bindWallet(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, JSON.stringify(this.wallet.toJson()));
                if (wallet_bind_res.r) {
                    BlackCat.Main.validateLogin();
                    this.remove();
                    BlackCat.Main.viewMgr.walletView.remove();
                }
                else {
                    BlackCat.Main.showErrCode(wallet_bind_res.errCode);
                }
            });
        }
    }
    BlackCat.WalletCreateView = WalletCreateView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class LoginInfo {
            static ArrayToString(array) {
                var obj = [];
                for (var i = 0; i < array.length; i++) {
                    obj.push({});
                    obj[i].pubkey = array[i].pubkey.toHexString();
                    obj[i].prikey = array[i].prikey.toHexString();
                    obj[i].address = array[i].address;
                }
                return JSON.stringify(obj);
            }
            static StringToArray(str) {
                var obj = JSON.parse(str);
                var arr = [];
                for (var i = 0; i < obj.length; i++) {
                    arr.push(new LoginInfo());
                    var str = obj[i].prikey;
                    var str2 = obj[i].pubkey;
                    arr[i].prikey = str.hexToBytes();
                    arr[i].pubkey = str2.hexToBytes();
                    arr[i].address = obj[i].address;
                }
                return arr;
            }
            static getCurrentLogin() {
                var address = LoginInfo.getCurrentAddress();
                var arr = tools.StorageTool.getLoginArr();
                try {
                    var n = arr.findIndex(info => info.address == address);
                }
                catch (e) {
                    var n;
                    for (let i = 0; i < arr.length; i++) {
                        if (address == arr[i].address) {
                            n = i;
                            break;
                        }
                    }
                }
                return arr[n];
            }
            static getCurrentAddress() {
                return tools.StorageTool.getStorage("current-address");
            }
            static setCurrentAddress(str) {
                tools.StorageTool.setStorage("current-address", str);
            }
        }
        tools.LoginInfo = LoginInfo;
        class BalanceInfo {
            static jsonToArray(json) {
                let arr = new Array();
                for (const i in json) {
                    if (json.hasOwnProperty(i)) {
                        const element = json[i];
                        let balance = new BalanceInfo();
                        balance.asset = element["asset"];
                        balance.balance = element["balance"];
                        balance.name = element["balance"];
                        balance.names = element["names"];
                        balance.type = element["type"];
                        arr.push(balance);
                    }
                }
                return arr;
            }
            static getBalancesByArr(balances, nep5balances, height) {
                let balancearr = [];
                if (balances) {
                    balances.map((item) => {
                        item.names = tools.CoinTool.assetID2name[item.asset];
                        let a = tools.StorageTool.getStorage(item.asset);
                        if (a) {
                            let obj = JSON.parse(a);
                            let h = obj["height"];
                            height - h > 1 ? tools.StorageTool.delStorage(item.asset) : item.balance = obj["balance"]["balance"];
                        }
                    });
                    balancearr = balances;
                }
                if (nep5balances) {
                    for (let index = 0; index < nep5balances.length; index++) {
                        const nep5 = nep5balances[index];
                        var nep5b = new BalanceInfo();
                        let id = nep5.assetid.replace("0x", "");
                        id = id.substring(0, 4) + '...' + id.substring(id.length - 4);
                        nep5b.asset = nep5.assetid;
                        nep5b.balance = nep5.balance;
                        nep5b.names = nep5.symbol + "(" + id + ")";
                        nep5b.type = "nep5";
                        balancearr.push(nep5b);
                    }
                }
                return balancearr;
            }
            static setBalanceSotre(balance, height) {
                tools.StorageTool.setStorage(balance.asset, JSON.stringify({ height, balance }));
                console.log(tools.StorageTool.getStorage(balance.asset));
            }
        }
        tools.BalanceInfo = BalanceInfo;
        class Nep5Balance {
        }
        tools.Nep5Balance = Nep5Balance;
        class Result {
        }
        tools.Result = Result;
        let AssetEnum;
        (function (AssetEnum) {
            AssetEnum["NEO"] = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
            AssetEnum["GAS"] = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
        })(AssetEnum = tools.AssetEnum || (tools.AssetEnum = {}));
        class NeoAsset {
        }
        tools.NeoAsset = NeoAsset;
        class OldUTXO {
            constructor(txid, n) {
                this.n = n;
                this.txid = txid;
            }
            static oldutxosPush(olds) {
                let arr = this.getOldutxos();
                tools.StorageTool.setStorage("old-utxos", JSON.stringify(arr.concat(olds)));
            }
            static setOldutxos(olds) {
                tools.StorageTool.setStorage("old-utxos", JSON.stringify(olds));
            }
            static getOldutxos() {
                var arr = new Array();
                var str = tools.StorageTool.getStorage("old-utxos");
                if (str)
                    arr = JSON.parse(str);
                return arr;
            }
            compareUtxo(utxo) {
                return this.txid == utxo.txid && this.n == utxo.n;
            }
        }
        tools.OldUTXO = OldUTXO;
        class UTXO {
            static ArrayToString(utxos) {
                var str = "";
                var obj = [];
                for (var i = 0; i < utxos.length; i++) {
                    obj.push({});
                    obj[i].n = utxos[i].n;
                    obj[i].addr = utxos[i].addr;
                    obj[i].txid = utxos[i].txid;
                    obj[i].asset = utxos[i].asset;
                    obj[i].count = utxos[i].count.toString();
                }
                return obj;
            }
            static StringToArray(obj) {
                var utxos = new Array();
                for (var i = 0; i < obj.length; i++) {
                    utxos.push(new UTXO);
                    var str = obj[i].count;
                    utxos[i].n = obj[i].n;
                    utxos[i].addr = obj[i].addr;
                    utxos[i].txid = obj[i].txid;
                    utxos[i].asset = obj[i].asset;
                    utxos[i].count = Neo.Fixed8.parse(str);
                }
                return utxos;
            }
            static setAssets(assets) {
                var obj = {};
                for (var asset in assets) {
                    let arr = UTXO.ArrayToString(assets[asset]);
                    obj[asset] = arr;
                }
                sessionStorage.setItem("current-assets-utxos", JSON.stringify(obj));
            }
            static getAssets() {
                let assets = null;
                var str = sessionStorage.getItem("current-assets-utxos");
                if (str !== null && str != undefined && str != '') {
                    assets = JSON.parse(str);
                    for (const asset in assets) {
                        assets[asset] = UTXO.StringToArray(assets[asset]);
                    }
                }
                return assets;
            }
        }
        tools.UTXO = UTXO;
        class Consts {
        }
        Consts.baseContract = "954f285a93eed7b4aed9396a7806a5812f1a5950";
        Consts.registerContract = "d6a5e965f67b0c3e5bec1f04f028edb9cb9e3f7c";
        tools.Consts = Consts;
        class DomainInfo {
        }
        tools.DomainInfo = DomainInfo;
        class RootDomainInfo extends DomainInfo {
            constructor() {
                super();
            }
        }
        tools.RootDomainInfo = RootDomainInfo;
        class Transactionforaddr {
        }
        tools.Transactionforaddr = Transactionforaddr;
        class History {
            static setHistoryStore(history, height) {
                let arr = this.getHistoryStore();
                arr.push({ height, history });
                tools.StorageTool.setStorage("history-txs", JSON.stringify(arr));
            }
            static getHistoryStore() {
                let str = tools.StorageTool.getStorage("history-txs");
                let arr = !!str ? JSON.parse(str) : [];
                return arr;
            }
            static delHistoryStoreByHeight(height) {
                let arr = this.getHistoryStore();
                if (arr.length > 0) {
                    let newarr = [];
                    arr.map(his => {
                        let h = parseInt(his.height);
                        if (height - h < 2) {
                            newarr.push(his);
                        }
                    });
                    tools.StorageTool.setStorage("history-txs", JSON.stringify(newarr));
                }
            }
        }
        tools.History = History;
        class Claim {
            constructor(json) {
                this.addr = json['addr'];
                this.asset = json['asset'];
                this.claimed = json['claimed'];
                this.createHeight = json['createHeight'];
                this.n = json['n'];
                this.txid = json['txid'];
                this.useHeight = json['useHeight'];
                this.used = json['used'];
                this.value = json['value'];
            }
            static strToClaimArray(arr) {
                let claimarr = new Array();
                for (const i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        claimarr.push(new Claim(arr[i]));
                    }
                }
                return claimarr;
            }
        }
        tools.Claim = Claim;
        class Domainmsg {
        }
        tools.Domainmsg = Domainmsg;
        class DomainStatus {
            static setStatus(domain) {
                let str = sessionStorage.getItem("domain-status");
                var arr = {};
                if (str) {
                    arr = JSON.parse(str);
                    let msg = arr[domain.domainname];
                    msg ? msg : msg = new DomainStatus();
                    domain.await_mapping ? msg["await_mapping"] = domain.await_mapping : "";
                    domain.await_register ? msg["await_register"] = domain.await_register : "";
                    domain.await_resolver ? msg["await_resolver"] = domain.await_resolver : "";
                    domain.mapping ? msg["mapping"] = domain.mapping : "";
                    domain.resolver ? msg["resolver"] = domain.resolver.replace("0x", "") : "";
                    arr[domain.domainname] = msg;
                }
                else {
                    arr[domain.domainname] = domain;
                }
                sessionStorage.setItem("domain-status", JSON.stringify(arr));
            }
            static getStatus() {
                let str = sessionStorage.getItem("domain-status");
                let obj = {};
                str ? obj = JSON.parse(sessionStorage.getItem("domain-status")) : {};
                return obj;
            }
        }
        tools.DomainStatus = DomainStatus;
        class WalletOtcgo {
            fromJsonStr(str) {
                let json = JSON.parse(str);
                let otcgo = new WalletOtcgo();
                this.address = json["address"];
                this.publicKey = json["publicKey"];
                this.publicKeyCompressed = json["publicKeyCompressed"];
                this.privateKeyEncrypted = json["privateKeyEncrypted"];
            }
            otcgoDecrypt(pwd) {
                try {
                    this.privatekey = CryptoJS.AES.decrypt(this.privateKeyEncrypted, pwd).toString(CryptoJS.enc.Utf8);
                    this.prikey = this.privatekey.hexToBytes();
                    this.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(this.prikey);
                }
                catch (error) {
                    console.log(error);
                }
            }
            doSign(prvkey, msg) {
                const sig = new KJUR.crypto.Signature({ 'alg': 'SHA256withECDSA' });
                sig.initSign({
                    'ecprvhex': prvkey,
                    'eccurvename': 'secp256r1'
                });
                sig.updateString(msg);
                return sig.sign();
            }
            doVerify(pubkey, msg, sigval) {
                const sig = new KJUR.crypto.Signature({
                    'alg': 'SHA256withECDSA',
                    'prov': 'cryptojs/jsrsa'
                });
                sig.initVerifyByPublicKey({
                    'ecpubhex': pubkey,
                    'eccurvename': 'secp256r1'
                });
                sig.updateString(msg);
                return sig.verify(sigval);
            }
            doValidatePwd() {
                if (this.prikey.length === 0)
                    return false;
                const msg = 'aaa';
                const sigval = this.doSign(this.privatekey, msg);
                return this.doVerify(this.publicKey, msg, sigval);
            }
        }
        tools.WalletOtcgo = WalletOtcgo;
        class MyAuction {
        }
        tools.MyAuction = MyAuction;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class WalletImportView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.filename = "";
            this.reader = new FileReader();
            this.reader.onload = () => __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.Main.wallet.setWalletStr(this.reader.result);
                if (!res) {
                    BlackCat.Main.showErrMsg(("walletImport_invalid_file"));
                    this.filename = "";
                    this.inputFileText.placeholder = BlackCat.Main.langMgr.get("walletImport_select_file");
                }
                else {
                    this.inputFileText.placeholder = this.filename;
                }
            });
            this.filepass = "";
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("walletImport_import");
            this.ObjAppend(popupbox, popupTitle);
            this.inputFileText = this.objCreate("input");
            this.inputFileText.classList.add("pc_filetitle");
            this.inputFileText.type = "text";
            this.inputFileText.placeholder = BlackCat.Main.langMgr.get("walletImport_select_file");
            this.ObjAppend(popupbox, this.inputFileText);
            var inputFileI = this.objCreate("i");
            inputFileI.classList.add("pc_upload", "iconfont", "icon-wenjianjia");
            this.ObjAppend(popupbox, inputFileI);
            this.inputFile = this.objCreate("input");
            this.inputFile.type = "file";
            this.inputFile.onchange = () => {
                if (this.inputFile.files && this.inputFile.files.length > 0) {
                    this.filename = this.inputFile.files[0].name;
                    this.reader.readAsText(this.inputFile.files[0]);
                }
                else {
                    this.inputFileText.placeholder = BlackCat.Main.langMgr.get("walletImport_select_file");
                    this.filename = "";
                }
            };
            this.ObjAppend(popupbox, this.inputFile);
            this.inputPwd = this.objCreate("input");
            this.inputPwd.placeholder = BlackCat.Main.langMgr.get("walletImport_password");
            this.inputPwd.type = "password";
            this.ObjAppend(popupbox, this.inputPwd);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var bindobj = this.objCreate("button");
            bindobj.textContent = BlackCat.Main.langMgr.get("walletImport_doImport");
            bindobj.onclick = () => {
                this.doBindWallet();
            };
            this.ObjAppend(popupbutbox, bindobj);
        }
        doBindWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.filename) {
                    BlackCat.Main.showErrMsg(("walletImport_select_file"));
                    return;
                }
                this.filepass = this.inputPwd.value;
                if (!this.filepass || this.filepass.toString().length == 0) {
                    BlackCat.Main.showErrMsg(("walletImport_password"), () => {
                        this.inputPwd.focus();
                    });
                    return;
                }
                BlackCat.Main.viewMgr.change("ViewLoading");
                var res = yield BlackCat.Main.wallet.open(this.filepass);
                if (res) {
                    this.bindWallet(BlackCat.Main.wallet.filestr);
                }
                BlackCat.Main.viewMgr.viewLoading.remove();
            });
        }
        bindWallet(walletStr) {
            return __awaiter(this, void 0, void 0, function* () {
                var wallet_bind_res = yield BlackCat.ApiTool.bindWallet(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, walletStr);
                if (wallet_bind_res.r) {
                    BlackCat.Main.showToast("walletImport_bind_succ");
                    BlackCat.Main.viewMgr.walletView.remove();
                    this.remove();
                    BlackCat.Main.validateLogin();
                }
                else {
                    BlackCat.Main.showErrCode(wallet_bind_res.errCode);
                }
            });
        }
    }
    BlackCat.WalletImportView = WalletImportView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class WalletView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_wallet");
            var walletTitle = this.objCreate("div");
            walletTitle.classList.add("pc_wallet_title");
            this.ObjAppend(this.div, walletTitle);
            var walletTitleH1 = this.objCreate("h1");
            walletTitleH1.classList.add("iconfont", "icon-blacat");
            this.ObjAppend(walletTitle, walletTitleH1);
            var walletTitleP = this.objCreate("p");
            walletTitleP.innerText = BlackCat.Main.langMgr.get("walletView_info");
            this.ObjAppend(walletTitle, walletTitleP);
            var createWallet = this.objCreate("button");
            createWallet.textContent = BlackCat.Main.langMgr.get("walletView_create");
            createWallet.classList.add("pc_createWallet");
            createWallet.onclick = () => {
                BlackCat.Main.viewMgr.change("WalletCreateView");
            };
            this.ObjAppend(this.div, createWallet);
            var iCreateWallet = this.objCreate("i");
            iCreateWallet.classList.add("iconfont", "icon-chuangjian1");
            this.ObjAppend(createWallet, iCreateWallet);
            var importWallet = this.objCreate("button");
            importWallet.textContent = BlackCat.Main.langMgr.get("walletView_import");
            importWallet.classList.add("pc_importWallet");
            importWallet.onclick = () => {
                BlackCat.Main.viewMgr.change("WalletImportView");
            };
            this.ObjAppend(this.div, importWallet);
            var iImportWallet = this.objCreate("i");
            iImportWallet.classList.add("iconfont", "icon-daoru1");
            this.ObjAppend(importWallet, iImportWallet);
        }
    }
    BlackCat.WalletView = WalletView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ApiTool {
        static makeUrl(cmd) {
            return this.base_url + '?cmd=' + cmd;
        }
        static common(cmd, post) {
            return __awaiter(this, void 0, void 0, function* () {
                let formData = new FormData();
                for (let i in post) {
                    formData.append(i, post[i]);
                }
                formData.append("v", this.api_version);
                var result = yield fetch(this.makeUrl(cmd), {
                    method: 'post',
                    body: formData
                });
                var json = yield result.json();
                return json;
            });
        }
        static isLogined(uid, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.isLogined', { uid: uid, token: token });
            });
        }
        static getPhoneCode(phone) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_phone.get_code', { phone: phone });
            });
        }
        static getGameIndex() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('nelapp_game.index', {});
            });
        }
        static phoneLogin(phone, code) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_phone.login', { phone: phone, code: code });
            });
        }
        static bindWallet(uid, token, wallet) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.bind_wallet', { uid: uid, token: token, wallet: wallet });
            });
        }
        static getWalletFile(uid, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.get_wallet_file', { uid: uid, token: token });
            });
        }
        static getEntergameParam(uid, token, g_id) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.get_entergame_param', { uid: uid, token: token, g_id: g_id });
            });
        }
        static addUserWalletLogs(uid, token, txid, g_id, cnts, type, params, net_type, trust = "0") {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_wallet.logss', { uid: uid, token: token, txid: txid, g_id: g_id, cnts: cnts, type: type, params: params, net_type: net_type, trust: trust });
            });
        }
        static getWalletListss(uid, token, page, num, net_type) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_wallet.listss', { uid: uid, token: token, page: page, num: num, net_type: net_type });
            });
        }
        static walletNotify(uid, token, txid, net_type) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_wallet.notify', { uid: uid, token: token, txid: txid, net_type: net_type });
            });
        }
        static getAppWalletNotifys(uid, token, g_id, net_type) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_wallet.get_notify', { uid: uid, token: token, g_id: g_id, net_type: net_type });
            });
        }
        static getPlatWalletNotifys(uid, token, net_type) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_wallet.get_notify_plat', { uid: uid, token: token, net_type: net_type });
            });
        }
        static walletNotifyExt(uid, token, txid, ext, net_type) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_wallet.notify_ext', { uid: uid, token: token, txid: txid, ext: ext, net_type: net_type });
            });
        }
        static getEnterParams(uid, token, g_id) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.get_enter_params', { uid: uid, token: token, g_id: g_id });
            });
        }
        static registerByPhone(phone, code, pwd, region, uid) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_phone.register_pass', { phone: phone, code: code, pwd: pwd, region: region, uid: uid });
            });
        }
        static validPhone(phone) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_phone.valid_register', { phone: phone });
            });
        }
        static validUid(uid) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.valid_register', { uid: uid });
            });
        }
        static registerByEmail(email, code, pwd, region, uid) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_email.register_pass', { email: email, code: code, pwd: pwd, region: region, uid: uid });
            });
        }
        static validEmail(email) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_email.valid_register', { email: email });
            });
        }
        static phoneLoginPass(phone, pwd) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_phone.login_pass', { phone: phone, pwd: pwd });
            });
        }
        static emailLoginPass(email, pwd) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_email.login_pass', { email: email, pwd: pwd });
            });
        }
        static getEmailCode(email, lang) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_email.get_code', { email: email, lang: lang });
            });
        }
        static userLoginPass(uid, pwd) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.login', { uid: uid, pwd: pwd });
            });
        }
        static modUserIcon(uid, token, file) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_icon.upload', { uid: uid, token: token, file: file });
            });
        }
        static modUserName(uid, token, name) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.mod_name', { uid: uid, token: token, name: name });
            });
        }
        static modUserSex(uid, token, sex) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.mod_sex', { uid: uid, token: token, sex: sex });
            });
        }
        static forgetPassByPhone(phone, code, new_pwd) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_phone.mod_pwd', { phone: phone, code: code, new_pwd: new_pwd });
            });
        }
        static forgetPassByEmail(email, code, new_pwd) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_email.mod_pwd', { email: email, code: code, new_pwd: new_pwd });
            });
        }
        static getTrustNncs(uid, token, g_id) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_nncs.get_nncs', { uid: uid, token: token, g_id: g_id });
            });
        }
        static getTrustLists(uid, token, offset, num) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_nncs.listss', { uid: uid, token: token, offset: offset, num: num });
            });
        }
        static delTrustNncs(uid, token, id) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_nncs.del_nncs', { uid: uid, token: token, id: id });
            });
        }
        static addAddrbook(uid, token, address_name, address_wallet, address_desc) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_addressbook.add_addr', { uid: uid, token: token, address_name: address_name, address_wallet: address_wallet, address_desc: address_desc });
            });
        }
        static delAddrbook(uid, token, id) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_addressbook.del_addr', { uid: uid, token: token, id: id });
            });
        }
        static getAddrbook(uid, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_addressbook.get_addr', { uid: uid, token: token });
            });
        }
        static updateAddrbook(uid, token, address_name, address_wallet, address_desc, id) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_addressbook.update_addr', { uid: uid, token: token, address_name: address_name, address_wallet: address_wallet, address_desc: address_desc, id: id });
            });
        }
    }
    ApiTool.api_version = "1";
    ApiTool.base_url = '';
    BlackCat.ApiTool = ApiTool;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class User {
        constructor() {
            this.info = new BlackCat.UserInfo();
            this.cacheKey = 'BC_userinfo';
        }
        getInfo() {
            var userinfo = localStorage.getItem(this.cacheKey);
            if (userinfo) {
                this.info = JSON.parse(userinfo);
            }
        }
        setInfo(key, value) {
            this.info[key] = value;
            localStorage.setItem(this.cacheKey, JSON.stringify(this.info));
        }
        isLogined() {
            return __awaiter(this, void 0, void 0, function* () {
                var api_userinfo = yield BlackCat.ApiTool.isLogined(this.info.uid, this.info.token);
                if (api_userinfo.r) {
                    if (api_userinfo.data.wallet != this.info.wallet) {
                        var new_wallet_file = yield this.getWalletFile();
                        if (new_wallet_file != null) {
                            localStorage.removeItem(this.info.wallet);
                            this.info.wallet = api_userinfo.data.wallet;
                            this.setInfo('wallet', this.info.wallet);
                            localStorage.setItem(this.info.wallet, new_wallet_file);
                        }
                    }
                    return true;
                }
                else {
                    localStorage.removeItem(this.cacheKey);
                    localStorage.removeItem(this.info.wallet);
                    this.info = new BlackCat.UserInfo();
                    return false;
                }
            });
        }
        getWalletFile() {
            return __awaiter(this, void 0, void 0, function* () {
                var api_wallet = yield BlackCat.ApiTool.getWalletFile(this.info.uid, this.info.token);
                if (api_wallet.r) {
                    return api_wallet.data;
                }
                return null;
            });
        }
        logout() {
            localStorage.removeItem(this.cacheKey);
            if (this.info.wallet) {
                localStorage.removeItem(this.info.wallet);
            }
            this.info = new BlackCat.UserInfo();
            BlackCat.Main.wallet.closeWallet();
        }
        getWalletFileCache() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.info) {
                    this.getInfo();
                }
                var walletFile = localStorage.getItem(this.info.wallet);
                if (walletFile) {
                    return walletFile;
                }
                return null;
            });
        }
        validateLogin() {
            return __awaiter(this, void 0, void 0, function* () {
                this.getInfo();
                var user_logined = yield this.isLogined();
                if (!user_logined) {
                    return 0;
                }
                else if (!this.info.wallet) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        }
    }
    BlackCat.User = User;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class CoinTool {
            static initAllAsset() {
                return __awaiter(this, void 0, void 0, function* () {
                    var allassets = yield tools.WWW.api_getAllAssets();
                    for (var a in allassets) {
                        var asset = allassets[a];
                        var names = asset.name;
                        var id = asset.id;
                        var name = "";
                        if (id == CoinTool.id_GAS) {
                            name = "GAS";
                        }
                        else if (id == CoinTool.id_NEO) {
                            name = "NEO";
                        }
                        else {
                            for (var i in names) {
                                name = names[i].name;
                                if (names[i].lang == "en")
                                    break;
                            }
                        }
                        CoinTool.assetID2name[id] = name;
                        CoinTool.name2assetID[name] = id;
                    }
                });
            }
            static getassets() {
                return __awaiter(this, void 0, void 0, function* () {
                    var height = yield tools.WWW.api_getHeight();
                    var utxos = yield tools.WWW.api_getUTXO(tools.StorageTool.getStorage("current-address"));
                    var olds = tools.OldUTXO.getOldutxos();
                    var olds2 = new Array();
                    for (let n = 0; n < olds.length; n++) {
                        const old = olds[n];
                        let findutxo = false;
                        for (let i = 0; i < utxos.length; i++) {
                            let utxo = utxos[i];
                            if (utxo.txid == old.txid && old.n == utxo.n && height - old.height <= 2) {
                                findutxo = true;
                                utxos.splice(i, 1);
                            }
                        }
                        if (findutxo) {
                            olds2.push(old);
                        }
                    }
                    tools.OldUTXO.setOldutxos(olds2);
                    var assets = {};
                    for (var i in utxos) {
                        var item = utxos[i];
                        var asset = item.asset;
                        if (assets[asset] == undefined || assets[asset] == null) {
                            assets[asset] = [];
                        }
                        let utxo = new tools.UTXO();
                        utxo.addr = item.addr;
                        utxo.asset = item.asset;
                        utxo.n = item.n;
                        utxo.txid = item.txid;
                        utxo.count = Neo.Fixed8.parse(item.value);
                        assets[asset].push(utxo);
                    }
                    return assets;
                });
            }
            static makeTran(utxos, targetaddr, assetid, sendcount) {
                var res = new tools.Result();
                var us = utxos[assetid];
                if (us == undefined) {
                    throw new Error("pay_not_enough_utxo");
                }
                var tran = new ThinNeo.Transaction();
                tran.type = ThinNeo.TransactionType.ContractTransaction;
                tran.version = 0;
                tran.extdata = null;
                tran.attributes = [];
                tran.inputs = [];
                var scraddr = "";
                utxos[assetid].sort((a, b) => {
                    return a.count.compareTo(b.count);
                });
                var count = Neo.Fixed8.Zero;
                var clonearr = [].concat(us);
                var old = [];
                for (var i = 0; i < us.length; i++) {
                    var input = new ThinNeo.TransactionInput();
                    input.hash = us[i].txid.hexToBytes().reverse();
                    input.index = us[i].n;
                    input["_addr"] = us[i].addr;
                    tran.inputs.push(input);
                    count = count.add(us[i].count);
                    scraddr = us[i].addr;
                    clonearr.shift();
                    old.push(new tools.OldUTXO(us[i].txid, us[i].n));
                    if (count.compareTo(sendcount) > 0) {
                        break;
                    }
                }
                if (count.compareTo(sendcount) >= 0) {
                    tran.outputs = [];
                    if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                        var output = new ThinNeo.TransactionOutput();
                        output.assetId = assetid.hexToBytes().reverse();
                        output.value = sendcount;
                        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                        tran.outputs.push(output);
                    }
                    var change = count.subtract(sendcount);
                    if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                        var outputchange = new ThinNeo.TransactionOutput();
                        outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                        outputchange.value = change;
                        outputchange.assetId = assetid.hexToBytes().reverse();
                        tran.outputs.push(outputchange);
                    }
                    res.err = false;
                    res.info = { "tran": tran, "oldarr": old };
                }
                else {
                    throw new Error("pay_not_enough_money");
                }
                return res;
            }
            static makeTranMulti(utxos, targets, assetid) {
                var _count = 0;
                for (let i = 0; i < targets.length; i++) {
                    _count += Number(targets[i].count);
                }
                if (_count <= 0) {
                    throw new Error("can_not_send_zero");
                }
                var sendcount = Neo.Fixed8.fromNumber(_count);
                var res = new tools.Result();
                var us = utxos[assetid];
                if (us == undefined) {
                    throw new Error("pay_not_enough_utxo");
                }
                var tran = new ThinNeo.Transaction();
                tran.type = ThinNeo.TransactionType.ContractTransaction;
                tran.version = 0;
                tran.extdata = null;
                tran.attributes = [];
                tran.inputs = [];
                var scraddr = "";
                utxos[assetid].sort((a, b) => {
                    return a.count.compareTo(b.count);
                });
                var count = Neo.Fixed8.Zero;
                var clonearr = [].concat(us);
                var old = [];
                for (var i = 0; i < us.length; i++) {
                    var input = new ThinNeo.TransactionInput();
                    input.hash = us[i].txid.hexToBytes().reverse();
                    input.index = us[i].n;
                    input["_addr"] = us[i].addr;
                    tran.inputs.push(input);
                    count = count.add(us[i].count);
                    scraddr = us[i].addr;
                    clonearr.shift();
                    old.push(new tools.OldUTXO(us[i].txid, us[i].n));
                    if (count.compareTo(sendcount) > 0) {
                        break;
                    }
                }
                if (count.compareTo(sendcount) >= 0) {
                    tran.outputs = [];
                    if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                        for (let k = 0; k < targets.length; k++) {
                            var output = new ThinNeo.TransactionOutput();
                            output.assetId = assetid.hexToBytes().reverse();
                            output.value = Neo.Fixed8.parse(targets[k].count + "");
                            output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targets[k].toaddr);
                            tran.outputs.push(output);
                        }
                    }
                    var change = count.subtract(sendcount);
                    if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                        var outputchange = new ThinNeo.TransactionOutput();
                        outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                        outputchange.value = change;
                        outputchange.assetId = assetid.hexToBytes().reverse();
                        tran.outputs.push(outputchange);
                    }
                    res.err = false;
                    res.info = { "tran": tran, "oldarr": old };
                }
                else {
                    throw new Error("pay_not_enough_money");
                }
                return res;
            }
            static rawTransaction(targetaddr, asset, count) {
                return __awaiter(this, void 0, void 0, function* () {
                    var arr = tools.StorageTool.getLoginArr();
                    var add = tools.StorageTool.getStorage("current-address");
                    try {
                        var n = arr.findIndex(login => login.address == add);
                    }
                    catch (e) {
                        var n;
                        for (let i = 0; i < arr.length; i++) {
                            if (add == arr[i].address) {
                                n = i;
                                break;
                            }
                        }
                    }
                    var _count = Neo.Fixed8.parse(count + "");
                    var utxos = yield CoinTool.getassets();
                    try {
                        var tranres = CoinTool.makeTran(utxos, targetaddr, asset, _count);
                        var tran = tranres.info['tran'];
                        if (tran.witnesses == null)
                            tran.witnesses = [];
                        let txid = tran.GetHash().clone().reverse().toHexString();
                        var msg = tran.GetMessage().clone();
                        var pubkey = arr[n].pubkey.clone();
                        var prekey = arr[n].prikey.clone();
                        var addr = arr[n].address;
                        var signdata = ThinNeo.Helper.Sign(msg, prekey);
                        tran.AddWitness(signdata, pubkey, addr);
                        var data = tran.GetRawData();
                        var res = new tools.Result();
                        var height = yield tools.WWW.api_getHeight();
                        var result = yield tools.WWW.api_postRawTransaction(data);
                        if (result["sendrawtransactionresult"]) {
                            res.err = !result;
                            res.info = txid;
                            let olds = tranres.info['oldarr'];
                            olds.map(old => old.height = height);
                            tools.OldUTXO.oldutxosPush(olds);
                        }
                        else {
                            res.err = true;
                            res.info = "no txid";
                        }
                        return res;
                    }
                    catch (error) {
                        throw error;
                    }
                });
            }
            static rawTransactionMulti(targets, asset) {
                return __awaiter(this, void 0, void 0, function* () {
                    var arr = tools.StorageTool.getLoginArr();
                    var add = tools.StorageTool.getStorage("current-address");
                    try {
                        var n = arr.findIndex(login => login.address == add);
                    }
                    catch (e) {
                        var n;
                        for (let i = 0; i < arr.length; i++) {
                            if (add == arr[i].address) {
                                n = i;
                                break;
                            }
                        }
                    }
                    var utxos = yield CoinTool.getassets();
                    try {
                        var tranres = CoinTool.makeTranMulti(utxos, targets, asset);
                        var tran = tranres.info['tran'];
                        if (tran.witnesses == null)
                            tran.witnesses = [];
                        let txid = tran.GetHash().clone().reverse().toHexString();
                        var msg = tran.GetMessage().clone();
                        var pubkey = arr[n].pubkey.clone();
                        var prekey = arr[n].prikey.clone();
                        var addr = arr[n].address;
                        var signdata = ThinNeo.Helper.Sign(msg, prekey);
                        tran.AddWitness(signdata, pubkey, addr);
                        var data = tran.GetRawData();
                        var res = new tools.Result();
                        var height = yield tools.WWW.api_getHeight();
                        var result = yield tools.WWW.api_postRawTransaction(data);
                        if (result["sendrawtransactionresult"]) {
                            res.err = !result;
                            res.info = txid;
                            let olds = tranres.info['oldarr'];
                            olds.map(old => old.height = height);
                            tools.OldUTXO.oldutxosPush(olds);
                        }
                        else {
                            res.err = true;
                            res.info = "no txid";
                        }
                        return res;
                    }
                    catch (error) {
                        throw error;
                    }
                });
            }
            static claimgas() {
                return __awaiter(this, void 0, void 0, function* () {
                    let claimtxhex = yield tools.WWW.api_getclaimtxhex(tools.LoginInfo.getCurrentAddress());
                    var tran = new ThinNeo.Transaction();
                    var buf = claimtxhex.hexToBytes();
                    tran.Deserialize(new Neo.IO.BinaryReader(new Neo.IO.MemoryStream(buf.buffer, 0, buf.byteLength)));
                    var current = tools.LoginInfo.getCurrentLogin();
                    var msg = tran.GetMessage().clone();
                    var signdata = ThinNeo.Helper.Sign(msg, current.prikey);
                    tran.AddWitness(signdata, current.pubkey, current.address);
                    var data = tran.GetRawData();
                    var result = yield tools.WWW.api_postRawTransaction(data);
                    return result;
                });
            }
            static claimGas() {
                return __awaiter(this, void 0, void 0, function* () {
                    var current = tools.LoginInfo.getCurrentLogin();
                    let claimsstr = yield tools.WWW.api_getclaimgas(current.address, 0);
                    let claims = claimsstr["claims"];
                    let sum = claimsstr["gas"].toFixed(8);
                    var tran = new ThinNeo.Transaction();
                    tran.type = ThinNeo.TransactionType.ClaimTransaction;
                    tran.version = 0;
                    tran.extdata = new ThinNeo.ClaimTransData();
                    tran.extdata.claims = [];
                    tran.attributes = [];
                    tran.inputs = [];
                    for (let i in claims) {
                        let claim = claims[i];
                        var input = new ThinNeo.TransactionInput();
                        input.hash = (claim.txid).hexToBytes().reverse();
                        input.index = claim.n;
                        input["_addr"] = claim.addr;
                        tran.extdata.claims.push(input);
                    }
                    var output = new ThinNeo.TransactionOutput();
                    output.assetId = (CoinTool.id_GAS).hexToBytes().reverse();
                    output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(current.address);
                    output.value = Neo.Fixed8.parse(sum);
                    tran.outputs = [];
                    tran.outputs.push(output);
                    var msg = tran.GetMessage().clone();
                    var signdata = ThinNeo.Helper.Sign(msg, current.prikey);
                    tran.AddWitness(signdata, current.pubkey, current.address);
                    var data = tran.GetRawData();
                    var result = yield tools.WWW.api_postRawTransaction(data);
                    return result;
                });
            }
            static contractInvokeTrans_attributes(script) {
                return __awaiter(this, void 0, void 0, function* () {
                    let current = tools.LoginInfo.getCurrentLogin();
                    var addr = current.address;
                    var tran = new ThinNeo.Transaction();
                    tran.inputs = [];
                    tran.outputs = [];
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    tran.extdata.script = script;
                    tran.attributes = new Array(1);
                    tran.attributes[0] = new ThinNeo.Attribute();
                    tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                    tran.attributes[0].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr);
                    if (tran.witnesses == null)
                        tran.witnesses = [];
                    var msg = tran.GetMessage().clone();
                    var pubkey = current.pubkey.clone();
                    var prekey = current.prikey.clone();
                    var signdata = ThinNeo.Helper.Sign(msg, prekey);
                    tran.AddWitness(signdata, pubkey, addr);
                    var data = tran.GetRawData();
                    var res = new tools.Result();
                    var result = yield tools.WWW.api_postRawTransaction(data);
                    res.err = !result["sendrawtransactionresult"];
                    res.info = result["txid"];
                    return res;
                });
            }
            static contractInvokeTrans(script) {
                return __awaiter(this, void 0, void 0, function* () {
                    let current = tools.LoginInfo.getCurrentLogin();
                    var addr = current.address;
                    let assetid = CoinTool.id_GAS;
                    var utxos = yield CoinTool.getassets();
                    let tranmsg = CoinTool.makeTran(utxos, current.address, assetid, Neo.Fixed8.Zero);
                    let tran = tranmsg.info['tran'];
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    tran.extdata.script = script;
                    if (tran.witnesses == null)
                        tran.witnesses = [];
                    var msg = tran.GetMessage().clone();
                    var pubkey = current.pubkey.clone();
                    var prekey = current.prikey.clone();
                    var signdata = ThinNeo.Helper.Sign(msg, prekey);
                    tran.AddWitness(signdata, pubkey, addr);
                    var data = tran.GetRawData();
                    console.log(data);
                    var res = new tools.Result();
                    var result = yield tools.WWW.api_postRawTransaction(data);
                    res.err = !result;
                    res.info = "成功";
                    return res;
                });
            }
            static nep5Transaction(address, tatgeraddr, asset, amount) {
                return __awaiter(this, void 0, void 0, function* () {
                    let res = yield tools.WWW.getNep5Asset(asset);
                    var decimals = res["decimals"];
                    var numarr = amount.split(".");
                    decimals -= (numarr.length == 1 ? 0 : numarr[1].length);
                    var v = 1;
                    for (var i = 0; i < decimals; i++)
                        v *= 10;
                    var bnum = new Neo.BigInteger(amount.replace(".", ""));
                    var intv = bnum.multiply(v).toString();
                    var sb = new ThinNeo.ScriptBuilder();
                    var scriptaddress = asset.hexToBytes().reverse();
                    var random_int;
                    try {
                        var random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(new Uint8Array(32));
                        random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    }
                    catch (e) {
                        var math_rand = parseInt((Math.random() * 10000000).toString());
                        console.log('[Bla Cat]', '[cointool]', '[nep5Transaction] random_int from js random => ', math_rand);
                        random_int = new Neo.BigInteger(math_rand);
                    }
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    sb.EmitParamJson(["(address)" + address, "(address)" + tatgeraddr, "(integer)" + intv]);
                    sb.EmitPushString("transfer");
                    sb.EmitAppCall(scriptaddress);
                    var result = yield CoinTool.contractInvokeTrans_attributes(sb.ToArray());
                    return result;
                });
            }
            static getsgasAssets(id_SGAS = this.id_SGAS) {
                return __awaiter(this, void 0, void 0, function* () {
                    var height = yield tools.WWW.api_getHeight();
                    var scriptHash = ThinNeo.Helper.GetAddressFromScriptHash(id_SGAS.hexToBytes().reverse());
                    var utxos = yield tools.WWW.api_getUTXO(scriptHash);
                    var olds = tools.OldUTXO.getOldutxos();
                    var olds2 = new Array();
                    for (let n = 0; n < olds.length; n++) {
                        const old = olds[n];
                        let findutxo = false;
                        for (let i = 0; i < utxos.length; i++) {
                            let utxo = utxos[i];
                            if (utxo.txid == old.txid && old.n == utxo.n && height - old.height <= 2) {
                                findutxo = true;
                                utxos.splice(i, 1);
                            }
                        }
                        if (findutxo) {
                            olds2.push(old);
                        }
                    }
                    tools.OldUTXO.setOldutxos(olds2);
                    var assets = {};
                    for (var i in utxos) {
                        var item = utxos[i];
                        var asset = item.asset;
                        if (assets[asset] == undefined || assets[asset] == null) {
                            assets[asset] = [];
                        }
                        let utxo = new tools.UTXO();
                        utxo.addr = item.addr;
                        utxo.asset = item.asset;
                        utxo.n = item.n;
                        utxo.txid = item.txid;
                        utxo.count = Neo.Fixed8.parse(item.value);
                        assets[asset].push(utxo);
                    }
                    return assets;
                });
            }
        }
        CoinTool.id_GAS = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
        CoinTool.id_NEO = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
        CoinTool.id_SGAS = "";
        CoinTool.id_SGAS_OLD = [];
        CoinTool.assetID2name = {};
        CoinTool.name2assetID = {};
        tools.CoinTool = CoinTool;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class neotools {
            constructor() { }
            static verifyAddress(addr) {
                var verify = /^[a-zA-Z0-9]{34,34}$/;
                var res = verify.test(addr) ? neotools.verifyPublicKey(addr) : verify.test(addr);
                return res;
            }
            static verifyPublicKey(publicKey) {
                var array = Neo.Cryptography.Base58.decode(publicKey);
                var check = array.subarray(21, 21 + 4);
                var checkdata = array.subarray(0, 21);
                var hashd = Neo.Cryptography.Sha256.computeHash(checkdata);
                hashd = Neo.Cryptography.Sha256.computeHash(hashd);
                var hashd = hashd.slice(0, 4);
                var checked = new Uint8Array(hashd);
                var error = false;
                for (var i = 0; i < 4; i++) {
                    if (checked[i] != check[i]) {
                        error = true;
                        break;
                    }
                }
                return !error;
            }
            static wifDecode(wif) {
                let result = new tools.Result();
                let login = new tools.LoginInfo();
                try {
                    login.prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
                }
                catch (e) {
                    result.err = true;
                    result.info = e.message;
                    return result;
                }
                try {
                    login.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(login.prikey);
                }
                catch (e) {
                    result.err = true;
                    result.info = e.message;
                    return result;
                }
                try {
                    login.address = ThinNeo.Helper.GetAddressFromPublicKey(login.pubkey);
                }
                catch (e) {
                    result.err = true;
                    result.info = e.message;
                    return result;
                }
                result.info = login;
                return result;
            }
            static nep2FromWif(wif, password) {
                var prikey;
                var pubkey;
                var address;
                let res = new tools.Result();
                try {
                    prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
                    var n = 16384;
                    var r = 8;
                    var p = 8;
                    ThinNeo.Helper.GetNep2FromPrivateKey(prikey, password, n, r, p, (info, result) => {
                        res.err = false;
                        res.info.nep2 = result;
                        pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                        var hexstr = pubkey.toHexString();
                        address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                        res.info.address = address;
                        return res;
                    });
                }
                catch (e) {
                    res.err = true;
                    res.info = e.message;
                    return res;
                }
            }
            static nep2ToWif(nep2, password) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = new tools.Result();
                    let login = new tools.LoginInfo();
                    let promise = new Promise((resolve, reject) => {
                        let n = 16384;
                        var r = 8;
                        var p = 8;
                        ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, password, n, r, p, (info, result) => {
                            login.prikey = result;
                            if (login.prikey != null) {
                                login.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(login.prikey);
                                login.address = ThinNeo.Helper.GetAddressFromPublicKey(login.pubkey);
                                res.err = false;
                                res.info = login;
                                resolve(res);
                            }
                            else {
                                res.err = true;
                                reject(res);
                            }
                        });
                    });
                    return promise;
                });
            }
            static nep6Load(wallet, password) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        var istart = 0;
                        let res = new tools.Result();
                        let arr = new Array();
                        if (wallet.accounts) {
                            for (let keyindex = 0; keyindex < wallet.accounts.length; keyindex++) {
                                let account = wallet.accounts[keyindex];
                                if (account.nep2key == null) {
                                    continue;
                                }
                                try {
                                    let result = yield neotools.getPriKeyfromAccount(wallet.scrypt, password, account);
                                    arr.push(result.info);
                                    return arr;
                                }
                                catch (error) {
                                    throw error;
                                }
                            }
                        }
                        else {
                            throw console.error("The account cannot be empty");
                        }
                    }
                    catch (e) {
                        throw e.result;
                    }
                });
            }
            static getPriKeyfromAccount(scrypt, password, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let res = new tools.Result();
                    let promise = new Promise((resolve, reject) => {
                        account.getPrivateKey(scrypt, password, (info, result) => {
                            if (info == "finish") {
                                var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(result);
                                var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                                var wif = ThinNeo.Helper.GetWifFromPrivateKey(result);
                                var hexkey = result.toHexString();
                                res.err = false;
                                res.info = { pubkey: pubkey, address: address, prikey: result };
                                resolve(res);
                            }
                            else {
                                reject({ err: true, result: result });
                            }
                        });
                    });
                    return promise;
                });
            }
        }
        tools.neotools = neotools;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class NNSTool {
            static initRootDomain() {
                return __awaiter(this, void 0, void 0, function* () {
                    var test = new tools.RootDomainInfo();
                    test.roothash = NNSTool.nameHash("test");
                    test.rootname = "test";
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    var domain = yield NNSTool.getOwnerInfo(test.roothash, scriptaddress);
                    test.owner = domain.owner;
                    test.register = domain.register;
                    test.resolver = domain.resolver;
                    test.ttl = domain.ttl;
                    NNSTool.root_test = test;
                });
            }
            static queryDomainInfo(doamin) {
                return __awaiter(this, void 0, void 0, function* () {
                    var domainarr = doamin.split('.');
                    var subdomain = domainarr[0];
                    var nnshash = NNSTool.nameHashArray(domainarr);
                    let doamininfo = yield NNSTool.getOwnerInfo(nnshash, tools.Consts.baseContract.hexToBytes().reverse());
                    var owner = doamininfo.owner.toHexString();
                    return doamininfo;
                });
            }
            static registerDomain(doamin) {
                return __awaiter(this, void 0, void 0, function* () {
                    var nnshash = NNSTool.nameHash(NNSTool.root_test.rootname);
                    var address = tools.LoginInfo.getCurrentAddress();
                    var sb = new ThinNeo.ScriptBuilder();
                    var scriptaddress = NNSTool.root_test.register;
                    let random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(new Uint8Array(32));
                    let random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    sb.EmitParamJson(["(addr)" + address, "(bytes)" + nnshash.toHexString(), "(str)" + doamin]);
                    sb.EmitPushString("requestSubDomain");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    var res = yield tools.CoinTool.contractInvokeTrans_attributes(data);
                    if (!res.err) {
                    }
                    return res;
                });
            }
            static getRootName() {
                return __awaiter(this, void 0, void 0, function* () {
                    let name = "";
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(JSON.parse("[]"));
                    sb.EmitPushString("rootName");
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let result = yield tools.WWW.rpc_getInvokescript(data);
                    try {
                        var state = result.state;
                        if (state.includes("HALT, BREAK")) {
                        }
                        var stack = result.stack;
                        if (stack[0].type == "Array") {
                            length = stack[0].lenght;
                        }
                        else if (stack[0].type == "ByteArray") {
                            var bs = stack[0].value.hexToBytes();
                            name = ThinNeo.Helper.Bytes2String(bs);
                        }
                        return name;
                    }
                    catch (e) {
                        return e.message;
                    }
                });
            }
            static getRootNameHash() {
                return __awaiter(this, void 0, void 0, function* () {
                    let nameHash;
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(JSON.parse("[]"));
                    sb.EmitPushString("rootNameHash");
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let result = yield tools.WWW.rpc_getInvokescript(data);
                    try {
                        var state = result["state"];
                        if (state.includes("HALT, BREAK")) {
                        }
                        var stack = result["stack"];
                        if (stack[0].type == "ByteArray") {
                            nameHash = stack[0]["value"].hexToBytes();
                        }
                        return nameHash;
                    }
                    catch (e) {
                        return e.message;
                    }
                });
            }
            static getOwnerInfo(domain, scriptaddress) {
                return __awaiter(this, void 0, void 0, function* () {
                    let info = new tools.DomainInfo();
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(["(bytes)" + domain.toHexString()]);
                    sb.EmitPushString("getOwnerInfo");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let result = yield tools.WWW.rpc_getInvokescript(data);
                    try {
                        var state = result.state;
                        if (state.includes("HALT, BREAK")) {
                        }
                        var stackarr = result["stack"];
                        if (stackarr[0].type == "Array") {
                            var stack = stackarr[0].value;
                            if (stack[0].type == "ByteArray") {
                                info.owner = stack[0].value.hexToBytes();
                            }
                            if (stack[1].type == "ByteArray") {
                                info.register = stack[1].value.hexToBytes();
                            }
                            if (stack[2].type == "ByteArray") {
                                info.resolver = stack[2].value.hexToBytes();
                            }
                            if (stack[3].type == "Integer") {
                                info.ttl = new Neo.BigInteger(stack[3].value).toString();
                            }
                            if (stack[3].type = "ByteArray") {
                                let bt = stack[3].value.hexToBytes();
                                info.ttl = Neo.BigInteger.fromUint8ArrayAutoSign(bt.clone()).toString();
                            }
                            if (stack[4].type = "ByteArray") {
                                let parentOwner = stack[5].value.hexToBytes();
                            }
                            if (stack[5].type = "String") {
                                let domainstr = stack[5].value;
                            }
                            if (stack[6].type = "ByteArray") {
                                let parentHash = stack[6].value.hexToBytes();
                            }
                            if (stack[7].type = "ByteArray") {
                                let bt = stack[7].value.hexToBytes();
                                let root = Neo.BigInteger.fromUint8ArrayAutoSign(bt);
                            }
                            if (stack[7].type = "Integer") {
                                let a = new Neo.BigInteger(stack[7].value);
                            }
                        }
                    }
                    catch (e) {
                    }
                    return info;
                });
            }
            static getNameHash(domain) {
                return __awaiter(this, void 0, void 0, function* () {
                    let namehash;
                    var domainarr = domain.split('.');
                    var subdomain = domainarr[0];
                    var root = yield NNSTool.getRootName();
                    domainarr.shift();
                    domainarr.push(root);
                    var nnshash = NNSTool.nameHashArray(domainarr);
                    return nnshash;
                });
            }
            static setResolve(nnshash, resolverhash) {
                return __awaiter(this, void 0, void 0, function* () {
                    let current = tools.LoginInfo.getCurrentLogin();
                    let hash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(current.pubkey);
                    let hashstr = hash.reverse().toHexString();
                    let nnshashstr = nnshash.reverse().toHexString();
                    let resolvestr = resolverhash.reverse().toHexString();
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    var sb = new ThinNeo.ScriptBuilder();
                    let random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(new Uint8Array(32));
                    let random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    sb.EmitParamJson([
                        "(hex160)0x" + hashstr,
                        "(hex256)0x" + nnshashstr,
                        "(hex160)0x" + resolvestr
                    ]);
                    sb.EmitPushString("owner_SetResolver");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    console.log(data.toHexString());
                    let res = yield tools.CoinTool.contractInvokeTrans_attributes(data);
                    return res;
                });
            }
            static setResolveData(nnshash, str, resolve) {
                return __awaiter(this, void 0, void 0, function* () {
                    let namehash;
                    let current = tools.LoginInfo.getCurrentLogin();
                    let hash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(current.pubkey);
                    let hashstr = hash.reverse().toHexString();
                    let nnshashstr = nnshash.reverse().toHexString();
                    var scriptaddress = resolve.hexToBytes();
                    var sb = new ThinNeo.ScriptBuilder();
                    let random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(new Uint8Array(32));
                    let random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    sb.EmitParamJson([
                        "(hex160)0x" + hashstr,
                        "(hex256)0x" + nnshashstr,
                        "(str)1",
                        "(str)addr",
                        "(str)" + str
                    ]);
                    sb.EmitPushString("setResolveData");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let res = yield tools.CoinTool.contractInvokeTrans_attributes(data);
                    return;
                });
            }
            static resolveData(domain) {
                return __awaiter(this, void 0, void 0, function* () {
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    let arr = domain.split(".");
                    let nnshash = NNSTool.nameHashArray(arr);
                    let nnshashstr = nnshash.reverse().toHexString();
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson([
                        "(str)addr",
                        "(hex256)0x" + nnshashstr,
                        "(str)1"
                    ]);
                    sb.EmitPushString("resolve");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let res = yield tools.WWW.rpc_getInvokescript(data);
                    let addr = "";
                    try {
                        var state = res.state;
                        if (state.includes("HALT, BREAK")) {
                            var stack = res.stack;
                            if (stack[0].type == "ByteArray") {
                                if (stack[0].value != "00") {
                                    let value = stack[0].value.hexToBytes();
                                    addr = ThinNeo.Helper.Bytes2String(value);
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    return addr;
                });
            }
            static resolveFull(protocol, nameArray) {
                return __awaiter(this, void 0, void 0, function* () { });
            }
            static getSubOwner(nnshash, subdomain, scriptaddress) {
                return __awaiter(this, void 0, void 0, function* () {
                    let owner = "";
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(["(bytes)" + nnshash.toHexString(), "(str)" + subdomain]);
                    sb.EmitPushString("getSubOwner");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let result = yield tools.WWW.rpc_getInvokescript(data);
                    try {
                        var state = result.state;
                        if (state.includes("HALT, BREAK")) {
                            var stack = result.stack;
                            if (stack[0].type == "ByteArray") {
                                if (stack[0].value != "00") {
                                    owner = ThinNeo.Helper.GetAddressFromScriptHash(stack[0].value.hexToBytes());
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    return owner;
                });
            }
            static nameHash(domain) {
                var domain_bytes = ThinNeo.Helper.String2Bytes(domain);
                var hashd = Neo.Cryptography.Sha256.computeHash(domain_bytes);
                var namehash = new Uint8Array(hashd);
                return namehash.clone();
            }
            static nameHashSub(roothash, subdomain) {
                var bs = ThinNeo.Helper.String2Bytes(subdomain);
                if (bs.length == 0)
                    return roothash;
                var domain = Neo.Cryptography.Sha256.computeHash(bs);
                var domain_bytes = new Uint8Array(domain);
                var domainUint8arry = domain_bytes.concat(roothash);
                var sub = Neo.Cryptography.Sha256.computeHash(domainUint8arry);
                var sub_bytes = new Uint8Array(sub);
                return sub_bytes.clone();
            }
            static nameHashArray(domainarray) {
                domainarray.reverse();
                var hash = NNSTool.nameHash(domainarray[0]);
                for (var i = 1; i < domainarray.length; i++) {
                    hash = NNSTool.nameHashSub(hash, domainarray[i]);
                }
                return hash;
            }
            static verifyDomain(domain) {
                var reg = /^(.+\.)(test|TEST|[a-z][a-z])$/;
                if (!reg.test(domain)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            static verifyAddr(addr) {
                var reg = /^[a-zA-Z0-9]{34,34}$/;
                if (!reg.test(addr)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            static setDomainStatus() {
            }
            static initStatus() {
                NNSTool.domainStatus = tools.DomainStatus.getStatus();
            }
        }
        tools.NNSTool = NNSTool;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class UserInfo {
        constructor() {
            this.uid = '';
            this.name = '';
            this.phone = '';
            this.token = '';
            this.wallet = '';
            this.area = '';
            this.region = "";
            this.email = '';
            this.qq = '';
            this.icon = '';
            this.sex = "";
        }
    }
    BlackCat.UserInfo = UserInfo;
    class TransInfo {
        constructor() {
            this.assetid = "";
            this.targetaddr = "";
            this.amount = "";
        }
    }
    BlackCat.TransInfo = TransInfo;
    class RawTransInfo {
    }
    BlackCat.RawTransInfo = RawTransInfo;
    class RefundTransInfo {
    }
    BlackCat.RefundTransInfo = RefundTransInfo;
    class MintTokenTransInfo {
    }
    BlackCat.MintTokenTransInfo = MintTokenTransInfo;
    class getMintTokenTransInfo {
    }
    BlackCat.getMintTokenTransInfo = getMintTokenTransInfo;
    class invokescriptInfo {
    }
    BlackCat.invokescriptInfo = invokescriptInfo;
    class walletLists {
        constructor() {
            this.id = "";
            this.ctm = "";
            this.g_id = "";
            this.type = "";
            this.type_detail = "";
            this.state = "";
            this.state_gameplay = "";
            this.state_gameplay_detail = "";
            this.txid = "";
            this.wallet = "";
            this.cnts = "0";
            this.vdata = "";
            this.params = "";
            this.nnc = "";
            this.icon = "";
            this.name = "";
            this.ext = "";
            this.client_notify = "";
        }
    }
    BlackCat.walletLists = walletLists;
    class contact {
        constructor() {
            this.id = "";
            this.ctm = "";
            this.uid = "";
            this.address_name = "";
            this.address_wallet = "";
            this.address_desc = "";
        }
    }
    BlackCat.contact = contact;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class SDK {
        static init(appid, appkey, listener, lang = "cn") {
            console.log('[Bla Cat]', '[SDK]', 'init ...');
            if (SDK.is_init === false) {
                SDK.main = new BlackCat.Main();
                SDK.main.init(appid, appkey, listener, lang);
            }
            SDK.is_init = true;
        }
        static setLang(type) {
            console.log('[Bla Cat]', '[SDK]', 'setLang ...');
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                return;
            }
            this.main.setLang(type);
        }
        static showMain() {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                return;
            }
            this.main.showMain();
        }
        static showIcon() {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                return;
            }
            this.main.showIcon();
        }
        static login(callback = null) {
            if (SDK.is_init === false) {
                console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                return;
            }
            SDK.main.start(callback);
        }
        static invokescript(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log('[Bla Cat]', '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                var res = yield SDK.main.invokescript(params);
                if (callback)
                    callback(res);
            });
        }
        static makeRawTransaction(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log('[Bla Cat]', '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                SDK.main.makeRawTransaction(params, callback);
            });
        }
        static makeRecharge(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log('[Bla Cat]', '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                var res = yield SDK.main.makeRecharge(params, callback);
            });
        }
        static confirmAppNotify(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log('[Bla Cat]', '[SDK]', '请先登录');
                    return;
                }
                var res = yield SDK.main.confirmAppNotify(params);
                if (callback)
                    callback(res);
            });
        }
        static getBalance(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log('[Bla Cat]', '[SDK]', '请先登录');
                    return;
                }
                var res = yield SDK.main.getBalance();
                if (callback)
                    callback(res);
            });
        }
        static getUserInfo(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                }
                if (!SDK.main.isLogined()) {
                    console.log('[Bla Cat]', '[SDK]', '请先登录');
                }
                var res = yield SDK.main.getUserInfo();
                if (callback)
                    callback(res);
            });
        }
        static makeGasTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log('[Bla Cat]', '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                var res = yield SDK.main.makeGasTransfer(params, callback);
            });
        }
        static makeGasTransferMulti(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log('[Bla Cat]', '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                var res = yield SDK.main.makeGasTransferMulti(params, callback);
            });
        }
        static getNetType(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                    return;
                }
                var res = yield SDK.main.getNetType();
                if (callback)
                    callback(res);
            });
        }
        static setDefaultNetType(type) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log('[Bla Cat]', '[SDK]', '请先初始化init');
                    return;
                }
                SDK.main.setDefaultNetType(type);
            });
        }
    }
    SDK.is_init = false;
    BlackCat.SDK = SDK;
    class Result {
    }
    BlackCat.Result = Result;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class StorageTool {
            static getLoginArr() {
                var message = sessionStorage.getItem("login-info-arr");
                var arr = message ? tools.LoginInfo.StringToArray(message) : [];
                return arr;
            }
            static setLoginArr(value) {
                sessionStorage.setItem('login-info-arr', tools.LoginInfo.ArrayToString(value));
            }
            static setStorage(key, value) {
                sessionStorage.setItem(key, value);
            }
            static getStorage(key) {
                return sessionStorage.getItem(key);
            }
            static delStorage(key) {
                sessionStorage.removeItem(key);
            }
            static heightRefresh() {
                return __awaiter(this, void 0, void 0, function* () {
                    let oldheight = StorageTool.getStorage("block-height");
                    let height = yield tools.WWW.api_getHeight();
                    if (oldheight == undefined || oldheight == null || oldheight == "") {
                        StorageTool.setStorage("block-height", height.toString());
                    }
                    if (height - parseInt(oldheight) >= 2) {
                        StorageTool.utxosRefresh();
                        StorageTool.setStorage('block-height', height.toString());
                    }
                });
            }
            static utxosRefresh() {
                return __awaiter(this, void 0, void 0, function* () {
                    let assets = yield tools.CoinTool.getassets();
                    tools.UTXO.setAssets(assets);
                });
            }
        }
        tools.StorageTool = StorageTool;
        class StaticStore {
            static setAsset(asset) {
                StaticStore.choiceAsset = asset;
            }
        }
        StaticStore.choiceAsset = "";
        tools.StaticStore = StaticStore;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class DateTool {
            static dateFtt(fmt, date) {
                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    "S": date.getMilliseconds()
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        }
        tools.DateTool = DateTool;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class wallet {
            constructor() {
                this.wallet = new ThinNeo.nep6wallet();
                this.otcgo = new tools.WalletOtcgo();
                this.filestr = "";
                this.isotc = false;
                this.wallet_addr = tools.LoginInfo.getCurrentAddress();
            }
            setWalletStr(filestr) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.filestr = filestr;
                    return yield this.readWalletFile(0);
                });
            }
            readWalletFile(type = 0) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (type == 1) {
                        this.filestr = yield BlackCat.Main.user.getWalletFileCache();
                    }
                    if (this.filestr) {
                        try {
                            this.isotc = !this.filestr.includes("accounts");
                            if (this.isotc) {
                                this.wallet.accounts = undefined;
                                this.otcgo.fromJsonStr(this.filestr);
                                return true;
                            }
                            else {
                                this.otcgo.address = undefined;
                                this.wallet.fromJsonStr(this.filestr);
                                return true;
                            }
                        }
                        catch (e) {
                            console.log('[Bla Cat]', '[wallet]', 'readWalletFile, 钱包文件解析异常', this.filestr);
                            return false;
                        }
                    }
                    return false;
                });
            }
            open(filepass) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!!this.wallet.accounts) {
                        try {
                            let loginarray = yield tools.neotools.nep6Load(this.wallet, filepass);
                            yield tools.StorageTool.setLoginArr(loginarray);
                            yield tools.LoginInfo.setCurrentAddress(loginarray[0].address);
                            this.wallet_addr = loginarray[0].address;
                            return true;
                        }
                        catch (e) {
                            BlackCat.Main.showErrMsg("wallet_open_check");
                            return false;
                        }
                    }
                    if (!!this.otcgo.address) {
                        console.log('[Bla Cat]', '[wallet]', '打开蓝鲸淘钱包文件');
                        try {
                            this.otcgo.otcgoDecrypt(filepass);
                            const result = this.otcgo.doValidatePwd();
                            if (result) {
                                var loginarray = new Array();
                                loginarray.push(new tools.LoginInfo());
                                loginarray[0].address = this.otcgo.address;
                                loginarray[0].prikey = this.otcgo.prikey;
                                loginarray[0].pubkey = this.otcgo.pubkey;
                                tools.StorageTool.setLoginArr(loginarray);
                                tools.LoginInfo.setCurrentAddress(loginarray[0].address);
                                this.wallet_addr = this.otcgo.address;
                                return true;
                            }
                            else {
                                BlackCat.Main.showErrMsg("wallet_open_check_otcgo_pwd");
                                return false;
                            }
                        }
                        catch (e) {
                            BlackCat.Main.showErrMsg(("wallet_open_check_otcgo"));
                            return false;
                        }
                    }
                    console.log('[Bla Cat]', '[wallet]', '无有效的钱包文件');
                    return false;
                });
            }
            isOpen() {
                var logined_addr = tools.LoginInfo.getCurrentAddress();
                this.wallet_addr = logined_addr;
                if (!logined_addr) {
                    return false;
                }
                return true;
            }
            invokescript(params) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = new tools.Result();
                    var sb = new ThinNeo.ScriptBuilder();
                    var scriptaddress = params.nnc.hexToBytes().reverse();
                    sb.EmitParamJson(params.sbParamJson);
                    if (params.hasOwnProperty('sbPushString'))
                        sb.EmitPushString(params.sbPushString);
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    var scripthash = data.toHexString();
                    var r = yield tools.WWW.rpc_getInvokescript(data);
                    if (r) {
                        res.err = false;
                        res.info = r;
                    }
                    else {
                        res.err = true;
                        res.info = { error: "rpc getInvokescript error" };
                    }
                    return res;
                });
            }
            makeRawTransaction(params, trust = "0") {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = new tools.Result();
                    var login = tools.LoginInfo.getCurrentLogin();
                    var addr = login.address;
                    var tran = new ThinNeo.Transaction();
                    tran.inputs = [];
                    tran.outputs = [];
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    var sb = new ThinNeo.ScriptBuilder();
                    var random_int;
                    try {
                        var array = new Uint8Array(2333);
                        var random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(array);
                        random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    }
                    catch (e) {
                        var math_rand = parseInt((Math.random() * 10000000).toString());
                        console.log('[Bla Cat]', '[wallet]', 'makerawtransaction, math_rand => ', math_rand);
                        random_int = new Neo.BigInteger(math_rand);
                    }
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    if (params instanceof Array) {
                        if (params.length > 2) {
                            res.err = true;
                            res.info = { error: "post raw transaction error, too many data params, only 2 " };
                            return res;
                        }
                        else {
                            var scriptaddress = params[0].nnc.hexToBytes().reverse();
                            sb.EmitParamJson(params[0].sbParamJson);
                            sb.EmitPushString(params[0].sbPushString);
                            sb.EmitAppCall(scriptaddress);
                            sb.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                            sb.EmitSysCall("Neo.Transaction.GetHash");
                            sb.EmitPushBytes(ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr));
                            sb.EmitPushNumber(new Neo.BigInteger(2));
                            sb.Emit(ThinNeo.OpCode.PACK);
                            var scriptaddress_next = params[1].nnc.hexToBytes().reverse();
                            sb.EmitPushString(params[1].sbPushString);
                            sb.EmitAppCall(scriptaddress_next);
                        }
                    }
                    else {
                        var scriptaddress = params.nnc.hexToBytes().reverse();
                        sb.EmitParamJson(params.sbParamJson);
                        sb.EmitPushString(params.sbPushString);
                        sb.EmitAppCall(scriptaddress);
                    }
                    let script = sb.ToArray();
                    tran.extdata.script = script;
                    tran.attributes = new Array(1);
                    tran.attributes[0] = new ThinNeo.Attribute();
                    tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                    tran.attributes[0].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr);
                    if (tran.witnesses == null)
                        tran.witnesses = [];
                    var msg = tran.GetMessage().clone();
                    var pubkey = login.pubkey.clone();
                    var prekey = login.prikey.clone();
                    var signdata = ThinNeo.Helper.Sign(msg, prekey);
                    tran.AddWitness(signdata, pubkey, addr);
                    var data = tran.GetRawData();
                    var r = yield tools.WWW.api_postRawTransaction(data);
                    if (r) {
                        if (r["txid"]) {
                            res.err = false;
                            res.info = { txid: r["txid"] };
                            var logRes = yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, r["txid"], BlackCat.Main.appid, "", "5", JSON.stringify(params), BlackCat.Main.netMgr.type, trust);
                            BlackCat.Main.appWalletLogId = logRes.data;
                            if (trust == "1") {
                                BlackCat.Main.updateTrustNnc();
                            }
                        }
                        else {
                            res.err = true;
                            res.info = { error: "post raw transaction error, no txid" };
                        }
                    }
                    else {
                        res.err = true;
                        res.info = {
                            error: "post raw transaction error, maybe network err"
                        };
                    }
                    return res;
                });
            }
            makeRecharge(params) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = new tools.Result();
                    try {
                        var t_addr = tools.LoginInfo.getCurrentAddress();
                        var t_taaddr = BlackCat.Main.app_recharge_addr;
                        var t_asset = tools.CoinTool.id_SGAS;
                        var t_amount = params.count.toString();
                        var tranRes = yield tools.CoinTool.nep5Transaction(t_addr, t_taaddr, t_asset, t_amount);
                    }
                    catch (e) {
                        console.log("[Bla Cat]", "[wallet]", "makeRecharge error => ", e.toString());
                        res.err = true;
                        res.info = { error: "post makeRecharge error" };
                        return res;
                    }
                    if (!tranRes["err"]) {
                        if (tranRes.info) {
                            res.err = false;
                            res.info = { txid: tranRes.info };
                            var logRes = yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, tranRes.info, BlackCat.Main.appid, params.count.toString(), "3", JSON.stringify(params), BlackCat.Main.netMgr.type);
                            BlackCat.Main.appWalletLogId = logRes.data;
                        }
                        else {
                            res.err = true;
                            res.info = { error: "post makeRecharge error, no txid" };
                            return res;
                        }
                    }
                    else {
                        res.err = true;
                        res.info = { error: "post makeRecharge error, may be network error" };
                    }
                    console.log("[Bla Cat]", "[wallet]", "makeRechargeRes => ", res);
                    return res;
                });
            }
            closeWallet() {
                tools.StorageTool.delStorage("current-address");
                tools.StorageTool.delStorage("login-info-arr");
                console.log('[Bla Cat]', '[wallet]', 'closeWallet ...');
                if (BlackCat.Main.viewMgr.payWalletDetailView && BlackCat.Main.viewMgr.payWalletDetailView.isCreated && BlackCat.Main.viewMgr.payWalletDetailView.isHidden() == false) {
                    BlackCat.Main.viewMgr.payWalletDetailView.return();
                }
            }
        }
        tools.wallet = wallet;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class WWW {
            static makeRpcUrl(url, method, ..._params) {
                var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
                for (var i = 0; i < _params.length; i++) {
                    urlout += JSON.stringify(_params[i]);
                    if (i != _params.length - 1)
                        urlout += ",";
                }
                urlout += "]";
                return urlout;
            }
            static makeRpcPostBody(method, ..._params) {
                var body = {};
                body["jsonrpc"] = "2.0";
                body["id"] = 1;
                body["method"] = method;
                var params = [];
                for (var i = 0; i < _params.length; i++) {
                    params.push(_params[i]);
                }
                body["params"] = params;
                return body;
            }
            static gettransbyaddress(address, pagesize, pageindex) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("gettransbyaddress", address, pagesize, pageindex);
                    var result = yield fetch(WWW.apiaggr, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getHeight() {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getblockcount");
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    var height = parseInt(r[0]["blockcount"]) - 1;
                    return height;
                });
            }
            static api_getBlockInfo(index) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getblocktime");
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    var height = parseInt(r[0]["blockcount"]) - 1;
                    return height;
                });
            }
            static api_getAllAssets() {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getallasset");
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getUTXO(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getutxo", address);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getnep5Balance(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getallnep5assetofaddress", address, 1);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getnep5balanceofaddress(scriptaddr, address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getnep5balanceofaddress", scriptaddr.toString(), address);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getNep5TransferByTxid(txid) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getnep5transferbytxid", txid.toString());
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getBalance(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getbalance", address);
                    var value = yield fetch(str, { "method": "get" });
                    var json = yield value.json();
                    var r = json["result"];
                    return r;
                });
            }
            static getNep5Asset(asset) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("getnep5asset", asset);
                    var result = yield fetch(WWW.api, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static api_getAddressTxs(address, size, page) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("getaddresstxs", address, size, page);
                    var result = yield fetch(WWW.api, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_postRawTransaction(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("sendrawtransaction", data.toHexString());
                    var result = yield fetch(WWW.api, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static api_getclaimgas(address, type) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (type)
                        var str = WWW.makeRpcUrl(WWW.api, "getclaimgas", address, type);
                    else
                        var str = WWW.makeRpcUrl(WWW.api, "getclaimgas", address);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    if (r == undefined)
                        return 0;
                    return r[0];
                });
            }
            static api_getclaimtxhex(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getclaimtxhex", address);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    if (r == undefined)
                        return "";
                    return r[0]["claimtxhex"];
                });
            }
            static rpc_getHeight() {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getblockcount");
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    var height = parseInt(r) - 1;
                    return height;
                });
            }
            static rpc_getStorage(scripthash, key) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getstorage", scripthash.toHexString(), key.toHexString());
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (json["result"] == null)
                        return null;
                    var r = json["result"];
                    return r;
                });
            }
            static rpc_getInvokescript(scripthash) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "invokescript", scripthash.toHexString());
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (json["result"] == null)
                        return null;
                    var r = json["result"][0];
                    return r;
                });
            }
            static getrawtransaction(txid) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getrawtransaction", txid);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (!json["result"])
                        return null;
                    var r = json["result"][0];
                    return r;
                });
            }
            static api_getcontractstate(scriptaddr) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api, "getcontractstate", scriptaddr);
                    var value = yield fetch(str, { "method": "get" });
                    var json = yield value.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static setnnsinfo(address, name, time) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.apiaggr, "setnnsinfo", address, name, time);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (json["result"] == null)
                        return null;
                    var r = json["result"][0]["result"];
                    return r;
                });
            }
            static getnnsinfo(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("getdomainbyaddress2", address);
                    var result = yield fetch(WWW.apiaggr, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    if (json["result"] == null)
                        return null;
                    var r = json["result"];
                    return r;
                });
            }
            static delnnsinfo(domain) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.apiaggr, "delnnsinfo", domain);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (json["result"] == null)
                        return null;
                    var r = json["result"][0]["result"];
                    return r;
                });
            }
            static api_getBidListByAddress(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("getbidlistbyaddress", address);
                    var result = yield fetch(WWW.apiaggr, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
        }
        tools.WWW = WWW;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
//# sourceMappingURL=code.js.map