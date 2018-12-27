/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 购买
    export class PayExchangeView extends ViewBase {

        static type_src: string;

        private exchange_type_buy: HTMLElement
        private exchange_typeObj: HTMLElement
        private exchange_buyObj: HTMLElement

        private exchange_detail: HTMLElement
        private exchange_detail_ul: HTMLElement

        private exchange_info: any // 兑换信息
        private exchange_coin_type: number // 当前兑换币种ID
        private exchange_coin_name: string // 当前兑换币种名称
        private exchange_size: number; // 当前兑换币种精度

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
            headerH1.textContent = Main.langMgr.get("pay_exchange_" + PayExchangeView.type_src) // "购买GAS"
            this.ObjAppend(header, headerH1)



            //交易所显示
            this.exchange_type_buy = this.objCreate("div")
            this.exchange_type_buy.classList.add("pc_exchangetitle")
            this.ObjAppend(this.div, this.exchange_type_buy)

            // 各个交易所详情
            this.exchange_detail = this.objCreate("div")
            this.exchange_detail.classList.add("pc_exchangelist")
            this.ObjAppend(this.div, this.exchange_detail)
            

            // 获取gas/btc行情
            this.getExchangeInfo(0)

        }

        reset() {
            this.exchange_type_buy = null
            this.exchange_typeObj = null
            this.exchange_buyObj = null

            this.exchange_detail = null
            this.exchange_detail_ul = null

            this.exchange_info = null
            this.exchange_coin_type = null
            this.exchange_coin_name = null

            this.exchange_size = 8
        }

        toRefer() {
            if (PayExchangeView.refer) {
                Main.viewMgr.change(PayExchangeView.refer)
                PayExchangeView.refer = null;
            }
        }

        private async getExchangeInfo(src_coin: number) {
            Main.viewMgr.change("ViewLoading")
            try {
                var res = await ApiTool.getExchangeInfo(Main.user.info.uid, Main.user.info.token, src_coin, Main.netMgr.type, PayExchangeView.type_src)
            }
            catch (e) {
                // 获取数据失败
            }
            Main.viewMgr.viewLoading.remove()

            if (res.r) {
                let data = res.data;
                console.log("[BlaCat]", '[PayExchangeView]', 'getExchangeInfo, data =>', data)
                if (data && data.hasOwnProperty("info") && data.hasOwnProperty("coin") && data.hasOwnProperty("jys")) {
                    this.exchange_info = data;
                    this.showExchangeInfo()
                }
            }
            else {
                Main.showErrCode(res.errCode)
            }
        }

        private showExchangeInfo() {

            console.log("[BlaCat]", '[PayExchangeView]', 'showExchangeInfo ...')
            // 当前币种
            this.exchange_coin_type = this.exchange_info.coin[0][0];
            // 兑换币种类显示
            this.showCoinType()
            // 购买栏显示
            this.showBuy()
            // 交易所详情
            this.showDetail()
        }

        private showCoinType() {
            this.exchange_typeObj = this.objCreate("ul") as HTMLUListElement
            this.ObjAppend(this.exchange_type_buy, this.exchange_typeObj)

            this.exchange_info.coin.forEach(
                list => {
                    var coinType_li = this.objCreate("li")
                    coinType_li.textContent = list[1]
                    if (Number(list[0]) == this.exchange_coin_type) {
                        coinType_li.classList.add("pc_active")
                        this.exchange_coin_name = list[1]
                        if (this.exchange_coin_name.toLowerCase() == "bct") {
                            // bct是4位精度
                            this.exchange_size = 4;
                        }
                        else {
                            this.exchange_size = 8;
                        }
                    }
                    coinType_li.onclick = () => {
                        this.exchange_typeObj.getElementsByClassName("pc_active")[0].classList.remove("pc_active")
                        coinType_li.classList.add("pc_active")

                        // 设置币种信息
                        this.setExchangeCoinTypeInfo(Number(list[0]))
                        // 购买栏显示
                        this.showBuy(1)
                        // 交易所详情
                        this.showDetail(1)
                    }
                    this.ObjAppend(this.exchange_typeObj, coinType_li)
                }
            )
        }

        private showBuy(clear: number = 0) {
            if (this.exchange_buyObj && clear == 1) {
                this.objRemove(this.exchange_type_buy, this.exchange_buyObj)
            }
            this.exchange_buyObj = this.objCreate("div")
            this.exchange_buyObj.classList.add("pc_exchangelist")
            this.ObjAppend(this.exchange_type_buy, this.exchange_buyObj)

            // 名称
            var buyObj_name = this.objCreate("div")
            buyObj_name.classList.add("pc_exchangename")
            //名称图标
            var buyObj_name_img = this.objCreate("img") as HTMLImageElement
            buyObj_name_img.src = Main.resHost + "res/img/game0.png"
            this.ObjAppend(buyObj_name, buyObj_name_img)
            //名称内容
            var buyObj_name_content = this.objCreate("label")
            buyObj_name_content.textContent = Main.platName
            this.ObjAppend(buyObj_name, buyObj_name_content)
            //名称类型
            var buyObj_name_type = this.objCreate("p")
            buyObj_name_type.textContent = PayExchangeView.type_src.toUpperCase() + "/" + this.exchange_coin_name
            this.ObjAppend(buyObj_name, buyObj_name_type)
            this.ObjAppend(this.exchange_buyObj, buyObj_name)

            // 最新价
            var buyObj_price = this.objCreate("div")
            buyObj_price.classList.add("pc_exchangeprice")
            //最新价名称
            var buyObj_price_name = this.objCreate("label")
            buyObj_price_name.textContent = Main.langMgr.get("pay_exchange_price") // "最新价"
            this.ObjAppend(buyObj_price, buyObj_price_name)
            //最新价价格
            var buyObj_price_price = this.objCreate("p")

            
            buyObj_price_price.textContent = floatNum.addZero(this.getCurr(this.exchange_size), this.exchange_size)
            
            
            this.ObjAppend(buyObj_price, buyObj_price_price)
            this.ObjAppend(this.exchange_buyObj, buyObj_price)

            // 购买
            var buyObj_buy = this.objCreate("div")
            buyObj_buy.classList.add("pc_exchangerange")
            // 按钮
            var buyObj_buy_btn = this.objCreate("button")
            buyObj_buy_btn.textContent = Main.langMgr.get("pay_exchange_purchase") // "购买"
            buyObj_buy_btn.onclick = async () => {
                var coin = this.exchange_coin_name.toLowerCase()
                switch (coin) {
                    case "cneo":
                    case "bct":
                        var res: any = {}
                        res['data'] = {
                            address: Main.user.info.wallet,
                            balance: Main.viewMgr.payView[coin],
                            type: "",
                            type_src: coin,
                            uid: Main.user.info.uid,
                        }
                        break;
                    default:
                        Main.viewMgr.change("ViewLoading")
                        // 获取交易钱包地址
                        try {
                            var res = await ApiTool.getOtherAddress(Main.user.info.uid, Main.user.info.token, this.exchange_coin_name.toLowerCase(), Main.netMgr.type)
                        }
                        catch(e) {
        
                        }
                        Main.viewMgr.viewLoading.remove()
        
                        if (!res || !res.r) {
                            // 获取失败
                            Main.showErrMsg("pay_exchange_create_wallet_fail")
                            return
                        }
                        break;
                }
                

                this.hidden()
                PayExchangeDetailView.callback_params = {
                    type: PayExchangeView.type_src.toUpperCase(),
                    type_id: this.exchange_coin_type,
                    type_src: this.exchange_coin_name,
                    price: buyObj_price_price.textContent,
                    data: res.data,
                }
                PayExchangeDetailView.refer = "PayExchangeView"
                Main.viewMgr.change("PayExchangeDetailView")
            }
            this.ObjAppend(buyObj_buy, buyObj_buy_btn)
            this.ObjAppend(this.exchange_buyObj, buyObj_buy)
        }

        private showDetail(clear: number = 0) {
            if (this.exchange_detail_ul && clear == 1) {
                this.objRemove(this.exchange_detail, this.exchange_detail_ul)
            }

            this.exchange_detail_ul = this.objCreate("ul")
            this.ObjAppend(this.exchange_detail, this.exchange_detail_ul)

            this.exchange_info.info.forEach(
                list => {
                    if (list.type == this.exchange_coin_type) {
                        // 交易所行情列表
                        var detail_li = this.objCreate("li")
                        this.ObjAppend(this.exchange_detail_ul, detail_li)

                        // 名称
                        var li_name = this.objCreate("div")
                        li_name.classList.add("pc_exchangename")
                        // 名称图标
                        var li_name_img = this.objCreate("img") as HTMLImageElement
                        li_name_img.src = this.getMarketLiImg(list)
                        this.ObjAppend(li_name, li_name_img)
                        // 名称内容
                        var li_name_content = this.objCreate("label")
                        li_name_content.textContent = this.exchange_info["jys"][list.jys]
                        this.ObjAppend(li_name, li_name_content)
                        // 名称类型
                        var li_name_coin = this.objCreate("p")
                        li_name_coin.textContent = PayExchangeView.type_src.toUpperCase() + "/" + this.exchange_coin_name
                        this.ObjAppend(li_name, li_name_coin)
                        this.ObjAppend(detail_li, li_name)


                        // 最新价
                        var li_price = this.objCreate("div")
                        li_price.classList.add("pc_exchangeprice")
                        // 最新价名称
                        var li_price_name = this.objCreate("label")
                        li_price_name.textContent = Main.langMgr.get("pay_exchange_price") // "最新价"
                        this.ObjAppend(li_price, li_price_name)
                        // 最新价价格
                        var li_price_price = this.objCreate("p")


                        li_price_price.textContent = floatNum.addZero(floatNum.round(Number(list["curr"]), this.exchange_size), this.exchange_size)
                        this.ObjAppend(li_price, li_price_price)
                        this.ObjAppend(detail_li, li_price)


                        // 幅度
                        var li_range = this.objCreate("div")
                        li_range.classList.add("pc_exchangerange")
                        // 幅度名称
                        var li_range_name = this.objCreate("label")
                        li_range_name.textContent = Main.langMgr.get("pay_exchange_range") // "24H涨跌"
                        this.ObjAppend(li_range, li_range_name)

                        // 幅度值
                        var li_range_value = this.objCreate("p")
                        li_range_value.textContent = floatNum.addZero(floatNum.round(floatNum.times(Number(list["last24"]), 100), 2), 2).toString() + "%"
                        this.ObjAppend(li_range, li_range_value)
                        this.ObjAppend(detail_li, li_range)
                    }
                }
            )
        }

        private setExchangeCoinTypeInfo(type: number) {
            this.exchange_coin_type = type
            for (let i = 0; i < this.exchange_info.coin.length; i++) {
                if (Number(this.exchange_info.coin[i][0]) == type) {
                    this.exchange_coin_name = this.exchange_info.coin[i][1]
                    if (this.exchange_coin_name.toLowerCase() == "bct") {
                        // bct是4位精度
                        this.exchange_size = 4;
                    }
                    else {
                        this.exchange_size = 8;
                    }
                    break;
                }
            }
        }

        private getMarketLiImg(list) {
            if (this.exchange_info.hasOwnProperty("jys_icon")) {
                if (this.exchange_info["jys_icon"].hasOwnProperty(list.jys)) {
                    return this.exchange_info["jys_icon"][list.jys]
                }
            }
            return Main.resHost + "res/img/jys_" + list.jys + ".png"
        }

        private getCurr(size: number = 8) {
            let count = 0
            let curr = 0
            for (let i = 0; i < this.exchange_info.info.length; i++) {
                let data = this.exchange_info.info[i]
                if (data.type == this.exchange_coin_type) {
                    count += 1;
                    curr += Number(data.curr)
                }
            }
            return count == 0 ? 0 : floatNum.round(curr / count, size);
        }
    }
}