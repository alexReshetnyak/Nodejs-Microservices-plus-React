import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log('I am in the component', currentUser);

  // axios.get('/api/users/currentuser');

  return <h1>Landing page</h1>;
};

LandingPage.getInitialProps = async () => {
  console.log('I am on the server!');

  const response = await axios.get('/api/users/currentuser');

  return response.data;
};

export default LandingPage;
