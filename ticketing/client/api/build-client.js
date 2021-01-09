import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // * we are on the server

    // * Option 1
    // return axios.create({
    //   baseURL: 'http://auth-srv:3000'
    // });

    // * Option 2
    return axios.create({
      baseURL:
        'http://alexey-release-ingress-nginx-controller.default.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // * we are on the browser
    return axios.create({ baseURL: '/' });
  }
};
