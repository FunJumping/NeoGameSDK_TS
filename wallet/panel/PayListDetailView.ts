/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易记录详情
    export class PayListDetailView extends ViewBase {

        static list: walletLists;

        constructor() {
            super()

            if (!PayListDetailView.list) {
                PayListDetailView.list = new walletLists();
            }
        }

        create() {

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_listdetail")

            if (PayListDetailView.list && PayListDetailView.list.hasOwnProperty("wallet")) {
                // header // header标签创建比较麻烦
                var headerObj = this.objCreate("div")
                headerObj.classList.add("pc_header")
                // 返回按钮
                var returnBtn = this.objCreate("a")
                returnBtn.classList.add("iconfont", "icon-fanhui")
                returnBtn.textContent = Main.langMgr.get("return") // "返回"
                returnBtn.onclick = () => {
                    this.return()
                }
                this.ObjAppend(headerObj, returnBtn)
                // h1标题
                var h1Obj = this.objCreate("h1")
                h1Obj.textContent = Main.platName
                this.ObjAppend(headerObj, h1Obj)
                this.ObjAppend(this.div, headerObj)

                var contentObj = this.objCreate("div")
                contentObj.classList.add("pc_detail")
                contentObj.innerHTML
                    = '<ul>'
                    + '<li>'
                    + '<div class="pc_listimg">'
                    + '<img src="' + Main.viewMgr.payView.getListImg(PayListDetailView.list) + '">'
                    + '</div>'
                    + '<div class="pc_liftinfo">'
                    + '<div class="pc_listname">' + Main.viewMgr.payView.getListName(PayListDetailView.list) + '</div>'
                    + '<span class="pc_listdate">' + Main.viewMgr.payView.getListCtm(PayListDetailView.list) + '</span>'
                    + '</div>'
                    + '<div class="pc_cnts ' + Main.viewMgr.payView.getListCntsClass(PayListDetailView.list) + ' "><span>'
                    + this.getCnts()
                    + '</span>'
                    + Main.viewMgr.payView.getListState(PayListDetailView.list).outerHTML
                    // +           this.getStats()
                    + '</div>'
                    + '</li>'
                    + '<li><label>' + Main.langMgr.get("paylist_txid") + '</label><p>' + this.getTxid() + '</p></li>'
                    + '<li><label>' + Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                    + this.getParams()
                    + '</ul>'
                this.ObjAppend(this.div, contentObj)
            }
        }

        toRefer() {
            if (PayListDetailView.refer) {
                Main.viewMgr.change(PayListDetailView.refer);
                PayListDetailView.refer = null;
            }
        }


        private getCnts() {
            return PayListDetailView.list.cnts
        }

        private getTxid() {
            return PayListDetailView.list.txid
        }

        private getWallet() {
            return PayListDetailView.list.wallet
        }

        private getParams() {
            var html = ""
            var params: any = PayListDetailView.list.params;
            if (params) {
                try {
                    params = JSON.parse(params)
                    if (params.hasOwnProperty("nnc")) {
                        params = [params]
                    }
                    if (params instanceof Array) {
                        if (PayListDetailView.list.type == "6") {
                            // gas转账
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + Main.langMgr.get("pay_transferGas_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                    + '<div><label>' + Main.langMgr.get("pay_transferGas_count") + '</label><p>' + params[k].count + '</p></div>'
                                    + '</li>';
                            }
                        }
                        else {
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + Main.langMgr.get("paylist_nnc") + '</label><p>' + params[k].nnc + '</p></div>'
                                    + '<div><label>' + Main.langMgr.get("paylist_sbParamJson") + '</label><p>' + params[k].sbParamJson + '</p></div>'
                                    + '<div><label>' + Main.langMgr.get("paylist_sbPushString") + '</label><p>' + params[k].sbPushString + '</p></div>'
                                    + '</li>';
                            }
                        }
                    }

                }
                catch (e) {
                    console.log('[Bla Cat]', '[PayListDetailView]', 'getParams error => ', e.toString())
                }
            }

            return html;
        }

    }
}