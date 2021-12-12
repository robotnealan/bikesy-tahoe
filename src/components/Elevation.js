import { CartesianGrid, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useSelector } from 'react-redux';

import { formatElevation, metersToFeet, metersToMiles } from 'lib/helper';

// .elevation {
//   background: #fff;
//   position: relative;
//   border-left: 1px solid #ccc;
//   border-top: 1px solid #ccc;
//   box-sizing: border-box;
//   height: 175px;

//   .close-box {
//     position: absolute;
//     z-index: 1;
//     top: 2px;
//     right: 2px;
//     color: #333;
//     cursor: pointer;
//     width: 20px;
//     height: 20px;
//     text-align: center;
//     line-height: 20px;
//     font-size: 20px;
//   }

//   .legend {
//     display: none;
//   }

//   .grid-axis .tick {
//     display: none;
//   }
// }

const CustomTooltip = ({ active, payload }) => {
  if (!active) return null;

  return (
    <div className="custom-tooltip">
      <p className="label">{formatElevation(payload[0].value)}</p>
    </div>
  );
};

const ELEVATION_HEIGHT = 175;

const Elevation = ({
  elevationVisible,
  toggleElevationVisibility,
  width,
  height = ELEVATION_HEIGHT,
}) => {
  const elevationProfile = useSelector((state) => state.search.elevationProfile);

  if (!elevationProfile || !elevationProfile.length) return null;

  if (!elevationVisible) {
    return (
      <div className="elevation-open-box" onClick={toggleElevationVisibility}>
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
    <div className="elevation">
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
