namespace BlackCat {
    // 视图基类
    export class ViewBase {

        div: HTMLDivElement;
        isCreated: boolean;

        static refer: string;      // 返回view
        static callback: Function; // 确认后回调
        static callback_cancel: Function; // 取消后回调
        static callback_params: any; // 回调参数

        private s_timeout_remove: any; // 销毁定时器

        constructor() {
            this.isCreated = false;
            this.reset()
        }

        // 创建(子类实现)
        create() { }
        // 跳转(子类实现)
        toRefer() { }
        // 重置(子类实现)
        reset() { { } }
        // 回调(子类实现)
        // callback() {}
        // 取消或移除回调（子类实现）
        // callback_cancel() {}

        // 开始执行
        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.parentAdd(this.div)
            }
            this.show()
        }
        // 移除
        remove(timeout: number = 0, fadeClass = "pc_fadeindown") {
            if (this.s_timeout_remove) {
                return
            }
            if (timeout) {
                if (fadeClass) this.div.classList.add("pc_fadeindown")
                this.s_timeout_remove = setTimeout(() => {
                    this._remove()
                }, timeout)
            }
            else {
                this._remove()
            }
        }
        private _remove() {
            this.s_timeout_remove = null
            this.parentRemove(this.div)
            this.isCreated = false;
            this.reset()
        }
        // 返回
        return(timeout: number = 0) {
            this.remove(timeout)
            this.toRefer()
        }

        // 隐藏
        hidden() {
            this.div.style.display = "none"
        }
        // 显示
        show() {
            this.div.style.display = "";
        }
        // 是否隐藏
        isHidden() {
            if (this.div && this.div.style.display == "none") {
                return true;
            }
            return false;
        }
        // 更新视图
        update() {
            this.parentRemove(this.div)
            this.create();
            this.parentAdd(this.div)
        }

        objCreate(tag: string) {
            var addElement = document.createElement(tag);
            return addElement;
        }

        ObjAppend(o, tag: HTMLElement) {
            o.appendChild(tag);
        }

        objRemove(o, tag: HTMLElement) {
            o.removeChild(tag);
        }

        parentAdd(tag: HTMLElement) {
            this.ObjAppend(Main.viewMgr.mainView.div, tag)
        }

        parentRemove(tag: HTMLElement) {
            this.objRemove(Main.viewMgr.mainView.div, tag)
        }

        bodyAppend(tag: HTMLElement) {
            document.body.appendChild(tag);
        }

        bodyRemove(tag: HTMLElement) {
            document.body.removeChild(tag);
        }


    }
}