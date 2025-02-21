///////GESTION DEL CARRITO

// LISTA DE ELEMENTOS EN CARRITO CONTEMPLANDO AHORA QUE SE MANTIENEN LOCALMENTE
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// FUNCION PARA GUARDAR EL CARRITO EN LOCALSTORAGE
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// FUNCION PARA AGREGAR NUEVOS ELEMENTOS AL CARRITO DESDE LA SECCION DE PRODUCTOS
function agregarAlCarrito(producto) {
    // VERIFICAMOS SI EL CARRITO YA TIENE ESE ELEMENTO
    const index = carrito.findIndex(item => item.nombre === producto);

    if (index !== -1) {
        // SI EL ELEMENTO EXISTE SOLO AUMENTAMOS SU CANTIDAD
        carrito[index].cantidad++;
        alert(`${producto} ahora tiene ${carrito[index].cantidad} unidades en el carrito.`);
    } else {
        // SI EL ELEMENTO NO EXISTE EN EL CARRITO, LO AGREGAMOS
        carrito.push({ nombre: producto, cantidad: 1 });
        alert(`${producto} ha sido añadido al carrito.`);
    }

    // GUARDAMOS EN LOCALSTORAGE
    guardarCarrito();

    // ACTUALIZAMOS EL CONTADOR DEL CARRITO
    actualizarContadorCarrito();
}

// FUNCION PARA ACTUALIZAR LA CANTIDAD DE ELEMENTOS EN EL CARRITO
function actualizarContadorCarrito() {
    const contador = carrito.reduce((total, item) => total + item.cantidad, 0);

    // ACTUALIZAMOS CONTADOR DE ELEMENTOS DEL CARRITO
    document.querySelector(".custom-badge").textContent = carrito.length;
}

// FUNCION PARA VER LA LISTA DE ELEMENTOS EN EL CARRITO
function verCarrito() {
    // CONTROLAMOS SI HAY ELEMENTOS EN EL CARRITO
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
    } else {
        let mensaje = "Productos en tu carrito:\n";
        carrito.forEach((producto, index) => {
            mensaje += `${index + 1}. ${producto.nombre} - ${producto.cantidad} unidad${producto.cantidad > 1 ? "es" : ""}\n`;
        });

        mensaje += "\nEscribe el número del producto que deseas eliminar o 'Cancelar' para salir.";
        const opcion = prompt(mensaje);

        if (opcion && opcion.toLowerCase() !== 'cancelar') {
            const productoIndex = parseInt(opcion) - 1;
            if (productoIndex >= 0 && productoIndex < carrito.length) {
                eliminarDelCarrito(carrito[productoIndex].nombre);
            } else {
                alert("Opción no válida.");
            }
        }
    }
}

// FUNCION PARA ELIMINAR UN ELEMENTO EN ESPECIFICO DEL CARRITO
function eliminarDelCarrito(nombreProducto) {
    const index = carrito.findIndex(item => item.nombre === nombreProducto);

    if (index !== -1) {
        const producto = carrito[index];

        if (producto.cantidad > 1) {
            // SI HAY MAS DE UNA UNIDAD SOLO RESTAMOS UNA
            producto.cantidad--;
            alert(`${producto.nombre} ahora tiene ${producto.cantidad} unidad${producto.cantidad > 1 ? "es" : ""} en el carrito.`);
        } else {
            // SI SOLO TIENE UNA UNIDAD, LO ELIMINAMOS
            carrito.splice(index, 1);
            alert(`${producto.nombre} ha sido eliminado del carrito.`);
        }

        // GUARDAMOS EN LOCALSTORAGE
        guardarCarrito();

        // ACTUALIZAMOS EL CONTADOR DEL CARRITO
        actualizarContadorCarrito();
    } else {
        //SINO ESTA NO SE PUEDE ELIMINAR
        alert(`El producto "${nombreProducto}" no está en el carrito.`);
    }
}

// CARGAR INICIAL DE CONTADOR DE ELEMENTOS EN CARRITO
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);

//////FIN GESTION CARRITO

// FUNCION PARA BUSCAR PRODUCTOS DESDE EL BUSCADOR DEL NAVBAR
function buscarProducto() {
    const producto = prompt("¿Qué producto estás buscando? (Ej: Semillas, Sustratos, Fertilizantes)");

    if (producto) {
        switch (producto.toLowerCase()) {
            case "semillas":
                alert("Te redirigiremos a la sección de Semillas.");
                break;
            case "sustratos":
                alert("Te redirigiremos a la sección de Sustratos.");
                break;
            case "fertilizantes":
                alert("Te redirigiremos a la sección de Fertilizantes.");
                break;
            default:
                alert("No hay resultados para la búsqueda realizada.");
        }
    } else {
        alert("No ingresaste ningún producto.");
    }
}

//INICIALIZACION DE INFORMACION DE LAS CATEGORIAS DEL HOME
const categorias = [
    {
        nombre: "Semillas",
        descripcion: "Las semillas son el inicio de un jardín próspero. Ofrecemos una variedad de semillas de hortalizas, flores y plantas aromáticas para que puedas cultivar lo que más te guste.",
        productos: [
            "Semillas de tomate",
            "Semillas de lechuga",
            "Semillas de albahaca"
        ]
    },
    {
        nombre: "Sustratos",
        descripcion: "El sustrato es fundamental para el crecimiento de tus plantas. Contamos con diferentes tipos de sustratos orgánicos y minerales para todo tipo de plantas.",
        productos: [
            "Sustrato para cactus",
            "Sustrato para huertas",
            "Sustrato para orquídeas"
        ]
    },
    {
        nombre: "Fertilizantes",
        descripcion: "Los fertilizantes aportan los nutrientes necesarios para el crecimiento óptimo de tus plantas. Descubre nuestra selección de fertilizantes orgánicos y químicos.",
        productos: [
            "Fertilizante líquido orgánico",
            "Fertilizante para tomates",
            "Fertilizante de liberación controlada"
        ]
    },
    {
        nombre: "Control de Plagas",
        descripcion: "Protege tus plantas de plagas y enfermedades con nuestros productos especializados en control biológico y químico para cada tipo de cultivo.",
        productos: [
            "Insecticida natural",
            "Pesticida para hongos",
            "Trampa para mosquitos"
        ]
    }
];

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
    fetch('data/productos.json')
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
            productos.forEach(producto => {
                const article = document.createElement('article');
                article.className = 'col-12 col-md-6 col-lg-3';
                article.innerHTML = `
                    <div class="card border border-0">
                        <img src="${producto.imagen}" class="w-100 d-block" alt="${producto.descripcion}">
                        <div class="card-body w-100 h-100">
                            <h4 class="mb-3 text-center">${producto.nombre}</h4>
                            <button onclick="agregarAlCarrito('${producto.nombre}')" class="btn text-light border border-0">Añadir al carrito</button>
                        </div>
                    </div>
                `;
                contenedorProductos.appendChild(article);
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                text: 'Hubo un problema al cargar los productos.',
                text: error,
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: "swal-custom-confirm"
                }
            });
        });
}

