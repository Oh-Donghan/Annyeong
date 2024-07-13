import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import GoogleAutoComplete from "./GoogleAutoComplete";

export default function GMap() {
  const mapRef = useRef(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  // const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_G_MAP_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
        setMap(map);
      }
    }).catch(e => {
      console.error('Error loading Google Maps', e);
    });
  }, []);

  const handleSelect = (position: google.maps.LatLngLiteral) => {
    if (map) {
      map.setCenter(position);
      map.setZoom(12);

      if (marker) {
        // marker.setPosition(position);
        marker.position = position;
      } else {
        // 2024.02.21 부터 google.maps.Marker는 권장되지 않고, 
        // google.maps.marker.AdvancedMarkerElement를 사용해야 한다.
        // 하지만 현재 바뀐방법으로 하면 undefined가 뜨므로 일단은 이전 방법으로 사용!
        // const newMarker = new google.maps.Marker({
        const newMarker = new google.maps.marker.AdvancedMarkerElement({
          position,
          map,
        });
        setMarker(newMarker);
      }
    }
  }

  return (
    <div>
      <GoogleAutoComplete onSelect={handleSelect} />
      <MapContainer ref={mapRef}></MapContainer>
    </div>
  );
}

const MapContainer = styled.div`
  width: 100%;
  height: 500px;
`;
