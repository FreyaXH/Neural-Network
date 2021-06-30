function node(value, left=null, right=null){ //creates node for given tree
    return {
        "value":value,
        "left":left,
        "right":right,
      }
}

function evaluate_tree(root){ //returns evaluation of tree no strings allowed
    if(!isNaN(root.value)){ //if a number, return value
    return root.value
    } 
    //if a function, return func(evaluate_tree(left), evaluate_tree(right))
    //console.log(root.value)
    return root.value(evaluate_tree(root.left), evaluate_tree(root.right))
}

function equation_from_tree(root){ //gets string equation of a given tree
    if(root){
      if(!isNaN(root.value) || typeof root.value === "string"){//if number
        return equation_from_tree(root.left) + String(root.value) + equation_from_tree(root.right)
      }
      //is operator
      if(root.value == addnum){
        return equation_from_tree(root.left) + "+" + equation_from_tree(root.right)
      }
      if(root.value == multiplynum){
        return "(" + equation_from_tree(root.left) + ")" + "*" + equation_from_tree(root.right)
      }
      if(root.value == Math.max){
        return "max(" + equation_from_tree(root.left) + "), 0)"
      }
    }
    return ""
}


function rows(m){ //gets rows of matrix (2d array)
    return m.length;
}

function cols(m){ //gets columns of matrix (2d array)
    return m[0].length;
}

function addnum(a,b) { //add function for tree
    return a + b
}

function multiplynum(a,b) { //multiply function for tree
    return a*b
}

const compile = function(a,b,index){//reducer function for dot product
      return node(addnum, a, b)
}


function transpose(arr, c=0, newarr=[]) //transposes a matrix and returns a new one
{
	if(c >= cols(arr)){
    	return (newarr);
    }
    return transpose(arr, c+1, [...newarr, arr.map(x => x[c])]); //creates a row from a column 
}

function dot(arr, arr2, i=0, j = 0, temparr = [], finalarr = []) //dot product of 2 matrices
{
    //const newarr2 = transpose(arr2); //transpose array and then do dot product
    if(i >= rows(arr)){ // recursive iteration through each row of matrix2 until we finish
        return finalarr
    }
    if(j >= cols(arr2)){
        return dot(arr, arr2, i+1, 0, [], [...finalarr, temparr])
    } //creates one element in final matrix: a tree of instructions for mat multiplication. use eval to eval.
    return dot(arr, arr2, i, j+1, [...temparr, arr[i].map((num, k) => node(multiplynum, num, node(arr2[k][j]))).reduce(compile)], finalarr)
}

function expandrows(m, rows){
    // rows are repeated until the rows match the specified length 
    const newarr = Array(rows).fill(m).flat();
    return newarr;
}
function expandcols(m, cols){
    // each row's columns are duplicated until they match specified length
    const newarr = m.map(x => Array(cols/x.length).fill(x).flat());
    return newarr;
}

function add(m1, m2){ //adds two matrices together
    //if second matrix is too small, expand it to make it fit.
    //similar to numpy "broadcasting".
    //only works currently if the matrix m2 is smaller than m1 dimensionally, not other way round. 
    //fix this later.

    if(rows(m2) !== rows(m1)){ //if rows different, expand m2 rows if and only if it divides m1.
        if(rows(m1) % rows(m2) !== 0 ){
            return undefined
        }
        const newrows = rows(m1) / rows(m2);
        return add(m1, expandrows(m2, newrows));
    }
    if(cols(m2) !== cols(m1)){
        if(cols(m1) % cols(m2) !== 0 ){//if cols different, expand m2 cols if and only if it divides m1.
            return undefined
        }
        const newcols = cols(m1) / cols(m2);
        return add(m1, expandcols(m2, newcols));
    }
    const newarr = m1.map((num, idx) => num.map((num2, idx2) => node(addnum, num2, node(m2[idx][idx2]))));
    return (newarr); //add arrays by using tree structure and return new matrix.
}

function get_leaves_setup(root) { //fix this in future, only done because i could not remember how to 
// return all leaves in a tree functionally.
  var mylist = []

  function get_leaves(root, leafnodes=[]){
    if(root){
      if(root.left==null && root.right==null){
        mylist = [...mylist, root.value]
      }
      get_leaves(root.left)
      get_leaves(root.right)
    }
    return 
  }

  get_leaves(root)
  return mylist
}




//split takes as input an equation tree formed by the neural network and returns a tree which removes all
//of the maxes. the root holds the tree with the initial equation, the next layer has nodes with one max
//function removed from all of them, the next another max function, etc. leaves are standard planes. 
function split(root, i=0, newtree=node(root), layernodes=[newtree]){

    //removed .reverse() on bfs([root]) 
    const maxes = bfs([root])
    if(i >= maxes.length){
      return newtree
    }
    const currentmax = maxes[i]
    const newlefts = currentmax.left
    const newrights = currentmax.right
    //console.log(equation_from_tree(newlefts))
    //console.log(equation_from_tree(newrights))
    layernodes = replace(layernodes, currentmax, newlefts, newrights)  
    return split(root, i+1, newtree, layernodes)
  }
  //replace takes the tree of trees and goes one depth lower. for each node on the current level, 
  //create its left and right children by removing the current max from its equation and replace it as 
  //necessary. end result is a list of all nodes on the next depth, where we repeat this process again
  //for the next max to remove. 
  function replace(nodes, currentmax, l, r, i=0, j=0,
  newnodes=[]){
    //now put all code so it iterates over each max.
    //for each node in nodes, node.left l, node.right r, add nodes to newnodes list
    if(i >= nodes.length){
      return newnodes
    }
    nodes[i].left = node(rebuild(nodes[i].value, currentmax, l))
    nodes[i].right = node(rebuild(nodes[i].value, currentmax, r))
    return replace(nodes, currentmax, l, r, i+1, j, [...newnodes, nodes[i].left, nodes[i].right])
    
  }
  //replaces max function node with desired child, returns whole equation tree 
  function rebuild(root, target, replacement, newtree=root){ 
    if (root){
      //CHANGED from root == target to root.value == target.value
      if(equation_from_tree(root) == equation_from_tree(target)){
        return replacement
      }
      return {value: root.value, left:rebuild(root.left, target, replacement), right:rebuild(root.right, target, replacement)}
    }
    return null
  }
  
  
  function bfs(layernodes, i=0, out=[]){
  
    if(layernodes.length == 0){
      return out
    }
  
    if(i>=layernodes.length){
      return bfs(layernodes.flatMap((a)=>[a.left, a.right]).filter((a)=> a !== null), 0, out)
    }
  
    if(layernodes[i].value == Math.max){
      return bfs(layernodes,i+1, [...out, layernodes[i]])
    }
    return bfs(layernodes,i+1, out)
  }





export default {
    "transpose": transpose,
    "matrix_multiply": dot,
    "matrix_add": add,
    "rows": rows,
    "cols": cols,
    "node": node,
    "evaluate_tree": evaluate_tree,
    "equation_from_tree": equation_from_tree,
    "decision_tree": split,
    "get_leaves": get_leaves_setup,
}
