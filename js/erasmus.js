/*global google */

var divAreaExtra
var divPaises
var divCiclos
var listaUbicaciones = []
var map
var listaMarcadores = []
var listaMarcadoresCiclos = []
var bounds

/**
 * Se añaden los listeners a los botones y se hacen las llamadas iniciales para crear zonas, crear el mapa y leer el fichero json.
 */
window.onload = function(){
    var toggle = document.getElementById('toggle')
    toggle.addEventListener('change', toggleSwitch, false)
    var boton = document.getElementById('busca')
    boton.addEventListener('click', realizaBusqueda, false)
    boton.disabled = true
    var botonCheck = document.getElementById('botonCheck')
    botonCheck.addEventListener('click', function(){seleccionaTodo(true)}, false)
    var botonUncheck = document.getElementById('botonUncheck')
    botonUncheck.addEventListener('click', function(){seleccionaTodo(false)}, false)

    creaAreasExtra()
    inicializar_mapa()
    cargaUbicaciones()
}


/**
 * Crea el elemento div donde se mostrarán los checkbox de los ciclos o el combobox de los países.
 */
function creaAreasExtra(){
    divAreaExtra = document.getElementById('divAreaExtra')
    divPaises = creaNodo(null, 'div', 'divPaises')
    divCiclos = creaNodo(null, 'div', 'divCiclos')

    divAreaExtra.style.height = '100px'
    divPaises.style.height = '50px'

    divAreaExtra.appendChild(divCiclos)
}


/**
 * Función que es llamada cuando se pulsa en el toggle. Se cambia el div que se muestra, divPaises o divCiclos.
 */
function toggleSwitch(){
    var toggle = document.getElementById('toggle')

    if (toggle.checked){
        ocultaBotones(false)
        divAreaExtra.style.overflowY  = 'scroll'
        divAreaExtra.replaceChild(divPaises, divAreaExtra.childNodes[0])
    }
    else{
        ocultaBotones(true)
        divAreaExtra.style.overflowY  = 'scroll'
        divAreaExtra.replaceChild(divCiclos, divAreaExtra.childNodes[0])
    }
}


/**
 * Función genérica para crear nodos. Recibe propiedades que puede tener un nodo, o null si no son necesarias.
 * @param {?string} padre 
 * @param {?string} tagNodo 
 * @param {?string} id 
 * @param {?string} texto 
 * @param {?string} tipo 
 * @param {?string} clase 
 * @param {?string} source 
 * @param {?string} valor 
 * @return {Object} nodo Objeto nodo que se ha creado.
 */
function creaNodo(padre, tagNodo, id, texto, tipo, clase, source, valor){
    var nodo = document.createElement(tagNodo)

    if (padre != null)
        padre.appendChild(nodo)
    if (texto != null)
        nodo.textContent = texto
    if (tagNodo == 'input')
        nodo.setAttribute('type', tipo)
    if (id != null)
        nodo.id = id
    if (source != null)
        nodo.setAttribute('src', source)
    if (clase != null)
        nodo.className = clase
    if (valor != null)
        nodo.value = valor
    return nodo
}


/**
 * Inicializa el mapa, centrado en Europa y con un zoom apropiado, dentro del div mapa_div.
 */
function inicializar_mapa(){
    var mapOptions = {
        center: new google.maps.LatLng(48.946313, 5.877168),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        maxZoom: 6
    }
    map = new google.maps.Map(document.getElementById('mapa_div'), mapOptions)
}


/**
 * Clase que representa una ubicación en la que se estuvo de Erasmus y que puede ser representada en el mapa con un marcador.
 * @param {string} tipo El tipo de movilidad (grado medio, grado superior, profesorado o todas).
 * @param {string} ciclo El ciclo que estuvo allí.
 * @param {string} pais El país de la ubicación.
 * @param {string} ciudad La ciudad de la ubicación.
 * @param {string} longitud La longitud en el mapa de la ubicación.
 * @param {string} latitud La latitud en el mapa de la ubicación.
 */
function Ubicacion (tipo, ciclo, pais, ciudad, longitud, latitud){
    this.tipo = tipo
    this.ciclo = ciclo
    this.pais = pais
    this.ciudad = ciudad
    this.longitud = longitud
    this.latitud = latitud
}


/**
 * Se lee el fichero JSON mediante jQuery, y cuando acabe de leerlo, se cargan los paneles para elegir el país o los ciclos y se habilita el botón de búsqueda.
 */
