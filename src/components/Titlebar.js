const TitleBar = ({ mobileView, changeMobileView }) => {
  return (
    <div className="titlebar">
      <h1 className="site-title">
        <img
          src="/images/bikesy-logo.png"
          srcSet="/images/bikesy-logo@2x.png 2x"
          alt="logo"
          className="logo"
        />
      </h1>

      {mobileView === 'map' && (
        <button
          className="btn btn-white btn-sm btn-right d-print-none pt-0"
          onClick={() => changeMobileView('directions')}
        >
          Directions
        </button>
      )}

      {mobileView === 'directions' && (
        <button
          className="btn btn-white btn-sm btn-right d-print-none pt-0"
          onClick={() => changeMobileView('map')}
        >
          Map
        </button>
      )}
    </div>
  );
};

export default TitleBar;
