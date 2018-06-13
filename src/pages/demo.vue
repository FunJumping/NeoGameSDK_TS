<template>
  <div>
      <div style="margin-top:60px;margin-left:60px;">
          钱包地址：{{wallet_addr}}
      </div>

      <div style="margin-top:60px;margin-left:60px;">
          <button @click="getSgasBalance()">查询钱包sgas</button>
      </div>


      <div style="margin-top:60px;margin-left:60px;">
          充值到应用的sgas数量：<input type="text" value="" v-model="recharge_value" placeholder="请输入充值sgas数量"/>
          <button @click="makeRecharge()">充值</button>
      </div>

      <div style="margin-top:60px;margin-left:60px;">
          <div>请求结果：</div>
          <div v-html="result"></div>
      </div>

      <Loading ref="loadingView"></Loading>
  </div>
</template>


<script lang="ts" src="./demo.ts"></script>