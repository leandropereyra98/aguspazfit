var carrito = [];
var total = 0;


function agregarAlCarrito(producto, precio, cantidad) {
  
  if (isNaN(precio) || isNaN(cantidad)) {
    alert("Por favor, ingrese valores numéricos para precio y cantidad.");
    return;
  }


  var subtotal = precio * cantidad;
  carrito.push({ producto: producto, cantidad: cantidad, subtotal: subtotal });
  total += subtotal;

 
  mostrarResultado();
}


function mostrarResultado() {
  console.log("Carrito de Compras:");
  for (var i = 0; i < carrito.length; i++) {
    console.log(carrito[i].cantidad + "x " + carrito[i].producto + ": $" + carrito[i].subtotal.toFixed(2));
  }
  console.log("Total: $" + total.toFixed(2));

  
  alert("Carrito de Compras:\n" + obtenerDetallesCarrito() + "\nTotal: $" + total.toFixed(2));
}

function obtenerDetallesCarrito() {
  var detalles = "";
  for (var i = 0; i < carrito.length; i++) {
    detalles += carrito[i].cantidad + "x " + carrito[i].producto + ": $" + carrito[i].subtotal.toFixed(2) + "\n";
  }
  return detalles;
}


agregarAlCarrito("Proteína", 30, 2);
agregarAlCarrito("Creatina", 15, 1);