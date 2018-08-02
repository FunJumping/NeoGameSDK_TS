/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 通讯录
    export class AddressbookView extends ViewBase {
        inputSearch: HTMLInputElement

        ulAddressbook: HTMLElement;

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

            //通讯录标题
            var headerTitle = this.objCreate("h1")
            headerTitle.textContent = Main.langMgr.get("addressbook_title") // "通讯录"
            this.ObjAppend(header, headerTitle)

            //添加联系人
            var iHeader = this.objCreate("i")
            iHeader.classList.add("pc_returngame", "iconfont", "icon-jiahao")
            iHeader.onclick = () => {
                this.hidden()
                AddressbookAddView.refer = "AddressbookView"
                Main.viewMgr.change("AddressbookAddView")
            }
            this.ObjAppend(headerTitle, iHeader)

            //搜索容器
            var divSearch = this.objCreate("div")
            divSearch.classList.add("pc_search")
            this.ObjAppend(this.div, divSearch)

            var iSearch = this.objCreate("i")
            iSearch.classList.add("iconfont", "icon-sousuo")
            this.ObjAppend(divSearch, iSearch)
            //搜索input
            this.inputSearch = this.objCreate("input") as HTMLInputElement
            this.inputSearch.placeholder = Main.langMgr.get("addressbook_search") // "搜索"
            this.ObjAppend(divSearch, this.inputSearch)

            //列表
            this.ulAddressbook = this.objCreate("ul")
            this.ulAddressbook.classList.add("pc_addressbooklist")
            this.ObjAppend(this.div, this.ulAddressbook)

            this.getAddressbook();
        }


        toRefer() {
            if (AddressbookView.refer) {
                Main.viewMgr.change(AddressbookView.refer)
                AddressbookView.refer = null;
            }
        }

        async getAddressbook() {

            var res = await ApiTool.getAddrbook(Main.user.info.uid, Main.user.info.token);

            console.log('[Bla Cat]', '[AddressbookView]', 'getAddressbook, res =>', res);

            if (res.r) {
                this.ulAddressbook.innerHTML = ""

                var undata;
                if (res.data.hasOwnProperty("")) {
                    undata = res.data[""]
                    delete res.data[""]
                }

                for (let k in res.data) {
                    this.getAddressElement(k, res.data[k])
                }

                if (undata) {
                    this.getAddressElement("#", undata)
                }
            }

            // var liRessbook = this.objCreate("li")
            // liRessbook.classList.add("pc_ressbooktitle")
            // liRessbook.textContent = "A"
            // this.ObjAppend(ulRessbook, liRessbook)

            // var liRessbook = this.objCreate("li")
            // liRessbook.textContent = "asssa"
            // liRessbook.onclick = () => {
            //     this.hidden()
            //     AddressbookDetailsView.refer = "RessbookView"
            //     Main.viewMgr.change("RessbookDetailsView")
            // }
            // this.ObjAppend(ulRessbook, liRessbook)
            // var liRessbook = this.objCreate("li")
            // liRessbook.textContent = "asss"
            // this.ObjAppend(ulRessbook, liRessbook)

            // var liRessbook = this.objCreate("li")
            // liRessbook.classList.add("pc_ressbooktitle")
            // liRessbook.textContent = "B"
            // this.ObjAppend(ulRessbook, liRessbook)
            // var liRessbook = this.objCreate("li")
            // liRessbook.textContent = "bss"
            // this.ObjAppend(ulRessbook, liRessbook)
        }

        private getAddressElement(k: string, addrs: Array<any>) {
            // 标题
            var liAddressbook = this.objCreate("li")
            liAddressbook.classList.add("pc_addressbooktitle")
            liAddressbook.textContent = k
            this.ObjAppend(this.ulAddressbook, liAddressbook)

            for (let i=0; i< addrs.length; i++) {
                var liAddressbook = this.objCreate("li")
                liAddressbook.textContent = addrs[i]["address_name"]
                liAddressbook.onclick = () => {
                    this.hidden()
                    AddressbookDetailsView.refer = "AddressbookView"
                    Main.viewMgr.change("AddressbookDetailsView")
                }
                this.ObjAppend(this.ulAddressbook, liAddressbook)
            }
        }

    }
}