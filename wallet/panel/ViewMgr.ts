namespace BlackCat {
    // 视图管理器
    export class ViewMgr {

        views: any; // 所有在mainView打开过的界面

        iconView: IconView; // 最小化界面
        mainView: MainView; // 主界面

        viewWalletOpen: ViewWalletOpen; // 打开钱包
        viewTransCount: ViewTransCount; // 输入交易sgas数量
        viewTransConfirm: ViewTransConfirm; // 交易确认框
        viewTransConfirmGas: ViewTransConfirmGas; // Gas交易确认框
        viewAlert: ViewAlert;//提示
        viewConfirm: ViewConfirm;//确认
        viewToast: ViewToast;//自动消失
        viewLoading: ViewLoading;//Loading

        registerView: RegisterView; // 注册界面
        loginView: LoginView; // 登录界面
        forgetPasswordView: ForgetPasswordView; //忘记密码

        walletView: WalletView; // 钱包界面
        walletCreateView: WalletCreateView; // 创建钱包
        walletImportView: WalletImportView; // 导入钱包

        payView: PayView; // 我的钱包页
        payListDetailView: PayListDetailView; // 钱包记录详细
        payListMoreView: PayListMoreView; // 更多记录

        myInfoView: MyInfoView; // 我的信息
        modifyImgView: ModifyImgView; //修改头像
        modifyNameView: ModifyNameView; //修改昵称
        modifySexView: ModifySexView; //修改性别
        modifyAreaView: ModifyAreaView;//修改地区
        modifyTransactionFeeView: ModifyTransactionFeeView;//修改手续费
        modifyNetworkLineView: ModifyNetworkLineView;//修改网络线路

        securityCenterView: SecurityCenterView; //安全中心
        trustContractView: TrustContractView; //信任合约
        autoLogoutWalletView: AutoLogoutWalletView; //自动登出钱包

        payWalletDetailView: PayWalletDetailView; // 钱包详情
        payExchangeView: PayExchangeView; // 交易所
        payExchangeBCPView: PayExchangeBCPView; // BCP兑换
        payExchangeDetailView: PayExchangeDetailView; //交易购买所详情
        payReceivablesView: PayReceivablesView;//收款
        payTransferView: PayTransferView; // 转账

        addressbookView: AddressbookView; //通讯录
        addressbookDetailsView: AddressbookDetailsView; //通讯录详情
        addressbookOpView: AddressbookOpView; //通讯录操作联系人信息

        viewConnecting: ViewConnecting; // 连接中

        payExchangeBCTView: PayExchangeBCTView; //91币充值


        constructor() {
            this.mainView = new MainView();
            this.mainView.start()

            this.views = {}
        }

        change(type: string) {
            switch (type) {
                // 打开钱包时输入密码界面
                case "ViewWalletOpen":
                    console.log("[BlaCat]", '[ViewMgr]', '显示打开钱包输入密码界面(' + type + ') ...')
                    if (!this.viewWalletOpen) {
                        this.viewWalletOpen = new ViewWalletOpen();
                        this.views[type] = this.viewWalletOpen;
                    }
                    this.viewWalletOpen.start()
                    break;
                // 输入sgas交易数量
                case "ViewTransCount":
                    console.log("[BlaCat]", '[ViewMgr]', '显示输入交易数量界面(' + type + ') ...')
                    if (!this.viewTransCount) {
                        this.viewTransCount = new ViewTransCount();
                        this.views[type] = this.viewTransCount
                    }
                    this.viewTransCount.start()
                    break;
                // 交易确认
                case "ViewTransConfirm":
                    console.log("[BlaCat]", '[viewMgr]', '显示确认交易界面(' + type + ') ...')
                    if (!this.viewTransConfirm) {
                        this.viewTransConfirm = new ViewTransConfirm();
                        this.views[type] = this.viewTransConfirm
                    }
                    this.viewTransConfirm.start()
                    break;
                // 小图标
                case "IconView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示SDK图标(' + type + ') ...')
                    if (!this.iconView) {
                        this.iconView = new IconView();
                        this.views[type] = this.iconView
                    }
                    this.iconView.start()
                    break;
                // 登录
                case "LoginView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示登录(' + type + ') ...')
                    if (!this.loginView) {
                        this.loginView = new LoginView();
                        this.views[type] = this.loginView
                    }
                    this.loginView.start();
                    break;
                // 绑定&导入钱包
                case "WalletView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示绑定&导入钱包(' + type + ') ...')
                    if (!this.walletView) {
                        this.walletView = new WalletView();
                        this.views[type] = this.walletView
                    }
                    this.walletView.start();
                    break;
                case "WalletCreateView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示新建钱包(' + type + ') ...')
                    if (!this.walletCreateView) {
                        this.walletCreateView = new WalletCreateView();
                        this.views[type] = this.walletCreateView
                    }
                    this.walletCreateView.start();
                    break;

                case "WalletImportView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示导入钱包(' + type + ') ...')
                    if (!this.walletImportView) {
                        this.walletImportView = new WalletImportView();
                        this.views[type] = this.walletImportView
                    }
                    this.walletImportView.start();
                    break;
                // 钱包页
                case "PayView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示钱包页(' + type + ') ...')
                    if (!this.payView) {
                        this.payView = new PayView();
                        this.views[type] = this.payView
                    }
                    this.payView.start();
                    break;
                case "PayListDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示交易详情(' + type + ') ...')
                    if (!this.payListDetailView) {
                        this.payListDetailView = new PayListDetailView();
                        this.views[type] = this.payListDetailView
                    }
                    this.payListDetailView.start()
                    break;
                case "PayListMoreView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示更多记录(' + type + ') ...')
                    if (!this.payListMoreView) {
                        this.payListMoreView = new PayListMoreView();
                        this.views[type] = this.payListMoreView
                    }
                    this.payListMoreView.start()
                    break;
                case "MyInfoView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示我的信息(' + type + ') ...')
                    if (!this.myInfoView) {
                        this.myInfoView = new MyInfoView();
                        this.views[type] = this.myInfoView
                    }
                    this.myInfoView.start()
                    break;

                case "PayWalletDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示钱包详情(' + type + ') ...')
                    if (!this.payWalletDetailView) {
                        this.payWalletDetailView = new PayWalletDetailView();
                        this.views[type] = this.payWalletDetailView
                    }
                    this.payWalletDetailView.start()
                    break;
                case "PayExchangeView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示交易所(' + type + ') ...')
                    if (!this.payExchangeView) {
                        this.payExchangeView = new PayExchangeView();
                        this.views[type] = this.payExchangeView
                    }
                    this.payExchangeView.start()
                    break;
                case "PayExchangeBCPView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示交易所(' + type + ') ...')
                    if (!this.payExchangeBCPView) {
                        this.payExchangeBCPView = new PayExchangeBCPView();
                        this.views[type] = this.payExchangeBCPView
                    }
                    this.payExchangeBCPView.start()
                    break;
                case "PayExchangeDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示交易所购买详情(' + type + ') ...')
                    if (!this.payExchangeDetailView) {
                        this.payExchangeDetailView = new PayExchangeDetailView();
                        this.views[type] = this.payExchangeDetailView
                    }
                    this.payExchangeDetailView.start()
                    break;
                case "PayReceivablesView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示收款(' + type + ') ...')
                    if (!this.payReceivablesView) {
                        this.payReceivablesView = new PayReceivablesView();
                        this.views[type] = this.payReceivablesView
                    }
                    this.payReceivablesView.start()
                    break;
                case "PayTransferView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示转账(' + type + ') ...')
                    if (!this.payTransferView) {
                        this.payTransferView = new PayTransferView();
                        this.views[type] = this.payTransferView
                    }
                    this.payTransferView.start()
                    break;
                case "ViewAlert":
                    console.log("[BlaCat]", '[ViewMgr]', '显示提示(' + type + ') ...')
                    if (!this.viewAlert) {
                        this.viewAlert = new ViewAlert();
                        this.views[type] = this.viewAlert
                    }
                    this.viewAlert.start()
                    break;
                case "ViewConfirm":
                    console.log("[BlaCat]", '[ViewMgr]', '显示确认(' + type + ') ...')
                    if (!this.viewConfirm) {
                        this.viewConfirm = new ViewConfirm();
                        this.views[type] = this.viewConfirm
                    }
                    this.viewConfirm.start()
                    break;
                case "ViewToast":
                    console.log("[BlaCat]", '[ViewMgr]', '显示Toast(' + type + ') ...')
                    if (!this.viewToast) {
                        this.viewToast = new ViewToast();
                    }
                    this.viewToast.start()
                    break;
                case "ViewLoading":
                    console.log("[BlaCat]", '[ViewMgr]', '显示Loading(' + type + ') ...')
                    if (!this.viewLoading) {
                        this.viewLoading = new ViewLoading();
                        this.views[type] = this.viewLoading
                    }
                    this.viewLoading.start()
                    break;
                case "ViewTransConfirmGas":
                    console.log("[BlaCat]", '[ViewMgr]', '显示Gas转账确认(' + type + ') ...')
                    if (!this.viewTransConfirmGas) {
                        this.viewTransConfirmGas = new ViewTransConfirmGas();
                        this.views[type] = this.viewTransConfirmGas
                    }
                    this.viewTransConfirmGas.start()
                    break;
                case "RegisterView":
                    console.log("[BlaCat]", '[ViewMgr]', '注册(' + type + ') ...')
                    if (!this.registerView) {
                        this.registerView = new RegisterView()
                        this.views[type] = this.registerView
                    }
                    this.registerView.start()
                    break;
                case "ForgetPasswordView":
                    console.log("[BlaCat]", '[ViewMgr]', '忘记密码(' + type + ') ...')
                    if (!this.forgetPasswordView) {
                        this.forgetPasswordView = new ForgetPasswordView()
                        this.views[type] = this.forgetPasswordView
                    }
                    this.forgetPasswordView.start()
                    break;
                case "ModifyImgView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改头像(' + type + ') ...')
                    if (!this.modifyImgView) {
                        this.modifyImgView = new ModifyImgView()
                        this.views[type] = this.modifyImgView
                    }
                    this.modifyImgView.start()
                    break;
                case "ModifyNameView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改昵称(' + type + ') ...')
                    if (!this.modifyNameView) {
                        this.modifyNameView = new ModifyNameView()
                        this.views[type] = this.modifyNameView
                    }
                    this.modifyNameView.start()
                    break;
                case "ModifySexView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改性别(' + type + ') ...')
                    if (!this.modifySexView) {
                        this.modifySexView = new ModifySexView()
                        this.views[type] = this.modifySexView
                    }
                    this.modifySexView.start()
                    break;
                case "ModifyAreaView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改地区(' + type + ') ...')
                    if (!this.modifyAreaView) {
                        this.modifyAreaView = new ModifyAreaView()
                        this.views[type] = this.modifyAreaView
                    }
                    this.modifyAreaView.start()
                    break;
                case "ModifyTransactionFeeView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改手续费(' + type + ') ...')
                    if (!this.modifyTransactionFeeView) {
                        this.modifyTransactionFeeView = new ModifyTransactionFeeView()
                        this.views[type] = this.modifyTransactionFeeView
                    }
                    this.modifyTransactionFeeView.start()
                    break;
                case "ModifyNetworkLineView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示修改网络线路(' + type + ') ...')
                    if (!this.modifyNetworkLineView) {
                        this.modifyNetworkLineView = new ModifyNetworkLineView()
                        this.views[type] = this.modifyNetworkLineView
                    }
                    this.modifyNetworkLineView.start()
                    break;
                case "SecurityCenterView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示安全中心(' + type + ') ...')
                    if (!this.securityCenterView) {
                        this.securityCenterView = new SecurityCenterView()
                        this.views[type] = this.securityCenterView
                    }
                    this.securityCenterView.start()
                    break;
                case "TrustContractView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示信任合约(' + type + ') ...')
                    if (!this.trustContractView) {
                        this.trustContractView = new TrustContractView()
                        this.views[type] = this.trustContractView
                    }
                    this.trustContractView.start()
                    break;
                case "AutoLogoutWalletView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示自动登出钱包(' + type + ') ...')
                    if (!this.autoLogoutWalletView) {
                        this.autoLogoutWalletView = new AutoLogoutWalletView()
                        this.views[type] = this.autoLogoutWalletView
                    }
                    this.autoLogoutWalletView.start()
                    break;
                case "AddressbookView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示通讯录(' + type + ') ...')
                    if (!this.addressbookView) {
                        this.addressbookView = new AddressbookView();
                        this.views[type] = this.addressbookView
                    }
                    this.addressbookView.start()
                    break;
                case "AddressbookDetailsView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示通讯录详情(' + type + ') ...')
                    if (!this.addressbookDetailsView) {
                        this.addressbookDetailsView = new AddressbookDetailsView();
                        this.views[type] = this.addressbookDetailsView
                    }
                    this.addressbookDetailsView.start()
                    break;
                case "AddressbookOpView":
                    console.log("[BlaCat]", '[ViewMgr]', '显示通讯录操作联系人信息(' + type + ') ...')
                    if (!this.addressbookOpView) {
                        this.addressbookOpView = new AddressbookOpView();
                        this.views[type] = this.addressbookOpView
                    }
                    this.addressbookOpView.start()
                    break;
                case "ViewConnecting":
                    console.log("[BlaCat]", '[ViewMgr]', '显示连接中(' + type + ') ...')
                    if (!this.viewConnecting) {
                        this.viewConnecting = new ViewConnecting();
                        this.views[type] = this.viewConnecting
                    }
                    this.viewConnecting.start()
                    break;
                case "PayExchangeBCTView" :
                    if (!this.payExchangeBCTView) {
                        this.payExchangeBCTView = new PayExchangeBCTView();
                        this.views[type] = this.payExchangeBCTView
                    }
                    this.payExchangeBCTView.start()
                    break;
            }
        }


        removeAll() {
            // console.log(Main.viewMgr.mainView.div.childNodes)

            for (let className in this.views) {
                let v = this.views[className];

                console.log("[BlaCat]", '[ViewMgr]', 'removeAll, view => ', v)

                switch (className) {
                    case "IconView":
                        v.reset()
                        break;
                    default:
                        if (v.isCreated) {
                            v.remove()
                        }
                        break;
                }
            }
        }
        // 更新视图
        update() {
            console.log("[BlaCat]", '[ViewMgr]', 'update ...')

            for (let className in this.views) {
                let v = this.views[className];

                console.log("[BlaCat]", '[ViewMgr]', 'update, v =>', v)
                switch (className) {
                    case "PayView":
                        if (v.isCreated) {
                            v.update()
                        }
                        break;
                    default:
                        if (v.isCreated && !v.isHidden()) {
                            v.update()
                        }
                        break;
                }
            }
        }

        // 更新余额
        updateBalance() {
            console.log("[BlaCat]", '[ViewMgr]', 'updateBalance ...')

            for (let className in this.views) {
                let v = this.views[className];
                if (v.__proto__["updateBalance"]) {
                    v.updateBalance()
                }
            }
        }
    }
}