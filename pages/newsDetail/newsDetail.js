import WxParse from '../../utils/wxParse/wxParse'

const app = getApp()
Page({
  data: {
    news: {
      title: '',
      content: ''
    }
  },
  onLoad (options) {
    this.getNewsDetail(options.id)
  },
  getNewsDetail (id) {
    return app.get(app.globalData.URLPREFIX + 'news/' + id)
      .then(res => {
        let article = res.news.content
        console.log(article)
        let that = this
        WxParse.wxParse('article', 'html', article, that, 5)
        this.setData({ news: res.news })
      })
  }
})
// {{item.previews.length ? item.previews[0].image_url : ''}}