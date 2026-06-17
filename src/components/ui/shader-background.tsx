"use client";

import React, { useEffect, useRef } from 'react';

const ShaderBackground = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  // Paper-shader: two large soft glows drifting over RME deep-navy,
  // tinted with RME steel (#5c6e88 / #8a99ad) and a hint of brand red (#C8102E).
  const fsSource = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      vec2 p  = uv - 0.5;
      p.x    *= iResolution.x / iResolution.y;

      // RME navy-950 / navy-900 base
      vec3 bg = vec3(0.027, 0.05, 0.094);

      // Two slowly drifting glow centres
      float t  = iTime * 0.07;
      vec2  c1 = vec2(cos(t) * 0.42 - 0.08, sin(t * 0.65) * 0.28);
      vec2  c2 = vec2(sin(t * 0.85 + 1.8) * 0.38, cos(t * 0.55 + 0.9) * 0.22 - 0.08);

      // Large, soft Gaussian blobs  (paper-shader style)
      float g1 = exp(-dot(p - c1, p - c1) * 1.5);
      float g2 = exp(-dot(p - c2, p - c2) * 2.4);

      // RME steel (#8a99ad brightened) for primary sweep
      vec3 steelLight = vec3(0.58, 0.68, 0.80);
      // Subtle brand-red warmth on secondary blob
      vec3 accentWarm = vec3(0.45, 0.16, 0.20);

      vec3 color = bg
        + g1 * steelLight * 0.70
        + g2 * accentWarm * 0.28;

      // Fine grain — the "paper" texture
      float grain = hash(uv * 900.0 + iTime * 0.4) * 0.022 - 0.011;
      color += grain;

      // Soft vignette
      float vig = 1.0 - smoothstep(0.22, 1.15, length(p));
      color = mix(bg * 0.45, color, vig * 0.72 + 0.28);

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `;

  const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const initShaderProgram = (gl: WebGLRenderingContext, vs: string, fs: string) => {
    const vert = loadShader(gl, gl.VERTEX_SHADER, vs);
    const frag = loadShader(gl, gl.FRAGMENT_SHADER, fs);
    const prog = gl.createProgram();
    if (!prog) return null;
    gl.attachShader(prog, vert!);
    gl.attachShader(prog, frag!);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const prog = initShaderProgram(gl, vsSource, fsSource);
    if (!prog) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const info = {
      attrib:   gl.getAttribLocation(prog, 'aVertexPosition'),
      uRes:     gl.getUniformLocation(prog, 'iResolution'),
      uTime:    gl.getUniformLocation(prog, 'iTime'),
    };

    const resize = () => {
      const w = canvas.offsetWidth  || window.innerWidth;
      const h = canvas.offsetHeight || window.innerHeight;
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    window.addEventListener('resize', resize);
    requestAnimationFrame(resize);

    let start = Date.now(), raf = 0, dead = false;

    const render = () => {
      if (dead) return;
      const t = (Date.now() - start) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform2f(info.uRes, canvas.width, canvas.height);
      gl.uniform1f(info.uTime, t);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.vertexAttribPointer(info.attrib, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(info.attrib);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };

    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); dead = true; });
    raf = requestAnimationFrame(render);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className ?? ''}`}
    />
  );
};

export default ShaderBackground;
