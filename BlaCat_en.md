* [<strong>BlaCatSDK使用文档</strong>](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md#blacatsdk使用文档)
* [<strong>BlaCatSDK Usage Documentation</strong>](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#blacatsdk-usage-documentation)
	* [1. BlaCat Introduction](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#1-blacat-introduction)
	* [2. Fundamental Applications](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#2-fundamental-applications)
		* [1. SDK Introduction](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#1-sdk-introduction)
		* [2. SDK Initialization (init)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#2-sdk-initialization-init)
		* [3. Login(login)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#3-loginlogin)
		* [4. Recharge](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#4-recharge)
			* [1). Initiate Recharge(makeRecharge)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#1-initiate-rechargemakerecharge)
			* [2). Confirm Recharge(Frontend)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#2-confirm-rechargefrontend)
				* [1)). Onchain Transaction Process Completion Callback(getAppNotifysRes)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#1-onchain-transaction-process-completion-callbackgetappnotifysres)
				* [2)). Confirm Receipt(confirmAppNotify)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#2-confirm-receiptconfirmappnotify)
			* [3). Confirm Recharge(Backend)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#3-confirm-rechargebackend)
				* [1)). Interface Description](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#1-interface-description)
				* [2)). sign Signature Algorithm](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#2-sign-signature-algorithm)
				* [3)). sign Signature Algorithm(PHP)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#3-sign-signature-algorithmphp)
		* [5. Get balance(getBalance)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#5-get-balancegetbalance)
		* [6. Get User Information(getUserInfo)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#6-get-user-informationgetuserinfo)
		* [7. Get Current Network type(getNetType)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#7-get-current-network-typegetnettype)
		* [8. Gas transfer(makeGasTransfer)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#8-gas-transfermakegastransfer)
		* [9. GAS Batch Transfer(makeGasTransferMulti)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#9-gas-batch-transfermakegastransfermulti)
	* [3. Advanced Applications](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#3-advanced-applications)
		* [1. How to call smart contracts](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#1-how-to-call-smart-contracts)
		* [2. Read Contracts(invokescript)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#2-read-contractsinvokescript)
		* [3. Write Smart Contracts(makeRawTransaction)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#3-write-smart-contractsmakerawtransaction)
	* [4. Supplementary Features](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#4-supplementary-features)
		* [1. Setting the SDK language(setLang)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#1-setting-the-sdk-languagesetlang)
		* [2. Set initial default network(setDefaultType)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#2-set-initial-default-networksetdefaulttype)
		* [3. Expand/Icon SDK(showMain/showIcon)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#3-expandicon-sdkshowmainshowicon)


# **BlaCatSDK Usage Documentation**

This document illustrates how to use the BlaCatSDK(NeoGameSDK) and how to access the NEO public blockchain.

## 1. BlaCat Introduction
BlaCat is a blockchain game platform running as a side chain based on NEO high-performance blockchain，The platform’s business mainly consists of wallet, transaction/trading market, game platform and user community.BlaCat’s biggest technological feature is the ZoroChain，It provides an integrated blockchain technology solution for high-speed DAPP development.

## 2. Fundamental Applications
### 1. SDK Introduction
To use the BlaCatSDK，you firstly need to access these necessary files to run the BlacatSDK

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
### 2. SDK Initialization (init)
Before using the BlaCatSDK，you need to perform some initialization processes BlackCat.SDK.init(appid, appkey, listener, lang)
`BlackCat.SDK.init(appid, appkey, listener, lang)`

**	Parameter Description：** 

|Parameter Name|Required |Type |Description|
|:----    |:---|:----- |-----   |
|appid |is  |string |BlaCat assigned by的appid   |
|appkey |is  |string |BlaCat assigned by 的appkey   |
|listener |is |function |Application Registration of SDK Callback Function
|lang |not  |string |SDK language，Default cn(Chinese)，can be changed to desirable values cn, en   |
** Return Description：** 
NO Return

**	Callback Mode Description：** 
BlaCatSDK supports two types of callback modes，one is when initializing the SDK(init)register a callback function (recommended)，another is a function callback mode.Some function/feature callbacks，such as switching network type notification, transaction confirmation completion notification, etc.，can be done only through the first mode

Callback method one (recommended):

    var listener = function(data)
    {
    	//Callback process，data is JSON format String
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
			case "getAppNotifysRes": //  TradeChain process completion callback
				break;
			case "confirmAppNotifyRes": // TradeChain process completion receipt acknowledgement callback
				break;
			case "getBalanceRes": // Get Balance
				break;
			case "getUserInfoRes": //Get Login User Information
				break;
			case "getNetTypeRes": // Get network type
				break;
			case "invokescriptRes": //Read Smart Contract Call
				break;
			case "makeRawTransactionRes": // Write Smart Contract Request Result
				break;
			case "makeGasTransferRes": // GAS Transfer Callback
				break;
			case "makeGasTransferMultiRes": // GAS Batch Transfer Callback
				break;
			case "changeNetTypeRes": //Network Switch Callback
				break;
		}
    };
	BlackCat.SDK.init(appid, appkey, listener, lang)

	Callback Method 2：
    
    BlackCat.SDK.functionName(data, function(res) {  
	    //Callback result processing
	})


### 3. Login(login)
You need to initialize first(init)before you can call.
``` 
  // Method 1，results in listener notification
  BlackCat.SDK.login()
  
  //  Method 2
  BlackCat.SDK.login(function(res) {
    // Interface callback
  })
```

**Return Description：** 
``` 
//Method 1
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
  
// Method 2
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

**Return Parameter Description：** 

|Parameter name| required|type|Description|
|:----    |:---|:----- |-----   |
|g_id |is |string |Application ID(appid)，BlaCat distribution   |
|uid |is |string | BlaCat user uid    |
|time     |is  |string | Login Timestamp，per second  |
|wallet     |is  |string | User wallet address  |
|sign     |is|string | Request Signature   |

**sign Verification Method：** 
Parameters are sorted in ascending order
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT
```
Add an application signature login key(BlaCat distribution)
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222
```

Calculate md5(lowercase)
```
md5("g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222")
```
Obtain sign
`860b5f9f52a9f07e961f2454e0e89bbe`

**sign Generation Method(PHP)：** 
```
function getLoginSign($params, $login_key) {
	ksort($params);
	$md5_str = http_build_query($params) . $login_key;
	return md5($md5_str);
}
```

### 4. Recharge
#### 1). Initiate Recharge(makeRecharge)
Client application initiates a recharge interface，initiates a payment transaction on the chain.The following is a payment of 0.001 sgas code
``` 
  var params = { count: "0.001", extString: "makeRecharge" };
  
  // method 1，results in listener notification
  BlackCat.SDK.makeRecharge(params)
  
  // mode 2
  BlackCat.SDK.makeRecharge(params, function(res){
    // interface callback
    if(res.err == false){
      // Get the txid of the successfully submitted payment transaction
      var txid = res.info.txid;
      alert('Payment submission successful，waiting to be confirmed on chain');
    }
  })
```
**params  Parameters：** 

|Parameter Name|Required|Type| Description|
|:----    |:---|:----- |-----   |
|count | is |string |Amount of gas to be converted  |
|extString | is  |string |Transmission Parameters |

**Return Example**

``` 
// Callback Data of Method 1：
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

// Method 2’s res callback function：
{
	"err": false,
	"info": {
		"txid": "0xccf73255d0efd7fdc329af599378a6589dab38e24783e8b2e376a5336ce6b393"
	}
}
```
**Return Description**
This callback indicates that the recharge request is already on the chain and waits for the Neo chain to confirm. The Neo chain confirms that it is possible to succeed and possibly fail.

#### 2). Confirm Recharge(Frontend)
If the recharge is successful, the backend server of BLACATSDK notifies the app backend to recharge the callback interface.Meanwhile BLACATSDK will also give the front-end initialization registration listener a transaction chain processing completion callback (getAppNotifysRes) callback

##### 1)). Onchain Transaction Process Completion Callback(getAppNotifysRes)
getAppNotifysRes callback，is a callback received when transaction execution is done through BlacatSDK
This callback indicates that the transaction has been processed on the chain..If the callback result is state=0, the execution of the transaction on the chain fails. If the callback result is state=1, the application should also judge the execution result of its own logic to determine the final execution result. This callback only indicates that the transaction has been processed on the chain


**Return example**

``` 
// Mode 1(Only supports the callback method of mode one)
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
##### 2)). Confirm Receipt(confirmAppNotify)
When the application obtains the getAppNotifysRes callback and processes the corresponding front-end logic, it should acknowledge receipt of the processing completion callback on the transaction chain. If it does not confirm processing, the next time the user logs into the game, they will receive the getappnotifysres callback again
``` 
var params = {
	txid: "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
}

// Method 1
BlackCat.SDK.confirmAppNotify(params)

// Method 2
BlackCat.SDK.confirmAppNotify(params, function(res){
	console.log('[BlackCat]', 'confirmAppNotify.callback.function.res => ', res)
})
```
**params Parameters：** 

|Parameter name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|txid |iw  |String | transaction txid   |

**return example**

``` 
// Method 1
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
// Method 2
{
	"res": {
		"err": false,
		"info": 1
	}
}
```

#### 3). Confirm Recharge(Backend)
If the top-up is successful, the BLACATSDK backend server notifies the app backend to recharge the callback interface
##### 1)). Interface Description
**Required URL：** 
- `Application Recharge Callback Interface(http)
  
**Required Method：**
- POST 

**Parameter：** 

|Parameter Name|Required |Type|Description|
|:----    |:---|:----- |-----   |
|g_id |is  |string |Application id，NEOGAME distribution  |
|txid |is  |string |Transaction txid   |
|from |is  |string | The wallet address where the payment originated    |
|count     |is  |string | Payment sgas number    |
|tm     |is  |string | Request time stamp，Units per second    |
|params|is|String|Request parameters params，JSON|
|net_type|is|String|Network Type.MainNet：1，Testnet：2|
|sign     |is  |string | Request Signature |


 **Note** 

- No notification will be sent after successful transaction confirmation
- If sending a notification fails, it will attempt to send multiple times.

##### 2)). sign Signature Algorithm

Trade Confirmation Notification POST parameters are sorted in ascending  order
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71
```
Add app Signature Payment key(NEOGAME distribution)
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222
```
Calculate md5(lowercase)
```
md5("count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222")
```
Obtain sign
`bda7145c6d139ec3149bea6140aae883`
##### 3)). sign Signature Algorithm(PHP)
```
function getNotifySign($params, $key)
{
    ksort($params);
    $md5_str = http_build_query($params).'&key='.$key;
    return md5($md5_str);
}
```

### 5. Get balance(getBalance)
Get the current user's sgas and gas balances
``` 
// Method 1
BlackCat.SDK.getBalance()

// Method 2
BlackCat.SDK.getBalance(function(res){
	console.log("getbalance.callback.function.res ", res)
})
```

**return example**

``` 
// Method 1：
{
    "cmd": "getBalanceRes",
    "data": {
        "sgas": 0.988,
        "gas": 1230.19491
    }
}
// Method 2：
{
	"sgas": 0,
	"gas": 1
}
```

### 6. Get User Information(getUserInfo)
Get basic information for the current user
``` 
// Method 1
BlackCat.SDK.getUserInfo()

// Method 2
BlackCat.SDK.getUserInfo(function(res){
	console.log('[BlackCat]', 'getUserInfo.callback.function.res => ', res)
})
```

**Return Example**

``` 
// Method 1
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
// Method 2
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


### 7. Get Current Network type(getNetType)
Gets the current network type, 1 represents the main network, and 2 indicates the test net
``` 
// Method 1
BlackCat.SDK.getNetType()

// Method 2
BlackCat.SDK.getNetType(function(res){
	console.log("getNetType.callback.function.res ", res)
})
```

**Return Example**

``` 
// Method 1：
{
    "cmd": "getNetTypeRes",
    "data": 2
}
Method 2：
2
```

### 8. Gas transfer(makeGasTransfer)
Perform gas transfer operation, the call requires a wallet user signature.
``` 
var params = {
	toaddr: "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
	count: "0.01",
	extString: "makeGasTransfer"
}

// Method 1
BlackCat.SDK.makeGasTransfer(params)

// Method 2
BlackCat.SDK.makeGasTransfer(params, function(res){
    console.log("makeGasTransfer.callback.function.res ", res)
})
```
**params Parameters：** 

|Parameter Name|Required |Type|Description|
|:----    |:---|:----- |-----   |
|toaddr |是  |String |Receiving Address   |
|count |是  |string | Number of transfers   |
|extString |是  |string |Transmission parameters |

**Return Example**

``` 
Method 1：
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

Method 2：
{
	"res": {
		"err": false,
		"info": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
	}
}
```

### 9. GAS Batch Transfer(makeGasTransferMulti)
Perform gas bulk transfer operation, the call requires a user wallet signature.
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

// Method 1
BlackCat.SDK.makeGasTransferMulti(params)

// Method 2
BlackCat.SDK.makeGasTransferMulti(params, function(res){
    console.log("makeGasTransferMulti.callback.function.res ", res)
})
```
**params Parameters：** 

|Parameter Name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|toaddr |is  |String Receiving Address   |
|count |is  |string |Number of transfers  |
|extString |is  |string |Transmission parameters |

**Return Example**

``` 
Method 1：
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

Method 2：
{
	"res": {
		"err": false,
		"info": "c23537c41751e5a96621a1bf1c077d854ef522087b5fc9b245bf22e97f9e4451"
	}
}
```

## 3. Advanced Applications
### 1. How to call smart contracts
In general, there are two types of smart contract calls, one is a contract read request (Invokescript) and one is a contract write request (makerawtransaction). The read request does not make any changes, but simply reads the relevant data. Write requests make data changes that require a user authorization signature. Our top-up request, which belongs to the contract writing request, requires the user to open the wallet to request an authorization signature to execute.
### 2. Read Contracts(invokescript)
Only reads the smart contract information , this does not require a wallet user signature to invoke.
``` 
  var params = {
      sbParamJson: ["(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT"],
      sbPushString: "balanceOf",
      nnc: "0xcfe8f6824365f70d382733a92d8f373ee4faf222",
	  extString: "invokeScript"
  };
  
  // Method 1
  BlackCat.SDK.invokescript(params)
  
  // Method 2
  BlackCat.SDK.invokescript(params, function(res){
    // Interface Callback
    if(res.err == false){
      // Get Contract Call Data results
      var stack = res.info.stack;
    }
  })
```
**params Parameters：** 

|Parameter Name|Required |Type |Description|
|:----    |:---|:----- |-----   |
|sbParamJson |is  |Array |Array of contract parameters   |
|sbPushString |is  |string |Contract Method Name  |
|nnc |is  |string |Contract Address  |
|extString |is  |string |Transmission parameters |

**Return example**

``` 
// Method 1
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

// Method 2
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

### 3. Write Smart Contracts(makeRawTransaction)
Editing the smart contract in write mode, this requires a wallet user to sign.
``` 
  var params = {
      sbParamJson: ["(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT","(address)AWPVmAobCJGxrupvQSnovofakaVb2ue65a","(integer)100000"],
      sbPushString: "transfer",
      nnc: "0x3f7420285874867c30f32e44f304fd62ad1e9573",
	  extString: "makeRawTransaction"
  };
  
  // Method 1
  BlackCat.SDK.makeRawTransaction(params)
  
  // Method 2
  BlackCat.SDK.makeRawTransaction(params, function(res){
    //  Interface Callback
    if(res.err == false){
      // Get Contract Execution Results
      var txid = res.info.txid;
    }
  })
```
**params Parameters：** 

|Paramter Name|Required |Type|Description|
|:----    |:---|:----- |-----   |
|sbParamJson |is  |Array |Array of Contract Parameter  |
|sbPushString |is |string |Contract Method Name   |
|nnc |is  |string |Contract Address   |
|extString |is  |string |getAppNotifysRes Transmission Parameters |

**Return Example**

``` 
Method 1：
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

// Method 2
{
	"err": false,
	"info": {
		"txid": "0x0478bc0bb5757db60d1a1a6c5f774d1a33be5b493156788043712585e7abb779"
	}
}
```

## 4. Supplementary Features
### 1. Setting the SDK language(setLang)
Set the currentSDK language，options are cn, en
``` 
BlackCat.SDK.setLang(lang)
```
### 2. Set initial default network(setDefaultType)
Set the initial default network type(1：Main net；2：Test net)
``` 
BlackCat.SDK.setDefaultType(2)
```
### 3. Expand/Icon SDK(showMain/showIcon)
``` 
BlackCat.SDK.showMain()
BlackCat.SDK.showIcon()
```









