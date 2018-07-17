# **充值上链开发文档**

本文讲述如何通过NEOGAMESDK将应用支付系统上链。

## 一、充值流程说明图
[![](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)

## 二、NEOGAMESDK使用说明
### 1、引入
    <link rel="stylesheet" href="res/css/panel.css" type="text/css" />
    <script src="lib/rollup/aes.js"></script>
    <script src="lib/component/aes.js"></script>
    <script src="lib/component/mode-ecb.js"></script>
    <script src="lib/component/pad-nopadding.js"></script>
    <script src="lib/scrypt.js"></script>
    <script src="lib/jsrsasign.js"></script>
    <script src="lib/neo-ts.js"></script>
    <script src="lib/code.js"></script>

### 2、回调方式说明
NEOGAMESDK支持两种回调方式，一种是函数回调方式，一种是注册回调函数方式

回调方式1：
    
    BlackCat.SDK.functionName(data, function(res){  
	    //回调结果处理
	})

回调方式2：

    var listener = function(data)
    {
    	// 回调处理，data是JSON格式String
		var res = JSON.parse(data)
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
					var success = result.info;
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



### 3、接口说明
#### 1、初始化
使用NEOGAMESDK必须先执行初始化。
`BlackCat.SDK.init(appid, appkey, listener, lang)`

**参数说明：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|appid |是  |string |SDK分配的appid   |
|appkey |是  |string |SDK分配的appkey   |
|listener |是  |function |SDK回调函数   |
|lang |否  |string |SDK语言，默认cn（中文），可取值cn、en   |
**回调说明：** 
无回调

#### 2、发起充值
应用客户端调用SDK发起充值接口，发起链上支付交易。以下为支付0.001个sgas代码。
``` 
  var data = { count: "0.001", extString: "extString" };
  BlackCat.SDK.makeRecharge(data, function(res){
    // 接口回调
    if（res.err == false）{
      // 获取支付交易提交成功的txid
      var txid = res.info.txid;
      alert('支付提交成功，等待链上确认');
    }
  })
```
**data参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|count |是  |string |需要转换sgas的数量   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
  {
    "err": false,
    "info":
    {
      "txid": "0xccf73255d0efd7fdc329af599378a6589dab38e24783e8b2e376a5336ce6b393"
    }
  }
```

#### 3、智能合约调用（读取）
以只读方式读取智能合约信息，该调用不需要钱包用户签名即可调用。
``` 
  var data = {
      sbParamJson: ["(integer)1"],
      sbPushString: "isReadyToBreed",
      nnc: "0xccab4cee886dd58f17b32eff16d5e59961113a4c",
	  extString: "extString"
  };
  BlackCat.SDK.invokescript(data, function(res){
    // 接口回调
    if（res.err == false）{
      // 获取合约调用数据结果
      var stack = res.info.stack;
    }
  })
```
**data参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|sbParamJson |是  |Array |合约参数数组   |
|sbPushString |是  |string |合约方法名   |
|nnc |是  |string |合约地址   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
  {
    "err": false,
    "info":
    {
      "gas_consumed": "0.309",
      "script":"14ba42009c9f422111ca847526b443467fc6483f3651c10962616c616e63654f66675820a7f951e6154b86921fd5fdee65043f0bd7fc",
      "stack":
      [
        { "type": "ByteArray", "value": "00e1f505" }
      ],
      "state": "HALT, BREAK"
    }
  }
```

#### 4、智能合约调用（写入）
以写方式操作智能合约，该调用需要钱包用户签名。
``` 
  var data = {
      sbParamJson: ["(address)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT", "(integer)61"],
      sbPushString: "buyOnAuction",
      nnc: "0xfcd70b3f0465eefdd51f92864b15e651f9a72058",
	  extString: "extString"
  };
  BlackCat.SDK.makeRawTransaction(data, function(res){
    // 接口回调
    if（res.err == false）{
      // 获取合约执行结果
      var txid = res.info.txid;
    }
  })
```
**data参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|sbParamJson |是  |Array |合约参数数组   |
|sbPushString |是  |string |合约方法名   |
|nnc |是  |string |合约地址   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
  {
    "err": false,
    "info":
    {
      "txid": "a55e30075527c063bd366dffb54fca9fba5a58ff7d1ba835201ef396cbffad7e"
    }
  }
```

#### 5、GAS转账
执行GAS转账操作，该调用需要钱包用户签名。
``` 
var data = {
	toaddr: "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
	count: "0.01",
	extString: "extString"
}
BlackCat.SDK.makeGasTransfer(data, function(res){
    console.log("makeGasTransfer.callback.function.res ", res)
})
```
**data参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|toaddr |是  |String |转账收款地址   |
|count |是  |string |转账数量   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
  {
    "err": false,
    "info":
    {
      "txid": "7df725a5f8d700f7705a875b4e701ab244ca1b70ca915e7d4535685896091af6"
    }
  }
```

#### 6、交易通知确认
执行转账、合约写入等需要打开钱包的操作，都应该执行交易通知确认回调。应用客户端收到交易结果通知回调后，必须调用此接口进行回复，否则交易通知数据会一直传回。
``` 
var data = {
	txid: "7df725a5f8d700f7705a875b4e701ab244ca1b70ca915e7d4535685896091af6"
}

BlackCat.SDK.confirmAppNotify(data, function(res){
	console.log('[BlackCat]', 'confirmAppNotify.callback.function.res => ', res)
})
```
**data参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|txid |是  |String |交易txid   |

**返回示例**

``` 
  {
    "err": false,
    "info": 1
  }
```

#### 7、余额查询
查询gas、sgas余额。
``` 
BlackCat.SDK.getBalance(function(res){
	console.log("getbalance.callback.function.res ", res)
})
```

**返回示例**

``` 
  {
    "sgas": 0,
    "gas": 1
  }
```
#### 8、获取登录用户信息
获取登录完成的用户信息。
``` 
BlackCat.SDK.getUserInfo(data, function(res){
	console.log('[BlackCat]', 'getUserInfo.callback.function.res => ', res)
})
```

**返回示例**

``` 
{
  "uid": "13661943882",
  "name": "136****3882",
  "invitor": "",
  "phone": "13661943882@86",
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

#### 9、获取当前网络类型
获取当前网络类型
``` 
BlackCat.SDK.getNetType(function(res){
	console.log("getNetType.callback.function.res ", res)
})
```

**返回示例**

``` 
2
```

#### 9、设置语言
设置当前SDK语言，可选cn、en
``` 
BlackCat.SDK.setLang(lang)
```

#### 10、显示SDK界面
显示SDK界面
``` 
BlackCat.SDK.showMain()
```

#### 11、最小化SDK界面
最小化SDK界面
``` 
BlackCat.SDK.showIcon()
```

### 三、交易确认（后端通知）
#### 1、接口说明
    
**简要描述：** 

- 当某个充值交易链上确认后，`NEO.GAME节点`将会发起交易确认结果到`应用充值系统节点`。

**请求URL：** 
- ` http://应用充值系统节点接口 `
  
**请求方式：**
- POST 

**参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|g_id |是  |string |应用id，NEOGAME分配   |
|txid |是  |string |交易txid   |
|from |是  |string | 发起支付的钱包地址    |
|count     |是  |string | 支付sgas数量    |
|tm     |是  |string | 请求时间戳，单位秒    |
|params|是|String|请求参数params，JSON|
|sign     |是  |string | 请求签名    |


 **备注** 

- 当成功发送交易确认后，`NEO.GAME节点`将不再发起通知
- 如果`NEO.GAME节点`发送通知失败，将尝试多次发送。

#### 2、sign签名算法

交易确认通知POST参数按照字典升序排列
```
count=0.001&from=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT&g_id=1&tm=1528374108&txid=0x900936d8e34d6dfc89bedcbba1f160bcfad8702d1f0c4a8cfa1fafcc1d51025c
```
添加应用签名`支付key`（NEOGAME分配）
```
count=0.001&from=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT&g_id=1&tm=1528374108&txid=0x900936d8e34d6dfc89bedcbba1f160bcfad8702d1f0c4a8cfa1fafcc1d51025c&key=222
```
计算md5（小写）
```
md5("count=0.001&from=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT&g_id=1&tm=1528374108&txid=0x900936d8e34d6dfc89bedcbba1f160bcfad8702d1f0c4a8cfa1fafcc1d51025c&key=222")
```
得出sign
`58441125ece2f2747c2e1b5324488262`


### 四、登录游戏说明
#### 1、接口说明

    
**简要描述：** 

- 应用通过获取登录回调来验证后登录游戏

**请求方法：** 
- ` BlackCat.SDK.login()`
  
**请求回调：**
- 回调方式二

**参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|g_id |是  |string |应用ID，NEOGAME分配   |
|uid |是  |string | NEOGAME用户ID    |
|time     |是  |string | 登录时间戳，单位秒    |
|wallet     |是  |string | 用户钱包地址    |
|sign     |是  |string | 请求签名    |


 **备注** 

- 应用应当在服务端验证登录sign是否正确

#### 2、sign签名方法

参数按照字典升序排列
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT
```
添加应用签名`登录key`（NEOGAME分配）
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222
```
**- `登录key`添加方法和`支付key`添加方式`不一样`，请注意区分！**

计算md5（小写）
```
md5("g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222")
```
得出sign
`860b5f9f52a9f07e961f2454e0e89bbe`






