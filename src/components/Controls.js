import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';

import { clearRoute } from '@redux/slices/search';
import { scenarioToComponents, componentsToScenario } from 'lib/scenarios';
import Crosshairicon from './icons/crosshairs-solid.svg';
import CircleNotchIcon from './icons/circle-notch-solid.svg';

// .controls {
//   padding: 62px 15px 25px;
//   max-width: 320px;
//   margin: 0 auto;

//   .form-group {
//     overflow: hidden;
//     justify-content: space-between;
//   }

//   .start-address {
//     height: 43px;
//     overflow: hidden;
//     margin-bottom: 0;
//     position: relative;

//     .control-label {
//       display: none;
//     }

//     .start-icon {
//       margin-right: 10px;
//       width: 24px;
//       height: 24px;
//       background: #19b566;
//       border-radius: 50%;
//       border: 1px solid #0d5731;
//       text-align: center;
//       color: #fff;
//       font-size: 16px;
//       font-weight: bold;
//       line-height: 22px;
//     }

//     .form-control {
//       vertical-align: 18px;
//       width: 194px;
//       display: inline-block;
//       float: right;
//     }

//     .loading-animation {
//       position: absolute;
//       left: 60px;
//       color: #555;
//       width: 20px;
//       height: 20px;
//       animation-name: spin;
//       animation-duration: 3s;
//       animation-iteration-count: infinite;
//       animation-timing-function: linear;
//       display: none;
//     }

//     &.geolocation-pending {
//       .loading-animation {
//         display: block;
//       }

//       .form-control {
//         color: transparent;
//       }
//     }

//     .btn-geolocation {
//       width: 34px;
//       height: 43px;
//       display: inline-block;
//       float: right;
//       cursor: pointer;
//       padding-left: 4px;
//       padding-right: 4px;
//       margin-left: 6px;
//     }
//   }

//   .end-address {
//     height: 43px;
//     overflow: hidden;
//     margin-bottom: 0;

//     .control-label {
//       display: none;
//     }
//     .end-icon {
//       margin-right: 10px;
//       width: 24px;
//       height: 24px;
//       background: #cf3043;
//       border-radius: 50%;
//       border: 1px solid #58131c;
//       text-align: center;
//       color: #fff;
//       font-size: 16px;
//       font-weight: bold;
//       line-height: 22px;
//     }

//     .form-control {
//       vertical-align: 18px;
//       width: 245px;
//       display: inline-block;
//       float: right;
//     }
//   }

//   .route-type {
//     margin-top: 8px;
//     margin-bottom: 8px;

//     .control-label {
//       line-height: 30px;
//       margin-bottom: 1px;
//     }
//   }

//   .hill-reluctance {
//     margin-bottom: 8px;

//     .control-label {
//       line-height: 30px;
//       margin-bottom: 1px;
//     }
//   }
//   .clear-link {
//     color: #333;
//     line-height: 31px;
//   }

//   .btn-update-route {
//     float: right;
//     display: flex;
//     align-items: center;

//     .loading-animation {
//       width: 20px;
//       height: 20px;
//       margin-right: 6px;
//       animation-name: spin;
//       animation-duration: 3s;
//       animation-iteration-count: infinite;
//       animation-timing-function: linear;
//     }
//   }

//   .disclaimer {
//     clear: both;
//     font-size: 10px;
//     margin-top: 30px;
//   }
// }

// .directions {
//   padding: 10px 15px;

//   h3 {
//     font-size: 14px;
//     margin-top: 0;
//     font-weight: normal;
//   }

//   .directions-list {
//     list-style-type: none;
//     padding: 10px 0 0;

//     li {
//       border-bottom: #ccc 1px solid;
//       padding: 3px 0;
//       font-size: 11px;
//       text-transform: capitalize;
//     }
//   }
// }

const Controls = ({ updateRoute, updateControls, mobileView, scenario, loading }) => {
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
    <div
      className="controls d-print-none"
      // hidden={mobileView !== 'directions' && isMobile}
    >
      <form onSubmit={processForm}>
        <div
          className={classNames('form-group', 'form-inline', 'start-address', {
            'geolocation-pending': geolocationPending,
          })}
        >
          <label className="control-label">Start Location</label>
          <div className="start-icon" title="Start Location">
            S
          </div>
          <input
            type="text"
            value={startAddressInput}
            onChange={handleStartAddressChange}
            className={classNames('form-control', {
              'is-invalid': _.includes(errorFields, 'startAddress'),
            })}
            placeholder={getStartAddressPlaceholder()}
          />
          <CircleNotchIcon className="loading-animation" />
          <a
            className="btn btn-light btn-geolocation"
            title="Use my location"
            onClick={getGeolocation}
          >
            <Crosshairicon />
          </a>
        </div>
        <div className="form-group form-inline end-address">
          <label className="control-label">End Location</label>
          <div className="end-icon" title="End Location">
            E
          </div>
          <input
            type="text"
            value={endAddressInput}
            onChange={handleEndAddressChange}
            className={classNames('form-control', {
              'is-invalid': _.includes(errorFields, 'endAddress'),
            })}
            placeholder="End Address"
          />
        </div>
        <div className="form-group form-inline route-type">
          <label className="control-label">Route Type</label>
          <select
            className="form-control"
            onChange={handleRouteTypeChange}
            value={routeType}
          >
            <option value="1">Mostly bike paths & lanes</option>
            <option value="2">A reasonable route</option>
            <option value="3">A more direct route</option>
          </select>
        </div>
        <div className="form-group form-inline hill-reluctance">
          <label className="control-label">Hill Reluctance</label>
          <select
            className="form-control"
            onChange={handleHillReluctanceChange}
            value={hillReluctance}
          >
            <option value="1">Avoid at all costs</option>
            <option value="2">A reasonable route</option>
            <option value="3">Bring on the Hills!</option>
          </select>
        </div>
        <a href="#" className="clear-link" onClick={() => dispatch(clearRoute())}>
          Clear
        </a>
        <button type="submit" className="btn btn-success btn-update-route">
          {loading && <CircleNotchIcon className="loading-animation" />} Get Directions
        </button>
      </form>
    </div>
  );
};

export default Controls;
