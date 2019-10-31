import F2 from '@antv/my-f2';
import {
  getMonthApi,
  getShouldApi,
  getList,
  getParkingLine,
  getParkingToday,
  getParkingProgress,
  getConventionCircle,
  getConventionOther
} from '../../request/api'
import { dateFormatter, getSort } from '../../utils/util'

const app = getApp();

let chart = null;
let today = dateFormatter('yyyy-MM-dd', new Date())

function drawChart(canvas, width, height, data) {
  chart = new F2.Chart({
    el: canvas,
    padding: [30, 'auto', 'auto', 'auto'],
    width,
    height
  });
  chart.source(data);
  chart.guide().text({
    position: ['-6%', '-7%'],
    content: '万元',
    style: {
      fontSize: '12px',
      fontWeight: 'bold'
    }
  })
  chart.guide().text({
    position: ['100%', '107.3%'],
    content: '月',
    style: {
      fontSize: '12px',
      fontWeight: 'bold'
    }
  })
  chart.legend(false)
  chart.tooltip({
    // showTitle: true,
    // layout: 'vertical',
    itemMarkerStyle:{
      symbol: 'square',
    },
    background:{
      radius: 4,
      fill: '#e2e2e2',
      padding: [5.5, 5]
    },
    titleStyle:{ fill: '#333' },
    nameStyle:{ fill: '#333' },
    valueStyle:{ fill: '#333' },
    onShow: function onShow(ev) {
      var items = ev.items;

      items[0].value = items[0].value + '万'
      items[1].value = items[1].value + '万'
    }
  });
  chart.interval()
  .position('month*value')
  .color('name')
  .adjust('stack');
  chart.render();
  return chart;
}
function drawChart2(canvas, width, height, data) {
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data);
  chart.legend({
    position: 'left',
    marker: {
      symbol: 'square',
      radius: 8
    }
  });
  chart.tooltip({
    // showTitle: true,
    itemMarkerStyle:{
      symbol: 'square'
    },
    background:{
      radius: 4,
      fill: '#e2e2e2'
    },
    titleStyle:{ fill: '#333' },
    nameStyle:{ fill: '#333' },
    valueStyle:{ fill: '#333' },
    onShow: function onShow(ev) {
      var items = ev.items;
      items[0].name = (items[0].name.split(' ')||[])[0]||'';
      items[0].value = items[0].value + '元 ';
      // items[0].name = null;
      // items[1].value = items[1].value + '万';
    }
  });
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.72
  });
  chart.axis(false);
  chart.guide().text({
    position: ['50%', '50%'],
    content: '总营收\n'+ data.total +' 元'
  })
  chart.interval()
  .position('a*proportion')
  .color('name', [
    '#FCD647',
    '#E1DFE1',
    '#2962FB',
  ])
  .adjust('stack');
  chart.render();
  return chart;
}
function drawChart3(canvas, width, height, data){
  var chart = new F2.Chart({
    el: canvas,
    width,
    height,
    padding: ['auto',30,'auto','auto']
  });
  chart.source(data, {
    value: {
      tickCount: 5,
      min: 0
    },
    value2: {
      tickCount: 5,
      min: 0
    },
    date: {
      type: 'timeCat',
      range: [0, 1],
      tickCount: 3
    }
  });
  chart.guide().text({
    position: ['-6%', '-7%'],
    content: '元',
    style: {
      fontSize: '12px',
      fontWeight: 'bold'
    }
  })
  chart.tooltip({
    itemMarkerStyle:{
      symbol: 'square',
    },
    background:{
      radius: 4,
      fill: '#e2e2e2',
      padding: [5.5, 5]
    },
    titleStyle:{ fill: '#333' },
    nameStyle:{ fill: '#333' },
    valueStyle:{ fill: '#333' },
    onShow: function onShow(ev) {
      var items = ev.items;
      items[0].name = '当日'
      items[1].name = '平均'
      items[0].value = items[0].value + '元'
      items[1].value = items[1].value + '元'
    }
  });
  chart.legend({
    position: 'top',
    align: 'right',
    itemWidth: 50,
    marker: {
      symbol: 'square',
      radius: 5,
    }
  })
  chart.line().position('date*value').color('type',['#108EE9', 'red']);
  chart.render();
  return chart;
}
function drawChart4(canvas, width, height, data){
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data);
  chart.legend({
    position: 'left',
    marker: {
      symbol: 'square',
      radius: 8
    }
  });
  chart.tooltip({
    // showTitle: true,
    itemMarkerStyle:{
      symbol: 'square'
    },
    background:{
      radius: 4,
      fill: '#e2e2e2'
    },
    titleStyle:{ fill: '#333' },
    nameStyle:{ fill: '#333' },
    valueStyle:{ fill: '#333' },
    onShow: function onShow(ev) {
      var items = ev.items;
      items[0].name = (items[0].name.split(' ')||[])[0]||'';
      items[0].value = items[0].value + '元 ';
      // items[0].name = null;
      // items[1].value = items[1].value + '万';
    }
  });
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.72
  });
  chart.axis(false);
  chart.guide().text({
    position: ['50%', '50%'],
    content: '总营收\n'+ data.total +' 元'
  })
  chart.interval()
  .position('a*proportion')
  .color('name', [
    '#3EA3D8',
    '#3DC5E7',
    '#A0E5B8',
    '#FEDA65',
    '#FD9F82',
    '#F97494',
    '#E6BDF2',
    '#837BE7',
  ])
  .adjust('stack');
  chart.render();
  return chart;
}

