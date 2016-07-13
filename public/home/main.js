// INIT
// Si ha iniciado sesión:
if (sessionStorage.token) {

  //Mostrar el nombre de la tienda

  var nom = document.getElementsByClassName("tiendaNombre");
  for (i = 0; i < nom.length; i++) {
    nom[i].innerHTML = sessionStorage.nombre;
  }

  //Variables Globales

  var tiendaToken = sessionStorage.token;
  var pedidos = null;

  //Inicializar lista de pedidos

  pedidosService();
  //Fin del IF inicial
} else {
  window.location.href = '../../';
}

//Fin de init
/////////////

// Web Services

function pedidosService() {
  jQuery(function($) {
    $.ajax({
      type: 'POST',
      url: '../../findPedidosActivosTienda',
      contentType: 'application/json',
      data: JSON.stringify({
        'token': tiendaToken
      }),
      success: function(data) {
        console.log('tiendaToken',tiendaToken);
        console.log(data);
        pedidos = data;
        pedidosShow();
      }
    });
  });
}

function actualizarService(id, coEst, estado) {
  jQuery(function($) {
    $.ajax({
      type: 'POST',
      url: '../../actualizarEstadoPedidoTienda',
      data: JSON.stringify({
        'tokenTienda': tiendaToken,
        'idPedido': id,
        'coEst': coEst,
        'estado': estado
      }),
      success: function(data) {
        actualizarPedido(data);
      }
    });
  });
}
//Fin de Web Services
/////////////////////

//Funciones

//Mostrar pedidos activos para la tienda
function pedidosShow() {
  var d = pedidos;
  var mega;
  var e = document.getElementsByClassName("widget")[0];
  e.innerHTML = "";

  if (d[0]) {
    //Si existen pedidos...
    for (i = 0; i < d.length; i++) {
      appendPedido(d[i]);
    }
  } else {
    e.innerHTML = '<h2> No hay pedidos en este momento</h2>';
  }
}

// Pintar QR por pedido
function pintarQR(pedido) {
  var a = document.getElementById('pintar-' + pedido);
  var e = document.getElementById("div-" + pedido);
  var e2 = document.getElementsByClassName("widget")[0];
  if (a.innerHTML == "Ocultar QR") {
    pedidosService();
  } else if (a.innerHTML == "Mostrar QR") {
    e.innerHTML = '<img src="../../getQrCode/' + pedido + '">';
    a.innerHTML = "Ocultar QR";
  }
}

// Actualizar estado
function actualizarEstado(id, coEst, estado) {
  if (coEst == 90 || estado == 'Entregado') {
    return;
  } else {
    actualizarService(id, coEst, estado);
  }
}

// Añade un widget al DOM, recibe X que contiene un solo objeto pedido.
function appendPedido(x) {
  var mega;
  var e = document.getElementsByClassName("widget")[0];
  //Construir el widget de cada pedido

  // Timer (encima del widget)
  mega = '<div class="col-md-12" style="width:100%">\
  <h2 id="timer-' + x._id + '" style="font-size:18pt;text-align:center">\
  </h2></div>';

  var prev = new Date(
    x.fecha.split("-")[0],
    x.fecha.split("-")[1] - 1,
    x.fecha.split("-")[2].split("T")[0],
    x.fecha.split("-")[2].split("T")[1].split(":")[0],
    x.fecha.split("-")[2].split("T")[1].split(":")[1],
    x.fecha.split("-")[2].split("T")[1].split(":")[2].split(".")[0],
    0);

  function loop() {
    setTimeout(function() {
      var now = new Date();
      var diff = now.getTime() - prev.getTime();
      var min = Math.floor(diff / (1000 * 60));
      var secP = Math.round((diff / 1000) - (min * 60));
      var sec = secP.toString().slice(-2);
      if (sec.length == 1) {
        sec = '0' + sec;
      }
      var str = min + ':' + sec;
      document.getElementById('timer-' + x._id).innerHTML = str;
      var bg = document.getElementById('bg-' + x._id);
      if (min < 5) {
        bg.style.backgroundColor = "#C8FF97";
      } else if (min >= 5 && min < 10) {
        bg.style.backgroundColor = "#EDE34B";
      } else if (min >= 10 && min < 20) {
        bg.style.backgroundColor = "#EDA14B";
      } else {
        bg.style.backgroundColor = "#ED4B4B";
      }
      loop();
    }, 1000);
  }

  //Formar el widget

  mega += '<div class="col-md-3 col-sm-6 col-xs-12 profile_details"><div class="well profile_view"><div class="col-sm-12" name="bloque"id="div-' + x._id + '">\
      <h4 class="brief" style="text-align:center;"><i>Pedido # ' + x._id + '</i></h4><div class="left col-xs-7">\
      <h2>' + x.datosUsuario.nombre + '</h2><strong>Pedido: </strong> <ul class="list-unstyled">';

  //Meterle las Pizzas
  var pi = x.pizzas;
  for (j = 0; j < pi.length; j++) {
    var p = pi[j];
    //Crea cada pizza en un LI
    mega += '<li>' + p.cantidad + ' Pizza ' + p.nombre;
    //Si la pizza tiene comentario
    if (p.comentario === "") {
      mega += '</li>';
    } else {
      mega += ' <icon class="fa fa-angle-down"></i><li style="margin-left:10%;">' + p.comentario + '</li></li>';
    }
  }
  mega += '</ul></div></div>';

  mega += '<div class="bottom col-xs-12 text-center"><ul class="list-unstyled" style="margin-top:5px; ">\
      <li><i class="fa fa-building"> </i><strong>Dirección: </strong>' + x.direccion.calle + ', ' + x.direccion.distrito + '</li>\
      <li><i class="fa fa-phone"></i> <strong>Teléfono: </strong>' + x.datosUsuario.telefono + '</li>\
      </ul></div>';

  mega += '<div class="col-xs-12 bottom text-center blacktext" id="bg-' + x._id + '">\
      <div class="col-xs-12 col-sm-6 emphasis" onclick="actualizarEstado(&quot;' + x._id + '&quot;,' + x.coEst + ',&quot;' + x.estado + '&quot;)" style=""><h2 > Estado: </h2>\
      <h4 id="estado-' + x._id + '">' + x.estado + '</h4></div>\
      <div class="col-xs-12 col-sm-6 emphasis"><div style="margin-top:25%;">\
      <a id="pintar-' + x._id + '" href="#" onclick="pintarQR(&quot;' + x._id + '&quot;)" style="color:#000000">Mostrar QR</a>\
      </div></div></div></div>';

  e.innerHTML += mega;
  loop();
}

// Actualiza el estado del pedido en pantalla con la respuesta del servicio (un pedido)
function actualizarPedido(data) {
  var flag = 'n';
  for (i = 0; i < pedidos.length; i++) {
    if (data._id == pedidos[i]._id) {
      pedidos[i] = data;
      if (data.coEst >= 10 && data.coEst <= 21) {
        var e = document.getElementById('estado-' + data._id);
        e.innerHTML = data.estado;
      } else if (data.coEst == 22) {
        pintarQR(data);
      } else {
        pedidosService();
      }

      flag = 'y';
    }
  }
  if (flag == 'n') {
    if (data.coEst == 10 || data.coEst == '10') {
      pedidos.push(data);
      appendPedido(data);
    }
  }
}
