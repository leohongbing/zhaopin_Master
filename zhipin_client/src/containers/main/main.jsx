import React,{Component} from 'react'
import { Route,Switch,Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import LaobanInfo from './laoban-info/laoban-info'
import DashenInfo from './dashen-info/dashen-info'
import { getRedirectTo }  from '../../utils'
import { getUser } from '../../redux/actions'
import { NavBar } from 'antd-mobile'
import  Laoban  from '../laoban/laoban'
import Dashen from '../dashen/dashen'
import Message from '../message/message'
import Personal from '../personal/personal'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'
class Main extends Component{

  //把数据放到数组中
  navList = [
    {
      path: '/laoban', // 路由路径
      component: Laoban,
      title: ' 大神列表',
      icon: 'dashen',
      text: ' 大神',
    },
    {
      path: '/dashen', // 路由路径
      component: Dashen,
      title: ' 老板列表',
      icon: 'laoban',
      text: ' 老板',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: ' 消息列表',
      icon: 'message',
      text: ' 消息',
      display:true
},
{
  path: '/personal', // 路由路径
  component: Personal,
  title: ' 用户中心',
  icon: 'personal',
  text: ' 个人',
  display:true

}
]

  // 异步函数调用根据userid返回user数据 ==> userid有redux _id没有
  componentDidMount(){
    const userid = Cookies.get('userid')
    const { _id } = this.props.user
    if(userid && !_id){
      this.props.getUser()
    }
    console.log(this.props)
  }


  render(){
    //实现自动登录功能
    // 根据cookie的userid和redux
    const userid = Cookies.get('userid')
    const { _id,type,header } = this.props.user
    // userid没有，跳转至登陆页面
    if(!userid){
      return <Redirect to= '/login'/>
    }
    // userid有，redux_id没有 暂时不处理返回null等待异步函数调用
    if(userid && !_id){
      return null
    }else {
      // userid和_id都存在根据type和hearder跳转至对应界面
      //如果请求根路径根据type 和 header 跳转至对应页面
      const path = this.props.location.pathname
      if(path === '/'){
        const path = getRedirectTo(type,header)
        return <Redirect to={path}/>
      }
    }
    const { navList } = this; //得到数据
    const path = this.props.location.pathname //得到当前页面path
    const currtNav = navList.find((nav)=> nav.path === path )
    if(currtNav){
      for (var i = 0; i < navList.length; i++) {
        if(type === 'laoban'){  //当前path为laoban  显示第一个
          navList[0].display = true
        }else if(type==='dashen'){ //当前path为dashen  显示第二个
          navList[1].display = true
        }
      }
    }
    const unReadCount = this.props.unRead
    return(
      <div>
        {currtNav? <NavBar className='sticky-nav'>{currtNav.title}</NavBar> :null}

        <Switch>
          {  navList.map((item,index)=>{ return <Route key={index} path={item.path} component={item.component}/>}) }
          <Route path='/laobaninfo' component={ LaobanInfo }/>
          <Route path='/dasheninfo' component={ DashenInfo }/>
          <Route path='/chat/:userid' component={ Chat }/>
        </Switch>
        {currtNav? <NavFooter  navList={navList} unReadCount={unReadCount}/> :null}
      </div>

    )
  }
}
export default connect(
  state=>({user:state.user,unRead:state.chat.unRead}),
{getUser}
)(Main)

//实现自动登录功能
/*根据cookie的userid和redux
userid没有，跳转至登陆页面
userid有，redux_id没有 暂时不处理返回null等待异步函数调用
userid和_id都存在根据type和hearder跳转至主界面
异步函数调用根据userid返回user数据
*/
