import F2 from '@antv/my-f2';
import { dateFormatter } from '../../utils/util'

const app = getApp();
const today = dateFormatter('yyyy-MM-dd', new Date());
const yesterday = dateFormatter('yyyy-MM-dd', new Date(new Date().getTime() - 24*60*60*1000));

function drawChart(canvas, width, height, data) {
  let chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source([
    { name: '车场收费', proportion: 120000, a: '1' },
    { name: '特约服务费', proportion: 32800, a: '1' },
    { name: '物业服务费', proportion: 389000, a: '1' },
  ]);
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
    content: '总营收\n433000元'
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
function drawChart2(canvas, width, height, data) {

  let chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source([
    {"year":"1986","type":"收入","value":162},
    {"year":"1986","type":"去年同期","value":42},
    {"year":"1987","type":"收入","value":134},
    {"year":"1987","type":"去年同期","value":54},
    {"year":"1988","type":"收入","value":116},
    {"year":"1988","type":"去年同期","value":26},
    {"year":"1989","type":"收入","value":122},
    {"year":"1989","type":"去年同期","value":32},
    {"year":"1990","type":"收入","value":178},
    {"year":"1990","type":"去年同期","value":68},
    {"year":"1991","type":"收入","value":144},
    {"year":"1991","type":"去年同期","value":54},
    {"year":"1992","type":"收入","value":125},
    {"year":"1992","type":"去年同期","value":35},
    {"year":"1993","type":"收入","value":176},
    {"year":"1993","type":"去年同期","value":66},
    {"year":"1994","type":"收入","value":156},
    {"year":"1994","type":"去年同期"},
    {"year":"1995","type":"收入","value":195},
    {"year":"1995","type":"去年同期"},
    {"year":"1996","type":"收入","value":215},
    {"year":"1996","type":"去年同期"},
    {"year":"1997","type":"收入","value":176},
    {"year":"1997","type":"去年同期","value":36},
    {"year":"1998","type":"收入","value":167},
    {"year":"1998","type":"去年同期","value":47},
    {"year":"1999","type":"收入","value":142},
    {"year":"1999","type":"去年同期"},
    {"year":"2000","type":"收入","value":117},
    {"year":"2000","type":"去年同期"},
    {"year":"2001","type":"收入","value":113},
    {"year":"2001","type":"去年同期","value":23},
    {"year":"2002","type":"收入","value":132},
    {"year":"2002","type":"去年同期"},
    {"year":"2003","type":"收入","value":146},
    {"year":"2003","type":"去年同期","value":46},
    {"year":"2004","type":"收入","value":169},
    {"year":"2004","type":"去年同期","value":59},
    {"year":"2005","type":"收入","value":184},
    {"year":"2005","type":"去年同期","value":44}
  ]);

  chart.scale('year', {
    tickCount: 5,
    range: [0, 1]
  });
  chart.axis('year', {
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
  // chart.legend({
  //   position:'top',
  //   marker: {
  //     symbol: 'square',
  //     radius: 5
  //   }
  // });
  chart.legend(false);
  chart.tooltip({
    showCrosshairs: true,
    showTitle: true,
    // showTooltipMarker: true,
    itemMarkerStyle: {
      symbol: 'square'
    },
    offsetY: 30,
    layout: 'vertical',
    position:'top'
  });
  // chart.guide().rect({
  //   start: ['50%', '-20%'],
  //   end: ['100%', '0%'],
  //   style:{
  //     fillOpacity: 0.1,
  //     fill: '#fa541c'
  //   }
  // })
  chart.area().position('year*value').color('type').shape('smooth');
  chart.line().position('year*value').color('type').shape('smooth');
  chart.render();
  return chart;
}

Page({
  data: {
    today,
    yesterday,
    isUpDetails: false,

    swiper: [
      {el: 'area1', title: '当日', ind: 1},
      {el: 'area2', title: '当月', ind: 2},
      {el: 'area3', title: '当年', ind: 3},
    ],
    swiper2: [
      {el: 'line1', title: '物业费'},
      {el: 'line2', title: '车位费'},
      {el: 'line3', title: '特约服务费'},
    ]
  },
  onReady() {
    let data1, data2, data3;
    this.renderGraph('area1', data1, drawChart);
    this.renderGraph('area2', data2, drawChart);
    this.renderGraph('area3', data3, drawChart);
    this.renderGraph('line1', data1, drawChart2);
  },
  onSelected(){
    // 日期选定回调
  },
  switchDetails(){
    // 详情展开和收起
    this.setData({ isUpDetails: !this.data.isUpDetails });
  },
  titleClick(){
    // 
  },
  renderGraph(el, data, method){
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
        this.setData({
          width: canvasWidth * pixelRatio,
          height: canvasHeight * pixelRatio
        }, ()=>{
          const ddCtx = dd.createCanvasContext(el);
          ddCtx.scale(pixelRatio, pixelRatio);
          const canvas = new F2.Renderer(ddCtx);
          this[el] = canvas
          method(canvas, res[0].width, res[0].height, data);
        })
      });
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
  