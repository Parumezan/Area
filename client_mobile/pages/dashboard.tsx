import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';
import {useCallback, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';
import Brick from '../components/Brick';
import Container from '../components/Container';
import Loader from '../components/Loader';
import Wrapper from '../components/Wrapper';
import {BrickProps} from '../types/BrickProps';
import {RootStackParamList} from '../types/RootStackParamList';

type DashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

export default function Dashboard() {
  const tw = useTailwind();

  const navigation = useNavigation<DashboardNavigationProp>();

  const [loading, setLoading] = useState(false);
  const [bricks, setBricks] = useState<BrickProps[]>([]);

  async function fetchBricks() {
    setLoading(true);

    const value = await AsyncStorage.getItem('@apiUrl');
    await fetch(`${value}/api/brick`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('@apiToken')}`,
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        setBricks(data);
      })
      .catch(err => {
        console.log(err);
      });

    setLoading(false);
  }

  function handleCreateBrick() {
    navigation.navigate('BrickEdit', {
      id: -1,
      title: '',
      description: '',
      actions: [],
      active: false,
    });
  }

  useFocusEffect(
    useCallback(() => {
      fetchBricks();
    }, []),
  );

  return (
    <Wrapper>
      <View style={tw('w-full h-full px-2')}>
        {loading && <Loader />}
        {!loading && (
          <>
            {!loading && bricks.length === 0 && (
              <View style={tw('w-full py-1')}>
                <Container>
                  <View style={tw('w-full flex justify-center items-center')}>
                    <Text style={tw('text-2xl text-white')}>
                      No bricks found
                    </Text>
                  </View>
                </Container>
              </View>
            )}
            <FlatList
              data={bricks}
              renderItem={({item}) => (
                <View style={tw('py-1')}>
                  <Brick {...item} />
                </View>
              )}
              ListFooterComponent={() => (
                <View style={tw('py-1')}>
                  <Button
                    buttonStyle={tw('opacity-100 w-full bg-transparent p-0')}
                    onPress={handleCreateBrick}>
                    <Container>
                      <Icon
                        style={tw('mx-auto')}
                        name="plus-circle"
                        size={40}
                        color="#fff"
                      />
                    </Container>
                  </Button>
                </View>
              )}
            />
          </>
        )}
      </View>
    </Wrapper>
  );
}
