import funcs from "./matrices.js";
import leaves from "./equations.js"

function reduce_tree(root){
    //creating table but do it better
    var varlist = [[0], [0], [0]] //x values, y values, c values. list for each x val.
    var xindex = 0
    var yindex = 0
    var cindex = 0
    //check if tree is simply 0, return blank list
    if(root.value == 0){
        return [0, 0, 0]
    }
    function traverse(root){
        var currentvalue = root.value

        if(!isNaN(root.left.value)){ //if constant
            if(currentvalue == funcs.addnum){//if add
                varlist[2].push(root.left.value) 
                cindex += 1
            }
            //both consts
            else if(!isNaN(root.left.value) && !isNaN(root.right.value)){
                varlist[2].push(root.left.value * root.right.value)
                cindex += 1
            }
            else{//if multiply
                varlist[0][xindex] *= root.left.value
                varlist[1][yindex] *= root.left.value
                varlist[2][cindex] *= root.left.value  
            }
        }
        else if(root.left.value == "x"){
            xindex += 1
            if(currentvalue == funcs.addnum){
                varlist[0].push(1)
            }
            if(currentvalue == funcs.multiplynum){
                varlist[0].push(root.right.value) 
            }
        }
        else if(root.left.value == "y"){
            yindex += 1
            if(currentvalue == funcs.addnum){
                varlist[1].push(1)
            }
            if(currentvalue == funcs.multiplynum){
                varlist[1].push(root.right.value)  
            }
        }
        else{//must be a function
            traverse(root.left)
        }
        //reform code later
        if(!isNaN(root.right.value)){ //if constant
            if(currentvalue == funcs.addnum){
                varlist[2].push(root.right.value)
                cindex += 1
            }
            //check for const * const
            else if(!isNaN(root.left.value) && !isNaN(root.right.value)){
                varlist[2].push(root.left.value * root.right.value)
                cindex += 1
            }
            else if(root.left.value !== "x" && root.left.value !== "y"){
                varlist[0][xindex] *= root.right.value
                varlist[1][yindex] *= root.right.value
                varlist[2][cindex] *= root.right.value  
            }
        }
        else if(root.right.value == "x"){
            if(currentvalue == funcs.addnum){
                varlist[0].push(1)
                xindex += 1
            }
        }
        else if(root.right.value == "y"){
            if(currentvalue == funcs.addnum){
                varlist[1].push(1)
                yindex += 1
            }
        }
        else{//must be a function
            traverse(root.right)
        }
    }
    traverse(root)
    var finalist = varlist.map(x => x.reduce((a, b) => a+b))
    
    return finalist
}

function solve(e1, e2, e3){
    //form matrix system
    const var_matrix = [[e1[0], e1[1], e1[2]],  [e2[0], e2[1], e2[2]], [e3[0], e3[1], e3[2]]]
    const const_vector = [[e1[3]], [e2[3]], [e3[3]]]
    const ans_vector = funcs.matrix_multiply_standard(funcs.inverse_matrix(var_matrix), const_vector)
    return ans_vector
}

function rearrange(lhs_x, rhs_y){ //rearrange for y 
    //data of form [x_coeff, const], [y_coeff, const]
    var final_equation = lhs_x
    //remove const
    final_equation[1] -= rhs_y[1]
    final_equation = final_equation.map(v => v/rhs_y[0]);
    return [final_equation, "y = " + String(final_equation[0]) + "*x + " + String(final_equation[1])]
}

function deconstruct(p, q) {
    //console.log(newleaves)
    
    var pvals = reduce_tree(p)
    var qvals = reduce_tree(q)
    if(pvals[0] == 0 && pvals[1] == 0 && qvals[0] == 0 && qvals[1] == 0){
        //no x and y values == nothing useful hence return null
        return null
    }

    const np1 = [pvals[0], pvals[1], -1]
    const np2 = [qvals[0], qvals[1], -1]
    const np3 = funcs.cross_product(np1, np2)
    const equation1 = [...np1, pvals[2]]
    const equation2 = [...np2, pvals[2]]
    const equation3 = [...np3, 0]
    //here we have equations of normals from planes 1, 2 and new plane 3
    //np1[0]*x + np1[1]*y + -z + np1[2]  == 0
    //np2[0]*x + np2[1]*y + -z + np2[2]*z  == 0
    //np3[0]*x + np3[1]*y + np3[2]*z  == 0
    //point = firsteq == secondeq == thirdeq
    const result_matrix = solve(equation1, equation2, equation3) //[[x], [y], [z]]
    var parametric_x = [1/np3[0], result_matrix[0][0]/np3[0]] //[x coefficient, constant]
    var parametric_y = [1/np3[1], result_matrix[1][0]/np3[1]] //[y coefficient, constant]
    var results = rearrange(parametric_x, parametric_y)
    var cartesian = results[0]
    var streq = results[1]
    return results //NOTE!!! IN future return only cartesian. streq for testing purposes. 
    //first: simplify tree
    //done: 
    //create np1, vector of [x coefficient, y coefficient, -1] of p
    // create np2, vector of [x coefficient, y coefficient, -1] of q
    // create np3, cross product of np1, np2
    // have 3 equations:
    // eq1, which is p - z == 0
    // eq2, which is q - z == 0
    // eq3, which is np3[0]*x + np3[1]*y + np3[2]*z == 0
    // point = solve for eq1==eq2==eq3 for variables x,y,z
    // parametric -> cartesian: 
    // let point give values for x, y, z in Array(3).
    // px = t == (x - point[0])/np3[0] 
    // py = t == (y - point[1])/np3[1]
    // pz = t == (z - point[2])/np3[2] (NN)
    // cartesian = rhs of px == rhs of py, solve for y.   
    
}

function lines(leaves, lineslist=[], i=0){ //returns lines of polygon
    if(i >= leaves.length - 1){//
        return lineslist
    }
    var currenteq = leaves[i]
    var nexteq = leaves[i+1]
    var solved = deconstruct(currenteq, nexteq)

    if(solved == null){ //skips empty equations with no x and y values
        return lines(leaves, lineslist, i+1)
    }
    
    if(!lineslist.includes(solved)){//if the line is not already in the list
        return lines(leaves, [...lineslist, solved], i+1)
    }
    return lines(leaves, lineslist, i+1)
}

const newleaves = leaves["leaves"];
const final_lines = lines(newleaves)
console.log(final_lines)
//const equation = simplify(newleaves[0])
//console.log(equation)

debugger;