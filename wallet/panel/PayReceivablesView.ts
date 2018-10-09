/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />


namespace BlackCat {
    // 收款视图
    export class PayReceivablesView extends ViewBase {

        private divAddress: HTMLElement

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_maillist")

            // header  
            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            // 返回按钮
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") //"返回"
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            // h1标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("pay_received") // "钱包详情"
            this.ObjAppend(header, headerH1)




            // // QRCode;
            // // 二维码显示
            // var qrObj = this.objCreate("div")
            // new QRCode(qrObj, {
            //     text: Main.user.info.wallet,
            //     width: 128,
            //     height: 128,
            //     colorDark : "#000000",
            //     colorLight : "#ffffff",
            //     correctLevel : QRCode.CorrectLevel.H
            // });
            // this.ObjAppend(popupbox, qrObj)
            // // 下载按钮
            // var qr_download = this.objCreate("a")
            // qr_download.textContent = "download"
            // this.ObjAppend(popupbox, qr_download)

            //二维码容器
            var divObj = this.objCreate("div")
            divObj.classList.add("pc_qrcode")
            divObj.style.marginTop = "100px"
            this.ObjAppend(this.div, divObj)

            // QrCodeWithLogo
            // 二维码显示
            var qrObj = this.objCreate("img") as HTMLImageElement
            QrCodeWithLogo.toImage({
                image: qrObj,
                content: Main.user.info.wallet
            }).then(() => {
                var url = URL.createObjectURL(this.base64ToBlob(qrObj.src));
                qr_download.setAttribute('href', url)
                qr_download.setAttribute("download", Main.user.info.wallet + ".png")
            })
            this.ObjAppend(divObj, qrObj)

            // 下载二维码"
            var qr_download = this.objCreate("a")
            qr_download.classList.add("iconfont", "icon-bc-xiazai")
            qr_download.textContent = Main.langMgr.get("pc_receivables_download") // "下载二维码"
            this.ObjAppend(divObj, qr_download)

            //转账容器
            this.divAddress = this.objCreate("div")
            this.divAddress.classList.add("pc_receivables")
            this.divAddress.textContent = Main.user.info.wallet
            this.ObjAppend(divObj, this.divAddress)



            // 复制
            var butCopy = this.objCreate("button")
            butCopy.classList.add("pc_receivablescopy")
            butCopy.textContent = Main.langMgr.get("copy") //"复制"
            butCopy.onclick = () => {
                var inputCooy = this.objCreate("input") as HTMLInputElement
                inputCooy.value = this.divAddress.innerText
                this.ObjAppend(divObj, inputCooy)

                inputCooy.select();
                document.execCommand("Copy");
                inputCooy.remove()
                Main.showToast("pc_receivables_copy", 1500)

            }
            this.ObjAppend(divObj, butCopy)
        }

        toRefer() {
            if (PayReceivablesView.refer) {
                Main.viewMgr.change(PayReceivablesView.refer)
                PayReceivablesView.refer = null;
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