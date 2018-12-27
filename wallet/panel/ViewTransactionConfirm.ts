/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易确认视图
    export class ViewTransactionConfirm extends ViewBase {

        static list: walletLists;
        static isTrustFeeLess: boolean; // 信任状态下，缺少手续费

        private divConfirmSelect: HTMLElement; // 确认/取消栏div

        private divTrust: HTMLElement
        private trust: string; // 是否信任，"1"表示信任

        private netFeeCom: NetFeeComponent; // 手续费组件

        private net_fee: string // 网络交易费


        constructor() {
            super()

            if (!ViewTransactionConfirm.list) {
                ViewTransactionConfirm.list = new walletLists();
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

            this.trust = "0";

            if (ViewTransactionConfirm.isTrustFeeLess) {
                // 手续费不足，提示
                Main.showErrMsg('pay_makerawtrans_fee_less')
                this.divConfirmSelect.classList.add("pc_tradeconfirmbut_fee")
            }
        }

        create() {

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_listdetail", "pc_tradeconfirm", "pc_trust")

            if (ViewTransactionConfirm.list && ViewTransactionConfirm.list.hasOwnProperty("wallet")) {
                // header标签创建比较麻烦
                var headerTitle = this.objCreate("div")
                headerTitle.classList.add("pc_header")
                // 返回按钮
                var returnBtn = this.objCreate("a")
                returnBtn.classList.add("iconfont", "icon-bc-fanhui")
                returnBtn.textContent = Main.langMgr.get("return") // "返回"
                returnBtn.onclick = () => {
                    this.return()
                    if (ViewTransactionConfirm.callback_cancel) {
                        ViewTransactionConfirm.callback_cancel()
                        ViewTransactionConfirm.callback_cancel = null;
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
                contentObj.style.paddingBottom = "210px"
                // 信任合约，手续费不足，不显示信任合约开关，或者如果是充值到游戏确认，也不显示信任合约开关
                if(ViewTransactionConfirm.isTrustFeeLess || ViewTransactionConfirm.list.type == "3"){
                    contentObj.style.paddingBottom = "160px"
                }
                contentObj.innerHTML
                    = '<ul>'
                    + '<li>'
                    + '<div class="pc_listimg">'
                    + '<img src="' + Main.viewMgr.payView.getListImg(ViewTransactionConfirm.list) + '">'
                    + '</div>'
                    + '<div class="pc_liftinfo">'
                    + '<div class="pc_listname">' + Main.viewMgr.payView.getListName(ViewTransactionConfirm.list) + '</div>'
                    + '<span class="pc_listdate">' + Main.viewMgr.payView.getListCtm(ViewTransactionConfirm.list) + '</span>'
                    + '</div>'
                    + '<div class="pc_cnts ' + Main.viewMgr.payView.getListCntsClass(ViewTransactionConfirm.list) + ' ">'
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

                // 信任合约， 如果是充值到游戏类型，不显示添加信任
                if (ViewTransactionConfirm.isTrustFeeLess !== true && ViewTransactionConfirm.list.type != "3") {
                    this.divTrust = this.objCreate("div")
                    this.divTrust.classList.add("pc_switchbox")
                    this.divTrust.textContent = Main.langMgr.get("pay_trust_tips") //信任合约
                    this.ObjAppend(this.divConfirmSelect, this.divTrust)
    
                    var trustObj = this.objCreate("a")
                    trustObj.classList.add("pc_switch")
                    trustObj.onclick = () => {
                        if (this.trust == "0") {
                            this.trust = "1"
                            trustObj.classList.add("pc_switch_active")
                        }
                        else {
                            this.trust = "0"
                            trustObj.classList.remove("pc_switch_active")
                        }
                    }
                    this.ObjAppend(this.divTrust, trustObj)
    
                    var spanSwitchBut = this.objCreate("span")
    
                    var pTrust = this.objCreate("p")
                    pTrust.textContent = Main.langMgr.get("pay_trust_Vice_tips") //（本合约交易不再弹出此窗口）
                    this.ObjAppend(this.divTrust, pTrust)
    
                    this.ObjAppend(trustObj, spanSwitchBut)
                }
                

                var cancelObj = this.objCreate("button")
                cancelObj.classList.add("pc_cancel")
                cancelObj.textContent = Main.langMgr.get("cancel") // "取消"
                cancelObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '交易取消..')
                    if (ViewTransactionConfirm.callback_cancel) {
                        ViewTransactionConfirm.callback_cancel(ViewTransactionConfirm.callback_params)
                        ViewTransactionConfirm.callback_cancel = null;
                    }
                    this.remove()

                    // 隐藏
                    Main.viewMgr.mainView.hidden()
                    Main.viewMgr.change("IconView")
                }
                this.ObjAppend(this.divConfirmSelect, cancelObj)

                var confirmObj = this.objCreate("button")
                if (ViewTransactionConfirm.list.type == "3") {
                    confirmObj.textContent = Main.langMgr.get("pay_makeRecharge") // "充值"
                }
                else {
                    confirmObj.textContent = Main.langMgr.get("ok") // "确认"
                }
                confirmObj.onclick = () => {

                    if (Number(this.net_fee) > Main.viewMgr.payView.gas) {
                        // 手续费不足
                        Main.showErrMsg('pay_makerawtrans_fee_less')
                        return
                    }

                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '交易确认..')
                    ViewTransactionConfirm.callback(ViewTransactionConfirm.callback_params, this.trust, this.net_fee)
                    ViewTransactionConfirm.callback = null;
                    this.remove(300)

                    // 隐藏
                    Main.viewMgr.mainView.hidden()
                    Main.viewMgr.change("IconView")
                }
                this.ObjAppend(this.divConfirmSelect, confirmObj)

            }
        }

        toRefer() {
            if (ViewTransactionConfirm.refer) {
                Main.viewMgr.change(ViewTransactionConfirm.refer);
                ViewTransactionConfirm.refer = null;
            }
        }

        key_esc() {
            
        }

        private getCnts() {
            return ViewTransactionConfirm.list.cnts != '0' ? ViewTransactionConfirm.list.cnts : ""
        }

        private getWallet() {
            return ViewTransactionConfirm.list.wallet
        }

        private getParams() {
            var html = ""
            var params: any = ViewTransactionConfirm.list.params;
            console.log("[BlaCat]", '[ViewTransactionConfirm]', 'getParams, params => ', params)
            if (params) {
                try {
                    params = JSON.parse(params)
                    if (params.hasOwnProperty("nnc")) {
                        params = [params]
                    }
                    if (params instanceof Array) {
                        for (let k in params) {
                            html += '<li class="pc_contractAddress">'
                                + '<div><label>' + Main.langMgr.get("paylist_nnc") + '</label><p>' + params[k].nnc + '</p></div>'
                                + '<div><label>' + Main.langMgr.get("paylist_sbParamJson") + '</label><p>' + params[k].sbParamJson + '</p></div>'
                                + '<div><label>' + Main.langMgr.get("paylist_sbPushString") + '</label><p>' + params[k].sbPushString + '</p></div>'
                                + '</li>';
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', 'getParams error => ', e.toString())
                }
            }

            return html;
        }
        
    }
}