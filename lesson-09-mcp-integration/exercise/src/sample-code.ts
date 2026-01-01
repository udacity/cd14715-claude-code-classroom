/**
 * Sample Code Files for Testing the Code Quality Reviewer
 */

export interface CodeSample {
  name: string;
  filename: string;
  code: string;
  expectedIssues: string[];
  expectedScoreRange: [number, number];
}

export const codeSamples: CodeSample[] = [
  {
    name: "Clean code",
    filename: "clean.js",
    code: `// Well-written JavaScript code
const greet = (name) => {
  return \`Hello, \${name}!\`;
};

const result = greet("World");
console.log(result);
`,
    expectedIssues: [],
    expectedScoreRange: [90, 100],
  },
  {
    name: "Minor formatting issues",
    filename: "formatting.js",
    code: `// Code with minor formatting issues
const  greet = ( name )=>{
  return "Hello, " + name
}

const x = greet( "World" );
console.log(x)
`,
    expectedIssues: ["spacing", "semicolons", "quotes"],
    expectedScoreRange: [70, 89],
  },
  {
    name: "Best practice violations",
    filename: "best-practices.js",
    code: `// Code with best practice issues
var unused = 'this is never used';
var globalVar = 1;

function foo(a,b){
  console.log('debugging')
  eval('var x = 1');
  return a+b
}

if(true){
  foo(1,2)
}
`,
    expectedIssues: ["no-unused-vars", "no-var", "no-eval", "no-console"],
    expectedScoreRange: [40, 69],
  },
  {
    name: "Multiple errors",
    filename: "errors.js",
    code: `// Code with multiple errors
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
`,
    expectedIssues: ["no-var", "no-cond-assign", "missing-semicolons", "indentation"],
    expectedScoreRange: [0, 39],
  },
];
