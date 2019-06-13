import WxParse from '../../utils/wxParse/wxParse'

const app = getApp()
Page({
  data: {
    type: 'bless',
    lightList: [],
    ribbonList: [],
    brandList: [],
    temple: {
      address: '',
      id: '',
      name: '',
      subTitle: '小标题小标题',
      introduce: '',
      images: [],
      online_video: [
        {
          title: '',
          url: '',
          image: ''
        }
      ]
    }
  },
  onLoad (options) {
    console.log(options)
    const temple = JSON.parse(options.temple)
    console.log(temple)
    app.get(app.globalData.URLPREFIX + 'invitation', {
      store: temple.id,
      agent: options.agent
    }, 'POST')
      .then(res => console.log(res))
    this.getTempleDetail(temple.id)
      .then(res => this.getAllItemsList(res.id))
      .then(arr => this.setData({ lightList: arr[0].products, brandList: arr[1].products, ribbonList: arr[2].products  }))
  },
  getTempleDetail (templeId) {
    return app.get(app.globalData.URLPREFIX + 'ecommerce/api/temple/' + templeId)
      .then(res => {
        let article = res.introduce
        let that = this
        WxParse.wxParse('article', 'html', article, that, 5)
        this.setData({ temple: res })
        return res
      })
  },
  getAllItemsList (id) {
    const getLight = (id) => app.get(`${app.globalData.URLPREFIX}ecommerce/api/temple/${id}/products`, { type: '供灯' })
    const getBrand = (id) => app.get(`${app.globalData.URLPREFIX}ecommerce/api/temple/${id}/products`, { type: '牌位' })
    const getRibbon = (id) => app.get(`${app.globalData.URLPREFIX}ecommerce/api/temple/${id}/products`, { type: '福带' })
    return Promise.all([getLight(id), getBrand(id), getRibbon(id)])
  },
  getLight (id) {
    app.get(`${app.globalData.URLPREFIX}ecommerce/api/temple/${id}/products`, { type: '福带' })
      .then((res) => console.log(res))
  },
  handleBless (e) {
    console.log(e)
  },
  changeMenu (event) {
    this.setData({ type: event.target.dataset.type })
  }
})