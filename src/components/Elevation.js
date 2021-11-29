import { CartesianGrid, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useSelector } from 'react-redux';

import { formatElevation, metersToFeet, metersToMiles } from 'lib/helper';

const CustomTooltip = ({ active, payload }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{formatElevation(payload[0].value)}</p>
      </div>
    );
  }

  return null;
};

const ELEVATION_HEIGHT = 175;

const Elevation = ({
  elevationVisible,
  mobileView,
  toggleElevationVisibility,
  width,
  height = ELEVATION_HEIGHT,
}) => {
  const elevationProfile = useSelector((state) => state.search.elevationProfile);

  if (!elevationProfile || !elevationProfile.length) return null;

  if (!elevationVisible) {
    return (
      <div
        className="elevation-open-box"
        // hidden={isMobile && mobileView !== 'map'}
        onClick={toggleElevationVisibility}
      >
        Elevation Profile
      </div>
    );
  }

  const chartData = elevationProfile.map((node) => {
    return {
      elevation: metersToFeet(node.elevation),
      distance: metersToMiles(node.distance),
    };
  });

  return (
    <div className="elevation" /*hidden={isMobile && mobileView !== 'map'}*/>
      <div className="close-box d-print-none" onClick={toggleElevationVisibility}>
        &minus;
      </div>

      <LineChart
        width={width}
        height={height - 5}
        data={chartData}
        margin={{
          left: 15,
          right: 5,
          top: 15,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="elevation" stroke="#0e51ff" dot={false} />
        <XAxis
          dataKey="distance"
          type="number"
          label={{
            value: 'Distance (miles)',
            offset: 0,
            position: 'insideBottom',
            scale: 'linear',
          }}
        />
        <YAxis
          type="number"
          label={{
            value: 'Elevation (feet)',
            angle: -90,
            position: 'insideBottomLeft',
            offset: 10,
            scale: 'linear',
          }}
        />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </div>
  );
};

export default Elevation;
