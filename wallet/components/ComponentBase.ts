namespace BlackCat {
    // 视图基类
    export class ComponentBase {

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