import styled from 'styled-components';
import Places from './places';

const GmapSection = styled.div`
  width: 90%;
  height: 500px;
  background-color: #059418;
`;

export default function Gmap() {
  return (
    <GmapSection>
      <Places />
    </GmapSection>
  );
}
