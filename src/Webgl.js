
import PostProcessing from './postprocessing/PostProcessing'
import vertexShader from 'raw-loader!glslify-loader!./materials/shaders/hexagon.vert'
import fragmentShader from 'raw-loader!glslify-loader!./materials/shaders/hexagon.frag'
import { OneMinusDstAlphaFactor } from 'three'
import Utils from './utils'

export default class Webgl {

    constructor(w, h) {

        this.meshCount = 0
        this.meshListeners = []
        this.camera
        this.renderer =  new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true,
            logarithmicDepthBuffer: true
        })

        this.raycaster = new THREE.Raycaster();

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        if ( ! this.renderer.extensions.get( 'WEBGL_depth_texture' ) ) { 
            alert('No depth!')
        }

        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.scene = new THREE.Scene()
        this.width = w
        this.height = h
        this.scene.background = new THREE.Color(0xdedede)
        this.container = new THREE.Object3D()
        this.grid = {
            cols: 10,
            rows: 10
        }

        this.dom = this.renderer.domElement 
       
        this.clock = new THREE.Clock()

        this.hexagonArray = []
        this.object3D
        this.container

        this.update = this.update.bind(this)
        this.resize = this.resize.bind(this)

        this.mouse3D = new THREE.Vector2();

        window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true})
        
        this.onMouseMove({ clientX: 0, clientY: 0 })
    }

    onMouseMove({ clientX, clientY }) {
        this.mouse3D.x = (clientX / this.width) * 2 - 1
        this.mouse3D.y = -(clientY / this.height) * 2 + 1
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 40)
        this.camera.position.z = 26
        this.camera.position.y = 0
        this.camera.position.x = 0
    }

    initPostProcessing() {
        this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera, this.width, this.height)
        this.postProcessing.init()
    }

    init(geo) {

        this.createCamera()        
        this.initHexagonGrid(geo)
        this.addFloor()
        this.setLights()
        this.initPostProcessing()
        this.resize(this.width, this.height)
        
    }

    initHexagonGrid(geo) {

        let hexagon

        for (let i = 0; i < this.grid.cols; i++) {

            this.hexagonArray[i] = []

            for (let j = 0; j < this.grid.rows; j++) {

                hexagon = this.createHexagonInstance(geo)
                hexagon.position.y = (i * 1.7)    
                hexagon.rotation.set(THREE.Math.degToRad(90),0,0)
                
                hexagon.position.x = (j * 1.5)
                hexagon.position.z = Math.random() * (1 - (-1)) + (-1);
                hexagon.position.z = 0

                hexagon.initialRotation = {
                    x: hexagon.rotation.x,
                    y: hexagon.rotation.y,
                    z: hexagon.rotation.z
                }

                if(j % 2 == 0) {
                    hexagon.position.y += 0.85
                }

                this.hexagonArray.push(hexagon)

                this.container.add(hexagon)

                this.hexagonArray[i][j] = hexagon

            }          

        }        

        this.container.position.set(-7, -8, 0)
        
        this.scene.add(this.container)

    }

    addFloor() {

        const geometry = new THREE.PlaneGeometry(100, 100)
        const material = new THREE.ShadowMaterial({ opacity: .3 });
        this.floor = new THREE.Mesh(geometry, material)
        this.floor.position.y = 0;
        this.floor.rotateX(- Math.PI / 2)

        this.scene.add(this.floor);
    }

    createHexagonInstance(geo) {

        const material = new THREE.MeshStandardMaterial( {color: 0xdedede, metalness: 0, roughness: 0} );
        const hexagon = new THREE.Mesh( geo.children[0].geometry, material );
        hexagon.castShadow = true;
        hexagon.receiveShadow = true;

        return hexagon


    }


    setLights() {

        const light = new THREE.PointLight( 0xFFFFFF, 1, );
        light.name = 'pointlight';
        light.position.set( 0, 30, 5);

        const ambLight = new THREE.AmbientLight(0xdedede);
        ambLight.name = 'ambLight'
        this.scene.add(light, ambLight)

        var lightShadow = new THREE.SpotLight( 0xdedede );
        lightShadow.intensity = 0.
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

        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(w, h)        
        this.postProcessing.resize()


    }

    update(time) {

        this.raycaster.setFromCamera(this.mouse3D, this.camera)

        const intersects = this.raycaster.intersectObjects([this.floor])

        if (intersects.length) {

            const { x, z } = intersects[0].point;

            for (let i = 0; i < this.grid.cols; i++) {

                for (let j = 0; j < this.grid.rows; j++) {

                    const hexagon = this.hexagonArray[i][j]
                    

                    // const mouseDistance = Utils.distance(x, z,
                    //     hexagon.position.x + this.container.position.x,
                    //     hexagon.position.z + this.container.position.z);

                    //     const maxPositionY = 10;
                    //     const minPositionY = 0;
                    //     const startDistance = 6;
                    //     const endDistance = 0;
                    //     const y = Utils.map(mouseDistance, startDistance, endDistance, minPositionY, maxPositionY);

                    //     hexagon.scale.set(1,1,1)

                }
            }

        }

        const dt = this.clock.getDelta()

        this.postProcessing.render(dt)

    }

    
    
}