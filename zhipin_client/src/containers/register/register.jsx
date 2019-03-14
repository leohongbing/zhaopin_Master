import React,{Component} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button
} from 'antd-mobile'
import Logo from '../../components/logo/logo'
import { register } from '../../redux/actions'
import '../../assets/css/asset.less'
const Item = List.Item;

class Register extends Component{
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:'',
      password2:'',
      type:'laoban'
    }
  }
  handleChange = (name,value)=> {
   this.setState({
     [name]: value
   });
 };
  register = ()=>{
    this.props.register(this.state)
  };
  toLogin=()=>{
    this.props.history.replace('./login')
  };
  render(){
    const { msg,redirect } = this.props
    if(redirect){
      return <Redirect to={redirect}/>
    }
    return(
      <div>
        <NavBar>硅 谷 直 聘</NavBar>
        <Logo/>
        <WingBlank>
          {msg? <p className='error-msg'>{msg}</p>:null}
          <InputItem  placeholder='请输入用户名' onChange={val=>{this.handleChange('username',val)}}>
            <WhiteSpace/>
            用户名：
            <WhiteSpace/>
          </InputItem>
          <InputItem placeholder='请输入密码' type='password' onChange={val=>{this.handleChange('password',val)}}><WhiteSpace/>密&nbsp;&nbsp;&nbsp;码：<WhiteSpace/>
          </InputItem>
          <InputItem placeholder='请确认密码' type='password' onChange={val=>{this.handleChange('password2',val)}}><WhiteSpace/>确认密码：<WhiteSpace/>
          </InputItem>
            <Item>
              <WhiteSpace/>
              <span>用户类型:</span>
              &nbsp;&nbsp;&nbsp;
              <Radio checked={this.state.type === 'dashen'} onClick={()=>{this.handleChange('type','dashen')}}>大神</Radio>
              &nbsp;&nbsp;&nbsp;
              <Radio checked={this.state.type === 'laoban' } onClick={()=>{this.handleChange('type','laoban')}}>老板</Radio>
              <WhiteSpace/>
            </Item>
          <Button type='primary' onClick={this.register}>注册</Button>
          <Button onClick={this.toLogin}>已有用户</Button>
        </WingBlank>
      </div>
    )
  }
}
export default connect(
  state => state.user,
  {register}
)(Register)