/**
 * Example code file for the Code Review Assistant to analyze
 */

// TODO: This function has several issues that the assistant should catch
function processData(data: any) {
  var result = [];

  for (var i = 0; i < data.length; i++) {
    if (data[i].status == "active") {
      result.push(data[i]);
    }
  }

  return result;
}

// A function with potential security issues
function buildQuery(userInput: string) {
  const query = "SELECT * FROM users WHERE name = '" + userInput + "'";
  return query;
}

// Deeply nested code that could be improved
function validateUser(user: any) {
  if (user) {
    if (user.email) {
      if (user.email.includes("@")) {
        if (user.password) {
          if (user.password.length >= 8) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export { processData, buildQuery, validateUser };
