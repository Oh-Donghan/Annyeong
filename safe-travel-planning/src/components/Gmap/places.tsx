import { useState, useEffect } from 'react';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import styled from 'styled-components';
import { getCode } from 'country-list';
import LoadingScreen from "../layout/LoadingScreen";

interface SelectedPlace {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
  photos?: google.maps.places.PlacePhoto[];
  rating?: number;
}

const Places: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_G_MAP_API_KEY,
    libraries: ['places'],
  });

  if (!isLoaded) return <LoadingScreen />;
  return <Map />;
};

const Map: React.FC = () => {
  const { countryId: country } = useParams<{ countryId: string }>();
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [selected, setSelected] = useState<SelectedPlace | null>(null);
  const [info, setInfo] = useState<SelectedPlace | null>(null);

  console.log(country);

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
      <h1>{country?.toUpperCase()}</h1>
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
        mapContainerClassName="map-container"
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

interface PlacesAutocompleteProps {
  setSelected: React.Dispatch<React.SetStateAction<SelectedPlace | null>>;
  setInfo: React.Dispatch<React.SetStateAction<SelectedPlace | null>>;
  country: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  setSelected,
  setInfo,
  country,
}) => {
  const countryCode = getCode('country') || country.toLowerCase();

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: countryCode }, // 국가 내에서만 검색되도록 설정
    },
  });

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      if (results.length === 0) {
        throw new Error('No results found for the given address.');
      }
      const { lat, lng } = await getLatLng(results[0]);
      const placeDetails = await getPlaceDetails(results[0].place_id);

      const selectedPlace = { lat, lng, ...placeDetails };
      setSelected(selectedPlace);
      setInfo(selectedPlace);
    } catch (error) {
      console.error('Error fetching place details:', error);
      alert(
        '주소의 위치를 가져오는 데 문제가 발생했습니다. 주소를 확인해주세요.'
      );
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    const response = await axios.get('/proxy/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: import.meta.env.VITE_G_MAP_API_KEY,
      },
    });
    console.log('API Response for place details:', response.data); // 응답 로깅
    const place = response.data.result;
    return {
      name: place.name,
      address: place.formatted_address,
      photos: place.photos || [],
      rating: place.rating,
    };
  };

  return (
    <ComboboxWrapper>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search an address"
      />
      {status === 'OK' && (
        <List>
          {data.map(({ place_id, description }) => (
            <ListItem key={place_id} onClick={() => handleSelect(description)}>
              {description}
            </ListItem>
          ))}
        </List>
      )}
    </ComboboxWrapper>
  );
};

const ComboboxWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  color: #000;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  color: #000;
`;

const List = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  z-index: 1000;
  color: #000;
`;

const ListItem = styled.li`
  padding: 10px;
  cursor: pointer;
  color: #000;

  &:hover {
    background-color: #f0f0f0;
  }
`;

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

export default Places;