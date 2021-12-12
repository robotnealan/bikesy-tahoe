// .titlebar {
//   height: 37px;
//   background-color: #f1f0f0;
//   border-bottom: 1px solid #ccc;
//   position: fixed;
//   width: 100%;
//   z-index: 10;

//   .site-title {
//     font-size: 14px;
//     margin: 0;
//     line-height: 35px;
//     padding-left: 10px;

//     .logo {
//       height: 30px;
//     }

//     .titlebar-text {
//       padding-left: 6px;
//     }
//   }

//   .btn-left {
//     position: absolute;
//     left: 0;
//     top: 0;
//     margin: 3px 5px;
//   }

//   .btn-right {
//     position: absolute;
//     right: 0;
//     top: 0;
//     margin: 4px 5px;
//   }
// }

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
