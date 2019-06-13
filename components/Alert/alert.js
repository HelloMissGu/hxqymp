Component({
  properties: {
    message: {
      type: String,
      value: ''
    },
    lockScroll: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    _hideAlert () {
      this.triggerEvent('hideEvent')
    }
  }
})