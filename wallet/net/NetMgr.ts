namespace BlackCat {
    export class NetMgr {
        type: number; // 1：主网；2:测试网

        types: Array<number>;

        constructor() {
            this.types = [1,2]
            // 主网
            // this.change2Main()

            // 测试网
            this.chang2test()
        }

        getOtherTypes(): Array<number> {
            var res = new Array()
            for (let k = 0; k<this.types.length; k++) {
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
            tools.WWW.api = "http://47.52.159.178:82/api/testnet";
            tools.WWW.apiaggr = "http://47.52.159.178:82/api/testnet";

            // tools.WWW.api = "https://api.nel.group/api/testnet";
            // tools.WWW.apiaggr = "https://api.nel.group/api/testnet";
        }

        private change2Main() {
            // 主网
            this.type = 1;
            // --节点地址
            // tools.WWW.api = "http://47.52.132.248:82/api/mainnet";
            // tools.WWW.apiaggr = "http://47.52.132.248:82/api/mainnet";

            // nel
            tools.WWW.api = "https://api.nel.group/api/mainnet";
            tools.WWW.apiaggr = "https://api.nel.group/api/mainnet";
        }


        chang(type:number)
        {
            if (this.type != type) {
                console.log('[Bla Cat]', '[NetType]', ' change to type => ', type)
                switch (type) {
                    case 1: // 主网
                        this.change2Main()
                        Main.viewMgr.mainView.div.classList.remove("pc_windowtest2")
                        break;
                    case 2: // 测试网
                        this.chang2test()
                        Main.viewMgr.mainView.div.classList.add("pc_windowtest2")
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