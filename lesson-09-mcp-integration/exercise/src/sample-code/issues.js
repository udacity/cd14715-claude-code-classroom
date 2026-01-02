/**
 * Code with common issues
 */

var unused = "this is never used";
var globalVar = 1;

function foo(a, b) {
  console.log("debugging");
  eval("var x = 1");
  return a + b;
}

if (true) {
  foo(1, 2);
}
