namespace BlackCat {
    export class LangMgr {

        type: string;
        private lang;

        constructor(type: string = "") {
            // this.setType(type)
        }

        setType(type: string): boolean {
            console.log("[BlaCat]", '[LangMgr]', 'setType, type => ', type, ', this.type => ', this.type)
            if (this.type == type) {
                // 语言包一致，不需要重置
                return false;
            }
            switch (type) {
                case "en":
                    this.lang = new LangEN();
                    this.type = type
                    break;
                case "jp":
                    this.lang = new LangJP();
                    this.type = type
                    break;
                default:
                    this.lang = new LangCN();
                    this.type = "cn"
                    break;
            }
            if(type=='jp'){
                Main.viewMgr.mainView.div.classList.add("pc_jptype")
            }else{
                Main.viewMgr.mainView.div.classList.remove("pc_jptype")
            }
            return true;
        }

        get(key: string, ext = null) {
            var src = this.lang.get(key) as string
            if (ext) {
                for (let k in ext) {
                    let rk = '%' + k + '%'
                    src = src.replace(rk, ext[k])
                }
            }
            return src;
        }
    }
}