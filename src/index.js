import 'three/examples/js/loaders/LoaderSupport'
import 'three/examples/js/loaders/OBJLoader2'
import hexagonObj from './models/hexagon/hexagon.obj'
import translucentPBR from './materials/translucentPBR'
import translucentPhong from './materials/translucentPhong'
import Webgl from './Webgl'


import './styles.css'


const Stats = require('stats.js')
const stats = new Stats()
//stats.showPanel( 0 ) // 0: fps, 1: ms, 2: mb, 3+: custom

const container = document.querySelector('.webgl-hero')
const webgl = new Webgl(container.clientWidth, container.clientHeight)
container.appendChild(webgl.dom)

//document.body.appendChild( stats.dom )

var now,delta,then = Date.now()
var interval = 1000/60

const animate = (time) => {
    requestAnimationFrame (animate)
    now = Date.now()
    delta = now - then
    //update time dependent animations here at 30 fps
    if (delta > interval) {        
        webgl.update(time)
        then = now - (delta % interval)    }
}


const loader = new THREE.OBJLoader2()
let mesh

function onResize() {
    webgl.resize(container.clientWidth, container.clientHeight)
}

window.addEventListener('resize', onResize)
window.addEventListener('orientationchange', onResize)


const callbackOnLoad = (event) => { 

    const geo = event.detail.loaderRootNode
    webgl.init(geo)

    animate()
    
};

loader.load(hexagonObj, callbackOnLoad, null, null, null, false)





