import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import EASE from './utils/easing'
import Sphere from './class/sphere'

let scene, camera, renderer, light, light2, controls, helper

init()


function init(){

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 200

    controls = new TrackballControls(camera)

    light = new THREE.DirectionalLight(0xffffff, 1)
    light2 = new THREE.DirectionalLight(0xffffff, 1)
    light.position.y = 100
    light2.position.y = -100

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)


    // Instances
    let sphere = new Sphere({
        scene : scene,
        material : new THREE.MeshPhongMaterial()
    })

    light.target = sphere
    light2.target = sphere

    scene.add(light)
    scene.add(light2)

    window.addEventListener('resize', resize, false);

    update()
}

function update() {
    requestAnimationFrame(update)
    controls.update()
    renderer.render(scene, camera)
}


function resize(){
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()
}