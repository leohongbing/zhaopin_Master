import React,{Component} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import  HeaderSelector  from '../../../components/header-selector/header-selected'
import { updateUser } from '../../../redux/actions'
import {
  NavBar,
  InputItem,
  TextareaItem,
  Button
} from 'antd-mobile'
class LaobanInfo extends Component{
 state={
   header: '', // 头像名称
   post: '', // 职位
   info: '', // 个人或职位简介
   company: '', // 公司名称
   salary: '' // 工资
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

};
  render(){
    const { header,type } = this.props.user;
    if(header){
      const path = type ==='laoban'? 'laoban':'dashen'
      return <Redirect to={path}/>
    }
    return(
      <div>
        <NavBar>老板信息完善</NavBar>
        <HeaderSelector setH={this.setH}/>
        <InputItem placeholder= '请输入招聘职位' onChange={(val)=>{this.setInfo('post',val)}}>招聘职位</InputItem>
        <InputItem placeholder= '请输入公司名称' onChange={(val)=>{this.setInfo('company',val)}}>公司名称</InputItem>
        <InputItem placeholder= '请输入职位薪资' onChange={(val)=>{this.setInfo('salary',val)}}>职位薪资</InputItem>
        <TextareaItem title='职位要求'
                      rows={2}
                      onChange={(val)=>{this.setInfo('info',val)}}/>
        <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
      </div>

    )
  }
}
export default connect(
  state => ({user:state.user}),
  {updateUser}
)(LaobanInfo)