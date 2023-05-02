import { api } from './api';

const auth = {

  signin: (data) => {
    return api.authorizationParams(data)
      .then((data) => { localStorage.setItem('token', data.token); });

  },

  signup: (data) => {
    return api.registerParams(data);
  },

  checkToken: (token) => { return api.getUserAuth(token); },

};

export { auth };
