const app = getApp()

Page({
  data: {},
  onLoad () {
    wx.getSetting({
      success (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          app.login()
            .then(() => {
              console.log('index direct to home')
              wx.switchTab({ url: '/pages/home/home' })
            })
        }
      }
    })
  },
  onGotUserInfo (e) {
    if (e.detail.userInfo) {
      this.authorize(e.detail)
        .then(() => this.updateUserInfo(e.detail))
        .then(res => {
          console.log(res)
          res.success && wx.switchTab({ url: '/pages/home/home' })
        })
    }
  },
  authorize (d) {
    const getCode = () => new Promise((resolve, reject) => { wx.login({ success: resolve, fail: reject }) })
    const { iv, encryptedData, signature } = d
    const getToken = (code) => new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.URLPREFIX + 'user/login',
        data: { code, iv, encryptedData, signature },
        method: 'POST',
        success: resolve,
        fail: reject
      })
    })
    return getCode()
      .then(res => getToken(res.code))
      .then(res => {
        console.log('authorization getToken!!', res)
        wx.setStorageSync('token', res.data.token)
      })
  },
  updateUserInfo (o) {
    return app.get(app.globalData.URLPREFIX + 'user', {
      nickName: o.userInfo.nickName,
      avatarUrl: o.userInfo.avatarUrl
    }, 'PUT')
  }
})