# On Chain Recharge Description
## 1、Currency Recharge Description
We use Sgas as a recharge asset。What is sgas？Please refer to this article。[传送门GO](https://github.com/NewEconoLab/neo-ns/tree/master/dapp_sgas "传送门GO")
## 2、Description for the type of smart contract call
1, There are two types of smart contract calls, a contract read request (invokescript) and a contract write request (makeRawtransaction). The read request does not make any modifications, but simply reads the relevant data. A write request makes a data change that requires a user authorization signature. Our recharge request, which belongs to the contract write request, requires the user to open the wallet for the request authorization signature to execute.。
## 3、Recharge Process Diagram
[![](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)


## 4、Process Description
### 1、'App client ' initiates recharge
When the user performs a recharge operation, the ' Application client ' invokes the recharge method provided by ' NEOGAMESDK ' to initiate a recharge request。
### 2、`NEOGAMESDK`Splicing Recharge Transaction Requests
`NEOGAMESDK ' receives the recharge request from the app client, first determines whether the user opens the wallet, if the wallet is not opened, ' NEOGAMESDK ' will eject the password input box, waiting for the user to enter the wallet password, and then perform the stitching operation of the subsequent recharge transaction (including a series of actions such as authorization signature). When the recharge transaction stitching is complete, ' neogamesdk ' sends the recharge request via HTTP to the ' Nel wallet node`。
### 3、`Nel wallet node ' Receives Recharge Request
Nel wallet node ' after receiving the recharge request, the recharge request is forwarded to the ' NEO-CLI node ' for processing。
### 4、`NEO-CLI Node ` Puts Transaction on Chain &  Transaction txid
`NEO-CLI node ' puts the recharge transaction request on the chain, and returns the Txid of the transaction to the ' Nel wallet node '. TXID is the transaction ID for this transaction and can obtain transaction-related information by querying Txid. ** Special NOTE: This is only a trading chain, there is no guarantee that  the recharge was successful, need to wait for the chain to confirm the transaction in order to be a success. ** The TXID will be returned to the app client through the ' Nel Wallet node ' and ' NEOGAMESDK '`。
### 5、`NEOGAMESDK` Transaction txid
`NEOGAMESDK ' When receiving a trading Txid, in addition to returning the transaction Txid to the ' Application client ', the Txid of the transaction is also sent to ' NEO '.Game node '。
### 6、`NEO. Game node ' Trading Txid & Loop Query Trading status
`' NEO.Game node after receiving the trading Txid, the game node will check the confirmation status of the recharge transaction through the ' Nel Wallet node '. Because there is a time process for confirming a transaction on the chain, sometimes it can be longer, so this side has been looping through the trading status。
### 7、`NEO. Game Node ' Transaction Confirmation
When 'NEO. Game node ' query to the Recharge transaction confirmation is complete and the recharge confirmation request will be sent to the ' App recharge System node ' via HTTP request. The app can perform related recharge operations after receiving a recharge confirmation request。