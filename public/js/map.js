const lng = coordinates[0];
const lat = coordinates[1];

let map = new mappls.Map('map', {
    center: {
        lat: lat,
        lng: lng
    },
    zoom: 8
});

let marker = new mappls.Marker({
    map: map,
    position: {
        lat: lat,
        lng: lng
    },
        

    fitbounds: true,
    icon: "https://www.mappls.com/images/to.png",
    //icon_url: "https://apis.mappls.com/map_v3/1.png",
    zoom: 8,

});

marker.setPopup(` <h6> Exact location provided after booking</h6>`,{openPopup:false});

