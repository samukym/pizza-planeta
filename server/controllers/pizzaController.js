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
  },
  crearPizzas: function(req, res) {
    var pizza1 = new Pizza({
      nombre: "Americana",
      detalle: "Simple y clásica, solo tiene jamón",
      ingredientes: [{
        nombre: "Jamón",
        codigo: 1
      }],
      tamanos: [{
        precio: 36.99,
        nombre: "Mediana",
        kcal: 120,
        codigo: "m"
      }, {
        precio: 41.99,
        nombre: "Grande",
        kcal: 210,
        codigo: "g"
      }, {
        precio: 45.99,
        nombre: "Familiar",
        kcal: 300,
        codigo: "f"
      }]
    });
    var pizza2 = new Pizza({
      nombre: "Peperoni",
      detalle: "Si te gustan los embutidos, esta es para ti!",
      ingredientes: [{
        nombre: "Jamón",
        codigo: 1
      }, {
        nombre: "Peperoni",
        codigo: 5
      }],
      tamanos: [{
        precio: 36.99,
        nombre: "Mediana",
        kcal: 140,
        codigo: "m"
      }, {
        precio: 41.99,
        nombre: "Grande",
        kcal: 260,
        codigo: "g"
      }, {
        precio: 45.99,
        nombre: "Familiar",
        kcal: 370,
        codigo: "f"
      }]
    });
    var pizza3 = new Pizza({
      nombre: "Hawaiana",
      detalle: "¡Aloha! Esta pizza tiene piña",
      ingredientes: [{
        nombre: "Jamón",
        codigo: 1
      }, {
        nombre: "Piña",
        codigo: 6
      }],
      tamanos: [{
        precio: 39.99,
        nombre: "Mediana",
        kcal: 140,
        codigo: "m"
      }, {
        precio: 44.99,
        nombre: "Grande",
        kcal: 240,
        codigo: "g"
      }, {
        precio: 47.99,
        nombre: "Familiar",
        kcal: 350,
        codigo: "f"
      }]
    });
    var pizza4 = new Pizza({
      nombre: "Marina",
      detalle: "Todo el sabor de la costa, langostinos",
      ingredientes: [{
        nombre: "Aceitunas",
        codigo: 3
      }, {
        nombre: "Cebolla",
        codigo: 4
      }, {
        nombre: "Langostinos",
        codigo: 7
      }],
      tamanos: [{
        precio: 41.99,
        nombre: "Mediana",
        kcal: 0,
        codigo: "m"
      }, {
        precio: 45.99,
        nombre: "Grande",
        kcal: 0,
        codigo: "g"
      }, {
        precio: 50.99,
        nombre: "Familiar",
        kcal: 0,
        codigo: "f"
      }]
    });
    var pizza5 = new Pizza({
      nombre: "Vegetariana",
      detalle: "Tu mamá dice que comas tus verduras",
      ingredientes: [{
        nombre: "Champiñones",
        codigo: 2
      }, {
        nombre: "Cebolla",
        codigo: 4
      }, {
        nombre: "Tomate",
        codigo: 8
      }],
      tamanos: [{
        precio: 38.99,
        nombre: "Mediana",
        kcal: 0,
        codigo: "m"
      }, {
        precio: 42.99,
        nombre: "Grande",
        kcal: 0,
        codigo: "g"
      }, {
        precio: 47.99,
        nombre: "Familiar",
        kcal: 0,
        codigo: "f"
      }]
    });
    var pizza6 = new Pizza({
      nombre: "Marciana",
      detalle: "Para los que vienen de otro planeta",
      ingredientes: [{
        nombre: "Jamón",
        codigo: 1
      }, {
        nombre: "Aceitunas",
        codigo: 3
      }, {
        nombre: "Peperoni",
        codigo: 5
      }, {
        nombre: "Piña",
        codigo: 6
      }],
      tamanos: [{
        precio: 48.99,
        nombre: "Mediana",
        kcal: 0,
        codigo: "m"
      }, {
        precio: 53.99,
        nombre: "Grande",
        kcal: 0,
        codigo: "g"
      }, {
        precio: 58.99,
        nombre: "Familiar",
        kcal: 0,
        codigo: "f"
      }]
    });
    var pizza7 = new Pizza({
      nombre: "Planetaria",
      detalle: "La favorita de la casa, de otro mundo",
      ingredientes: [{
        nombre: "Jamón",
        codigo: 1
      }, {
        nombre: "Champiñones",
        codigo: 2
      }, {
        nombre: "Peperoni",
        codigo: 5
      }, {
        nombre: "Langostinos",
        codigo: 7
      }],
      tamanos: [{
        precio: 48.99,
        nombre: "Mediana",
        kcal: 0,
        codigo: "m"
      }, {
        precio: 53.99,
        nombre: "Grande",
        kcal: 0,
        codigo: "g"
      }, {
        precio: 58.99,
        nombre: "Familiar",
        kcal: 0,
        codigo: "f"
      }]
    });
    var pizza8 = new Pizza({
      nombre: "Bién Taipá",
      detalle: "Cuando tienes hambre, viene con todo",
      ingredientes: [{
        nombre: "Jamón",
        codigo: 1
      }, {
        nombre: "Champiñones",
        codigo: 2
      }, {
        nombre: "Aceitunas",
        codigo: 3
      }, {
        nombre: "Cebolla",
        codigo: 4
      }, {
        nombre: "Peperoni",
        codigo: 5
      }, {
        nombre: "Piña",
        codigo: 6
      }, {
        nombre: "Langostinos",
        codigo: 7
      }, {
        nombre: "Tomate",
        codigo: 8
      }],
      tamanos: [{
        precio: 48.99,
        nombre: "Mediana",
        kcal: 0,
        codigo: "m"
      }, {
        precio: 53.99,
        nombre: "Grande",
        kcal: 0,
        codigo: "g"
      }, {
        precio: 58.99,
        nombre: "Familiar",
        kcal: 0,
        codigo: "f"
      }]
    });

    Pizza.create(pizza1, pizza2, pizza3, pizza4, pizza5, pizza6, pizza7, pizza8,
      function(err, pizza1, pizza2, pizza3, pizza4, pizza5, pizza6, pizza7, pizza8) {
        if (err) {
          res.send({
            error: true,
            message: 'Oops! Ocurrió un error'
          });
        }
        console.log('Pizzas insertada', pizza1, pizza2, pizza3, pizza4, pizza5, pizza6, pizza7, pizza8);
        return res.json({
          pizza1: pizza1,
          pizza2: pizza2,
          pizza3: pizza3,
          pizza4: pizza4,
          pizza5: pizza5,
          pizza6: pizza6,
          pizza7: pizza7,
          pizza8: pizza8
        });
      });
  }
};
