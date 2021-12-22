const Shade = Object.create(null);

function crossProduct(vector1, vector2) {
    return [
        vector1[1] * vector2[2] - vector1[2] * vector2[1],
        vector1[2] * vector2[0] - vector1[0] * vector2[2],
        vector1[0] * vector2[1] - vector1[1] * vector2[0]
    ];
}

function dotProduct(vector1, vector2) {
    return vector1[0] * vector2[0] + vector1[1] * vector2[1] +
    vector1[2] * vector2[2];
}

Shade.addVector = function (vector1, vector2, vector3) {
    if (vector3 === undefined) {
        vector3 = [0, 0, 0];
    }
    return [
        vector1[0] + vector2[0] + vector3[0],
        vector1[1] + vector2[1] + vector3[1],
        vector1[2] + vector2[2] + vector3[2]
    ];
};

const subVector = function (v1, v2) {
    return [
        v1[0] - v2[0],
        v1[1] - v2[1],
        v1[2] - v2[2]
    ];
};

const scalarMult = function (v1, s) {
    return [
        v1[0] * s,
        v1[1] * s,
        v1[2] * s
    ];
};

const negVector = function (v1) {
    return [
        -v1[0],
        -v1[1],
        -v1[2]
    ];
};

const addVector = Shade.addVector;

function normalise(vector) {
    let magnitude = Math.hypot(...vector);
    return [
        vector[0] / magnitude,
        vector[1] / magnitude,
        vector[2] / magnitude
    ];
}

function generateNormal(polygon_3d) {
    return normalise(
        addVector(
            crossProduct(polygon_3d[0], polygon_3d[1]),
            crossProduct(polygon_3d[1], polygon_3d[2]),
            crossProduct(polygon_3d[2], polygon_3d[0])
        )
    );
}

const light_vector = normalise([0.4, -1, 0.5]);
Shade.poly_to_colour = function (polygon_3d) {
    return Math.pow(
        (Math.max(0, dotProduct(
            light_vector,
            generateNormal(polygon_3d)
        ))),
        (1)
    );
};

//Use a b from plot
const a = 0.22388;
const b = 0.44708;
const vcam = negVector(normalise([a, b, -1]));
const alpha = 5;

Shade.spectral = function (polygon_3d) {
    let normal = generateNormal(polygon_3d);
    let ldotn = dotProduct(normal, light_vector);
    let normFactor = scalarMult(normal, 2 * ldotn);
    let rm = subVector(normFactor, light_vector);
    return Math.pow(
        Math.max(0, dotProduct(rm, vcam)),
        alpha
    );
};

export default Object.freeze(Shade);