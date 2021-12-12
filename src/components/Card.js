import styled from 'styled-components';

const StyledCard = styled.div`
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 0.8rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
  width: 300px;
`;

const StyledCardContent = styled.div`
  padding: 1rem;
`;

const Card = ({ children }) => <StyledCard>{children}</StyledCard>;

export const CardContent = ({ children }) => (
  <StyledCardContent>{children}</StyledCardContent>
);

Card.Content = CardContent;

export default Card;
