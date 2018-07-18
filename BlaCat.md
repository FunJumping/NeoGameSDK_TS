# **BlaCatSDK使用文档**

本文讲述如何使用NEOGAMESDK(BlaCatSDK)。

## 一、回调方式说明
NEOGAMESDK支持两种回调方式，一种是初始化SDK时注册回调函数方式（推荐），一种是函数回调方式。

回调方式一（推荐）：

    var listener = function(data)
    {
    	// 回调处理，data是JSON格式String
		var res = JSON.parse(data)
		console.log('listener => ', res)
		switch (res.cmd) {
			case "loginRes": // 登录回调
				var loginInfo = res.data;
				// 此处需要发送接收到的数据到服务端验证后再登录应用
				break;
			case "invokescriptRes": // 合约读取调用
				var params = res.data.params; // 合约调用参数
				var result = rs.data.res; // 合约调用结果
				if (result.err == true) {
					// 执行失败
				}
				else {
					// 执行成功
					var success_data = result.info;
				}
				break;
			case "makeRawTransactionRes": // 合约写入请求结果
				// 回调数据格式参考invokescriptRes
				break;
			case "makeRechargeRes": // 充值回调
				// 回调数据格式参考invokescriptRes
				break;
			case "makeGasTransferRes": // GAS转账回调
				// 回调数据格式参考invokescriptRes
				break;
			case "confirmAppNotifyRes": // 交易通知接收确认回调
				// 回调数据格式参考invokescriptRes
				break;
			case "getBalanceRes": // 获取余额
				var result = res.data;
				var sgas = result.sgas;
				var gas = result.gas;
				break;
			case "getUserInfoRes": // 获取登录用户信息
				var userInfo = res.data;
				break;
			case "getNetTypeRes": // 获取网络类型
				var net_type = res.data;
				if (net_type == 1) {
					// 主网
				}
				else if (net_type == 2) {
					// 测试网
				}
				break;
			case "changeNetTypeRes": // 网络切换回调
				var net_type = res.data;
				if (net_type == 1) {
					// 主网
				}
				else if (net_type == 2) {
					// 测试网
				}
				break;
		}
    };

回调方式二：
    
    BlackCat.SDK.functionName(data, function(res){  
	    //回调结果处理
	})
## 二、文件引入


    <link rel="stylesheet" href="res/css/panel.css" type="text/css" />
    <script src="lib/rollup/aes.js"></script>
    <script src="lib/component/aes.js"></script>
    <script src="lib/component/mode-ecb.js"></script>
    <script src="lib/component/pad-nopadding.js"></script>
    <script src="lib/scrypt.js"></script>
    <script src="lib/jsrsasign.js"></script>
    <script src="lib/neo-ts.js"></script>
    <script src="lib/code.js"></script>


##三、接口说明
### 1、初始化
使用NEOGAMESDK必须先执行初始化。
`BlackCat.SDK.init(appid, appkey, listener, lang)`

**参数说明：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|appid |是  |string |SDK分配的appid   |
|appkey |是  |string |SDK分配的appkey   |
|listener |是  |function |应用注册的SDK回调函数   |
|lang |否  |string |SDK语言，默认cn（中文），可取值cn、en   |
**返回说明：** 
无返回值

### 2、登录
初始化后，需调用登录方法。
``` 
  // 方式一，结果在listener通知
  BlackCat.SDK.login()
  
  // 方式二
  BlackCat.SDK.login(function(res){
    // 接口回调
  })
```

**返回说明：** 
``` 
// 方式一
{
    "cmd": "loginRes",
    "data": {
        "g_id": "5",
        "time": 1531891115,
        "uid": "sj_xxs23",
        "wallet": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
        "sign": "40d48798189ec210153339d7a1cf71e5"
    }
}
  
// 方式二
{
	"g_id": "5",
	"time": 1531891115,
	"uid": "sj_xxs23",
	"wallet": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
	"sign": "40d48798189ec210153339d7a1cf71e5"
}
```

**特别说明：** 
接口返回的参数验证，请到应用服务端验证数据有效性，不要在客户端上做登录验证

