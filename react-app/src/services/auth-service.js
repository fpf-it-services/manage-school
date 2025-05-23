import HttpService from "./htttp.service";

class AuthService {
  login = async (payload) => {
    const loginEndpoint = 'login';
    return await HttpService.post(loginEndpoint, payload);
  };

  depotDossier = async (payload) => {
    console.log(payload)
    const loginEndpoint = 'inscription/attente/eleve';
    return await HttpService.post(loginEndpoint, payload);
  };

  register = async (credentials) => {
    const registerEndpoint = 'inscription/attente';
    return await HttpService.post(registerEndpoint, credentials);
  };

  logout = async (role) => {
    let logoutEndpoint;
    if(role === "admin"){
      logoutEndpoint = 'logout'
    } else if(role === "ecole"){
      logoutEndpoint = 'ecole/logout'
    } else {
      logoutEndpoint = 'parents/logout'
    }
    return await HttpService.post(logoutEndpoint);
  };

  forgotPassword = async (payload) => {
    const forgotPassword = 'password-forgot';
    return await HttpService.post(forgotPassword, payload);
  }

  resetPassword = async (credentials) => {
    const resetPassword = 'password-reset';
    return await HttpService.post(resetPassword, credentials);
  }

  getProfile = async(user) => { 
    let getProfile;
    user === 'admin' ? getProfile= 'me' : getProfile= 'ecole/me'
    return await HttpService.get(getProfile);
  }

  updateProfile = async (newInfo) => {
    const updateProfile = "update-profile";
    return await HttpService.put(updateProfile, newInfo);
  }
}

export default new AuthService();
