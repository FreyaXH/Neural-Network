import funcs from "./matrices.js";

//import * as matrices from "./tests.js";

const layer1 = Object.freeze({ // vectors must be entered as [[x,y]]
    W: [[1.2, 1.3], [0.9, 1.7]],
    B: [[1.1, 0.3]],
}); 

const layer2 = Object.freeze({
    W: [[1.4], [0.7]],
    B: [[1.2]],
});

const layers = Object.freeze({ //layers holds each layer in the network and its respective weights, biases
    l1: layer1,
    l2: layer2,
});

//feed functions from one to another, like a pipe, so output of first is input of second, etc.
const pipe = function (...fs) {
    return (x) => fs.reduce(function (a, f) {
        return f(a) // a becomes f(a), which becomes f(f(a)), as a is accumulator!
    }, x)
}

const network1 = Object.values(layers); //array of layers, which are objects which hold w, b 

//sigma to be changed: don't produce right node of 0!!!
//should be const sigma = (x) => funcs.node(Math.max, x);
//however this will ruin evaluate_tree, a debug function anyway.
const sigma = (x) => funcs.node(Math.max, x, funcs.node(0)); 
const layer_function_from_layer = (layer) => (a) => funcs.matrix_add(funcs.matrix_multiply(a, layer.W), layer.B).map(a => a.map(b => sigma(b))); //.map of sigma
const network_function = (layers) => pipe(...layers.map(layer_function_from_layer));
const net = network_function(network1);
var x, y
const leaves = funcs.get_leaves(funcs.decision_tree(net([[funcs.node("x"),funcs.node("y")]])[0][0]))
const breadth = funcs.breadth_first(funcs.decision_tree(net([[funcs.node("x"),funcs.node("y")]])[0][0]))
const firsttree = net([[funcs.node("x"),funcs.node("y")]])[0][0]
export default{
    "leaves":leaves,
    "breadth":breadth,
    "firsttree":firsttree
}
//debugger;
//we have leaves on list leaves. remove all constants by using eval, checking if not NaN, and removing if so.
//then we need to solve equations as per deconstruct function in python.
