const app = getApp()
Page({
  data: {
    TYPE: 'light',
    TEMPLE_ID: '',
    TYPEUNIT: '',
    INTROTITLE: '',
    maskShow: true,
    flowList: [],
    flowActive: 0,
    typeListRender: [],
    typeList: [],
    typeActive: 0,
    typeIntro: {
      light: [
        '灯，代表着智慧与光明，在佛前供灯隐含以灯破暗、抵抗诱惑、祛除愚昧，象征以智能除惑的深义，亦表示祈求佛光普照、福慧增长。 于修行而言，诸多法脉将燃灯供佛视为必修课程，视为修行的助道法缘。',
        '《佛说施灯功德经》云：“若有众生于佛塔庙，施灯明者，得于四种可乐之法。何等为四，一者色身，二者资财，三者大善，四者智慧。”',
        '在寺院供灯，还有共修之意义，点灯就是庄严道场，令众生升起敬仰之心，功德无量！',
        '《无量寿经》说：“为世之灯明，乃人间最胜之福田。”',
        '《菩萨藏经》中也说：“百千灯明，忏除悔罪”，因此在佛前点灯，是借着佛的智慧之灯所放出的光明，照破我们的无明，使我们心生慧解，成就我们的智慧波罗蜜。',
        '佛在《施灯功德经》中说：“若人一灯奉施佛，得福过前无有量。灯油譬如大海水，其炷犹如须弥山。有人能燃如是灯， 遍照一切诸世界。是人深心怀敬信，其志唯求缘觉道。十方遍置如是灯，一心恭敬而供养。若人发于菩提心，手执草炬暂奉佛。 是人得福过于彼，我见实义作是说。十方一切诸众生，一一供具皆如上。然经无量恒沙劫，其心唯求缘觉道。若有人于佛塔庙， 燃于一灯或一礼。求无上道为众生，此福过前无有量。”'
      ],
      ribbon: [
        '祈福的祈，是由示与斤组成，其含意就是为心愿而求佛菩萨的开示与加持。福字可以理解为一件衣服，一牲口，一亩田，简单拥有，就是有福。 福、禄、寿、喜、财，是中华民族祈福文化的五字真言。',
        '把祈福带供奉在五台山寺院，虔诚祈请诸佛菩萨慈光加被，六亲眷属健康长寿， 事业兴旺，财源茂盛，平安吉祥，善愿悉成，诸行圆满！'
      ],
      brand: [
        '五台山寺院牌位供奉，有往生莲位和长生禄位两种，且常年供奉在寺院，师父每天烧香供灯诵经加持。',
        '如是供奉功德，不仅个人得益，还能全家蒙福，更能上报恩田，亦下庇远孙。凡是供奉者，全家于佛寺拥有一个永久的佛缘，子子孙孙与阿弥陀佛不断善根， 福禄长绵，功德无尽，一切福善，莫此为最。',
        '在寺院供奉往生莲位做超度，为亡者祈求冥福，帮助他们清除业障、超生净土。同时给自己带来尽孝之义，亡者往生后对自己的暗中庇护，添福延寿、无病无灾。 敬立一切历代宗亲师长、冤亲债主、有缘众生、堕胎婴灵、地基主等之牌位，应提醒自己断一切恶业之因（杀、盗、淫、妄，贪、嗔、痴、慢）， 以表对其造成伤害的诚意忏悔，遣除自身违缘障碍。',
        '寺院每天为已故亡者烧香、上供、供灯、诵经、念佛，每逢法会并为其授幽冥戒，超度亡灵往生西方，离苦得乐。生者承恩获福，子孙兴旺发达， 同登解脱之门，共入菩提觉道。',
        '供奉冤亲债主莲位的种类：一是超度者的累世父母；二是超度者的累世师长；三是超度者累世所杀害之生灵；四是超度者现世所杀害之生灵； 五是超度者的累劫冤亲债主。',
        '\n在寺院供奉长生禄位，为报答父母劬劳之恩，存者福乐寿无疆，祈求诸佛慈光加被，为父母、眷属、子女等消灾延寿，平安吉祥！',
        '愿高堂喜乐安康，愿子女学业有成，\n愿事业突飞猛进，愿因缘吉祥如意，\n愿财运善缘亨通，愿遣除一切违缘，\n愿顺缘福慧增长，愿善愿悉成圆满！\n',
        '《药师琉璃光如来本愿功德经》对“消灾延寿”的内涵阐释得很清晰：“消灾”必需认识到灾难乃吾人业力所成，所以想要消灾， 必定要先清净自己的身口意三业；“延寿”并非仅指延长色身的寿命，还要祈求事业、道德、子孙，乃至法身慧命的长寿； “消灾延寿”不但是为自身，更是为了天下所有的父母兄弟姊妹。',
        '《大乘义章·十功德义三门分别》：“功谓功能，能破生死，能得涅槃，能度众生，名之为功。此功是其善行家德，故云功德。”'
      ]
    }
  },
  onLoad (options) {
    console.log('BLESS', options)
    this.setData({ TEMPLE_ID: options.templeId })
    this.setRender(options.type)
    this.getProducts(options)
    this.getFlow(options)
  },
  setTitle (type) {
    let title = ''
    if (type === 'light') {
      title = '供灯祈福'
    } else if (type === 'ribbon') {
      title = '福带祈福'
    } else {
      title = '供奉牌位'
    }
    wx.setNavigationBarTitle({ title })
  },
  handleItem (e) {
    this.setData({ typeActive: e.currentTarget.dataset.index })
  },
  handleBless () {
    const product = JSON.stringify(this.data.typeList[this.data.typeActive])
    wx.navigateTo({ url: `/pages/blessOrder/blessOrder?type=${this.data.TYPE}&product=${product}&templeId=${this.data.TEMPLE_ID}` })
  },
  getFlow (options) {
    let { type } = options
    const map = {
      light: 'GD_process',
      brand: 'PW_process',
      ribbon: 'FD_process'
    }
    return app.get(app.globalData.URLPREFIX + 'operation/' + map[type])
      .then(res => {
        console.log(res)
        this.setData({ flowList: res })
      })
  },
  handleFlowScroll (e) {
    console.log(e)
    const left = e.detail.scrollLeft
    const flowActive = Math.ceil((left - 170) / 260)
    this.setData({ flowActive })
  },
  getProducts (options) {
    let { type } = options
    if (type === 'light') type = '供灯'
    if (type === 'ribbon') type = '福带'
    if (type === 'brand') type = '牌位'
    return app.get(app.globalData.URLPREFIX + 'ecommerce/api/temple/' + options.templeId + '/products', { type })
      .then(res => this.setData({ typeList: res.products }))
      .then(() => this.setRenderList() )
  },
  setRender (type) {
    this.setTitle(type)
    this.setData({ TYPE: type })
    this.setTypeText()
  },
  setTypeText () {
    let TYPEUNIT = ''
    let INTROTITLE = ''
    switch (this.data.TYPE) {
      case 'light':
        TYPEUNIT = '元/盏'
        INTROTITLE = '供灯介绍'
        break
      case 'ribbon':
        TYPEUNIT = '元/条'
        INTROTITLE = '福带介绍'
        break
      case 'brand':
        TYPEUNIT = '元/天'
        INTROTITLE = '牌位介绍'
        break
    }
    this.setData({ TYPEUNIT, INTROTITLE })
  },
  hideMask () {
    this.setData({ typeListRender: this.data.typeList, maskShow: false })
  },
  setRenderList () {
    this.setData({
      typeListRender: this.data.typeList.length > 3 ? this.data.typeList.slice(0, 3) : this.data.typeList
    })
  }
})