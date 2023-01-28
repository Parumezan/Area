import React from 'react';
import {ImageBackground, View} from 'react-native';
import {Text, Input, Button, Icon} from '@ui-kitten/components';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {stackParams} from '../components/stackparams';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTailwind} from 'tailwind-rn/dist';

type ConnectionNavigationProp = StackNavigationProp<stackParams, 'Connection'>;

export default function Connection() {
  const tailwind = useTailwind();
  const navigation = useNavigation<ConnectionNavigationProp>();
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  function onSignInButtonPress() {
    navigation.navigate('DashBoard');
  }

  function onSignUpButtonPress() {
    // navigation.navigate('SignUp');
  }

  function onPasswordIconPress() {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <ImageBackground
      style={tailwind('flex-1')}
      source={require('../assets/Background.jpg')}>
      <KeyboardAwareScrollView contentContainerStyle={tailwind('flex-1')}>
        <View style={tailwind('flex-1 flex justify-center items-center')}>
          <Text style={tailwind('text-4xl text-center text-blue-600')}>
            Hello
          </Text>
          <Text style={tailwind('text-lg text-center text-gray-600')}>
            Sign in to your account
          </Text>
        </View>
        <View style={tailwind('p-4')}>
          <Input
            style={tailwind('bg-black rounded-md p-2')}
            placeholder="Email"
            accessoryLeft={<Icon name="person-outline" fill="#8F9BB3" />}
            value={email}
            onChangeText={setEmail}
          />
          <Input
            style={tailwind('bg-black rounded-md p-2 mt-2')}
            placeholder="Password"
            accessoryRight={
              <Icon
                name={passwordVisible ? 'eye' : 'eye-off'}
                fill="#8F9BB3"
                onPress={onPasswordIconPress}
              />
            }
            value={password}
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
          />
        </View>
        <Button
          style={tailwind('bg-blue-600 text-white rounded-md p-2')}
          size="giant"
          onPress={onSignInButtonPress}>
          SIGN IN
        </Button>
        <Button
          style={tailwind('text-blue-600')}
          appearance="ghost"
          status="control"
          onPress={onSignUpButtonPress}>
          Don't have an account? Sign Up
        </Button>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}
