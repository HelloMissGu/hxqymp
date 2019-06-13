import WxParse from '../../utils/wxParse/wxParse'

const app = getApp()
Page({
  data: {
    donateDetail: {
      id: '',
      image: '',
      title: '',
      temple_name: '',
      end_time: '',
      status: '',
      amount: 0,
      current_amount: 0,
      price: 0,
      introduce: '',
      order_user_total: 0,
      order_total: 0
    },
    donateUserList: [],
    donateValue: 0,
    introTab: 'yq',
    paddingArr: '',
    alertMsg: ''
  },
  onLoad (options) {
    this.getDonateDetail(options.id)
      .then(() => this.initPaddingArr())
      .then(() => this.getDonateUsers(options.id))
      .then(() => this.getOrders())
  },
  hideAlert () {
    this.setData({ alertMsg: '' })
  },
  payDonate () {
    return app.get(app.globalData.URLPREFIX + 'crowdfund/api/crowd_funds_orders', {
      crowd_funding_id: this.data.donateDetail.id,
      number: +this.data.donateValue
    }, 'POST')
      .then(res => {
        if (res.msg) return this.setData({ alertMsg: res.msg })
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success (res) {
            wx.redirectTo({ url: '/pages/myDonate/myDonate' })
          }
        })
      })
  },
  getOrders () {
    return app.get(app.globalData.URLPREFIX + 'crowdfund/api/user/crowd_funds')
      .then(res => console.log(res))
  },
  handleDonateInput (e) {
    this.setData({ donateValue: e.detail.value })
  },
  changeDonateType (e) {
    this.setData({ introTab: e.currentTarget.dataset.type })
  },
  getDonateDetail (id) {
    return app.get(app.globalData.URLPREFIX + 'crowdfund/api/crowd_fund/' + id)
      .then(res => {
        let yqArticle = res.introduce
        let donateReport = res.report
        let that = this
        WxParse.wxParse('yqArticle', 'html', yqArticle, that, 5)
        WxParse.wxParse('donateReport', 'html', donateReport, that, 5)
        this.setData({ donateDetail: res })
      })
  },
  getDonateUsers (id) {
    return app.get(app.globalData.URLPREFIX + 'crowdfund/api/crowd_fund/' + id + '/orders')
      .then(res => {
        const orders = res.orders
        orders.forEach(order => {
          const date = new Date(order.created.replace(/-/g, '/'))
          order.created = date.getTime()
        })
        console.log(orders)
        this.setData({ donateUserList: orders })
      })
  },
  initPaddingArr () {
    const len = (this.data.donateDetail.amount + '').length - ((this.data.donateDetail.amount - this.data.donateDetail.current_amount) + '').length
    this.setData({ paddingArr: 'a'.repeat(len) })
  }
})