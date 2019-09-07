
import PostProcessing from './postprocessing/PostProcessing'
import vertexShader from 'raw-loader!glslify-loader!./materials/shaders/hexagon.vert'
import fragmentShader from 'raw-loader!glslify-loader!./materials/shaders/hexagon.frag'
import { OneMinusDstAlphaFactor } from 'three';

export default class Webgl {

    constructor(w, h) {

        this.meshCount = 0
        this.meshListeners = []
        this.renderer =  new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true,
            logarithmicDepthBuffer: true
        })

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        if ( ! this.renderer.extensions.get( 'WEBGL_depth_texture' ) ) { 
            alert('No depth!')
        }

        //this.renderer.setPixelRatio(window.devicePixelRatio)

        this.scene = new THREE.Scene()
        this.glowScene = new THREE.Scene()
        this.width = w
        this.height = h
        this.scene.background = new THREE.Color(0xdedede)
        this.container = new THREE.Object3D();

        this.dom = this.renderer.domElement       
       
        this.clock = new THREE.Clock()

        this.camera = new THREE.PerspectiveCamera(45, w / h, 1, 40)
        this.camera.position.z = 26
        this.camera.position.y = 0
        this.camera.position.x = 0

        this.hexagonCount = 11
        this.hexagonArray = []
        this.object3D
        this.container

        const lookatPos = this.container.position
        //this.camera.lookAt(lookatPos)

        this.addElements()
        this.setLights()


        this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera, this.width, this.height)
        this.postProcessing.init()

        this.update = this.update.bind(this)
        this.resize = this.resize.bind(this)
        
        this.resize(w, h) // set render size
    }

    init(geo) {
        this.initHexagonGrid(geo)
    }

    initHexagonGrid(geo) {

        const rows = 10
        const cols =10

        let hexagon

        for (let i = 0; i < cols; i++) {

            for (let j = 0; j < rows; j++) {
                
                //this.hexagonArray[row] = []

                hexagon = this.createHexagonInstance(geo)
                hexagon.position.y = (i * 1.7)    
                hexagon.rotation.set(THREE.Math.degToRad(90),0,0)
                this.container.add(hexagon)
                hexagon.position.x = (j * 1.5)
                hexagon.position.z = Math.random() * (1 - (-1)) + (-1);
                //hexagon.position.z = 0
                if(j % 2 == 0) {
                    hexagon.position.y += 0.85
                }
                this.hexagonArray.push(hexagon)

            }          

        }        

        this.container.position.set(-7, -8, 0)
        
        this.scene.add(this.container)

    }

    createHexagonInstance(geo) {

        const material = new THREE.MeshStandardMaterial( {color: 0xdedede, metalness: 0, roughness: 0} );
        const hexagon = new THREE.Mesh( geo.children[0].geometry, material );
        hexagon.castShadow = true;
        hexagon.receiveShadow = true;

        return hexagon


    }

    addElements() {
 
    }

    setLights() {

        const light = new THREE.PointLight( 0xFFFFFF, 1, );
        light.name = 'pointlight';
        light.position.set( 0, 30, 5);
        //light.target.position.set( 0, 0, 0 );
        //light.castShadow = true

        const ambLight = new THREE.AmbientLight(0xdedede);
        ambLight.name = 'ambLight';
        ambLight.castShadow = true
        this.scene.add(light, ambLight)


        var lightShadow = new THREE.SpotLight( 0xdedede );
        lightShadow.intensity = 0.1
        lightShadow.position.set( -50, 30, 70 );
        lightShadow.castShadow = true
        this.scene.add(lightShadow)

        lightShadow.shadow.mapSize.width = 1024;
        lightShadow.shadow.mapSize.height = 1024;
        lightShadow.shadow.camera.near = 500;
        lightShadow.shadow.camera.far = 40;
        lightShadow.shadow.camera.fov = 60;

    }
    

    resize(w, h) {

        let pixelRatio = window.devicePixelRatio || 0
        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(w, h)
        
        this.postProcessing.resize()


    }

    update(time) {

        const dt = this.clock.getDelta()

        this.hexagonArray.forEach((hexagon, i) => {
            //hexagon.position.z += Math.sin(time / 200) * i * 0.01
        })

        //this.renderer.render(this.scene, this.camera)

        this.postProcessing.render(dt)

    }

    
    
}