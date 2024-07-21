

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: camp.geometry.coordinates,
    zoom: 3, // starting zoom
});
// console.log(camp.geometry.coordinates);
new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${camp.title}</h3> <p>${camp.location}</p> `
        )
    )
    .addTo(map);