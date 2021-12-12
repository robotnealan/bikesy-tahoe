import Head from 'next/head';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import polyline from '@mapbox/polyline';
import { useSelector } from 'react-redux';

import Controls from 'components/Controls';
import Directions from 'components/Directions';
import Elevation from 'components/Elevation';
import Map from 'components/Map';
import TitleBar from 'components/Titlebar';
import WelcomeModal from 'components/WelcomeModal';

import { getRoute } from 'lib/api';
import { logQuery } from 'lib/analytics';
import { handleError } from 'lib/error';
import { geocode, reverseGeocode } from 'lib/geocode';
import { latlngIsWithinBounds, updateMapSize, getPathDistance } from 'lib/map';
import { updateUrlParams, readUrlParams, validateUrlParams } from 'lib/url';

import {
  clearPath,
  setStartLocation,
  setStartAddress,
  setEndLocation,
  setEndAddress,
  setPath,
  setDistance,
  setDirections,
  setElevationProfile,
} from '@redux/slices/search';

import appConfig from 'appConfig';
import Card from '../components/Card';

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 1rem;
  position: fixed;
  top: 1rem;
  z-index: 2;
`;

const SidebarTop = styled.div`
  flex: 1 1 auto;
`;

const SidebarBottom = styled.div`
  flex: 0 1 auto;
`;

const Disclaimer = styled.div`
  font-size: 0.75rem;
`;

const IndexPage = () => {
  const dispatch = useDispatch();
  const startAddress = useSelector((state) => state.search.startAddress);
  const endAddress = useSelector((state) => state.search.endAddress);
  const startLocation = useSelector((state) => state.search.startLocation);
  const endLocation = useSelector((state) => state.search.endLocation);
  const elevationProfile = useSelector((state) => state.search.elevationProfile);

  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState('5');
  const [showWelcomeModal, setShowWelcomeModal] = useState(
    appConfig.SHOULD_SHOW_WELCOME_MODAL
  );

  const [elevationVisible, setElevationVisible] = useState(false);

  const updateRoute = async (selectedStartAddress, selectedEndAddress) => {
    dispatch(clearPath());
    setLoading(true);
    setShowWelcomeModal(false);

    const results = await Promise.all([
      geocode(selectedStartAddress).catch(() => {
        setLoading(false);
        alert('Invalid start address. Please try a different address.');
      }),
      geocode(selectedEndAddress).catch(() => {
        setLoading(false);
        alert('Invalid end address. Please try a different address.');
      }),
    ]);

    if (!results || !results[0] || !results[1]) {
      setLoading(false);
      return;
    }

    if (!latlngIsWithinBounds(results[0], 'start')) {
      setLoading(false);
      return;
    }

    if (!latlngIsWithinBounds(results[1], 'end')) {
      setLoading(false);
      return;
    }

    dispatch(setStartLocation(results[0]));
    dispatch(setEndLocation(results[1]));
    // setMobileView('map');
  };

  const fetchRoute = async () => {
    setLoading(true);

    try {
      const results = await getRoute(startLocation, endLocation, scenario);
      setLoading(false);

      if (!results.path || !results.path.length) {
        handleError(new Error('No path received'));
        return;
      }

      const geoJSONPath = polyline.toGeoJSON(results.path[0]);

      dispatch(setPath(geoJSONPath));
      dispatch(setDistance(getPathDistance(geoJSONPath)));
      dispatch(setDirections(results.directions));
      dispatch(
        setElevationProfile(
          results.elevation_profile.map((node) => {
            return {
              distance: node[0],
              elevation: node[1],
            };
          })
        )
      );

      logQuery(startAddress, endAddress, startLocation, endLocation);
    } catch (error) {
      handleError(error);
    }
  };

  const assignStartLocation = (latlng) => {
    dispatch(clearPath());
    dispatch(setStartLocation(latlng));
    dispatch(setStartAddress(''));

    reverseGeocode(latlng).then((address) => {
      if (!address)
        return handleError(new Error('Unable to get reverse geocoding result.'));

      dispatch(setStartAddress(address));
    });
  };

  const assignEndLocation = (latlng) => {
    dispatch(clearPath());
    dispatch(setEndLocation(latlng));
    dispatch(setEndAddress(''));

    reverseGeocode(latlng).then((address) => {
      if (!address) return handleError('Unable to get reverse geocoding result.');

      dispatch(setEndAddress(address));
    });
  };

  const updateControls = (items) => {
    if (items.startLocation) assignStartLocation(items.startLocation);
    if (items.scenario) setScenario(items.scenario);
    if (items.startAddress !== undefined) dispatch(setStartAddress(items.startAddress));
    if (items.endAddress !== undefined) dispatch(setEndAddress(items.endAddress));
  };

  const toggleElevationVisibility = () => {
    setElevationVisible(!elevationVisible);
    updateMapSize();
  };

  const hideWelcomeModal = (event) => {
    event.preventDefault();
    setShowWelcomeModal(false);
  };

  useEffect(() => {
    const urlParameters = readUrlParams();

    if (validateUrlParams(urlParameters)) {
      dispatch(setStartAddress(urlParameters[0]));
      dispatch(setEndAddress(urlParameters[1]));
      setScenario(urlParameters[2]);

      updateRoute(urlParameters[0], urlParameters[1]);
    }
  }, []);

  useEffect(() => {
    if (startLocation && endLocation) fetchRoute();
  }, [startLocation, endLocation]);

  useEffect(() => {
    if (startAddress && endAddress) updateUrlParams([startAddress, endAddress, scenario]);
  }, [startAddress, endAddress, scenario]);

  return (
    <>
      <Head>
        <title>{appConfig.PAGE_TITLE}</title>
      </Head>

      <Wrapper>
        <Sidebar>
          <SidebarTop>
            <TitleBar />

            <Controls
              updateRoute={updateRoute}
              scenario={scenario}
              loading={loading}
              updateControls={updateControls}
            />

            <Directions />
          </SidebarTop>

          <SidebarBottom>
            <Card>
              <Card.Content>
                <Disclaimer>
                  We offer no guarantee regarding roadway conditions or safety of the
                  proposed routes. Use your best judgment when choosing a route. Obey all
                  vehicle code provisions.
                  <a className="disclaimer" href={appConfig.ABOUT_LINK_URL}>
                    {appConfig.ABOUT_LINK_TITLE}
                  </a>
                </Disclaimer>
              </Card.Content>
            </Card>
          </SidebarBottom>
        </Sidebar>

        <Map
          assignStartLocation={assignStartLocation}
          assignEndLocation={assignEndLocation}
        />

        <Elevation
          toggleElevationVisibility={toggleElevationVisibility}
          elevationVisible={elevationVisible && Boolean(elevationProfile)}
        />

        <WelcomeModal
          showWelcomeModal={showWelcomeModal}
          hideWelcomeModal={hideWelcomeModal}
        />
      </Wrapper>
    </>
  );
};

export default IndexPage;
