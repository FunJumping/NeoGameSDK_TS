namespace BlackCat {
    export class NetMgr {

        private types: Array<number>; // 网络类型
        private nodes: any; // nel节点
        private apis: any; // api节点
        private clis: any; // cli节点

        private default_type: number; // 默认网络，1：主网；2:测试网

        type: number; // 当前网络
        private api_server: string; // 当前api_server
        private node_server: any; // 当前nelnode_server
        private cli_server: any; // 当前neocli节点

        private node_change_tmp: any; // 选择node节点

        constructor() {
            this.types = [1, 2]

            this.clis = {}
            this.clis[1] = [
                // 主网cli
                // 大陆
                'https://clip01.9191wyx.com/api/mainnet',
                // 其他地区
                'https://neocli01.blacat.org/api/mainnet',
            ]
            this.clis[2] = []

            this.nodes = {}
            this.nodes[1] = [
                // 主网nel

                // 大陆
                // "https://nelnode01.9191wyx.com/api/mainnet",
                "https://api.nel.group/api/mainnet",

                // 其他地区
                "https://nelnode01.blacat.org/api/mainnet",
                "http://nelnode01.blacat.org:82/api/mainnet",
            ]
            this.nodes[2] = [
                // 测试网nel

                // 大陆
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

                // 大陆
                // "//apip01.9191wyx.com/apic/",

                // 其他地区
                // "//api01.blacat.org/apic/",
            ]

            this.node_server = {}
            this.default_type = 1;
            this.cli_server = {}
        }

        // 选择后台接口访问地址
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
            var conn = new Connector(this.apis, "apic_test.php", 'api')
            conn.getOne((res, response) => {
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
                console.log('[Bla Cat]', '[NetMgr]', 'api response => ', response)
                this.api_server = res + "apic_user.php"
                ApiTool.base_url = this.api_server
                callback()
                // if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
            })
        }
        

        // 选择nelnode节点，使用这个后，必须再使用selectCli
        private selectNode(callback, type, force = 0) {
            if (force == 0 && this.node_server && this.node_server.hasOwnProperty(type) && this.node_server[type]) {
                // tools.WWW.api = this.node_server[type];
                this.node_change_tmp = this.node_server[type]
                // callback()
                this.selectCli(callback, type, force)
                return
            }

            // 连接中...
            Main.viewMgr.change("ViewConnecting")
            ViewConnecting.callback_retry = () => {
                // 重试
                this._selectNode(callback, type, force)
            }
            this._selectNode(callback, type, force)
        }

        private _selectNode(callback, type, force) {
            Main.viewMgr.viewConnecting.showConnecting()
            Main.viewMgr.iconView.showState()
            var conn = new Connector(this.nodes[type], "?jsonrpc=2.0&id=1&method=getblockcount&params=[]", 'node')
            conn.getOne((res, response) => {
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
                console.log('[Bla Cat]', '[NetMgr]', 'node response => ', response)

                
                // this.node_server[type] = res
                // tools.WWW.api = this.node_server[type]
                // callback()
                // if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
                // // 隐藏状态
                // Main.viewMgr.iconView.hiddenState()
                // // 显示正常
                // Main.viewMgr.iconView.showSucc()

                // 因为还需要选择cli节点，这里暂存一下结果
                this.node_change_tmp = res
                this.selectCli(callback, type, force)
            })
        }


        private selectCli(callback, type, force = 0) {

            if (!this.clis || !this.clis[type] || this.clis[type].length == 0) {
                this.node_server[type] = this.node_change_tmp
                tools.WWW.api = this.node_server[type]

                this.cli_server[type] = null
                tools.WWW.api_cli = null
                callback()

                if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
                // 隐藏状态
                Main.viewMgr.iconView.hiddenState()
                // 显示正常
                Main.viewMgr.iconView.showSucc()

                return
            }

            if (force == 0 && this.cli_server && this.cli_server.hasOwnProperty(type) && this.cli_server[type]) {
                // tools.WWW.api = this.node_server[type];

                this.node_server[type] = this.node_change_tmp
                tools.WWW.api = this.node_server[type]

                tools.WWW.api_cli = this.cli_server[type]
                
                callback()

                if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
                // 隐藏状态
                Main.viewMgr.iconView.hiddenState()
                // 显示正常
                Main.viewMgr.iconView.showSucc()
                
                return
            }

            // 连接中...
            Main.viewMgr.change("ViewConnecting")
            ViewConnecting.callback_retry = () => {
                // 重试
                this._selectCli(callback, type)
            }
            this._selectCli(callback, type)
        }

        private _selectCli(callback, type) {
            Main.viewMgr.viewConnecting.showConnecting()
            Main.viewMgr.iconView.showState()
            var conn = new Connector(this.clis[type], "?jsonrpc=2.0&id=1&method=getblockcount&params=[]&uid="+Main.randNumber, 'cli')
            conn.getOne((res, response) => {
                if (res === false) {
                    // 失败提示
                    ViewConnecting.content = "netmgr_select_cli_slow"
                    // 重试（返回）按钮
                    var showReturn = !Main.isLoginInit()
                    Main.viewMgr.viewConnecting.showRetry(showReturn)
                    // 隐藏icon状态
                    Main.viewMgr.iconView.hiddenState()
                    // icon颜色（灰色）
                    if (Main.isLoginInit() === true) Main.viewMgr.iconView.showFail()
                    return
                }
                console.log('[Bla Cat]', '[NetMgr]', 'cli => ', res)
                console.log('[Bla Cat]', '[NetMgr]', 'cli response => ', response)

                // cli也选择成功，可都修改参数了
                this.node_server[type] = this.node_change_tmp
                tools.WWW.api = this.node_server[type]

                this.cli_server[type] = res
                tools.WWW.api_cli = this.cli_server[type]

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
                tools.CoinTool.id_SGAS = "0x961e628cc93d61bf636dc0443cf0548947a50dbe";
                // SGAS旧合约地址
                tools.CoinTool.id_SGAS_OLD = ["0x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54"]
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
                tools.CoinTool.id_SGAS = "0x961e628cc93d61bf636dc0443cf0548947a50dbe";
                // SGAS旧合约地址
                tools.CoinTool.id_SGAS_OLD = []
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