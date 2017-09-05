<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img :src="seller.avatar" alt="加载中.." width="64" height="64"/>
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div v-if="seller.supports" class="supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span><span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click='showDetail'>
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper"  @click='showDetail'>
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" width="100" height="100"  alt="" />
		</div>
		<!--浮层弹窗-->
		<transition name="fade">
			<div v-show='detailShow' class="detail" >
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<h1 class="name">{{seller.name}}</h1>
						<div class="star-wrapper"><star :size='48' :score='seller.score'></star></div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
							<li class="support-item" v-for="(item,index) in seller.supports">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="text">{{seller.supports[index].description}}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="content">{{seller.bulletin}}</p>
						</div>
					</div>
				</div>
				
				<div class="detail-close" @click="hideDetail">
					<i class="icon-close"></i>
				</div>
			</div>
		</transition>
	</div>
</template>
<script type="text/javascript">
	import star from '../star/satr';
	export default{
		props:{
			seller:{
				type:Object
			}
		},
		components:{
			star
		},
		data() {
			return {
				detailShow:false
			}
		},
		methods: {
			showDetail(){
				this.detailShow=true;
			},
			hideDetail(){
				this.detailShow=false;
			}
		},
		created() {
			this.classMap=['decrease','discount','guarantee','invoice','special']
		}
		
	}
</script>
<style lang="scss">
	@import "../../common/scss/mixin.scss";
	$wid:100%;
	$hei:100%;
	$headSize:9px;
	$headCol:#fff;
	@mixin commonCss{
		margin: 0;
		padding: 0;
		border: 0;
	}
	*{
		@include commonCss;
	}
	.header{
		color: $headCol;
		position: relative;
		background: rgba(7,17,27,0.5);
		overflow: hidden;
		.content-wrapper{
			padding: 24px 12px 18px 24px;
			font-size:0;
			position: relative;
			.avatar,.content{
				display: inline-block;
				font-size: 14px;
				/*vertical-align: middle;*/
			}
			.avatar{
				-webkit-border-radius: 2px;
				border-radius: 2px;
				vertical-align: top;
			}
			.content{
				margin-left: 16px;
				.title{
					margin: 2px 0 8px 0;
					.brand{
						display: inline-block;
						vertical-align: top;
						width: 30px;
						height: 18px;
						@include bg-img('brand');
						background-size: 30px 18px;
						background-repeat: no-repeat;
					}
					.name{
					margin-left: 6px;
					font-size: 16px;
					line-height: 18px;
					font-weight: bold;
					}
				}
				.description{
					margin-bottom: 10px;
					line-height: 12px;
					font-size: 12px;
				}
				.supports{
					.icon{
						display: inline-block;
						width: 12px;
						height: 12px;
						margin-right: 4px;
						background-size: 12px 12px;
						background-repeat: no-repeat;
						vertical-align: middle;
						&.decrease{
							@include bg-img('decrease_1');
						}
						&.discount{
							@include bg-img('discount_1');
						}
						&.guarantee{
							@include bg-img('guarantee_1');
						}
						&.invoice{
							@include bg-img('invoice_1');
						}
						&.special{
							@include bg-img('special_1');
						}
					}
					.text{
							line-height: 12px;
							font-size: 10px;
						}
				}
			}
			.support-count{
				position: absolute;
				right: 12px;
				bottom: 18px;
				padding: 0 8px;
				height: 24px;
				line-height: 24px;
				-webkit-border-radius: 14px;
				border-radius: 14px;
				background: rgba(0,0,0,0.2);
				text-align: center;
				.count,.icon-keyboard_arrow_right{
					font-size: 10px;
				}
				.count{vertical-align:top;line-height: 24px;}
				.icon-keyboard_arrow_right{line-height: 24px;margin-left: 2px;font-size: 20px;}
			}
		}
		.bulletin-wrapper{
			height: 28px;
			line-height: 28px;
			padding: 0 22px 0 12px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			position: relative;
			background: rgba(7,17,27,0.2);
			.bulletin-title{
				display: inline-block;
				vertical-align:top;
				margin-top: 8px;
				width: 22px;
				height: 12px;
				@include bg-img('bulletin');
				background-size: 22px 12px;
				background-repeat: no-repeat;
			}
			.bulletin-text{
				font-size: 10px;
				margin: 0 4px;
				vertical-align:top;
			}
			.icon-keyboard_arrow_right{
				position: absolute;
				/*font-size: 10px;*/
				font-size: 20px;
				vertical-align: middle;
				right: 12px;
				/*top: 8px;*/
				top: 4px;
			}
		}
		.background{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			filter: blur(10px);/*滤镜*/
			img{
				display: block;
				width: 100%;
				height: 100%;
			}
			
		}
		.detail{
			position: fixed;
			z-index: 100;
			top: 0;
			left: 0;
			width: $wid;
			height: $hei;
			overflow: auto;
			backdrop-filter:blur(10px);
			/*transition: all 0.5s;*/
			background: rgba(7,17,27,0.8);
			
			&.fade-enter-active, &.fade-leave-active{
				transition: opacity .5s
			}
			&.fade-enter,&.fade-leave-active{
				opacity: 0;
			}
			.detail-wrapper{
				min-height: 100%;
				width: $wid;
				.detail-main{
					margin-top: 64px;
					padding-bottom: 64px;
					.name{
						line-height: 16px;
						text-align: center;
						font-size: 16px;
						font-weight: 700;
					}
					.star-wrapper{
						margin-top: 18px;
						padding: 2px 0;
						text-align: center;
					}
				}
			}
			.title{
				display: flex;
				width: 80%;
				margin: 28px auto 24px auto;
				.line{
					flex: 1;
					position: relative;
					top: -6px;
					border-bottom: 1px solid rgba(255,255,255,0.2);
				}
				.text{
					padding: 0 12px;
					font-weight: 700;
					font-size: 14px;
				}
				
			}
			.supports{
					width: 80%;
					margin: 0 auto;
					.support-item{
						padding: 0 12px;
						margin-bottom: 12px;
						font-size: 0;
						&:last-child{
							margin-bottom: 0;
						}
						.icon{
							display: inline-block;
							width: 16px;
							height: 16px;
							vertical-align: top;
							margin-right: 6px;
							background-size: 16px 16px;
							background-repeat: no-repeat;
							&.decrease{
								@include bg-img('decrease_2');
							}
							&.discount{
								@include bg-img('discount_2');
							}
							&.guarantee{
								@include bg-img('guarantee_2');
							}
							&.invoice{
								@include bg-img('invoice_2');
							}
							&.special{
								@include bg-img('special_2');
							}
						}
						.text{
							line-height: 16px;
							font-size: 12px;
						}
					}
				}
				
				.bulletin{
					width: 80%;
					margin: 0 auto;
					.content{
						padding: 0 12px;
						line-height: 24px;
						font-size: 12px;
					}
				}
			.detail-close{
					position: relative;
					width: 32px;
					height: 32px;
					margin: -64px auto 0 auto;
					clear: both;
					font-size: 32px;
			}
		}
	}
</style>