attribute vec4 a_position;
attribute vec3 a_color;

uniform mat4 u_matrix;
uniform vec3 u_color;
uniform int u_use_vertex_colors;

varying vec4 v_color;

void main() {
    gl_Position = u_matrix * a_position;
    if (u_use_vertex_colors == 1) {
        v_color = vec4(a_color * u_color, 1);
    } else {
        v_color = vec4(u_color, 1);
    }
}