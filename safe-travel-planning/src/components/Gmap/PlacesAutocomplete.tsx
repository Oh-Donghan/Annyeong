import axios from "axios";
import { getCode } from "country-list";
import styled from "styled-components";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { SelectedPlace } from "./Map";

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
  const countryCode = getCode(country) || country.toLowerCase();

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
      console.log(results);
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
    console.log(response.data);
    
    const place = response.data.result;
    return {
      name: place?.name,
      address: place?.formatted_address,
      photos: place?.photos || [],
      rating: place?.rating,
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

export default PlacesAutocomplete;

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

