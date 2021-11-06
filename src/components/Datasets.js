import React from 'react';

import Card from 'components/Card';

const DATASETS = [
  {
    name: 'Bike Lockers',
    icon: null,
  },
  {
    name: 'Bike Shops',
    icon: null,
  },
];

const Datasets = () => {
  return <Card>{DATASETS.map(({ name, icon }) => name)}</Card>;
};

export default Datasets;
