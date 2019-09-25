let domain;
switch(process.env.NODE_ENV){
  case 'development': domain = 'http://10.10.150.148:8022';break;
  case 'production': domain = 'http://fxhy.vaiwan.com';break;
}


export function ddget(url, params){
  return new Promise((resolve, reject)=>{
    dd.httpRequest({
      url: domain + url,
      method: 'get',
      data: params,
      dataType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      },
      success: function(res){
        resolve(res);
      },
      fail: function(res){
        reject(res);
      }
    })
  })
}