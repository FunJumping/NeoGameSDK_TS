/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易确认视图
    export class ViewTransConfirm extends ViewBase {

        static list: walletLists;

        // static params: any;

        constructor() {
            super()

            if (!ViewTransConfirm.list) {
                ViewTransConfirm.list = new walletLists();
            }
        }

        start() {
            if (this.isCreated) {
                // 每次清理上一次的，显示最新的
                this.remove()
            }
            super.start()

            var documenth = this.div.clientHeight
            if (documenth < 667) {
                document.getElementById("pc_tradeconfirmbut").style.top = "auto";
                document.getElementById("pc_tradeconfirmbut").style.bottom = "0";
            }
        }

        create() {

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_listdetail", "pc_tradeconfirm")

            if (ViewTransConfirm.list && ViewTransConfirm.list.hasOwnProperty("wallet")) {
                // header // header标签创建比较麻烦
                var headerObj = this.objCreate("div")
                headerObj.classList.add("pc_header")
                // 返回按钮
                var returnBtn = this.objCreate("a")
                returnBtn.classList.add("iconfont", "icon-fanhui")
                returnBtn.textContent = Main.langMgr.get("return") // "返回"
                returnBtn.onclick = () => {
                    this.return()
                    if (ViewTransConfirm.callback_cancel) {
                        ViewTransConfirm.callback_cancel()
                        ViewTransConfirm.callback_cancel = null;
                    }
                }
                this.ObjAppend(headerObj, returnBtn)
                // h1标题
                var h1Obj = this.objCreate("h1")
                h1Obj.textContent = Main.platName
                this.ObjAppend(headerObj, h1Obj)
                this.ObjAppend(this.div, headerObj)

                var contentObj = this.objCreate("div")
                contentObj.classList.add("pc_detail")
                contentObj.style.paddingBottom = "90px"
                contentObj.innerHTML
                    = '<ul>'
                    + '<li>'
                    + '<div class="pc_listimg">'
                    + '<img src="' + Main.viewMgr.payView.getListImg(ViewTransConfirm.list) + '">'
                    + '</div>'
                    + '<div class="pc_liftinfo">'
                    + '<div class="pc_listname">' + Main.viewMgr.payView.getListName(ViewTransConfirm.list) + '</div>'
                    + '<span class="pc_listdate">' + Main.viewMgr.payView.getListCtm(ViewTransConfirm.list) + '</span>'
                    + '</div>'
                    + '<div class="pc_cnts ' + Main.viewMgr.payView.getListCntsClass(ViewTransConfirm.list) + ' ">'
                    + this.getCnts()
                    // +          this.getStats()
                    + '</div>'
                    + '</li>'
                    // +      '<li><label>交易单号：</label><p>' + this.getTxid() + '</p></li>'
                    + '<li><label>' + Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                    + this.getParams()
                    + '</ul>'
                this.ObjAppend(this.div, contentObj)

                //var 
                var divconfirm = this.objCreate("div")
                divconfirm.classList.add("pc_tradeconfirmbut")
                divconfirm.id= "pc_tradeconfirmbut"
                this.ObjAppend(this.div, divconfirm)



                var cancelObj = this.objCreate("button")
                cancelObj.classList.add("pc_cancel")
                cancelObj.textContent = Main.langMgr.get("cancel") // "取消"
                cancelObj.onclick = () => {
                    console.log('[Bla Cat]', '[ViewTransConfirm]', 'PayTransfer交易取消..')
                    if (ViewTransConfirm.callback_cancel) {
                        ViewTransConfirm.callback_cancel(ViewTransConfirm.callback_params)
                        ViewTransConfirm.callback_cancel = null;
                    }
                    this.remove()
                }
                this.ObjAppend(divconfirm, cancelObj)

                var confirmObj = this.objCreate("button")
                if (ViewTransConfirm.list.type == "3") {
                    confirmObj.textContent = Main.langMgr.get("pay_makeRecharge") // "充值"
                }
                else {
                    confirmObj.textContent = Main.langMgr.get("ok") // "确认"
                }
                confirmObj.onclick = () => {
                    console.log('[Bla Cat]', '[ViewTransConfirm]', 'PayTransfer交易确认..')
                    ViewTransConfirm.callback(ViewTransConfirm.callback_params)
                    ViewTransConfirm.callback = null;
                    this.remove()
                }
                this.ObjAppend(divconfirm, confirmObj)



            }
        }

        toRefer() {
            if (ViewTransConfirm.refer) {
                Main.viewMgr.change(ViewTransConfirm.refer);
                ViewTransConfirm.refer = null;
            }
        }


        // private getCntsClass()
        // {
        //     if ( ViewTransConfirm.list.type == "1" || (ViewTransConfirm.list.type == "5" && ViewTransConfirm.list.type_detail == "2") ) {
        //         return 'pc_income';
        //     }
        //     else if (ViewTransConfirm.list.cnts > '0') {
        //         return 'pc_expenditure';
        //     }
        //     return "";
        // }

        // private getImg()
        // {
        //     if (ViewTransConfirm.list.g_id == "0") {
        //         return "res/game" + ViewTransConfirm.list.g_id + ".png";
        //     }
        //     return ViewTransConfirm.list.icon;
        // }

        // private getName()
        // {
        //     if (ViewTransConfirm.list.g_id == "0") {
        //         return Main.platName;
        //     }
        //     return ViewTransConfirm.list.name;
        // }

        // private getDate()
        // {
        //     return Main.getDate(ViewTransConfirm.list.ctm)
        // }

        private getCnts() {
            return ViewTransConfirm.list.cnts != '0' ? ViewTransConfirm.list.cnts : ""
        }

        // private getStats()
        // {
        //     switch (ViewTransConfirm.list.state)
        //     {
        //         case '0':
        //             return '<button>验证中</button>'
        //         case '1':
        //             return '<a class="iconfont icon-gou"></a>'
        //         case '2':
        //             return '<a class="iconfont icon-chacha"></a>'
        //     }
        //     return "";
        // }

        // private getTxid()
        // {
        //     return ViewTransConfirm.list.txid
        // }

        private getWallet() {
            return ViewTransConfirm.list.wallet
        }

        private getParams() {
            var html = ""
            var params: any = ViewTransConfirm.list.params;
            console.log('[Bla Cat]', '[ViewTransConfirm]', 'getParams, params => ', params)
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
                } catch (e) { }
            }

            return html;
        }

    }
}