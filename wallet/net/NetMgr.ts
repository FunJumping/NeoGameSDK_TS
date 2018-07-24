namespace BlackCat {
    export class NetMgr {

        types: Array<number>; // 网络类型
        nodes: any; // nel节点
        apis: any; // api节点

        type: number; // 1：主网；2:测试网

        constructor() {
            this.types = [1, 2]

            this.nodes = {}
            this.nodes[1] = [
                // 主网
                "http://nelnode01.blacat.org:82/api/mainnet",
                "https://api.nel.group/api/mainnet"
            ]
            this.nodes[2] = [
                // 测试网
                "http://nelnode00.blacat.org:82/api/testnet",
                "https://api.nel.group/api/testnet"
            ]
        }

        async selectApi() {
            // ApiTool.base_url = "http://api01.blacat.org/apic/apic_user.php"
            ApiTool.base_url = "http://182.254.139.130/apic_v2/apic_user.php"
            return true
        }

        private selectNode() {
            // tools.WWW.api = this.nodes[this.type][0]; // BlaCat
            tools.WWW.api = this.nodes[this.type][1]; // Nel
            return true
        }


        // 选择/切换网络
        async change(type: number = 2) {
            if (this.type != type) {
                console.log('[Bla Cat]', '[NetType]', ' change to type => ', type)
                switch (type) {
                    case 1: // 主网
                        return await this.change2Main()
                    case 2: // 测试网
                        return await this.change2test()
                    default:
                        return false;
                }
            }
            return false;
        }



        private async change2test() {
            // 测试网
            this.type = 2;

            // --节点地址
            var res = this.selectNode()
            if (!res) {
                return false;
            }

            // --sgas合约地址
            tools.CoinTool.id_SGAS = "0x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54";

            // --资源访问地址
            // Main.resHost = "http://182.254.139.130/sdk/"

            return true;
        }

        private async change2Main() {
            // 主网
            this.type = 1;

            // --节点地址
            var res = this.selectNode()
            if (!res) {
                return false;
            }

            // --主网sgas合约
            tools.CoinTool.id_SGAS = "";

            // --资源访问地址
            // Main.resHost = "http://182.254.139.130/sdk/"

            return true;
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