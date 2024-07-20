
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: camp.geometry.coordinates,
    zoom: 3, // starting zoom
});
console.log(camp.geometry.coordinates);
new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .addTo(map);