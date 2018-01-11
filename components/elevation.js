const React = require('react');
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
const classNames = require('classnames');

const helper = require('../lib/helper');

class CustomTooltip extends React.Component {
  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      return (
        <div className="custom-tooltip">
          <p className="label">{helper.formatElevation(payload[0].value)}</p>
        </div>
      );
    }

    return null;
  }
}

class Elevation extends React.Component {
  getYDomain(elevationProfile) {
    return elevationProfile.reduce((memo, item) => {
      return [Math.min(memo[0], item.elevation), Math.max(memo[1], item.elevation)];
    }, [Infinity, -Infinity]);
  }

  formatX(d) {
    return d.distance;
  }

  formatElevationProfile() {
    return this.props.elevationProfile.map((item) => {
      return {
        elevation: helper.metersToFeet(item[1]),
        distance: helper.metersToMiles(item[0]),
      };
    });
  }

  render() {
    if (!this.props.elevationProfile || !this.props.elevationProfile.length) {
      return <div />;
    }

    if (!this.props.elevationVisible) {
      return (
        <div
          className={classNames(
            'elevation-open-box',
            { hide: this.props.isMobile && this.props.mobileView !== 'map' }
          )}
          onClick={this.props.toggleElevationVisibility}
        >Elevation Profile</div>
      );
    }

    const elevationProfile = this.formatElevationProfile();

    return (
      <div
        className={classNames(
          'elevation',
          { hide: this.props.isMobile && this.props.mobileView !== 'map' }
        )}
      >
        <div
          className="close-box"
          onClick={this.props.toggleElevationVisibility}
        >&minus;</div>

        <LineChart
          width={this.props.width}
          height={this.props.height - 5}
          data={elevationProfile}
          margin={{
            left: 5,
            right: 5,
            top: 5,
            bottom: 5
          }}
        >
          <Line type="monotone" dataKey="elevation" stroke="#0e51ff" dot={false} />
          <XAxis dataKey="distance" type="number" ticks={[0, 5, 10]} label={{value: 'Distance (miles)', offset: 0, position: 'insideBottom'}} />
          <YAxis type="number" label={{ value: 'Elevation (feet)', angle: -90, position: 'insideBottomLeft', offset: 10}} />
          <Tooltip content={<CustomTooltip />}/>
        </LineChart>
      </div>
    );
  }
}

Elevation.propTypes = {
  elevationProfile: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number.isRequired,
  elevationVisible: PropTypes.bool,
  toggleElevationVisibility: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  mobileView: PropTypes.string,
};

export default Elevation;