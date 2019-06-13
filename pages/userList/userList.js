const app = getApp()

Page({
  data: {
    userList: [],
    activeIndex: '',
    isAdding: false,
    newUserName: '',
    newUserRegion: '',
    alertMsg: ''
  },
  onShow () {
    this.getFriends()
  },
  getFriends() {
    return app.get(app.globalData.URLPREFIX + 'user/friends')
      .then(res => {
        this.setData({ userList: res.friends })
      })
  },
  addNewUser () {
    return app.get(app.globalData.URLPREFIX + 'user/friends', {
      name: this.data.newUserName,
      province_id: this.data.newUserRegion.code[0],
      city_id: this.data.newUserRegion.code[1],
      district_id: this.data.newUserRegion.code[2],
      address: this.data.newUserRegion.value.join(',')
    }, 'POST')
      .then(res => {
        this.setData({ isAdding: false, newUserName: '', newUserRegion: '' })
        this.getFriends()
      })
  },
  chooseUser (e) {
    this.setData({ activeIndex: e.currentTarget.dataset.index })
  },
  delUser (e) {
    console.log(e.currentTarget.dataset.user)
    return app.get(app.globalData.URLPREFIX + 'user/friends/' + e.currentTarget.dataset.user.id, {}, 'DELETE')
      .then(() => {
        this.setData({ activeIndex: '' })
        this.getFriends()
      })
  },
  addUser () {
    this.setData({ isAdding: true, activeIndex: '' })
  },
  confirmSave () {
    if (this.data.newUserName === '') {
      return this.setData({ alertMsg: '请完善缘主姓名信息' })
    } else if (this.data.newUserRegion.length === 0) {
      return this.setData({ alertMsg: '请完善缘主地址信息' })
    } else {
      this.addNewUser()
    }
  },
  cancelSave () {
    this.setData({ isAdding: false, newUserName: '', newUserRegion: '' })
  },
  handleNewUserName (e) {
    this.setData({ newUserName: e.detail.value })
  },
  handleNewUserRegion: function (e) {
    this.setData({ newUserRegion: e.detail })
  },
  hideAlert () {
    this.setData({ alertMsg: '' })
  },
})