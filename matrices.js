function rows(m){
    return m.length;
}

function cols(m){
    return m[0].length;
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
    }
    return dot(arr, arr2, i, j+1, [...temparr, arr[i].map((num, k) => num * arr2[k][j]).reduce((a,b) => a+b, 0)], finalarr)
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
    //only works currently if the matrix m2 is smaller than m1 dimensionally. fix this later.

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
    const newarr = m1.map((num, idx) => num.map((num2, idx2) => num2 + m2[idx][idx2]));
    return (newarr); //add arrays and return new matrix.
}

export default {
    "transpose": transpose,
    "matrix_multiply": dot,
    "matrix_add": add,
    "rows": rows,
    "cols": cols,
}
