const app = getApp()

Page({
  data: {
    userList: [],
    activeIndex: '',
    type: ''
  },
  onLoad (options) {
    console.log(options)
    this.getUserList()
    this.setData({ type: options.userListType })
  },
  chooseUser (e) {
    this.setData({ activeIndex: e.currentTarget.dataset.index })
    const pages = getCurrentPages()
    const currPage = pages[pages.length - 1]
    const prevPage = pages[pages.length - 2]
    if (this.data.type === 'qf') {
      prevPage.setData({
        qfUserName: this.data.userList[this.data.activeIndex].name,
        qfRegion: this.data.userList[this.data.activeIndex].address.split(',')
      })
    } else if (this.data.type === 'sf') {
      prevPage.setData({
        sfUserName: this.data.userList[this.data.activeIndex].name,
        sfRegion: this.data.userList[this.data.activeIndex].address.split(',')
      })
    } else if (this.data.type === 'sfed') {
      prevPage.setData({
        sfedUserName: this.data.userList[this.data.activeIndex].name,
        sfedRegion: this.data.userList[this.data.activeIndex].address.split(',')
      })
    }
    wx.navigateBack({ delta: 1 })
  },
  getUserList () {
    return app.get(app.globalData.URLPREFIX + 'user/friends')
      .then(res => {
        console.log(res)
        this.setData({ userList: res.friends })
      })
  },
})
