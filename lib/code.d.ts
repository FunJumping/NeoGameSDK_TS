/// <reference path="../wallet/tools/neo-ts.d.ts" />
declare const QrCodeWithLogo: any;
declare namespace BlackCat {
    class Main {
        private static isCreated;
        private static isInitex;
        static isStart: boolean;
        static readonly platName: string;
        static platLoginType: number;
        static randNumber: number;
        static tsOffset: number;
        static urlHead: string;
        static resHost: string;
        static appid: string;
        static appkey: string;
        static appname: string;
        static appicon: string;
        static appcoin: string;
        static applang: string;
        static apprefer: string;
        static app_recharge_addr: string;
        private static app_trust;
        static user: User;
        static wallet: tools.wallet;
        static viewMgr: ViewMgr;
        static langMgr: LangMgr;
        static netMgr: NetMgr;
        static walletLogId: number;
        static appWalletLogId: number;
        static appWalletNotifyId: number;
        static needGetAppNotifys: boolean;
        private static appNotifyTxids;
        static platWalletLogId: number;
        static platWalletNotifyId: number;
        static needGetPlatNotifys: boolean;
        static platNotifyTxids: any;
        private static callback;
        private static transactionCallback;
        private static transferCallback;
        private static transGasMultiCallback;
        private static loginFunctionCallback;
        private static bancorCallback;
        private static buyVipCallback;
        private static isLoginCallback;
        private static s_update;
        private static update_timeout_max;
        private static update_timeout_min;
        private static liveTime;
        private static liveTimeMax;
        constructor();
        static reset(type?: number): void;
        static clearTimeout(): void;
        static getCGASBalanceByAddress(id_CGAS: string, address: string): Promise<number>;
        static getCGAS_OLDBalanceByAddress(id_CGAS: string, address: string): Promise<number>;
        static getCNEOBalanceByAddress(id_CNEO: string, address: string): Promise<number>;
        static getCNEO_OLDBalanceByAddress(id_CNEO: string, address: string): Promise<number>;
        static getBCPBalanceByAddress(id_BCP: string, address: string): Promise<number>;
        static getBCTBalanceByAddress(id_BCT: string, address: string): Promise<number>;
        static getBTCBalanceByAddress(id_BTC: string, address: string): Promise<number>;
        static getETHBalanceByAddress(id_ETH: string, address: string): Promise<number>;
        static getNep5BalanceByAddress(id_hash: string, address: string, bits?: number): Promise<number>;
        init(appid: string, appkey: string, listener: Function, lang: string): void;
        initex(params: any, callback?: any): void;
        start(callback?: Function): Promise<void>;
        setLang(type: string): void;
        setDefaultNetType(type: number): void;
        showMain(): void;
        showIcon(): void;
        getBalance(type?: string): Promise<{}>;
        getUserInfo(): UserInfo;
        getNetType(): number;
        getHeight(): Promise<{
            node: number;
            cli: number;
        }>;
        invokescript(params: any): Promise<tools.Result>;
        makeRawTransaction(params: any, callback: any): Promise<void>;
        private _makeRawTransaction(params, trust, net_fee, callback?);
        makeRecharge(params: any, callback: any): Promise<void>;
        makeTransfer(params: any, callback?: any): Promise<void>;
        makeGasTransfer(params: any, callback?: any): Promise<void>;
        makeNeoTransfer(params: any, callback?: any): Promise<void>;
        makeGasTransferMulti(params: any, callback?: any): Promise<void>;
        confirmAppNotify(params: any): Promise<Result>;
        bancor(params: any, callback?: any): Promise<void>;
        private _bancor(params, trust, net_fee, callback?);
        buyVip(params: any, callback?: any): Promise<void>;
        private _buyVip(params, trust, net_fee, callback?);
        static loginCallback(): Promise<void>;
        private static setGameInfo(param);
        isLogined(): boolean;
        static logoutCallback(): Promise<void>;
        static listenerCallback(cmd: any, data: any): Promise<void>;
        static update(): Promise<void>;
        static getAppNotifys(): Promise<boolean>;
        private static doPlatNotify(params);
        static continueWithOpenWallet(): Promise<void>;
        private static doPlatNotifyBancor(params);
        private static doPlatNotiyRefund(params);
        private static doPlatNotifyTransferRes(params, txid);
        private static doPlatNotifyRefundRes(params, txid);
        private static confirmPlatNotify(params);
        private static confirmPlatNotifyExt(params, ext);
        static getPlatNotifys(): Promise<boolean>;
        static changeNetType(type: number): void;
        static getUrlParam(name: any): string;
        static validateLogin(): Promise<void>;
        static showErrCode(errCode: number, callback?: any): Promise<void>;
        static showErrMsg(errMsgKey: string, callback?: any, content_ext?: any): Promise<void>;
        static showToast(msgKey: string, showTime?: number): Promise<void>;
        static showInfo(msgKey: string, callback?: any, content_ext?: any): Promise<void>;
        static showConFirm(msgKey: string): Promise<void>;
        static showLoading(msgKey: string): Promise<void>;
        static isWalletOpen(): boolean;
        static isLoginInit(): boolean;
        static validateFormat(type: string, inputElement: HTMLInputElement | HTMLTextAreaElement): Promise<string | boolean>;
        static getPhone(selectArea: string, phone: string): string;
        static getDate(timeString: string): string;
        static getObjectClass(obj: any): any;
        static getUnTrustNnc(params: any): Array<string>;
        static updateTrustNnc(): Promise<void>;
        static removeTrustNnc(nnc: string): void;
        static setLiveTime(): void;
        static setLiveTimeMax(minutes: number): void;
        static getLiveTimeMax(): number;
        static getStringNumber(num: number): string;
        private static setTsOffset(loginParam);
        private static getUrlHead();
        static randomSort(arr: any, newArr: any): any;
        static check(): string;
        static in_array(search: string, array: Array<string>): boolean;
    }
}
declare namespace BlackCat {
    class ComponentBase {
        objCreate(tag: string): HTMLElement;
        ObjAppend(o: any, tag: HTMLElement): void;
        objRemove(o: any, tag: HTMLElement): void;
        parentAdd(tag: HTMLElement): void;
        parentRemove(tag: HTMLElement): void;
        bodyAppend(tag: HTMLElement): void;
        bodyRemove(tag: HTMLElement): void;
    }
}
declare namespace BlackCat {
    class NetFeeComponent extends ComponentBase {
        private parentDiv;
        private mainDiv;
        private mainDiv_text;
        private inputFree;
        private inputcharge;
        private net_fee;
        private net_fees;
        private net_fee_show_rate;
        private callback;
        constructor(parentDiv: any, callback: any, net_fees?: Array<string>);
        setFeeDefault(net_fee?: string): void;
        setNetFeeShowRate(rate?: number): void;
        createDiv(): void;
        hidden(): void;
        show(): void;
        private getNetFeesIdx(net_fee);
        private dofree();
        private dospeed(net_fee?);
        private getNetFeeShow();
        private showNetFee();
    }
}
declare namespace BlackCat {
    class LangBase {
        lang: any;
        get(key: string): any;
    }
}
declare namespace BlackCat {
    class LangCN extends LangBase {
        lang: {
            return: string;
            copy: string;
            ok: string;
            cancel: string;
            more: string;
            info: string;
            content: string;
            retry: string;
            cgas: string;
            gas: string;
            bct: string;
            bcp: string;
            neo: string;
            cneo: string;
            btc: string;
            eth: string;
            area_code_CN: string;
            area_code_AD: string;
            area_code_AE: string;
            area_code_AF: string;
            area_code_AG: string;
            area_code_AI: string;
            area_code_AL: string;
            area_code_AM: string;
            area_code_AO: string;
            area_code_AR: string;
            area_code_AS: string;
            area_code_AT: string;
            area_code_AU: string;
            area_code_AW: string;
            area_code_AZ: string;
            area_code_BA: string;
            area_code_BB: string;
            area_code_BD: string;
            area_code_BE: string;
            area_code_BF: string;
            area_code_BG: string;
            area_code_BH: string;
            area_code_BI: string;
            area_code_BJ: string;
            area_code_BM: string;
            area_code_BN: string;
            area_code_BO: string;
            area_code_BQ: string;
            area_code_BR: string;
            area_code_BS: string;
            area_code_BT: string;
            area_code_BW: string;
            area_code_BY: string;
            area_code_BZ: string;
            area_code_CA: string;
            area_code_CD: string;
            area_code_CF: string;
            area_code_CG: string;
            area_code_CH: string;
            area_code_CI: string;
            area_code_CK: string;
            area_code_CL: string;
            area_code_CM: string;
            area_code_CO: string;
            area_code_CR: string;
            area_code_CU: string;
            area_code_CV: string;
            area_code_CW: string;
            area_code_CY: string;
            area_code_CZ: string;
            area_code_DE: string;
            area_code_DJ: string;
            area_code_DK: string;
            area_code_DM: string;
            area_code_DO: string;
            area_code_DZ: string;
            area_code_EC: string;
            area_code_EE: string;
            area_code_EG: string;
            area_code_ER: string;
            area_code_ES: string;
            area_code_ET: string;
            area_code_FI: string;
            area_code_FJ: string;
            area_code_FM: string;
            area_code_FO: string;
            area_code_FR: string;
            area_code_GA: string;
            area_code_GB: string;
            area_code_GD: string;
            area_code_GE: string;
            area_code_GF: string;
            area_code_GH: string;
            area_code_GI: string;
            area_code_GL: string;
            area_code_GM: string;
            area_code_GN: string;
            area_code_GP: string;
            area_code_GQ: string;
            area_code_GR: string;
            area_code_GT: string;
            area_code_GU: string;
            area_code_GW: string;
            area_code_GY: string;
            area_code_HK: string;
            area_code_HN: string;
            area_code_HR: string;
            area_code_HT: string;
            area_code_HU: string;
            area_code_ID: string;
            area_code_IE: string;
            area_code_IL: string;
            area_code_IN: string;
            area_code_IQ: string;
            area_code_IR: string;
            area_code_IS: string;
            area_code_IT: string;
            area_code_JM: string;
            area_code_JO: string;
            area_code_JP: string;
            area_code_KE: string;
            area_code_KG: string;
            area_code_KH: string;
            area_code_KI: string;
            area_code_KM: string;
            area_code_KN: string;
            area_code_KP: string;
            area_code_KR: string;
            area_code_KW: string;
            area_code_KY: string;
            area_code_KZ: string;
            area_code_LA: string;
            area_code_LB: string;
            area_code_LC: string;
            area_code_LI: string;
            area_code_LK: string;
            area_code_LR: string;
            area_code_LS: string;
            area_code_LT: string;
            area_code_LU: string;
            area_code_LV: string;
            area_code_LY: string;
            area_code_MA: string;
            area_code_MC: string;
            area_code_MD: string;
            area_code_ME: string;
            area_code_MG: string;
            area_code_MH: string;
            area_code_MK: string;
            area_code_ML: string;
            area_code_MM: string;
            area_code_MN: string;
            area_code_MO: string;
            area_code_MR: string;
            area_code_MS: string;
            area_code_MT: string;
            area_code_MU: string;
            area_code_MV: string;
            area_code_MW: string;
            area_code_MX: string;
            area_code_MY: string;
            area_code_MZ: string;
            area_code_NA: string;
            area_code_NC: string;
            area_code_NE: string;
            area_code_NG: string;
            area_code_NI: string;
            area_code_NL: string;
            area_code_NO: string;
            area_code_NP: string;
            area_code_NR: string;
            area_code_NZ: string;
            area_code_OM: string;
            area_code_PA: string;
            area_code_PE: string;
            area_code_PF: string;
            area_code_PG: string;
            area_code_PH: string;
            area_code_PK: string;
            area_code_PL: string;
            area_code_PM: string;
            area_code_PR: string;
            area_code_PT: string;
            area_code_PW: string;
            area_code_PY: string;
            area_code_QA: string;
            area_code_RE: string;
            area_code_RO: string;
            area_code_RS: string;
            area_code_RU: string;
            area_code_RW: string;
            area_code_SA: string;
            area_code_SB: string;
            area_code_SC: string;
            area_code_SD: string;
            area_code_SE: string;
            area_code_SG: string;
            area_code_SI: string;
            area_code_SK: string;
            area_code_SL: string;
            area_code_SM: string;
            area_code_SN: string;
            area_code_SO: string;
            area_code_SR: string;
            area_code_ST: string;
            area_code_SV: string;
            area_code_SY: string;
            area_code_SZ: string;
            area_code_TC: string;
            area_code_TD: string;
            area_code_TG: string;
            area_code_TH: string;
            area_code_TJ: string;
            area_code_TL: string;
            area_code_TM: string;
            area_code_TN: string;
            area_code_TO: string;
            area_code_TR: string;
            area_code_TT: string;
            area_code_TW: string;
            area_code_TZ: string;
            area_code_UA: string;
            area_code_UG: string;
            area_code_US: string;
            area_code_UY: string;
            area_code_UZ: string;
            area_code_VC: string;
            area_code_VE: string;
            area_code_VG: string;
            area_code_VN: string;
            area_code_VU: string;
            area_code_WS: string;
            area_code_YE: string;
            area_code_YT: string;
            area_code_ZA: string;
            area_code_ZM: string;
            area_code_ZW: string;
            main_user_format_err: string;
            main_email_format_err: string;
            main_phone_format_err: string;
            main_vcode_format_err: string;
            main_walletaddr_format_err: string;
            main_phone: string;
            main_email: string;
            main_user: string;
            register_title: string;
            register_inputphone: string;
            register_inputphone_err: string;
            register_inputemail: string;
            register_inputemail_err: string;
            register_inputUid: string;
            register_inputUid_err: string;
            register_inputCode: string;
            register_inputCode_err: string;
            register_inputPass: string;
            register_inputPass_err: string;
            register_inputVpass: string;
            register_inputVpass_err: string;
            register_inputVpass_inputPass_err: string;
            register_inputinvite: string;
            register_inputinvite_err: string;
            register_getCodeSucc: string;
            register_getCode: string;
            register_getCodecount: string;
            register_getCodecountRetry: string;
            register_exceed: string;
            register_doLogin: string;
            register_doRegister: string;
            register_invitation: string;
            login_inputuser: string;
            login_inputuser_err: string;
            login_inputphone: string;
            login_inputphone_err: string;
            login_inputemail: string;
            login_inputemail_err: string;
            login_inputPass: string;
            login_inputPass_err: string;
            login_textForgetpass: string;
            login_doLogin: string;
            login_doRegister: string;
            login_walletDownloadFail: string;
            login_loginFail: string;
            forgetpass_title: string;
            forgetpass_inputphone: string;
            forgetpass_inputphone_err: string;
            forgetpass_inputemail: string;
            forgetpass_inputemail_err: string;
            forgetpass_inputUid: string;
            forgetpass_inputUid_err: string;
            forgetpass_inputUid_validate_err: string;
            forgetpass_inputAccount: string;
            forgetpass_inputAccount_err: string;
            forgetpass_inputAccount_err_type: string;
            forgetpass_inputAccount_validate_err: string;
            forgetpass_inputphone_notexist: string;
            forgetpass_inputemail_notexist: string;
            forgetpass_inputCode: string;
            forgetpass_inputCode_err: string;
            forgetpass_inputPass: string;
            forgetpass_inputPass_err: string;
            forgetpass_inputVpass: string;
            forgetpass_inputVpass_err: string;
            forgetpass_inputVpass_inputPass_err: string;
            forgetpass_getCodeSucc: string;
            forgetpass_getCode: string;
            forgetpass_getCodecount: string;
            forgetpass_getCodecountRetry: string;
            forgetpass_exceed: string;
            forgetpass_doLogin: string;
            forgetpass_do: string;
            forgetpass_do_ok: string;
            personalcenter: string;
            myinfo_leve: string;
            myinfo_modify: string;
            myinfo_member: string;
            myinfo_openmember: string;
            myinfo_permanentmember: string;
            myInfo: string;
            myinfo_headImg: string;
            myinfo_nickname: string;
            myinfo_sex: string;
            myinfo_sex_0: string;
            myinfo_sex_1: string;
            myinfo_sex_2: string;
            myinfo_uid: string;
            myinfo_area: string;
            myinfo_fee: string;
            myinfo_fee_empty: string;
            myinfo_area_empty: string;
            myinfo_security: string;
            myinfo_set: string;
            myinfo_logout: string;
            myinfo_logoutConfirm: string;
            modifyImg: string;
            modifyImg_succ: string;
            modifyImg_select: string;
            modifyImg_select_err: string;
            modifyImg_selectSize_err: string;
            modifyImg_selectType_err: string;
            modifyName: string;
            modifyName_input: string;
            modifyName_succ: string;
            modifySex: string;
            modifySex_succ: string;
            modifyArea: string;
            modifyArea_succ: string;
            modifyFee: string;
            modifyFee_succ: string;
            modifyNet: string;
            modifyNet_succ: string;
            modifyNet_node_err: string;
            modifyVip_succ: string;
            modifyVip_fail: string;
            modifyVip_balance_error: string;
            modifyVip_gas_less: string;
            modifyVip_invite_err: string;
            modifyVip_12months: string;
            modifyVip_3months: string;
            modifyVip_1months: string;
            modifyVip_payway: string;
            modifyVip_inviteplaceholder: string;
            modifyVip_paymenttxt: string;
            modifyVip_payment: string;
            modifyVip_recharge: string;
            modifyvip_payAmonth: string;
            modifyvip_payconfirm: string;
            security_title: string;
            security_trust: string;
            security_trust_admin: string;
            security_walletOut: string;
            security_walletOut_admin: string;
            security_walletOut_admin_m: string;
            security_walletOut_admin_h: string;
            security_walletOut_toast: string;
            trust_title: string;
            trust_relieve_succ: string;
            paylist_txid: string;
            paylist_wallet: string;
            paylist_nnc: string;
            paylist_sbParamJson: string;
            paylist_sbPushString: string;
            paylist_sbPushString_none: string;
            paylist_ctm_year: string;
            paylist_ctm_month: string;
            paylist_ctm_day: string;
            paylist_ctm_hour: string;
            paylist_ctm_minute: string;
            paylist_ctm_recent: string;
            paylist_noMore: string;
            paylist_getMore: string;
            paylist_noRecord: string;
            pay_received: string;
            pc_receivables_download: string;
            pc_receivables_address: string;
            pc_receivables_copy: string;
            pay_transfer: string;
            pay_transferType: string;
            pay_transferBalance: string;
            pay_transferToAddr: string;
            pay_transferCount: string;
            pay_transferToAddrError: string;
            pay_transferCountError: string;
            pay_transferDoSucc: string;
            pay_transferDoFail: string;
            pay_transferGasNotEnough: string;
            pay_transferBCPNotEnough: string;
            pay_transferBCTNotEnough: string;
            pay_transferNEONotEnough: string;
            pay_transferCNEONotEnough: string;
            pay_transferCGASNotEnough: string;
            pay_wallet: string;
            pay_refresh: string;
            pay_wallet_detail: string;
            pay_coin_name: string;
            pay_coin_old: string;
            pay_coin_blacat: string;
            pay_coin_neo: string;
            pay_coin_other: string;
            pay_gas: string;
            pay_gas_desc: string;
            pay_cgas: string;
            pay_cgas_desc: string;
            pay_neo: string;
            pay_neo_desc: string;
            pay_cneo: string;
            pay_cneo_desc: string;
            pay_btc: string;
            pay_eth: string;
            pay_send: string;
            pay_purchase: string;
            pay_purchase_testnet_cant_buy: string;
            pay_makeMint: string;
            pay_recentLists: string;
            pay_more: string;
            pay_makeMintGasNotEnough: string;
            pay_makeMintNeoNotEnough: string;
            pay_makeMintDoFail: string;
            pay_makeMintDoFail2: string;
            pay_makeRefundCgasNotEnoughUtxo: string;
            pay_makeRefundCneoNotEnoughUtxo: string;
            pay_makeRefundCgasNotEnough: string;
            pay_makeRefundCneoNotEnough: string;
            pay_makeRefundGasFeeNotEnough: string;
            pay_makeRefundGasLessThanFee: string;
            pay_makeRefundDoFail: string;
            pay_makeRefundDoFail2: string;
            pay_makeRefundGetScriptFail: string;
            pay_makeRefundCgasOldNotEnough: string;
            pay_makeRefundCneoOldNotEnough: string;
            pay_makeMintGasUtxoCountsLimit: string;
            pay_makeMintNeoUtxoCountsLimit: string;
            pay_walletbtn: string;
            pay_assets: string;
            pay_get: string;
            pay_not_enough_money: string;
            pay_not_enough_utxo: string;
            pay_nettype_1: string;
            pay_nettype_2: string;
            pay_walletDetail: string;
            pay_walletDetail_addr: string;
            pay_walletDetail_key: string;
            pay_walletDetail_hex: string;
            pay_walletDetail_wif: string;
            pay_walletDetail_notice: string;
            pay_walletDetail_export: string;
            pay_makerawtrans_err: string;
            pay_makerawtrans_fee_less: string;
            addressbook_title: string;
            addressbook_search: string;
            addressbook_det_title: string;
            addressbook_det_transfer: string;
            addressbook_det_address: string;
            addressbook_det_download: string;
            addressbook_det_describe: string;
            addressbook_det_empty: string;
            addressbook_det_del: string;
            addressbook_det_del_title: string;
            addressbook_det_del_tips: string;
            addressbook_det_del_succ: string;
            addressbook_op_button: string;
            addressbook_op_name: string;
            addressbook_op_inputName: string;
            addressbook_op_inputName_err: string;
            addressbook_op_address: string;
            addressbook_op_inputAddress: string;
            addressbook_op_inputAddress_err: string;
            addressbook_op_describe: string;
            addressbook_op_inputDescribe: string;
            addressbook_op_inputDescribe_err: string;
            addressbook_op_addSucc: string;
            addressbook_op_updateSucc: string;
            pay_exchange_bct: string;
            pay_exchange_cgas: string;
            pay_exchange_purchase: string;
            pay_exchange_price: string;
            pay_exchange_balance: string;
            pay_exchange_balance_not_enough: string;
            pay_exchange_range: string;
            pay_exchange_buy_ok: string;
            pay_exchange_consumption: string;
            pay_exchange_placeholderconfirm: string;
            pay_exchange_confirmbuy: string;
            pay_exchange_purchase_process: string;
            pay_exchange_processp1: string;
            pay_exchange_bcp: string;
            pay_exchange_create_wallet_fail: string;
            pay_exchange_detail_buy_CGAS_fail: string;
            pay_exchange_detail_buy_BCP_fail: string;
            pay_exchange_buyNEO: string;
            pay_exchange_spent_not_enough: string;
            pay_exchange_getmore: string;
            pay_makeRecharge: string;
            pay_trust_tips: string;
            pay_trust_Vice_tips: string;
            pay_transfer_toaddr: string;
            pay_transfer_count: string;
            pay_transCount_count: string;
            pay_transCount_inputCount: string;
            pay_transCount_err: string;
            pay_transCountGAS: string;
            pay_transCountCGAS: string;
            pay_transCountCGASOLD: string;
            pay_transCountCGAS2GAS: string;
            pay_transCountGAS2CGAS: string;
            pay_transCountCGASOLD2OLD: string;
            pay_transCountNEO: string;
            pay_transCountCNEO: string;
            pay_transCountCNEOOLD: string;
            pay_transCountCNEO2NEO: string;
            pay_transCountNEO2CNEO: string;
            pay_transCountCNEOOLD2OLD: string;
            pay_transCountTips_free: string;
            pay_transCountTips_slow: string;
            pay_transCountTips_fast: string;
            pay_transCount_speed: string;
            pay_transCount_cost: string;
            pay_transCount_tips: string;
            pay_transCount_tips_err: string;
            pay_walletOpen_password: string;
            pay_walletOpen_inputPassword: string;
            pay_walletOpen_inputPassword_err: string;
            pay_walletOpen_file_error: string;
            pay_walletOpen_openFail: string;
            walletCreate_create: string;
            walletCreate_password: string;
            walletCreate_vpass: string;
            walletCreate_password_notice: string;
            walletCreate_doCreate: string;
            walletCreate_check_pass: string;
            walletCreate_check_vpass: string;
            walletCreate_check_exceed: string;
            walletImport_invalid_file: string;
            walletImport_select_file: string;
            walletImport_import: string;
            walletImport_password: string;
            walletImport_doImport: string;
            walletImport_bind_succ: string;
            walletView_info: string;
            walletView_create: string;
            walletView_import: string;
            main_wait_for_last_tran: string;
            main_no_app_wallet: string;
            main_need_open_wallet_confirm: string;
            main_refund_CGAS_second_fail: string;
            main_refund_CNEO_second_fail: string;
            main_refund_getScript_err: string;
            main_refund_sendRequest_err: string;
            main_refund_doFail: string;
            errCode_1101: string;
            errCode_1005: string;
            errCode_100601: string;
            errCode_100602: string;
            errCode_100605: string;
            errCode_100606: string;
            errCode_100607: string;
            errCode_100608: string;
            errCode_100700: string;
            errCode_100701: string;
            errCode_100702: string;
            errCode_100707: string;
            errCode_100708: string;
            errCode_100709: string;
            errCode_100801: string;
            errcode_100802: string;
            errCode_100805: string;
            errCode_100806: string;
            errCode_100807: string;
            errCode_100808: string;
            errCode_8100000: string;
            errCode_8100001: string;
            errCode_8100002: string;
            errCode_8100003: string;
            errCode_8100004: string;
            errcode_8100005: string;
            errcode_8100006: string;
            errCode_8100007: string;
            errCode_8200003: string;
            errCode_8200004: string;
            errCode_8200006: string;
            errCode_default: string;
            wallet_open_check: string;
            wallet_open_check_otcgo: string;
            wallet_open_check_otcgo_pwd: string;
            netmgr_select_api_slow: string;
            netmgr_select_node_slow: string;
            netmgr_select_cli_slow: string;
            netmgr_connecting: string;
            netmgr_connecting_fail: string;
        };
    }
}
declare namespace BlackCat {
    class LangEN extends LangBase {
        lang: {
            return: string;
            copy: string;
            ok: string;
            cancel: string;
            more: string;
            info: string;
            content: string;
            retry: string;
            cgas: string;
            gas: string;
            bct: string;
            bcp: string;
            neo: string;
            cneo: string;
            btc: string;
            eth: string;
            area_code_CN: string;
            area_code_AD: string;
            area_code_AE: string;
            area_code_AF: string;
            area_code_AG: string;
            area_code_AI: string;
            area_code_AL: string;
            area_code_AM: string;
            area_code_AO: string;
            area_code_AR: string;
            area_code_AS: string;
            area_code_AT: string;
            area_code_AU: string;
            area_code_AW: string;
            area_code_AZ: string;
            area_code_BA: string;
            area_code_BB: string;
            area_code_BD: string;
            area_code_BE: string;
            area_code_BF: string;
            area_code_BG: string;
            area_code_BH: string;
            area_code_BI: string;
            area_code_BJ: string;
            area_code_BM: string;
            area_code_BN: string;
            area_code_BO: string;
            area_code_BQ: string;
            area_code_BR: string;
            area_code_BS: string;
            area_code_BT: string;
            area_code_BW: string;
            area_code_BY: string;
            area_code_BZ: string;
            area_code_CA: string;
            area_code_CD: string;
            area_code_CF: string;
            area_code_CG: string;
            area_code_CH: string;
            area_code_CI: string;
            area_code_CK: string;
            area_code_CL: string;
            area_code_CM: string;
            area_code_CO: string;
            area_code_CR: string;
            area_code_CU: string;
            area_code_CV: string;
            area_code_CW: string;
            area_code_CY: string;
            area_code_CZ: string;
            area_code_DE: string;
            area_code_DJ: string;
            area_code_DK: string;
            area_code_DM: string;
            area_code_DO: string;
            area_code_DZ: string;
            area_code_EC: string;
            area_code_EE: string;
            area_code_EG: string;
            area_code_ER: string;
            area_code_ES: string;
            area_code_ET: string;
            area_code_FI: string;
            area_code_FJ: string;
            area_code_FM: string;
            area_code_FO: string;
            area_code_FR: string;
            area_code_GA: string;
            area_code_GB: string;
            area_code_GD: string;
            area_code_GE: string;
            area_code_GF: string;
            area_code_GH: string;
            area_code_GI: string;
            area_code_GL: string;
            area_code_GM: string;
            area_code_GN: string;
            area_code_GP: string;
            area_code_GQ: string;
            area_code_GR: string;
            area_code_GT: string;
            area_code_GU: string;
            area_code_GW: string;
            area_code_GY: string;
            area_code_HK: string;
            area_code_HN: string;
            area_code_HR: string;
            area_code_HT: string;
            area_code_HU: string;
            area_code_ID: string;
            area_code_IE: string;
            area_code_IL: string;
            area_code_IN: string;
            area_code_IQ: string;
            area_code_IR: string;
            area_code_IS: string;
            area_code_IT: string;
            area_code_JM: string;
            area_code_JO: string;
            area_code_JP: string;
            area_code_KE: string;
            area_code_KG: string;
            area_code_KH: string;
            area_code_KI: string;
            area_code_KM: string;
            area_code_KN: string;
            area_code_KP: string;
            area_code_KR: string;
            area_code_KW: string;
            area_code_KY: string;
            area_code_KZ: string;
            area_code_LA: string;
            area_code_LB: string;
            area_code_LC: string;
            area_code_LI: string;
            area_code_LK: string;
            area_code_LR: string;
            area_code_LS: string;
            area_code_LT: string;
            area_code_LU: string;
            area_code_LV: string;
            area_code_LY: string;
            area_code_MA: string;
            area_code_MC: string;
            area_code_MD: string;
            area_code_ME: string;
            area_code_MG: string;
            area_code_MH: string;
            area_code_MK: string;
            area_code_ML: string;
            area_code_MM: string;
            area_code_MN: string;
            area_code_MO: string;
            area_code_MR: string;
            area_code_MS: string;
            area_code_MT: string;
            area_code_MU: string;
            area_code_MV: string;
            area_code_MW: string;
            area_code_MX: string;
            area_code_MY: string;
            area_code_MZ: string;
            area_code_NA: string;
            area_code_NC: string;
            area_code_NE: string;
            area_code_NG: string;
            area_code_NI: string;
            area_code_NL: string;
            area_code_NO: string;
            area_code_NP: string;
            area_code_NR: string;
            area_code_NZ: string;
            area_code_OM: string;
            area_code_PA: string;
            area_code_PE: string;
            area_code_PF: string;
            area_code_PG: string;
            area_code_PH: string;
            area_code_PK: string;
            area_code_PL: string;
            area_code_PM: string;
            area_code_PR: string;
            area_code_PT: string;
            area_code_PW: string;
            area_code_PY: string;
            area_code_QA: string;
            area_code_RE: string;
            area_code_RO: string;
            area_code_RS: string;
            area_code_RU: string;
            area_code_RW: string;
            area_code_SA: string;
            area_code_SB: string;
            area_code_SC: string;
            area_code_SD: string;
            area_code_SE: string;
            area_code_SG: string;
            area_code_SI: string;
            area_code_SK: string;
            area_code_SL: string;
            area_code_SM: string;
            area_code_SN: string;
            area_code_SO: string;
            area_code_SR: string;
            area_code_ST: string;
            area_code_SV: string;
            area_code_SY: string;
            area_code_SZ: string;
            area_code_TC: string;
            area_code_TD: string;
            area_code_TG: string;
            area_code_TH: string;
            area_code_TJ: string;
            area_code_TL: string;
            area_code_TM: string;
            area_code_TN: string;
            area_code_TO: string;
            area_code_TR: string;
            area_code_TT: string;
            area_code_TW: string;
            area_code_TZ: string;
            area_code_UA: string;
            area_code_UG: string;
            area_code_US: string;
            area_code_UY: string;
            area_code_UZ: string;
            area_code_VC: string;
            area_code_VE: string;
            area_code_VG: string;
            area_code_VN: string;
            area_code_VU: string;
            area_code_WS: string;
            area_code_YE: string;
            area_code_YT: string;
            area_code_ZA: string;
            area_code_ZM: string;
            area_code_ZW: string;
            main_user_format_err: string;
            main_email_format_err: string;
            main_phone_format_err: string;
            main_vcode_format_err: string;
            main_walletaddr_format_err: string;
            main_phone: string;
            main_email: string;
            main_user: string;
            register_title: string;
            register_inputphone: string;
            register_inputphone_err: string;
            register_inputemail: string;
            register_inputemail_err: string;
            register_inputUid: string;
            register_inputUid_err: string;
            register_inputCode: string;
            register_inputCode_err: string;
            register_inputPass: string;
            register_inputPass_err: string;
            register_inputVpass: string;
            register_inputVpass_err: string;
            register_inputVpass_inputPass_err: string;
            register_inputinvite: string;
            register_inputinvite_err: string;
            register_getCodeSucc: string;
            register_getCode: string;
            register_getCodecount: string;
            register_getCodecountRetry: string;
            register_exceed: string;
            register_doLogin: string;
            register_doRegister: string;
            register_invitation: string;
            login_inputuser: string;
            login_inputuser_err: string;
            login_inputphone: string;
            login_inputphone_err: string;
            login_inputemail: string;
            login_inputemail_err: string;
            login_inputPass: string;
            login_inputPass_err: string;
            login_textForgetpass: string;
            login_doLogin: string;
            login_doRegister: string;
            login_walletDownloadFail: string;
            login_loginFail: string;
            forgetpass_title: string;
            forgetpass_inputphone: string;
            forgetpass_inputphone_err: string;
            forgetpass_inputemail: string;
            forgetpass_inputemail_err: string;
            forgetpass_inputUid: string;
            forgetpass_inputUid_err: string;
            forgetpass_inputUid_validate_err: string;
            forgetpass_inputAccount: string;
            forgetpass_inputAccount_err: string;
            forgetpass_inputAccount_err_type: string;
            forgetpass_inputAccount_validate_err: string;
            forgetpass_inputphone_notexist: string;
            forgetpass_inputemail_notexist: string;
            forgetpass_inputCode: string;
            forgetpass_inputCode_err: string;
            forgetpass_inputPass: string;
            forgetpass_inputPass_err: string;
            forgetpass_inputVpass: string;
            forgetpass_inputVpass_err: string;
            forgetpass_inputVpass_inputPass_err: string;
            forgetpass_getCodeSucc: string;
            forgetpass_getCode: string;
            forgetpass_getCodecount: string;
            forgetpass_getCodecountRetry: string;
            forgetpass_exceed: string;
            forgetpass_doLogin: string;
            forgetpass_do: string;
            forgetpass_do_ok: string;
            personalcenter: string;
            myinfo_leve: string;
            myinfo_modify: string;
            myinfo_member: string;
            myinfo_openmember: string;
            myinfo_permanentmember: string;
            myInfo: string;
            myinfo_headImg: string;
            myinfo_nickname: string;
            myinfo_sex: string;
            myinfo_sex_0: string;
            myinfo_sex_1: string;
            myinfo_sex_2: string;
            myinfo_uid: string;
            myinfo_area: string;
            myinfo_fee: string;
            myinfo_fee_empty: string;
            myinfo_area_empty: string;
            myinfo_security: string;
            myinfo_set: string;
            myinfo_logout: string;
            myinfo_logoutConfirm: string;
            modifyImg: string;
            modifyImg_succ: string;
            modifyImg_select: string;
            modifyImg_select_err: string;
            modifyImg_selectSize_err: string;
            modifyImg_selectType_err: string;
            modifyName: string;
            modifyName_input: string;
            modifyName_succ: string;
            modifySex: string;
            modifySex_succ: string;
            modifyArea: string;
            modifyArea_succ: string;
            modifyFee: string;
            modifyFee_succ: string;
            modifyNet: string;
            modifyNet_succ: string;
            modifyNet_node_err: string;
            modifyVip_succ: string;
            modifyVip_fail: string;
            modifyVip_balance_error: string;
            modifyVip_gas_less: string;
            modifyVip_invite_err: string;
            modifyVip_12months: string;
            modifyVip_3months: string;
            modifyVip_1months: string;
            modifyVip_payway: string;
            modifyVip_inviteplaceholder: string;
            modifyVip_paymenttxt: string;
            modifyVip_payment: string;
            modifyVip_recharge: string;
            modifyvip_payAmonth: string;
            modifyvip_payconfirm: string;
            security_title: string;
            security_trust: string;
            security_trust_admin: string;
            security_walletOut: string;
            security_walletOut_admin: string;
            security_walletOut_admin_m: string;
            security_walletOut_admin_h: string;
            security_walletOut_toast: string;
            trust_title: string;
            trust_relieve_succ: string;
            paylist_txid: string;
            paylist_wallet: string;
            paylist_nnc: string;
            paylist_sbParamJson: string;
            paylist_sbPushString: string;
            paylist_sbPushString_none: string;
            paylist_ctm_year: string;
            paylist_ctm_month: string;
            paylist_ctm_day: string;
            paylist_ctm_hour: string;
            paylist_ctm_minute: string;
            paylist_ctm_recent: string;
            paylist_noMore: string;
            paylist_getMore: string;
            paylist_noRecord: string;
            pay_received: string;
            pc_receivables_download: string;
            pc_receivables_address: string;
            pc_receivables_copy: string;
            pay_transfer: string;
            pay_transferType: string;
            pay_transferBalance: string;
            pay_transferToAddr: string;
            pay_transferCount: string;
            pay_transferToAddrError: string;
            pay_transferCountError: string;
            pay_transferDoSucc: string;
            pay_transferDoFail: string;
            pay_transferGasNotEnough: string;
            pay_transferBCPNotEnough: string;
            pay_transferBCTNotEnough: string;
            pay_transferNEONotEnough: string;
            pay_transferCNEONotEnough: string;
            pay_transferCGASNotEnough: string;
            pay_wallet: string;
            pay_refresh: string;
            pay_wallet_detail: string;
            pay_coin_name: string;
            pay_coin_old: string;
            pay_coin_blacat: string;
            pay_coin_neo: string;
            pay_coin_other: string;
            pay_gas: string;
            pay_gas_desc: string;
            pay_cgas: string;
            pay_cgas_desc: string;
            pay_neo: string;
            pay_neo_desc: string;
            pay_cneo: string;
            pay_cneo_desc: string;
            pay_btc: string;
            pay_eth: string;
            pay_send: string;
            pay_purchase: string;
            pay_purchase_testnet_cant_buy: string;
            pay_makeMint: string;
            pay_recentLists: string;
            pay_more: string;
            pay_makeMintGasNotEnough: string;
            pay_makeMintNeoNotEnough: string;
            pay_makeMintDoFail: string;
            pay_makeMintDoFail2: string;
            pay_makeRefundCgasNotEnoughUtxo: string;
            pay_makeRefundCneoNotEnoughUtxo: string;
            pay_makeRefundCgasNotEnough: string;
            pay_makeRefundCneoNotEnough: string;
            pay_makeRefundGasFeeNotEnough: string;
            pay_makeRefundGasLessThanFee: string;
            pay_makeRefundDoFail: string;
            pay_makeRefundDoFail2: string;
            pay_makeRefundGetScriptFail: string;
            pay_makeRefundCgasOldNotEnough: string;
            pay_makeRefundCneoOldNotEnough: string;
            pay_makeMintGasUtxoCountsLimit: string;
            pay_makeMintNeoUtxoCountsLimit: string;
            pay_walletbtn: string;
            pay_assets: string;
            pay_get: string;
            pay_not_enough_money: string;
            pay_not_enough_utxo: string;
            pay_nettype_1: string;
            pay_nettype_2: string;
            pay_walletDetail: string;
            pay_walletDetail_addr: string;
            pay_walletDetail_key: string;
            pay_walletDetail_hex: string;
            pay_walletDetail_wif: string;
            pay_walletDetail_notice: string;
            pay_walletDetail_export: string;
            pay_makerawtrans_err: string;
            pay_makerawtrans_fee_less: string;
            addressbook_title: string;
            addressbook_search: string;
            addressbook_det_title: string;
            addressbook_det_transfer: string;
            addressbook_det_address: string;
            addressbook_det_download: string;
            addressbook_det_describe: string;
            addressbook_det_empty: string;
            addressbook_det_del: string;
            addressbook_det_del_title: string;
            addressbook_det_del_tips: string;
            addressbook_det_del_succ: string;
            addressbook_op_button: string;
            addressbook_op_name: string;
            addressbook_op_inputName: string;
            addressbook_op_inputName_err: string;
            addressbook_op_address: string;
            addressbook_op_inputAddress: string;
            addressbook_op_inputAddress_err: string;
            addressbook_op_describe: string;
            addressbook_op_inputDescribe: string;
            addressbook_op_inputDescribe_err: string;
            addressbook_op_addSucc: string;
            addressbook_op_updateSucc: string;
            pay_exchange_bct: string;
            pay_exchange_cgas: string;
            pay_exchange_purchase: string;
            pay_exchange_price: string;
            pay_exchange_balance: string;
            pay_exchange_balance_not_enough: string;
            pay_exchange_range: string;
            pay_exchange_buy_ok: string;
            pay_exchange_consumption: string;
            pay_exchange_placeholderconfirm: string;
            pay_exchange_confirmbuy: string;
            pay_exchange_purchase_process: string;
            pay_exchange_processp1: string;
            pay_exchange_bcp: string;
            pay_exchange_create_wallet_fail: string;
            pay_exchange_detail_buy_CGAS_fail: string;
            pay_exchange_detail_buy_BCP_fail: string;
            pay_exchange_buyNEO: string;
            pay_exchange_spent_not_enough: string;
            pay_exchange_getmore: string;
            pay_makeRecharge: string;
            pay_trust_tips: string;
            pay_trust_Vice_tips: string;
            pay_transfer_toaddr: string;
            pay_transfer_count: string;
            pay_transCount_count: string;
            pay_transCount_inputCount: string;
            pay_transCount_err: string;
            pay_transCountGAS: string;
            pay_transCountCGAS: string;
            pay_transCountCGASOLD: string;
            pay_transCountCGAS2GAS: string;
            pay_transCountGAS2CGAS: string;
            pay_transCountCGASOLD2OLD: string;
            pay_transCountNEO: string;
            pay_transCountCNEO: string;
            pay_transCountCNEOOLD: string;
            pay_transCountCNEO2NEO: string;
            pay_transCountNEO2CNEO: string;
            pay_transCountCNEOOLD2OLD: string;
            pay_transCountTips_free: string;
            pay_transCountTips_slow: string;
            pay_transCountTips_fast: string;
            pay_transCount_speed: string;
            pay_transCount_cost: string;
            pay_transCount_tips: string;
            pay_transCount_tips_err: string;
            pay_walletOpen_password: string;
            pay_walletOpen_inputPassword: string;
            pay_walletOpen_inputPassword_err: string;
            pay_walletOpen_file_error: string;
            pay_walletOpen_openFail: string;
            walletCreate_create: string;
            walletCreate_password: string;
            walletCreate_vpass: string;
            walletCreate_password_notice: string;
            walletCreate_doCreate: string;
            walletCreate_check_pass: string;
            walletCreate_check_vpass: string;
            walletCreate_check_exceed: string;
            walletImport_invalid_file: string;
            walletImport_select_file: string;
            walletImport_import: string;
            walletImport_password: string;
            walletImport_doImport: string;
            walletImport_bind_succ: string;
            walletView_info: string;
            walletView_create: string;
            walletView_import: string;
            main_wait_for_last_tran: string;
            main_no_app_wallet: string;
            main_need_open_wallet_confirm: string;
            main_refund_CGAS_second_fail: string;
            main_refund_CNEO_second_fail: string;
            main_refund_getScript_err: string;
            main_refund_sendRequest_err: string;
            main_refund_doFail: string;
            errCode_1101: string;
            errCode_1005: string;
            errCode_100601: string;
            errCode_100602: string;
            errCode_100605: string;
            errCode_100606: string;
            errCode_100607: string;
            errCode_100608: string;
            errCode_100700: string;
            errCode_100701: string;
            errCode_100702: string;
            errCode_100707: string;
            errCode_100708: string;
            errCode_100709: string;
            errCode_100801: string;
            errcode_100802: string;
            errCode_100805: string;
            errCode_100806: string;
            errCode_100807: string;
            errCode_100808: string;
            errCode_8100000: string;
            errCode_8100001: string;
            errCode_8100002: string;
            errCode_8100003: string;
            errCode_8100004: string;
            errcode_8100005: string;
            errcode_8100006: string;
            errCode_8100007: string;
            errCode_8200003: string;
            errCode_8200004: string;
            errCode_8200006: string;
            errCode_default: string;
            wallet_open_check: string;
            wallet_open_check_otcgo: string;
            wallet_open_check_otcgo_pwd: string;
            netmgr_select_api_slow: string;
            netmgr_select_node_slow: string;
            netmgr_select_cli_slow: string;
            netmgr_connecting: string;
            netmgr_connecting_fail: string;
        };
    }
}
declare namespace BlackCat {
    class LangJP extends LangBase {
        lang: {
            return: string;
            copy: string;
            ok: string;
            cancel: string;
            more: string;
            info: string;
            content: string;
            retry: string;
            cgas: string;
            gas: string;
            bct: string;
            bcp: string;
            neo: string;
            cneo: string;
            btc: string;
            eth: string;
            area_code_CN: string;
            area_code_AD: string;
            area_code_AE: string;
            area_code_AF: string;
            area_code_AG: string;
            area_code_AI: string;
            area_code_AL: string;
            area_code_AM: string;
            area_code_AO: string;
            area_code_AR: string;
            area_code_AS: string;
            area_code_AT: string;
            area_code_AU: string;
            area_code_AW: string;
            area_code_AZ: string;
            area_code_BA: string;
            area_code_BB: string;
            area_code_BD: string;
            area_code_BE: string;
            area_code_BF: string;
            area_code_BG: string;
            area_code_BH: string;
            area_code_BI: string;
            area_code_BJ: string;
            area_code_BM: string;
            area_code_BN: string;
            area_code_BO: string;
            area_code_BQ: string;
            area_code_BR: string;
            area_code_BS: string;
            area_code_BT: string;
            area_code_BW: string;
            area_code_BY: string;
            area_code_BZ: string;
            area_code_CA: string;
            area_code_CD: string;
            area_code_CF: string;
            area_code_CG: string;
            area_code_CH: string;
            area_code_CI: string;
            area_code_CK: string;
            area_code_CL: string;
            area_code_CM: string;
            area_code_CO: string;
            area_code_CR: string;
            area_code_CU: string;
            area_code_CV: string;
            area_code_CW: string;
            area_code_CY: string;
            area_code_CZ: string;
            area_code_DE: string;
            area_code_DJ: string;
            area_code_DK: string;
            area_code_DM: string;
            area_code_DO: string;
            area_code_DZ: string;
            area_code_EC: string;
            area_code_EE: string;
            area_code_EG: string;
            area_code_ER: string;
            area_code_ES: string;
            area_code_ET: string;
            area_code_FI: string;
            area_code_FJ: string;
            area_code_FM: string;
            area_code_FO: string;
            area_code_FR: string;
            area_code_GA: string;
            area_code_GB: string;
            area_code_GD: string;
            area_code_GE: string;
            area_code_GF: string;
            area_code_GH: string;
            area_code_GI: string;
            area_code_GL: string;
            area_code_GM: string;
            area_code_GN: string;
            area_code_GP: string;
            area_code_GQ: string;
            area_code_GR: string;
            area_code_GT: string;
            area_code_GU: string;
            area_code_GW: string;
            area_code_GY: string;
            area_code_HK: string;
            area_code_HN: string;
            area_code_HR: string;
            area_code_HT: string;
            area_code_HU: string;
            area_code_ID: string;
            area_code_IE: string;
            area_code_IL: string;
            area_code_IN: string;
            area_code_IQ: string;
            area_code_IR: string;
            area_code_IS: string;
            area_code_IT: string;
            area_code_JM: string;
            area_code_JO: string;
            area_code_JP: string;
            area_code_KE: string;
            area_code_KG: string;
            area_code_KH: string;
            area_code_KI: string;
            area_code_KM: string;
            area_code_KN: string;
            area_code_KP: string;
            area_code_KR: string;
            area_code_KW: string;
            area_code_KY: string;
            area_code_KZ: string;
            area_code_LA: string;
            area_code_LB: string;
            area_code_LC: string;
            area_code_LI: string;
            area_code_LK: string;
            area_code_LR: string;
            area_code_LS: string;
            area_code_LT: string;
            area_code_LU: string;
            area_code_LV: string;
            area_code_LY: string;
            area_code_MA: string;
            area_code_MC: string;
            area_code_MD: string;
            area_code_ME: string;
            area_code_MG: string;
            area_code_MH: string;
            area_code_MK: string;
            area_code_ML: string;
            area_code_MM: string;
            area_code_MN: string;
            area_code_MO: string;
            area_code_MR: string;
            area_code_MS: string;
            area_code_MT: string;
            area_code_MU: string;
            area_code_MV: string;
            area_code_MW: string;
            area_code_MX: string;
            area_code_MY: string;
            area_code_MZ: string;
            area_code_NA: string;
            area_code_NC: string;
            area_code_NE: string;
            area_code_NG: string;
            area_code_NI: string;
            area_code_NL: string;
            area_code_NO: string;
            area_code_NP: string;
            area_code_NR: string;
            area_code_NZ: string;
            area_code_OM: string;
            area_code_PA: string;
            area_code_PE: string;
            area_code_PF: string;
            area_code_PG: string;
            area_code_PH: string;
            area_code_PK: string;
            area_code_PL: string;
            area_code_PM: string;
            area_code_PR: string;
            area_code_PT: string;
            area_code_PW: string;
            area_code_PY: string;
            area_code_QA: string;
            area_code_RE: string;
            area_code_RO: string;
            area_code_RS: string;
            area_code_RU: string;
            area_code_RW: string;
            area_code_SA: string;
            area_code_SB: string;
            area_code_SC: string;
            area_code_SD: string;
            area_code_SE: string;
            area_code_SG: string;
            area_code_SI: string;
            area_code_SK: string;
            area_code_SL: string;
            area_code_SM: string;
            area_code_SN: string;
            area_code_SO: string;
            area_code_SR: string;
            area_code_ST: string;
            area_code_SV: string;
            area_code_SY: string;
            area_code_SZ: string;
            area_code_TC: string;
            area_code_TD: string;
            area_code_TG: string;
            area_code_TH: string;
            area_code_TJ: string;
            area_code_TL: string;
            area_code_TM: string;
            area_code_TN: string;
            area_code_TO: string;
            area_code_TR: string;
            area_code_TT: string;
            area_code_TW: string;
            area_code_TZ: string;
            area_code_UA: string;
            area_code_UG: string;
            area_code_US: string;
            area_code_UY: string;
            area_code_UZ: string;
            area_code_VC: string;
            area_code_VE: string;
            area_code_VG: string;
            area_code_VN: string;
            area_code_VU: string;
            area_code_WS: string;
            area_code_YE: string;
            area_code_YT: string;
            area_code_ZA: string;
            area_code_ZM: string;
            area_code_ZW: string;
            main_user_format_err: string;
            main_email_format_err: string;
            main_phone_format_err: string;
            main_vcode_format_err: string;
            main_walletaddr_format_err: string;
            main_phone: string;
            main_email: string;
            main_user: string;
            register_title: string;
            register_inputphone: string;
            register_inputphone_err: string;
            register_inputemail: string;
            register_inputemail_err: string;
            register_inputUid: string;
            register_inputUid_err: string;
            register_inputCode: string;
            register_inputCode_err: string;
            register_inputPass: string;
            register_inputPass_err: string;
            register_inputVpass: string;
            register_inputVpass_err: string;
            register_inputVpass_inputPass_err: string;
            register_inputinvite: string;
            register_inputinvite_err: string;
            register_getCodeSucc: string;
            register_getCode: string;
            register_getCodecount: string;
            register_getCodecountRetry: string;
            register_exceed: string;
            register_doLogin: string;
            register_doRegister: string;
            register_invitation: string;
            login_inputuser: string;
            login_inputuser_err: string;
            login_inputphone: string;
            login_inputphone_err: string;
            login_inputemail: string;
            login_inputemail_err: string;
            login_inputPass: string;
            login_inputPass_err: string;
            login_textForgetpass: string;
            login_doLogin: string;
            login_doRegister: string;
            login_walletDownloadFail: string;
            login_loginFail: string;
            forgetpass_title: string;
            forgetpass_inputphone: string;
            forgetpass_inputphone_err: string;
            forgetpass_inputemail: string;
            forgetpass_inputemail_err: string;
            forgetpass_inputUid: string;
            forgetpass_inputUid_err: string;
            forgetpass_inputUid_validate_err: string;
            forgetpass_inputAccount: string;
            forgetpass_inputAccount_err: string;
            forgetpass_inputAccount_err_type: string;
            forgetpass_inputAccount_validate_err: string;
            forgetpass_inputphone_notexist: string;
            forgetpass_inputemail_notexist: string;
            forgetpass_inputCode: string;
            forgetpass_inputCode_err: string;
            forgetpass_inputPass: string;
            forgetpass_inputPass_err: string;
            forgetpass_inputVpass: string;
            forgetpass_inputVpass_err: string;
            forgetpass_inputVpass_inputPass_err: string;
            forgetpass_getCodeSucc: string;
            forgetpass_getCode: string;
            forgetpass_getCodecount: string;
            forgetpass_getCodecountRetry: string;
            forgetpass_exceed: string;
            forgetpass_doLogin: string;
            forgetpass_do: string;
            forgetpass_do_ok: string;
            personalcenter: string;
            myinfo_leve: string;
            myinfo_modify: string;
            myinfo_member: string;
            myinfo_openmember: string;
            myinfo_permanentmember: string;
            myInfo: string;
            myinfo_headImg: string;
            myinfo_nickname: string;
            myinfo_sex: string;
            myinfo_sex_0: string;
            myinfo_sex_1: string;
            myinfo_sex_2: string;
            myinfo_uid: string;
            myinfo_area: string;
            myinfo_fee: string;
            myinfo_fee_empty: string;
            myinfo_area_empty: string;
            myinfo_security: string;
            myinfo_set: string;
            myinfo_logout: string;
            myinfo_logoutConfirm: string;
            modifyImg: string;
            modifyImg_succ: string;
            modifyImg_select: string;
            modifyImg_select_err: string;
            modifyImg_selectSize_err: string;
            modifyImg_selectType_err: string;
            modifyName: string;
            modifyName_input: string;
            modifyName_succ: string;
            modifySex: string;
            modifySex_succ: string;
            modifyArea: string;
            modifyArea_succ: string;
            modifyFee: string;
            modifyFee_succ: string;
            modifyNet: string;
            modifyNet_succ: string;
            modifyNet_node_err: string;
            modifyVip_succ: string;
            modifyVip_fail: string;
            modifyVip_balance_error: string;
            modifyVip_gas_less: string;
            modifyVip_invite_err: string;
            modifyVip_12months: string;
            modifyVip_3months: string;
            modifyVip_1months: string;
            modifyVip_payway: string;
            modifyVip_inviteplaceholder: string;
            modifyVip_paymenttxt: string;
            modifyVip_payment: string;
            modifyVip_recharge: string;
            modifyvip_payAmonth: string;
            modifyvip_payconfirm: string;
            security_title: string;
            security_trust: string;
            security_trust_admin: string;
            security_walletOut: string;
            security_walletOut_admin: string;
            security_walletOut_admin_m: string;
            security_walletOut_admin_h: string;
            security_walletOut_toast: string;
            trust_title: string;
            trust_relieve_succ: string;
            paylist_txid: string;
            paylist_wallet: string;
            paylist_nnc: string;
            paylist_sbParamJson: string;
            paylist_sbPushString: string;
            paylist_sbPushString_none: string;
            paylist_ctm_year: string;
            paylist_ctm_month: string;
            paylist_ctm_day: string;
            paylist_ctm_hour: string;
            paylist_ctm_minute: string;
            paylist_ctm_recent: string;
            paylist_noMore: string;
            paylist_getMore: string;
            paylist_noRecord: string;
            pay_received: string;
            pc_receivables_download: string;
            pc_receivables_address: string;
            pc_receivables_copy: string;
            pay_transfer: string;
            pay_transferType: string;
            pay_transferBalance: string;
            pay_transferToAddr: string;
            pay_transferCount: string;
            pay_transferToAddrError: string;
            pay_transferCountError: string;
            pay_transferDoSucc: string;
            pay_transferDoFail: string;
            pay_transferGasNotEnough: string;
            pay_transferBCPNotEnough: string;
            pay_transferBCTNotEnough: string;
            pay_transferNEONotEnough: string;
            pay_transferCNEONotEnough: string;
            pay_transferCGASNotEnough: string;
            pay_wallet: string;
            pay_refresh: string;
            pay_wallet_detail: string;
            pay_coin_name: string;
            pay_coin_old: string;
            pay_coin_blacat: string;
            pay_coin_neo: string;
            pay_coin_other: string;
            pay_gas: string;
            pay_gas_desc: string;
            pay_cgas: string;
            pay_cgas_desc: string;
            pay_neo: string;
            pay_neo_desc: string;
            pay_cneo: string;
            pay_cneo_desc: string;
            pay_btc: string;
            pay_eth: string;
            pay_send: string;
            pay_purchase: string;
            pay_purchase_testnet_cant_buy: string;
            pay_makeMint: string;
            pay_recentLists: string;
            pay_more: string;
            pay_makeMintGasNotEnough: string;
            pay_makeMintNeoNotEnough: string;
            pay_makeMintDoFail: string;
            pay_makeMintDoFail2: string;
            pay_makeRefundCgasNotEnoughUtxo: string;
            pay_makeRefundCneoNotEnoughUtxo: string;
            pay_makeRefundCgasNotEnough: string;
            pay_makeRefundCneoNotEnough: string;
            pay_makeRefundGasFeeNotEnough: string;
            pay_makeRefundGasLessThanFee: string;
            pay_makeRefundDoFail: string;
            pay_makeRefundDoFail2: string;
            pay_makeRefundGetScriptFail: string;
            pay_makeRefundCgasOldNotEnough: string;
            pay_makeRefundCneoOldNotEnough: string;
            pay_makeMintGasUtxoCountsLimit: string;
            pay_makeMintNeoUtxoCountsLimit: string;
            pay_walletbtn: string;
            pay_assets: string;
            pay_get: string;
            pay_not_enough_money: string;
            pay_not_enough_utxo: string;
            pay_nettype_1: string;
            pay_nettype_2: string;
            pay_walletDetail: string;
            pay_walletDetail_addr: string;
            pay_walletDetail_key: string;
            pay_walletDetail_hex: string;
            pay_walletDetail_wif: string;
            pay_walletDetail_notice: string;
            pay_walletDetail_export: string;
            pay_makerawtrans_err: string;
            pay_makerawtrans_fee_less: string;
            addressbook_title: string;
            addressbook_search: string;
            addressbook_det_title: string;
            addressbook_det_transfer: string;
            addressbook_det_address: string;
            addressbook_det_download: string;
            addressbook_det_describe: string;
            addressbook_det_empty: string;
            addressbook_det_del: string;
            addressbook_det_del_title: string;
            addressbook_det_del_tips: string;
            addressbook_det_del_succ: string;
            addressbook_op_button: string;
            addressbook_op_name: string;
            addressbook_op_inputName: string;
            addressbook_op_inputName_err: string;
            addressbook_op_address: string;
            addressbook_op_inputAddress: string;
            addressbook_op_inputAddress_err: string;
            addressbook_op_describe: string;
            addressbook_op_inputDescribe: string;
            addressbook_op_inputDescribe_err: string;
            addressbook_op_addSucc: string;
            addressbook_op_updateSucc: string;
            pay_exchange_bct: string;
            pay_exchange_cgas: string;
            pay_exchange_purchase: string;
            pay_exchange_price: string;
            pay_exchange_balance: string;
            pay_exchange_balance_not_enough: string;
            pay_exchange_range: string;
            pay_exchange_buy_ok: string;
            pay_exchange_consumption: string;
            pay_exchange_placeholderconfirm: string;
            pay_exchange_confirmbuy: string;
            pay_exchange_purchase_process: string;
            pay_exchange_processp1: string;
            pay_exchange_bcp: string;
            pay_exchange_create_wallet_fail: string;
            pay_exchange_detail_buy_CGAS_fail: string;
            pay_exchange_detail_buy_BCP_fail: string;
            pay_exchange_buyNEO: string;
            pay_exchange_spent_not_enough: string;
            pay_exchange_getmore: string;
            pay_makeRecharge: string;
            pay_trust_tips: string;
            pay_trust_Vice_tips: string;
            pay_transfer_toaddr: string;
            pay_transfer_count: string;
            pay_transCount_count: string;
            pay_transCount_inputCount: string;
            pay_transCount_err: string;
            pay_transCountGAS: string;
            pay_transCountCGAS: string;
            pay_transCountCGASOLD: string;
            pay_transCountCGAS2GAS: string;
            pay_transCountGAS2CGAS: string;
            pay_transCountCGASOLD2OLD: string;
            pay_transCountNEO: string;
            pay_transCountCNEO: string;
            pay_transCountCNEOOLD: string;
            pay_transCountCNEO2NEO: string;
            pay_transCountNEO2CNEO: string;
            pay_transCountCNEOOLD2OLD: string;
            pay_transCountTips_free: string;
            pay_transCountTips_slow: string;
            pay_transCountTips_fast: string;
            pay_transCount_speed: string;
            pay_transCount_cost: string;
            pay_transCount_tips: string;
            pay_transCount_tips_err: string;
            pay_walletOpen_password: string;
            pay_walletOpen_inputPassword: string;
            pay_walletOpen_inputPassword_err: string;
            pay_walletOpen_file_error: string;
            pay_walletOpen_openFail: string;
            walletCreate_create: string;
            walletCreate_password: string;
            walletCreate_vpass: string;
            walletCreate_password_notice: string;
            walletCreate_doCreate: string;
            walletCreate_check_pass: string;
            walletCreate_check_vpass: string;
            walletCreate_check_exceed: string;
            walletImport_invalid_file: string;
            walletImport_select_file: string;
            walletImport_import: string;
            walletImport_password: string;
            walletImport_doImport: string;
            walletImport_bind_succ: string;
            walletView_info: string;
            walletView_create: string;
            walletView_import: string;
            main_wait_for_last_tran: string;
            main_no_app_wallet: string;
            main_need_open_wallet_confirm: string;
            main_refund_CGAS_second_fail: string;
            main_refund_CNEO_second_fail: string;
            main_refund_getScript_err: string;
            main_refund_sendRequest_err: string;
            main_refund_doFail: string;
            errCode_1101: string;
            errCode_1005: string;
            errCode_100601: string;
            errCode_100602: string;
            errCode_100605: string;
            errCode_100606: string;
            errCode_100607: string;
            errCode_100608: string;
            errCode_100700: string;
            errCode_100701: string;
            errCode_100702: string;
            errCode_100707: string;
            errCode_100708: string;
            errCode_100709: string;
            errCode_100801: string;
            errcode_100802: string;
            errCode_100805: string;
            errCode_100806: string;
            errCode_100807: string;
            errCode_100808: string;
            errCode_8100000: string;
            errCode_8100001: string;
            errCode_8100002: string;
            errCode_8100003: string;
            errCode_8100004: string;
            errcode_8100005: string;
            errcode_8100006: string;
            errCode_8100007: string;
            errCode_8200003: string;
            errCode_8200004: string;
            errCode_8200006: string;
            errCode_default: string;
            wallet_open_check: string;
            wallet_open_check_otcgo: string;
            wallet_open_check_otcgo_pwd: string;
            netmgr_select_api_slow: string;
            netmgr_select_node_slow: string;
            netmgr_select_cli_slow: string;
            netmgr_connecting: string;
            netmgr_connecting_fail: string;
        };
    }
}
declare namespace BlackCat {
    class LangMgr {
        type: string;
        private lang;
        constructor(type?: string);
        setType(type: string): boolean;
        get(key: string, ext?: any): string;
    }
}
declare namespace BlackCat {
    class Connector {
        private hosts;
        private first_host;
        private check_params;
        private check_type;
        private fetch_error;
        constructor(hosts: Array<string>, check_params: string, check_type?: string);
        getOne(callback: any): void;
        private check_results(callback);
    }
}
declare namespace BlackCat {
    class NetMgr {
        private types;
        private nodes;
        private apis;
        private clis;
        private default_type;
        type: number;
        private apis_server;
        private nodes_server;
        private clis_server;
        private node_change_tmp;
        constructor();
        selectApi(callback: any): void;
        private _selectApi(callback);
        private selectNode(callback, type, force?);
        private _selectNode(callback, type, force);
        private selectCli(callback, type, force?);
        private _selectCli(callback, type);
        change(callback: any, type?: number): void;
        setDefault(type: number): void;
        private change2test(callback);
        private change2Main(callback);
        getOtherTypes(): Array<number>;
        private getHosts(hosts);
        getCurrNodeInfo(type: string): any;
        getNodeLists(type: string): any;
        setNode(type: any, url: any): void;
    }
}
declare namespace BlackCat {
    class ViewBase {
        div: HTMLDivElement;
        isCreated: boolean;
        static refer: string;
        static callback: Function;
        static callback_cancel: Function;
        static callback_params: any;
        private s_timeout_remove;
        constructor();
        create(): void;
        toRefer(): void;
        reset(): void;
        key_esc(): void;
        key_enter(): void;
        start(): void;
        remove(timeout?: number, fadeClass?: string): void;
        private _remove();
        return(timeout?: number): void;
        hidden(): void;
        show(): void;
        isHidden(): boolean;
        update(): void;
        objCreate(tag: string): HTMLElement;
        ObjAppend(o: any, tag: HTMLElement): void;
        objRemove(o: any, tag: HTMLElement): void;
        parentAdd(tag: HTMLElement): void;
        parentRemove(tag: HTMLElement): void;
        bodyAppend(tag: HTMLElement): void;
        bodyRemove(tag: HTMLElement): void;
    }
}
declare namespace BlackCat {
    class AddressbookDetailsView extends ViewBase {
        private divAddress;
        static contact: contact;
        constructor();
        create(): void;
        toRefer(): void;
        private dodel();
        private makedel();
        private doMakeTransfer();
        private base64ToBlob(code);
    }
}
declare namespace BlackCat {
    class AddressbookOpView extends ViewBase {
        private inputName;
        private textAddress;
        private textDescribe;
        static contact: contact;
        static opType: string;
        constructor();
        start(): void;
        create(): void;
        toRefer(): void;
        private doFinished();
    }
}
declare namespace BlackCat {
    class AddressbookView extends ViewBase {
        private inputSearch;
        private ulAddressbook;
        private addressbook;
        static select: string;
        reset(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private doCancel();
        getAddressbook(): Promise<void>;
        private searchAddressbook();
        private getAddressElement(k, addrs);
    }
}
declare namespace BlackCat {
    class AreaView extends ViewBase {
        private static areaInfo;
        static getAreaByLang(lang: string): any[];
        static getByAreaCode(areaCode: string): any;
        static getByCodeName(codeName: string): any;
    }
}
declare namespace BlackCat {
    class AutoLogoutWalletView extends ViewBase {
        private logoutTime;
        create(): void;
        toRefer(): void;
    }
}
declare namespace BlackCat {
    class ForgetPasswordView extends ViewBase {
        private selectArea;
        private divArea;
        private inputUid;
        private inputAccount;
        private inputCode;
        private inputPass;
        private inputVpass;
        private getCodeCount;
        private getCode;
        private s_getCodeCountRetry;
        private getCodeRetryMax;
        private getCodeRetry_curr;
        private accountType;
        constructor();
        create(): void;
        key_esc(): void;
        start(): void;
        update(): void;
        reset(): void;
        private empty(value);
        private validateAccount(emptySkip?);
        private validateCode();
        private validatePass();
        private validateVpass();
        private checkAccountFromApi();
        private doForgetPassword();
        private doRetryCount(type);
        private _doRetryCount();
        private doGetCode();
        private getPhone();
    }
}
declare namespace BlackCat {
    class IconView extends ViewBase {
        private doDragMove;
        private processDiv;
        private stateDiv;
        start(): void;
        show(): void;
        reset(): void;
        update(): void;
        create(): void;
        remove(): void;
        showState(): void;
        removeState(): void;
        hiddenState(): void;
        showFail(): void;
        showSucc(): void;
        flushProcess(count: any): void;
        private dragTouch(ev);
        private drag();
        private onResize();
    }
}
declare namespace BlackCat {
    class LoginView extends ViewBase {
        private selectArea;
        private divArea;
        private inputAccount;
        private inputPass;
        private accountType;
        reset(): void;
        create(): void;
        start(): void;
        key_esc(): void;
        key_enter(): void;
        private getPhone();
        private verifyAccount();
        private verifyPass();
        private doLogin();
    }
}
declare namespace BlackCat {
    class MainView extends ViewBase {
        private divMask;
        private s_timeout_hidden;
        start(): void;
        create(): void;
        createMask(): void;
        changNetType(): void;
        remove(): void;
        hidden(): void;
        show(): void;
    }
}
declare namespace BlackCat {
    class ModifyAreaView extends ViewBase {
        private AreaObj;
        create(): void;
        toRefer(): void;
        private doArea(area);
    }
}
declare namespace BlackCat {
    class ModifyImgView extends ViewBase {
        private inputImg;
        private divImg;
        private filename;
        private reader;
        private displayImg;
        constructor();
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private doCancel();
        private changeInputImg();
        private doConfirm();
    }
}
declare namespace BlackCat {
    class ModifyNameView extends ViewBase {
        private inputName;
        start(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        key_enter(): void;
        private doCancel();
        private doConfirm();
    }
}
declare namespace BlackCat {
    class ModifyNetworkLineView extends ViewBase {
        static defaultType: string;
        private divTypes;
        private netType_nodes;
        private netType_clis;
        private divLists;
        create(): void;
        toRefer(): void;
        private showNodeInfo(type, clear?);
        private doChange(type, nodelist, height);
        private getNodeName(nodeInfo);
        private getHeight(type, nodelist, element, li, currNodeInfo);
    }
}
declare namespace BlackCat {
    class ModifySexView extends ViewBase {
        private divSex;
        private inputSex1Obj;
        private inputSex2Obj;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private doCancel();
        private doConfirm();
    }
}
declare namespace BlackCat {
    class ModifyTransactionFeeView extends ViewBase {
        private netFeeCom;
        private net_fee;
        create(): void;
        toRefer(): void;
        private setSpeed();
    }
}
declare namespace BlackCat {
    class ModifyVipView extends ViewBase {
        private monthsElement;
        private pay_way;
        private month;
        private total;
        private invite_input;
        private month12;
        private month3;
        private month1;
        private payul;
        private pay_bct;
        private pay_bcp;
        private paymentnum;
        private netFeeCom;
        private net_fee;
        constructor();
        create(): void;
        toRefer(): void;
        private setItem(item);
        private setPayway(payway);
        private setActive(list, item);
        static getPayAmount(pay_way: string, month: string): number;
        static getPayNnc(pay_way: string): string;
        static getPayTarget(): string;
        private updatePayNum();
        static pay(pay_way: string, month: string, invite: string, net_fee: string, trust?: string, callback?: any, isSDK?: boolean, sdkParams?: any): Promise<Result>;
        static checkUidFromApi(uid: string): Promise<boolean>;
    }
}
declare namespace BlackCat {
    class MyInfoView extends ViewBase {
        private myImg;
        private myName;
        private mySex;
        private myArea;
        private myFee;
        create(): void;
        toRefer(): void;
        private getImg();
        private getName();
        private getSex();
        private getFee();
        private getArea();
        private modifyImg();
        private modifyName();
        private modifySex();
        modifyFee(): void;
        modifyArea(): void;
        private getNodeHeight(type);
        updateNodeInfo(): void;
    }
}
declare namespace BlackCat {
    class PayExchangeBCTView extends ViewBase {
        private iframDivElement;
        private dev;
        create(): void;
        reset(): void;
        toRefer(): void;
        private getIframeUrl();
    }
}
declare namespace BlackCat {
    class PayExchangeDetailView extends ViewBase {
        private inputGas;
        private inputNEO;
        private balanceHtmlElement;
        private balance;
        private netFeeCom;
        private net_fee;
        private nnc;
        private destoryAddr;
        private buyFail;
        private s_getWalletLists;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private doCancel();
        private doMakeTransfer();
        private checkTransCount(count);
        private getBalance();
        private buy();
        private getSpent(price, count, float?);
        private getpayment(count, price, float?);
        private getBuyContractHash();
        private addGetWalletLists();
        private showGetMore();
        updateBalance(): void;
    }
}
declare namespace BlackCat {
    class PayExchangeShowWalletView extends ViewBase {
        static balance: number;
        private balanceElement;
        private s_getWalletLists;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private doCancel();
        private doMakeTransfer();
        private base64ToBlob(code);
        private checkTransCount(count);
        private addGetWalletLists();
        updateBalance(): void;
    }
}
declare namespace BlackCat {
    class PayExchangeView extends ViewBase {
        static type_src: string;
        private exchange_type_buy;
        private exchange_typeObj;
        private exchange_buyObj;
        private exchange_detail;
        private exchange_detail_ul;
        private exchange_info;
        private exchange_coin_type;
        private exchange_coin_name;
        private exchange_size;
        create(): void;
        reset(): void;
        toRefer(): void;
        private getExchangeInfo(src_coin);
        private showExchangeInfo();
        private showCoinType();
        private showBuy(clear?);
        private showDetail(clear?);
        private setExchangeCoinTypeInfo(type);
        private getMarketLiImg(list);
        private getCurr(size?);
    }
}
declare namespace BlackCat {
    class PayListDetailView extends ViewBase {
        static list: walletLists;
        constructor();
        create(): void;
        toRefer(): void;
        private getCnts();
        private getTxid();
        private getWallet();
        private getParams();
    }
}
declare namespace BlackCat {
    class PayListMoreView extends ViewBase {
        private page;
        private num;
        private isLast;
        private listsDiv;
        private getMoreDiv;
        constructor();
        create(): void;
        toRefer(): void;
        reset(): void;
        private doGetWalletLists();
    }
}
declare namespace BlackCat {
    class PayReceivablesView extends ViewBase {
        private divAddress;
        create(): void;
        toRefer(): void;
        private base64ToBlob(code);
    }
}
declare namespace BlackCat {
    class PayTransferView extends ViewBase {
        inputTransferCount: HTMLInputElement;
        private inputTransferAddr;
        private divTransferAddr;
        private labelName;
        private divHaveAmounts;
        private divHaveBalanceAmounts;
        private spanBalance;
        private selectType;
        private netFeeCom;
        private Balances;
        static log_type_detail: {
            gas: string;
            neo: string;
            cgas: string;
            cneo: string;
            bcp: string;
            bct: string;
            btc: string;
            eth: string;
        };
        private toaddress;
        private transferType;
        static address: string;
        static contact: contact;
        static transferType_default: string;
        inputCount: HTMLInputElement;
        net_fee: string;
        reset(): void;
        start(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private getAddress();
        private doinputchange();
        gatSelect(): void;
        private doTransfer();
        private netFeeChange(net_fee);
        updateBalance(): void;
    }
}
declare namespace BlackCat {
    class PayView extends ViewBase {
        static tokens: Array<string>;
        static tokens_coin: Array<Array<string>>;
        static tokens_old: Object;
        wallet_addr: string;
        wallet_addr_other: any;
        bct: number;
        bcp: number;
        gas: number;
        cgas: number;
        neo: number;
        cneo: number;
        btc: number;
        eth: number;
        height_clis: number;
        private divHeight_clis;
        height_nodes: number;
        private divHeight_nodes;
        listPageNum: number;
        private walletListsHash;
        private divLists;
        private divListsMore;
        private divNetSelect;
        private getWalletListsTimeout;
        private getWalletListsTimeout_min;
        private WalletListsNeedConfirm;
        private s_doGetWalletLists;
        private wallet_btn;
        private assets_btn;
        private game_assets_element;
        private game_assets;
        private game_assets_ts;
        private game_assets_update;
        private allnep5_balance;
        private pendingListsElement;
        reset(): void;
        start(): void;
        create(): void;
        update(): void;
        key_esc(): void;
        private clearTimeout();
        doGetBalances(): Promise<void>;
        private getNep5BalanceOld(coin);
        private getNep5Balance(coin);
        private doMakeRefundOld(id_old, type?);
        private doExchangeGAS();
        private doExchangeCNEO();
        private doExchangeBCT();
        private doExchangeBCP();
        private doExchangeCGAS();
        private doExchangeToken(coinType?);
        private doExchangeNEO();
        private doExchangeBTC();
        private doExchangeETH();
        getWalletAddrOther(type: string): Promise<any>;
        private _doExchangeOther(type);
        private divLists_recreate();
        doGetWalletLists(force?: number): Promise<void>;
        private getCoinIcon(v, coin_type);
        getListImg(v: any): any;
        getListGameIcon(v: any): any;
        private getAppName(v);
        getListName(v: any): any;
        getListCtm(v: any): string;
        getListCtmMsg(v: any): string;
        getListParamsMethods_extInfo(v: any): string;
        getListParamMethods(v: any): string;
        getListCnts(v: any): HTMLElement;
        getListCntsClass(v: any): "" | "pc_income" | "pc_expenditure";
        getListState(v: any): HTMLElement;
        getListBlockindex(v: any): any;
        private wallet_detail();
        private makeMintTokenTransaction(coinType?);
        private makeRefundTransaction(id_ASSET?, coinType?);
        private doMakeReceivables();
        private doMakeTransfer();
        private changeToken(type);
        flushListCtm(): void;
        private getNetTypeName();
        private showChangeNetType();
        private getDivNetSelectType(type);
        checkTransCount(count: string): boolean;
        getHeight(type: string): Promise<void>;
        updateHeight(type: any, height: any): void;
        parseTypeDetailType10(type_detail: string): {
            type: string;
            type_src: string;
        };
        private my_asset();
        private showGameAssets();
    }
}
declare namespace BlackCat {
    class PayWalletDetailView extends ViewBase {
        private wallet_addr;
        private public_key;
        private private_wif;
        private private_hex;
        private walletExport;
        reset(): void;
        create(): void;
        toRefer(): void;
        private getWalletInfo();
        private exportWallet();
    }
}
declare namespace BlackCat {
    class PersonalCenterView extends ViewBase {
        private myVip;
        private myFee;
        private myInfo;
        private liMyinfovip;
        private iMyinfovip;
        private myNet_nodes;
        private myNet_clis;
        private divHeight_nodes;
        private divHeight_clis;
        create(): void;
        toRefer(): void;
        private getUid();
        private getFee();
        private doLogout();
        private makeLogout();
        modifyFee(): void;
        private getNodeHeight(type);
        updateNodeInfo(): void;
        updateVip(): void;
    }
}
declare namespace BlackCat {
    class RegisterView extends ViewBase {
        private selectArea;
        private inputUid;
        private inputAccount;
        private inputCode;
        private inputPass;
        private inputVpass;
        private inputinvite;
        private divArea;
        private getCodeCount;
        private getCode;
        private s_getCodeCountRetry;
        private getCodeRetryMax;
        private getCodeRetry_curr;
        private accountType;
        constructor();
        create(): void;
        start(): void;
        update(): void;
        reset(): void;
        key_esc(): void;
        private empty(value);
        private getPhone();
        private checkAccountFromApi();
        private checkUidFromApi();
        private validateAccount(emptySkip?);
        private validateUid(emptySkip?);
        private validateCode();
        private validatePass();
        private validateVpass();
        private doRegister();
        private doRetryCount(type);
        private _doRetryCount();
        private doGetCode();
    }
}
declare namespace BlackCat {
    class SecurityCenterView extends ViewBase {
        spanSignOut: HTMLElement;
        create(): void;
        toRefer(): void;
        getWalletOutTimeMaxMsg(liveTimeMax: number): string;
        updateWalletOutTimeMaxMsg(): void;
    }
}
declare namespace BlackCat {
    class TrustContractView extends ViewBase {
        private offset;
        private num;
        private isLast;
        private listsDiv;
        private getMoreDiv;
        constructor();
        create(): void;
        toRefer(): void;
        reset(): void;
        private doGetTrustLists();
        private getListImg(v);
        private getListNnc(v);
        private doDelList(v);
    }
}
declare namespace BlackCat {
    class ViewAlert extends ViewBase {
        static content: string;
        static content_ext: any;
        create(): void;
        key_esc(): void;
        key_enter(): void;
        toRefer(): void;
        private doConfirm();
    }
}
declare namespace BlackCat {
    class ViewConfirm extends ViewBase {
        static content: string;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private doConfirm();
        private doCancel();
    }
}
declare namespace BlackCat {
    class ViewConnecting extends ViewBase {
        static content: string;
        static callback_retry: Function;
        private showType;
        private showReturn;
        create(): void;
        key_esc(): void;
        showConnecting(): void;
        showRetry(showReturn: boolean): void;
    }
}
declare namespace BlackCat {
    class ViewLoading extends ViewBase {
        static content: string;
        create(): void;
        key_esc(): void;
    }
}
declare namespace BlackCat {
    class ViewMgr {
        views: any;
        iconView: IconView;
        mainView: MainView;
        viewWalletOpen: ViewWalletOpen;
        viewTransferCount: ViewTransferCount;
        viewTransactionConfirm: ViewTransactionConfirm;
        viewTransferConfirm: ViewTransferConfirm;
        viewAlert: ViewAlert;
        viewConfirm: ViewConfirm;
        viewToast: ViewToast;
        viewLoading: ViewLoading;
        registerView: RegisterView;
        loginView: LoginView;
        forgetPasswordView: ForgetPasswordView;
        walletView: WalletView;
        walletCreateView: WalletCreateView;
        walletImportView: WalletImportView;
        payView: PayView;
        payListDetailView: PayListDetailView;
        payListMoreView: PayListMoreView;
        personalCenterView: PersonalCenterView;
        myInfoView: MyInfoView;
        modifyImgView: ModifyImgView;
        modifyNameView: ModifyNameView;
        modifySexView: ModifySexView;
        modifyAreaView: ModifyAreaView;
        modifyTransactionFeeView: ModifyTransactionFeeView;
        modifyNetworkLineView: ModifyNetworkLineView;
        modifyVipView: ModifyVipView;
        securityCenterView: SecurityCenterView;
        trustContractView: TrustContractView;
        autoLogoutWalletView: AutoLogoutWalletView;
        payWalletDetailView: PayWalletDetailView;
        payExchangeView: PayExchangeView;
        payExchangeDetailView: PayExchangeDetailView;
        payReceivablesView: PayReceivablesView;
        payTransferView: PayTransferView;
        addressbookView: AddressbookView;
        addressbookDetailsView: AddressbookDetailsView;
        addressbookOpView: AddressbookOpView;
        viewConnecting: ViewConnecting;
        payExchangeBCTView: PayExchangeBCTView;
        payExchangeShowWalletView: PayExchangeShowWalletView;
        constructor();
        change(type: string): void;
        removeAll(): void;
        update(): void;
        updateBalance(): void;
    }
}
declare namespace BlackCat {
    class ViewToast extends ViewBase {
        static showTime: number;
        static content: string;
        create(): void;
        show(): void;
        key_esc(): void;
    }
}
declare namespace BlackCat {
    class ViewTransactionConfirm extends ViewBase {
        static list: walletLists;
        static isTrustFeeLess: boolean;
        private divConfirmSelect;
        private divTrust;
        private trust;
        private netFeeCom;
        private net_fee;
        constructor();
        start(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private getCnts();
        private getWallet();
        private getParams();
    }
}
declare namespace BlackCat {
    class ViewTransferConfirm extends ViewBase {
        static list: walletLists;
        private divConfirmSelect;
        private netFeeCom;
        private net_fee;
        constructor();
        start(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private getCnts();
        private getWallet();
        private getParams();
    }
}
declare namespace BlackCat {
    class ViewTransferCount extends ViewBase {
        static coinType: string;
        static transType: string;
        static transNncOld: string;
        private selectTransfertype;
        private divtransfername;
        private labeltransfername1;
        private labeltransfername2;
        private divHaveAmounts;
        private divHaveUtxoAmounts;
        private spanHaveUtxoAmounts;
        private divHaveNep5Amounts;
        private spanHaveNep5Amounts;
        private netFeeCom;
        private coinTypeLang;
        private coinBalanceLang;
        private coinBalance;
        inputCount: HTMLInputElement;
        net_fee: string;
        start(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private doinputchange();
        private doConfirm();
        private netFeeChange(net_fee);
        updateBalance(): void;
        private getSelectOptions();
        private getCoinBalance();
        private getCoinBalanceLang();
        private getCoinTypeLang();
        private dotransfertype();
        private configNetFee();
        private checkBalance();
    }
}
declare namespace BlackCat {
    class ViewWalletOpen extends ViewBase {
        static callback_callback: Function;
        private static tasks;
        private inputPassword;
        start(): void;
        create(): void;
        toRefer(): void;
        key_enter(): void;
        key_esc(): void;
        private doConfirm();
        private doCancel();
        doReadWalletFile(): Promise<void>;
        private doOpenWallet();
        static addTask(type: string, params: any): void;
        static removeTask(type: string): void;
        private doOpenTasks();
    }
}
declare namespace BlackCat {
    class WalletCreateView extends ViewBase {
        private inputPwd;
        private inputVwd;
        private wallet;
        constructor();
        create(): void;
        show(): void;
        key_esc(): void;
        private createVerifyPwd();
        private createVerifyVwd();
        private doCreate();
        private doBindWallet();
    }
}
declare namespace BlackCat.tools {
    class LoginInfo {
        pubkey: Uint8Array;
        prikey: Uint8Array;
        address: string;
        static ArrayToString(array: LoginInfo[]): string;
        static StringToArray(str: string): LoginInfo[];
        static getCurrentLogin(): LoginInfo;
        static getCurrentAddress(): string;
        static setCurrentAddress(str: string): void;
    }
    class BalanceInfo {
        balance: number;
        asset: string;
        name: {
            lang: string;
            name: string;
        }[];
        names: string;
        type: string;
        static jsonToArray(json: {}[]): BalanceInfo[];
        static getBalancesByArr(balances: any, nep5balances: any, height: number): BalanceInfo[];
        static setBalanceSotre(balance: BalanceInfo, height: number): void;
    }
    class Nep5Balance {
        assetid: string;
        symbol: string;
        balance: number;
    }
    class Result {
        err: boolean;
        info: any;
    }
    enum AssetEnum {
        NEO = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        GAS = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
    }
    class NeoAsset {
        neo: number;
        gas: number;
        claim: string;
    }
    class OldUTXO {
        height: number;
        txid: string;
        n: number;
        asset: string;
        constructor(txid: string, n: number, asset?: string);
        static oldutxosPush(olds: OldUTXO[]): void;
        static setOldutxos(olds: OldUTXO[]): void;
        static getOldutxos(): OldUTXO[];
        compareUtxo(utxo: UTXO): boolean;
    }
    class UTXO {
        addr: string;
        txid: string;
        n: number;
        asset: string;
        count: Neo.Fixed8;
        static ArrayToString(utxos: UTXO[]): Array<any>;
        static StringToArray(obj: Array<any>): UTXO[];
        static setAssets(assets: {
            [id: string]: UTXO[];
        }): void;
        static getAssets(): any;
    }
    class Consts {
        static baseContract: string;
        static registerContract: string;
    }
    class DomainInfo {
        owner: Uint8Array;
        register: Uint8Array;
        resolver: Uint8Array;
        ttl: string;
    }
    class RootDomainInfo extends DomainInfo {
        rootname: string;
        roothash: Uint8Array;
        constructor();
    }
    class Transactionforaddr {
        addr: string;
        blockindex: number;
        blocktime: {
            $date: number;
        };
        txid: string;
    }
    interface Transaction {
        txid: string;
        type: string;
        vin: {
            txid: string;
            vout: number;
        }[];
        vout: {
            n: number;
            asset: string;
            value: string;
            address: string;
        }[];
    }
    class History {
        n: number;
        asset: string;
        value: string;
        address: string;
        assetname: string;
        txtype: string;
        time: string;
        txid: string;
        static setHistoryStore(history: History, height: number): void;
        static getHistoryStore(): Array<any>;
        static delHistoryStoreByHeight(height: number): void;
    }
    class Claim {
        addr: string;
        asset: string;
        claimed: boolean;
        createHeight: number;
        n: number;
        txid: string;
        useHeight: number;
        used: string;
        value: number;
        constructor(json: {});
        static strToClaimArray(arr: {}[]): Claim[];
    }
    class Domainmsg {
        domainname: string;
        resolver: string;
        mapping: string;
        time: string;
        isExpiration: boolean;
        await_resolver: boolean;
        await_mapping: boolean;
        await_register: boolean;
    }
    class DomainStatus {
        domainname: string;
        resolver: string;
        mapping: string;
        await_mapping: boolean;
        await_register: boolean;
        await_resolver: boolean;
        static setStatus(domain: DomainStatus): void;
        static getStatus(): {};
    }
    class WalletOtcgo {
        address: string;
        publicKey: string;
        privatekey: string;
        publicKeyCompressed: string;
        privateKeyEncrypted: string;
        pubkey: Uint8Array;
        prikey: Uint8Array;
        fromJsonStr(str: string): void;
        otcgoDecrypt(pwd: string): void;
        doSign(prvkey: any, msg: any): any;
        doVerify(pubkey: any, msg: any, sigval: any): any;
        doValidatePwd(): any;
    }
    class MyAuction {
        auctionSpentTime: string;
        auctionState: string;
        blockindex: string;
        domain: string;
        maxBuyer: string;
        maxPrice: string;
        owner: string;
        startAuctionTime: number;
    }
}
declare namespace BlackCat {
    class WalletImportView extends ViewBase {
        private inputFile;
        private inputFileText;
        private inputPwd;
        private filename;
        private filepass;
        private reader;
        constructor();
        create(): void;
        key_esc(): void;
        private doBindWallet();
        private bindWallet(walletStr);
    }
}
declare namespace BlackCat {
    class WalletView extends ViewBase {
        create(): void;
        key_esc(): void;
    }
}
declare namespace BlackCat {
    class ApiTool {
        static api_version: string;
        static base_url: string;
        private static makeUrl(cmd);
        private static common(cmd, post);
        static isLogined(uid: string, token: string): Promise<any>;
        static getPhoneCode(phone: string): Promise<any>;
        static getGameIndex(): Promise<any>;
        static phoneLogin(phone: string, code: string): Promise<any>;
        static bindWallet(uid: string, token: string, wallet: string): Promise<any>;
        static getWalletFile(uid: string, token: string): Promise<any>;
        static getEntergameParam(uid: string, token: string, g_id: string): Promise<any>;
        static addUserWalletLogs(uid: string, token: string, txid: string, g_id: string, cnts: string, type: string, params: string, net_type: number, trust?: string, net_fee?: string, type_detail?: string): Promise<any>;
        static getWalletListss(uid: string, token: string, page: number, num: number, net_type: number, pedding: number): Promise<any>;
        static walletNotify(uid: string, token: string, txid: string, net_type: number): Promise<any>;
        static getAppWalletNotifys(uid: string, token: string, g_id: string, net_type: number): Promise<any>;
        static getPlatWalletNotifys(uid: string, token: string, net_type: number): Promise<any>;
        static walletNotifyExt(uid: string, token: string, txid: string, ext: string, net_type: number): Promise<any>;
        static getEnterParams(uid: string, token: string, g_id: string): Promise<any>;
        static registerByPhone(phone: string, code: string, pwd: string, region: string, uid: string, invite_code: string, refer?: string): Promise<any>;
        static validPhone(phone: string): Promise<any>;
        static validUid(uid: string): Promise<any>;
        static validInvite(invite_code: string): Promise<any>;
        static registerByEmail(email: string, code: string, pwd: string, region: string, uid: string, invite_code: string, refer?: string): Promise<any>;
        static validEmail(email: string): Promise<any>;
        static phoneLoginPass(phone: string, pwd: string): Promise<any>;
        static emailLoginPass(email: string, pwd: string): Promise<any>;
        static getEmailCode(email: string, lang: string): Promise<any>;
        static userLoginPass(uid: string, pwd: string): Promise<any>;
        static modUserIcon(uid: string, token: string, file: File): Promise<any>;
        static modUserName(uid: string, token: string, name: string): Promise<any>;
        static modUserSex(uid: string, token: string, sex: string): Promise<any>;
        static modUserArea(uid: string, token: string, region: string): Promise<any>;
        static modUserFee(uid: string, token: string, service_charge: string): Promise<any>;
        static forgetPassByPhone(phone: string, code: string, new_pwd: string): Promise<any>;
        static forgetPassByEmail(email: string, code: string, new_pwd: string): Promise<any>;
        static getTrustNncs(uid: string, token: string, g_id: string): Promise<any>;
        static getTrustLists(uid: string, token: string, offset: number, num: number): Promise<any>;
        static delTrustNncs(uid: string, token: string, id: string): Promise<any>;
        static addAddrbook(uid: string, token: string, address_name: string, address_wallet: string, address_desc: string): Promise<any>;
        static delAddrbook(uid: string, token: string, id: string): Promise<any>;
        static getAddrbook(uid: string, token: string): Promise<any>;
        static updateAddrbook(uid: string, token: string, address_name: string, address_wallet: string, address_desc: string, id: string): Promise<any>;
        static getExchangeInfo(uid: string, token: string, src_coin: number, net_type: number, exchange: string): Promise<any>;
        static getOtherAddress(uid: string, token: string, type_src: string, net_type: number): Promise<any>;
        static transferByOther(uid: string, token: string, type_src: string, type: string, price: string, count: string, net_type: number, txid: string, c_hash: string): Promise<any>;
        static getBctIframe(uid: string, token: string): Promise<any>;
        static getGameAssets(uid: string, token: string, assets: Array<string>, appid?: string): Promise<any>;
    }
}
declare namespace BlackCat {
    class User {
        info: UserInfo;
        cacheKey: string;
        private _updateUserInfo(userinfo);
        getInfo(): void;
        setInfo(key: any, value: any): void;
        isLogined(): Promise<boolean>;
        getWalletFile(): Promise<any>;
        logout(): void;
        getWalletFileCache(): Promise<string>;
        validateLogin(): Promise<number>;
    }
}
declare namespace BlackCat.tools {
    class CoinTool {
        static readonly id_GAS: string;
        static readonly id_NEO: string;
        static id_CGAS: string;
        static id_CGAS_OLD: Array<string>;
        static id_CNEO: string;
        static id_CNEO_OLD: Array<string>;
        static id_BCT: string;
        static id_BCP: string;
        static id_BCT_DESTROY: string;
        static id_BTC: string;
        static id_BTC_DESTROY: string;
        static id_ETH: string;
        static id_ETH_DESTROY: string;
        static id_CNEO_DESTROY: string;
        static id_bancor: string;
        static BUY_VIP_ADDR: string;
        static assetID2name: {
            [id: string]: string;
        };
        static name2assetID: {
            [id: string]: string;
        };
        static initAllAsset(): Promise<void>;
        static getassets(): Promise<{
            [id: string]: UTXO[];
        }>;
        static makeTran(utxos: {
            [id: string]: UTXO[];
        }, targetaddr: string, assetid: string, sendcount: Neo.Fixed8, net_fee?: Neo.Fixed8, left_fee?: number, split?: boolean): Result;
        static makeTranMulti(utxos: {
            [id: string]: UTXO[];
        }, targets: Array<{
            toaddr: string;
            count: string;
        }>, assetid: string, net_fee?: Neo.Fixed8): Result;
        static rawTransaction(targetaddr: string, asset: string, count: string, net_fee?: Neo.Fixed8): Promise<Result>;
        static rawTransactionMulti(targets: Array<any>, asset: string, net_fee?: Neo.Fixed8): Promise<Result>;
        static contractInvokeTrans_attributes(script: Uint8Array, net_fee?: string, not_send?: boolean): Promise<Result>;
        static contractInvokeTrans(script: Uint8Array): Promise<Result>;
        static nep5Transaction(address: string, tatgeraddr: any, asset: string, amount: string, net_fee?: string, not_send?: boolean): Promise<Result>;
        static getNep5Assets(id_hash: string): Promise<{
            [id: string]: UTXO[];
        }>;
        static getCgasAssets(id_CGAS: string, amount: number): Promise<{
            [id: string]: UTXO[];
        }>;
    }
}
declare namespace BlackCat {
    class floatNum {
        static strip(num: number, precision?: number): number;
        static digitLength(num: number): number;
        static float2Fixed(num: number): number;
        static checkBoundary(num: number): void;
        static times(num1: number, num2: number, ...others: number[]): number;
        static plus(num1: number, num2: number, ...others: number[]): number;
        static minus(num1: number, num2: number, ...others: number[]): number;
        static divide(num1: number, num2: number, ...others: number[]): number;
        static round(num: number, ratio: number): number;
        static addZero(num: number, ratio: number): string;
    }
}
declare namespace BlackCat.tools {
    class neotools {
        constructor();
        static verifyAddress(addr: string): boolean;
        static verifyPublicKey(publicKey: string): boolean;
        static wifDecode(wif: string): Result;
        static nep2FromWif(wif: string, password: string): Result;
        static nep2ToWif(nep2: string, password: string): Promise<Result>;
        static nep6Load(wallet: ThinNeo.nep6wallet, password: string): Promise<LoginInfo[]>;
        static getPriKeyfromAccount(scrypt: ThinNeo.nep6ScryptParameters, password: string, account: ThinNeo.nep6account): Promise<Result>;
    }
}
declare namespace BlackCat.tools {
    class NNSTool {
        static root_test: RootDomainInfo;
        static initRootDomain(): Promise<void>;
        static queryDomainInfo(doamin: string): Promise<DomainInfo>;
        static registerDomain(doamin: string): Promise<Result>;
        static getRootName(): Promise<string>;
        static getRootNameHash(): Promise<Uint8Array>;
        static getOwnerInfo(domain: Uint8Array, scriptaddress: Uint8Array): Promise<DomainInfo>;
        static getNameHash(domain: string): Promise<Uint8Array>;
        static setResolve(nnshash: Uint8Array, resolverhash: Uint8Array): Promise<Result>;
        static setResolveData(nnshash: Uint8Array, str: string, resolve: string): Promise<void>;
        static resolveData(domain: string): Promise<string>;
        static resolveFull(protocol: string, nameArray: string[]): Promise<void>;
        static getSubOwner(nnshash: Uint8Array, subdomain: string, scriptaddress: Uint8Array): Promise<string>;
        static nameHash(domain: string): Uint8Array;
        static nameHashSub(roothash: Uint8Array, subdomain: string): Uint8Array;
        static nameHashArray(domainarray: string[]): Uint8Array;
        static verifyDomain(domain: any): boolean;
        static verifyAddr(addr: any): boolean;
        static domainStatus: DomainStatus;
        static setDomainStatus(): void;
        static initStatus(): void;
    }
}
declare namespace BlackCat {
    class UserInfo {
        uid: string;
        name: string;
        phone: string;
        token: string;
        wallet: string;
        area: string;
        region: string;
        email: string;
        qq: string;
        icon: string;
        sex: string;
        service_charge: string;
        lv: string;
        is_vip: string;
        vip_end_time: string;
        is_forever_vip: string;
    }
    class TransInfo {
        assetid: string;
        targetaddr: string;
        amount: string;
    }
    class RawTransInfo {
        sbParamJson: any[];
        sbPushString: string;
        nnc: string;
    }
    class RefundTransInfo {
        count: number;
    }
    class MintTokenTransInfo {
        count: number;
        extString: string;
    }
    class getMintTokenTransInfo {
        txid: string;
    }
    class invokescriptInfo {
        sbParamJson: any[];
        sbPushString: string;
        nnc: string;
        extString: string;
    }
    class walletLists {
        id: string;
        ctm: string;
        g_id: string;
        type: string;
        type_detail: string;
        state: string;
        state_gameplay: string;
        state_gameplay_detail: string;
        txid: string;
        wallet: string;
        cnts: string;
        vdata: string;
        params: string;
        nnc: string;
        icon: string;
        name: string;
        ext: string;
        client_notify: string;
    }
    class contact {
        id: string;
        ctm: string;
        uid: string;
        address_name: string;
        address_wallet: string;
        address_desc: string;
    }
}
declare namespace BlackCat {
    class SDK {
        private static is_init;
        private static main;
        static init(appid: any, appkey: any, listener: any, lang?: string): void;
        static initex(params: any, callback?: any): void;
        static setLang(type: string): void;
        static showMain(): void;
        static showIcon(): void;
        static login(callback?: any): void;
        static invokescript(params: any, callback?: any): Promise<void>;
        static makeRawTransaction(params: any, callback?: any): Promise<void>;
        static makeRecharge(params: any, callback?: any): Promise<void>;
        static confirmAppNotify(params: any, callback?: any): Promise<void>;
        static getBalance(callback?: any): Promise<void>;
        static getHeight(callback?: any): Promise<void>;
        static getUserInfo(callback?: any): Promise<void>;
        static makeGasTransfer(params: any, callback?: any): Promise<void>;
        static makeTransfer(params: any, callback?: any): Promise<void>;
        static makeNeoTransfer(params: any, callback?: any): Promise<void>;
        static makeGasTransferMulti(params: any, callback?: any): Promise<void>;
        static getNetType(callback?: any): Promise<void>;
        static setDefaultNetType(type: any): Promise<void>;
        static bancor(params: any, callback?: any): Promise<void>;
        static buyVip(params: any, callback?: any): Promise<void>;
    }
    class Result {
        err: boolean;
        info: any;
    }
}
declare namespace BlackCat.tools {
    class StorageTool {
        static getLoginArr(): LoginInfo[];
        static setLoginArr(value: LoginInfo[]): void;
        static setStorage(key: string, value: string): void;
        static getStorage(key: string): string;
        static delStorage(key: string): void;
        static heightRefresh(): Promise<void>;
        static utxosRefresh(): Promise<void>;
    }
    class StaticStore {
        static choiceAsset: string;
        static setAsset(asset: string): void;
    }
}
declare namespace BlackCat.tools {
    class DateTool {
        static dateFtt(fmt: any, date: any): any;
    }
}
declare namespace BlackCat.tools {
    class wallet {
        private wallet;
        private otcgo;
        private isotc;
        filestr: string;
        wallet_addr: string;
        constructor();
        setWalletStr(filestr: any): Promise<boolean>;
        readWalletFile(type?: number): Promise<boolean>;
        open(filepass: string): Promise<boolean>;
        isOpen(): boolean;
        invokescript(params: any): Promise<Result>;
        bancorTransaction(params: any, net_fee: string): Promise<Result>;
        makeRawTransaction(params: any, trust: string, net_fee: string, upload_log?: boolean): Promise<Result>;
        makeRecharge(params: any, trust: any, net_fee: any): Promise<Result>;
        closeWallet(): void;
    }
}
declare namespace BlackCat.tools {
    class WWW {
        static api_nodes: string;
        static api_clis: string;
        static api_cgas: string;
        static api_cneo: string;
        static makeRpcUrl(url: string, method: string, ..._params: any[]): string;
        static makeRpcPostBody(method: string, ..._params: any[]): {};
        static api_getHeight_nodes(nodes_url?: string): Promise<number>;
        static api_getHeight_clis(clis_url?: string): Promise<number>;
        static api_getAllAssets(): Promise<any>;
        static api_getAllNep5AssetBalanceOfAddress(address: string): Promise<any>;
        static api_getUTXO(address: string): Promise<any>;
        static api_getAvailableUTXOS(address: string, amount: number): Promise<any>;
        static api_getBalance(address: string): Promise<any>;
        static getNep5Asset(asset: string): Promise<any>;
        static cli_postRawTransaction(data: Uint8Array): Promise<boolean>;
        static api_postRawTransaction(data: Uint8Array): Promise<boolean>;
        static cli_getInvokescript(scripthash: Uint8Array): Promise<any>;
        static rpc_getInvokescript(scripthash: Uint8Array): Promise<any>;
        static getrawtransaction(txid: string): Promise<any>;
        static api_getcontractstate(scriptaddr: string): Promise<any>;
    }
}
