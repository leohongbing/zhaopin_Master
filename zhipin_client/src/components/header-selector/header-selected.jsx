import React,{Component} from 'react'
import { Grid,List } from 'antd-mobile'
export default class HeaderSelector extends Component{
  constructor(props) {
    super(props);
    this.headerList = [];
    // 头像结构 ==> [{icon,text}]
    for (var i = 0; i < 20;i++) {
      this.headerList.push({
        icon: require(`../../assets/images/头像${i+1}.png`),
        text: '头像'+(i+1)
      })
    }
  }
  state={
    icon:null
  }
  header=({icon,text})=>{
    this.props.setH(text)
    this.setState({
      icon
    })
  }
  render(){
    const icon = this.state.icon
    const listHeader = !icon? '请选择头像':(
      <div >
        <span>已选择头像：</span>
        <img src={icon} alt="" width= '24px'/>
      </div>
    );
    return(
      <div>
        <List renderHeader={()=> listHeader} >
          <Grid data={this.headerList} 
                columnNum={5}
                onClick= {this.header}/>
        </List>
      </div>
    )
  }
}