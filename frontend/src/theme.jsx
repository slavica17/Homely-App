import styled from "@emotion/styled";

const Container = styled.div`
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
`;

const Theme = ({ children }) => {
  return (
    <Container>
      {children}
    </Container>
  );
};

export default Theme;