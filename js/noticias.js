var noticias;

const MAX_NEWS = 6;

var url = 'https://newsapi.org/v2/everything?' +
    'q=Arte&' +
    'from=2022-05-30&' +
    'sortBy=popularity&' +
    'apiKey=61f7c83cb50e40b1bb8912322fcbe185';

var req = new Request(url);

fetch(req)
    .then((response) => {
        //It returns a promise which resolves with the result of parsing the body text as JSON
        return response.json();
    }).then((noticias) =>{
        console.log(noticias.articles[0]["title"]);
    })
    .catch(error => {
        console.log(error)
    })

function addNews(){
    for(let i = 0; i < MAX_NEWS; i++){
        //Añadimos el titulo

        //Añadimos la foto

        //Añadimos el event listener
        document.getElementById("new_" + i.toString()).addEventListener('click', showPopup(i));
    }
}

// When the user clicks on <div>, open the popup

function showPopup(id) {
    document.getElementById('popupBox').style.display = 'block';
    document.getElementById('popupBackground').style.display = 'block';
    document.getElementById("cuerpo-noticia").innerHTML = noticias[id]["articleBody"];
}

function closePopup() {
    document.getElementById('popupBox').style.display = 'none';
    document.getElementById('popupBackground').style.display = 'none';
}