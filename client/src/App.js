import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function App() {
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ minPrice: 0, maxPrice: 4, type: 'restaurant' });

  const fetchPlace = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        try {
          const response = await axios.get('http://localhost:3000/places', {
            params: { latitude, longitude, minPrice: filters.minPrice, maxPrice: filters.maxPrice, type: filters.type }
          });
          console.log('API response:', response.data);
          setPlace(response.data);
          setError(null);
        } catch (error) {
          console.error('Error fetching place:', error);
          setError('Could not fetch place. Please try again.');
        }
      }, (geoError) => {
        console.error('Geolocation error:', geoError);
        setError('Geolocation is not supported by this browser or permission denied.');
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (place) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
        zoom: 15,
      });
      new window.google.maps.Marker({
        position: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
        map,
        title: place.name,
      });
    }
  }, [place]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Random Restaurant Roulette</h1>
        <div>
          <label>
            Min Price:
            <select name="minPrice" onChange={handleFilterChange} value={filters.minPrice}>
              <option value="0">$</option>
              <option value="1">$$</option>
              <option value="2">$$$</option>
              <option value="3">$$$$</option>
            </select>
          </label>
          <label>
            Max Price:
            <select name="maxPrice" onChange={handleFilterChange} value={filters.maxPrice}>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
            </select>
          </label>
          <label>
            Type:
            <select name="type" onChange={handleFilterChange
