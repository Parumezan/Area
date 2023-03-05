import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {Text} from '@rneui/themed';
import {useCallback, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';
import Action from '../components/Action';
import Container from '../components/Container';
import Error from '../components/Error';
import Loader from '../components/Loader';
import Wrapper from '../components/Wrapper';
import fetchFormated from '../providers/query';
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
  const [actions, setActions] = useState<ActionProps[]>();

  async function fetchActions() {
    setLoading(true);
    fetchFormated(`/api/action/brick/${(route.params as BrickId).id}`, {
      method: 'GET',
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        if (Array.isArray(data)) {
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

  useFocusEffect(
    useCallback(() => {
      fetchActions();
    }, []),
  );

  if (loading)
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );

  return (
    <Wrapper>
      <ScrollView>
        <View style={tw('flex flex-col justify-start w-full p-5')}>
          {error && (
            <View style={tw('pb-3')}>
              <Error errorMsg={error} />
            </View>
          )}

          <View style={tw('pb-3')}>
            <Container>
              <View style={tw('flex flex-col justify-start w-full')}>
                <Text style={tw('text-white text-lg pb-3')}>Actions</Text>
                {actions?.map((item, index) => {
                  if (item.isInput === true)
                    return <Action key={index} {...item} />;
                  return null;
                })}
              </View>
            </Container>
          </View>

          <View>
            <Container>
              <View style={tw('flex flex-col justify-start w-full')}>
                <Text style={tw('text-white text-lg pb-3')}>Reactions</Text>
                {actions?.map((item, index) => {
                  if (item.isInput === false)
                    return <Action key={index} {...item} />;
                  return null;
                })}
              </View>
            </Container>
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
}
