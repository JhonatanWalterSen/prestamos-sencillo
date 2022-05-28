let prestamos = [];


window.onload = () =>{
    const datosLocal = localStorage.getItem('Nombre')
    if(datosLocal===null){
        console.error('No hay datos del Prestamista'); 
    } else{
        console.warn('Si hay datos del Prestamista');  
        formOut()
        prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
        console.log(prestamos)
        aniadirUsuario()
        prestamosRender()
    }
}

const formOut = () =>  setTimeout(function() {
    document.getElementById("seccion-prestamista-datos").style = "display: none"
    document.getElementById("prestamos").style = "display: block"
    document.querySelector(".seccion-prestamos").style = "display: block"
}, 1200);

const aniadirUsuario= ()=>{
    const saludo = document.createElement('span')
    const datosLocal = localStorage.getItem('Nombre')
    const lia = document.createElement('a')
    lia.innerText =datosLocal;
    document.getElementById('nombrePrestamista').appendChild(saludo).innerText='Hola'
    document.getElementById('nombrePrestamista').appendChild(lia)
}

// Datos personales
const aniadirDatos = () =>{
    let datos = document.getElementById('aniadir')

    datos.addEventListener('click',() => {
        const nombres = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const email = document.getElementById('email').value;
        const tel = document.getElementById('tel').value;
        if (nombres === ''){
            swal("","Falta Agregar el Nombre", "warning")
        } else if (apellidos ===''){
            swal("","Falta Agregar el Apellido", "warning")
        } else if (email ===''){
            swal("","Falta Agregar el Correo Electrónico", "warning")
        } else if (tel ===''){
            swal("","Falta Agregar el Teléfono", "warning")
        } else {
            swal(""+nombres , "Bienvenid@", "success");
            localStorage.getItem(nombres,apellidos,email)
                localStorage.setItem('Nombre',nombres)
                localStorage.setItem('Apellidos',apellidos)
                localStorage.setItem('Correo',email)
                localStorage.setItem('telefono',tel)
                formOut() 
                aniadirUsuario()
        }       
    })
}
aniadirDatos();

//Datos para el prestamo
const aniadirDatosPrestamo = () =>{
    const btnPrestamo = document.getElementById('prestamo')

            btnPrestamo.addEventListener('click',(e)=>{
                e.preventDefault();
                let clienteNombre = document.getElementById('clienteNombre').value;
                let clienteApellidos = document.getElementById('clienteApellidos').value;
                let telf = document.getElementById('telf').value;
                let montoTotal = parseInt(document.getElementById('montoTotal').value);
                let interes = parseInt(document.getElementById('interes').value);
                let cuotas = parseInt(document.getElementById('cuotas').value);
                let montoConInteres = Math.floor(((montoTotal*interes)/100)+montoTotal);
                let cuotasPorMes = montoConInteres / cuotas;
                if (clienteNombre === ''){
                    swal("","Falta Agregar el Nombre del cliente", "error")
                } else if (clienteApellidos ===''){
                    swal("","Falta Agregar el Apellido del cliente", "error")
                } else if (telf ===''){
                    swal("","Falta Agregar el Número telefónico", "error")
                } else if (isNaN(montoTotal)){
                    swal("","Falta Agregar Cantidad a prestar", "error")
                } else if (isNaN(interes)){
                    swal("","Falta Agregar el Porcentaje de interés", "error")
                } else if (isNaN(cuotas)){
                    swal("","Falta Agregar la cantidad de cuotas", "error")
                } else if(cuotas > 60){
                    swal("","Máximo hasta 60 Cuotas", "error")
                } else if(interes > 80){
                    swal("","El Interés no puede superar el 80%", "error")
                } else{
                    swal("Préstamo Almacenado", "", "success");
                const prestamoObj ={
                    id: Date.now(),
                    cliente : clienteNombre,
                    clienteApe: clienteApellidos,
                    tel: telf,
                    total: montoTotal,
                    interes,
                    cuotas,
                    montoConInteres: montoConInteres.toFixed(2),
                    cuotasPorMes: cuotasPorMes.toFixed(2)
                }
                prestamos.push(prestamoObj)
                localStorage.setItem("prestamos", JSON.stringify(prestamos))
                limpiarCampos();
                prestamosRender()
                }
            })
}

aniadirDatosPrestamo()

const limpiarCampos = () =>{
    let campos = document.querySelectorAll('#prestamos div input')
    for (const camposCliente of campos) {
        camposCliente.value = "";
    }
}


const prestamosRender = () =>{


    if(prestamos.length > 0){
        
    const divDatos = document.getElementById('PrestamosHechos')
        let html ="";
        prestamos.forEach(prestamo =>{
            const {cliente,interes,clienteApe,id,cuotas,cuotasPorMes,montoConInteres,tel,total} = prestamo;
            html +=`
            <div id="${id}" class="cards cardsprestamos">
                <div class="fondoTitulo ">
                    <p >${cliente}</p>
                    <p>${clienteApe}</p>
                </div>

                <div class="montoPrestado ">
                    <p >${total}</p>
                    <p >TOTAL: ${montoConInteres}</p>
                    <p>Interés: ${interes} %</p>
                </div>

                <div>
                    <p>Cuota por Mes: ${cuotasPorMes} </p>
                    <p>Número de Cuotas: ${cuotas} </p>
                </div>
                <span class ="borrarPrestamo">X</span>
            </div>
        `
        }) 
        divDatos.innerHTML=html;
    }
    /* console.log(prestamos); */
    
    borrarPrestamos()
    
}

function borrarPrestamos(){

    const equis = document.querySelectorAll('.borrarPrestamo')  
    /* swal("¿Estás seguro de borrar?", {
        buttons: ["No", true],
    }); */
    equis.forEach( function(element,index,value){
        element.addEventListener(`click`,function(){

            console.log(element.parentNode.id);
            let NuevoPrestamos = prestamos.filter(prestamo => prestamo.id != element.parentNode.id)
            console.log("Nuevo Objeto Prestamos",NuevoPrestamos);
            localStorage.setItem('prestamos', JSON.stringify(NuevoPrestamos)); 
            if (NuevoPrestamos.length < prestamos.length) {
                console.log(true);
                location.reload()
            } else{
                console.log(false);
                console.log(NuevoPrestamos.length);
                console.log(prestamos.length);
            }
        });
    });
}

$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        lazyLoad:true,
        autoplay: true,
        autoplayTimeout: 3000,
        center: false,
        dots: true,
        margin: 5
    })
});

const hamburguerChck = () =>{
    let hamb = document.querySelector('.menu-boton')
    let nav = document.querySelector('nav')
    let lineOne = document.querySelector('.lineaUno')
    hamb.addEventListener('click',()=> {
        nav.classList.toggle('retirar-menu')
        lineOne.classList.toggle('cambio-lineaUno')
    })
}

hamburguerChck()