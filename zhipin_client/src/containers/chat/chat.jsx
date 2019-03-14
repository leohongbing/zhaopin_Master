/*
对话聊天的路由组件
*/
import React, {Component} from 'react'
import {NavBar, List, InputItem,Grid,Icon} from 'antd-mobile'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { sendMsg,msgRead }  from '../../redux/actions'

const Item = List.Item
class Chat extends Component {
  componentWillMount(){
    this.emojis = ['😂','😀','😃','🙃','😊','😂','😀','😃','🙃','😊','😂','😀','😃','🙃','😊','😂','😀','😃','🙃','😊','😂','😀','😃','🙃','😊',
      '😂','😀','😃','🙃','😊','😂','😀','😃','🙃','😊','😂','😀','😃','🙃','😊','😂','😀','😃','🙃','😊','😂','😀','😃','🙃','😊']
    this.emojis = this.emojis.map((emoji)=>({text:emoji}))
    const from = this.props.match.params.userid
    const to = this.props.user._id
    this.props.msgRead(from,to)
  }

  componentDidMount() {
// 初始显示列表
    window.scrollTo(0, document.body.scrollHeight)

  }
  componentDidUpdate () {
// 更新显示列表
    window.scrollTo(0, document.body.scrollHeight)
    console.log(document.body.scrollHeight)
  }
  componentWillUnmount(){
    //修改当前未读消息数量
    const from = this.props.match.params.userid
    const to = this.props.user._id
    this.props.msgRead(from,to)
    console.log('qqq')
  }
  toggleShow =()=>{
    const isShow = !this.state.isShow
    this.setState({isShow})
    if(isShow) {
// 异步手动派发 resize 事件,解决表情列表显示的 bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }
  handleSend=()=>{
    const from = this.props.user._id
    const to = this.props.match.params.userid
    const content = this.state.content
    if(content){
      this.props.sendMsg({from,to,content})
    }
    this.setState({
      content:'',
      isShow:false
    })
  }
  state = {
    content:'',
    isShow:false
  }
  render() {
    const { users,chatMsgs } = this.props.chat
    const meId = this.props.user._id
    const targetId = this.props.match.params.userid
    if(!users[meId]){
      return null
    }
    const targetHeader = users[targetId].header
    const header =  targetHeader? require(`../../assets/images/${targetHeader}.png`):null
    const chat_id = [meId,targetId].sort().join('_')
    const msgs = chatMsgs.filter(msg=>msg.chat_id ===chat_id)
    return (
      <div id='chat-page'>
        <NavBar
          className='sticky-nav'
          icon={<Icon type='left'/>}
          onLeftClick={() => this.props.history.goBack()}
        >
          {users[targetId].username}
        </NavBar>
      <List  style={{marginBottom:50,marginTop:45}}>
        <QueueAnim type='scale' duration={500}>  {/*动画内置参数 alpha left right top bottom scale scaleBig scaleX scaleY*/}
          { msgs.map((msg)=>{
            if(msg.from === targetId){
              return <Item
                key={msg._id}
                thumb={header}
              >
                {msg.content}
              </Item>
            }else {
              return <Item
                key={msg._id}
                className='chat-me'
                extra=' 我'
              >
                {msg.content}
              </Item>
            }
          }) }
        </QueueAnim>
      </List>
        <div className='am-tab-bar'>
          <InputItem
            placeholder=" 请输入"
            value={this.state.content}
            onChange={val => this.setState({content: val})}
            onFocus={() => this.setState({isShow: false})}
            extra={
              <span>
                <span onClick={this.toggleShow}
                       style={{marginRight: 10}}
                >😊</span>
              <span onClick={this.handleSend}>发送</span>
              </span>
            }
          />
          {
            this.state.isShow ? (
              <Grid
                style={{touchAction: 'none'}}
                data={this.emojis}
                columnNum={8}
                carouselMaxRow={4}
                isCarousel={true}
                onClick={(item) => {
                  this.setState({content: this.state.content + item.text})
                }}
              />
            ) : null
          }
        </div>
    </div>
  )
  }
}
export default connect(
  state=>({user:state.user,chat:state.chat}),
  {sendMsg,msgRead}
)(Chat)
