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

type TwitchLoginNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TwitchLogin'
>;

export default function TwitchLogin() {
  const navigation = useNavigation<TwitchLoginNavigationProp>();
  const [twitchUrl, setTwitchUrl] = useState<string>('');

  async function twitchLogin() {
    try {
      const redirectUri = encodeURIComponent(
        `http://localhost:8081/callback_twitch`,
      );
      const clientId = 'z5luj1qzkjpvhob39ljdq8mj4l0khj';
      const scope = encodeURIComponent(
        'user:read:email channel:read:subscriptions user:manage:whispers user:manage:blocked_users',
      );
      setTwitchUrl(
        `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`,
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchTwitchCallback(url: string) {
    const code = url.split('code=')[1].split('&')[0];

    const req = {
      code,
    };
    return fetchFormated('/twitch/callback', {
      method: 'POST',
      body: JSON.stringify(req),
    }).catch(err => {
      console.error(err);
      return null;
    });
  }

  const handleTwitchNavigation = async (event: any) => {
    const {url} = event;

    if (url.includes('code=')) {
      const res = await fetchTwitchCallback(url);

      if (!res || (await res.text()) == 'Error') {
        Alert.alert('Error', 'Error while logging in');
      }
      navigation.navigate('Services');
    }
  };

  useFocusEffect(
    useCallback(() => {
      twitchLogin();
    }, []),
  );

  if (!twitchUrl)
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );

  return (
    <WebView
      source={{
        uri: twitchUrl,
      }}
      onNavigationStateChange={handleTwitchNavigation}
      style={{marginTop: 20}}
    />
  );
}
