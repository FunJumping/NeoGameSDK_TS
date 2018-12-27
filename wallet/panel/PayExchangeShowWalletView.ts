/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 显示钱包二维码（BTC/NEO/ETH）
    export class PayExchangeShowWalletView extends ViewBase {

        static balance: number;

        private balanceElement : HTMLElement
        private s_getWalletLists = {};

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_exchangedetail", "buygas" ,"buycoin")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            //返回
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.doCancel()
            }
            this.ObjAppend(header, returnA)

            //标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("get_pay") + PayExchangeShowWalletView.callback_params.type_src
            this.ObjAppend(header, headerH1)

            //余额
            var divBalance = this.objCreate("div")
            divBalance.classList.add("pc_exchangeprice")

            var labelBalanceName = this.objCreate("label")
            labelBalanceName.textContent = PayExchangeShowWalletView.callback_params.type_src + Main.langMgr.get("pay_exchange_balance") // "余额"
            this.ObjAppend(divBalance, labelBalanceName)

            // 余额
            this.balanceElement = this.objCreate("p")
            this.balanceElement.textContent = PayExchangeShowWalletView.balance.toString()
            this.ObjAppend(divBalance, this.balanceElement)

            var divBalanceObj = this.objCreate("div")
            divBalanceObj.classList.add("pc_exchangelist", "balance","margin_top45")
            this.ObjAppend(this.div, divBalanceObj)

            this.ObjAppend(divBalanceObj, divBalance)

            // 购买流程
            var divDescribeTitle = this.objCreate("div")
            divDescribeTitle.classList.add("pc_addresstitle")
            divDescribeTitle.textContent = Main.langMgr.get("pay_exchange_purchase_process") // "描述"
            this.ObjAppend(this.div, divDescribeTitle)

            var divDescribeText = this.objCreate("div")
            divDescribeText.classList.add("pc_describetext")
            // divDescribeText.textContent = AddressbookDetailsView.contact.address_desc ? AddressbookDetailsView.contact.address_desc : Main.langMgr.get("addressbook_det_empty") // "空"
            this.ObjAppend(this.div, divDescribeText)

            var processp1 = this.objCreate("p")
            var callback_params_typesrc = PayExchangeShowWalletView.callback_params.type_src
            var callback_params_typesrc_a = PayExchangeShowWalletView.callback_params.type_src
            var callback_params_typesrc_b = PayExchangeShowWalletView.callback_params.type_src
            processp1.textContent = Main.langMgr.get("pay_exchange_processp1",{type: callback_params_typesrc,type1: callback_params_typesrc_a,type2: callback_params_typesrc_b }) 
            this.ObjAppend(divDescribeText, processp1)

            
            



            // 通讯录详情内容容器
            var divObj = this.objCreate("div")
            divObj.classList.add("pc_addressbookdet")
            this.ObjAppend(this.div, divObj)

            // 钱包地址标题 容器
            var divAddressTitle = this.objCreate("div")
            divAddressTitle.classList.add("pc_addresstitle")
            this.ObjAppend(divObj, divAddressTitle)

            // 钱包地址标题
            var labelAddressTitle = this.objCreate("label")
            labelAddressTitle.textContent = Main.langMgr.get("addressbook_det_address") // "钱包地址"
            this.ObjAppend(divAddressTitle, labelAddressTitle)



            // 钱包地址 复制按钮
            var butCopy = this.objCreate("button")
            butCopy.textContent = Main.langMgr.get("copy") // "复制"
            butCopy.onclick = () => {
                var inputCooy = this.objCreate("input") as HTMLInputElement
                inputCooy.value = divAddress.innerText
                this.ObjAppend(divObj, inputCooy)

                inputCooy.select();
                document.execCommand("Copy");
                inputCooy.remove()
                Main.showToast("pc_receivables_copy", 1500)

            }
            this.ObjAppend(divAddressTitle, butCopy)

            var divAddress = this.objCreate("p")
            divAddress.classList.add("pc_address")
            divAddress.textContent = PayExchangeShowWalletView.callback_params.data.address
            this.ObjAppend(divObj, divAddress)

            //二维码容器
            var divQRCode = this.objCreate("div")
            divQRCode.classList.add("pc_qrcode")
            this.ObjAppend(divObj, divQRCode)

            // QrCodeWithLogo
            // 二维码显示
            var qrObj = this.objCreate("img") as HTMLImageElement
            QrCodeWithLogo.toImage({
                image: qrObj,
                content: PayExchangeShowWalletView.callback_params.data.address
            }).then(() => {
                var url = URL.createObjectURL(this.base64ToBlob(qrObj.src));
                qr_download.setAttribute('href', url)
                qr_download.setAttribute("download", PayExchangeShowWalletView.callback_params.data.address + ".png")
            })
            this.ObjAppend(divQRCode, qrObj)

            //下载二维码"
            var qr_download = this.objCreate("a")
            qr_download.classList.add("iconfont", "icon-bc-xiazai")
            qr_download.textContent = Main.langMgr.get("addressbook_det_download") // "下载二维码"
            this.ObjAppend(divQRCode, qr_download)
        }

        toRefer() {
            if (PayExchangeShowWalletView.refer) {
                Main.viewMgr.change(PayExchangeShowWalletView.refer)
                PayExchangeShowWalletView.refer = null;
            }
        }

        key_esc() {
            this.doCancel()
        }

        private doCancel() {
            this.addGetWalletLists()
            this.return()
        }

        //转账
        private async doMakeTransfer() {


            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开转账页
                PayTransferView.callback = () => {
                    Main.viewMgr.payView.doGetWalletLists(1)

                }
                // PayTransferView.address = AddressbookDetailsView.contact.address_wallet
                Main.viewMgr.change("PayTransferView")


            } else {
                // 未打开钱包
                ViewWalletOpen.callback = () => {
                    this.doMakeTransfer()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;

            let uInt8Array = new Uint8Array(rawLength);

            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        }

        private checkTransCount(count: string): boolean {
            var regex = /(?!^0*(\.0{1,2})?$)^\d{1,14}(\.\d{1,8})?$/
            if (!regex.test(count)) {
                return false
            }
            if (Number(count) <= 0) {
                return false
            }
            return true
        }


        // 延时一段时间刷新交易记录
        private addGetWalletLists() {
            var type = PayExchangeShowWalletView.callback_params.type_src
            var timeout = 1000;
            switch (type) {
                case "BTC":
                    timeout = 15 * 60 * 1000; // 15分钟
                    break;
                case "ETH":
                    timeout = 3 * 60 * 1000; // 3分钟
                    break;
                default:
                    timeout = 2 * 60 * 1000; // 2分钟
                    break;
            }

            if (this.s_getWalletLists.hasOwnProperty(type)) {
                if (this.s_getWalletLists[type]) {
                    clearTimeout(this.s_getWalletLists[type])
                }
            }
            this.s_getWalletLists[type] = setTimeout(() => {
                Main.viewMgr.payView.doGetWalletLists()
            }, timeout);
        }

        updateBalance() {
            let type_lowcase = PayExchangeShowWalletView.callback_params.type_src.toLowerCase()
            PayExchangeShowWalletView.balance = Main.viewMgr.payView[type_lowcase]
            this.balanceElement.textContent = PayExchangeShowWalletView.balance.toString()
        }

    }
}