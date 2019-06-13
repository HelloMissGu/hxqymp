const app = getApp()
Component({
  data: {
    musicStatus: true,
  },
  attached () {
    this.setData({ musicStatus: app.globalData.musicStatus })
  },
  methods: {
    _toggleMusic () {
      if (this.data.musicStatus) {
        app.globalData.backgroundAudioManager.pause()
        this.setData({ musicStatus: false })
        app.globalData.musicStatus = false
      } else {
        app.getMusic()
        app.globalData.musicStatus = true
        this.setData({ musicStatus: true })
      }
    }
  },
  pageLifetimes: {
    show () {
      this.setData({ musicStatus: app.globalData.musicStatus })
    },
    hide () {
      this.setData({ musicStatus: app.globalData.musicStatus })
    }
  }
})