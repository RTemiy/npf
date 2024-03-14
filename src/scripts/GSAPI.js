export default class GoogleAppScriptAPI {
  constructor(link) {
    this._link = link
  }

  getData(){
    return fetch(`${this._link}`,{
      method: 'GET'
    }).then(res=>{
      return res.json()})
  }

  post(data){
    let allData = '';
    for(let prop in data){
      allData += `&${prop}=${data[prop]}`;
    }
    return fetch(`${this._link}?act=main${allData}`,{
      method: 'POST',
    })
  }
}