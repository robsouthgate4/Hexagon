

export default class Attractor extends THREE.Mesh {
    
    constructor(camera, scene, width, height) {
        super()

        this.camera = camera
        this.scene = scene
        this.mass = 0.6


        this.location = new THREE.Vector3(0, 2, 0)
        this.temPos = new THREE.Vector3(0, 2, 0)

        this.width = width
        this.height = height

        const geometryLight = new THREE.SphereGeometry(0.1, 32, 32)
        const materialLight = new THREE.MeshBasicMaterial()
        this.lightSphere = new THREE.Mesh(geometryLight, materialLight)
    

        setTimeout(() => {
            document.addEventListener("mousemove", this.bindMousePosition.bind(this));
        }, 3000)
    }

    getMagnitude(force) {
        return Math.sqrt(force.x * force.x + force.y * force.y);
    }

    bindMousePosition(e) {

        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

        const x = event.pageX - document.querySelector('.webgl-hero').offsetLeft;
        const y = event.pageY - document.querySelector('.webgl-hero').offsetTop;

        const mouse = new THREE.Vector3(
            (x / this.width) * 2 - 1,
            -(y / this.height) * 2 + 1,
            1 );            

        const raycaster = new THREE.Raycaster(); // create once
        raycaster.setFromCamera( mouse, this.camera )         
        const pos = raycaster.ray.intersectPlane(planeZ)

       

        this.location.set(pos.x, pos.y, 0)
        this.temPos.set(pos.x, pos.y, 0)


        this.lightSphere.position.x = pos.x
        this.lightSphere.position.y = pos.y
        this.lightSphere.position.z = 0

    }

    attract(lp){

        let force = new THREE.Vector3();

        force.x = this.temPos.x - lp.location.x
        force.y = this.temPos.y - lp.location.y
        force.z = this.temPos.z - lp.location.z

        const distance =  THREE.Math.clamp(this.getMagnitude(force), 4, 16)        
        force.normalize()

        const strength = (2.8 * this.mass * lp.mass) / (distance * distance)

        return force.multiplyScalar(strength)

    }

    update(delta) {
        console.log(delta)
    }

}
