/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 通讯录详情
    export class AddressbookDetailsView extends ViewBase {

        static contact: contact;

        constructor() {
            super()

            if (!AddressbookDetailsView.contact) {
                AddressbookDetailsView.contact = new contact();
            }
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_maillist")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            //返回
            var headerReturn = this.objCreate("a")
            headerReturn.classList.add("iconfont", "icon-fanhui")
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
            iHeader.classList.add("pc_returngame", "iconfont", "icon-qianbi")
            this.ObjAppend(header, iHeader)

            // 通讯录详情内容容器
            var divObj = this.objCreate("div")
            divObj.classList.add("pc_addressbookdet")
            this.ObjAppend(this.div, divObj)

            // 备注名
            var divName = this.objCreate("div")
            divName.classList.add("pc_addressbookname")
            divName.textContent = "备注名"
            this.ObjAppend(divObj, divName)

            // 转账
            var butMakeTransfer = this.objCreate("button")
            butMakeTransfer.classList.add("pc_addressbookmaketran")
            butMakeTransfer.textContent = Main.langMgr.get("addressbook_det_transfer") // "转账"
            this.ObjAppend(divObj, butMakeTransfer)

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
            this.ObjAppend(divAddressTitle, butCopy)

            var divAddress = this.objCreate("div")
            divAddress.classList.add("pc_receivables")
            divAddress.textContent = AddressbookDetailsView.contact.address_wallet
            this.ObjAppend(divObj, divAddress)

            // 钱包地址二维码
            var divQRCode = this.objCreate("div")
            divQRCode.classList.add("pc_qrcode")
            this.ObjAppend(divObj, divQRCode)

            var imgQRCode = this.objCreate("img")
            imgQRCode.setAttribute("src", "file:///E:/%E8%B6%A3%E5%91%B3/%E9%92%B1%E5%8C%85/BlackCat-SDK-TS/BlackCat-SDK-TS/lib/../res/img/game0.png")
            this.ObjAppend(divQRCode, imgQRCode)

            //下载二维码"
            var qr_download = this.objCreate("a")
            qr_download.classList.add("iconfont", "icon-xiazai")
            qr_download.textContent = Main.langMgr.get("addressbook_det_download") // "下载二维码"
            this.ObjAppend(divQRCode, qr_download)

            // 描述标题
            var divDescribeTitle = this.objCreate("div")
            divDescribeTitle.classList.add("pc_addresstitle")
            divDescribeTitle.textContent = Main.langMgr.get("addressbook_det_describe") // "描述"
            this.ObjAppend(divObj, divDescribeTitle)

            var divDescribeText = this.objCreate("div")
            divDescribeText.classList.add("px_describetext")
            divDescribeText.textContent = Main.langMgr.get("addressbook_det_empty") // "空"
            this.ObjAppend(divObj, divDescribeText)

        }

        toRefer() {
            if (AddressbookDetailsView.refer) {
                Main.viewMgr.change(AddressbookDetailsView.refer)
                AddressbookDetailsView.refer = null;
            }
        }

    }
}