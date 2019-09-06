

attribute float hIndex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;


varying vec2 vUv;



void main() {
	vUv = uv;

	// final position
	vec4 mvPosition = modelViewMatrix * vec4(offset, 1.0);
	vec4 finalPosition = projectionMatrix * mvPosition;

	gl_Position = finalPosition;
}
