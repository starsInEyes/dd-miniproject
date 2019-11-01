import F2 from '@antv/my-f2';
import { getMonthApi, getShouldApi, getList, getParkingLine, getParkingToday, getParkingProgress } from '../../request/api'
import { dateFormatter, getSort } from '../../utils/util'

const app = getApp();
let chart = null;
let flag = true;
let flag2 = true;
let flag3 = true;
let today = dateFormatter('yyyy-MM-dd', new Date())

let exampleData = [
  {name: '全年已收', month: '', value: 0},
];
let exampleData2 = [
  {name:'固定车位', proportion: 0, a: '1'},
  {name:'租赁车位', proportion: 0, a: '1'},
  {name:'临时车位', proportion: 0, a: '1'},
]
let exampleData3 = [
  {
    date: "2017-07-01",
    value: 83
  }
]

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
  chart.line().position('date*value').color('type',['#108EE9', '#E04343']);
  chart.render();
}


Page({
  data: {
    currentTab: 1,
    sortVal: true,
    today: today,
    selectedDate: today,
    isHided: false,
  },
  onReady() {
    // 渲染第一页-物业费
    this.drawChartMethod(exampleData);
    this.getPropertyData(this.data.selectedDate);

    // 当小程序重新显示时，更新当页数据
    app.dailyShow = () => {
      switch(this.data.currentTab){
        case 1: this.getPropertyData(this.data.selectedDate);break;
        case 2: this.getParkingData(this.data.selectedDate);break;
      }
      this.setData({isHided: true});
    }
  },
  getPropertyData(d){
    // params
    // d 日期
    dd.showLoading();

    let isComplete = [];
    let checkComplete = arr=>{
      for (let i = 0; i<arr.length; i++){ if (arr[i] == 'getting') return; }
      dd.hideLoading();
    }

    // 层叠柱形图
    isComplete[0] = 'getting';
    getMonthApi({year: d.split('-')[0]}).then(response=>{
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        let months = ['1','2','3','4','5','6','7','8','9','10','11','12']
        let cmLength = new Date(new Date().getTime() - 24*60*60*1000).getMonth() + 1;
        months = months.splice(0, cmLength);
        let data = [];
        for (let i = 0; i<months.length; i++){
          let suffix = (i+1) >= 10 ? (i+1) : ('0'+(i+1))
          data[i] = {};
          data[i].name = '全年已收';
          data[i].month = months[i];
          data[i].value = ((temp['collectedYear'+ suffix] || 0)/10000).toFixed(1)-0;
          
          // ---
          data[i+months.length] = {};
          data[i+months.length].name = '全年待收';
          data[i+months.length].month = months[i];
          data[i+months.length].value = ((temp['dueIn'+ suffix] || 0)/10000).toFixed(1)-0;
        }

        let temp1 = [{name: '全年已收', month: '1', value: 64811024.05},
                    {name: '全年已收', month: '2', value: 75694834.45},
                    {name: '全年已收', month: '3', value: 96490909.34},
                    {name: '全年已收', month: '4', value: 100066555.296},
                    {name: '全年已收', month: '5', value: 105387720.81},
                    {name: '全年已收', month: '6', value: 112597223.08},
                    {name: '全年已收', month: '7', value: 120629507.93},
                    {name: '全年已收', month: '8', value: 129888484.15},
                    {name: '全年已收', month: '9', value: 136961023.64}]
        for (let i = 0; i<temp1.length; i++){
          temp1[i].value = ((temp1[i].value || 0)/10000).toFixed(1)-0;
        }
        let temp2 = [{name: '全年待收', month: '1', value: 114083623.03},
                    {name: '全年待收', month: '2', value: 104077898.50},
                    {name: '全年待收', month: '3', value: 83437762.38},
                    {name: '全年待收', month: '4', value: 74320258.51},
                    {name: '全年待收', month: '5', value: 69189735.20},
                    {name: '全年待收', month: '6', value: 61800206.15},
                    {name: '全年待收', month: '7', value: 53089434.17},
                    {name: '全年待收', month: '8', value: 48225953.71},
                    {name: '全年待收', month: '9', value: 41681351.28}]
        for (let i = 0; i<temp2.length; i++){
          temp2[i].value = ((temp2[i].value || 0)/10000).toFixed(1)-0;
        }
        
        data.splice(0,9,...temp1)

        data.splice(months.length,9,...temp2)
        data.dateMarker = d;
        this.setData({data1: data}, ()=>{
          this.drawChartMethod(data);
        });
      }
      isComplete[0] = 'ok'; checkComplete(isComplete);
    })

    // 物业费收缴情况
    isComplete[1] = 'getting';
    getShouldApi({year: d.split('-')[0]}).then(response=>{
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        this.setData({
          collectedYear: (temp.collectedYear/10000).toFixed(1),// 全年已收
          shouldYear: (temp.shouldYear/10000).toFixed(1),      // 全年应收
          dueIn: (temp.dueIn/10000).toFixed(1), // 全年待收
          tmy:{
            t: (temp.collectedToday/10000).toFixed(1), // 今日已收
            m: (temp.collectedMonth/10000).toFixed(1), // 本月已收
            y: (temp.collectedYear/10000).toFixed(1),  // 全年已收
          }
        })
      }
      isComplete[1] = 'ok'; checkComplete(isComplete);
    })
    // 项目收缴情况列表
    isComplete[2] = 'getting';
    getList({year: d.split('-')[0]}).then(response=>{
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        temp.sum = JSON.parse(JSON.stringify(temp[0]));
        temp.splice(0, 1);
        for (let i = 0; i<temp.length; i++){
          if (!temp[i].name){
            temp.splice(i, 1); i--;
          }
        }
        this.setData({
          list: temp,
          'list.sum': temp.sum
        });
      }
      isComplete[2] = 'ok'; checkComplete(isComplete);
    })
  },
  getParkingData(d){
    // params
    // d 日期
    dd.showLoading();

    let isComplete = [];
    let checkComplete = arr=>{
      for (let i = 0; i<arr.length; i++){ if (arr[i] == 'getting') return; }
      dd.hideLoading();
    }
    // 折线图
    isComplete[0] = 'getting';
    getParkingLine({}).then(response=>{
      // console.log(response);
      if (response && response.data && response.data.code == '0'){
        // { date: "2017-07-01", value: 83 }
        let temp = response.data.result.collectedToday;
        let temp2 = response.data.result.average;
        let arr = [];
        for (let i = 0; i<temp.length; i++){
          let date = dateFormatter('yyyy-MM-dd', new Date(new Date().getTime()-86400000*i))
          arr[i] = {};
          arr[i].value = temp[i];
          arr[i].date = date;
          arr[i].type = '当日'
          // arr[i].value2 = temp2[i];
          arr[temp.length+i] = {};
          arr[temp.length+i].value = temp2[i];
          arr[temp.length+i].date = date;
          arr[temp.length+i].type = '平均'
        }
        // console.log(arr);
        this.setData({
          data3: arr
        }, () => {
          this.drawChartMethod3(arr);
        })
      }
      isComplete[0] = 'ok'; checkComplete(isComplete);
    })

    // 环形图
    isComplete[1] = 'getting';
    getParkingToday({year: d.split('-')[0]}).then(response=>{
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        let data = [
          {name:'固定车位 ' + temp.fixed + ' 元', proportion: temp.fixed, a: '1'},
          {name:'租赁车位 ' + temp.rent + ' 元', proportion: temp.rent, a: '1'},
          {name:'临时车位 ' + temp.temporary + ' 元', proportion: temp.temporary, a: '1'},
        ];
        data.dateMarker = d;
        data.total = temp.totalMoneyIn;
        this.setData({
          data2: data,
          parkingToday:{
            regionNum: temp.regionNum,
            percent: (temp.percent*100).toFixed(2) + '%',
            noteGetScore: temp.noteGetScore
          }
        }, ()=>{
          this.drawChartMethod2(this.data.data2)
        })
      }
      isComplete[1] = 'ok'; checkComplete(isComplete);
    })

    // 进度列表
    isComplete[2] = 'getting';
    getParkingProgress({year: d.split('-')[0]}).then(response=>{
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        for (let i = 0; i<temp.length; i++){
          if ((temp[i].collectedYear - temp[i].lessNum)==0){
            temp[i].progress = 0;
          } else {
            temp[i].progress = (temp[i].collectedYear/(temp[i].collectedYear - temp[i].lessNum))*100
            if (temp[i].progress > 100) temp[i].progress = 100;
            if (temp[i].progress >= 100) temp[i].isComplete = true;
          }
          temp[i].lessNum = (temp[i].lessNum/10000).toFixed(1);
        }
        this.setData({ list2: temp })
      }
      isComplete[2] = 'ok'; checkComplete(isComplete);
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
          height: canvasHeight * pixelRatio
        }, ()=>{
          const myCtx = dd.createCanvasContext('area');
          if (flag) myCtx.scale(pixelRatio, pixelRatio); // 必要！按照设置的分辨率进行放大
          flag = false;
          const canvas = new F2.Renderer(myCtx);
          this.canvas = canvas;
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
        width2: canvasWidth * pixelRatio,
        height2: canvasHeight * pixelRatio
      }, ()=>{
        const myCtx = my.createCanvasContext('circle');
        if (flag2) myCtx.scale(pixelRatio, pixelRatio);
        flag2 = false;
        const canvas = new F2.Renderer(myCtx);
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
        width3: canvasWidth * pixelRatio,
        height3: canvasHeight * pixelRatio
      }, ()=>{
        const myCtx = dd.createCanvasContext('line');
        if (flag3) myCtx.scale(pixelRatio, pixelRatio);
        flag3 = false;
        const canvas = new F2.Renderer(myCtx);
        this.canvas3 = canvas
        drawChart3(canvas, res[0].width, res[0].height, data)
      })
    })
  },
  tabSwitch1(){
    // 切换到物业费
    if (this.data.currentTab == 1) return;
    this.setData({currentTab: 1});
    flag = true;
    // 如果图表数据存在，并且图表日期与当前日期一致，并且不曾切换至后台
    if (this.data.data1 && (this.data.data1.dateMarker == this.data.selectedDate) && !this.data.isHided){
      // 直接渲染
      this.drawChartMethod(this.data.data1);
    } else {
      // 更新数据
      this.getPropertyData(this.data.selectedDate);
    }
    this.setData({isHided: false});
  },
  tabSwitch2(){
    // 切换到停车费
    if (this.data.currentTab == 2) return;
    this.setData({currentTab: 2});
    flag2 = true;
    flag3 = true;
    // 如果图表数据存在，并且图表日期与当前日期一致，并且不曾切换至后台
    if (this.data.data2 && (this.data.data2.dateMarker == this.data.selectedDate) && !this.data.isHided){
      // 直接渲染
      this.drawChartMethod2(this.data.data2);
      this.drawChartMethod3(this.data.data3);
    } else {
      // 更新数据
      this.getParkingData(this.data.selectedDate);
    }
    this.setData({isHided: false});
  },
  tapMenus(){
    // 点击菜单按钮
  },
  onSelected(date){
    switch(this.data.currentTab){
      case 1: this.getPropertyData(date);break;
      case 2: this.getParkingData(date);break;
    }
    this.setData({selectedDate: date})
  },
  sort(event){
    // 根据某个字段对列表排序
    let field = event.target.dataset.field;
    let temp = this.data.list;
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
    if (this.sortVal){
      sortArr = getSort(arr);
      this.sortVal = false;
    }
    else{
      sortArr = getSort(arr).reverse();
      this.sortVal = true;
    }
    // 根据获得的排序，重新排列数组
    let result = [];
    for (let j = 0; j<sortArr.length; j++){
      result.push(temp[sortArr[j]]);
    }
    this.setData({
      list: result,
      'list.sum': temp.sum,
    })
  },
  touchStart(e) {
    if (this.canvas) {
      this.canvas.emitEvent('touchstart', [e]);
    }
  },
  touchMove(e) {
    if (this.canvas) {
      this.canvas.emitEvent('touchmove', [e]);
    }
  },
  touchEnd(e) {
    if (this.canvas) {
      this.canvas.emitEvent('touchend', [e]);
    }
  },
  touchStart3(e) {
    if (this.canvas3) {
      this.canvas3.emitEvent('touchstart', [e]);
    }
  },
  touchMove3(e) {
    if (this.canvas3) {
      this.canvas3.emitEvent('touchmove', [e]);
    }
  },
  touchEnd3(e) {
    if (this.canvas3) {
      this.canvas3.emitEvent('touchend', [e]);
    }
  },
});
