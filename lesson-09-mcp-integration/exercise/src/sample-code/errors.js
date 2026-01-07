/**
 * Code with multiple errors
 */

var x = 1
var y = 2
var z

function badCode(a,b,c){
console.log(x)
if(a=b){
  return c
}
return undefined
}

badCode(1,2,3)
