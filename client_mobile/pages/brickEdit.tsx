import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Input} from '@rneui/themed';
import {useState} from 'react';
import {View} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';
import Container from '../components/Container';
import Error from '../components/Error';
import Wrapper from '../components/Wrapper';
import {BrickProps} from '../types/BrickProps';
import {RootStackParamList} from '../types/RootStackParamList';

type BrickEditNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BrickEdit'
>;

export default function BrickEdit() {
  const tw = useTailwind();
  const route = useRoute();
  const navigation = useNavigation<BrickEditNavigationProp>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brick, setBrick] = useState<BrickProps>(route.params as BrickProps);

  async function fetchCreateBrick() {
    setLoading(true);

    const value = await AsyncStorage.getItem('@apiUrl');
    await fetch(`${value}/api/brick`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('@apiToken')}`,
      },
      body: JSON.stringify({...brick}),
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        if (data.id) {
          navigation.navigate('Dashboard');
        } else {
          setError(data.message ?? 'An error occurred');
        }
      })
      .catch(err => {
        console.log(err);
      });

    setLoading(false);
  }

  async function fetchEditBrick() {
    setLoading(true);

    const value = await AsyncStorage.getItem('@apiUrl');
    await fetch(`${value}/api/brick/${brick.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('@apiToken')}`,
      },
      body: JSON.stringify({...brick}),
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        if (data.id) {
          navigation.navigate('Dashboard');
        } else {
          setError(data.message ?? 'An error occurred');
        }
      })
      .catch(err => {
        console.log(err);
      });

    setLoading(false);
  }

  async function fetchDeleteBrick() {
    setLoading(true);

    const value = await AsyncStorage.getItem('@apiUrl');
    await fetch(`${value}/api/brick/${brick.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('@apiToken')}`,
      },
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        if (data.id) {
          navigation.navigate('Dashboard');
        } else {
          setError(data.message ?? 'An error occurred');
        }
      })
      .catch(err => {
        console.log(err);
      });

    setLoading(false);
  }

  function handleCancelPress() {
    navigation.navigate('Dashboard');
  }

  return (
    <Wrapper>
      <View style={tw('w-full h-full px-2')}>
        <Container>
          <View style={tw('opacity-100')}>
            {error && <Error errorMsg={error} />}
            <View style={tw('flex flex-col justify-center pb-5')}>
              <Input
                style={tw('text-white')}
                placeholder="title"
                placeholderTextColor="#FFFFFFBD"
                value={brick.title}
                onChangeText={text => setBrick({...brick, title: text})}
              />
              <Input
                style={tw('text-white')}
                placeholder="description"
                placeholderTextColor="#FFFFFFBD"
                value={brick.description}
                onChangeText={text => setBrick({...brick, description: text})}
              />
            </View>

            <View style={tw('flex flex-row justify-between')}>
              <Button
                title="Cancel"
                buttonStyle={tw(`p-4 py-2 rounded-full bg-gray-500`)}
                onPress={handleCancelPress}
              />
              {brick.id !== -1 && (
                <Button
                  title="Delete"
                  loading={loading}
                  buttonStyle={tw(`p-4 py-2 rounded-full bg-red-500`)}
                  onPress={fetchDeleteBrick}
                />
              )}
              <Button
                title={brick.id === -1 ? 'Create' : 'Edit'}
                loading={loading}
                buttonStyle={tw('p-4 py-2 rounded-full')}
                onPress={brick.id === -1 ? fetchCreateBrick : fetchEditBrick}
              />
            </View>
          </View>
        </Container>
      </View>
    </Wrapper>
  );
}
