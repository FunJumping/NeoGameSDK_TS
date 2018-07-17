/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 最小化视图
    export class IconView extends ViewBase {
        private doDragMove: boolean;
        private processDiv: HTMLDivElement;

        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.bodyAppend(this.div)
            }
            this.show()
        }

        flushProcess(count) {
            console.log('[Bla Cat]', '[IconView]', 'flushProcess, count => ', count)
            // return
            if (count > 0) {
                this.processDiv.textContent = count
                this.div.classList.add("pc_iconRecord")
            }
            else {
                this.processDiv.textContent = "";
                this.div.classList.remove("pc_iconRecord")
            }

        }
        

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_icon")

            this.div.onclick = () => {
                if (this.doDragMove == true) {
                    return false;
                }
                console.log('[Bla Cat]', '[IconView]', 'onclick ...')
                this.hidden()
                Main.viewMgr.mainView.show()
            }

            this.div.onmousemove = () => {
                this.drag()
            }

            this.processDiv = this.objCreate("div") as HTMLDivElement
            this.processDiv.style.color = "red"
            this.ObjAppend(this.div, this.processDiv)
        }

        remove() {
            this.bodyRemove(this.div)
        }

        drag() {
            // console.log('[Bla Cat]', '[IconView]', 'drag ..')

            var sent = {
                l: 0,  //设置div在父元素的活动范围，10相当于给父div设置padding-left：10;
                r: window.innerWidth - this.div.offsetWidth,  // offsetWidth:当前对象的宽度， offsetWidth = width+padding+border
                t: 0,
                b: window.innerHeight - this.div.offsetHeight
            }

            // console.log('[Bla Cat]', '[IconView]', 'sent => ', sent)

            var dmW = document.documentElement.clientWidth || document.body.clientWidth;
            var dmH = document.documentElement.clientHeight || document.body.clientHeight;

            var l = sent.l || 0;
            var r = sent.r || dmW - this.div.offsetWidth;
            var t = sent.t || 0;
            var b = sent.b || dmH - this.div.offsetHeight;

            this.div.onmousedown = (ev) => {
                // console.log('[Bla Cat]', '[IconView]', 'onmousedown ..')
                // 鼠标按下，开始拖动
                this.doDragMove = false;
                var oEvent = ev;
                var sentX = oEvent.clientX - this.div.offsetLeft;
                var sentY = oEvent.clientY - this.div.offsetTop;

                document.onmousemove = (ev) => {
                    // console.log('[Bla Cat]', '[IconView]', 'onmousemove ..')
                    // 鼠标移动
                    var oEvent = ev;

                    var slideLeft = oEvent.clientX - sentX;
                    var slideTop = oEvent.clientY - sentY;

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
                    
                    if (this.div.style.left != slideLeft + 'px' || this.div.style.top != slideTop + 'px' ) {
                        this.div.style.left = slideLeft + 'px';
                        this.div.style.top = slideTop + 'px';
                        this.doDragMove = true;
                    }

                };
                document.onmouseup = () => {
                    // console.log('[Bla Cat]', '[IconView]', 'onmouseup ..')
                    // 鼠标松开
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
                return false;
            }
        }

    }
}