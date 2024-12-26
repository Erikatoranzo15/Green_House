///////GESTION DEL CARRITO

// LISTA DE ELEMENTO EN CARRITO
let carrito = [];

// FUNCION PARA AGREGAR NUEVOS ELEMENTOS AL CARRITO DESDE LA SECCION DE PRODUCTOS
function agregarAlCarrito(producto) {
    //VERIFICAMOS SI EL CARRITO YA TIENE ESE ELEMENTO
    const index = carrito.findIndex(item => item.nombre === producto);

    if (index !== -1) {
        //SI EL ELEMENTO EXISTE SOLO AUMENTAMOS SU CANTIDAD
        carrito[index].cantidad++;
        // MOSTRAMOS MENSAJE DE EXITO
        alert(`${producto} ahora tiene ${carrito[index].cantidad} unidades en el carrito.`);
    } else {
        //SI EL ELEMENTO NO EXISTE EN EL CARRITO LO AGREGAMOS
        carrito.push({ nombre: producto, cantidad: 1 });
        // MOSTRAMOS MENSAJE DE EXITO
        alert(`${producto} ha sido añadido al carrito.`);
    }

    // ACTUALIZAMOS EL CONTADOR DEL CARRITO
    actualizarContadorCarrito();
}

// FUNCION PARA ACTUALIZAR LA CANTIDAD DE ELEMENTOS EN EL CARRITO
function actualizarContadorCarrito() {
    const contador = carrito.length;

    // ACTUALIZAMOS CONTADOR DE ELEMENTOS DEL CARRITO
    const badge = document.querySelector('.custom-badge');
    if (badge) {
        badge.textContent = contador;
    }
}

// FUNCION PARA VER LA LISTA DE ELEMENTOS EN EL CARRITO
function verCarrito() {
    //CONTROLAMOS SI HAY ELEMENTOS EN EL CARRITO
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
    } else {
        let mensaje = "Productos en tu carrito:\n";
        //RECORREMOS LA LISTA DE ELEMENTOS DEL CARRITO
        carrito.forEach((producto, index) => {
            mensaje += `${index + 1}. ${producto.nombre} - ${producto.cantidad} unidad${producto.cantidad > 1 ? "es" : ""}\n`;
        });
        mensaje += "\nEscribe el número del producto que deseas eliminar o 'Cancelar' para salir.";

        const opcion = prompt(mensaje);

        if (opcion && opcion.toLowerCase() !== 'cancelar') {
            const productoIndex = parseInt(opcion) - 1;
            if (productoIndex >= 0 && productoIndex < carrito.length) {
                //DESCARTAMOS EL ELEMENTO DEL CARRITO
                eliminarDelCarrito(carrito[productoIndex].nombre); 
            } else {
                alert("Opción no válida.");
            }
        }
    }
}

// FUNCION PARA ELIMINAR UN ELEMENTO EN ESPECIFICO DEL CARRITO
function eliminarDelCarrito(nombreProducto) {
    //CONTROLAMOS SI EFECTIVAMENTE EL ELEMENTO ESTA EN EL CARRITO
    const index = carrito.findIndex(item => item.nombre === nombreProducto);

    if (index !== -1) {
        const producto = carrito[index];

        if (producto.cantidad > 1) {
            //SI HAY MAS DE UNA UNIDAD SOLO RESTAMOS UNA
            producto.cantidad--;
            alert(`${producto.nombre} ahora tiene ${producto.cantidad} unidad${producto.cantidad > 1 ? "es" : ""} en el carrito.`);
        } else {
            //SI SOLO TIENE UNA UNIDAD LO DESCARTAMOS POR COMPLETO
            carrito.splice(index, 1);
            alert(`${producto.nombre} ha sido eliminado del carrito.`);
        }

        //  ACTUALIZAMOS CONTADOR DE ELEMENTOS DEL CARRITO
        actualizarContadorCarrito();
    } else {
        // SINO ESTA NO SE PUEDE ELIMINAR
        alert(`El producto "${nombreProducto}" no está en el carrito.`);
    }
}

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

function mostrarInformacionCategoria(categoriaNombre) {
    // DADA UNA CATEGORIA SELECCIONADA BUSCAMOS LA INFORMACION ASOCIADA EN EL ARRAY
    const categoria = categorias.find(item => item.nombre.toLowerCase() === categoriaNombre.toLowerCase());

    if (categoria) {
        // SI EL ELEMENTO BUSCADO EXISTE MOSTRAMOS SU INFORMACION
        let mensaje = `Información sobre ${categoria.nombre}:\n\n`;
        mensaje += `${categoria.descripcion}\n\n`;
        mensaje += "Productos disponibles:\n";
        categoria.productos.forEach((producto, index) => {
            mensaje += `${index + 1}. ${producto}\n`;
        });
        
        alert(mensaje);
    } else {
        // SI EL ELEMENTO BUSCADO NO EXISTE AVISAMOS QUE NO HAY INFORMACION
        alert("Categoría no encontrada.");
    }
}


// FUNCION PARA REGISTRAR SUSCRIPCION DESDE FOOTER
function suscribirseBoletin() {
    const email = prompt("Ingresa tu correo electrónico para suscribirte:");
    if (email && email.includes("@")) {
        alert(`¡Gracias por suscribirte, ${email}!`);
    } else {
        alert("Por favor, ingresa un correo electrónico válido.");
    }
}

// FUNCION PARA EL INICIO DE SESION DEL USUARIO
function iniciarSesion() {
    const email = prompt("Por favor, ingresa tu correo electrónico para iniciar sesión:");

    if (email) {
        // MOSTRAMOS MENSAJE DE EXITO
        alert(`¡Bienvenido, ${email}! Has iniciado sesión correctamente.`);
    } else {
        // MOSTRAMOS MENSAJE DE ERROR
        alert("No has ingresado un correo electrónico.");
    }
}