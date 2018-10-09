/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 通讯录详情
    export class AddressbookDetailsView extends ViewBase {

        private divAddress: HTMLElement
        static contact: contact;

        constructor() {
            super()

            if (!AddressbookDetailsView.contact) {
                AddressbookDetailsView.contact = new contact();
            }
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_maillist_details")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            //返回
            var headerReturn = this.objCreate("a")
            headerReturn.classList.add("iconfont", "icon-bc-fanhui")
            headerReturn.textContent = Main.langMgr.get("return") // 返回
            headerReturn.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, headerReturn)

            // 通讯录详情标题
            var headerTitle = this.objCreate("h1")
            headerTitle.textContent = Main.langMgr.get("addressbook_det_title") // "通讯录"
            this.ObjAppend(header, headerTitle)

            // 通讯录详情 修改图标
            var iHeader = this.objCreate("i")
            iHeader.classList.add("pc_returngame", "iconfont", "icon-bc-qianbi")
            iHeader.onclick = () => {
                this.hidden()
                AddressbookOpView.refer = "AddressbookDetailsView"
                AddressbookOpView.contact = AddressbookDetailsView.contact
                AddressbookOpView.opType = "update"
                Main.viewMgr.change("AddressbookOpView")
            }
            this.ObjAppend(header, iHeader)

            // 通讯录详情内容容器
            var divObj = this.objCreate("div")
            divObj.classList.add("pc_addressbookdet")
            this.ObjAppend(this.div, divObj)

            // 联系人
            var divName = this.objCreate("div")
            divName.classList.add("pc_addressbookname")
            divName.textContent = AddressbookDetailsView.contact.address_name  // "联系人"
            this.ObjAppend(divObj, divName)



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
            this.divAddress.textContent = AddressbookDetailsView.contact.address_wallet
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
                content: AddressbookDetailsView.contact.address_wallet
            }).then(() => {
                var url = URL.createObjectURL(this.base64ToBlob(qrObj.src));
                qr_download.setAttribute('href', url)
                qr_download.setAttribute("download", AddressbookDetailsView.contact.address_wallet + ".png")
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
            divDescribeText.textContent = AddressbookDetailsView.contact.address_desc ? AddressbookDetailsView.contact.address_desc : Main.langMgr.get("addressbook_det_empty") // "空"
            this.ObjAppend(divObj, divDescribeText)

            //删除联系人
            var btnDel = this.objCreate("button")
            btnDel.classList.add("pc_addressbookdel")
            btnDel.textContent = Main.langMgr.get("addressbook_det_del") //删除联系人
            btnDel.onclick = () => {
                this.dodel()
            }
            this.ObjAppend(divObj, btnDel)
        }

        toRefer() {
            if (AddressbookDetailsView.refer) {
                Main.viewMgr.change(AddressbookDetailsView.refer)
                AddressbookDetailsView.refer = null;
            }
        }

        private async dodel() {
            ViewConfirm.callback = () => {
                this.makedel()
            }
            Main.showConFirm("addressbook_det_del_tips")
        }


        private async makedel() {
            var res = await ApiTool.delAddrbook(Main.user.info.uid, Main.user.info.token, AddressbookDetailsView.contact.id)

            if (res.r) {
                Main.showToast("addressbook_det_del_succ")
                this.return()
                Main.viewMgr.addressbookView.getAddressbook()
            }
            else {
                Main.showErrCode(res.errCode)
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
                PayTransferView.address = AddressbookDetailsView.contact.address_wallet
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