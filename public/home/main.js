var CURRENT_URL = window.location.href.split('?')[0]

  var globals = document.getElementsByName("bloque");
  var globaldata=[];
  for (i = 0; i<globals.length; i++) {
    globaldata.push(globals[i].innerHTML);
  }


function pintarQR(pedido){
  var a = document.getElementById('pintar-'+pedido);
  var e = document.getElementById("div-"+pedido);
  if(a.innerHTML == "Ocultar QR"){
    for (i = 0; i<globals.length; i++) {
      if (globals[i].id.split("-")[1]== pedido){
        e.innerHTML= globaldata[i];
      }
    }
    a.innerHTML = "Mostrar QR";

  }else if (a.innerHTML == "Mostrar QR") {
    e.innerHTML = '<img src="../../getQrCode/'+pedido+'">';
    a.innerHTML = "Ocultar QR";
  }
}

function actualizar(pedido){
  var a = document.getElementById('actualizar-'+pedido);
  var e = document.getElementById("estado-"+pedido);
  if(e.innerHTML == "En el horno"){
      e.innerHTML = "Esperando repartidor";
  }else if (e.innerHTML == "Esperando repartidor") {
      e.innerHTML = "En camino";
      a.style.display = "none";
  }

}
