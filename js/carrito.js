//Obtenemos lo que tenemos en el localStorage que le pusimos como nombre productos-en-carrito y lo guardamos en una variable
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

//Llamamos todo lo del html que necesitamos
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito(){

    if (productosEnCarrito && productosEnCarrito.length > 0){

        contenedorCarritoVacio.classList.add("desactivado");
        contenedorCarritoProductos.classList.remove("desactivado");
        contenedorCarritoAcciones.classList.remove("desactivado");
        contenedorCarritoComprado.classList.add("desactivado");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {

            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" class="producto-imagen" />
                <div class="carrito-producto-titulo">
                    <small>Titulo</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <h3>$${producto.precio}</h3>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <h3>${producto.precio * producto.cantidad}</h3>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
                `;
            contenedorCarritoProductos.append(div);
        });

    actualizarBotonesEliminar();
    actualizarTotal();

    }else{
        contenedorCarritoVacio.classList.remove("desactivado");
        contenedorCarritoProductos.classList.add("desactivado");
        contenedorCarritoAcciones.classList.add("desactivado");
        contenedorCarritoComprado.classList.add("desactivado");
    }
}

cargarProductosCarrito(); //Carga los productos del localStorage


//  ------  Funciones que necesitaremos en botones ------

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e){
    Toastify({
        text: "Producto eliminado",
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

    const idBoton = e.currentTarget.id;
    const indice = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito.splice(indice, 1);
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito(){

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    })
}

function actualizarTotal(){
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    total.innerText = `$${totalCalculado}`
}


botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
    contenedorCarritoVacio.classList.add("desactivado");
    contenedorCarritoProductos.classList.add("desactivado");
    contenedorCarritoAcciones.classList.add("desactivado");
    contenedorCarritoComprado.classList.remove("desactivado");

}




