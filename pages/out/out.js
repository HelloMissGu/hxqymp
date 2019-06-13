const app = getApp()
Page({
  data: {
    outerUrl: ''
  },
  onLoad (options) {
    console.log(options.url)
    this.setData({
      outerUrl: options.url
    })
  }
})