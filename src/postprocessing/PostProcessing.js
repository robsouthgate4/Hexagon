
import 'three/examples/js/shaders/CopyShader'
import 'three/examples/js/shaders/SSAOShader'
import 'three/examples/js/postprocessing/EffectComposer.js'
import 'three/examples/js/postprocessing/RenderPass.js'
import 'three/examples/js/postprocessing/ShaderPass.js'
import 'three/examples/js/SimplexNoise'
import 'three/examples/js/postprocessing/SSAOPass.js'
import 'three/examples/js/postprocessing/MaskPass'

import blendGlow from './blendGlow'

export default class PostProcessing {

    constructor(renderer, scene, camera, width, height){

        this.renderer = renderer
        this.composer
        this.scene = scene
        this.camera = camera
        this.width = width
        this.height = height
    }

    init() {

        this.composer = new THREE.EffectComposer(this.renderer)
        

        var ssaoPass = new THREE.SSAOPass( this.scene, this.camera, this.width, this.height )
        ssaoPass.kernelRadius = 0.2

        ssaoPass.renderToScreen = true
        this.composer.addPass( ssaoPass )

        ssaoPass.output = 0
        ssaoPass.minDistance = 0.0001
        ssaoPass.maxDistance = 0.3

    }

    resize() {
        //this.renderer.setSize(this.width, this.height )
        this.composer.setSize(this.width * window.devicePixelRatio, this.height * window.devicePixelRatio)
    }

    render(dt) {
        this.composer.render(dt)
    }
}