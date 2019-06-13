const app = getApp()

Page({
  data: {
    userName: '',
    merit: 0,
    userAvatar: '',
    focus:false,
    alertMsg: '',
    length:0
  },
  onShow () {
    this.getUser()
  },
  getUser () {
    return app.get(app.globalData.URLPREFIX + 'user')
      .then(res => {
          console.log(res);
        this.setData({
          userName: res.user.nickname,
          merit: res.user.score,
          userAvatar: res.user.face_url
        })
      })
  },
  handleUserName(e) {
    var value = e.detail.value
    let length = e.detail.value.length
    // if (length > 8) {
    //   this.setData({ alertMsg: '长度不能超过8位' })
    //   return this.getUser().userName;
    // }
    if(this.getUser().userName==value){
      return userName;
    }else{
      return app.get(app.globalData.URLPREFIX + 'user/change_name', { name:value},'PUT') 
        .then(res => {
          this.getUser()
         if(res.success){
           this.setData({ alertMsg: res.msg }, () => this.getUser())
         } else {
           this.setData({ alertMsg: res.msg })
         } 
      })
    }
  },
  hideAlert() {
    this.setData({ alertMsg: '' })
  },
  bindNameTap:function(){
    this.setData({
      focus:true
    })
  }
})
