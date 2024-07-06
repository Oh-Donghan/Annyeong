import styled from 'styled-components';
import GMap from "./GoogleMap";

const GmapSection = styled.div`
  position: relative;
  width: 90%;
  height: 500px;
  margin-bottom: 100px;
`;

export default function Gmap() {
  return (
    <GmapSection>
      <GMap />
    </GmapSection>
  );
}