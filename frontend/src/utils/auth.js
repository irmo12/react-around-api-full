import {regApi} from './api';

const auth = {

  signin: (data) => {
    return regApi.authorizationParams(data)
    .then((data) => {localStorage.setItem('token', data.token)})
    
},

  signup: (data) => { 
    return regApi.registerParams(data);
},

  checkToken: (token) => { return regApi.getUserAuth(token) },

};

export {auth};
