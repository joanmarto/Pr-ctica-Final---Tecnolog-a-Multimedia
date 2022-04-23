function iniciarMap(){
  var coord = {lat:39.5695 ,lng: 2.65002};
  var map = new google.maps.Map(document.getElementById('map'),{
    zoom: 10,
    center: coord
  });
  var marker = new google.maps.Marker({
    position: coord,
    map: map
  });
}

//Función que muestra la localización del museo
function getMuseumLoc(){

}

//Función que obtiene la Latitud de museo.json
function getLatitude(){
    
}

//Función que obtiene la Longitud de museo.json
function getLongitude(){

}