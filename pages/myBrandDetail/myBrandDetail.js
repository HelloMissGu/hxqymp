const app = getApp()
Page({
  data: {
    templeId: '',
    orderDetail: {},
    alertMsg: '',
    redirect: ''
  },
  onLoad (options) {
    if (options.templeId) {
      this.setData({ templeId: options.templeId })
    }
    if (options.redirect === 'orders') {
      this.setData({ redirect: true })
    }
    this.getBrandDetail(options.id)
  },
  getBrandDetail (id) {
    return app.get(app.globalData.URLPREFIX + 'ecommerce/api/order/' + id)
      .then(res => {
        console.log(res)
        this.setData({ orderDetail: res })
      })
  },
  previewImage (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.orderDetail.images
    })
  },
  rebuy () {
    const temple = { id: this.data.templeId }
    wx.navigateTo({ url: '/pages/templeDetail/templeDetail?temple=' + JSON.stringify(temple) })
  },
  cancelBuy () {
    const { id } = this.data.orderDetail
    return app.get(app.globalData.URLPREFIX + 'ecommerce/api/order/close', {
      order_id: id
    }, 'POST')
      .then(res => {
        this.setData({ alertMsg: '订单已取消' })
      })
  },
  buy () {
    const { id } = this.data.orderDetail
    return app.get(app.globalData.URLPREFIX + 'ecommerce/api/order/repay', {
      order_id: id
    }, 'POST')
      .then(res => {
        console.log(res)
        const { timeStamp, nonceStr, signType, paySign } = res.data
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: res.data.package,
          signType,
          paySign,
          success (res) {
            wx.redirectTo({ url: '/pages/payResult/payResult?type=brand' })
          },
        })
      })
  },
  hideAlert () {
    this.setData({ alertMsg: '' }, () => {
      if (this.data.redirect) {
        wx.redirectTo({ url: '/pages/myBrand/myBrand' })
      } else {
        wx.navigateBack()
      }
    })
  }
})