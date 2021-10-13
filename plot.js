/* parallel projection -> Cabinet projection
a = 0.5 cos t
b = 0.5 sin t
(x', y') = (x + az, y + bz) */
import Shade from "./shade.js";
const Plot = Object.create(null);

function plotSVG(list_dstrings_colours) {
    const svg = document.getElementById("mapRoot");
    const ns = "http://www.w3.org/2000/svg";
    svg.textContent = "";
    list_dstrings_colours.forEach(function (dstring) {
        let path = document.createElementNS(ns, "path");
        let lv = dstring[1];
        let colour = [254, 157, 61];
        //Splitting up Ambient and Diffused Lights
        let split_ad = (c) => c * 0.1 + c * 0.9 * lv;
        let split_c = colour.map(split_ad);
        path.setAttribute("d", dstring[0]);
        path.style.fill = `rgb(${split_c[0]}, ${split_c[1]},  ${split_c[2]})`;
        console.log(`rgb(${split_c[0]}, ${split_c[1]},  ${split_c[2]})`);
        svg.appendChild(path);
    });
}

const a = 0.22388;
const b = 0.44708;
const parallel_projection = (vertex) => [
    vertex[0] + a * vertex[2],
    vertex[1] + b * vertex[2]
];
const poly_to_dstring = (poly2d) => "M " + poly2d.map(
    (vertex2d) => `${vertex2d[0]},${vertex2d[1]}`
).join(" ") + " Z";

function project3d(list_of_polygon_3d) {
    let list_dstrings_colours = list_of_polygon_3d.map((poly3d) => [
        poly_to_dstring(poly3d.map(parallel_projection)),
        Shade.poly_to_colour(poly3d)
    ]);
    plotSVG(list_dstrings_colours);

    console.log(list_dstrings_colours);
}

Plot.generate3dPolygons = function (w1) {
    const cell = (h, s) => (x, z) => [
        [s * x, s * h(x, z), s * z],
        [s * x + s, s * h(x + 1, z), s * z],
        [s * x + s, s * h(x + 1, z + 1), s * z + s],
        [s * x, s * h(x, z + 1), s * z + s]
    ];
    const polygon = cell((x, z) => Math.sin(w1 * x / 2) * Math.cos(z / 2), 25);
    const sequence = (n) => Array.from({"length": n}, (ignore, k) => k);
    const list_of_polygon_3d = sequence(15).flatMap(
        (x) => sequence(15).map((z) => [x, z])
    ).map((xz) => polygon(xz[0], xz[1]));

    project3d(list_of_polygon_3d);
};

export default Object.freeze(Plot);