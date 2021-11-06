import React, { useState } from 'react';
import styled from 'styled-components';

import Card from 'components/Card';

const LAYERS = [
  { name: 'Multi-Use Path', color: '#330066' },
  { name: 'Bike Lane', color: 'hsl(280, 97%, 48%)' },
  { name: 'Bike Route', color: 'hsl(280, 59%, 71%)' },
];

const Wrapper = styled.div`
  display: flex;
`;

const Layer = styled.div`
  align-items: center;
  display: flex;
  margin-right: 1.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

const LayerIcon = styled.div`
  background: ${({ color }) => color};
  border-radius: 0.4rem;
  height: 0.3rem;
  margin-right: 0.6rem;
  opacity: 0.6;
  width: 1rem;
`;

const LayerLabel = styled.span`
  font-size: 0.875rem;
  margin-bottom: 0;
  padding: 2px 0;
  white-space: nowrap;
`;

const MapLegend = () => (
  <Card>
    <Card.Content>
      <Wrapper>
        {LAYERS.map(({ name, color }) => (
          <Layer>
            <LayerIcon color={color} />
            <LayerLabel>{name}</LayerLabel>
          </Layer>
        ))}
      </Wrapper>
    </Card.Content>
  </Card>
);

export default MapLegend;
