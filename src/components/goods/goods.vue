<template>
	<div class="goods">
		<div class="menu-wrapper" ref='menuWrapper'>
			<ul>
				<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"  @click="selectMenu(index,$event)">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref='foodsWrapper'>
			<ul>
				<li v-for="(item,index) in goods" class="food-list food-list-hook">
					<h1 class="title" :class="{'current':currentIndex===index}">{{item.name}}</h1>
					<ul>
						<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item" border-1px>
							<div class="icon">
								<img :src="food.icon" alt="" width="57"/>
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p v-show="food.description" class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月销{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-Wrapper">
									<v-cartcontrol :food="food" @cartadd="_drop"></v-cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<v-ShopCart ref="shopcart"  :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-ShopCart>
		<v-food :food="selectedFood" ref="food" @cartadd="_drop"></v-food>
	</div>
</template>
<script type="text/javascript">
	import axios from 'axios';
	import BScoll from 'better-scroll';
	import ShopCart from '../shopcart/shopcart.vue';
	import carControl from '../cartcontrol/cartcontrol.vue'
	import Food from '../food/food.vue'
	const ERR_OK=0;
	export default{
		props:{
			seller:{
				type:Object
			},
			
		},
		data(){
				return{
					goods:[],
					listHeight:[],
					scrollY:0,
					selectedFood:{}
				};
		},
		computed: {
			currentIndex(){
			 	for(let i=0;i<this.listHeight.length;i++){
			 		 //判断当currentIndex在height1和height2之间的时候显示
			 		let height1=this.listHeight[i];//此处的里面存放的是索引值
			 		let height2=this.listHeight[i+1];
					
					if (!height2||(this.scrollY>=height1&&this.scrollY<height2)) {
						return i;
					} 
			 	}
			 	return 0;
			},
			selectFoods(){
				let foods=[];
				this.goods.forEach((good)=>{
					good.foods.forEach((food)=>{
						if(food.count){
							foods.push(food);
						}
					})
				});
				return foods;
			}
		},
		created() { 
			this.classMap=['decrease','discount','guarantee','invoice','special']
			this.$http.get('/api/goods').then((res)=>{
				//console.log(res.data.data)
				if(res.data.error===ERR_OK){
					this.goods=res.data.data;
					//调用  操作dom之前一定要保证是在数据加载完之前在执行
					this.$nextTick(()=>{
						this._initScroll();
						this._calculaterHeight();
					});
				}
			}).catch(error=>{
				//console.log(error);
			})
		},
		components: {
			'v-ShopCart': ShopCart,
			'v-cartcontrol':carControl,
			"v-food":Food
		},
//		events:{
//			'car.add'(target){
//				this._drop(target);
//			}
//		},
		methods:{
			selectMenu(index,event){
//				console.log(event);
				//  自己默认派发事件时候(BScroll),_constructed被置为true,但是浏览器原生并没有这个属性
				if(!event._constructed){
					return;
				}
				//运用BScroll接口，滚动到相应位置
				let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let el=foodList[index];
				this.foodsScroll.scrollToElement(el,300);
				//console.log(index);
			},
			selectFood(food,event){
				console.log(food,event)
				if(!event._constructed){
					return;
				}
				this.selectedFood=food;
				this.$refs.food.show();
			},
			_drop(target){
				//console.log(target);
				this.$refs.shopcart.drop(target);
			},
			_initScroll() {
				//console.log(this.$refs)
				this.menuScroll=new BScoll(this.$refs['menuWrapper'],{
					click:true,
					probeType:3
					
				});
				this.foodsScroll=new BScoll(this.$refs.foodsWrapper,{
					click:true,
					//探针作用，实时监测滚动位置
					probeType:3
				});
				//设置监听滚动位置
				this.foodsScroll.on('scroll',(pos)=>{
					 //scrollY接收变量
					this.scrollY=Math.abs(Math.round(pos.y));
				})
			},
			_calculaterHeight(){
				let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				
				//声明一个变量
				let height=0;
				this.listHeight.push(height);
				for(let i=0;i<foodList.length;i++){
					let item=foodList[i];
					height +=item.clientHeight;
					this.listHeight.push(height);
				}
				//console.log(this.listHeight);
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	@import "../../common/scss/mixin.scss";
	$wid:100%;
	$hei:100%;
	.goods{
		position: absolute;
		top: 174px;
		bottom: 46px;
		width:$wid;
		display: flex;
		overflow: hidden;
		.menu-wrapper{
			flex: 0 0 80px;
			width: 80px;
			background: #f3f5f7;
			.menu-item{
				display: table;
				height: 54px;
				width: 56px;
				line-height: 14px;
				padding:0 12px;
				.icon{
						display: inline-block;
						width: 12px;
						height: 12px;
						margin-right: 2px;
						background-size: 12px 12px;
						background-repeat: no-repeat;
						vertical-align: middle;
						&.decrease{
							@include bg-img('decrease_3');
						}
						&.discount{
							@include bg-img('discount_3');
						}
						&.guarantee{
							@include bg-img('guarantee_3');
						}
						&.invoice{
							@include bg-img('invoice_3');
						}
						&.special{
							@include bg-img('special_3');
						}
				}
				.text{
					display: table-cell;
					width: 56px;
					vertical-align: middle;
					@include border-1px(rgba(7,17,27,0.1));
					font-size: 12px;
				}
				&.current{
					position: relative;
					margin-top: -1px;
					z-index: 10;
					background: #fff;
					font-weight: 700;
					.text{
						@include border-none;
					}
				}
			}
		}
		.foods-wrapper{
			flex: 1;
			.title{
				padding-left:16px;
				height:26px;
				line-height:26px;
				border-left:2px solid #d9dde1;
				font-size:12px;
				color:rgb(147,153,159);
				background:#f3f5f7;
			}
			.food-item{
				display: flex;
				margin: 18px;
				padding-bottom:18px;
				@include border-1px(rgba(7,17,27,0.1));
				&:last-child{
					@include border-none;
					margin-bottom: 0;
				}
				.icon{
					flex: 0 0 57px;
					margin-right: 10px;
				}
				.content{
					flex: 1;
					.name{
						margin: 2px 0 8px 0;
						height: 14px;
						line-height: 14px;
						font-size: 14px;
						color: rgb(7,17,27);
					}
					.desc,.extra{
						font-size: 10px;
						line-height: 10px;
						/*height: 10px;*/
						color: rgb(147,153,159);
					}
					.desc{
						margin-bottom: 8px;
						line-height: 12px;
					}
					.extra{
						color: rgb(147,153,159);
						.count{margin-right: 12px;}
					}
					.price{
						font-weight: 700;
						line-height: 24px;
						.now,.old{
							font-size: 14px;
							font-weight: 700;
							line-height: 24px;
						}
						.now{
							margin-right:8px;
							color: rgb(240,20,20);
						}
						.old{
							text-decoration: line-through;
							font-size: 10px;
							color: rgb(147,153,159);
						}
					}
					.cartcontrol-Wrapper{
						position: absolute;
						right: 0;
						bottom: 12px;
					}
				}
			}
		}
	}
</style>