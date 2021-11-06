import React from 'react';

import Card from 'components/Card';

const About = () => (
  <Card>
    <Card.Content>
      <div className="disclaimer">
        We offer no guarantee regarding roadway conditions or safety of the proposed
        routes. Use your best judgment when choosing a route. Obey all vehicle code
        provisions.
      </div>
      <a className="disclaimer" href="https://bikesy.com/about">
        About Bikesy
      </a>
    </Card.Content>
  </Card>
);

export default About;
