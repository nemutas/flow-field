precision highp float;

uniform sampler2D tPrev;
uniform float uTime;

varying vec2 vUv;

#include './modules/snoise.glsl'

const float PI = acos(-1.0);

void main() {
  vec4 prev = texture2D(tPrev, vUv);

  vec2 pos = prev.xy;

  vec2 distortion = vec2(8.0, 10.0) + sin(uTime * 0.5) * 0.1;

  vec2 velo;
  velo.x = snoise(vec2(sin(pos.x + vUv.x * 0.1 + PI * 0.5), sin(pos.y + vUv.y * 0.1 - PI * 0.5)) * distortion);
  velo.y = snoise(vec2(sin(pos.x + vUv.x * 0.1), cos(pos.y * 0.5 + vUv.y * 0.1)) * distortion);

  pos += velo * 0.003 + (vUv.xy + 0.5) * 0.002;

  if (distance(pos, prev.xy) < 0.0001) {
    pos.xy += 0.001;
  }

  if (1.0 < pos.x) pos.x -= 2.0;
  if (pos.x < -1.0) pos.x += 2.0;
  if (1.0 < pos.y) pos.y -= 2.0;
  if (pos.y < -1.0) pos.y += 2.0;

  gl_FragColor = vec4(pos, 0.0, 0.0);
}