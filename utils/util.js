// 日期格式化
export function dateFormatter(fmt, date) { //author: meizz 
	var o = {         
		"M+" : date.getMonth()+1, //月份         
		"d+" : date.getDate(), //日         
		"h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时         
		"H+" : date.getHours(), //小时         
		"m+" : date.getMinutes(), //分         
		"s+" : date.getSeconds(), //秒         
		"q+" : Math.floor((date.getMonth()+3)/3), //季度         
		"S" : date.getMilliseconds() //毫秒         
	};         
	var week = {         
		"0" : "/u65e5",         
		"1" : "/u4e00",         
		"2" : "/u4e8c",         
		"3" : "/u4e09",         
		"4" : "/u56db",         
		"5" : "/u4e94",         
		"6" : "/u516d"        
	};         
	if(/(y+)/.test(fmt)){         
		fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));         
	}         
	if(/(E+)/.test(fmt)){         
		fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);         
	}         
	for(var k in o){         
	    if(new RegExp("("+ k +")").test(fmt)){         
	        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
	    }         
	}         
	return fmt; 
}

// 获取排序后的原索引列表
export function getSort (arr){
  // arr = [5, 2, 512, 32, 44]
  // console.log(arr);
  let result = [];
  let tempArr = arr.concat([]);
  let temp;
  for (let i = 0; i<arr.length; i++){
    for (let j = i+1; j<arr.length; j++){
      if (arr[j] > arr[i]){
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
  for (let m = 0; m<arr.length; m++){
    let index = tempArr.indexOf(arr[m]);
    result.push(index);
    tempArr[index] = new Date().getTime() + m;
  }
  return result;
}

// 请准求和
export function preciseSum(arr){
  if (Object.prototype.toString.call(arr)!=='[object Array]') return console.log(arr + ': not a Array');
  if (arr.length === 0) return 0;
  var maxFc = 0, value = [], i, Fl;
  for (i = 0; i < arr.length; i++) {
      if (!/^\-?\d+(\.\d+)?$/.test(arr[i] + '')) return console.log(arr[i] + ': not a Number');
      Fl = (arr[i] + '').split('.')[1] || '';
      maxFc = (Fl.length > maxFc)?Fl.length:maxFc;
  }
  for (i = 0; i < arr.length; i++) {
      Fl = (arr[i] + '').split('.')[1] || '';
      value.push((arr[i] + (Math.pow(10, (maxFc-Fl.length)) + '').substr(1)).replace('.', '') - 0);
  }
  let sum = 0;
  for (i = 0; i<value.length; i++){
    sum += value[i]
  }
  return sum/Math.pow(10, maxFc);
}