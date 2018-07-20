namespace BlackCat {
    export class NetMgr {

        type: number; // 1：主网；2:测试网
        types: Array<number>; // 网络类型集合

        constructor() {
            this.types = [1, 2]
            // 主网
            // this.change2Main()

            // 测试网
            this.chang2test()

            // ApiTool.base_url = "http://site01.blacat.org/apic/apic_user.php"
            ApiTool.base_url = 'http://182.254.139.130/apic_v2/apic_user.php'
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

        private chang2test() {
            // 测试网
            this.type = 2;
            // --节点地址
            tools.WWW.api = "http://nelnode00.blacat.org:82/api/testnet";
            tools.WWW.apiaggr = "http://nelnode00.blacat.org:82/api/testnet";
            // sgas合约地址
            tools.CoinTool.id_SGAS = "0x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54";
        }

        private change2Main() {
            // 主网
            this.type = 1;
            // --节点地址
            tools.WWW.api = "http://nelnode01.blacat.org:82/api/mainnet";
            tools.WWW.apiaggr = "http://nelnode01.blacat.org:82/api/mainnet";
            // 主网sgas合约
            tools.CoinTool.id_SGAS = "";
        }


        chang(type: number) {
            if (this.type != type) {
                console.log('[Bla Cat]', '[NetType]', ' change to type => ', type)
                switch (type) {
                    case 1: // 主网
                        this.change2Main()
                        break;
                    case 2: // 测试网
                        this.chang2test()
                        break;
                    default:
                        return false;
                }
                return true;
            }
            return false;
        }
    }

}