/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易确认视图
    export class ViewTransferConfirm extends ViewBase {

        static list: walletLists;

        private divConfirmSelect: HTMLElement; // 确认/取消栏div

        private netFeeCom: NetFeeComponent; // 手续费组件

        private net_fee: string // 网络交易费

        constructor() {
            super()

            if (!ViewTransferConfirm.list) {
                ViewTransferConfirm.list = new walletLists();
            }
        }

        start() {
            if (this.isCreated) {
                // 每次清理上一次的，显示最新的
                this.remove()
            }
            super.start()

            if (this.div.clientHeight < 667) {
                this.divConfirmSelect.style.top = "auto"
                this.divConfirmSelect.style.bottom = "0"
            }
        }

        create() {

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_listdetail", "pc_tradeconfirm")

            if (ViewTransferConfirm.list && ViewTransferConfirm.list.hasOwnProperty("wallet")) {
                // header // header标签创建比较麻烦
                var headerTitle = this.objCreate("div")
                headerTitle.classList.add("pc_header")
                // 返回按钮
                var returnBtn = this.objCreate("a")
                returnBtn.classList.add("iconfont", "icon-bc-fanhui")
                returnBtn.textContent = Main.langMgr.get("return") // "返回"
                returnBtn.onclick = () => {
                    this.return()
                    if (ViewTransferConfirm.callback_cancel) {
                        ViewTransferConfirm.callback_cancel()
                        ViewTransferConfirm.callback_cancel = null;
                    }

                    // 隐藏
                    Main.viewMgr.mainView.hidden()
                    Main.viewMgr.change("IconView")
                }
                this.ObjAppend(headerTitle, returnBtn)
                // h1标题
                var h1Obj = this.objCreate("h1")
                h1Obj.textContent = Main.platName
                this.ObjAppend(headerTitle, h1Obj)

                this.ObjAppend(this.div, headerTitle)

                var contentObj = this.objCreate("div")
                contentObj.classList.add("pc_detail")
                contentObj.style.paddingBottom = "160px"
                contentObj.innerHTML
                    = '<ul>'
                    + '<li>'
                    + '<div class="pc_listimg">'
                    + '<img src="' + Main.viewMgr.payView.getListImg(ViewTransferConfirm.list) + '">'
                    + '</div>'
                    + '<div class="pc_liftinfo">'
                    + '<div class="pc_listname">' + Main.viewMgr.payView.getListName(ViewTransferConfirm.list) + '</div>'
                    + '<span class="pc_listdate">' + Main.viewMgr.payView.getListCtm(ViewTransferConfirm.list) + '</span>'
                    + '</div>'
                    + '<div class="pc_cnts ' + Main.viewMgr.payView.getListCntsClass(ViewTransferConfirm.list) + ' ">'
                    + this.getCnts()
                    // +          this.getStats()
                    + '</div>'
                    + '</li>'
                    // +      '<li><label>交易单号：</label><p>' + this.getTxid() + '</p></li>'
                    + '<li><label>' + Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                    + this.getParams()
                    + '</ul>'
                this.ObjAppend(this.div, contentObj)



                // 确认/取消栏div
                this.divConfirmSelect = this.objCreate("div")
                this.divConfirmSelect.classList.add("pc_tradeconfirmbut")
                this.ObjAppend(this.div, this.divConfirmSelect)

                // 手续费组件
                this.netFeeCom = new NetFeeComponent(this.divConfirmSelect, (net_fee) => {
                    // this.netFeeChange(net_fee)
                    this.net_fee = net_fee
                })
                this.netFeeCom.setFeeDefault()
                this.netFeeCom.createDiv()
                

                var cancelObj = this.objCreate("button")
                cancelObj.classList.add("pc_cancel")
                cancelObj.textContent = Main.langMgr.get("cancel") // "取消"
                cancelObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransferConfirm]', 'PayTransfer交易取消..')
                    if (ViewTransferConfirm.callback_cancel) {
                        ViewTransferConfirm.callback_cancel(ViewTransferConfirm.callback_params)
                        ViewTransferConfirm.callback_cancel = null;
                    }
                    this.remove()

                    // 隐藏
                    Main.viewMgr.mainView.hidden()
                    Main.viewMgr.change("IconView")
                }
                this.ObjAppend(this.divConfirmSelect, cancelObj)



                var confirmObj = this.objCreate("button")
                if (ViewTransferConfirm.list.type == "3") {
                    confirmObj.textContent = Main.langMgr.get("pay_makeRecharge") // "充值"
                }
                else {
                    confirmObj.textContent = Main.langMgr.get("ok") // "确认"
                }
                confirmObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransferConfirm]', 'PayTransfer交易确认..')
                    ViewTransferConfirm.callback(ViewTransferConfirm.callback_params, this.net_fee)
                    ViewTransferConfirm.callback = null;
                    this.remove(300)

                    // 隐藏
                    Main.viewMgr.mainView.hidden()
                    Main.viewMgr.change("IconView")
                }
                this.ObjAppend(this.divConfirmSelect, confirmObj)

            }
        }

        toRefer() {
            if (ViewTransferConfirm.refer) {
                Main.viewMgr.change(ViewTransferConfirm.refer);
                ViewTransferConfirm.refer = null;
            }
        }

        key_esc() {
            
        }

        private getCnts() {
            return ViewTransferConfirm.list.cnts != '0' ? ViewTransferConfirm.list.cnts : ""
        }

        private getWallet() {
            return ViewTransferConfirm.list.wallet
        }

        private getParams() {
            var html = ""
            var params: any = ViewTransferConfirm.list.params;
            console.log("[BlaCat]", '[ViewTransferConfirm]', 'getParams, params => ', params)
            if (params) {
                try {
                    params = JSON.parse(params)
                    if (params.hasOwnProperty("toaddr")) {
                        params = [params]
                    }
                    if (params instanceof Array) {
                        for (let k in params) {
                            html += '<li class="pc_contractAddress">'
                                + '<div><label>' + Main.langMgr.get("pay_transfer_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                + '<div><label>' + Main.langMgr.get("pay_transfer_count") + '</label><p>' + params[k].count + '</p></div>'
                                + '</li>';
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[ViewTransferConfirm]', 'getParams error => ', e.toString())
                }
            }

            return html;
        }
    }
}