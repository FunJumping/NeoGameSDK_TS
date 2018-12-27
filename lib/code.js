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
            Main.randNumber = parseInt((Math.random() * 10000000).toString());
            Main.urlHead = Main.getUrlHead();
            Main.apprefer = Main.getUrlParam('refer');
            Main.reset(0);
            Main.update_timeout_max = 5000;
            Main.update_timeout_min = 300;
            Main.isCreated = false;
            Main.isStart = false;
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
        static getCGASBalanceByAddress(id_CGAS, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddress(id_CGAS, address, 100000000);
            });
        }
        static getCGAS_OLDBalanceByAddress(id_CGAS, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddress(id_CGAS, address, 100000000);
            });
        }
        static getCNEOBalanceByAddress(id_CNEO, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddress(id_CNEO, address, 100000000);
            });
        }
        static getCNEO_OLDBalanceByAddress(id_CNEO, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddress(id_CNEO, address, 100000000);
            });
        }
        static getBCPBalanceByAddress(id_BCP, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddress(id_BCP, address, 100000000);
            });
        }
        static getBCTBalanceByAddress(id_BCT, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddress(id_BCT, address, 10000);
            });
        }
        static getBTCBalanceByAddress(id_BTC, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddress(id_BTC, address, 100000000);
            });
        }
        static getETHBalanceByAddress(id_ETH, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddress(id_ETH, address, 100000000);
            });
        }
        static getNep5BalanceByAddress(id_hash, address, bits = 100000000) {
            return __awaiter(this, void 0, void 0, function* () {
                var params = {
                    sbParamJson: ["(addr)" + address],
                    sbPushString: "balanceOf",
                    nnc: id_hash
                };
                try {
                    let res = yield Main.wallet.invokescript(params);
                    if (res.err == false) {
                        let data = res.info;
                        if (data["stack"] && data["stack"].length > 0) {
                            let balances = data["stack"][0];
                            let balance = new Neo.BigInteger(balances.value.hexToBytes()).toString();
                            return Number(balance) / bits;
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[main]', 'getNep5BalanceByAddress =>', e, 'hash =>', id_hash);
                }
                return 0;
            });
        }
        init(appid, appkey, listener, lang) {
            Main.appid = appid;
            Main.appkey = appkey;
            Main.callback = listener;
            Main.langMgr.setType(lang);
        }
        initex(params, callback = null) {
            Main.isInitex = true;
            Main.appid = params.appid;
            Main.appkey = params.appkey;
            Main.callback = params.listener;
            Main.langMgr.setType(params.lang);
            Main.netMgr.setDefault(Number(params.default_net));
            Main.viewMgr.mainView.createMask();
            if (Main.isCreated == false) {
                Main.netMgr.selectApi(() => {
                    Main.netMgr.change(() => {
                        Main.viewMgr.iconView.showSucc();
                        Main.viewMgr.iconView.removeState();
                        Main.viewMgr.mainView.changNetType();
                        Main.update();
                        Main.isCreated = true;
                        if (Main.viewMgr.viewConnecting.isCreated)
                            Main.viewMgr.viewConnecting.remove();
                        var result = new BlackCat.Result();
                        result.err = false;
                        result.info = 'success';
                        Main.listenerCallback("initexRes", result);
                        if (callback)
                            callback(result);
                        if (Main.isStart == true) {
                            Main.validateLogin();
                        }
                    });
                });
                return;
            }
        }
        start(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                Main.isStart = true;
                Main.loginFunctionCallback = callback;
                if (!Main.isInitex) {
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
                }
                else if (Main.isCreated) {
                    Main.validateLogin();
                }
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
        getBalance(type = null) {
            return __awaiter(this, void 0, void 0, function* () {
                var callback_data = {};
                if (type) {
                    callback_data[type] = Main.viewMgr.payView[type];
                }
                else {
                    callback_data = {};
                    BlackCat.PayView.tokens_coin.forEach((coins) => {
                        coins.forEach((coin) => {
                            callback_data[coin] = Main.viewMgr.payView[coin];
                        });
                    });
                    callback_data['sgas'] = Main.viewMgr.payView['cgas'];
                }
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
        getHeight() {
            return __awaiter(this, void 0, void 0, function* () {
                yield Main.viewMgr.payView.getHeight("nodes");
                if (BlackCat.tools.WWW.api_clis && BlackCat.tools.WWW.api_clis != "") {
                    yield Main.viewMgr.payView.getHeight("clis");
                }
                var callback_data = {
                    node: Main.viewMgr.payView.height_nodes,
                    cli: Main.viewMgr.payView.height_clis
                };
                Main.listenerCallback("getHeightRes", callback_data);
                return callback_data;
            });
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
                    BlackCat.ViewTransactionConfirm.isTrustFeeLess = false;
                    let unTrust = Main.getUnTrustNnc(params);
                    if (unTrust.length == 0) {
                        if (Main.viewMgr.payView.gas > Number(Main.user.info.service_charge)) {
                            console.log("[BlaCat]", '[main]', 'makeRawTransaction, trust nnc ...');
                            this._makeRawTransaction(params, "0", Main.user.info.service_charge, callback);
                            return;
                        }
                        else {
                            BlackCat.ViewTransactionConfirm.isTrustFeeLess = true;
                        }
                    }
                    if (Main.viewMgr.mainView.isHidden()) {
                        Main.viewMgr.mainView.show();
                        Main.viewMgr.iconView.hidden();
                    }
                    if (Main.transactionCallback) {
                        Main.showErrMsg("main_wait_for_last_tran");
                        return;
                    }
                    Main.transactionCallback = callback;
                    var list = new BlackCat.walletLists();
                    list.params = JSON.stringify(params);
                    list.wallet = Main.user.info.wallet;
                    list.icon = Main.appicon;
                    list.name = Main.appname;
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = "0";
                    list.type = "5";
                    list.state = "0";
                    BlackCat.ViewTransactionConfirm.list = list;
                    BlackCat.ViewTransactionConfirm.refer = "";
                    BlackCat.ViewTransactionConfirm.callback_params = params;
                    BlackCat.ViewTransactionConfirm.callback = (params, trust, net_fee) => __awaiter(this, void 0, void 0, function* () {
                        console.log("[BlaCat]", '[main]', 'makeRawTransaction交易确认..');
                        Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                yield this._makeRawTransaction(params, trust, net_fee, Main.transactionCallback);
                            }
                            catch (e) {
                                console.log("[BlaCat]", '[main]', 'makeRawTransaction, _makeRawTransaction(params, trust, net_fee, Main.transactionCallback) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'error => ', e.toString());
                            }
                            Main.viewMgr.viewLoading.remove();
                        }), 300);
                    });
                    BlackCat.ViewTransactionConfirm.callback_cancel = () => {
                        console.log("[BlaCat]", '[main]', 'makeRawTransaction交易取消..');
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        if (Main.transactionCallback)
                            Main.transactionCallback(res);
                        Main.transactionCallback = null;
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRawTransactionRes", callback_data);
                    };
                    Main.viewMgr.change("ViewTransactionConfirm");
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
        _makeRawTransaction(params, trust = "0", net_fee, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                Main.setLiveTime();
                try {
                    var res = yield Main.wallet.makeRawTransaction(params, trust, net_fee);
                }
                catch (e) {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = e.toString();
                    console.log("[BlaCat]", '[main]', '_makeRawTransaction, Main.wallet.makeRawTransaction(params, trust, net_fee) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'e => ', e.toString());
                }
                yield Main.viewMgr.payView.doGetWalletLists(1);
                var callback_data = {
                    params: params,
                    res: res
                };
                Main.listenerCallback("makeRawTransactionRes", callback_data);
                if (callback) {
                    try {
                        callback(res);
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[main]', '_makeRawTransaction, app callback error! Main.wallet.makeRawTransaction(params, trust, net_fee) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'e => ', e.toString());
                    }
                }
                Main.transactionCallback = null;
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
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("makeRechargeRes", callback_data);
                    callback(res);
                    return;
                }
                var coin_type = "cgas";
                if (params.hasOwnProperty('type')) {
                    if (Main.in_array(params.type, ["cgas", "cneo", "bcp", "bct", "btc", "eth"]) == false) {
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = "type_error";
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRechargeRes", callback_data);
                        callback(res);
                        return;
                    }
                }
                else {
                    params['type'] = coin_type;
                }
                if (Main.viewMgr.payView && Main.viewMgr.payView[params['type']] < Number(params.count)) {
                    Main.showErrMsg('pay_not_enough_money');
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = "not_enough_" + params['type'];
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("makeRechargeRes", callback_data);
                    callback(res);
                    return;
                }
                if (Main.isWalletOpen()) {
                    if (Main.transactionCallback) {
                        Main.showErrMsg(("main_wait_for_last_tran"));
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = "wait_for_last_tran";
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRechargeRes", callback_data);
                        callback(res);
                        return;
                    }
                    Main.transactionCallback = callback;
                    var list = new BlackCat.walletLists();
                    if (!params.hasOwnProperty("nnc")) {
                        params['nnc'] = BlackCat.tools.CoinTool["id_" + params['type'].toUpperCase()];
                    }
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
                    list.type_detail = BlackCat.PayTransferView.log_type_detail[params['type']];
                    BlackCat.ViewTransactionConfirm.isTrustFeeLess = false;
                    BlackCat.ViewTransactionConfirm.list = list;
                    BlackCat.ViewTransactionConfirm.refer = "";
                    BlackCat.ViewTransactionConfirm.callback_params = params;
                    BlackCat.ViewTransactionConfirm.callback = (params, trust, net_fee) => __awaiter(this, void 0, void 0, function* () {
                        console.log("[BlaCat]", '[main]', 'makeRecharge交易确认..');
                        Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                var res = yield Main.wallet.makeRecharge(params, trust, net_fee);
                            }
                            catch (e) {
                                var res = new BlackCat.Result();
                                res.err = true;
                                res.info = e.toString();
                                console.log("[BlaCat]", '[main]', 'makeRecharge, Main.wallet.makeRecharge(params) error, params => ', params, 'e => ', e.toString());
                            }
                            yield Main.viewMgr.payView.doGetWalletLists(1);
                            Main.viewMgr.viewLoading.remove();
                            var callback_data = {
                                params: params,
                                res: res
                            };
                            Main.listenerCallback("makeRechargeRes", callback_data);
                            if (Main.transactionCallback) {
                                try {
                                    Main.transactionCallback(res);
                                }
                                catch (e) {
                                    console.log("[BlaCat]", '[main]', 'makeRecharge, app callback error! Main.wallet.makeRecharge(params) error, params => ', params, 'e => ', e.toString());
                                }
                            }
                            Main.transactionCallback = null;
                        }), 300);
                    });
                    BlackCat.ViewTransactionConfirm.callback_cancel = () => {
                        console.log("[BlaCat]", '[main]', 'makeRecharge交易取消..');
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("makeRechargeRes", callback_data);
                        if (Main.transactionCallback) {
                            try {
                                Main.transactionCallback(res);
                            }
                            catch (e) {
                                console.log("[BlaCat]", '[main]', 'makeRecharge, app callback error! Main.wallet.makeRecharge(params) error, params => ', params, 'e => ', e.toString());
                            }
                        }
                        Main.transactionCallback = null;
                    };
                    Main.viewMgr.change("ViewTransactionConfirm");
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
        makeTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                var coin_type = params.type;
                var coin_type_first = "";
                if (params.hasOwnProperty('type_first') && params['type_first'] == "1") {
                    coin_type_first = coin_type.charAt(0).toUpperCase() + coin_type.slice(1);
                }
                var coin_type_upper = coin_type.toUpperCase();
                if (!Main.viewMgr.payView.hasOwnProperty(coin_type)) {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = "unsupport type " + coin_type;
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("make" + coin_type_first + "TransferRes", callback_data);
                    callback(res);
                    return;
                }
                if (Main.viewMgr.mainView.isHidden()) {
                    Main.viewMgr.mainView.show();
                    Main.viewMgr.iconView.hidden();
                }
                if (Main.viewMgr.payView && Main.viewMgr.payView[coin_type] < Number(params.count)) {
                    Main.showErrMsg('pay_not_enough_money');
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = "not_enough_" + coin_type;
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("make" + coin_type_first + "TransferRes", callback_data);
                    callback(res);
                    return;
                }
                if (Main.isWalletOpen()) {
                    if (Main.transferCallback) {
                        Main.showErrMsg(("main_wait_for_last_tran"));
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = "wait_for_last_tran";
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("make" + coin_type_first + "TransferRes", callback_data);
                        callback(res);
                        return;
                    }
                    Main.transferCallback = callback;
                    var list = new BlackCat.walletLists();
                    params['nnc'] = BlackCat.tools.CoinTool['id_' + coin_type_upper];
                    list.params = JSON.stringify(params);
                    list.wallet = Main.user.info.wallet;
                    list.icon = Main.appicon;
                    list.name = Main.appname;
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = params.count.toString();
                    list.type = "6";
                    list.type_detail = BlackCat.PayTransferView.log_type_detail[coin_type];
                    BlackCat.ViewTransferConfirm.list = list;
                    BlackCat.ViewTransferConfirm.refer = "";
                    BlackCat.ViewTransferConfirm.callback_params = params;
                    BlackCat.ViewTransferConfirm.callback = (params, net_fee) => __awaiter(this, void 0, void 0, function* () {
                        console.log("[BlaCat]", '[main]', 'makeTransfer交易确认..');
                        Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                if (Main.in_array(coin_type, ["gas", "neo"])) {
                                    var res = yield BlackCat.tools.CoinTool.rawTransaction(params.toaddr, BlackCat.tools.CoinTool["id_" + coin_type_upper], params.count, Neo.Fixed8.fromNumber(Number(net_fee)));
                                }
                                else {
                                    var res = yield BlackCat.tools.CoinTool.nep5Transaction(Main.user.info.wallet, params.toaddr, BlackCat.tools.CoinTool["id_" + coin_type_upper], params.count, net_fee);
                                }
                                if (res.err == false) {
                                    params.sbPushString = "transfer";
                                    var logRes = yield BlackCat.ApiTool.addUserWalletLogs(Main.user.info.uid, Main.user.info.token, res.info, Main.appid, params.count.toString(), "6", JSON.stringify(params), Main.netMgr.type, "0", net_fee, BlackCat.PayTransferView.log_type_detail[coin_type]);
                                    Main.appWalletLogId = logRes.data;
                                    yield Main.viewMgr.payView.doGetWalletLists(1);
                                }
                            }
                            catch (e) {
                                var res = new BlackCat.Result();
                                res.err = true;
                                res.info = 'make trans err';
                                res['ext'] = e.toString();
                                console.log("[BlaCat]", '[main]', 'make' + coin_type_first + 'Transfer, ViewTransferConfirm.callback error, params => ', params, 'e => ', e.toString());
                            }
                            Main.viewMgr.viewLoading.remove();
                            var callback_data = {
                                params: params,
                                res: res
                            };
                            Main.listenerCallback("make" + coin_type_first + "TransferRes", callback_data);
                            if (Main.transferCallback) {
                                try {
                                    Main.transferCallback(res);
                                }
                                catch (e) {
                                    console.log("[BlaCat]", '[main]', 'make' + coin_type_first + 'Transfer, app callback error! ViewTransferConfirm.callback error, params => ', params, 'e => ', e.toString());
                                }
                            }
                            Main.transferCallback = null;
                        }), 300);
                    });
                    BlackCat.ViewTransferConfirm.callback_cancel = () => {
                        console.log("[BlaCat]", '[main]', 'make' + coin_type_first + 'Transfer交易取消..');
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("make" + coin_type_first + "TransferRes", callback_data);
                        if (Main.transferCallback) {
                            try {
                                Main.transferCallback(res);
                            }
                            catch (e) {
                            }
                        }
                        Main.transferCallback = null;
                    };
                    Main.viewMgr.change("ViewTransferConfirm");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "";
                    BlackCat.ViewWalletOpen.callback_params = params;
                    BlackCat.ViewWalletOpen.callback_callback = callback;
                    BlackCat.ViewWalletOpen.callback = (params, callback) => {
                        this["make" + coin_type_first + "Transfer"](params, callback);
                    };
                    BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("make" + coin_type_first + "TransferRes", callback_data);
                        callback(res);
                    };
                    Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        makeGasTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                params['type'] = 'gas';
                params['type_first'] = "1";
                return yield this.makeTransfer(params, callback);
            });
        }
        makeNeoTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                params['type'] = "neo";
                params['type_first'] = "1";
                return yield this.makeTransfer(params, callback);
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
                    _count = BlackCat.floatNum.plus(_count, Number(params[i].count));
                }
                params[0]['nnc'] = BlackCat.tools.CoinTool.id_GAS;
                if (Main.viewMgr.payView && Main.viewMgr.payView.gas < Number(_count)) {
                    Main.showErrMsg('pay_not_enough_money');
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = "not_enough_gas";
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("makeGasTransferMultiRes", callback_data);
                    callback(res);
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
                    list.type_detail = BlackCat.PayTransferView.log_type_detail['gas'];
                    BlackCat.ViewTransferConfirm.list = list;
                    BlackCat.ViewTransferConfirm.refer = "";
                    BlackCat.ViewTransferConfirm.callback_params = params;
                    BlackCat.ViewTransferConfirm.callback = (params, net_fee) => __awaiter(this, void 0, void 0, function* () {
                        console.log("[BlaCat]", '[main]', 'makeGasTransferMulti交易确认..');
                        Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                var res = yield BlackCat.tools.CoinTool.rawTransactionMulti(params, BlackCat.tools.CoinTool.id_GAS, Neo.Fixed8.fromNumber(Number(net_fee)));
                                if (res.err == false) {
                                    params.map(item => (item.sbPushString = "transfer"));
                                    yield BlackCat.ApiTool.addUserWalletLogs(Main.user.info.uid, Main.user.info.token, res.info, Main.appid, _count.toString(), "6", JSON.stringify(params), Main.netMgr.type, "0", net_fee);
                                    yield Main.viewMgr.payView.doGetWalletLists(1);
                                }
                            }
                            catch (e) {
                                var res = new BlackCat.Result();
                                res.err = true;
                                res.info = 'make trans err';
                                res['ext'] = e.toString();
                                console.log("[BlaCat]", '[main]', 'makeGasTransferMulti, ViewTransferConfirm.callback error, params => ', params, 'e => ', e.toString());
                            }
                            Main.viewMgr.viewLoading.remove();
                            var callback_data = {
                                params: params,
                                res: res
                            };
                            Main.listenerCallback("makeGasTransferMultiRes", callback_data);
                            if (Main.transGasMultiCallback) {
                                try {
                                    Main.transGasMultiCallback(res);
                                }
                                catch (e) {
                                    console.log("[BlaCat]", '[main]', 'makeGasTransferMulti, app callback error! ViewTransferConfirm.callback error, params => ', params, 'e => ', e.toString());
                                }
                            }
                            Main.transGasMultiCallback = null;
                        }), 300);
                    });
                    BlackCat.ViewTransferConfirm.callback_cancel = () => {
                        console.log("[BlaCat]", '[main]', 'makeGasTransfer交易取消..');
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
                    Main.viewMgr.change("ViewTransferConfirm");
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
        bancor(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.tools.CoinTool.id_bancor != "") {
                    if (Main.isWalletOpen()) {
                        var size = 100000000;
                        params.count = BlackCat.floatNum.divide(Math.round(Number(params.count) * size), size).toString();
                        BlackCat.ViewTransactionConfirm.isTrustFeeLess = false;
                        var type_num = Number(params.type);
                        switch (type_num) {
                            case 1:
                                params['nnc'] = BlackCat.tools.CoinTool.id_BCP;
                                break;
                            case 2:
                                params['nnc'] = params.asset;
                                break;
                            default:
                                var res = new BlackCat.Result();
                                res.err = true;
                                res.info = 'type error';
                                var callback_data = {
                                    params: params,
                                    res: res
                                };
                                Main.listenerCallback("bancorRes", callback_data);
                                callback(res);
                                return;
                        }
                        params['sbPushString'] = "transfer";
                        var scriptaddress = BlackCat.tools.CoinTool.id_bancor.hexToBytes().reverse();
                        var bancorAddr = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                        params['sbParamJson'] = "(addr)" + Main.user.info.wallet + ",(address)" + bancorAddr + ",(integer)" + (params.count * size).toString();
                        params['bancorAddr'] = bancorAddr;
                        let unTrust = Main.getUnTrustNnc(params);
                        if (unTrust.length == 0) {
                            if (Main.viewMgr.payView.gas > Number(Main.user.info.service_charge)) {
                                console.log("[BlaCat]", '[main]', 'bancor, trust nnc ...');
                                this._bancor(params, "0", Main.user.info.service_charge, callback);
                                return;
                            }
                            else {
                                BlackCat.ViewTransactionConfirm.isTrustFeeLess = true;
                            }
                        }
                        if (Main.viewMgr.mainView.isHidden()) {
                            Main.viewMgr.mainView.show();
                            Main.viewMgr.iconView.hidden();
                        }
                        if (Main.bancorCallback) {
                            Main.showErrMsg("main_wait_for_last_tran");
                            return;
                        }
                        Main.bancorCallback = callback;
                        var list = new BlackCat.walletLists();
                        list.params = JSON.stringify(params);
                        list.wallet = Main.user.info.wallet;
                        list.icon = Main.appicon;
                        list.name = Main.appname;
                        list.ctm = Math.round(new Date().getTime() / 1000).toString();
                        list.cnts = "0";
                        list.type = "14";
                        BlackCat.ViewTransactionConfirm.list = list;
                        BlackCat.ViewTransactionConfirm.refer = "";
                        BlackCat.ViewTransactionConfirm.callback_params = params;
                        BlackCat.ViewTransactionConfirm.callback = (params, trust, net_fee) => __awaiter(this, void 0, void 0, function* () {
                            console.log("[BlaCat]", '[main]', 'bancor交易确认..');
                            Main.viewMgr.change("ViewLoading");
                            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                try {
                                    yield this._bancor(params, trust, net_fee, Main.bancorCallback);
                                }
                                catch (e) {
                                    console.log("[BlaCat]", '[main]', 'bancor, _bancor(params, trust, net_fee, Main.bancorCallback) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'Main.bancorCallback =>', Main.bancorCallback, 'error => ', e.toString());
                                }
                                Main.viewMgr.viewLoading.remove();
                            }), 300);
                        });
                        BlackCat.ViewTransactionConfirm.callback_cancel = () => {
                            console.log("[BlaCat]", '[main]', 'bancor交易取消..');
                            var res = new BlackCat.Result();
                            res.err = true;
                            res.info = 'cancel';
                            if (Main.bancorCallback)
                                Main.bancorCallback(res);
                            Main.bancorCallback = null;
                            var callback_data = {
                                params: params,
                                res: res
                            };
                            Main.listenerCallback("bancorRes", callback_data);
                            Main.bancorCallback = null;
                        };
                        Main.viewMgr.change("ViewTransactionConfirm");
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
                            this.bancor(params, callback);
                        };
                        BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                            var res = new BlackCat.Result();
                            res.err = true;
                            res.info = 'cancel';
                            var callback_data = {
                                params: params,
                                res: res
                            };
                            Main.listenerCallback("bancorRes", callback_data);
                            callback(res);
                        };
                        Main.viewMgr.change("ViewWalletOpen");
                    }
                }
                else {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = 'bancor not ready';
                    var callback_data = {
                        params: params,
                        res: res
                    };
                    Main.listenerCallback("bancorRes", callback_data);
                    callback(res);
                }
            });
        }
        _bancor(params, trust = "0", net_fee, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                Main.setLiveTime();
                try {
                    var res = yield BlackCat.tools.CoinTool.nep5Transaction(Main.user.info.wallet, params.bancorAddr, params.nnc, params.count, net_fee);
                    if (res) {
                        console.log("[BlaCat]", '[main]', '_bancor转账结果 => ', res);
                        if (res.err == false) {
                            yield BlackCat.ApiTool.addUserWalletLogs(Main.user.info.uid, Main.user.info.token, res.info, "0", params.count, "14", JSON.stringify(params), Main.netMgr.type, trust, net_fee);
                        }
                    }
                }
                catch (e) {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = e.toString();
                    console.log("[BlaCat]", '[main]', '_bancor, tools.CoinTool.nep5TransactionMain.user.info.wallet, bancorAddr, params.asset, params.count, net_fee) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'e => ', e.toString());
                }
                yield Main.viewMgr.payView.doGetWalletLists(1);
                Main.needGetPlatNotifys = true;
                Main.getPlatNotifys();
                var callback_data = {
                    params: params,
                    res: res
                };
                Main.listenerCallback("bancorRes", callback_data);
                if (callback) {
                    try {
                        callback(res);
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[main]', '_bancor, app callback error! tools.CoinTool.nep5TransactionMain.user.info.wallet, bancorAddr, params.asset, params.count, net_fee) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'e => ', e.toString());
                    }
                }
                Main.bancorCallback = null;
            });
        }
        buyVip(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Main.isWalletOpen()) {
                    params.pay_way = params.pay_way.toUpperCase();
                    params.month = params.month.toString();
                    var nnc = BlackCat.ModifyVipView.getPayNnc(params.pay_way);
                    var target = BlackCat.ModifyVipView.getPayTarget();
                    var total = BlackCat.ModifyVipView.getPayAmount(params.pay_way, params.month);
                    var size = 100000000;
                    if (params.pay_way == "BCT") {
                        size = 10000;
                    }
                    var log_sbParamJson = "(addr)" + Main.user.info.wallet + ",(address)" + target + ",(integer)" + (total * size).toString();
                    params['uid'] = Main.user.info.uid,
                        params['nnc'] = nnc;
                    params['sbPushString'] = "transfer";
                    params['sbParamJson'] = log_sbParamJson;
                    params['toaddr'] = target;
                    params['total'] = total.toString();
                    params['refer'] = "1";
                    BlackCat.ViewTransactionConfirm.isTrustFeeLess = false;
                    let unTrust = Main.getUnTrustNnc(params);
                    if (unTrust.length == 0) {
                        if (Main.viewMgr.payView.gas > Number(Main.user.info.service_charge)) {
                            console.log("[BlaCat]", '[main]', 'bancor, trust nnc ...');
                            this._buyVip(params, "0", Main.user.info.service_charge, callback);
                            return;
                        }
                        else {
                            BlackCat.ViewTransactionConfirm.isTrustFeeLess = true;
                        }
                    }
                    if (Main.viewMgr.mainView.isHidden()) {
                        Main.viewMgr.mainView.show();
                        Main.viewMgr.iconView.hidden();
                    }
                    if (Main.buyVipCallback) {
                        Main.showErrMsg("main_wait_for_last_tran");
                        return;
                    }
                    Main.buyVipCallback = callback;
                    var list = new BlackCat.walletLists();
                    list.params = JSON.stringify(params);
                    list.wallet = Main.user.info.wallet;
                    list.g_id = "0";
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = total.toString();
                    list.type = "16";
                    list.type_detail = BlackCat.PayTransferView.log_type_detail[params.pay_way.toLowerCase()];
                    BlackCat.ViewTransactionConfirm.list = list;
                    BlackCat.ViewTransactionConfirm.refer = "";
                    BlackCat.ViewTransactionConfirm.callback_params = params;
                    BlackCat.ViewTransactionConfirm.callback = (params, trust, net_fee) => __awaiter(this, void 0, void 0, function* () {
                        console.log("[BlaCat]", '[main]', 'buyVip交易确认..');
                        yield this._buyVip(params, trust, net_fee, Main.buyVipCallback);
                    });
                    BlackCat.ViewTransactionConfirm.callback_cancel = () => {
                        console.log("[BlaCat]", '[main]', 'buyVip交易取消..');
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        if (Main.buyVipCallback)
                            Main.buyVipCallback(res);
                        Main.buyVipCallback = null;
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("buyVipRes", callback_data);
                    };
                    Main.viewMgr.change("ViewTransactionConfirm");
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
                        this.buyVip(params, callback);
                    };
                    BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                        var res = new BlackCat.Result();
                        res.err = true;
                        res.info = 'cancel';
                        var callback_data = {
                            params: params,
                            res: res
                        };
                        Main.listenerCallback("buyVipRes", callback_data);
                        callback(res);
                    };
                    Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        _buyVip(params, trust = "0", net_fee, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                Main.setLiveTime();
                try {
                    var res = yield BlackCat.ModifyVipView.pay(params.pay_way, params.month, params.invite, net_fee, trust, callback, true, params);
                }
                catch (e) {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = e.toString();
                    console.log("[BlaCat]", '[main]', '_buyVip, ModifyVipView.pay(params.pay_way, params.month, params.invite, net_fee, trust, callback, true, params) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'e => ', e.toString());
                }
                var callback_data = {
                    params: params,
                    res: res
                };
                Main.listenerCallback("buyVipRes", callback_data);
                if (callback) {
                    try {
                        callback(res);
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[main]', '_buyVip, app callback error! ModifyVipView.pay(params.pay_way, params.month, params.invite, net_fee, trust, callback, true, params) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'e => ', e.toString());
                    }
                }
                Main.buyVipCallback = null;
            });
        }
        static loginCallback() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!Main.isLoginCallback) {
                    var res = yield BlackCat.ApiTool.getEnterParams(Main.user.info.uid, Main.user.info.token, Main.appid);
                    if (res.r) {
                        Main.setGameInfo(res.data.gameParam);
                        Main.setTsOffset(res.data.loginParam);
                        var res_nncs = yield BlackCat.ApiTool.getTrustNncs(Main.user.info.uid, Main.user.info.token, Main.appid);
                        if (res_nncs.r) {
                            Main.app_trust = res_nncs.data;
                        }
                        else {
                            Main.app_trust = [];
                        }
                        Main.isLoginCallback = true;
                        Main.needGetAppNotifys = true;
                        Main.needGetPlatNotifys = true;
                        Main.listenerCallback("loginRes", res.data.loginParam);
                        if (Main.loginFunctionCallback)
                            Main.loginFunctionCallback(res.data.loginParam);
                        console.log("[BlaCat]", '[main]', 'loginCallback，轮询平台notify和应用notify');
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
            Main.applang = param.lang;
            Main.app_recharge_addr = param.recharge_addr;
            if (param.hasOwnProperty('region')) {
                var appname = {};
                var appicon = {};
                for (let region in param.region) {
                    if (region == Main.langMgr.type) {
                        appname[region] = param.region[region]['name'];
                        appicon[region] = param.region[region]['icon'];
                    }
                }
                if (appname != {}) {
                    Main.appname = JSON.stringify(appname);
                }
                if (appicon != {}) {
                    Main.appicon = JSON.stringify(appicon);
                }
            }
            if (param.hasOwnProperty('coin')) {
                var appcoin = {};
                for (let icon in param.coin) {
                    appcoin[icon] = param.coin[icon];
                }
                if (appcoin != {}) {
                    Main.appcoin = JSON.stringify(appcoin);
                }
            }
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
                    console.log("[BlaCat]", '[main]', 'update, Main.getAppNotifys() error => ', e.toString());
                }
                try {
                    yield Main.getPlatNotifys();
                }
                catch (e) {
                    console.log("[BlaCat]", '[main]', 'update, Main.getPlatNotifys() error => ', e.toString());
                }
                if (Main.viewMgr.payView && Main.viewMgr.payView.isCreated && !Main.viewMgr.payView.isHidden()) {
                    try {
                        Main.viewMgr.payView.flushListCtm();
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[main]', 'update, Main.viewMgr.payView.flushListCtm() error => ', e.toString());
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
                    console.log("[BlaCat]", '[main]', 'getAppNotifys, 执行前，是否获取: ' + Main.needGetAppNotifys
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
                            console.log("[BlaCat]", '[main]', 'getAppNotifys, 没有等待确认的数据，关闭轮询');
                            Main.needGetAppNotifys = false;
                            Main.appWalletNotifyId = Main.appWalletLogId;
                        }
                        if (res.data.complete.length > 0) {
                            var new_app_notifys = new Array();
                            var has_partner_txid = false;
                            yield res.data.complete.forEach(list => {
                                var list_id = parseInt(list.id);
                                if (!Main.appNotifyTxids.hasOwnProperty(list.txid)) {
                                    new_app_notifys.push(list);
                                    if (list.type_detail == "3") {
                                        has_partner_txid = true;
                                    }
                                }
                                if (Main.appWalletNotifyId < list_id)
                                    Main.appWalletNotifyId = list_id;
                                if (Main.appWalletLogId < list_id)
                                    Main.appWalletLogId = list_id;
                                Main.appNotifyTxids[list.txid] = 1;
                            });
                            if (new_app_notifys.length > 0) {
                                console.log("[BlaCat]", '[main]', 'getAppNotifys, 需要回调数据 => ', new_app_notifys);
                                if (has_partner_txid) {
                                    Main.needGetPlatNotifys = true;
                                    Main.getPlatNotifys();
                                }
                                Main.listenerCallback("getAppNotifysRes", new_app_notifys);
                            }
                        }
                    }
                    console.log("[BlaCat]", '[main]', 'getAppNotifys，执行后，是否获取: ' + Main.needGetAppNotifys
                        + ", 最近记录ID: " + Main.appWalletLogId
                        + ", 最近通知ID: " + Main.appWalletNotifyId);
                    return true;
                }
                return false;
            });
        }
        static doPlatNotify(params) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[main]', 'doPlatNotify, params => ', params);
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
                                        console.log("[BlaCat]", '[main]', '***getPlatNotifys，钱包未打开，收集数据');
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
                        case "14":
                            if (params[k].state == "1") {
                                if (!Main.isWalletOpen()) {
                                    console.log("[BlaCat]", '[main]', '***getPlatNotifys，钱包未打开，收集数据');
                                    if (!openTask) {
                                        openTask = new Array();
                                    }
                                    openTask.push(params[k]);
                                    break;
                                }
                                Main.doPlatNotifyBancor(params[k]);
                            }
                            else {
                                this.confirmPlatNotify(params[k]);
                            }
                            break;
                        case "16":
                            if (params[k].state == "1") {
                                try {
                                    var res = yield Main.user.isLogined();
                                    if (res && Main.viewMgr.personalCenterView) {
                                        Main.viewMgr.personalCenterView.updateVip();
                                    }
                                    let params_tmp = JSON.parse(params[k].params);
                                    if (params_tmp.hasOwnProperty("refer") && params_tmp['refer'] == "1") {
                                        var listener_res = new BlackCat.Result();
                                        listener_res.err = false;
                                        listener_res.info = params_tmp;
                                        Main.listenerCallback("buyVipResNotify", listener_res);
                                    }
                                }
                                catch (e) { }
                            }
                            this.confirmPlatNotify(params[k]);
                            break;
                        case "17":
                            if (params[k].state == "1") {
                                try {
                                    var res = yield Main.user.isLogined();
                                    if (res && Main.viewMgr.personalCenterView) {
                                        Main.viewMgr.personalCenterView.updateVip();
                                    }
                                    let params_tmp = JSON.parse(params[k].params);
                                    var listener_res = new BlackCat.Result();
                                    listener_res.err = false;
                                    listener_res.info = params_tmp;
                                    Main.listenerCallback("PartnerResNotify", listener_res);
                                }
                                catch (e) { }
                            }
                            this.confirmPlatNotify(params[k]);
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
        static continueWithOpenWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewConfirm.callback = () => {
                    BlackCat.ViewWalletOpen.refer = null;
                    BlackCat.ViewWalletOpen.callback = null;
                    Main.viewMgr.change("ViewWalletOpen");
                };
                Main.showConFirm("main_need_open_wallet_confirm");
            });
        }
        static doPlatNotifyBancor(params) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var params_obj = JSON.parse(params.params);
                }
                catch (e) {
                    Main.showErrMsg("main_bancor_second_fail");
                    return;
                }
                if (params_obj['type'] == "1") {
                    var params_data = {
                        nnc: BlackCat.tools.CoinTool.id_bancor,
                        sbParamJson: ["(hex160)" + params_obj['asset'], "(hex256)" + params.txid],
                        sbPushString: "purchase",
                    };
                }
                else if (params_obj['type'] == "2") {
                    var params_data = {
                        nnc: BlackCat.tools.CoinTool.id_bancor,
                        sbParamJson: ["(hex160)" + params_obj['asset'], "(hex256)" + params.txid],
                        sbPushString: "sale",
                    };
                }
                if (params_data) {
                    var res = yield Main.wallet.bancorTransaction(params_data, params.net_fee);
                    if (res.err === false) {
                        this.confirmPlatNotify(params);
                        Main.viewMgr.payView.doGetWalletLists(1);
                    }
                }
            });
        }
        static doPlatNotiyRefund(params) {
            return __awaiter(this, void 0, void 0, function* () {
                var key = "cgas";
                for (let k in BlackCat.PayTransferView.log_type_detail) {
                    if (BlackCat.PayTransferView.log_type_detail[k] == params.type_detail) {
                        key = k;
                    }
                }
                var id_asset = BlackCat.tools.CoinTool.id_GAS;
                if (key == "cneo") {
                    id_asset = BlackCat.tools.CoinTool.id_NEO;
                }
                var id_asset_name = key.toUpperCase();
                var id_asset_nep5 = BlackCat.tools.CoinTool["id_" + id_asset_name];
                var utxo = new BlackCat.tools.UTXO();
                utxo.addr = Main.user.info.wallet;
                utxo.txid = params.txid;
                utxo.asset = id_asset;
                utxo.count = Neo.Fixed8.parse(params.cnts.toString());
                utxo.n = 0;
                var utxos_assets = {};
                utxos_assets[id_asset] = [];
                utxos_assets[id_asset].push(utxo);
                console.log("[BlaCat]", '[main]', 'doPlatNotiyRefund, utxos_assets => ', utxos_assets);
                try {
                    let net_fee = "0";
                    try {
                        let p = JSON.parse(params.params);
                        if (p.hasOwnProperty("net_fee")) {
                            net_fee = p.net_fee;
                        }
                    }
                    catch (e) {
                    }
                    if (id_asset_name == "CGAS") {
                        var refundcounts = Number(params.cnts) - Number(net_fee);
                        if (refundcounts < Number(net_fee)) {
                            var makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, Main.user.info.wallet, id_asset, Neo.Fixed8.fromNumber(Number(params.cnts)));
                        }
                        else {
                            var makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, Main.user.info.wallet, id_asset, Neo.Fixed8.fromNumber(Number(params.cnts) - Number(net_fee)), Neo.Fixed8.Zero, 1);
                        }
                    }
                    else {
                        var makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, Main.user.info.wallet, id_asset, Neo.Fixed8.fromNumber(Number(params.cnts)));
                        if (Number(net_fee) > 0 && Main.viewMgr.payView.gas >= Number(net_fee)) {
                            try {
                                var user_utxos_assets = yield BlackCat.tools.CoinTool.getassets();
                                console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_utxos_assets => ', user_utxos_assets);
                                var user_makeTranRes = BlackCat.tools.CoinTool.makeTran(user_utxos_assets, Main.user.info.wallet, BlackCat.tools.CoinTool.id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)));
                                var user_tran = user_makeTranRes.info.tran;
                                for (let i = 0; i < user_tran.inputs.length; i++) {
                                    makeTranRes.info.tran.inputs.push(user_tran.inputs[i]);
                                }
                                for (let i = 0; i < user_tran.outputs.length; i++) {
                                    makeTranRes.info.tran.outputs.push(user_tran.outputs[i]);
                                }
                                var user_oldarr = user_makeTranRes.info.oldarr;
                                for (let i = 0; i < user_oldarr.length; i++) {
                                    makeTranRes.info.oldarr.push(user_oldarr[i]);
                                }
                                console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_makeTranRes => ', user_makeTranRes);
                            }
                            catch (e) {
                                let errmsg = Main.langMgr.get(e.message);
                                if (errmsg) {
                                    Main.showErrMsg((e.message));
                                }
                                else {
                                    Main.showErrMsg(("pay_makeMintGasNotEnough"));
                                }
                                return;
                            }
                        }
                    }
                }
                catch (e) {
                    Main.showErrMsg(("main_refund_second_" + id_asset_name + "_fail"));
                    return;
                }
                var tran = makeTranRes.info.tran;
                var oldarr = makeTranRes.info.oldarr;
                tran.type = ThinNeo.TransactionType.ContractTransaction;
                tran.version = 0;
                try {
                    let params_decode = JSON.parse(params.params);
                    if (params_decode && params_decode.hasOwnProperty("nnc")) {
                        id_asset_nep5 = params_decode.nnc;
                    }
                }
                catch (e) { }
                var r = yield BlackCat.tools.WWW.api_getcontractstate(id_asset_nep5);
                if (r && r["script"]) {
                    var Script = r["script"].hexToBytes();
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitPushNumber(new Neo.BigInteger(0));
                    sb.EmitPushNumber(new Neo.BigInteger(0));
                    tran.AddWitnessScript(Script, sb.ToArray());
                    var txid = tran.GetHash().clone().reverse().toHexString();
                    var trandata = tran.GetRawData();
                    r = yield BlackCat.tools.WWW.api_postRawTransaction(trandata);
                    if (r) {
                        console.log("[BlaCat]", '[main]', 'doPlatNotiyRefund, api_postRawTransaction.r => ', r);
                        if (r["txid"] || r['sendrawtransactionresult']) {
                            if (!r["txid"] || r["txid"] == "") {
                                r["txid"] = txid;
                            }
                            console.log("[BlaCat]", '[main]', 'doPlatNotiyRefund, txid => ', r.txid);
                            var res = yield Main.confirmPlatNotifyExt(params, r.txid);
                            this.doPlatNotifyRefundRes(params, r.txid);
                            var height = yield BlackCat.tools.WWW.api_getHeight_nodes();
                            oldarr.map(old => old.height = height);
                            BlackCat.tools.OldUTXO.oldutxosPush(oldarr);
                            Main.viewMgr.payView.doGetWalletLists(1);
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
        static doPlatNotifyTransferRes(params, txid) {
            return __awaiter(this, void 0, void 0, function* () {
                var r = yield BlackCat.tools.WWW.getrawtransaction(txid);
                if (r) {
                    console.log("[BlaCat]", '[main]', 'doPlatNotifyTransferRes, txid: ' + txid + ", r => ", r);
                    yield Main.confirmPlatNotify(params);
                    Main.viewMgr.payView.doGetWalletLists();
                }
                else {
                    setTimeout(() => {
                        this.doPlatNotifyTransferRes(params, txid);
                    }, 10000);
                }
            });
        }
        static doPlatNotifyRefundRes(params, txid) {
            return __awaiter(this, void 0, void 0, function* () {
                var r = yield BlackCat.tools.WWW.getrawtransaction(txid);
                if (r) {
                    console.log("[BlaCat]", '[main]', 'doPlatNotifyRefundRes, txid: ' + txid + ", r => ", r);
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
                    console.log("[BlaCat]", '[main]', '***getPlatNotifys, 执行前，是否获取: ' + Main.needGetPlatNotifys
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
                            console.log("[BlaCat]", '[main]', '***getPlatNotifys, 没有等待确认的数据，关闭轮询');
                            Main.needGetPlatNotifys = false;
                            Main.platWalletNotifyId = Main.appWalletLogId;
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
                                console.log("[BlaCat]", '[main]', '***getPlatNotifys, 有新数据 => ', new_plat_notifys);
                                Main.doPlatNotify(new_plat_notifys);
                            }
                        }
                    }
                    console.log("[BlaCat]", '[main]', '***getPlatNotifys, 执行后，是否获取: ' + Main.needGetPlatNotifys
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
                        console.log("[BlaCat]", '[main]', '未登录 ...');
                        Main.viewMgr.change("LoginView");
                        break;
                    case 1:
                        console.log("[BlaCat]", '[main]', '已登录，已绑定钱包 ...');
                        Main.viewMgr.change("PayView");
                        break;
                    case -1:
                        console.log("[BlaCat]", '[main]', '已登录，未绑定钱包 ...');
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
        static showToast(msgKey, showTime = 1500) {
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
            if (BlackCat.tools.WWW.api_nodes) {
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
                    console.log("[BlaCat]", '[main]', 'updateTrustNnc, ApiTool.getTrustNncs error => ', e.toString());
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
        static getStringNumber(num) {
            let num_str = num.toString();
            if (num_str.indexOf('-') >= 0) {
                num_str = '0' + (num + 1).toString().substr(1);
            }
            return num_str;
        }
        static setTsOffset(loginParam) {
            let curr_ts = Math.round((new Date()).getTime() / 1000);
            Main.tsOffset = (curr_ts - loginParam.time) * 1000;
            console.log('[BlaCat]', '[Main]', 'setTsOffset, tsOffset时间偏移(s) => ', Main.tsOffset / 1000);
        }
        static getUrlHead() {
            if (Main.urlHead === undefined) {
                if (window.location.protocol == "file:") {
                    Main.urlHead = "http:";
                }
                else {
                    Main.urlHead = "";
                }
            }
            return Main.urlHead;
        }
        static randomSort(arr, newArr) {
            if (arr.length == 1) {
                newArr.push(arr[0]);
                return newArr;
            }
            var random = Math.ceil(Math.random() * arr.length) - 1;
            newArr.push(arr[random]);
            arr.splice(random, 1);
            return Main.randomSort(arr, newArr);
        }
        static check() {
            var dev = "";
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                dev = "mobile";
            }
            else {
                dev = "pc";
            }
            return dev;
        }
        static in_array(search, array) {
            for (let k = 0; k < array.length; k++) {
                if (array[k] == search) {
                    return true;
                }
            }
            return false;
        }
    }
    Main.platName = "BlaCat";
    Main.platLoginType = 0;
    Main.resHost = BC_path + "../";
    Main.liveTimeMax = 60 * 60 * 1000;
    BlackCat.Main = Main;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ComponentBase {
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
    BlackCat.ComponentBase = ComponentBase;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class NetFeeComponent extends BlackCat.ComponentBase {
        constructor(parentDiv, callback, net_fees = []) {
            super();
            this.parentDiv = parentDiv;
            this.callback = callback;
            if (net_fees.length > 0) {
                this.net_fees = net_fees;
            }
            else {
                this.net_fees = ["0.001", "0.002", "0.004", "0.006", "0.008", "0.01"];
            }
            this.net_fee = "0";
            this.net_fee_show_rate = 1;
        }
        setFeeDefault(net_fee = BlackCat.Main.user.info.service_charge) {
            if (net_fee == "0") {
                this.net_fee = "0";
            }
            else {
                this.net_fee = this.net_fees[0];
                if (net_fee) {
                    for (let i = 0; i < this.net_fees.length; i++) {
                        if (this.net_fees[i] == net_fee) {
                            this.net_fee = net_fee;
                            break;
                        }
                    }
                }
            }
        }
        setNetFeeShowRate(rate = 1) {
            if (rate != this.net_fee_show_rate) {
                this.net_fee_show_rate = rate;
                this.showNetFee();
            }
        }
        createDiv() {
            this.mainDiv = this.objCreate("div");
            this.mainDiv.classList.add("pc_speed");
            this.ObjAppend(this.parentDiv, this.mainDiv);
            this.mainDiv_text = this.objCreate("div");
            this.ObjAppend(this.mainDiv, this.mainDiv_text);
            var divSpeedSelect = this.objCreate("div");
            var spanspeed = this.objCreate("span");
            this.ObjAppend(divSpeedSelect, spanspeed);
            spanspeed.textContent = BlackCat.Main.langMgr.get("pay_transCount_speed");
            this.ObjAppend(this.mainDiv, divSpeedSelect);
            this.inputFree = this.objCreate("input");
            this.inputFree.type = "radio";
            this.inputFree.onclick = () => {
                this.dofree();
            };
            this.ObjAppend(divSpeedSelect, this.inputFree);
            var divEllipsis = this.objCreate("div");
            divEllipsis.classList.add("pc_ellipsis");
            for (let i = 0; i < this.net_fees.length; i++) {
                divEllipsis.innerHTML += "<label></label>";
            }
            this.ObjAppend(divSpeedSelect, divEllipsis);
            this.inputcharge = this.objCreate("input");
            this.inputcharge.type = "range";
            this.inputcharge.value = '0';
            this.inputcharge.max = (this.net_fees.length - 1).toString();
            this.inputcharge.oninput = () => {
                this.dospeed();
            };
            this.inputcharge.onclick = () => {
                this.dospeed();
            };
            this.ObjAppend(divSpeedSelect, this.inputcharge);
            var divSpeedtips = this.objCreate("ul");
            divSpeedtips.innerHTML =
                "<li>"
                    + BlackCat.Main.langMgr.get('pay_transCountTips_free') + "</li><li>"
                    + BlackCat.Main.langMgr.get('pay_transCountTips_slow') + "</li><li>"
                    + BlackCat.Main.langMgr.get('pay_transCountTips_fast')
                    + "</li>";
            this.ObjAppend(this.mainDiv, divSpeedtips);
            this.ObjAppend(this.parentDiv, this.mainDiv);
            if (this.net_fee == "0") {
                this.dofree();
            }
            else {
                this.dospeed(this.net_fee);
            }
        }
        hidden() {
            this.mainDiv.style.display = "none";
            this.callback(0);
        }
        show() {
            this.mainDiv.style.display = "block";
            this.callback(this.net_fee);
        }
        getNetFeesIdx(net_fee) {
            let idx = undefined;
            for (let i = 0; i < this.net_fees.length; i++) {
                if (this.net_fees[i] == net_fee) {
                    return i;
                }
            }
            return idx;
        }
        dofree() {
            this.net_fee = "0";
            this.inputFree.checked = true;
            this.inputcharge.classList.remove("pc_active");
            this.showNetFee();
            this.callback(this.net_fee);
        }
        dospeed(net_fee = undefined) {
            if (net_fee != undefined) {
                let idx = this.getNetFeesIdx(net_fee);
                if (idx != undefined) {
                    this.inputcharge.value = idx;
                }
            }
            else {
                var idx = parseInt(this.inputcharge.value);
                if (this.net_fees[idx]) {
                    this.net_fee = this.net_fees[idx];
                }
                else {
                    this.net_fee = this.net_fees[0];
                }
            }
            this.inputcharge.classList.add("pc_active");
            this.inputFree.checked = false;
            this.showNetFee();
            this.callback(this.net_fee);
        }
        getNetFeeShow() {
            return BlackCat.floatNum.times(Number(this.net_fee), this.net_fee_show_rate).toString();
        }
        showNetFee() {
            let showNetFee = BlackCat.floatNum.times(Number(this.net_fee), this.net_fee_show_rate).toString();
            this.mainDiv_text.textContent = BlackCat.Main.langMgr.get("pay_transCount_cost") + showNetFee + " (" + BlackCat.Main.langMgr.get("gas") + ")";
        }
    }
    BlackCat.NetFeeComponent = NetFeeComponent;
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
                cgas: "CGAS",
                gas: "GAS",
                bct: "BCT",
                bcp: "BCP",
                neo: "NEO",
                cneo: "CNEO",
                btc: "BTC",
                eth: "ETH",
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
                register_inputinvite: "请输入邀请码",
                register_inputinvite_err: "邀请码已使用或不存在",
                register_getCodeSucc: "验证码已成功发送",
                register_getCode: "获取验证码",
                register_getCodecount: "重新获取(60)",
                register_getCodecountRetry: "重新获取",
                register_exceed: "设置密码不能超过32个字符",
                register_doLogin: "<<返回登录",
                register_doRegister: "立即注册",
                register_invitation: "邀请码",
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
                forgetpass_exceed: "设置密码不能超过32个字符",
                forgetpass_doLogin: "<<返回登录",
                forgetpass_do: "确定",
                forgetpass_do_ok: "重置成功，请重新登录！",
                personalcenter: "个人中心",
                myinfo_leve: "等级",
                myinfo_modify: "修改",
                myinfo_member: "会员",
                myinfo_openmember: "开通会员",
                myinfo_permanentmember: "永久会员",
                myInfo: "我的信息",
                myinfo_headImg: "头像",
                myinfo_nickname: "昵称",
                myinfo_sex: "性别",
                myinfo_sex_0: "请选择",
                myinfo_sex_1: "男",
                myinfo_sex_2: "女",
                myinfo_uid: "用户名",
                myinfo_area: "地区",
                myinfo_fee: "交易手续费",
                myinfo_fee_empty: "请选择",
                myinfo_area_empty: "请选择",
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
                modifyArea: "地区",
                modifyArea_succ: "地区修改成功",
                modifyFee: "交易手续费",
                modifyFee_succ: "交易手续费修改成功",
                modifyNet: "网络线路",
                modifyNet_succ: "网络线路修改成功",
                modifyNet_node_err: "该网络线路不可用，请选择其他线路！",
                modifyVip_succ: "购买会员请求提交成功！",
                modifyVip_fail: "购买会员请求提交失败！",
                modifyVip_balance_error: "%coin_type%余额不足，无法购买！",
                modifyVip_gas_less: "GAS余额不足，无法支付手续费！",
                modifyVip_invite_err: "推荐者账号不存在！",
                modifyVip_12months: "12个月",
                modifyVip_3months: "3个月",
                modifyVip_1months: "1个月",
                modifyVip_payway: "支付方式",
                modifyVip_inviteplaceholder: "请输入推荐人账号",
                modifyVip_paymenttxt: "支付金额:",
                modifyVip_payment: "支付",
                modifyVip_recharge: "续费",
                modifyvip_payAmonth: "确定花费%total%%pay_way%购买%goods_item%个月的会员？ ",
                modifyvip_payconfirm: "确定花费%total%%pay_way%购买%goods_item%个月的会员？",
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
                pay_transferType: "代币：",
                pay_transferBalance: "余额：",
                pay_transferToAddr: "转账地址",
                pay_transferCount: "转账金额",
                pay_transferToAddrError: "转账地址错误",
                pay_transferCountError: "转账金额错误",
                pay_transferDoSucc: "转账操作成功",
                pay_transferDoFail: "转账失败",
                pay_transferGasNotEnough: "GAS余额不足！",
                pay_transferBCPNotEnough: "BCP余额不足！",
                pay_transferBCTNotEnough: "BCT余额不足！",
                pay_transferNEONotEnough: "NEO余额不足！",
                pay_transferCNEONotEnough: "CNEO余额不足！",
                pay_transferCGASNotEnough: "CGAS余额不足！",
                pay_wallet: "我的钱包",
                pay_refresh: "刷新",
                pay_wallet_detail: "详情",
                pay_coin_name: "代币",
                pay_coin_old: "CGAS(old)兑换",
                pay_coin_blacat: "BlaCat",
                pay_coin_neo: "NEO",
                pay_coin_other: "其他",
                pay_gas: "GAS",
                pay_gas_desc: "GAS是NEO链上的数字货币，可以通过交易所获取",
                pay_cgas: "CGAS",
                pay_cgas_desc: "CGAS是BlaCat提供给玩家消费用的通用筹码",
                pay_neo: "NEO",
                pay_neo_desc: "NEO是NEO链上的数字货币，可以通过交易所获取",
                pay_cneo: "CNEO",
                pay_cneo_desc: "CNEO是BlaCat提供给玩家消费用的通用筹码",
                pay_btc: "BTC",
                pay_eth: "ETH",
                pay_send: "转账",
                pay_purchase: "购买",
                pay_purchase_testnet_cant_buy: "请切换到主网购买GAS！",
                pay_makeMint: "兑换",
                pay_recentLists: "交易中",
                pay_more: "记录",
                pay_makeMintGasNotEnough: "GAS余额不足",
                pay_makeMintNeoNotEnough: "NEO余额不足",
                pay_makeMintDoFail: "充值CGAS失败！\r\n充值合约执行失败！\r\n请等待上次充值确认后再操作！",
                pay_makeMintDoFail2: "充值CGAS失败！\r\n发送充值请求失败！请检查网络，稍候重试！",
                pay_makeRefundCgasNotEnoughUtxo: "CGAS兑换繁忙，请稍后重试！",
                pay_makeRefundCneoNotEnoughUtxo: "CNEO兑换繁忙，请稍后重试！",
                pay_makeRefundCgasNotEnough: "CGAS余额不足",
                pay_makeRefundCneoNotEnough: "CNEO余额不足",
                pay_makeRefundGasFeeNotEnough: "GAS余额不足，无法支付手续费！",
                pay_makeRefundGasLessThanFee: "兑换GAS的金额不能小于手续费！",
                pay_makeRefundDoFail: "提取合约执行失败！请等待上个提现或兑换交易完成再操作！",
                pay_makeRefundDoFail2: "发送提取交易失败！请检查网络，稍候重试！",
                pay_makeRefundGetScriptFail: "获取提取合约失败！",
                pay_makeRefundCgasOldNotEnough: "CGAS(old)余额不足",
                pay_makeRefundCneoOldNotEnough: "CNEO(old)余额不足",
                pay_makeMintGasUtxoCountsLimit: "资产块超出规定数量，需要自己给自己钱包转入%gas%数量的GAS才能继续操作。",
                pay_makeMintNeoUtxoCountsLimit: "资产块超出规定数量，需要自己给自己钱包转入%neo%数量的NEO才能继续操作。",
                pay_walletbtn: "钱包",
                pay_assets: "虚拟资产",
                pay_get: "获取",
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
                pay_makerawtrans_fee_less: "GAS余额不足，无法支付手续费！",
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
                pay_exchange_bct: "获取BCT",
                pay_exchange_cgas: "购买CGAS",
                pay_exchange_purchase: "购买",
                pay_exchange_price: "最新价",
                pay_exchange_balance: "余额",
                pay_exchange_balance_not_enough: "余额不足！",
                pay_exchange_range: "24H涨跌",
                pay_exchange_buy_ok: "提交成功！",
                pay_exchange_consumption: "消耗：",
                pay_exchange_placeholderconfirm: "输入购买数量",
                pay_exchange_confirmbuy: "确认购买",
                pay_exchange_purchase_process: "购买流程",
                pay_exchange_processp1: "1.以下是平台提供%type%钱包地址，请去各大交易所转入所需要的%type1%数量，转账成功后上方会显示您的%type2%余额",
                pay_exchange_bcp: "获取BCP",
                pay_exchange_create_wallet_fail: "创建交易钱包失败，请稍候重试！",
                pay_exchange_detail_buy_CGAS_fail: "购买CGAS失败！",
                pay_exchange_detail_buy_BCP_fail: "购买BCP失败！",
                pay_exchange_buyNEO: "输入支付数量",
                pay_exchange_spent_not_enough: "数量太小，请调整数量！",
                pay_exchange_getmore: "获取%type%>>",
                pay_makeRecharge: "充值",
                pay_trust_tips: "信任合约",
                pay_trust_Vice_tips: "本合约交易不再弹出此窗口,如需更改手续费请前往设置界面",
                pay_transfer_toaddr: "转账地址",
                pay_transfer_count: "转账金额",
                pay_transCount_count: "兑换",
                pay_transCount_inputCount: "请输入需要兑换的金额",
                pay_transCount_err: "请输入正确的金额",
                pay_transCountGAS: "GAS：",
                pay_transCountCGAS: "CGAS：",
                pay_transCountCGASOLD: "CGAS(old)：",
                pay_transCountCGAS2GAS: "GAS",
                pay_transCountGAS2CGAS: "CGAS",
                pay_transCountCGASOLD2OLD: "CGAS(old)",
                pay_transCountNEO: "NEO：",
                pay_transCountCNEO: "CNEO：",
                pay_transCountCNEOOLD: "CNEO(old)：",
                pay_transCountCNEO2NEO: "NEO",
                pay_transCountNEO2CNEO: "CNEO",
                pay_transCountCNEOOLD2OLD: "CNEO(old)",
                pay_transCountTips_free: "免费",
                pay_transCountTips_slow: "慢",
                pay_transCountTips_fast: "快",
                pay_transCount_speed: "交易速度",
                pay_transCount_cost: "手续费：",
                pay_transCount_tips: "选择您要兑换的代币",
                pay_transCount_tips_err: "选择您要兑换的代币",
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
                walletCreate_check_exceed: "设置密码不能超过32个字符",
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
                main_refund_CGAS_second_fail: "生成转换请求（utxo->gas）失败",
                main_refund_CNEO_second_fail: "生成转换请求（utxo->neo）失败",
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
                errCode_100700: "账号或密码错误！",
                errCode_100701: "登录失效，请重新登录",
                errCode_100702: "账号或密码错误，请重试",
                errCode_100707: "用户名已存在！",
                errCode_100708: "用户名格式不正确！",
                errCode_100709: "地区代码错误！",
                errCode_100801: "获取邮箱验证码失败！",
                errcode_100802: "邮箱验证码错误！",
                errCode_100805: "邮箱已注册！",
                errCode_100806: "邮箱未注册，请先注册",
                errCode_100807: "用户名或邮箱错误！",
                errCode_100808: "邮箱或密码错误！",
                errCode_8100000: "已经绑定过钱包了，不需要再次绑定！",
                errCode_8100001: "上传绑定的钱包格式错误，请检查钱包文件！",
                errCode_8100002: "系统错误，钱包绑定失败！",
                errCode_8100003: "该钱包已经被其他用户绑定了！",
                errCode_8100004: "头像文件格式不支持！",
                errcode_8100005: "头像文件上传失败！",
                errcode_8100006: "头像文件大小不能超过100kb！",
                errCode_8100007: "联系人已存在！",
                errCode_8200003: "不支持的交易类型",
                errCode_8200004: "购买价格异常，请刷新重试！",
                errCode_8200006: "库存不足，我们会尽快补充，请稍后再试。",
                errCode_default: "未知错误！错误码： %errCode%",
                wallet_open_check: "请核对钱包文件或密码！",
                wallet_open_check_otcgo: "请核对蓝鲸淘钱包文件！",
                wallet_open_check_otcgo_pwd: "请核对蓝鲸淘钱包密码！",
                netmgr_select_api_slow: "与服务器连接异常或缓慢，请检查网络后重试！",
                netmgr_select_node_slow: "与链上节点通讯异常或缓慢，请检查网络后重试！",
                netmgr_select_cli_slow: "与链上节点通讯异常，请检查网络后重试！",
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
                cgas: "CGAS",
                gas: "GAS",
                bct: "BCT",
                bcp: "BCP",
                neo: "NEO",
                cneo: "CNEO",
                btc: "BTC",
                eth: "ETH",
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
                register_inputinvite: "请输入邀请码",
                register_inputinvite_err: "邀请码已使用或不存在",
                register_getCodeSucc: "Verification code was successfully sent",
                register_getCode: "Get Code",
                register_getCodecount: "Retry(60)",
                register_getCodecountRetry: "Retry",
                register_exceed: "Please set your password within 32 letters",
                register_doLogin: "<<back",
                register_doRegister: "sign up",
                register_invitation: "Invitation code",
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
                forgetpass_exceed: "Please set your password within 32 letters",
                forgetpass_doLogin: "<<back",
                forgetpass_do: "OK",
                forgetpass_do_ok: "Modified successfully, please login again",
                personalcenter: "My Info",
                myinfo_leve: "Level",
                myinfo_modify: "Modify",
                myinfo_member: "Membership",
                myinfo_openmember: "Upgrade to Membership",
                myinfo_permanentmember: "永久会员",
                myInfo: "my information",
                myinfo_headImg: "Avatar",
                myinfo_nickname: "Nickname",
                myinfo_sex: "Gender",
                myinfo_sex_0: "Please choose",
                myinfo_sex_1: "Male",
                myinfo_sex_2: "Female",
                myinfo_uid: "Username",
                myinfo_area: "Area",
                myinfo_fee: "Transaction Fee",
                myinfo_fee_empty: "Please choose",
                myinfo_area_empty: "Please choose",
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
                modifyArea: "Area",
                modifyArea_succ: "Area modified successfully!",
                modifyFee: "Transaction Fee",
                modifyFee_succ: "Transaction Fee modified successfully!",
                modifyNet: "Network line",
                modifyNet_succ: "Network line modified successfully!",
                modifyNet_node_err: "This network line is not available, please choose another line!",
                modifyVip_succ: "Succeeded！",
                modifyVip_fail: "Failed！",
                modifyVip_balance_error: "Insufficient %coin_type%！",
                modifyVip_gas_less: "Insufficient GAS！",
                modifyVip_invite_err: "The account does not exist！",
                modifyVip_12months: "12 months",
                modifyVip_3months: "3 months",
                modifyVip_1months: "A month",
                modifyVip_payway: "Way",
                modifyVip_inviteplaceholder: "Please input the account of your introducer.",
                modifyVip_paymenttxt: "Amount:",
                modifyVip_payment: "Payment",
                modifyVip_recharge: "Recharge",
                modifyvip_payAmonth: "%total%%pay_way% per membership month. ",
                modifyvip_payconfirm: "%total%%pay_way% per membership %goods_item%months.",
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
                pay_transfer: "SEND",
                pay_transferType: "Token：",
                pay_transferBalance: "Balance:",
                pay_transferToAddr: "Address",
                pay_transferCount: "Amounts",
                pay_transferToAddrError: "The SEND address is incorrect!",
                pay_transferCountError: "The number of SEND is incorrect!",
                pay_transferDoSucc: "SEND success",
                pay_transferDoFail: "SEND failed!",
                pay_transferGasNotEnough: "GAS balance is insufficient!",
                pay_transferBCPNotEnough: "BCP balance is insufficient!",
                pay_transferBCTNotEnough: "BCT balance is insufficient!",
                pay_transferNEONotEnough: "NEO balance is insufficient!",
                pay_transferCNEONotEnough: "CNEO balance is insufficient!",
                pay_transferCGASNotEnough: "CGAS balance is insufficient!",
                pay_wallet: "My Wallet",
                pay_refresh: "Refresh",
                pay_wallet_detail: "Details",
                pay_coin_name: "Token",
                pay_coin_old: "CGAS(old)Exchange",
                pay_coin_blacat: "BlaCat",
                pay_coin_neo: "NEO",
                pay_coin_other: "Others",
                pay_gas: "GAS",
                pay_gas_desc: "GAS is a digital currency on NEO chain that can be obtained through exchanges",
                pay_cgas: "CGAS",
                pay_cgas_desc: "CGAS is a universal chip that BlaCat offers to players.",
                pay_neo: "NEO",
                pay_neo_desc: "NEO is the digital currency in NEO blockchain and can be bought in Exchange",
                pay_cneo: "CNEO",
                pay_cneo_desc: "CNEO is the universal token provided by BlaCat to player",
                pay_btc: "BTC",
                pay_eth: "ETH",
                pay_send: "SEND",
                pay_purchase: "Purchase",
                pay_purchase_testnet_cant_buy: "Please switch Mainnet to buy GAS!",
                pay_makeMint: "Exchange",
                pay_recentLists: "Pending",
                pay_more: "Records",
                pay_makeMintGasNotEnough: "GAS balance is insufficient",
                pay_makeMintNeoNotEnough: "NEO balance is insufficient",
                pay_makeMintDoFail: "Recharge CGAS failed!\r\n Recharge contract execution failed!\r\nPlease wait for the last recharge confirmation before proceeding!",
                pay_makeMintDoFail2: "Recharge CGAS failed! \r\nFailed to send recharge request! Please check network and try again later!",
                pay_makeRefundCgasNotEnoughUtxo: "CGAS exchange is busy, please try it again later!",
                pay_makeRefundCneoNotEnoughUtxo: "CNEO exchange is busy, please try it again later!",
                pay_makeRefundCgasNotEnough: "CGAS balance is insufficient",
                pay_makeRefundCneoNotEnough: "CNEO balance is insufficient",
                pay_makeRefundGasFeeNotEnough: "GAS balance is insufficient.",
                pay_makeRefundGasLessThanFee: "The amount of GAS cannot be less than the handling fee.",
                pay_makeRefundDoFail: "The extraction contract execution failed! Please wait for the last withdrawal or redemption transaction to complete!",
                pay_makeRefundDoFail2: "Sending an extraction transaction failed! Please check network and try again later!",
                pay_makeRefundGetScriptFail: "Getting extraction contract failed!",
                pay_makeRefundCgasOldNotEnough: "CGAS(old) balance is insufficient",
                pay_makeRefundCneoOldNotEnough: "CNEO(old) balance is insufficient",
                pay_makeMintGasUtxoCountsLimit: "Assets exceed the maximum, please input your wallet address then transfer %gas% GAS to your own wallet first.",
                pay_makeMintNeoUtxoCountsLimit: "Assets exceed the maximum, please input your wallet address then transfer %neo% NEO to your own wallet first.",
                pay_walletbtn: "Wallet",
                pay_assets: "Virtual assets",
                pay_get: "Get",
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
                pay_makerawtrans_fee_less: "GAS balance is insufficient.",
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
                pay_exchange_bct: "Get BCT",
                pay_exchange_cgas: "Get CGAS",
                pay_exchange_purchase: "Purchase",
                pay_exchange_price: "Latest price",
                pay_exchange_balance: "Balance",
                pay_exchange_balance_not_enough: "balance is insufficient!",
                pay_exchange_range: "24H Range",
                pay_exchange_buy_ok: "Succeeded!",
                pay_exchange_consumption: " consumption：",
                pay_exchange_placeholderconfirm: "Please confirm your purchase",
                pay_exchange_confirmbuy: "Confirm",
                pay_exchange_purchase_process: "Purchase process",
                pay_exchange_processp1: "1.%type% address provided by platform can be found below. Please transfer the corresponding %type1% to the account in Exchange then the system will show your %type2% balance.",
                pay_exchange_bcp: "Get BCP",
                pay_exchange_create_wallet_fail: "Failed to create a trading wallet, please try it later!",
                pay_exchange_detail_buy_CGAS_fail: "Fail to buy CGAS!",
                pay_exchange_detail_buy_BCP_fail: "Fail to buy BCP!",
                pay_exchange_buyNEO: "Please input the purchase amount",
                pay_exchange_spent_not_enough: "Incorrect amount!",
                pay_exchange_getmore: "Get %type%>>",
                pay_makeRecharge: "Recharge",
                pay_trust_tips: "Trust contracts",
                pay_trust_Vice_tips: "Window will not pop up in this trade, please change handling fee in page My information.",
                pay_transfer_toaddr: "transfer address",
                pay_transfer_count: "Transfer amounts",
                pay_transCount_count: "Exchange",
                pay_transCount_inputCount: "Please input amount",
                pay_transCount_err: "Please input correct sums of amounts",
                pay_transCountGAS: "GAS:",
                pay_transCountCGAS: "CGAS:",
                pay_transCountCGASOLD: "CGAS(old):",
                pay_transCountCGAS2GAS: "GAS",
                pay_transCountGAS2CGAS: "CGAS",
                pay_transCountCGASOLD2OLD: "CGAS(old)",
                pay_transCountNEO: "NEO：",
                pay_transCountCNEO: "CNEO：",
                pay_transCountCNEOOLD: "CNEO(old)：",
                pay_transCountCNEO2NEO: "NEO",
                pay_transCountNEO2CNEO: "CNEO",
                pay_transCountCNEOOLD2OLD: "CNEO(old)",
                pay_transCountTips_free: "Free",
                pay_transCountTips_slow: "Slow",
                pay_transCountTips_fast: "Fast",
                pay_transCount_speed: "Trade SPD",
                pay_transCount_cost: "Fee：",
                pay_transCount_tips: "Choose the token you want to exchange",
                pay_transCount_tips_err: "Choose the token you want to exchange",
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
                walletCreate_check_exceed: "Please set your password within 32 letters",
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
                main_refund_CGAS_second_fail: "Generate conversion request (utxo->gas) failed",
                main_refund_CNEO_second_fail: "Generate conversion request (utxo->neo) failed",
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
                errCode_100700: "Incorrect account or password!",
                errCode_100701: "Login is invalid, please log in again",
                errCode_100702: "Incorrect account or password,please try it again",
                errCode_100707: "Username already existed!",
                errCode_100708: "Username format is incorrect!",
                errCode_100709: "Area code is incorrect!",
                errCode_100801: "Failed to get email verification code!",
                errcode_100802: "Incorrect verification code!",
                errCode_100805: "This email address has been registered!",
                errCode_100806: "Please register first",
                errCode_100807: "Wrong username or email address!",
                errCode_100808: "Wrong email address or password!",
                errCode_8100000: "Your have already bundled my wallet and don't need to bind again!",
                errCode_8100001: "The format of the uploaded wallet is incorrect. Please check the wallet file!",
                errCode_8100002: "System error, wallet binding failed!",
                errCode_8100003: "The wallet has been bound by other users!",
                errCode_8100004: "Incorrect format!",
                errcode_8100005: "Upload failed!",
                errcode_8100006: "Image size must be less than 100Kb.",
                errCode_8100007: "The contact already exists!",
                errCode_8200003: " Non-supported transactions",
                errCode_8200004: "Price error! Please refresh and try!",
                errCode_8200006: "Out of stock! Please try it later!",
                errCode_default: "Unknown error! Error code: %errCode%",
                wallet_open_check: "Please check your wallet file or password!",
                wallet_open_check_otcgo: "Please check the Otcgo wallet file!",
                wallet_open_check_otcgo_pwd: "Please check the Otcgo wallet password!",
                netmgr_select_api_slow: "Connection to the server is abnormal or slow, please check the network and try it again!",
                netmgr_select_node_slow: "Communication with the nodes on the chain is abnormal or slow, please check the network and try it later!",
                netmgr_select_cli_slow: "Communication with the nodes on the chain is abnormal, please check the network and try it later!",
                netmgr_connecting: "Connecting ...",
                netmgr_connecting_fail: "Connection failed. Please check the network and try it again!",
            };
        }
    }
    BlackCat.LangEN = LangEN;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangJP extends BlackCat.LangBase {
        constructor() {
            super(...arguments);
            this.lang = {
                return: "戻る",
                copy: "コピー",
                ok: "確認",
                cancel: "キャンセル",
                more: "モット",
                info: "インフォ",
                content: "内容",
                retry: "再び",
                cgas: "CGAS",
                gas: "GAS",
                bct: "BCT",
                bcp: "BCP",
                neo: "NEO",
                cneo: "CNEO",
                btc: "BTC",
                eth: "ETH",
                area_code_CN: '中國',
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
                area_code_HK: '中國香港',
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
                area_code_JP: '日本',
                area_code_KE: 'Kenya',
                area_code_KG: 'Kyrgyzstan',
                area_code_KH: 'Cambodia',
                area_code_KI: 'Kiribati',
                area_code_KM: 'Comoros',
                area_code_KN: 'Saint Kitts and Nevis',
                area_code_KP: '北朝鮮',
                area_code_KR: '韓國',
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
                area_code_TW: '中國台湾',
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
                main_user_format_err: "ユーザーネームエラー！4-16英数字とアンダースコア文字だけです！",
                main_email_format_err: "無効なメールアドレス！",
                main_phone_format_err: "無効な電話番号！",
                main_vcode_format_err: "無効なコード！",
                main_walletaddr_format_err: "無効なウォレット！",
                main_phone: "電話番号",
                main_email: "メールアドレス",
                main_user: "ユーザーネーム",
                register_title: "新規登録",
                register_inputphone: "電話番号",
                register_inputphone_err: "電話番号を入力してください",
                register_inputemail: "メールアドレス",
                register_inputemail_err: "メールアドレスを入力してください",
                register_inputUid: "ユーザーネーム",
                register_inputUid_err: "ユーザーネームを入力してください",
                register_inputCode: "コード",
                register_inputCode_err: "コードを入力してください",
                register_inputPass: "パスワード",
                register_inputPass_err: "パスワードを入力してください",
                register_inputVpass: "もう一度",
                register_inputVpass_err: "もう一度パスワードを入力してください",
                register_inputVpass_inputPass_err: "違うパスワード！",
                register_inputinvite: "请输入邀请码",
                register_inputinvite_err: "邀请码已使用或不存在",
                register_getCodeSucc: "コードを送ります",
                register_getCode: "コードを手に入れる",
                register_getCodecount: "再び(60)",
                register_getCodecountRetry: "再び",
                register_exceed: "パスワードは32文字以内で入力して下さい",
                register_doLogin: "<<戻る",
                register_doRegister: "新規登録",
                register_invitation: "推薦コード",
                login_inputuser: "ユーザーネーム",
                login_inputuser_err: "ユーザーネームを入力してください",
                login_inputphone: "電話番号",
                login_inputphone_err: "電話番号を入力してください",
                login_inputemail: "メールアドレス",
                login_inputemail_err: "メールアドレスを入力してください",
                login_inputPass: "パスワード",
                login_inputPass_err: "パスワードを入力してください",
                login_textForgetpass: "わすれた？",
                login_doLogin: "ログイン",
                login_doRegister: "新規登録",
                login_walletDownloadFail: "ウォレットファイルのダウンロード失敗、もう一度ログインしてください!",
                login_loginFail: "ログイン失敗",
                forgetpass_title: "わすれた",
                forgetpass_inputphone: "電話番号",
                forgetpass_inputphone_err: "電話番号を入力してください",
                forgetpass_inputemail: "メールアドレス",
                forgetpass_inputemail_err: "メールアドレスを入力してください",
                forgetpass_inputUid: "ユーザーネーム",
                forgetpass_inputUid_err: "ユーザーネームを入力してください",
                forgetpass_inputUid_validate_err: "無効なユーザーネーム",
                forgetpass_inputAccount: "電話番号或いはメールアドレスを入力してください",
                forgetpass_inputAccount_err: "電話番号或いはメールアドレスを入力してください",
                forgetpass_inputAccount_err_type: "違う電話番号或いはメールアドレス、もう一度確認してください",
                forgetpass_inputAccount_validate_err: "無効な電話番号或いはメールアドレス",
                forgetpass_inputphone_notexist: "新規登録してください！",
                forgetpass_inputemail_notexist: "新規登録してください！",
                forgetpass_inputCode: "コード",
                forgetpass_inputCode_err: "コードを入力してください",
                forgetpass_inputPass: "新しいパスワード",
                forgetpass_inputPass_err: "新しいパスワードを入力してください",
                forgetpass_inputVpass: "もう一度",
                forgetpass_inputVpass_err: "もう一度新しいパスワードを入力してください",
                forgetpass_inputVpass_inputPass_err: "違うパスワード！",
                forgetpass_getCodeSucc: "コードを送ります",
                forgetpass_getCode: "コードを手に入れる",
                forgetpass_getCodecount: "再び(60)",
                forgetpass_getCodecountRetry: "再び",
                forgetpass_exceed: "パスワードは32文字以内で入力して下さい",
                forgetpass_doLogin: "<<戻る",
                forgetpass_do: "確認",
                forgetpass_do_ok: "設定完了、もう一度ログインしてください！",
                personalcenter: "インフォセンター",
                myinfo_leve: "レベル",
                myinfo_modify: "変更",
                myinfo_member: "メンバー",
                myinfo_openmember: "メンバー購入",
                myinfo_permanentmember: "永久会员",
                myInfo: "プロフィール",
                myinfo_headImg: "プロフィール画像",
                myinfo_nickname: "ニックネーム",
                myinfo_sex: "性別",
                myinfo_sex_0: "選らんでください",
                myinfo_sex_1: "男性",
                myinfo_sex_2: "女性",
                myinfo_uid: "ユーザーネーム",
                myinfo_area: "区域",
                myinfo_fee: "手数料",
                myinfo_fee_empty: "選らんでください",
                myinfo_area_empty: "選らんでください",
                myinfo_security: "安全センター",
                myinfo_set: "設定",
                myinfo_logout: "ログアウト",
                myinfo_logoutConfirm: "ログアウト確認",
                modifyImg: "プロフィール画像",
                modifyImg_succ: "設定完了",
                modifyImg_select: "ローカルイメージ",
                modifyImg_select_err: "ローカルイメージを選んでください",
                modifyImg_selectSize_err: "画像のサイズは100kbあたりの容量です",
                modifyImg_selectType_err: "フォマートエラー、jpg、jpeg、png画像を選んでください",
                modifyName: "ニックネーム",
                modifyName_input: "ニックネーム",
                modifyName_succ: "設定完了！",
                modifySex: "性別",
                modifySex_succ: "設定完了",
                modifyArea: "地域",
                modifyArea_succ: "設定完了",
                modifyFee: "手数料",
                modifyFee_succ: "設定完了",
                modifyNet: "ネットライン",
                modifyNet_succ: "設定完了",
                modifyNet_node_err: "ネットラインエラー、他のネットラインを選んでください！",
                modifyVip_succ: "送信されました！",
                modifyVip_fail: "失敗しました！",
                modifyVip_balance_error: "％coin_type％残高が足りず、購入できません！",
                modifyVip_gas_less: "GAS残高が足りず、手数料を払うことができません！",
                modifyVip_invite_err: "推薦者のアカウントは存在しません！",
                modifyVip_12months: "12か月",
                modifyVip_3months: "3ヶ月",
                modifyVip_1months: "1か月",
                modifyVip_payway: "お支払い方法",
                modifyVip_inviteplaceholder: "推薦者のアカウントを入力してください",
                modifyVip_paymenttxt: "お支払い金額:",
                modifyVip_payment: "支付",
                modifyVip_recharge: "リチャージ",
                modifyvip_payAmonth: "%goods_item%ヶ月メンバーシップが%total%%pay_way%で購入できる",
                modifyvip_payconfirm: "%goods_item%ヶ月メンバーシップが%total%%pay_way%で購入できる",
                security_title: "安全センター",
                security_trust: "クレジット契約",
                security_trust_admin: "管理",
                security_walletOut: "自動ログアウト",
                security_walletOut_admin: "永遠",
                security_walletOut_admin_m: "%minutes% 分",
                security_walletOut_admin_h: "%hours% 時間",
                security_walletOut_toast: "一定時間、何も操作されないときに、ウォレットは自動的にログアウトされ、パスワードを再入力する必要があります",
                trust_title: "クレジット契約",
                trust_relieve_succ: "契約解除完了",
                paylist_txid: "注文番号：",
                paylist_wallet: "マイウォレット：",
                paylist_nnc: "契約アドレス：",
                paylist_sbParamJson: "契約パラメータ：",
                paylist_sbPushString: "契約方法：",
                paylist_sbPushString_none: "無し",
                paylist_ctm_year: "%year%年前",
                paylist_ctm_month: "%month%月前",
                paylist_ctm_day: "%day%天前",
                paylist_ctm_hour: "%hour%時前",
                paylist_ctm_minute: "%minute%分前",
                paylist_ctm_recent: "さっき",
                paylist_noMore: "記録無し",
                paylist_getMore: "読み込む",
                paylist_noRecord: "記録無し",
                pay_received: "お預入れ",
                pc_receivables_download: "QRコード",
                pc_receivables_address: "ウォレットアドレス",
                pc_receivables_copy: "コピー完了",
                pay_transfer: "お引出し",
                pay_transferType: "トークン：",
                pay_transferBalance: "残高：",
                pay_transferToAddr: "アドレス",
                pay_transferCount: "金額",
                pay_transferToAddrError: "アドレスエラー",
                pay_transferCountError: "金額エラー",
                pay_transferDoSucc: "完了",
                pay_transferDoFail: "失敗",
                pay_transferGasNotEnough: "GAS残高不足!",
                pay_transferBCPNotEnough: "BCP残高不足!",
                pay_transferBCTNotEnough: "BCT残高不足!",
                pay_transferNEONotEnough: "NEO残高不足!",
                pay_transferCNEONotEnough: "CNEO残高不足!",
                pay_transferCGASNotEnough: "CGAS残高不足!",
                pay_wallet: "マイウォレット",
                pay_refresh: "リフレッシュ",
                pay_wallet_detail: "詳しい",
                pay_coin_name: "トークン",
                pay_coin_old: "CGAS(old)為替",
                pay_coin_blacat: "BlaCat",
                pay_coin_neo: "NEO",
                pay_coin_other: "ほか",
                pay_gas: "GAS",
                pay_gas_desc: "GASはNEOブッロクチェーンの仮想通貨です、取引所から手に入れることができます",
                pay_cgas: "CGAS",
                pay_cgas_desc: "CGASはBlaCat提供されたトークンです",
                pay_neo: "NEO",
                pay_neo_desc: "NEOはNEOブロックチェーンのデジタル通貨であり、取引所で購入することができます",
                pay_cneo: "CNEO",
                pay_cneo_desc: "CNEOは、BlaCatがプレーヤーに提供するユニバーサルトークンです",
                pay_btc: "BTC",
                pay_eth: "ETH",
                pay_send: "お引出し",
                pay_purchase: "買う",
                pay_purchase_testnet_cant_buy: "メインネットにスウィッチしてGASを買ってください！",
                pay_makeMint: "為替",
                pay_recentLists: "取引",
                pay_more: "記録",
                pay_makeMintGasNotEnough: "GAS残高不足",
                pay_makeMintNeoNotEnough: "NEO残高不足",
                pay_makeMintDoFail: "CGAリチャージ失敗！\r\nリチャージ契約エラー！\r\n前のリチャージを確認していて、少々お待ちください！",
                pay_makeMintDoFail2: "CGASリチャージ失敗！\r\nリチャージリクエストエラー！後でもう一度試してください！",
                pay_makeRefundCgasNotEnoughUtxo: "CGAS為替、後でもう一度試してください！",
                pay_makeRefundCneoNotEnoughUtxo: "CNEO為替、後でもう一度試してください！",
                pay_makeRefundCgasNotEnough: "CGAS残高不足",
                pay_makeRefundCneoNotEnough: "CNEO残高不足",
                pay_makeRefundGasFeeNotEnough: "GAS残高不足、手数料の支払いエラー！",
                pay_makeRefundGasLessThanFee: "GASの為替金額より少なくなることはできません！",
                pay_makeRefundDoFail: "引き抜き契約失敗！前のお引出しや為替を確認していて、少々お待ちください！",
                pay_makeRefundDoFail2: "引き抜き契約失敗！ネットをチェックして、もう一度試してください！",
                pay_makeRefundGetScriptFail: "引き抜き契約失敗！",
                pay_makeRefundCgasOldNotEnough: "CGAS(old)残高不足",
                pay_makeRefundCneoOldNotEnough: "CNEO(old)残高不足",
                pay_makeMintGasUtxoCountsLimit: "資産ブロックは規定量を超えて、自らで自分のウォレットに%gas%GASを引き出してください",
                pay_makeMintNeoUtxoCountsLimit: "資産ブロックは規定量を超えて、自らで自分のウォレットに%neo%NEOを引き出してください",
                pay_walletbtn: "ウォレット",
                pay_assets: "仮想資産",
                pay_get: "ゲット",
                pay_not_enough_money: "残高不足",
                pay_not_enough_utxo: "前の商売を成功した後でもう一度試してください！",
                pay_nettype_1: "メインネット",
                pay_nettype_2: "テストネット",
                pay_walletDetail: "詳しいウォレット",
                pay_walletDetail_addr: "アドレス：",
                pay_walletDetail_key: "公開鍵：",
                pay_walletDetail_hex: "秘密鍵HEX：",
                pay_walletDetail_wif: "秘密鍵WIF：",
                pay_walletDetail_notice: "秘密鍵を大切に保管しておく必要があります",
                pay_walletDetail_export: "ウォレットをダウンロードする",
                pay_makerawtrans_err: "商売失敗",
                pay_makerawtrans_fee_less: "GAS残高不足、手数料の支払いエラー！",
                addressbook_title: "連絡先",
                addressbook_search: "捜査",
                addressbook_det_title: "連絡先",
                addressbook_det_transfer: "お預入れ",
                addressbook_det_address: "ウォレットアドレス",
                addressbook_det_download: "QRコード",
                addressbook_det_describe: "インフォ",
                addressbook_det_empty: "無し",
                addressbook_det_del: "削除する",
                addressbook_det_del_title: "削除する",
                addressbook_det_del_tips: "削除しますか？",
                addressbook_det_del_succ: "完了",
                addressbook_op_button: "完了",
                addressbook_op_name: "連絡先",
                addressbook_op_inputName: "連絡先を入力してください",
                addressbook_op_inputName_err: "連絡先を入力してください",
                addressbook_op_address: "ウォレットアドレス",
                addressbook_op_inputAddress: "ウォレットアドレスを入力してください",
                addressbook_op_inputAddress_err: "ウォレットアドレスを入力してください",
                addressbook_op_describe: "インフォ",
                addressbook_op_inputDescribe: "インフォを入力してください",
                addressbook_op_inputDescribe_err: "インフォを入力してください",
                addressbook_op_addSucc: "完了",
                addressbook_op_updateSucc: "完了",
                pay_exchange_bct: "ゲットBCT",
                pay_exchange_cgas: "ゲットCGAS",
                pay_exchange_purchase: "買う",
                pay_exchange_price: "今価格",
                pay_exchange_balance: "残高",
                pay_exchange_balance_not_enough: "残高不足！",
                pay_exchange_range: "24H価額",
                pay_exchange_buy_ok: "完了！",
                pay_exchange_consumption: " 消耗：",
                pay_exchange_placeholderconfirm: "取引数量を確認してください",
                pay_exchange_confirmbuy: "確認",
                pay_exchange_purchase_process: "取引プロセス",
                pay_exchange_processp1: "1.BlaCatによって提供される%type%ウォレットアドレスは以下にあります。 対応する%type1%を取引所のアカウントに転送してください。その後、システムは自動に%type2%の残高が表示されます。",
                pay_exchange_bcp: "ゲットBCP",
                pay_exchange_create_wallet_fail: "取引ウォレットを作成できません。しばらくしてからもう一度お試しください！",
                pay_exchange_detail_buy_CGAS_fail: "CGAS購買に失敗した！",
                pay_exchange_detail_buy_BCP_fail: "BCP購買に失敗した！",
                pay_exchange_buyNEO: "購買数量を入力してください",
                pay_exchange_spent_not_enough: "正しい数量を入力してください！",
                pay_exchange_getmore: "%type%をゲット>>",
                pay_makeRecharge: "リチャージ",
                pay_trust_tips: "クレジット契約",
                pay_trust_Vice_tips: "この窓は打ち上げることがもうできません。セッティングで手数料を取り替えてください",
                pay_transfer_toaddr: "アドレス",
                pay_transfer_count: "金額",
                pay_transCount_count: "為替",
                pay_transCount_inputCount: "為替金額を入力してください",
                pay_transCount_err: "正しい金額を入力してください",
                pay_transCountGAS: "GAS：",
                pay_transCountCGAS: "CGAS：",
                pay_transCountCGASOLD: "CGAS(old)：",
                pay_transCountCGAS2GAS: "GAS",
                pay_transCountGAS2CGAS: "CGAS",
                pay_transCountCGASOLD2OLD: "CGAS(old)",
                pay_transCountNEO: "NEO：",
                pay_transCountCNEO: "CNEO：",
                pay_transCountCNEOOLD: "CNEO(old)：",
                pay_transCountCNEO2NEO: "NEO",
                pay_transCountNEO2CNEO: "CNEO",
                pay_transCountCNEOOLD2OLD: "CNEO(old)",
                pay_transCountTips_free: "フリー",
                pay_transCountTips_slow: "遅い",
                pay_transCountTips_fast: "早い",
                pay_transCount_speed: "商売\nスピード",
                pay_transCount_cost: "手数料：",
                pay_transCount_tips: "トークンを選んでください",
                pay_transCount_tips_err: "トークンを選んでください",
                pay_walletOpen_password: "パスワード",
                pay_walletOpen_inputPassword: "パスワード",
                pay_walletOpen_inputPassword_err: "パスワードを入力してください",
                pay_walletOpen_file_error: "ウォレットファイルエラー、もう一度ログインしてください",
                pay_walletOpen_openFail: "パスワードエラー！後でもう一度試してください！",
                walletCreate_create: "ウォレットを作成する",
                walletCreate_password: "パスワード",
                walletCreate_vpass: "確認してください",
                walletCreate_password_notice: "*パスワードを復元できなくて大切に保管してください",
                walletCreate_doCreate: "作成する",
                walletCreate_check_pass: "パスワードをチェックしてください",
                walletCreate_check_vpass: "パスワードをチェックしてください",
                walletCreate_check_exceed: "パスワードは32文字以内で入力して下さい",
                walletImport_invalid_file: "正しいウォレットファイルを選んでください",
                walletImport_select_file: "ウォレットファイル",
                walletImport_import: "ウォレットを加える",
                walletImport_password: "パスワード",
                walletImport_doImport: "縛る",
                walletImport_bind_succ: "完了！",
                walletView_info: "面白くて特別なゲーム！",
                walletView_create: "ウォレットを作成する",
                walletView_import: "ウォレットを加える",
                main_wait_for_last_tran: "前の商売を確認・キャンセルした後でもう一度試してください",
                main_no_app_wallet: "ウォレットアドレスを設置しなくならリチャージ出来ません",
                main_need_open_wallet_confirm: "ウォレットを開けますか？",
                main_refund_CGAS_second_fail: "転換契約リクエスト（utxo->gas）失敗",
                main_refund_CNEO_second_fail: "転換契約リクエスト（utxo->neo）失敗",
                main_refund_getScript_err: "転換契約失敗！",
                main_refund_sendRequest_err: "リクエスト失敗！",
                main_refund_doFail: "転換契約失敗！",
                errCode_1101: "リクエストアクセスのパラメータエラー",
                errCode_1005: "少々お待ちしてください！",
                errCode_100601: "エラー！地域や電話番号を確認してください！",
                errCode_100602: "コードエラー！",
                errCode_100605: "電話番号は登録されています！",
                errCode_100606: "新規登録してください",
                errCode_100607: "ユーザーネーム或いは電話番号エラー！",
                errCode_100608: "パスワード或いは電話番号エラー！",
                errCode_100700: "アカウント或いはパスワードエラー！",
                errCode_100701: "ログインエラー、もう一度ログインしてください",
                errCode_100702: "アカウント或いはパスワードエラー、もう一度確認してください",
                errCode_100707: "アカウントは登録されています！",
                errCode_100708: "アカウントフォマットエラー！",
                errCode_100709: "地域コードエラー！",
                errCode_100801: "エラー！",
                errcode_100802: "メールコードエラー！",
                errCode_100805: "メールアドレスは登録されています！",
                errCode_100806: "新規登録してください",
                errCode_100807: "ユーザーネーム或いはメールアドレスエラー！",
                errCode_100808: "メールアドレス或いはパスワードエラー！",
                errCode_8100000: "ウォレットは登録されています！",
                errCode_8100001: "ウォレットフォマットエラー、もう一度確認してください！",
                errCode_8100002: "システムエラー！",
                errCode_8100003: "ウォレットは他人に登録されています！",
                errCode_8100004: "画像フォマットエラー！",
                errcode_8100005: "アップロード失敗！",
                errcode_8100006: "画像のサイズは100kbあたりの容量です！",
                errCode_8100007: "連絡先は既に存在しています！",
                errCode_8200003: "取引エラー",
                errCode_8200004: "購入価格が異常です。もう一度お試しください！",
                errCode_8200006: "在庫が不足しています。しばらくしてからもう一度お試しください。",
                errCode_default: "エラー！コード： %errCode%",
                wallet_open_check: "ウォレットファイルとパスワードを確認してください！",
                wallet_open_check_otcgo: "SEAウォレットファイルを確認してください！",
                wallet_open_check_otcgo_pwd: "SEAウォレットを確認してください！",
                netmgr_select_api_slow: "サーバー通信エラー、チェックしてください！",
                netmgr_select_node_slow: "ノード通信エラー、チェックしてください！",
                netmgr_select_cli_slow: "ノード通信エラー、チェックしてください！",
                netmgr_connecting: "通信中、お待ちしたください",
                netmgr_connecting_fail: "ネットエラー、チェックしてください",
            };
        }
    }
    BlackCat.LangJP = LangJP;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangMgr {
        constructor(type = "") {
        }
        setType(type) {
            console.log("[BlaCat]", '[LangMgr]', 'setType, type => ', type, ', this.type => ', this.type);
            if (this.type == type) {
                return false;
            }
            switch (type) {
                case "en":
                    this.lang = new BlackCat.LangEN();
                    this.type = type;
                    break;
                case "jp":
                    this.lang = new BlackCat.LangJP();
                    this.type = type;
                    break;
                default:
                    this.lang = new BlackCat.LangCN();
                    this.type = "cn";
                    break;
            }
            if (type == 'jp') {
                BlackCat.Main.viewMgr.mainView.div.classList.add("pc_jptype");
            }
            else {
                BlackCat.Main.viewMgr.mainView.div.classList.remove("pc_jptype");
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
        constructor(hosts, check_params, check_type = "") {
            this.hosts = hosts;
            this.check_params = check_params;
            this.check_type = check_type;
            this.fetch_error = [];
        }
        getOne(callback) {
            try {
                this.hosts.forEach(host => {
                    let url_head = host.substr(0, 2) === "//" ? BlackCat.Main.urlHead : "";
                    let url = url_head + host + this.check_params;
                    fetch(url).then((response) => __awaiter(this, void 0, void 0, function* () {
                        if (response.ok) {
                            switch (this.check_type) {
                                case "node":
                                case "cli":
                                    try {
                                        let json = yield response.json();
                                        if (json["result"][0]["blockcount"]) {
                                            if (!this.first_host) {
                                                this.first_host = url_head + host;
                                                callback(this.first_host, json);
                                                return;
                                            }
                                        }
                                    }
                                    catch (e) { }
                                    this.fetch_error.push(host);
                                    return;
                                case "api":
                                default:
                                    let res = yield response.text();
                                    if (!this.first_host) {
                                        this.first_host = url_head + host;
                                        callback(this.first_host, res);
                                    }
                                    return;
                            }
                        }
                        else {
                            this.fetch_error.push(host);
                        }
                    }), error => {
                        this.fetch_error.push(host);
                        console.log("[BlaCat]", '[Connector]', 'getOne, fetch err => ', error);
                    });
                });
            }
            catch (e) {
                console.log("[BlaCat]", '[Connector]', 'getOne, error => ', e.toString());
            }
            this.check_results(callback);
        }
        check_results(callback) {
            console.log("[BlaCat]", '[Connector]', 'do check_results ...');
            setTimeout(() => {
                if (!this.first_host) {
                    if (this.fetch_error.length == this.hosts.length) {
                        console.log("[BlaCat]", '[Connector]', 'check_results, all fetch_error => ', this.fetch_error);
                        callback(false, null);
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
            this.apis = [
                ["CN", "//apip01.9191wyx.com/apic/"],
                ["HK", "//api01.blacat.org/apic/"],
            ];
            this.nodes = {};
            this.nodes[1] = [
                ["CN", "https://api.nel.group/api/mainnet", "_NEL"],
                ["CN", "https://mainnet-node-sz-01.9191wyx.com/api/mainnet", "_1"],
                ["HK", "https://mainnet_node_hk_01.blacat.org/api/mainnet", "_1"],
                ["HK", "https://mainnet_node_hk_02.blacat.org/api/mainnet", "_2"],
            ];
            this.nodes[2] = [
                ["CN", "https://api.nel.group/api/testnet", "_NEL"],
                ["CN", "https://testnet-node-sz-01.9191wyx.com/api/testnet", "_1"],
                ["HK", "https://testnet_node_hk_01.blacat.org/api/testnet", "_1"],
                ["HK", "https://testnet_node_hk_02.blacat.org/api/testnet", "_2"],
            ];
            this.clis = {};
            this.clis[1] = [
                ["CN", 'https://clip01.9191wyx.com/api/mainnet'],
                ["HK", 'https://neocli01.blacat.org/api/mainnet'],
            ];
            this.clis[2] = [];
            this.nodes_server = {};
            this.default_type = 1;
            this.clis_server = {};
        }
        selectApi(callback) {
            if (this.apis_server) {
                BlackCat.ApiTool.base_url = this.apis_server;
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
            var conn = new BlackCat.Connector(this.getHosts(this.apis), "apic_test.php", 'api');
            conn.getOne((res, response) => {
                if (res === false) {
                    BlackCat.ViewConnecting.content = "netmgr_select_api_slow";
                    BlackCat.Main.viewMgr.viewConnecting.showRetry(false);
                    BlackCat.Main.viewMgr.iconView.hiddenState();
                    if (BlackCat.Main.isLoginInit() === true)
                        BlackCat.Main.viewMgr.iconView.showFail();
                    return;
                }
                console.log("[BlaCat]", '[NetMgr]', 'api => ', res);
                console.log("[BlaCat]", '[NetMgr]', 'api response => ', response);
                this.apis_server = res + "apic_user.php";
                BlackCat.ApiTool.base_url = this.apis_server;
                callback();
            });
        }
        selectNode(callback, type, force = 0) {
            if (force == 0 && this.nodes_server && this.nodes_server.hasOwnProperty(type) && this.nodes_server[type]) {
                this.node_change_tmp = this.nodes_server[type];
                this.selectCli(callback, type, force);
                return;
            }
            BlackCat.Main.viewMgr.change("ViewConnecting");
            BlackCat.ViewConnecting.callback_retry = () => {
                this._selectNode(callback, type, force);
            };
            this._selectNode(callback, type, force);
        }
        _selectNode(callback, type, force) {
            BlackCat.Main.viewMgr.viewConnecting.showConnecting();
            BlackCat.Main.viewMgr.iconView.showState();
            var conn = new BlackCat.Connector(this.getHosts(this.nodes[type]), "?jsonrpc=2.0&id=1&method=getblockcount&params=[]", 'node');
            conn.getOne((res, response) => {
                if (res === false) {
                    BlackCat.ViewConnecting.content = "netmgr_select_node_slow";
                    var showReturn = !BlackCat.Main.isLoginInit();
                    BlackCat.Main.viewMgr.viewConnecting.showRetry(showReturn);
                    BlackCat.Main.viewMgr.iconView.hiddenState();
                    if (BlackCat.Main.isLoginInit() === true)
                        BlackCat.Main.viewMgr.iconView.showFail();
                    return;
                }
                console.log("[BlaCat]", '[NetMgr]', 'node => ', res);
                console.log("[BlaCat]", '[NetMgr]', 'node response => ', response);
                this.node_change_tmp = res;
                this.selectCli(callback, type, force);
            });
        }
        selectCli(callback, type, force = 0) {
            if (!this.clis || !this.clis[type] || this.clis[type].length == 0) {
                this.nodes_server[type] = this.node_change_tmp;
                BlackCat.tools.WWW.api_nodes = this.nodes_server[type];
                this.clis_server[type] = null;
                BlackCat.tools.WWW.api_clis = null;
                callback();
                if (BlackCat.Main.viewMgr.viewConnecting.isCreated)
                    BlackCat.Main.viewMgr.viewConnecting.remove();
                BlackCat.Main.viewMgr.iconView.hiddenState();
                BlackCat.Main.viewMgr.iconView.showSucc();
                return;
            }
            if (force == 0 && this.clis_server && this.clis_server.hasOwnProperty(type) && this.clis_server[type]) {
                this.nodes_server[type] = this.node_change_tmp;
                BlackCat.tools.WWW.api_nodes = this.nodes_server[type];
                BlackCat.tools.WWW.api_clis = this.clis_server[type];
                callback();
                if (BlackCat.Main.viewMgr.viewConnecting.isCreated)
                    BlackCat.Main.viewMgr.viewConnecting.remove();
                BlackCat.Main.viewMgr.iconView.hiddenState();
                BlackCat.Main.viewMgr.iconView.showSucc();
                return;
            }
            BlackCat.Main.viewMgr.change("ViewConnecting");
            BlackCat.ViewConnecting.callback_retry = () => {
                this._selectCli(callback, type);
            };
            this._selectCli(callback, type);
        }
        _selectCli(callback, type) {
            BlackCat.Main.viewMgr.viewConnecting.showConnecting();
            BlackCat.Main.viewMgr.iconView.showState();
            var conn = new BlackCat.Connector(this.getHosts(this.clis[type]), "?jsonrpc=2.0&id=1&method=getblockcount&params=[]&uid=" + BlackCat.Main.randNumber, 'cli');
            conn.getOne((res, response) => {
                if (res === false) {
                    BlackCat.ViewConnecting.content = "netmgr_select_cli_slow";
                    var showReturn = !BlackCat.Main.isLoginInit();
                    BlackCat.Main.viewMgr.viewConnecting.showRetry(showReturn);
                    BlackCat.Main.viewMgr.iconView.hiddenState();
                    if (BlackCat.Main.isLoginInit() === true)
                        BlackCat.Main.viewMgr.iconView.showFail();
                    return;
                }
                console.log("[BlaCat]", '[NetMgr]', 'cli => ', res);
                console.log("[BlaCat]", '[NetMgr]', 'cli response => ', response);
                this.nodes_server[type] = this.node_change_tmp;
                BlackCat.tools.WWW.api_nodes = this.nodes_server[type];
                this.clis_server[type] = res;
                BlackCat.tools.WWW.api_clis = this.clis_server[type];
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
                console.log("[BlaCat]", '[NetMgr]', 'change, type => ', type);
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
            console.log("[BlaCat]", '[NetMgr]', 'setDefault, type => ', type);
            this.default_type = type;
        }
        change2test(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                this.selectNode(() => {
                    this.type = 2;
                    BlackCat.tools.CoinTool.id_CGAS = "0x74f2dc36a68fdc4682034178eb2220729231db76";
                    BlackCat.tools.CoinTool.id_CGAS_OLD = [];
                    BlackCat.tools.WWW.api_cgas = 'https://apiwallet.nel.group/api/testnet';
                    BlackCat.tools.CoinTool.id_CNEO = "0xc074a05e9dcf0141cbe6b4b3475dd67baf4dcb60";
                    BlackCat.tools.CoinTool.id_CNEO_OLD = [];
                    BlackCat.tools.WWW.api_cneo = '';
                    BlackCat.tools.CoinTool.id_BCT = "0x40a80749ef62da6fc3d74dbf6fc7745148922372";
                    BlackCat.tools.CoinTool.id_BCT_DESTROY = "AdsNmzKPPG7HfmQpacZ4ixbv9XJHJs2ACz";
                    BlackCat.tools.CoinTool.id_BCP = "0x04e31cee0443bb916534dad2adf508458920e66d";
                    BlackCat.tools.CoinTool.id_BTC = "0x07bc2c1398e1a472f3841a00e7e7e02029b8b38b";
                    BlackCat.tools.CoinTool.id_BTC_DESTROY = "AUWYsHRi1xv584DswcQKkz1UXJf8G3se4Y";
                    BlackCat.tools.CoinTool.id_ETH = "0x7c652b368ddc0fb035bb9c63eca91b2e3c55385e";
                    BlackCat.tools.CoinTool.id_ETH_DESTROY = "AQN4ecUAEcX8Sce11e7eyWNRYPPbDv7rcZ";
                    BlackCat.tools.CoinTool.id_CNEO_DESTROY = "AcQLYjGbQU2bEQ8RKFXUcf8XvromfUQodq";
                    BlackCat.tools.CoinTool.id_bancor = "0x0ca406aea638e0fed8580f00eb8b6e1dcb3d95da";
                    BlackCat.tools.CoinTool.BUY_VIP_ADDR = "AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT";
                    callback();
                }, 2);
            });
        }
        change2Main(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                this.selectNode(() => {
                    this.type = 1;
                    BlackCat.tools.CoinTool.id_CGAS = "0x74f2dc36a68fdc4682034178eb2220729231db76";
                    BlackCat.tools.CoinTool.id_CGAS_OLD = [];
                    BlackCat.tools.WWW.api_cgas = 'https://apiwallet.nel.group/api/mainnet';
                    BlackCat.tools.CoinTool.id_CNEO = "0xc074a05e9dcf0141cbe6b4b3475dd67baf4dcb60";
                    BlackCat.tools.CoinTool.id_CNEO_OLD = [];
                    BlackCat.tools.WWW.api_cneo = '';
                    BlackCat.tools.CoinTool.id_BCT = "0x40a80749ef62da6fc3d74dbf6fc7745148922372";
                    BlackCat.tools.CoinTool.id_BCT_DESTROY = "";
                    BlackCat.tools.CoinTool.id_BCP = "0x04e31cee0443bb916534dad2adf508458920e66d";
                    BlackCat.tools.CoinTool.id_BTC = "";
                    BlackCat.tools.CoinTool.id_BTC_DESTROY = "";
                    BlackCat.tools.CoinTool.id_ETH = "";
                    BlackCat.tools.CoinTool.id_ETH_DESTROY = "";
                    BlackCat.tools.CoinTool.id_CNEO_DESTROY = "";
                    BlackCat.tools.CoinTool.id_bancor = "";
                    BlackCat.tools.CoinTool.BUY_VIP_ADDR = "";
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
        getHosts(hosts) {
            var res = [];
            hosts.forEach(host => {
                res.push(host[1]);
            });
            return res;
        }
        getCurrNodeInfo(type) {
            var info = null;
            if (this[type][this.type].length > 0) {
                for (let i = 0; i < this[type][this.type].length; i++) {
                    if (this[type][this.type][i][1] == this[type + "_server"][this.type]) {
                        return this[type][this.type][i];
                    }
                }
            }
            return info;
        }
        getNodeLists(type) {
            var lists = [];
            if (this[type] && this[type][this.type]) {
                return this[type][this.type];
            }
            return lists;
        }
        setNode(type, url) {
            this[type + "_server"][this.type] = url;
            BlackCat.tools.WWW["api_" + type] = url;
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
        reset() { }
        key_esc() {
            this.return();
        }
        key_enter() { }
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
            this.div.onkeyup = (e) => {
                var code = e.charCode || e.keyCode;
                if (code == 13) {
                    this.key_enter();
                }
                else if (code == 27) {
                    this.key_esc();
                }
            };
            this.div.tabIndex = 0;
            this.div.focus();
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
            this.div.classList.add("pc_bj", "pc_maillist_details");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var headerReturn = this.objCreate("a");
            headerReturn.classList.add("iconfont", "icon-bc-fanhui");
            headerReturn.textContent = BlackCat.Main.langMgr.get("return");
            headerReturn.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, headerReturn);
            var headerTitle = this.objCreate("h1");
            headerTitle.textContent = BlackCat.Main.langMgr.get("addressbook_det_title");
            this.ObjAppend(header, headerTitle);
            var iHeader = this.objCreate("i");
            iHeader.classList.add("pc_returngame", "iconfont", "icon-bc-qianbi");
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
            qr_download.classList.add("iconfont", "icon-bc-xiazai");
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
                        BlackCat.Main.viewMgr.payView.doGetWalletLists(1);
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
            this.div.classList.add("pc_bj", "pc_maillist_op");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var headerReturn = this.objCreate("a");
            headerReturn.classList.add("iconfont", "icon-bc-fanhui");
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
            iAddress.classList.add("iconfont", "icon-bc-saomiao");
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
            this.div.classList.add("pc_bj");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var headerReturn = this.objCreate("a");
            headerReturn.classList.add("iconfont", "icon-bc-fanhui");
            headerReturn.textContent = BlackCat.Main.langMgr.get("return");
            headerReturn.onclick = () => {
                this.doCancel();
            };
            this.ObjAppend(header, headerReturn);
            var headerTitle = this.objCreate("h1");
            headerTitle.textContent = BlackCat.Main.langMgr.get("addressbook_title");
            this.ObjAppend(header, headerTitle);
            var iHeader = this.objCreate("i");
            iHeader.classList.add("pc_returngame", "iconfont", "icon-bc-jiahao");
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
            iSearch.classList.add("iconfont", "icon-bc-sousuo");
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
        key_esc() {
            this.doCancel();
        }
        doCancel() {
            if (AddressbookView.select) {
                this.remove();
                BlackCat.Main.viewMgr.payView.show();
                BlackCat.Main.viewMgr.payTransferView.show();
            }
            else {
                this.return();
            }
        }
        getAddressbook() {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.getAddrbook(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token);
                console.log("[BlaCat]", '[AddressbookView]', 'getAddressbook, res =>', res);
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
        static getAreaByLang(lang) {
            var idx = [];
            switch (lang) {
                case "en":
                    idx = [3, 6, 55, 10, 1, 8, 5, 4, 9, 7, 13, 12, 11, 14, 29, 21, 17, 16, 32, 18, 33, 23, 24, 30, 26, 15, 31, 28, 25, 20, 19, 22, 102, 42, 34, 46, 27, 109, 36, 189, 41, 0, 43, 104, 40, 44, 86, 45, 47, 48, 49, 35, 52, 51, 53, 54, 193, 56, 58, 185, 78, 59, 57, 61, 65, 63, 62, 66, 71, 155, 67, 75, 70, 50, 72, 73, 79, 74, 69, 77, 81, 80, 76, 82, 83, 87, 85, 84, 88, 95, 92, 89, 94, 93, 90, 91, 96, 39, 97, 99, 98, 110, 100, 103, 106, 108, 101, 111, 120, 112, 117, 116, 121, 114, 118, 119, 132, 128, 126, 138, 140, 137, 129, 135, 127, 133, 136, 213, 139, 64, 124, 123, 131, 125, 134, 122, 141, 130, 142, 150, 149, 147, 143, 151, 146, 144, 145, 148, 152, 158, 163, 153, 156, 164, 154, 157, 159, 162, 161, 165, 37, 166, 167, 169, 170, 105, 113, 160, 206, 211, 180, 184, 171, 181, 168, 173, 179, 176, 178, 177, 172, 182, 214, 107, 60, 115, 174, 183, 187, 175, 38, 186, 199, 192, 200, 191, 190, 196, 198, 195, 197, 194, 188, 202, 201, 2, 68, 203, 204, 205, 210, 207, 209, 208, 212, 215, 216];
                    break;
                default:
                    idx = [1, 11, 12, 6, 55, 90, 3, 5, 8, 9, 58, 13, 2, 152, 14, 61, 57, 4, 16, 156, 31, 30, 95, 161, 32, 29, 20, 19, 158, 21, 159, 22, 164, 18, 26, 33, 24, 23, 153, 15, 28, 78, 106, 193, 50, 190, 52, 53, 54, 56, 169, 59, 66, 62, 157, 65, 155, 71, 45, 75, 81, 77, 80, 37, 35, 43, 70, 74, 69, 44, 83, 87, 85, 107, 147, 27, 125, 110, 216, 51, 101, 49, 103, 72, 34, 76, 82, 67, 102, 40, 86, 47, 42, 104, 109, 100, 46, 165, 108, 116, 112, 121, 167, 166, 119, 117, 118, 120, 111, 170, 114, 130, 126, 137, 124, 135, 131, 203, 17, 64, 129, 154, 122, 136, 133, 138, 140, 123, 128, 141, 127, 10, 134, 139, 213, 149, 214, 146, 150, 142, 144, 145, 148, 163, 162, 99, 175, 38, 160, 174, 184, 185, 168, 105, 178, 179, 115, 172, 183, 177, 113, 182, 180, 211, 181, 48, 173, 171, 187, 206, 197, 191, 196, 192, 194, 188, 198, 195, 200, 202, 201, 25, 204, 210, 207, 205, 60, 176, 143, 79, 186, 151, 39, 88, 92, 98, 96, 89, 68, 94, 93, 212, 97, 7, 209, 208, 91, 73, 215, 189, 36, 0, 132, 199, 84, 63, 41];
                    break;
            }
            if (idx.length > 0) {
                var rtn = [];
                for (let i = 0; i < idx.length; i++) {
                    let a_idx = idx[i];
                    rtn.push(this.areaInfo[a_idx]);
                }
                return rtn;
            }
            else {
                return AreaView.areaInfo;
            }
        }
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
        { "areacode": "86", "codename": "CN" },
        { "areacode": "376", "codename": "AD" },
        { "areacode": "971", "codename": "AE" },
        { "areacode": "93", "codename": "AF" },
        { "areacode": "1268", "codename": "AG" },
        { "areacode": "1264", "codename": "AI" },
        { "areacode": "355", "codename": "AL" },
        { "areacode": "374", "codename": "AM" },
        { "areacode": "244", "codename": "AO" },
        { "areacode": "54", "codename": "AR" },
        { "areacode": "1684", "codename": "AS" },
        { "areacode": "43", "codename": "AT" },
        { "areacode": "61", "codename": "AU" },
        { "areacode": "297", "codename": "AW" },
        { "areacode": "994", "codename": "AZ" },
        { "areacode": "387", "codename": "BA" },
        { "areacode": "1246", "codename": "BB" },
        { "areacode": "880", "codename": "BD" },
        { "areacode": "32", "codename": "BE" },
        { "areacode": "226", "codename": "BF" },
        { "areacode": "359", "codename": "BG" },
        { "areacode": "973", "codename": "BH" },
        { "areacode": "257", "codename": "BI" },
        { "areacode": "229", "codename": "BJ" },
        { "areacode": "1441", "codename": "BM" },
        { "areacode": "673", "codename": "BN" },
        { "areacode": "591", "codename": "BO" },
        { "areacode": "599", "codename": "BQ" },
        { "areacode": "55", "codename": "BR" },
        { "areacode": "1242", "codename": "BS" },
        { "areacode": "975", "codename": "BT" },
        { "areacode": "267", "codename": "BW" },
        { "areacode": "375", "codename": "BY" },
        { "areacode": "501", "codename": "BZ" },
        { "areacode": "1", "codename": "CA" },
        { "areacode": "243", "codename": "CD" },
        { "areacode": "236", "codename": "CF" },
        { "areacode": "242", "codename": "CG" },
        { "areacode": "41", "codename": "CH" },
        { "areacode": "225", "codename": "CI" },
        { "areacode": "682", "codename": "CK" },
        { "areacode": "56", "codename": "CL" },
        { "areacode": "237", "codename": "CM" },
        { "areacode": "57", "codename": "CO" },
        { "areacode": "506", "codename": "CR" },
        { "areacode": "53", "codename": "CU" },
        { "areacode": "238", "codename": "CV" },
        { "areacode": "599", "codename": "CW" },
        { "areacode": "357", "codename": "CY" },
        { "areacode": "420", "codename": "CZ" },
        { "areacode": "49", "codename": "DE" },
        { "areacode": "253", "codename": "DJ" },
        { "areacode": "45", "codename": "DK" },
        { "areacode": "1767", "codename": "DM" },
        { "areacode": "1809", "codename": "DO" },
        { "areacode": "213", "codename": "DZ" },
        { "areacode": "593", "codename": "EC" },
        { "areacode": "372", "codename": "EE" },
        { "areacode": "20", "codename": "EG" },
        { "areacode": "291", "codename": "ER" },
        { "areacode": "34", "codename": "ES" },
        { "areacode": "251", "codename": "ET" },
        { "areacode": "358", "codename": "FI" },
        { "areacode": "679", "codename": "FJ" },
        { "areacode": "691", "codename": "FM" },
        { "areacode": "298", "codename": "FO" },
        { "areacode": "33", "codename": "FR" },
        { "areacode": "241", "codename": "GA" },
        { "areacode": "44", "codename": "GB" },
        { "areacode": "1473", "codename": "GD" },
        { "areacode": "995", "codename": "GE" },
        { "areacode": "594", "codename": "GF" },
        { "areacode": "233", "codename": "GH" },
        { "areacode": "350", "codename": "GI" },
        { "areacode": "299", "codename": "GL" },
        { "areacode": "220", "codename": "GM" },
        { "areacode": "224", "codename": "GN" },
        { "areacode": "590", "codename": "GP" },
        { "areacode": "240", "codename": "GQ" },
        { "areacode": "30", "codename": "GR" },
        { "areacode": "502", "codename": "GT" },
        { "areacode": "1671", "codename": "GU" },
        { "areacode": "245", "codename": "GW" },
        { "areacode": "592", "codename": "GY" },
        { "areacode": "852", "codename": "HK" },
        { "areacode": "504", "codename": "HN" },
        { "areacode": "385", "codename": "HR" },
        { "areacode": "509", "codename": "HT" },
        { "areacode": "36", "codename": "HU" },
        { "areacode": "62", "codename": "ID" },
        { "areacode": "353", "codename": "IE" },
        { "areacode": "972", "codename": "IL" },
        { "areacode": "91", "codename": "IN" },
        { "areacode": "964", "codename": "IQ" },
        { "areacode": "98", "codename": "IR" },
        { "areacode": "354", "codename": "IS" },
        { "areacode": "39", "codename": "IT" },
        { "areacode": "1876", "codename": "JM" },
        { "areacode": "962", "codename": "JO" },
        { "areacode": "81", "codename": "JP" },
        { "areacode": "254", "codename": "KE" },
        { "areacode": "996", "codename": "KG" },
        { "areacode": "855", "codename": "KH" },
        { "areacode": "686", "codename": "KI" },
        { "areacode": "269", "codename": "KM" },
        { "areacode": "1869", "codename": "KN" },
        { "areacode": "850", "codename": "KP" },
        { "areacode": "82", "codename": "KR" },
        { "areacode": "965", "codename": "KW" },
        { "areacode": "1345", "codename": "KY" },
        { "areacode": "7", "codename": "KZ" },
        { "areacode": "856", "codename": "LA" },
        { "areacode": "961", "codename": "LB" },
        { "areacode": "1758", "codename": "LC" },
        { "areacode": "423", "codename": "LI" },
        { "areacode": "94", "codename": "LK" },
        { "areacode": "231", "codename": "LR" },
        { "areacode": "266", "codename": "LS" },
        { "areacode": "370", "codename": "LT" },
        { "areacode": "352", "codename": "LU" },
        { "areacode": "371", "codename": "LV" },
        { "areacode": "218", "codename": "LY" },
        { "areacode": "212", "codename": "MA" },
        { "areacode": "377", "codename": "MC" },
        { "areacode": "373", "codename": "MD" },
        { "areacode": "382", "codename": "ME" },
        { "areacode": "261", "codename": "MG" },
        { "areacode": "692", "codename": "MH" },
        { "areacode": "389", "codename": "MK" },
        { "areacode": "223", "codename": "ML" },
        { "areacode": "95", "codename": "MM" },
        { "areacode": "976", "codename": "MN" },
        { "areacode": "853", "codename": "MO" },
        { "areacode": "222", "codename": "MR" },
        { "areacode": "1664", "codename": "MS" },
        { "areacode": "356", "codename": "MT" },
        { "areacode": "230", "codename": "MU" },
        { "areacode": "960", "codename": "MV" },
        { "areacode": "265", "codename": "MW" },
        { "areacode": "52", "codename": "MX" },
        { "areacode": "60", "codename": "MY" },
        { "areacode": "258", "codename": "MZ" },
        { "areacode": "264", "codename": "NA" },
        { "areacode": "687", "codename": "NC" },
        { "areacode": "227", "codename": "NE" },
        { "areacode": "234", "codename": "NG" },
        { "areacode": "505", "codename": "NI" },
        { "areacode": "31", "codename": "NL" },
        { "areacode": "47", "codename": "NO" },
        { "areacode": "977", "codename": "NP" },
        { "areacode": "674", "codename": "NR" },
        { "areacode": "64", "codename": "NZ" },
        { "areacode": "968", "codename": "OM" },
        { "areacode": "507", "codename": "PA" },
        { "areacode": "51", "codename": "PE" },
        { "areacode": "689", "codename": "PF" },
        { "areacode": "675", "codename": "PG" },
        { "areacode": "63", "codename": "PH" },
        { "areacode": "92", "codename": "PK" },
        { "areacode": "48", "codename": "PL" },
        { "areacode": "508", "codename": "PM" },
        { "areacode": "1787", "codename": "PR" },
        { "areacode": "351", "codename": "PT" },
        { "areacode": "680", "codename": "PW" },
        { "areacode": "595", "codename": "PY" },
        { "areacode": "974", "codename": "QA" },
        { "areacode": "262", "codename": "RE" },
        { "areacode": "40", "codename": "RO" },
        { "areacode": "381", "codename": "RS" },
        { "areacode": "7", "codename": "RU" },
        { "areacode": "250", "codename": "RW" },
        { "areacode": "966", "codename": "SA" },
        { "areacode": "677", "codename": "SB" },
        { "areacode": "248", "codename": "SC" },
        { "areacode": "249", "codename": "SD" },
        { "areacode": "46", "codename": "SE" },
        { "areacode": "65", "codename": "SG" },
        { "areacode": "386", "codename": "SI" },
        { "areacode": "421", "codename": "SK" },
        { "areacode": "232", "codename": "SL" },
        { "areacode": "378", "codename": "SM" },
        { "areacode": "221", "codename": "SN" },
        { "areacode": "252", "codename": "SO" },
        { "areacode": "597", "codename": "SR" },
        { "areacode": "239", "codename": "ST" },
        { "areacode": "503", "codename": "SV" },
        { "areacode": "963", "codename": "SY" },
        { "areacode": "268", "codename": "SZ" },
        { "areacode": "1649", "codename": "TC" },
        { "areacode": "235", "codename": "TD" },
        { "areacode": "228", "codename": "TG" },
        { "areacode": "66", "codename": "TH" },
        { "areacode": "992", "codename": "TJ" },
        { "areacode": "670", "codename": "TL" },
        { "areacode": "993", "codename": "TM" },
        { "areacode": "216", "codename": "TN" },
        { "areacode": "676", "codename": "TO" },
        { "areacode": "90", "codename": "TR" },
        { "areacode": "1868", "codename": "TT" },
        { "areacode": "886", "codename": "TW" },
        { "areacode": "255", "codename": "TZ" },
        { "areacode": "380", "codename": "UA" },
        { "areacode": "256", "codename": "UG" },
        { "areacode": "1", "codename": "US" },
        { "areacode": "598", "codename": "UY" },
        { "areacode": "998", "codename": "UZ" },
        { "areacode": "1784", "codename": "VC" },
        { "areacode": "58", "codename": "VE" },
        { "areacode": "1284", "codename": "VG" },
        { "areacode": "84", "codename": "VN" },
        { "areacode": "678", "codename": "VU" },
        { "areacode": "685", "codename": "WS" },
        { "areacode": "967", "codename": "YE" },
        { "areacode": "269", "codename": "YT" },
        { "areacode": "27", "codename": "ZA" },
        { "areacode": "260", "codename": "ZM" },
        { "areacode": "263", "codename": "ZW" },
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
            this.div.classList.add("pc_bj", "pc_logoutwallet");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
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
                iTime.classList.add("iconfont", "icon-bc-gou");
                this.ObjAppend(liTime, iTime);
            });
        }
        toRefer() {
            if (AutoLogoutWalletView.refer) {
                BlackCat.Main.viewMgr.change(AutoLogoutWalletView.refer);
                AutoLogoutWalletView.refer = null;
            }
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
            this.div.classList.add("pc_bj", "pc_login", "pc_register");
            var divLogo = this.objCreate("div");
            divLogo.classList.add("pc_login_logo", "iconfont", "icon-bc-blacat");
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
                iIshurushouji.classList.add("icon-bc-shurushouji");
                iIshurushouji.classList.remove("icon-bc-xinxi");
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
                iIshurushouji.classList.add("icon-bc-xinxi");
                iIshurushouji.classList.remove("icon-bc-shurushouji");
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
            iRegion.classList.add("iconfont", "icon-bc-diqiu");
            this.ObjAppend(areaSelect, iRegion);
            this.selectArea = this.objCreate("select");
            var areaInfo = BlackCat.AreaView.getAreaByLang(BlackCat.Main.langMgr.type);
            areaInfo.forEach(area => {
                var option = this.objCreate("option");
                option.setAttribute("value", area.codename);
                option.textContent = BlackCat.Main.langMgr.get("area_code_" + area.codename);
                if (area.codename == "CN") {
                    option.setAttribute("selected", "selected");
                }
                this.selectArea.options.add(option);
            });
            this.selectArea.onchange = () => {
                areaInfo.forEach(area => {
                    if (area.codename == this.selectArea.value) {
                        this.divArea.textContent = area.areacode;
                    }
                });
            };
            this.ObjAppend(areaSelect, this.selectArea);
            this.divArea = this.objCreate("div");
            this.divArea.classList.add("pc_area");
            areaInfo.forEach(area => {
                if (area.codename == this.selectArea.value) {
                    this.divArea.textContent = area.areacode;
                }
            });
            this.ObjAppend(areaSelect, this.divArea);
            var aArea = this.objCreate("a");
            aArea.classList.add("pc_areaa", "iconfont", "icon-bc-xiala");
            this.ObjAppend(areaSelect, aArea);
            var divTel = this.objCreate("div");
            divTel.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divTel);
            var iIshurushouji = this.objCreate("i");
            iIshurushouji.classList.add("iconfont", "icon-bc-shurushouji");
            this.ObjAppend(divTel, iIshurushouji);
            this.inputAccount = this.objCreate("input");
            this.inputAccount.type = "text";
            this.inputAccount.placeholder = BlackCat.Main.langMgr.get("forgetpass_inputphone");
            this.ObjAppend(divTel, this.inputAccount);
            var divCode = this.objCreate("div");
            divCode.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divCode);
            var iCode = this.objCreate("i");
            iCode.classList.add("iconfont", "icon-bc-dunpai1");
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
            iPass.classList.add("iconfont", "icon-bc-mima");
            this.ObjAppend(divPass, iPass);
            this.inputPass = this.objCreate("input");
            this.inputPass.type = "password";
            this.inputPass.placeholder = BlackCat.Main.langMgr.get("forgetpass_inputPass");
            this.ObjAppend(divPass, this.inputPass);
            var divVPass = this.objCreate("div");
            divVPass.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divVPass);
            var iVPass = this.objCreate("i");
            iVPass.classList.add("iconfont", "icon-bc-mima");
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
        key_esc() {
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
                if (this.inputPass.value.length > 32) {
                    BlackCat.Main.showErrMsg(("forgetpass_exceed"), () => {
                        this.inputPass.focus();
                    });
                    return;
                }
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
                            res = yield BlackCat.ApiTool.getPhoneCode(this.getPhone());
                            break;
                        default:
                            return;
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[ForgetPasswordView]', 'doGetCode, ApiTool ' + this.accountType + 'error => ', e.toString());
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
        show() {
            this.div.style.display = "";
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
                console.log("[BlaCat]", '[IconView]', 'onclick, this.doDragMove => ', this.doDragMove);
                if (this.doDragMove == true) {
                    return false;
                }
                this.hidden();
                BlackCat.Main.viewMgr.mainView.div.classList.remove("pc_windowhide");
                BlackCat.Main.viewMgr.mainView.show();
                if (BlackCat.Main.viewMgr.payView && BlackCat.Main.viewMgr.payView.isCreated) {
                    BlackCat.Main.viewMgr.payView.getHeight("nodes");
                    if (BlackCat.tools.WWW.api_clis && BlackCat.tools.WWW.api_clis != "") {
                        BlackCat.Main.viewMgr.payView.getHeight("clis");
                    }
                }
                if (BlackCat.Main.isStart == false) {
                    BlackCat.SDK.login();
                }
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
            console.log("[BlaCat]", '[IconView]', 'flushProcess, count => ', count);
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
            this.div.classList.add("pc_bj", "pc_login");
            var divLogo = this.objCreate("div");
            divLogo.classList.add("pc_login_logo", "iconfont", "icon-bc-blacat");
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
                iIshurushouji.classList.add("icon-bc-my");
                iIshurushouji.classList.remove("icon-bc-shurushouji", "icon-bc-xinxi");
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
                iIshurushouji.classList.add("icon-bc-shurushouji");
                iIshurushouji.classList.remove("icon-bc-my", "icon-bc-xinxi");
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
                iIshurushouji.classList.add("icon-bc-xinxi");
                iIshurushouji.classList.remove("icon-bc-my", "icon-bc-shurushouji");
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
            iRegion.classList.add("iconfont", "icon-bc-diqiu");
            this.ObjAppend(areaSelect, iRegion);
            this.selectArea = this.objCreate("select");
            var areaInfo = BlackCat.AreaView.getAreaByLang(BlackCat.Main.langMgr.type);
            areaInfo.forEach(area => {
                var option = this.objCreate("option");
                option.setAttribute("value", area.codename);
                option.textContent = BlackCat.Main.langMgr.get("area_code_" + area.codename);
                this.selectArea.options.add(option);
            });
            this.selectArea.onchange = () => {
                areaInfo.forEach(area => {
                    if (area.codename == this.selectArea.value) {
                        this.divArea.textContent = area.areacode;
                    }
                });
            };
            this.ObjAppend(areaSelect, this.selectArea);
            this.divArea = this.objCreate("div");
            this.divArea.classList.add("pc_area");
            areaInfo.forEach(area => {
                if (area.codename == this.selectArea.value) {
                    this.divArea.textContent = area.areacode;
                }
            });
            this.ObjAppend(areaSelect, this.divArea);
            var aArea = this.objCreate("a");
            aArea.classList.add("pc_areaa", "iconfont", "icon-bc-xiala");
            this.ObjAppend(areaSelect, aArea);
            var divTel = this.objCreate("div");
            divTel.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divTel);
            var iIshurushouji = this.objCreate("i");
            iIshurushouji.classList.add("iconfont", "icon-bc-my");
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
            iPass.classList.add("iconfont", "icon-bc-mima");
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
        key_esc() {
        }
        key_enter() {
            this.doLogin();
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
            if (/AppleWebKit.*mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
                if (window.location.href.indexOf("?mobile") < 0) {
                    try {
                        if (/iPad/i.test(navigator.userAgent)) {
                        }
                        else {
                            this.div.classList.add("pc_mobile");
                        }
                    }
                    catch (e) { }
                }
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
    class ModifyAreaView extends BlackCat.ViewBase {
        constructor() {
            super(...arguments);
            this.AreaObj = BlackCat.AreaView.getAreaByLang(BlackCat.Main.langMgr.type);
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_logoutwallet");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("modifyArea");
            this.ObjAppend(header, headerH1);
            var divArea = this.objCreate("div");
            divArea.classList.add("pc_myinfolist");
            this.ObjAppend(this.div, divArea);
            var ulArea = this.objCreate("ul");
            this.ObjAppend(divArea, ulArea);
            var liveArea = BlackCat.Main.user.info.region;
            this.AreaObj.forEach(area => {
                var liArea = this.objCreate("li");
                if (area.codename == liveArea) {
                    liArea.classList.add("pc_active");
                }
                liArea.textContent = BlackCat.Main.langMgr.get("area_code_" + area.codename);
                liArea.onclick = () => {
                    this.doArea(area);
                };
                this.ObjAppend(ulArea, liArea);
                var iArea = this.objCreate("i");
                iArea.classList.add("iconfont", "icon-bc-gou");
                this.ObjAppend(liArea, iArea);
            });
        }
        toRefer() {
            if (ModifyAreaView.refer) {
                BlackCat.Main.viewMgr.change(ModifyAreaView.refer);
                ModifyAreaView.refer = null;
            }
        }
        doArea(area) {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.modUserArea(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, area.codename);
                if (res.r) {
                    BlackCat.Main.showToast("modifyArea_succ");
                    BlackCat.Main.user.setInfo('region', area.codename);
                    BlackCat.Main.viewMgr.myInfoView.modifyArea();
                    this.return();
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
    }
    BlackCat.ModifyAreaView = ModifyAreaView;
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
                this.doCancel();
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
        key_esc() {
            this.doCancel();
        }
        doCancel() {
            this.remove(300);
            if (ModifyImgView.callback_cancel) {
                ModifyImgView.callback_cancel();
                ModifyImgView.callback_cancel = null;
                ModifyImgView.callback = null;
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
                        console.log("[BlaCat]", '[ModifyImgView]', 'doConfirm, ApiTool.modUserIcon error => ', e.toString());
                    }
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    if (res.r) {
                        BlackCat.Main.showToast("modifyImg_succ");
                        BlackCat.Main.user.setInfo('icon', res.data);
                        this.remove();
                        if (ModifyImgView.callback) {
                            ModifyImgView.callback();
                            ModifyImgView.callback = null;
                            ModifyImgView.callback_cancel = null;
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
                this.doCancel();
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
        key_esc() {
            this.doCancel();
        }
        key_enter() {
            this.doConfirm();
        }
        doCancel() {
            this.remove(300);
            if (ModifyNameView.callback_cancel) {
                ModifyNameView.callback_cancel();
                ModifyNameView.callback = null;
                ModifyNameView.callback_cancel = null;
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
                        ModifyNameView.callback_cancel = null;
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
    class ModifyNetworkLineView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_moifynet");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("modifyNet");
            this.ObjAppend(header, headerH1);
            this.divTypes = this.objCreate("div");
            this.divTypes.classList.add("pc_divnettype");
            this.netType_nodes = this.objCreate("button");
            this.netType_nodes.textContent = "BlockAPI";
            this.netType_nodes.classList.add("pc_active");
            if (ModifyNetworkLineView.defaultType == "nodes") {
                this.netType_nodes.classList.add("pc_active");
            }
            this.netType_nodes.onclick = () => {
                this.showNodeInfo("nodes", 1);
            };
            this.ObjAppend(this.divTypes, this.netType_nodes);
            this.netType_clis = this.objCreate("button");
            this.netType_clis.textContent = "NeoCli";
            if (ModifyNetworkLineView.defaultType == "clis") {
                this.netType_nodes.classList.remove("pc_active");
                this.netType_clis.classList.add("pc_active");
            }
            this.netType_clis.onclick = () => {
                this.showNodeInfo("clis", 1);
            };
            this.ObjAppend(this.divTypes, this.netType_clis);
            this.ObjAppend(this.div, this.divTypes);
            this.divLists = this.objCreate("div");
            this.divLists.classList.add("pc_myinfolist");
            this.ObjAppend(this.div, this.divLists);
            this.showNodeInfo(ModifyNetworkLineView.defaultType);
        }
        toRefer() {
            if (ModifyNetworkLineView.refer) {
                BlackCat.Main.viewMgr.change(ModifyNetworkLineView.refer);
                ModifyNetworkLineView.refer = null;
            }
        }
        showNodeInfo(type, clear = 0) {
            var currNodeInfo = BlackCat.Main.netMgr.getCurrNodeInfo(type);
            if (currNodeInfo) {
                this.divTypes.getElementsByClassName("pc_active")[0].classList.remove("pc_active");
                this["netType_" + type].classList.add("pc_active");
                if (clear == 1) {
                    this.divLists.innerHTML = "";
                }
                var ulNet = this.objCreate("ul");
                this.ObjAppend(this.divLists, ulNet);
                var nodeLists = BlackCat.Main.netMgr.getNodeLists(type);
                nodeLists.forEach(nodelist => {
                    var li = this.objCreate("li");
                    if (nodelist[1] == currNodeInfo[1]) {
                        li.classList.add("pc_active");
                    }
                    this.ObjAppend(ulNet, li);
                    var divArea = this.objCreate("div");
                    divArea.classList.add("pc_mmyinfoarea");
                    divArea.textContent = this.getNodeName(nodelist);
                    this.ObjAppend(li, divArea);
                    var divHeight = this.objCreate("div");
                    if (type == "nodes") {
                        divHeight.classList.add("pc_payheighet", "iconfont", "icon-bc-blalian");
                    }
                    if (type == "clis") {
                        divHeight.classList.add("pc_payheighet", "iconfont", "icon-bc-neolian");
                    }
                    divHeight.textContent = "n/a";
                    this.ObjAppend(li, divHeight);
                    var iArea = this.objCreate("i");
                    iArea.classList.add("iconfont", "icon-bc-gou");
                    this.ObjAppend(li, iArea);
                    this.getHeight(type, nodelist, divHeight, li, currNodeInfo);
                });
            }
            else {
            }
        }
        doChange(type, nodelist, height) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.netMgr.setNode(type, nodelist[1]);
                BlackCat.Main.showToast("modifyNet_succ");
                BlackCat.Main.viewMgr.payView.updateHeight(type, height);
                if (ModifyNetworkLineView.refer == "MyInfoView") {
                    BlackCat.Main.viewMgr.myInfoView.updateNodeInfo();
                }
                this.return();
            });
        }
        getNodeName(nodeInfo) {
            let content = BlackCat.Main.langMgr.get("area_code_" + nodeInfo[0]);
            if (nodeInfo[2]) {
                content += nodeInfo[2];
            }
            return content;
        }
        getHeight(type, nodelist, element, li, currNodeInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let height = yield BlackCat.tools.WWW["api_getHeight_" + type](nodelist[1]);
                    if (height > 0) {
                        element.textContent = height.toString();
                        if (nodelist[1] != currNodeInfo[1]) {
                            li.onclick = () => {
                                this.doChange(type, nodelist, height);
                            };
                        }
                        if (nodelist[1] == currNodeInfo[1]) {
                            BlackCat.Main.viewMgr.payView.updateHeight(type, height);
                            if (ModifyNetworkLineView.refer == "MyInfoView") {
                                BlackCat.Main.viewMgr.myInfoView.updateNodeInfo();
                            }
                        }
                        return;
                    }
                }
                catch (e) { }
                li.onclick = () => {
                    BlackCat.Main.showErrMsg("modifyNet_node_err");
                };
            });
        }
    }
    ModifyNetworkLineView.defaultType = "nodes";
    BlackCat.ModifyNetworkLineView = ModifyNetworkLineView;
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
            this.inputSex1Obj.classList.add("iconfont", "icon-bc-nan1");
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
            this.inputSex2Obj.classList.add("iconfont", "icon-bc-nv1");
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
                this.doCancel();
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
        key_esc() {
            this.doCancel();
        }
        doCancel() {
            this.remove(300);
            if (ModifySexView.callback_cancel) {
                ModifySexView.callback_cancel();
                ModifySexView.callback_cancel = null;
                ModifySexView.callback = null;
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
                                ModifySexView.callback_cancel = null;
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
    class ModifyTransactionFeeView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_moifynet");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("modifyFee");
            this.ObjAppend(header, headerH1);
            var divFee = this.objCreate("div");
            divFee.classList.add("pc_modifyfee");
            this.ObjAppend(this.div, divFee);
            this.netFeeCom = new BlackCat.NetFeeComponent(divFee, (net_fee) => {
                this.net_fee = net_fee;
                this.setSpeed();
            });
            this.netFeeCom.setFeeDefault();
            this.netFeeCom.createDiv();
        }
        toRefer() {
            if (ModifyTransactionFeeView.refer) {
                BlackCat.Main.viewMgr.change(ModifyTransactionFeeView.refer);
                ModifyTransactionFeeView.refer = null;
            }
        }
        setSpeed() {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.modUserFee(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, this.net_fee);
                if (res.r) {
                    BlackCat.Main.user.setInfo('service_charge', this.net_fee);
                    BlackCat.Main.viewMgr.personalCenterView.modifyFee();
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
    }
    BlackCat.ModifyTransactionFeeView = ModifyTransactionFeeView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ModifyVipView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.pay_way = "BCT";
            this.month = "12";
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_myvip");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("myinfo_openmember");
            this.ObjAppend(header, headerH1);
            this.monthsElement = this.objCreate("ul");
            this.monthsElement.classList.add("goods");
            this.month12 = this.objCreate("li");
            this.month12.classList.add('goods_item');
            this.month12.innerHTML = BlackCat.Main.langMgr.get("modifyVip_12months");
            this.month12.classList.add('pc_active');
            this.ObjAppend(this.monthsElement, this.month12);
            var righttick = this.objCreate("i");
            righttick.classList.add('iconfont', 'icon-righttick');
            this.ObjAppend(this.month12, righttick);
            this.month12.onclick = () => {
                this.setActive(this.monthsElement, this.month12);
                this.setItem(12);
                this.invite_input.style.display = "block";
                this.updatePayNum();
            };
            this.month3 = this.objCreate("li");
            this.month3.classList.add('goods_item');
            this.month3.innerHTML = BlackCat.Main.langMgr.get("modifyVip_3months");
            this.ObjAppend(this.monthsElement, this.month3);
            var righttick = this.objCreate("i");
            righttick.classList.add('iconfont', 'icon-righttick');
            this.ObjAppend(this.month3, righttick);
            this.month3.onclick = () => {
                this.setActive(this.monthsElement, this.month3);
                this.setItem(3);
                this.invite_input.style.display = "none";
                this.invite_input.value = "";
                this.updatePayNum();
            };
            this.month1 = this.objCreate("li");
            this.month1.classList.add('goods_item');
            this.month1.innerHTML = BlackCat.Main.langMgr.get("modifyVip_1months");
            this.ObjAppend(this.monthsElement, this.month1);
            var righttick = this.objCreate("i");
            righttick.classList.add('iconfont', 'icon-righttick');
            this.ObjAppend(this.month1, righttick);
            this.month1.onclick = () => {
                this.setActive(this.monthsElement, this.month1);
                this.setItem(1);
                this.invite_input.style.display = "none";
                this.invite_input.value = "";
                this.updatePayNum();
            };
            this.ObjAppend(this.div, this.monthsElement);
            var payway = this.objCreate("div");
            payway.classList.add("payway");
            payway.innerHTML = BlackCat.Main.langMgr.get("modifyVip_payway");
            this.ObjAppend(this.div, payway);
            this.payul = this.objCreate("ul");
            this.payul.classList.add("payul");
            this.pay_bct = this.objCreate("li");
            this.pay_bct.classList.add('pay_item');
            this.pay_bct.innerHTML = "BCT";
            this.ObjAppend(this.payul, this.pay_bct);
            this.pay_bct.classList.add('pc_active');
            var righttick = this.objCreate("i");
            righttick.classList.add('iconfont', 'icon-righttick');
            this.ObjAppend(this.pay_bct, righttick);
            this.pay_bct.onclick = () => {
                this.setActive(this.payul, this.pay_bct);
                this.setPayway('BCT');
                this.updatePayNum();
            };
            this.pay_bcp = this.objCreate("li");
            this.pay_bcp.classList.add('pay_item');
            this.pay_bcp.innerHTML = "BCP";
            this.ObjAppend(this.payul, this.pay_bcp);
            var righttick = this.objCreate("i");
            righttick.classList.add('iconfont', 'icon-righttick');
            this.ObjAppend(this.pay_bcp, righttick);
            this.ObjAppend(this.div, this.payul);
            this.pay_bcp.onclick = () => {
                this.setActive(this.payul, this.pay_bcp);
                this.setPayway('BCP');
                this.updatePayNum();
            };
            var invitediv = this.objCreate("div");
            invitediv.classList.add("invitediv");
            this.ObjAppend(this.div, invitediv);
            this.invite_input = this.objCreate("input");
            this.invite_input.classList.add("inviteinput");
            this.invite_input.placeholder = BlackCat.Main.langMgr.get("modifyVip_inviteplaceholder");
            this.ObjAppend(invitediv, this.invite_input);
            this.netFeeCom = new BlackCat.NetFeeComponent(this.div, (net_fee) => {
                this.net_fee = net_fee;
            });
            this.netFeeCom.setFeeDefault();
            this.netFeeCom.createDiv();
            var goods_pay = this.objCreate("div");
            goods_pay.classList.add("goods_pay");
            var payment = this.objCreate("div");
            payment.classList.add("payment");
            this.ObjAppend(goods_pay, payment);
            var paymenttxt = this.objCreate("span");
            paymenttxt.classList.add("paymenttxt");
            paymenttxt.innerHTML = BlackCat.Main.langMgr.get("modifyVip_paymenttxt");
            this.ObjAppend(payment, paymenttxt);
            this.paymentnum = this.objCreate("span");
            this.paymentnum.classList.add("paymentnum");
            this.paymentnum.innerHTML = "";
            this.ObjAppend(payment, this.paymentnum);
            var paymentbtn = this.objCreate("a");
            paymentbtn.classList.add("paymentbtn");
            if (BlackCat.Main.user.info.is_vip == "0") {
                paymentbtn.innerHTML = BlackCat.Main.langMgr.get("modifyVip_payment");
            }
            else if (BlackCat.Main.user.info.is_vip == "1") {
                paymentbtn.innerHTML = BlackCat.Main.langMgr.get("modifyVip_recharge");
            }
            this.ObjAppend(goods_pay, paymentbtn);
            paymentbtn.onclick = () => {
                BlackCat.ViewConfirm.callback = () => {
                    ModifyVipView.pay(this.pay_way, this.month, this.invite_input.value, this.net_fee);
                };
                let lang_key = "";
                if (this.month == "1") {
                    lang_key = "modifyvip_payAmonth";
                }
                else {
                    lang_key = "modifyvip_payconfirm";
                }
                BlackCat.Main.showConFirm(BlackCat.Main.langMgr.get(lang_key, { total: this.total, pay_way: this.pay_way, goods_item: this.month }));
            };
            this.setActive(this.monthsElement, this["month" + this.month]);
            if (this.month == "12") {
                this.invite_input.style.display = "block";
            }
            else {
                this.invite_input.style.display = "none";
                this.invite_input.value = "";
            }
            this.setActive(this.payul, this["pay_" + this.pay_way.toLowerCase()]);
            this.ObjAppend(this.div, goods_pay);
            this.updatePayNum();
        }
        toRefer() {
            if (ModifyVipView.refer) {
                BlackCat.Main.viewMgr.change(ModifyVipView.refer);
                ModifyVipView.refer = null;
            }
        }
        setItem(item) {
            this.month = item;
        }
        setPayway(payway) {
            this.pay_way = payway;
        }
        setActive(list, item) {
            var act = list.getElementsByClassName("pc_active");
            act[0].classList.remove("pc_active");
            item.classList.add("pc_active");
        }
        static getPayAmount(pay_way, month) {
            var pay_way_tolow = pay_way.toLowerCase();
            var config = {
                bct: {
                    1: 69,
                    3: 199,
                    12: 699,
                },
                bcp: {
                    1: 6.9,
                    3: 19.9,
                    12: 69.9,
                }
            };
            if (config.hasOwnProperty(pay_way_tolow) && config[pay_way_tolow].hasOwnProperty(month)) {
                return config[pay_way_tolow][month];
            }
            return 0;
        }
        static getPayNnc(pay_way) {
            if (BlackCat.tools.CoinTool.hasOwnProperty("id_" + pay_way)) {
                return BlackCat.tools.CoinTool["id_" + pay_way];
            }
            return null;
        }
        static getPayTarget() {
            if (BlackCat.tools.CoinTool.BUY_VIP_ADDR != "") {
                return BlackCat.tools.CoinTool.BUY_VIP_ADDR;
            }
            return null;
        }
        updatePayNum() {
            this.total = ModifyVipView.getPayAmount(this.pay_way, this.month.toString());
            this.paymentnum.innerHTML = this.total.toString() + " " + this.pay_way;
        }
        static pay(pay_way, month, invite, net_fee, trust = "0", callback = null, isSDK = false, sdkParams = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    console.log('[BlaCat]', '[ModifyVipView]', 'pay => ', pay_way, month, net_fee);
                    var target = ModifyVipView.getPayTarget();
                    var nnc = ModifyVipView.getPayNnc(pay_way);
                    var total = ModifyVipView.getPayAmount(pay_way, month);
                    if (month != "12") {
                        invite = "";
                    }
                    if (BlackCat.Main.viewMgr.payView[pay_way.toLowerCase()] < total) {
                        if (isSDK) {
                            var rtn_res = new BlackCat.Result();
                            rtn_res.err = true;
                            rtn_res.info = pay_way + " balance error";
                            return rtn_res;
                        }
                        BlackCat.Main.showErrMsg("modifyVip_balance_error", null, { coin_type: pay_way });
                        return;
                    }
                    if (Number(net_fee) > 0) {
                        if (BlackCat.Main.viewMgr.payView.gas < Number(net_fee)) {
                            if (isSDK) {
                                var rtn_res = new BlackCat.Result();
                                rtn_res.err = true;
                                rtn_res.info = "gas fee not enough";
                                return rtn_res;
                            }
                            BlackCat.Main.showErrMsg("modifyVip_gas_less");
                            return;
                        }
                    }
                    var uid_res = yield ModifyVipView.checkUidFromApi(invite);
                    if (!uid_res) {
                        if (isSDK) {
                            var rtn_res = new BlackCat.Result();
                            rtn_res.err = true;
                            rtn_res.info = "invite error";
                            return rtn_res;
                        }
                        BlackCat.Main.showErrMsg("modifyVip_invite_err");
                        return;
                    }
                    BlackCat.Main.viewMgr.change("ViewLoading");
                    try {
                        var res = yield BlackCat.tools.CoinTool.nep5Transaction(BlackCat.Main.user.info.wallet, target, nnc, total.toString(), net_fee);
                    }
                    catch (e) { }
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    if (res) {
                        console.log("[BlaCat]", '[ModifyVipView]', 'pay转账结果 => ', res);
                        if (res.err == false) {
                            var size = 100000000;
                            if (nnc == BlackCat.tools.CoinTool.id_BCT) {
                                size = 10000;
                            }
                            var log_sbParamJson = "(addr)" + BlackCat.Main.user.info.wallet + ",(address)" + target + ",(integer)" + (total * size).toString();
                            var log_params = {};
                            if (isSDK && sdkParams) {
                                log_params = sdkParams;
                            }
                            else {
                                log_params = {
                                    uid: BlackCat.Main.user.info.uid,
                                    month: month,
                                    invite: invite,
                                    nnc: nnc,
                                    sbPushString: "transfer",
                                    sbParamJson: log_sbParamJson,
                                    toaddr: target,
                                    total: total,
                                };
                            }
                            yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, res.info, "0", total.toString(), "16", JSON.stringify(log_params), BlackCat.Main.netMgr.type, trust, net_fee, BlackCat.PayTransferView.log_type_detail[pay_way.toLowerCase()]);
                            BlackCat.Main.viewMgr.payView.doGetWalletLists(1);
                            BlackCat.Main.needGetPlatNotifys = true;
                            if (isSDK) {
                                var rtn_res = new BlackCat.Result();
                                rtn_res.err = false;
                                rtn_res.info = res.info;
                                return rtn_res;
                            }
                            BlackCat.Main.showInfo("modifyVip_succ", () => {
                                BlackCat.Main.viewMgr.modifyVipView.return();
                                BlackCat.Main.viewMgr.personalCenterView.return();
                            });
                        }
                        else {
                            if (isSDK) {
                                var rtn_res = new BlackCat.Result();
                                rtn_res.err = true;
                                rtn_res.info = res.info;
                                return rtn_res;
                            }
                            BlackCat.Main.showErrMsg("modifyVip_fail");
                            return;
                        }
                    }
                    else {
                        if (isSDK) {
                            var rtn_res = new BlackCat.Result();
                            rtn_res.err = true;
                            rtn_res.info = "send nep5Transaction error";
                            return rtn_res;
                        }
                    }
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "ModifyVipView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        ModifyVipView.pay(pay_way, month, invite, net_fee, trust, callback);
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        static checkUidFromApi(uid) {
            return __awaiter(this, void 0, void 0, function* () {
                if (uid && uid != "") {
                    var res = yield BlackCat.ApiTool.validUid(uid);
                    if (res.hasOwnProperty('errCode') && res.errCode == 100707) {
                        return true;
                    }
                    return false;
                }
                else {
                    return true;
                }
            });
        }
    }
    BlackCat.ModifyVipView = ModifyVipView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class MyInfoView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_myinfo");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
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
            liMyinfoImg.onclick = () => {
                this.modifyImg();
            };
            liMyinfoImg.textContent = BlackCat.Main.langMgr.get("myinfo_headImg");
            var iMyinfoimg = this.objCreate("i");
            iMyinfoimg.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liMyinfoImg, iMyinfoimg);
            var spanMyinfoimg = this.objCreate("span");
            this.ObjAppend(liMyinfoImg, spanMyinfoimg);
            this.myImg = this.objCreate("img");
            this.myImg.setAttribute("src", this.getImg());
            this.ObjAppend(spanMyinfoimg, this.myImg);
            this.ObjAppend(ulMyinfo, liMyinfoImg);
            var liMyinfoName = this.objCreate("li");
            liMyinfoName.textContent = BlackCat.Main.langMgr.get("myinfo_nickname");
            liMyinfoName.onclick = () => {
                this.modifyName();
            };
            this.ObjAppend(ulMyinfo, liMyinfoName);
            var iMyinfoName = this.objCreate("i");
            iMyinfoName.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liMyinfoName, iMyinfoName);
            this.myName = this.objCreate("span");
            this.myName.textContent = this.getName();
            this.ObjAppend(liMyinfoName, this.myName);
            var liMyinfoSex = this.objCreate("li");
            liMyinfoSex.textContent = BlackCat.Main.langMgr.get("myinfo_sex");
            liMyinfoSex.onclick = () => {
                this.modifySex();
            };
            var iMyinfoSex = this.objCreate("i");
            iMyinfoSex.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liMyinfoSex, iMyinfoSex);
            this.mySex = this.objCreate("span");
            this.mySex.textContent = this.getSex();
            this.ObjAppend(liMyinfoSex, this.mySex);
            this.ObjAppend(ulMyinfo, liMyinfoSex);
            var liMyinfoArea = this.objCreate("li");
            liMyinfoArea.textContent = BlackCat.Main.langMgr.get("myinfo_area");
            liMyinfoArea.onclick = () => {
                this.hidden();
                BlackCat.ModifyAreaView.refer = "MyInfoView";
                BlackCat.Main.viewMgr.change("ModifyAreaView");
            };
            this.ObjAppend(ulMyinfo, liMyinfoArea);
            var iMyinfoArea = this.objCreate("i");
            iMyinfoArea.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liMyinfoArea, iMyinfoArea);
            this.myArea = this.objCreate("span");
            this.myArea.textContent = this.getArea();
            this.ObjAppend(liMyinfoArea, this.myArea);
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
        getSex() {
            return BlackCat.Main.langMgr.get("myinfo_sex_" + BlackCat.Main.user.info.sex);
        }
        getFee() {
            if (BlackCat.Main.user.info.service_charge) {
                return BlackCat.Main.user.info.service_charge + " " + BlackCat.Main.langMgr.get("gas");
            }
            else {
                return BlackCat.Main.user.info.service_charge ? BlackCat.Main.user.info.service_charge : BlackCat.Main.langMgr.get("myinfo_fee_empty");
            }
        }
        getArea() {
            return BlackCat.Main.langMgr.get("area_code_" + BlackCat.Main.user.info.region) ? BlackCat.Main.langMgr.get("area_code_" + BlackCat.Main.user.info.region) : BlackCat.Main.langMgr.get("myinfo_area_empty");
        }
        modifyImg() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ModifyImgView.callback = () => {
                    this.myImg.src = this.getImg();
                    this.div.focus();
                };
                BlackCat.ModifyImgView.callback_cancel = () => {
                    this.div.focus();
                };
                BlackCat.Main.viewMgr.change("ModifyImgView");
            });
        }
        modifyName() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ModifyNameView.callback = () => {
                    this.myName.textContent = this.getName();
                    this.div.focus();
                };
                BlackCat.ModifyNameView.callback_cancel = () => {
                    this.div.focus();
                };
                BlackCat.Main.viewMgr.change("ModifyNameView");
            });
        }
        modifySex() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ModifySexView.callback = () => {
                    this.mySex.textContent = this.getSex();
                    this.div.focus();
                };
                BlackCat.ModifySexView.callback_cancel = () => {
                    this.div.focus();
                };
                BlackCat.Main.viewMgr.change("ModifySexView");
            });
        }
        modifyFee() {
            this.myFee.textContent = this.getFee();
        }
        modifyArea() {
            this.myArea.textContent = this.getArea();
        }
        getNodeHeight(type) {
            return __awaiter(this, void 0, void 0, function* () {
                let height = BlackCat.Main.viewMgr.payView["height_" + type].toString();
                if (height > 0) {
                    this["divHeight_" + type].textContent = height == 0 ? "n/a" : height;
                }
            });
        }
        updateNodeInfo() {
            this.getNodeHeight("nodes");
            if (BlackCat.tools.WWW.api_clis && BlackCat.tools.WWW.api_clis != "") {
                this.getNodeHeight("clis");
            }
        }
    }
    BlackCat.MyInfoView = MyInfoView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayExchangeBCTView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("pay_exchange_bct");
            this.ObjAppend(header, headerH1);
            this.iframDivElement = this.objCreate("div");
            this.iframDivElement.style.height = "100%";
            this.iframDivElement.style.marginTop = "50px";
            this.ObjAppend(this.div, this.iframDivElement);
            this.getIframeUrl();
            this.dev = BlackCat.Main.check();
        }
        reset() {
        }
        toRefer() {
            if (PayExchangeBCTView.refer) {
                BlackCat.Main.viewMgr.change(PayExchangeBCTView.refer);
                PayExchangeBCTView.refer = null;
            }
        }
        getIframeUrl() {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.getBctIframe(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token);
                var nettype = BlackCat.Main.netMgr.type;
                var net = "";
                var dev = "";
                if (nettype == 1) {
                    net = "&t=" + nettype;
                }
                else if (nettype == 2) {
                    net = "&t=" + nettype;
                }
                if (this.dev == "pc") {
                    dev = "&m=p";
                }
                else if (this.dev == "mobile") {
                    dev = "&m=m";
                }
                if (res.r) {
                    this.iframDivElement.innerHTML = '<iframe src=' + res.data + net + dev + ' width="100%" height="100%" scrolling="no"></iframe>';
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
    }
    BlackCat.PayExchangeBCTView = PayExchangeBCTView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayExchangeDetailView extends BlackCat.ViewBase {
        constructor() {
            super(...arguments);
            this.balance = 0;
            this.s_getWalletLists = {};
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_exchangedetail", "buygas");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.doCancel();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("pay_exchange_" + PayExchangeDetailView.callback_params.type.toLowerCase());
            this.ObjAppend(header, headerH1);
            var divExchange = this.objCreate("div");
            divExchange.classList.add("pc_exchangetitle");
            this.ObjAppend(this.div, divExchange);
            var divEcvhangeObj = this.objCreate("div");
            divEcvhangeObj.classList.add("pc_exchangelist");
            this.ObjAppend(divExchange, divEcvhangeObj);
            var divExchangeName = this.objCreate("div");
            divExchangeName.classList.add("pc_exchangename");
            var pExchangeName = this.objCreate("p");
            pExchangeName.textContent = PayExchangeDetailView.callback_params.type + "/" + PayExchangeDetailView.callback_params.type_src;
            this.ObjAppend(divExchangeName, pExchangeName);
            this.ObjAppend(divEcvhangeObj, divExchangeName);
            var divNewPrice = this.objCreate("div");
            divNewPrice.classList.add("pc_exchangeprice");
            var divNewPriceName = this.objCreate("label");
            divNewPriceName.textContent = BlackCat.Main.langMgr.get("pay_exchange_price");
            this.ObjAppend(divNewPrice, divNewPriceName);
            var pNewPrice = this.objCreate("p");
            pNewPrice.textContent = PayExchangeDetailView.callback_params.price;
            this.ObjAppend(divNewPrice, pNewPrice);
            this.ObjAppend(divEcvhangeObj, divNewPrice);
            var divBalance = this.objCreate("div");
            divBalance.classList.add("pc_exchangeprice");
            var labelBalanceName = this.objCreate("label");
            labelBalanceName.textContent = PayExchangeDetailView.callback_params.type_src + BlackCat.Main.langMgr.get("pay_exchange_balance");
            this.ObjAppend(divBalance, labelBalanceName);
            this.balanceHtmlElement = this.objCreate("p");
            this.balanceHtmlElement.textContent = "0";
            this.ObjAppend(divBalance, this.balanceHtmlElement);
            var divBalanceObj = this.objCreate("div");
            divBalanceObj.classList.add("pc_exchangelist", "balance");
            this.ObjAppend(this.div, divBalanceObj);
            this.ObjAppend(divBalanceObj, divBalance);
            var divGas = this.objCreate("div");
            divGas.classList.add("pc_exc_purchases");
            var divConsume = this.objCreate("div");
            divConsume.classList.add("pc_exc_consume");
            this.ObjAppend(divGas, divConsume);
            if (PayExchangeDetailView.callback_params.type_src != "CNEO") {
                var labelconsume = this.objCreate("a");
                labelconsume.textContent = BlackCat.Main.langMgr.get("pay_exchange_getmore", { type: PayExchangeDetailView.callback_params.type_src });
                this.ObjAppend(divConsume, labelconsume);
                labelconsume.onclick = () => __awaiter(this, void 0, void 0, function* () {
                    if (PayExchangeDetailView.callback_params.type_src == 'BCT') {
                        this.hidden();
                        BlackCat.PayExchangeBCTView.refer = "PayExchangeDetailView";
                        BlackCat.Main.viewMgr.change("PayExchangeBCTView");
                    }
                    else {
                        this.showGetMore();
                    }
                });
            }
            var divGasObj = this.objCreate("div");
            divGasObj.classList.add("pc_exc_inputpurchases");
            var spanGas = this.objCreate("span");
            spanGas.classList.add("buygasspan");
            spanGas.textContent = PayExchangeDetailView.callback_params.type;
            this.ObjAppend(divGasObj, spanGas);
            this.ObjAppend(divGas, divGasObj);
            this.inputGas = this.objCreate("input");
            this.inputGas.classList.add("buygasinput");
            this.inputGas.placeholder = BlackCat.Main.langMgr.get("pay_exchange_placeholderconfirm");
            this.ObjAppend(divGasObj, this.inputGas);
            var divGasObj = this.objCreate("div");
            divGasObj.classList.add("pc_exc_inputpurchases");
            var spanGas = this.objCreate("span");
            spanGas.classList.add("buygasspan");
            spanGas.textContent = PayExchangeDetailView.callback_params.type_src;
            this.ObjAppend(divGasObj, spanGas);
            this.ObjAppend(divGas, divGasObj);
            this.inputNEO = this.objCreate("input");
            this.inputNEO.classList.add("buygasinput");
            this.inputNEO.placeholder = BlackCat.Main.langMgr.get("pay_exchange_buyNEO");
            this.ObjAppend(divGasObj, this.inputNEO);
            this.inputGas.onkeyup = () => {
                var price = PayExchangeDetailView.callback_params.price;
                var count = this.inputGas.value;
                var spent = this.getSpent(price, count);
                this.inputNEO.value = BlackCat.Main.getStringNumber(spent);
            };
            this.inputNEO.onkeyup = () => {
                var price = PayExchangeDetailView.callback_params.price;
                var count = this.inputNEO.value;
                var payment = this.getpayment(count, price);
                this.inputGas.value = BlackCat.Main.getStringNumber(payment);
            };
            if (PayExchangeDetailView.callback_params.type_src == "NEO") {
                this.inputGas.disabled = true;
                this.inputGas.value = "0";
            }
            else {
                this.inputNEO.disabled = true;
                this.inputNEO.value = "0";
            }
            this.netFeeCom = new BlackCat.NetFeeComponent(divGasObj, (net_fee) => {
                this.net_fee = net_fee;
            });
            this.netFeeCom.setFeeDefault();
            this.netFeeCom.createDiv();
            var btnGas = this.objCreate("button");
            btnGas.textContent = BlackCat.Main.langMgr.get("pay_exchange_confirmbuy");
            btnGas.onclick = () => {
                this.buy();
            };
            this.ObjAppend(divGasObj, btnGas);
            this.ObjAppend(this.div, divGas);
            this.nnc = BlackCat.tools.CoinTool["id_" + PayExchangeDetailView.callback_params.type_src];
            this.destoryAddr = BlackCat.tools.CoinTool["id_" + PayExchangeDetailView.callback_params.type_src + "_DESTROY"];
            this.buyFail = "pay_exchange_detail_buy_" + PayExchangeDetailView.callback_params.type + "_fail";
            this.getBalance();
        }
        toRefer() {
            if (PayExchangeDetailView.refer) {
                BlackCat.Main.viewMgr.change(PayExchangeDetailView.refer);
                PayExchangeDetailView.refer = null;
            }
        }
        key_esc() {
            this.doCancel();
        }
        doCancel() {
            this.addGetWalletLists();
            this.return();
        }
        doMakeTransfer() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.PayTransferView.callback = () => {
                        BlackCat.Main.viewMgr.payView.doGetWalletLists(1);
                    };
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
        getBalance() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.nnc && this.nnc != "") {
                    this.balance = BlackCat.Main.viewMgr.payView[PayExchangeDetailView.callback_params.data.type_src];
                    this.balanceHtmlElement.textContent = BlackCat.Main.getStringNumber(this.balance);
                }
            });
        }
        buy() {
            return __awaiter(this, void 0, void 0, function* () {
                var price = PayExchangeDetailView.callback_params.price;
                var count = this.inputGas.value;
                var spent = this.getSpent(price, count);
                var src_count = BlackCat.Main.getStringNumber(spent);
                if (this.checkTransCount(count) === false) {
                    this.inputGas.focus();
                    return;
                }
                if (BlackCat.floatNum.times(Number(price), Number(count)) > this.balance) {
                    BlackCat.Main.showErrMsg('pay_exchange_balance_not_enough', () => {
                        this.inputGas.focus();
                    });
                    return;
                }
                var min_count = 0.00000001;
                if (PayExchangeDetailView.callback_params.type_src.toLowerCase() == "bct") {
                    min_count = 0.0001;
                }
                if (BlackCat.floatNum.times(Number(price), Number(count)) < min_count) {
                    BlackCat.Main.showErrMsg('pay_exchange_spent_not_enough', () => {
                        this.inputGas.focus();
                    });
                    return;
                }
                var cHash = this.getBuyContractHash();
                if (cHash == "") {
                    return;
                }
                BlackCat.Main.viewMgr.change("ViewLoading");
                var net_fee = this.net_fee;
                var res = null;
                res = yield BlackCat.tools.CoinTool.nep5Transaction(BlackCat.Main.user.info.wallet, this.destoryAddr, this.nnc, src_count, net_fee, true);
                if (res) {
                    console.log("[BlaCat]", '[PayExchangeDetailView]', '购买结果 => ', res);
                    if (res.err == false) {
                        var buy_res = yield BlackCat.ApiTool.transferByOther(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, PayExchangeDetailView.callback_params.type_src.toLowerCase(), PayExchangeDetailView.callback_params.type.toLowerCase(), price, count, BlackCat.Main.netMgr.type, res.info, cHash);
                        if (buy_res) {
                            if (buy_res.r) {
                                if (buy_res.data) {
                                    var result = yield BlackCat.tools.WWW.api_postRawTransaction(res['data']);
                                    if (result["sendrawtransactionresult"]) {
                                        if (res['oldarr']) {
                                            BlackCat.tools.OldUTXO.oldutxosPush(res['oldarr']);
                                        }
                                    }
                                    BlackCat.Main.viewMgr.viewLoading.remove();
                                    BlackCat.Main.showInfo('pay_exchange_buy_ok', () => {
                                        BlackCat.Main.viewMgr.payView.doGetWalletLists(1);
                                        BlackCat.Main.viewMgr.payExchangeDetailView.return();
                                        BlackCat.Main.viewMgr.payExchangeView.return();
                                    });
                                    return;
                                }
                            }
                            else {
                                BlackCat.Main.viewMgr.viewLoading.remove();
                                BlackCat.Main.showErrCode(buy_res.errCode);
                                return;
                            }
                        }
                    }
                }
                BlackCat.Main.viewMgr.viewLoading.remove();
                BlackCat.Main.showErrMsg(this.buyFail);
            });
        }
        getSpent(price, count, float = 100000000) {
            var tmp = BlackCat.floatNum.times(Number(price), Number(count));
            if (PayExchangeDetailView.callback_params.type_src.toLowerCase() == "bct") {
                float = 10000;
            }
            return Math.round(tmp * float) / float;
        }
        getpayment(count, price, float = 100000000) {
            var tmp = BlackCat.floatNum.divide(Number(count), Number(price));
            return Math.round(tmp * float) / float;
        }
        getBuyContractHash() {
            var cHash = "";
            if (BlackCat.tools.CoinTool.hasOwnProperty("id_" + PayExchangeDetailView.callback_params.type)) {
                cHash = BlackCat.tools.CoinTool["id_" + PayExchangeDetailView.callback_params.type];
            }
            return cHash;
        }
        addGetWalletLists() {
            var type = PayExchangeDetailView.callback_params.type_src;
            var timeout = 1000;
            switch (type) {
                case "BTC":
                    timeout = 15 * 60 * 1000;
                    break;
                case "ETH":
                    timeout = 3 * 60 * 1000;
                    break;
                default:
                    timeout = 2 * 60 * 1000;
                    break;
            }
            if (this.s_getWalletLists.hasOwnProperty(type)) {
                if (this.s_getWalletLists[type]) {
                    clearTimeout(this.s_getWalletLists[type]);
                }
            }
            this.s_getWalletLists[type] = setTimeout(() => {
                BlackCat.Main.viewMgr.payView.doGetWalletLists();
            }, timeout);
        }
        showGetMore() {
            return __awaiter(this, void 0, void 0, function* () {
                this.hidden();
                BlackCat.PayExchangeShowWalletView.refer = "PayExchangeDetailView";
                BlackCat.PayExchangeShowWalletView.callback_params = PayExchangeDetailView.callback_params;
                BlackCat.PayExchangeShowWalletView.balance = this.balance;
                BlackCat.Main.viewMgr.change("PayExchangeShowWalletView");
            });
        }
        updateBalance() {
            this.getBalance();
        }
    }
    BlackCat.PayExchangeDetailView = PayExchangeDetailView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayExchangeShowWalletView extends BlackCat.ViewBase {
        constructor() {
            super(...arguments);
            this.s_getWalletLists = {};
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_exchangedetail", "buygas", "buycoin");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.doCancel();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("get_pay") + PayExchangeShowWalletView.callback_params.type_src;
            this.ObjAppend(header, headerH1);
            var divBalance = this.objCreate("div");
            divBalance.classList.add("pc_exchangeprice");
            var labelBalanceName = this.objCreate("label");
            labelBalanceName.textContent = PayExchangeShowWalletView.callback_params.type_src + BlackCat.Main.langMgr.get("pay_exchange_balance");
            this.ObjAppend(divBalance, labelBalanceName);
            this.balanceElement = this.objCreate("p");
            this.balanceElement.textContent = PayExchangeShowWalletView.balance.toString();
            this.ObjAppend(divBalance, this.balanceElement);
            var divBalanceObj = this.objCreate("div");
            divBalanceObj.classList.add("pc_exchangelist", "balance", "margin_top45");
            this.ObjAppend(this.div, divBalanceObj);
            this.ObjAppend(divBalanceObj, divBalance);
            var divDescribeTitle = this.objCreate("div");
            divDescribeTitle.classList.add("pc_addresstitle");
            divDescribeTitle.textContent = BlackCat.Main.langMgr.get("pay_exchange_purchase_process");
            this.ObjAppend(this.div, divDescribeTitle);
            var divDescribeText = this.objCreate("div");
            divDescribeText.classList.add("pc_describetext");
            this.ObjAppend(this.div, divDescribeText);
            var processp1 = this.objCreate("p");
            var callback_params_typesrc = PayExchangeShowWalletView.callback_params.type_src;
            var callback_params_typesrc_a = PayExchangeShowWalletView.callback_params.type_src;
            var callback_params_typesrc_b = PayExchangeShowWalletView.callback_params.type_src;
            processp1.textContent = BlackCat.Main.langMgr.get("pay_exchange_processp1", { type: callback_params_typesrc, type1: callback_params_typesrc_a, type2: callback_params_typesrc_b });
            this.ObjAppend(divDescribeText, processp1);
            var divObj = this.objCreate("div");
            divObj.classList.add("pc_addressbookdet");
            this.ObjAppend(this.div, divObj);
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
                inputCooy.value = divAddress.innerText;
                this.ObjAppend(divObj, inputCooy);
                inputCooy.select();
                document.execCommand("Copy");
                inputCooy.remove();
                BlackCat.Main.showToast("pc_receivables_copy", 1500);
            };
            this.ObjAppend(divAddressTitle, butCopy);
            var divAddress = this.objCreate("p");
            divAddress.classList.add("pc_address");
            divAddress.textContent = PayExchangeShowWalletView.callback_params.data.address;
            this.ObjAppend(divObj, divAddress);
            var divQRCode = this.objCreate("div");
            divQRCode.classList.add("pc_qrcode");
            this.ObjAppend(divObj, divQRCode);
            var qrObj = this.objCreate("img");
            QrCodeWithLogo.toImage({
                image: qrObj,
                content: PayExchangeShowWalletView.callback_params.data.address
            }).then(() => {
                var url = URL.createObjectURL(this.base64ToBlob(qrObj.src));
                qr_download.setAttribute('href', url);
                qr_download.setAttribute("download", PayExchangeShowWalletView.callback_params.data.address + ".png");
            });
            this.ObjAppend(divQRCode, qrObj);
            var qr_download = this.objCreate("a");
            qr_download.classList.add("iconfont", "icon-bc-xiazai");
            qr_download.textContent = BlackCat.Main.langMgr.get("addressbook_det_download");
            this.ObjAppend(divQRCode, qr_download);
        }
        toRefer() {
            if (PayExchangeShowWalletView.refer) {
                BlackCat.Main.viewMgr.change(PayExchangeShowWalletView.refer);
                PayExchangeShowWalletView.refer = null;
            }
        }
        key_esc() {
            this.doCancel();
        }
        doCancel() {
            this.addGetWalletLists();
            this.return();
        }
        doMakeTransfer() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.PayTransferView.callback = () => {
                        BlackCat.Main.viewMgr.payView.doGetWalletLists(1);
                    };
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
        addGetWalletLists() {
            var type = PayExchangeShowWalletView.callback_params.type_src;
            var timeout = 1000;
            switch (type) {
                case "BTC":
                    timeout = 15 * 60 * 1000;
                    break;
                case "ETH":
                    timeout = 3 * 60 * 1000;
                    break;
                default:
                    timeout = 2 * 60 * 1000;
                    break;
            }
            if (this.s_getWalletLists.hasOwnProperty(type)) {
                if (this.s_getWalletLists[type]) {
                    clearTimeout(this.s_getWalletLists[type]);
                }
            }
            this.s_getWalletLists[type] = setTimeout(() => {
                BlackCat.Main.viewMgr.payView.doGetWalletLists();
            }, timeout);
        }
        updateBalance() {
            let type_lowcase = PayExchangeShowWalletView.callback_params.type_src.toLowerCase();
            PayExchangeShowWalletView.balance = BlackCat.Main.viewMgr.payView[type_lowcase];
            this.balanceElement.textContent = PayExchangeShowWalletView.balance.toString();
        }
    }
    BlackCat.PayExchangeShowWalletView = PayExchangeShowWalletView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayExchangeView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("pay_exchange_" + PayExchangeView.type_src);
            this.ObjAppend(header, headerH1);
            this.exchange_type_buy = this.objCreate("div");
            this.exchange_type_buy.classList.add("pc_exchangetitle");
            this.ObjAppend(this.div, this.exchange_type_buy);
            this.exchange_detail = this.objCreate("div");
            this.exchange_detail.classList.add("pc_exchangelist");
            this.ObjAppend(this.div, this.exchange_detail);
            this.getExchangeInfo(0);
        }
        reset() {
            this.exchange_type_buy = null;
            this.exchange_typeObj = null;
            this.exchange_buyObj = null;
            this.exchange_detail = null;
            this.exchange_detail_ul = null;
            this.exchange_info = null;
            this.exchange_coin_type = null;
            this.exchange_coin_name = null;
            this.exchange_size = 8;
        }
        toRefer() {
            if (PayExchangeView.refer) {
                BlackCat.Main.viewMgr.change(PayExchangeView.refer);
                PayExchangeView.refer = null;
            }
        }
        getExchangeInfo(src_coin) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                try {
                    var res = yield BlackCat.ApiTool.getExchangeInfo(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, src_coin, BlackCat.Main.netMgr.type, PayExchangeView.type_src);
                }
                catch (e) {
                }
                BlackCat.Main.viewMgr.viewLoading.remove();
                if (res.r) {
                    let data = res.data;
                    console.log("[BlaCat]", '[PayExchangeView]', 'getExchangeInfo, data =>', data);
                    if (data && data.hasOwnProperty("info") && data.hasOwnProperty("coin") && data.hasOwnProperty("jys")) {
                        this.exchange_info = data;
                        this.showExchangeInfo();
                    }
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        showExchangeInfo() {
            console.log("[BlaCat]", '[PayExchangeView]', 'showExchangeInfo ...');
            this.exchange_coin_type = this.exchange_info.coin[0][0];
            this.showCoinType();
            this.showBuy();
            this.showDetail();
        }
        showCoinType() {
            this.exchange_typeObj = this.objCreate("ul");
            this.ObjAppend(this.exchange_type_buy, this.exchange_typeObj);
            this.exchange_info.coin.forEach(list => {
                var coinType_li = this.objCreate("li");
                coinType_li.textContent = list[1];
                if (Number(list[0]) == this.exchange_coin_type) {
                    coinType_li.classList.add("pc_active");
                    this.exchange_coin_name = list[1];
                    if (this.exchange_coin_name.toLowerCase() == "bct") {
                        this.exchange_size = 4;
                    }
                    else {
                        this.exchange_size = 8;
                    }
                }
                coinType_li.onclick = () => {
                    this.exchange_typeObj.getElementsByClassName("pc_active")[0].classList.remove("pc_active");
                    coinType_li.classList.add("pc_active");
                    this.setExchangeCoinTypeInfo(Number(list[0]));
                    this.showBuy(1);
                    this.showDetail(1);
                };
                this.ObjAppend(this.exchange_typeObj, coinType_li);
            });
        }
        showBuy(clear = 0) {
            if (this.exchange_buyObj && clear == 1) {
                this.objRemove(this.exchange_type_buy, this.exchange_buyObj);
            }
            this.exchange_buyObj = this.objCreate("div");
            this.exchange_buyObj.classList.add("pc_exchangelist");
            this.ObjAppend(this.exchange_type_buy, this.exchange_buyObj);
            var buyObj_name = this.objCreate("div");
            buyObj_name.classList.add("pc_exchangename");
            var buyObj_name_img = this.objCreate("img");
            buyObj_name_img.src = BlackCat.Main.resHost + "res/img/game0.png";
            this.ObjAppend(buyObj_name, buyObj_name_img);
            var buyObj_name_content = this.objCreate("label");
            buyObj_name_content.textContent = BlackCat.Main.platName;
            this.ObjAppend(buyObj_name, buyObj_name_content);
            var buyObj_name_type = this.objCreate("p");
            buyObj_name_type.textContent = PayExchangeView.type_src.toUpperCase() + "/" + this.exchange_coin_name;
            this.ObjAppend(buyObj_name, buyObj_name_type);
            this.ObjAppend(this.exchange_buyObj, buyObj_name);
            var buyObj_price = this.objCreate("div");
            buyObj_price.classList.add("pc_exchangeprice");
            var buyObj_price_name = this.objCreate("label");
            buyObj_price_name.textContent = BlackCat.Main.langMgr.get("pay_exchange_price");
            this.ObjAppend(buyObj_price, buyObj_price_name);
            var buyObj_price_price = this.objCreate("p");
            buyObj_price_price.textContent = BlackCat.floatNum.addZero(this.getCurr(this.exchange_size), this.exchange_size);
            this.ObjAppend(buyObj_price, buyObj_price_price);
            this.ObjAppend(this.exchange_buyObj, buyObj_price);
            var buyObj_buy = this.objCreate("div");
            buyObj_buy.classList.add("pc_exchangerange");
            var buyObj_buy_btn = this.objCreate("button");
            buyObj_buy_btn.textContent = BlackCat.Main.langMgr.get("pay_exchange_purchase");
            buyObj_buy_btn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                var coin = this.exchange_coin_name.toLowerCase();
                switch (coin) {
                    case "cneo":
                    case "bct":
                        var res = {};
                        res['data'] = {
                            address: BlackCat.Main.user.info.wallet,
                            balance: BlackCat.Main.viewMgr.payView[coin],
                            type: "",
                            type_src: coin,
                            uid: BlackCat.Main.user.info.uid,
                        };
                        break;
                    default:
                        BlackCat.Main.viewMgr.change("ViewLoading");
                        try {
                            var res = yield BlackCat.ApiTool.getOtherAddress(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, this.exchange_coin_name.toLowerCase(), BlackCat.Main.netMgr.type);
                        }
                        catch (e) {
                        }
                        BlackCat.Main.viewMgr.viewLoading.remove();
                        if (!res || !res.r) {
                            BlackCat.Main.showErrMsg("pay_exchange_create_wallet_fail");
                            return;
                        }
                        break;
                }
                this.hidden();
                BlackCat.PayExchangeDetailView.callback_params = {
                    type: PayExchangeView.type_src.toUpperCase(),
                    type_id: this.exchange_coin_type,
                    type_src: this.exchange_coin_name,
                    price: buyObj_price_price.textContent,
                    data: res.data,
                };
                BlackCat.PayExchangeDetailView.refer = "PayExchangeView";
                BlackCat.Main.viewMgr.change("PayExchangeDetailView");
            });
            this.ObjAppend(buyObj_buy, buyObj_buy_btn);
            this.ObjAppend(this.exchange_buyObj, buyObj_buy);
        }
        showDetail(clear = 0) {
            if (this.exchange_detail_ul && clear == 1) {
                this.objRemove(this.exchange_detail, this.exchange_detail_ul);
            }
            this.exchange_detail_ul = this.objCreate("ul");
            this.ObjAppend(this.exchange_detail, this.exchange_detail_ul);
            this.exchange_info.info.forEach(list => {
                if (list.type == this.exchange_coin_type) {
                    var detail_li = this.objCreate("li");
                    this.ObjAppend(this.exchange_detail_ul, detail_li);
                    var li_name = this.objCreate("div");
                    li_name.classList.add("pc_exchangename");
                    var li_name_img = this.objCreate("img");
                    li_name_img.src = this.getMarketLiImg(list);
                    this.ObjAppend(li_name, li_name_img);
                    var li_name_content = this.objCreate("label");
                    li_name_content.textContent = this.exchange_info["jys"][list.jys];
                    this.ObjAppend(li_name, li_name_content);
                    var li_name_coin = this.objCreate("p");
                    li_name_coin.textContent = PayExchangeView.type_src.toUpperCase() + "/" + this.exchange_coin_name;
                    this.ObjAppend(li_name, li_name_coin);
                    this.ObjAppend(detail_li, li_name);
                    var li_price = this.objCreate("div");
                    li_price.classList.add("pc_exchangeprice");
                    var li_price_name = this.objCreate("label");
                    li_price_name.textContent = BlackCat.Main.langMgr.get("pay_exchange_price");
                    this.ObjAppend(li_price, li_price_name);
                    var li_price_price = this.objCreate("p");
                    li_price_price.textContent = BlackCat.floatNum.addZero(BlackCat.floatNum.round(Number(list["curr"]), this.exchange_size), this.exchange_size);
                    this.ObjAppend(li_price, li_price_price);
                    this.ObjAppend(detail_li, li_price);
                    var li_range = this.objCreate("div");
                    li_range.classList.add("pc_exchangerange");
                    var li_range_name = this.objCreate("label");
                    li_range_name.textContent = BlackCat.Main.langMgr.get("pay_exchange_range");
                    this.ObjAppend(li_range, li_range_name);
                    var li_range_value = this.objCreate("p");
                    li_range_value.textContent = BlackCat.floatNum.addZero(BlackCat.floatNum.round(BlackCat.floatNum.times(Number(list["last24"]), 100), 2), 2).toString() + "%";
                    this.ObjAppend(li_range, li_range_value);
                    this.ObjAppend(detail_li, li_range);
                }
            });
        }
        setExchangeCoinTypeInfo(type) {
            this.exchange_coin_type = type;
            for (let i = 0; i < this.exchange_info.coin.length; i++) {
                if (Number(this.exchange_info.coin[i][0]) == type) {
                    this.exchange_coin_name = this.exchange_info.coin[i][1];
                    if (this.exchange_coin_name.toLowerCase() == "bct") {
                        this.exchange_size = 4;
                    }
                    else {
                        this.exchange_size = 8;
                    }
                    break;
                }
            }
        }
        getMarketLiImg(list) {
            if (this.exchange_info.hasOwnProperty("jys_icon")) {
                if (this.exchange_info["jys_icon"].hasOwnProperty(list.jys)) {
                    return this.exchange_info["jys_icon"][list.jys];
                }
            }
            return BlackCat.Main.resHost + "res/img/jys_" + list.jys + ".png";
        }
        getCurr(size = 8) {
            let count = 0;
            let curr = 0;
            for (let i = 0; i < this.exchange_info.info.length; i++) {
                let data = this.exchange_info.info[i];
                if (data.type == this.exchange_coin_type) {
                    count += 1;
                    curr += Number(data.curr);
                }
            }
            return count == 0 ? 0 : BlackCat.floatNum.round(curr / count, size);
        }
    }
    BlackCat.PayExchangeView = PayExchangeView;
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
            this.div.classList.add("pc_bj", "pc_listdetail");
            if (PayListDetailView.list && PayListDetailView.list.hasOwnProperty("wallet")) {
                var headerObj = this.objCreate("div");
                headerObj.classList.add("pc_header");
                var returnBtn = this.objCreate("a");
                returnBtn.classList.add("iconfont", "icon-bc-fanhui");
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
                        + '<div class="pc_payheighet iconfont icon-bc-diejia">' + BlackCat.Main.viewMgr.payView.getListBlockindex(PayListDetailView.list) + '</div>'
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
            switch (PayListDetailView.list.type) {
                case "9":
                case "10":
                    try {
                        var ext = JSON.parse(PayListDetailView.list.ext);
                        if (ext.hasOwnProperty("wallet")) {
                            return ext.wallet;
                        }
                    }
                    catch (e) {
                    }
                default:
                    return PayListDetailView.list.wallet;
            }
        }
        getParams() {
            var html = "";
            var params = PayListDetailView.list.params;
            if (params) {
                try {
                    params = JSON.parse(params);
                    if (params.hasOwnProperty("nnc") || params.hasOwnProperty("toaddr")) {
                        params = [params];
                    }
                    if (params instanceof Array) {
                        if (PayListDetailView.list.type == "6"
                            || PayListDetailView.list.type == "7"
                            || PayListDetailView.list.type == "8"
                            || PayListDetailView.list.type == "13") {
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("pay_transfer_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("pay_transfer_count") + '</label><p>' + params[k].count + '</p></div>'
                                    + '</li>';
                            }
                        }
                        else {
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("paylist_nnc") + '</label><p>' + params[k].nnc + '</p></div>'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbParamJson") + '</label><p>' + params[k].sbParamJson + '</p></div>'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbPushString") + '</label><p>' + params[k].sbPushString + BlackCat.Main.viewMgr.payView.getListParamsMethods_extInfo(PayListDetailView.list) + '</p></div>'
                                    + '</li>';
                            }
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[PayListDetailView]', 'getParams error => ', e.toString());
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
            this.div.classList.add("pc_bj", "pc_paylist");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
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
        toRefer() {
            if (PayListMoreView.refer) {
                BlackCat.Main.viewMgr.change(PayListMoreView.refer);
                PayListMoreView.refer = null;
            }
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
                var res = yield BlackCat.ApiTool.getWalletListss(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, this.page, this.num, BlackCat.Main.netMgr.type, 0);
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
                                for (var i in this.listsDiv.children) {
                                    if (this.listsDiv.children[i].className == "active") {
                                        this.listsDiv.children[i].classList.remove('active');
                                    }
                                }
                                listObj.classList.add("active");
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
            this.div.classList.add("pc_bj", "pc_maillist");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
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
            qr_download.classList.add("iconfont", "icon-bc-xiazai");
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
        constructor() {
            super(...arguments);
            this.Balances = {
                gas: "0",
                neo: "0",
                cgas: "0",
                cneo: "0",
                bcp: "0",
                bct: "0",
            };
        }
        reset() {
            for (let k in this.Balances) {
                this.Balances[k] = "0";
            }
            this.toaddress = "";
        }
        start() {
            for (let k in this.Balances) {
                this.Balances[k] = BlackCat.Main.getStringNumber(BlackCat.Main.viewMgr.payView[k]);
            }
            if (PayTransferView.transferType_default) {
                this.transferType = PayTransferView.transferType_default;
            }
            else {
                this.transferType = "GAS";
            }
            super.start();
            if (!this.toaddress) {
                this.inputTransferAddr.focus();
            }
            else {
                this.inputTransferCount.focus();
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
            var divtransferdiv = this.objCreate("div");
            divtransferdiv.classList.add("pc_transfertype");
            this.ObjAppend(divtransfer, divtransferdiv);
            var balancetype = this.objCreate("label");
            balancetype.innerHTML = BlackCat.Main.langMgr.get("pay_transferType");
            this.ObjAppend(divtransferdiv, balancetype);
            this.selectType = this.objCreate("select");
            this.selectType.classList.add("pc_transfertypes");
            this.ObjAppend(divtransferdiv, this.selectType);
            this.selectType.onchange = () => {
                this.transferType = this.selectType.value;
                var trans_type = this.transferType.toLowerCase();
                this.spanBalance.innerText = this.transferType + ": " + this.Balances[trans_type];
                this.inputTransferCount.value = "";
            };
            for (let k in this.Balances) {
                var option = this.objCreate("option");
                option.value = BlackCat.Main.langMgr.get(k);
                option.innerHTML = BlackCat.Main.langMgr.get(k);
                this.ObjAppend(this.selectType, option);
            }
            this.spanBalance = this.objCreate('span');
            this.spanBalance.classList.add('pc_gasbalancespan');
            var type_lowcase = this.transferType.toLowerCase();
            this.spanBalance.innerText = BlackCat.Main.langMgr.get(type_lowcase) + ": " + this.Balances[type_lowcase];
            this.ObjAppend(divtransferdiv, this.spanBalance);
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
                this.inputTransferAddr.style.width = "85%";
            };
            this.ObjAppend(this.divTransferAddr, this.inputTransferAddr);
            var aAddresbook = this.objCreate("a");
            aAddresbook.classList.add("pc_transferaddressbook", "iconfont", "icon-bc-tongxunlu");
            aAddresbook.onclick = () => {
                this.hidden();
                BlackCat.Main.viewMgr.payView.hidden();
                BlackCat.AddressbookView.select = "select";
                BlackCat.Main.viewMgr.change("AddressbookView");
            };
            this.ObjAppend(this.divTransferAddr, aAddresbook);
            var divTransferCount = this.objCreate("div");
            divTransferCount.classList.add("pc_transfertype");
            this.ObjAppend(divtransfer, divTransferCount);
            this.inputTransferCount = this.objCreate("input");
            this.inputTransferCount.placeholder = BlackCat.Main.langMgr.get("pay_transferCount");
            this.ObjAppend(divTransferCount, this.inputTransferCount);
            this.inputTransferCount.onkeyup = () => {
                this.doinputchange();
            };
            this.divHaveAmounts = this.objCreate("div");
            this.divHaveAmounts.classList.add("pc_haveamounts");
            this.ObjAppend(popupbox, this.divHaveAmounts);
            this.divHaveBalanceAmounts = this.objCreate("div");
            this.divHaveBalanceAmounts.textContent = "";
            this.ObjAppend(this.divHaveAmounts, this.divHaveBalanceAmounts);
            this.netFeeCom = new BlackCat.NetFeeComponent(popupbox, (net_fee) => {
                this.netFeeChange(net_fee);
            });
            this.netFeeCom.setFeeDefault();
            this.netFeeCom.createDiv();
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
        key_esc() {
        }
        getAddress() {
            if (PayTransferView.address) {
                this.toaddress = PayTransferView.address;
                PayTransferView.address = "";
            }
            return this.toaddress;
        }
        doinputchange() {
            if (this.transferType == "NEO") {
                var neo_int = parseInt(this.inputTransferCount.value);
                if (neo_int > 0) {
                    this.inputTransferCount.value = parseInt(this.inputTransferCount.value).toString();
                }
                else {
                    this.inputTransferCount.value = "";
                }
            }
            if (!BlackCat.Main.viewMgr.payView.checkTransCount(this.inputTransferCount.value)) {
                return;
            }
        }
        gatSelect() {
            this.divTransferAddr.classList.add("pc_transfer_active");
            this.labelName.textContent = PayTransferView.contact.address_name + ":";
            this.inputTransferAddr.value = PayTransferView.contact.address_wallet;
            var labelNameW = this.labelName.clientWidth + 10;
            var inputTransferAddrw = labelNameW + 35;
            this.inputTransferAddr.style.width = "calc( 100% - " + inputTransferAddrw + "px";
            this.inputTransferAddr.style.padding = "0 35px 0 " + labelNameW + "px";
            if (this.labelName) {
                this.inputTransferCount.focus();
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
                if (!BlackCat.Main.viewMgr.payView.checkTransCount(this.inputTransferCount.value)) {
                    BlackCat.Main.showErrMsg("pay_transferCountError", () => {
                        this.inputTransferCount.focus();
                    });
                    return;
                }
                var net_fee = this.net_fee;
                switch (this.transferType) {
                    case 'GAS':
                        if (Number(this.inputTransferCount.value) + Number(net_fee) > Number(this.Balances.gas)) {
                            BlackCat.Main.showErrMsg("pay_transferGasNotEnough", () => {
                                this.inputTransferCount.focus();
                            });
                            return;
                        }
                        break;
                    case "NEO":
                    case "BCP":
                    case 'BCT':
                    case "CNEO":
                    case "CGAS":
                        if (Number(net_fee) > Number(this.Balances.gas)) {
                            BlackCat.Main.showErrMsg("pay_transferGasNotEnough", () => {
                                this.inputTransferCount.focus();
                            });
                            return;
                        }
                        if (Number(this.inputTransferCount.value) > Number(this.Balances[this.transferType.toLowerCase()])) {
                            BlackCat.Main.showErrMsg("pay_transfer" + this.transferType + "NotEnough", () => {
                                this.inputTransferCount.focus();
                            });
                            return;
                        }
                        break;
                }
                BlackCat.Main.viewMgr.change("ViewLoading");
                var api_type = "6";
                try {
                    switch (this.transferType) {
                        case 'GAS':
                        case "NEO":
                            var res = yield BlackCat.tools.CoinTool.rawTransaction(this.toaddress, BlackCat.tools.CoinTool["id_" + this.transferType], this.inputTransferCount.value, Neo.Fixed8.fromNumber(Number(net_fee)));
                            break;
                        case 'CGAS':
                        case "CNEO":
                        case 'BCP':
                        case "BCT":
                            var res = yield BlackCat.tools.CoinTool.nep5Transaction(BlackCat.Main.user.info.wallet, this.toaddress, BlackCat.tools.CoinTool["id_" + this.transferType], this.inputTransferCount.value, net_fee);
                            break;
                    }
                }
                catch (e) {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = e.toString();
                    console.log("[BlaCat]", '[PayTransferView]', 'doTransfer, tools.CoinTool.rawTransaction error => ', e.toString());
                }
                BlackCat.Main.viewMgr.viewLoading.remove();
                if (res) {
                    console.log("[BlaCat]", '[PayTransferView]', '转账结果 => ', res);
                    if (res.err == false) {
                        yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, res.info, "0", this.inputTransferCount.value, "6", '{"sbPushString":"transfer", "toaddr":"' + this.toaddress + '", "count": "' + this.inputTransferCount.value + '", "nnc": "' + BlackCat.tools.CoinTool["id_" + this.transferType] + '"}', BlackCat.Main.netMgr.type, "0", net_fee, PayTransferView.log_type_detail[this.transferType.toLowerCase()]);
                        BlackCat.Main.showInfo(("pay_transferDoSucc"));
                        this.remove();
                        if (PayTransferView.callback)
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
        netFeeChange(net_fee) {
            this.net_fee = net_fee;
            var v = this.inputTransferCount.value;
            if (v.length == 0 || v.replace(/(^s*)|(s*$)/g, "").length == 0) {
                return;
            }
        }
        updateBalance() {
            for (let k in this.Balances) {
                this.Balances[k] = BlackCat.Main.getStringNumber(BlackCat.Main.viewMgr.payView[k]);
            }
            let type_lowcase = this.transferType.toLowerCase();
            this.spanBalance.innerText = BlackCat.Main.langMgr.get(type_lowcase) + ": " + this.Balances[type_lowcase];
        }
    }
    PayTransferView.log_type_detail = {
        gas: "1",
        neo: "2",
        cgas: "3",
        cneo: "4",
        bcp: "5",
        bct: "6",
        btc: "7",
        eth: "8",
    };
    PayTransferView.address = "";
    BlackCat.PayTransferView = PayTransferView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayView extends BlackCat.ViewBase {
        reset() {
            PayView.tokens_coin.forEach((coins) => {
                coins.forEach((coin) => {
                    this[coin] = 0;
                });
            });
            for (let token in PayView.tokens_old) {
                PayView.tokens_old[token].forEach((coin) => {
                    if (BlackCat.tools.CoinTool["id_" + coin.toUpperCase() + "_OLD"].length > 0) {
                        BlackCat.tools.CoinTool["id_" + coin.toUpperCase() + "_OLD"].forEach((old) => {
                            this[coin + "_old" + old] = 0;
                            this["span" + coin.toUpperCase() + "_OLD" + old] = null;
                        });
                    }
                });
            }
            this.height_clis = 0;
            this.height_nodes = 0;
            this.listPageNum = 10;
            this.walletListsHash = null;
            this.getWalletListsTimeout = 20000;
            this.getWalletListsTimeout_min = 10000;
            this.WalletListsNeedConfirm = false;
            this.game_assets_update = 1000 * 5;
            this.allnep5_balance = {};
            this.game_assets_ts = null;
            this.clearTimeout();
        }
        start() {
            super.start();
            BlackCat.Main.loginCallback();
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_pay");
            var headerTitle = this.objCreate("div");
            headerTitle.classList.add("pc_header");
            this.ObjAppend(this.div, headerTitle);
            var myinfo_a = this.objCreate("a");
            myinfo_a.classList.add("iconfont", "icon-bc-touxiang");
            myinfo_a.onclick = () => {
                this.hidden();
                BlackCat.PersonalCenterView.refer = "PayView";
                BlackCat.Main.viewMgr.change("PersonalCenterView");
            };
            this.ObjAppend(headerTitle, myinfo_a);
            this.divHeight_nodes = this.objCreate("div");
            this.divHeight_nodes.classList.add("pc_payheighet", "iconfont", "icon-bc-blalian", "network");
            this.divHeight_nodes.style.top = "5px";
            this.divHeight_nodes.textContent = "n/a";
            this.divHeight_nodes.onclick = () => {
                this.hidden();
                BlackCat.ModifyNetworkLineView.refer = "PayView";
                BlackCat.ModifyNetworkLineView.defaultType = "nodes";
                BlackCat.Main.viewMgr.change("ModifyNetworkLineView");
            };
            this.ObjAppend(headerTitle, this.divHeight_nodes);
            this.divHeight_clis = this.objCreate("div");
            this.divHeight_clis.classList.add("pc_payheighet", "iconfont", "icon-bc-neolian", "network");
            this.divHeight_clis.textContent = "n/a";
            this.divHeight_clis.onclick = () => {
                if (BlackCat.tools.WWW.api_clis && BlackCat.tools.WWW.api_clis != "") {
                    this.hidden();
                    BlackCat.ModifyNetworkLineView.refer = "PayView";
                    BlackCat.ModifyNetworkLineView.defaultType = "clis";
                    BlackCat.Main.viewMgr.change("ModifyNetworkLineView");
                }
            };
            this.ObjAppend(headerTitle, this.divHeight_clis);
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
            aReturnGame.classList.add("pc_returngame", "iconfont", "icon-bc-fanhui1");
            aReturnGame.onclick = () => {
                BlackCat.SDK.showIcon();
            };
            if (!window.hasOwnProperty("BC_androidSDK")) {
                this.ObjAppend(headerTitle, aReturnGame);
            }
            var btnbox = this.objCreate("div");
            this.ObjAppend(this.div, btnbox);
            btnbox.classList.add("pc_btnbox");
            this.wallet_btn = this.objCreate("button");
            this.wallet_btn.textContent = BlackCat.Main.langMgr.get("pay_walletbtn");
            this.wallet_btn.classList.add("pc_active");
            this.ObjAppend(btnbox, this.wallet_btn);
            this.wallet_btn.onclick = () => {
                this.game_assets_element.style.display = "none";
                paycard.style.display = "block";
                divCurrency.style.display = "block";
                this.divLists.style.display = "block";
                this.assets_btn.classList.remove("pc_active");
                this.wallet_btn.classList.add("pc_active");
            };
            this.assets_btn = this.objCreate("button");
            this.assets_btn.textContent = BlackCat.Main.langMgr.get("pay_assets");
            this.ObjAppend(btnbox, this.assets_btn);
            this.assets_btn.onclick = () => {
                this.game_assets_element.style.display = "block";
                paycard.style.display = "none";
                divCurrency.style.display = "none";
                this.divLists.style.display = "none";
                this.assets_btn.classList.add("pc_active");
                this.wallet_btn.classList.remove("pc_active");
                this.my_asset();
            };
            var paycard = this.objCreate("div");
            paycard.classList.add("pc_card");
            this.ObjAppend(this.div, paycard);
            var aWalletDetail = this.objCreate("a");
            aWalletDetail.classList.add("pc_mydetail", "iconfont", "icon-bc-xiangqing");
            aWalletDetail.onclick = () => {
                this.wallet_detail();
            };
            this.ObjAppend(paycard, aWalletDetail);
            var payAddressbook = this.objCreate("a");
            payAddressbook.classList.add("pc_mydetail", "iconfont", "icon-bc-tongxunlu");
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
            payRefresh.onclick = () => __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                yield this.doGetBalances();
                yield this.doGetWalletLists(1);
                BlackCat.Main.viewMgr.viewLoading.remove();
            });
            this.ObjAppend(paycard, payRefresh);
            var iRefresh = this.objCreate("i");
            iRefresh.classList.add("iconfont", "icon-bc-shuaxin");
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
            makeTransferObj.textContent = BlackCat.Main.langMgr.get("pay_send");
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
            for (let i = 0; i < PayView.tokens.length; i++) {
                let token = PayView.tokens[i];
                this["token_" + token] = this.objCreate("div");
                this["token_" + token].innerText = BlackCat.Main.langMgr.get("pay_coin_" + token);
                this["token_" + token].onclick = () => {
                    this.changeToken(token);
                };
                this.ObjAppend(divCurrencyNumber, this["token_" + token]);
                this["token_list_" + token] = this.objCreate("div");
                this["token_list_" + token].classList.add("pc_currencylist");
                this["token_list_" + token].style.display = "none";
                this.ObjAppend(divCurrency, this["token_list_" + token]);
                for (let k = 0; k < PayView.tokens_coin[i].length; k++) {
                    let coin = PayView.tokens_coin[i][k];
                    let coinElement = this.objCreate("div");
                    coinElement.classList.add("coinli");
                    coinElement.innerHTML = BlackCat.Main.langMgr.get(coin);
                    this.ObjAppend(this["token_list_" + token], coinElement);
                    let logoElement = this.objCreate("img");
                    logoElement.src = BlackCat.Main.resHost + "res/img/" + coin + ".png";
                    logoElement.classList.add("coinlogo");
                    this.ObjAppend(coinElement, logoElement);
                    let labelElement = this.objCreate("label");
                    labelElement.classList.add("iconfont", "icon-bc-help");
                    this.ObjAppend(coinElement, labelElement);
                    let descText = BlackCat.Main.langMgr.get("pay_" + coin + "_desc");
                    if (descText != "") {
                        let descElement = this.objCreate("div");
                        descElement.classList.add("pc_coincon");
                        descElement.textContent = BlackCat.Main.langMgr.get("pay_" + coin + "_desc");
                        this.ObjAppend(labelElement, descElement);
                    }
                    else {
                        labelElement.style.display = "none";
                    }
                    let moreElement = this.objCreate("i");
                    moreElement.classList.add("iconfont", "icon-bc-gengduo");
                    this.ObjAppend(coinElement, moreElement);
                    this["span" + coin.toUpperCase()] = this.objCreate("span");
                    this["span" + coin.toUpperCase()].textContent = "0";
                    this.ObjAppend(coinElement, this["span" + coin.toUpperCase()]);
                    coinElement.onclick = () => {
                        this["doExchange" + coin.toUpperCase()]();
                    };
                }
            }
            this["token_" + PayView.tokens[0]].classList.add("active");
            this["token_list_" + PayView.tokens[0]].style.display = "";
            for (let token in PayView.tokens_old) {
                PayView.tokens_old[token].forEach((coin) => {
                    let coin_upcase = coin.toUpperCase() + "_OLD";
                    if (BlackCat.tools.CoinTool["id_" + coin_upcase].length > 0) {
                        BlackCat.tools.CoinTool["id_" + coin_upcase].forEach((old) => {
                            let coinElement = this.objCreate("div");
                            coinElement.innerHTML = BlackCat.Main.langMgr.get("pay_" + coin);
                            this.ObjAppend(this["token_list_" + token], coinElement);
                            let logoElement = this.objCreate("img");
                            logoElement.src = BlackCat.Main.resHost + "res/img/old" + coin + ".png";
                            logoElement.classList.add("coinlogo");
                            this.ObjAppend(coinElement, logoElement);
                            let labelElement = this.objCreate("label");
                            labelElement.classList.add("iconfont", "icon-bc-help");
                            this.ObjAppend(coinElement, labelElement);
                            let descElement = this.objCreate("div");
                            descElement.classList.add("pc_coincon");
                            descElement.textContent = old;
                            this.ObjAppend(labelElement, descElement);
                            let moreElement = this.objCreate("i");
                            moreElement.classList.add("iconfont", "icon-bc-gengduo");
                            this.ObjAppend(coinElement, moreElement);
                            this["span" + coin_upcase + old] = this.objCreate("span");
                            this["span" + coin_upcase + old].textContent = "0";
                            this.ObjAppend(coinElement, this["span" + coin_upcase + old]);
                            coinElement.onclick = () => {
                                this.doMakeRefundOld(old, coin_upcase);
                            };
                        });
                    }
                });
            }
            this.game_assets_element = this.objCreate("div");
            this.ObjAppend(this["token_list_" + PayView.tokens[0]], this.game_assets_element);
            this.divLists = this.objCreate("ul");
            this.divLists.classList.add("pc_paylists");
            this.ObjAppend(this.div, this.divLists);
            var liRecord = this.objCreate("li");
            liRecord.classList.add("pc_payrecord");
            this.ObjAppend(this.divLists, liRecord);
            var spanRecord = this.objCreate("div");
            spanRecord.innerText = BlackCat.Main.langMgr.get("pay_recentLists");
            this.ObjAppend(liRecord, spanRecord);
            this.divListsMore = this.objCreate("button");
            this.divListsMore.classList.add("pc_paymore");
            this.divListsMore.textContent = BlackCat.Main.langMgr.get("pay_more");
            this.divListsMore.onclick = () => {
                this.hidden();
                BlackCat.PayListMoreView.refer = "PayView";
                BlackCat.Main.viewMgr.change("PayListMoreView");
            };
            this.ObjAppend(liRecord, this.divListsMore);
            var iListsMore = this.objCreate("i");
            iListsMore.classList.add("iconfont", "icon-bc-sanjiaoxing");
            this.ObjAppend(this.divListsMore, iListsMore);
            this.pendingListsElement = this.objCreate("div");
            this.ObjAppend(this.divLists, this.pendingListsElement);
            this.doGetBalances();
            this.doGetWalletLists(1);
            this.getHeight("nodes");
            if (BlackCat.tools.WWW.api_clis && BlackCat.tools.WWW.api_clis != "") {
                this.getHeight("clis");
            }
        }
        update() {
            var isHidden = this.isHidden();
            this.reset();
            super.update();
            if (isHidden)
                this.hidden();
        }
        key_esc() {
        }
        clearTimeout() {
            if (this.s_doGetWalletLists)
                clearTimeout(this.s_doGetWalletLists);
        }
        doGetBalances() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.tools.CoinTool.initAllAsset();
                var balances = (yield BlackCat.tools.WWW.api_getBalance(BlackCat.Main.user.info.wallet));
                if (balances) {
                    balances.map(item => (item.names = BlackCat.tools.CoinTool.assetID2name[item.asset]));
                    yield balances.forEach(balance => {
                        if (balance.asset == BlackCat.tools.CoinTool.id_GAS) {
                            this.gas = balance.balance;
                            this["spanGAS"].textContent = BlackCat.Main.getStringNumber(this.gas);
                        }
                        else if (balance.asset == BlackCat.tools.CoinTool.id_NEO) {
                            this.neo = balance.balance;
                            this["spanNEO"].textContent = BlackCat.Main.getStringNumber(this.neo);
                        }
                    });
                }
                else {
                    this.gas = 0;
                    this.neo = 0;
                    this["spanGAS"].textContent = "0";
                    this["spanNEO"].textContent = "0";
                }
                PayView.tokens_coin.forEach(token => {
                    token.forEach(coin => {
                        if (coin != "gas" && coin != "neo") {
                            this.getNep5Balance(coin.toUpperCase());
                        }
                    });
                });
                for (let k in PayView.tokens_old) {
                    PayView.tokens_old[k].forEach(coin => {
                        this.getNep5BalanceOld(coin.toUpperCase() + "_OLD");
                    });
                }
                yield this.my_asset();
            });
        }
        getNep5BalanceOld(coin) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let coin_lowcase = coin.toLowerCase();
                    yield BlackCat.tools.CoinTool["id_" + coin].forEach((old) => __awaiter(this, void 0, void 0, function* () {
                        this[coin_lowcase + old] = yield BlackCat.Main["get" + coin + "BalanceByAddress"](old, BlackCat.Main.user.info.wallet);
                        this["span" + coin + old].textContent = BlackCat.Main.getStringNumber(this[coin_lowcase + old]);
                    }));
                }
                catch (e) { }
            });
        }
        getNep5Balance(coin) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let coin_lowcase = coin.toLowerCase();
                    this[coin_lowcase] = yield BlackCat.Main["get" + coin + "BalanceByAddress"](BlackCat.tools.CoinTool["id_" + coin], BlackCat.Main.user.info.wallet);
                    this["span" + coin].textContent = BlackCat.Main.getStringNumber(this[coin_lowcase]);
                    BlackCat.Main.viewMgr.updateBalance();
                }
                catch (e) { }
            });
        }
        doMakeRefundOld(id_old, type = "CGAS_OLD") {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    let id_OLD = id_old;
                    let balance = yield BlackCat.Main["get" + type + "BalanceByAddress"](id_OLD, BlackCat.Main.user.info.wallet);
                    let id_balance = balance.toString();
                    BlackCat.ViewTransferCount.transType = "refund";
                    BlackCat.ViewTransferCount.transNncOld = id_OLD;
                    if (type == "CGAS_OLD") {
                        BlackCat.ViewTransferCount.coinType = "CGAS";
                    }
                    else if (type == "CNEO_OLD") {
                        BlackCat.ViewTransferCount.coinType = "CNEO";
                    }
                    BlackCat.ViewTransferCount.refer = "PayView";
                    BlackCat.ViewTransferCount.callback = () => {
                        this.makeRefundTransaction(id_old, type);
                    };
                    BlackCat.Main.viewMgr.change("ViewTransferCount");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doMakeRefundOld(id_old, type);
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        doExchangeGAS() {
            return __awaiter(this, void 0, void 0, function* () {
                this.doExchangeToken("CGAS");
            });
        }
        doExchangeCNEO() {
            return __awaiter(this, void 0, void 0, function* () {
                this.doExchangeToken("CNEO");
            });
        }
        doExchangeBCT() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.PayExchangeBCTView.refer = "PayView";
                    this.hidden();
                    BlackCat.Main.viewMgr.change("PayExchangeBCTView");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doExchangeBCT();
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        doExchangeBCP() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.PayExchangeView.refer = "PayView";
                    this.hidden();
                    BlackCat.PayExchangeView.type_src = "bcp";
                    BlackCat.Main.viewMgr.change("PayExchangeView");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doExchangeBCP();
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        doExchangeCGAS() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.PayExchangeView.refer = "PayView";
                    this.hidden();
                    BlackCat.PayExchangeView.type_src = "cgas";
                    BlackCat.Main.viewMgr.change("PayExchangeView");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doExchangeCGAS();
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        doExchangeToken(coinType = "CGAS") {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.ViewTransferCount.coinType = coinType;
                    BlackCat.ViewTransferCount.transType = "";
                    BlackCat.ViewTransferCount.transNncOld = "";
                    BlackCat.ViewTransferCount.refer = "PayView";
                    BlackCat.ViewTransferCount.callback = () => {
                        switch (BlackCat.ViewTransferCount.transType) {
                            case "mint":
                                this.makeMintTokenTransaction(coinType);
                                break;
                            case "refund":
                                this.makeRefundTransaction(BlackCat.tools.CoinTool["id_" + coinType], coinType);
                                break;
                        }
                    };
                    BlackCat.Main.viewMgr.change("ViewTransferCount");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doExchangeToken(coinType);
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        doExchangeNEO() {
            return __awaiter(this, void 0, void 0, function* () {
                this.hidden();
                var res = {};
                res['data'] = {
                    address: BlackCat.Main.user.info.wallet
                };
                BlackCat.PayExchangeShowWalletView.refer = "PayView";
                BlackCat.PayExchangeShowWalletView.balance = BlackCat.Main.viewMgr.payView.neo;
                BlackCat.PayExchangeShowWalletView.callback_params = {
                    type_src: "NEO",
                    data: res.data,
                };
                BlackCat.Main.viewMgr.change("PayExchangeShowWalletView");
            });
        }
        doExchangeBTC() {
            return __awaiter(this, void 0, void 0, function* () {
                this._doExchangeOther("btc");
            });
        }
        doExchangeETH() {
            return __awaiter(this, void 0, void 0, function* () {
                this._doExchangeOther("eth");
            });
        }
        getWalletAddrOther(type) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.wallet_addr_other) {
                    this.wallet_addr_other = {};
                }
                if (!this.wallet_addr_other.hasOwnProperty[type]) {
                    BlackCat.Main.viewMgr.change("ViewLoading");
                    try {
                        var res = yield BlackCat.ApiTool.getOtherAddress(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, type, BlackCat.Main.netMgr.type);
                    }
                    catch (e) {
                    }
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    if (!res || !res.r) {
                        BlackCat.Main.showErrMsg("pay_exchange_create_wallet_fail");
                        return null;
                    }
                    this.wallet_addr_other[type] = res.data.address;
                }
                return this.wallet_addr_other[type];
            });
        }
        _doExchangeOther(type) {
            return __awaiter(this, void 0, void 0, function* () {
                var address = yield this.getWalletAddrOther(type);
                if (address) {
                    this.hidden();
                    BlackCat.PayExchangeShowWalletView.refer = "PayView";
                    BlackCat.PayExchangeShowWalletView.balance = this[type];
                    BlackCat.PayExchangeShowWalletView.callback_params = {
                        type_src: type.toUpperCase(),
                        data: {
                            address: address
                        }
                    };
                    BlackCat.Main.viewMgr.change("PayExchangeShowWalletView");
                }
            });
        }
        divLists_recreate() {
            this.pendingListsElement.innerHTML = "";
        }
        doGetWalletLists(force = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 获取交易记录，force => ', force);
                if (!BlackCat.Main.user.info.token) {
                    console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 已退出登录，本次请求取消');
                    return;
                }
                if (force == 0 && this.WalletListsNeedConfirm) {
                    console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 有定时刷新，本次请求取消');
                    return;
                }
                if (this.s_doGetWalletLists) {
                    clearTimeout(this.s_doGetWalletLists);
                    this.s_doGetWalletLists = null;
                }
                var res = yield BlackCat.ApiTool.getWalletListss(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, 1, this.listPageNum, BlackCat.Main.netMgr.type, 1);
                if (res.r) {
                    this.divLists_recreate();
                    BlackCat.Main.viewMgr.iconView.flushProcess(res.data.length);
                    if (res.data && res.data.length > 0) {
                        var next_timeout = this.getWalletListsTimeout;
                        var curr_ts = Math.round((new Date()).getTime() / 1000);
                        yield res.data.forEach(list => {
                            let last_ts = (curr_ts - list.ctm) * 1000 - BlackCat.Main.tsOffset;
                            if (last_ts >= this.getWalletListsTimeout && last_ts < this.getWalletListsTimeout * 3) {
                                next_timeout = this.getWalletListsTimeout_min;
                            }
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
                            this.ObjAppend(this.pendingListsElement, listObj);
                        });
                        console.log('[BlaCat]', '[PayView]', 'doGetWalletLists, ', next_timeout / 1000, "(s)后再次获取");
                        this.s_doGetWalletLists = setTimeout(() => { this.doGetWalletLists(1); }, next_timeout);
                        this.WalletListsNeedConfirm = true;
                    }
                    let walletListsHash_tmp = JSON.stringify(res.data);
                    if (this.walletListsHash != null && walletListsHash_tmp != this.walletListsHash) {
                        console.log('[BlaCat]', '[PayView]', 'doGetWalletLists, 更新余额');
                        this.doGetBalances();
                    }
                    this.walletListsHash = walletListsHash_tmp;
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        getCoinIcon(v, coin_type) {
            try {
                var params = JSON.parse(v.params);
                if (params.hasOwnProperty("nnc")) {
                    params = [params];
                }
                if (params instanceof Array) {
                    for (let k in params) {
                        if (params[k].hasOwnProperty('nnc')) {
                            if (params[k].nnc == BlackCat.tools.CoinTool["id_" + coin_type.toUpperCase()]) {
                                return BlackCat.Main.resHost + "res/img/" + coin_type.toLowerCase() + ".png";
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', 'getListImg, v.type=' + v.type + ', error => ', e);
            }
            return BlackCat.Main.resHost + "res/img/old" + coin_type.toLowerCase() + ".png";
        }
        getListImg(v) {
            if (v.state == "0" && v.type == "5") {
                return BlackCat.Main.resHost + "res/img/transconfirm.png";
            }
            switch (v.type) {
                case "1":
                case "2":
                case "3":
                case "4":
                    if (v.type_detail == "0") {
                        return this.getCoinIcon(v, 'cgas');
                    }
                    for (let k in BlackCat.PayTransferView.log_type_detail) {
                        if (BlackCat.PayTransferView.log_type_detail[k] == v.type_detail) {
                            return this.getCoinIcon(v, k);
                        }
                    }
                    break;
                case "5":
                    var nep5Type = ['gas', 'cgas', 'neo', 'cneo', 'bcp', 'bct'];
                    try {
                        var params = JSON.parse(v.params);
                        if (params.hasOwnProperty("nnc")) {
                            params = [params];
                        }
                        if (params instanceof Array) {
                            for (let k in params) {
                                if (params[k].hasOwnProperty('nnc')) {
                                    for (let i = 0; i < nep5Type.length; i++) {
                                        if (params[k].nnc == BlackCat.tools.CoinTool["id_" + nep5Type[i].toUpperCase()]) {
                                            return BlackCat.Main.resHost + "res/img/" + nep5Type[i] + ".png";
                                        }
                                    }
                                    for (let m = 0; m < BlackCat.tools.CoinTool.id_CGAS_OLD.length; m++) {
                                        if (params[k].nnc == BlackCat.tools.CoinTool.id_CGAS_OLD[m]) {
                                            return BlackCat.Main.resHost + "res/img/oldcgas.png";
                                        }
                                    }
                                    for (let m = 0; m < BlackCat.tools.CoinTool.id_CNEO_OLD.length; m++) {
                                        if (params[k].nnc == BlackCat.tools.CoinTool.id_CNEO_OLD[m]) {
                                            return BlackCat.Main.resHost + "res/img/oldcneo.png";
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[PayView]', 'getListImg, v.type=5, error => ', e);
                    }
                    return this.getListGameIcon(v);
                case "6":
                    if (v.type_detail == "0") {
                        return BlackCat.Main.resHost + "res/img/gas.png";
                    }
                case "13":
                case "16":
                    for (let k in BlackCat.PayTransferView.log_type_detail) {
                        if (BlackCat.PayTransferView.log_type_detail[k] == v.type_detail) {
                            return this.getCoinIcon(v, k);
                        }
                    }
                    break;
                case "9":
                    switch (v.type_detail) {
                        case "1":
                            return BlackCat.Main.resHost + "res/img/btc.png";
                        case "2":
                            return BlackCat.Main.resHost + "res/img/eth.png";
                    }
                    break;
                case "10":
                case "12":
                    var res = this.parseTypeDetailType10(v.type_detail);
                    switch (res.type_src) {
                        case "1":
                            return BlackCat.Main.resHost + "res/img/btc.png";
                        case "2":
                            return BlackCat.Main.resHost + "res/img/eth.png";
                        case "4":
                            return BlackCat.Main.resHost + "res/img/bct.png";
                        case "5":
                            return BlackCat.Main.resHost + "res/img/cneo.png";
                    }
                    break;
                case "11":
                    var res = this.parseTypeDetailType10(v.type_detail);
                    switch (res.type) {
                        case "1":
                            return BlackCat.Main.resHost + "res/img/cgas.png";
                        case "2":
                            return BlackCat.Main.resHost + "res/img/bcp.png";
                    }
                    break;
                case "14":
                    try {
                        var paramJson_tmp = JSON.parse(v.params);
                        if (paramJson_tmp['type'] == "1") {
                            return BlackCat.Main.resHost + "res/img/bcp.png";
                        }
                        else if (paramJson_tmp['type'] == "2") {
                            if (v.hasOwnProperty('asset_icon')) {
                                return v['asset_icon'];
                            }
                        }
                    }
                    catch (e) {
                    }
                    break;
                case "15":
                    try {
                        var paramJson_tmp = JSON.parse(v.params);
                        if (paramJson_tmp['sbPushString'] == "sale") {
                            return BlackCat.Main.resHost + "res/img/bcp.png";
                        }
                        else if (paramJson_tmp['sbPushString'] == "purchase") {
                            if (v.hasOwnProperty('asset_icon')) {
                                return v['asset_icon'];
                            }
                        }
                    }
                    catch (e) {
                    }
                    break;
            }
            return BlackCat.Main.resHost + "res/img/game0.png";
        }
        getListGameIcon(v) {
            try {
                var iconObj = JSON.parse(v.icon);
                if (iconObj.hasOwnProperty(BlackCat.Main.langMgr.type)) {
                    return iconObj[BlackCat.Main.langMgr.type];
                }
                else if (iconObj.hasOwnProperty(BlackCat.Main.applang)) {
                    return iconObj[BlackCat.Main.applang];
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', 'getListGameIcon, v', v, 'error => ', e.toString());
            }
            return v.icon;
        }
        getAppName(v) {
            var name = v.name;
            try {
                var nameObj = JSON.parse(name);
                if (nameObj.hasOwnProperty(BlackCat.Main.langMgr.type)) {
                    return nameObj[BlackCat.Main.langMgr.type];
                }
                else if (nameObj.hasOwnProperty(v.lang)) {
                    return nameObj[v.lang];
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', 'getName, name =>', name, 'error => ', e.toString());
            }
            return name;
        }
        getListName(v) {
            if (v.g_id == "0") {
                return BlackCat.Main.platName;
            }
            return this.getAppName(v);
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
        getListParamsMethods_extInfo(v) {
            switch (v.type) {
                case "5":
                    try {
                        var paramJson_tmp = JSON.parse(v.params);
                        if (paramJson_tmp.hasOwnProperty('action') && BlackCat.Main.in_array(paramJson_tmp.action, ["buy", "upgrade"])) {
                            if (paramJson_tmp.action == "buy") {
                                if (paramJson_tmp.hasOwnProperty('inviter') && paramJson_tmp.inviter && paramJson_tmp.inviter != v.wallet) {
                                    return ": buyPartner";
                                }
                            }
                            else if (paramJson_tmp.action == "upgrade") {
                                if (paramJson_tmp.hasOwnProperty('lv') && paramJson_tmp.lv && BlackCat.Main.in_array(paramJson_tmp.lv, ["2", "3", "4"])) {
                                    return ": upgradePartner";
                                }
                            }
                        }
                    }
                    catch (e) { }
                    break;
                case "14":
                    try {
                        var paramJson_tmp = JSON.parse(v.params);
                        if (paramJson_tmp['type'] == "1") {
                            return ": purchase";
                        }
                        else if (paramJson_tmp['type'] == "2") {
                            return ": sale";
                        }
                    }
                    catch (e) { }
                    break;
                case "16":
                    try {
                        var params = JSON.parse(v.params);
                        var month = params['month'];
                        return ": buyVip_" + month;
                    }
                    catch (e) { }
                    break;
                case "17":
                    switch (v.type_detail) {
                        case "1":
                            return ": buyPartner";
                        case "2":
                            return ": upgradePartner";
                        case "3":
                            return ": exchangePartner";
                    }
                    break;
            }
            return "";
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
                            method.push(params[k].sbPushString + this.getListParamsMethods_extInfo(v));
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
                console.log("[BlaCat]", '[PayView]', 'getListParamMethods, v', v, 'error => ', e.toString());
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
            if (v.type == "1"
                || (v.type == "5" && v.type_detail == "2")
                || v.type == "9"
                || v.type == "11"
                || v.type == "12"
                || v.type == "13"
                || v.type == "15") {
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
            switch (v.type) {
                case "2":
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
                    break;
                case "9":
                    if (v.state == "0") {
                        try {
                            var ext = JSON.parse(v.ext);
                            if (ext.hasOwnProperty("process")) {
                                pct = ext.process + "%";
                            }
                        }
                        catch (e) {
                        }
                    }
                    break;
            }
            switch (state) {
                case '0':
                    var state_button0 = this.objCreate("div");
                    state_button0.classList.add("pc_verification");
                    if (i == 1) {
                        state_button0.classList.add("iconfont", "icon-bc-dengdai");
                        state_button0.innerHTML = "<label>" + pct + "</label>";
                    }
                    else {
                        var obja = this.objCreate("a");
                        obja.classList.add("iconfont", "icon-bc-jinhangzhong");
                        obja.innerHTML = '<label>' + pct + '</label>';
                        obja.onclick = () => {
                            BlackCat.Main.continueWithOpenWallet();
                            event.stopPropagation();
                        };
                        this.ObjAppend(state_button0, obja);
                    }
                    return state_button0;
                case '1':
                    var state_a1 = this.objCreate("a");
                    state_a1.classList.add("iconfont", "icon-bc-gou");
                    return state_a1;
                case '2':
                    var state_a2 = this.objCreate("a");
                    state_a2.classList.add("iconfont", "icon-bc-chacha");
                    return state_a2;
            }
        }
        getListBlockindex(v) {
            if (v.hasOwnProperty('blockindex')) {
                return v["blockindex"];
            }
            return 0;
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
        makeMintTokenTransaction(coinType = "CGAS") {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                var mintCount = BlackCat.Main.viewMgr.viewTransferCount.inputCount.value;
                var net_fee = BlackCat.Main.viewMgr.viewTransferCount.net_fee;
                console.log("[BlaCat]", '[PayView]', '充值' + coinType + '，数量 => ', mintCount, '手续费netfee =>', net_fee);
                var login = BlackCat.tools.LoginInfo.getCurrentLogin();
                try {
                    var utxos_assets = yield BlackCat.tools.CoinTool.getassets();
                    console.log("[BlaCat]", '[PayView]', 'utxos_assets => ', utxos_assets);
                    if (coinType == "CGAS") {
                        var scriptaddress = BlackCat.tools.CoinTool.id_CGAS.hexToBytes().reverse();
                        var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                        var makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, nepAddress, BlackCat.tools.CoinTool.id_GAS, Neo.Fixed8.fromNumber(Number(mintCount)), Neo.Fixed8.fromNumber(Number(net_fee)), 0, true);
                    }
                    else {
                        var scriptaddress = BlackCat.tools.CoinTool.id_CNEO.hexToBytes().reverse();
                        var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                        var makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, nepAddress, BlackCat.tools.CoinTool.id_NEO, Neo.Fixed8.fromNumber(Number(mintCount)), Neo.Fixed8.Zero, 0, false);
                        if (Number(net_fee) > 0) {
                            try {
                                var user_makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, BlackCat.Main.user.info.wallet, BlackCat.tools.CoinTool.id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)));
                                var user_tran = user_makeTranRes.info.tran;
                                for (let i = 0; i < user_tran.inputs.length; i++) {
                                    makeTranRes.info.tran.inputs.push(user_tran.inputs[i]);
                                }
                                for (let i = 0; i < user_tran.outputs.length; i++) {
                                    makeTranRes.info.tran.outputs.push(user_tran.outputs[i]);
                                }
                                var user_oldarr = user_makeTranRes.info.oldarr;
                                for (let i = 0; i < user_oldarr.length; i++) {
                                    makeTranRes.info.oldarr.push(user_oldarr[i]);
                                }
                                console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_makeTranRes => ', user_makeTranRes);
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
                        }
                    }
                }
                catch (e) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    let errmsg = BlackCat.Main.langMgr.get(e.message);
                    if (errmsg) {
                        BlackCat.Main.showErrMsg((e.message));
                    }
                    else {
                        if (coinType == "CGAS") {
                            BlackCat.Main.showErrMsg("pay_makeMintGasNotEnough");
                        }
                        else {
                            BlackCat.Main.showErrMsg("pay_makeMintNeoNotEnough");
                        }
                    }
                    return;
                }
                var inputs_counts = makeTranRes.info.tran.hasOwnProperty("inputs") ? makeTranRes.info.tran.inputs.length : 0;
                var outputs_counts = makeTranRes.info.tran.hasOwnProperty("outputs") ? makeTranRes.info.tran.outputs.length : 0;
                var utxo_counts = inputs_counts + outputs_counts;
                if (utxo_counts >= 50) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    if (coinType == "CGAS") {
                        BlackCat.Main.showErrMsg("pay_makeMintGasUtxoCountsLimit", () => {
                            BlackCat.PayTransferView.transferType_default = "GAS";
                            BlackCat.PayTransferView.callback = null;
                            BlackCat.PayTransferView.address = BlackCat.Main.user.info.wallet;
                            BlackCat.Main.viewMgr.change("PayTransferView");
                            BlackCat.Main.viewMgr.payTransferView.inputTransferCount.value = mintCount;
                        }, { gas: mintCount });
                    }
                    else {
                        BlackCat.Main.showErrMsg("pay_makeMintNeoUtxoCountsLimit", () => {
                            BlackCat.PayTransferView.transferType_default = "NEO";
                            BlackCat.PayTransferView.callback = null;
                            BlackCat.PayTransferView.address = BlackCat.Main.user.info.wallet;
                            BlackCat.Main.viewMgr.change("PayTransferView");
                            BlackCat.Main.viewMgr.payTransferView.inputTransferCount.value = mintCount;
                        }, { neo: mintCount });
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
                tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                var msg = tran.GetMessage();
                var signdata = ThinNeo.Helper.Sign(msg, login.prikey);
                tran.AddWitness(signdata, login.pubkey, login.address);
                var txid = tran.GetHash().clone().reverse().toHexString();
                var data = tran.GetRawData();
                var r = yield BlackCat.tools.WWW.api_postRawTransaction(data);
                if (r) {
                    if (r["txid"] || r["sendrawtransactionresult"]) {
                        if (!r["txid"] || r["txid"] == "") {
                            r["txid"] = txid;
                        }
                        var log_type = "1";
                        var log_nnc = BlackCat.tools.CoinTool["id_" + coinType];
                        var logRes = yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, r["txid"], "0", mintCount, log_type, '{"sbParamJson":"[]", "sbPushString": "mintTokens", "nnc": "' + log_nnc + '"}', BlackCat.Main.netMgr.type, "0", net_fee, BlackCat.PayTransferView.log_type_detail[coinType.toLowerCase()]);
                        var height = yield BlackCat.tools.WWW.api_getHeight_nodes();
                        oldarr.map(old => old.height = height);
                        BlackCat.tools.OldUTXO.oldutxosPush(oldarr);
                        BlackCat.Main.viewMgr.viewLoading.remove();
                        this.doGetWalletLists(1);
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
        makeRefundTransaction(id_ASSET = BlackCat.tools.CoinTool.id_CGAS, coinType = "CGAS") {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                var refundCount = BlackCat.Main.viewMgr.viewTransferCount.inputCount.value;
                var sendCount = Neo.Fixed8.fromNumber(Number(refundCount));
                var net_fee = BlackCat.Main.viewMgr.viewTransferCount.net_fee;
                console.log("[BlaCat]", '[PayView]', '退到gas/neo，数量 => ', refundCount, '手续费netfee =>', net_fee);
                var scriptaddress = id_ASSET.hexToBytes().reverse();
                var login = BlackCat.tools.LoginInfo.getCurrentLogin();
                if (id_ASSET == '0x74f2dc36a68fdc4682034178eb2220729231db76') {
                    var utxos_assets = yield BlackCat.tools.CoinTool.getCgasAssets(id_ASSET, Number(refundCount));
                }
                else {
                    var utxos_assets = yield BlackCat.tools.CoinTool.getNep5Assets(id_ASSET);
                }
                var log_type = "2";
                var coinType_asset = BlackCat.tools.CoinTool.id_GAS;
                var not_enough_utxo_err = "pay_makeRefundCgasNotEnoughUtxo";
                var not_enough_err = "pay_makeRefundCgasNotEnough";
                if (coinType == "CNEO" || coinType == "CNEO_OLD") {
                    coinType_asset = BlackCat.tools.CoinTool.id_NEO;
                    not_enough_utxo_err = "pay_makeRefundCneoNotEnoughUtxo";
                    not_enough_err = "pay_makeRefundCneoNotEnough";
                }
                var us = utxos_assets[coinType_asset];
                if (us == undefined) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg(not_enough_utxo_err);
                    return;
                }
                let us_random = [];
                BlackCat.Main.randomSort(us, us_random);
                us = us_random;
                console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, us.before => ', us);
                var us_parse = [];
                var count = Neo.Fixed8.Zero;
                for (var i = us.length - 1; i >= 0; i--) {
                    if (count.compareTo(sendCount) > 0) {
                        console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, enough us[' + i + '].delete => ', us[i]);
                        continue;
                    }
                    if (us[i].n > 0) {
                        count = count.add(us[i].count);
                        us_parse.push(us[i]);
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
                            console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, us[' + i + '].delete => ', us[i]);
                        }
                        else {
                            count = count.add(us[i].count);
                            us_parse.push(us[i]);
                        }
                    }
                }
                us = us_parse;
                console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, us.after => ', us);
                utxos_assets[coinType_asset] = us;
                console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, utxos_assets.after => ', utxos_assets);
                try {
                    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                    var makeTranRes = BlackCat.tools.CoinTool.makeTran(utxos_assets, nepAddress, coinType_asset, Neo.Fixed8.fromNumber(Number(refundCount)));
                    if (Number(net_fee) > 0) {
                        try {
                            var user_utxos_assets = yield BlackCat.tools.CoinTool.getassets();
                            console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_utxos_assets => ', user_utxos_assets);
                            var user_makeTranRes = BlackCat.tools.CoinTool.makeTran(user_utxos_assets, BlackCat.Main.user.info.wallet, BlackCat.tools.CoinTool.id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)));
                            var user_tran = user_makeTranRes.info.tran;
                            for (let i = 0; i < user_tran.inputs.length; i++) {
                                makeTranRes.info.tran.inputs.push(user_tran.inputs[i]);
                            }
                            for (let i = 0; i < user_tran.outputs.length; i++) {
                                makeTranRes.info.tran.outputs.push(user_tran.outputs[i]);
                            }
                            var user_oldarr = user_makeTranRes.info.oldarr;
                            for (let i = 0; i < user_oldarr.length; i++) {
                                makeTranRes.info.oldarr.push(user_oldarr[i]);
                            }
                            console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_makeTranRes => ', user_makeTranRes);
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
                    }
                }
                catch (e) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg(not_enough_err);
                    return;
                }
                console.log("[BlaCat]", "[payView]", "makeRefundTransaction, makeTranRes => ", makeTranRes);
                var r = yield BlackCat.tools.WWW.api_getcontractstate(id_ASSET);
                if (r && r["script"]) {
                    var Script = r["script"].hexToBytes();
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
                    if (Number(net_fee) > 0)
                        tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                    tran.attributes = new Array(1);
                    tran.attributes[0] = new ThinNeo.Attribute();
                    tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                    tran.attributes[0].data = scriptHash;
                    var wsb = new ThinNeo.ScriptBuilder();
                    wsb.EmitPushString("whatever");
                    wsb.EmitPushNumber(new Neo.BigInteger(250));
                    tran.AddWitnessScript(Script, wsb.ToArray());
                    var signdata = ThinNeo.Helper.Sign(tran.GetMessage(), login.prikey);
                    tran.AddWitness(signdata, login.pubkey, login.address);
                    var txid = tran.GetHash().clone().reverse().toHexString();
                    var trandata = tran.GetRawData();
                    console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, tran => ', tran);
                    r = yield BlackCat.tools.WWW.api_postRawTransaction(trandata);
                    if (r) {
                        if (r.txid || r['sendrawtransactionresult']) {
                            if (!r["txid"] || r["txid"] == "") {
                                r["txid"] = txid;
                            }
                            var paramJson_tmp = "(bytes)" + scriptHash.toHexString();
                            var logRes = yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, r.txid, "0", refundCount, log_type, '{"sbParamJson":"' + paramJson_tmp + '", "sbPushString": "refund", "nnc": "' + id_ASSET + '", "net_fee": "' + net_fee + '"}', BlackCat.Main.netMgr.type, "0", "", BlackCat.PayTransferView.log_type_detail[coinType.toLowerCase()]);
                            if (logRes.r) {
                                BlackCat.Main.platWalletLogId = parseInt(logRes.data);
                            }
                            var height = yield BlackCat.tools.WWW.api_getHeight_nodes();
                            oldarr.map(old => old.height = height);
                            BlackCat.tools.OldUTXO.oldutxosPush(oldarr);
                            BlackCat.Main.viewMgr.viewLoading.remove();
                            this.doGetWalletLists(1);
                        }
                        else {
                            BlackCat.Main.viewMgr.viewLoading.remove();
                            BlackCat.Main.showErrMsg(("pay_makeRefundDoFail"));
                        }
                        console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, api_postRawTransaction结果 => ', r);
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
                        this.doGetWalletLists(1);
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
        changeToken(type) {
            let types = ['blacat', 'neo', 'other'];
            for (let i = 0; i < types.length; i++) {
                this["token_list_" + types[i]].style.display = "none";
                this["token_" + types[i]].classList.remove("active");
            }
            this["token_list_" + type].style.display = "block";
            this["token_" + type].classList.add("active");
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
        getHeight(type) {
            return __awaiter(this, void 0, void 0, function* () {
                var height = yield BlackCat.tools.WWW["api_getHeight_" + type]();
                this.updateHeight(type, height);
            });
        }
        updateHeight(type, height) {
            this["divHeight_" + type].textContent = height.toString();
            this["height_" + type] = height;
        }
        parseTypeDetailType10(type_detail) {
            var res = { type: "0", type_src: "0" };
            var detail = parseInt(type_detail);
            res.type_src = Math.floor(detail / 1000).toString();
            res.type = (detail % 1000).toString();
            return res;
        }
        my_asset() {
            return __awaiter(this, void 0, void 0, function* () {
                var curr = Date.parse(new Date().toString());
                if (!this.game_assets_ts || curr - this.game_assets_ts > this.game_assets_update) {
                    try {
                        var game_assetids = [];
                        var allNep5AssetsBalance = yield BlackCat.tools.WWW.api_getAllNep5AssetBalanceOfAddress(BlackCat.Main.user.info.wallet);
                        if (allNep5AssetsBalance) {
                            for (let k in allNep5AssetsBalance) {
                                game_assetids.push(allNep5AssetsBalance[k]['assetid']);
                                this.allnep5_balance[allNep5AssetsBalance[k]['assetid']] = allNep5AssetsBalance[k];
                            }
                        }
                        var res = yield BlackCat.ApiTool.getGameAssets(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, [], BlackCat.Main.appid);
                        console.log("[BlaCat]", '[PayView]', 'my_asset, getGameAssets res => ', res);
                        if (res.r) {
                            if (res.data) {
                                this.game_assets = res.data;
                                this.game_assets_ts = curr;
                                this.showGameAssets();
                            }
                        }
                        else {
                            BlackCat.Main.showErrCode(res.errCode);
                            return;
                        }
                    }
                    catch (e) { }
                }
                else {
                    console.log("[BlaCat]", '[PayView]', 'my_asset, tm not reach, last ', curr - this.game_assets_ts, ', this.game_assets_update: ', this.game_assets_update);
                }
            });
        }
        showGameAssets() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.game_assets) {
                    this.game_assets_element.innerHTML = "";
                    this.game_assets_element.classList.add("game_assets");
                    for (let k in this.game_assets) {
                        if (this.game_assets[k].hasOwnProperty('coins')) {
                            for (let m in this.game_assets[k]['coins']) {
                                var assets_balance = this.objCreate("div");
                                assets_balance.classList.add("mini_asset");
                                assets_balance.textContent = this.game_assets[k]['coins'][m]['symbol'] ? this.game_assets[k]['coins'][m]['symbol'] : this.allnep5_balance[this.game_assets[k]['coins'][m]['contract']]['symbol'];
                                this.ObjAppend(this.game_assets_element, assets_balance);
                                var img = this.objCreate("img");
                                img.src = this.game_assets[k]['coins'][m]['icon'];
                                this.ObjAppend(assets_balance, img);
                                var asseticon = this.objCreate("i");
                                asseticon.classList.add("iconfont", "icon-bc-gengduo");
                                this.ObjAppend(assets_balance, asseticon);
                                var balance = this.objCreate("span");
                                balance.textContent = "0";
                                this.ObjAppend(assets_balance, balance);
                                if (this.allnep5_balance.hasOwnProperty(this.game_assets[k]['coins'][m]['contract'])) {
                                    balance.textContent = BlackCat.Main.getStringNumber(this.allnep5_balance[this.game_assets[k]['coins'][m]['contract']]['balance']);
                                }
                            }
                        }
                        if (this.game_assets[k].hasOwnProperty('nfts')) {
                            var assets_prop = this.objCreate("div");
                            assets_prop.classList.add("pc_assetsprop");
                            this.ObjAppend(this.game_assets_element, assets_prop);
                            for (var i = 0; i < 5; i++) {
                                var prop = this.objCreate("a");
                                prop.classList.add("pc_prop");
                                this.ObjAppend(assets_prop, prop);
                                var propimg = this.objCreate("img");
                                propimg.src = BlackCat.Main.resHost + "res/img/game0.png";
                                this.ObjAppend(prop, propimg);
                                var propname = this.objCreate("span");
                                this.ObjAppend(prop, propname);
                                propname.textContent = "撒旦之力什么鬼";
                            }
                            var assets_more = this.objCreate("div");
                            assets_more.classList.add("pc_assetsmore");
                            this.ObjAppend(this.game_assets_element, assets_more);
                            var more_btn = this.objCreate("button");
                            more_btn.classList.add("pc_assetsmorebtn", "iconfont", "icon-bc-gengduo1");
                            this.ObjAppend(assets_more, more_btn);
                        }
                    }
                }
            });
        }
    }
    PayView.tokens = ["blacat", "neo", "other"];
    PayView.tokens_coin = [
        ["bct", "bcp"],
        ["gas", "cgas", "neo", "cneo"],
        ["btc", "eth"],
    ];
    PayView.tokens_old = {
        neo: ["cgas", "cneo"],
    };
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
            this.div.classList.add("pc_bj", "pc_walletdetail");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
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
            iMoreshow.classList.add("iconfont", "icon-bc-gengduo1");
            iMoreshow.onclick = () => {
                content.classList.add("pc_paydetailshow");
                iMoreshow.style.display = "none";
                iMorehide.style.display = "block";
            };
            this.ObjAppend(divNotes, iMoreshow);
            var iMorehide = this.objCreate("i");
            iMorehide.style.display = "none";
            iMorehide.classList.add("iconfont", "icon-bc-gengduo1");
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
            iWalletExport.classList.add("iconfont", "icon-bc-daochuqianbao");
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
    class PersonalCenterView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_myinfo");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("personalcenter");
            this.ObjAppend(header, headerH1);
            var myinfo = this.objCreate("div");
            myinfo.classList.add("pc_myinfolist");
            var ulMyinfo = this.objCreate("ul");
            this.ObjAppend(myinfo, ulMyinfo);
            var liMyinfoUid = this.objCreate("li");
            liMyinfoUid.style.cursor = "Default";
            liMyinfoUid.textContent = BlackCat.Main.langMgr.get("myinfo_uid");
            this.ObjAppend(ulMyinfo, liMyinfoUid);
            var spanMyinfoUid = this.objCreate("span");
            spanMyinfoUid.textContent = this.getUid();
            this.ObjAppend(liMyinfoUid, spanMyinfoUid);
            var liMyinfoGrade = this.objCreate("li");
            liMyinfoGrade.style.cursor = "Default";
            liMyinfoGrade.textContent = BlackCat.Main.langMgr.get("myinfo_leve");
            this.ObjAppend(ulMyinfo, liMyinfoGrade);
            var spanMyinfoGrade = this.objCreate("span");
            spanMyinfoGrade.textContent = "Lv" + BlackCat.Main.user.info.lv;
            this.ObjAppend(liMyinfoGrade, spanMyinfoGrade);
            var liMyinfo = this.objCreate("li");
            liMyinfo.textContent = BlackCat.Main.langMgr.get("myInfo");
            liMyinfo.onclick = () => {
                this.hidden();
                BlackCat.MyInfoView.refer = "PersonalCenterView";
                BlackCat.Main.viewMgr.change("MyInfoView");
            };
            this.ObjAppend(ulMyinfo, liMyinfo);
            var iMyinfo = this.objCreate("i");
            iMyinfo.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liMyinfo, iMyinfo);
            this.myInfo = this.objCreate("span");
            this.myInfo.textContent = BlackCat.Main.langMgr.get("myinfo_modify");
            this.ObjAppend(liMyinfo, this.myInfo);
            var liMyinfofee = this.objCreate("li");
            liMyinfofee.textContent = BlackCat.Main.langMgr.get("myinfo_fee");
            liMyinfofee.onclick = () => {
                this.hidden();
                BlackCat.ModifyTransactionFeeView.refer = "PersonalCenterView";
                BlackCat.Main.viewMgr.change("ModifyTransactionFeeView");
            };
            var iMyinfofee = this.objCreate("i");
            iMyinfofee.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liMyinfofee, iMyinfofee);
            this.myFee = this.objCreate("span");
            this.myFee.textContent = this.getFee();
            this.ObjAppend(liMyinfofee, this.myFee);
            this.ObjAppend(ulMyinfo, liMyinfofee);
            var liMyinfoNet = this.objCreate("li");
            liMyinfoNet.textContent = BlackCat.Main.langMgr.get("modifyNet");
            liMyinfoNet.onclick = () => {
                this.hidden();
                BlackCat.ModifyNetworkLineView.refer = "PersonalCenterView";
                BlackCat.ModifyNetworkLineView.defaultType = "nodes";
                BlackCat.Main.viewMgr.change("ModifyNetworkLineView");
            };
            this.ObjAppend(ulMyinfo, liMyinfoNet);
            var iMyinfoNet = this.objCreate("i");
            iMyinfoNet.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liMyinfoNet, iMyinfoNet);
            var spanNet_nodes = this.objCreate("span");
            this.ObjAppend(liMyinfoNet, spanNet_nodes);
            spanNet_nodes.classList.add("pc_spannet");
            this.myNet_nodes = this.objCreate("div");
            this.myNet_nodes.textContent = "BlockAPI";
            this.ObjAppend(spanNet_nodes, this.myNet_nodes);
            this.divHeight_nodes = this.objCreate("div");
            this.divHeight_nodes.classList.add("iconfont", "icon-bc-blalian");
            this.divHeight_nodes.textContent = "n/a";
            this.ObjAppend(spanNet_nodes, this.divHeight_nodes);
            var spanNet_clis = this.objCreate("span");
            this.ObjAppend(liMyinfoNet, spanNet_clis);
            spanNet_clis.classList.add("pc_spannet", "pc_spannet_clis");
            this.myNet_clis = this.objCreate("div");
            this.myNet_clis.textContent = "NeoCli";
            this.ObjAppend(spanNet_clis, this.myNet_clis);
            this.divHeight_clis = this.objCreate("div");
            this.divHeight_clis.classList.add("iconfont", "icon-bc-neolian");
            this.divHeight_clis.textContent = "n/a";
            this.ObjAppend(spanNet_clis, this.divHeight_clis);
            var liMyinfoTrust = this.objCreate("li");
            liMyinfoTrust.textContent = BlackCat.Main.langMgr.get("myinfo_security");
            liMyinfoTrust.onclick = () => {
                this.hidden();
                BlackCat.SecurityCenterView.refer = "PersonalCenterView";
                BlackCat.Main.viewMgr.change("SecurityCenterView");
            };
            this.ObjAppend(ulMyinfo, liMyinfoTrust);
            var iMyinfoTrust = this.objCreate("i");
            iMyinfoTrust.classList.add("iconfont", "icon-bc-gengduo");
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
            this.getNodeHeight("nodes");
            this.getNodeHeight("clis");
        }
        toRefer() {
            if (PersonalCenterView.refer) {
                BlackCat.Main.viewMgr.change(PersonalCenterView.refer);
                PersonalCenterView.refer = null;
            }
        }
        getUid() {
            return BlackCat.Main.user.info.uid;
        }
        getFee() {
            if (BlackCat.Main.user.info.service_charge) {
                return BlackCat.Main.user.info.service_charge + " " + BlackCat.Main.langMgr.get("gas");
            }
            else {
                return BlackCat.Main.user.info.service_charge ? BlackCat.Main.user.info.service_charge : BlackCat.Main.langMgr.get("myinfo_fee_empty");
            }
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
        modifyFee() {
            this.myFee.textContent = this.getFee();
        }
        getNodeHeight(type) {
            return __awaiter(this, void 0, void 0, function* () {
                let height = BlackCat.Main.viewMgr.payView["height_" + type].toString();
                if (height > 0) {
                    this["divHeight_" + type].textContent = height == 0 ? "n/a" : height;
                }
            });
        }
        updateNodeInfo() {
            this.getNodeHeight("nodes");
            if (BlackCat.tools.WWW.api_clis && BlackCat.tools.WWW.api_clis != "") {
                this.getNodeHeight("clis");
            }
        }
        updateVip() {
            if (BlackCat.Main.user.info.is_vip == "0") {
                this.myVip.textContent = BlackCat.Main.langMgr.get("myinfo_openmember");
            }
            else {
                this.myVip.textContent = BlackCat.Main.getDate(BlackCat.Main.user.info.vip_end_time);
            }
            if (BlackCat.Main.user.info.is_forever_vip == "1") {
                this.iMyinfovip.style.display = "none";
                this.myVip.textContent = BlackCat.Main.langMgr.get("myinfo_permanentmember");
                this.liMyinfovip.style.cursor = "default";
                this.liMyinfovip.onclick = () => {
                };
            }
        }
    }
    BlackCat.PersonalCenterView = PersonalCenterView;
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
            this.div.classList.add("pc_bj", "pc_login", "pc_register");
            var divLogo = this.objCreate("div");
            divLogo.classList.add("pc_login_logo", "iconfont", "icon-bc-blacat");
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
                iIshurushouji.classList.add("icon-bc-shurushouji");
                iIshurushouji.classList.remove("icon-bc-xinxi");
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
                iIshurushouji.classList.add("icon-bc-xinxi");
                iIshurushouji.classList.remove("icon-bc-shurushouji");
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
            iUserName.classList.add("iconfont", "icon-bc-my");
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
            iRegion.classList.add("iconfont", "icon-bc-diqiu");
            this.ObjAppend(areaSelect, iRegion);
            this.selectArea = this.objCreate("select");
            var areaInfo = BlackCat.AreaView.getAreaByLang(BlackCat.Main.langMgr.type);
            areaInfo.forEach(area => {
                var option = this.objCreate("option");
                option.setAttribute("value", area.codename);
                option.textContent = BlackCat.Main.langMgr.get("area_code_" + area.codename);
                if (area.codename == "CN") {
                    option.setAttribute("selected", "selected");
                }
                this.selectArea.options.add(option);
            });
            this.selectArea.onchange = () => {
                areaInfo.forEach(area => {
                    if (area.codename == this.selectArea.value) {
                        this.divArea.textContent = area.areacode;
                    }
                });
            };
            this.ObjAppend(areaSelect, this.selectArea);
            this.divArea = this.objCreate("div");
            this.divArea.classList.add("pc_area");
            areaInfo.forEach(area => {
                if (area.codename == this.selectArea.value) {
                    this.divArea.textContent = area.areacode;
                }
            });
            this.ObjAppend(areaSelect, this.divArea);
            var aArea = this.objCreate("a");
            aArea.classList.add("pc_areaa", "iconfont", "icon-bc-xiala");
            this.ObjAppend(areaSelect, aArea);
            var divTel = this.objCreate("div");
            divTel.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divTel);
            var iIshurushouji = this.objCreate("i");
            iIshurushouji.classList.add("iconfont", "icon-bc-shurushouji");
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
            iDivCode.classList.add("iconfont", "icon-bc-dunpai1");
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
            iPass.classList.add("iconfont", "icon-bc-mima");
            this.ObjAppend(divPass, iPass);
            this.inputPass = this.objCreate("input");
            this.inputPass.type = "password";
            this.inputPass.placeholder = BlackCat.Main.langMgr.get("register_inputPass");
            this.ObjAppend(divPass, this.inputPass);
            var divVPass = this.objCreate("div");
            divVPass.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divVPass);
            var iVPass = this.objCreate("i");
            iVPass.classList.add("iconfont", "icon-bc-mima");
            this.ObjAppend(divVPass, iVPass);
            this.inputVpass = this.objCreate("input");
            this.inputVpass.type = "password";
            this.inputVpass.placeholder = BlackCat.Main.langMgr.get("register_inputVpass");
            this.ObjAppend(divVPass, this.inputVpass);
            var divinvite = this.objCreate("div");
            divinvite.classList.add("pc_login_inputbox");
            this.ObjAppend(divInput, divinvite);
            this.inputinvite = this.objCreate("input");
            this.inputinvite.type = "text";
            this.inputinvite.placeholder = BlackCat.Main.langMgr.get("register_invitation");
            this.ObjAppend(divinvite, this.inputinvite);
            var iinvite = this.objCreate("i");
            iinvite.classList.add("iconfont", "icon-yaoqingma");
            this.ObjAppend(divinvite, iinvite);
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
        key_esc() {
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
                if (this.inputPass.value.length > 32) {
                    BlackCat.Main.showErrMsg(("register_exceed"), () => {
                        this.inputPass.focus();
                    });
                    return;
                }
                var refer = BlackCat.Main.appid;
                if (BlackCat.Main.apprefer && BlackCat.Main.apprefer != "") {
                    refer += "_" + BlackCat.Main.apprefer;
                }
                var res;
                switch (this.accountType) {
                    case 'email':
                        res = yield BlackCat.ApiTool.registerByEmail(this.inputAccount.value, this.inputCode.value, this.inputVpass.value, this.selectArea.value, this.inputUid.value, this.inputinvite.value, refer);
                        break;
                    case 'phone':
                        res = yield BlackCat.ApiTool.registerByPhone(this.getPhone(), this.inputCode.value, this.inputVpass.value, this.selectArea.value, this.inputUid.value, this.inputinvite.value, refer);
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
                    switch (res.errCode) {
                        case 100809:
                            BlackCat.Main.showErrMsg(("register_inputinvite_err"));
                            break;
                        default:
                            BlackCat.Main.showErrCode(res.errCode);
                    }
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
                    console.log("[BlaCat]", '[RegisterView]', 'doGetCode, ApiTool.getxxCode', 'error => ', e.toString());
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
            this.div.classList.add("pc_bj", "pc_security");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
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
                BlackCat.TrustContractView.refer = "SecurityCenterView";
                BlackCat.Main.viewMgr.change("TrustContractView");
            };
            this.ObjAppend(ulSecurity, liTrust);
            var iTrust = this.objCreate("i");
            iTrust.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liTrust, iTrust);
            var spanTrust = this.objCreate("span");
            spanTrust.textContent = BlackCat.Main.langMgr.get("security_trust_admin");
            this.ObjAppend(liTrust, spanTrust);
            var liSignOut = this.objCreate("li");
            liSignOut.style.cursor = "pointer";
            liSignOut.textContent = BlackCat.Main.langMgr.get("security_walletOut");
            liSignOut.onclick = () => {
                this.hidden();
                BlackCat.AutoLogoutWalletView.refer = "SecurityCenterView";
                BlackCat.Main.viewMgr.change("AutoLogoutWalletView");
            };
            this.ObjAppend(ulSecurity, liSignOut);
            var iSignOut = this.objCreate("i");
            iSignOut.classList.add("iconfont", "icon-bc-gengduo");
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
            if (SecurityCenterView.refer) {
                BlackCat.Main.viewMgr.change(SecurityCenterView.refer);
                SecurityCenterView.refer = null;
            }
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
            this.div.classList.add("pc_bj", "pc_paylist", "pc_trustcontract");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
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
        toRefer() {
            if (TrustContractView.refer) {
                BlackCat.Main.viewMgr.change(TrustContractView.refer);
                TrustContractView.refer = null;
            }
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
        key_esc() {
            this.doConfirm();
        }
        key_enter() {
            this.doConfirm();
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
        key_esc() {
            this.doCancel();
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
            this.div.classList.add("pc_bj", "pc_connecting");
            if (this.showType == "connecting") {
                this.showConnecting();
            }
            else if (this.showType == "retry") {
                this.showRetry(this.showReturn);
            }
        }
        key_esc() {
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
        key_esc() {
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
                    console.log("[BlaCat]", '[ViewMgr]', '显示打开钱包输入密码界面(' + type + ') ...');
                    if (!this.viewWalletOpen) {
                        this.viewWalletOpen = new BlackCat.ViewWalletOpen();
                        this.views[type] = this.viewWalletOpen;
                    }
                    this.viewWalletOpen.start();
                    break;
                case "ViewTransferCount":
                    console.log("[BlaCat]", '[ViewMgr]', '显示输入交易数量界面(' + type + ') ...');
                    if (!this.viewTransferCount) {
                        this.viewTransferCount = new BlackCat.ViewTransferCount();
                        this.views[type] = this.viewTransferCount;
                    }
                    this.viewTransferCount.start();
                    break;
                case "ViewTransactionConfirm":
                    console.log("[BlaCat]", '[viewMgr]', '显示确认交易界面(' + type + ') ...');
                    if (!this.viewTransactionConfirm) {
                        this.viewTransactionConfirm = new BlackCat.ViewTransactionConfirm();
                        this.views[type] = this.viewTransactionConfirm;
                    }
                    this.viewTransactionConfirm.start();
                    break;
                case "IconView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示SDK图标(' + type + ') ...');
                    if (!this.iconView) {
                        this.iconView = new BlackCat.IconView();
                        this.views[type] = this.iconView;
                    }
                    this.iconView.start();
                    break;
                case "LoginView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示登录(' + type + ') ...');
                    if (!this.loginView) {
                        this.loginView = new BlackCat.LoginView();
                        this.views[type] = this.loginView;
                    }
                    this.loginView.start();
                    break;
                case "WalletView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示绑定&导入钱包(' + type + ') ...');
                    if (!this.walletView) {
                        this.walletView = new BlackCat.WalletView();
                        this.views[type] = this.walletView;
                    }
                    this.walletView.start();
                    break;
                case "WalletCreateView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示新建钱包(' + type + ') ...');
                    if (!this.walletCreateView) {
                        this.walletCreateView = new BlackCat.WalletCreateView();
                        this.views[type] = this.walletCreateView;
                    }
                    this.walletCreateView.start();
                    break;
                case "WalletImportView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示导入钱包(' + type + ') ...');
                    if (!this.walletImportView) {
                        this.walletImportView = new BlackCat.WalletImportView();
                        this.views[type] = this.walletImportView;
                    }
                    this.walletImportView.start();
                    break;
                case "PayView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示钱包页(' + type + ') ...');
                    if (!this.payView) {
                        this.payView = new BlackCat.PayView();
                        this.views[type] = this.payView;
                    }
                    this.payView.start();
                    break;
                case "PayListDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示交易详情(' + type + ') ...');
                    if (!this.payListDetailView) {
                        this.payListDetailView = new BlackCat.PayListDetailView();
                        this.views[type] = this.payListDetailView;
                    }
                    this.payListDetailView.start();
                    break;
                case "PayListMoreView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示更多记录(' + type + ') ...');
                    if (!this.payListMoreView) {
                        this.payListMoreView = new BlackCat.PayListMoreView();
                        this.views[type] = this.payListMoreView;
                    }
                    this.payListMoreView.start();
                    break;
                case "MyInfoView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示我的信息(' + type + ') ...');
                    if (!this.myInfoView) {
                        this.myInfoView = new BlackCat.MyInfoView();
                        this.views[type] = this.myInfoView;
                    }
                    this.myInfoView.start();
                    break;
                case "PersonalCenterView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示个人中心(' + type + ') ...');
                    if (!this.personalCenterView) {
                        this.personalCenterView = new BlackCat.PersonalCenterView();
                        this.views[type] = this.personalCenterView;
                    }
                    this.personalCenterView.start();
                    break;
                case "PayWalletDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示钱包详情(' + type + ') ...');
                    if (!this.payWalletDetailView) {
                        this.payWalletDetailView = new BlackCat.PayWalletDetailView();
                        this.views[type] = this.payWalletDetailView;
                    }
                    this.payWalletDetailView.start();
                    break;
                case "PayExchangeView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示交易所(' + type + ') ...');
                    if (!this.payExchangeView) {
                        this.payExchangeView = new BlackCat.PayExchangeView();
                        this.views[type] = this.payExchangeView;
                    }
                    this.payExchangeView.start();
                    break;
                case "PayExchangeDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示交易所购买详情(' + type + ') ...');
                    if (!this.payExchangeDetailView) {
                        this.payExchangeDetailView = new BlackCat.PayExchangeDetailView();
                        this.views[type] = this.payExchangeDetailView;
                    }
                    this.payExchangeDetailView.start();
                    break;
                case "PayReceivablesView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示收款(' + type + ') ...');
                    if (!this.payReceivablesView) {
                        this.payReceivablesView = new BlackCat.PayReceivablesView();
                        this.views[type] = this.payReceivablesView;
                    }
                    this.payReceivablesView.start();
                    break;
                case "PayTransferView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示转账(' + type + ') ...');
                    if (!this.payTransferView) {
                        this.payTransferView = new BlackCat.PayTransferView();
                        this.views[type] = this.payTransferView;
                    }
                    this.payTransferView.start();
                    break;
                case "ViewAlert":
                    console.log("[BlaCat]", '[ViewMgr]', '显示提示(' + type + ') ...');
                    if (!this.viewAlert) {
                        this.viewAlert = new BlackCat.ViewAlert();
                        this.views[type] = this.viewAlert;
                    }
                    this.viewAlert.start();
                    break;
                case "ViewConfirm":
                    console.log("[BlaCat]", '[ViewMgr]', '显示确认(' + type + ') ...');
                    if (!this.viewConfirm) {
                        this.viewConfirm = new BlackCat.ViewConfirm();
                        this.views[type] = this.viewConfirm;
                    }
                    this.viewConfirm.start();
                    break;
                case "ViewToast":
                    console.log("[BlaCat]", '[ViewMgr]', '显示Toast(' + type + ') ...');
                    if (!this.viewToast) {
                        this.viewToast = new BlackCat.ViewToast();
                    }
                    this.viewToast.start();
                    break;
                case "ViewLoading":
                    console.log("[BlaCat]", '[ViewMgr]', '显示Loading(' + type + ') ...');
                    if (!this.viewLoading) {
                        this.viewLoading = new BlackCat.ViewLoading();
                        this.views[type] = this.viewLoading;
                    }
                    this.viewLoading.start();
                    break;
                case "ViewTransferConfirm":
                    console.log("[BlaCat]", '[ViewMgr]', '显示转账确认(' + type + ') ...');
                    if (!this.viewTransferConfirm) {
                        this.viewTransferConfirm = new BlackCat.ViewTransferConfirm();
                        this.views[type] = this.viewTransferConfirm;
                    }
                    this.viewTransferConfirm.start();
                    break;
                case "RegisterView":
                    console.log("[BlaCat]", '[ViewMgr]', '注册(' + type + ') ...');
                    if (!this.registerView) {
                        this.registerView = new BlackCat.RegisterView();
                        this.views[type] = this.registerView;
                    }
                    this.registerView.start();
                    break;
                case "ForgetPasswordView":
                    console.log("[BlaCat]", '[ViewMgr]', '忘记密码(' + type + ') ...');
                    if (!this.forgetPasswordView) {
                        this.forgetPasswordView = new BlackCat.ForgetPasswordView();
                        this.views[type] = this.forgetPasswordView;
                    }
                    this.forgetPasswordView.start();
                    break;
                case "ModifyImgView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改头像(' + type + ') ...');
                    if (!this.modifyImgView) {
                        this.modifyImgView = new BlackCat.ModifyImgView();
                        this.views[type] = this.modifyImgView;
                    }
                    this.modifyImgView.start();
                    break;
                case "ModifyNameView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改昵称(' + type + ') ...');
                    if (!this.modifyNameView) {
                        this.modifyNameView = new BlackCat.ModifyNameView();
                        this.views[type] = this.modifyNameView;
                    }
                    this.modifyNameView.start();
                    break;
                case "ModifySexView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改性别(' + type + ') ...');
                    if (!this.modifySexView) {
                        this.modifySexView = new BlackCat.ModifySexView();
                        this.views[type] = this.modifySexView;
                    }
                    this.modifySexView.start();
                    break;
                case "ModifyAreaView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改地区(' + type + ') ...');
                    if (!this.modifyAreaView) {
                        this.modifyAreaView = new BlackCat.ModifyAreaView();
                        this.views[type] = this.modifyAreaView;
                    }
                    this.modifyAreaView.start();
                    break;
                case "ModifyTransactionFeeView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改手续费(' + type + ') ...');
                    if (!this.modifyTransactionFeeView) {
                        this.modifyTransactionFeeView = new BlackCat.ModifyTransactionFeeView();
                        this.views[type] = this.modifyTransactionFeeView;
                    }
                    this.modifyTransactionFeeView.start();
                    break;
                case "ModifyNetworkLineView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改网络线路(' + type + ') ...');
                    if (!this.modifyNetworkLineView) {
                        this.modifyNetworkLineView = new BlackCat.ModifyNetworkLineView();
                        this.views[type] = this.modifyNetworkLineView;
                    }
                    this.modifyNetworkLineView.start();
                    break;
                case "ModifyVipView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示开通会员(' + type + ') ...');
                    if (!this.modifyVipView) {
                        this.modifyVipView = new BlackCat.ModifyVipView();
                        this.views[type] = this.modifyVipView;
                    }
                    this.modifyVipView.start();
                    break;
                case "SecurityCenterView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示安全中心(' + type + ') ...');
                    if (!this.securityCenterView) {
                        this.securityCenterView = new BlackCat.SecurityCenterView();
                        this.views[type] = this.securityCenterView;
                    }
                    this.securityCenterView.start();
                    break;
                case "TrustContractView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示信任合约(' + type + ') ...');
                    if (!this.trustContractView) {
                        this.trustContractView = new BlackCat.TrustContractView();
                        this.views[type] = this.trustContractView;
                    }
                    this.trustContractView.start();
                    break;
                case "AutoLogoutWalletView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示自动登出钱包(' + type + ') ...');
                    if (!this.autoLogoutWalletView) {
                        this.autoLogoutWalletView = new BlackCat.AutoLogoutWalletView();
                        this.views[type] = this.autoLogoutWalletView;
                    }
                    this.autoLogoutWalletView.start();
                    break;
                case "AddressbookView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示通讯录(' + type + ') ...');
                    if (!this.addressbookView) {
                        this.addressbookView = new BlackCat.AddressbookView();
                        this.views[type] = this.addressbookView;
                    }
                    this.addressbookView.start();
                    break;
                case "AddressbookDetailsView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示通讯录详情(' + type + ') ...');
                    if (!this.addressbookDetailsView) {
                        this.addressbookDetailsView = new BlackCat.AddressbookDetailsView();
                        this.views[type] = this.addressbookDetailsView;
                    }
                    this.addressbookDetailsView.start();
                    break;
                case "AddressbookOpView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示通讯录操作联系人信息(' + type + ') ...');
                    if (!this.addressbookOpView) {
                        this.addressbookOpView = new BlackCat.AddressbookOpView();
                        this.views[type] = this.addressbookOpView;
                    }
                    this.addressbookOpView.start();
                    break;
                case "ViewConnecting":
                    console.log("[BlaCat]", '[ViewMgr]', '显示连接中(' + type + ') ...');
                    if (!this.viewConnecting) {
                        this.viewConnecting = new BlackCat.ViewConnecting();
                        this.views[type] = this.viewConnecting;
                    }
                    this.viewConnecting.start();
                    break;
                case "PayExchangeBCTView":
                    if (!this.payExchangeBCTView) {
                        this.payExchangeBCTView = new BlackCat.PayExchangeBCTView();
                        this.views[type] = this.payExchangeBCTView;
                    }
                    this.payExchangeBCTView.start();
                    break;
                case "PayExchangeShowWalletView":
                    if (!this.payExchangeShowWalletView) {
                        this.payExchangeShowWalletView = new BlackCat.PayExchangeShowWalletView();
                        this.views[type] = this.payExchangeShowWalletView;
                    }
                    this.payExchangeShowWalletView.start();
                    break;
            }
        }
        removeAll() {
            for (let className in this.views) {
                let v = this.views[className];
                console.log("[BlaCat]", '[ViewMgr]', 'removeAll, view => ', v);
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
            console.log("[BlaCat]", '[ViewMgr]', 'update ...');
            for (let className in this.views) {
                let v = this.views[className];
                console.log("[BlaCat]", '[ViewMgr]', 'update, v =>', v);
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
        updateBalance() {
            console.log("[BlaCat]", '[ViewMgr]', 'updateBalance ...');
            for (let className in this.views) {
                let v = this.views[className];
                if (v.__proto__["updateBalance"]) {
                    v.updateBalance();
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
        key_esc() {
        }
    }
    ViewToast.showTime = 2500;
    BlackCat.ViewToast = ViewToast;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewTransactionConfirm extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!ViewTransactionConfirm.list) {
                ViewTransactionConfirm.list = new BlackCat.walletLists();
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
            if (ViewTransactionConfirm.isTrustFeeLess) {
                BlackCat.Main.showErrMsg('pay_makerawtrans_fee_less');
                this.divConfirmSelect.classList.add("pc_tradeconfirmbut_fee");
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_listdetail", "pc_tradeconfirm", "pc_trust");
            if (ViewTransactionConfirm.list && ViewTransactionConfirm.list.hasOwnProperty("wallet")) {
                var headerTitle = this.objCreate("div");
                headerTitle.classList.add("pc_header");
                var returnBtn = this.objCreate("a");
                returnBtn.classList.add("iconfont", "icon-bc-fanhui");
                returnBtn.textContent = BlackCat.Main.langMgr.get("return");
                returnBtn.onclick = () => {
                    this.return();
                    if (ViewTransactionConfirm.callback_cancel) {
                        ViewTransactionConfirm.callback_cancel();
                        ViewTransactionConfirm.callback_cancel = null;
                    }
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(headerTitle, returnBtn);
                var h1Obj = this.objCreate("h1");
                h1Obj.textContent = BlackCat.Main.platName;
                this.ObjAppend(headerTitle, h1Obj);
                this.ObjAppend(this.div, headerTitle);
                var contentObj = this.objCreate("div");
                contentObj.classList.add("pc_detail");
                contentObj.style.paddingBottom = "210px";
                if (ViewTransactionConfirm.isTrustFeeLess || ViewTransactionConfirm.list.type == "3") {
                    contentObj.style.paddingBottom = "160px";
                }
                contentObj.innerHTML
                    = '<ul>'
                        + '<li>'
                        + '<div class="pc_listimg">'
                        + '<img src="' + BlackCat.Main.viewMgr.payView.getListImg(ViewTransactionConfirm.list) + '">'
                        + '</div>'
                        + '<div class="pc_liftinfo">'
                        + '<div class="pc_listname">' + BlackCat.Main.viewMgr.payView.getListName(ViewTransactionConfirm.list) + '</div>'
                        + '<span class="pc_listdate">' + BlackCat.Main.viewMgr.payView.getListCtm(ViewTransactionConfirm.list) + '</span>'
                        + '</div>'
                        + '<div class="pc_cnts ' + BlackCat.Main.viewMgr.payView.getListCntsClass(ViewTransactionConfirm.list) + ' ">'
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
                this.netFeeCom = new BlackCat.NetFeeComponent(this.divConfirmSelect, (net_fee) => {
                    this.net_fee = net_fee;
                });
                this.netFeeCom.setFeeDefault();
                this.netFeeCom.createDiv();
                if (ViewTransactionConfirm.isTrustFeeLess !== true && ViewTransactionConfirm.list.type != "3") {
                    this.divTrust = this.objCreate("div");
                    this.divTrust.classList.add("pc_switchbox");
                    this.divTrust.textContent = BlackCat.Main.langMgr.get("pay_trust_tips");
                    this.ObjAppend(this.divConfirmSelect, this.divTrust);
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
                    var pTrust = this.objCreate("p");
                    pTrust.textContent = BlackCat.Main.langMgr.get("pay_trust_Vice_tips");
                    this.ObjAppend(this.divTrust, pTrust);
                    this.ObjAppend(trustObj, spanSwitchBut);
                }
                var cancelObj = this.objCreate("button");
                cancelObj.classList.add("pc_cancel");
                cancelObj.textContent = BlackCat.Main.langMgr.get("cancel");
                cancelObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '交易取消..');
                    if (ViewTransactionConfirm.callback_cancel) {
                        ViewTransactionConfirm.callback_cancel(ViewTransactionConfirm.callback_params);
                        ViewTransactionConfirm.callback_cancel = null;
                    }
                    this.remove();
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(this.divConfirmSelect, cancelObj);
                var confirmObj = this.objCreate("button");
                if (ViewTransactionConfirm.list.type == "3") {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("pay_makeRecharge");
                }
                else {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
                }
                confirmObj.onclick = () => {
                    if (Number(this.net_fee) > BlackCat.Main.viewMgr.payView.gas) {
                        BlackCat.Main.showErrMsg('pay_makerawtrans_fee_less');
                        return;
                    }
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '交易确认..');
                    ViewTransactionConfirm.callback(ViewTransactionConfirm.callback_params, this.trust, this.net_fee);
                    ViewTransactionConfirm.callback = null;
                    this.remove(300);
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(this.divConfirmSelect, confirmObj);
            }
        }
        toRefer() {
            if (ViewTransactionConfirm.refer) {
                BlackCat.Main.viewMgr.change(ViewTransactionConfirm.refer);
                ViewTransactionConfirm.refer = null;
            }
        }
        key_esc() {
        }
        getCnts() {
            return ViewTransactionConfirm.list.cnts != '0' ? ViewTransactionConfirm.list.cnts : "";
        }
        getWallet() {
            return ViewTransactionConfirm.list.wallet;
        }
        getParams() {
            var html = "";
            var params = ViewTransactionConfirm.list.params;
            console.log("[BlaCat]", '[ViewTransactionConfirm]', 'getParams, params => ', params);
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
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', 'getParams error => ', e.toString());
                }
            }
            return html;
        }
    }
    BlackCat.ViewTransactionConfirm = ViewTransactionConfirm;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewTransferConfirm extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!ViewTransferConfirm.list) {
                ViewTransferConfirm.list = new BlackCat.walletLists();
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
            this.div.classList.add("pc_bj", "pc_listdetail", "pc_tradeconfirm");
            if (ViewTransferConfirm.list && ViewTransferConfirm.list.hasOwnProperty("wallet")) {
                var headerTitle = this.objCreate("div");
                headerTitle.classList.add("pc_header");
                var returnBtn = this.objCreate("a");
                returnBtn.classList.add("iconfont", "icon-bc-fanhui");
                returnBtn.textContent = BlackCat.Main.langMgr.get("return");
                returnBtn.onclick = () => {
                    this.return();
                    if (ViewTransferConfirm.callback_cancel) {
                        ViewTransferConfirm.callback_cancel();
                        ViewTransferConfirm.callback_cancel = null;
                    }
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(headerTitle, returnBtn);
                var h1Obj = this.objCreate("h1");
                h1Obj.textContent = BlackCat.Main.platName;
                this.ObjAppend(headerTitle, h1Obj);
                this.ObjAppend(this.div, headerTitle);
                var contentObj = this.objCreate("div");
                contentObj.classList.add("pc_detail");
                contentObj.style.paddingBottom = "160px";
                contentObj.innerHTML
                    = '<ul>'
                        + '<li>'
                        + '<div class="pc_listimg">'
                        + '<img src="' + BlackCat.Main.viewMgr.payView.getListImg(ViewTransferConfirm.list) + '">'
                        + '</div>'
                        + '<div class="pc_liftinfo">'
                        + '<div class="pc_listname">' + BlackCat.Main.viewMgr.payView.getListName(ViewTransferConfirm.list) + '</div>'
                        + '<span class="pc_listdate">' + BlackCat.Main.viewMgr.payView.getListCtm(ViewTransferConfirm.list) + '</span>'
                        + '</div>'
                        + '<div class="pc_cnts ' + BlackCat.Main.viewMgr.payView.getListCntsClass(ViewTransferConfirm.list) + ' ">'
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
                this.netFeeCom = new BlackCat.NetFeeComponent(this.divConfirmSelect, (net_fee) => {
                    this.net_fee = net_fee;
                });
                this.netFeeCom.setFeeDefault();
                this.netFeeCom.createDiv();
                var cancelObj = this.objCreate("button");
                cancelObj.classList.add("pc_cancel");
                cancelObj.textContent = BlackCat.Main.langMgr.get("cancel");
                cancelObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransferConfirm]', 'PayTransfer交易取消..');
                    if (ViewTransferConfirm.callback_cancel) {
                        ViewTransferConfirm.callback_cancel(ViewTransferConfirm.callback_params);
                        ViewTransferConfirm.callback_cancel = null;
                    }
                    this.remove();
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(this.divConfirmSelect, cancelObj);
                var confirmObj = this.objCreate("button");
                if (ViewTransferConfirm.list.type == "3") {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("pay_makeRecharge");
                }
                else {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
                }
                confirmObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransferConfirm]', 'PayTransfer交易确认..');
                    ViewTransferConfirm.callback(ViewTransferConfirm.callback_params, this.net_fee);
                    ViewTransferConfirm.callback = null;
                    this.remove(300);
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(this.divConfirmSelect, confirmObj);
            }
        }
        toRefer() {
            if (ViewTransferConfirm.refer) {
                BlackCat.Main.viewMgr.change(ViewTransferConfirm.refer);
                ViewTransferConfirm.refer = null;
            }
        }
        key_esc() {
        }
        getCnts() {
            return ViewTransferConfirm.list.cnts != '0' ? ViewTransferConfirm.list.cnts : "";
        }
        getWallet() {
            return ViewTransferConfirm.list.wallet;
        }
        getParams() {
            var html = "";
            var params = ViewTransferConfirm.list.params;
            console.log("[BlaCat]", '[ViewTransferConfirm]', 'getParams, params => ', params);
            if (params) {
                try {
                    params = JSON.parse(params);
                    if (params.hasOwnProperty("toaddr")) {
                        params = [params];
                    }
                    if (params instanceof Array) {
                        for (let k in params) {
                            html += '<li class="pc_contractAddress">'
                                + '<div><label>' + BlackCat.Main.langMgr.get("pay_transfer_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                + '<div><label>' + BlackCat.Main.langMgr.get("pay_transfer_count") + '</label><p>' + params[k].count + '</p></div>'
                                + '</li>';
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[ViewTransferConfirm]', 'getParams error => ', e.toString());
                }
            }
            return html;
        }
    }
    BlackCat.ViewTransferConfirm = ViewTransferConfirm;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewTransferCount extends BlackCat.ViewBase {
        start() {
            super.start();
            if (ViewTransferCount.transNncOld != "") {
                this.inputCount.focus();
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
            divtransfertype.classList.add("pc_transfertype", "pc_token");
            this.ObjAppend(popupbox, divtransfertype);
            if (ViewTransferCount.transNncOld != "") {
                this.getCoinTypeLang();
                this.divtransfername = this.objCreate("div");
                this.ObjAppend(divtransfertype, this.divtransfername);
                this.labeltransfername1 = this.objCreate("label");
                this.labeltransfername1.textContent = this.coinTypeLang.src;
                this.ObjAppend(this.divtransfername, this.labeltransfername1);
                var itransfertype = this.objCreate("i");
                itransfertype.classList.add("iconfont", "icon-bc-jiantou1");
                this.ObjAppend(this.divtransfername, itransfertype);
                this.labeltransfername2 = this.objCreate("label");
                this.labeltransfername2.textContent = this.coinTypeLang.tat;
                this.ObjAppend(this.divtransfername, this.labeltransfername2);
            }
            else {
                this.selectTransfertype = this.objCreate("select");
                this.selectTransfertype.classList.add("iconfont");
                this.selectTransfertype.onchange = () => {
                    this.dotransfertype();
                };
                this.ObjAppend(divtransfertype, this.selectTransfertype);
                var optionTips = this.objCreate("option");
                optionTips.innerHTML = BlackCat.Main.langMgr.get("pay_transCount_tips");
                optionTips.selected = true;
                optionTips.disabled = true;
                optionTips.style.display = "none";
                this.ObjAppend(this.selectTransfertype, optionTips);
                this.getSelectOptions();
            }
            this.inputCount = this.objCreate("input");
            this.inputCount.type = "text";
            this.inputCount.style.margin = "0 auto 10px";
            this.inputCount.style.width = "80%";
            this.inputCount.placeholder = BlackCat.Main.langMgr.get("pay_transCount_inputCount");
            this.inputCount.onkeyup = () => {
                this.doinputchange();
            };
            this.ObjAppend(popupbox, this.inputCount);
            this.divHaveAmounts = this.objCreate("div");
            this.divHaveAmounts.classList.add("pc_haveamounts");
            this.ObjAppend(popupbox, this.divHaveAmounts);
            this.getCoinBalanceLang();
            this.getCoinBalance();
            this.divHaveNep5Amounts = this.objCreate("div");
            this.divHaveNep5Amounts.textContent = this.coinBalanceLang.tat + ": " + BlackCat.Main.getStringNumber(this.coinBalance.tat);
            this.ObjAppend(this.divHaveAmounts, this.divHaveNep5Amounts);
            this.spanHaveNep5Amounts = this.objCreate("span");
            this.ObjAppend(this.divHaveNep5Amounts, this.spanHaveNep5Amounts);
            this.divHaveUtxoAmounts = this.objCreate("div");
            this.divHaveUtxoAmounts.textContent = this.coinBalanceLang.src + ": " + BlackCat.Main.getStringNumber(this.coinBalance.src);
            this.ObjAppend(this.divHaveAmounts, this.divHaveUtxoAmounts);
            this.spanHaveUtxoAmounts = this.objCreate("span");
            this.ObjAppend(this.divHaveUtxoAmounts, this.spanHaveUtxoAmounts);
            this.netFeeCom = new BlackCat.NetFeeComponent(popupbox, (net_fee) => {
                this.netFeeChange(net_fee);
            });
            this.netFeeCom.setFeeDefault();
            this.netFeeCom.createDiv();
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
            this.configNetFee();
        }
        toRefer() {
            if (ViewTransferCount.refer) {
                BlackCat.Main.viewMgr.change(ViewTransferCount.refer);
                ViewTransferCount.refer = null;
            }
        }
        key_esc() {
        }
        doinputchange() {
            if (ViewTransferCount.coinType == "CNEO") {
                var neo_int = parseInt(this.inputCount.value);
                if (neo_int > 0) {
                    this.inputCount.value = parseInt(this.inputCount.value).toString();
                }
                else {
                    this.inputCount.value = "";
                }
            }
            if (!BlackCat.Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                this.divHaveUtxoAmounts.classList.remove("pc_income", "pc_expenditure");
                this.divHaveNep5Amounts.classList.remove("pc_income", "pc_expenditure");
                this.spanHaveNep5Amounts.textContent = "";
                this.spanHaveUtxoAmounts.textContent = "";
                return;
            }
            if (this.checkBalance()) {
                switch (ViewTransferCount.transType) {
                    case "mint":
                        this.divHaveUtxoAmounts.classList.add("pc_expenditure");
                        this.divHaveNep5Amounts.classList.add("pc_income");
                        switch (ViewTransferCount.coinType) {
                            case "CGAS":
                                this.spanHaveUtxoAmounts.textContent = BlackCat.Main.getStringNumber(BlackCat.floatNum.plus(Number(this.inputCount.value), Number(this.net_fee)));
                                break;
                            case "CNEO":
                                this.spanHaveUtxoAmounts.textContent = this.inputCount.value;
                                break;
                        }
                        break;
                    case "refund":
                        this.divHaveUtxoAmounts.classList.add("pc_income");
                        this.divHaveNep5Amounts.classList.add("pc_expenditure");
                        switch (ViewTransferCount.coinType) {
                            case "CGAS":
                                this.spanHaveUtxoAmounts.textContent = BlackCat.Main.getStringNumber(BlackCat.floatNum.minus(Number(this.inputCount.value), Number(this.net_fee) * 2));
                                break;
                            case "CNEO":
                                this.spanHaveUtxoAmounts.textContent = this.inputCount.value;
                                break;
                        }
                        break;
                }
                this.spanHaveNep5Amounts.textContent = this.inputCount.value;
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
            if (ViewTransferCount.transNncOld != "" && ViewTransferCount.transType != "refund") {
                BlackCat.Main.showErrMsg('pay_transCount_tips_err', () => {
                    this.inputCount.focus();
                });
                return;
            }
            if (this.checkBalance()) {
                this.remove(300);
                ViewTransferCount.callback();
                ViewTransferCount.callback = null;
            }
        }
        netFeeChange(net_fee) {
            this.net_fee = net_fee;
            var v = this.inputCount.value;
            if (v.length == 0 || v.replace(/(^s*)|(s*$)/g, "").length == 0) {
                return;
            }
            if (ViewTransferCount.coinType == "CGAS") {
                if (ViewTransferCount.transType == "refund") {
                    if (Number(v) - Number(this.net_fee) * 2 <= 0) {
                        BlackCat.Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                            this.inputCount.focus();
                            this.divHaveUtxoAmounts.classList.remove("pc_income");
                            this.divHaveNep5Amounts.classList.remove("pc_expenditure");
                            this.spanHaveNep5Amounts.textContent = "";
                            this.spanHaveUtxoAmounts.textContent = "";
                        });
                        return;
                    }
                    this.divHaveUtxoAmounts.classList.add("pc_income");
                    this.divHaveNep5Amounts.classList.add("pc_expenditure");
                    this.spanHaveNep5Amounts.textContent = this.inputCount.value;
                    this.spanHaveUtxoAmounts.textContent = BlackCat.Main.getStringNumber(BlackCat.floatNum.minus(Number(this.inputCount.value), Number(this.net_fee) * 2));
                }
                else {
                    this.spanHaveUtxoAmounts.textContent = BlackCat.Main.getStringNumber(BlackCat.floatNum.plus(Number(v), Number(this.net_fee)));
                }
            }
            else {
                if (ViewTransferCount.transType == "refund") {
                    this.divHaveUtxoAmounts.classList.add("pc_income");
                    this.divHaveNep5Amounts.classList.add("pc_expenditure");
                }
                else {
                    this.divHaveUtxoAmounts.classList.add("pc_expenditure");
                    this.divHaveNep5Amounts.classList.add("pc_income");
                }
                this.spanHaveUtxoAmounts.textContent = this.inputCount.value;
                this.spanHaveNep5Amounts.textContent = this.inputCount.value;
            }
        }
        updateBalance() {
            this.getCoinBalance();
            this.divHaveNep5Amounts.textContent = this.coinBalanceLang.tat + BlackCat.Main.getStringNumber(this.coinBalance.tat);
            this.divHaveUtxoAmounts.textContent = this.coinBalanceLang.src + BlackCat.Main.getStringNumber(this.coinBalance.src);
        }
        getSelectOptions() {
            var options = [];
            switch (ViewTransferCount.coinType) {
                case "CGAS":
                    options = [
                        ["mint", "gas", "cgas"],
                        ["refund", "cgas", "gas"]
                    ];
                    break;
                case "CNEO":
                    options = [
                        ["mint", "neo", "cneo"],
                        ["refund", "cneo", "neo"]
                    ];
                    break;
            }
            for (let i = 0; i < options.length; i++) {
                var option_ele = this.objCreate("option");
                option_ele.value = options[i][0];
                option_ele.innerHTML = BlackCat.Main.langMgr.get(options[i][1]) + " &#8594; " + BlackCat.Main.langMgr.get(options[i][2]);
                this.ObjAppend(this.selectTransfertype, option_ele);
            }
        }
        getCoinBalance() {
            this.coinBalance = {
                src: 0,
                tat: 0,
            };
            switch (ViewTransferCount.coinType) {
                case "CGAS":
                    this.coinBalance.src = BlackCat.Main.viewMgr.payView.gas;
                    break;
                case "CNEO":
                    this.coinBalance.src = BlackCat.Main.viewMgr.payView.neo;
                    break;
            }
            var coinType_lowcase = ViewTransferCount.coinType.toLowerCase();
            if (ViewTransferCount.transNncOld == "") {
                this.coinBalance.tat = BlackCat.Main.viewMgr.payView[coinType_lowcase];
            }
            else {
                this.coinBalance.tat = BlackCat.Main.viewMgr.payView[coinType_lowcase + "_old" + ViewTransferCount.transNncOld];
            }
        }
        getCoinBalanceLang() {
            this.coinBalanceLang = {
                src: "",
                tat: "",
            };
            switch (ViewTransferCount.coinType) {
                case "CGAS":
                    this.coinBalanceLang.src = BlackCat.Main.langMgr.get("gas");
                    this.coinBalanceLang.tat = BlackCat.Main.langMgr.get("cgas");
                    break;
                case "CNEO":
                    this.coinBalanceLang.src = BlackCat.Main.langMgr.get("neo");
                    this.coinBalanceLang.tat = BlackCat.Main.langMgr.get("cneo");
                    break;
            }
            if (ViewTransferCount.transNncOld != "" && this.coinBalanceLang.tat != "") {
                this.coinBalanceLang.tat += "(old)";
            }
        }
        getCoinTypeLang() {
            this.coinTypeLang = {
                src: "",
                tat: "",
            };
            switch (ViewTransferCount.transType) {
                case "mint":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            this.coinTypeLang.src = BlackCat.Main.langMgr.get("gas");
                            this.coinTypeLang.tat = BlackCat.Main.langMgr.get("cgas");
                            break;
                        case "CNEO":
                            this.coinTypeLang.src = BlackCat.Main.langMgr.get("neo");
                            this.coinTypeLang.tat = BlackCat.Main.langMgr.get("cneo");
                            break;
                    }
                    break;
                case "refund":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            this.coinTypeLang.src = BlackCat.Main.langMgr.get("cgas");
                            this.coinTypeLang.tat = BlackCat.Main.langMgr.get("gas");
                            break;
                        case "CNEO":
                            this.coinTypeLang.src = BlackCat.Main.langMgr.get("cneo");
                            this.coinTypeLang.tat = BlackCat.Main.langMgr.get("neo");
                            break;
                    }
                    break;
            }
            if (ViewTransferCount.transNncOld != "" && this.coinTypeLang.src != "") {
                this.coinTypeLang.src += "(old)";
            }
        }
        dotransfertype() {
            this.divHaveUtxoAmounts.classList.remove("pc_income", "pc_expenditure");
            this.divHaveNep5Amounts.classList.remove("pc_income", "pc_expenditure");
            this.spanHaveNep5Amounts.textContent = "";
            this.spanHaveUtxoAmounts.textContent = "";
            this.inputCount.value = "";
            this.inputCount.focus();
            ViewTransferCount.transType = this.selectTransfertype.value;
            this.configNetFee();
        }
        configNetFee() {
            var showNetFee = true;
            if (ViewTransferCount.transType != "") {
                switch (ViewTransferCount.coinType) {
                    case "CGAS":
                        if (ViewTransferCount.transNncOld && ViewTransferCount.transNncOld == "0x961e628cc93d61bf636dc0443cf0548947a50dbe") {
                            showNetFee = false;
                        }
                        break;
                    case "CNEO":
                        if (ViewTransferCount.transType == "refund") {
                            showNetFee = false;
                        }
                        break;
                }
            }
            if (showNetFee) {
                this.netFeeCom.show();
                if (ViewTransferCount.transType == "refund") {
                    this.netFeeCom.setNetFeeShowRate(2);
                }
                else {
                    this.netFeeCom.setNetFeeShowRate(1);
                }
            }
            else {
                this.netFeeCom.hidden();
            }
        }
        checkBalance() {
            switch (ViewTransferCount.transType) {
                case "mint":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            if (BlackCat.Main.viewMgr.payView.gas < Number(this.inputCount.value) + Number(this.net_fee)) {
                                BlackCat.Main.showErrMsg('pay_makeMintGasNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            return true;
                        case "CNEO":
                            if (BlackCat.Main.viewMgr.payView.gas < Number(this.net_fee)) {
                                BlackCat.Main.showErrMsg('pay_makeMintGasNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            if (BlackCat.Main.viewMgr.payView.neo < Number(this.inputCount.value)) {
                                BlackCat.Main.showErrMsg('pay_makeMintNeoNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            return true;
                    }
                    break;
                case "refund":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            if (this.coinBalance.tat < Number(this.inputCount.value)) {
                                BlackCat.Main.showErrMsg('pay_makeRefundCgasNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            if (Number(this.net_fee) > 0) {
                                if (BlackCat.Main.viewMgr.payView.gas < Number(this.net_fee)) {
                                    BlackCat.Main.showErrMsg("pay_makeRefundGasFeeNotEnough", () => {
                                        this.inputCount.focus();
                                    });
                                    return false;
                                }
                                if (Number(this.inputCount.value) - Number(this.net_fee) <= 0) {
                                    BlackCat.Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                                        this.inputCount.focus();
                                    });
                                    return false;
                                }
                            }
                            return true;
                        case "CNEO":
                            if (this.coinBalance.tat < Number(this.inputCount.value)) {
                                BlackCat.Main.showErrMsg('pay_makeRefundCneoNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            if (Number(this.net_fee) > 0) {
                                BlackCat.Main.showErrMsg("pay_makeRefundGasFeeNotEnough", () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            return true;
                    }
                    break;
            }
            return false;
        }
    }
    ViewTransferCount.coinType = "CGAS";
    ViewTransferCount.transType = "";
    ViewTransferCount.transNncOld = "";
    BlackCat.ViewTransferCount = ViewTransferCount;
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
                this.doCancel();
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
        key_enter() {
            this.doConfirm();
        }
        key_esc() {
            this.doCancel();
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
        doCancel() {
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
            console.log("[BlaCat]", '[ViewWalletOpen]', 'addTask, tasks => ', ViewWalletOpen.tasks);
        }
        static removeTask(type) {
            delete ViewWalletOpen.tasks[type];
        }
        doOpenTasks() {
            console.log("[BlaCat]", '[ViewWalletOpen]', 'doOpenTasks, tasks => ', ViewWalletOpen.tasks);
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
        key_esc() {
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
            if (this.inputPwd.value.length > 32) {
                BlackCat.Main.showErrMsg(("walletCreate_check_exceed"), () => {
                    this.inputPwd.focus();
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
                    console.log("[BlaCat]", '[WalletCreateView]', 'doCreate, ThinNeo.Helper.GetNep2FromPrivateKey error => ', e.toString());
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
            constructor(txid, n, asset = "") {
                this.n = n;
                this.txid = txid;
                this.asset = asset;
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
                return this.txid == utxo.txid && this.n == utxo.n && this.asset == utxo.asset;
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
            inputFileI.classList.add("pc_upload", "iconfont", "icon-bc-wenjianjia");
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
        key_esc() {
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
            this.div.classList.add("pc_bj", "pc_wallet");
            var walletTitle = this.objCreate("div");
            walletTitle.classList.add("pc_wallet_title");
            this.ObjAppend(this.div, walletTitle);
            var walletTitleH1 = this.objCreate("h1");
            walletTitleH1.classList.add("iconfont", "icon-bc-blacat");
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
            iCreateWallet.classList.add("iconfont", "icon-bc-chuangjian1");
            this.ObjAppend(createWallet, iCreateWallet);
            var importWallet = this.objCreate("button");
            importWallet.textContent = BlackCat.Main.langMgr.get("walletView_import");
            importWallet.classList.add("pc_importWallet");
            importWallet.onclick = () => {
                BlackCat.Main.viewMgr.change("WalletImportView");
            };
            this.ObjAppend(this.div, importWallet);
            var iImportWallet = this.objCreate("i");
            iImportWallet.classList.add("iconfont", "icon-bc-daoru1");
            this.ObjAppend(importWallet, iImportWallet);
        }
        key_esc() {
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
        static addUserWalletLogs(uid, token, txid, g_id, cnts, type, params, net_type, trust = "0", net_fee = "", type_detail = "0") {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_wallet.logss', { uid: uid, token: token, txid: txid, g_id: g_id, cnts: cnts, type: type, params: params, net_type: net_type, trust: trust, net_fee: net_fee, type_detail: type_detail });
            });
        }
        static getWalletListss(uid, token, page, num, net_type, pedding) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_wallet.listss', { uid: uid, token: token, page: page, num: num, net_type: net_type, pedding: pedding });
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
        static registerByPhone(phone, code, pwd, region, uid, invite_code, refer = "0") {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_phone.register_pass', { phone: phone, code: code, pwd: pwd, region: region, uid: uid, invite_code: invite_code, refer: refer });
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
        static validInvite(invite_code) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.valid_register', { invite_code: invite_code });
            });
        }
        static registerByEmail(email, code, pwd, region, uid, invite_code, refer = "0") {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_email.register_pass', { email: email, code: code, pwd: pwd, region: region, uid: uid, invite_code: invite_code, refer: refer });
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
        static modUserArea(uid, token, region) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.mod_region', { uid: uid, token: token, region: region });
            });
        }
        static modUserFee(uid, token, service_charge) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user.mod_serviceCharge', { uid: uid, token: token, serviceCharge: service_charge });
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
        static getExchangeInfo(uid, token, src_coin, net_type, exchange) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('wallet_transfer.get_info', { uid: uid, token: token, src_coin: src_coin, net_type: net_type, exchange: exchange });
            });
        }
        static getOtherAddress(uid, token, type_src, net_type) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('wallet_transfer.get_other_address', { uid: uid, token: token, type_src: type_src, net_type: net_type });
            });
        }
        static transferByOther(uid, token, type_src, type, price, count, net_type, txid, c_hash) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('wallet_transfer.buy', { uid: uid, token: token, type_src: type_src, type: type, price: price, count: count, net_type: net_type, txid: txid, c_hash: c_hash });
            });
        }
        static getBctIframe(uid, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('wallet_transfer.get_pay_add', { uid: uid, token: token });
            });
        }
        static getGameAssets(uid, token, assets, appid = "") {
            return __awaiter(this, void 0, void 0, function* () {
                return this.common('user_wallet.get_game_assets', { uid: uid, token: token, assets: assets, appid: appid });
            });
        }
    }
    ApiTool.api_version = "2";
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
        _updateUserInfo(userinfo) {
            return __awaiter(this, void 0, void 0, function* () {
                for (let k in userinfo) {
                    this.info[k] = userinfo[k];
                }
                localStorage.setItem(this.cacheKey, JSON.stringify(this.info));
            });
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
                    this._updateUserInfo(api_userinfo.data);
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
                    var height = yield tools.WWW.api_getHeight_nodes();
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
            static makeTran(utxos, targetaddr, assetid, sendcount, net_fee = Neo.Fixed8.Zero, left_fee = 0, split = false) {
                var split_num = 10;
                var split_min = 1;
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
                var sendcounts = sendcount.add(net_fee);
                for (var i = 0; i < us.length; i++) {
                    var input = new ThinNeo.TransactionInput();
                    input.hash = us[i].txid.hexToBytes().reverse();
                    input.index = us[i].n;
                    input["_addr"] = us[i].addr;
                    tran.inputs.push(input);
                    count = count.add(us[i].count);
                    scraddr = us[i].addr;
                    clonearr.shift();
                    old.push(new tools.OldUTXO(us[i].txid, us[i].n, assetid));
                    if (split) {
                        if (us.length >= split_num) {
                            if (count.compareTo(sendcount) > 0) {
                                break;
                            }
                        }
                    }
                    else {
                        if (count.compareTo(sendcount) > 0) {
                            break;
                        }
                    }
                    if (us.length >= split_num && count.compareTo(sendcounts) > 0) {
                        break;
                    }
                }
                if (count.compareTo(sendcounts) >= 0) {
                    tran.outputs = [];
                    if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                        var output = new ThinNeo.TransactionOutput();
                        output.assetId = assetid.hexToBytes().reverse();
                        output.value = sendcount;
                        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                        tran.outputs.push(output);
                    }
                    if (left_fee == 0) {
                        var change = count.subtract(sendcounts);
                        if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                            if (split && change.compareTo(Neo.Fixed8.fromNumber(split_min)) > 0 && us.length < split_num) {
                                var change_num = change.getData().toNumber() / 100000000;
                                var change_int = Math.trunc(change_num);
                                var change_1 = change_int / split_num;
                                for (let i = 0; i < split_num; i++) {
                                    var outputchange = new ThinNeo.TransactionOutput();
                                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                                    outputchange.value = Neo.Fixed8.fromNumber(change_1);
                                    outputchange.assetId = assetid.hexToBytes().reverse();
                                    tran.outputs.push(outputchange);
                                }
                                var litt = change.subtract(Neo.Fixed8.fromNumber(change_int));
                                if (litt.compareTo(Neo.Fixed8.Zero) > 0) {
                                    var outputchange = new ThinNeo.TransactionOutput();
                                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                                    outputchange.value = litt;
                                    outputchange.assetId = assetid.hexToBytes().reverse();
                                    tran.outputs.push(outputchange);
                                }
                                console.log('[BlaCat]', "[cointool]", "makeTran, 拆分utxo, change_1 =>", change_1, "litt =>", litt.getData().toNumber());
                            }
                            else {
                                var outputchange = new ThinNeo.TransactionOutput();
                                outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                                outputchange.value = change;
                                outputchange.assetId = assetid.hexToBytes().reverse();
                                tran.outputs.push(outputchange);
                            }
                        }
                    }
                    res.err = false;
                    res.info = { "tran": tran, "oldarr": old };
                }
                else {
                    throw new Error("pay_not_enough_money");
                }
                return res;
            }
            static makeTranMulti(utxos, targets, assetid, net_fee = Neo.Fixed8.Zero) {
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
                var sendcounts = sendcount.add(net_fee);
                for (var i = 0; i < us.length; i++) {
                    var input = new ThinNeo.TransactionInput();
                    input.hash = us[i].txid.hexToBytes().reverse();
                    input.index = us[i].n;
                    input["_addr"] = us[i].addr;
                    tran.inputs.push(input);
                    count = count.add(us[i].count);
                    scraddr = us[i].addr;
                    clonearr.shift();
                    old.push(new tools.OldUTXO(us[i].txid, us[i].n, assetid));
                    if (count.compareTo(sendcounts) > 0) {
                        break;
                    }
                }
                if (count.compareTo(sendcounts) >= 0) {
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
                    var change = count.subtract(sendcounts);
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
            static rawTransaction(targetaddr, asset, count, net_fee = Neo.Fixed8.Zero) {
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
                    if (asset == tools.CoinTool.id_GAS) {
                        try {
                            var tranres = CoinTool.makeTran(utxos, targetaddr, asset, _count, net_fee, 0);
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
                            var height = yield tools.WWW.api_getHeight_nodes();
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
                    }
                    else {
                        try {
                            var tranres = CoinTool.makeTran(utxos, targetaddr, asset, _count, Neo.Fixed8.Zero, 0);
                            if (net_fee.compareTo(Neo.Fixed8.Zero) > 0) {
                                var user_makeTranRes = tools.CoinTool.makeTran(utxos, add, tools.CoinTool.id_GAS, Neo.Fixed8.Zero, net_fee);
                                var user_tran = user_makeTranRes.info.tran;
                                for (let i = 0; i < user_tran.inputs.length; i++) {
                                    tranres.info.tran.inputs.push(user_tran.inputs[i]);
                                }
                                for (let i = 0; i < user_tran.outputs.length; i++) {
                                    tranres.info.tran.outputs.push(user_tran.outputs[i]);
                                }
                                var user_oldarr = user_makeTranRes.info.oldarr;
                                for (let i = 0; i < user_oldarr.length; i++) {
                                    tranres.info.oldarr.push(user_oldarr[i]);
                                }
                            }
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
                            var height = yield tools.WWW.api_getHeight_nodes();
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
                    }
                });
            }
            static rawTransactionMulti(targets, asset, net_fee = Neo.Fixed8.Zero) {
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
                        var tranres = CoinTool.makeTranMulti(utxos, targets, asset, net_fee);
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
                        var height = yield tools.WWW.api_getHeight_nodes();
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
            static contractInvokeTrans_attributes(script, net_fee = "0", not_send = false) {
                return __awaiter(this, void 0, void 0, function* () {
                    let current = tools.LoginInfo.getCurrentLogin();
                    var addr = current.address;
                    var tran;
                    if (Number(net_fee) > 0) {
                        try {
                            var user_utxos_assets = yield tools.CoinTool.getassets();
                            console.log("[BlaCat]", '[cointool]', 'contractInvokeTrans_attributes, user_utxos_assets => ', user_utxos_assets);
                            var user_makeTranRes = tools.CoinTool.makeTran(user_utxos_assets, BlackCat.Main.user.info.wallet, tools.CoinTool.id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)));
                            var tran = user_makeTranRes.info.tran;
                            var oldarr = user_makeTranRes.info.oldarr;
                            console.log("[BlaCat]", '[cointool]', 'contractInvokeTrans_attributes, user_makeTranRes => ', user_makeTranRes);
                        }
                        catch (e) {
                            var res = new tools.Result();
                            res.err = true;
                            res.info = e.toString();
                            return res;
                        }
                    }
                    else {
                        tran = new ThinNeo.Transaction();
                        tran.inputs = [];
                        tran.outputs = [];
                    }
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
                    let txid = tran.GetHash().clone().reverse().toHexString();
                    var res = new tools.Result();
                    if (not_send) {
                        res.err = false;
                        res.info = txid;
                        res['data'] = data;
                        if (Number(net_fee) > 0 && oldarr) {
                            var height = yield tools.WWW.api_getHeight_nodes();
                            oldarr.map(old => old.height = height);
                            res['oldarr'] = oldarr;
                        }
                        return res;
                    }
                    var result = yield tools.WWW.api_postRawTransaction(data);
                    if (result["sendrawtransactionresult"]) {
                        if (!result["txid"]) {
                            result["txid"] = txid;
                        }
                        if (Number(net_fee) > 0 && oldarr) {
                            var height = yield tools.WWW.api_getHeight_nodes();
                            oldarr.map(old => old.height = height);
                            tools.OldUTXO.oldutxosPush(oldarr);
                        }
                    }
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
            static nep5Transaction(address, tatgeraddr, asset, amount, net_fee = "0", not_send = false) {
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
                        console.log("[BlaCat]", '[cointool]', '[nep5Transaction] random_int from js random => ', math_rand);
                        random_int = new Neo.BigInteger(math_rand);
                    }
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    sb.EmitParamJson(["(address)" + address, "(address)" + tatgeraddr, "(integer)" + intv]);
                    sb.EmitPushString("transfer");
                    sb.EmitAppCall(scriptaddress);
                    var result = yield CoinTool.contractInvokeTrans_attributes(sb.ToArray(), net_fee, not_send);
                    return result;
                });
            }
            static getNep5Assets(id_hash) {
                return __awaiter(this, void 0, void 0, function* () {
                    var height = yield tools.WWW.api_getHeight_nodes();
                    var scriptHash = ThinNeo.Helper.GetAddressFromScriptHash(id_hash.hexToBytes().reverse());
                    var utxos = yield tools.WWW.api_getUTXO(scriptHash);
                    var olds = tools.OldUTXO.getOldutxos();
                    var olds2 = new Array();
                    for (let n = 0; n < olds.length; n++) {
                        const old = olds[n];
                        let findutxo = false;
                        for (let i = 0; i < utxos.length; i++) {
                            let utxo = utxos[i];
                            if (utxo.txid == old.txid && old.n == utxo.n && height - old.height <= 2 && utxo.asset == old.asset) {
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
            static getCgasAssets(id_CGAS = this.id_CGAS, amount) {
                return __awaiter(this, void 0, void 0, function* () {
                    var scriptHash = ThinNeo.Helper.GetAddressFromScriptHash(id_CGAS.hexToBytes().reverse());
                    var utxos = yield tools.WWW.api_getAvailableUTXOS(scriptHash, amount);
                    var assets = {};
                    for (var i in utxos) {
                        var item = utxos[i];
                        var asset = CoinTool.id_GAS;
                        if (assets[asset] == undefined || assets[asset] == null) {
                            assets[asset] = [];
                        }
                        let utxo = new tools.UTXO();
                        utxo.addr = scriptHash;
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
        CoinTool.id_CGAS = "";
        CoinTool.id_CGAS_OLD = [];
        CoinTool.id_CNEO = "";
        CoinTool.id_CNEO_OLD = [];
        CoinTool.id_BCT = "";
        CoinTool.id_BCP = "";
        CoinTool.id_BCT_DESTROY = "";
        CoinTool.id_BTC = "";
        CoinTool.id_BTC_DESTROY = "";
        CoinTool.id_ETH = "";
        CoinTool.id_ETH_DESTROY = "";
        CoinTool.id_CNEO_DESTROY = "";
        CoinTool.id_bancor = "";
        CoinTool.BUY_VIP_ADDR = "";
        CoinTool.assetID2name = {};
        CoinTool.name2assetID = {};
        tools.CoinTool = CoinTool;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class floatNum {
        static strip(num, precision = 12) {
            return +parseFloat(num.toPrecision(precision));
        }
        static digitLength(num) {
            const eSplit = num.toString().split(/[eE]/);
            const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
            return len > 0 ? len : 0;
        }
        static float2Fixed(num) {
            if (num.toString().indexOf('e') === -1) {
                return Number(num.toString().replace('.', ''));
            }
            const dLen = floatNum.digitLength(num);
            return dLen > 0 ? num * Math.pow(10, dLen) : num;
        }
        static checkBoundary(num) {
            if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
                console.warn(`${num} is beyond boundary when transfer to integer, the results may not be accurate`);
            }
        }
        static times(num1, num2, ...others) {
            if (others.length > 0) {
                return floatNum.times(floatNum.times(num1, num2), others[0], ...others.slice(1));
            }
            const num1Changed = floatNum.float2Fixed(num1);
            const num2Changed = floatNum.float2Fixed(num2);
            const baseNum = floatNum.digitLength(num1) + floatNum.digitLength(num2);
            const leftValue = num1Changed * num2Changed;
            floatNum.checkBoundary(leftValue);
            return leftValue / Math.pow(10, baseNum);
        }
        static plus(num1, num2, ...others) {
            if (others.length > 0) {
                return floatNum.plus(floatNum.plus(num1, num2), others[0], ...others.slice(1));
            }
            const baseNum = Math.pow(10, Math.max(floatNum.digitLength(num1), floatNum.digitLength(num2)));
            return (floatNum.times(num1, baseNum) + floatNum.times(num2, baseNum)) / baseNum;
        }
        static minus(num1, num2, ...others) {
            if (others.length > 0) {
                return floatNum.minus(floatNum.minus(num1, num2), others[0], ...others.slice(1));
            }
            const baseNum = Math.pow(10, Math.max(floatNum.digitLength(num1), floatNum.digitLength(num2)));
            return (floatNum.times(num1, baseNum) - floatNum.times(num2, baseNum)) / baseNum;
        }
        static divide(num1, num2, ...others) {
            if (others.length > 0) {
                return floatNum.divide(floatNum.divide(num1, num2), others[0], ...others.slice(1));
            }
            const num1Changed = floatNum.float2Fixed(num1);
            const num2Changed = floatNum.float2Fixed(num2);
            floatNum.checkBoundary(num1Changed);
            floatNum.checkBoundary(num2Changed);
            return floatNum.times((num1Changed / num2Changed), Math.pow(10, floatNum.digitLength(num2) - floatNum.digitLength(num1)));
        }
        static round(num, ratio) {
            const base = Math.pow(10, ratio);
            return floatNum.divide(Math.round(floatNum.times(num, base)), base);
        }
        static addZero(num, ratio) {
            var s_x = num.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + ratio) {
                s_x += '0';
            }
            return s_x;
        }
    }
    BlackCat.floatNum = floatNum;
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
            this.service_charge = "";
            this.lv = "";
            this.is_vip = "";
            this.vip_end_time = "";
            this.is_forever_vip = "";
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
            console.log("[BlaCat]", '[SDK]', 'init ...');
            if (SDK.is_init === false) {
                SDK.main = new BlackCat.Main();
                SDK.main.init(appid, appkey, listener, lang);
            }
            SDK.is_init = true;
        }
        static initex(params, callback = null) {
            console.log("[BlaCat]", '[SDK]', 'initex ...');
            if (SDK.is_init === false) {
                SDK.main = new BlackCat.Main();
                SDK.main.initex(params, callback);
            }
            SDK.is_init = true;
        }
        static setLang(type) {
            console.log("[BlaCat]", '[SDK]', 'setLang ...');
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init');
                return;
            }
            this.main.setLang(type);
        }
        static showMain() {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init');
                return;
            }
            this.main.showMain();
        }
        static showIcon() {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init');
                return;
            }
            this.main.showIcon();
        }
        static login(callback = null) {
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '请先初始化init');
                return;
            }
            SDK.main.start(callback);
        }
        static invokescript(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
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
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                SDK.main.makeRawTransaction(params, callback);
            });
        }
        static makeRecharge(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                var res = yield SDK.main.makeRecharge(params, callback);
            });
        }
        static confirmAppNotify(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
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
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                    return;
                }
                var res = yield SDK.main.getBalance();
                if (callback)
                    callback(res);
            });
        }
        static getHeight(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                var res = yield SDK.main.getHeight();
                if (callback)
                    callback(res);
            });
        }
        static getUserInfo(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                }
                var res = yield SDK.main.getUserInfo();
                if (callback)
                    callback(res);
            });
        }
        static makeGasTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                var res = yield SDK.main.makeGasTransfer(params, callback);
            });
        }
        static makeTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                var res = yield SDK.main.makeTransfer(params, callback);
            });
        }
        static makeNeoTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                var res = yield SDK.main.makeNeoTransfer(params, callback);
            });
        }
        static makeGasTransferMulti(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                var res = yield SDK.main.makeGasTransferMulti(params, callback);
            });
        }
        static getNetType(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
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
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                SDK.main.setDefaultNetType(type);
            });
        }
        static bancor(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                SDK.main.bancor(params, callback);
            });
        }
        static buyVip(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '请先登录');
                    this.showMain();
                    return;
                }
                SDK.main.buyVip(params, callback);
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
                    let height = yield tools.WWW.api_getHeight_nodes();
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
                            console.log("[BlaCat]", '[wallet]', 'readWalletFile, 钱包文件解析异常', this.filestr);
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
                        console.log("[BlaCat]", '[wallet]', '打开蓝鲸淘钱包文件');
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
                    console.log("[BlaCat]", '[wallet]', '无有效的钱包文件');
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
                    var r = yield tools.WWW.cli_getInvokescript(data);
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
            bancorTransaction(params, net_fee) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield this.makeRawTransaction(params, "0", net_fee, false);
                    if (res.err === false) {
                        var logRes = yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, res.info.txid, "0", "", "15", JSON.stringify(params), BlackCat.Main.netMgr.type, "0", net_fee);
                        BlackCat.Main.appWalletLogId = logRes.data;
                    }
                    return res;
                });
            }
            makeRawTransaction(params, trust = "0", net_fee, upload_log = true) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = new tools.Result();
                    var login = tools.LoginInfo.getCurrentLogin();
                    var addr = login.address;
                    var tran = new ThinNeo.Transaction();
                    tran.inputs = [];
                    tran.outputs = [];
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    if (Number(net_fee) > 0) {
                        tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                        try {
                            var user_utxos_assets = yield tools.CoinTool.getassets();
                            console.log("[BlaCat]", '[wallet]', 'makeRawTransaction, user_utxos_assets => ', user_utxos_assets);
                            var user_makeTranRes = tools.CoinTool.makeTran(user_utxos_assets, addr, tools.CoinTool.id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)), 0, true);
                            var user_tran = user_makeTranRes.info.tran;
                            var oldarr = user_makeTranRes.info.oldarr;
                            tran.inputs = user_tran.inputs;
                            tran.outputs = user_tran.outputs;
                            console.log("[BlaCat]", '[wallet]', 'makeRawTransaction, user_makeTranRes => ', user_makeTranRes);
                        }
                        catch (e) {
                            res.err = true;
                            res.info = { error: "get_net_fee error" };
                            return res;
                        }
                    }
                    var sb = new ThinNeo.ScriptBuilder();
                    var random_int;
                    try {
                        var array = new Uint8Array(2333);
                        var random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(array);
                        random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    }
                    catch (e) {
                        var math_rand = parseInt((Math.random() * 10000000).toString());
                        console.log("[BlaCat]", '[wallet]', 'makerawtransaction, math_rand => ', math_rand);
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
                    let txid = tran.GetHash().clone().reverse().toHexString();
                    var data = tran.GetRawData();
                    var r = yield tools.WWW.cli_postRawTransaction(data);
                    if (r) {
                        if (r["txid"] || r["sendrawtransactionresult"]) {
                            if (!r["txid"] || r["txid"] == "") {
                                r["txid"] = txid;
                            }
                            res.err = false;
                            res.info = { txid: r["txid"] };
                            if (upload_log) {
                                var logRes = yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, r["txid"], BlackCat.Main.appid, "", "5", JSON.stringify(params), BlackCat.Main.netMgr.type, trust, net_fee);
                                BlackCat.Main.appWalletLogId = logRes.data;
                            }
                            if (Number(net_fee) > 0) {
                                var height = yield tools.WWW.api_getHeight_nodes();
                                oldarr.map(old => old.height = height);
                                tools.OldUTXO.oldutxosPush(oldarr);
                            }
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
            makeRecharge(params, trust, net_fee) {
                return __awaiter(this, void 0, void 0, function* () {
                    trust = "0";
                    var res = new tools.Result();
                    try {
                        var t_addr = tools.LoginInfo.getCurrentAddress();
                        var t_taaddr = BlackCat.Main.app_recharge_addr;
                        var t_asset = params.nnc;
                        var t_amount = params.count.toString();
                        var tranRes = yield tools.CoinTool.nep5Transaction(t_addr, t_taaddr, t_asset, t_amount, net_fee);
                    }
                    catch (e) {
                        console.log("[BlaCat]", "[wallet]", "makeRecharge error => ", e.toString());
                        res.err = true;
                        res.info = { error: "post makeRecharge error" };
                        return res;
                    }
                    if (!tranRes["err"]) {
                        if (tranRes.info) {
                            res.err = false;
                            res.info = { txid: tranRes.info };
                            var logRes = yield BlackCat.ApiTool.addUserWalletLogs(BlackCat.Main.user.info.uid, BlackCat.Main.user.info.token, tranRes.info, BlackCat.Main.appid, params.count.toString(), "3", JSON.stringify(params), BlackCat.Main.netMgr.type, trust, net_fee, BlackCat.PayTransferView.log_type_detail[params.type.toLowerCase()]);
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
                    console.log("[BlaCat]", "[wallet]", "makeRechargeRes => ", res);
                    return res;
                });
            }
            closeWallet() {
                tools.StorageTool.delStorage("current-address");
                tools.StorageTool.delStorage("login-info-arr");
                console.log("[BlaCat]", '[wallet]', 'closeWallet ...');
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
            static api_getHeight_nodes(nodes_url = WWW.api_nodes) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(nodes_url, "getblockcount");
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    var height = parseInt(r[0]["blockcount"]) - 1;
                    return height;
                });
            }
            static api_getHeight_clis(clis_url = WWW.api_clis) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(clis_url, "getblockcount");
                    str += "&uid=" + BlackCat.Main.randNumber;
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    var height = parseInt(r[0]["blockcount"]) - 1;
                    return height;
                });
            }
            static api_getAllAssets() {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api_nodes, "getallasset");
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getAllNep5AssetBalanceOfAddress(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("getallnep5assetofaddress", address, 1);
                    var result = yield fetch(WWW.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getUTXO(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api_nodes, "getutxo", address);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getAvailableUTXOS(address, amount) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("getavailableutxos", address, amount);
                    var result = yield fetch(WWW.api_cgas, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getBalance(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api_nodes, "getbalance", address);
                    var value = yield fetch(str, { "method": "get" });
                    var json = yield value.json();
                    var r = json["result"];
                    return r;
                });
            }
            static getNep5Asset(asset) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("getnep5asset", asset);
                    var result = yield fetch(WWW.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static cli_postRawTransaction(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    var cli = 0;
                    if (WWW.api_clis && WWW.api_clis != "") {
                        cli = 1;
                    }
                    var api_url = WWW.api_nodes;
                    if (cli == 1) {
                        api_url = WWW.api_clis;
                    }
                    var postdata = WWW.makeRpcPostBody("sendrawtransaction", data.toHexString());
                    if (cli == 1)
                        postdata["uid"] = BlackCat.Main.randNumber;
                    var result = yield fetch(api_url, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static api_postRawTransaction(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = WWW.makeRpcPostBody("sendrawtransaction", data.toHexString());
                    var result = yield fetch(WWW.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static cli_getInvokescript(scripthash) {
                return __awaiter(this, void 0, void 0, function* () {
                    var cli = 0;
                    if (WWW.api_clis && WWW.api_clis != "") {
                        cli = 1;
                    }
                    var api_url = WWW.api_nodes;
                    if (cli == 1) {
                        api_url = WWW.api_clis;
                    }
                    var str = WWW.makeRpcUrl(api_url, "invokescript", scripthash.toHexString());
                    if (cli == 1) {
                        str += "&uid=" + BlackCat.Main.randNumber;
                    }
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (json["result"] == null)
                        return null;
                    var r = json["result"][0];
                    return r;
                });
            }
            static rpc_getInvokescript(scripthash) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.api_nodes, "invokescript", scripthash.toHexString());
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
                    var str = WWW.makeRpcUrl(WWW.api_nodes, "getrawtransaction", txid);
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
                    var str = WWW.makeRpcUrl(WWW.api_nodes, "getcontractstate", scriptaddr);
                    var value = yield fetch(str, { "method": "get" });
                    var json = yield value.json();
                    var r = json["result"][0];
                    return r;
                });
            }
        }
        tools.WWW = WWW;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
//# sourceMappingURL=code.js.map