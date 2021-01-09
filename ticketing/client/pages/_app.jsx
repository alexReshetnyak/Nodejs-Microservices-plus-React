import 'bootstrap/dist/css/bootstrap.css';
import { buildClient } from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header! {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // * we are on the server
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  // data : {
  //   currentUser: {
  //     id: '5ff9d0a6d44a140023c74ffb',
  //     email: 'test@test.com',
  //     iat: 1610210656
  //   }
  // }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
