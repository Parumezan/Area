import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {Text} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';
import Container from '../components/Container';
import Error from '../components/Error';
import Wrapper from '../components/Wrapper';
import {ActionProps} from '../types/ActionProps';
import {RootStackParamList} from '../types/RootStackParamList';

type ActionsNavigationProp = StackNavigationProp<RootStackParamList, 'Actions'>;

type BrickId = {
  id: number;
};

export default function Actions() {
  const tw = useTailwind();
  const route = useRoute();
  const navigation = useNavigation<ActionsNavigationProp>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actions, setActions] = useState<ActionProps>();

  useEffect(() => {
    async function fetchActions() {
      setLoading(true);

      const value = await AsyncStorage.getItem('@apiUrl');
      await fetch(`${value}/api/action/brick/${(route.params as BrickId).id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await AsyncStorage.getItem('@apiToken')}`,
        },
      })
        .then(response => {
          return response.json();
        })
        .then(async data => {
          console.log(data);

          if (data.id) {
            setActions(data);
          } else {
            setError(data.message ?? 'An error occurred');
          }
        })
        .catch(err => {
          console.log(err);
        });

      setLoading(false);
    }

    fetchActions();
  }, [route.params]);

  return (
    <Wrapper>
      <View style={tw('flex flex-col justify-around w-full p-5')}>
        {error && (
          <View style={tw('pb-3')}>
            <Error errorMsg={error} />
          </View>
        )}

        <View style={tw('pb-3')}>
          <Container>
            <View style={tw('flex flex-col justify-start w-full h-16 ')}>
              <Text style={tw('text-white text-lg')}>Actions</Text>
            </View>
          </Container>
        </View>

        <View>
          <Container>
            <View style={tw('flex flex-col justify-start w-full h-16 ')}>
              <Text style={tw('text-white text-lg')}>Reactions</Text>
            </View>
          </Container>
        </View>
      </View>
    </Wrapper>
  );
}
