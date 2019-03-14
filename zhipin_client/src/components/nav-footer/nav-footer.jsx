import React,{Component} from 'react'
import { TabBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom' //引入withRouter让组件拥有与Router组件一样api
import PropTypes from 'prop-types'
class NavFooter extends Component{
  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadCount: PropTypes.number.isRequired
  }
  render(){
    const Item = TabBar.Item;
    let { navList } = this.props
    const path = this.props.location.pathname
    navList = navList.filter((nav)=> nav.display )
    return(
      <div>
        <TabBar>
          {
            navList.map((nav)=>{
              return <Item key={nav.path}
                           title={nav.text}
                           badge={nav.path==='/message'? this.props.unReadCount:0}
                           icon={{uri:require(`./images/${nav.icon}.png`)}}
                           selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                           selected={ nav.path===path }
                           onPress={()=>{this.props.history.replace(nav.path)}}/> //跳转至当前页面
            })
          }
        </TabBar>
      </div>
    )
  }
}
export default withRouter(NavFooter)