//Variables
var british;
//Número máximo de museos en el grid container
const MAX_FOTOS_BRITISH = 6;
const MAX_EV_BRITISH = 4;


//Petición para obtener el JSON del British Museum
const xhttp = new XMLHttpRequest();
xhttp.open('GET', 'https://britishmuseum.info/data/british.json', true)
xhttp.send();
xhttp.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {
        british = JSON.parse(this.responseText);
        window.addEventListener('load', esperaevent());
        /* document.getElementById("colab").innerHTML = british["british"]["description"];*/

        //api google maps para mostrar la posición del museo
        addMap();

        // pintar en la página web
        printWebPage();


    }
}





function addMap() {
    //Coordenadas del museo
    var coord = { lat: Number(british["british"]["geo"]["latitude"]), lng: Number(british["british"]["geo"]["longitude"]) };
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
//Función para generar una lista de números aleatorios sin repetir ninguno
function getRandomNumbersList(max, long) {
    let randArray = [];
    for (let i = 0; i < max; i++) {
        let rand = getRandom(long);

        while (contains(randArray, rand)) {
            rand = getRandom(long);
        }
        randArray[i] = rand;
    }
    return randArray;
}
function printWebPage() {
    document.getElementById("title").innerHTML = british["british"]["name"]

    document.getElementById("titulo_museo").innerHTML = british["british"]["name"]
    document.getElementById("descripcion_museo").innerHTML = british["british"]["description"];

    //Añadimos fotos aleatorias del british
    let randoms = getRandomNumbersList(MAX_FOTOS_BRITISH, british["datosExtra"][0]["gallery"].length);
    
    let randomev = getRandomNumbersList(MAX_EV_BRITISH, british["events"].length);

    for (let i = 0; i < MAX_FOTOS_BRITISH; i++) {

        document.getElementById("img_" + i.toString()).src = british["datosExtra"][0]["gallery"][randoms[i]];


    }
    for (let i = 0; i < british["categories"].length; i++) {

        document.getElementById("video_" + i.toString()).src = british["categories"][i]["MediaObject"]["contentUrl"];

        document.getElementById("descripcion_" + i.toString()).innerHTML = british["categories"][i]["description"];
        document.getElementById("titulo_" + i.toString()).innerHTML = british["categories"][i]["name"];
       
       
    }
   
    document.getElementById("titulo_evento").innerHTML = "Eventos";

    for (let i = 0; i < MAX_EV_BRITISH; i++) {

        document.getElementById("img_ev_" + i.toString()).src = british["events"][randomev[i]]["image"];

        document.getElementById("tit_ev_" + i.toString()).innerHTML = british["events"][randomev[i]]["name"];
        document.getElementById("desc_ev_" + i.toString()).innerHTML = british["events"][randomev[i]]["description"];
        document.getElementById("fech_ev_" + i.toString()).innerHTML = british["events"][randomev[i]]["startDate"] + " - " + british["events"][i]["endDate"];

    }


    document.getElementById("direccion").innerHTML = british["british"]["address"]["streetAddress"];
    document.getElementById("apertura").innerHTML = british["british"]["openingHours"];
    document.getElementById("telefono").innerHTML = british["british"]["telephone"];

    document.getElementById("web").innerHTML = british["british"]["hasMap"];

}

function goToPage() {
    document.location.assign(british["british"]["hasMap"]);
}

//API del tiempo
function esperaevent() {


    let temperaturaValor = document.getElementById('temperatura-valor')
    let temperaturaDescripcion = document.getElementById('temperatura-descripcion')

    let ubicacion = document.getElementById('ubicacion')
    let iconoAnimado = document.getElementById('icono-animado')

    let vientoVelocidad = document.getElementById('viento-velocidad')

    let lat = british["british"]["geo"]["latitude"];
    let lon = british["british"]["geo"]["longitude"];
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