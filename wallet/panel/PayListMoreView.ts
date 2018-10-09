/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 更多交易视图
    export class PayListMoreView extends ViewBase {

        // private lists: Array<walletLists>;
        private page: number;
        private num: number;

        private isLast: boolean;

        private listsDiv: HTMLElement;
        private getMoreDiv: HTMLDivElement;

        constructor() {
            super()

            this.page = 1;
            this.num = Main.viewMgr.payView.listPageNum;
            this.isLast = false;
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_paylist")

            // header 
            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            // 返回按钮
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return")//"返回"
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            // h1标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.platName
            this.ObjAppend(header, headerH1)

            //钱包交易记录
            this.listsDiv = this.objCreate("ul")
            this.ObjAppend(this.div, this.listsDiv)

            this.getMoreDiv = this.objCreate("div") as HTMLDivElement
            this.getMoreDiv.classList.add("pc_listmore")
            this.getMoreDiv.onclick = () => {
                this.doGetWalletLists()
            }
            this.ObjAppend(this.div, this.getMoreDiv)

            this.doGetWalletLists()
        }

        remove() {
            super.remove()
            this.reset();
        }

        toRefer() {
            Main.viewMgr.change("PayView")
        }

        reset() {
            this.page = 1;
            this.isLast = false;
        }

        private async doGetWalletLists() {
            if (this.isLast) {
                return;
            }

            var res = await ApiTool.getWalletListss(Main.user.info.uid, Main.user.info.token, this.page, this.num, Main.netMgr.type);

            if (res.r) {
                if (res.data && res.data.length >= 1) {
                    if (res.data.length < this.num) {
                        this.isLast = true;
                        this.getMoreDiv.textContent = Main.langMgr.get("paylist_noMore") //"没有记录了"
                    }
                    else {
                        this.page += 1;
                        this.getMoreDiv.textContent = Main.langMgr.get("paylist_getMore") //"点击加载更多记录"
                    }

                    // 加载新数据
                    await res.data.forEach(
                        list => {
                            // li
                            var listObj = this.objCreate("li")
                            listObj.onclick = () => {
                                this.hidden()
                                PayListDetailView.refer = "PayListMoreView"
                                PayListDetailView.list = list;
                                Main.viewMgr.change("PayListDetailView")
                            }


                            //判断收入或出，类名写在state_div块里


                            // img
                            var img_div = this.objCreate("div")
                            img_div.classList.add("pc_listimg")
                            var img = this.objCreate("img") as HTMLImageElement
                            img.src = Main.viewMgr.payView.getListImg(list)
                            this.ObjAppend(img_div, img)
                            this.ObjAppend(listObj, img_div)

                            // appname & date
                            var content_div = this.objCreate("div")
                            content_div.classList.add("pc_liftinfo")

                            var content_name_div = this.objCreate("div")
                            content_name_div.classList.add("pc_listname")
                            content_name_div.textContent = Main.viewMgr.payView.getListName(list)
                            this.ObjAppend(content_div, content_name_div)


                            //合约方法
                            var content_ctm_p = this.objCreate("p")
                            content_ctm_p.classList.add("pc_method")
                            content_ctm_p.textContent = Main.viewMgr.payView.getListParamMethods(list)
                            this.ObjAppend(content_div, content_ctm_p)

                            this.ObjAppend(listObj, content_div)

                            // cnts & state
                            var state_cnts_div = this.objCreate("div")
                            state_cnts_div.classList.add("pc_cnts")

                            //时间
                            var content_ctm_span = this.objCreate("div")
                            content_ctm_span.classList.add("pc_listdate")
                            content_ctm_span.textContent = Main.viewMgr.payView.getListCtmMsg(list)
                            this.ObjAppend(state_cnts_div, content_ctm_span)

                            var cnts = Main.viewMgr.payView.getListCnts(list)
                            if (cnts) {
                                this.ObjAppend(state_cnts_div, cnts);

                                var cnts_class = Main.viewMgr.payView.getListCntsClass(list);
                                if (cnts_class) state_cnts_div.classList.add(cnts_class)
                            }

                            var state = Main.viewMgr.payView.getListState(list)
                            if (state) this.ObjAppend(state_cnts_div, state)

                            this.ObjAppend(listObj, state_cnts_div)

                            this.ObjAppend(this.listsDiv, listObj)
                        }
                    );
                }
                else {
                    // 无交易记录
                    this.getMoreDiv.textContent = Main.langMgr.get("paylist_noRecord") //"没有记录信息哦"
                }
            }
            else {
                Main.showErrCode(res.errCode)
            }

        }

    }
}