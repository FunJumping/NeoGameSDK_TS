
var NEOGAMESDK = /** @class */ (function () {
    function NEOGAMESDK() {
    }
    // private static callback_makeRefundTransaction = {};
    // private static callback_makeTrans = {};
    // private static callback_getUTXO = {};
    NEOGAMESDK.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) {
            return unescape(r[2]);
        }
        return null; //返回参数值
    };
    NEOGAMESDK.getUrlParams = function () {
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
    };
    NEOGAMESDK.getRandom = function (callback) {
        var finished = false;
        do {
            var id = Math.random();
            if (!callback || !callback.hasOwnProperty(id)) {
                finished = true;
            }
        } while (finished === false);
        return id;
    };
    NEOGAMESDK.postMessagge = function (event) {
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
                    console.log('[NEOGAMESDK][postMessagge] getUserInfoRes[ ' + data.eventId + ' ] data => ', data.data);
                    NEOGAMESDK.callback_getUserInfo[data.eventId](data.data);
                    delete NEOGAMESDK.callback_getUserInfo[data.eventId];
                    break;
                case "getSgasBalanceRes":
                    // 获取sgas余额
                    console.log('[NEOGAMESDK][postMessagge] getSgasBalanceRes[ ' + data.eventId + ' ] data => ', data.data);
                    NEOGAMESDK.callback_getSgasBalance[data.eventId](data.data);
                    delete NEOGAMESDK.callback_getSgasBalance[data.eventId];
                    break;
                case "invokescriptRes":
                    // 合约读取
                    console.log('[NEOGAMESDK][postMessagge] invokescriptRes[ ' + data.eventId + ' ] data => ', data.data);
                    NEOGAMESDK.callback_invokescript[data.eventId](data.data);
                    delete NEOGAMESDK.callback_invokescript[data.eventId];
                    break;
                case "makeRawTransactionRes":
                    // 合约交易
                    console.log('[NEOGAMESDK][postMessagge] makeRawTransactionRes[ ' + data.eventId + ' ] data => ', data.data);
                    NEOGAMESDK.callback_makeRawTransaction[data.eventId](data.data);
                    delete NEOGAMESDK.callback_makeRawTransaction[data.eventId];
                    break;
                case "makeRechargeRes":
                    // 充值到游戏
                    console.log('[NEOGAMESDK][postMessagge] makeRechargeRes[ ' + data.eventId + ' ] data => ', data.data);
                    NEOGAMESDK.callback_makeRecharge[data.eventId](data.data);
                    delete NEOGAMESDK.callback_makeRecharge[data.eventId];
                    break;
                case "getRechargeRes":
                    // 充值到游戏查询
                    console.log('[NEOGAMESDK][postMessagge] getRechargeRes[ ' + data.eventId + ' ] data => ', data.data);
                    NEOGAMESDK.callback_getRecharge[data.eventId](data.data);
                    delete NEOGAMESDK.callback_getRecharge[data.eventId];
                    break;
                // case "makeRefundTransactionRes":
                //     // 退款
                //     console.log('[NEOGAMESDK][postMessagge] makeRefundTransactionRes[ ' + data.eventId + ' ] data => ', data.data)
                //     NEOGAMESDK.callback_makeRefundTransaction[ data.eventId ](data.data as Result);
                //     delete NEOGAMESDK.callback_makeRefundTransaction[ data.eventId ]
                //     break;
            }
        }
    };
    NEOGAMESDK.init = function () {
        console.log('[NEOGAMESDK][init] start ...');
        if (NEOGAMESDK.is_init === false) {
            window.addEventListener("message", NEOGAMESDK.postMessagge);
        }
        NEOGAMESDK.is_init = true;
    };
    // 获取登录用户信息
    NEOGAMESDK.getUserInfo = function (callback) {
        console.log('[NEOGAMESDK][getUserInfo] start ...');
        if (NEOGAMESDK.is_init === false) {
            console.log("[NEOGAMESDK][getUserInfo] please use init first !");
            return;
        }
        var eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_getUserInfo);
        NEOGAMESDK.callback_getUserInfo[eventId] = callback;
        console.log('[NEOGAMESDK][getUserInfo] eventId => ', eventId);
        var cmd = { "cmd": "getUserInfo", "eventId": eventId };
        parent.window.postMessage(JSON.stringify(cmd), "*");
    };
    // 获取登录用户sgas余额
    NEOGAMESDK.getSgasBalance = function (callback) {
        console.log('[NEOGAMESDK][getSgasBalance] start ...');
        if (NEOGAMESDK.is_init === false) {
            console.log('[NEOGAMESDK][getSgasBalance] please use init first !');
            return;
        }
        var eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_getSgasBalance);
        NEOGAMESDK.callback_getSgasBalance[eventId] = callback;
        console.log('[NEOGAMESDK][getSgasBalance] eventId => ', eventId);
        var cmd = { "cmd": "getSgasBalance", "eventId": eventId };
        parent.window.postMessage(JSON.stringify(cmd), "*");
    };
    // 合约读取
    NEOGAMESDK.invokescript = function (data, callback) {
        console.log('[NEOGAMESDK][invokescript] start ...');
        if (NEOGAMESDK.is_init === false) {
            console.log("'[NEOGAMESDK][invokescript] please use init first !");
            return;
        }
        var eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_invokescript);
        NEOGAMESDK.callback_invokescript[eventId] = callback;
        console.log('[NEOGAMESDK][invokescript] eventId => ', eventId);
        var cmd = { "cmd": "invokescript", "eventId": eventId, "data": data };
        parent.window.postMessage(JSON.stringify(cmd), "*");
    };
    // 合约交易
    NEOGAMESDK.makeRawTransaction = function (data, callback) {
        console.log('[NEOGAMESDK][makeRawTransaction] start ...');
        if (NEOGAMESDK.is_init === false) {
            console.log("[NEOGAMESDK][makeRawTransaction] please use init first !");
            return;
        }
        var eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_makeRawTransaction);
        NEOGAMESDK.callback_makeRawTransaction[eventId] = callback;
        console.log('[NEOGAMESDK][makeRawTransaction] eventId => ', eventId);
        var cmd = { "cmd": "makeRawTransaction", "eventId": eventId, "data": data };
        parent.window.postMessage(JSON.stringify(cmd), "*");
    };
    // 充值到游戏
    NEOGAMESDK.makeRecharge = function (data, callback) {
        console.log('[NEOGAMESDK][makeRecharge] start ... ');
        if (NEOGAMESDK.is_init === false) {
            console.log("[NEOGAMESDK][makeRecharge] please use init first !");
            return;
        }
        var eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_makeRecharge);
        NEOGAMESDK.callback_makeRecharge[eventId] = callback;
        console.log('[NEOGAMESDK][makeRecharge] eventId => ', eventId);
        var cmd = { "cmd": "makeRecharge", "eventId": eventId, "data": data };
        parent.window.postMessage(JSON.stringify(cmd), "*");
    };
    // 充值到游戏查询
    NEOGAMESDK.getRecharge = function (data, callback) {
        console.log('[NEOGAMESDK][getRecharge] start ... ');
        if (NEOGAMESDK.is_init === false) {
            console.log("[NEOGAMESDK][getRecharge] please use init first !");
            return;
        }
        var eventId = NEOGAMESDK.getRandom(NEOGAMESDK.callback_getRecharge);
        NEOGAMESDK.callback_getRecharge[eventId] = callback;
        console.log('[NEOGAMESDK][getRecharge] eventId => ', eventId);
        var cmd = { "cmd": "getRecharge", "eventId": eventId, "data": data };
        parent.window.postMessage(JSON.stringify(cmd), "*");
    };
    NEOGAMESDK.is_init = false;
    NEOGAMESDK.callback_getUserInfo = {};
    NEOGAMESDK.callback_getSgasBalance = {};
    NEOGAMESDK.callback_invokescript = {};
    NEOGAMESDK.callback_makeRawTransaction = {};
    NEOGAMESDK.callback_makeRecharge = {};
    NEOGAMESDK.callback_getRecharge = {};
    return NEOGAMESDK;
}());