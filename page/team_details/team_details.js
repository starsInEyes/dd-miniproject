import F2 from '@antv/my-f2';
import { getWorkData, getProjectLine, getProjectUser } from '../../request/api'
import { preciseSum, dateFormatter } from '../../utils/util'
let yesterday = dateFormatter('yyyy-MM-dd', new Date(new Date().getTime() - 24*60*60*1000))
let params;

Page({
  data: {
    is_loading: false,
    is_loading2: false,
    currentTab: 1,
    workData: {
      loading: false
    },
    line: {
      loading: false
    },
    feeType: [
      {
        name: '当年物业费',
        tabIndex: 1,
        checkTypeId: 14,
        costType: 1,
        display: 1
      },
      {
        name: '历欠物业费',
        tabIndex: 2,
        checkTypeId: 14,
        costType: 2,
        display: 4
      },
      {
        name: '车位费',
        tabIndex: 3,
        checkTypeId: 5000,
        costType: 1,
        display: 2
      },
      {
        name: '特约服务部',
        tabIndex: 4,
        checkTypeId: 5008,
        costType: 1,
        display: 3
      },
      {
        name: '项目小三项',
        tabIndex: 5,
        checkTypeId: 5004,
        costType: 1,
        display: 3
      },
    ]
  },
  onLoad(query) {
    params = { id: query.id, sId: query.sid, }
  },
  onReady(){
    this.getData();
    this.getData_line(this.data.feeType[0]);
  },
  call(e){
    let phone = e.target.dataset.phone;
    if (phone){
      dd.showCallMenu({
        phoneNumber: phone, // 期望拨打的电话号码
        code: '+86', // 国家代号，中国是+86
        showDingCall: true, // 是否显示钉钉电话
        success:function(res){   
        },
        fail:function(err){
          dd.alert({
            title: err.errorMessage,
          })
        }
      });
    }
    else dd.alert({
      title: '没有电话号码',
      buttonText: '我知道了'
    })
  },
  tabSwitch(e){
    let index = e.target.dataset.index - 0;
    let item = e.target.dataset.item;
    if (index == this.data.currentTab) return;
    this.setData({ currentTab:index });
    this.getData_line(item);
  },
  getData(){
    this.setData({'workData.loading': true})
    // 工作数据
    getWorkData(params).then(response=>{
      let workData = {}
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        temp.total = (preciseSum([
          temp.houseNow.lessNum || 0,
          temp.houseOwn.lessNum || 0,
          temp.parking.lessNum || 0,
          temp.specialParts.lessNum || 0,
          temp.specialThree.lessNum || 0,
        ])/10000).toFixed(1) - 0;
        // 进度
        temp.houseNow.percent = filter_percent(temp.houseNow.difference)
        temp.houseOwn.percent = filter_percent(temp.houseOwn.difference)
        temp.parking.percent = filter_percent(temp.parking.difference)
        temp.specialParts.percent = filter_percent(temp.specialParts.difference)
        temp.specialThree.percent = filter_percent(temp.specialThree.difference)
        // 是否完成
        temp.houseNow.isComplete = temp.houseNow.percent == 100;
        temp.houseOwn.isComplete = temp.houseOwn.percent == 100;
        temp.parking.isComplete = temp.parking.percent == 100;
        temp.specialParts.isComplete = temp.specialParts.percent == 100;
        temp.specialThree.isComplete = temp.specialThree.percent == 100;
        // 差额
        temp.houseNow.lessNum = filter_wy(temp.houseNow.lessNum);
        temp.houseOwn.lessNum = filter_wy(temp.houseOwn.lessNum);
        temp.parking.lessNum = filter_wy(temp.parking.lessNum);
        temp.specialParts.lessNum = filter_wy(temp.specialParts.lessNum);
        temp.specialThree.lessNum = filter_wy(temp.specialThree.lessNum);
        // 全年已收
        temp.houseNow.collectedYear = filter_wy(temp.houseNow.collectedYear);
        temp.houseOwn.collectedYear = filter_wy(temp.houseOwn.collectedYear);
        temp.parking.collectedYear = filter_wy(temp.parking.collectedYear);
        temp.specialParts.collectedYear = filter_wy(temp.specialParts.collectedYear);
        temp.specialThree.collectedYear = filter_wy(temp.specialThree.collectedYear);
        workData = temp
      } else workData.error = '出错了'
      this.setData({workData, 'workData.loading': false})
    })
    // 用户信息
    getProjectUser({regionId: params.id}).then(response=>{
      let userInfo;
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result;
        temp.userSurname = temp.userName.trim().split('')[0];
        temp.regionAddress = temp.regionAddress || '暂无地址';
        userInfo = temp;
      }
      else userInfo = { error: true, userSurname: '-', errorMessage: '没有该项目信息' }
      this.setData({ userInfo })
    })
    function filter_percent(value){ return value>0?100:(100+(value?value:0)) }
    function filter_wy(value) { return ((value || 0)/10000).toFixed(1) - 0 }
  },
  getData_line(value){
    // 折线图
    this.setData({'line.loading': true})
    getProjectLine({
      id: params.id,
      sId: params.sId,
      checkTypeId: value.checkTypeId,
      costType: value.costType,
      display: value.display,
      date: yesterday
    }).then(response=>{
      let line = {}
      if (response && response.data && response.data.code == '0'){
        let temp = response.data.result; 
        if (temp.curve){
          let arr = [];
          let month = new Date().getMonth();
          for (let i = 0; i<12; i++){
            arr[i] = {
              date: i + 1,
              value: i<=month?temp.curve.nowMonthCollected[i]:undefined,
              name: '本月已收'
            },
            arr[i+12] = {
              date: i + 1,
              value: i<=month?temp.curve.lastYearMonthCollected[i]:undefined,
              name: '去年同期本月已收'
            }
          }
          line.data = arr;
          line.increast = temp.nums.increast;
          line.lastYearPercent = temp.nums.lastYearPercent;
          line.nowPercent = temp.nums.nowPercent;
        } else line.error = '没有查到相关内容'
      } else line.error = '出错了'
      this.setData({
        line,
        'line.loading': false,
      }, ()=>{ value.tabIndex == this.data.currentTab && this.drawChart(line.data) });
    })
  },
  drawChart(data){
    if (!data) return;
    dd.createSelectorQuery()
    .select('#line')
    .boundingClientRect()
    .exec(res => {
      if (!res[0]) return;
      // 获取分辨率
      const pixelRatio = dd.getSystemInfoSync().pixelRatio;
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
        var chart = new F2.Chart({
          el: canvas,
          width: canvasWidth,
          height: canvasHeight,
          padding: ['auto',20,'auto','auto']
        });
        chart.source(data, {
          date: {
            tickCount: 12
          },
          value: {
            tickCount: 5,
          },
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
            items[0].name = ''
            items[1].name = ''
            items[0].value = items[0].value + '元'
            items[1].value = items[1].value + '元'
          }
        });
        chart.legend({
          position: 'top',
          align: 'right',
          itemWidth: 120,
          clickable: false,
          marker: {
            symbol: 'square',
            radius: 5,
          }
        })
        chart.line().position('date*value').color('name',['#108EE9', '#E04343']);
        chart.render();
        return chart;
      })
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
