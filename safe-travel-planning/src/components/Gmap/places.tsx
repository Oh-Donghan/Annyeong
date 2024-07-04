import { Libraries, useLoadScript } from "@react-google-maps/api";
import LoadingScreen from "../layout/LoadingScreen";
import Map from "./Map";

const libraries: Libraries = ['places'];

const Places = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_G_MAP_API_KEY,
    libraries,
  });
  
  if (!isLoaded) return <LoadingScreen />;
  return <Map />;
};

export default Places;