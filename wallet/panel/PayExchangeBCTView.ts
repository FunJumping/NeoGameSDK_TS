/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // XX币充值
    export class PayExchangeBCTView extends ViewBase {

        private inputamount: HTMLInputElement

        private num = ["10","100","500","1000"]
        private gift = ["赠送10BCT","赠送100BCT","赠送500BCT","赠送100BCT"]


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
            headerH1.textContent = "91币充值" // "购买GAS"
            this.ObjAppend(header, headerH1)

            // 充值91币 赠送BCT  Banner
            var banner = this.objCreate("div")
            banner.classList.add("firstdiv")
            this.ObjAppend(this.div,banner)
            var bannerimg = this.objCreate("img") as HTMLImageElement
            bannerimg.src = "res/img/getbtc.png"
            this.ObjAppend(banner,bannerimg)

            // 充值方式
            var way = this.objCreate("div")
            way.classList.add("mainbox", "waybox")
            this.ObjAppend(this.div,way)
            var way_title = this.objCreate("div")
            way_title.textContent = "充值方式"
            way_title.classList.add("white_title","way_title")
            this.ObjAppend(way,way_title)


            // 充值渠道按钮
            var waybtnbox = this.objCreate("div")
            this.ObjAppend(way,waybtnbox)
            waybtnbox.classList.add("waybtnbox")


            // 支付宝
            var zfb_a = this.objCreate("a")
            zfb_a.classList.add("way_a","active")
            this.ObjAppend(waybtnbox,zfb_a)
            var zfbimg = this.objCreate("img") as HTMLImageElement
            zfbimg.src = "res/img/zfb.png"
            this.ObjAppend(zfb_a,zfbimg)
            var zfb = this.objCreate("span")
            zfb.textContent = "支付宝"
            this.ObjAppend(zfb_a,zfb)
            zfb_a.onclick = () => {
                zfb_a.classList.add("active")
                wx_a.classList.remove("active")
            }


            // 微信
            var wx_a = this.objCreate("a")
            wx_a.classList.add("way_a")
            this.ObjAppend(waybtnbox,wx_a)
            var wximg = this.objCreate("img") as HTMLImageElement
            wximg.src = "res/img/wx.png"
            this.ObjAppend(wx_a,wximg)
            var wx = this.objCreate("span")
            wx.textContent = "微信"
            this.ObjAppend(wx_a,wx)
            wx_a.onclick = () => {
                zfb_a.classList.remove("active")
                wx_a.classList.add("active")
            }


            // 充值金额
            var goods = this.objCreate("ul")
            goods.classList.add("mainbox","goods")
            this.ObjAppend(this.div,goods)
            
            for(var i=0; i<4; i++){  
                var goods_item = this.objCreate("li")
                goods_item.classList.add("goods_item")
                this.ObjAppend(goods,goods_item)

                // 选择gou
                var gou = this.objCreate("span")
                gou.classList.add("iconfont","icon-bc-gou")
                this.ObjAppend(goods_item,gou)

                // 数量
                var item_txt = this.objCreate("div")
                item_txt.classList.add("item_txt")
                this.ObjAppend(goods_item,item_txt)
                var item_num = this.objCreate("span")
                item_num.textContent = this.num[i]
                this.ObjAppend(item_txt,item_num)

                // 91币
                var _91b = this.objCreate("span")
                _91b.textContent = "91币"
                _91b.classList.add ("_91b")
                this.ObjAppend(item_txt,_91b)

                // 赠送10BCT
                var gift = this.objCreate("span")
                gift.textContent = this.gift[i]
                this.ObjAppend(goods_item,gift)
            }

            // 输入金额
            var input_item = this.objCreate("li")
            input_item.classList.add("input_item")
            this.ObjAppend(goods,input_item)
            this.inputamount = this.objCreate("input") as HTMLInputElement
            this.ObjAppend(input_item,this.inputamount)
            this.inputamount.placeholder = "输入金额"

            // 支付
            var pay = this.objCreate("div")
            pay.classList.add("mainbox","goods_pay")
            this.ObjAppend(this.div,pay)

            // 支付金额
            var paymentbox = this.objCreate("div")
            paymentbox.classList.add("payment")
            this.ObjAppend(pay,paymentbox)
            var paymenttxt = this.objCreate("span")
            paymenttxt.classList.add("paymenttxt")
            paymenttxt.textContent = "支付金额："
            this.ObjAppend(paymentbox,paymenttxt)
            var paymentnum = this.objCreate("span")
            paymentnum.classList.add("paymentnum")
            paymentnum.textContent = "5000元"
            this.ObjAppend(paymentbox,paymentnum)

            // 支付按钮
            var paymentbtn = this.objCreate("button")
            paymentbtn.classList.add("paymentbtn")
            paymentbtn.textContent = "支付"
            this.ObjAppend(pay,paymentbtn)

        }

        reset() {
            
        }

        toRefer() {
            if (PayExchangeBCTView.refer) {
                Main.viewMgr.change(PayExchangeBCTView.refer)
                PayExchangeBCTView.refer = null;
            }
        }
       

    }
}