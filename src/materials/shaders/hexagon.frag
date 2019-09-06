
precision highp float;


varying vec2 vUv;

void main() {
	vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
	vec2 uv = vUv;

	gl_FragColor = color;
}