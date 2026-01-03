import { useEffect, useRef } from 'react';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Simple implementation using Three.js CDN for brevity in this single-file context
    // In a real project, you'd install three.js locally
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      const THREE = window.THREE;
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.PlaneGeometry(2, 2);
      const uniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      };

      const fragmentShader = `
        uniform float u_time;
        uniform vec2 u_resolution;
        vec3 palette( float t ) {
          vec3 a = vec3(0.5, 0.5, 0.5);
          vec3 b = vec3(0.5, 0.5, 0.5);
          vec3 c = vec3(1.0, 1.0, 1.0);
          vec3 d = vec3(0.263,0.416,0.557);
          return a + b*cos( 6.28318*(c*t+d) );
        }
        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
          vec2 uv0 = uv;
          vec3 finalColor = vec3(0.0);
          for (float i = 0.0; i < 3.0; i++) {
            uv = fract(uv * 1.5) - 0.5;
            float d = length(uv) * exp(-length(uv0));
            vec3 col = palette(length(uv0) + i*.4 + u_time*.4);
            d = sin(d*8. + u_time)/8.;
            d = abs(d);
            d = pow(0.01 / d, 1.2);
            finalColor += col * d;
          }
          gl_FragColor = vec4(finalColor * 0.15, 1.0);
        }
      `;

      const vertexShader = `void main() { gl_Position = vec4( position, 1.0 ); }`;

      const material = new THREE.ShaderMaterial({ uniforms, fragmentShader, vertexShader });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      const animate = () => {
        requestAnimationFrame(animate);
        uniforms.u_time.value += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.u_resolution.value.x = window.innerWidth;
        uniforms.u_resolution.value.y = window.innerHeight;
      });
    };
    document.body.appendChild(script);

    return () => {
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-60 pointer-events-none" />;
}
