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

                // 国内
                // "https://nelnode01.9191wyx.com/api/mainnet",
                "https://api.nel.group/api/mainnet",

                // 其他地区
                "https://nelnode01.blacat.org/api/mainnet",
            ]
            this.nodes[2] = [
                // 测试网

                // 国内
                "https://nelnode00.9191wyx.com/api/testnet",
                "https://api.nel.group/api/testnet",

                // 其他地区
                "https://nelnode00.blacat.org/api/testnet",
            ]

            this.apis = [
                // 调试服
                "//api00.9191wyx.com/apic_v2/",
                // "http://10.1.8.132/new/nel/api_c/"

                
                // 正式服

                // 国内
                // "//apip01.9191wyx.com/apic/",

                // 其他地区
                // "//api01.blacat.org/apic/",
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

            // 连接中...
            Main.viewMgr.change("ViewConnecting")
            ViewConnecting.callback_retry = () => {
                // 重试
                this._selectApi(callback)
            }
            this._selectApi(callback)
        }
        private _selectApi(callback) {
            Main.viewMgr.viewConnecting.showConnecting()
            Main.viewMgr.iconView.showState()
            var conn = new Connector(this.apis, "apic_test.php")
            conn.getOne((res) => {
                if (res === false) {
                    // 失败提示
                    ViewConnecting.content = "netmgr_select_api_slow"
                    // 重试（返回）按钮
                    Main.viewMgr.viewConnecting.showRetry(false)
                    // 隐藏icon状态
                    Main.viewMgr.iconView.hiddenState()
                    // icon颜色（灰色）
                    if (Main.isLoginInit() === true) Main.viewMgr.iconView.showFail()
                    return
                }
                console.log('[Bla Cat]', '[NetMgr]', 'api => ', res)
                this.api_server = res + "apic_user.php"
                ApiTool.base_url = this.api_server
                callback()
                // if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
            })
        }
        

        private selectNode(callback, type) {
            if (this.node_server && this.node_server.hasOwnProperty(type) && this.node_server[type]) {
                tools.WWW.api = this.node_server[type];
                callback()
                return
            }

            // 连接中...
            Main.viewMgr.change("ViewConnecting")
            ViewConnecting.callback_retry = () => {
                // 重试
                this._selectNode(callback, type)
            }
            this._selectNode(callback, type)
        }

        private _selectNode(callback, type) {
            Main.viewMgr.viewConnecting.showConnecting()
            Main.viewMgr.iconView.showState()
            var conn = new Connector(this.nodes[type], "?jsonrpc=2.0&id=1&method=getblockcount&params=[]")
            conn.getOne((res) => {
                if (res === false) {
                    // 失败提示
                    ViewConnecting.content = "netmgr_select_node_slow"
                    // 重试（返回）按钮
                    var showReturn = !Main.isLoginInit()
                    Main.viewMgr.viewConnecting.showRetry(showReturn)
                    // 隐藏icon状态
                    Main.viewMgr.iconView.hiddenState()
                    // icon颜色（灰色）
                    if (Main.isLoginInit() === true) Main.viewMgr.iconView.showFail()
                    return
                }
                console.log('[Bla Cat]', '[NetMgr]', 'node => ', res)
                this.node_server[type] = res
                tools.WWW.api = this.node_server[type]
                callback()
                if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
                // 隐藏状态
                Main.viewMgr.iconView.hiddenState()
                // 显示正常
                Main.viewMgr.iconView.showSucc()
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
                // SGAS旧合约地址
                tools.CoinTool.id_SGAS_OLD = []
                // tools.CoinTool.id_SGAS_OLD.push("0x3f7420285874867c30f32e44f304fd62ad1e9573");
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
                // SGAS旧合约地址
                tools.CoinTool.id_SGAS_OLD = []
                // tools.CoinTool.id_SGAS_OLD.push("0x5956f9bba5189e1b0c063ed33893131efe694761");
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