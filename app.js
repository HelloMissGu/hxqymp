App({
  onLaunch () {
    const app = this
    wx.getSetting({
      success (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          app.login()
            .then(() => {
              console.log('direct to home')
              wx.switchTab({ url: '/pages/home/home' })
            })
        }
      }
    })
  },
  onShow () {
    if (this.globalData.musicStatus === true) {
      this.login()
        .then(() => { this.getMusic() })
    }
  },
  onHide () {
    this.globalData.backgroundAudioManager.pause()
  },
  checkSession () {
    return new Promise((resolve, reject) => { wx.checkSession({ success: resolve, fail: reject }) })
  },
  login () {
    const app = this
    console.log('login!!!!!')
    const getCode = () => new Promise((resolve, reject) => { wx.login({ success: resolve, fail: reject }) })
    const getToken = (code) => new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.URLPREFIX + 'user/login',
        data: { code },
        method: 'POST',
        success: resolve,
        fail: reject
      })
    })
    return getCode()
      .then(res => getToken(res.code))
      .then(res => {
        console.log('app getToken!!', res)
        wx.setStorageSync('token', res.data.token)
      })
  },
  getPromised (params) {
    console.log('getPromised done')
    return new Promise((resolve, reject) => {
      params.success = (res) => { resolve(res.data) }
      params.fail = (err) => { reject(err) }
      wx.request(params)
    })
  },
  get (url, data, method = 'GET') {
    const app = this
    const token = wx.getStorageSync('token')
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        method,
        header: { 'Authorization': `Bearer ${token}` },
        success (res) {
          if (res.statusCode === 401) {
            console.log('lalalal 401')
            app.login()
              .then(() => {
                return app.getPromised({ url, data, method, header: { 'Authorization': `Bearer ${wx.getStorageSync('token')}` } })
              })
          } else {
            resolve(res.data)
          }
        },
        fail (err) { reject(err) }
      })
    })
    return promise
  },
  getMusic () {
    if (this.globalData.backgroundAudioManager.src) {
      this.globalData.backgroundAudioManager.play()
    } else {
      this.get(this.globalData.URLPREFIX + 'operation/music')
        .then(res => {
          this.globalData.backgroundAudioManager.title = '功德无量'
          this.globalData.backgroundAudioManager.src = res.url
          this.globalData.backgroundAudioManager.onEnded(() => {
            this.globalData.backgroundAudioManager.title = '功德无量'
            this.globalData.backgroundAudioManager.src = res.url
          })
        })
    }
  },
  globalData: {
    backgroundAudioManager: wx.getBackgroundAudioManager(),
    // URLPREFIX: 'https://api.huaxiaqy.com/',
    URLPREFIX: 'https://api.demo.huaxiaqy.com/',
    musicStatus: true
  }
})
// api.gongde.sya.org.cn