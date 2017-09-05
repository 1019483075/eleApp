var express=require('express');
var config=require('./config/index');//这个是es5引入文件路径的方法，在node中要这么写 类似于es6中的import from

var port=process.env.PORT||config.build.port;//这个变量就变成9000了
var app=express();
var router=express.Router();//Router是express框架中的一个方法
router.get('/',function(req,res,next){//
	req.url='/index.html';
	next();//router里面往下执行的一个方法
});
app.use(router);
//创建引用数据库文件
var appData=require('./data.json');
//引入数据库文件
var seller=appData.seller;
var goods=appData.goods;
var ratings=appData.ratings;
//开虚拟服务器的库
var apiRoutes=express.Router();
apiRoutes.get('/seller',function(req,res){
	res.json({
		error:0,
		seller:seller
	});
});
apiRoutes.get('/ratings',function(req,res){
	res.json({
		error:0,
		data:ratings
	});
});
apiRoutes.get('/goods',function(req,res){
	res.json({
		error:0,
		data:goods,
		
	});
});
//加载路由中间键
app.use('/api',apiRoutes)


app.use(express.static('./dist'));

module.exports=app.listen(port,function(err){
	if(err){
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:'+port+'\n')
});