### 3、发起充值
应用客户端调用SDK发起充值接口，发起链上支付交易。以下为支付0.001个sgas代码。
``` 
  var params = { count: "0.001", extString: "makeRecharge" };
  
  // 方式一，结果在listener通知
  BlackCat.SDK.makeRecharge(params)
  
  // 方式二
  BlackCat.SDK.makeRecharge(params, function(res){
    // 接口回调
    if（res.err == false）{
      // 获取支付交易提交成功的txid
      var txid = res.info.txid;
      alert('支付提交成功，等待链上确认');
    }
  })
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|count |是  |string |需要转换sgas的数量   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
// 方式一的回调data：
{
    "cmd": "makeRechargeRes",
    "data": {
        "params": {
            "count": "0.001",
            "extString": "makeRecharge",
            "nnc": "0x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54",
            "sbParamJson": [
                "(address)AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
                "(address)ASZzR4Qm7iVbdUnLrRA7vBMEoX1dnmXeQe",
                "(integer)100000"
            ],
            "sbPushString": "transfer"
        },
        "res": {
            "err": false,
            "info": {
                "txid": "0x0bc5dddcde95b4de9f81cb39e06d43ab157d62ed6fb4e12b49e1a6aa76e22c93"
            }
        }
    }
}

// 方式二的函数回调res：
{
	"err": false,
	"info": {
		"txid": "0xccf73255d0efd7fdc329af599378a6589dab38e24783e8b2e376a5336ce6b393"
	}
}
```

### 4、智能合约调用（读取）
以只读方式读取智能合约信息，该调用不需要钱包用户签名即可调用。
``` 
  var params = {
      sbParamJson: ["(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT"],
      sbPushString: "balanceOf",
      nnc: "0xcfe8f6824365f70d382733a92d8f373ee4faf222",
	  extString: "invokeScript"
  };
  
  // 方式一
  BlackCat.SDK.invokescript(params)
  
  // 方式二
  BlackCat.SDK.invokescript(params, function(res){
    // 接口回调
    if（res.err == false）{
      // 获取合约调用数据结果
      var stack = res.info.stack;
    }
  })
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|sbParamJson |是  |Array |合约参数数组   |
|sbPushString |是  |string |合约方法名   |
|nnc |是  |string |合约地址   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
// 方式一
{
    "cmd": "invokescriptRes",
    "data": {
        "params": {
            "nnc": "0xcfe8f6824365f70d382733a92d8f373ee4faf222",
            "sbParamJson": [
                "(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT"
            ],
            "sbPushString": "balanceOf",
            "extString": "invokeScript"
        },
        "res": {
            "err": false,
            "info": {
                "script": "14ba42009c9f422111ca847526b443467fc6483f3651c10962616c616e63654f666722f2fae43e378f2da93327380df7654382f6e8cf",
                "state": "HALT, BREAK",
                "gas_consumed": "0.326",
                "stack": [
                    {
                        "type": "ByteArray",
                        "value": ""
                    }
                ]
            }
        }
    }
}

// 方式二
{
	"err": false,
	"info": {
		"script": "14ba42009c9f422111ca847526b443467fc6483f3651c10962616c616e63654f666722f2fae43e378f2da93327380df7654382f6e8cf",
		"state": "HALT, BREAK",
		"gas_consumed": "0.326",
		"stack": [{
			"type": "ByteArray",
			"value": ""
		}]
	}
}
```

### 5、智能合约调用（写入）
以写方式操作智能合约，该调用需要钱包用户签名。
``` 
  var params = {
      sbParamJson: ["(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT","(address)AWPVmAobCJGxrupvQSnovofakaVb2ue65a","(integer)100000"],
      sbPushString: "transfer",
      nnc: "0x3f7420285874867c30f32e44f304fd62ad1e9573",
	  extString: "makeRawTransaction"
  };
  
  // 方式一
  BlackCat.SDK.makeRawTransaction(params)
  
  // 方式二
  BlackCat.SDK.makeRawTransaction(params, function(res){
    // 接口回调
    if（res.err == false）{
      // 获取合约执行结果
      var txid = res.info.txid;
    }
  })
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|sbParamJson |是  |Array |合约参数数组   |
|sbPushString |是  |string |合约方法名   |
|nnc |是  |string |合约地址   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
方式一：
{
    "cmd": "makeRawTransactionRes",
    "data": {
        "params": {
            "nnc": "0x3f7420285874867c30f32e44f304fd62ad1e9573",
            "sbParamJson": [
                "(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT",
                "(address)AWPVmAobCJGxrupvQSnovofakaVb2ue65a",
                "(integer)100000"
            ],
            "sbPushString": "transfer",
            "extString": "makeRawTransaction"
        },
        "res": {
            "err": false,
            "info": {
                "txid": "0x0478bc0bb5757db60d1a1a6c5f774d1a33be5b493156788043712585e7abb779"
            }
        }
    }
}

// 方式二
{
	"err": false,
	"info": {
		"txid": "0x0478bc0bb5757db60d1a1a6c5f774d1a33be5b493156788043712585e7abb779"
	}
}
```

