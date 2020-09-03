attribute vec2 a_position;

uniform mat3 u_matrix;
uniform vec4 u_color;

varying vec4 v_color;

void main(void) {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    v_color = u_color;
}