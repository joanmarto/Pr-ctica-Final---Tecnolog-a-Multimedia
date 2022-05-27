//Variables
var british;

//Petición para obtener el JSON del British Museum
const xhttp = new XMLHttpRequest();
xhttp.open('GET', 'https://britishmuseum.info/data/british.json', true)
xhttp.send();
xhttp.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {
        british = JSON.parse(this.responseText);
        document.getElementById("colab").innerHTML = british["british"]["description"];
    }
}