function cargaUbicaciones(){
    $.getJSON('https://aschausson.github.io/erasmusfinder/data/EstructMovilidadesErasmusJSON.json', function(data) {
        
        for (var key in data){
            var ubicacion = new Ubicacion(data[key].tipo, data[key].ciclo, data[key].pais, data[key].ciudad, data[key].longitud, data[key].latitud)
            listaUbicaciones.push(ubicacion) 
        }
    })
        .done(function(){
            cargaPaises()
            cargaCiclos()
            var boton = document.getElementById('busca')
            boton.disabled = false
        })
}


/**
 * Se filtra un array que se recibe, copiando en otro los elementos únicos.
 * @param {*} elemento Array del que se desea eliminar los elementos repetidos.
 * @return {Array.<Object>} elementosUnicos Array similar al que se recibe, pero sin elementos repetidos.
 */
function elementosUnicos(elemento){
    var elementosUnicos = elemento.filter(function(elem, index, self) {
        return index === self.indexOf(elem)
    })
    return elementosUnicos
}
    

/**
 * Se almacenan los países en un array, se ordenan y se eliminan las repeticiones. Por último, se introducen en un combobox.
 */
function cargaPaises(){
    var paises = []

    paises = listaUbicaciones.map( function(elemento){
        return elemento.pais
    })

    paises.sort()
    var paisesUnicos = elementosUnicos(paises)
    var select = creaNodo(divPaises, 'select', 'selectPais')
    paisesUnicos.forEach(function(element){
        creaNodo(select, 'option', null, element, null, null, null, element)
    })
}


/**
 * Se almacenan los ciclos en un array, se ordenan y se eliminan las repeticiones. Por último, se asigna un checkbox a cada uno.
 */
function cargaCiclos(){
    var ciclos = []
    
    ciclos = listaUbicaciones.map( function(elemento){
        return elemento.ciclo
    })
    
    ciclos.sort()
    
    var ciclosUnicos = ciclos.filter(function(elem, index, self) {
        return index === self.indexOf(elem)
    })
    
    ciclosUnicos.forEach(function(element){
        var divCiclo = creaNodo(divCiclos, 'div', null, null, null, 'col-xs-12 col-sm-4 divCiclo')
        var label = creaNodo(divCiclo, 'label', null, element, null, 'labelCiclo')
        var checkbox = creaNodo(null, 'input', null, null, 'checkbox', 'cicloCheck', null, element)
        label.insertBefore(checkbox, label.firstChild)
    }) 
    toggleSwitch()
}


/**
 * Se comprueba si ya hay un marcador en esa posición del mapa, y de devuelve la posición en el array de marcadores.
 * @param {*} location La posición del mapa que se desea comprobar
 * @return {number} i La posición en el array de marcadores.
 */
function marcadorExiste(location){
    for (var i = 0; i < listaMarcadores.length; i++) {
        if((listaMarcadores[i].position.lat() == location.lat()) && (listaMarcadores[i].position.lng() == location.lng())){
            return i
        }
    }
    return -1
}


/**
 * Se emplaza un marcador en un mapa, lugar y con unos datos determinados. Si ya existe un marcador en esa localización, se añaden los datos de los ciclos si no estaban incluidos.
 * @param {*} map El mapa donde se emplaza el marcador.
 * @param {*} location Las coordenadas donde se emplazan el marcador.
 * @param {*} ubicacion El objeto que contiene los datos como la ciudad y los ciclos.
 */
function placeMarker(map, location, ubicacion) {
    var indice = marcadorExiste(location)
    if (indice == -1){
        var marker = new google.maps.Marker({
            position: location,
            map: map
        })
        marker.setAnimation(google.maps.Animation.BOUNCE)
    
        var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng())
        bounds.extend(loc)
    
        listaMarcadores.push(marker)
        listaMarcadoresCiclos.push('<a href="https://es.wikipedia.org/wiki/' + ubicacion.ciudad + '" target="_blank">'+ubicacion.ciudad + '</a><br>' + ubicacion.ciclo) 
    }
    else{
        if (listaMarcadoresCiclos[indice].search(ubicacion.ciclo) == -1)
            listaMarcadoresCiclos[indice] += '<br>' + ubicacion.ciclo
    }
}


/**
 * Añade las ventanas de información a los marcadores almacenados, con la información recopilada, y el listener para que se muestren al hacer click.
 */
function colocaInfoWindows(){
    for (var i = 0; i < listaMarcadores.length; i++) {
        (function () {
            var infowindow = new google.maps.InfoWindow({
                content: listaMarcadoresCiclos[i]
            })
            listaMarcadores[i].addListener('click', function(){ infowindow.open(map,this)}, false)
        }())
    }
}


/**
 * Devuelve el tipo de movilidad seleccionado.
 */
