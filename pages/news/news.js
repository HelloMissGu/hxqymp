const app = getApp()
const PAGESIZE = 6
Page({
  data: {
    type: 'news',
    newsList: [],
    newsListNext: '',
    donateList: [],
    hasNext: true
  },
  onShow () {
    this.setData({ hasNext: true })
    this.getDonateList(1)
    this.getNewsList()
  },
  getDonateList (page = 1) {
    if (!this.data.hasNext) return
    if (page === 1) {
      return app.get(app.globalData.URLPREFIX + 'crowdfund/api/crowd_funds', { page, page_size: PAGESIZE })
        .then(res => this.setData({ hasNext: res.has_next, donateList: res.crowdfundings }))
    } else {
      return app.get(app.globalData.URLPREFIX + 'crowdfund/api/crowd_funds', { page, page_size: PAGESIZE })
        .then(res => {
          const data = res.crowdfundings
          const arr = this.data.newsList
          this.setData({ hasNext: res.has_next, donateList: arr.concat(data) })
        })
    }
  },
  getNewsList () {
    return app.get(app.globalData.URLPREFIX + 'news?is_show=1')
      .then(res => {
        this.setData({ newsList: res.data.data, newsListNext: res.data.next_page_url && res.data.next_page_url.replace('http', 'https') })
      })
  },
  getMoreNews () {
    if (this.data.newsListNext === null) return
    return app.get(this.data.newsListNext + '&is_show=1')
      .then(res => {
        const data = res.data.data
        const arr = this.data.newsList
        this.setData({ newsList: arr.concat(data), newsListNext: res.data.next_page_url && res.data.next_page_url.replace('http', 'https') })
      })
  },
  reachNewsBottom (e) {
    if (this.data.type === 'news') {
      this.getMoreNews()
    } else {
      const page = Math.floor((this.data.donateList.length / PAGESIZE) + 1)
      this.getDonateList(page)
    }
  },
  changeType (e) {
    this.setData({ type: e.currentTarget.dataset.type })
  }
})