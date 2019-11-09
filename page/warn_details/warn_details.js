import store from '../../utils/store'

Page({
  data: {
    list: [],
    feeType: '',
  },
  onLoad(query) {
    let list = store.warn[query.field], feeType = '当年物业费';
    switch(query.type-0){
      case 1: feeType = '当年物业费'; break;
      case 2: feeType = '历欠物业费'; break;
      case 3: feeType = '车位费'; break;
      case 4: feeType = '特约服务部'; break;
      case 5: feeType = '特约三小项'; break;
    }
    this.setData({ list, feeType });
  },
  openDetails(e){
    let id = e.target.dataset.id;
    let sid = e.target.dataset.sid;
    dd.navigateTo({
      url: `/page/team_details/team_details?id=${id}&sid=${sid}`
    });
  }
});