Page({
  data: {
    currentTab: 1,
    sortDirection: true,
    today: today,
    selectedDate: today,
  },
  onReady() {
    // 渲染第一页-物业费
    if (this.data.currentTab == 1) this.getPropertyData(this.data.selectedDate);
    else if (this.data.currentTab == 2) this.getParkingData(this.data.selectedDate);
    else if (this.data.currentTab == 3) this.getConventionData(this.data.selectedDate);
  },
  getPropertyData(d){
    // params d 日期
    dd.showLoading();

    let year = dateFormatter('yyyy', new Date(d));

    Promise.all([
      getMonthApi({year}), // 柱形图
      getShouldApi({year}), // 日月年已收
      getList({year}), // 收缴率列表
    ]).then(([response1, response2, response3])=>{
      if (response1 && response1.data && response1.data.code == '0'){
        let temp = response1.data.result;
        let month = new Date().getMonth() + 1;
        let data = [];
        let suffix;
        for (let i = 0; i<month; i++){
          suffix = (i+1) >= 10 ? (i+1) : ('0'+(i+1));
          data[i] = {};
          data[i].name = '全年已收';
          data[i].month = i + 1 + '';
          data[i].value = ((temp['collectedYear'+ suffix] || 0)/10000).toFixed(1) - 0;
          data[i + month] = {};
          data[i + month].name = '全年待收';
          data[i + month].month = i + 1 + '';
          data[i + month].value = ((temp['dueIn'+ suffix] || 0)/10000).toFixed(1) - 0;
        }
        let temp1 = [{name: '全年已收', month: '1', value: 64811024.05},{name: '全年已收', month: '2', value: 75694834.45},{name: '全年已收', month: '3', value: 96490909.34},{name: '全年已收', month: '4', value: 100066555.296},{name: '全年已收', month: '5', value: 105387720.81},{name: '全年已收', month: '6', value: 112597223.08},{name: '全年已收', month: '7', value: 120629507.93},{name: '全年已收', month: '8', value: 129888484.15},{name: '全年已收', month: '9', value: 136961023.64}]
        let temp2 = [{name: '全年待收', month: '1', value: 114083623.03},{name: '全年待收', month: '2', value: 104077898.50},{name: '全年待收', month: '3', value: 83437762.38},{name: '全年待收', month: '4', value: 74320258.51},{name: '全年待收', month: '5', value: 69189735.20},{name: '全年待收', month: '6', value: 61800206.15},{name: '全年待收', month: '7', value: 53089434.17},{name: '全年待收', month: '8', value: 48225953.71},{name: '全年待收', month: '9', value: 41681351.28}]
        for (let i = 0; i<temp1.length; i++){
          temp1[i].value = ((temp1[i].value || 0)/10000).toFixed(1) - 0;
          temp2[i].value = ((temp2[i].value || 0)/10000).toFixed(1) - 0;
        }
        data.splice(0,9,...temp1)
        data.splice(month,9,...temp2)
        this.setData({'data1.area': data}, ()=>{
          this.drawChartMethod(data);
        });
      }

      if (response2 && response2.data && response2.data.code == '0'){
        let temp = response2.data.result;
        this.setData({
          'data1.collectedYear': (temp.collectedYear/10000).toFixed(1), // 全年已收
          'data1.shouldYear': (temp.shouldYear/10000).toFixed(1), // 全年应收
          'data1.dueIn': (temp.dueIn/10000).toFixed(1), // 全年待收
          'data1.tmy': {
            t: (temp.collectedToday/10000).toFixed(1), // 今日已收
            m: (temp.collectedMonth/10000).toFixed(1), // 本月已收
            y: (temp.collectedYear/10000).toFixed(1), // 全年已收
          }
        })
      }
      
      if (response3 && response3.data && response3.data.code == '0'){
        let temp = response3.data.result;
        let sum = temp.splice(0, 1)[0];
        for (let i = 0; i<temp.length; i++) {
          if (!temp[i].name) temp.splice(i, 1) && i--;
        }
        this.setData({
          'data1.list': temp,
          'data1.list.sum': sum,
        })
      }

      this.setData({'data1.dateMarker': d});
      dd.hideLoading();
    })
  },
  getParkingData(d){
    // params d 日期
    dd.showLoading();

    let year = dateFormatter('yyyy', new Date(d));

    Promise.all([
      getParkingToday({year}), // 环形图
      getParkingProgress({year}), // 进度列表
      getParkingLine({}), // 折线图
    ]).then(([response1, response2, response3])=>{
      if (response1 && response1.data && response1.data.code == '0'){
        let temp = response1.data.result;
        let data = [
          {name:'固定车位 ' + temp.fixed + ' 元', proportion: temp.fixed, a: '1'},
          {name:'租赁车位 ' + temp.rent + ' 元', proportion: temp.rent, a: '1'},
          {name:'临时车位 ' + temp.temporary + ' 元', proportion: temp.temporary, a: '1'},
        ];
        data.dateMarker = d;
        data.total = temp.totalMoneyIn;
        this.setData({
          'data2.circle': data,
          'data2.parkingToday': {
            regionNum: temp.regionNum,
            percent: (temp.percent*100).toFixed(2) + '%',
            noteGetScore: temp.noteGetScore,
          }
        }, ()=>{ this.drawChartMethod2(this.data.data2.circle) });
      }

      if (response2 && response2.data && response2.data.code == '0'){
        let temp = response2.data.result;
        for (let i = 0; i<temp.length; i++){
          if (temp[i].collectedYear - temp[i].lessNum == 0) temp[i].progress = 100;
          else {
            temp[i].progress = (temp[i].collectedYear/(temp[i].collectedYear-temp[i].lessNum))*100;
            if (temp[i].progress > 100) temp[i].progress = 100;
          }
          temp[i].lessNum_wy = (temp[i].lessNum/10000).toFixed(1);
        }
        this.setData({'data2.list': temp});
      }

      if (response3 && response3.data && response3.data.code == '0'){
        let collToday = response3.data.result.collectedToday;
        let average = response3.data.result.average;
        let data = [];
        for (let i = 0; i<collToday.length; i++){
          let date = dateFormatter('yyyy-MM-dd', new Date(new Date().getTime()-24*60*60*1000*i));
          data[i] = {};
          data[i].value = collToday[i];
          data[i].date = date;
          data[i].type = '当日';
          data[i + collToday.length] = {};
          data[i + collToday.length].value = average[i];
          data[i + collToday.length].date = date;
          data[i + collToday.length].type = '平均';
        }
        this.setData({'data2.line': data}, ()=>{
          this.drawChartMethod3(data);
        })
      }

      this.setData({'data2.dateMarker': d});
      dd.hideLoading();
    })
  },
  getConventionData(d){
    dd.showLoading();

    Promise.all([
      getConventionCircle({date: d}),
      getConventionOther({date: d, checkTypeId: 5008}),
      getConventionOther({date: d, checkTypeId: 5004}),
    ]).then(([response1, response2, response3])=>{
      if (response1 && response1.data && response1.data.code == '0'){
        let temp = response1.data.result;
        let data = [
          {name:'维修费', proportion: temp.fix},
          {name:'展位费', proportion: temp.booth},
          {name:'灭火器（租）', proportion: temp.anni},
          {name:'工本费', proportion: temp.pro},
          {name:'合同', proportion: temp.contract},
          {name:'中介及劳务费', proportion: temp.agen},
          {name:'电瓶车充电', proportion: temp.bike},
          {name:'其它', proportion: temp.others},
        ];
        let tempTotal = 0;
        data.forEach(v=>{
          tempTotal += v.proportion;
          v.name = v.name+' '+v.proportion+' 元';
        })
        data.total = tempTotal.toFixed(2) - 0;
        this.setData({
          'data3.circle': data,
          'data3.tmy': {
            t: temp.today,
            m: temp.month,
            y: temp.year,
          }
        }, ()=>{ this.drawChartMethod4(data) });
      }

      if (response2 && response2.data && response2.data.code == '0'){
        let temp = response2.data.result;
        temp.sum = temp.splice(temp.length-1, 1)[0];
        let notUpToStandard = 0;
        for (let i = 0; i<temp.length; i++) {
          if (!temp[i].name) temp.splice(i, 1) && i--;
          if (temp[i].lessNum < 0) notUpToStandard ++;
        }
        this.setData({
          'data3.list': temp,
          'data3.listInfo': {
            total: temp.length,
            notUpToStandard: notUpToStandard,
            utsRate: (((temp.length - notUpToStandard)/temp.length).toFixed(2)-0)*100 + '%'
          }
        });
      }

      if (response3 && response3.data && response3.data.code == '0'){
        let temp = response3.data.result;
        temp.sum = temp.splice(temp.length-1, 1)[0];
        let notUpToStandard = 0;
        for (let i = 0; i<temp.length; i++) {
          if (!temp[i].name) temp.splice(i, 1) && i--;
          if (temp[i].lessNum < 0) notUpToStandard ++;
        }
        this.setData({
          'data3.list2': temp,
          'data3.list2Info': {
            total: temp.length,
            notUpToStandard: notUpToStandard,
            utsRate: (((temp.length - notUpToStandard)/temp.length).toFixed(2)-0)*100 + '%'
          }
        });
      }

      this.setData({'data3.dateMarker': d});
      dd.hideLoading();
    })
  },
  drawChartMethod(data){
    dd.createSelectorQuery()
      .select('#area')
      .boundingClientRect()
      .exec((res) => {
        // 获取分辨率
        const pixelRatio = dd.getSystemInfoSync().pixelRatio;
        // 获取画布实际宽高
        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;
        // 高清解决方案
        // console.log(res, pixelRatio)
        this.setData({
          width: canvasWidth * pixelRatio,
          height: canvasHeight * pixelRatio,
        }, ()=>{
          let myCtx = dd.createCanvasContext('area');
          if (!this.area) myCtx.scale(pixelRatio, pixelRatio);
          let canvas = new F2.Renderer(myCtx);
          this.area = canvas;
          // 绘图
          drawChart(canvas, res[0].width, res[0].height, data);
        });
    });
  },
  drawChartMethod2(data){
    dd.createSelectorQuery()
    .select('#circle')
    .boundingClientRect()
    .exec(res => {
      // 获取分辨率
      const pixelRatio = my.getSystemInfoSync().pixelRatio;
      // 获取画布实际宽高
      const canvasWidth = res[0].width;
      const canvasHeight = res[0].height;

      this.setData({
        width: canvasWidth * pixelRatio,
        height: canvasHeight * pixelRatio,
      }, ()=>{
        let myCtx = my.createCanvasContext('circle');
        if (!this.circle) myCtx.scale(pixelRatio, pixelRatio);
        let canvas = new F2.Renderer(myCtx);
        this.circle = canvas;
        drawChart2(canvas, res[0].width, res[0].height, data);
      });
    })
  },
  drawChartMethod3(data){
    dd.createSelectorQuery()
    .select('#line')
    .boundingClientRect()
    .exec(res => {
      // 获取分辨率
      const pixelRatio = my.getSystemInfoSync().pixelRatio;
      // 获取画布实际宽高
      const canvasWidth = res[0].width;
      const canvasHeight = res[0].height; 

      this.setData({
        width: canvasWidth * pixelRatio,
        height: canvasHeight * pixelRatio
      }, ()=>{
        let myCtx = dd.createCanvasContext('line');
        if (!this.line) myCtx.scale(pixelRatio, pixelRatio);
        let canvas = new F2.Renderer(myCtx);
        this.line = canvas;
        drawChart3(canvas, res[0].width, res[0].height, data)
      })
    })
  },
  drawChartMethod4(data){
    dd.createSelectorQuery()
    .select('#circle2')
    .boundingClientRect()
    .exec(res => {
      // 获取分辨率
      const pixelRatio = my.getSystemInfoSync().pixelRatio;
      // 获取画布实际宽高
      const canvasWidth = res[0].width;
      const canvasHeight = res[0].height;

      this.setData({
        width: canvasWidth * pixelRatio,
        height: canvasHeight * pixelRatio
      }, ()=>{
        let myCtx = my.createCanvasContext('circle2');
        if (!this.circle2) myCtx.scale(pixelRatio, pixelRatio);
        let canvas = new F2.Renderer(myCtx);
        this.circle2 = canvas;
        drawChart4(canvas, res[0].width, res[0].height, data);
      });
    })
  },
  tabSwitch(event){
    let field = event.target.dataset.field;
    if (field == this.data.currentTab) return;
    this.setData({currentTab: field-0});
    if (!this.data['data'+ field] || this.data['data'+ field].dateMarker != this.data.selectedDate) {
      if (field == 1) this.getPropertyData(this.data.selectedDate);
      else if (field == 2) this.getParkingData(this.data.selectedDate);
      else if (field == 3) this.getConventionData(this.data.selectedDate);
    } else {
      this.area = undefined;
      this.circle = undefined;
      this.line = undefined;
      this.circle2 = undefined;
      if (field == 1) this.drawChartMethod(this.data.data1.area);
      else if (field == 2) {
        this.drawChartMethod2(this.data.data2.circle);
        this.drawChartMethod3(this.data.data2.line);
      }
      else if (field == 3) this.drawChartMethod4(this.data.data3.circle);
    }
  },
  tapMenus(){
    // 点击菜单按钮
  },
  onSelected(date){
    // 切换日期
    this.setData({selectedDate: date});
    switch(this.data.currentTab){
      case 1: this.getPropertyData(date); break;
      case 2: this.getParkingData(date); break;
      case 3: this.getConventionData(date); break;
    }
  },
  sort(event){
    // 根据某个字段对列表排序
    let field = event.target.dataset.field;
    let data = event.target.dataset.data;
    let temp;
    if (data.indexOf('.') < 0){
      temp = this.data[data];
    } else {
      let tempFields = data.split('.');
      temp = this.data[tempFields[0]][tempFields[1]];
    }
    let arr = [];
    let isNoEqual = false;
    let equalTemp;
    for (let i = 0; i<temp.length; i++){
      arr.push(temp[i][field] || 0);
      if (!equalTemp) equalTemp = temp[i][field];
      if (equalTemp !== temp[i][field]) isNoEqual = true;
    }
    // 如果当前字段所有项相等，则停止排序
    if (!isNoEqual) return;
    // 获取基于当前字段的，相对于原数组的排序
    let sortArr;
    if (this.sortDirection){
      sortArr = getSort(arr);
      this.sortDirection = false;
    }
    else{
      sortArr = getSort(arr).reverse();
      this.sortDirection = true;
    }
    // 根据获得的排序，重新排列数组
    let result = [];
    for (let j = 0; j<sortArr.length; j++){
      result.push(temp[sortArr[j]]);
    }
    
    for (let k in temp){
      if (/^\d+$/.test(k)) continue;
      result[k] = temp[k]
    }

    this.setData({
      [data]: result
    })
    
  },
  touchStart(e) {
    let id = e.currentTarget.id;
    if (this[id]) this[id].emitEvent('touchstart', [e]);
  },
  touchMove(e) {
    let id = e.currentTarget.id;
    if (this[id]) this[id].emitEvent('touchmove', [e]);
  },
  touchEnd(e) {
    let id = e.currentTarget.id;
    if (this[id]) this[id].emitEvent('touchend', [e]);
  },
});
