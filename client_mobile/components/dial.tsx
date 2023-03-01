import React, {useState} from 'react';
import {Dialog, SpeedDial, Input} from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';
import {useTailwind} from 'tailwind-rn/dist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/RootStackParamList';

type DialProps = {
  state?: string;
};

type Screen = {
  page: string;
  icon: string;
};

type DialNavigationProp = StackNavigationProp<RootStackParamList>;

export default function Dial(props: DialProps) {
  const tw = useTailwind();
  const navigation = useNavigation<DialNavigationProp>();

  const [open, setOpen] = useState(false);
  const [apiVisible, setApiVisible] = useState(false);
  const [apiUrl, setApiUrl] = useState('');

  const screens: Screen[] = [
    {page: 'Dashboard', icon: 'home'},
    {page: 'Services', icon: 'compass'},
  ];

  async function getLocalApiUrl() {
    try {
      const value = await AsyncStorage.getItem('@apiUrl');
      if (value === null) {
        await AsyncStorage.setItem('@apiUrl', 'http://localhost:8080');
        setApiUrl('http://localhost:8080');
      } else setApiUrl(value);
    } catch (error) {
      console.log(error);
    }
  }

  async function setLocalApiUrl() {
    try {
      await AsyncStorage.setItem('@apiUrl', apiUrl ?? 'http://localhost:8080');
    } catch (error) {
      console.log(error);
    }
  }

  function onDialogPress() {
    setApiVisible(!apiVisible);
    getLocalApiUrl();
  }

  function onBackdropPress() {
    setApiVisible(!apiVisible);
    setLocalApiUrl();
  }

  function logout() {
    AsyncStorage.removeItem('@apiToken');
    navigation.navigate('Login');
  }

  function stateConnection() {
    return (
      <>
        <SpeedDial.Action
          icon={<Icon name="link" color="#fff" size={20} />}
          title="API URL"
          onPress={onDialogPress}
          color="#3F51B5"
        />
        <Dialog
          isVisible={apiVisible}
          onBackdropPress={onBackdropPress}
          overlayStyle={tw('bg-blue-600 bg-opacity-50 rounded-md')}>
          <Input
            style={tw('text-white')}
            placeholder={apiUrl}
            placeholderTextColor="#FFFFFFBD"
            value={apiUrl}
            onChangeText={setApiUrl}
          />
        </Dialog>
      </>
    );
  }

  function stateApp() {
    return (
      <>
        {screens.map((screen, index) => {
          return (
            <SpeedDial.Action
              key={index}
              icon={<Icon name={screen.icon} color="#fff" size={20} />}
              title={screen.page}
              onPress={() => navigation.navigate(screen.page)}
              color="#3F51B5"
            />
          );
        })}
        {stateConnection()}
        <SpeedDial.Action
          icon={<Icon name="log-out" color="#fff" size={20} />}
          title={'Logout'}
          onPress={logout}
          color="#3F51B5"
        />
      </>
    );
  }

  function stateSwitcher() {
    switch (props.state) {
      case 'connection':
        return stateConnection();
      default:
        return stateApp();
    }
  }

  return (
    <SpeedDial
      isOpen={open}
      icon={<Icon name="edit-2" color="#fff" size={20} />}
      openIcon={<Icon name="x" color="#fff" size={20} />}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
      color="#3F51B5">
      {stateSwitcher()}
      <></>
    </SpeedDial>
  );
}
