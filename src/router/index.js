import Vue from 'vue';
import VueRouter from 'vue-router';

import { out } from '../../outPath';

import Home from '../views/home';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
    // mode: 'history',
    base: `/${out}`,
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
