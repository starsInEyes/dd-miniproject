Component({
  data: {
    date: '',
    resultIndex: [3,8,26],
    isActive: false,
    options: {
      year: [],
      month: [],
      day:[]
    }
  },
  props:{
    defaultDate: '2019-01-01',
    onSelected(date){
      // 默认不做任何事，如果接收到外界的函数，则替换此函数并执行
      // 同上面默认日期一样，如果接收到外界的值，则替换
    }
  },
  didMount(){
    let timer = setInterval(()=>{
      if (this.props.defaultDate){
        // 初始化日期数组，便于确定索引，打开面板时，将重置。
        this.monthToDay(2018, 12);
        this.setData({date:this.props.defaultDate});
        let arr = this.props.defaultDate.split('-');
        this.setData({
          resultIndex: [
            this.data.options.year.indexOf(arr[0]-0),
            this.data.options.month.indexOf(arr[1]-0),
            this.data.options.day.indexOf(arr[2]-0),
          ]
        });
        clearInterval(timer);
      }
    }, 200);
  },
  methods:{
    openPanel(){
      this.setData({isActive:true});
      this.monthToDay(
        this.data.options.year[this.data.resultIndex[0]],
        this.data.options.month[this.data.resultIndex[1]]
      )
    },
    cancel(){
      this.setData({isActive:false});
    },
    ok(){
      let y = this.data.options.year[this.data.resultIndex[0]];
      let m = this.data.options.month[this.data.resultIndex[1]];
      let d = this.data.options.day[this.data.resultIndex[2]];
      m = m<10?('0'+m):m;
      d = d<10?('0'+d):d;
      this.setData({date: `${y}-${m}-${d}`});
      this.props.onSelected(`${y}-${m}-${d}`);
      this.setData({isActive:false});
    },
    dateChange(e){
      // 改变之前的年份月份索引
      let temp1 = this.data.resultIndex[0];
      let temp2 = this.data.resultIndex[1];
      // 改变之后的年份月份索引
      let temp3 = e.detail.value[0];
      let temp4 = e.detail.value[1];
      // change
      this.setData({resultIndex: e.detail.value});
      // 如果年份或者月份发生了改变，则根据年月修改当月的天数值
      if (temp1 != temp3 || temp2 != temp4)
        this.monthToDay(this.data.options.year[temp3], this.data.options.month[temp4])
    },
    monthToDay(year, month){
      // 默认载入，打开面板，和切换年月时；根据选定的年月重置年月日数组；
      let temp = this.data.options;
      let cd = new Date();
      let sd = new Date(year + '/' + month + '/1');
      let yArr = [], mArr = [], dArr = [];
      let maxYear, maxMonth, maxDay;

      maxYear = cd.getFullYear();
      for (let i = 2018; i<maxYear; i++){ yArr.push(i+1) }
      temp.year = yArr;

      if (year == cd.getFullYear()){
        // 如果是当年，则月份不能超过当月；
        maxMonth = cd.getMonth() + 1;
      } else{
        // 否则，月份为12个月；
        maxMonth = 12;
      }
      for (let i = 0; i<maxMonth; i++){ mArr.push(i+1) };
      temp.month = mArr;

      if (year == cd.getFullYear() && month == (cd.getMonth()+1)){
        // 如果是当年当月，则天数不能超过昨天
        maxDay = cd.getDate() - 1;
      } else {
        // 否则，取选定月的天数
        sd.setMonth(sd.getMonth() + 1);
        sd.setDate(0);
        maxDay = sd.getDate();
      }
      for (let i = 0; i<maxDay; i++){ dArr.push(i+1) };
      temp.day = dArr;

      this.setData({ options: temp });
    }
  },
})