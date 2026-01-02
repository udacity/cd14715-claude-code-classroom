/**
 * Well-written JavaScript code
 */

const greet = (name) => {
  return `Hello, ${name}!`;
};

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const result = greet("World");
console.log(result);
console.log(formatDate(new Date()));
