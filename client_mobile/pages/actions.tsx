import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';
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
import {ServiceProps} from '../types/ServiceProps';

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
  const [serviceList, setServiceList] = useState<ServiceProps[]>();

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

  async function fetchService() {
    setLoading(true);
    await fetchFormated('/api/service', {
      method: 'GET',
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        if (Array.isArray(data)) {
          setServiceList(data);
        } else {
          setError(data.message ?? 'An error occurred');
        }
      })
      .catch(err => {
        console.log(err);
        setError('An error occurred');
      });
    setLoading(false);
  }

  function handleAddAction() {
    navigation.navigate('ActionsEdit', {
      id: -1,
      serviceName: '',
      description: '',
      arguments: [],
      brickId: (route.params as BrickId).id,
      serviceId: 0,
      actionType: '',
      isInput: true,
    });
  }

  function handleAddReaction() {
    navigation.navigate('ActionsEdit', {
      id: -1,
      serviceName: '',
      description: '',
      arguments: [],
      brickId: (route.params as BrickId).id,
      serviceId: 0,
      actionType: '',
      isInput: false,
    });
  }

  function findServiceName(id: number) {
    return serviceList?.find(service => service.id === id)?.title ?? '-';
  }

  useFocusEffect(
    useCallback(() => {
      fetchActions();
      fetchService();
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
                    return (
                      <Action
                        key={index}
                        {...item}
                        serviceName={findServiceName(item.serviceId)}
                      />
                    );
                  return null;
                })}
                <Button
                  buttonStyle={tw('bg-transparent p-0 my-1')}
                  onPress={handleAddAction}>
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
                <Button
                  buttonStyle={tw('bg-transparent p-0 my-1')}
                  onPress={handleAddReaction}>
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
            </Container>
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
}
