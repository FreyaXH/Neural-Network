import * as matrices from "./matrices.js";
import {creatematrix} from "./matrices.js";
//import * as matrices from "./tests.js";

const layer1 = Object.freeze({ // vectors must be entered as [[x,y]]
    W: creatematrix([[1.2, 1.3], [0.9, 1.7]]),
    B: creatematrix([[1.1, 0.3]]),
});

const layer2 = Object.freeze({
    W: creatematrix([[1.4], [0.7]]),
    B: creatematrix([[1.2]]),
});

const layers = Object.freeze({ //layers holds each layer in the network and its respective weights, biases
    l1: layer1,
    l2: layer2,
});

//feed functions from one to another, like a pipe, so output of first is input of second, etc.
const pipe = function (fs) {
    return (x) => fs.reduce(function (a, f) {
        f(a) // a becomes f(a), which becomes f(f(a)), as a is accumulator
    }, x)
}

const network1 = Object.values(layers); //array of layers, which are objects which hold w, b 

//console.log(layers);
console.log(layers.l1.W);
console.log(matrices.dot(layers.l1.W,(creatematrix([[1.1], [1.2]]))));

const layer_function_from_layer = (layer) => (a) => add(dot(layer.W, a), layer.B);
const network_function = (layers) => pipe(...layers.map(layer_function_from_layer));
const net = network_function(network1);