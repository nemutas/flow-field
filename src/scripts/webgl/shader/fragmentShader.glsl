precision highp float;

varying vec2 vSimUv;

void main() {
  if (0.5 < distance(gl_PointCoord.xy, vec2(0.5))) discard;

  vec3 color = vec3(0.035) * vec3(vSimUv, 1.0);
  gl_FragColor = vec4(color, 1.0);
}