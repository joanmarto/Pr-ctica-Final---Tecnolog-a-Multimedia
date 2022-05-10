//para escoger el museo en cuestion
var id = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
id = id.replace("?", "");
id = id.replace("#", "");
console.log(id);

const xhttp = new XMLHttpRequest();
xhttp.open('GET', 'museos.json', true)
xhttp.send();
xhttp.onreadystatechange = function () {


  if (this.readyState == 4 && this.status == 200) {

    let museos = JSON.parse(this.responseText);
    
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    var crd;
    function success(pos) {
      crd = pos.coords;
      var distancias = [museos.length];
      var distanciasAux = [museos.length];

      //se callculan todas las distancias entre museos y ubicacion actual
      for (var i = 0; i < museos.length; i++) {
        var km = getDistanceFromLatLonInKm(crd.latitude, crd.longitude, museos[i]["latitude"], museos[i]["longitude"])
        distancias[i] = km;
        distanciasAux[i] = km;
      }

      //ordenamos distancias
      distancias.sort((a, b) => a - b);
      for (var i = 0; i < distancias.length; i++) {
        console.log(distancias[i]);
      }

      for (var i = 0; i < distanciasAux.length; i++) {
        console.log(distanciasAux[i]);
      }

      for (var x = 0; x < 4; x++) {
        for (var i = 0; i < distancias.length; i++) {
          if (distancias[x] == distanciasAux[i]) {
            document.getElementById("titulo_galeria_index" + x.toString()).innerHTML = museos[i]["name"];
            document.getElementById("foto_galeria_index" + x.toString()).src = museos[i]["image"];
            document.getElementById("titulo_galeria_index" + x.toString()).href = "museo.html?" + i.toString();
          }
        }
      }
    }

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

    //API google maps para mostrar la posición de los museos
    var coord = [];
    for (var i = 0; i < museos.length; i++) {
      //Obtenemos todas las coordenadas
      coord[i] = { lat: Number(museos[i]["latitude"]), lng: Number(museos[i]["longitude"]) };
      console.log("Museo " + museos[i]["name"] + " -> lat: " + coord[i].lat + ", long: " + coord[i].lng);
    }

    //Creamos el mapa
    var uib = {lat: 39.637464, lng: 2.644435} //Coordenadas uib
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      /*
      center: navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };})  //Posición del cliente
          */
      center: uib
    });

    //Añadimos los marcadores de los museos
    var marker = [];
    for(var i = 0; i < museos.length; i++){
      marker[i] = new google.maps.Marker({
        position: coord[i],
        map: map,
        title: museos[i]["name"]
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
      position: uib,
      map: map,
      title: "you",
      icon: svgMarker
    });
  }
}

//funcion para calcular distancias entre ubicacion actual y museos
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
