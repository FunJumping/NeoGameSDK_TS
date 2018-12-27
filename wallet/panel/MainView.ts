namespace BlackCat {
    // 主视图（不包含iconView）
    export class MainView extends ViewBase {

        private divMask: HTMLDivElement;

        private s_timeout_hidden: any; // 隐藏定时器

        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.bodyAppend(this.div)
            }
            //判断是否为手机端，是的话添加pc_mobile类名
            if(/AppleWebKit.*mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
				if(window.location.href.indexOf("?mobile") < 0) {
					try {
						if(/iPad/i.test(navigator.userAgent)) {
						} else {
							this.div.classList.add("pc_mobile")
						}
					} catch(e) {}
				}
			}
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement;
            this.div.classList.add("pc_window")
            this.div.style.display = "none"

            this.div.onclick = () => {
                // 阻止事件向上冒泡
                event.stopPropagation();
                // 更新main存活时间
                Main.setLiveTime()
            }
        }

        createMask() {
            if (!this.divMask) {
                Main.viewMgr.change("IconView")

                this.divMask = this.objCreate("div") as HTMLDivElement;

                this.divMask.classList.add("pc_window_mask")
                this.divMask.onclick = () => {
                    // this.hidden()
                    // Main.viewMgr.change("IconView")
                    BlackCat.SDK.showIcon()
                }
                this.ObjAppend(this.div, this.divMask);
            }

        }

        changNetType() {
            switch (Main.netMgr.type) {
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

        // 隐藏
        hidden() {
            this.div.classList.add("pc_windowhide")
            this.s_timeout_hidden = setTimeout(() => {
                this.div.style.display = "none"
            }, 300)
        }
        // 显示
        show() {
            if (this.s_timeout_hidden) clearTimeout(this.s_timeout_hidden)
            this.div.classList.remove("pc_windowhide")
            this.div.style.display = "";
        }
    }
}