import React, { useState, useEffect } from 'react';
import { Monument } from './App';
import './Dashboard.css';

interface DashboardProps {
  monuments: Monument[];
  onAdd: (monument: Omit<Monument, 'id'>) => Promise<void>;
  onUpdate: (id: number, monument: Partial<Monument>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  monuments,
  onAdd,
  onUpdate,
  onDelete,
  onPageChange,
  currentPage,
  totalPages
}) => {
  const [formData, setFormData] = useState<Omit<Monument, 'id'>>({
    name: '',
    description: '',
    latitude: 0,
    longitude: 0,
    photos: []
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isManualCoords, setIsManualCoords] = useState(false);

  useEffect(() => {
    if (editingId !== null) {
      const monumentToEdit = monuments.find(m => m.id === editingId);
      if (monumentToEdit) {
        setFormData({
          name: monumentToEdit.name,
          description: monumentToEdit.description || '',
          latitude: monumentToEdit.latitude,
          longitude: monumentToEdit.longitude,
          photos: monumentToEdit.photos || []
        });
      }
    } else {
      setFormData({
        name: '',
        description: '',
        latitude: 0,
        longitude: 0,
        photos: []
      });
    }
  }, [editingId, monuments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId !== null) {
        await onUpdate(editingId, formData);
      } else {
        await onAdd(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="dashboard">
      <h2>Zarządzanie punktami</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nazwa:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Opis:</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={isManualCoords}
              onChange={() => setIsManualCoords(!isManualCoords)}
            />
            Ręczne wprowadzanie współrzędnych
          </label>
        </div>

        {isManualCoords && (
          <>
            <div className="form-group">
              <label>Szerokość (lat):</label>
              <input
                type="number"
                name="latitude"
                step="0.0001"
                value={formData.latitude}
                onChange={handleCoordinateChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Długość (lng):</label>
              <input
                type="number"
                name="longitude"
                step="0.0001"
                value={formData.longitude}
                onChange={handleCoordinateChange}
                required
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-save">
            {editingId !== null ? 'Zapisz' : 'Dodaj'}
          </button>
          <button type="button" onClick={resetForm} className="btn btn-cancel">
            Anuluj
          </button>
        </div>
      </form>

      <div className="monuments-list">
        <h3>Lista punktów ({monuments.length})</h3>
        {monuments.length > 0 ? (
          <ul>
            {monuments.map(monument => (
              <li key={monument.id}>
                <span>{monument.name}</span>
                <div className="monument-actions">
                  <button 
                    onClick={() => setEditingId(monument.id)}
                    className="btn btn-edit"
                  >
                    Edytuj
                  </button>
                  <button 
                    onClick={() => onDelete(monument.id)}
                    className="btn btn-delete"
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-monuments">Brak pomników do wyświetlenia</p>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                disabled={currentPage === i + 1}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;