// TODO: expose a function called "info" which prints the date and a logging string.
exports.info = function(message) {
  console.log(new Date() + ': ' + message);
};