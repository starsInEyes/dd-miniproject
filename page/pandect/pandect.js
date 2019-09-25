import F2 from '@antv/my-f2';
const app = getApp();

let chart = null;

function drawChart(canvas, width, height) {

  chart = new F2.Chart({
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
    content: '总营收\n433000'
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


function drawChart2(canvas, width, height) {

  chart = new F2.Chart({
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

  },
  onReady() {
    
    my.createSelectorQuery()
      .select('#area')
      .boundingClientRect()
      .exec((res) => {
        // 获取分辨率
        const pixelRatio = my.getSystemInfoSync().pixelRatio;
        // 获取画布实际宽高
        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;
        // 高清解决方案
        console.log(res, pixelRatio)
        this.setData({
          width: canvasWidth * pixelRatio,
          height: canvasHeight * pixelRatio
        });
        const myCtx = my.createCanvasContext('area');
        myCtx.scale(pixelRatio, pixelRatio); // �必要！按照设置的分辨率进行放大
        const canvas = new F2.Renderer(myCtx);
        this.canvas = canvas;
        //console.log(res[0].width, res[0].height);
        drawChart(canvas, res[0].width, res[0].height);
      });
    
    my.createSelectorQuery()
      .select('#line')
      .boundingClientRect()
      .exec((res) => {
        // 获取分辨率
        const pixelRatio = my.getSystemInfoSync().pixelRatio;
        // 获取画布实际宽高
        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;
        // 高清解决方案
        console.log(res, pixelRatio)
        this.setData({
          width2: canvasWidth * pixelRatio,
          height2: canvasHeight * pixelRatio
        }, ()=>{
          const myCtx = my.createCanvasContext('line');
          myCtx.scale(pixelRatio, pixelRatio); // �必要！按照设置的分辨率进行放大
          const canvas = new F2.Renderer(myCtx);
          this.canvas2 = canvas;
          //console.log(res[0].width, res[0].height);
          drawChart2(canvas, res[0].width, res[0].height);
        });
        
      });
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
  }
});