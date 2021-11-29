import Head from 'next/head';

const About = () => (
  <div>
    <Head>
      <title>About Bikesy</title>
    </Head>

    <div className="container">
      <h2>About Bikesy</h2>
      <p>
        Welcome to <a href="https://bikesy.com">Bikesy</a> – an innovative and open bike
        mapping system specially designed to find flat, safe, and fast routes anywhere in
        the SF Bay Area.
      </p>
      <h2>
        <strong>We’ve never seen so many features, and we bet you haven’t either.</strong>
      </h2>
      <p>
        <strong>Avoid those uphill climbs.</strong>
      </p>
      <p>
        San Francisco isn’t New York – they might have taller buildings, but we’ve got
        bigger hills. Since we couldn’t find another service that lets you choose slightly
        longer but less steep routes, we made our own. Even better, Bikesy automatically
        gives you an elevation profile for your ride to help you prepare for the tough
        parts.
      </p>
      <p>
        <strong>Safety is our number one priority.</strong>
      </p>
      <p>
        It’s not just hills that matter. In a region with as much traffic as the Bay Area,
        you’ll want to stay on bike lanes or paths whenever possible. Bikesy gives the
        flattest AND safest ways to get around.
      </p>
      <p>
        <strong>3 x 3 = 9.</strong>
      </p>
      <p>
        We know that one size doesn’t fit all, and our simple interface automatically
        chooses nine routes for you to pick from, ranging from the safest and most flat to
        the shortest and steepest. It’s easy to choose among three hill tolerances and
        three levels of safety (safe, safer, and safest) to find a path that’s right for
        you.
      </p>
      <p>
        <strong>We’re serious about open source.</strong>
      </p>
      <p>
        This part is a little geeky, but our{' '}
        <a href="https://github.com/brendannee/bikesy-server">back-end</a> and{' '}
        <a href="https://github.com/brendannee/bikesy">front-end</a> code is completely
        open. Plus, all our data is from{' '}
        <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, so you can edit the
        underlying map if you think we’ve got it wrong. Don’t like what we’ve done?{' '}
        <a href="https://github.com/brendannee/bikesy">
          Take our code and do it yourself
        </a>
        ! Or <a href="https://bikesy.com/bikesy-api">use our API</a> to power your own
        app.
      </p>
      <p>
        <strong>We’re cutting edge.</strong>
      </p>
      <p>
        We’ve implemented some cute tricks like automatic geolocation that we think you’ll
        like.
      </p>
      <p>
        <strong>Cute name, but doesn’t Google do it better?</strong>
      </p>
      <p>
        Actually, there are a number of other bike mapping services that work in the Bay
        Area, and they’re all pretty good. We strongly encourage you to try out other
        services to find out how we’re different, but ours is the only site to give you a
        complete elevation profile for your trip and to let you choose from nine
        pre-computed routes.
      </p>
      <p>
        If you find some neat features someone else has implemented that you’d like to see
        on Bikesy, <a href="mailto:info@blinktag.com">let us know</a>.
      </p>
      =
      <p>
        Please, <a href="mailto:info@bikesy.com">let us know</a> if we missed any other
        bike route planners.
      </p>
      <p>
        <strong>Wait, who are you?</strong>
      </p>
      <p>
        Bikesy was started by <a href="https://blinktag.com">BlinkTag Inc</a> with very
        large contributions from{' '}
        <a href="http://www.baytripper.org/about.html">Jerry Jariyasunant</a> and{' '}
        <a href="http://bmander.com/">Brandon Martin-Anderson</a>.
      </p>
    </div>
  </div>
);

export default About;
