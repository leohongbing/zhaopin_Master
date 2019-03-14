import React,{Component} from 'react'
import QueueAnim from 'rc-queue-anim'
import PropTypes from 'prop-types'
import {
  WhiteSpace,
  WingBlank,
  Card
} from 'antd-mobile'
import { withRouter } from 'react-router-dom'
const Body = Card.Body
const Header = Card.Header
class UserList extends Component{
  static propTypes = {
    userList: PropTypes.array.isRequired
  }
  render(){
    const userList = this.props.userList
    return(
      <div style={{marginBottom:59,marginTop:50}}>
        <QueueAnim type='scale'> {/*动画内置参数 alpha left right top bottom scale scaleBig scaleX scaleY*/}
          { userList.map((user)=>
            <div key={user._id} >
              <WingBlank>
                <div>
                  <WhiteSpace/>
                  <Card onClick={()=>this.props.history.push(`chat/${user._id}`)}>
                    <Header
                      thumb= { user.header? require(`../../assets/images/${user.header}.png`):null }
                      extra={user.username}
                    />
                    <Body>
                    <div>职位: {user.post}</div>
                    <div>公司: {user.company}</div>
                    { user.salary? <div>月薪: {user.salary}</div>:null}
                    { user.info? <div>描述: {user.info}</div>:null}
                    </Body>
                  </Card>
                </div>
              </WingBlank>
            </div>
          ) }
        </QueueAnim>

      </div>
    )
  }
}
export default withRouter(UserList)
