import 'bootstrap/dist/css/bootstrap.css';

import Header from '../components/header';
import { buildClient } from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (context) => {
  // * we are on the server
  const client = buildClient(context.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(
      context.ctx,
      client,
      data.currentUser
    );
  }

  // * data :
  // * currentUser: {
  // *    id: '5ff9d0a6d44a140023c74ffb',
  // *    email: 'test@test.com',
  // *    iat: 1610210656
  // * }

  // * pageProps:
  // * currentUser: {
  // *     id: '5ff9d0a6d44a140023c74ffb',
  // *     email: 'test@test.com',
  // *     iat: 1610210656
  // * }

  console.log(pageProps);

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
