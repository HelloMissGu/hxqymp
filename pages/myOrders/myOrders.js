const app = getApp()
const PAGESIZE = 6

const STATUSMAP = {
  'all': 'all',
  '供奉中': 'ing',
  '待供奉': 'tobless',
  '已结束': 'done',
  '待支付': 'topay',
  '已取消': 'cancel',
  '全部': 'all'
}

Page({
  data: {
    type: 'light',
    hasNext: {
      light: {
        all: true,
        ing: true,
        tobless: true,
        done: true,
        topay: true,
        cancel: true
      },
      ribbon: {
        all: true,
        ing: true,
        tobless: true,
        done: true,
        topay: true,
        cancel: true
      }
    },
    statusList: [
      { label: '全部订单', value: '全部' },
      { label: '供奉中订单', value: '供奉中' },
      { label: '待供奉订单', value: '待供奉' },
      { label: '已结束订单', value: '已结束' },
      // { label: '待支付订单', value: '待支付' },
      // { label: '已取消订单', value: '已取消' },
    ],
    statusActive: '全部',
    orderList: {
      light: {
        all: [],
        ing: [],
        tobless: [],
        done: [],
        topay: [],
        cancel: []
      },
      ribbon: {
        all: [],
        ing: [],
        tobless: [],
        done: [],
        topay: [],
        cancel: []
      }
    }
  },
  onLoad (options) {
    if (options.type) {
      this.setData({ type: options.type })
    }
    this.getOrders(this.data.type, 1)
  },
  onShow () {
    this.getOrders(this.data.type, 1)
  },
  getOrders (type, page = 1, status = 'all') {
    const typeMap = { light: '供灯', ribbon: '福带' }
    const nextKey = `hasNext.${type}.${STATUSMAP[status]}`
    const listKey = `orderList.${type}.${STATUSMAP[status]}`

    if (
      (type === 'light' && !this.data.hasNext.light[`${STATUSMAP[status]}`])||
      (type === 'ribbon' && !this.data.hasNext.ribbon[`${STATUSMAP[status]}`])
    ) return

    if (page === 1) {
      return app.get(`${app.globalData.URLPREFIX}ecommerce/api/order?status=${status}&type=${typeMap[type]}&page=${page}&page_size=${PAGESIZE}`)
        .then(res => {
          this.setData({ [nextKey]: res.has_next, [listKey]: res.orders })
        })
    } else {
      return app.get(`${app.globalData.URLPREFIX}ecommerce/api/order?status=${status}&type=${typeMap[type]}&page=${page}&page_size=${PAGESIZE}`)
        .then(res => {
          const data = res.orders
          const arr = this.data.orderList[`${type}`][`${STATUSMAP[status]}`]
          this.setData({ [nextKey]: res.has_next, [listKey]: arr.concat(data) })
        })
    }
  },
  reachBottom () {
    const { statusActive, type } = this.data
    const page = Math.floor((this.data.orderList[`${type}`][`${STATUSMAP[statusActive]}`].length / PAGESIZE) + 1)
    this.getOrders(type, page, statusActive === '全部' ? 'all' : statusActive)
  },
  changeType (e) {
    const { type } = e.currentTarget.dataset
    this.setData({ type, statusActive: '全部' }, () => {
      if (this.data.orderList[`${type}`].all.length === 0) {
        this.getOrders(type, 1)
      }
    })
    // this.setData({ type, statusActive: '全部', orderList: this.data.orderList[`${type}`].all })
  },
  handleOrderType (e) {
    const status = e.currentTarget.dataset.status
    const type = this.data.type
    this.setData({ statusActive: status }, () => {
      this.getOrders(type, 1, status === '全部' ? 'all' : status)
    })
  },
  gotoTemple (e) {
    const temple = { id: e.currentTarget.dataset.temple }
    wx.navigateTo({ url: '/pages/templeDetail/templeDetail?temple=' + JSON.stringify(temple) })
  },
  handleDetail (e) {
    if (this.data.type === 'light') {
      wx.navigateTo({ url: '/pages/myLightDetail/myLightDetail?id=' + e.currentTarget.dataset.id + '&date=' + e.currentTarget.dataset.date + '&templeId=' + e.currentTarget.dataset.templeid })
    } else {
      wx.navigateTo({ url: '/pages/myRibbonDetail/myRibbonDetail?id=' + e.currentTarget.dataset.id + '&templeId=' + e.currentTarget.dataset.templeid })
    }
  }
})