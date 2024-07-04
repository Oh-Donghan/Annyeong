import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

interface PlaceProps {
  onSelect: (position: google.maps.LatLngLiteral) => void;
}

const GoogleAutoComplete: React.FC<PlaceProps> = ({ onSelect }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({ requestOptions: {}, debounce: 300 });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: { description: string }) =>
    async () => {
      setValue(description, false);
      clearSuggestions();

      try {
        const results = await getGeocode({ address: description });
        const { lat, lng } = await getLatLng(results[0]);
        onSelect({ lat, lng });
      } catch (error) {
        console.log('Error', error);
      }
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          {main_text} {secondary_text}
        </li>
      );
    });

  return (
    <div>
      <input
        type='text'
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder='Search for places'
      />
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};
export default GoogleAutoComplete;
