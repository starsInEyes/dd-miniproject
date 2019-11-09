Component({
  data: {
    value: '物业费-收缴率',
    resultIndex: [0, 0],
    isActive: false,
    options: {
      feeType: [],
      valType: [],
    }
  },
  props: {
    defautValue: '',
    onSelected(value){
      // 默认不做任何事，如果接收到外界的函数，则替换此函数并执行
      // 同上面默认日期一样，如果接收到外界的值，则替换
    }
  },
  didMount() {
    // 初始化数组
    this.setData({
      options: {
        feeType: [
          {
            name: '当年物业费',
            checkTypeId: 14,
            costType: 1,
            display: 1
          },
          {
            name: '历欠物业费',
            checkTypeId: 14,
            costType: 2,
            display: 4
          },
          {
            name: '车位费',
            checkTypeId: 5000,
            costType: 1,
            display: 2
          },
          {
            name: '特约服务部',
            checkTypeId: 5008,
            costType: 1,
            display: 3
          },
          {
            name: '项目小三项',
            checkTypeId: 5004,
            costType: 1,
            display: 3
          },
        ],
        valType: [
          {
            name: '收缴率',
            prop: 'collectionRate',
            sup: '%',
          },
          {
            name: '差额',
            prop: 'difference',
            sup: '%',
          },
          {
            name: '当日已收',
            prop: 'collectedToday',
            sup: '元',
          },
          {
            name: '当月已收',
            prop: 'collectedMonth',
            sup: '元',
          },
        ]
      }
    });
    this.getValue();
  },
  methods: {
    openPanel(){
      this.setData({isActive:true});
    },
    cancel(){
      this.setData({isActive:false})
    },
    ok(){
      this.setData({isActive:false})
      this.getValue();
      this.props.onSelected(this.data.valueFields);
    },
    dateChange(e){
      this.setData({ resultIndex: e.detail.value })
    },
    getValue(){
      let r = this.data.resultIndex;
      this.setData({
        value: this.data.options.feeType[r[0]].name+ ' - ' +this.data.options.valType[r[1]].name,
        valueFields: {
          feeType: this.data.options.feeType[r[0]],
          valType: this.data.options.valType[r[1]],
        }
      })
    }
  },
});
