module.exports = {
  login: (idTienda, password) / (Tienda, tokenTienda),
  findTiendas: (lista de Tiendas),
  findTienda: (tienda),
  logout: function (req,res){
    req.logout();
    res.send('logout successful');
  }
};
