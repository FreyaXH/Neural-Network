import Plot from "./plot.js";

const el = (id) => document.getElementById(id);
let layerArr;

let neuron11 = {
    w1: 0,
    w2: 0,
    bias: 0
};
let neuron12 = {
    w1: 0,
    w2: 0,
    bias: 0
};
let neuron21 = {
    w1: 0,
    w2: 0,
    bias: 0
};

function layerReturn() {
    layerArr = [
        [
            [neuron11.w1, neuron11.w2, neuron12.w1, neuron12.w2],
            [neuron11.bias, neuron12.bias]
        ],
        [
            [neuron21.w1, neuron21.w2],
            [neuron21.bias]
        ]
    ];
    console.log("Hello");
    return layerArr;
}

// LAYER 1 NEURON 1
//let p1El = el("p1-slider");
el("w111").oninput = function () {
    neuron11.w1 = el("w111").value / 100;
    Plot.generate3dPolygons(neuron11.w1);
    //p1El.textContent = `Value: ${neuron11.w1}`;
};

el("w211").oninput = function () {
    neuron11.w2 = el("w211").value / 100;
    layerReturn();
};
//let p2El = el("p2-slider");
el("bias11").oninput = function () {
    neuron11.bias = el("bias11").value / 100;
    Plot.generate3dPolygons(neuron11.bias);
    //p2El.textContent = `Value: ${neuron11.bias}`;
};

// LAYER 1 NEURON 2
el("w112").oninput = function () {
    neuron12.w1 = el("w112").value / 100;
    layerReturn();
};
el("w212").oninput = function () {
    neuron12.w2 = el("w212").value / 100;
    layerReturn();
};
el("bias12").oninput = function () {
    neuron12.bias = el("bias12").value / 100;
    layerReturn();
};

// LAYER 2 NEURON 1
el("w121").oninput = function () {
    neuron21.w1 = el("w121").value / 100;
    layerReturn();
};
el("w221").oninput = function () {
    neuron21.w2 = el("w221").value / 100;
    layerReturn();
};
el("bias21").oninput = function () {
    neuron21.bias = el("bias21").value / 100;
    layerReturn();
};