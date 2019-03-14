/*
对话消息列表组件
*/
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import { msgRead }  from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief
function getLastMsg(chatMsgs,meId) {
  // 对chatMsgs进行分组获取对象{userid:lastMsg}
   const lastMsgObjs = {}
   //给每一个msg下发一个标识
   chatMsgs.forEach((msg)=>{
     if (msg.to === meId && !msg.read) {
       msg.unRead= 1
     }else {
       msg.unRead= 0
     }
     const userid = msg.chat_id
     let lastMsgObj = lastMsgObjs[userid]
     if(!lastMsgObj){//lastMsgObjs[userid]没有值
       lastMsgObjs[userid] = msg
     }else{//lastMsgObjs[userid]有值
       const unRead= lastMsgObj.unRead+ msg.unRead
       if(msg.create_time > lastMsgObj.create_time){
         lastMsgObjs[userid] = msg
       }
       lastMsgObjs[userid].unRead= unRead
     }

   })
  // 获取lastMsg数组
  const  lastMsgs = Object.values(lastMsgObjs)
  //对数组进行排序（降序）
  lastMsgs.sort(function (m1, m2) {
    return m2.create_time - m1.create_time
  })
  console.log(lastMsgs)
  return lastMsgs
}
class Message extends Component {
  render() {
    const user = this.props.user
    const meId = user._id
    const { users,chatMsgs } = this.props.chat
    const lastMsgs = getLastMsg(chatMsgs,meId)
    return (
      <List style={{marginBottom:50,marginTop:50}}>
        { lastMsgs.map((msg)=>{
          const targetUserId = meId === msg.from ? msg.to : msg.from;
          const targetHeader = users[targetUserId].header;
          return (
            <Item
              extra={<Badge text={msg.unRead}/>}
              thumb={targetHeader? require(`../../assets/images/${targetHeader}.png`):null}
              arrow='horizontal'
              onClick={()=>{ this.props.history.push(`/chat/${targetUserId}`) }}
              key={msg._id}
            >
              {  users[targetUserId].username }
              <Brief>{ msg.content }</Brief>
            </Item>
          )
        }) }
      </List>
    )
  }
}
export default connect(
  state=>({user:state.user,chat:state.chat}),
  {}
)(Message)
