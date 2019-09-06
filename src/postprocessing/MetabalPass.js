
export default class MetaballPass extends THREE.Pass {

    constructor() {
        super()
        this.name = "MetaballPass"
        this.needsSwap = true
        this.material = new THREE.MeshBasicMaterial({color: 0xFFF})
        //this.quad.material = this.material
    }
    render(renderer, readBuffer, writeBuffer) {
        //this.material.uniforms.tDiffuse.value = readBuffer.texture;
        renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
    }

}