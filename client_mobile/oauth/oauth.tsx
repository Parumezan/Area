import AsyncStorage from '@react-native-async-storage/async-storage';
import {authorize, logout} from 'react-native-app-auth';
import {getLocalApiUrl, getStorageToken} from '../providers/token';

export async function logoutOauth(config: any, redirect: any) {
  await logout(config, redirect).catch(error => {
    console.log(error);
    return null;
  });
}

export async function signOauth(
  backPath: string,
  idTokenName: string,
  signConfig: any,
  logoutConfig: any,
) {
  //   const apiUrl = await getLocalApiUrl();
  //   const idToken = await getStorageToken(idTokenName);
  //   console.log('1. Id token: ', idToken);
  //   logoutConfig[1].idToken = idToken;
  //   console.log(logoutConfig);
  //   if (idToken !== null) await logoutOauth(logoutConfig[0], logoutConfig[1]);
  //   const authState = await authorize(signConfig).catch(error => {
  //     console.log(error);
  //     return null;
  //   });
  //   if (!authState?.accessToken) return console.log('No access token found');
  //   if (!authState?.idToken) return console.log('No id token found');
  //   console.log('2. Access token: ', authState?.accessToken);
  //   console.log('3. Id token: ', authState?.idToken);
  //   await AsyncStorage.setItem(idTokenName, authState.idToken);
  //   await fetch(`${apiUrl}${backPath}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       oauthToken: authState.accessToken,
  //     }),
  //   })
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(async data => {
  //       if (data.access_token)
  //         await AsyncStorage.setItem('@apiToken', data.access_token);
  //       else console.log(data.message);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       return null;
  //     });
  //   return true;
}
