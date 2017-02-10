import * as THREE from 'three'

export default class Sphere{
    constructor(options) {
        this.scene = options.scene
        this.radius = options.radius || 20
        this.widthSegments = options.widthSegments || 30
        this.heightSegments = options.heightSegments || 30

        this.geometry = options.geometry || new THREE.SphereGeometry (this.radius, this.widthSegments, this.heightSegments)

        this.material = options.material || new THREE.MeshBasicMaterial({
                color : 0xffffff
            })

        let sphere = new THREE.Mesh(this.geometry, this.material)
        let box = new THREE.BoxHelper(sphere, 0xffff00)

        this.scene.add(sphere)
        this.scene.add(box)
    }


    update(){

    }
}