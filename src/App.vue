<template>
	<div id="app">
		<v-header :seller='seller'></v-header>
		<div class="tab border-1px">
			<div class="tab_iteam">
				<router-link to='/goods'>商品</router-link>
			</div>
			<div class="tab_iteam">
				<router-link to='/ratings'>评价</router-link>	
			</div>
			<div class="tab_iteam">
				<router-link to='/seller'>商家</router-link>
			</div>
		</div>
			<keep-alive>
				<router-view :seller="seller"></router-view>
				
			</keep-alive>

		
	</div>
</template>

<script>
	import axios from 'axios';
	import Header from './components/header/header.vue';
	import {urlParse} from './common/js/util'
//	import ShopCart from './components/shopcart/shopcart.vue';
	const ERR_OK=0;
	export default {
		data() {
			return {
				seller:{
					id:(() =>{
						let queryParm=urlParse();
						console.log(queryParm)
						return queryParm.id;
					})()
				},
				a:[]
			}
		},
		created(){
			this.$http.get('/api/seller?id='+this.seller.id).then((res) => {
				//console.log(res.data.seller);
				if(res.data.error===ERR_OK){
//					this.seller=res.data.seller;
					this.seller=Object.assign({},this.seller,res.data.seller);
					console.log(this.seller);
				}
			}).catch(error=>{
				console.log(error);
			})
		},
		components: {
			'v-header': Header
//			'v-ShopCart': ShopCart
		}
	}
</script>

<style lang="scss">
	@import "common/scss/mixin.scss";
	$wid:100%;
	$hei:100%;
	#app {
		.tab {
			display: flex;
			width: $wid;
			height: 40px;
			line-height:40px;
			font-size:14px;
			@include border-1px(rgba(7,17,27,0.1));
			.tab_iteam {
				flex: 1;
				text-align: center;
				line-height:40px;
				&>a{
					display: block;
					width: 100%;
					height: 100%;
					font-size: 14px;
					color: rgb(77,85,93);
					&.active{
					color: rgb(240,20,20);
					}
				}
				
			}
		}
	}
</style>