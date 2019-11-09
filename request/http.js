let domain;
switch(process.env.NODE_ENV){
  // case 'development': domain = 'http://10.10.150.148:8022';break; // 小刚
  // case 'development': domain = 'http://10.10.150.196:8022';break; // 本地
  case 'development': domain = 'http://121.40.155.130/dingtalk';break; // 线上
  case 'production': domain = 'http://121.40.155.130/dingtalk';break;
}

let requestTime = 0;
export function ddget(url, params){
  return new Promise((resolve, reject)=>{
    let t0 = new Date().getTime();
    dd.httpRequest({
      url: domain + url,
      method: 'get',
      data: params,
      dataType: 'json',
      timeout: 120000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      },
      success: function(res){
        let tx = new Date().getTime() - t0;
        
        if (requestTime) {
          tx > requestTime? resolve(res) : setTimeout(()=>{ resolve(res) }, requestTime - tx)
        } else resolve(res);
      },
      fail: function(res){
        console.log(res);
        dd.alert({title:res.errorMessage});
        reject(res);
      }
    })
  })
}