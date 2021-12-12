import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';

import Card from 'components/Card';

import { clearRoute } from '@redux/slices/search';
import { scenarioToComponents, componentsToScenario } from 'lib/scenarios';
import Crosshairicon from './icons/crosshairs-solid.svg';
import CircleNotchIcon from './icons/circle-notch-solid.svg';

const LocationInput = styled.input`
  border: none;
  padding: 0.75rem 1rem;
  width: 100%;

  &:first-child {
    border-bottom: 1px solid #ddd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
`;

const Button = styled.button`
  flex: 1 1 auto;
`;

const Controls = ({ updateRoute, updateControls, scenario, loading }) => {
  const dispatch = useDispatch();
  const startAddress = useSelector((state) => state.search.startAddress);
  const endAddress = useSelector((state) => state.search.endAddress);

  const [routeType, setRouteType] = useState('3');
  const [hillReluctance, setHillReluctance] = useState('1');
  const [errorFields, setErrorFields] = useState([]);
  const [geolocationPending, setGeolocationPending] = useState(false);
  const [startAddressInput, setStartAddressInput] = useState('');
  const [endAddressInput, setEndAddressInput] = useState('');

  const processForm = (event) => {
    event.preventDefault();

    updateControls({
      startAddress: startAddressInput,
      endAddress: endAddressInput,
    });
    handleForm();
  };

  const handleStartAddressChange = (event) => {
    setStartAddressInput(event.target.value);
  };

  const handleEndAddressChange = (event) => {
    setEndAddressInput(event.target.value);
  };

  const handleRouteTypeChange = (event) => {
    const scenario = componentsToScenario({
      routeType: event.target.value,
      hillReluctance,
    });

    updateControls({ scenario });
    handleForm();
  };

  const handleHillReluctanceChange = (event) => {
    const scenario = componentsToScenario({
      routeType,
      hillReluctance: event.target.value,
    });

    updateControls({ scenario });
    handleForm();
  };

  const getGeolocation = () => {
    if ('geolocation' in navigator) {
      setGeolocationPending(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateControls({
            startLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
          setGeolocationPending(false);
        },
        () => {
          alert('Unable to use geolocation in your browser.');
          setGeolocationPending(false);
        },
        {
          timeout: 15000,
        }
      );
    } else {
      alert('Geolocation is not available in your browser.');
    }
  };

  const handleForm = () => {
    const errorFields = validateForm();

    if (errorFields.length) {
      setErrorFields(errorFields);
      return false;
    }

    setErrorFields([]);

    return updateRoute(startAddressInput, endAddressInput);
  };

  const validateForm = () => {
    const errorFields = [];
    if (!startAddress) {
      errorFields.push('startAddress');
    }

    if (!endAddress) {
      errorFields.push('endAddress');
    }

    return errorFields;
  };

  const getStartAddressPlaceholder = () => {
    if (geolocationPending) {
      return '';
    }

    return 'Start Address';
  };

  useEffect(() => {
    const components = scenarioToComponents(scenario);
    if (components.hillReluctance !== hillReluctance) {
      setHillReluctance(components.hillReluctance);
    }

    if (components.routeType !== routeType) {
      setRouteType(components.routeType);
    }
  }, [scenario]);

  useEffect(() => {
    if (startAddress !== startAddressInput) {
      setStartAddressInput(startAddress);
    }
  }, [startAddress]);

  useEffect(() => {
    if (endAddress !== endAddressInput) {
      setEndAddressInput(endAddress);
    }
  }, [endAddress]);

  return (
    <div className="controls d-print-none">
      <form onSubmit={processForm}>
        <Card>
          <LocationInput type="text" value={startAddressInput} />
          <LocationInput type="text" value={endAddressInput} />
        </Card>

        <Card>
          <label className="sr-only">Route Type</label>
          <ButtonGroup>
            <Button onChange={handleRouteTypeChange}>1</Button>
            <Button onChange={handleRouteTypeChange}>1</Button>
          </ButtonGroup>
        </Card>

        {/* <a href="#" className="clear-link" onClick={() => dispatch(clearRoute())}>
          Clear
        </a>

        <button type="submit" className="btn btn-success btn-update-route">
          {loading && <CircleNotchIcon className="loading-animation" />} Get Directions
        </button> */}
      </form>
    </div>
  );
};

export default Controls;
