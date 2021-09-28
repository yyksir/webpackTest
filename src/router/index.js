import Vue from 'vue';
import VueRouter from 'vue-router';

import { out } from '../../outPath';

import Home from '../views/home';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history' ,
    // mode: 'history',
    base: `/${out}`,
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    },
    routes: [
        {
            path: '/Home',
            name: 'Home',
            component: Home,
            meta: {
                title: '登录'
            },
        },
    ]
});

export default router;
