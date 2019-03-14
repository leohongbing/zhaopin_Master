import React,{Component} from 'react'
import { connect } from 'react-redux'
import  UserList  from '../../components/userlist/userlist'
import { getUserList } from '../../redux/actions'
class Dashen extends Component{
  componentDidMount(){
    let type = this.props.user.type
    let untype
    if(type ==='dashen'){
      untype = 'laoban'
    }

    this.props.getUserList({type:untype})
  }
  render(){
    const userList = this.props.userList
    return(
      <UserList userList={userList}/>
    )
  }
}
export default connect(
  state=>({userList:state.userList,user:state.user}),
  {getUserList}
)(Dashen)