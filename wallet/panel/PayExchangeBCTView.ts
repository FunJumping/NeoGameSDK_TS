/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 购买BCT
    export class PayExchangeBCTView extends ViewBase {

        private iframDivElement: HTMLDivElement
        private dev: any;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            //返回
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            //标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("pay_exchange_bct") // "获取BCT"
            this.ObjAppend(header, headerH1)

            this.iframDivElement = this.objCreate("div") as HTMLDivElement

            this.iframDivElement.style.height = "100%"
            this.iframDivElement.style.marginTop = "50px"
            
            this.ObjAppend(this.div, this.iframDivElement)
            
            this.getIframeUrl()
            this.dev = Main.check()

        }

        reset() {
            
        }

        toRefer() {
            if (PayExchangeBCTView.refer) {
                Main.viewMgr.change(PayExchangeBCTView.refer)
                PayExchangeBCTView.refer = null;
            }
        }
       
        private async getIframeUrl() {
            var res = await ApiTool.getBctIframe(Main.user.info.uid, Main.user.info.token);
            var nettype = Main.netMgr.type
            var net = ""
            var dev = ""
            if(nettype == 1){
                net = "&t="+ nettype
            }else if(nettype == 2){
                net = "&t="+ nettype
            }
            if(this.dev == "pc"){
                dev = "&m=p"
            }else if(this.dev == "mobile"){
                dev = "&m=m"
            }
            if (res.r) {
                this.iframDivElement.innerHTML = '<iframe src='+ res.data+net+dev+ ' width="100%" height="100%" scrolling="no"></iframe>'
            }
            else {
                Main.showErrCode(res.errCode);
            }
        }
    }
}