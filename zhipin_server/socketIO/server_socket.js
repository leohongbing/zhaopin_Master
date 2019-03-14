const { ChatModel,UserModel } = require('../db/models')
module.exports = function (server) {
  const io = require('socket.io')(server)
  //监视连接
  io.on('connection',function (scoket) {
    console.log('有客户连接成功')
    scoket.on('sendMsg',function ({content,from,to}) { //接受到浏览器发送的消息
      //保存信息到chatModel
      const chat_id = [to,from].sort().join('_')
      const create_time = Date.now()
      UserModel.find(function (err, docs) {
        const users = docs.reduce((users,user)=>{
          users[user._id] = {username: user.username, header: user.header};
          return users
        },{})
        new ChatModel({from,to,content,read:false,create_time,chat_id}).save(function (err, chatMsg) {
          console.log(chatMsg)
          //把信息发送的消息发送者和消息接受者
          io.emit('receiveMsg',{chatMsg,users})
        })
      })
    })
  })

}
