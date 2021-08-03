const el = (id) => document.getElementById(id);
let layerArr;
// LAYER 1 NEURON 1
let neuron11 = {
    w1: 0,
    w2: 0,
    bias: 0
};
let p1El = el("p1-slider");
function assignW111() {
    neuron11.w1 = el("w111").value / 100;
    // p1El.textContent = `Value: ${neuron11.w1}`;
}
function assignW211() {
    neuron11.w2 = el("w211").value / 100;
}
let p2El = el("p2-slider");
function assignB11() {
    neuron11.bias = el("bias11").value / 100;
    // p2El.textContent = `Value: ${neuron11.bias}`;
}

// LAYER 1 NEURON 2
let neuron12 = {
    w1: 0,
    w2: 0,
    bias: 0
};
function assignW112() {
    neuron12.w1 = el("w112").value / 100;
}
function assignW212() {
    neuron12.w2 = el("w212").value / 100;
}
function assignB12() {
    neuron12.bias = el("bias12").value / 100;
}

// LAYER 2 NEURON 1
let neuron21 = {
    w1: 0,
    w2: 0,
    bias: 0
};
function assignW121() {
    neuron21.w1 = el("w121").value / 100;
}
function assignW221() {
    neuron21.w2 = el("w221").value / 100;
}
function assignB21() {
    neuron21.bias = el("bias21").value / 100;
}

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
    return layerArr;
}