import * as THREE from 'three'
import EASE from './utils/easing'
import Sphere from './class/sphere'

let scene, camera, renderer, light

init()


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

    scene.add(light)

    // Instances
    let sphere = new Sphere({
        scene : scene,
        material : new THREE.MeshPhongMaterial()
    })


    window.addEventListener('resize', resize, false);

    update()
}

function update() {
    requestAnimationFrame(update)

    renderer.render(scene, camera)
}


function resize(){
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
}