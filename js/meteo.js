export function meteo() {
    const CLE_API = '18376150bf0871cb9e05ed981c2115aa';
    const URL_API_METEO = 'https://api.openweathermap.org/data/2.5/weather';

    // Sélection des éléments du DOM
    const villeInput = document.getElementById('ville');
    const refreshBtn = document.getElementById('refreshBtn');
    const errorElement = document.getElementById('error');
    const meteoDataElement = document.getElementById('meteoData');
    const fermerDocument = document.getElementById('fermerDocument');

    const cityNameElement = document.getElementById('cityName');
    const tempElement = document.getElementById('temp');
    const feelsLikeElement = document.getElementById('feelsLike');
    const descriptionElement = document.getElementById('description');
    const windSpeedElement = document.getElementById('windSpeed');
    const windDirectionElement = document.getElementById('windDirection');
    const rainElement = document.getElementById('rainElement');
    const snowElement = document.getElementById('snowElement');
    const sunriseElement = document.getElementById('sunriseElement');
    const sunsetElement = document.getElementById('sunsetElement');

    const weatherIconElement = document.getElementById('weatherIcon');
    const currentDateElement = document.getElementById('currentDate'); 

    // Fonction pour formater l'heure UTC
    function formaterHeureUTC(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Fonction pour formater la date actuelle
    function formaterDate() {
        const today = new Date();
        const options = {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
        };
        return today.toLocaleDateString('fr-FR', options); 
    }

    // Fonction pour l'affichage des donnes de l'api
    function refresh() {
        const ville = villeInput.value.trim();
        if (!ville) return;

        // Fle d'api
        const url = `${URL_API_METEO}?q=${ville}&units=metric&appid=${CLE_API}&lang=fr`;
        errorElement.style.display = 'none';
        meteoDataElement.style.display = 'block';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.cod !== 200) {
                    showError('Ville non trouvée, veuillez réessayer.');
                    return;
                }

                const meteo = data;

                // Mettre à jour la date actuelle
                if (currentDateElement) {
                    currentDateElement.textContent = formaterDate();
                }

                // Mettre à jour les autres informations météo
                if (cityNameElement) {
                    cityNameElement.textContent = `${meteo.name}, ${meteo.sys.country}`;
                }
                if (tempElement) {
                    tempElement.textContent = meteo.main.temp.toFixed(1) + '°C';
                }
                if (feelsLikeElement) {
                    feelsLikeElement.textContent = meteo.main.feels_like.toFixed(1) + '°C';
                }
                if (descriptionElement) {
                    descriptionElement.textContent = meteo.weather[0].description;
                }

                // Mettre à jour la vitesse du vent (en km/h)
                if (windSpeedElement) {
                    const windSpeed = (meteo.wind.speed * 3.6).toFixed(1); // Conversion m/s à km/h
                    windSpeedElement.textContent = `${windSpeed} km/h`;
                }

                // Mettre à jour la direction du vent
                if (windDirectionElement && meteo.wind.deg !== undefined) {
                    windDirectionElement.textContent = directionVent(meteo.wind.deg);
                }

                // Pluie et neige
                if (rainElement) {
                    rainElement.textContent = meteo.rain ? `${meteo.rain['1h']} mm` : 'Pas de pluie';
                }
                if (snowElement) {
                    snowElement.textContent = meteo.snow ? `${meteo.snow['1h']} mm` : 'Pas de neige';
                }

                // Lever et coucher du soleil
                if (sunriseElement) {
                    sunriseElement.textContent = formaterHeureUTC(meteo.sys.sunrise);
                }
                if (sunsetElement) {
                    sunsetElement.textContent = formaterHeureUTC(meteo.sys.sunset);
                }

                // Icône météo
                if (weatherIconElement) {
                    weatherIconElement.src = `https://openweathermap.org/img/wn/${meteo.weather[0].icon}@2x.png`;
                }

                meteoDataElement.style.display = 'block';
            })
            .catch(error => {
                console.error('Erreur météo:', error);
                showError("Un petite erreur c'est produite veuillez ressayer plustard");
            });
    }

    // Affichage d'une erreur
    function showError(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        if (meteoDataElement) {
            meteoDataElement.style.display = 'none';
        }
    }
    
    // Fonction du calcul de vent et affiche des images liés
    function directionVent(degre) {
        let direction;
        let img = document.getElementById('image');  
    
        if (degre >= 315 || degre < 45) {
            direction = 'Nord';
            if (img) {
                img.src = './css/img/direction/nord.png'; 
            }
        } else if (degre >= 45 && degre < 135) {
            direction = 'Est';
            if (img) {
                img.src = './css/img/direction/est.png';
            }
        } else if (degre >= 135 && degre < 225) {
            direction = 'Sud';
            if (img) {
                img.src = './css/img/direction/sud.png' ; 
            }
        } else if (degre >= 225 && degre < 315) {
            direction = 'Ouest';
            if (img) {
                img.src = './css/img/direction/ouest.png';
            }
        }
    
        return direction; 
    }
    

    // raffrechissement du bouton
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refresh);
    }

    // fermeture le panneau Meteo
    if (fermerDocument) {
        fermerDocument.addEventListener('click', function () {
            meteoDataElement.style.display = 'none'; 
        });
    }
}
