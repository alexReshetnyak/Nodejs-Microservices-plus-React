import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log('I am in the component', currentUser);

  return <h1>Landing page</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    // * We are on the server
    // * Option 1
    // const { data } = await axios.get(
    //   'http://auth-srv:3000/api/users/currentuser'
    // );

    // * Option 2
    const { data } = await axios.get(
      'http://alexey-release-ingress-nginx-controller.default.svc.cluster.local/api/users/currentuser',
      {
        headers: {
          Host: 'ticketing.dev',
        },
      }
    );

    return data;
  }

  // * We are on the browser
  const { data } = await axios.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
