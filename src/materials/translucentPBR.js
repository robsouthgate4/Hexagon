// import Config from '../Config'

// // import px from '../models/statue/textures/cubemap/xp.png'
// // import nx from '../models/statue/textures/cubemap/xn.png'
// // import py from '../models/statue/textures/cubemap/yp.png'
// // import ny from '../models/statue/textures/cubemap/yn.png'
// // import pz from '../models/statue/textures/cubemap/zp.png'
// // import nz from '../models/statue/textures/cubemap/zn.png'

// const TranslucentPBR  = {

//     uniforms: THREE.ShaderLib.physical.uniforms,
//     vertexShader: `

//     uniform vec3 particlePositions[8];

//     #define PHYSICAL

//     varying vec3 vViewPosition;
//     varying vec2 vUv;
//     varying float v_dist;
//     #ifndef FLAT_SHADED
//         varying vec3 vNormal;
//         #ifdef USE_TANGENT
//             varying vec3 vTangent;
//             varying vec3 vBitangent;
//         #endif
//     #endif

//     uniform float time;
//     uniform vec3 attractorPos;

//     #include <common>
//     #include <uv_pars_vertex>
//     #include <uv2_pars_vertex>
//     #include <displacementmap_pars_vertex>
//     #include <color_pars_vertex>
//     #include <fog_pars_vertex>
//     #include <morphtarget_pars_vertex>
//     #include <skinning_pars_vertex>
//     #include <shadowmap_pars_vertex>
//     #include <logdepthbuf_pars_vertex>
//     #include <clipping_planes_pars_vertex>

//     float rand(float n){return fract(sin(n) * 43758.5453123);}

//     float noise(float p){
//         float fl = floor(p);
//     float fc = fract(p);
//         return mix(rand(fl), rand(fl + 1.0), fc);
//     }
        
//     float noise(vec2 n) {
//         const vec2 d = vec2(0.0, 1.0);
//         vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
//         return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
//     }

//     void main() {

//         #include <uv_vertex>
//         #include <uv2_vertex>
//         #include <color_vertex>
//         #include <beginnormal_vertex>
//         #include <morphnormal_vertex>
//         #include <skinbase_vertex>
//         #include <skinnormal_vertex>
//         #include <defaultnormal_vertex>
//     #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
//         vNormal = normalize( transformedNormal );
//         #ifdef USE_TANGENT
//             vTangent = normalize( transformedTangent );
//             vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
//         #endif
//     #endif
//         #include <begin_vertex>
//         #include <morphtarget_vertex>
//         #include <skinning_vertex>
//         #include <displacementmap_vertex>
//         #include <project_vertex>
//         #include <logdepthbuf_vertex>
//         #include <clipping_planes_vertex>
//         vViewPosition = - mvPosition.xyz;
//         #include <worldpos_vertex>
//         #include <shadowmap_vertex>
//         #include <fog_vertex>
        
//         vec4 newPos = gl_Position;


//         //newPos.y += noise(newPos.xy) * sin(time * 0.001) * 1.0;
//         vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
//         float dist = distance(attractorPos, worldPosition.xyz);

//         v_dist = dist;

//         vec3 AB = vec3(length(attractorPos.xy) * normalize(worldPosition.xy), attractorPos.z);

//         if(dist < 1.5)
//         {

//            newPos.xyz += 0.1;           

//         } else 
//         {
//             newPos = gl_Position;
//         }

//         for( int i = 0; i < NUM_LIGHT_PARTICLES; i++)
//         {
//             vec3 lp = particlePositions[i];

//             float distanceLp = distance(lp, worldPosition.xyz);

//             if(distanceLp < 0.5)
//             {
//                 vec3 dir = vec3(length(lp.xy) * normalize(worldPosition.xy), lp.z);
//                 newPos.xyz -= dir  * (0.5 - distanceLp);
//             }            

//         }

//         gl_Position = newPos;
//     }
//     `,
//     fragmentShader: `

//     #define USE_TRANSLUCENCY

//     #ifdef USE_TRANSLUCENCY
//         uniform sampler2D thicknessMap;
//         uniform float thicknessPower;
//         uniform float thicknessScale;
//         uniform float thicknessDistortion;
//         uniform float thicknessAmbient;
//         uniform vec2 thicknessRepeat;
//     #endif

//     #define PHYSICAL
//     uniform vec3 diffuse;
//     uniform vec3 emissive;
//     uniform float roughness;
//     uniform float metalness;
//     uniform float opacity;
//     #ifndef STANDARD
//         uniform float clearCoat;
//         uniform float clearCoatRoughness;
//     #endif
//     varying vec2 vUv;
//     varying vec3 vViewPosition;
//     varying float v_dist;
//     #ifndef FLAT_SHADED
//         varying vec3 vNormal;
//         #ifdef USE_TANGENT
//             varying vec3 vTangent;
//             varying vec3 vBitangent;
//         #endif
//     #endif
//     #include <common>
//     #include <packing>
//     #include <dithering_pars_fragment>
//     #include <color_pars_fragment>
//     #include <uv_pars_fragment>
//     #include <uv2_pars_fragment>
//     #include <map_pars_fragment>
//     #include <alphamap_pars_fragment>
//     #include <aomap_pars_fragment>
//     #include <lightmap_pars_fragment>
//     #include <emissivemap_pars_fragment>
//     #include <bsdfs>
//     #include <cube_uv_reflection_fragment>
//     #include <envmap_pars_fragment>
//     #include <envmap_physical_pars_fragment>
//     #include <fog_pars_fragment>
//     #include <lights_pars_begin>
//     #include <lights_physical_pars_fragment>
//     #include <shadowmap_pars_fragment>
//     #include <bumpmap_pars_fragment>
//     #include <normalmap_pars_fragment>
//     #include <roughnessmap_pars_fragment>
//     #include <metalnessmap_pars_fragment>
//     #include <logdepthbuf_pars_fragment>
//     #include <clipping_planes_pars_fragment>
//     void main() {
//         #include <clipping_planes_fragment>

