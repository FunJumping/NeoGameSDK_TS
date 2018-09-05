/// <reference path="../main.ts" />
/// <reference path="./ComponentBase.ts" />

namespace BlackCat {
    export class NetFeeComponent extends ComponentBase {

        private parentDiv: HTMLElement // 父节点

        private mainDiv: HTMLElement   // 主div
        private mainDiv_text: HTMLElement // 手续费文本显示
        private inputFree: HTMLInputElement // 免费
        private inputcharge: HTMLInputElement // 收费

        private net_fee: string; // 网络手续费
        private net_fees: Array<string>; // 网络手续费类型

        private net_fee_show_rate: number; // 手续费显示倍率，一般用在多步骤操作时，默认1

        private callback: Function; // 手续费变化回调

        constructor(parentDiv, callback, net_fees: Array<string> = []) {
            super()
            this.parentDiv = parentDiv
            this.callback = callback

            if (net_fees.length > 0) {
                this.net_fees = net_fees
            }
            else {
                this.net_fees = ["0.0001", "0.0002", "0.0004", "0.0006", "0.0008", "0.001"]
            }

            this.net_fee = "0"
            this.net_fee_show_rate = 1;
        }

        setFeeDefault(net_fee = Main.user.info.service_charge) {
            if (net_fee == "0") {
                this.net_fee = "0"
            }
            else {
                this.net_fee = this.net_fees[0]

                if (net_fee) {
                    for (let i = 0; i < this.net_fees.length; i++) {
                        if (this.net_fees[i] == net_fee) {
                            this.net_fee = net_fee
                            break;
                        }
                    }
                }
            }
        }

        setNetFeeShowRate(rate: number = 1) {
            if (rate != this.net_fee_show_rate) {
                this.net_fee_show_rate = rate
                this.showNetFee()
            }
        }

        createDiv() {
            //交易速度
            this.mainDiv = this.objCreate("div") as HTMLElement;
            this.mainDiv.classList.add("pc_speed")
            this.ObjAppend(this.parentDiv, this.mainDiv)

            // 手续费
            this.mainDiv_text = this.objCreate("div")
            this.ObjAppend(this.mainDiv, this.mainDiv_text)

            // 交易速度选择
            var divSpeedSelect = this.objCreate("div")
            divSpeedSelect.textContent = Main.langMgr.get("pay_transCount_speed") //交易速度
            this.ObjAppend(this.mainDiv, divSpeedSelect)

            // 免费选择
            this.inputFree = this.objCreate("input") as HTMLInputElement
            this.inputFree.classList.add("iconfont", "icon-shandian")
            this.inputFree.type = "radio"
            this.inputFree.onclick = () => {
                this.dofree()
            }
            this.ObjAppend(divSpeedSelect, this.inputFree)

            var divEllipsis = this.objCreate("div")
            divEllipsis.classList.add("pc_ellipsis")
            for (let i = 0; i < this.net_fees.length; i++) {
                divEllipsis.innerHTML += "<label></label>"
            }
            this.ObjAppend(divSpeedSelect, divEllipsis)

            // 收费选择
            this.inputcharge = this.objCreate("input") as HTMLInputElement
            this.inputcharge.type = "range"
            this.inputcharge.value = '0'
            this.inputcharge.max = (this.net_fees.length - 1).toString()
            this.inputcharge.oninput = () => {
                this.dospeed()
            }
            this.inputcharge.onclick = () => {
                this.dospeed()
            }
            this.ObjAppend(divSpeedSelect, this.inputcharge)

            var divSpeedtips = this.objCreate("ul")
            divSpeedtips.innerHTML =
                "<li>"
                + Main.langMgr.get('pay_transCountTips_free') + "</li><li>"
                + Main.langMgr.get('pay_transCountTips_slow') + "</li><li>"
                + Main.langMgr.get('pay_transCountTips_fast')
                + "</li>"
            this.ObjAppend(this.mainDiv, divSpeedtips)

            this.ObjAppend(this.parentDiv, this.mainDiv)

            if (this.net_fee == "0") {
                this.dofree()
            }
            else {
                this.dospeed(this.net_fee)
            }
        }

        hidden() {
            this.mainDiv.style.display = "none"
            this.callback(0)
        }

        show() {
            this.mainDiv.style.display = "block"
            this.callback(this.net_fee)
        }

        private getNetFeesIdx(net_fee) {
            let idx = undefined
            for (let i = 0; i < this.net_fees.length; i++) {
                if (this.net_fees[i] == net_fee) {
                    return i;
                }
            }
            return idx
        }

        private dofree() {

            this.net_fee = "0"

            this.inputFree.checked = true
            this.inputcharge.classList.remove("pc_active")

            this.showNetFee()

            this.callback(this.net_fee)
        }
        private dospeed(net_fee = undefined) {

            if (net_fee != undefined) {
                let idx = this.getNetFeesIdx(net_fee)
                if (idx != undefined) {
                    this.inputcharge.value = idx
                }
            }
            else {
                var idx = parseInt(this.inputcharge.value);
                if (this.net_fees[idx]) {
                    this.net_fee = this.net_fees[idx]
                }
                else {
                    this.net_fee = this.net_fees[0]
                }
            }

            this.inputcharge.classList.add("pc_active")
            this.inputFree.checked = false

            this.showNetFee()

            this.callback(this.net_fee)
        }

        private getNetFeeShow(): string {
            return floatNum.times( Number(this.net_fee), this.net_fee_show_rate).toString()
        }

        private showNetFee() {
            let showNetFee = floatNum.times( Number(this.net_fee), this.net_fee_show_rate).toString()
            this.mainDiv_text.textContent = Main.langMgr.get("pay_transCount_cost") + showNetFee + " (" + Main.langMgr.get("gas") + ")"
        }
    }
}