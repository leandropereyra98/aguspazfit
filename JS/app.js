const productosContainer = document.getElementById("productosContainer");
const filtroProductosInput = document.getElementById("filtroProductos");
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const guardarCarritoEnLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const limpiarContenidoModal = () => {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = '';
};

const cargarProductos = async () => {
  try {
    const response = await fetch('../JSON/productos.json'); // Ajusta la ruta según la ubicación de tu archivo
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

  const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(filtro));

  productosContainer.innerHTML = '';

  productosFiltrados.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "mb-4");

    card.innerHTML = `
      <div class="card">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
          <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
          <button class="btn btn-secondary" onclick="mostrarDetalleProducto('${producto.nombre}', ${producto.precio})">Agregar al carrito</button>
        </div>
      </div>
    `;

    productosContainer.appendChild(card);
  });
};

const mostrarDetalleProducto = (nombre, precio) => {
  const modalBody = document.getElementById("modalBody");

  // Buscar si el producto ya está en el carrito
  const productoEnCarrito = carrito.find(producto => producto.nombre === nombre);

  if (productoEnCarrito) {
    // Incrementar la cantidad si el producto ya está en el carrito
    productoEnCarrito.cantidad = (productoEnCarrito.cantidad || 1) + 1;
  } else {
    // Agregar el producto al carrito con cantidad 1
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
  // Eliminar el producto del carrito
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
  // Calcular la suma de los precios en el carrito
  const totalCompra = carrito.reduce((total, producto) => total + producto.precio * (producto.cantidad || 1), 0);

  // Mostrar SweetAlert para confirmar la compra
  Swal.fire({
    title: '¡Compra realizada!',
    text: `Total de la compra: $${totalCompra.toFixed(2)}`,
    icon: 'success',
    confirmButtonText: 'OK'
  }).then((result) => {
    if (result.isConfirmed) {
      // Limpiar el carrito y cerrar el modal después de hacer clic en OK
      carrito.length = 0;
      guardarCarritoEnLocalStorage();
      $('#detalleProductoModal').modal('hide');
      limpiarContenidoModal();
    }
  });
};

filtroProductosInput.addEventListener('input', filtrarProductos);

document.getElementById("cerrarModalBtn").addEventListener("click", function() {
  $('#detalleProductoModal').modal('hide');
});

// Llama a la función mostrarProductos al cargar la página
mostrarProductos();




















