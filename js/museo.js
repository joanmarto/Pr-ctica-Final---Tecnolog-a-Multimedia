//para escoger el museo en cuestion
var id = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
id = id.replace("?", "");
console.log(id);

var museos;

const xhttp = new XMLHttpRequest();
xhttp.open('GET', '/json/museos.json', true)
xhttp.send();
xhttp.onreadystatechange = function () {

  if (this.readyState == 4 && this.status == 200) {
    museos = JSON.parse(this.responseText);

    //JSON-LD
    initJSONLD();

    //api google maps para mostrar la posición del museo
    addMap();

    // pintar en la página web
    printWebPage();

    //Api tiempo
    window.addEventListener('load', loadAPIWeather());
  }
}

function addMap() {
  //Coordenadas del museo
  var coord = { lat: Number(museos.Museum[id]["GeoCoordinates"]["latitude"]), lng: Number(museos.Museum[id]["GeoCoordinates"]["longitude"]) };
  //Creamos el mapa
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: coord
  });
  //Añadimos un marcador
  var marker = new google.maps.Marker({
    position: coord,
    map: map
  });
}

function printWebPage() {
  document.getElementById("title").innerHTML = museos.Museum[id]["name"];
  //console.log(museos[id]["name"]);
  document.getElementById("titulo_museo").innerHTML = museos.Museum[id]["name"];
  document.getElementById("descripcion_museo").innerHTML = museos.Museum[id]["description"];
  document.getElementById("imagen_museo").src = museos["Museum"][id]["image"];

  document.getElementById("direccion").innerHTML = museos.Museum[id]["address"];
  document.getElementById("apertura").innerHTML = museos.Museum[id]["openingHoursSpecification"];
  document.getElementById("telefono").innerHTML = museos.Museum[id]["telephone"];
  document.getElementById("email").innerHTML = museos.Museum[id]["email"];
  document.getElementById("web").innerHTML = museos.Museum[id]["sameAs"];
  document.getElementById("video").src = museos.Museum[id]["url"];
}

function goToPage() {
  document.location.assign(museos.Museum[id]["sameAs"]);
}

//API del tiempo
 function loadAPIWeather() {

  let temperaturaValor = document.getElementById('temperatura-valor')
  let temperaturaDescripcion = document.getElementById('temperatura-descripcion')

  let ubicacion = document.getElementById('ubicacion')
  let iconoAnimado = document.getElementById('icono-animado')

  let vientoVelocidad = document.getElementById('viento-velocidad')
console.log(museos);
  let lat = museos.Museum[id]["GeoCoordinates"]["latitude"]
  let lon = museos.Museum[id]["GeoCoordinates"]["longitude"]
  //Lamada a la api con la ubicación del museo    
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=91eb185b92ada1500fb25d3a3f408c92`

  fetch(url)
    .then(response => { return response.json() })
    .then(data => {
      //console.log(data)

      let temp = Math.round((data.main.temp - 273))
      //console.log(temp)
      temperaturaValor.textContent = `${temp} °C`

      //console.log(data.weather[0].description)
      let desc = data.weather[0].description
      // temperaturaDescripcion.textContent = desc.toUpperCase()
      ubicacion.textContent = data.name

      vientoVelocidad.textContent = `${data.wind.speed} m/s`

      //iconos dinámicos
      switch (data.weather[0].main) {
        case 'Thunderstorm':
          iconoAnimado.src = '/animated/thunder.svg'
          //console.log('TORMENTA');
          temperaturaDescripcion.textContent = 'TORMENTA';
          break;
        case 'Drizzle':
          iconoAnimado.src = '/animated/rainy-2.svg'
          //console.log('LLOVIZNA');
          temperaturaDescripcion.textContent = 'LLOVIZNA';
          break;
        case 'Rain':
          iconoAnimado.src = '/animated/rainy-7.svg'
          //console.log('LLUVIA');
          temperaturaDescripcion.textContent = 'LLUVIA';
          break;
        case 'Snow':
          iconoAnimado.src = '/animated/snowy-6.svg'
          //console.log('NIEVE');
          temperaturaDescripcion.textContent = 'NIEVE';
          break;
        case 'Clear':
          iconoAnimado.src = '/animated/day.svg'
          //console.log('LIMPIO');
          temperaturaDescripcion.textContent = 'DESPEJADO';
          break;
        case 'Atmosphere':
          iconoAnimado.src = '/animated/weather.svg'
          //console.log('ATMOSFERA');
          temperaturaDescripcion.textContent = 'VIENTO';
          break;
        case 'Clouds':
          iconoAnimado.src = '/animated/cloudy-day-1.svg'
          //console.log('NUBES');
          temperaturaDescripcion.textContent = 'NUBES';
          break;
        default:
          iconoAnimado.src = '/animated/cloudy-day-1.svg'
          //console.log('por defecto');
          temperaturaDescripcion.textContent = 'NUBES';
      }

    })
    .catch(error => {
      console.log(error)
    })
}

//JSON-LD
function initJSONLD() {
  document.querySelector("script[type='application/ld+json']").innerHTML = `
    "@context": "http://www.schema.org",
    "@type": "Museum",
    "name": "${museos.Museum[id]["name"]}",
    "image": "${museos.Museum[id]["image"]}",
    "description": "${museos.Museum[id]["description"]}",
    "sameAs": "${museos.Museum[id]["sameAs"]}",
    "telephone": "${museos.Museum[id]["telephone"]}",
    "openingHoursSpecification": "${museos.Museum[id]["openingHoursSpecification"]}",
    "address": "${museos.Museum[id]["address"]}",
    "GeoCoordinates": {
      "@type":"GeoCoordinates",
      "longitude": "${museos.Museum[id]["longitude"]}",
      "latitude": "${museos.Museum[id]["latitude"]}"
    },
    "url": "${museos.Museum[id]["url"]}",
    "email": "${museos.Museum[id]["email"]}",
    `;
}