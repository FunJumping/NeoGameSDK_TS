namespace BlackCat {

    export class UserInfo {
        uid: string = '';
        name: string = '';
        phone: string = '';
        token: string = '';
        wallet: string = '';
        area: string = '';
        region: string = "";
        email: string = '';
        qq: string = '';
        icon: string = '';
        sex: string = "";
        service_charge: string = "";

    }

    export class TransInfo {
        assetid: string = "";
        targetaddr: string = "";
        amount: string = "";
    }

    export class RawTransInfo {
        sbParamJson: any[];
        sbPushString: string;
        nnc: string;
    }

    export class RefundTransInfo {
        count: number;
    }

    export class MintTokenTransInfo {
        count: number;
        extString: string;
    }

    export class getMintTokenTransInfo {
        txid: string;
    }

    export class invokescriptInfo {
        sbParamJson: any[];
        sbPushString: string;
        nnc: string;
        extString: string;
    }

    export class walletLists {
        id: string = "";
        ctm: string = "";
        g_id: string = "";
        type: string = "";
        type_detail: string = "";
        state: string = "";
        state_gameplay: string = "";
        state_gameplay_detail: string = "";
        txid: string = "";
        wallet: string = "";
        cnts: string = "0";
        vdata: string = "";
        params: string = "";
        nnc: string = "";
        icon: string = "";
        name: string = "";
        ext: string = "";
        client_notify: string = "";

    }

    export class contact {
        id: string = "";
        ctm: string = "";
        uid: string = "";
        address_name: string = "";
        address_wallet: string = "";
        address_desc: string = "";
    }
}