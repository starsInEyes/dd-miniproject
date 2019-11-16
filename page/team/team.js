import { getTeamList } from '../../request/api'
import { getSort } from '../../utils/util'

Page({
  data: {
    list: {
      data: [],
      loading: false,
    }
  },
  onReady() {
    let params = {
      checkTypeId: 14,
      costType: 1,
      display: 1,
    }
    this.getDetailsData(params, 'collectionRate', '%');

    this.setData({ params })
  },
  onSelected(value){
    // 选择费用类型
    let params = {
      checkTypeId: value.feeType.checkTypeId,
      costType: value.feeType.costType,
      display: value.feeType.display
    }
    let prop = value.valType.prop;
    let sup = value.valType.sup;
    // 如果参数未变则只过滤数据，否则重新获取
    if (
      params.checkTypeId == this.data.params.checkTypeId &&
      params.costType == this.data.params.costType &&
      params.display == this.data.params.display
    ) this.setData({ 'list.data': this.filterData(this.data.list.data, prop, sup) })
    else this.getDetailsData(params, prop, sup);
    
    this.setData({ params });
  },
  openDetails(e){
    // 打开详情页
    let params = e.target.dataset.params;
    dd.navigateTo({url:'/page/team_details/team_details?id=' + params.id +'&sid='+ params.sid});
  },
  getDetailsData(params, prop, sup){
    // 获取指定类型的列表数据
    this.setData({'list.loading':true});
    getTeamList(params).then(response=>{
      let list = {};
      if (response && response.data && response.data.code == '0'){
        list.data = this.filterData(response.data.result, prop, sup);
      } else list.error = '出错了'
      this.setData({ list, 'list.loading': false })
    })
  },
  filterData(list, prop, sup){
    let arr = [];
    let arr2 = [];

    list.forEach(item=>{
      item.address = item.address || '暂无地址';
      item.selectedProp = item[prop];
      item.selectedSup = sup;
      arr.push(item[prop] || 0);
    })

    arr = getSort(arr);
    arr.forEach(item=>{
      arr2.push(list[item]);
    })

    return arr2;
  }
});
