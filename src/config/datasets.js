const DATASETS = [{
        name: 'Construction',
        id: 'ck3pdyl2g5fn42tpnfsh5pibh',
        icon: null,
    },
    {
        name: 'Bike Parking',
        id: 'ck3pdz0lj0ezu2injv641rf8z',
        icon: null,
    },
    {
        name: 'Bike Shops',
        id: 'ck3pdzfet26fm2ilhadvn614o',
        icon: null,
    },
    {
        name: 'Winter Bike Paths',
        endpoint: 'trpa.org/blah.geojson',
        filter: (data) => data.type === 'WINTER_PATH',
    },
];

export default DATASETS;