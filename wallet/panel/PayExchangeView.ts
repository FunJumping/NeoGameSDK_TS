/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易所
    export class PayExchangeView extends ViewBase {

        private ulExchange: HTMLUListElement;
        private titlelist = ["NEO", "BTC", "ETH", "USDT"];

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            //返回
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            //标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("pay_exchange_gas") // "购买GAS"
            this.ObjAppend(header, headerH1)

            //交易所类型
            var divExchange = this.objCreate("div")
            divExchange.classList.add("pc_exchangetitle")
            this.ObjAppend(this.div, divExchange)

            this.ulExchange = this.objCreate("ul") as HTMLUListElement
            this.ObjAppend(divExchange, this.ulExchange)

            this.titlelist.forEach(
                data => {
                    var liExchange = this.objCreate("li")
                    if (data == "NEO") {
                        liExchange.classList.add("pc_active")
                    }
                    liExchange.textContent = data
                    liExchange.onclick = () => {
                        this.ulExchange.getElementsByClassName("pc_active")[0].classList.remove("pc_active")
                        liExchange.classList.add("pc_active")
                    }
                    this.ObjAppend(this.ulExchange, liExchange)
                }
            )

            //购买
            var divEcvhangeObj = this.objCreate("div")
            divEcvhangeObj.classList.add("pc_exchangelist")
            this.ObjAppend(divExchange, divEcvhangeObj)
            //名称
            var divExchangeName = this.objCreate("div")
            divExchangeName.classList.add("pc_exchangename")

            //名称图标
            var imgExchangeName = this.objCreate("img") as HTMLImageElement
            imgExchangeName.src = Main.resHost + "res/img/game0.png"
            this.ObjAppend(divExchangeName, imgExchangeName)

            //名称内容
            var labelExchangeName = this.objCreate("label")
            labelExchangeName.textContent = "Bla Cat"
            this.ObjAppend(divExchangeName, labelExchangeName)

            //名称类型
            var pExchangeName = this.objCreate("p")
            pExchangeName.textContent = "GAS/NEO"
            this.ObjAppend(divExchangeName, pExchangeName)

            this.ObjAppend(divEcvhangeObj, divExchangeName)


            //最新价
            var divExchangePrice = this.objCreate("div")
            divExchangePrice.classList.add("pc_exchangeprice")

            //最新价内容
            var labelExchangePrice = this.objCreate("label")
            labelExchangePrice.textContent = Main.langMgr.get("pay_exchange_price") // "最新价"
            this.ObjAppend(divExchangePrice, labelExchangePrice)

            //最新价价格
            var pExchangePrice = this.objCreate("p")
            pExchangePrice.textContent = "111111111111111111"
            this.ObjAppend(divExchangePrice, pExchangePrice)

            this.ObjAppend(divEcvhangeObj, divExchangePrice)

            // 购买按钮
            var divExchangeRange = this.objCreate("div")
            divExchangeRange.classList.add("pc_exchangerange")

            var btnExchange = this.objCreate("button")
            btnExchange.textContent = Main.langMgr.get("pay_exchange_purchase") // "购买"
            btnExchange.onclick = () => {
                this.hidden()
                PayExchangeDetailView.refer = "PayExchangeView"
                Main.viewMgr.change("PayExchangeDetailView")
            }
            this.ObjAppend(divExchangeRange, btnExchange)

            this.ObjAppend(divEcvhangeObj, divExchangeRange)





            //交易所详情
            var divDetail = this.objCreate("div")
            divDetail.classList.add("pc_exchangelist")
            this.ObjAppend(this.div, divDetail)
            var ulDetaile = this.objCreate("ul")
            this.ObjAppend(divDetail, ulDetaile)

            var liDetail = this.objCreate("li")
            this.ObjAppend(ulDetaile, liDetail)

            //名称
            var divDetailName = this.objCreate("div")
            divDetailName.classList.add("pc_exchangename")

            //名称图标
            var imgDetailName = this.objCreate("img") as HTMLImageElement
            imgDetailName.src = Main.resHost + "res/img/game0.png"
            this.ObjAppend(divDetailName, imgDetailName)

            //名称内容
            var labelDetailName = this.objCreate("label")
            labelDetailName.textContent = "Bla Cat"
            this.ObjAppend(divDetailName, labelDetailName)

            //名称类型
            var pDetailName = this.objCreate("p")
            pDetailName.textContent = "GAS/NEO"
            this.ObjAppend(divDetailName, pDetailName)

            this.ObjAppend(liDetail, divDetailName)


            //最新价
            var divDetailPrice = this.objCreate("div")
            divDetailPrice.classList.add("pc_exchangeprice")

            //最新价内容
            var labelDetailPrice = this.objCreate("label")
            labelDetailPrice.textContent = Main.langMgr.get("pay_exchange_price") // "最新价"
            this.ObjAppend(divDetailPrice, labelDetailPrice)

            //最新价价格
            var pDetailPrice = this.objCreate("p")
            pDetailPrice.textContent = "111111111111111111"
            this.ObjAppend(divDetailPrice, pDetailPrice)

            this.ObjAppend(liDetail, divDetailPrice)

            //幅度
            var divDetailRange = this.objCreate("div")
            divDetailRange.classList.add("pc_exchangerange")

            //幅度内容
            var labelDetailRange = this.objCreate("label")
            labelDetailRange.textContent = Main.langMgr.get("pay_exchange_range") // "24H涨跌"
            this.ObjAppend(divDetailRange, labelDetailRange)

            //幅度值
            var pDetailRange = this.objCreate("p")
            pDetailRange.textContent = "100%"
            this.ObjAppend(divDetailRange, pDetailRange)

            this.ObjAppend(liDetail, divDetailRange)
            var liDetail = this.objCreate("li")
            this.ObjAppend(ulDetaile, liDetail)

            //名称
            var divDetailName = this.objCreate("div")
            divDetailName.classList.add("pc_exchangename")

            //名称图标
            var imgDetailName = this.objCreate("img") as HTMLImageElement
            imgDetailName.src = Main.resHost + "res/img/game0.png"
            this.ObjAppend(divDetailName, imgDetailName)

            //名称内容
            var labelDetailName = this.objCreate("label")
            labelDetailName.textContent = "Bla Cat"
            this.ObjAppend(divDetailName, labelDetailName)

            //名称类型
            var pDetailName = this.objCreate("p")
            pDetailName.textContent = "GAS/NEO"
            this.ObjAppend(divDetailName, pDetailName)

            this.ObjAppend(liDetail, divDetailName)


            //最新价
            var divDetailPrice = this.objCreate("div")
            divDetailPrice.classList.add("pc_exchangeprice")

            //最新价内容
            var labelDetailPrice = this.objCreate("label")
            labelDetailPrice.textContent = Main.langMgr.get("pay_exchange_price") // "最新价"
            this.ObjAppend(divDetailPrice, labelDetailPrice)

            //最新价价格
            var pDetailPrice = this.objCreate("p")
            pDetailPrice.textContent = "111111111111111111"
            this.ObjAppend(divDetailPrice, pDetailPrice)

            this.ObjAppend(liDetail, divDetailPrice)

            //幅度
            var divDetailRange = this.objCreate("div")
            divDetailRange.classList.add("pc_exchangerange")

            //幅度内容
            var labelDetailRange = this.objCreate("label")
            labelDetailRange.textContent = Main.langMgr.get("pay_exchange_range") // "24H涨跌"
            this.ObjAppend(divDetailRange, labelDetailRange)

            //幅度值
            var pDetailRange = this.objCreate("p")
            pDetailRange.classList.add("pc_rise")
            pDetailRange.textContent = "100%"
            this.ObjAppend(divDetailRange, pDetailRange)

            this.ObjAppend(liDetail, divDetailRange)
            var liDetail = this.objCreate("li")
            this.ObjAppend(ulDetaile, liDetail)

            //名称
            var divDetailName = this.objCreate("div")
            divDetailName.classList.add("pc_exchangename")

            //名称图标
            var imgDetailName = this.objCreate("img") as HTMLImageElement
            imgDetailName.src = Main.resHost + "res/img/game0.png"
            this.ObjAppend(divDetailName, imgDetailName)

            //名称内容
            var labelDetailName = this.objCreate("label")
            labelDetailName.textContent = "Bla Cat"
            this.ObjAppend(divDetailName, labelDetailName)

            //名称类型
            var pDetailName = this.objCreate("p")
            pDetailName.textContent = "GAS/NEO"
            this.ObjAppend(divDetailName, pDetailName)

            this.ObjAppend(liDetail, divDetailName)


            //最新价
            var divDetailPrice = this.objCreate("div")
            divDetailPrice.classList.add("pc_exchangeprice")

            //最新价内容
            var labelDetailPrice = this.objCreate("label")
            labelDetailPrice.textContent = Main.langMgr.get("pay_exchange_price") // "最新价"
            this.ObjAppend(divDetailPrice, labelDetailPrice)

            //最新价价格
            var pDetailPrice = this.objCreate("p")
            pDetailPrice.textContent = "111111111111111111"
            this.ObjAppend(divDetailPrice, pDetailPrice)

            this.ObjAppend(liDetail, divDetailPrice)

            //幅度
            var divDetailRange = this.objCreate("div")
            divDetailRange.classList.add("pc_exchangerange")

            //幅度内容
            var labelDetailRange = this.objCreate("label")
            labelDetailRange.textContent = Main.langMgr.get("pay_exchange_range") // "24H涨跌"
            this.ObjAppend(divDetailRange, labelDetailRange)

            //幅度值
            var pDetailRange = this.objCreate("p")
            pDetailRange.classList.add("pc_fall")
            pDetailRange.textContent = "100%"
            this.ObjAppend(divDetailRange, pDetailRange)

            this.ObjAppend(liDetail, divDetailRange)


        }

        toRefer() {
            if (PayExchangeView.refer) {
                Main.viewMgr.change(PayExchangeView.refer)
                PayExchangeView.refer = null;
            }
        }

    }
}