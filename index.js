//para escoger el museo en cuestión
var id = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
id = id.replace("?", "");
id = id.replace("#", "");

var museos;

var userLat, userLng; //Coordenadas cliente
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

const xhttp = new XMLHttpRequest();
xhttp.open('GET', 'museos.json', true)
xhttp.send();
xhttp.onreadystatechange = function () {

  if (this.readyState == 4 && this.status == 200) {

    museos = JSON.parse(this.responseText);
    navigator.geolocation.getCurrentPosition(success, error, options);
    //Esperamos a que se obtenga la ubicación
    setTimeout(addClosermuseums, 1000);
    setTimeout(addMap, 1000);
  }
}

function success(pos) {
  var crd = pos.coords;
  userLat = crd.latitude;
  userLng = crd.longitude;
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

//Función para mostrar los museos más cercanos
function addClosermuseums() {
  var distancias = [museos.length];
  var distanciasAux = [museos.length];
  //se calculan todas las distancias entre museos y ubicacion actual
  for (var i = 0; i < museos.length; i++) {
    var km = getDistanceFromLatLonInKm(userLat, userLng, museos[i]["latitude"], museos[i]["longitude"])
    //console.log(museos[i]["name"] + ": a " + km + " de distancia")
    distancias[i] = km;
    distanciasAux[i] = km;
  }

  //ordenamos distancias
  distancias.sort((a, b) => a - b);

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < distancias.length; j++) {
      if (distancias[i] == distanciasAux[j]) {
        document.getElementById("titulo_galeria_index" + i.toString()).innerHTML = museos[j]["name"];
        document.getElementById("foto_galeria_index" + i.toString()).src = museos[j]["image"];
        document.getElementById("titulo_galeria_index" + i.toString()).href = "museo.html?" + j.toString();
      }
    }
  }
}

//API google maps para mostrar la posición de los museos
function addMap() {
  var coord = [];
  for (var i = 0; i < museos.length; i++) {
    //Obtenemos todas las coordenadas
    coord[i] = { lat: Number(museos[i]["latitude"]), lng: Number(museos[i]["longitude"]) };
  }

  //Creamos el mapa
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: Number(userLat), lng: Number(userLng) }
  });

  //Añadimos los marcadores de los museos
  var marker = [];
  for (var i = 0; i < museos.length; i++) {
    marker[i] = new google.maps.Marker({
      position: coord[i],
      map: map,
      title: museos[i]["name"]
    });
    let selected = museos[i]["name"];
    //Al clicar en el marcador de un museo se muestra su página web
    marker[i].addListener("click", () => {
      var pos;
      for (pos = 0; pos < museos.length; pos++) {
        if (equals(museos[pos]["name"], selected)) {
          break;
        }
      }
      if (pos == museos.length) { //Error
        alert("Escribe el nombre de un museo válido")
      } else {
        //Cargamos la página del museo seleccionado
        let url = `/museo.html?${pos}`;
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
