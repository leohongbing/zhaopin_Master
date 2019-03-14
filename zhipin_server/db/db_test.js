// 1. 连接数据库
// 1.1. 引入 mongoose
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')
// 1.2. 连接指定数据库 (URL 只有数据库是变化的 )
 mongoose.connect('mongodb://localhost:27017/gzhipin_test2',{ useNewUrlParser: true })
// 1.3. 获取连接对象
const coon = mongoose.connection
// 1.4. 绑定连接完成的监听 ( 用来提示连接成功 )
coon.on('connected',function () {
  console.log('连接数据库成功')
})
// 2. 得到对应特定集合的 Model
const userSchema = mongoose.Schema({
  username:{ type:String,required:true },
  password:{ type:String,required:true },
  type:{ type:String,required:true },
  acater:{type: String}
})
// 2.1. 字义 Schema( 描述文档结构 )

// 2.2. 定义 Model( 与集合对应 , 可以操作集合 )
const UserModel = mongoose.model('user',userSchema)
// 3. 通过 Model 或其实例对集合数据进行 CRUD 操作
function testSave() {
  const user ={
    username:'bob',
    password: md5('123'),
    type:'dashen'
  }
  const userModel = new UserModel(user)
  userModel.save(function (err, user) {
    console.log(err,user,'save()')
  })
}
//testSave()

// 3.1. 通过 Model 实例的 save() 添加数据
// 3.2. 通过 Model 的 find()/findOne() 查询多个或一个数据
function findTest() {
  const userModel = new UserModel()
  UserModel.find({username:'leo',limit:1},{limit:1},function (err, users) {
    console.log(err,users)
  })
}
//findTest()
// 3.3. 通过 Model 的 findByIdAndUpdate() 更新某个数据
function updataTest() {
  UserModel.findByIdAndUpdate({_id:'5c335fa76b91a91718a2dd14'},{username:'luo'},function (err, olduser) {
    console.log(err,olduser)
  })
}
//updataTest()
// 3.4. 通过 Model 的 remove() 删除匹配的数据
function removeTest() {
  UserModel.remove({username:'leo'},function (err,user) {
    console.log(err,user)
  })
}
removeTest()
