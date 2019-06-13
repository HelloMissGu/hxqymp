Page({
  data: {
    TYPE: 'light',
    payStatus: 'ok',
    canIUse: wx.canIUse('cover-view'),
    blessText: {
      light: [
        { type: 'image', value: 'http://pf95cnw72.bkt.clouddn.com/light-blesstext.png' },
        { type: 'text', value: '嗡啊吽！\n愿灯器等同三千大千世界，\n愿灯芯巨如须弥山王，\n愿油汁多如周边大海，\n愿灯数于一一佛前各亮一亿，\n愿灯光驱除有顶直至无间地狱，\n一切有情的无明黑暗，\n而现见十方诸佛菩萨刹土。\n嗡班则达玛阿罗给阿吽。\n诶玛吙！\n稀奇稀有光明灯，贤劫千尊佛陀等，\n浩瀚十方无余刹，师尊空行及护法，\n坛城尊众前供养，父母为主诸有情，\n愿今生及世世中，亲睹圆满佛净土，\n无别怙主无量光，依于三宝三根本，\n尊众谛实之威力，发愿速成祈加持。\n达雅塔，班赞哲亚阿瓦波达呢耶索哈。\n' },
        { type: 'text', value: '愿吉祥！\n一切如海如来前，供上无数如海灯，\n如海有情得成佛，轮回大海皆干涸\n' },
      ],
      ribbon: [
        { type: 'image', value: 'http://pf95cnw72.bkt.clouddn.com/ribbon-blesstext.png' },
        { type: 'text', value: '往昔所造诸恶业，皆由无始贪嗔痴。\n从身语意之所生，一切我今皆忏悔。\n至诚祈请佛菩萨，施降法雨照佛光。\n普照世界久和平，普照国家运昌盛。\n普照六道皆离苦，普照先亡皆超生。\n' }
      ],
      brand: [
        { type: 'image', value: 'http://pf95cnw72.bkt.clouddn.com/brand-blesstext.png' },
        { type: 'text', value: '皈依发心\n诸佛正法贤圣三宝尊，\n从今直至菩提永皈依，\n我以所修施等诸资粮，\n为利有情故愿大觉成！\n四无量心\n愿诸众生永具安乐及安乐因！\n愿诸众生永离众苦及众苦因！\n愿诸众生永具无苦之乐我心怡悦！\n愿诸众生远离贪嗔之心住平等舍\n' }
      ]
    },
  },
  onLoad (options) {
    this.setData({ TYPE: options.type })
  },
  goOrders () {
    const { TYPE } = this.data
    if (TYPE === 'brand') {
      wx.redirectTo({ url: '/pages/myBrand/myBrand' })
    } else {
      wx.redirectTo({ url: '/pages/myOrders/myOrders?type=' + TYPE })
    }
  },
  prevCode () {
    wx.previewImage({
      urls: ['http://pf95cnw72.bkt.clouddn.com/qrcode.png'],
    })
  }
})