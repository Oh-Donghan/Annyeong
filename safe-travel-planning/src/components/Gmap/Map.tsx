import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import LoadingScreen from '../layout/LoadingScreen';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import styled from 'styled-components';
import PlacesAutocomplete from './PlacesAutocomplete';

export interface SelectedPlace {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
  photos?: google.maps.places.PlaceResult[];
  rating?: number;
}

const Map = () => {
  const { countryId: country } = useParams<{ countryId: string }>();
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [selected, setSelected] = useState<SelectedPlace | null>(null);
  const [info, setInfo] = useState<SelectedPlace | null>(null);

  useEffect(() => {
    const fetchCountryLocation = async () => {
      try {
        const results = await getGeocode({ address: country });
        if (results.length === 0) {
          throw new Error('No results found for the given country name.');
        }
        const { lat, lng } = await getLatLng(results[0]);
        setCenter({ lat, lng });
      } catch (error) {
        console.error('Error fetching country location:', error);
        alert(
          '국가의 위치를 가져오는 데 문제가 발생했습니다. 국가명을 확인해주세요.'
        );
      }
    };

    fetchCountryLocation();
  }, [country]);

  if (!center) return <LoadingScreen />;

  const GOOGLE_API_KEY = import.meta.env.VITE_G_MAP_API_KEY; // 환경 변수에서 API 키를 가져옴

  const getPhotoUrl = (photoReference: string) => {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
    const maxWidth = 100; // 최대 너비 설정
    return `${baseUrl}?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
  };

  return (
    <>
      <div>
        <PlacesAutocomplete
          setSelected={setSelected}
          setInfo={setInfo}
          country={country!}
        />
      </div>

      <GoogleMap
        zoom={16}
        center={selected || center}
        mapContainerClassName='map-container'
      >
        {selected && (
          <Marker position={selected} onClick={() => setInfo(selected)} />
        )}

        {info && (
          <InfoWindow position={info} onCloseClick={() => setInfo(null)}>
            <InfoWindowContent>
              <h2>{info.name}</h2>
              <p>{info.address}</p>
              {info.photos && info.photos.length > 0 ? (
                <img
                  src={getPhotoUrl(info.photos[0].photo_reference)}
                  alt={info.name}
                  style={{ width: '100px', height: 'auto' }}
                />
              ) : (
                <p>No image available</p>
              )}
              <p>Rating: {info.rating ? info.rating : 'no info'}</p>
            </InfoWindowContent>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
};

export default Map;

const InfoWindowContent = styled.div`
  h2 {
    margin: 0;
    color: #000;
  }

  p {
    margin: 5px 0;
    color: #000;
  }
`;
