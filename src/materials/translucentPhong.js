import Config from '../Config'

// import px from '../models/statue/textures/cubemap/xp.png'
// import nx from '../models/statue/textures/cubemap/xn.png'
// import py from '../models/statue/textures/cubemap/yp.png'
// import ny from '../models/statue/textures/cubemap/yn.png'
// import pz from '../models/statue/textures/cubemap/zp.png'
// import nz from '../models/statue/textures/cubemap/zn.png'

const TranslucentPhong = {

    uniforms: THREE.ShaderLib.phong.uniforms,
    vertexShader: `

        varying vec3 vNormal;
		varying vec2 vUv;
        varying vec3 vViewPosition;
        varying float v_dist;
        
        uniform float time;
        uniform vec3 attractorPos;

        uniform vec3 particlePositions[3];

		#include <common>

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			vViewPosition = -mvPosition.xyz;
			vNormal = normalize( normalMatrix * normal );
			vUv = uv;
            gl_Position = projectionMatrix * mvPosition;


            vec4 newPos = gl_Position;
            
            //newPos.y += noise(newPos.xy) * sin(time * 0.001) * 1.0;
            //vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
            float dist = distance(attractorPos, worldPosition.xyz);

            v_dist = dist;

            vec3 AB = vec3(length(attractorPos.xy) * normalize(worldPosition.xy), attractorPos.z);

            if(dist < 1.5)
            {

            newPos.xyz += 0.1;           

            } else 
            {
                newPos = gl_Position;
            }

            for( int i = 0; i < NUM_LIGHT_PARTICLES; i++)
            {
                vec3 lp = particlePositions[i];

                float distanceLp = distance(lp, worldPosition.xyz);

                if(distanceLp < 0.5)
                {
                    vec3 dir = vec3(length(lp.xy) * normalize(worldPosition.xy), lp.z);
                    newPos.xyz -= dir  * (0.5 - distanceLp);
                }            

            }

            gl_Position = newPos;

		}
    `,
    fragmentShader: `

        #define USE_MAP
		#define PHONG
        #define TRANSLUCENT
        
		#include <common>
		#include <bsdfs>
		#include <uv_pars_fragment>
		#include <map_pars_fragment>
		#include <lights_phong_pars_fragment>

		varying vec3 vColor;

		uniform vec3 diffuse;
		uniform vec3 specular;
		uniform vec3 emissive;
		uniform float opacity;
		uniform float shininess;

        // Translucency
        
		uniform sampler2D thicknessMap;
		uniform float thicknessPower;
		uniform float thicknessScale;
		uniform float thicknessDistortion;
		uniform float thicknessAmbient;
		uniform float thicknessAttenuation;
		uniform vec3 thicknessColor;

		#include <lights_pars_begin>

		void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in GeometricContext geometry, inout ReflectedLight reflectedLight) {
            //vec3 thickness = thicknessColor * texture2D(thicknessMap, uv).r;
            vec3 thickness = thicknessColor * 1.0;
			vec3 scatteringHalf = normalize(directLight.direction + (geometry.normal * thicknessDistortion));
			float scatteringDot = pow(saturate(dot(geometry.viewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
			vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
			reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
		}

		void main() {

			vec3 normal = normalize( vNormal );

			vec3 viewerDirection = normalize( vViewPosition );

			vec4 diffuseColor = vec4( diffuse, opacity );
			ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

            #include <map_fragment>
            #include <color_fragment>
            #include <specularmap_fragment>

		    vec3 totalEmissiveRadiance = emissive;

            #include <lights_phong_fragment>

            // Doing lights fragment begin

            GeometricContext geometry;
            geometry.position = - vViewPosition;
            geometry.normal = normal;
            geometry.viewDir = normalize( vViewPosition );

		    IncidentLight directLight;

            #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

                PointLight pointLight;

                #pragma unroll_loop
                for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
                    pointLight = pointLights[ i ];
                    getPointDirectLightIrradiance( pointLight, geometry, directLight );

                    #ifdef USE_SHADOWMAP
                    directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
                    #endif

                    RE_Direct( directLight, geometry, material, reflectedLight );

                    #if defined( TRANSLUCENT ) && defined( USE_MAP )
                        RE_Direct_Scattering(directLight, vUv, geometry, reflectedLight);
                    #endif
                }

			#endif

            #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

                DirectionalLight directionalLight;

                #pragma unroll_loop
                for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
                    directionalLight = directionalLights[ i ];
                    getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );

                    #ifdef USE_SHADOWMAP
                    directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
                    #endif

                    RE_Direct( directLight, geometry, material, reflectedLight );

                    #if defined( TRANSLUCENT ) && defined( USE_MAP )
                    RE_Direct_Scattering(directLight, vUv, geometry, reflectedLight);
                    #endif
                }

            #endif

            #if defined( RE_IndirectDiffuse )

                vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

                #if ( NUM_HEMI_LIGHTS > 0 )

                    #pragma unroll_loop
                    for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
                        irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
                    }

                #endif

            #endif

            #if defined( RE_IndirectSpecular )

                vec3 radiance = vec3( 0.0 );
                vec3 clearCoatRadiance = vec3( 0.0 );

            #endif

            #include <lights_fragment_end>

            vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
            gl_FragColor = vec4( outgoingLight, diffuseColor.a );// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

            #include <encodings_fragment>

        }
    `

}

// const urls = [
//     px,
//     nx,
//     py,
//     ny,
//     pz,
//     nz
// ]

/**
 * Cubemap
 */
// const textureCube = new THREE.CubeTextureLoader().load(urls);
// textureCube.format = THREE.RGBFormat;
// textureCube.mapping = THREE.CubeReflectionMapping;
// textureCube.encoding = THREE.sRGBEncoding;

THREE.ShaderLib.TranslucentPhong = TranslucentPhong

const TranslucentPhongShader = THREE.ShaderLib['TranslucentPhong']
const TranslucentPhongUniforms = THREE.UniformsUtils.clone(TranslucentPhongShader.uniforms);



const customUniforms = THREE.UniformsUtils.merge([
    TranslucentPhongUniforms,
    {
        // your custom uniforms or overrides to built-ins
        time: { type: 'f', value: 0 },
        attractorPos: { type: 'v3', value: new THREE.Vector3() },
        thicknessMap: { type: 't', value: new THREE.Texture() },
        thicknessRepeat: { type: 'v3', value: new THREE.Vector2() },
        thicknessPower: { type: 'f', value: 4 },
        thicknessScale: { type: 'f', value: 20 },
        thicknessColor: { type: 'f', value: new THREE.Color( 0xFFFFFF ) },
        thicknessDistortion: { type: 'f', value: 0.085 },
        thicknessAmbient: { type: 'f', value: 0.1 },
        thicknessAttenuation: {type: 'f', value: 0.1 },
        particlePositions: { type: 'v3v', value: [] },
        shininess: {type: 'f', value: 600 },
        color: { type: 'v3', value: new THREE.Color( 0x333333 )},
        diffuse: { type: 'v3', value: new THREE.Color( 0xDDDDDD )},
        //emissive: { value: new THREE.Color( 0x000000 ) },
        specular: { value: new THREE.Color( 0x999999 ) }
    }
]);

const translucentPhongMaterial = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    vertexShader: TranslucentPhongShader.vertexShader,
    fragmentShader: TranslucentPhongShader.fragmentShader,
    defines: { NUM_LIGHT_PARTICLES: Config.lights.length }
})

translucentPhongMaterial.lights = true
translucentPhongMaterial.extensions.derivatives = true

export default translucentPhongMaterial;