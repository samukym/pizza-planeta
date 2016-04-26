var Pizza = require('mongoose').model('Pizza');

module.exports = {
  find: function(req, res) {
    Pizza.find().exec(function(err, pizzas) {
      if (err) {
        res.send({
          error: true,
          message: 'Oops! Ocurrió un error'
        });
      }
      console.log('Hay %d pizzas:', pizzas.length, pizzas);
      return res.json(pizzas);
    });
  }
};
