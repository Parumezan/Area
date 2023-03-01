import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Text} from '@rneui/themed';
import {useState} from 'react';
import {View} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';
import {BrickProps} from '../types/BrickProps';
import {RootStackParamList} from '../types/RootStackParamList';
import Container from './Container';

type NavBarNavigationProp = StackNavigationProp<RootStackParamList>;

export default function Brick(props: BrickProps) {
  const tw = useTailwind();
  const navigation = useNavigation<NavBarNavigationProp>();

  const [loading, setLoading] = useState(false);
  const [brick, setBrick] = useState<BrickProps>(props);

  async function handleActivePress() {
    setLoading(true);

    const value = await AsyncStorage.getItem('@apiUrl');
    await fetch(`${value}/api/brick/${brick.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('@apiToken')}`,
      },
      body: JSON.stringify({
        ...brick,
        active: !brick.active,
      }),
    })
      .then(() => {
        setBrick({...brick, active: !brick.active});
      })
      .catch(err => {
        console.log(err);
      });

    setLoading(false);
  }

  function handleEditPress() {
    navigation.navigate('BrickEdit', {...brick});
  }

  function handleBrickPress() {
    navigation.navigate('Actions', {id: brick.id});
  }

  return (
    <Button buttonStyle={tw('p-0 bg-transparent')} onPress={handleBrickPress}>
      <Container>
        <View style={tw('opacity-100')}>
          <View style={tw('flex flex-col justify-center pb-5')}>
            <Text style={tw('text-white text-lg my-auto pb-5')}>
              {brick.title && brick.title !== '' ? brick.title : '-'}
            </Text>
            <Text style={tw('text-white my-auto')}>
              {brick.description && brick.description !== ''
                ? brick.description
                : '-'}
            </Text>
          </View>

          <View style={tw('flex flex-row justify-between')}>
            <Button
              title={brick.active ? 'Disabled' : 'Enabled'}
              loading={loading}
              buttonStyle={tw(
                `p-4 py-2 rounded-full ${
                  brick.active ? 'bg-red-500' : 'bg-green-500'
                }`,
              )}
              onPress={handleActivePress}
            />
            <Button
              title="Edit"
              buttonStyle={tw('p-4 py-2 rounded-full')}
              onPress={handleEditPress}
            />
          </View>
        </View>
      </Container>
    </Button>
  );
}
