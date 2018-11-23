# **On Chain Recharge Development Documentation**

This article describes how to use the NEOGAMESDK to create application of a payment system through a chain。

## 一、Recharge Process Description Diagram
[![](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)

## 2、NEOGAMESDK Instructions for Use
### 1、Introduction
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

### 2、Description of Callback Mode
NEOGAMESDK supports two types of callbacks, one is to register the callback function when initializing the SDK (recommended), and one is the function callback method。

Callback Method 1（Recommended）：

    var listener = function(data)
    {
    	// Callback Processing，data is JSON String
		var res = JSON.parse(data)
		console.log('listener => ', res)
		switch (res.cmd) {
			case "loginRes": // Login Callback
				var loginInfo = res.data;
				// Here you need to send the received data for server-side validation before logging in to the app
				break;
			case "invokescriptRes": // Read Contract Call
				var params = res.data.params; // Contract Call Parameters
				var result = rs.data.res; // Contract Call Results
				if (result.err == true) {
					// Execution failed
				}
				else {
					// Execution successful
					var success_data = result.info;
				}
				break;
			case "makeRawTransactionRes": // Contract Write Request Results
				// Callback Data Format Reference invokescriptRes
				break;
			case "makeRechargeRes": // Recharge Callback
				// Callback Data Format Reference invokescriptRes
				break;
			case "makeGasTransferRes": // GAS Transfer Callback
				// Callback Data Format Reference invokescriptRes
				break;
			case "confirmAppNotifyRes": // Transaction notification confirmation receipt callback
				// Callback Data Format Reference invokescriptRes
				break;
			case "getBalanceRes": // Get balance
				var result = res.data;
				var sgas = result.sgas;
				var gas = result.gas;
				break;
			case "getUserInfoRes": // Get Login User Information
				var userInfo = res.data;
				break;
			case "getNetTypeRes": // Get network type
				var net_type = res.data;
				if (net_type == 1) {
					// main net
				}
				else if (net_type == 2) {
					// test net
				}
				break;
			case "changeNetTypeRes": // Network Toggle Callback
				var net_type = res.data;
				if (net_type == 1) {
					//  main net
				}
				else if (net_type == 2) {
					// test net
				}
				break;
		}
    };

Callback method 2：
    
    BlackCat.SDK.functionName(data, function(res){  
	    //callback results processing
	})


### 3、Interface Description
#### 1、Initialization
Initialization must be performed first using NEOGAMESDK。
`BlackCat.SDK.init(appid, appkey, listener, lang)`

**Parameter Description：** 

|Paramter name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|appid |Yes  |string |SDK distribution of appid   |
|appkey |Yes  |string |SDKdistribution of appkey   |
|listener |Yes  |function |Application registration of the SDK callback function   |
|lang |No  |string |SDK Lang，Default cn（中文），Options cn、en   |
**Response Description：** 
No Response

#### 2、Login
After initialization, the logon method needs to be invoked
``` 
  // Method 1，Results in listener notifications
  BlackCat.SDK.login()
  
  // Method 2
  BlackCat.SDK.login(function(res){
    // Interface Callback
  })
```

**Response Description：** 
``` 
// Method 1
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
Parameter validation returned by the interface, verify the validity of the data to the application server, and do not do logon verification on the client



#### 3、发起充值
The application client calls the SDK to initiate a recharge interface to initiate a payment transaction on the chain. Here is an example of 0.001 sgas payment code。
``` 
  var params = { count: "0.001", extString: "makeRecharge" };
  
  // Method 1，Results in listener notifications
  BlackCat.SDK.makeRecharge(params)
  
  // Method 2
  BlackCat.SDK.makeRecharge(params, function(res){
    // Interface Callback
    if（res.err == false）{
      // Get a successful payment transaction submission TXID
      var txid = res.info.txid;
      alert('Payment submission succeeded, waiting for confirmation on the chain');
    }
  })
```
**params Paramters：** 

|Parameter name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|count |Yes  |string |Number of Sgas that need to be converted    |
|extString |Yes  |string |Transmittance parameters   |

**Response Example**

``` 
// Method 1 callback data：
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

// Method 2's function callback res：
{
	"err": false,
	"info": {
		"txid": "0xccf73255d0efd7fdc329af599378a6589dab38e24783e8b2e376a5336ce6b393"
	}
}
```

#### 3、Other Interfaces
For additional interfaces, please refer to the： [BlaCatSDK使用文档](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md "BlaCatSDK使用文档")

### 3、Transaction confirmation (back-end notification)
#### 1、Interface Description
    
**Brief Description：** 

- When confirmed on a recharge transaction chain, ' NEO.Game node ' will initiate the transaction confirmation result to the ' Application Recharge system node`。

**Request URL：** 
- ` http://Application of Recharge System node interface '`
  
**Request Method：**
- POST 

**Paramters：** 

|Parameter name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|g_id |Yes  |string |App id，NEOGAME distribution   |
|txid |Yes  |string |Transaction txid   |
|from |Yes  |string | Wallet Address    |
|count     |Yes  |string | Number of Sgas paid    |
|tm     |Yes  |string | Request timestamp, Unit seconds    |
|params|Yes|String|Request Parameters params，JSON|
|net_type|Yes|String|The network type. Main network: 1, test network: 2|
|sign     |Yes  |string | Request name    |


 **Note** 

- When the transaction confirmation is successfully sent, ' NEO.Game node ' will no longer initiate notifications
- if `NEO.GAME node`Failed to send notification, will attempt to send multiple times。

#### 2、sign Signature Algorithm

Transaction confirmation notification POST parameters are arranged in ascending order 
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71
```
Add app signature ' payment key '`（NEOGAME Distribution）
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222
```
Calculate md5（Lower Case）
```
md5("count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222")
```
Obtained signature
`bda7145c6d139ec3149bea6140aae883`


### 4、Game Login Description
#### 1、Interface Description

    
**Brief description：** 

- App logs in after the game is verified by getting a login callback

**Request Method：** 
- ` BlackCat.SDK.login()`
  
**Request Callback：**
- Method 2 Callback

**Parameters：** 

|Paramter name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|g_id |Yes  |string |App ID，NEOGAME Distribution   |
|uid |Yes |string | NEOGAME User ID    |
|time     |Yes |string | Login timestamp, unit seconds    |
|wallet     |Yes  |string | User Wallet Address    |
|sign     |Yes  |string | Request a signature    |


 **Note** 

- The app should verify that the login sign is correct on the server side

#### 2、sign Signature Algorithm

Parameters are arranged in ascending order 
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT
```
Add an app signature` Login key`（NEOGAME Distribution）
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222
```
**- `' Login key ' Add method and ' pay key ' add way ' not the same ', please pay attention to the distinction!！**

Calculate md5（Lower case）
```
md5("g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222")
```
Obtained signature
`860b5f9f52a9f07e961f2454e0e89bbe`






