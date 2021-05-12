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

const network1 = Object.values(layers); //array of layers, which are objects which hold w, b 

//console.log(layers);
console.log(layers.l1.W);
console.log(matrices.dot(layers.l1.W,(creatematrix([[1.1], [1.2]]))));