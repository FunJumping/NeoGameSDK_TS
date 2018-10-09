/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 网络线路
    export class ModifyNetworkLineView extends ViewBase {

        static defaultType: string = "nodes";

        private divTypes: HTMLElement
        private netType_nodes: HTMLElement
        private netType_clis: HTMLElement
        private divLists: HTMLElement

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_moifynet")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            // 返回
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            // 标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("modifyNet") // "地区"
            this.ObjAppend(header, headerH1)

            // 网络类型
            this.divTypes = this.objCreate("div")
            this.divTypes.classList.add("pc_divnettype")


            // BlockAPI
            this.netType_nodes = this.objCreate("button")
            this.netType_nodes.textContent = "BlockAPI"
            this.netType_nodes.classList.add("pc_active")
            if (ModifyNetworkLineView.defaultType == "nodes") {
                this.netType_nodes.classList.add("pc_active");
            }
            this.netType_nodes.onclick = () => {
                this.showNodeInfo("nodes", 1)
            }
            this.ObjAppend(this.divTypes, this.netType_nodes)

            // NeoCli
            this.netType_clis = this.objCreate("button")
            this.netType_clis.textContent = "NeoCli"
            if (ModifyNetworkLineView.defaultType == "clis") {
                this.netType_nodes.classList.remove("pc_active")
                this.netType_clis.classList.add("pc_active");
            }
            this.netType_clis.onclick = () => {
                this.showNodeInfo("clis", 1)
            }
            this.ObjAppend(this.divTypes, this.netType_clis)
            this.ObjAppend(this.div, this.divTypes)

            // 网络路线
            this.divLists = this.objCreate("div")
            this.divLists.classList.add("pc_myinfolist")
            this.ObjAppend(this.div, this.divLists)

            // 获取节点数据
            this.showNodeInfo(ModifyNetworkLineView.defaultType)
        }

        toRefer() {
            if (ModifyNetworkLineView.refer) {
                Main.viewMgr.change(ModifyNetworkLineView.refer)
                ModifyNetworkLineView.refer = null;
            }
        }

        private showNodeInfo(type: string, clear: number = 0) {
            // 网络路线（节点信息）
            var currNodeInfo = Main.netMgr.getCurrNodeInfo(type)
            if (currNodeInfo) {

                this.divTypes.getElementsByClassName("pc_active")[0].classList.remove("pc_active")
                this["netType_" + type].classList.add("pc_active");

                if (clear == 1) {
                    this.divLists.innerHTML = ""
                }

                var ulNet = this.objCreate("ul")
                this.ObjAppend(this.divLists, ulNet)

                var nodeLists = Main.netMgr.getNodeLists(type)
                nodeLists.forEach(
                    nodelist => {
                        var li = this.objCreate("li")
                        if (nodelist[1] == currNodeInfo[1]) {
                            li.classList.add("pc_active")
                        }
                        this.ObjAppend(ulNet, li)

                        var divArea = this.objCreate("div")
                        divArea.classList.add("pc_mmyinfoarea")
                        divArea.textContent = this.getNodeName(nodelist) //"网络线路"
                        this.ObjAppend(li, divArea)

                        //网络线路高度
                        var divHeight = this.objCreate("div")
                        if (type == "nodes") {
                            divHeight.classList.add("pc_payheighet", "iconfont", "icon-bc-blalian")
                        }
                        if (type == "clis") {
                            divHeight.classList.add("pc_payheighet", "iconfont", "icon-bc-neolian")
                        }
                        divHeight.textContent = "n/a"
                        this.ObjAppend(li, divHeight)

                        // 选中网络路线图标
                        var iArea = this.objCreate("i")
                        iArea.classList.add("iconfont", "icon-bc-gou")
                        this.ObjAppend(li, iArea)

                        this.getHeight(type, nodelist, divHeight, li, currNodeInfo)
                    }
                )
            }
            else {
                // 没有节点信息
            }
        }


        private async doChange(type, nodelist, height) {
            Main.netMgr.setNode(type, nodelist[1])
            Main.showToast("modifyNet_succ")

            // 更新payView
            Main.viewMgr.payView.updateHeight(type, height)

            // 更新myinfo
            if (ModifyNetworkLineView.refer == "MyInfoView") {
                Main.viewMgr.myInfoView.updateNodeInfo()
            }

            this.return()
        }

        private getNodeName(nodeInfo) {
            let content = Main.langMgr.get("area_code_" + nodeInfo[0])
            if (nodeInfo[2]) {
                content += nodeInfo[2]
            }
            return content
        }

        private async getHeight(type, nodelist, element, li, currNodeInfo) {
            try {
                let height = await tools.WWW["api_getHeight_" + type](nodelist[1])
                if (height > 0) {
                    element.textContent = height.toString()
                    if (nodelist[1] != currNodeInfo[1]) {
                        li.onclick = () => {
                            this.doChange(type, nodelist, height)
                        }
                    }
                    if (nodelist[1] == currNodeInfo[1]) {
                        // 更新payView
                        Main.viewMgr.payView.updateHeight(type, height)

                        // 更新myinfo
                        if (ModifyNetworkLineView.refer == "MyInfoView") {
                            Main.viewMgr.myInfoView.updateNodeInfo()
                        }
                    }
                    return
                }
            }
            catch (e) { }

            li.onclick = () => {
                Main.showErrMsg("modifyNet_node_err")
            }
        }
    }
}