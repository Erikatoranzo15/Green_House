///////GESTION DEL CARRITO

// LISTA DE ELEMENTOS EN CARRITO CONTEMPLANDO AHORA QUE SE MANTIENEN LOCALMENTE
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// FUNCION PARA GUARDAR EL CARRITO EN LOCALSTORAGE
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// FUNCION PARA AGREGAR NUEVOS ELEMENTOS AL CARRITO DESDE LA SECCION DE PRODUCTOS
function agregarAlCarrito(nombre, precio) {
    // VERIFICAMOS SI EL CARRITO YA TIENE ESE ELEMENTO
    const existeProducto = carrito.find(item => item.nombre === nombre);

    if (existeProducto) {
        // SI EL ELEMENTO EXISTE SOLO AUMENTAMOS SU CANTIDAD
        existeProducto.cantidad += 1;
        existeProducto.total = existeProducto.cantidad * existeProducto.precio;
    } else {
        // SI EL ELEMENTO NO EXISTE EN EL CARRITO, LO AGREGAMOS
        carrito.push({ nombre, cantidad: 1, precio, total: precio });
    }

    // GUARDAMOS EN LOCALSTORAGE
    guardarCarrito();

    // ACTUALIZAMOS EL CONTADOR DEL CARRITO
    actualizarContadorCarrito();
}

// FUNCION PARA ACTUALIZAR LA CANTIDAD DE ELEMENTOS EN EL CARRITO
function actualizarContadorCarrito() {
    const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    // ACTUALIZAMOS CONTADOR DE ELEMENTOS DEL CARRITO
    document.querySelector(".custom-badge").textContent = totalProductos;
}

// FUNCION PARA VER LA LISTA DE ELEMENTOS EN EL CARRITO
function renderCarrito() {
    const carritoContainer = document.getElementById("carrito");
    const totalCompra = document.getElementById("total-compra");
    const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

    carritoContainer.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        carritoContainer.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";

        //DESHABILITAMOS BOTON PARA FINALIZAR COMPRA
        btnFinalizarCompra.disabled = true;
    } else {
        carrito.forEach(producto => {
            let precioTotalProducto = producto.precio * producto.cantidad;
            total += precioTotalProducto;

            let item = document.createElement("div");
            item.className = "d-flex justify-content-between align-items-center border-bottom py-2";
            item.innerHTML = `
                <span>${producto.nombre} (x${producto.cantidad})</span>
                <span>$${precioTotalProducto.toFixed(2)}</span>
                <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito('${producto.nombre}')"> <i class="fas fa-trash"></i></button>
            `;
            carritoContainer.appendChild(item);
        });

        //HABILITAMOS BOTON PARA FINALIZAR COMPRA
        btnFinalizarCompra.disabled = false;
    }

    totalCompra.textContent = total.toFixed(2);
}

// FUNCION PARA ELIMINAR UN ELEMENTO EN ESPECIFICO DEL CARRITO
function eliminarDelCarrito(nombreProducto) {
    // RETORNAMOS EL CARRITO SIN ESE ELEMENTO
    carrito = carrito.filter(item => item.nombre !== nombreProducto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    // ACTUALIZAMOS EL CONTADOR DEL CARRITO
    actualizarContadorCarrito();
    //ACTUALIZAMOS LISTA CARRITO
    renderCarrito();
}

// FUNCION PARA FINALIZAR LA COMPRA
function finalizarCompra() {
    // CALCULAMOS EL TOTAL GASTADO
    const totalGastado = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // MOSTRAMOS EL MENSAJE CON EL TOTAL GASTADO
    Swal.fire({
        title: "¡Su compra ha sido realizada!",
        text: `El total gastado es: $${totalGastado.toFixed(2)}.`,
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
            confirmButton: "swal-custom-confirm"
        }
    }).then(() => {
        // VACIAMOS EL CARRITO
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito)); // ACTUALIZAMOS LOCALSTORAGE

        // ACTUALIZAMOS EL CONTADOR Y RENDERIZAMOS EL CARRITO
        actualizarContadorCarrito();
    });
}


// CARGAR INICIAL DE CONTADOR DE ELEMENTOS EN CARRITO
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);

//////FIN GESTION CARRITO

//NECESARIO PARA RECUPERAR EL JSON EN TODAS LAS VISTAS
function obtenerRutaJSON() {
    let rutaBase = "data/huerta_data.json";

    // Si estamos en una subcarpeta (ejemplo: /pages/), ajustar la ruta
    if (window.location.pathname.includes("/pages/")) {
        rutaBase = "../data/huerta_data.json";
    }

    // Para GitHub Pages, usar la URL completa desde la raíz del repositorio
    if (window.location.hostname.includes("github.io")) {
        rutaBase = "https://erikatoranzo15.github.io/Green_House/data/huerta_data.json";
    }

    return rutaBase;
}


