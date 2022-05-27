const nom_museos = [];
var selected;
const xhttp_search = new XMLHttpRequest();
xhttp_search.open('GET', 'museos.json', true)
xhttp_search.send();
xhttp_search.onreadystatechange = function () {


    if (this.readyState == 4 && this.status == 200) {
        museos = JSON.parse(this.responseText);
        //Guardamos los nombres de los museos en el array
        for (var i = 0; i < museos.length; i++) {
            nom_museos[i] = museos[i]["name"];
        }
        autocomplete(document.getElementById("buscador"), nom_museos);
    }
}

//Función de autocompletado 
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<p style = \"font-size:100%\">" + arr[i] + "</p>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    selected = inp.value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {

            currentFocus++;

            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;

            addActive(x);
        } else if (e.keyCode == 13) {

            e.preventDefault();
            if (currentFocus > -1) {

                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);

        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {

        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    document.getElementById("enviar").addEventListener("click", function (e) {
        //Buscamos la posición del museo seleccionado en el JSON
        var pos;
        for (pos = 0; pos < museos.length; pos++) {
            if (equals(museos[pos]["name"], selected)) {
                break;
            }
        }
        if (pos == museos.length) { //Error
            alert("Escribe el nombre de un museo válido")
        } else {
            //Cargamos la página del museo seleccionado
            let url = `/museo.html?${pos}`;
            //alert("URL: " + url);
            //alert("location.href: " + window.location.href);
            //location.assign(url);
            //window.location.href = url;
            window.location.assign(url);
        }
        return false;
    });
}

//Función para comparar si 2 strings son iguales
function equals(str1, str2) {
    if (str1.startsWith(str2) && str1.endsWith(str2)) {
        return true;
    } else {
        return false;
    }
}
