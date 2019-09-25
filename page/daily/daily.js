import F2 from '@antv/my-f2';
import { getMonthApi, getShouldApi, getList, getParkingToday, getParkingProgress } from '../../request/api'
import { dateFormatter, getSort } from '../../utils/util'
const app = getApp();

let chart = null;
let flag = true;
let flag2 = true;
let exampleData = [
  {name: '全年已收', month: '1', value: 0},
  {name: '全年已收', month: '2', value: 0},
  {name: '全年已收', month: '3', value: 0},
  {name: '全年已收', month: '4', value: 0},
  {name: '全年已收', month: '5', value: 0},
  {name: '全年已收', month: '6', value: 0},
  {name: '全年已收', month: '7', value: 0},
  {name: '全年已收', month: '8', value: 0},
  {name: '全年已收', month: '9', value: 0},
  {name: '全年已收', month: '10', value: 0},
  {name: '全年已收', month: '11', value: 0},
  {name: '全年已收', month: '12', value: 0},
  {name: '全年待收', month: '1', value: 0},
  {name: '全年待收', month: '2', value: 0},
  {name: '全年待收', month: '3', value: 0},
  {name: '全年待收', month: '4', value: 0},
  {name: '全年待收', month: '5', value: 0},
  {name: '全年待收', month: '6', value: 0},
  {name: '全年待收', month: '7', value: 0},
  {name: '全年待收', month: '8', value: 0},
  {name: '全年待收', month: '9', value: 0},
  {name: '全年待收', month: '10', value: 0},
  {name: '全年待收', month: '11', value: 0},
  {name: '全年待收', month: '12', value: 0}
];
let exampleData2 = [
  {name:'固定车位', proportion: 0, a: '1'},
  {name:'租赁车位', proportion: 0, a: '1'},
  {name:'临时车位', proportion: 0, a: '1'},
]