// FUNCION PARA BUSCAR PRODUCTOS DESDE EL BUSCADOR DEL NAVBAR
function buscarProducto(event) {
    event.preventDefault(); 

    const inputBusqueda = document.getElementById("txtProductoBuscado").value.trim().toLowerCase();
    
    //CONTROLAMOS QUE HAYA INGRESADO UN VALOR DE BUSQUEDA
    if (inputBusqueda === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Por favor, ingrese un texto a buscar.',
            confirmButtonText: 'Aceptar',
            customClass: {
                confirmButton: "swal-custom-confirm"
            }
        });
        return;
    }

    fetch(obtenerRutaJSON())
        .then(response => response.json())
        .then(datos => {
            const resultados = datos.filter(item => 
                item.nombre.toLowerCase().includes(inputBusqueda) || 
                item.categoria.toLowerCase().includes(inputBusqueda)
            );

            if (resultados.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: `No se encontraron resultados para "${inputBusqueda}".`,
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        confirmButton: "swal-custom-confirm"
                    }
                });
            } else {
                mostrarResultadosBusqueda(resultados);
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al buscar los productos.',
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: "swal-custom-confirm"
                }
            });
        });
}

function mostrarResultadosBusqueda(resultados) {
    let contenidoHTML = '<ul class="list-group">';
    
    resultados.forEach(item => {
        contenidoHTML += `
            <li class="list-group-item">
                <strong>${item.nombre}</strong> <br>
                <small><em>${item.categoria}</em></small> <br>
                ${item.descripcion}
            </li>`;
    });

    contenidoHTML += '</ul>';

    Swal.fire({
        title: 'Resultados de la búsqueda',
        html: contenidoHTML,
        confirmButtonText: 'Cerrar',
        customClass: {
            confirmButton: "swal-custom-confirm"
        }
    });
}


//FUNCION PARA MOSTRAR LA INFORMACION ASOCIADA A UNA CATEGORIA
function mostrarInformacionCategoria(categoriaNombre) {
    // OBTENEMOS INFORMACION DESDE JSON
    fetch('data/categorias.json')
        .then(response => {
            if (!response.ok) {
                //MOSTRAMOS MENSAJE DE ERROR
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al obtener los datos.',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        confirmButton: "swal-custom-confirm"
                    }
                });
            }
            return response.json();
        })
        .then(data => {
            // BUSCAMOS LA CATEGORIA EN EL JSON
            const categoria = data.categorias.find(item => item.nombre.toLowerCase() === categoriaNombre.toLowerCase());

            if (categoria) {
                // GENERAMOS EL CONTENIDO HTML
                let contenidoHTML = `
                    <h5>${categoria.nombre}</h5>
                    <p>${categoria.descripcion}</p>
                    <ul>
                        ${categoria.productos.map(producto => `<li>${producto}</li>`).join("")}
                    </ul>
                `;

                // INSERTAMOS EL CONTENIDO EN EL MODAL
                document.getElementById("infoCategoria").innerHTML = contenidoHTML;

                // MOSTRAMOS EL MODAL
                let modal = new bootstrap.Modal(document.getElementById("modalCategoria"));
                modal.show();
            } else {
                // MENSAJE DE ERROR USANDO SWEETALERT
                Swal.fire({
                    icon: 'error',
                    title: 'Categoría no encontrada',
                    text: 'No se ha encontrado información para la categoría seleccionada.',
                    confirmButtonColor: '#d33'
                });
            }
        })
        .catch(error => {
            // MOSTRAMOS MENSAJE DE ERROR
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al obtener los datos.',
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: "swal-custom-confirm"
                }
            });
        });
}

