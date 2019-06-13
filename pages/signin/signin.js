const app = getApp()
Page({
  data: {
    alertMsg: '',
    titleAnimationData: {},
    authorAnimationData: {},
    contentAnimationData: [],
    btnDisabled: true,
    signinScore: 0,
    continuousSign: 0,
    totalSign: 0,
    tip: '',
    poem: {
      title: '',
      author: '',
      poemContent: []
    }
  },
  onReady () {
    this.getSignInfo()
  },
  initPlay () {
    this.initAnimate()
    setTimeout(() => {
      this.setData({ btnDisabled: false })
    }, 1800 + this.data.poem.poemContent.length * 1600)
  },
  clearAnimate () {
    this.setData({ btnDisabled: true, titleAnimationData: {}, authorAnimationData: {}, contentAnimationData: [] })
  },
  initAnimate () {
    const titleAnimation = wx.createAnimation({
      duration: 800,
  	  timingFunction: 'linear',
    })
    const authorAnimation = wx.createAnimation({
      duration: 800,
      timingFunction: 'linear',
      delay: 900
    })
    const contentAnimation = []
    const contentAnimationData = []
    for (let i = 0; i < this.data.poem.poemContent.length; i++) {
      contentAnimation[i] = wx.createAnimation({
        duration: 1500,
        timingFunction: 'linear',
        delay: 1800 + i * 1600
      })
      contentAnimation[i].width('100%').step()
      contentAnimationData[i] = contentAnimation[i].export()
    }
    titleAnimation.width('100%').step()
    authorAnimation.width('100%').step()
    this.setData({
      titleAnimationData: titleAnimation.export(),
      authorAnimationData: authorAnimation.export(),
      contentAnimationData
    })
  },
  getSignInfo () {
    return app.get(app.globalData.URLPREFIX + 'user/attend')
      .then(res => {
        const { continuousSign, poem, signinScore, tip, totalSign } = res.data
        this.setData({
          continuousSign,
          poem,
          signinScore: (signinScore / 10).toFixed(2),
          tip,
          totalSign
        }, () => this.initPlay())
      })
  },
  signin () {
    if (this.data.btnDisabled) return
    return app.get(app.globalData.URLPREFIX + 'user/attend', {}, 'PUT')
      .then(res => {
        if (res.success) {
          this.setData({ alertMsg: '签到成功！' }, () => this.getSignInfo())
        } else {
          this.setData({ alertMsg: res.msg })
        }
      })
  },
  hideAlert () {
    this.setData({ alertMsg: '' })
  }
})