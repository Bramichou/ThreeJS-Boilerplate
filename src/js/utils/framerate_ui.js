export default class FrameRateUI {
    constructor(options) {
        this.options = options
        this.mainContainer = document.querySelector('body')
        this.subContainer = document.createElement('div')
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext("2d")
        this.rawFps = 0
        this.displayedFps = 60
        this.lastLoop = new Date;
        this.flag = {
            frameRate: [],
            graph: []
        }
        this.init()
    }
    init() {
        this.canvas.width = 150
        this.canvas.height = 180
        this.canvas.style.backgroundColor = '#2C302E'
        this.subContainer.style.position = 'fixed'
        this.subContainer.style.zIndex = '100'
        this.subContainer.classList.add('fps')
        this.subContainer.appendChild(this.canvas)
        this.mainContainer.appendChild(this.subContainer)
        this.draw()
    }
    draw() {
        var ctx = this.context
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.display_number()
        this.display_graph()
    }
    raw_to_displayed() {
        this.flag.frameRate.push(this.rawFps)
        if (this.flag.frameRate.length > 29) {
            var sum = 0
            for (var i = 0; i < this.flag.frameRate.length; i++) {
                sum += this.flag.frameRate[i]
            }
            this.displayedFps = Math.round(sum / this.flag.frameRate.length)
            this.flag.frameRate = []
            this.draw()
        }
    }
    display_graph() {
        var fps = this.displayedFps
        var fpsRatio = this.rawFps / 60
        this.flag.graph.push({
            ratio: fpsRatio,
            fps: this.rawFps
        })
        if (this.flag.graph.length > 49) {
            this.flag.graph.shift()
        }
        for (var i = 0; i < this.flag.graph.length; i++) {
            var index = i / 50
            var stats = this.flag.graph[i]
            this.draw_stats(index, stats.ratio, stats.fps)
        }
    }
    draw_stats(index, ratio, fps) {
        var ctx = this.context
        ctx.strokeStyle = this.color_selector(fps)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, 100 * index);
        ctx.lineTo((150 * ratio) - 20, 100 * index);
        ctx.stroke();
        ctx.stroke()
        ctx.closePath()
    }
    display_number() {
        var ctx = this.context
        var fps = this.displayedFps
        var raw = this.rawFps
        ctx.font = "20px Arial"
        ctx.fillStyle = this.color_selector(fps)
        ctx.fillText(fps, this.canvas.width / 2 - 10, this.canvas.height - 50);
        ctx.fillStyle = 'white'
        ctx.fillText('fps :', this.canvas.width / 2 - 60, this.canvas.height - 50);
        ctx.fillStyle = this.color_selector(fps)
        ctx.fillText(raw, this.canvas.width / 2 + 25, this.canvas.height - 20);
        ctx.fillStyle = 'white'
        ctx.fillText('raw fps :', this.canvas.width / 2 - 60, this.canvas.height - 20);
    }
    color_selector(fps) {
        if (fps < 20) {
            return '#E86252'
        } else
        if (fps < 30) {
            return '#DBD56E'
        } else
        if (fps < 50) {
            return '#596157'
        } else
        if (fps < 200) {
            return '#5B8C5A'
        }
    }
    update() {
        var thisLoop = new Date;
        this.rawFps = Math.round(1000 / (thisLoop - this.lastLoop));
        this.lastLoop = thisLoop;
        this.raw_to_displayed()
    }
    hide() {
        this.subContainer.style.display = 'none'
    }
    show() {
        this.subContainer.style.display = 'block'
    }
    toggleShow() {
        if (this.subContainer.style.display == 'none') {
            this.subContainer.style.display = 'block'
        } else {
            this.subContainer.style.display = 'none'
        }
    }
}