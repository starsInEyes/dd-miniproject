App({
  onLaunch(options) {
    // console.log('App Launch', options);
    // console.log('getSystemInfoSync', dd.getSystemInfoSync());
    // console.log('SDKVersion', dd.SDKVersion);
    // console.log(dd.getUpdateManager())
    this.globalData.corpId = options.query.corpId;
  },
  onShow() {
    // console.log('App Show');
    this.dailyShow();
  },
  onHide() {
    // console.log('App Hide');
  },
  globalData: {
    corpId:'',
  },
  dailyShow(){
    // 当页面载入时，重新赋值
  }
});

// {
//   "pagePath": "page/pandect/pandect",
//   "name": "总览",
//   "icon": "images/all_default.png",
//   "activeIcon": "images/all_active.png"
// },