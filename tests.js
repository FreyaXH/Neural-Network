import { creatematrix } from "./matrices";
import * as matrices from "./matrices";

var x
var y
const max = Math.max;

const layer1 = Object.freeze({ // vectors must be entered as [[x,y]]
    W: creatematrix([[1.2, 1.3], [0.9, 1.7]]),
    B: creatematrix([[1.1, 0.3]]),
    A: creatematrix([[x],[y]]),
});

const layer2 = Object.freeze({
    W: creatematrix([[1.4], [0.7]]),
    B: creatematrix([[1.2]])
});

const layers = Object.freeze({ //layers holds each layer in the network and its respective weights, biases
    l1: layer1,
    l2: layer2,
});

export function feedforward(layers, i=1, newlayers = []){
    if(i >= layers.length){
        return newlayers
    }
    const newA = matrices.dot(layers[i].W, layers[i-1].A) + layers[i].B;
    const newlayer = layers[i].map(({W, B}) => ({W, B, A:newA})).map(x[0] => max(x,0)); //create tree somehow &max this
    return feedforward(layers, i+1, [...newlayers, newlayer])
}

//console.log(feedforward(layers));
console.log(matrices.add(matrices.dot(layer2.W, layer1.A), layer2.B));

//[[x],[y]] 
//max(max(1/4 *x + 1/3, 0) + ...) 