//         vec4 diffuseColor = vec4( diffuse, opacity );
//         ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
//         vec3 totalEmissiveRadiance = emissive;

//         #include <logdepthbuf_fragment>
//         #include <map_fragment>
//         #include <color_fragment>
//         #include <alphamap_fragment>
//         #include <alphatest_fragment>
//         #include <roughnessmap_fragment>
//         #include <metalnessmap_fragment>
//         #include <normal_fragment_begin>
//         #include <normal_fragment_maps>
//         #include <emissivemap_fragment>

//         // accumulation
//         #include <lights_physical_fragment>
//         #include <lights_fragment_begin>
//         #include <lights_fragment_maps>
//         #include <lights_fragment_end>

//         #ifdef USE_TRANSLUCENCY
//             vec3 thicknessColor = vec3(1.0, 1.0, 1.0);
//             //vec3 thickness = thicknessColor * texture2D(thicknessMap, vUv * thicknessRepeat).r;
//             vec3 thickness = vec3(1.0);
//             vec3 N = geometry.normal;
//             vec3 V = normalize(geometry.viewDir);
//             float thicknessCutoff = 0.75;
//             float thicknessDecay = 1.0;
            
//             #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

//             for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

//                 pointLight = pointLights[ i ];

//                 vec3 vLightDir = pointLight.position - geometry.position;
//                 vec3 L = normalize(vLightDir);

//                 float lightDist = length(vLightDir);
//                 float lightAtten = punctualLightIntensityToIrradianceFactor(lightDist, pointLight.distance, pointLight.decay);
                
//                 vec3 LTLight = normalize(L + (N * thicknessDistortion));
//                 float LTDot = pow(saturate(dot(V, -LTLight)), thicknessPower) * thicknessScale;
//                 vec3 LT = lightAtten * (LTDot + thicknessAmbient) * thickness;
//                 reflectedLight.directDiffuse += material.diffuseColor * pointLight.color * LT;

//             }

//             #endif

//             #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
            

//             for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

//                 rectAreaLight = rectAreaLights[ i ];
                
//                 vec3 vLightDir = rectAreaLight.position - geometry.position;
//                 vec3 L = normalize(vLightDir);

//                 float lightDist = length(vLightDir);
//                 float lightAtten = punctualLightIntensityToIrradianceFactor(lightDist, thicknessCutoff, thicknessDecay);
                
//                 vec3 LTLight = normalize(L + (N * thicknessDistortion));
//                 float LTDot = pow(saturate(dot(V, -LTLight)), thicknessPower) * thicknessScale;
//                 vec3 LT = lightAtten * (LTDot + thicknessAmbient) * thickness;
//                 reflectedLight.directDiffuse += material.diffuseColor * rectAreaLight.color * LT;
//             }
//             #endif
//         #endif

//         // modulation
//         #include <aomap_fragment>

//         vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

//         //outgoingLight *= 1.0 - v_dist;

//         gl_FragColor = vec4( outgoingLight, diffuseColor.a );


//         #include <tonemapping_fragment>
//         #include <encodings_fragment>
//         #include <fog_fragment>
//         #include <premultiplied_alpha_fragment>
//         #include <dithering_fragment>
//     }
//     `

// }

// const urls = [
//     px,
//     nx,
//     py,
//     ny,
//     pz,
//     nz
// ]

// /**
//  * Cubemap
//  */
// const textureCube = new THREE.CubeTextureLoader().load(urls);
// textureCube.format = THREE.RGBFormat;
// textureCube.mapping = THREE.CubeReflectionMapping;
// textureCube.encoding = THREE.sRGBEncoding;

// THREE.ShaderLib.TranslucentPBR = TranslucentPBR

// const translucentPBRShader = THREE.ShaderLib['TranslucentPBR']
// const TransulucentPBRUniforms = THREE.UniformsUtils.clone(translucentPBRShader.uniforms);



// const customUniforms = THREE.UniformsUtils.merge([
//     TransulucentPBRUniforms,
//     {
//         // your custom uniforms or overrides to built-ins
//         time: { type: 'f', value: 0 },
//         attractorPos: { type: 'v3', value: new THREE.Vector3() },
//         thicknessMap: { type: 't', value: new THREE.Texture() },
//         thicknessRepeat: { type: 'v3', value: new THREE.Vector2() },
//         thicknessPower: { type: 'f', value: 20 },
//         thicknessScale: { type: 'f', value: 8 },
//         thicknessDistortion: { type: 'f', value: 0.185 },
//         thicknessAmbient: { type: 'f', value: 0.0 },
//         particlePositions: { type: 'v3v', value: [  ] }
//     }
// ]);

// console.log(Config.lights.length)

// const translucentPBR = new THREE.ShaderMaterial({
//     uniforms: customUniforms,
//     vertexShader: translucentPBRShader.vertexShader,
//     fragmentShader: translucentPBRShader.fragmentShader,
//     defines: { NUM_LIGHT_PARTICLES: Config.lights.length }
// })

// translucentPBR.lights = true

// translucentPBR.uniforms.diffuse.value = new THREE.Color(0xFFFFFF);
// translucentPBR.uniforms.roughness.value = 1.0
// translucentPBR.uniforms.metalness.value = 0.5
// translucentPBR.uniforms.clearCoat.value = 0.0
// translucentPBR.uniforms.clearCoatRoughness.value = 0.0
// translucentPBR.uniforms.envMap.value = textureCube
// translucentPBR.uniforms.reflectivity.value = 0

// export default translucentPBR;