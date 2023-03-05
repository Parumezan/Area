import React, {useCallback, useEffect, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {Button} from '@rneui/themed';
import {ActivityIndicator, Alert, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/RootStackParamList';

type GoogleSignNavigationProp = StackNavigationProp<RootStackParamList>;

export default function GoogleSign() {
  const tw = useTailwind();
  const navigation = useNavigation<GoogleSignNavigationProp>();

  const [loading, setLoading] = useState(false);

  function handleGoogleOauth() {
    setLoading(true);
    navigation.navigate('GoogleLogin');
    setLoading(false);
  }

  return (
    <View style={tw('flex flex-row justify-center')}>
      <Button
        buttonStyle={tw('bg-blue-600 text-white rounded-md')}
        icon={
          <Icon name="google" size={20} color="#FFFFFF" style={tw('px-2')} />
        }
        onPress={handleGoogleOauth}>
        {loading && (
          <ActivityIndicator style={tw('px-2')} size="small" color="#ffffff" />
        )}
        Sign in with Google
      </Button>
    </View>
  );
}
