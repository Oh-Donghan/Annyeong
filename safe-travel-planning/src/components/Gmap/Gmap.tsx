import styled from 'styled-components';
import GMap from "./GoogleMap";

const GmapSection = styled.div`
  width: 90%;
  height: 500px;
  position: relative;
`;

export default function Gmap() {
  return (
    <GmapSection>
      <GMap />
    </GmapSection>
  );
}