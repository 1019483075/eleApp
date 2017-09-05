<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease " v-show="food.count>0" @click.stop.prevent="decreaseCart">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>
<script>
	import Vue from 'vue'
	export default {//此页面是购物车数量增加减少功能
		name:'carControl',
		props: {
			food: {
				type: Object
			}
		},
		created() {

		},
		methods: {
			addCart(event) {
				//console.log('click')
				if(!event._constructed) {
					return;
				}
				if(!this.food.count) {
					Vue.set(this.food, 'count', 1);
					this.food.count = 1;
				} else {
					this.food.count++;
				}
//				console.log(this.$parent.goods)
				//this.$dispatch("cart.add",event.target);
				this.$emit('cartadd',event.target)
			},
			decreaseCart(event) {
				if(!event._constructed) {
					return;
				}
				if(this.food.count) {
					this.food.count--;
				}
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	@mixin commonCssStar {
		display: inline-block;
		padding: 6px;
	}
	
	.cartcontrol {
		font-size: 0;
		.cart-decrease {
			@include commonCssStar;
			-webkit-transition:all 0.2s linear;
			transition: all 0.2s linear;
			&.move-transition{
				opacity: 1;
				-webkit-transform:translate3d(0,0,0);
				transform: translate3d(0,0,0);
			}
			.inner{
				display: inline-block;
				line-height: 24px;
				font-size: 24px;
				color: rgb(0, 160, 220);
				-webkit-transition:all 0.2s linear;
				transition: all 0.2s linear;
				-webkit-transform: rotate(0);
				transform: rotate(0);
			}
				&.move-enter-active, &.move-leave-active{
					/*transition: opacity .5s;*/
						opacity: 0;
					-webkit-transform:translate3d(24px,0,0);
					transform: translate3d(24px,0,0);
					.inner{
						-webkit-transform: rotate(180deg);
						transform: rotate(180deg);
					}
				}
				&.move-enter,&.move-leave-active{
					opacity: 0;
					-webkit-transform:translate3D(24px,0,0);
					transform: translate3D(24px,0,0);
					.inner{
						-webkit-transform: rotate(180deg);
						transform: rotate(180deg);
					}
				}
		}
		.cart-count {
			display: inline-block;
			vertical-align: top;
			width: 12px;
			padding-top: 6px;
			line-height: 24px;
			text-align: center;
			font-size: 10px;
			color: rgb(147, 153, 159);
		}
		.cart-add {
			@include commonCssStar;
			line-height: 24px;
			font-size: 24px;
			color: rgb(0, 160, 220);
		}
	}
</style>