function drawChart(canvas, width, height, data) {
  chart = new F2.Chart({
    el: canvas,
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
  chart.tooltip({
    // showTitle: true,
    itemMarkerStyle:{
      symbol: 'square'
    },
    background:{
      radius: 4,
      fill: '#eee'
    },
    // titleStyle:{
    //   fill: '#333'
    // },
    nameStyle:{
      fill: '#333'
    },
    valueStyle:{
      fill: '#333'
    }
  });
  chart.legend(false);
  chart.interval()
  .position('month*value')
  .color('name')
  .adjust('stack');
  chart.render();
  return chart;
}
function drawChart2(canvas, width, height, data, total) {
  total = total || '';
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
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.72
  });
  chart.axis(false);
  chart.guide().text({
    position: ['50%', '50%'],
    content: '总营收\n'+total+' 元'
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


Page({
  data: {
    currentTab: true,
    sortVal: true,
  },
  onReady() {
    this.drawChartMethod(exampleData);
    this.setData({
      today: dateFormatter('yyyy.MM.dd', new Date(new Date().getTime()-86400000))
    });
  },
  onLoad(){
    dd.showLoading();
    getMonthApi({year: '2019'}).then(response=>{
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        let months = ['1','2','3','4','5','6','7','8','9','10','11','12']
        let cmLength = new Date().getMonth() + 1;
        months = months.splice(0, cmLength);
        // console.log(months);
        let data = [];
        for (let i = 0; i<months.length; i++){
          data[i] = {};
          data[i].name = '全年已收';
          data[i].month = months[i];
          data[i].value = ((temp['collectedMonth0'+(i+1)] || 0)/10000).toFixed(1)-0;
          // 
          data[i+months.length] = {};
          data[i+months.length].name = '全年待收';
          data[i+months.length].month = months[i];
          data[i+months.length].value = ((temp['dueIn0'+(i+1)] || 0)/10000).toFixed(1)-0;
        }
        // console.log(data);  
        this.setData({
          data1: data
        })
        this.drawChartMethod(data);
      }
    }).catch(err=>{
      console.log(err)
    }).finally(()=>{ dd.hideLoading() })
    getShouldApi({year: '2019'}).then(response=>{
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        console.log(temp)
        this.setData({
          collectedYear: (temp.collectedYear/10000).toFixed(1),// 全年已收
          shouldYear: (temp.shouldYear/10000).toFixed(1),      // 全年应收
          tmy:{
            t: (temp.collectedToday/10000).toFixed(1), // 今日已收
            m: (temp.collectedMonth/10000).toFixed(1), // 本月已收
            y: (temp.collectedYear/10000).toFixed(1)   // 全年已收
          }
        })
      }
    }).catch(err=>{
      console.log(err)
    })
    getList({year: '2019'}).then(response=>{
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        console.log(temp);
        this.setData({
          list: temp
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  },
  tapMenus(){
    // 点击菜单按钮
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
  touchStart2(e) {
    if (this.canvas2) {
      this.canvas2.emitEvent('touchstart', [e]);
    }
  },
  touchMove2(e) {
    if (this.canvas2) {
      this.canvas2.emitEvent('touchmove', [e]);
    }
  },
  touchEnd2(e) {
    if (this.canvas2) {
      this.canvas2.emitEvent('touchend', [e]);
    }
  },
  sort(event){
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
      list: result
    })
  },
  tabSwitch1(e){
    this.setData({
      currentTab: true
    })
    flag = true;
    this.drawChartMethod(this.data.data1);
  },
  tabSwitch2(e){
    this.setData({
      currentTab: false
    })
    // 停车费日报
    flag2 = true;
    if (this.data.data2 && this.data.parkingToday){
      this.drawChartMethod2(this.data.data2, this.data.parkingToday.totalMoneyIn);
    } else {
      this.drawChartMethod2(exampleData2);
      dd.showLoading();
      getParkingToday({year: '2019'}).then(response=>{
        if (response && response.data && response.data.code == '0'){
          let temp = response.data.result;
          this.setData({
            data2: [
                {name:'固定车位 ' + temp.fixed + ' 元', proportion: temp.fixed, a: '1'},
                {name:'租赁车位 ' + temp.rent + ' 元', proportion: temp.rent, a: '1'},
                {name:'临时车位 ' + temp.temporary + ' 元', proportion: temp.temporary, a: '1'},
            ],
            parkingToday:{
              totalMoneyIn: temp.totalMoneyIn,
              regionNum: temp.regionNum,
              percent: temp.percent*100 + '%',
              noteGetScore: temp.noteGetScore
            }
          }, ()=>{
            this.drawChartMethod2(this.data.data2, temp.totalMoneyIn);
          })
        }
      }).catch(err=>{
        console.log(err)
      }).finally(()=>{ dd.hideLoading() })
    }
    // 停车费-车位收缴情况
    if (this.data.list2){
      // nothing
    } else {
      getParkingProgress({year: '2019'}).then(response=>{
        if (response && response.data && response.data.code == '0'){
          let temp = response.data.result;
          for (let i = 0; i<temp.length; i++){
            if ((temp[i].collectedYear + temp[i].lessNum)==0){
              temp[i].progress = 0;
            } else {
              temp[i].progress = (temp[i].collectedYear/(temp[i].collectedYear+temp[i].lessNum))*100
            }

            // 临时
            temp[i].lessNum = ((0-temp[i].lessNum)/1000).toFixed(1);
            temp[i].progress = Math.random()*20+60;
          }
          this.setData({ list2: temp })
        }
      }).catch(err=>{
        console.log(err)
      })
    }

  },

  drawChartMethod(data){
    dd.createSelectorQuery()
      .select('#area')
      .boundingClientRect()
      .exec((res) => {
        // 获取分辨率
        const pixelRatio = my.getSystemInfoSync().pixelRatio;
        // 获取画布实际宽高
        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;
        // 高清解决方案
        // console.log(res, pixelRatio)
        this.setData({
          width: canvasWidth * pixelRatio,
          height: canvasHeight * pixelRatio
        }, ()=>{
          const myCtx = my.createCanvasContext('area');
          if (flag) myCtx.scale(pixelRatio, pixelRatio); // 必要！按照设置的分辨率进行放大
          flag = false;
          const canvas = new F2.Renderer(myCtx);
          this.canvas = canvas;
          // 绘图
          drawChart(canvas, res[0].width, res[0].height, data);
        });
    });
  },
  drawChartMethod2(data, total){
    my.createSelectorQuery()
    .select('#line')
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
        const myCtx = my.createCanvasContext('line');
        if (flag2) myCtx.scale(pixelRatio, pixelRatio);
        flag2 = false;
        const canvas = new F2.Renderer(myCtx);
        this.canvas2 = canvas;
        drawChart2(canvas, res[0].width, res[0].height, data, total);
      });
    })
  }
});
