precision mediump float;

uniform float uFoodInfluence;
uniform sampler2D uFoodTex;
uniform sampler2D uScentTex;

varying vec2 vTexCoord;

void main() {
    vec2 flippedUv = vec2(vTexCoord.x, 1. - vTexCoord.y);
    vec4 foodColor = texture2D(uFoodTex, flippedUv);
    vec4 scentColor = texture2D(uScentTex, vTexCoord);
    vec4 finalColor = mix(scentColor, scentColor + foodColor, uFoodInfluence);
    gl_FragColor = vec4(finalColor.rgb, 1.);
}