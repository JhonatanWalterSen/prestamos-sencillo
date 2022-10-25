let prestamos = [];

window.onload = () =>{
    const datosLocal = localStorage.getItem('Nombre')
    if(datosLocal!==null){
        formOut()
        prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
        aniadirUsuario()
        prestamosRender()
        tituloPrestados()
        buscadorLogeado()
        validarusuario()
    }
    console.log(prestamos);
    console.log(datosLocal);
}

const tituloPrestados = () =>{
    const sec_titulo = document.querySelector('.prestamos_titulo');
    const titulo = document.createElement('h2');
    titulo.classList.add('center','pd-b-25')

    prestamos.length === 0
    ? titulo.textContent = 'Aún no se realizan prestamos'
    : titulo.textContent = 'Préstamos realizados'

    sec_titulo.appendChild(titulo)
}

const formOut = () =>  setTimeout(function() {
    document.getElementById("seccion-prestamista-datos").style = "display: none"
    document.getElementById("prestamos").style = "display: block"
    document.querySelector(".seccion-prestamos").style = "display: block"
}, 100);

const aniadirUsuario= ()=>{
    const nodeLi = document.createElement('li');
        nodeLi.id ="nombrePrestamista";
    const saludo = document.createElement('span'),
        li_span = document.querySelector('.list-a').appendChild(nodeLi);
        li_span.appendChild(saludo),
        datosLocal = localStorage.getItem('Nombre')
    const lia = document.createElement('a')
        lia.innerText = datosLocal;

    document.getElementById('nombrePrestamista').appendChild(saludo).innerText='Hola'
    document.getElementById('nombrePrestamista').appendChild(lia)
}

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
                validarusuario()
                tituloPrestados()
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
        /* buscadorLogeado() */
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
        tituloPrestados()
        borrarClonTitulo()
    }
    borrarPrestamos()
    buscadorPrestamos()
}

function borrarPrestamos(){
    const equis = document.querySelectorAll('.borrarPrestamo')
    equis.forEach( function(element){
        element.addEventListener(`click`,function(){
            swal({
                text: `¿Estas seguro de Eliminar a ${element.parentNode.firstChild.nextSibling.firstChild.nextSibling.innerHTML}?`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    let NuevoPrestamos = prestamos.filter(prestamo => prestamo.id != element.parentNode.id)
                    localStorage.setItem('prestamos', JSON.stringify(NuevoPrestamos));
                    location.reload();
                    swal("Eliminado", {
                        icon: "success",
                    });
                }
            });
        });
    });
}

function borrarClonTitulo(){
    const equis = document.querySelectorAll('.center pd-b-25')
    equis.forEach( function(element){
        console.log(e);
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
    let lineDos = document.querySelector('.lineaDos')
    let lineTres = document.querySelector('.lineaTres')
    hamb.addEventListener('click',()=> {
        nav.classList.toggle('retirar-menu')
        lineOne.classList.toggle('cambio-lineaUno')
        lineDos.classList.toggle('cambio-lineaDos')
        lineTres.classList.toggle('cambio-lineaTres')
    })
}

hamburguerChck()

const mostrarBuscador = () =>{
    const mostrarLook = document.querySelector('.buscador-responsive .span-look')
    mostrarLook.addEventListener('click', () =>{
        let abrir = document.querySelector('.buscador-responsive input.palabra-look')
        abrir.classList.toggle('mostrarbuscador')
    })
}

mostrarBuscador();

const buscadorPrestamos = () =>{
    const resultado = document.querySelector('#PrestamosHechos');
    document.querySelector('#texto-responsive').addEventListener('keyup',()=>{
        let texto = document.querySelector('#texto-responsive').value.toLowerCase(); 
        resultado.innerHTML = ``;
        for (const prestamo of prestamos) {
            let nombre = prestamo.cliente.toLowerCase()
            if (nombre.indexOf(texto) !== -1) {
                resultado.innerHTML += `
                <div id="${prestamo.id}" class="cards cardsprestamos">
                    <div class="fondoTitulo ">
                        <p >${prestamo.cliente}</p>
                        <p>${prestamo.clienteApe}</p>
                    </div>

                    <div class="montoPrestado ">
                        <p >${prestamo.total}</p>
                        <p >TOTAL: ${prestamo.montoConInteres}</p>
                        <p>Interés: ${prestamo.interes} %</p>
                    </div>

                    <div>
                        <p>Cuota por Mes: ${prestamo.cuotasPorMes} </p>
                        <p>Número de Cuotas: ${prestamo.cuotas} </p>
                    </div>
                    <span class ="borrarPrestamo">X</span>
                </div>
            `
            }else{
                resultado.innerHTML + `
                <div class="cards cardsprestamos">
                    <div class="fondoTitulo ">
                        <p>No se encontraton datos</p>
                    </div>
                </div>
            `
            }
        }
        borrarPrestamos()
    })
}

const buscadorLogeado = ()=>{
    document.querySelector('.buscador-responsive').style="display: flex"
}

function validarusuario() {
    if (localStorage.Nombre) {
        let cambiarPaso = document.querySelector('.pasos p')
        cambiarPaso.innerHTML= `<span>Paso 2</span> Crea un Prestamo`
    }
}

