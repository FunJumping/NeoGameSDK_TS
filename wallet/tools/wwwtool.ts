namespace BlackCat.tools {
    export class WWW {
        // Nel
        // static api: string = "https://api.nel.group/api/testnet";
        // static apiaggr: string = "https://apiaggr.nel.group/api/testnet";

        // Black Cat
        // static api: string;
        static api_nodes: string
        // static apiaggr: string;
        static api_clis: string;
        static api_cgas: string;

        static makeRpcUrl(url: string, method: string, ..._params: any[]) {
            var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
            for (var i = 0; i < _params.length; i++) {
                urlout += JSON.stringify(_params[i]);
                if (i != _params.length - 1)
                    urlout += ",";
            }
            urlout += "]";
            return urlout;
        }
        static makeRpcPostBody(method: string, ..._params: any[]): {} {
            var body = {};
            body["jsonrpc"] = "2.0";
            body["id"] = 1;
            body["method"] = method;
            var params = [];
            for (var i = 0; i < _params.length; i++) {
                params.push(_params[i]);
            }
            body["params"] = params;
            return body;
        }

        // static async gettransbyaddress(address: string, pagesize: number, pageindex: number)
        // {
        //     var postdata =
        //         WWW.makeRpcPostBody(
        //             "gettransbyaddress",
        //             address,
        //             pagesize,
        //             pageindex
        //         );
        //     var result = await fetch(WWW.apiaggr, { "method": "post", "body": JSON.stringify(postdata) });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     return r;
        // }

        // static async  api_getHeight()
        // {
        //     var str = WWW.makeRpcUrl(WWW.api_nodes, "getblockcount");
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     var height = parseInt(r[ 0 ][ "blockcount" ] as string) - 1;
        //     return height;
        // }

        static async api_getHeight_nodes(nodes_url: string = WWW.api_nodes) {
            var str = WWW.makeRpcUrl(nodes_url, "getblockcount");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            var height = parseInt(r[0]["blockcount"] as string) - 1;
            return height;
        }

        static async  api_getHeight_clis(clis_url: string = WWW.api_clis) {
            var str = WWW.makeRpcUrl(clis_url, "getblockcount");

            str += "&uid=" + Main.randNumber

            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            var height = parseInt(r[0]["blockcount"] as string) - 1;
            return height;
        }

        // static async api_getBlockInfo(index: number)
        // {
        //     var str = WWW.makeRpcUrl(WWW.api, "getblocktime");
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     var height = parseInt(r[ 0 ][ "blockcount" ] as string) - 1;
        //     return height;
        // }
        static async api_getAllAssets() {
            var str = WWW.makeRpcUrl(WWW.api_nodes, "getallasset");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getUTXO(address: string) {
            var str = WWW.makeRpcUrl(WWW.api_nodes, "getutxo", address);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }

        static async api_getAvailableUTXOS(address: string, amount: number) {
            var postdata = WWW.makeRpcPostBody("getavailableutxos", address, amount);
            var result = await fetch(WWW.api_cgas, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        // static async api_getnep5Balance(address: string)
        // {
        //     var str = WWW.makeRpcUrl(WWW.api, "getallnep5assetofaddress", address, 1);
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     return r;
        // }

        // static async api_getnep5balanceofaddress(scriptaddr: String, address: string, )
        // {
        //     var str = WWW.makeRpcUrl(WWW.api, "getnep5balanceofaddress", scriptaddr.toString(), address);
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     return r;
        // }

        // static async api_getNep5TransferByTxid(txid: string)
        // {
        //     var str = WWW.makeRpcUrl(WWW.api, "getnep5transferbytxid", txid.toString());
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     return r;
        // }

        static async api_getBalance(address: string) {
            var str = WWW.makeRpcUrl(WWW.api_nodes, "getbalance", address);
            var value = await fetch(str, { "method": "get" });
            var json = await value.json();
            var r = json["result"];
            return r;
        }

        static async getNep5Asset(asset: string) {
            var postdata = WWW.makeRpcPostBody("getnep5asset", asset);
            var result = await fetch(WWW.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"][0];
            return r;
        }

        // static async api_getAddressTxs(address: string, size: number, page: number)
        // {
        //     var postdata = WWW.makeRpcPostBody("getaddresstxs", address, size, page);
        //     var result = await fetch(WWW.api, { "method": "post", "body": JSON.stringify(postdata) });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     return r;
        // }

        static async cli_postRawTransaction(data: Uint8Array): Promise<boolean> {
            var cli = 0;
            if (WWW.api_clis && WWW.api_clis != "") {
                cli = 1;
            }

            var api_url = WWW.api_nodes;
            if (cli == 1) {
                api_url = WWW.api_clis
            }
            var postdata = WWW.makeRpcPostBody("sendrawtransaction", data.toHexString());
            if (cli == 1) postdata["uid"] = Main.randNumber
            var result = await fetch(api_url, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"][0] as boolean;
            return r;
        }

        static async api_postRawTransaction(data: Uint8Array): Promise<boolean> {
            var postdata = WWW.makeRpcPostBody("sendrawtransaction", data.toHexString());
            var result = await fetch(WWW.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"][0] as boolean;
            return r;
        }

        // static async api_getclaimgas(address: string, type: number)
        // {
        //     if (type)
        //         var str = WWW.makeRpcUrl(WWW.api, "getclaimgas", address, type);
        //     else
        //         var str = WWW.makeRpcUrl(WWW.api, "getclaimgas", address);
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     if (r == undefined)
        //         return 0;
        //     return r[ 0 ];
        // }
        //获得提币的交易体
        // static async api_getclaimtxhex(address: string): Promise<string>
        // {
        //     var str = WWW.makeRpcUrl(WWW.api, "getclaimtxhex", address);
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     if (r == undefined)
        //         return "";
        //     return r[ 0 ][ "claimtxhex" ];
        // }
        //获得高度
        // static async  rpc_getHeight()
        // {
        //     var str = WWW.makeRpcUrl(WWW.api, "getblockcount");
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     var height = parseInt(r as string) - 1;
        //     return height;
        // }
        //调用storage合约
        // static async  rpc_getStorage(scripthash: Uint8Array, key: Uint8Array): Promise<string>
        // {
        //     var str = WWW.makeRpcUrl(WWW.api, "getstorage", scripthash.toHexString(), key.toHexString());
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     if (json[ "result" ] == null)
        //         return null;
        //     var r = json[ "result" ] as string;
        //     return r;
        // }

        // cli调用invoke合约
        static async cli_getInvokescript(scripthash: Uint8Array): Promise<any> {
            var cli = 0;
            if (WWW.api_clis && WWW.api_clis != "") {
                cli = 1;
            }

            var api_url = WWW.api_nodes;
            if (cli == 1) {
                api_url = WWW.api_clis
            }
            var str = WWW.makeRpcUrl(api_url, "invokescript", scripthash.toHexString());
            if (cli == 1) {
                str += "&uid=" + Main.randNumber
            }
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            if (json["result"] == null)
                return null;
            var r = json["result"][0]
            return r;
        }

        // nel调用invoke合约
        static async rpc_getInvokescript(scripthash: Uint8Array): Promise<any> {
            var str = WWW.makeRpcUrl(WWW.api_nodes, "invokescript", scripthash.toHexString());
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            if (json["result"] == null)
                return null;
            var r = json["result"][0]
            return r;
        }
        //获得交易详情
        static async getrawtransaction(txid: string) {
            var str = WWW.makeRpcUrl(WWW.api_nodes, "getrawtransaction", txid);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            if (!json["result"])
                return null;
            var r = json["result"][0]
            return r;
        }

        static async api_getcontractstate(scriptaddr: string) {
            var str = WWW.makeRpcUrl(WWW.api_nodes, "getcontractstate", scriptaddr);
            var value = await fetch(str, { "method": "get" });
            var json = await value.json();
            var r = json["result"][0];
            return r;
        }

        //注册域名时塞值
        // static async setnnsinfo(address: string, name: string, time: number)
        // {
        //     var str = WWW.makeRpcUrl(WWW.apiaggr, "setnnsinfo", address, name, time);
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     if (json[ "result" ] == null)
        //         return null;
        //     var r = json[ "result" ][ 0 ][ "result" ]
        //     return r;
        // }
        //获取地址下所有的域名
        // static async getnnsinfo(address: string): Promise<string[]>
        // {

        //     var postdata = WWW.makeRpcPostBody("getdomainbyaddress2", address);
        //     var result = await fetch(WWW.apiaggr, { "method": "post", "body": JSON.stringify(postdata) });
        //     var json = await result.json();
        //     if (json[ "result" ] == null)
        //         return null;
        //     var r = json[ "result" ]
        //     return r;
        // }
        // static async delnnsinfo(domain: string)
        // {
        //     var str = WWW.makeRpcUrl(WWW.apiaggr, "delnnsinfo", domain);
        //     var result = await fetch(str, { "method": "get" });
        //     var json = await result.json();
        //     if (json[ "result" ] == null)
        //         return null;
        //     var r = json[ "result" ][ 0 ][ "result" ]
        //     return r;
        // }
        //nns（.neo） start
        // static async api_getBidListByAddress(address: string)
        // {
        //     var postdata = WWW.makeRpcPostBody("getbidlistbyaddress", address);
        //     var result = await fetch(WWW.apiaggr, { "method": "post", "body": JSON.stringify(postdata) });
        //     var json = await result.json();
        //     var r = json[ "result" ];
        //     return r;
        // }

    }
}