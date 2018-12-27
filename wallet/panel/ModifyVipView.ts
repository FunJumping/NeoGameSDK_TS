/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 我的信息
    export class ModifyVipView extends ViewBase {

        private monthsElement: HTMLElement;

        private pay_way: string;
        private month: string;
        private total: number;
        private invite_input: HTMLInputElement;

        private month12; //12个月会员
        private month3; //3个月会员
        private month1; //1个月会员
        private payul: HTMLElement;
        private pay_bct; //bct支付
        private pay_bcp; //bcp支付
        private paymentnum; //支付金额显示

        private netFeeCom: NetFeeComponent; // 手续费组件

        private net_fee: string // 网络交易费

        constructor() {
            super()

            this.pay_way = "BCT";
            this.month = "12";
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_myvip")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("myinfo_openmember") // "开通会员"
            this.ObjAppend(header, headerH1)

            // 商品ul
            this.monthsElement = this.objCreate("ul") as HTMLUListElement
            this.monthsElement.classList.add("goods")
            // 12个月会员
            this.month12 = this.objCreate("li")
            this.month12.classList.add('goods_item')
            this.month12.innerHTML = Main.langMgr.get("modifyVip_12months")
            this.month12.classList.add('pc_active')
            this.ObjAppend(this.monthsElement, this.month12)
            // 右上角√
            var righttick = this.objCreate("i")
            righttick.classList.add('iconfont', 'icon-righttick')
            this.ObjAppend(this.month12, righttick)
            this.month12.onclick = () => {
                this.setActive(this.monthsElement, this.month12)
                this.setItem(12)
                this.invite_input.style.display = "block"
                this.updatePayNum()
            }
            // 3个月会员
            this.month3 = this.objCreate("li")
            this.month3.classList.add('goods_item')
            this.month3.innerHTML = Main.langMgr.get("modifyVip_3months")
            this.ObjAppend(this.monthsElement, this.month3)
            // 右上角√
            var righttick = this.objCreate("i")
            righttick.classList.add('iconfont', 'icon-righttick')
            this.ObjAppend(this.month3, righttick)

            this.month3.onclick = () => {
                this.setActive(this.monthsElement, this.month3)
                this.setItem(3)
                this.invite_input.style.display = "none"
                this.invite_input.value = ""
                this.updatePayNum()
            }

            // 1个月会员
            this.month1 = this.objCreate("li")
            this.month1.classList.add('goods_item')
            this.month1.innerHTML = Main.langMgr.get("modifyVip_1months")
            this.ObjAppend(this.monthsElement, this.month1)

            // 右上角√
            var righttick = this.objCreate("i")
            righttick.classList.add('iconfont', 'icon-righttick')
            this.ObjAppend(this.month1, righttick)
            this.month1.onclick = () => {
                this.setActive(this.monthsElement, this.month1)
                this.setItem(1)
                this.invite_input.style.display = "none"
                this.invite_input.value = ""
                this.updatePayNum()
            }

            this.ObjAppend(this.div, this.monthsElement)



            // 支付方式标题
            var payway = this.objCreate("div")
            payway.classList.add("payway")
            payway.innerHTML = Main.langMgr.get("modifyVip_payway")
            this.ObjAppend(this.div, payway)

            // 支付方式ul
            this.payul = this.objCreate("ul") as HTMLUListElement
            this.payul.classList.add("payul")
            // BCT支付
            this.pay_bct = this.objCreate("li")
            this.pay_bct.classList.add('pay_item')
            this.pay_bct.innerHTML = "BCT"
            this.ObjAppend(this.payul, this.pay_bct)
            this.pay_bct.classList.add('pc_active')
            // 右上角√
            var righttick = this.objCreate("i")
            righttick.classList.add('iconfont', 'icon-righttick')
            this.ObjAppend(this.pay_bct, righttick)

            this.pay_bct.onclick = () => {
                this.setActive(this.payul, this.pay_bct)
                this.setPayway('BCT');
                this.updatePayNum()
            }

            // BCP支付
            this.pay_bcp = this.objCreate("li")
            this.pay_bcp.classList.add('pay_item')
            this.pay_bcp.innerHTML = "BCP"
            this.ObjAppend(this.payul, this.pay_bcp)
            // 右上角√
            var righttick = this.objCreate("i")
            righttick.classList.add('iconfont', 'icon-righttick')
            this.ObjAppend(this.pay_bcp, righttick)
            this.ObjAppend(this.div, this.payul)

            this.pay_bcp.onclick = () => {
                this.setActive(this.payul, this.pay_bcp)
                this.setPayway('BCP');
                this.updatePayNum()
            }
            // 推荐人账号
            var invitediv = this.objCreate("div")
            invitediv.classList.add("invitediv")
            this.ObjAppend(this.div, invitediv)
            this.invite_input = this.objCreate("input") as HTMLInputElement
            this.invite_input.classList.add("inviteinput")
            this.invite_input.placeholder = Main.langMgr.get("modifyVip_inviteplaceholder")
            this.ObjAppend(invitediv, this.invite_input)

            // 手续费组件
            this.netFeeCom = new NetFeeComponent(this.div, (net_fee) => {
                // this.netFeeChange(net_fee)
                this.net_fee = net_fee
            })
            this.netFeeCom.setFeeDefault()
            this.netFeeCom.createDiv()

            // 支付
            var goods_pay = this.objCreate("div")
            goods_pay.classList.add("goods_pay")
            var payment = this.objCreate("div")
            payment.classList.add("payment")
            this.ObjAppend(goods_pay, payment)
            // 支付金额txt
            var paymenttxt = this.objCreate("span")
            paymenttxt.classList.add("paymenttxt")
            paymenttxt.innerHTML = Main.langMgr.get("modifyVip_paymenttxt")
            this.ObjAppend(payment, paymenttxt)
            // 支付金额
            this.paymentnum = this.objCreate("span")
            this.paymentnum.classList.add("paymentnum")
            this.paymentnum.innerHTML = ""
            this.ObjAppend(payment, this.paymentnum)
            // 支付提交按钮
            var paymentbtn = this.objCreate("a")
            paymentbtn.classList.add("paymentbtn")
            if (Main.user.info.is_vip == "0") {
                paymentbtn.innerHTML = Main.langMgr.get("modifyVip_payment")
            } else if (Main.user.info.is_vip == "1") {
                paymentbtn.innerHTML = Main.langMgr.get("modifyVip_recharge")
            }
            this.ObjAppend(goods_pay, paymentbtn)

            paymentbtn.onclick = () => {

                ViewConfirm.callback = () => {
                    ModifyVipView.pay(this.pay_way, this.month, this.invite_input.value, this.net_fee)
                }

                let lang_key = ""
                if (this.month == "1") {
                    lang_key = "modifyvip_payAmonth"
                }
                else {
                    lang_key = "modifyvip_payconfirm"
                }

                Main.showConFirm(Main.langMgr.get(lang_key, { total: this.total, pay_way: this.pay_way, goods_item: this.month }))
                // "确定花费"+this.total+this.pay_way+"购买"+this.goods_item+"个月的会员？"
            }

            // X月勾选显示
            this.setActive(this.monthsElement, this["month" + this.month])
            // 推荐人
            if (this.month == "12") {
                this.invite_input.style.display = "block";
            }
            else {
                this.invite_input.style.display = "none"
                this.invite_input.value = ""
            }
            // 支付币种
            this.setActive(this.payul, this["pay_" + this.pay_way.toLowerCase()])

            this.ObjAppend(this.div, goods_pay)
            this.updatePayNum()
        }

        toRefer() {
            if (ModifyVipView.refer) {
                Main.viewMgr.change(ModifyVipView.refer)
                ModifyVipView.refer = null;
            }
        }

        private setItem(item) {
            this.month = item;
        }
        private setPayway(payway) {
            this.pay_way = payway;
        }
        private setActive(list, item) {
            var act = list.getElementsByClassName("pc_active")
            act[0].classList.remove("pc_active")
            item.classList.add("pc_active")

        }


        static getPayAmount(pay_way: string, month: string): number {
            var pay_way_tolow = pay_way.toLowerCase()
            var config = {
                bct: {
                    1: 69,
                    3: 199,
                    12: 699,
                },
                bcp: {
                    1: 6.9,
                    3: 19.9,
                    12: 69.9,
                }
            }
            if (config.hasOwnProperty(pay_way_tolow) && config[pay_way_tolow].hasOwnProperty(month)) {
                return config[pay_way_tolow][month]
            }
            return 0
        }

        static getPayNnc(pay_way: string): string {
            if (tools.CoinTool.hasOwnProperty("id_" + pay_way)) {
                return tools.CoinTool["id_" + pay_way]
            }
            return null
        }
        static getPayTarget(): string {
            if (tools.CoinTool.BUY_VIP_ADDR != "") {
                return tools.CoinTool.BUY_VIP_ADDR
            }
            return null
        }

        private updatePayNum() {
            this.total = ModifyVipView.getPayAmount(this.pay_way, this.month.toString())
            this.paymentnum.innerHTML = this.total.toString() + " " + this.pay_way

        }

        static async pay(pay_way: string, month: string, invite: string, net_fee: string, trust: string = "0", callback = null, isSDK: boolean = false, sdkParams = null): Promise<Result> {

            if (Main.isWalletOpen()) {
                // 打开钱包了
                console.log('[BlaCat]', '[ModifyVipView]', 'pay => ', pay_way, month, net_fee)

                // var month = month_num.toString()  // 会员月份

                var target: string = ModifyVipView.getPayTarget() // 收款地址
                var nnc: string = ModifyVipView.getPayNnc(pay_way) // BCP/BCT合约地址
                var total: number = ModifyVipView.getPayAmount(pay_way, month)

                if (month != "12") {
                    invite = ""
                }

                // 验证BCP或者BCT余额是否足够
                if (Main.viewMgr.payView[pay_way.toLowerCase()] < total) {
                    if (isSDK) {
                        var rtn_res: Result = new Result()
                        rtn_res.err = true
                        rtn_res.info = pay_way + " balance error"
                        return rtn_res
                    }
                    Main.showErrMsg("modifyVip_balance_error", null, { coin_type: pay_way })
                    return
                }

                // 验证手续费是否足够
                if (Number(net_fee) > 0) {
                    if (Main.viewMgr.payView.gas < Number(net_fee)) {
                        if (isSDK) {
                            var rtn_res: Result = new Result()
                            rtn_res.err = true
                            rtn_res.info = "gas fee not enough"
                            return rtn_res
                        }
                        Main.showErrMsg("modifyVip_gas_less")
                        return
                    }
                }

                // 验证邀请者账号是否正确
                var uid_res = await ModifyVipView.checkUidFromApi(invite)
                if (!uid_res) {
                    if (isSDK) {
                        var rtn_res: Result = new Result()
                        rtn_res.err = true
                        rtn_res.info = "invite error"
                        return rtn_res
                    }
                    Main.showErrMsg("modifyVip_invite_err")
                    return
                }

                Main.viewMgr.change("ViewLoading")
                try {
                    var res: Result = await tools.CoinTool.nep5Transaction(Main.user.info.wallet, target, nnc, total.toString(), net_fee)
                }
                catch (e) { }
                Main.viewMgr.viewLoading.remove()

                if (res) {
                    console.log("[BlaCat]", '[ModifyVipView]', 'pay转账结果 => ', res)
                    if (res.err == false) {
                        var size = 100000000
                        if (nnc == tools.CoinTool.id_BCT) {
                            size = 10000
                        }
                        var log_sbParamJson = "(addr)" + Main.user.info.wallet + ",(address)" + target + ",(integer)" + (total * size).toString()

                        var log_params = {}
                        if (isSDK && sdkParams) {
                            log_params = sdkParams
                        }
                        else {
                            log_params = {
                                uid: Main.user.info.uid,
                                month: month,
                                invite: invite,
                                nnc: nnc,
                                sbPushString: "transfer",
                                sbParamJson: log_sbParamJson,
                                toaddr: target,
                                total: total,
                            }
                        }

                        // 成功，上报
                        await ApiTool.addUserWalletLogs(
                            Main.user.info.uid,
                            Main.user.info.token,
                            res.info,
                            "0",
                            total.toString(),
                            "16",
                            JSON.stringify(log_params),
                            Main.netMgr.type,
                            trust,
                            net_fee,
                            PayTransferView.log_type_detail[pay_way.toLowerCase()]
                        );

                        // 立即刷新钱包记录
                        Main.viewMgr.payView.doGetWalletLists(1)

                        // 开启notify_plat
                        Main.needGetPlatNotifys = true

                        if (isSDK) {
                            var rtn_res: Result = new Result()
                            rtn_res.err = false
                            rtn_res.info = res.info
                            return rtn_res
                        }

                        // 购买会员提交成功
                        Main.showInfo("modifyVip_succ", () => {
                            // 退回到主界面
                            Main.viewMgr.modifyVipView.return()
                            Main.viewMgr.personalCenterView.return()
                        })
                    }
                    else {
                        if (isSDK) {
                            var rtn_res: Result = new Result()
                            rtn_res.err = true
                            rtn_res.info = res.info
                            return rtn_res
                        }
                        Main.showErrMsg("modifyVip_fail")
                        return
                    }
                }
                else {
                    if (isSDK) {
                        var rtn_res: Result = new Result()
                        rtn_res.err = true
                        rtn_res.info = "send nep5Transaction error"
                        return rtn_res
                    }
                }
            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "ModifyVipView"
                ViewWalletOpen.callback = () => {
                    ModifyVipView.pay(pay_way, month, invite, net_fee, trust, callback)
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        static async checkUidFromApi(uid: string) {
            if (uid && uid != "") {
                var res = await ApiTool.validUid(uid);
                if (res.hasOwnProperty('errCode') && res.errCode == 100707) {
                    return true
                }
                return false;
            }
            else {
                return true;
            }
        }

    }
}