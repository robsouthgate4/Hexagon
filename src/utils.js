export default class Utils {

    static debugLight(src, color, size) {

        const geometryLight = new THREE.SphereGeometry( size, 32, 32 );
        const materialLight = new THREE.MeshBasicMaterial( {color: color} );

        const sphere = new THREE.Mesh(geometryLight, materialLight)

        sphere.scale.set(0.05, 0.05, 0.05)
        sphere.position.copy(src.position)

    }

}