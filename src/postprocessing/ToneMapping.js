const ToneMapping = {
	uniforms: {
		"tDiffuse": { value: null },
		"amount": { value: 1.0 }
	},
	vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
	fragmentShader: `

		uniform float amount;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		
		vec3 uncharted2Tonemap(const vec3 x) {
			const float A = 0.15;
			const float B = 0.50;
			const float C = 0.10;
			const float D = 0.20;
			const float E = 0.02;
			const float F = 0.30;
			return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
		}

		vec3 tonemapUncharted2(const vec3 color) {
			const float W = 11.2;
			const float exposureBias = 2.0;
			vec3 curr = uncharted2Tonemap(exposureBias * color);
			vec3 whiteScale = 1.0 / uncharted2Tonemap(vec3(W));
			return curr * whiteScale;
		}

		vec3 tonemapFilmic(const vec3 color) {
			vec3 x = max(vec3(0.0), color - 0.004);
			return (x * (6.2 * x + 0.5)) / (x * (6.2 * x + 1.7) + 0.06);
		}

		vec3 acesFilm(const vec3 x) {
			const float a = 2.51;
			const float b = 0.03;
			const float c = 2.43;
			const float d = 0.59;
			const float e = 0.14;
			return clamp((x * (a * x + b)) / (x * (c * x + d ) + e), 0.0, 1.0);
		}

		vec3 tonemapReinhard(const vec3 color) {
			return color / (color + vec3(1.0));
		}

		void main() {
			vec4 color = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(tonemapReinhard(color.rgb * 2.0) * 1.2, 1.0);
		}`

};



export default ToneMapping