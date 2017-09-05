<template>
	<div class="ratingselect">
		<div class="rating-type" border-1px>
			<span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价{{selectType}}</span>
		</div>
	</div>
</template>
<script>
	const POSITIVE=0;
	const NEGATIVE=1;
	const ALL=2;
	export default{//评价模板
		props:{
			ratings:{
				type:Array,
				default(){
					return[];
				}
			},
			selectType:{
				type:Number,
				default:ALL
			},
			onlyContent:{
				type:Boolean,
				default:false
			},
			desc:{
				type:Object,
				default(){
				 return{
				 	all: "全部",
				 	positive: "满意",
					 negative: "不满意"
				 }
				}
			}
		},
		computed:{
			positives(){
				return this.ratings.filter((rating)=>{
					return rating.rateType===POSITIVE
				})
			},
			negatives(){
					return this.ratings.filter((rating)=>{
					return rating.rateType===NEGATIVE
				})
			}
		},
		methods:{
			select(type,event){
				if(!event._constructed){
					return;
				}
//				this.selectType=type 错的写法，props里的值是只读的，不能赋值
				this.$emit('update:selectType', type)//子组件更新父组件绑定在子组件的值   在父组件中用:selectType.sync="selectType"的写法
				console.log(type)
				
			},
			toggleContent(event){
				if(!event._constructed){
					return;
				}
//				let _onlyContent = this.onlyContent;
//				this._onlyContent=!this._onlyContent;
//				this.$emit('togglecontent',this._onlyContent);
				this.$emit('update:onlyContent', !this.onlyContent)
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
@import "../../common/scss/mixin.scss";

	.ratingselect{
		.rating-type{
			padding: 18px 0;
			margin:0 18px;
		  @include border-1px(rgba(7,17,27,0.1));
		  font-size:0;
		  .block{
		  	display: inline-block;
		  	padding: 8px 12px;
		  	-webkit-border-radius: 1px;
		  	border-radius: 1px;
		  	margin-right: 8px;
		  	color: rgb(77,85,93);
		  	font-size: 12px;
		  	.count{
		  		margin-left:2px;
		  		line-height:16px;
		  		font-size:8px;
		  	}
		  	&.active{
		  		color:#fff;
		  	}
		  }
		  .positive{
		  	background: rgba(0,160,220,0.2);
		  	&.active{
		  		background:rgb(0,160,220);
		  	}
		  }
		  .negative{
		  	background: rgba(77,85,93,0.2);
		  	&.active{
		  		background:rgb(77,85,93);
		  	}
		  }
		}
		.switch{
		padding:12px 18px;
		line-height: 24px;
		border-bottom:1px solid rgba(7,17,27,0.1);
		color: rgb(147,153,159);
		font-size: 0;
			.icon-check_circle{
				display: inline-block;
				vertical-align: top;
				margin-right: 4px;
				font-size: 24px;
			}
			.text{
				font-size: 12px;
			}
		}
		.on{color:#00a0dc;}
	}
</style>