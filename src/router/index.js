import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

import Goods from '@/components/goods/goods'
import Ratings from '@/components/ratings/rating'
import Seller from '@/components/seller/seller'
Vue.use(Router)
export default new Router({
	linkActiveClass:'active',//全局配置 <router-link> 的默认『激活 class 类名』
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },{
    		path:'/goods',
    		name:'Goods',
    		component:Goods
    },{
    		path:'/ratings',
    		name:'Ratings',
    		component:Ratings
    },{
    		path:'/seller',
    		name:'Seller',
    		component:Seller
    }
  ]
})
//router.go('/goods')
