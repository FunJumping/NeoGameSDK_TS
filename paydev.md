# **充值上链开发文档**

本文讲述如何通过NEOGAMESDK将应用支付系统上链。

## 一、充值流程说明图
[![](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)

## 二、NEOGAMESDK使用说明
### 1、引入
`<script src="http://182.254.139.130/sdk.js"></script>`
### 2、接口说明
#### 1、初始化
使用NEOGAMESDK必须先执行初始化。
`NEOGAMESDK.init()`
#### 2、发起充值
应用客户端调用SDK发起充值接口，发起链上支付交易。以下为支付0.001个sgas代码。
``` 
  var data = { count: "0.001" };
  NEOGAMESDK.makeRecharge(data, function(res){
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
      nnc: "0xccab4cee886dd58f17b32eff16d5e59961113a4c"
  };
  NEOGAMESDK.invokescript(data, function(res){
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
      nnc: "0xfcd70b3f0465eefdd51f92864b15e651f9a72058"
  };
  NEOGAMESDK.makeRawTransaction(data, function(res){
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

- 用户通过游戏入口地址登录游戏

**请求URL：** 
- ` http://游戏入口地址/ `
  
**请求方式：**
- GET 

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

登录请求GET参数按照字典升序排列
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






