const axios = require("axios");

async function geocode(location){

    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params:{
                q: location,
                format: "json",
                limit: 1
            },
            headers:{
                "User-Agent":"wanderlust-app"
            }
        }
    );

    if(response.data.length === 0){
        return null;
    }

    return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
    };
}

module.exports = geocode;