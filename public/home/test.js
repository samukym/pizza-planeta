  //crearUsuario: (email, password, nombre, dni, telefono)
var usuariolog=null;
  function crearUsuario(){
    jQuery(function($) {
       $.ajax({
            type: 'POST',
            url:  '../../crearUsuario',
            data: JSON.stringify({'email' : 'pENe',
                                  'password' : 'pene',
                                  'nombre' : 'Gabriel Planata',
                                  'dni' : '1231231',
                                  'telefono' : ' 1234567'}),
            success: function(data) {
              if(data){
                console.log(data);
              }
            }
        });
      });

  }

  function login(){
    jQuery(function($) {
       $.ajax({
            type: 'POST',
            url:  '../../loginUsuario',
            data: JSON.stringify({'email' : 'pENe',
                                  'password' : 'pNEe'}),
            success: function(data) {
              console.log(data);
              usuariolog = data.usuario;
              sessionStorage.usuarioToken = data.tokenUsuario;
            }
        });
      });
  }

  function dir(){
      //agregarDireccion: (nombre, calle, distrito, ciudad, latitud, longitud)
      jQuery(function($) {
         $.ajax({
              type: 'POST',
              url:  '../../agregarDireccion',
              data: JSON.stringify({'nombre' : 'Direxion',
                                    'calle' : 'Calle Planeta 123',
                                    'distrito' : 'Pizzilla',
                                    'ciudad' : 'Lema',
                                    'latitud' : '-5',
                                    'longitud' : '5'}),

              success: function(data) {
                console.log(data);
              }
          });
        });
  }
