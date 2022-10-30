/*
包含所有 action creator 函数的模块
*/
//引入客户端io
import  io  from 'socket.io-client'
import {
  reqLogin,
  reqRegister,
  reqUpdate,
  reqGetUser,
  reqUserList,
  reqMsgList,
  reqReadMsg,
  reqMsgRead,
  initMsg
} from '../api'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  READ_MSG,
  RECEIVE_MSG_LIST,
  MSG_READ,
  INIT_MSG
} from './action-type'
//同步action
const authSuccess = (user)=>({ type:AUTH_SUCCESS,data:user })
const errorMsg = (msg)=>({type:ERROR_MSG,data:msg})
const receiveUser = (user) => ({type:RECEIVE_USER,data:user})
export const resetUser = (msg) => ({type:RESET_USER,msg})
const receiveUserList = (userList) => ({type:RECEIVE_USER_LIST,data:userList})
const receiveMsgList = ({users,chatMsgs,userid}) => ({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
const readMsg = (chatMsg,userid,users) => ({type:READ_MSG,data:{chatMsg,userid,users}})
const msg_Read = (from,to,count) => ({type:MSG_READ,data:{from,to,count}})
const init_msg = (chatMsgs) => ({type:INIT_MSG,data:chatMsgs})
function connectSocket(dispatch,userid) {
  if(!io.socket){
    //连接服务器返回连接对象
    io.socket = io('ws://127.0.0.1:4000')
    //绑定监听接受来自服务端的消息
    io.socket.on('receiveMsg',function ({chatMsg,users}) {
      if(userid === chatMsg.from || userid === chatMsg.to){
        dispatch(readMsg(chatMsg,userid,users))
      }
    })
  }
}
//发送聊天相关信息异步action
export const sendMsg = ({from,to,content})=>{
  return async (dispatch)=>{
    io.socket.emit('sendMsg',{from,to,content})
    const result = await initMsg(from)
    const { chatMsgs } = result.data
    if(result.data.code === 0){
      dispatch(init_msg(chatMsgs))
    }
  }
}

//获取消息列表异步action
async function getMsgList(dispatch,userid){
  connectSocket(dispatch,userid);
  const response = await reqMsgList()
  const result = response.data
  const { users,chatMsgs } = result.data
  if(result.code===0){
    dispatch(receiveMsgList({ users,chatMsgs,userid }))
  }
}
//读取某个人消息异步action
export const msgRead = (from,to)=>{
  return async dispatch=>{
    const response = await reqMsgRead(from,to)
    const result = response.data
    if(result.code === 0){
      const count = result.data
      dispatch(msg_Read(from,to,count))
    }
  }
}

//注册异步action
export const register = (user)=>{
  const { username,password,password2,type } = user;
  if(!username){
    return errorMsg('请输入用户名')
  }else if (password !== password2){
    return errorMsg('两次密码输入不一致')
  }
  return async dispatch => {
// 异步 ajax 请求 , 得到响应
    const response = await reqRegister({username,password,type})
// 得到响应体数据
    const result = response.data
// 如果是正确的
    if (result.code === 0) {
      getMsgList(dispatch,result.data.user_id)
// 分发成功的 action
      dispatch(authSuccess(result.data))
    } else {
// 分发提示错误的 action
      dispatch(errorMsg(result.msg))
    }
  }
}

//登陆异步action
export const login = (user)=>{

  const { username,password } = user;
  if(!username){
    return errorMsg('请输入用户名')
  }else if (!password){
    return errorMsg('请输入密码')
  }
  return async dispatch =>{
    const response = await reqLogin({ username,password });
    const result = response.data
    if(result.code === 0){ //登陆或注册成功
      getMsgList(dispatch,result.data._id)
      dispatch(authSuccess(result.data)) //分发授权成功的action
    }else {
      dispatch(errorMsg(result.msg))
    }
  }
}

//更新异步action 用户信息
export const updateUser =(user)=>{
  return async dispatch =>{
    const response = await reqUpdate(user)
    const result = response.data
    if(result.code === 1){
      dispatch(resetUser(result.msg))
    }else {
      dispatch(receiveUser(result.data))
    }
  }
}
//获取user信息自动登录
export const getUser = () => {
  return async dispatch=>{
    const response = await reqGetUser()
    const result = response.data
    //判断是否成功得到user
    if(result.code === 0){
      getMsgList(dispatch,result.data._id)
      dispatch(receiveUser(result.data))
    }else {
      dispatch(resetUser(result.msg))
    }
  }
}

//获取用户列表
export const getUserList = (type) => {
  return async dispatch =>{
    const response = await reqUserList(type)
    const result = response.data
    if(result.code === 0){
      dispatch(receiveUserList(result.data))
    }
  }
}
