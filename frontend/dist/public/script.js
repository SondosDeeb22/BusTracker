"use strict";
//====================================================
// Initialize socket connection
const socket = io('http://localhost:3000');
//---------------------------------------------------------------------------------
// Geolocation tracking
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 10000, // give the device more time to get a fix
        maximumAge: 0, // no cache // no saved data to get new data
    });
}
//---------------------------------------------------------------------------------
// Initialize map
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);
//---------------------------------------------------------------------------------
// Markers object to track user locations
const markers = {};
//---------------------------------------------------------------------------------
// Socket event handlers
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
//---------------------------------------------------------------------------------
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
//# sourceMappingURL=script.js.map
