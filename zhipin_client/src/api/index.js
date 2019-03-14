/*包含n个请求参数的模块
* 返回的是promise对象*/
import ajax from './ajax'
//请求注册
export const reqRegister = (user) => ajax('/register',user,'POST')
//请求登陆
export const reqLogin = ({ username,password }) => ajax('/Login',{ username,password },'POST')
//请求更新信息
export const reqUpdate = ( user ) => ajax('/update',user,'POST')
//获取user信息
export const reqGetUser = () =>ajax('/user')
//获取指定用户列表
export const reqUserList = (type) => ajax('/userlist',type)
//获取消息列表
export const reqMsgList = ()=> ajax('/msglist')

//修改已读消息
export const reqMsgRead = (from,to)=> ajax('/readmsg',{from,to},'POST')
export const initMsg = (from,to)=> ajax('/initmsg',{from,to},'POST')
