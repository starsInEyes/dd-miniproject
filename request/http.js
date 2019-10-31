let domain;
switch(process.env.NODE_ENV){
  // case 'development': domain = 'http://10.10.150.148:8022';break;
  // case 'development': domain = 'http://10.10.150.196:8022';break;
  case 'development': domain = 'http://121.40.155.130/dingtalk';break;
  case 'production': domain = 'http://121.40.155.130/dingtalk';break;
}


export function ddget(url, params){
  return new Promise((resolve, reject)=>{
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
        resolve(res);
      },
      fail: function(res){
        console.log(res);
        reject(res);
      }
    })
  })
}