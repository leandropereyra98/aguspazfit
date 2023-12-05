const productos = [
  { nombre: "Creatina", precio: 10000.00, descripcion: "Sabor Neutro- 300g", imagen: "../images/ena.webp" },
  { nombre: "Proteína", precio: 15000.00, descripcion: "907g-Incluye Scoop.", imagen: "../images/proteina.jpg" },
  { nombre: "Pre-entreno", precio: 25000.00, descripcion: "Pre-workout 300g. - Sabor:watermelon", imagen: "../images/preentreno.jpg" },
  { nombre: "Botella", precio: 8000.00, descripcion: "Botella reutilizable - 600ML", imagen: "../images/botella.jpg" }
];

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

const mostrarProductos = () => {
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

  
  carrito.push({ nombre, precio });
  guardarCarritoEnLocalStorage();

  
  limpiarContenidoModal();

  
  carrito.forEach(producto => {
    modalBody.innerHTML += `
      <div class="row">
        <div class="col-md-8">
          <p>Nombre: ${producto.nombre} | Precio: $${producto.precio.toFixed(2)}</p>
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
            <p>Nombre: ${producto.nombre} | Precio: $${producto.precio.toFixed(2)}</p>
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
  const totalCompra = carrito.reduce((total, producto) => total + producto.precio, 0);

  // Mostrar el resultado final en el modal
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML += `
    <hr>
    <p>Total de la compra: $${totalCompra.toFixed(2)}</p>
  `;

  
  setTimeout(() => {
    carrito.length = 0;
    guardarCarritoEnLocalStorage();
    $('#detalleProductoModal').modal('hide');
    limpiarContenidoModal();
  }, 7000);
};

filtroProductosInput.addEventListener('input', filtrarProductos);

document.getElementById("cerrarModalBtn").addEventListener("click", function() {
  $('#detalleProductoModal').modal('hide');
});

mostrarProductos();




