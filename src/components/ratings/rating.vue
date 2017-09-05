<template>
	<div class="ratings"  ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<v-star :size="36" :score="seller.serviceScore"></v-star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<v-star :size="36" :score="seller.foodScore"></v-star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<v-split></v-split><!--:ratings="food.ratings"-->
			<v-ratingselect  :selectType.sync="selectType" :only-content.sync="onlyContent" :desc="desc" :ratings="ratings"></v-ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-for="rating in ratings" class="rating-iteam">
						<div class="avatar">
							<img :src="rating.avatar" alt="" width="28" height="28"/>
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
							<v-star :size="24" :score="rating.score"></v-star>
							<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="item in rating.recommend"></span>
							</div>
							<div class="time">
								{{rating.rateTime}}
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import BScoll from 'better-scroll';
	import star from '../star/satr';
	import split from '../split/split';//是否满意
	import ratingselect from '../ratingselect/ratingselect';//是否查看所有内容
	const POSITIVE=0;
	const NEGATIVE=1;
	const ALL=2;
	const ERR_OK=0;
	export default{
		name:"ratings",
		props:{
			seller:{
				type:Object
			}
		},
		data(){
			return{
				ratings:[],
				showFlag:false,
				selectType:ALL,
				onlyContent:true,
				desc:{
					all: "全部",
				 	positive: "推荐",
					negative: "吐槽"
				}
			}
		},
		created() { 
			this.$http.get('/api/ratings').then((res)=>{
				//console.log(res.data.data)
				if(res.data.error===ERR_OK){
					this.ratings=res.data.data;
					//调用  操作dom之前一定要保证是在数据加载完之前在执行
					this.$nextTick(()=>{
						this.scroll=new BScoll(this.$refs.ratings,{
						click:true
						})
					})
					
				}
			}).catch(error=>{
				//console.log(error);
			})
		},
		methods:{
			selectRating(type){
				this.selectType = type;
		        this.$nextTick(() => {
		          this.scroll.refresh();
		        });
			},
			 toggleContent() {
		        this.onlyContent = !this.onlyContent;
		        this.$nextTick(() => {
		          this.scroll.refresh();
		        });
		      }
		},
		components:{
			'v-star':star,
			'v-split':split,
			'v-ratingselect':ratingselect
		}
	}
</script>
<style lang="scss" scoped="scoped">
@import "../../common/scss/mixin.scss";
	.ratings{
		position: absolute;
		top: 174px;
		bottom: 0;
		width: 100%;
		left: 0;
		overflow: hidden;
		.overview{
			display: flex;
			padding: 18px 0;
			.overview-left{
				flex: 0 0 137px;
				padding: 6px 0;
				/*flex: 1;*/
				width: 137px;
				border-right: 1px solid rgba(7,17,27,0.1);
				text-align: center;
				@media only screen and (max-width:320px){
					flex:0 0 120px;
					width:120px;
				}
				.score{
					margin-bottom: 6px;
					line-height: 28px;
					font-size: 24px;
					color: rgb(255,153,0);
				}
				.title{
					margin-bottom: 8px;
					line-height: 12px;
					font-size: 12px;
					color: rgb(7,17,27);
				}
				.rank{
					
					line-height: 10px;
					font-size: 10px;
					color: rgb(147,153,159);
				}
			}
			.overview-right{
				flex: 1;
				padding-left: 24px;
				@media only screen and (max-width: 320px){
					padding-left: 6px
				}
				.score-wrapper{
					margin-bottom: 8px;
					font-size: 0;
					.title{
						/*display: inline-block;
						vertical-align: top;*/
						line-height: 18px;
						font-size: 12px;
						color: rgb(7,17,27);
					}
					.star{
						display: inline-block;
						vertical-align: top;
						margin: 0 12px;
					}
					.score{
						display: inline-block;
						vertical-align: top;
						font-size: 12px;
						color: rgb(255,153,0);
					}
				}
				.delivery-wrapper{
					font-size: 0;
					.title{
						/*display: inline-block;
						vertical-align: top;*/
						line-height: 18px;
						font-size: 12px;
						color: rgb(7,17,27);
					}
					.delivery{
						margin-left: 12px;
						font-size: 12px;
						color: rgb(147,153,159);
					}
				}
			}
		}
		.rating-wrapper{
			padding: 0 18px;
			.rating-iteam{
				display: flex;
				padding: 18px 0;
				@include border-1px(rgba(7,17,27,0.1));
				.avatar{
					flex: 0 0 28px;
					width: 28px;
					margin-right: 12px;
					img{
						-webkit-border-radius: 50%;
						border-radius: 50%;
					}
				}
				.content{
					position: relative;
					flex: 1;
					.name{
						margin-bottom: 4px;
						font-size: 10px;
						line-height: 12px;
						color: rgb(7,17,27);
					}
					.star-wrapper{
						margin-bottom: 6px;
						font-size: 0;
						.star{
							display: inline-block;
							vertical-align: top;
							margin-right: 6px;
						}
						.delivery{
							display: inline-block;
							vertical-align: top;
							line-height: 12px;
							color: rgb(147,153,159);
							font-size: 10px;
						}
					}
					.text{
						font-size: 12px;
						color: rgb(7,17,27);
						line-height: 18px;
					}
					.recommend{
						line-height: 12px;
						font-size: 12px;
						color: rgb(0,160,220);
						line-height: 16px;
						.icon-thumb_up,.item{
							display: inline-block;
							margin: 0 8px 4px 0;
							font-size: 9px;
						}
						.icon-thumb_up{
							color: rgb(0,160,220);
						}
						.item{
							padding: 0 6px;
							border: 1px solid rgba(7,17,27,0.1);
							-webkit-border-radius: 1px;
							border-radius: 1px;
							color:rgb(147,153,159);
							background: #fff;
						}
					}
					.time{
						position: absolute;
						top: 0;
						right: 0;
						font-size: 10px;
						font-weight: 200;
						color: rgb(147,153,159);
						line-height: 12px;
					}
				}
			}
		}
	}
</style>