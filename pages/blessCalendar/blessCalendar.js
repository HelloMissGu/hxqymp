import { formatTime, formatWeekday } from '../../utils/util'

const app = getApp()

Page({
  data: {
    type: '',
    currentDate: null,
    calendarTitle: ['日', '一', '二', '三', '四', '五', '六'],
    dateList: [],
    chooseIndex: '',
    isShow: false,
    promptData: null,
    promptBtnType: false,  // true 显示取消，false 显示选择
    chosenDateList: [],
    alertMsg: '',
    paddingArr: []
  },
  onLoad (options) {
    console.log(options)
    this.setData({ type: options.type, currentDate: new Date(), chooseIndex: (new Date()).getDate() - 1 })
    this._getDate(this.data.currentDate)
  },
  handleCalendarItem (e) {
    const index = e.currentTarget.dataset.index + 1
    const date = new Date(this.data.currentDate)
    const chooseDate = date.setDate(+index)
    if ((new Date(chooseDate)).getTime() <= (new Date()).getTime()) {
      return this.setData({ alertMsg: '所选日期不合理' })
    }
    if (this.properties.type !== 'light') {
      const data = {}
      const isChosen = !!e.currentTarget.dataset.ischosen
      data.date = formatTime(new Date(chooseDate))
      data.weekday = formatWeekday(new Date(chooseDate).getDay())
      data.lunar = this.data.dateList[index - 1][0]
      data.special = this.data.dateList[index - 1][1]
      this.setData({ chooseIndex: index - 1, promptData: data, promptBtnType: isChosen })
    } else {
      const data = {}
      const isChosen = !!e.currentTarget.dataset.ischosen
      data.date = formatTime(new Date(chooseDate))
      data.weekday = formatWeekday(new Date(chooseDate).getDay())
      data.lunar = this.data.dateList[index - 1][0]
      data.special = this.data.dateList[index - 1][1]
      this.setData({ chooseIndex: index - 1, promptData: data, promptBtnType: isChosen })
    }
    console.log(formatTime(new Date(chooseDate)))
  },
  hideAlert () {
    this.setData({ alertMsg: '' })
  },
  _cancelDateChoose() {
    this.setData({ promptData: null })
  },
  _renderChosenIcon () {
    if (this.data.chosenDateList.length) {
      const cArrayMap = this.data.chosenDateList.map(item => item.lunar)
      for (let i = 0; i < cArrayMap.length; i++) {
        for (let j = 0; j < this.data.dateList.length; j++) {
          if (this.data.dateList[j][0] === cArrayMap[i]) {
            const k = `dateList[${j}][2]`
            this.setData({ [k]: true })
          }
        }
      }
    }
  },
  _genPaddingDays () {
    const currentDate = this.data.currentDate
    const date = new Date(currentDate)
    const newDate = date.setDate(1)
    const day = new Date(newDate).getDay()
    const len = +day
    const arr = []
    for (var i = 0; i < len; i++) {
      arr[i] = ' '
    }
    this.setData({ paddingArr: arr })
  },
  _hidePrompt () {
    this.setData({ promptData: null })
  },
  _dateChoose () {
    if (this.data.type === 'light') {
      const array = this.data.chosenDateList
      array.push(this.data.promptData)
      this.setData({ chosenDateList: array })
      if (this.data.chosenDateList.length) {
        const cArrayMap = this.data.chosenDateList.map(item => item.lunar)
        for (let i = 0; i < cArrayMap.length; i++) {
          if (this.data.promptBtnType) {
            const k = `dateList[${this.data.chooseIndex}][2]`
            this.setData({ [k]: false })
            this._clearRepeatedList()
          } else {
            for (let j = 0; j < this.data.dateList.length; j++) {
              if (this.data.dateList[j][0] === cArrayMap[i]) {
                const k = `dateList[${j}][2]`
                this.setData({ [k]: true })
              }
            }
          }
        }
      }
    } else {
      const monthArray = this.data.dateList
      monthArray.forEach(date => date[2] = false)
      const array = this.data.chosenDateList
      array[0] = this.data.promptData
      this.setData({ chosenDateList: array, dateList: monthArray })
      if (this.data.chosenDateList.length) {
        const cArrayMap = this.data.chosenDateList.map(item => item.lunar)
        for (let i = 0; i < cArrayMap.length; i++) {
          if (this.data.promptBtnType) {
            const k = `dateList[${this.data.chooseIndex}][2]`
            this.setData({ [k]: false })
            this._clearRepeatedList()
          } else {
            const k = `dateList[${this.data.chooseIndex}][2]`
            this.setData({ [k]: true })
          }
        }
      }
    }
    this.setData({ promptData: null })
  },
  _clearRepeatedList () {
    const arr = this.data.chosenDateList
    const array = []
    for (let i = 0; i < arr.length; i++) {
      if (array.some(item => item.date === arr[i].date)) {
        array.forEach(item => {
          if (item.date === arr[i].date) {
            item.count++
          }
        })
      } else {
        arr[i].count = 1
        array.push(arr[i])
      }
    }
    this.setData({ chosenDateList: array.filter(item => item.count % 2 !== 0) })
  },
  _clearAllSelect () {
    this._clearRepeatedList()
    for (let i = 0; i < this.data.dateList.length; i++) {
      let k = `dateList[${i}][2]`
      this.setData({ [k]: false })
    }
  },
  _handleQuickChoose (e) {
    const type = e.currentTarget.dataset.type
    let array = []
    const now = new Date()
    const currentDate = new Date(this.data.currentDate)
    this.setData({
      promptData: null,
      promptBtnType: false,
      chosenDateList: [],
    })
    this._clearAllSelect()
    array = this.data.dateList.map((item, index) => {
      return {
        date: formatTime(new Date(currentDate.setDate(index + 1))),
        weekday: formatWeekday(new Date(currentDate.setDate(index + 1)).getDay()),
        lunar: this.data.dateList[index][0],
        special: this.data.dateList[index][1]
      }
    })
    if (type === 'qy') {
      this.setData({ chosenDateList: array.filter(item => (new Date(item.date)) > now) })
      this._renderChosenIcon()
    } else {
      this.setData({
        chosenDateList: array.filter(item => ((item.lunar.indexOf('初一') !== -1) && ((new Date(item.date)) > now))
          || ((item.lunar.indexOf('十五') !== -1) && ((new Date(item.date)) > now)))
      })
      this._renderChosenIcon()
    }
  },
  _confirmDates () {
    if (this.data.type === 'light') {
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      prevPage.setData({ timeList: this.data.chosenDateList })
      this._clearRepeatedList()
      wx.navigateBack({ delta: 1 })
    } else {
      const chooseDate = this.data.chosenDateList[0].date
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      prevPage.setData({
        startTime: formatTime(new Date(chooseDate))
      })
      wx.navigateBack({ delta: 1 })
    }
  },
  _getDate (_date) {
    const date = new Date(_date)
    app.get(`${app.globalData.URLPREFIX}operation/_calendar-${date.getFullYear()}-${date.getMonth() + 1}`)
      .then(res => {
        if (res.message) {
          wx.showModal({ title: '暂不支持该日期' })
        } else {
          for (let i = 0; i < res.length; i++) {
            res[i][2] = false
          }
          this.setData({ dateList: res, currentDate: date })
          this._genPaddingDays()
          this._clearRepeatedList()
          this._renderChosenIcon()
        }
      })
      .catch(err => { console.log('暂不支持该日期') })
  },
  _changeMonth (e) {
    const date = new Date((new Date(this.data.currentDate)).setDate(1))
    const value = +e.currentTarget.dataset.value
    this._getDate(date.setMonth(date.getMonth() + value))
  }
})
