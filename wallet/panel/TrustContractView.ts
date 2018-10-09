/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 更多交易视图
    export class TrustContractView extends ViewBase {

        // private lists: Array<walletLists>;
        private offset: number;
        // private page: number;
        private num: number;

        private isLast: boolean;

        private listsDiv: HTMLElement;
        private getMoreDiv: HTMLDivElement;

        constructor() {
            super()

            this.num = Main.viewMgr.payView.listPageNum;
            this.reset()

        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_paylist", "pc_trustcontract")

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
                Main.viewMgr.securityCenterView.show()
            }
            this.ObjAppend(header, returnA)

            // h1标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("trust_title") // "信任合约"
            this.ObjAppend(header, headerH1)

            //钱包交易记录
            this.listsDiv = this.objCreate("ul")
            this.ObjAppend(this.div, this.listsDiv)

            this.getMoreDiv = this.objCreate("div") as HTMLDivElement
            this.getMoreDiv.classList.add("pc_listmore")
            this.getMoreDiv.onclick = () => {
                this.doGetTrustLists()
            }
            this.ObjAppend(this.div, this.getMoreDiv)

            this.doGetTrustLists()
        }

        remove() {
            super.remove()
            this.reset();
        }

        // toRefer() {
        //     Main.viewMgr.change("PayView")
        // }

        reset() {
            // this.page = 1;
            this.offset = 0;
            this.isLast = false;
        }

        private async doGetTrustLists() {
            if (this.isLast) {
                return;
            }

            var res = await ApiTool.getTrustLists(Main.user.info.uid, Main.user.info.token, this.offset, this.num);

            if (res.r) {
                if (res.data && res.data.length >= 1) {
                    if (res.data.length < this.num) {
                        this.isLast = true;
                        this.getMoreDiv.textContent = Main.langMgr.get("paylist_noMore") //"没有记录了"
                    }
                    else {
                        this.offset += this.num;
                        // this.page += 1;
                        this.getMoreDiv.textContent = Main.langMgr.get("paylist_getMore") //"点击加载更多记录"
                    }

                    // 加载新数据
                    await res.data.forEach(
                        list => {
                            // li
                            var listObj = this.objCreate("li")
                            //判断收入或出，类名写在state_div块里


                            // img
                            var img_div = this.objCreate("div")
                            img_div.classList.add("pc_listimg")
                            var img = this.objCreate("img") as HTMLImageElement
                            img.src = this.getListImg(list)
                            this.ObjAppend(img_div, img)
                            this.ObjAppend(listObj, img_div)

                            // appname & date
                            var content_div = this.objCreate("div")
                            content_div.classList.add("pc_liftinfo")

                            var content_name_div = this.objCreate("div")
                            content_name_div.classList.add("pc_listname")
                            content_name_div.textContent = Main.viewMgr.payView.getListName(list)
                            this.ObjAppend(content_div, content_name_div)


                            //合约地址
                            var content_ctm_p = this.objCreate("p")
                            content_ctm_p.classList.add("pc_method")
                            content_ctm_p.textContent = this.getListNnc(list)
                            this.ObjAppend(content_div, content_ctm_p)

                            this.ObjAppend(listObj, content_div)

                            // 信任合约按钮切换
                            var trustObj = this.objCreate("a")
                            trustObj.onclick = () => {
                                // 删除信任合约
                                listObj.remove()
                                this.doDelList(list)
                            }
                            trustObj.classList.add("pc_switch", "pc_switch_active")

                            var spanSwitchBut = this.objCreate("span")
                            this.ObjAppend(trustObj, spanSwitchBut)

                            this.ObjAppend(listObj, trustObj)

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

        private getListImg(v) {
            return v.icon;
        }

        private getListNnc(v) {
            return v.nnc;
        }

        private async doDelList(v) {
            var res = await ApiTool.delTrustNncs(Main.user.info.uid, Main.user.info.token, v.id);
            if (res.r) {
                // TODO: 清理
                Main.removeTrustNnc(v.nnc)
                this.offset -= 1
                Main.showToast("trust_relieve_succ")
            }
            else {
                Main.showErrCode(res.errCode)
            }
        }
    }
}