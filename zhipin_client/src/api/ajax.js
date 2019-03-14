import axios from 'axios'
export default function ajax( url='', data={}, type='GET' ) {
  if(type === 'GET'){
    //data={username:dashen,password:123}   type: 'dashen'
    //  username=dashen&password=123
    var dataStr = '';
    Object.keys(data).forEach( key=>{
      dataStr += key+'='+data[key]+'&'
    } )
    if(dataStr){
      dataStr= dataStr.substring(0,dataStr.length-1)
    }
   return axios.get(url+'?'+dataStr)  //记住加return
  }else {
   return axios.post(url,data)   //记住加return
  }
}