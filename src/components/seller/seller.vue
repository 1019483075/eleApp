<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
		<div class="overview">
			<h1 class="title">{{seller.name}}</h1>
			<div class="desc" border-1px>
				<v-star :size="36" :score="seller.score"></v-star>
				<span class="text">({{seller.ratingCount}})</span>
				<span class="text">月售{{seller.sellCount}}单</span>
			</div>
			<ul class="remark">
				<li class="block">
					<h2>起送价</h2>
					<div class="content">
						<span class="stress">{{seller.minPrice}}元</span>
					</div>
				</li>
				<li class="block">
					<h2>商家配送</h2>
					<div class="content">
						<span class="stress">{{seller.deliveryPrice}}元</span>
					</div>
				</li>
				<li class="block">
					<h2>平均配送时间</h2>
					<div class="content">
						<span class="stress">{{seller.deliveryTime}}分钟</span>
					</div>
				</li>
			</ul>
			<div class="favorite" @click="togglefavorita">
				<span class="icon-favorite" :class="{'active':favorite}"></span>
				<span class="text">{{favoriteText}}</span>
			</div>
		</div>
		<v-split></v-split>
		<div class="bulletin">
			<h1 class="title">公告与活动</h1>
			<div class="content-wrapper">
				<p class="content">{{seller.bulletin}}</p>
			</div>
			 <ul v-if="seller.supports" class="supports">
			 	<li class="support-item border-1px" v-for="(item,index) in seller.supports">
			 		<span class="icon" :class="classMap[seller.supports[index].type]"></span>
			 		<span class="text">{{seller.supports[index].description}}</span>
			 	</li>
			</ul>
		</div>
		<v-split></v-split>
		<div class="pics">
			<h1 class="title">商家实景</h1>
			<div class="pic-wrapper" ref="picWrapper">
				<ul class="pic-list" ref="picList">
					<li class="pic-item border-1px"  v-for="pic in seller.pics">
						<img :src="pic" width="120" height="90"/>
					</li>
				</ul>
			</div>
		</div>
		<v-split></v-split>
		<div class="info">
			<h1 class="title" border-1px>商家信息</h1>
			<ul>
				<li class="info_item" v-for="info in seller.infos">{{info}}</li>
			</ul>
		</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import BScoll from 'better-scroll';
	import star from '../star/satr';
	import split from '../split/split';//是否满意
	import {saveToLocal,loadFromLocal} from '@/common/js/store'
	let ERR_OK=0;
	export default{
		name:"seller",
		props:{
			seller:{
				type:Object
			}
		},
		data(){
			return{
				//seller:{},
//				favorite:(()=>{
//					return loadFromLocal(this.seller.id,'favorite',false);
//				})()
				favorite:(()=>{
					return loadFromLocal(this.seller.id,'favorite',false);
				})()
			}
		},
		computed:{
			favoriteText(){
				return this.favorite?'收藏':'未收藏';
				//localStorage.favorite=this.favorite;
			}
		},
		watch:{
			'seller'(){
				this._initScroll();
				this._initPics();
			}
		},
		created(){
//			this.$http.get('/api/seller').then((res)=>{
//				//console.log(res.data.seller)
//				if(res.data.error===ERR_OK){
//					this.seller=res.data.seller;
//					//调用  操作dom之前一定要保证是在数据加载完之前在执行
//					this.$nextTick(()=>{
//						this._initScroll();
//						this._initPics();
//					})
//					
//				}
//			}).catch(error=>{
//				//console.log(error);
//			})
			 this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		},
		mounted(){
			this.$nextTick(()=>{
				this._initScroll();
				this._initPics();
			})
		},
		methods:{
			togglefavorita(event){
				if(!event._constructed){
					return;
				}
				this.favorite=!this.favorite;
				saveToLocal(this.seller.id, 'favorite', this.favorite);
			},
			_initScroll(){
				if(!this.scroll){
					this.scroll=new BScoll(this.$refs.seller,{
						click:true
					});
				}else{
					this.scroll.refresh();
				}
			},
			_initPics(){
				if(this.seller.pics){
						let picsWidth=120;
						let margin=6;
						let width=(picsWidth+margin)*this.seller.pics.length-margin;
						this.$refs.picList.style.width=width+'px';
						this.$nextTick(()=>{
							if(!this.picScroll){
								this.picScroll=new BScoll(this.$refs.picWrapper,{
									scrollX:true,//横向滚动
									eventPassthrought:'vertical'//这个属性的目的是使用外层的区块竖向滚动里层的区块横向滚动
								});
							}else{
								this.scroll.refresh();
							}
						})
					}
			}
		},
		components:{
			'v-star':star,
			'v-split':split
		}
	}
