var noticias;

const MAX_NEWS = 6;
var url = 'https://api.currentsapi.services/v1/search?' +
    'keywords=museo&' +
    'country=es&' +
    'language=es&' +
    'apiKey=LBsLwjGyg9LZKS6RymQf_jmJBAlkVNaJK_yuZtYvCQSfgXbO';
var req = new Request(url);
fetch(req)
    .then(function (response) {
        return response.json();

    }).then((news) => {

        noticias = news;
        console.log(noticias.news[0])
        addNews();
    })
    .catch(error => {
        console.log(error)
    })




function addNews() {
    for (let i = 0; i < MAX_NEWS; i++) {
        //Añadimos el titulo
        document.getElementById("new_title_" + i.toString()).innerHTML = noticias.news[i]["title"];
        //Añadimos la foto
        if (noticias.news[i]["image"] != "None") {
            document.getElementById("new_img_" + i.toString()).src = noticias.news[i]["image"];
        }
        //Añadimos el event listener para abrir el popup
        document.getElementById("new_" + i.toString()).addEventListener('click', () => {
            document.getElementById('popupBox').style.display = 'block';
            document.getElementById('popupBackground').style.display = 'block';
            document.getElementById("titulo_noticia").innerHTML = noticias.news[i]["title"];
            document.getElementById("cuerpo-noticia").innerHTML = noticias.news[i]["description"];
        });
    }
}

//Función que cierra el popup
function closePopup() {
    document.getElementById('popupBox').style.display = 'none';
    document.getElementById('popupBackground').style.display = 'none';
}