const productosContainer = document.getElementById("productosContainer");
const filtroProductosInput = document.getElementById("filtroProductos");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const guardarCarritoEnLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const limpiarContenidoModal = () => {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = '';
};

const cargarProductos = async () => {
  try {
    const response = await fetch('../JSON/productos.json');
    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    throw error;
  }
};

const mostrarProductos = async () => {
  try {
    const productos = await cargarProductos();

    productosContainer.innerHTML = '';

    productos.forEach(producto => {
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-4");

      card.innerHTML = `
        <div class="card">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
            <button class="btn btn-primary" onclick="mostrarDetalleProducto('${producto.nombre}', ${producto.precio})">Agregar al carrito</button>
          </div>
        </div>
      `;

      productosContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error al mostrar los productos:', error);
  }
};

const filtrarProductos = () => {
  const filtro = filtroProductosInput.value.toLowerCase();

  // Código de filtrado, similar al que ya tenías...
};

const mostrarDetalleProducto = (nombre, precio) => {
  const modalBody = document.getElementById("modalBody");

  const productoEnCarrito = carrito.find(producto => producto.nombre === nombre);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad = (productoEnCarrito.cantidad || 1) + 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  guardarCarritoEnLocalStorage();

  limpiarContenidoModal();

  carrito.forEach(producto => {
    modalBody.innerHTML += `
      <div class="row">
        <div class="col-md-8">
          <p>Nombre: ${producto.nombre} | Cantidad: ${producto.cantidad} | Precio: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
        </div>
        <div class="col-md-4">
          <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${producto.nombre}')">Eliminar</button>
        </div>
      </div>
      <hr>
    `;
  });

  $('#detalleProductoModal').modal('show');
};

const eliminarProducto = (nombre) => {
  const indice = carrito.findIndex(producto => producto.nombre === nombre);
  if (indice !== -1) {
    carrito.splice(indice, 1);
    guardarCarritoEnLocalStorage();

    limpiarContenidoModal();

    carrito.forEach(producto => {
      const modalBody = document.getElementById("modalBody");
      modalBody.innerHTML += `
        <div class="row">
          <div class="col-md-8">
            <p>Nombre: ${producto.nombre} | Cantidad: ${producto.cantidad} | Precio: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
          </div>
          <div class="col-md-4">
            <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${producto.nombre}')">Eliminar</button>
          </div>
        </div>
        <hr>
      `;
    });

    if (carrito.length === 0) {
      limpiarContenidoModal();
      const modalBody = document.getElementById("modalBody");
      modalBody.innerHTML = '<p>Carrito vacío</p>';
    }
  }
};

const finalizarCompra = () => {
  const totalCompra = carrito.reduce((total, producto) => total + producto.precio * (producto.cantidad || 1), 0);

  Swal.fire({
    title: 'Compra exitosa',
    html: `<p>Total de la compra: $${totalCompra.toFixed(2)}</p>`,
    icon: 'success',
    timer: 2000,
    timerProgressBar: true,
    onClose: () => {
      carrito.length = 0;
      guardarCarritoEnLocalStorage();
      limpiarContenidoModal();

      $('#detalleProductoModal').modal('hide');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  mostrarProductos();
});

filtroProductosInput.addEventListener('input', filtrarProductos);

document.getElementById("cerrarModalBtn").addEventListener("click", function() {
  $('#detalleProductoModal').modal('hide');
});


















