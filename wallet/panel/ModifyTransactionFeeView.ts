/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 网络线路
    export class ModifyTransactionFeeView extends ViewBase {

        private netFeeCom: NetFeeComponent; // 手续费组件

        private net_fee: string // 网络交易费

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_moifynet")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            // 返回
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            // 标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("modifyFee") // "地区"
            this.ObjAppend(header, headerH1)

            var divFee = this.objCreate("div")
            divFee.classList.add("pc_modifyfee")
            this.ObjAppend(this.div, divFee)

            this.netFeeCom = new NetFeeComponent(divFee, (net_fee) => {
                // this.netFeeChange(net_fee)
                this.net_fee = net_fee
                this.setSpeed()
            })
            this.netFeeCom.setFeeDefault()
            this.netFeeCom.createDiv()

        }

        toRefer() {
            if (ModifyTransactionFeeView.refer) {
                Main.viewMgr.change(ModifyTransactionFeeView.refer)
                ModifyTransactionFeeView.refer = null;
            }
        }
        private async setSpeed() {
            var res = await ApiTool.modUserFee(Main.user.info.uid, Main.user.info.token, this.net_fee)
            if (res.r) {
                // 修改用户信息
                Main.user.setInfo('service_charge', this.net_fee)
                Main.viewMgr.myInfoView.modifyFee()
            }
            else {
                Main.showErrCode(res.errCode)
            }
        }


    }
}