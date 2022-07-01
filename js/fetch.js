const API_KEY = "83dab742ede4dbf64eb69517ccc07a79";
const URL_CLIMA = `https://api.openweathermap.org/data/2.5/weather`;

const temperaturaValor = document.getElementById('temperatura-valor');
const temperaturaDescripcion = document.getElementById('temperatura-descripcion');
const sensacionTermica = document.getElementById('sensacion-termica');
const tempMin = document.getElementById('temp-min');
const tempMax = document.getElementById('temp-max');
const humedad = document.getElementById('humedad');
const presionAtmo = document.getElementById('presion-atmo');
const ubicacion = document.getElementById('ubicacion');
const img = document.getElementById('icono-animado');
const vientoVelocidad = document.getElementById('viento-velocidad');
const inputElement = document.getElementById('search');
const button = document.getElementById('sendButton');
const fechaActual = document.getElementById('fecha-actual');
const detallesLi = document.getElementById('detalles');
const botonRecarga = document.getElementById('inicio');
const liPrincipal = document.getElementById('principal');

let lon
let lat
let ciudad 

const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const dias_semana = ['Domingo', 'Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];





button.addEventListener("click", ()=> {
    ciudad = inputElement.value;
    const url_ciudad = `${URL_CLIMA}?q=${ciudad}&appid=${API_KEY}&lang=es`;
    verClima(url_ciudad);
    localStorage.setItem('ultima_busqueda', url_ciudad);
    console.log (localStorage);
});


function verClima(url) {
    fetch(url)
    .then(response => {
        return response.json();
    })
    .then(data => {

        let tempCelsius = data.main.temp - 273.15;
        tempCelsius = Math.round(tempCelsius);
        temperaturaValor.innerHTML = `${tempCelsius}°C`;

        let tempMinCelsius = data.main.temp_min - 273.15;
        tempMinCelsius = Math.round(tempMinCelsius);
        tempMin.innerHTML = `/ ${tempMinCelsius} °C`;

        let tempMaxCelsius = data.main.temp_max - 273.15;
        tempMaxCelsius = Math.round(tempMaxCelsius);
        tempMax.innerHTML = `${tempMaxCelsius} °C`;

        let tempSensacionCelsius = data.main.feels_like - 273.15;
        tempSensacionCelsius = Math.round(tempSensacionCelsius);
        sensacionTermica.innerHTML = `Sensación térmica ${tempSensacionCelsius} °C`;

        humedad.innerHTML = `${data.main.humidity}%`;

        presionAtmo.innerHTML = `${data.main.pressure} hPa`;

        let desc = data.weather[0].description;
        temperaturaDescripcion.innerHTML = desc.toUpperCase();

        ubicacion.innerHTML = data.name;

        vientoVelocidad.innerHTML = `${data.wind.speed} m/s`;

        botonRecarga.style.display = "none";

        liPrincipal.style= "display:inline-block";

        switch(data.weather[0].main) {
            case 'Thunderstrom':
                img.src='img/icons/thunder.svg';
                break;
            case 'Drizzle':
                img.src='img/icons/rainy-2.svg';
                break;
            case 'Rain':
                img.src='img/icons/rainy-7.svg';
                break;
            case 'Snow':
                img.src='img/icons/snowy-6.svg';
                break;
            case 'Clear':
                img.src='img/icons/day.svg';
                break;
            case 'Atmosphere':
                img.src='img/icons/weather.svg';
                break;
            case 'Clouds':
                img.src='img/icons/cloudy-day-1.svg';
                break;
            default:
                img.src='img/icons/cloudy-day-1.svg';
        }

    })
    .catch(err => {
        console.log(err);
        liPrincipal.style= "display:block";
        ubicacion.innerHTML= `Ups! Parece que ${ciudad} no existe`;
        temperaturaDescripcion.innerHTML = "La ubicación que ingresaste no figura en nuestro sitio, vuelve a tu ubicación actual";
        img.src = "img/carita_triste.png";
        botonRecarga.style.display = "inline-block";
        detallesLi.style.display = "none";
        fechaActual.style.display = "none";
        temperaturaValor.style.display = "none";
        tempMax.style.display = "none";
        sensacionTermica.style.display = "none";
        tempMin.style.display = "none";
    })
}

botonRecarga.addEventListener("click", ()=> {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( posicion => {
            lon = posicion.coords.longitude
            lat = posicion.coords.latitude
            const url = `${URL_CLIMA}?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=es`;
            fecha = new Date();
            fechaActual.textContent = `${dias_semana[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getUTCFullYear()}`;
            verClima(url);
            localStorage.setItem('ultima_busqueda', url);
            window.location.href = window.location.href;
        })
    }

});

window.addEventListener('load', ()=> {
    if(localStorage[0]) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( posicion => {
                lon = posicion.coords.longitude
                lat = posicion.coords.latitude
                const url = `${URL_CLIMA}?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=es`;
                fecha = new Date();
                fechaActual.textContent = `${dias_semana[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getUTCFullYear()}`;
                verClima(url);
            })
        }
    } else {
        
        const url = localStorage.getItem('ultima_busqueda');
        fecha = new Date();
        fechaActual.textContent = `${dias_semana[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getUTCFullYear()}`;
        verClima(url);
    }
})

