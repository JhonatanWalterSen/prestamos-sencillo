const datosPrestamista = []
const prestamos = []
const consultaPrestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
const btnAniadirDatos = document.getElementById('aniadir')
const btnPrestamo = document.getElementById('prestamo')
const formularioPrestamos = document.querySelector('#prestamos')
const formularioPrestamista = document.querySelector('#seccion-prestamista-datos')
const divPrestamos = document.getElementById('PrestamosHechos')

btnAniadirDatos.addEventListener('click',obtenerDatosPrestamista)
btnPrestamo.addEventListener('click',obtenerDatosPrestamo)

function obtenerDatosPrestamista() {
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const email = document.getElementById('email').value;
    const tel = document.getElementById('tel').value;

    if (nombres === ''){
        return swal("","Falta Agregar el Nombre", "warning")
    }
    if (apellidos ===''){
        return swal("","Falta Agregar el Apellido", "warning")
    }
    if (email ===''){
        return swal("","Falta Agregar el Correo Electrónico", "warning")
    }
    if (tel ===''){
        return swal("","Falta Agregar el Teléfono", "warning")
    }
    swal(""+nombres , "Bienvenid@", "success");
    const datosPersonales ={
        nombres,
        apellidos,
        email,
        tel
    }
    datosPrestamista.push(datosPersonales)
    localStorage.setItem("prestamista", JSON.stringify(datosPrestamista)) ?? []
    cambioTexto()
}

