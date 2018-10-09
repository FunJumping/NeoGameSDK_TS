/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易确认视图
    export class ViewTransConfirmGas extends ViewBase {

        static list: walletLists;

        private divConfirmSelect: HTMLElement; // 确认/取消栏div

        private netFeeCom: NetFeeComponent; // 手续费组件

        private net_fee: string // 网络交易费

        constructor() {
            super()

            if (!ViewTransConfirmGas.list) {
                ViewTransConfirmGas.list = new walletLists();
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

            if (ViewTransConfirmGas.list && ViewTransConfirmGas.list.hasOwnProperty("wallet")) {
                // header // header标签创建比较麻烦
                var headerTitle = this.objCreate("div")
                headerTitle.classList.add("pc_header")
                // 返回按钮
                var returnBtn = this.objCreate("a")
                returnBtn.classList.add("iconfont", "icon-bc-fanhui")
                returnBtn.textContent = Main.langMgr.get("return") // "返回"
                returnBtn.onclick = () => {
                    this.return()
                    if (ViewTransConfirmGas.callback_cancel) {
                        ViewTransConfirmGas.callback_cancel()
                        ViewTransConfirmGas.callback_cancel = null;
                    }
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
                    + '<img src="' + Main.viewMgr.payView.getListImg(ViewTransConfirmGas.list) + '">'
                    + '</div>'
                    + '<div class="pc_liftinfo">'
                    + '<div class="pc_listname">' + Main.viewMgr.payView.getListName(ViewTransConfirmGas.list) + '</div>'
                    + '<span class="pc_listdate">' + Main.viewMgr.payView.getListCtm(ViewTransConfirmGas.list) + '</span>'
                    + '</div>'
                    + '<div class="pc_cnts ' + Main.viewMgr.payView.getListCntsClass(ViewTransConfirmGas.list) + ' ">'
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
                    console.log("[BlaCat]", '[ViewTransConfirmGas]', 'PayTransfer交易取消..')
                    if (ViewTransConfirmGas.callback_cancel) {
                        ViewTransConfirmGas.callback_cancel(ViewTransConfirmGas.callback_params)
                        ViewTransConfirmGas.callback_cancel = null;
                    }
                    this.remove()
                }
                this.ObjAppend(this.divConfirmSelect, cancelObj)



                var confirmObj = this.objCreate("button")
                if (ViewTransConfirmGas.list.type == "3") {
                    confirmObj.textContent = Main.langMgr.get("pay_makeRecharge") // "充值"
                }
                else {
                    confirmObj.textContent = Main.langMgr.get("ok") // "确认"
                }
                confirmObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransConfirmGas]', 'PayTransfer交易确认..')
                    ViewTransConfirmGas.callback(ViewTransConfirmGas.callback_params, this.net_fee)
                    ViewTransConfirmGas.callback = null;
                    this.remove(300)
                }
                this.ObjAppend(this.divConfirmSelect, confirmObj)

            }
        }

        toRefer() {
            if (ViewTransConfirmGas.refer) {
                Main.viewMgr.change(ViewTransConfirmGas.refer);
                ViewTransConfirmGas.refer = null;
            }
        }

        private getCnts() {
            return ViewTransConfirmGas.list.cnts != '0' ? ViewTransConfirmGas.list.cnts : ""
        }

        private getWallet() {
            return ViewTransConfirmGas.list.wallet
        }

        private getParams() {
            var html = ""
            var params: any = ViewTransConfirmGas.list.params;
            console.log("[BlaCat]", '[ViewTransConfirmGas]', 'getParams, params => ', params)
            if (params) {
                try {
                    params = JSON.parse(params)
                    if (params.hasOwnProperty("toaddr")) {
                        params = [params]
                    }
                    if (params instanceof Array) {
                        for (let k in params) {
                            html += '<li class="pc_contractAddress">'
                                + '<div><label>' + Main.langMgr.get("pay_transferGas_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                + '<div><label>' + Main.langMgr.get("pay_transferGas_count") + '</label><p>' + params[k].count + '</p></div>'
                                + '</li>';
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[ViewTransConfirmGas]', 'getParams error => ', e.toString())
                }
            }

            return html;
        }
    }
}