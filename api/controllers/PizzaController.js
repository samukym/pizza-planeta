module.exports = {
  
  find: function(req, res) {
    Pizza.find().exec(function(err, pizzas) {
      if (err) {
        return res.negotiate(err);
      }
      sails.log('Hay %d pizzas:', pizzas.length, pizzas);
      return res.json(pizzas);
    });
  },

  findPizza: function(req, res) {
    Pizza.findPizza(req.param('id'), function(err, pizzas) {
      if (err) {
        return res.negotiate(err);
      }
      sails.log('Hay %d pizzas:', pizzas.length, pizzas);
      return res.json(pizzas);
    });
  }

};
