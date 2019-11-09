import F2 from '@antv/my-f2';
import store from '../../utils/store'
import { dateFormatter } from '../../utils/util'
import {
  getUpToStandard,
  getNotUpToStandard,
  getNoNewIncomeThreeDays,
  getNutsKeepThreeMonths,
  getLessNumGt10
} from '../../request/api'

let yesterday = dateFormatter('yyyy-MM-dd', new Date(new Date().getTime() - 24*60*60*1000))

Page({
  data: {
    is_loading: false,
    is_loading2: false,
    line: {
      loading: false,
    },
    fox: {
      loading: false,
    },
    currentTab: 1,
    current: '',
    feeType: [
      {
        name: '当年物业费',
        tabIndex: 1,
        checkTypeId: 14,
        costType: 1,
      },
      {
        name: '历年物业费',
        tabIndex: 2,
        checkTypeId: 14,
        costType: 2,
      },
      {
        name: '车位费',
        tabIndex: 3,
        checkTypeId: 5000,
        costType: 1,
      },
      {
        name: '特约服务部',
        tabIndex: 4,
        checkTypeId: 5008,
        costType: 1,
      },
      {
        name: '特约三小项',
        tabIndex: 5,
        checkTypeId: 5004,
        costType: 1,
      },
    ],
  },
  onReady() {

    this.getData(this.data.feeType[0]);
  },
  tabSwitch(e) {
    let index = e.target.dataset.index - 0;
    let item = e.target.dataset.item;
    if (index == this.data.currentTab) return;
    this.setData({ currentTab:index });
    this.getData(item);
  },
  openDetails(e){
    // 打开详情页
    let field = e.target.dataset.field;
    dd.navigateTo({url:'/page/warn_details/warn_details?field=' + field + '&type=' + this.data.currentTab});
  },
  getData(value){
    let params = {
      checkTypeId: value.checkTypeId,
      costType: value.costType,
      finDate: yesterday
    }
    this.setData({'line.loading':true, 'fox.loading':true})
    getUpToStandard(params).then(response=>{
      let line = {}
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        if (temp.length<12){
          while(temp.length<12) { temp.push({date:temp.length+1}) }
        }
        line.data = temp
      } else line.error = '出错了'

      this.setData({line, 'line.loading':false }, ()=>{
        value.tabIndex == this.data.currentTab && this.drawChart(line.data)
      });
    })
    Promise.all([
      getNotUpToStandard(params),
      getNoNewIncomeThreeDays(params),
      getNutsKeepThreeMonths(params),
      getLessNumGt10(params),
    ]).then(([response1, response2, response3, response4])=>{
      let fox = {};
      if (response1 && response1.data && response1.data.code == '0'){
        fox.notUpToStandard = store.warn.notUpToStandard = response1.data.result;
      } else fox.error = '出错了'
      if (response2 && response2.data && response2.data.code == '0'){
        fox.noNewIncomeThreeDays = store.warn.noNewIncomeThreeDays = response2.data.result;
      } else fox.error = '出错了'
      if (response3 && response3.data && response3.data.code == '0'){
        fox.nutsKeepThreeMonths = store.warn.nutsKeepThreeMonths = response3.data.result;
      } else fox.error = '出错了'
      if (response4 && response4.data && response4.data.code == '0'){
        fox.lessNumGt10 = store.warn.lessNumGt10 = response4.data.result;
      } else fox.error = '出错了'

      this.setData({fox, 'fox.loading':false});
    })
  },
  drawChart(data) {
    if (!data) return;
    dd.createSelectorQuery()
      .select('#line')
      .boundingClientRect()
      .exec((res) => {
        if (!res[0]) return;
        // 获取分辨率
        const pixelRatio = dd.getSystemInfoSync().pixelRatio;
        // 获取画布实际宽高
        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;
        // 高清解决方案
        this.setData({
          width: canvasWidth * pixelRatio,
          height: canvasHeight * pixelRatio
        }, ()=>{
          const myCtx = dd.createCanvasContext('line');
          if (!this.line) myCtx.scale(pixelRatio, pixelRatio);
          const canvas = new F2.Renderer(myCtx);
          this.line = canvas;
          
          let chart = new F2.Chart({
            el: canvas,
            width: canvasWidth,
            height: canvasHeight,
            padding: ['auto', 30, 'auto', 'auto']
          });
          chart.legend(false)
          chart.source(data, {
            date: {
              tickCount: 12
            },
            projectNum: {
              tickCount: 5
            }
          });
          chart.guide().text({
            position: ['104%', '108.3%'],
            content: '月份',
            style: {
              fontSize: '12px',
              fontWeight: 'bold'
            }
          });
          chart.guide().text({
            position: ['-6%', '-8%'],
            content: '数量',
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
          });
          chart.line().position('date*projectNum').color('note').adjust('stack');
          chart.render();
        });
      });
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
