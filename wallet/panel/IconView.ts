/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 最小化视图
    export class IconView extends ViewBase {

        private doDragMove: boolean;
        private processDiv: HTMLDivElement;
        private stateDiv: HTMLElement;

        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.bodyAppend(this.div)
                this.onResize()
            }
            this.show()
        }

        reset() {
            this.doDragMove = false;
            if (this.div) this.flushProcess(0)
        }

        update() {
            // iconView不要使用父类update()
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_icon")
            this.showFail()

            this.div.onclick = () => {
                console.log("[BlaCat]", '[IconView]', 'onclick, this.doDragMove => ', this.doDragMove)
                if (this.doDragMove == true) {
                    return false;
                }

                // 隐藏自身
                this.hidden()
                // 显示mainView
                Main.viewMgr.mainView.div.classList.remove("pc_windowhide")
                Main.viewMgr.mainView.show()
                // 更新payView的height
                if (Main.viewMgr.payView && Main.viewMgr.payView.isCreated) {
                    Main.viewMgr.payView.getHeight("nodes")
                    if (tools.WWW.api_clis && tools.WWW.api_clis != "") {
                        Main.viewMgr.payView.getHeight("clis")
                    }
                }
            }

            this.div.onmousemove = () => {
                this.drag()
            }

            this.div.ontouchstart = (ev) => {
                this.dragTouch(ev)
            }

            this.processDiv = this.objCreate("div") as HTMLDivElement
            this.ObjAppend(this.div, this.processDiv)

            // 登录状态
            this.showState()
        }

        remove() {
            this.bodyRemove(this.div)
        }

        // 显示icon处理状态
        showState() {
            if (!this.stateDiv) {
                this.stateDiv = this.objCreate("div")
                this.stateDiv.classList.add("pc_iconstate")

                var imgStateIcon = this.objCreate("img") as HTMLImageElement
                imgStateIcon.src = Main.resHost + "res/img/BlackCaticon.gif"

                this.ObjAppend(this.stateDiv, imgStateIcon)

                this.ObjAppend(this.div, this.stateDiv)
            }
            this.stateDiv.style.display = ""
        }
        // 移除icon状态
        removeState() {
            if (this.stateDiv) this.objRemove(this.div, this.stateDiv)
        }
        // 影藏icon状态
        hiddenState() {
            if (this.stateDiv) this.stateDiv.style.display = "none"
        }

        // icon正常色


        // 连接失败 -- icon灰色
        showFail() {
            this.div.classList.add("pc_iconfail")
        }
        // 连接成功
        showSucc() {
            this.div.classList.remove("pc_iconfail")
        }

        flushProcess(count) {
            console.log("[BlaCat]", '[IconView]', 'flushProcess, count => ', count)
            // return
            if (count > 0) {
                // this.processDiv.textContent = count
                this.div.classList.add("pc_iconRecord")
            }
            else {
                // this.processDiv.textContent = "";
                this.div.classList.remove("pc_iconRecord")
            }

        }

        private dragTouch(ev) {
            // console.log("[BlaCat]", '[IconView]', 'dragTouch, ev => ', ev)
            var sent = {
                l: 0,  //设置div在父元素的活动范围，10相当于给父div设置padding-left：10;
                r: window.innerWidth - this.div.offsetWidth,  // offsetWidth:当前对象的宽度， offsetWidth = width+padding+border
                t: 0,
                b: window.innerHeight - this.div.offsetHeight
            }

            // console.log("[BlaCat]", '[IconView]', 'sent => ', sent)

            var dmW = document.documentElement.clientWidth || document.body.clientWidth;
            var dmH = document.documentElement.clientHeight || document.body.clientHeight;

            var l = sent.l || 0;
            var r = sent.r || dmW - this.div.offsetWidth;
            var t = sent.t || 0;
            var b = sent.b || dmH - this.div.offsetHeight;

            this.doDragMove = false;
            var oEvent = ev.touches[0];
            var sentX = oEvent.clientX - this.div.offsetLeft;
            var sentY = oEvent.clientY - this.div.offsetTop;

            document.ontouchmove = (ev: any) => {
                // console.log("[BlaCat]", '[IconView]', 'onmousemove ..')
                // 鼠标移动
                var mEvent = ev.touches[0];

                var slideLeft = mEvent.clientX - sentX;
                var slideTop = mEvent.clientY - sentY;

                if (slideLeft <= l) {
                    slideLeft = l;
                }
                if (slideLeft >= r) {
                    slideLeft = r;
                }
                if (slideTop <= t) {
                    slideTop = t;
                }
                if (slideTop >= b) {
                    slideTop = b;
                }

                this.div.style.left = slideLeft + 'px';
                this.div.style.top = slideTop + 'px';

                if (oEvent.clientX != mEvent.clientX || oEvent.clientY != mEvent.clientY) {
                    this.doDragMove = true
                }
            };
            document.ontouchend = () => {
                // console.log("[BlaCat]", '[IconView]', 'onmouseup ..')
                // 鼠标松开
                document.ontouchmove = null;
            }
        }

        private drag() {
            // console.log("[BlaCat]", '[IconView]', 'drag ..')

            var sent = {
                l: 0,  //设置div在父元素的活动范围，10相当于给父div设置padding-left：10;
                r: window.innerWidth - this.div.offsetWidth,  // offsetWidth:当前对象的宽度， offsetWidth = width+padding+border
                t: 0,
                b: window.innerHeight - this.div.offsetHeight
            }

            // console.log("[BlaCat]", '[IconView]', 'sent => ', sent)

            var dmW = document.documentElement.clientWidth || document.body.clientWidth;
            var dmH = document.documentElement.clientHeight || document.body.clientHeight;

            var l = sent.l || 0;
            var r = sent.r || dmW - this.div.offsetWidth;
            var t = sent.t || 0;
            var b = sent.b || dmH - this.div.offsetHeight;

            this.div.onmousedown = (ev) => {
                // console.log("[BlaCat]", '[IconView]', 'onmousedown ..')
                // 鼠标按下，开始拖动
                this.doDragMove = false;
                var oEvent = ev;
                var sentX = oEvent.clientX - this.div.offsetLeft;
                var sentY = oEvent.clientY - this.div.offsetTop;

                document.onmousemove = (ev) => {
                    // console.log("[BlaCat]", '[IconView]', 'onmousemove ..')
                    // 鼠标移动
                    var mEvent = ev;

                    var slideLeft = mEvent.clientX - sentX;
                    var slideTop = mEvent.clientY - sentY;

                    if (slideLeft <= l) {
                        slideLeft = l;
                    }
                    if (slideLeft >= r) {
                        slideLeft = r;
                    }
                    if (slideTop <= t) {
                        slideTop = t;
                    }
                    if (slideTop >= b) {
                        slideTop = b;
                    }

                    this.div.style.left = slideLeft + 'px';
                    this.div.style.top = slideTop + 'px';

                    if (oEvent.clientX != mEvent.clientX || oEvent.clientY != mEvent.clientY) {
                        this.doDragMove = true
                    }

                };
                document.onmouseup = () => {
                    // console.log("[BlaCat]", '[IconView]', 'onmouseup ..')
                    // 鼠标松开
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
                return false;
            }
        }

        private onResize() {
            window.onresize = () => {
                var windowWidth = window.innerWidth
                if (parseInt(this.div.style.left) + 64 >= windowWidth) {
                    this.div.style.left = "auto"
                }
            }
        }

    }
}