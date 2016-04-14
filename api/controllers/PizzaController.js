module.exports = {
  find: function(req, res) {
    Pizza.find().exec(function(err, pizzas) {
      if (err) {
        return res.negotiate(err);
      }
      sails.log('Wow, there are %d pizzas.  Check it out:', pizzas.length, pizzas);
      return res.json(pizzas);
    });
  },
  findPizza: function(req, res) {
    Pizza.findPizza(req.param('nombre'), function(err, pizzas) {
      if (err) {
        return res.negotiate(err);
      }
      sails.log('Wow, there are %d pizzas.  Check it out:', pizzas.length, pizzas);
      return res.json(pizzas);
    });
  }
};
