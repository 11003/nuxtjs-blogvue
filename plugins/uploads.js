import api from '@/plugins/axios';

async function uploadFile(files,reg='jpg|jpeg|png',key,url='',item){
  if(files.length === 0) return "";
  let RegObj = new RegExp(`^(${reg})$`,"i")
  for(let file of files){
    let type = file.name.split('.').slice(-1)
    if(!RegObj.test(type)){
      alert(`上传类型必须是${reg.replace(/\|/g,',')}其中一个`)
      return '';
    }
  }
  return await QuestFile(files,key,url,item)
}


async function QuestFile(files,key='files',url='',item={}){
  let data = new FormData()
  item.oldfiles = item.oldfiles || []
  for(let file of files){
    data.append(key,file)
  }
  for(let i in item){
    data.append(i,item[i])
  }
  url = url || '';
  const q = {
    data,
    url,
    method: 'post',
    isUploadFile: true
  }
  return new Promise(resolve=>{
    api(q).then((res)=>{
      resolve(res)
    }).catch(()=>{
      resolve("")
    })
  })
}
export default {
  uploadFile
}
