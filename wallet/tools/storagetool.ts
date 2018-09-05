
namespace BlackCat.tools {
    export class StorageTool {
        static getLoginArr(): LoginInfo[] {
            var message = sessionStorage.getItem("login-info-arr");

            var arr: LoginInfo[] = message ? LoginInfo.StringToArray(message) : [];
            return arr;
        }
        static setLoginArr(value: LoginInfo[]) {
            sessionStorage.setItem('login-info-arr', LoginInfo.ArrayToString(value));
        }
        static setStorage(key: string, value: string) {
            sessionStorage.setItem(key, value)
        }
        static getStorage(key: string): string {
            return sessionStorage.getItem(key);
        }
        static delStorage(key: string) {
            sessionStorage.removeItem(key);
        }
        static async heightRefresh() {
            let oldheight = StorageTool.getStorage("block-height");
            let height = await tools.WWW.api_getHeight_nodes() as number;
            if (oldheight == undefined || oldheight == null || oldheight == "") {
                StorageTool.setStorage("block-height", height.toString());
            }
            if (height - parseInt(oldheight) >= 2) {
                StorageTool.utxosRefresh();
                StorageTool.setStorage('block-height', height.toString());
            }
            // setInterval(this.heightRefresh(), 30000);
        }
        static async utxosRefresh() {
            let assets = await tools.CoinTool.getassets()
            UTXO.setAssets(assets);
        }

    }

    export class StaticStore {
        static choiceAsset: string = "";

        static setAsset(asset: string) {
            StaticStore.choiceAsset = asset;
        }
    }
}