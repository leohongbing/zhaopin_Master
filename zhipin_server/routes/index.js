var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5') //引入加密模块
const { UserModel,ChatModel } = require('../db/models') //引入集合
const filter = {password:0,__v:0}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*提供一个用户注册的接口
a) path 为: /register
b) 请求方式为: POST
c) 接收 username 和 password 参数
d) admin 是已注册用户
e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
f) 注册失败返回: {code: 1, msg: '此用户已存在'}*/

// router.post('/register',function (req, res, next) {
//   const {username,password} = req.body;
//   if(username === 'admin'){
//     res.send({code:1,msg:'此用户已存在'})
//   }else {
//     res.send({code:0,data:{_id:'abc', username,password}})
//   }
// });

router.post('/register',function (req, res) {    //注册路由
  const { username,type,password } = req.body      //接受数据
  UserModel.findOne({username},function (err, user) { //数据处理
    if(user){
      res.send({code:1,msg:'用户已存在'}) //判断用户是否存在
    }else {
      new UserModel({username,type,password:md5(password)}).save(function (err,user) { //保存数据到数据库
        const user_id = user._id;
        res.cookie('userid',user_id,{maxAge:1000*60*60*24}) //免登录设置cookie
        res.send({code:0,data:{username,type,user_id}}) //响应数据
      })
    }
  })

});
router.post('/login',function (req, res) { //登陆路由
  const { username,password } = req.body  //接受数据
  UserModel.findOne({username,password: md5(password)},filter,function (err,user) { //处理数据
    if(user){ //登陆成功
      res.cookie('userid',user._id,{maxAge:1000*60*60*24})
      res.send({code:0,data:user})
    }else { //登陆失败
      res.send({code:1,msg:'用户名或密码错误'})
    }
  })
})

//更新路由
router.post('/update',function (req, res) {
  //获取cookies.userid
  const _id = req.cookies.userid
  if (!_id){
    return res.send({code:1,msg:'请重新登陆'})
  }
  //获取数据
  const user = req.body
  //处理数据
  UserModel.findByIdAndUpdate({_id},user,function (err, olduser) {
    if(!olduser){
      //删除cookie
      res.clearCookie('userid')
      res.send({code:1,msg:'请重新登陆'})
    }
    const { username,type,_id } = olduser
    const data = Object.assign({ username,type,_id },user)
    res.send({code:0,data})
  })
})


//获取user信息根据cookie中userid实现自动登录
router.get('/user',function (req,res) {
  const _id = req.cookies.userid //获取userid
  if (!_id){
    return res.send({code:1,msg:'请重新登陆'})
  }
  //查询user信息
  UserModel.findOne({_id},filter,function (err, user) {
    res.send({code:0,data:user})
  })

  }
)

//获取用户列表
router.get('/userlist',function (req,res) {
  const { type } = req.query  //get方式获取数据
  if(!type){
    res.send('未获取到type,请重新登陆')
  }
  //通过获取类型返回相应类型的数组
  UserModel.find({type},filter,function (err, users) {
    res.send({code:0,data:users})
  })
})

//获取当前用户的聊天信息列表
router.get('/msglist',function (req,res) {
  const userid = req.cookies.userid
  UserModel.find(function (err, docs) {
    const users = docs.reduce((users,user)=>{
      users[user._id] = {username: user.username, header: user.header};
      return users
    },{})
    /*
 查询 userid 相关的所有聊天信息
 参数 1: 查询条件
 参数 2: 过滤条件
 参数 3: 回调函数
 */
    ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function (err, chatMsgs) {
      res.send({code:0,data:{users,chatMsgs}})
    })
  })
})
//修改指定消息为已读
router.post('/readmsg',function (req,res) {
  const to = req.body.to
  const from = req.body.from
  //查询条件 更改状态 过滤信息 更新多条 回调
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})
router.post('/initmsg',function (req,res) {
  const from = req.body.from
  //查询条件 更改状态 过滤信息 更新多条 回调
  ChatModel.find({'$or':[{from:from},{to:from}]},filter,function (err, chatMsgs) {
    res.send({code:0,chatMsgs})
  })
})
module.exports = router
