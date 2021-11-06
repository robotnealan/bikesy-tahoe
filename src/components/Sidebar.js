/* global window, alert */

import React from 'react';
import styled from 'styled-components';

import About from 'components/About';
import Controls from 'components/Controls';
import Datasets from 'components/Datasets';
import Directions from 'components/Directions';
import MapLegend from 'components/MapLegend';
import Titlebar from 'components/Titlebar';

const StyledSidebar = styled.div``;

const SidebarTop = styled.div`
  flex: 1 1 auto;
  left: 1rem;
  position: fixed;
  top: 3rem;
  width: 20rem;
  z-index: 5;
`;

const SidebarBottom = styled.div`
  bottom: 0;
  flex: 0 0 auto;
  left: 1rem;
  position: fixed;
  width: 26rem;
  z-index: 5;
`;

const Sidebar = () => (
  <StyledSidebar>
    <SidebarTop>
      <Titlebar />
      <Controls />
      <Datasets />
      <Directions />
    </SidebarTop>

    <SidebarBottom>
      <MapLegend />
      <About />
    </SidebarBottom>
  </StyledSidebar>
);

export default Sidebar;
