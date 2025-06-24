import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
//import markerIcon from 'leaflet/dist/images/marker-icon.png';
//import markerShadow from 'leaflet/dist/images/marker-shadow.png';


// Poprawka dla ikon Leaflet
// Leaflet nie znajduje domyślnych ikon, więc musimy je ustawić ręcznie
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Definicja domyślnego ikonu markera
// Używamy lokalnych plików z Leaflet, ale można też użyć własnych ikon
// Jeśli chcesz użyć własnych ikon, zmień ścieżki
// na odpowiednie do Twojego projektu.
/*
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
*/

// Funkcja do tworzenia ikon kolorowych markerów
// Możesz zmienić kolory na dowolne dostępne w bibliotece leaflet (red, blue, green, gold itd.)
const getColorIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Interfejs dla danych monumentu
// Definiuje strukturę danych, które będą pobierane z backendu
interface Monument {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  photos: { url: string }[];
}

// Komponent główny aplikacji
// Pobiera dane z backendu i wyświetla je na mapie
// Używa Leaflet do renderowania mapy i markerów
const App: React.FC = () => {

  // Stan do przechowywania listy monumentów
  // Używamy useState do przechowywania danych monumentów
  const [monuments, setMonuments] = useState<Monument[]>([]);

  // Stan do przechowywania filtru
  // Używany do filtrowania monumentów na podstawie nazwy lub opisu
  // Używamy useState do przechowywania wartości filtru
  const [filter, setFilter] = useState('');
  
  useEffect(() => {
    axios.get('http://localhost:3000/monuments')
      .then(response => {
        console.log('Otrzymane dane:', response.data);
        setMonuments(response.data);
      })
      .catch(error => console.error('Błąd pobierania:', error));
  }, []);

  // Filtrowanie monumentów na podstawie nazwy lub opisu
  // Używamy metody filter do przeszukiwania listy monumentów
  // Sprawdzamy, czy nazwa lub opis zawiera tekst z filtru
  // Używamy toLowerCase() do porównania bez uwzględniania wielkości liter
  // Jeśli opis jest pusty, traktujemy go jako false
  // Dzięki temu możemy wyszukiwać monumenty po nazwie lub opisie
  // Filtrowanie jest wykonywane na każdym renderze, więc jeśli zmienimy
  // wartość filtru, lista monumentów zostanie automatycznie zaktualizowana
const filteredMonuments = monuments.filter(monument => {
  const searchTerm = filter.toLowerCase();
  const name = monument.name?.toLowerCase() || '';
  const description = monument.description?.toLowerCase() || '';
  
  return name.includes(searchTerm) || description.includes(searchTerm);
});

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <input
         type="text"
         value={filter}
         placeholder={`Filtruj pomniki (${filteredMonuments.length}/${monuments.length})`}
         onChange={(e) => {console.log('Filtr:', filter, 'Znalezione:', filteredMonuments.length);
          setFilter(e.target.value)}}
          style={{
          position: 'absolute',
          top: '10px',
          left: '50px',
          zIndex: 1000,
          padding: '8px',
          width: '200px'
        }}
      />
      <MapContainer
        center={[54.4108, 18.5604]} // Centrum na dąb jana
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {filteredMonuments.map(monument => (
          <Marker
            key={monument.id}
            position={[monument.latitude, monument.longitude]}
            icon={getColorIcon('red')} // Możliwe kolory: red, blue, green, gold itd.
          >
            <Popup className="custom-popup">
              <div style={{ padding: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{monument.name}</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{monument.description}</p>
                {monument.photos?.[0]?.url && (
                <img 
                  src={monument.photos[0].url}
                  style={{
                    width: '100%',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                  alt={monument.name}
                />
               )}
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#7f8c8d' }}>
                 Współrzędne: {monument.latitude.toFixed(4)}, {monument.longitude.toFixed(4)}
              </div>
             </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default App;