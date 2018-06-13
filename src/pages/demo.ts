import Vue from "vue";
import { Component } from "vue-property-decorator";


import Loading from "../components/loading.vue"

declare const NEOGAMESDK;

@Component({
    components: {
        Loading
    }
})
export default class demo extends Vue
{
    wallet_addr: string;    // 钱包地址
    recharge_value: number; // 充值金额
    recharge_txid: string;  // 充值txid
    result: string; // 结果字符串

    constructor()
    {
        super();
        this.recharge_value = 0.001;
        this.result = "";
        this.wallet_addr = "";

        // 验证登录状态
        this.validateLogin();
    }

    mounted()
    {
        NEOGAMESDK.init();
    }

    // 验证登录状态
    async validateLogin()
    {
        // 获取所有URL的GET参数
        var url_params = NEOGAMESDK.getUrlParams();
        // 设置钱包地址
        this.wallet_addr = url_params.wallet;

        console.log('钱包地址');
        console.log(this.wallet_addr);

        // TODO: 应用客户端需要把相关登录参数发送到应用服务端来验证登录参数是否正确，正确才让登录游戏

    }

    // 获取sgas余额
    getSgasBalance()
    {
        NEOGAMESDK.getSgasBalance((res) =>
        {
            this.result = JSON.stringify(res) + "<br/>";
        })
    }

    // 发起充值请求
    makeRecharge()
    {
        this.showWaitting("正在充值 ... ")
        var data = {
            count: this.recharge_value
        }
        NEOGAMESDK.makeRecharge(data, (res) =>
        {
            this.result = JSON.stringify(res) + "<br/>";

            this.closeWaitting();

            if (res.err == false)
            {
                this.showWaitting("等待充值确认中，时间较长，请耐心等待 ... ")
                this.recharge_txid = res.info.txid;
                this.makeRecharge_confirm();
            }

        })
    }

    // 显示等待提示
    showWaitting(msg: string)
    {
        this.$refs.loadingView[ "showWaitting" ](msg);
    }

    // 关闭等待提示
    closeWaitting()
    {
        this.$refs.loadingView[ "closeWaitting" ]();
    }

    // 充值确认
    private async makeRecharge_confirm()
    {
        var data = {
            txid: this.recharge_txid
        }
        NEOGAMESDK.getRecharge(data, (res) =>
        {
            this.result += ".";

            if (res.err == true)
            {
                //this.makeRecharge_confirm()
                setTimeout(() =>
                {
                    this.makeRecharge_confirm();
                }, 3000);
            }
            else
            {
                this.closeWaitting()
                this.result += "<br/><br/>" + JSON.stringify(res);
                alert("充值sgas[" + this.recharge_value + "]成功！")
            }
        })
    }

}