</script>
<style lang="scss">
	@import "../../common/scss/mixin.scss";
	.seller{
		position: absolute;
		top: 174px;
		bottom: 0;
		left: 0;
		width: 100%;
		overflow: hidden;
		.seller-content{
			.overview{
				position: relative;
				padding: 18px;
				.title{
					font-size: 14px;
					color: rgb(7,17,27);
					line-height: 10px;
					margin-bottom: 8px;
				}
				.desc{
					padding-bottom:18px;
					@include border-1px(rgba(7,17,27,0.1));
					font-size:0;
					.star{
						display: inline-block;
				          margin-right: 8px;
				          vertical-align: top;
					}
					.text{
					display: inline-block;
					font-size: 10px;
					margin-right: 12px;
					line-height: 18px;
					vertical-align: top;
					color: rgb(77,85,93);
					}
				}
				.remark{
					display: flex;
					padding-top:18px;
					.block{
						flex: 1;
						text-align: center;
						border-right: 1px solid rgba(7,17,27,0.1);
						&:last-child{
							border: none;
						}
						h2{
							margin-bottom: 4px;
							line-height: 10px;
							font-size: 10px;
							color: rgb(147,153,159);
						}
						.content{
							line-height: 24px;
							font-size: 10px;
							color: rgb(7,17,27);
							.stress{
								font-size: 24px;
							}
             
						}
					}
				}
				.favorite{
					position: absolute;
					width: 50px;
					right: 11px;
					top: 18px;
					text-align: center;
					.icon-favorite{
						display: block;
						margin-bottom: 4px;
						line-height: 24px;
						font-size: 24px;
						color: #d4d6d9;
						 &.active{
						 	color: rgb(240, 20, 20)
						 }
            
					}
					.text{
						line-height: 10px;
						font-size: 10px;
						color: rgb(77,85,93);
					}
				}
			}
			.bulletin{
				padding: 18px 18px 0 18px;
				.title{
					margin-bottom: 8px;
					line-height: 14px;
					color: rgb(7,17,27);
					font-size: 14px;
				}
				.content-wrapper{
					padding: 0 12px 16px 12px;
					@include border-1px(rgba(7,17,27,0.1));
					.content{
						line-height: 24px;
						font-size: 12px;
						color: rgb(240,20,20);
					}
				}
				.supports{
					.support-item{
						padding: 16px 12px;
						@include border-1px(rgba(7,17,27,0.1));
						font-size: 0;
						&:last-child(){
							@include border-none;
						}
						.icon{
							display: inline-block;
							width: 16px;
							height: 16px;
							margin-right: 6px;
							background-size: 16px 16px;
							background-repeat: no-repeat;
							vertical-align:top;
							&.decrease{
								@include bg-img('decrease_4');
							}
							&.discount{
								@include bg-img('discount_4');
							}
							&.guarantee{
								@include bg-img('guarantee_4');
							}
							&.invoice{
								@include bg-img('invoice_4');
							}
							&.special{
								@include bg-img('special_4');
							}
						}
						.text{
							line-height:16px;
							font-size: 12px;
							color: rgb(7,17,27);
						}
					}
				}
			}
			.pics{
				padding: 18px;
				.title{
					margin-bottom: 12px;
					line-height: 14px;
					color: rgb(7,17,27);
					font-size: 14px;
				}
				.pic-wrapper{
					width: 100%;
					overflow: hidden;
					white-space: nowrap;
					.pic-list{
						font-size: 0;
						.pic-item{
							display: inline-block;
							margin-right: 6px;
							width: 120px;
							height: 90px;
							&:last-child{
								margin: 0;
							}
						}
					}
				}
			}
			.info{
				padding: 18px 18px 0 18px;
				.title{
					padding-bottom: 12px;
					line-height: 14px;
					color: rgb(7,17,27);
					font-size: 14px;
					@include border-1px(rgba(7,17,27,0.1));
				}
				ul{
					.info_item{
						padding: 16px 12px;
						line-height: 16px;
						@include border-1px(rgba(7,17,27,0.1));
						font-size: 12px;
						&:last-child{
							@include border-none()
						}
					}
				}
			}
		}
	}
</style>