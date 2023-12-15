precision mediump float;

uniform float uFoodShowInfluence;
uniform vec4 uFoodColor;

uniform sampler2D uScentTex;
uniform sampler2D uFoodTex;
uniform sampler2D uGradientImage;

varying vec2 vTexCoord;

void main() {
    vec2 uv = vTexCoord;
    vec2 flippedUv = vec2(uv.x, 1. - uv.y);
    float val = texture2D(uScentTex, uv).r;
    vec4 finalColor = texture2D(uGradientImage, vec2(val, 0.));
    float foodVal = texture2D(uFoodTex, flippedUv).r * uFoodShowInfluence;
    finalColor.rgb = mix(finalColor.rgb, uFoodColor.rgb, foodVal);
    if (val < 0.28 && foodVal < 0.3) discard;
    gl_FragColor = vec4(finalColor.rgb, max(foodVal, val));
    // gl_FragColor = vec4(vec3(foodVal), 1.);
}