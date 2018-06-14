# 充值上链说明
## 一、充值货币说明
我们使用sgas作为充值资产。sgas是什么？请参考这篇文章。[传送门GO](https://github.com/NewEconoLab/neo-ns/tree/master/dapp_sgas "传送门GO")
## 二、智能合约调用种类说明
一般情况下，智能合约调用分为两种，一种是合约读取请求（invokescript），一种是合约写入请求(makeRawTransaction)。读取请求不做任何修改，只是单纯的读取相关数据。写入请求会做数据变更，需要用户授权签名。我们的充值请求，属于合约写入请求，需要用户打开钱包进行请求授权签名才能执行。
## 三、充值流程图
[![](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)


## 四、流程说明
### 1、`应用客户端`发起充值
当用户执行充值操作时，`应用客户端`调用`NEOGAMESDK`提供的充值方法，来发起一次充值请求。
### 2、`NEOGAMESDK`拼接充值交易请求
`NEOGAMESDK`接收到应用客户端的充值请求，会先判断用户是否打开钱包，如果没有打开钱包，`NEOGAMESDK`将弹出密码输入框，等待用户输入钱包密码后，再执行后续充值交易的拼接操作（包含授权签名等一系列操作）。当充值交易拼接完成后，`NEOGAMESDK`把充值请求通过HTTP方式发送到`NEL钱包节点`。
### 3、`NEL钱包节点`接收充值请求
`NEL钱包节点`接收到充值请求后，会把充值请求转发到`NEO-CLI节点`上处理。
### 4、`NEO-CLI节点`交易上链 & 交易txid
`NEO-CLI节点`把充值交易请求上链，同时返回此次交易的txid给`NEL钱包节点`。txid是此次交易的交易ID，可以通过查询txid来获取交易相关信息。**特别注意：这个只是交易上链，并不能保证此时就是充值成功，需要等待链上确认该笔交易才能算是充值成功。**该txid将会通过`NEL钱包节点`、`NEOGAMESDK`后，返回到`应用客户端`。
### 5、`NEOGAMESDK`交易txid
`NEOGAMESDK`在接收到交易txid时，除了返回交易txid给`应用客户端`，还会把此次交易的txid发送到`NEO.GAME节点`。
### 6、`NEO.GAME节点`交易txid & 循环查询交易状态
`NEO.GAME节点`接收到交易txid后，将会通过`NEL钱包节点`来查询此次充值交易的确认状态。因为链上确认交易有一个时间过程，有时候还可能比较长，所以这边一直循环查询交易状态。
### 7、`NEO.GAME节点`交易确认
当`NEO.GAME节点`查询到充值交易确认完成，将会通过HTTP请求发送充值确认请求到`应用充值系统节点`。应用在接收到充值确认请求后，可以进行相关的充值操作。