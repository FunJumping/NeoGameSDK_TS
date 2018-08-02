
namespace BlackCat {

    export class User {

        info: UserInfo = new UserInfo();
        cacheKey: string = 'BC_userinfo';

        getInfo() {
            var userinfo = localStorage.getItem(this.cacheKey);
            if (userinfo) {
                this.info = JSON.parse(userinfo) as UserInfo;
            }
        }

        setInfo(key, value) {
            this.info[key] = value;
            localStorage.setItem(this.cacheKey, JSON.stringify(this.info));
        }

        async isLogined() {

            var api_userinfo: any = await ApiTool.isLogined(this.info.uid, this.info.token);

            if (api_userinfo.r) {
                // 登录成功状态，检查钱包地址是否有变化
                if (api_userinfo.data.wallet != this.info.wallet) {
                    // 获取新钱包文件
                    var new_wallet_file = await this.getWalletFile();

                    if (new_wallet_file != null) {
                        // 原钱包缓存删除
                        localStorage.removeItem(this.info.wallet);

                        // 设置本类中info钱包新地址
                        this.info.wallet = api_userinfo.data.wallet;

                        // 设置info缓存钱包地址
                        this.setInfo('wallet', this.info.wallet);

                        // 设置新钱包文件缓存
                        localStorage.setItem(this.info.wallet, new_wallet_file);
                    }
                }
                return true;
            }
            else {
                // 登录失效，删除localstorage，需要重新登录
                localStorage.removeItem(this.cacheKey);

                // 删除钱包json文件
                localStorage.removeItem(this.info.wallet);

                this.info = new UserInfo();

                return false;
            }
        }

        async getWalletFile() {
            var api_wallet: any = await ApiTool.getWalletFile(this.info.uid, this.info.token);
            if (api_wallet.r) {
                return api_wallet.data;
            }
            return null;
        }

        logout() {
            localStorage.removeItem(this.cacheKey);
            if (this.info.wallet) {
                localStorage.removeItem(this.info.wallet)
            }
            this.info = new UserInfo();

            // 清理打开的钱包
            Main.wallet.closeWallet()
        }

        async getWalletFileCache() {
            if (!this.info) {
                this.getInfo();
            }
            var walletFile = localStorage.getItem(this.info.wallet);
            if (walletFile) {
                return walletFile;
            }
            return null;
        }

        async validateLogin(): Promise<number> {
            // 用户登录状态
            this.getInfo();

            var user_logined = await this.isLogined();

            if (!user_logined) {
                return 0;
            }
            else if (!this.info.wallet) {
                // 没有绑定钱包
                return -1;
            }
            else {
                // 登录成功
                return 1;
            }

        }
    }
}