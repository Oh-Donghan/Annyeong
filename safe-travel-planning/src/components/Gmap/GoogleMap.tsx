import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import GoogleAutoComplete from './GoogleAutoComplete';
import { useParams } from 'react-router-dom';

interface SelectData {
  latLng: google.maps.LatLngLiteral;
  placeId: string;
}

export default function GMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );
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
        if (mapRef.current) {
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

  const getPlaceDetails = (
    placeId: string,
    map: google.maps.Map,
    newMarker: google.maps.Marker
  ) => {
    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: placeId,
        fields: [
          'photos',
          'name',
          'formatted_address',
          'rating',
          'opening_hours',
        ],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const photoUrl =
            place.photos && place.photos.length > 0
              ? place.photos[0].getUrl()
              : null;
          const openingHours = place.opening_hours
            ? place.opening_hours.weekday_text?.join('<br>')
            : 'No opening hours available';

          const contentString = `
            <div>
              ${
                photoUrl
                  ? `<img src="${photoUrl}" alt="Place Image" style="width:200px; height:200px"><br>`
                  : ''
              }
              <strong>${place.name}</strong><br>
              ${place.formatted_address}<br>
              Rating: ${place.rating || 'No ratings'}<br>
              <div>Opening Hours:<br>${openingHours}</div>
            </div>
          `;

          if (infoWindow) {
            infoWindow.setContent(contentString);
            infoWindow.open(map, newMarker);
          } else {
            const newInfoWindow = new google.maps.InfoWindow({
              content: contentString,
            });
            setInfoWindow(newInfoWindow);
            newInfoWindow.open(map, newMarker);
          }
        }
      }
    );
  };

  const handleSelect = ({ latLng, placeId }: SelectData) => {
    if (map) {
      map.setCenter(latLng);
      map.setZoom(18);

      if (marker) marker.setMap(null);
      if (infoWindow) infoWindow.close();

      const newMarker = new google.maps.Marker({ position: latLng, map });
      setMarker(newMarker);

      getPlaceDetails(placeId, map, newMarker);

      newMarker.addListener('click', () => {
        getPlaceDetails(placeId, map, newMarker);
      });
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
  color: #000;
`;