function obtenerDatosPrestamo (){
    let clienteNombre = document.getElementById('clienteNombre').value;
    let clienteApellidos = document.getElementById('clienteApellidos').value;
    let telf = document.getElementById('telf').value;
    let montoTotal = parseInt(document.getElementById('montoTotal').value);
    let interes = parseInt(document.getElementById('interes').value);
    let cuotas = parseInt(document.getElementById('cuotas').value);
    let montoConInteres = Math.floor(((montoTotal*interes)/100)+montoTotal);
    let cuotasPorMes = montoConInteres / cuotas;

    if (clienteNombre === ''){
        return swal("","Falta Agregar el Nombre del cliente", "error")
    }
    if (clienteApellidos ===''){
        return swal("","Falta Agregar el Apellido del cliente", "error")
    }
    if (telf ===''){
        return swal("","Falta Agregar el Número telefónico", "error")
    }
    if (isNaN(montoTotal)){
        return swal("","Falta Agregar Cantidad a prestar", "error")
    }
    if (isNaN(interes)){
        return swal("","Falta Agregar el Porcentaje de interés", "error")
    }
    if (isNaN(cuotas)){
        return swal("","Falta Agregar la cantidad de cuotas", "error")
    }
    if(cuotas > 60){
        return swal("","Máximo hasta 60 Cuotas", "error")
    }
    if(interes > 80){
        return swal("","El Interés no puede superar el 80%", "error")
    }
    swal("Préstamo Almacenado", "", "success");
    limpiarCampos()
    const prestamoObj = {
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
    consultaPrestamos.push(prestamoObj)
    localStorage.setItem("prestamos", JSON.stringify(consultaPrestamos)) ?? []
    mostrarPrestamos()
}

const limpiarCampos = () =>{
    let campos = document.querySelectorAll('#prestamos div input')
    for (const camposCliente of campos) {
        camposCliente.value = "";
    }
}

function agregarPrestamista() {
    const info = JSON.parse(localStorage.getItem('prestamista'));
    if (info === null) {
        console.log('no hay datos');
    } else {
        cambioTexto()
    }
}

agregarPrestamista()

function mostrarPrestamos(){
    if(consultaPrestamos.length > 0){
        let html ="";
        consultaPrestamos.forEach(prestamo =>{
            const {cliente,interes,clienteApe,id,cuotas,cuotasPorMes,montoConInteres,total} = prestamo;
            html +=`
            <div id="${id}"  class="cards cardsprestamos">
                <div class="fondoTitulo ">
                    <p>${cliente}</p>
                    <p>${clienteApe}</p>
                </div>

                <div class="montoPrestado ">
                    <p>${total}</p>
                    <p>TOTAL: ${montoConInteres}</p>
                    <p>Interés: ${interes} %</p>
                </div>

                <div>
                    <p>Cuota por Mes: ${cuotasPorMes} </p>
                    <p>Número de Cuotas: ${cuotas} </p>
                </div>
                <span class ="borrarPrestamo">x</span>
            </div>
        `
        })
        divPrestamos.innerHTML=html;
    }
    mostrarBuscador()
    borrarPrestamos()
}


function mostrarBuscador() {
    if (consultaPrestamos.length>2) {
        document.querySelector('.buscador-responsive').style="display: flex"
    }
}


function cambioTexto() {
    formularioPrestamos.classList.remove('hidden')
    formularioPrestamista.classList.add('hidden')
    let cambiarPaso = document.querySelector('.pasos p')
    cambiarPaso.innerHTML= `<span>Paso 2</span> Crea un Prestamo`

    const li_span = document.querySelector('.list-a');
    const cerrarLi = document.createElement('li')
    const LiACerrar = document.createElement('a')
    cerrarLi.id ="cerrar-sesion";
    cerrarLi.style="cursor: pointer"
    LiACerrar.textContent='Cerrar sesión'
    LiACerrar.classList.add('rojo')
    cerrarLi.appendChild(LiACerrar)
    li_span.appendChild(cerrarLi)

    const nodeLi = document.createElement('li');
    nodeLi.id ="nombrePrestamista";
    const saludo = document.createElement('span')
    li_span.appendChild(nodeLi)
    li_span.appendChild(saludo),
    datosLocal = JSON.parse(localStorage.getItem('prestamista'))[0].nombres
    const lia = document.createElement('a')
    lia.innerText = datosLocal;

    document.getElementById('nombrePrestamista').appendChild(saludo).innerText='Hola'
    document.getElementById('nombrePrestamista').appendChild(lia)
    document.querySelector(".seccion-prestamos").style = "display: block"

    mostrarPrestamos()
    eliminarStorage()
}

function eliminarStorage() {
    const elminarStorage = document.querySelector('#cerrar-sesion')
    elminarStorage.addEventListener(`click`,()=>{
        swal({
            text: `¿Estas seguro de Eliminar a toda tu informmación?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                swal("Eliminado", {
                    icon: "success",
                });
                location.reload();
                localStorage.clear()
            }
        });
    });
}

function borrarPrestamos(){
    const btnBorrar = document.querySelectorAll('.borrarPrestamo')
    btnBorrar.forEach( (e)=>{
        e.addEventListener(`click`,()=>{
            swal({
                text: `¿Estas seguro de Eliminar a ${e.parentNode.firstChild.nextSibling.firstChild.nextSibling.innerHTML}?`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    let NuevoPrestamos = consultaPrestamos.filter(pres => pres.id != e.parentNode.id)
                    localStorage.setItem("prestamos", JSON.stringify(NuevoPrestamos))
                    divPrestamos.removeChild(e.parentElement)
                    swal("Eliminado", {
                        icon: "success",
                    });
                }
            });
        });
    });
}
borrarPrestamos()


function buscadorPrestamos(){
    document.addEventListener('keyup',e =>{
        if (e.target.matches('#texto-responsive')) {
            if (e.key === 'Escape')e.target.value=''
            document.querySelectorAll('.cards').forEach(prestamo =>{
                prestamo.textContent.toLowerCase().includes(e.target.value.toLowerCase())
                ? prestamo.classList.remove('filtro')
                : prestamo.classList.add('filtro')
            })
        }
    })
}
buscadorPrestamos()


/* Extras a la funcionalidad */

const menuHamburguesa = () =>{
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

menuHamburguesa()

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

const abrirBuscador = () =>{
    const mostrarLook = document.querySelector('.buscador-responsive .span-look')
    mostrarLook.addEventListener('click', () =>{
        let abrir = document.querySelector('.buscador-responsive input.palabra-look')
        abrir.classList.toggle('mostrarbuscador')
    })
}

abrirBuscador();