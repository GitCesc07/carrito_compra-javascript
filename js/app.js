// Declaración de variables
const resultado = document.querySelector('#resultado'),
  carrritoElminar = document.querySelector("#carrito"),
  contenedorCarrito = document.querySelector("#lista-carrito tbody"),
  cantidadCarrito = document.querySelector(".cantidad"),
  vaciarCarrito = document.querySelector("#vaciar-carrito");

let articulosCarrito = [];
let menuVisible = false;
let carritoVisible = false;
let sumaArticulo = [];
let suma = 0;

// id, title, price, description, category, image, Cantidad

// Mostrando panel del carrito de compra
function mostrarCarrito() {
  if (carritoVisible) {
    document.getElementById("carrito-ocultar").classList = "";
    carritoVisible = false;
  }
  else {
    document.getElementById("carrito-ocultar").classList = "ocultar-carrito";
    carritoVisible = true;
  }
}


// Mostrar u ocultar el menú
function mostrarOcultarMenu() {
  if (menuVisible) {
    document.getElementById("nav").classList = "";
    menuVisible = false;
  }
  else {
    document.getElementById("nav").classList = "responsive";
    menuVisible = true;
  }
}

// Hacer selección del menú
function seleccionar() {
  document.getElementById("nav").classList = "";
  menuVisible = false;
}


cargarEventList();

function cargarEventList() {
  consultarApi();

  // Funcion para consultar api
  function consultarApi() {
    const url = "https://fakestoreapi.com/products";

    fetch(url)
      .then(respuesta => respuesta.json())
      .then(resultado => mostrarImagenes(resultado))
  }

  resultado.addEventListener("click", agregarCurso);
  carrritoElminar.addEventListener("click", eliminarProducto);


  function mostrarImagenes(imagenes) {

    imagenes.forEach(producto => {
      const { id, title, price, category, image, cantidad } = producto;

      resultado.innerHTML += `
      <div class="contenedor-grid">
        <div class="card-grid">
            <img class="w-full" src="${image}">    
            <h2>${title}</h2>        
            <p class="categoria">Category: <span> ${category}</span></p>
            <p class="precio">Price: <span>$${price}</span></p>
            <a href="#" class="btn-carrito btn-apecing btn agregar-carrito" data-id="${id}">
               <svg xmlns="http://www.w3.org/2000/svg" class="icon-add icon icon-tabler icon-tabler-shopping-cart"
                   width="26" height="26" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none"
                   stroke-linecap="round" stroke-linejoin="round">
                   <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                   <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                   <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                   <path d="M17 17h-11v-14h-2" />
                   <path d="M6 5l14 1l-1 7h-13" />
               </svg>
               Add to Cart
            </a>        
        </div>
      </div>
    `;

    });
  }


  // vaciar carrito
  vaciarCarrito.addEventListener("click", () => {
    articulosCarrito = []; // Reseteando el arreglo
    limpiarcarritoHtml();
    sumarCantidadCarrito(); // Eliminando todo lo que esta en el HTML
  })
}


function agregarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;

    leerDatosProductos(cursoSeleccionado);

    sumarCantidadCarrito();
  }
}


function leerDatosProductos(product) {
  const infoProducto = {
    title: product.querySelector("h2").textContent,
    image: product.querySelector("img").src,
    price: product.querySelector(".precio span").textContent,
    category: product.querySelector(".categoria span").textContent,
    id: product.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  // articulosCarrito = [infoProducto];

  const existe = articulosCarrito.some(product => product.id === infoProducto.id);
  if (existe) {
    // Actualizamos la cantidad
    const products = articulosCarrito.map(product => {
      if (product.id === infoProducto.id) {
        product.cantidad++;
        return product; // Esto nos retorna el objeto actualizado
      }
      else {
        return product; // Esto retorna los objetos que no estan duplicados
      }
    });
    articulosCarrito = [...products];
  }
  else {
    // Agregamos al carrito


    articulosCarrito = [...articulosCarrito, infoProducto];
  }

  // Agregar elementos al arreglo de carrito
  // console.log(articulosCarrito);
  carritoMostrarHtml();
}

function carritoMostrarHtml() {

  limpiarcarritoHtml();

  articulosCarrito.forEach((product) => {
    const { id, title, price, category, image, cantidad } = product;

    const row = document.createElement("tr");
    row.innerHTML = `
    <td>
    <img src="${image}" width="100">
    </td>
    <td> ${title} </td>
    <td> ${price} </td>
    <td> ${cantidad} </td>
    <td>
      <a href="#" class="borrar-producto" data-id="${id}" >
        X       
      </a>
    </td>
    `;
    contenedorCarrito.appendChild(row);
  });
}

function limpiarcarritoHtml() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

function sumarCantidadCarrito() {

  // Cargando la cantidad de productos que has seleccionado para comprar
  cantidadCarrito.textContent = articulosCarrito.length;
}

function eliminarProducto(e) {
  if (e.target.classList.contains("borrar-producto")) {
    const productoId = e.target.getAttribute("data-id");

    articulosCarrito = articulosCarrito.filter(product => product.id !== productoId);

    carritoMostrarHtml();
    sumarCantidadCarrito();
  }
}