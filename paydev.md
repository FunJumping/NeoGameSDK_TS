# **��ֵ���������ĵ�**

���Ľ������ͨ��NEOGAMESDK��Ӧ��֧��ϵͳ������

## һ����ֵ����˵��ͼ
[![](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/payflow.jpg)

## ����NEOGAMESDKʹ��˵��
### 1������
`<script src="http://182.254.139.130/sdk.js"></script>`
### 2���ӿ�˵��
#### 1����ʼ��
ʹ��NEOGAMESDK������ִ�г�ʼ����
`NEOGAMESDK.init()`
#### 2�������ֵ
Ӧ�ÿͻ��˵���SDK�����ֵ�ӿڣ���������֧�����ס�����Ϊ֧��0.001��sgas���롣
``` 
  var data = { count: "0.001" };
  NEOGAMESDK.makeRecharge(data, function(res){
    // �ӿڻص�
    if��res.err == false��{
      // ��ȡ֧�������ύ�ɹ���txid
      var txid = res.info.txid;
      alert('֧���ύ�ɹ����ȴ�����ȷ��');
    }
  })
```
**data������** 

|������|��ѡ|����|˵��|
|:----    |:---|:----- |-----   |
|count |��  |string |��Ҫת��sgas������   |

**����ʾ��**

``` 
  {
    "err": false,
    "info":
    {
      "txid": "0xccf73255d0efd7fdc329af599378a6589dab38e24783e8b2e376a5336ce6b393"
    }
  }
```

#### 3�����ܺ�Լ���ã���ȡ��
��ֻ����ʽ��ȡ���ܺ�Լ��Ϣ���õ��ò���ҪǮ���û�ǩ�����ɵ��á�
``` 
  var data = {
      sbParamJson: ["(integer)1"],
      sbPushString: "isReadyToBreed",
      nnc: "0xccab4cee886dd58f17b32eff16d5e59961113a4c"
  };
  NEOGAMESDK.invokescript(data, function(res){
    // �ӿڻص�
    if��res.err == false��{
      // ��ȡ��Լ�������ݽ��
      var stack = res.info.stack;
    }
  })
```
**data������** 

|������|��ѡ|����|˵��|
|:----    |:---|:----- |-----   |
|sbParamJson |��  |Array |��Լ��������   |
|sbPushString |��  |string |��Լ������   |
|nnc |��  |string |��Լ��ַ   |

**����ʾ��**

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

#### 4�����ܺ�Լ���ã�д�룩
��д��ʽ�������ܺ�Լ���õ�����ҪǮ���û�ǩ����
``` 
  var data = {
      sbParamJson: ["(address)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT", "(integer)61"],
      sbPushString: "buyOnAuction",
      nnc: "0xfcd70b3f0465eefdd51f92864b15e651f9a72058"
  };
  NEOGAMESDK.makeRawTransaction(data, function(res){
    // �ӿڻص�
    if��res.err == false��{
      // ��ȡ��Լִ�н��
      var txid = res.info.txid;
    }
  })
```
**data������** 

|������|��ѡ|����|˵��|
|:----    |:---|:----- |-----   |
|sbParamJson |��  |Array |��Լ��������   |
|sbPushString |��  |string |��Լ������   |
|nnc |��  |string |��Լ��ַ   |

**����ʾ��**

``` 
  {
    "err": false,
    "info":
    {
      "txid": "a55e30075527c063bd366dffb54fca9fba5a58ff7d1ba835201ef396cbffad7e"
    }
  }
```

### ��������ȷ�ϣ����֪ͨ��
#### 1���ӿ�˵��
    
**��Ҫ������** 

- ��ĳ����ֵ��������ȷ�Ϻ�`NEO.GAME�ڵ�`���ᷢ����ȷ�Ͻ����`Ӧ�ó�ֵϵͳ�ڵ�`��

**����URL��** 
- ` http://Ӧ�ó�ֵϵͳ�ڵ�ӿ� `
  
**����ʽ��**
- POST 

**������** 

|������|��ѡ|����|˵��|
|:----    |:---|:----- |-----   |
|g_id |��  |string |Ӧ��id��NEOGAME����   |
|txid |��  |string |����txid   |
|from |��  |string | ����֧����Ǯ����ַ    |
|count     |��  |string | ֧��sgas����    |
|tm     |��  |string | ����ʱ�������λ��    |
|sign     |��  |string | ����ǩ��    |


 **��ע** 

- ���ɹ����ͽ���ȷ�Ϻ�`NEO.GAME�ڵ�`�����ٷ���֪ͨ
- ���`NEO.GAME�ڵ�`����֪ͨʧ�ܣ������Զ�η��͡�

#### 2��signǩ���㷨

����ȷ��֪ͨPOST���������ֵ���������
```
count=0.001&from=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT&g_id=1&tm=1528374108&txid=0x900936d8e34d6dfc89bedcbba1f160bcfad8702d1f0c4a8cfa1fafcc1d51025c
```
���Ӧ��ǩ��`֧��key`��NEOGAME���䣩
```
count=0.001&from=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT&g_id=1&tm=1528374108&txid=0x900936d8e34d6dfc89bedcbba1f160bcfad8702d1f0c4a8cfa1fafcc1d51025c&key=222
```
����md5��Сд��
```
md5("count=0.001&from=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT&g_id=1&tm=1528374108&txid=0x900936d8e34d6dfc89bedcbba1f160bcfad8702d1f0c4a8cfa1fafcc1d51025c&key=222")
```
�ó�sign
`58441125ece2f2747c2e1b5324488262`


### �ġ���¼��Ϸ˵��
#### 1���ӿ�˵��

    
**��Ҫ������** 

- �û�ͨ����Ϸ��ڵ�ַ��¼��Ϸ

**����URL��** 
- ` http://��Ϸ��ڵ�ַ/ `
  
**����ʽ��**
- GET 

**������** 

|������|��ѡ|����|˵��|
|:----    |:---|:----- |-----   |
|g_id |��  |string |Ӧ��ID��NEOGAME����   |
|uid |��  |string | NEOGAME�û�ID    |
|time     |��  |string | ��¼ʱ�������λ��    |
|wallet     |��  |string | �û�Ǯ����ַ    |
|sign     |��  |string | ����ǩ��    |


 **��ע** 

- Ӧ��Ӧ���ڷ������֤��¼sign�Ƿ���ȷ

#### 2��signǩ������

��¼����GET���������ֵ���������
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT
```
���Ӧ��ǩ��`��¼key`��NEOGAME���䣩
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222
```
**- `��¼key`��ӷ�����`֧��key`��ӷ�ʽ`��һ��`����ע�����֣�**

����md5��Сд��
```
md5("g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222")
```
�ó�sign
`860b5f9f52a9f07e961f2454e0e89bbe`






