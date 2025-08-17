
function initMap(coords) {
        console.log("Map coordinates being used:", coords); 
    // Initialize MapLibre map
    const map = new maplibregl.Map({
        container: "map",
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`,
        center: coords,
        zoom: 12
    });

    // Optional: add zoom and rotation controls
    map.addControl(new maplibregl.NavigationControl());

    // Create popup with listing details
    const popup = new maplibregl.Popup({ offset: 25, closeButton : false })
        .setHTML(`
            <h4>${listing.location}</h4>
            <p>Exact Location will be provided after booking</p>
        `);

    // Create red marker and attach popup
    new maplibregl.Marker({ color: "red" })
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(map);
}

// Check if listing has coordinates
if (listing.geometry && listing.geometry.coordinates) {
    console.log("Using listing coordinates:", listing.geometry.coordinates);
    initMap(listing.geometry.coordinates);
} else {
    // Fallback: use MapTiler geocoding
    const query = locationQuery ? encodeURIComponent(locationQuery) : "New Delhi, India";
    fetch(`https://api.maptiler.com/geocoding/${query}.json?key=${mapToken}`)
        .then(res => res.json())
        .then(data => {
            const coords = data.features?.[0]?.geometry?.coordinates || [77.209, 28.6139];
            console.log("Fallback coordinates for", query, ":", coords);
            initMap(coords);
        })
        .catch(err => console.error("Geocoding error:", err));
}
