import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import Dashboard from './Dashboard';

// Poprawka dla ikon Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Funkcja do tworzenia ikon kolorowych markerów
const getColorIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

export interface Monument {
  id: number;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  photos: { url: string }[];
}

const App: React.FC = () => {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMonuments = useCallback(async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/monuments`);
      setMonuments(response.data);
      setTotalPages(2); // Zakładamy, że API zwraca wszystkie pomniki w jednym żądaniu
    } catch (error) {
      console.error('Error fetching monuments:', error);
    }
  }, []);

  const handleAddMonument = useCallback(async (data: Omit<Monument, 'id'>) => {
    try {
      await axios.post('http://localhost:3000/monuments', data);
      await fetchMonuments(currentPage);
    } catch (error) {
      console.error('Error adding monument:', error);
    }
  }, [currentPage, fetchMonuments]);

  const handleUpdateMonument = useCallback(async (id: number, data: Partial<Monument>) => {
    try {
      await axios.patch(`http://localhost:3000/monuments/${id}`, data);
      await fetchMonuments(currentPage);
    } catch (error) {
      console.error('Error updating monument:', error);
    }
  }, [currentPage, fetchMonuments]);

  const handleDeleteMonument = useCallback(async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/monuments/${id}`);
      await fetchMonuments(currentPage);
    } catch (error) {
      console.error('Error deleting monument:', error);
    }
  }, [fetchMonuments, currentPage]);

  useEffect(() => {
    fetchMonuments(currentPage);
  }, [currentPage, fetchMonuments]);

  const filteredMonuments = monuments.filter(monument => {
    const searchTerm = filter.toLowerCase();
    const name = monument.name?.toLowerCase() || '';
    const description = monument.description?.toLowerCase() || '';
    return name.includes(searchTerm) || description.includes(searchTerm);
  });

  return (
    <div className="app-container" style={{ height: '100vh', width: '100%' }}>
      <input
        type="text"
        value={filter}
        placeholder={`Filtruj pomniki (${filteredMonuments.length}/${monuments.length})`}
        onChange={(e) => {
          console.log('Filtr:', e.target.value, 'Znalezione:', filteredMonuments.length);
          setFilter(e.target.value);
        }}
        style={{
          position: 'absolute',
          top: '10px',
          left: '50px',
          zIndex: 1000,
          padding: '8px',
          width: '200px'
        }}
      />

      <Dashboard
        monuments={monuments}
        onAdd={handleAddMonument}
        onUpdate={handleUpdateMonument}
        onDelete={handleDeleteMonument}
        onPageChange={(page) => {
          setCurrentPage(page);
          fetchMonuments(page);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <MapContainer
        center={[54.4108, 18.5604]}
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
            icon={getColorIcon('red')}
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