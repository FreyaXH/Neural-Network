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

function addVector(vector1, vector2, vector3) {
    return [
        vector1[0] + vector2[0] + vector3[0],
        vector1[1] + vector2[1] + vector3[1],
        vector1[2] + vector2[2] + vector3[2]
    ];
}

function normalise(vector) {
    let magnitude = Math.hypot(...vector);
    return [
        vector[0] / magnitude,
        vector[1] / magnitude,
        vector[2] / magnitude
    ];
}

//generateNormals([[[1,2,3],[2,3,4],[1,2,1],[1,0,1],[1,1,1]], [[1,2,3],[2,3,4],
//[1,2,1],[1,0,1],[1,1,1], [0,0,0]], [[1,2,3],[2,3,4],[1,2,1],[1,0,1]]])
//generateNormals() Tested

function generateNormal(polygon_3d) {
    return normalise(
        addVector(
            crossProduct(polygon_3d[0], polygon_3d[1]),
            crossProduct(polygon_3d[1], polygon_3d[2]),
            crossProduct(polygon_3d[2], polygon_3d[0])
        )
    );
}
//Offset vector [2,3,5]

const light_vector = normalise([2, 0, 1]);
//d^2.2
Shade.poly_to_colour = function (polygon_3d) {
    return Math.pow(
        (Math.max(0, dotProduct(
            light_vector,
            generateNormal(polygon_3d)
        ))),
        (1 / 2.2)
    );
};

export default Object.freeze(Shade);