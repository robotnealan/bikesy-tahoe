import App from 'next/app';
import { Provider } from 'react-redux';

import store from '@redux/store';

import '../style.css';
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default MyApp;
