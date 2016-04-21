module.exports = {
  // login: (idTienda, password) / (Tienda, tokenTienda),
  // findTiendas: (lista de Tiendas),
  // findTienda: (tienda),
  find: function(req, res) {
    Pizza.find().exec(function(err, tiendas) {
      if (err) {
        return res.negotiate(err);
      }
      sails.log('Hay %d tiendas:', tiendas.length, tiendas);
      return res.json(tiendas);
    });
  },
  logout: function (req,res){
    req.logout();
    res.send('logout successful');
  }
};