### 6、GAS转账
执行GAS转账操作，该调用需要钱包用户签名。
``` 
var params = {
	toaddr: "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
	count: "0.01",
	extString: "makeGasTransfer"
}

// 方式一
BlackCat.SDK.makeGasTransfer(params)

// 方式二
BlackCat.SDK.makeGasTransfer(params, function(res){
    console.log("makeGasTransfer.callback.function.res ", res)
})
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|toaddr |是  |String |转账收款地址   |
|count |是  |string |转账数量   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
方式一：
{
    "cmd": "makeGasTransferRes",
    "data": {
        "params": {
            "toaddr": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
            "count": "0.01",
            "extString": "makeGasTransfer"
        },
        "res": {
            "err": false,
            "info": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
        }
    }
}

方式二：
{
	"res": {
		"err": false,
		"info": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
	}
}
```

### 7、交易完成通知
执行转账、合约写入等需要打开钱包的操作，会收到交易完成的通知。如果本通知state=1，应用应再判断执行结果，本通知只表示该交易已经在链上执行。

**返回示例**

``` 
// 方式一（只支持方式一的回调方式）
{
    "cmd": "getAppNotifysRes",
    "data": [
        {
            "id": "367",
            "g_id": "5",
            "txid": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32",
            "state": "1",
            "params": "{\"sbPushString\":\"transfer\", \"toaddr\":\"undefined\", \"count\": \"0.01\"}"
        }
    ]
}
```


### 8、交易完成通知确认
应用客户端收到交易完成通知后，必须调用此接口进行回复，否则交易完成通知数据会一直传回。
``` 
var params = {
	txid: "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
}

// 方式一
BlackCat.SDK.confirmAppNotify(params)

// 方式二
BlackCat.SDK.confirmAppNotify(params, function(res){
	console.log('[BlackCat]', 'confirmAppNotify.callback.function.res => ', res)
})
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|txid |是  |String |交易txid   |

**返回示例**

``` 
// 方式一
{
    "cmd": "confirmAppNotifyRes",
    "data": {
        "params": {
            "txid": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
        },
        "res": {
            "err": false,
            "info": 1
        }
    }
}
// 方式二
{
	"res": {
		"err": false,
		"info": 1
	}
}
```

### 9、余额查询
查询gas、sgas余额。
``` 
// 方式一
BlackCat.SDK.getBalance()

// 方式二
BlackCat.SDK.getBalance(function(res){
	console.log("getbalance.callback.function.res ", res)
})
```

**返回示例**

``` 
// 方式一：
{
    "cmd": "getBalanceRes",
    "data": {
        "sgas": 0.988,
        "gas": 1230.19491
    }
}
// 方式二：
{
	"sgas": 0,
	"gas": 1
}
```
### 10、获取登录用户信息
获取登录完成的用户信息。
``` 
// 方式一
BlackCat.SDK.getUserInfo()

// 方式二
BlackCat.SDK.getUserInfo(function(res){
	console.log('[BlackCat]', 'getUserInfo.callback.function.res => ', res)
})
```

**返回示例**

``` 
// 方式一
{
    "cmd": "getUserInfoRes",
    "data": {
        "uid": "sj_xxs23",
        "name": "136****3881",
        "invitor": "",
        "ip": "58.247.115.74",
        "lastlogin": "1531492182",
        "token": "8b6853ac07f3f30129eeaea498567b25",
        "jifen": "0",
        "wallet": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
        "region": "CN",
        "area": "",
        "email": "",
        "qq": "",
        "icon": ""
    }
}
// 方式二
{
  "uid": "sj_xxs23",
  "name": "136****3882",
  "invitor": "",
  "ip": "58.247.115.74",
  "lastlogin": "1531492354",
  "token": "6468aed6ea4f2e7add4d11ee84c6fd4a",
  "jifen": "0",
  "wallet": "AbYR3eUbPUcnenEfmbJ7Fc4DUZLabKD6Cf",
  "region": "CN",
  "area": "",
  "email": "",
  "qq": "",
  "icon": ""
}
```

### 11、获取当前网络类型
获取当前网络类型
``` 
// 方式一
BlackCat.SDK.getNetType()

// 方式二
BlackCat.SDK.getNetType(function(res){
	console.log("getNetType.callback.function.res ", res)
})
```

**返回示例**

``` 
// 方式一：
{
    "cmd": "getNetTypeRes",
    "data": 2
}
方式二：
2
```

### 12、设置语言
设置当前SDK语言，可选cn、en
``` 
BlackCat.SDK.setLang(lang)
```

### 13、显示SDK界面
显示SDK界面
``` 
BlackCat.SDK.showMain()
```

### 14、最小化SDK界面
最小化SDK界面
``` 
BlackCat.SDK.showIcon()
```





