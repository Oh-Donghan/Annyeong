import React, { useCallback, useEffect, useState } from 'react';
import { getCode } from 'country-list';
import styled from "styled-components";
import { debounce } from "lodash";

interface PlaceProps {
  onSelect: (selection: { latLng: google.maps.LatLngLiteral, placeId: string}) => void;
  countryId: string;
}

const GoogleAutoComplete: React.FC<PlaceProps> = ({ onSelect, countryId }) => {
  // 입력된 텍스트값 저정 상태
  const [value, setValue] = useState('');
  // Places API에서 받아온 주소 자동완성 결과 저장 상태
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  // Places의 AutocompleteService 저장 상태 - 주소 자동완성 요청을 보냄
  const [service, setService] = useState<google.maps.places.AutocompleteService | null>(null);
  const countryCode = getCode(countryId) || countryId.toUpperCase();
  
  useEffect(() => {
    if (!service) {
      setService(new google.maps.places.AutocompleteService());
    }
  }, [service]);

  // 과도한 검색 호출을 방지하기위한 디바운스 함수
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInput = useCallback(debounce((inputValue: string) => {
    if (inputValue.length > 0 && service) {
      service.getPlacePredictions(
        {
          input: inputValue,
          componentRestrictions: { country: countryCode },
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  }, 300), [service, countryCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    handleInput(inputValue);
  };

  // 검색해서 나온 리스트를 클릭하면 호출
  const handleSelect = async (description: string, placeId: string) => {
    setValue('');
    setSuggestions([]);

    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 
        address: description,
        componentRestrictions: { country: countryCode }
      }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          onSelect({ latLng: {lat: lat(), lng: lng()}, placeId});
        }
      });
    } catch (error) {
      console.error('Error', error);
    }
  };

  const renderSuggestions = () => (
    suggestions.length > 0 && (
      <List>
        {suggestions.map((suggestion) => {
          const { place_id, structured_formatting: { main_text, secondary_text } } = suggestion;
          return (
            <ListItem key={place_id} onClick={() => handleSelect(suggestion.description, suggestion.place_id)}>
              {main_text} {secondary_text}
            </ListItem>
          );
        })}
      </List>
    )
  );

  return (
    <Wrapper>
      <Input
        type='text'
        value={value}
        onChange={handleChange}
        placeholder='Search for places'
      />
      {renderSuggestions()}
    </Wrapper>
  );
};

export default GoogleAutoComplete;

const Wrapper = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 300px;
  padding: 8px 10px;
  background-color: ${props => props.theme.textColor};
  color:${props => props.theme.bgColor};
  outline: none;
  font-size: 16px;
  border-radius: 5px;
`

const List = styled.ul`
  position: absolute;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.textColor};
  color:${props => props.theme.bgColor};
  border-top: 1px solid ${props => props.theme.bgColor};
  z-index: 100;
  padding: 5px;
  gap: 5px;
  border-radius: 5px;
`

const ListItem = styled.li`
  padding: 8px 0;
  /* outline: 1px solid red; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 280px;
  cursor: pointer;
  font-size: 13px;
`

