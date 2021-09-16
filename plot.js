/* parallel projection -> Cabinet projection
a = 0.5 cos t
b = 0.5 sin t
(x', y') = (x + az, y + bz) */
const Plot = Object.create(null);

function plotSVG(list_dstrings) {
    const svg = document.getElementById("mapRoot");
    const ns = "http://www.w3.org/2000/svg";
    svg.textContent = "";
    list_dstrings.forEach(function (dstring) {
        let path = document.createElementNS(ns, "path");
        path.setAttribute("d", dstring);
        svg.appendChild(path);
    });
}

const a = 0.22388;
const b = 0.44708;
const parallel_projection = (vertex) => [
    vertex[0] + a * vertex[2],
    vertex[1] + b * vertex[2]
];

function project3d(list_of_polygon_3d) {
    let list_of_polygon_2d = list_of_polygon_3d.map(
        (poly) => poly.map(parallel_projection)
    );

    let list_dstrings = list_of_polygon_2d.map(
        (poly2d) => "M " + poly2d.map(
            (vertex2d) => `${vertex2d[0]},${vertex2d[1]}`
        ).join(" ") + " Z"
    );
    plotSVG(list_dstrings);

    console.log(list_of_polygon_3d);
    console.log(list_of_polygon_2d);
    console.log(list_dstrings);
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