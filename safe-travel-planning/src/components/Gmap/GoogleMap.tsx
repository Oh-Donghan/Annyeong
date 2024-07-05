import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import GoogleAutoComplete from './GoogleAutoComplete';
import { useParams } from 'react-router-dom';

export default function GMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const { countryId } = useParams();

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_G_MAP_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    loader
      .load()
      .then(() => {
        if (mapRef.current !== null) {
          const geocoder = new google.maps.Geocoder();

          geocoder.geocode({ address: countryId }, (results, status) => {
            if (
              status === google.maps.GeocoderStatus.OK &&
              results &&
              results[0]
            ) {
              const map = new google.maps.Map(mapRef.current!, {
                center: results[0].geometry.location,
                zoom: 6,
              });
              setMap(map);
            } else {
              console.error(
                'Geocode was not successful for the following reason: ',
                status
              );
            }
          });
        }
      })
      .catch((e) => {
        console.error('Error loading Google Maps', e);
      });
  }, [countryId]);

  const handleSelect = (position: google.maps.LatLngLiteral) => {
    if (map) {
      map.setCenter(position);
      map.setZoom(12);

      if (marker) {
        marker.setPosition(position);
      } else {
        const newMarker = new google.maps.Marker({
          position,
          map,
        });
        setMarker(newMarker);
      }
    }
  };

  return (
    <>
      {map && (
        <GoogleAutoComplete onSelect={handleSelect} countryId={countryId!} />
      )}
      <MapContainer ref={mapRef}></MapContainer>
    </>
  );
}

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;