// FUNCION PARA REGISTRAR SUSCRIPCION DESDE FOOTER
function suscribirseBoletin() {
    Swal.fire({
        title: "Suscripción al Boletín",
        input: "email",
        inputPlaceholder: "Ingresa tu correo electrónico",
        showCancelButton: true,
        confirmButtonText: "Suscribirse",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "swal-custom-confirm"
        },
        preConfirm: (email) => {
            if (!email || !email.includes("@")) {
                Swal.showValidationMessage("Por favor, ingresa un correo electrónico válido.");
            }
            return email;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            //MOSTRAMOS MENSAJE DE EXITO
            Swal.fire({
                title: "¡Gracias por suscribirte!",
                text: `Tu correo es: ${result.value}`,
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: {
                    confirmButton: "swal-custom-confirm"
                }
            });
        }
    });
}
////////GESTION USUARIO LOGUEADO
// FUNCION PARA EL INICIO DE SESION DEL USUARIO
//SE REEMPLAZA POR ALMACENAMIENTO LOCAL
function iniciarSesion() {
    Swal.fire({
        title: "Iniciar Sesión",
        input: "email",
        inputPlaceholder: "Ingresa tu correo electrónico",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "swal-custom-confirm"
        },
        preConfirm: (email) => {
            if (!email || !email.includes("@")) {
                Swal.showValidationMessage("Por favor, ingresa un correo electrónico válido.");
            }
            return email;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            //GUARDAMOS EMAIL INGRESADO LOCALMENTE
            localStorage.setItem("usuario", result.value);
            //ACTUALIZAMOS ICONO Y ACCESO
            actualizarUIUsuario();
            //MOSTRAMOS MENSAJE DE EXITO
            Swal.fire({
                title: "Inicio de sesión exitoso",
                text: `Bienvenido, ${result.value}`,
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: {
                    confirmButton: "swal-custom-confirm"
                }
            });
        }
    });
}

//FUNCION PARA CERRAR SESION DE USUARIO ACTUAL
function cerrarSesion() {
    //DESCARTAMOS DATOS LOCALES
    localStorage.removeItem("usuario");
    //ACTUALIZAMOS ICONO Y ACCESO
    actualizarUIUsuario();
}

//FUNCIION PARA ACTUALIZAR EL ICONO Y ACCESO EN CASO DE LOGIN O DESLOGUEO
function actualizarUIUsuario() {
    const usuario = localStorage.getItem("usuario");
    const iconoUsuario = document.getElementById("iconoUsuario");
    const usuarioDropdown = document.getElementById("usuarioDropdown");
    const nombreUsuario = document.getElementById("nombreUsuario");

    if (usuario) {
        //OCULTAMOS BOTON DE LOGIN
        iconoUsuario.classList.add("d-none");

        //MOSTRAMOS OPCIONES DE USUARIO LOGUEADO
        usuarioDropdown.classList.remove("d-none");
        nombreUsuario.textContent = usuario;
    } else {
        //MOSTRAMOS BOTON DE LOGIN
        iconoUsuario.classList.remove("d-none");

        //OCULTAMOS OPCIONES DE USUARIO LOGUEADO
        usuarioDropdown.classList.add("d-none");
    }
}

//CONTROL INICIAL PARA VERIFICAR SI EXISTE UN USUARIO LOGUEADO
document.addEventListener("DOMContentLoaded", actualizarUIUsuario);

//AVISO NUEVOS PRODUCTOS DISPONIBLES
function notificarNuevosProductos() {
    Toastify({
        text: "¡Nuevos productos disponibles en nuestra tienda!",
        duration: 5000,
        gravity: "bottom",
        position: 'left',
        style: {
            background: "linear-gradient(to right, #5D8A2B, #7AA93C)",
        },
        close: true,
        animate: true,
    }).showToast();
}

//INICIALIZACION TOASTIFY
document.addEventListener("DOMContentLoaded", notificarNuevosProductos);

//GENERACION DE PRODUCTOS DESDE UN ARCHIVO JSON
function cargarProductos() {
    fetch('../data/productos.json')
        .then(response => {
            if (!response.ok) {
                //MOSTRAMOS MENSAJE DE ERROR
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los productos.',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        confirmButton: "swal-custom-confirm"
                    }
                });
            }
            return response.json();
        })
        .then(productos => {
            const contenedorProductos = document.getElementById('productos-container');
            contenedorProductos.innerHTML = ''; // Limpiar antes de cargar

            productos.forEach((producto, index) => {
                const article = document.createElement('article');
                article.className = 'col-12 col-md-6 col-lg-3';
                article.innerHTML = `
                    <div class="card border border-0">
                        <img src="${producto.imagen}" class="w-100 d-block" alt="${producto.descripcion}">
                        <div class="card-body w-100 h-100">
                            <h4 class="mb-3 text-center">${producto.nombre}</h4>
                            <button class="btn text-light border border-0 agregar-carrito" 
                                data-nombre="${producto.nombre}" data-precio="${producto.precio}">
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                `;
                contenedorProductos.appendChild(article);
            });

            // Event listener para todos los botones "Añadir al carrito"
            document.querySelectorAll(".agregar-carrito").forEach(button => {
                button.addEventListener("click", function () {
                    const nombre = this.getAttribute("data-nombre");
                    const precio = parseFloat(this.getAttribute("data-precio"));
                    agregarAlCarrito(nombre, precio);
                });
            });
        })
        .catch(error => {
            //MOSTRAMOS MENSAJE DE ERROR
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al cargar los productos.',
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: "swal-custom-confirm"
                }
            });
        });
}


