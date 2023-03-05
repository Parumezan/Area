import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import WebView from 'react-native-webview';
import Loader from '../components/Loader';
import Wrapper from '../components/Wrapper';
import fetchFormated from '../providers/query';
import {RootStackParamList} from '../types/RootStackParamList';

type GoogleLoginNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GoogleLogin'
>;

export default function GoogleLogin() {
  const navigation = useNavigation<GoogleLoginNavigationProp>();
  const [googleUrl, setGoogleUrl] = useState<string>('');

  const [isAuth, setIsAuth] = useState(false);

  function googleLogin() {
    const clientId =
      '614953799928-lp9gcgr13vmlmrr3gch9ip7b37fl6bgb.apps.googleusercontent.com';
    setGoogleUrl(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        'http://localhost:8081/callback_google',
      )}&response_type=code&scope=openid%20email`,
    );
  }

  async function fetchGoogleRequestGoogleToken(url: string) {
    const code = url.split('code=')[1].split('&')[0];
    const req = {
      oauthToken: decodeURIComponent(code),
    };

    return fetchFormated('/auth/requestGoogleToken', {
      method: 'POST',
      body: JSON.stringify(req),
    }).catch(err => {
      console.error(err);
      return null;
    });
  }

  async function fetchGoogleCallback(url: string) {
    return fetchFormated('/auth/oauthGoogle', {
      method: 'POST',
      body: JSON.stringify({
        oauthToken: url,
      }),
    }).catch(err => {
      console.error(err);
      return null;
    });
  }

  const handleGoogleNavigation = async (event: any) => {
    const {url} = event;

    if (url.includes('code=') && isAuth === false) {
      setIsAuth(true);
      const reqToken = await fetchGoogleRequestGoogleToken(url);

      if (!reqToken) {
        Alert.alert('Error', 'Error while logging in');
        navigation.navigate('Login');
        return;
      }

      const token = await reqToken.json();
      if (!token) {
        Alert.alert('Error', 'Error while logging in');
        navigation.navigate('Login');
        return;
      }

      const callbackUrl = await fetchGoogleCallback(token.access_token);
      if (!callbackUrl) {
        Alert.alert('Error', 'Error while logging in');
        navigation.navigate('Login');
        return;
      }

      const json = await callbackUrl.json();

      console.log(json);

      if (!json || !json.access_token) {
        Alert.alert('Error', 'Error while logging in');
        navigation.navigate('Login');
        return;
      } else {
        AsyncStorage.setItem('@apiToken', json.access_token);
      }

      navigation.navigate('Dashboard');
    }
  };

  useFocusEffect(
    useCallback(() => {
      googleLogin();
    }, []),
  );

  if (!googleUrl)
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );

  return (
    <WebView
      source={{
        uri: googleUrl,
      }}
      userAgent={
        'Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36'
      }
      onNavigationStateChange={handleGoogleNavigation}
      style={{marginTop: 20}}
    />
  );
}
