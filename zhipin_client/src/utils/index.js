/*包含n个工具函数模块*/

//只能跳转路由工具
// laoban dashen   路由/laoban  /dashen     根据type判断
//完善信息   路由 /laobaninfo /dasheninfo   根据是否有header判断
export function getRedirectTo(type,header) {
  let path;
  if(type === 'laoban'){  //type
    path = '/laoban'
  }else if(type === 'dashen'){
    path = '/dashen'
  }
  if(!header){  //header
    path += 'info'
  }
  return path
}