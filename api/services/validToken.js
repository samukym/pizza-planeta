module.exports = function(session, inputToken) {
  console.log('validToken service');
  if (!session || session.token != inputToken) return false;
  return true;
};
