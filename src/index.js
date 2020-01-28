import 'three/examples/js/loaders/LoaderSupport'
import 'three/examples/js/loaders/OBJLoader2'
import hexagonObj from './models/hexagon/hexagon.obj'
import translucentPBR from './materials/translucentPBR'
import translucentPhong from './materials/translucentPhong'
import Webgl from './Webgl'

import sun from './assets/images/lab/sun2.png';
import hamiltonVideo from './assets/videos/portfolio/hamilton.mp4';
import fangioVideo from './assets/videos/portfolio/fangio.mp4';
import caracciolaVideo from './assets/videos/portfolio/caracciola.mp4';

import './styles.css'

import profileIcon from './assets/images/cv/mini-profile.png';
import { Linear } from 'gsap'

var cvimg = document.querySelector('.cv-profile');
cvimg.src = profileIcon;


const name = document.querySelector( '.site .name' );
const title = document.querySelector( '.site .name .title' );

const Stats = require('stats.js')
// const stats = new Stats()
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

const experiments = [

    {
        name: "Sun Particles",
        tech: "WebGL GPGPU",
        image: sun
    },
    {
        name: "Plexus statue",
        tech: "WebGL Houdini",
        image: sun
    }

];

const projects = [

    {
        name: "Mercedes Roar Hamilton",
        tech: "Instagram / Facebook",
        videoSrc: hamiltonVideo,
        threeCol: true,
    },
    {
        name: "Mercedes Roar Fangio",
        tech: "Instagram / Facebook",
        videoSrc: fangioVideo,
        threeCol: true
    },
    {
        name: "Mercedes Roar Caracciola",
        tech: "Instagram / Facebook",
        videoSrc: caracciolaVideo,
        threeCol: true
    }
    
];


// Generate HTML

const lab = document.createElement( 'ul' );
lab.className = "lab content"

const portfolio = document.createElement( 'ul' );
portfolio.className = "portfolio content"


document.body.appendChild( lab );
document.body.appendChild( portfolio );

function createItem ( project ) {

    const li = document.createElement( 'li' );   
    const title = document.createElement( 'h2' );
   

    title.innerText = project.name;
    title.className = "title";
    

   const tech = document.createElement( 'p' );
   tech.innerText = project.tech;
    

    if ( project.image ) {

        const sunImg = document.createElement( 'img' );
        sunImg.src = sun
        li.appendChild( sunImg );
        li.appendChild( title );

    }

    if ( project.videoSrc ) {

        

        const video = document.createElement( 'video' );
        video.src = project.videoSrc;
        video.autoplay = false;
        video.loop = true;
        video.controls = false;
        li.append( video );

        li.classList.add( 'mobile-display' );

        const text = document.createElement( 'div' );
        text.classList.add( 'text' );
        text.appendChild(title);

        text.appendChild( tech );

        li.appendChild( text );

        li.addEventListener( 'mouseenter', ()  => {

            video.play();
            
        })

        li.addEventListener( 'mouseleave', ()  => {

            video.pause();
            
        })

    }
    

    return li;

}


experiments.forEach( ( project ) => {

    lab.appendChild( createItem( project ) );
    
} );

projects.forEach( ( project ) => {

    portfolio.appendChild( createItem( project ) );
    
} );


const mainMenuItems = document.querySelectorAll( '.main-menu li a' );

mainMenuItems.forEach( ( item )  => {

    item.addEventListener( 'click', ( e ) => {

        // lab.classList.remove( 'show' );
        // portfolio.classList.remove( 'show' );

        if ( e.target.id === "lab" ) {
        
            lab.classList.contains( 'show') ? lab.classList.remove( 'show' ) : lab.classList.add( 'show' );
        }

        if ( e.target.id === "portfolio" ) {
        
            portfolio.classList.contains( 'show') ? portfolio.classList.remove( 'show' ) : portfolio.classList.add( 'show' );
       }

    } );

})






window.addEventListener( 'load', (  ) => {

    setTimeout(() => {

        name.classList.add( 'show' );

    }, 300);

    setTimeout(() => {

        title.classList.add( 'show' );

    }, 500);

} )