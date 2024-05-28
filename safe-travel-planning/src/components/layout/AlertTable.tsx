import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -105%);
  width: 400px;
  background-color: #fff;
`

const StyledTable = styled.table`
  width: 100%;
  height: 100%;
  border-collapse: collapse; // 테두리 분리 방지
  border: 1px solid #0044cc;
`;

const StyledThead = styled.thead`
  background-color: #0044cc; // 헤더 배경색
  color: white; // 헤더 텍스트 색상

  th {
    padding: 10px; // 헤더 셀 패딩
  }
`;

const StyledTd = styled.td`
  border: 1px solid #ddd; // 셀 테두리
  padding: 8px; // 셀 패딩
  text-align: center; // 텍스트 중앙 정렬
  font-size: 12px;
  color: #333D79;
`;

export default function AlertTable() {
  return (
    <Wrapper>
      <StyledTable>
        <StyledThead>
          <tr>
            <th colSpan={3}>단계별 여행경보</th>
          </tr>
        </StyledThead>
        <tbody>
          <tr>
            <StyledTd>1단계</StyledTd>
            <StyledTd>남색경보</StyledTd>
            <StyledTd>여행유의 신변안전 위험 요인 숙지·대비</StyledTd>
          </tr>
          <tr>
            <StyledTd>2단계</StyledTd>
            <StyledTd>황색경보</StyledTd>
            <StyledTd>여행자제 (체류자) 신변안전 특별유의</StyledTd>
          </tr>
          <tr>
            <StyledTd>3단계</StyledTd>
            <StyledTd>적색경보</StyledTd>
            <StyledTd>출국권고 (체류자) 긴요한 용무가 아닌 한 출국</StyledTd>
          </tr>
          <tr>
            <StyledTd>4단계</StyledTd>
            <StyledTd>흑색경보</StyledTd>
            <StyledTd>여행금지</StyledTd>
          </tr>
        </tbody>
      </StyledTable>
    </Wrapper>
  );
}
