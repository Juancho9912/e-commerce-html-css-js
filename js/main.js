let productos = [];

const obtenerDatos = async () => {
    const respuesta = await fetch("./js/productos.json");
    const datos = await respuesta.json();
    productos = datos;
    cargarProductos(productos);
};
obtenerDatos();

//Carga de elementos del html
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numero = document.querySelector("#numero");

//  ------  Funciones que necesitaremos
function cargarProductos(productosFiltrados) {
    //Dejamos el html vacio para cargar los productos
    contenedorProductos.innerHTML = "";

    productosFiltrados.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-imagen" />
            <div class="detalles-producto">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });
    actualizarBotonesAgregar();
}

botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach((boton) => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(
                (producto) => producto.categoria.id === e.currentTarget.id
            );
            tituloPrincipal.innerHTML = productoCategoria.categoria.nombre;
            const productosFiltrados = productos.filter(
                (producto) => producto.categoria.id === e.currentTarget.id
            );
            cargarProductos(productosFiltrados);
        } else {
            tituloPrincipal.innerHTML = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;
let productosEnCarritoLocalStorage = JSON.parse(
    localStorage.getItem("productos-en-carrito")
);
if (productosEnCarritoLocalStorage) {
    productosEnCarrito = productosEnCarritoLocalStorage;
    actualizarNumeroCarrito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #4b33a8, #785de6)",
            borderRadius: "1.5rem",
            textTransform: "uppercase",
            fontSize: ".75rem",
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function () { }, // Callback after click
    }).showToast();

    const id = e.currentTarget.id;
    const productoAgregado = productos.find((producto) => producto.id === id);
    if (productosEnCarrito.some((producto) => producto.id === id)) {
        productosEnCarrito.forEach((producto) => {
            if (producto.id === id) {
                producto.cantidad++;
            }
        });
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    actualizarNumeroCarrito();
    //Guardamos en el localStorage los productos que tenemos en el carrito para que no se borren al recargar la pagina y poder utilizarlos en el carrito.html
    localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
    );
}

function actualizarNumeroCarrito() {
    let nuevoNumero = productosEnCarrito.reduce(
        (acc, producto) => acc + producto.cantidad,
        0
    );
    numero.innerText = nuevoNumero;
}
