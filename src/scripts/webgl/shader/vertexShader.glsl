attribute vec2 simUv;

uniform sampler2D tSim;

varying vec2 vSimUv;

const float PI = acos(-1.0);

void main() {
  vSimUv = simUv;

  vec4 sim = texture2D(tSim, simUv);
  vec3 pos = sim.xyz;

  gl_Position = vec4( pos, 1.0 );
  gl_PointSize = 3.0;
}