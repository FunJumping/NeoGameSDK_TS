/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易数量视图
    export class ViewTransferCount extends ViewBase {

        static coinType: string = "CGAS" // 币种类型（CGAS/CNEO)
        static transType: string = "";   // 兑换类型: mint(utxo->nep5），refund（nep5->utxo)，空表示需要选择
        static transNncOld: string = ""; // 旧代币合约地址

        private selectTransfertype: HTMLSelectElement;
        private divtransfername: HTMLDivElement;


        private labeltransfername1: HTMLLabelElement;
        private labeltransfername2: HTMLLabelElement;

        private divHaveAmounts: HTMLDivElement;         // 余额信息
        private divHaveUtxoAmounts: HTMLDivElement;     // GAS/NEO余额
        private spanHaveUtxoAmounts: HTMLSpanElement;   // GAS/NEO变化
        private divHaveNep5Amounts: HTMLDivElement;     // CGAS/CNEO余额
        private spanHaveNep5Amounts: HTMLSpanElement;   // CGAS/CNEO变化

        private netFeeCom: NetFeeComponent; // 手续费组件

        private coinTypeLang; // 交易币种语言
        private coinBalanceLang; // 余额币种语言
        private coinBalance;    // 余额信息

        inputCount: HTMLInputElement
        net_fee: string // 网络交易费

        start() {
            super.start()

            // 就cgas、cneo退款
            if (ViewTransferCount.transNncOld != "") {
                this.inputCount.focus()
            }
        }

        create() {

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_popup")
            //弹窗的框
            var popupbox = this.objCreate('div')
            popupbox.classList.add("pc_popupbox")
            this.ObjAppend(this.div, popupbox)

            // 弹窗的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_popup_title")
            popupTitle.innerText = Main.langMgr.get("pay_transCount_count") // "兑换"
            this.ObjAppend(popupbox, popupTitle)

            // 类型
            var divtransfertype = this.objCreate("div")
            divtransfertype.classList.add("pc_transfertype", "pc_token")
            this.ObjAppend(popupbox, divtransfertype)

            if (ViewTransferCount.transNncOld != "") {
                // 获取交易币种语言信息
                this.getCoinTypeLang()

                // old退款，只支持refund，不让选择转换方向
                this.divtransfername = this.objCreate("div") as HTMLDivElement
                this.ObjAppend(divtransfertype, this.divtransfername)

                // 源代币名(CNEO/CGAS)
                this.labeltransfername1 = this.objCreate("label") as HTMLLabelElement
                this.labeltransfername1.textContent = this.coinTypeLang.src
                this.ObjAppend(this.divtransfername, this.labeltransfername1)

                //转换标签
                var itransfertype = this.objCreate("i")
                itransfertype.classList.add("iconfont", "icon-bc-jiantou1")
                this.ObjAppend(this.divtransfername, itransfertype)

                // 目标代币名
                this.labeltransfername2 = this.objCreate("label") as HTMLLabelElement
                this.labeltransfername2.textContent = this.coinTypeLang.tat
                this.ObjAppend(this.divtransfername, this.labeltransfername2)
            } else {
                // 选择交易类型
                this.selectTransfertype = this.objCreate("select") as HTMLSelectElement
                this.selectTransfertype.classList.add("iconfont")
                this.selectTransfertype.onchange = () => {
                    this.dotransfertype()
                }
                this.ObjAppend(divtransfertype, this.selectTransfertype)

                // 选择类型提示
                var optionTips = this.objCreate("option") as HTMLOptionElement
                optionTips.innerHTML = Main.langMgr.get("pay_transCount_tips") // "选择您要兑换的代币"
                optionTips.selected = true
                optionTips.disabled = true
                optionTips.style.display = "none"
                this.ObjAppend(this.selectTransfertype, optionTips)

                this.getSelectOptions()
            }
            // 输入数量框
            this.inputCount = this.objCreate("input") as HTMLInputElement
            this.inputCount.type = "text"
            this.inputCount.style.margin = "0 auto 10px"
            this.inputCount.style.width = "80%"
            this.inputCount.placeholder = Main.langMgr.get("pay_transCount_inputCount") // "请输入数量"
            this.inputCount.onkeyup = () => {
                this.doinputchange()
            }
            this.ObjAppend(popupbox, this.inputCount)

            // 拥有GAS和CGAS数量
            this.divHaveAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveAmounts.classList.add("pc_haveamounts")
            this.ObjAppend(popupbox, this.divHaveAmounts)


            // 拥有CGAS、CNEO等nep5资产余额
            this.getCoinBalanceLang()
            this.getCoinBalance()

            // 拥有NEP5
            this.divHaveNep5Amounts = this.objCreate("div") as HTMLDivElement
            this.divHaveNep5Amounts.textContent = this.coinBalanceLang.tat + ": " + Main.getStringNumber(this.coinBalance.tat)
            this.ObjAppend(this.divHaveAmounts, this.divHaveNep5Amounts)
            // Nep5交易数量
            this.spanHaveNep5Amounts = this.objCreate("span")
            this.ObjAppend(this.divHaveNep5Amounts, this.spanHaveNep5Amounts)

            // 拥有UTXO
            this.divHaveUtxoAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveUtxoAmounts.textContent = this.coinBalanceLang.src + ": " + Main.getStringNumber(this.coinBalance.src)
            this.ObjAppend(this.divHaveAmounts, this.divHaveUtxoAmounts)
            // Utxo交易数量
            this.spanHaveUtxoAmounts = this.objCreate("span")
            this.ObjAppend(this.divHaveUtxoAmounts, this.spanHaveUtxoAmounts)

            // 手续费组件
            this.netFeeCom = new NetFeeComponent(popupbox, (net_fee) => {
                this.netFeeChange(net_fee)
            })
            this.netFeeCom.setFeeDefault()
            this.netFeeCom.createDiv()


            // 弹窗按钮外框
            var popupbutbox = this.objCreate('div')
            popupbutbox.classList.add("pc_popupbutbox")
            this.ObjAppend(popupbox, popupbutbox)

            // 取消
            var popupClose = this.objCreate('button')
            popupClose.classList.add("pc_cancel")
            popupClose.textContent = Main.langMgr.get("cancel") // "取消"
            popupClose.onclick = () => {
                this.remove(300)
            }
            this.ObjAppend(popupbutbox, popupClose)

            var confirmObj = this.objCreate("button")
            confirmObj.textContent = Main.langMgr.get("ok") // "确认"
            confirmObj.onclick = () => {
                this.doConfirm()
            }
            this.ObjAppend(popupbutbox, confirmObj)

            // 配置手续费组件
            this.configNetFee()
        }

        toRefer() {
            if (ViewTransferCount.refer) {
                Main.viewMgr.change(ViewTransferCount.refer);
                ViewTransferCount.refer = null;
            }
        }

        key_esc() {

        }


        private doinputchange() {
            // neo只支持整数
            if (ViewTransferCount.coinType == "CNEO") {
                var neo_int = parseInt(this.inputCount.value)
                if (neo_int > 0) {
                    this.inputCount.value = parseInt(this.inputCount.value).toString()
                }
                else {
                    this.inputCount.value = ""
                }
            }

            if (!Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                this.divHaveUtxoAmounts.classList.remove("pc_income", "pc_expenditure")
                this.divHaveNep5Amounts.classList.remove("pc_income", "pc_expenditure")
                this.spanHaveNep5Amounts.textContent = ""
                this.spanHaveUtxoAmounts.textContent = ""
                return
            }

            // 检查余额
            if (this.checkBalance()) {

                switch (ViewTransferCount.transType) {
                    case "mint":
                        // 交易加减class
                        this.divHaveUtxoAmounts.classList.add("pc_expenditure")
                        this.divHaveNep5Amounts.classList.add("pc_income")
                        // 交易数量utxo赋值
                        switch (ViewTransferCount.coinType) {
                            case "CGAS":
                                // CGAS充值，nep5 = 输入值, utxo = 输入值+手续费
                                this.spanHaveUtxoAmounts.textContent = Main.getStringNumber(floatNum.plus(Number(this.inputCount.value), Number(this.net_fee)));
                                break
                            case "CNEO":
                                // CNEO充值，nep5 = 输入值, utxo = 输入值
                                this.spanHaveUtxoAmounts.textContent = this.inputCount.value
                                break
                        }
                        break
                    case "refund":
                        // 交易加减class
                        this.divHaveUtxoAmounts.classList.add("pc_income")
                        this.divHaveNep5Amounts.classList.add("pc_expenditure")
                        // 交易数量utxo赋值
                        switch (ViewTransferCount.coinType) {
                            case "CGAS":
                                // CGAS退款，nep5 = 输入值， utxo = 输入值 - 手续费 * 2
                                this.spanHaveUtxoAmounts.textContent = Main.getStringNumber(floatNum.minus(Number(this.inputCount.value), Number(this.net_fee) * 2));
                                break
                            case "CNEO":
                                // CNEO退款，nep5 = 输入值， utxo = 输入值
                                this.spanHaveUtxoAmounts.textContent = this.inputCount.value
                                break
                        }
                        break
                }
                // 不管退款还是充值，nep5 = 交易数量输入值
                this.spanHaveNep5Amounts.textContent = this.inputCount.value;
            }
        }


        private doConfirm() {
            if (!this.inputCount.value) {
                this.inputCount.focus()
                return
            }

            if (!Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                Main.showErrMsg('pay_transCount_err', () => {
                    this.inputCount.focus()
                })
                return
            }

            // select类型检查
            if (ViewTransferCount.transNncOld != "" && ViewTransferCount.transType != "refund") {
                Main.showErrMsg('pay_transCount_tips_err', () => {
                    this.inputCount.focus()
                })
                return
            }

            // 余额判断
            if (this.checkBalance()) {
                this.remove(300)

                ViewTransferCount.callback();
                ViewTransferCount.callback = null;
            }
        }

        private netFeeChange(net_fee) {

            this.net_fee = net_fee

            var v = this.inputCount.value;
            // 没有输入值，返回
            if (v.length == 0 || v.replace(/(^s*)|(s*$)/g, "").length == 0) {
                return
            }
            if (ViewTransferCount.coinType == "CGAS") {
                // 修改GAS值
                if (ViewTransferCount.transType == "refund") {
                    // 退回GAS，需要减去手续费到GAS
                    if (Number(v) - Number(this.net_fee) * 2 <= 0) {
                        // 如果有手续费，并且手续费大于兑换金额，提示错误
                        Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                            this.inputCount.focus()

                            this.divHaveUtxoAmounts.classList.remove("pc_income")
                            this.divHaveNep5Amounts.classList.remove("pc_expenditure")

                            this.spanHaveNep5Amounts.textContent = ""
                            this.spanHaveUtxoAmounts.textContent = ""
                        })
                        return
                    }

                    this.divHaveUtxoAmounts.classList.add("pc_income")
                    this.divHaveNep5Amounts.classList.add("pc_expenditure")
                    this.spanHaveNep5Amounts.textContent = this.inputCount.value;
                    this.spanHaveUtxoAmounts.textContent = Main.getStringNumber(floatNum.minus(Number(this.inputCount.value), Number(this.net_fee) * 2));
                }
                else {
                    // 兑换CGAS，需要加上手续费到GAS
                    this.spanHaveUtxoAmounts.textContent = Main.getStringNumber(floatNum.plus(Number(v), Number(this.net_fee)));
                }
            }
            else {
                // CNEO
                if (ViewTransferCount.transType == "refund") {
                    // NEO加上
                    this.divHaveUtxoAmounts.classList.add("pc_income")
                    // CNEO减
                    this.divHaveNep5Amounts.classList.add("pc_expenditure")
                }
                else {
                    // NEO减少
                    this.divHaveUtxoAmounts.classList.add("pc_expenditure")
                    // CNEO加
                    this.divHaveNep5Amounts.classList.add("pc_income")
                }

                this.spanHaveUtxoAmounts.textContent = this.inputCount.value;
                this.spanHaveNep5Amounts.textContent = this.inputCount.value;
            }
        }

        updateBalance() {
            this.getCoinBalance()
            this.divHaveNep5Amounts.textContent = this.coinBalanceLang.tat + Main.getStringNumber(this.coinBalance.tat)
            this.divHaveUtxoAmounts.textContent = this.coinBalanceLang.src + Main.getStringNumber(this.coinBalance.src)
        }

        // 获取交易类型
        private getSelectOptions() {
            var options = []
            switch (ViewTransferCount.coinType) {
                case "CGAS":
                    options = [
                        ["mint", "gas", "cgas"],
                        ["refund", "cgas", "gas"]
                    ]
                    break
                case "CNEO":
                    options = [
                        ["mint", "neo", "cneo"],
                        ["refund", "cneo", "neo"]
                    ]
                    break
            }

            for (let i = 0; i < options.length; i++) {
                var option_ele = this.objCreate("option") as HTMLOptionElement
                option_ele.value = options[i][0]
                option_ele.innerHTML = Main.langMgr.get(options[i][1]) + " &#8594; " + Main.langMgr.get(options[i][2])
                this.ObjAppend(this.selectTransfertype, option_ele)
            }
        }

        private getCoinBalance() {
            this.coinBalance = {
                src: 0,
                tat: 0,
            }
            switch (ViewTransferCount.coinType) {
                case "CGAS":
                    this.coinBalance.src = Main.viewMgr.payView.gas

                    break
                case "CNEO":
                    this.coinBalance.src = Main.viewMgr.payView.neo
                    break
            }

            var coinType_lowcase = ViewTransferCount.coinType.toLowerCase()
            if (ViewTransferCount.transNncOld == "") {
                this.coinBalance.tat = Main.viewMgr.payView[coinType_lowcase]
            }
            else {
                this.coinBalance.tat = Main.viewMgr.payView[coinType_lowcase + "_old" + ViewTransferCount.transNncOld]
            }
        }

        private getCoinBalanceLang() {
            this.coinBalanceLang = {
                src: "",
                tat: "",
            }
            switch (ViewTransferCount.coinType) {
                case "CGAS":
                    this.coinBalanceLang.src = Main.langMgr.get("gas")
                    this.coinBalanceLang.tat = Main.langMgr.get("cgas")
                    break
                case "CNEO":
                    this.coinBalanceLang.src = Main.langMgr.get("neo")
                    this.coinBalanceLang.tat = Main.langMgr.get("cneo")
                    break
            }

            if (ViewTransferCount.transNncOld != "" && this.coinBalanceLang.tat != "") {
                this.coinBalanceLang.tat += "(old)"
            }
        }

        private getCoinTypeLang() {
            this.coinTypeLang = {
                src: "",
                tat: "",
            }
            switch (ViewTransferCount.transType) {
                case "mint": // 充值
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            this.coinTypeLang.src = Main.langMgr.get("gas")
                            this.coinTypeLang.tat = Main.langMgr.get("cgas")
                            break
                        case "CNEO":
                            this.coinTypeLang.src = Main.langMgr.get("neo")
                            this.coinTypeLang.tat = Main.langMgr.get("cneo")
                            break
                    }
                    break
                case "refund": // 退款
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            this.coinTypeLang.src = Main.langMgr.get("cgas")
                            this.coinTypeLang.tat = Main.langMgr.get("gas")
                            break
                        case "CNEO":
                            this.coinTypeLang.src = Main.langMgr.get("cneo")
                            this.coinTypeLang.tat = Main.langMgr.get("neo")
                            break
                    }
                    break
            }

            if (ViewTransferCount.transNncOld != "" && this.coinTypeLang.src != "") {
                this.coinTypeLang.src += "(old)"
            }
        }

        // 选择交易类型
        private dotransfertype() {
            // 清除上一次数据
            this.divHaveUtxoAmounts.classList.remove("pc_income", "pc_expenditure")
            this.divHaveNep5Amounts.classList.remove("pc_income", "pc_expenditure")

            this.spanHaveNep5Amounts.textContent = ""
            this.spanHaveUtxoAmounts.textContent = ""

            this.inputCount.value = ""
            this.inputCount.focus()

            ViewTransferCount.transType = this.selectTransfertype.value

            // 手续费
            this.configNetFee()
        }

        //配置手续费组件
        private configNetFee() {
            // 是否显示手续费
            var showNetFee = true
            if (ViewTransferCount.transType != "") {
                switch (ViewTransferCount.coinType) {
                    case "CGAS":
                        // 除了之前的cgas合约，后续都支持手续费
                        if (ViewTransferCount.transNncOld && ViewTransferCount.transNncOld == "0x961e628cc93d61bf636dc0443cf0548947a50dbe") {
                            showNetFee = false
                        }
                        break;
                    case "CNEO":
                        // cneo退款不支持手续费，其他都支持
                        if (ViewTransferCount.transType == "refund") {
                            showNetFee = false
                        }
                        break;
                }
            }

            // 如果支持手续费，并且是退款，需要双倍
            if (showNetFee) {
                this.netFeeCom.show()
                if (ViewTransferCount.transType == "refund") {
                    this.netFeeCom.setNetFeeShowRate(2)
                }
                else {
                    this.netFeeCom.setNetFeeShowRate(1)
                }
            }
            else {
                this.netFeeCom.hidden()
            }
        }

        private checkBalance() {
            switch (ViewTransferCount.transType) {
                case "mint":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            if (Main.viewMgr.payView.gas < Number(this.inputCount.value) + Number(this.net_fee)) {
                                Main.showErrMsg('pay_makeMintGasNotEnough', () => {
                                    this.inputCount.focus()
                                })
                                return false
                            }
                            return true
                        case "CNEO":
                            if (Main.viewMgr.payView.gas < Number(this.net_fee)) {
                                Main.showErrMsg('pay_makeMintGasNotEnough', () => {
                                    this.inputCount.focus()
                                })
                                return false
                            }
                            if (Main.viewMgr.payView.neo < Number(this.inputCount.value)) {
                                Main.showErrMsg('pay_makeMintNeoNotEnough', () => {
                                    this.inputCount.focus()
                                })
                                return false
                            }
                            return true
                    }
                    break
                case "refund":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            if (this.coinBalance.tat < Number(this.inputCount.value)) {
                                Main.showErrMsg('pay_makeRefundCgasNotEnough', () => {
                                    this.inputCount.focus()
                                })
                                return false
                            }
                            // 手续费判断
                            if (Number(this.net_fee) > 0) {
                                if (Main.viewMgr.payView.gas < Number(this.net_fee)) {
                                    Main.showErrMsg("pay_makeRefundGasFeeNotEnough", () => {
                                        this.inputCount.focus()
                                    })
                                    return false
                                }

                                if (Number(this.inputCount.value) - Number(this.net_fee) <= 0) {
                                    // 如果有手续费，并且手续费大于兑换金额，提示错误
                                    Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                                        this.inputCount.focus()
                                    })
                                    return false
                                }
                            }
                            return true
                        case "CNEO":
                            if (this.coinBalance.tat < Number(this.inputCount.value)) {
                                Main.showErrMsg('pay_makeRefundCneoNotEnough', () => {
                                    this.inputCount.focus()
                                })
                                return false
                            }
                            // 手续费判断
                            if (Number(this.net_fee) > 0) {
                                // cneo退款暂不支持手续费
                                Main.showErrMsg("pay_makeRefundGasFeeNotEnough", () => {
                                    this.inputCount.focus()
                                })
                                return false

                                // if (Main.viewMgr.payView.gas - Number(this.net_fee) * 2 < 0) {
                                //     Main.showErrMsg("pay_makeRefundGasFeeNotEnough", () => {
                                //         this.inputCount.focus()
                                //     })
                                //     return false
                                // }

                            }
                            return true
                    }
                    break
            }
            return false
        }
    }
}