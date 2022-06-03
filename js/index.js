//para escoger el museo en cuestión
var id = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
id = id.replace("?", "");
id = id.replace("#", "");

//Variables
var museos;
var locationError = false;

//Número máximo de museos en el grid container
const MAX_MUSEUMS_GRID_CONTAINER = 4;
const MAX_MUSEUMS_SLIDER = 3;

var userLat, userLng; //Coordenadas cliente
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

const xhttp = new XMLHttpRequest();
xhttp.open('GET', '/json/museos.json', true)
xhttp.send();
xhttp.onreadystatechange = function () {

  if (this.readyState == 4 && this.status == 200) {

    museos = JSON.parse(this.responseText);
    //navigator.geolocation.getCurrentPosition(success, error, options);
  
    document.getElementById("logo").addEventListener('click', navigator.geolocation.getCurrentPosition(success, error, options));
  }
}

function addPageContent() {

  if (!locationError) {//Comprobamos si ha habido error
    addClosermuseums();
    addMap();
  } else {
    //Añadimos museos aleatorios
    let randoms = getRandomNumbersList();
    for (let i = 0; i < MAX_MUSEUMS_GRID_CONTAINER; i++) {
      document.getElementById("titulo_galeria_index" + i.toString()).innerHTML = museos.Museum[randoms[i]].name;
      document.getElementById("foto_galeria_index" + i.toString()).src = museos.Museum[randoms[i]].image;
      document.getElementById("titulo_galeria_index" + i.toString()).href = "museo.html?" + randoms[i].toString();
    }
    //Creamos un array con los museos para el slider
    let otherMuseums = [];
    for (let i = MAX_MUSEUMS_GRID_CONTAINER; i < MAX_MUSEUMS_GRID_CONTAINER + MAX_MUSEUMS_SLIDER; i++) {
      otherMuseums[i - MAX_MUSEUMS_GRID_CONTAINER] = museos.Museum[randoms[i]];
    }
    addOtherMuseums(otherMuseums);
  }
}

//Función para añadir museos al carrusel
function addOtherMuseums(arr) {
  for (let i = 0; i < MAX_MUSEUMS_SLIDER; i++) {
    //Añadimos una parte de la descripción (275 caracteres)
    let description = arr[i]["description"].substring(0, 275);
    description += "...";
    //Insertamos los elementos
    document.getElementById("slide_title_" + i.toString()).innerHTML = arr[i].name;
    document.getElementById("slide_img_" + i.toString()).src = arr[i].image;
    document.getElementById("slide_desc_" + i.toString()).innerHTML = description;
  }
}

//Función para generar una lista de números aleatorios sin repetir ninguno
function getRandomNumbersList() {
  let randArray = [];
  for (let i = 0; i < museos.Museum.length; i++) {
    let rand = getRandom(museos.Museum.length);
    while (contains(randArray, rand)) {
      rand = getRandom(museos.Museum.length);
    }
    randArray[i] = rand;
  }
  return randArray;
}

//Función que comprueba si un elemento está en una lista
function contains(arr, number) {
  for (let i = 0; i < arr.length; i++) {
    if (number == arr[i]) {
      return true;
    }
  }
  return false;
}

//Función que retorna un random entre 0 y max - 1
function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function success(pos) {
  var crd = pos.coords;
  userLat = crd.latitude;
  userLng = crd.longitude;
  //Añadimos el contenido de la página
  addPageContent();
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
  locationError = true;
  //Añadimos el contenido de la página
  addPageContent();
};

//Función para mostrar los museos más cercanos
function addClosermuseums() {
  var distancias = [];
  var distanciasAux = [];

  //se calculan todas las distancias entre museos y ubicacion actual
  for (var i = 0; i < museos.Museum.length; i++) {
    var km = getDistanceFromLatLonInKm(userLat, userLng, museos.Museum[i]["GeoCoordinates"]["latitude"], museos.Museum[i]["GeoCoordinates"]["longitude"])
    distancias[i] = km;
    distanciasAux[i] = km;
  }
  //ordenamos distancias
  distancias.sort((a, b) => a - b);

  for (var i = 0; i < MAX_MUSEUMS_GRID_CONTAINER; i++) {
    for (var j = 0; j < distancias.length; j++) {
      if (distancias[i] == distanciasAux[j]) {
        document.getElementById("titulo_galeria_index" + i.toString()).innerHTML = museos.Museum[j]["name"];
        document.getElementById("foto_galeria_index" + i.toString()).src = museos.Museum[j]["image"];
        document.getElementById("titulo_galeria_index" + i.toString()).href = "museo.html?" + j.toString();
      }
    }
  }
  //Creamos el array de museos para el slide de fotos
  let otherMuseums = [];
  for (let i = MAX_MUSEUMS_GRID_CONTAINER; i < MAX_MUSEUMS_GRID_CONTAINER + MAX_MUSEUMS_SLIDER; i++) {
    for (let j = 0; j < distancias.length; j++) {
      if (distancias[i] == distanciasAux[j]) {
        otherMuseums[i - MAX_MUSEUMS_GRID_CONTAINER] = museos.Museum[j];
      }
    }
  }
  //Añadimos los museos al slide de fotos
  addOtherMuseums(otherMuseums);
}

//API google maps para mostrar la posición de los museos
function addMap() {
  document.getElementById("map_title").innerHTML = "Localiza nuestros museos";
  var coord = [];
  for (var i = 0; i < museos.Museum.length; i++) {
    //Obtenemos todas las coordenadas
    coord[i] = { lat: Number(museos.Museum[i]["GeoCoordinates"]["latitude"]), lng: Number(museos.Museum[i]["GeoCoordinates"]["longitude"]) };
  }

  //Creamos el mapa
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: Number(userLat), lng: Number(userLng) }
  });

  //Añadimos los marcadores de los museos
  var marker = [];
  for (var i = 0; i < museos.Museum.length; i++) {
    marker[i] = new google.maps.Marker({
      position: coord[i],
      map: map,
      title: museos.Museum[i]["name"]
    });
    let selected = museos.Museum[i]["name"];
    //Al clicar en el marcador de un museo se muestra su página web
    marker[i].addListener("click", () => {
      var pos;
      for (pos = 0; pos < museos.Museum.length; pos++) {
        if (equals(museos.Museum[pos]["name"], selected)) {
          break;
        }
      }
      if (pos == museos.Museum.length) { //Error
        alert("Escribe el nombre de un museo válido")
      } else {
        //Cargamos la página del museo seleccionado
        let url = `/html/museo.html?${pos}`;
        window.location.assign(url);
      }
    });
  }
  //Añadimos el marcador del usuario. Para diferenciarlo del resto será un icono svg de color azul
  const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };
  var userMarker = new google.maps.Marker({
    position: { lat: Number(userLat), lng: Number(userLng) },
    map: map,
    title: "you",
    icon: svgMarker
  });
}

//funcion para calcular distancias entre ubicacion actual y museos
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(Math.abs(lat2 - lat1));
  var dLon = deg2rad(Math.abs(lon2 - lon1));
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
