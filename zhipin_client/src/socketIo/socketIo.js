//引入客户端io
import io from 'socket.io-client'
//连接服务器返回连接对象
const scoket = io('ws://localhost:4000')
//绑定监听接受来自服务端的消息
scoket.emit('sendMsg',{name:'leo',content:'aaahhh'})