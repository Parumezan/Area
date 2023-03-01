import React, {useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useTailwind} from 'tailwind-rn/dist';
import {RootStackParamList} from '../types/RootStackParamList';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import {Text, Input, Button} from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';
import Dial from '../components/Dial';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Error from '../components/Error';

type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const tw = useTailwind();
  const navigation = useNavigation<LoginNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  async function onSignInButtonPress() {
    setLoading(true);

    const value = await AsyncStorage.getItem('@apiUrl');

    await fetch(`${value}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        console.log(data);

        if (data.access_token) {
          await AsyncStorage.setItem('@apiToken', data.access_token);
          navigation.navigate('Dashboard');
        } else {
          setError(data.message);
        }
      })
      .catch(err => {
        setError('Network Error');
        console.log(err);
      });

    setLoading(false);
  }

  function onSignUpButtonPress() {
    navigation.navigate('Register');
  }

  function onPasswordIconPress() {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <View style={tw('h-full')}>
      <ImageBackground
        style={tw('absolute h-full w-full')}
        source={require('../assets/Background.jpg')}
      />

      <KeyboardAvoidingView
        style={tw('flex flex-col justify-center h-full my-auto')}>
        <View style={tw('flex flex-col')}>
          <Text style={tw('text-4xl text-center text-blue-600')}>Hello</Text>
          <Text style={tw('text-lg text-center text-gray-400')}>
            Sign in to your account
          </Text>

          {error && <Error errorMsg={error} />}
        </View>

        <View style={tw('flex flex-col justify-center')}>
          <View style={tw('flex flex-col p-4 justify-around')}>
            <Input
              style={tw('rounded-md p-2 text-white')}
              placeholder="Email"
              placeholderTextColor="#FFFFFFBD"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              style={tw('rounded-md p-2 text-white')}
              placeholder="Password"
              placeholderTextColor="#FFFFFFBD"
              value={password}
              secureTextEntry={!passwordVisible}
              onChangeText={setPassword}
              rightIcon={
                <Icon
                  name={passwordVisible ? 'eye' : 'eye-off'}
                  color="#FFFFFF"
                  onPress={onPasswordIconPress}
                  size={20}
                />
              }
              rightIconContainerStyle={tw('p-2')}
            />
          </View>
          <View style={tw('flex flex-col px-10 justify-around')}>
            <Button
              style={tw('bg-blue-600 text-white rounded-md')}
              onPress={onSignInButtonPress}>
              {loading && (
                <ActivityIndicator
                  style={tw('px-2')}
                  size="small"
                  color="#ffffff"
                />
              )}
              SIGN IN
            </Button>
            <View style={tw('flex flex-row justify-center')}>
              <Text style={tw('text-white text-lg text-center my-auto')}>
                Don't have an account ?
              </Text>
              <Button
                style={tw('text-white text-lg text-center my-auto')}
                type="clear"
                onPress={onSignUpButtonPress}>
                Sign Up
              </Button>
            </View>
          </View>
        </View>
        <Dial state="connection" />
      </KeyboardAvoidingView>
    </View>
  );
}
