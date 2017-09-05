<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<!--此方法用于表示点击购物车是否显示购物车信息-->
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{'highlight':totalCount>0}">
							<span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
						</div>
						<div class="num" v-show='totalCount>0'>{{totalCount}}</div>
					</div>
					<div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
					<div class="desc">另需配送费￥{{deliveryPrice}}</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay">
					<div class="pay" :class="payClass">{{payDesc}}</div>
				</div>
				
			</div>
			<div class="ball-container">
					<transition v-for="(ball,index) in balls" name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
	
						<div v-show="ball.show" class="ball">
	
							<div class="inner inner-hook"></div>
	
						</div>
					</transition>
	
				</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<div class="title">购物车</div>
						<div class="empty" @click="empty">清空</div>
					</div>
					<div class="list-content" ref='listContent'>
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>￥{{food.price*food.count}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<carControl :food="food"></carControl>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>
<script type="text/javascript">
	
	import carControl from '../cartcontrol/cartcontrol.vue'
	import BScroll from 'better-scroll';
	export default {
		props: {
			selectFoods: { //父元素根本没有传递?
				type: Array,
				default() {
					return [{
						price: 30,
						count: 1
					}];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [ //定义一个数组用来装小球的
					{ show: false },
					{ show: false },
					{ show: false },
					{ show: false }
				],
				dropBalls: [],
				fold: true, //意思是折叠的意思
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			payDesc() {
				if(this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`;
				} else if(this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差${diff}元起送`
				} else {
					return '去结算';
				}
			},
			payClass() {
				if(this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'eough';
				}
			},
			listShow() {
				if(!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if(show){
					this.$nextTick(()=>{
						if(!this.scroll){
							this.scroll=new BScroll(this.$refs.listContent,{//listContent此处获取的list-content不应该带横线或者是下划线
								click:true,
								probeType:3
							});
						}else{
							this.scroll.refresh();//重新计算视口的高度
						}
						
					})
				}
				return show;
			}
		},
		methods: {
			drop(el) {
				//console.log(el);
				for(let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					if(!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						//console.log(this.dropBalls)
						return;
					}
				}

			},
			beforeEnter(el) { //console.log(el)
				let count = this.balls.length;
				while(count--) {
					let ball = this.balls[count];
					if(ball.show) {
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);
						//console.log(x,y)
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						el.style.transform = `translate3d(0,${y}px,0)`;
						let inner = el.getElementsByClassName('inner-hook')[0];
						//console.log(inner)
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter(el) {
				let rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)'
					inner.style.transform = 'translate3d(0,0,0)'
				})
			},
			afterEnter(el) {
				let ball = this.dropBalls.shift();
				if(ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			toggleList() {
				if(!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			empty(){
				this.selectFoods.forEach((food)=>{
					food.count=0;
				})
			},
			hideList(){
				this.fold=true;
			},
			pay(){
				if(this.totalPrice<this.minPrice){
					return;
				}
				window.alert(`支付${this.totalPrice}`);
			}
		},
		components: {
			carControl
		}
	}
</script>
<style lang="scss" scoped="scoped">
@import "../../common/scss/mixin.scss";
	$wid:100%;
	$hei:100%;
	$footSize:14px;
	$footCol:#fff;
	.shopcart {
		width: $wid;
		height: 48px;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 50;
		.content {
			display: flex;
			background: #141d27;
			font-size: 0;
			.content-left {
				flex: 1;
				.logo-wrapper {
					display: inline-block;
					position: relative;
					top: -10px;
					margin: 0 12px;
					padding: 6px;
					width: 56px;
					height: 56px;
					box-sizing: border-box;
					vertical-align: top;
					border-radius: 50%;
					background: #141d27;
					.logo {
						width: $wid;
						height: $hei;
						border-radius: 50%;
						background: #2b343c;
						text-align: center;
						.icon-shopping_cart {
							font-size: 24px;
							color: #80858a;
							line-height: 44px;
							&.highlight {
								color: #fff;
							}
						}
						&.highlight {
							background: rgb(0, 160, 220);
						}
					}
				}
				.num {
					position: absolute;
					top: 0;
					right: 0;
					width: 24px;
					height: 16px;
					line-height: 16px;
					text-align: center;
					border-radius: 16px;
					font-size: 9px;
					font-weight: 700;
					color: #fff;
					background: rgb(240, 20, 20);
					box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
				}
				.price {
					display: inline-block;
					vertical-align: top;
					line-height: 24px;
					margin-top: 12px;
					padding-right: 12px;
					box-sizing: border-box;
					border-right: 1px solid rgba(255, 255, 255, 0.1);
					font-size: 16px;
					font-weight: 700;
					color: rgba(255, 255, 255, 0.4);
					&.highlight {
						color: #fff;
					}
				}
				.desc {
					display: inline-block;
					vertical-align: top;
					line-height: 24px;
					margin: 12px 0 0 12px;
					font-size: 10px;
					color: rgba(255, 255, 255, 0.4);
				}
			}
			.content-right {
				flex: 0 0 105px;
				width: 105px;
				.pay {
					height: 48px;
					line-height: 48px;
					text-align: center;
					font-size: 12px;
					font-weight: 700;
					color: rgba(255, 255, 255, 0.4);
					background: #2b333b;
					&.not-enough {
						background: #2b333b;
					}
					&.eough {
						background: #00b43c;
						color: #fff;
					}
				}
			}
		}
		.ball-container {
			.ball {
				position: fixed;
				left: 32px;
				bottom: 22px;
				z-index: 200;
				-webkit-transform: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
				transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
				.inner {
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: rgb(0, 160, 220);
					-webkit-transform: all 0.4s linear;
					transition: all 0.4s linear;
				}
			}
		}
		.shopcart-list {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			/*&.fold-transition {*/
				-webkit-transition: all 0.5s;
				transition: all 0.5s;
				-webkit-transform: translate3d(0, -100%, 0);
				transform: translate3d(0, -100%, 0);
				&.fold-enter,
				&.fold-leave {
					-webkit-transform: translate3d(0, 0, 0);
					transform: translate3d(0, 0, 0);
				}
				&.fold-enter-active,
				&.fold-leave-active {
					-webkit-transform: translate3d(0, 0, 0);
					transform: translate3d(0, 0, 0);
				}
			/*}*/
			.list-header {
				height: 40px;
				line-height: 40px;
				padding: 0 18px;
				background: #f3f5f7;
				border-bottom: 1px solid rgba(7,17,27,0.1);
				.title{
					float: left;
					font-size: 14px;
					color: rgb(7,17,27);
				}
				.empty{
					float: right;
					font-size: 12px;
					color: rgb(0,160,220);
				}
			}
			.list-content{
				padding: 0 18px;
				max-height: 217px;
				background: #fff;
				overflow: hidden;
				.food{
					position: relative;
					padding: 12px 0;
					box-sizing: border-box;
					@include border-1px(rgba(7,17,27,0.1));
					.name{
						line-height: 24px;
						font-size: 14px;
						color: rgb(7,17,27);
					}
					.price{
						position: absolute;
						right: 90px;
						bottom: 12px;
						line-height: 20px;
						font-size: 14px;
						font-weight: 700;
						color: rgb(240,20,20);
					}
					.cartcontrol-wrapper{
						position: absolute;
						right: 0;
						bottom: 6px;
					}
				}
			}
		}
	}
	.list-mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 40;
		backdrop-filter:blur(10px);
		/*&.fade-transition{*/
			opacity: 1;
			background:rgba(7,17,27,0.6);
			transition: all 0.5s; 
		/*}*/
		&.fade-enter,&.fade-leave{
			opacity: 0;
			background:rgba(7,17,27,0);
		}
		&.fade-enter-active,&.fade-leave-active{
			opacity: 0;
			background:rgba(7,17,27,0);
		}
	}
</style>