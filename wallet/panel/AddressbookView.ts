/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 通讯录
    export class AddressbookView extends ViewBase {

        private inputSearch: HTMLInputElement
        private ulAddressbook: HTMLElement;

        private addressbook: any;
        static select: string;

        reset() {
            this.addressbook = {}
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            //返回
            var headerReturn = this.objCreate("a")
            headerReturn.classList.add("iconfont", "icon-bc-fanhui")
            headerReturn.textContent = Main.langMgr.get("return") // 返回
            headerReturn.onclick = () => {
                if (AddressbookView.select) {
                    this.remove()
                    Main.viewMgr.payView.show()
                    Main.viewMgr.payTransferView.show()
                } else {
                    this.return()
                }
            }
            this.ObjAppend(header, headerReturn)

            //通讯录标题
            var headerTitle = this.objCreate("h1")
            headerTitle.textContent = Main.langMgr.get("addressbook_title") // "通讯录"
            this.ObjAppend(header, headerTitle)

            //添加联系人
            var iHeader = this.objCreate("i")
            iHeader.classList.add("pc_returngame", "iconfont", "icon-bc-jiahao")
            iHeader.onclick = () => {
                this.hidden()
                AddressbookOpView.refer = "AddressbookView"
                AddressbookOpView.opType = "add"
                Main.viewMgr.change("AddressbookOpView")
            }
            this.ObjAppend(headerTitle, iHeader)

            //搜索容器
            var divSearch = this.objCreate("div")
            divSearch.classList.add("pc_search")
            this.ObjAppend(this.div, divSearch)

            var iSearch = this.objCreate("i")
            iSearch.classList.add("iconfont", "icon-bc-sousuo")
            this.ObjAppend(divSearch, iSearch)
            //搜索input
            this.inputSearch = this.objCreate("input") as HTMLInputElement
            this.inputSearch.placeholder = Main.langMgr.get("addressbook_search") // "搜索"
            this.inputSearch.onkeyup = () => {
                this.searchAddressbook()
            }
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

            console.log("[BlaCat]", '[AddressbookView]', 'getAddressbook, res =>', res);

            if (res.r) {
                this.addressbook = res.data;

                if (this.addressbook.hasOwnProperty("")) {
                    var undata = this.addressbook[""]
                    delete this.addressbook[""]
                    this.addressbook["#"] = undata
                }

                this.ulAddressbook.innerHTML = ""
                for (let k in this.addressbook) {
                    this.getAddressElement(k, this.addressbook[k])
                }
            }
            else {
                Main.showErrCode(res.errCode);
            }
        }

        private searchAddressbook() {
            var search_str = this.inputSearch.value
            var search_data = {}
            for (let k in this.addressbook) {
                for (let i = 0; i < this.addressbook[k].length; i++) {
                    let name = this.addressbook[k][i]['address_name'];
                    if (name.indexOf(search_str) != -1) {
                        if (!search_data.hasOwnProperty(k)) {
                            search_data[k] = []
                        }
                        search_data[k].push(this.addressbook[k][i])
                    }
                }
            }
            var contacts = this.ulAddressbook.getElementsByTagName("li")
            for (let l = 0; l < contacts.length; l++) {
                var li = contacts[l];
                let type = li.getAttribute("data-type")

                if (type == "title") {
                    let k = li.getAttribute("data-value")
                    if (search_data.hasOwnProperty(k)) {
                        li.style.display = ""
                    }
                    else {
                        li.style.display = "none"
                    }
                }
                else if (type == "contact") {
                    let k = li.getAttribute("data-title")
                    if (search_data.hasOwnProperty(k)) {
                        let id = li.getAttribute("data-value")
                        var isMatch = 0
                        for (let i = 0; i < search_data[k].length; i++) {
                            if (search_data[k][i]["id"] == id) {
                                isMatch = 1;
                                break;
                            }
                        }
                        if (li.style.display == "") {
                            if (isMatch == 0) {
                                li.style.display = "none"
                            }
                        }
                        else {
                            if (isMatch == 1) {
                                li.style.display = ""
                            }
                        }
                    }
                    else {
                        li.style.display = "none"
                    }
                }
            }
        }

        private getAddressElement(k: string, addrs: Array<any>) {
            // 标题
            var liAddressbook = this.objCreate("li")
            liAddressbook.classList.add("pc_addressbooktitle")
            liAddressbook.textContent = k
            liAddressbook.setAttribute("data-type", "title")
            liAddressbook.setAttribute("data-value", k)
            this.ObjAppend(this.ulAddressbook, liAddressbook)

            for (let i = 0; i < addrs.length; i++) {
                var liAddressbook = this.objCreate("li")
                liAddressbook.textContent = addrs[i]["address_name"]
                liAddressbook.setAttribute("data-title", k)
                liAddressbook.setAttribute("data-type", "contact")
                liAddressbook.setAttribute("data-value", addrs[i]["id"])
                liAddressbook.onclick = () => {
                    if (AddressbookView.select) {
                        this.remove()
                        Main.viewMgr.payView.show()
                        Main.viewMgr.payTransferView.show()
                        PayTransferView.contact = addrs[i]
                        Main.viewMgr.payTransferView.gatSelect()
                        AddressbookView.select = ""

                    } else {
                        this.hidden()
                        AddressbookDetailsView.refer = "AddressbookView"
                        AddressbookDetailsView.contact = addrs[i]
                        Main.viewMgr.change("AddressbookDetailsView")
                    }
                }
                this.ObjAppend(this.ulAddressbook, liAddressbook)
            }
        }

    }
}