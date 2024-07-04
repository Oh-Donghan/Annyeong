import styled from 'styled-components';
import GMap from "./GoogleMap";
// import Places from './Places'

const GmapSection = styled.div`
  width: 90%;
  height: 500px;
  /* background-color: #059418; */
  position: relative;
`;

export default function Gmap() {
  return (
    <GmapSection>
      <GMap />
      {/* <Places /> */}
    </GmapSection>
  );
}