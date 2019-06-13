const app = getApp()
import { formatTime } from '../../utils/util'
Page({
  data: {
    TYPE: 'light',
    UNIT: '',
    TEMPLE_ID: '',
    timeChooseBarIndex: '',
    timeChooseBarList: [
      { label: '三个月', value: 90 },
      { label: '半年', value: 180 },
      { label: '一年', value: 365 }
    ],
    blessItem: {
      id: '',
      name: '',
      price: 0,
      image: '',
      describe: '',
      type: ''
    },
    // 供灯表单字段
    timeList: [],
    dailyLightAmount: '',
    lightTemplates: [],

    timeTotal: '',
    startTime: '',
    userType: 'qf',
    // brandType: 'ws',
    alertMsg: '',
    // qf
    qfUserName: '',
    qfRegion: [],
    qfBless: '',
    // sf
    sfedUserName: '',
    sfedRegion: [],
    sfUserName: '',
    sfRegion: [],
    sfBless: ''
  },
  onLoad (options) {
    console.log(options)
    const blessItem = JSON.parse(options.product)
    if (options.type !== 'light') {
      blessItem.templates = JSON.parse(blessItem.templates)
      this.setData({ TYPE: options.type, blessItem, TEMPLE_ID: options.templeId })
      if (options.type === 'ribbon') {
        this.setData({ qfBless: this.data.blessItem.templates[0].content, sfBless: this.data.blessItem.templates[0].content })
      }
    } else {
      this.getLightBlessTemplates()
      this.setData({ TYPE: options.type, blessItem, TEMPLE_ID: options.templeId })
    }
    this.setRender()
  },
  onReady () {
    this.calendar = this.selectComponent('#calendar')
  },
  // 处理供灯表单部分
  getLightBlessTemplates () {
    return app.get(app.globalData.URLPREFIX + 'operation/GD_template')
      .then(res => this.setData({ lightTemplates: res }))
  },
  handleDailyLightsInput (e) {
    this.setData({ dailyLightAmount: e.detail.value })
  },
  handleQfUserName (e) {
    this.setData({ qfUserName: e.detail.value })
  },
  handleQfRegionChange (e) {
    this.setData({ qfRegion: e.detail.value })
  },
  handleQfBless (e) {
    this.setData({ qfBless: e.detail.value })
  },
  handleQfPickerBless (e) {
    if (this.data.TYPE === 'light') {
      this.setData({ qfBless: this.data.lightTemplates[e.detail.value].content })
    } else {
      this.setData({ qfBless: this.data.blessItem.templates[e.detail.value].content })
    }
  },
  handleSfedUserName (e) {
    this.setData({ sfedUserName: e.detail.value })
  },
  handleSfedRegionChange (e) {
    this.setData({ sfedRegion: e.detail.value })
  },
  handleSfUserName (e) {
    this.setData({ sfUserName: e.detail.value })
  },
  handleSfRegionChange (e) {
    this.setData({ sfRegion: e.detail.value })
  },
  handleSfBless (e) {
    this.setData({ sfBless: e.detail.value })
  },
  handleSfPickerBless (e) {
    if (this.data.TYPE === 'light') {
      this.setData({ sfBless: this.data.lightTemplates[e.detail.value].content })
    } else {
      this.setData({ sfBless: this.data.blessItem.templates[e.detail.value].content })
    }
  },
  // 时间选择部分
  handleTimeBar (e) {
    const index = e.currentTarget.dataset.index
    const nowIndex = this.data.timeChooseBarIndex
    if (index === nowIndex) {
      this.setData({ timeChooseBarIndex: '', timeTotal: 0 })
    } else {
      const value = this.data.timeChooseBarList[index].value
      this.setData({ timeChooseBarIndex: index, timeTotal: value })
    }
  },
  handleDaysInput (e) {
    if (!e.detail.value) {
      return this.setData({ timeTotal: '' })
    }
    this.setData({ timeTotal: e.detail.value })
    this.data.timeChooseBarList.forEach((i, index) => {
      if (i.value === +e.detail.value) {
        this.setData({timeChooseBarIndex: index})
      }
    })
    if (this.data.timeChooseBarList.every((i, index) => i.value !== +e.detail.value)) {
      this.setData({timeChooseBarIndex: ''})
    }
  },
  deleteChooseTimeItem (e) {
    const array = this.data.timeList
    let index;
    array.forEach((item, index) => {
      if (item.date === e.currentTarget.dataset.time.date) {
        index = index
      }
    })
    array.splice(index, 1)
    this.setData({ timeList: array })
  },
  showCalendar () {
    const type = this.data.TYPE
    wx.navigateTo({ url: `/pages/blessCalendar/blessCalendar?type=${type}` })
  },
  // 缘主选择部分
  showUserList (e) {
    wx.navigateTo({ url: `/pages/blessUserList/blessUserList?userListType=${e.currentTarget.dataset.type}` })
  },
  handleUserType (e) {
    if (e.currentTarget.dataset.usertype === 'qf') {
      this.setData({
        userType: e.currentTarget.dataset.usertype,
        sfedUserName: '',
        sfedRegion: [],
        sfUserName: '',
        sfRegion: [],
      })
      if (this.data.TYPE !== 'ribbon') {
        this.setData({ sfBless: '' })
      }
    } else {
      this.setData({
        userType: e.currentTarget.dataset.usertype,
        qfUserName: '',
        qfRegion: []
      })
      if (this.data.TYPE !== 'ribbon') {
        this.setData({ qfBless: '' })
      }
    }
    this.setData({ userType: e.currentTarget.dataset.usertype })
  },
  bless () {
    const productType = this.data.TYPE
    const userType = this.data.userType
    let blessObj = {}
    let result = ''
    if (productType === 'light') {
      result = this.checkLightBless(userType)
    } else if (productType === 'ribbon') {
      result = this.checkRibbonBless(userType)
    } else if (productType === 'brand') {
      result = this.checkBrandBless(this.data.blessItem.type)
    }
    if (result === true) {
      blessObj = {
        product_id: this.data.blessItem.id,
        temple_id: this.data.TEMPLE_ID,
      }
      if (productType === 'light') {
        blessObj.dates = this.data.timeList.map(d => d.date)
        blessObj.per_day_number = +this.data.dailyLightAmount
        if (this.data.userType === 'qf') {
          blessObj.patron_info = {
            purchaser_name: this.data.qfUserName,
            purchaser_address: this.data.qfRegion.join(','),
            content: this.data.qfBless
          }
        } else if (this.data.userType === 'sf') {
          blessObj.patron_info = {
            purchaser_name: this.data.sfUserName,
            purchaser_address: this.data.sfRegion.join(','),
            beneficiary_name: this.data.sfedUserName,
            beneficiary_address: this.data.sfedRegion.join(','),
            content: this.data.sfBless
          }
        }
      } else if (productType === 'ribbon') {
        blessObj.start_time = this.data.startTime
        const date = new Date(this.data.startTime)
        blessObj.end_time = formatTime(new Date(date.setDate(date.getDate() + (+this.data.timeTotal - 1))))
        if (this.data.userType === 'qf') {
          blessObj.patron_info = {
            purchaser_name: this.data.qfUserName,
            purchaser_address: this.data.qfRegion.join(','),
            content: this.data.qfBless
          }
        } else if (this.data.userType === 'sf') {
          blessObj.patron_info = {
            purchaser_name: this.data.sfUserName,
            purchaser_address: this.data.sfRegion.join(','),
            beneficiary_name: this.data.sfedUserName,
            beneficiary_address: this.data.sfedRegion.join(','),
            content: this.data.sfBless
          }
        }
      } else if (productType === 'brand') {
        blessObj.start_time = this.data.startTime
        const date = new Date(this.data.startTime)
        blessObj.end_time = formatTime(new Date(date.setDate(date.getDate() + (+this.data.timeTotal - 1))))
        if (this.data.blessItem.type === 'CS') {
          blessObj.patron_info = {
            purchaser_name: this.data.qfUserName,
            purchaser_address: this.data.qfRegion.join(','),
            content: this.data.qfBless
          }
        } else {
          blessObj.patron_info = {
            beneficiary_name: this.data.sfedUserName,
            beneficiary_address: this.data.sfedRegion.join(','),
            purchaser_name: this.data.sfUserName,
            purchaser_address: this.data.sfRegion.join(',')
          }
        }
      }
      this.postOrder(blessObj)
    } else {
      this.setData({ alertMsg: result })
    }
  },
  postOrder (o) {
    return app.get(app.globalData.URLPREFIX + 'ecommerce/api/order/create', o, 'POST')
      .then(res => {
        console.log(res)
        if (res.msg) {
          return this.setData({ alertMsg: res.msg })
        }
        const { timeStamp, nonceStr, signType, paySign } = res.pay_info.data
        const { order_id } = res
        const { TYPE } = this.data
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: res.pay_info.data.package,
          signType,
          paySign,
          success (res) {
            console.log('SUCCESS', res)
            wx.redirectTo({ url: '/pages/payResult/payResult?type=' + TYPE })
          },
          fail (res) {
            console.log('FAIL', res)
            if (TYPE === 'ribbon') {
              wx.redirectTo({ url: '/pages/myRibbonDetail/myRibbonDetail?redirect=orders&id=' + order_id })
            } else if (TYPE === 'light') {
              wx.redirectTo({ url: '/pages/myLightDetail/myLightDetail?redirect=orders&id=' + order_id })
            } else if (TYPE === 'brand') {
              wx.redirectTo({ url: '/pages/myBrandDetail/myBrandDetail?redirect=orders&id=' + order_id })
            }
          }
        })
      })
  },
  checkLightBless (type) {
    const data = this.data
    if (data.dailyLightAmount === '' || +data.dailyLightAmount === 0) return '请输入每日供灯盏数'
    else if (data.timeList.length === 0) return '请选择祈福时间'
    if (type === 'qf') {
      if (!data.qfUserName) return '请输入或选择祈福人姓名'
      if (data.qfRegion.length === 0) return '请选择祈福人地址'
      if (!data.qfBless) return '请输入或选择祈福语'
    } else if (type === 'sf') {
      if (!data.sfedUserName) return '请输入或选择被送福人姓名'
      if (data.sfedRegion.length === 0) return '请选择被送福人地址'
      if (!data.sfUserName) return '请输入或选择送福人姓名'
      if (data.sfRegion.length === 0) return '请选择送福人地址'
      if (!data.sfBless) return '请输入或选择祈福语'
    }
    return true
  },
  checkRibbonBless (type) {
    const data = this.data
    if (!data.timeTotal) return '请输入祈福天数'
    else if (!data.startTime) return '请选择祈福开始时间'
    if (type === 'qf') {
      if (!data.qfUserName) return '请输入或选择祈福人姓名'
      if (data.qfRegion.length === 0) return '请选择祈福人地址'
    } else if (type === 'sf') {
      if (!data.sfedUserName) return '请输入或选择被送福人姓名'
      if (data.sfedRegion.length === 0) return '请选择被送福人地址'
      if (!data.sfUserName) return '请输入或选择送福人姓名'
      if (data.sfRegion.length === 0) return '请选择送福人地址'
    }
    return true
  },
  checkBrandBless (type) {
    const data = this.data
    if (!data.timeTotal) return '请输入祈福天数'
    else if (+data.timeTotal < 30) return '供养天数不应低于 30 天'
    else if (!data.startTime) return '请选择祈福开始时间'
    if (type === 'CS') {
      if (!data.qfUserName) return '请输入或选择祈福人姓名'
      if (data.qfRegion.length === 0) return '请选择祈福人地址'
      if (!data.qfBless) return '请选择祈福语'
    } else if (type === 'WS') {
      if (!data.sfedUserName) return '请输入超度人姓名'
      if (data.sfedRegion.length === 0) return '请选择超度人地址'
      if (!data.sfUserName) return '请输入阳上人姓名'
      if (data.sfRegion.length === 0) return '请选择阳上人地址'
    }
    return true
  },
  hideAlert () {
    this.setData({ alertMsg: '' })
  },
  setRender () {
    let unit = ''
    switch (this.data.TYPE) {
      case 'light':
        unit = '元/盏'
        break
      case 'ribbon':
        unit = '元/条'
        break
      case 'brand':
        unit = '元/天'
        break
    }
    this.setData({ UNIT: unit })
  }
})