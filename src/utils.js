export default class Utils {

    static debugLight(src, color, size) {

        const geometryLight = new THREE.SphereGeometry(size, 32, 32);
        const materialLight = new THREE.MeshBasicMaterial({ color: color });

        const sphere = new THREE.Mesh(geometryLight, materialLight)

        sphere.scale.set(0.05, 0.05, 0.05)
        sphere.position.copy(src.position)

    }

    static radians(degrees) {
        return degrees * Math.PI / 180;
    }

    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    static map(value, start1, stop1, start2, stop2) {
        return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max)
    }

}