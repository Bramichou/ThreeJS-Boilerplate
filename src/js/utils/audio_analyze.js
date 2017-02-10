export default class AudioAnalyzer {
    constructor(options) {
        this.options = options || new Object
        this.debug = this.options.debug || false
        this.url = this.options.url
        this.samplingFrequency = this.options.samplingFrequency
        this.mainContainer = document.querySelector('body')
        this.container = document.createElement('div')
        this.canvas = document.createElement('canvas')
        this.width = 400
        this.height = 100
        this.context = this.canvas.getContext("2d")
        this.audio
        this.dataArray
        this.loaded = false
        this.bufferLength
        this.controls = []
        this.init()
        if (!this.options.debug) {
            this.hide()
        }
    }
    init() {
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.backgroundColor = '#2C302E'
        this.container.style.position = 'fixed'
        this.container.style.bottom = 0
        this.container.style.left = 0
        this.container.style.zIndex = '100'
        this.container.appendChild(this.canvas)
        this.container.classList.add('spectrum')
        this.mainContainer.appendChild(this.container)
        this.audio = new Audio()
        this.audio.src = this.url
        this.audio.controls = this.options.playerUI
        this.audio.autoplay = this.options.autoplay
        this.audio.crossOrigin = "anonymous"
        if (this.audio.controls) {
            this.canvas.style.paddingBottom = '28px'
            this.audio.style.position = 'absolute'
            this.audio.style.bottom = 0
            this.audio.style.left = 0
            this.audio.style.width = this.width + 'px'
        }
        this.container.appendChild(this.audio)
        this.audio.context = new(window.AudioContext || window.webkitAudioContext)()
        var that = this
        this.analyser = this.audio.context.createAnalyser()
        this.analyser.minDecibels = -90
        this.analyser.maxDecibels = -10
        this.analyser.smoothingTimeConstant = 0.85
        // this.analyser.smoothingTimeConstant = .99
        this.analyser.fftSize = this.samplingFrequency
        this.bufferLength = this.analyser.frequencyBinCount
        this.dataArray = new Uint8Array(this.bufferLength)
        var source = that.audio.context.createMediaElementSource(that.audio)
        source.connect(that.analyser)
        that.analyser.connect(that.audio.context.destination)
        that.loaded = true
    }
    addControlPoint(options) {
        var control = new Object
        if (options.bufferPosition > this.bufferLength) {
            console.error(control, ' : the frequency cannot be superior to the buffer size')
        } else {
            var that = this
            control.frequency = options.bufferPosition
            if (this.debug) {
                console.log('New audio control point created at buffer position', control.frequency)
            }
            control._data = {
                position: {
                    x: 0,
                    y: 0
                },
                radius: ((this.width / 4) / this.bufferLength) * 2.5
            }
            control.strength = 0
            control.id = this.controls.length
            control.shift = function(frequency) {
                if (frequency != undefined) {
                    that.controls[control.id].frequency = frequency
                    console.log('Audio control (id : ' + control.id + ') point shifted at buffer position ', frequency)
                }
            }
            this.controls.push(control)
        }
    }
    updateControlPoint() {
        var ctx = this.context
        for (var i = 0; i < this.controls.length; i++) {
            var control = this.controls[i]
            var dataFrequency = Math.round(control.frequency / 2)
            control._data.position.x = control.frequency * (((this.width / 4) / this.bufferLength) * 2.5 + 1)
            control.strength = this.dataArray[control.frequency] / 255
            control._data.position.y = this.height - control.strength * 100
            ctx.beginPath()
            ctx.fillStyle = 'white'
            ctx.arc(control._data.position.x, control._data.position.y, control._data.radius * 2.5, 0, 2 * Math.PI)
            ctx.fill()
            ctx.stroke()
        }
    }
    update() {
        var ctx = this.context
        ctx.clearRect(0, 0, this.width, this.width)
        this.analyser.getByteFrequencyData(this.dataArray)
        var barWidth = ((this.width / 4) / this.bufferLength) * 2.5
        var barHeight
        var x = 0
        for (var i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i]
            ctx.fillStyle = 'rgb(' + (barHeight + this.height) + ',50,50)'
            ctx.fillRect(x, this.height - barHeight / 2, barWidth, barHeight / 2)
            x += barWidth + 1
        }
        ctx.font = "12px Arial"
        ctx.fillStyle = 'white'
        ctx.fillText('Buffer Size: ' + this.bufferLength, this.width - 110, 30)
        this.updateControlPoint()
    }
    hide() {
        this.container.style.display = 'none'
    }
    show() {
        this.subContainer.style.display = 'block'
    }
    toggleShow() {
        if (this.container.style.display == 'none') {
            this.container.style.display = 'block'
        } else {
            this.container.style.display = 'none'
        }
    }
    play() {
        this.audio.play()
    }
}