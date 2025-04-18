document.addEventListener('DOMContentLoaded', () => {
    const revCoordinates=[coordinates[1],coordinates[0]];
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const map = L.map('map').setView(revCoordinates, 13); // Default to New Delhi

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        console.log(revCoordinates);
        L.marker(revCoordinates).addTo(map)
            .bindPopup('Listing Location')
            .openPopup();
    }
});