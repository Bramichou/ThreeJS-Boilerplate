import * as THREE from 'three'
import EASE from './utils/easing'
import FrameRateUI from './utils/framerate_ui'
import audioAnalyze from './utils/audio_analyze'
import Sphere from './class/sphere'

window.addEventListener('load', init)

let scene, camera, renderer, light


function init(){

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 100

    light = new THREE.AmbientLight( 0xffffff )
    light.position.y = 50
    light.position.x = 50
    light.position.z = -50

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)


    // Instances
    let sphere = new Sphere({
        scene : scene,
        material : new THREE.MeshPhongMaterial({
            emissive : 0xffffff,
            emissiveIntensity : 10
        })
    })

    console.log('scene', scene)
    console.log('camera position', camera.position)
    console.log('scene position', scene.position)
    console.log('sphere position', sphere)


    update()
}

function update() {
    requestAnimationFrame(update)

    renderer.render(scene, camera)
}
