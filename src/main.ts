import Vue from 'vue'

import DEMO from "./pages/demo.vue"

declare const mui;
declare const plus;

var app = new Vue({
    el: '#app',
    data: {
        currentRoute: window.location.hash,
    },
    computed: {
        ViewComponent()
        {
            return DEMO;
        }
    },
    render(h)
    {
        return h(this.ViewComponent)
    }

});