<template>
    <div class="loading" v-if="show_loading">
        <div class="loadingbox">
        <div class="loading1"></div>
        <div class="loading2"></div>
        <div class="loading3"></div>
        <div class="loading4"></div>
        <div class="loading5"></div>
        <p>{{show_loading_msg}}</p>
        </div> 
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class loading extends Vue {
  show_loading: boolean;
  show_loading_msg: string;

  constructor() {
    super();
    this.show_loading = false;
    this.show_loading_msg = "";
  }

  showWaitting(msg: string) {
    this.show_loading = true;
    this.show_loading_msg = msg;
  }

  closeWaitting() {
    this.show_loading = false;
    this.show_loading_msg = "";
  }
}
</script>

<style>
.loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  line-height: 100vh;
  text-align: center;
  color: #07f;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10;
}
.loadingbox {
  width: 90px;
  height: 5vh;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.loadingbox > div {
  width: 8px;
  height: 100%;
  background: #00bfff;
  margin: 0 5px;
  float: left;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  opacity: 0.8;
}
.loading1 {
  -webkit-animation: sk-wave-stretch-delay 1.3s 0.1s infinite ease-in-out;
  animation: sk-wave-stretch-delay 1.3s 0.1s infinite ease-in-out;
}
.loading2 {
  -webkit-animation: sk-wave-stretch-delay 1.3s 0.2s infinite ease-in-out;
  animation: sk-wave-stretch-delay 1.3s 0.2s infinite ease-in-out;
}
.loading3 {
  -webkit-animation: sk-wave-stretch-delay 1.3s 0.3s infinite ease-in-out;
  animation: sk-wave-stretch-delay 1.3s 0.3s infinite ease-in-out;
}
.loading4 {
  -webkit-animation: sk-wave-stretch-delay 1.3s 0.4s infinite ease-in-out;
  animation: sk-wave-stretch-delay 1.3s 0.4s infinite ease-in-out;
}
.loading5 {
  -webkit-animation: sk-wave-stretch-delay 1.3s 0.5s infinite ease-in-out;
  animation: sk-wave-stretch-delay 1.3s 0.5s infinite ease-in-out;
}
.loadingbox p {
  width: 300px;
  position: absolute;
  top: -43vh;
  font-size: 13px;
  color: #00bfff;
  left: -105px;
}
@-webkit-keyframes sk-wave-stretch-delay{ 0%, 40%, 100% {-webkit-transform: scaleY(0.5);transform: scaleY(0.5);} 20% {-webkit-transform: scaleY(1); transform: scaleY(1);}}
@keyframes sk-wave-stretch-delay{ 0%, 40%, 100% {-webkit-transform: scaleY(0.5);transform: scaleY(0.5);} 20% {-webkit-transform: scaleY(1); transform: scaleY(1);}}
</style> 


