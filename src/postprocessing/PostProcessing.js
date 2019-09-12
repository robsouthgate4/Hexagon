
import 'three/examples/js/shaders/CopyShader'
import 'three/examples/js/shaders/SSAOShader'
import 'three/examples/js/postprocessing/EffectComposer.js'
import 'three/examples/js/postprocessing/RenderPass.js'
import 'three/examples/js/postprocessing/ShaderPass.js'
import 'three/examples/js/SimplexNoise.js'
import 'three/examples/js/postprocessing/SSAOPass.js'
import 'three/examples/js/postprocessing/MaskPass.js'
import 'three/examples/js/shaders/SepiaShader'
import ToneMapping from './ToneMapping.js'

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

        var renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        
        
        var ssaoPass = new THREE.SSAOPass( this.scene, this.camera, this.width, this.height )
        ssaoPass.kernelRadius = 0.015

        ssaoPass.renderToScreen = true
        this.composer.addPass( ssaoPass )

        ssaoPass.output = 0
        ssaoPass.minDistance = 0.0005
        ssaoPass.maxDistance = 0.01

        // var shaderPass = new THREE.ShaderPass(ToneMapping);      
        // shaderPass.renderToScreen = true
        // this.composer.addPass(shaderPass);



    }

    resize() {
        //this.renderer.setSize(this.width, this.height)
        this.composer.setSize(this.width, this.height)
    }

    render(dt) {
        this.composer.render(dt)
    }
}