/*包含n个老的state和
action返回新的state函数模块*/
import { combineReducers } from 'redux'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RESET_USER,
  RECEIVE_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  READ_MSG,
  MSG_READ,
  INIT_MSG
} from './action-type'
import {getRedirectTo} from '../utils/index';
const initUser = {
  username:'',
  type:'',
  msg:'',
  redirect:''
};
//user的reducer
const user = function (state = initUser,action) {
  switch(action.type){
    case AUTH_SUCCESS:
      const { type,header } = action.data;
      return {...action.data,redirect: getRedirectTo(type,header)};
    case ERROR_MSG:
      return {...state,msg: action.data}
    case RECEIVE_USER:
      return {...action.data}  //更新user
    case RESET_USER:
      return {...initUser,msg: action.data} //清空user
    default:
      return state
  }
}
//userlist的reducer
const initUserList =[]
const userList = function (state = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST:
      return action.data
    default:
      return state
  }
}
//chat的 reducer
const initMsgList = {
  users:{},
  chatMsgs:[],
  unRead:0
}
const chat = function (state = initMsgList,action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST:
      const {users,chatMsgs,userid} = action.data
      return {
        users,
        chatMsgs,
        unRead: chatMsgs.reduce((preToTal,msg)=>preToTal+ (msg.to===userid && !msg.read? 1:0),0)
      }
    case INIT_MSG:
      return {
        users:state.users,
        chatMsgs:action.data,
        unRead: state.unRead
      }
    case READ_MSG:
      const  {chatMsg} = action.data
      return {
        users:action.data.users,
        chatMsgs:[...state.chatMsgs,chatMsg],
        unRead: state.unRead + (chatMsg.to===action.data.userid && !chatMsg.read? 1:0)
      }
    case MSG_READ:
      const { from,to,count } = action.data
      return {
        users:state.users,
        chatMsgs:state.chatMsgs.map((msg)=>{
          if (msg.from === from && msg.to === to && !msg.read) {

            return {...msg, read: true};
          } else {
            return msg;
          }
        })
        ,
        unRead: state.unRead - count
      }
    default:
      return state
  }
}
const rootReducer = combineReducers({
  user,
  userList,
  chat
})  //user{}  userList[] chat{}
export default rootReducer
