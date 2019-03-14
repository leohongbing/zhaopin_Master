import React,{Component} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { updateUser } from '../../../redux/actions'

import  HeaderSelector  from '../../../components/header-selector/header-selected'
import {
  NavBar,
  InputItem,
  TextareaItem,
  Button
} from 'antd-mobile'
class DashenInfo extends Component{
  state={
    header: '', // 头像名称
    post: '', // 职位
    info: '', // 个人或职位简介
  }
  setInfo=(name,val)=>{
    this.setState({
      [name]:val
    })
  }
  setH=(header)=>{
    this.setState({
      header
    })
  }
  save=()=>{
    this.props.updateUser(this.state)
  }
  render(){
    const { header,type } = this.props.user;
    if(header){
      const path = type ==='laoban'? 'laoban':'dashen'
      return <Redirect to={path}/>
    }
    return(
      <div>
        <NavBar>大神信息完善</NavBar>
        <HeaderSelector setH={this.setH}/>
        <InputItem placeholder= '请输入求职岗位' onChange={(val)=>{this.setInfo('post',val)}}>求职岗位</InputItem>
        <TextareaItem title='个人介绍' rows={5} onChange={(val)=>{this.setInfo('info',val)}}/>
        <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
      </div>

    )
  }
}
export default connect(
  state => ({user:state.user}),
  {updateUser}
)(DashenInfo)