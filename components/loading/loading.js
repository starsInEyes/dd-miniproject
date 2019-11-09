
Component({
  data: {
    is_active: false,
    is_opacity: false,
    is_trans: true,
    timer: null,
  },
  props: {
    loading: false,
    error: null,
  },
  didMount() {
    
  },
  didUpdate(){
    if (this.props.loading == true){
      // 显示loading
      this.data.timer && clearTimeout(this.data.timer);
      this.setData({
        is_active: true,
        is_opacity: true,
        is_trans: true,
        timer: null,
        timer2: setTimeout(()=>{
          this.setData({is_image: true});
        }, 300)
      })
    }
    else if (this.props.error){
      // 存在错误消息
      this.data.timer2 && clearTimeout(this.data.timer2);
      this.setData({
        is_active: true,
        is_opacity: true,
        is_trans: false,
        is_image: false,
        timer2: null,
      })
    }
    else {
      // 隐藏loading
      this.data.timer2 && clearTimeout(this.data.timer2);
      if(!this.data.timer) {
        this.setData({
          is_opacity: false,
          is_image: false,
          timer: setTimeout(()=>{
            this.setData({is_active: false})
          }, 380),
          timer2: null,
        })
      }
    }
  },
  methods: {

  },
});
