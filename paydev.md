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
    <script src="lib/qr-code-with-logo.browser.min.js"></script>
    <script src="lib/code.js"></script>

### 2、回调方式说明
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


### 3、接口说明
#### 1、初始化
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

#### 2、登录
初始化初始化后，需调用登录方法。
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



#### 3、发起充值
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

#### 3、其他接口
其他接口，请参考： [BlaCatSDK使用文档](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat.md "BlaCatSDK使用文档")

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
|net_type|是|String|网络类型。主网：1，测试网：2|
|sign     |是  |string | 请求签名    |


 **备注** 

- 当成功发送交易确认后，`NEO.GAME节点`将不再发起通知
- 如果`NEO.GAME节点`发送通知失败，将尝试多次发送。

#### 2、sign签名算法

交易确认通知POST参数按照字典升序排列
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71
```
添加应用签名`支付key`（NEOGAME分配）
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222
```
计算md5（小写）
```
md5("count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222")
```
得出sign
`bda7145c6d139ec3149bea6140aae883`


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






