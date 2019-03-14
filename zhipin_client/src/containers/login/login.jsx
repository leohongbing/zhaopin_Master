import React,{Component} from 'react'
import { connect } from 'react-redux'

import {
  NavBar,
  WingBlank,
  InputItem,
  WhiteSpace,
  Button
} from 'antd-mobile'
import Logo from '../../components/logo/logo'
import { login } from "../../redux/actions";
import {Redirect} from "react-router-dom";

class Login extends Component{
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:'',
    }
  }
  handleChange = (name,value)=> {
    this.setState({
      [name]: value
    });
  };
  login = ()=>{
    this.props.login(this.state)
  };
  toRegisteer=()=>{
    this.props.history.replace('./register')
  }
  render(){
    const { msg,redirect } = this.props;
    if(redirect){
      return <Redirect to={redirect}/>
    }
    return(
      <div>
        <NavBar>硅 谷 直 聘</NavBar>
        <Logo/>
        <WingBlank>
          {msg? <p className='error-msg'>{msg}</p>:null}
          <InputItem placeholder='请输入用户名' onChange={val=>{this.handleChange('username',val)}}>
            <WhiteSpace/>
            用户名：
            <WhiteSpace/>
          </InputItem>
          <InputItem placeholder='请输入密码' type='password' onChange={val=>{this.handleChange('password',val)}}><WhiteSpace/>密&nbsp;&nbsp;&nbsp;码：<WhiteSpace/>
          </InputItem>
          <Button type='primary'onClick={this.login}>登陆</Button>
          <Button onClick={this.toRegisteer}>还没有账户</Button>
        </WingBlank>
      </div>
    )
  }
}
export default connect(
  state => state.user,
  {login}
)(Login)