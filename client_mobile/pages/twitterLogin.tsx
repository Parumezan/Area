import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import WebView from 'react-native-webview';
import Loader from '../components/Loader';
import Wrapper from '../components/Wrapper';
import fetchFormated from '../providers/query';
import {RootStackParamList} from '../types/RootStackParamList';

type TwitterLoginNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TwitterLogin'
>;

export default function TwitterLogin() {
  const navigation = useNavigation<TwitterLoginNavigationProp>();
  const [twitterUrl, setTwitterUrl] = useState<string>('');

  async function twitterLogin() {
    fetch(`${await AsyncStorage.getItem('@apiUrl')}/twitter/requestToken`, {
      method: 'GET',
    })
      .then(async res => {
        const token = await res.text();
        console.log(token);
        await setTwitterUrl(
          `https://api.twitter.com/oauth/authorize?oauth_token=${token}&scope=write`,
        );
      })
      .catch(err => {
        console.error(err);
      });
  }

  async function fetchTwitterCallback(url: string) {
    const oauthToken = url.split('oauth_token=')[1].split('&')[0];
    const oauthVerifier = url.split('oauth_verifier=')[1].split('&')[0];
    const req = {
      oauthToken,
      oauthVerifier,
    };
    return fetchFormated('/twitter/callback', {
      method: 'POST',
      body: JSON.stringify(req),
    }).catch(err => {
      console.error(err);
      return null;
    });
  }

  const handleTwitterNavigation = async (event: any) => {
    const {url} = event;
    if (url.includes('oauth_verifier=')) {
      const res = await fetchTwitterCallback(url);

      if (!res || (await res.text()) == 'Error') {
        Alert.alert('Error', 'Error while logging in');
      }
      navigation.navigate('Services');
    }
  };

  useFocusEffect(
    useCallback(() => {
      twitterLogin();
    }, []),
  );

  if (!twitterUrl)
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );

  return (
    <WebView
      source={{
        uri: twitterUrl,
      }}
      onNavigationStateChange={handleTwitterNavigation}
      style={{marginTop: 20}}
    />
  );
}
