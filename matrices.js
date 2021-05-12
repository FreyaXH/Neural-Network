export function creatematrix(a) { //create matrix object with rows and cols properties.
    const matrix = {
        mat: a, //set given array as property "mat"
        rows: function () { //returns rows in matrix
            return this.mat.length;
        },
        cols: function () { //returns columns in matrix
            return this.mat[0].length;  
        },
    }
    return Object.freeze(matrix); //immutable object
}

export function transpose(arr, c=0, newarr=[]) //transposes a matrix and returns a new one
{
	if(c >= arr.cols()){
    	return creatematrix(newarr);
    }
    return transpose(arr, c+1, [...newarr, arr.mat.map(x => x[c])]); //creates a row from a column 
}

export function dot(arr, arr2, ar1_row=0, ar2_row = 0, temparr = [], finalarr = []) //dot product of 2 matrices
{
    const newarr2 = transpose(arr2); //transpose array and then do dot product
    if(ar2_row >= newarr2.rows()){ // recursive iteration through each row of matrix2 until we finish
        return creatematrix(finalarr)
    }
    if(ar1_row >= arr.rows()){
        return dot(arr, arr2, 0, ar2_row+1, [], [...finalarr, temparr])
    }
    return dot(arr, arr2, ar1_row +1, ar2_row, [...temparr, arr.mat[ar1_row].map((num, idx) => num * newarr2.mat[ar2_row][idx]).reduce((a,b) => a+b, 0)], finalarr)
}

function expandrows(m, rows){
    // rows are repeated until the rows match the specified length 
    const newarr = Array(rows).fill(m.mat).flat();
    return creatematrix(newarr);
}
function expandcols(m, cols){
    // each row's columns are duplicated until they match specified length
    const newarr = m.mat.map(x => Array(cols/x.length).fill(x).flat());
    return creatematrix(newarr);
}

export function add(m1, m2){ //adds two matrices together
    //if second matrix is too small, expand it to make it fit.
    //similar to numpy "broadcasting".
    //only works currently if the matrix m2 is smaller than m1 dimensionally. fix this later.

    if(m2.rows() !== m1.rows()){ //if rows different, expand m2 rows if and only if it divides m1.
        if(m1.rows() % m2.rows() !== 0 ){
            return undefined
        }
        const newrows = m1.rows() / m2.rows();
        return add(m1, expandrows(m2, newrows));
    }
    if(m2.cols() !== m1.cols()){
        if(m1.cols() % m2.cols() !== 0 ){//if cols different, expand m2 cols if and only if it divides m1.
            return undefined
        }
        const newcols = m1.cols() / m2.cols();
        return add(m1, expandcols(m2, newcols));
    }
    const newarr = m1.mat.map((num, idx) => num.map((num2, idx2) => num2 + m2.mat[idx][idx2]));
    return creatematrix(newarr); //add arrays and return new matrix.
}
