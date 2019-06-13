const app = getApp()
const PAGESIZE = 6
Page({
  data: {
    donateList: [],
    hasNext: true
  },
  onShow () {
    this.getMyDonateList(1)
  },
  getMyDonateList (page = 1) {
    if (!this.data.hasNext) return
    if (page === 1) {
      return app.get(app.globalData.URLPREFIX + 'crowdfund/api/user/crowd_funds', { page, page_size: PAGESIZE })
        .then(res => this.setData({ hasNext: res.has_next, donateList: res.crowdfundings }))
    } else {
      return app.get(app.globalData.URLPREFIX + 'crowdfund/api/user/crowd_funds', { page, page_size: PAGESIZE })
        .then(res => {
          const data = res.crowdfundings
          const arr = this.data.donateList
          this.setData({ hasNext: res.has_next, donateList: arr.concat(data) })
        })
    }
  },
  reachBottom (e) {
    const page = Math.floor((this.data.donateList.length / PAGESIZE) + 1)
    this.getMyDonateList(page)
  }
})