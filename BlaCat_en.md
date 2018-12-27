
* [<strong>BlaCatSDK Usage Documentation</strong>](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#blacatsdk-usage-documentation)
	* [1、BlaCat Introduction](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#一BlacatIntroduction)
	* [2、Fundamental Application](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#二基础应用)
		* [1 SDK Introduction](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#1引入sdk)
		* [2、SDK Initialization（init）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#2初始化sdkinit)
		* [3、Login（login）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#3登录login)
		* [4、Recharge](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#4充值)
			* [1.Initiate Recharge（makeRecharge）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#1发起充值makerecharge)
			* [2.Confirm Recharge（Frontend）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#2确认充值前端)
				* [1））、On Chain Transaction Completion Process Callback（getAppNotifysRes）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#1交易链上处理完成回调getappnotifysres)
				* [2））Confirm Receipt（confirmAppNotify)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#2确认收到confirmappnotify)
			* [3）Confirm Recharge（Backend））](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#3确认充值后端)
				* [1））Interface Description](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#1接口说明)
				* [2））、sign Signature Algorithm](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#2sign签名算法)
				* [3））、sign Signature Algorithm（PHP）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#3sign签名算法php)
		* [5、Get Balance（getBalance）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#5获取余额getbalance)
		* [6、Retrieve User Information（getUserInfo）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#6获取用户信息getuserinfo)
		* [7、Get Current Network Category（getNetType）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#7获取当前网络类型getnettype)
		* [8、GAS Transfer（makeGasTransfer）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#8gas转账makegastransfer)
		* [9、GAS Batch Transfer（makeGasTransferMulti）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#9gas批量转账makegastransfermulti)
	* [3 Advanced Application](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#三进阶应用)
		* [1、How to Invoke Smart Contracts](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#1智能合约调用方式)
		* [2、Read Smart Contract（invokescript）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#2合约读取invokescript)
		* [3、Write Smart Contract（makeRawTransaction）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#3合约写入makerawtransaction)
	* [4 Supplementary Features](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#四辅助功能)
		* [1、Set Up SDK Language（setLang）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#1设置sdk语言setlang)
		* [2、Set Up Initial Default Network（setDefaultType）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#2设置初始默认网络setdefaulttype)
		* [3 Launch/ ThumbnailSDK（showMain/showIcon）](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#3展开缩略sdkshowmainshowicon)

# **BlaCatSDK Usage Documentation**

•	This document illustrates how to use the BlaCatSDK(NeoGameSDK) and how to access the NEO public blockchain。

## 1. BlaCat Introduction
•	BlaCat is a blockchain game platform running as a side chain based on NEO high-performance blockchain，The platform’s business mainly consists of：wallet、transaction/trading market、game platform and user community。BlaCat’s biggest technological feature is the ZoroChain，It provides an integrated blockchain technology solution for high-speed DAPP development。

## 2.Fundamental Applications
### •	1、SDK Introduction
•	To use the BlaCatSDK，you firstly need to access these necessary files to run the BlacatSDK

    <link rel="stylesheet" href="res/css/panel.css" type="text/css" />
    <script src="lib/rollup/aes.js"></script>
    <script src="lib/component/aes.js"></script>
    <script src="lib/component/mode-ecb.js"></script>
    <script src="lib/component/pad-nopadding.js"></script>
    <script src="lib/scrypt.js"></script>
    <script src="lib/jsrsasign.js"></script>
    <script src="lib/neo-ts.js"></script>
    <script src="lib/qr-code-with-logo.browser.min.js"></script>
    <script src="lib/code.js"></script>
### 2、SDK Initialization（init）
•	Before using the BlaCatSDK，you need to perform some initialization processes BlackCat.SDK.init(appid, appkey, listener, lang
`BlackCat.SDK.init(appid, appkey, listener, lang)`

**Parameter Description：** 

|Parameter Name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|appid |is  |string |BlaCat assigned by appid   |
|appkey |is  |string |BlaCat assigned bappkey   |
|listener |is  |function |Application Registration of SDK Callback Function |
|lang |not  |string |SDK language，Default cn（中文），can change to desirable values cn、en|
**Return Description：** 
NO Return

**•	Callback Mode Description：** 
 BlaCatSDK supports two types of callback modes，one is when initializing the SDK（init）register a callback function (recommended)，another is a function callback mode。Some function/feature callbacks，such as switching network type notification、Transaction confirmation completion notification, etc.，can be done only through the first mode。。

•	Callback method one (recommended)：

    var listener = function(data)
    {
    	// Callback process，data is JSON format String
		var res = JSON.parse(data)
		console.log('listener => ', res)
		switch (res.cmd) {
			case "loginRes": // login success callback
				// You need to send the received data to the server for verification before you sign in to the app	
				break;
			case "logoutRes": // logout callback
				break;
			case "makeRechargeRes": // Recharge callback
				break;
			case "getAppNotifysRes": //TradeChain process completion callback
				break;
			case "confirmAppNotifyRes": //TradeChain process completion receipt acknowledgement callback
				break;
			case "getBalanceRes": // Get Balance
				break;
			case "getUserInfoRes": // Get Login User Information
				break;
			case "getNetTypeRes": // Get network type
				break;
			case "invokescriptRes": // Read Smart Contract Call
				break;
			case "makeRawTransactionRes": // Write Smart Contract Request Result
				break;
			case "makeGasTransferRes": //  GAS Transfer Callback
				break;
			case "makeGasTransferMultiRes": // GAS Batch Transfer Callback
				break;
			case "changeNetTypeRes": // Network Switch Callback
				break;
		}
    };
	BlackCat.SDK.init(appid, appkey, listener, lang)

•	Callback Mode 2：
    
    BlackCat.SDK.functionName(data, function(res) {  
	    //Callback result processing
	})

### 3、Login （login）
You need to initialize first（init）Before you can call。
``` 
  // Mode 1，results in listener notification
  BlackCat.SDK.login()
  
  // Mode 2
  BlackCat.SDK.login(function(res) {
    //  Interface callback
  })
```

**Return Description：** 
``` 
// Mode 1
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
  
// Mode 2
{
	"g_id": "5",
	"time": 1531891115,
	"uid": "sj_xxs23",
	"wallet": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
	"sign": "40d48798189ec210153339d7a1cf71e5"
}
```

**Special Instructions：** 
 The data returned by the interface，data validity needs to be examined on the application server，Login verification cannot be done on the client

**Return Parameter 	Instructions：** 

|Parameter name|required|type|description|
|:----    |:---|:----- |-----   |
|g_id |is  |string |User ID（appid），BlaCat Distribution   |
|uid |is  |string | BlaCat User uid    |
|time     |is  |string | Login Timestamp，per second    |
|wallet     |is  |string | User wallet address   |
|sign     |is  |string | Request Signature    |

**Sign Verification Method：** 
Parameters are sorted in ascending order
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT

```Add an application signature login key（BlaCat distribution）
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222
```
Calculating md5（lowercase）
```
md5("g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222")
```
Obtained signature
`860b5f9f52a9f07e961f2454e0e89bbe`

**sign Generation Algorithm（PHP）：** 
```
function getLoginSign($params, $login_key) {
	ksort($params);
	$md5_str = http_build_query($params) . $login_key;
	return md5($md5_str);
}
```

### 4、Recharge
#### 1）、Initiate Recharge（makeRecharge）
Client application initiates a recharge interface，initiates a payment transaction on the chain。The following is a payment of 0.001 sgas code.
  var params = { count: "0.001", extString: "makeRecharge" };
  
  //mode 1，results in listener notification
  BlackCat.SDK.makeRecharge(params)
  
  // Mode 2
  BlackCat.SDK.makeRecharge(params, function(res){
    // Interface Callback
    if（res.err == false）{
      //Get the txid of the successfully submitted payment transaction
      var txid = res.info.txid;
      alert('Payment submission successful，waiting to be confirmed on chain');
    }
  })
```
**params Parameters：** 

|Paramter name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|count |is  |string |Number of sgas that must be converted  |
|extString |is  |string |Transmission parameters  |

**Return Example**

``` 
// Mode1 Callback data：
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

// Mode2 function callback res：
{
	"err": false,
	"info": {
		"txid": "0xccf73255d0efd7fdc329af599378a6589dab38e24783e8b2e376a5336ce6b393"
	}
}
```
**Return example**Return Description: This callback indicates that the refill request has been put on blockchain and waits for the NEO blockchain to confirm. It may be successful or it may fail.。

#### 2）、Confirm the recharge (front end)
If the recharge is successful, the backend server of BlaCatSDK will notify the application backend refill callback interface, and also will give registered listener a callback (getAppNotifysRes) on the transaction chain.

##### 1））callback on the transaction chain (getAppNotifysRes)
The getAppNotifysRes callback is received by the transaction executed by the BlaCatSDK. It indicates that the transaction has been processed on the blockchain. If the callback result state=0, it means that the execution of the transaction on the blockchain failed. If the callback result is state=1, the application should also determine the execution result of its own logic. This callback only indicates that the transaction has been processed on the blockchain.
**Return example**

``` 
// Mode 1（Only supports mode 1 callback mode）
{
    "cmd": "getAppNotifysRes",
    "data": [
        {
            "id": "367",
            "g_id": "5",
            "txid": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32",
            "state": "1",
            "params": "{\"sbPushString\":\"transfer\", \"toaddr\":\"AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5\", \"count\": \"0.01\"}"
        }
    ]
}
```
##### 2））、Confirm receipt (confirmAppNotify)
When the application obtains the getAppNotifysRes callback and processes the corresponding front-end logic, it should confirm that the callback is received on the transaction blockchain. If you do not confirm the processing, the next time the user logs in to the game, he will receive the getAppNotifysRes callback again.
``` 
var params = {
	txid: "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
}

// Mode 1
BlackCat.SDK.confirmAppNotify(params)

// Mode 2
BlackCat.SDK.confirmAppNotify(params, function(res){
	console.log('[BlackCat]', 'confirmAppNotify.callback.function.res => ', res)
})
```
**params Paramters：** 

|Parameter name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|txid |is  |String |Transaction txid   |

**Return example**

``` 
// Mode 1
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
// Mode 2
{
	"res": {
		"err": false,
		"info": 1
	}
}
```

#### 3）、 Confirm the recharge (back end)
If the recharge is successful, the backend server of BlaCatSDK will notify the application backend refill callback interface.
##### 1））、Interface description
**Request URL：** 
- ` http://Application Recharge Callback Interface `
  
**Request Method：**
- POST 

**Parameter：** 

|Parameter name |Reqiured|Type|Description|
|:----    |:---|:----- |-----   |
|g_id |is  |string |Applicationid，NEOGAME Distribution   |
|txid |is  |string |Transaction txid   |
|from |is  |string | wallet address    |
|count     |is  |string | sgas amount    |
|tm     |id  |string | request timestamp（second） |
|params|id|String|Paramter params，JSON|
|net_type|is|String|Main network: 1, test network: 2|
|sign     |is  |string | request signature    |


 **Note** 

- When the transaction confirmation is successfully sent, the notification will no longer be initiated.
-If the notification is sent, it will try to send multiple times.

##### 2））、sign Signature Algorithm

Transaction confirmation POST parameters arranged in ascending dictionary
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71
```
Add payment application signature  Key  (NEOGAME distribution)
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222
```
Calculating md5 (lowercase)
```
md5("count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222")
```
Obtained signature
`bda7145c6d139ec3149bea6140aae883`
##### 3））、sign Signature Algorithm（PHP）
```
function getNotifySign($params, $key)
{
    ksort($params);
    $md5_str = http_build_query($params).'&key='.$key;
    return md5($md5_str);
}
```

### 5、Get the balance（getBalance）
Get the basic information of the current user
``` 
// Mode 1
BlackCat.SDK.getBalance()

// Mode 2
BlackCat.SDK.getBalance(function(res){
	console.log("getbalance.callback.function.res ", res)
})
```

**Return Example**

``` 
// Mode 1：
{
    "cmd": "getBalanceRes",
    "data": {
        "sgas": 0.988,
        "gas": 1230.19491
    }
}
// Mode 2：
{
	"sgas": 0,
	"gas": 1
}
```

### 6、Get user information（getUserInfo）
Get the basic information of the current user
``` 
// Mode 1
BlackCat.SDK.getUserInfo()

// Mode 2
BlackCat.SDK.getUserInfo(function(res){
	console.log('[BlackCat]', 'getUserInfo.callback.function.res => ', res)
})
```

**Return Example**

``` 
// Mode 1
{
    "cmd": "getUserInfoRes",
    "data": {
        "uid": "sj_xxs23",
        "name": "136****3881",
        "invitor": "",
        "ip": "11.11.11.11",
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
// Mode 2
{
  "uid": "sj_xxs23",
  "name": "136****3882",
  "invitor": "",
  "ip": "11.11.11.11",
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


### Get the current network type（getNetType）
Get the current network type, 1 for the main network and 2 for the test network
``` 
// Mode 1
BlackCat.SDK.getNetType()

// Mode 2
BlackCat.SDK.getNetType(function(res){
	console.log("getNetType.callback.function.res ", res)
})
```

**Return Example**

``` 
// Mode 1：
{
    "cmd": "getNetTypeRes",
    "data": 2
}
Mode 2：
2
```

### 8、GAS transfer (makeGasTransfer)
Perform a GAS transfer operation that requires a wallet user signature.。
``` 
var params = {
	toaddr: "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
	count: "0.01",
	extString: "makeGasTransfer"
}

// Mode 1
BlackCat.SDK.makeGasTransfer(params)

// Mode 2
BlackCat.SDK.makeGasTransfer(params, function(res){
    console.log("makeGasTransfer.callback.function.res ", res)
})
```
**params Paramters：** 

|Parameter Name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|toaddr |YES  |String |transfer receipt addres   |
|count |YES  |string |transfer amount   |
|extString |YES  |string |Pass through parameter |

**Return Example**

``` 
Mode 1：
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

Mode 2：
{
	"res": {
		"err": false,
		"info": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
	}
}
```

### 9、GAS multiple transfer (makeGasTransferMulti)
Perform a GAS multiple transfer operation that requires a wallet user signature.
``` 
var params = [
	{
		toaddr: "AbYR3eUbPUcnenEfmbJ7Fc4DUZLabKD6Cf",
		count: "0.001",
		extString: "makeGasTransferMulti1"
	},
	{
		toaddr: "AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT",
		count: "0.002",
		extString: "makeGasTransferMulti2"
	}
]

//Mode 1
BlackCat.SDK.makeGasTransferMulti(params)

// Mode 2
BlackCat.SDK.makeGasTransferMulti(params, function(res){
    console.log("makeGasTransferMulti.callback.function.res ", res)
})
```
**params Paramters：** 

|Parameter Name|Required|Type |Description|
|:----    |:---|:----- |-----   |
|toaddr |YES  |String |receipt address   |
|count |YES  |string |transfer amount   |
|extString |YES  |string |pass through parameter |

**Return Example**

``` 
Mode 1：
{
    "cmd": "makeGasTransferMultiRes",
    "data": {
        "params": [
            {
                "toaddr": "AbYR3eUbPUcnenEfmbJ7Fc4DUZLabKD6Cf",
                "count": "0.001",
                "extString": "makeGasTransferMulti1",
                "sbPushString": "transfer"
            },
            {
                "toaddr": "AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT",
                "count": "0.002",
                "extString": "makeGasTransferMulti2",
                "sbPushString": "transfer"
            }
        ],
        "res": {
            "err": false,
            "info": "c23537c41751e5a96621a1bf1c077d854ef522087b5fc9b245bf22e97f9e4451"
        }
    }
}

Mode 2：
{
	"res": {
		"err": false,
		"info": "c23537c41751e5a96621a1bf1c077d854ef522087b5fc9b245bf22e97f9e4451"
	}
}
```

## 三、Advanced applications
### 1、1.	Smart contract calling method
In general, there are two types of smart contract calls, one is a contract read request (invokescript) and the other is a contract write request (makeRawTransaction). The read request is not modified, just read the relevant data. The write request will change and require the user to authorize the signature. Our recharge request is a write request which need the user to open the wallet to request the authorization signature then to execute.

### 2、Contract reading (invokescript)
Read smart contract information in read-only mode, which can be called without user signature.。
``` 
  var params = {
      sbParamJson: ["(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT"],
      sbPushString: "balanceOf",
      nnc: "0xcfe8f6824365f70d382733a92d8f373ee4faf222",
	  extString: "invokeScript"
  };
  
  // Mode 1
  BlackCat.SDK.invokescript(params)
  
  // Mode 2
  BlackCat.SDK.invokescript(params, function(res){
    // interface callback
    if（res.err == false）{
      // Get contract call data result
      var stack = res.info.stack;
    }
  })
```
**params Parameters：** 

|Parameter Name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|sbParamJson |YES  |Array |contract parameters   |
|sbPushString |YES  |string |contract method name   |
|nnc |YES  |string |contract address  |
|extString |YES  |string |getAppNotifysRes passthrough parameter  |

**Return Example**

``` 
// Mode 1
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

// Mode 2
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

### 3、Contract writing (makeRawTransaction)
The smart contract is operated in write mode, which requires the wallet user to sign
``` 
  var params = {
      sbParamJson: ["(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT","(address)AWPVmAobCJGxrupvQSnovofakaVb2ue65a","(integer)100000"],
      sbPushString: "transfer",
      nnc: "0x3f7420285874867c30f32e44f304fd62ad1e9573",
	  extString: "makeRawTransaction"
  };
  
  // Mode 1
  BlackCat.SDK.makeRawTransaction(params)
  
  // Mode 2
  BlackCat.SDK.makeRawTransaction(params, function(res){
    // Interface Callback
    if（res.err == false）{
      // 获取合约执行结果
      var txid = res.info.txid;
    }
  })

```**params Paramters：** 

|sbParamJson|Required|Type|Description|
|:----    |:---|:----- |-----   |
|sbParamJson |YES  |Array |contract parameters   |
|sbPushString |YES  |string |contract method name   |
|nnc |YES  |string |contract address   |
|extString |YES  |string |getAppNotifysRes passthrough parameter  |

**Return Example**

``` 
Mode 1：
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

// Mode 2
{
	"err": false,
	"info": {
		"txid": "0x0478bc0bb5757db60d1a1a6c5f774d1a33be5b493156788043712585e7abb779"
	}
}
```

## 4、Auxiliary functions
### 1、Set the SDK language (setLang)

``` 
BlackCat.SDK.setLang(lang)
```
### 2、Set the initial default network (setDefaultType)
Set the current SDK language Chinese or English
``` 
BlackCat.SDK.setDefaultType(2)
```
### Set the initial default network type (1: main network; 2: test network)
``` 
BlackCat.SDK.showMain()
BlackCat.SDK.showIcon()
```









