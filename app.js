

const productos = document.querySelector("#productos")
const elegidos = document.querySelector ("#carrito")
const shop = document.querySelector("#shop")
const pagos = document.querySelector("#pagos")
let carrito = [];



/* Traigo del archivo data.json el array con los productos en venta y los pinto en pantalla */
fetch("./data.json") 
.then ((res) => res.json())
.then ((data) =>{
    data.forEach(producto => {
        const contenedor = document.createElement("div")
        contenedor.innerHTML = `
        <img src="${producto.img}" style="max-width: 100px">
        <h5> Nombre del producto: ${producto.nombre}</h5>
        <h3> Codigo de identificacion: ${producto.id}</h3>
        <p> Precio del producto: ${producto.precio}</p>
        <button href="#" class="" onClick="eliminarDelCarrito(${producto.id})">Eliminar del carrito</button>
        <button href="#" class="" onClick="agregarAlcarrito(${producto.id})">Agregar al carrito</button>`
        productos.append(contenedor);
    })
})


/* Agrego otro objeto al carrito o sumo 1 a su contador */
const agregarAlcarrito = async (indice) =>{
    fetch("./data.json")
    .then((res) => res.json())
    .then((data)=>{
        /* recorro el array "carrito" y retorno si el indice ya esta siendo utilizado o no */
        const buscado =carrito.findIndex((encontrar) =>{
            return encontrar.id === data[indice].id
        })
        /* Si no lo esta voy a pushear un nuevo objeto */
        if (buscado === -1){
            seleccionado = data[indice]
            seleccionado.cant = 1
            carrito.push(seleccionado) 
        /* De estarlo solo voy a buscar la posicion dentro del array y voy a sumar 1 a su contador */
        }else{
            carrito[buscado].cant += 1;
        }
        /* Actualizo cambios en la memoria, en el html y en los calculos */
        carritoJSON = JSON.stringify(carrito);
        localStorage.setItem("cart", carritoJSON);
        console.log(JSON.parse(carritoJSON))
        pintarCarrito()
        actualizarTotal()
    })
}
/* Misma funcion que el segmento anterior pero en esta busco eliminar */
const eliminarDelCarrito = async (indice) => {
    fetch("/data.json")
    .then((res) => res.json())
    .then((data)=>{
        const buscado =carrito.findIndex((encontrar) =>{
            console.log(data)
            return encontrar.id === data[indice].id
        })
        if (buscado === -1){
            alert("No se ha encontrado el producto seleccionado")
        }else if(carrito[buscado].cant > 0){
            carrito[buscado].cant -= 1;
        }
        carritoJSON = JSON.stringify(carrito);
        localStorage.setItem("cart", carritoJSON);
        pintarCarrito()
        actualizarTotal()
    })
} 

/* Pinto el carrito en el html */
const pintarCarrito =() =>{
    if (carrito.length > 0){
        elegidos.innerHTML =""
        for (let i =0; i < carrito.length; i++){
            contenedor = document.createElement("div")
            contenedor.innerHTML = `
            <h2>${carrito[i].nombre}</h2>
            <h3>${carrito[i].precio}</h3>
            <p>${carrito[i].cant}</p>
            <button href="#" class="" onClick="eliminarCarrito()">Eliminar carrito</button`
            elegidos.append(contenedor)
        }
    }
}



let total = 0;

const actualizarTotal = () =>{
    total = 0
    carrito.forEach(producto =>{
        total += producto.precio * producto.cant
    })
    totalJSON =JSON.stringify(total)
    localStorage.setItem("total", totalJSON)
    pintarTotal()
}

const pintarTotal =() =>{
    shop.innerHTML=""
    contenedorTotal = document.createElement("div")
    contenedorTotal.innerHTML =`
    <h2>${JSON.parse(total)}</h2>
    <button onClick="finalizar()">Finalizar compra</button>
    `
    shop.append(contenedorTotal)
}

const finalizar = async () =>{
    pagos.innerHTML =""
    let contenedorFormasPago = document.createElement("div")
    contenedorFormasPago.innerHTML = `
    <h2>Elige la forma de pago</h2>
    <button onClick="calcularPago(1)"> Efectivo</button>
    <button onClick="calcularPago(3)"> 3 cuotas</button>
    <button onClick="calcularPago(6)"> 6 cuotas</button>`
    pagos.append(contenedorFormasPago)
}

const calcularPago = async (cuotas) =>{
    cuotasJSON = JSON.stringify(cuotas)
    localStorage.setItem("cuotas", cuotasJSON)
    switch (cuotas){
        case 1:
            alert(`Usted debera abonar $${JSON.parse(total)}`)
            break;
        case 3:
            cuotasJSON = JSON.stringify(cuotas)
            alert(`Usted debera abonar 3 cuotas de: $${(JSON.parse(total)+(JSON.parse(total)*0.15))/3} por un total de $${(JSON.parse(total)+(JSON.parse(total)*0.15))}`)
            break;
        case 6:
            alert(`Usted debera abonar 3 cuotas de: $${(JSON.parse(total)+(JSON.parse(total)*0.3))/6} por un total de $${(JSON.parse(total)+(JSON.parse(total)*0.3))}`)
            break;
    }
}



const eliminarCarrito = async () =>{
    swal({
        title: "Estas seguro de que quieres eliminar el carrito?",
        text: "Una vez eliminado deberas volver a elegir los productos",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
    if (willDelete) {
        elegidos.innerHTML =""
        carrito = [];
        carritoJSON = JSON.stringify(carrito);
        localStorage.setItem ("cart", carritoJSON)
        actualizarTotal("agregar")
        swal("El carrito ha sido eliminado", {
            icon: "success",
    });
    } else {            
        swal("Sigue comprando ");
        }
    });
    
    
}
