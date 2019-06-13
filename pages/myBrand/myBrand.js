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
    hasNext: {
      all: true,
      ing: true,
      tobless: true,
      done: true,
      topay: true,
      cancel: true
    },
    statusList: [
      { label: '全部订单', value: '全部' },
      { label: '供奉中订单', value: '供奉中' },
      { label: '待供奉订单', value: '待供奉' },
      { label: '已结束订单', value: '已结束' },
      { label: '待支付订单', value: '待支付' },
      { label: '已取消订单', value: '已取消' },
    ],
    statusActive: '全部',
    allOrderList: {
      all: [],
      ing: [],
      tobless: [],
      done: [],
      topay: [],
      cancel: []
    }
  },
  onShow () {
    this.getBrandOrders(1)
  },
  getBrandOrders (page = 1, status = 'all') {
    let k = `allOrderList.${STATUSMAP[status]}`
    if (!this.data.hasNext[`${STATUSMAP[status]}`]) return
    if (page === 1) {
      return app.get(`${app.globalData.URLPREFIX}ecommerce/api/order?status=${status}&type=牌位&page=${page}&page_size=${PAGESIZE}`)
        .then(res => {
          this.setData({ [`hasNext.${STATUSMAP[status]}`]: res.has_next, [k]: res.orders })
        })
    } else {
      return app.get(`${app.globalData.URLPREFIX}ecommerce/api/order?status=${status}&type=牌位&page=${page}&page_size=${PAGESIZE}`)
        .then(res => {
          const data = res.orders
          const arr = this.data.allOrderList[`${STATUSMAP[status]}`]
          this.setData({ [`hasNext.${STATUSMAP[status]}`]: res.has_next, [k]: arr.concat(data) })
        })
    }
  },
  reachBottom () {
    const { statusActive } = this.data
    const statusKey = STATUSMAP[statusActive]
    const page = Math.floor((this.data.allOrderList[statusKey].length / PAGESIZE) + 1)
    this.getBrandOrders(page, statusActive === '全部' ? 'all' : statusActive)
  },
  handleOrderType (e) {
    this.setData({ statusActive: e.currentTarget.dataset.type }, () => {
      this.getBrandOrders (1, e.currentTarget.dataset.type === '全部' ? 'all' : e.currentTarget.dataset.type)
    })
  },
  gotoTemple (e) {
    const temple = { id: e.currentTarget.dataset.temple }
    wx.navigateTo({ url: '/pages/templeDetail/templeDetail?temple=' + JSON.stringify(temple) })
  },
  handleDetail (e) {
    wx.navigateTo({ url: '/pages/myBrandDetail/myBrandDetail?id=' + e.currentTarget.dataset.id + '&templeId=' + e.currentTarget.dataset.templeid })
  }
})