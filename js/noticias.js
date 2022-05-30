var noticias;

const MAX_NEWS = 6;

var url = 'https://newsapi.org/v2/everything?' +
    'q=Museo&' +
    'from=2022-05-30&' +
    'sortBy=popularity&' +
    'apiKey=61f7c83cb50e40b1bb8912322fcbe185';

var req = new Request(url);

fetch(req)
    .then((response) => {
        //It returns a promise which resolves with the result of parsing the body text as JSON
        return response.json();
    }).then((news) => {
        console.log(news.articles);
        noticias = news.articles;
        addNews();
    })
    .catch(error => {
        console.log(error)
    })

function addNews() {
    for (let i = 0; i < MAX_NEWS; i++) {
        //Añadimos el titulo
        document.getElementById("new_title_" + i.toString()).innerHTML = noticias[i]["title"];
        //Añadimos la foto
        document.getElementById("new_img_" + i.toString()).src = noticias[i]["urlToImage"];
        //Añadimos el event listener para abrir el popup
        document.getElementById("new_" + i.toString()).addEventListener('click', () => {
            document.getElementById('popupBox').style.display = 'block';
            document.getElementById('popupBackground').style.display = 'block';
            document.getElementById("titulo_noticia").innerHTML = noticias[i]["title"];
            document.getElementById("cuerpo-noticia").innerHTML = noticias[i]["description"];
        });
    }
}

//Función que cierra el popup
function closePopup() {
    document.getElementById('popupBox').style.display = 'none';
    document.getElementById('popupBackground').style.display = 'none';
}