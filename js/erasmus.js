
var divAreaExtra
var divPaises
var divCiclos

window.onload = function(){
    var toggle = document.getElementById('toggle')
    toggle.addEventListener('change', toggleSwitch, false)

    creaAreasExtra()
    toggleSwitch()


    inicializar_mapa()
}



function creaAreasExtra(){
    divAreaExtra = document.getElementById('divAreaExtra')
    divPaises = creaNodo(null, 'div', 'divPaises')
    divCiclos = creaNodo(null, 'div', 'divCiclos')

    divAreaExtra.style.height = '100px'
    

    divPaises.style.height = '400px'
    divPaises.style.backgroundColor = '#D6DBDF'

    divCiclos.style.height = '50px'
    divCiclos.style.backgroundColor = 'white'

    divAreaExtra.appendChild(divCiclos)
    
}


function toggleSwitch(){

    var toggle = document.getElementById('toggle')



    if (toggle.checked){
        divAreaExtra.style.overflowY  = 'scroll'
        divAreaExtra.replaceChild(divPaises, divAreaExtra.childNodes[0])

    }
    else{
        divAreaExtra.style.overflowY  = 'visible'
        divAreaExtra.replaceChild(divCiclos, divAreaExtra.childNodes[0])

    }
}






//funcion generica para crear nodos
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



function inicializar_mapa(){
    var mapOptions = {
        center: new google.maps.LatLng(48.946313, 5.877168),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    var map = new google.maps.Map(document.getElementById('mapa_div'), mapOptions)
}
