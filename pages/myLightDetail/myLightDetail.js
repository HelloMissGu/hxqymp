const app = getApp()

Page({
  data: {
    templeId: '',
    orderDetail: {},
    alertMsg: '',
    redirect: ''
  },
  onLoad (options) {
    console.log(options)
    if (options.templeId) {
      this.setData({ templeId: options.templeId })
    }
    if (options.redirect === 'orders') {
      this.setData({ redirect: true })
    }
    this.getLightDetail(options.id, options.date)
  },
  getLightDetail (id, date) {
    return app.get(app.globalData.URLPREFIX + 'ecommerce/api/order/' + id + '?date=' + date)
      .then(res => {
        console.log(res)
        if (res.dates) {
          this.convertDates(res.dates)
            .then(arr => {
              res.dates = arr
              this.setData({ orderDetail: res })
            })
        }
        this.setData({ orderDetail: res })
      })
  },
  convertDates (dates) {
    const result = []
    const dateObj = {}
    const datePrefix = dates.map(d => d.substring(0, 7))
    const dateDate = dates.map(d => d.substring(8, 10))
    datePrefix.forEach((item, index) => {
      if (Object.keys(dateObj).indexOf(item) > -1) {
        dateObj[item].push(dateDate[index])
      } else {
        dateObj[item] = [dateDate[index]]
      }
    })
    const keys = Object.keys(dateObj)
    const promises = keys.map(k => k.replace('-0', '-')).map(k => app.get(`${app.globalData.URLPREFIX}operation/_calendar-${k}`))
    return Promise.all(promises)
      .then(res => {
        keys.forEach((k, i) => {
          dateObj[k].forEach(date => {
            let obj = {
              label: `${k}-${date}`,
              lunar: res[i][+date - 1][0],
              special: res[i][+date - 1][1],
            }
            result.push(obj)
          })
        })
        return result
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
            wx.redirectTo({ url: '/pages/payResult/payResult?type=light' })
          },
        })
      })
  },
  hideAlert () {
    this.setData({ alertMsg: '' }, () => {
      if (this.data.redirect) {
        wx.redirectTo({ url: '/pages/myOrders/myOrders?type=light' })
      } else {
        wx.navigateBack()
      }
    })
  }
})