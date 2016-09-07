const React = require('react');
const classNames = require('classnames');

const map = require('../js/map');
const config = require('../../frontendconfig.json');

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleMapClick = (latlng) => {
      if (!this.props.startLocation) {
        if (map.latlngIsWithinBounds(latlng)) {
          this.props.setStartLocation(latlng);
        }
      } else if (!this.props.endLocation) {
        if (map.latlngIsWithinBounds(latlng)) {
          this.props.setEndLocation(latlng);
        }
      }
    };

    this.handleMarkerDrag = (latlng, type) => {
      if (map.latlngIsWithinBounds(latlng)) {
        if (type === 'start') {
          this.props.setStartLocation(latlng);
        } else if (type === 'end') {
          this.props.setEndLocation(latlng);
        }
      }
    };
  }

  componentDidMount() {
    const point = [config.initialCenterLat, config.initialCenterLng];
    const draggable = !this.props.isMobile;
    map.drawMap(point, config.initialZoom, config.minZoom, draggable, this.handleMapClick, this.handleMarkerDrag);
  }

  componentWillReceiveProps(nextProps) {
    map.updateStartMarker(nextProps.startLocation);
    map.updateEndMarker(nextProps.endLocation);
    map.updatePath(nextProps.decodedPath);
    map.updateMapSize();
  }

  render() {
    return (
      <div
        className={classNames(
          'map-container',
          { hide: this.props.isMobile && this.props.mobileView !== 'map' }
        )}
      >
        <div className="logo">
          <img src="/img/bikesy-logo.png" srcSet="img/bikesy-logo@2x.png 2x" alt="logo" />
        </div>
        <div className="map" id="map" style={{ height: `${this.props.height}px` }}></div>
      </div>
    );
  }
}

Map.propTypes = {
  startLocation: React.PropTypes.object,
  endLocation: React.PropTypes.object,
  setStartLocation: React.PropTypes.func.isRequired,
  setEndLocation: React.PropTypes.func.isRequired,
  height: React.PropTypes.number,
  isMobile: React.PropTypes.bool.isRequired,
  mobileView: React.PropTypes.string,
};

module.exports = Map;