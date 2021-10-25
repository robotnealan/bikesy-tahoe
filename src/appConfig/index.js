import defaults from 'appConfig/default.js';
import sf from 'appConfig/sf.js';
import tahoe from 'appConfig/tahoe.js';

const region = process.env.NEXT_PUBLIC_REGION;

const combined_config = { ...defaults };
if (region === 'sf') {
  Object.assign(combined_config, sf);
} else if (region === 'tahoe') {
  Object.assign(combined_config, tahoe);
}

export default combined_config;