var movilidadSeleccionada = () => (document.getElementById('movilidad').value)


/**
 * Devuelve el país seleccionado.
 */
var paisSeleccionado = () => (document.getElementById('selectPais').value)


/**
 * Busca todos los ciclos con su checkbox activado.
 * @returns {Array.<string>} ciclosCheckeados Array con los nombres de los ciclos seleccionados.
 */
function ciclosSeleccionados(){
    var ciclos = []
    var ciclosCheckeados = []
    ciclos = divCiclos.querySelectorAll('input[type="checkbox"]:checked')
    ciclos.forEach(function(element){ ciclosCheckeados.push(element.value)})
    return ciclosCheckeados
}


/**
 * Oculta o muestra los botones de seleccionar o deseleccionar todo.
 * @param {*} modo True si se quiere mostrar, o false para ocultar.
 */
function ocultaBotones(modo){
    if (modo){
        document.getElementById('botonCheck').style.display = 'block'
        document.getElementById('botonUncheck').style.display = 'block'
    }
    else{
        document.getElementById('botonCheck').style.display = 'none'
        document.getElementById('botonUncheck').style.display = 'none'
    }
}


/**
 * Selecciona o deselecciona todos los checkbox.
 * @param {*} modo True si se quiere seleccionar, o false para deseleccionar.
 */
function seleccionaTodo(modo){
    var cicloCheck = document.getElementsByClassName('cicloCheck')
    for (var i = 0; i < cicloCheck.length; i++) {
        if (modo == true){
            cicloCheck[i].checked = true
        }
        else{
            cicloCheck[i].checked = false
        } 
    }
}


/**
 * Dependiendo del valor del toggle, llama a buscar por países o por ciclos. Si hay resultados, hace que el mapa se adapte a los marcadores y si no muestra un mensaje.
 */
function realizaBusqueda(){
    var toggle = document.getElementById('toggle')
    bounds  = new google.maps.LatLngBounds()
    map.clearOverlays()

    if (toggle.checked){    //paises
        realizaBusquedaPaises()
    }
    else{   //ciclos
        realizaBusquedaCiclos()
    }
    if (listaMarcadores.length > 0){
        colocaInfoWindows()
        map.fitBounds(bounds)
        map.panToBounds(bounds)
    }
    else{
        alert('No existen elementos que coincidan con los criterios de búsqueda.')
    }
}


/**
 * Filtra las ubicaciones por los países seleccionados y el tipo de movilidad.
 */
function realizaBusquedaPaises(){
    var listaPaises = []
    var listaPaisesFiltrados = []
    listaPaises = listaUbicaciones.slice(0)

    var movilidad = movilidadSeleccionada()
    var pais = paisSeleccionado()
    
    if (movilidad != 'todos'){
        listaPaisesFiltrados = listaPaises.filter(function(elem){
            if ((elem.tipo == movilidad) && (elem.pais == pais))
                return elem
        })
    }
    else{
        listaPaisesFiltrados = listaPaises.filter(function(elem){
            if (elem.pais == pais)
                return elem
        })
    }

    listaPaisesFiltrados.forEach(function(element){
        var localizacion = new google.maps.LatLng(element.longitud, element.latitud)
        placeMarker(map, localizacion, element)
    })
}


/**
 * Filtra las ubicaciones por los ciclos seleccionados y el tipo de movilidad.
 */
function realizaBusquedaCiclos(){
    var listaCiclos = []
    var listaCiclosFiltrados = []
    var movilidad = movilidadSeleccionada()
    listaCiclos = listaUbicaciones.slice(0)

    movilidad = movilidadSeleccionada()
    var ciclos = []
    ciclos = ciclosSeleccionados()
    
    if (movilidad != 'todos'){
        listaCiclosFiltrados = listaCiclos.filter(function(elem){
            if ((elem.tipo == movilidad) && (ciclos.indexOf(elem.ciclo) != -1))
                return elem
        })
    }
    else{
        listaCiclosFiltrados = listaCiclos.filter(function(elem){
            if (ciclos.indexOf(elem.ciclo) != -1)
                return elem
        })
    }

    listaCiclosFiltrados.forEach(function(element){
        var localizacion = new google.maps.LatLng(element.longitud, element.latitud)
        placeMarker(map, localizacion, element)
    }) 
}


/**
 * Limpia el mapa de todos los marcadores
 */
google.maps.Map.prototype.clearOverlays = function(){
    for (var i = 0; i < listaMarcadores.length; i++) {
        listaMarcadores[i].setMap(null)
    }
    listaMarcadores.length = 0
    listaMarcadoresCiclos.length = 0
}

