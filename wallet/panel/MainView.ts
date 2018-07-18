namespace BlackCat {
    // 主视图（不包含iconView）
    export class MainView extends ViewBase {
        private divMask: HTMLDivElement;
        static readonly divMaskId: string = "BC_mask";

        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.bodyAppend(this.div)
            }
            this.changNetType()
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement;
            this.div.classList.add("pc_window")
            this.div.style.display = "none"

            this.div.onclick = () => {
                // 阻止事件向上冒泡
                event.stopPropagation();
            }
        }

        createMask() {
            if (!this.divMask) {
                Main.viewMgr.change("IconView")

                this.divMask = this.objCreate("div") as HTMLDivElement;
                this.divMask.id = MainView.divMaskId;

                this.divMask.classList.add("pc_window_mask")
                this.divMask.onclick = () => {
                    this.hidden()
                    Main.viewMgr.change("IconView")
                }
                this.ObjAppend(this.div, this.divMask);
            }

        }

        changNetType() {
            var type = Main.netMgr.type;
            switch (type) {
                case 1: // 主网
                    this.div.classList.remove("pc_windowtest2")
                    break;
                case 2: // 测试网
                    this.div.classList.add("pc_windowtest2")
                    break;
            }
        }

        remove() {
            this.bodyRemove(this.div)
        }
    }
}