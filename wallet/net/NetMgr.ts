namespace BlackCat {
    export class NetMgr {

        private types: Array<number>; // 网络类型
        private nodes: any; // nel节点
        private apis: any; // api节点

        private default_type: number; // 默认网络，1：主网；2:测试网

        type: number; // 当前网络
        private api_server: string; // 当前api_server
        private node_server: any; // 当前nelnode_server

        constructor() {
            this.types = [1, 2]

            this.nodes = {}
            this.nodes[1] = [
                // 主网
                "http://nelnode01.blacat.org:82/api/mainnet",
                "https://api.nel.group/api/mainnet",
                // "https://nelnode01.9191wyx.com/api/mainnet",
            ]
            this.nodes[2] = [
                // 测试网
                "http://nelnode00.blacat.org:82/api/testnet",
                "https://api.nel.group/api/testnet",
                "https://nelnode00.9191wyx.com/api/testnet",
            ]

            // this.apis = [
            //     // 正式服
            //     "https://api01.blacat.org/apic/apic_user.php"
            // ]

            this.apis = [
                // 调试服
                "https://api00.9191wyx.com/apic_v2/apic_user.php"
                // "http://10.1.8.132/new/nel/api_c/apic_user.php"
            ]


            this.node_server = {}
            this.default_type = 1;
        }

        selectApi(callback) {
            if (this.api_server) {
                ApiTool.base_url = this.api_server;
                callback()
                return
            }
            var conn = new Connector(this.apis, "")
            conn.getOne((res) => {
                if (res === false) {
                    if (Main.viewMgr.mainView.isHidden()) {
                        // 如果mainView隐藏，显示出来
                        Main.viewMgr.mainView.show()
                        Main.viewMgr.iconView.hidden()
                    }
                    Main.showErrMsg("netmgr_select_api_slow")
                    return
                }
                console.log('[Bla Cat]', '[NetMgr]', 'api => ', res)
                ApiTool.base_url = res;
                this.api_server = res;
                callback()
            })
        }

        private selectNode(callback, type) {
            if (this.node_server && this.node_server.hasOwnProperty(type) && this.node_server[type]) {
                tools.WWW.api = this.node_server[type];
                callback()
                return
            }
            var conn = new Connector(this.nodes[type], "?jsonrpc=2.0&id=1&method=getblockcount&params=[]")
            conn.getOne((res) => {
                if (res === false) {
                    if (Main.viewMgr.mainView.isHidden()) {
                        // 如果mainView隐藏，显示出来
                        Main.viewMgr.mainView.show()
                        Main.viewMgr.iconView.hidden()
                    }
                    Main.showErrMsg("netmgr_select_node_slow")
                    return
                }
                console.log('[Bla Cat]', '[NetMgr]', 'node => ', res)
                tools.WWW.api = res;
                this.node_server[type] = res;
                callback()
            })
        }


        // 选择/切换网络
        change(callback, type: number = null) {
            if (!type) {
                type = this.default_type;
            }
            if (this.type != type) {
                console.log('[Bla Cat]', '[NetType]', ' change to type => ', type)
                switch (type) {
                    case 1: // 主网
                        this.change2Main(callback)
                        break;
                    case 2: // 测试网
                        this.change2test(callback)
                        break;
                }
            }
        }
        setDefault(type: number) {
            console.log('[Bla Cat]', '[NetType]', ' default type => ', type)
            this.default_type = type;
        }



        private async change2test(callback) {
            
            // 节点地址
            this.selectNode(() => {

                // 测试网
                this.type = 2;

                // sgas合约地址
                tools.CoinTool.id_SGAS = "0x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54";

                // 回调
                callback()

            }, 2)
        }

        private async change2Main(callback) {

            // 节点地址
            this.selectNode(() => {

                // 主网
                this.type = 1;

                // 主网sgas合约
                tools.CoinTool.id_SGAS = "";

                // 回调
                callback()

            }, 1)
        }

        getOtherTypes(): Array<number> {
            var res = new Array()
            for (let k = 0; k < this.types.length; k++) {
                if (this.types[k] !== this.type) {
                    res.push(this.types[k])
                }
            }
            return res;
        }
    }

}