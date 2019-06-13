import { formatTime } from '../../utils/util'

const app = getApp()
Page({
  data: {
    banners: [],
    todayDate: '',
    announcementsIndex: 0,
    announcementsContent: [],
    alertMsg: '',
    date: [],
    meritsList: [],
    templeList: [],
    scroll: 0
  },
  onShow () {
    this.init()
  },
  init () {
    this.getBanner()
    this.getAnnouncements()
    this.getDate()
    this.getTemple()
    this.getLogs()
  },
  hideAlert () {
    this.setData({ alertMsg: '' })
  },
  handleDateTap () {
    const string = `${this.data.todayDate}\n农历：${this.data.date[0]}\n${this.data.date[1] ? `特殊：${this.data.date[1]}` : ''}`
    this.setData({ alertMsg: string })
  },
  handleAnnouncementChange (e) {
    this.setData({ announcementsIndex: e.detail.current })
  },
  handleAnnouncementTap (e) {
    this.setData({ alertMsg: this.data.announcementsContent[this.data.announcementsIndex].content })
  },
  handleBannerTap (e) {
    if (e.currentTarget.dataset.url === '') return
    console.log(e)
    wx.navigateTo({
      url: '/pages/out/out?url=' + e.currentTarget.dataset.url
    })
  },
  handleTempleTap (e) {
    wx.navigateTo({ url: `/pages/templeDetail/templeDetail?temple=${JSON.stringify(e.currentTarget.dataset.temple)}` })
  },
  getTemple () {
    // console.log(`/pages/templeDetail/templeDetail?temple=${JSON.stringify({ id: 'xxxxxxxxxxxxx' })}`)
    app.get(app.globalData.URLPREFIX + 'ecommerce/api/temple/temples')
      .then((res) => {
        const templeList = res.temples
        this.setData({ templeList })
      })
  },
  getLogs () {
    app.get(app.globalData.URLPREFIX + 'user/score_logs')
      .then(res => {
        console.log(res)
        if (res.success) {
          this.setData({ meritsList: res.logs })
        }
      })
  },
  getDate () {
    const date = new Date()
    app.get(`${app.globalData.URLPREFIX}operation/_calendar-${date.getFullYear()}-${date.getMonth() + 1}`)
      .then((res) => {
        this.setData({
          date: res[date.getDate() - 1],
          todayDate: formatTime(date)
        })
      })
  },
  getBanner () {
    app.get(app.globalData.URLPREFIX + 'operation/banners')
      .then((res) => this.setData({
        banners: res
      }))
  },
  getAnnouncements () {
    app.get(app.globalData.URLPREFIX + 'operation/announcements')
      .then((res) => {
        this.setData({ announcementsContent: res })
      })
  }
})
