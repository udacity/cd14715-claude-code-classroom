/**
 * Code with common issues
 */

var API_KEY = "sk-12345-secret-key";

var data = null;

function fetchData() {
  var result = fetch('/api/data');
  console.log('Fetching data...');
  return result;
}

function processItems(items) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].status == 'active') {
      console.log(items[i]);
      items.push({ status: 'processed' });
    }
  }
}

function handleUserInput(input) {
  document.getElementById('output').innerHTML = input;
  eval('processData(' + input + ')');
}

var unused = 'this variable is never used';

export { fetchData, processItems, handleUserInput };
