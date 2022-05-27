var noticias;

const xhttp = new XMLHttpRequest();
xhttp.open('GET', '/json/noticias.json', true)
xhttp.send();
xhttp.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {
        noticias = JSON.parse(this.responseText);
        for (let i = 0; i < noticias.length; i++) {
            document.getElementById("imagen-noticia-1").src = noticias[i]["image"];
        }
    }
}