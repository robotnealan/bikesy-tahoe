import Head from 'next/head';
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

const ELEVATION_HEIGHT = 175;

const IndexPage = () => {
  const dispatch = useDispatch();
  const startAddress = useSelector((state) => state.search.startAddress);
  const endAddress = useSelector((state) => state.search.endAddress);
  const startLocation = useSelector((state) => state.search.startLocation);
  const endLocation = useSelector((state) => state.search.endLocation);
  const elevationProfile = useSelector((state) => state.search.elevationProfile);

  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState('5');
  const [mobileView, setMobileView] = useState('map');
  const [showWelcomeModal, setShowWelcomeModal] = useState(
    appConfig.SHOULD_SHOW_WELCOME_MODAL
  );

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

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
    setMobileView('map');
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

  const changeMobileView = (mobileView) => {
    setMobileView(mobileView);

    if (mobileView === 'map') {
      updateMapSize();
    }
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          key="viewport"
        />
        <meta
          name="description"
          content="Avoid hills and find bike routes with Bikesy.com, an innovative and open-source bike mapping system specially designed to find flat, safe, and fast bike routes anywhere in the San Francisco Bay Area. San Francisco isn’t New York – they might have taller buildings, but we’ve got bigger hills. Since we couldn’t find another service that lets you choose slightly longer but less steep routes, we made our own. Even better, Bikesy automatically gives you an elevation profile for your ride to help you prepare for the tough parts."
        />

        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" type="text/css" href="css/style.css" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="favicon/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="favicon/favicon-16x16.png"
          sizes="16x16"
        />
        <link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="theme-color" content="#ffffff" />

        <script src="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.js"></script>
      </Head>
      <div>
        <TitleBar changeMobileView={changeMobileView} mobileView={mobileView} />

        <Controls
          updateRoute={updateRoute}
          scenario={scenario}
          loading={loading}
          mobileView={mobileView}
          updateControls={updateControls}
        />

        <Directions height={directionsHeight} mobileView={mobileView} />

        <Map
          assignStartLocation={assignStartLocation}
          assignEndLocation={assignEndLocation}
          height={mapHeight}
          mobileView={mobileView}
        />

        <Elevation
          width={elevationWidth}
          height={ELEVATION_HEIGHT}
          toggleElevationVisibility={toggleElevationVisibility}
          elevationVisible={elevationVisible && Boolean(elevationProfile)}
          mobileView={mobileView}
        />

        <WelcomeModal
          showWelcomeModal={showWelcomeModal}
          hideWelcomeModal={hideWelcomeModal}
        />
      </div>
    </>
  );
};

export default IndexPage;
