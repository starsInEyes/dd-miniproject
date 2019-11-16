import F2 from '@antv/my-f2';
import { dateFormatter, preciseSum } from '../../utils/util'
import { getTotalDetails, getTotalLine } from '../../request/api'

const today = dateFormatter('yyyy-MM-dd', new Date());
const yesterday = dateFormatter('yyyy-MM-dd', new Date(new Date().getTime() - 24*60*60*1000));

function drawChart(canvas, width, height, data, total) {
  let chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data);
  chart.legend({
    position: 'left',
    marker: {
      symbol: 'square',
      radius: 10
    }
  });
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.72
  });
  chart.axis(false);
  chart.guide().text({
    position: ['50%', '50%'],
    content: `总营收\n${total}万`
  })
  chart.interval()
  .position('a*proportion')
  .color('name', [
    '#FCD647',
    '#E1DFE1',
    '#2962FB',
    '#8325FB',
  ])
  .adjust('stack');
  chart.render();
}
function drawChart2(canvas, width, height, data) {

  let chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data);

  chart.scale('date', {
    tickCount: 4,
    range: [0, 1]
  });
  chart.axis('date', {
    label: function label(text, index, total){
      var textCfg = {};
      if (index === 0){
        textCfg.textAlign = 'left';
      } else if (index === total-1){
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.legend(false);
  chart.tooltip({
    position:'top',
    showCrosshairs: true,
    // showTitle: true,
    showTooltipMarker: true,
    itemMarkerStyle: {
      symbol: 'square',
      wordSpace: '0'
    },
    background: {
      radius: 4,
      fill: '#e2e2e2',
      padding: [5.5, 5],
    },
    titleStyle:{ fill: '#333' },
    nameStyle:{ fill: '#333' },
    valueStyle:{ fill: '#333' },
    showXTip: true,
    xTip: {
      fill: '#333'
    },
    xTipBackground: {
      radius: 4,
      fill: '#e2e2e2',
      padding: [5.5, 5]
    },
    onShow: function onShow(ev) {
      var items = ev.items;
      items[0].value = items[0].value + ' 万'
      items[1].value = items[1].value + ' 万'
    }
  });
  chart.guide().text({
    position: ['-6%', '-7%'],
    content: '万',
    style: {
      fontSize: '12px',
      fontWeight: 'bold'
    }
  })
  chart.area().position('date*value').color('type').shape('smooth');
  chart.line().position('date*value').color('type').shape('smooth');
  chart.render();
}

Page({
  data: {
    today,
    yesterday,
    isUpDetails: false,
    total: {
      loading: false,
    },
    line: {
      loading: false,
    },
    swiper: [
      {el: 'area1', title: '今日', ind: 1},
      {el: 'area2', title: '本月', ind: 2},
      {el: 'area3', title: '当年', ind: 3},
    ],
  },
  onReady() {
    this.getDataByDate(yesterday)
  },
  onSelected(date){
    // 日期选定回调
    this.getDataByDate(date)
  },
  switchDetails(){
    // 详情展开和收起
    this.setData({ isUpDetails: !this.data.isUpDetails });
  },
  getDataByDate(date){
    // 全年数据 及 营收数据
    this.setData({'total.loading': true})
    getTotalDetails({date}).then(response=>{
      if (response && response.data && response.data.code == 0){
        let temp = response.data.result;
        let keys = ['houseNow', 'houseLast', 'parking', 'special']
        // 求三类总和 - 亿元
        temp.collectedYear = this.toYi(preciseSum(keys.map(item=>temp[item].collectedYear)))
        temp.shouldYear = this.toYi(preciseSum(keys.map(item=>temp[item].shouldYear)))
        temp.dueIn = this.toYi(preciseSum(keys.map(item=>temp[item].dueIn)))
        // 过滤单项的值 - 万元
        keys.forEach(v => {
          temp[v].collectedToday = this.toWy(temp[v].collectedToday)
          temp[v].collectedMonth = this.toWy(temp[v].collectedMonth)
          temp[v].collectedYear = this.toWy(temp[v].collectedYear)
          temp[v].shouldYear = this.toWy(temp[v].shouldYear)
          if (v == 'parking' || v == 'special') temp[v].dueIn = (temp[v].shouldYear-temp[v].collectedYear).toFixed(2)-0
          else temp[v].dueIn = this.toWy(temp[v].dueIn)
        })
        this.setData({ total: temp })

        let circle = {}
        let arr = ['Today', 'Month', 'Year']
        keys.forEach(v => {
          let name;
          switch (v) {
            case 'houseNow': name = "当期物业费";break;
            case 'houseLast': name = "历欠物业费";break;
            case 'parking': name = "综合车位费";break;
            case 'special': name = "特约服务费";break;
          }
          arr.forEach(k => {
            let val = temp[v]['collected'+ k];
            !circle[k] && (circle[k] = [])
            circle[k].push({name: `${name}${val}万`, proportion: val})
          })
        })
        this.renderGraph('area1', drawChart, circle.Today, preciseSum(circle.Today.map(item=>item.proportion)));
        this.renderGraph('area2', drawChart, circle.Month, preciseSum(circle.Month.map(item=>item.proportion)));
        this.renderGraph('area3', drawChart, circle.Year, preciseSum(circle.Year.map(item=>item.proportion)));
      } else this.setData({'total.loading': false, 'total.error': '没有数据'})
    })
    // 日新增收入
    this.setData({'line.loading': true})
    getTotalLine({beforeDay: 15, date}).then(response=>{
      if (response && response.data && response.data.code == 0){
        let temp = response.data.result;
        let arr = [];
        temp.forEach(item => {
          arr.push({ date: item.date, type: '收入', value: this.toWy(item.dayGet)});
          arr.push({ date: item.date, type: '去年同期', value: this.toWy(item.dayGetLastYear)});
        })
        this.setData({'line.loading': false})
        this.renderGraph('line', drawChart2, arr);
      } this.setData({'line.loading': false, 'error': '没有数据'})
    })
  },
  renderGraph(el, method, data, total){
    // 渲染圆形图
    // -- params --
    // el canvas元素id
    // data 渲染图形的数据
    // method 渲染图形的方法
    dd.createSelectorQuery()
      .select('#' + el)
      .boundingClientRect()
      .exec((res) => {
        const pixelRatio = dd.getSystemInfoSync().pixelRatio
        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;
        
        let prefix = el.includes('area')?'circle':'line';
        this.setData({
          [prefix +'_width']: canvasWidth * pixelRatio,
          [prefix +'_height']: canvasHeight * pixelRatio
        }, ()=>{
          const ddCtx = dd.createCanvasContext(el);
          if (!this[el]) ddCtx.scale(pixelRatio, pixelRatio);
          const canvas = new F2.Renderer(ddCtx);
          this[el] = canvas
          method(canvas, res[0].width, res[0].height, data, total);
        })
      });
  },
  toWy(input){
    return ((input || 0)/10000).toFixed(2) - 0
  },
  toYi(input){
    return ((input || 0)/Math.pow(10, 8)).toFixed(2) - 0
  },
  touchStart(e) {
    if (this[e.currentTarget.id]) this[e.currentTarget.id].emitEvent('touchstart', [e]);
  },
  touchMove(e) {
    if (this[e.currentTarget.id]) this[e.currentTarget.id].emitEvent('touchmove', [e]);
  },
  touchEnd(e) {
    if (this[e.currentTarget.id]) this[e.currentTarget.id].emitEvent('touchend', [e]);
  },
});
  