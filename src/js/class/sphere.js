import * as THREE from 'three'

export default class Sphere extends THREE.Object3D{
    constructor(options) {
        super(options)
        this.scene = options.scene
        this.radius = options.radius || 20
        this.widthSegments = options.widthSegments || 40
        this.heightSegments = options.heightSegments || 40

        this.geometry = options.geometry || new THREE.SphereGeometry (this.radius, this.widthSegments, this.heightSegments)

        this.material = options.material || new THREE.MeshBasicMaterial({
                color : 0xffffff
            })

        let sphere = new THREE.Mesh(this.geometry, this.material)

        this.scene.add(sphere)
    }


    update(){

    }
}