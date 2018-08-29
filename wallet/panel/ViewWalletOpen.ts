/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 打开钱包视图
    export class ViewWalletOpen extends ViewBase {

        static callback_callback: Function;

        private static tasks: object;

        private inputPassword: HTMLInputElement

        start() {
            super.start()
            this.inputPassword.focus()
        }

        create() {
            this.doReadWalletFile();

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_popup")

            //弹窗的框
            var popupbox = this.objCreate('div')
            popupbox.classList.add("pc_popupbox")
            this.ObjAppend(this.div, popupbox)

            // 弹窗的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_popup_title")
            popupTitle.innerText = Main.langMgr.get("pay_walletOpen_password") // "密码"
            this.ObjAppend(popupbox, popupTitle)



            this.inputPassword = this.objCreate("input") as HTMLInputElement
            this.inputPassword.type = "password"
            this.inputPassword.style.marginTop = "40px"
            this.inputPassword.style.width = "60%"
            this.inputPassword.placeholder = Main.langMgr.get("pay_walletOpen_inputPassword") // "请输入钱包密码"
            this.ObjAppend(popupbox, this.inputPassword)


            // 弹窗按钮外框
            var popupbutbox = this.objCreate('div')
            popupbutbox.classList.add("pc_popupbutbox")
            this.ObjAppend(popupbox, popupbutbox)

            // 取消
            var popupClose = this.objCreate('button')
            popupClose.classList.add("pc_cancel")
            popupClose.textContent = Main.langMgr.get("cancel") // "取消"
            popupClose.onclick = () => {
                this.remove(300)

                if (ViewWalletOpen.callback_cancel) {
                    if (ViewWalletOpen.callback_callback) {
                        ViewWalletOpen.callback_cancel(ViewWalletOpen.callback_params, ViewWalletOpen.callback_callback);
                    }
                    else {
                        ViewWalletOpen.callback_cancel(ViewWalletOpen.callback_params)
                    }
                }

                ViewWalletOpen.callback_cancel = null;
                ViewWalletOpen.callback_params = null;
                ViewWalletOpen.callback_callback = null;
            }
            this.ObjAppend(popupbutbox, popupClose)


            var confirmObj = this.objCreate("button")
            confirmObj.textContent = Main.langMgr.get("ok") // "确认"
            confirmObj.onclick = () => {
                this.doConfirm()
            }
            this.ObjAppend(popupbutbox, confirmObj)
        }

        toRefer() {
            if (ViewWalletOpen.refer) {
                Main.viewMgr.change(ViewWalletOpen.refer);
                ViewWalletOpen.refer = null;
            }
        }


        private doConfirm() {
            if (!this.inputPassword.value) {
                Main.showErrMsg('pay_walletOpen_inputPassword_err', () => {
                    this.inputPassword.focus()
                })
                return
            }
            this.doOpenWallet()
        }

        async doReadWalletFile() {
            var readfile = await Main.wallet.readWalletFile(1);
            if (!readfile) {
                // Main.showErrMsg("钱包文件解析异常，请重新登录")
                Main.showErrMsg(("pay_walletOpen_file_error"))
                return;
            }
        }

        private async doOpenWallet() {

            Main.viewMgr.change("ViewLoading");

            var open = await Main.wallet.open(this.inputPassword.value);

            Main.viewMgr.viewLoading.remove()


            if (!open) {
                // Main.showErrMsg("打开钱包失败！请重试！")
                Main.showErrMsg(("pay_walletOpen_openFail"))
                return;
            }

            this.remove()

            if (ViewWalletOpen.callback) {
                if (ViewWalletOpen.callback_callback) {
                    ViewWalletOpen.callback(ViewWalletOpen.callback_params, ViewWalletOpen.callback_callback);
                }
                else {
                    ViewWalletOpen.callback(ViewWalletOpen.callback_params)
                }
            }

            ViewWalletOpen.callback = null;
            ViewWalletOpen.callback_params = null;
            ViewWalletOpen.callback_callback = null;

            // 打开钱包后执行的任务
            if (ViewWalletOpen.tasks) {
                this.doOpenTasks()
            }
        }

        // 打开钱包后功能模块
        static addTask(type: string, params: any) {
            if (!ViewWalletOpen.tasks) {
                ViewWalletOpen.tasks = {}
            }
            if (ViewWalletOpen.tasks[type]) {
                // 需要往里面合并数据
                for (let k in params) {
                    ViewWalletOpen.tasks[type].push(params[k])
                }
            }
            else {
                ViewWalletOpen.tasks[type] = params;
            }
            console.log("[BlaCat]", '[ViewWalletOpen]', 'addTask, tasks => ', ViewWalletOpen.tasks)
        }
        static removeTask(type: string) {
            delete ViewWalletOpen.tasks[type]
        }
        private doOpenTasks() {
            console.log("[BlaCat]", '[ViewWalletOpen]', 'doOpenTasks, tasks => ', ViewWalletOpen.tasks)
            for (let k in ViewWalletOpen.tasks) {
                if (ViewWalletOpen.tasks[k]) {
                    switch (k) {
                        case "getPlatNotifys":
                            // 需要开启platNotifys并且重新处理相关数据
                            for (let i in ViewWalletOpen.tasks[k]) {
                                let params = ViewWalletOpen.tasks[k][i];
                                delete Main.platNotifyTxids[params.txid];
                            }
                            Main.needGetPlatNotifys = true;
                            break;
                    }
                }
            }
        }

    }
}