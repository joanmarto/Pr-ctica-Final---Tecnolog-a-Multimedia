//para escoger el museo en cuestion
var id = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
id = id.replace("?", "");
console.log(id);

let museos;

const xhttp = new XMLHttpRequest();
xhttp.open('GET', 'museos.json', true)
xhttp.send();
xhttp.onreadystatechange = function () {


  if (this.readyState == 4 && this.status == 200) {
    museos = JSON.parse(this.responseText);

    //api google maps para mostrar la posición del museo
    var coord = { lat: Number(museos[id]["latitude"]), lng: Number(museos[id]["longitude"]) };
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: coord
    });
    var marker = new google.maps.Marker({
      position: coord,
      map: map
    });

    // pintar en la página web
    console.log(museos[id]["name"]);
    document.getElementById("titulo_museo").innerHTML = museos[id]["name"];
    document.getElementById("descripcion_museo").innerHTML = museos[id]["description"];
    document.getElementById("imagen_museo").src = museos[id]["image"];

    //api tiempo
    window.addEventListener('load', () => {
      let lon;
      let lat;

      let temperaturaValor = document.getElementById('temperatura-valor')
      let temperaturaDescripcion = document.getElementById('temperatura-descripcion')

      let ubicacion = document.getElementById('ubicacion')
      let iconoAnimado = document.getElementById('icono-animado')

      let vientoVelocidad = document.getElementById('viento-velocidad')



      lon = museos[id]["longitude"]
      lat = museos[id]["latitude"]
      
      //ubicación del museo    
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=91eb185b92ada1500fb25d3a3f408c92`

      fetch(url)
        .then(response => { return response.json() })
        .then(data => {
          //console.log(data)

          let temp = Math.round(data.main.temp)
          //console.log(temp)
          temperaturaValor.textContent = `${temp - 273, 15} ° C`

          //console.log(data.weather[0].description)
          let desc = data.weather[0].description
          temperaturaDescripcion.textContent = desc.toUpperCase()
          ubicacion.textContent = data.name

          vientoVelocidad.textContent = `${data.wind.speed} m/s`



          //para iconos dinámicos
          console.log(data.weather[0].main)
          switch (data.weather[0].main) {
            case 'Thunderstorm':
              iconoAnimado.src = 'animated/thunder.svg'
              console.log('TORMENTA');
              break;
            case 'Drizzle':
              iconoAnimado.src = 'animated/rainy-2.svg'
              console.log('LLOVIZNA');
              break;
            case 'Rain':
              iconoAnimado.src = 'animated/rainy-7.svg'
              console.log('LLUVIA');
              break;
            case 'Snow':
              iconoAnimado.src = 'animated/snowy-6.svg'
              console.log('NIEVE');
              break;
            case 'Clear':
              iconoAnimado.src = 'animated/day.svg'
              console.log('LIMPIO');
              break;
            case 'Atmosphere':
              iconoAnimado.src = 'animated/weather.svg'
              console.log('ATMOSFERA');
              break;
            case 'Clouds':
              iconoAnimado.src = 'animated/cloudy-day-1.svg'
              console.log('NUBES');
              break;
            default:
              iconoAnimado.src = 'animated/cloudy-day-1.svg'
              console.log('por defecto');
          }

        })
        .catch(error => {
          console.log(error)
        })
    })


  }


}

//Buscador de museos
const formulario = document.querySelector('#formulario');
const search = document.querySelector('#search');

const buscar = ()=>{
  //console.log(buscador.value);
  //const text = formulario.ariaValueMax.toLowerCase();
  for (let museo of museos){
    console.log(museo);
  }
}

search.addEventListener('click', buscar)