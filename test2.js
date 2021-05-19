import { creatematrix, add, dot } from "./matrices";
import * as matrices from "./matrices";


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

const network1 = Object.values(layers);


//takes a layer as input and returns a function which returns the activations of a layer
const layer_function_from_layer = (layer) => (a) => add(dot(layer.W, a), layer.B);

 

// takes a series of layers and pipes them using lffl, where A of previous feeds into a of next
//aka: transforms list of layers into list of funcs which return activations of layers
// pipes each of these functions together so that layer 1 is input to layer 2, 2 to 3, etc.
const network_function = (layers) => pipe(...layers.map(layer_function_from_layer));

 
console.log(network1)
console.log(layer_function_from_layer(layer1))

//console.log(network1);
const test1 = network_function(network1); //lfunc3(lfunc2(lfunc1()))\
console.log(test1);
 
/*
[
    layer1
    layer2
    layer3
]

 

// map(layer_function_from_layer)
fs = [
    layer_function_1,
    layer_function_2,
    layer_function_3,
]

 

pipe(...fs) // =

 

// Neural network function
pipe(
    layer_function_1,
    layer_function_2,
    layer_function_3
)

*/