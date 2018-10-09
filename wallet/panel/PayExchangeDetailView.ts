/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易所购买详情
    export class PayExchangeDetailView extends ViewBase {

        private ulExchange: HTMLUListElement;
        private divAddress: HTMLDivElement;
        private inputGas: HTMLInputElement;
        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_exchangedetail")

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
            headerH1.textContent = Main.langMgr.get("pay_exchange_gas") // "购买GAS"
            this.ObjAppend(header, headerH1)

            //交易所类型
            var divExchange = this.objCreate("div")
            divExchange.classList.add("pc_exchangetitle")
            this.ObjAppend(this.div, divExchange)

            //交易所类型详情
            var divEcvhangeObj = this.objCreate("div")
            divEcvhangeObj.classList.add("pc_exchangelist")
            this.ObjAppend(divExchange, divEcvhangeObj)
            //名称
            var divExchangeName = this.objCreate("div")
            divExchangeName.classList.add("pc_exchangename")

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
            var divNewPrice = this.objCreate("div")
            divNewPrice.classList.add("pc_exchangeprice")

            //最新价名称
            var divNewPriceName = this.objCreate("label")
            divNewPriceName.textContent = Main.langMgr.get("pay_exchange_price") // "最新价"
            this.ObjAppend(divNewPrice, divNewPriceName)

            //最新价格
            var pNewPrice = this.objCreate("p")
            pNewPrice.textContent = "1111111111111"
            this.ObjAppend(divNewPrice, pNewPrice)

            this.ObjAppend(divEcvhangeObj, divNewPrice)

            //余额
            var divBalance = this.objCreate("div")
            divBalance.classList.add("pc_exchangeprice")

            //余额名称
            var labelBalanceName = this.objCreate("label")
            labelBalanceName.textContent = Main.langMgr.get("pay_exchange_price") // "余额"
            this.ObjAppend(divBalance, labelBalanceName)

            //余额价格
            var pBalance = this.objCreate("p")
            pBalance.textContent = "1111111111111"
            this.ObjAppend(divBalance, pBalance)

            this.ObjAppend(divEcvhangeObj, divBalance)

            // 购买GAS
            var divGas = this.objCreate("div")
            divGas.classList.add("pc_exc_purchases")
            // 消耗
            var divConsume = this.objCreate("div")
            divConsume.classList.add("pc_exc_consume")
            divConsume.textContent = "NEO消耗"
            this.ObjAppend(divGas, divConsume)

            var aConsume = this.objCreate("a")
            aConsume.textContent = "NEO不足?"
            this.ObjAppend(divConsume, aConsume)

            // GAS 数量框
            var divGasObj = this.objCreate("div")
            divGasObj.classList.add("pc_exc_inputpurchases")
            divGasObj.textContent = "GAS"
            this.ObjAppend(divGas, divGasObj)

            // GAS 购买输入框
            this.inputGas = this.objCreate("input") as HTMLInputElement
            this.inputGas.placeholder = "输入购买数量"
            this.ObjAppend(divGasObj, this.inputGas)

            // 购买按钮
            var btnGas = this.objCreate("button")
            btnGas.textContent = "确认购买"
            this.ObjAppend(divGasObj, btnGas)


            this.ObjAppend(this.div, divGas)





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
                inputCooy.value = this.divAddress.innerText
                this.ObjAppend(divObj, inputCooy)

                inputCooy.select();
                document.execCommand("Copy");
                inputCooy.remove()
                Main.showToast("pc_receivables_copy", 1500)

            }
            this.ObjAppend(divAddressTitle, butCopy)

            // 转账
            var butMakeTransfer = this.objCreate("button")
            butMakeTransfer.textContent = Main.langMgr.get("addressbook_det_transfer") // "转账"
            butMakeTransfer.onclick = () => {
                this.doMakeTransfer()
            }
            this.ObjAppend(divAddressTitle, butMakeTransfer)


            this.divAddress = this.objCreate("div") as HTMLDivElement
            this.divAddress.classList.add("pc_receivables")
            // this.divAddress.textContent = AddressbookDetailsView.contact.address_wallet
            this.ObjAppend(divObj, this.divAddress)

            //二维码容器
            var divQRCode = this.objCreate("div")
            divQRCode.classList.add("pc_qrcode")
            this.ObjAppend(divObj, divQRCode)

            // QrCodeWithLogo
            // 二维码显示
            var qrObj = this.objCreate("img") as HTMLImageElement
            QrCodeWithLogo.toImage({
                image: qrObj,
                content: 55 //AddressbookDetailsView.contact.address_wallet
            }).then(() => {
                var url = URL.createObjectURL(this.base64ToBlob(qrObj.src));
                qr_download.setAttribute('href', url)
                qr_download.setAttribute("download", /*AddressbookDetailsView.contact.address_wallet*/555 + ".png")
            })
            this.ObjAppend(divQRCode, qrObj)

            //下载二维码"
            var qr_download = this.objCreate("a")
            qr_download.classList.add("iconfont", "icon-bc-xiazai")
            qr_download.textContent = Main.langMgr.get("addressbook_det_download") // "下载二维码"
            this.ObjAppend(divQRCode, qr_download)

            // 描述标题
            var divDescribeTitle = this.objCreate("div")
            divDescribeTitle.classList.add("pc_addresstitle")
            divDescribeTitle.textContent = Main.langMgr.get("addressbook_det_describe") // "描述"
            this.ObjAppend(divObj, divDescribeTitle)

            var divDescribeText = this.objCreate("div")
            divDescribeText.classList.add("pc_describetext")
            // divDescribeText.textContent = AddressbookDetailsView.contact.address_desc ? AddressbookDetailsView.contact.address_desc : Main.langMgr.get("addressbook_det_empty") // "空"
            this.ObjAppend(divObj, divDescribeText)



        }

        toRefer() {
            if (PayExchangeDetailView.refer) {
                Main.viewMgr.change(PayExchangeDetailView.refer)
                PayExchangeDetailView.refer = null;
            }
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

    }
}