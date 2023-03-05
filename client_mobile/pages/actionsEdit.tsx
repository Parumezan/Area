import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Input} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useTailwind} from 'tailwind-rn/dist';
import Container from '../components/Container';
import Error from '../components/Error';
import Wrapper from '../components/Wrapper';
import fetchFormated from '../providers/query';
import {ActionProps, ServiceType} from '../types/ActionProps';
import {RootStackParamList} from '../types/RootStackParamList';
import {ServiceProps} from '../types/ServiceProps';

type ActionsEditNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ActionsEdit'
>;

export default function ActionsEdit() {
  const tw = useTailwind();
  const route = useRoute();
  const navigation = useNavigation<ActionsEditNavigationProp>();

  const brickId = (route.params as {brickId: number}).brickId;

  // useState
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [action, setAction] = useState<ActionProps & {argumentsStr: string}>({
    ...(route.params as ActionProps),
    argumentsStr: (route.params as ActionProps).arguments.join('|'),
  });

  // dropdown
  const [serviceList, setServiceList] = useState<ServiceProps[]>();
  const [openService, setOpenService] = useState(false);

  // services params dropdown
  const [serviceTypesList, setServiceTypesList] = useState<ServiceType[]>();
  const [openTypesList, setOpenTypesList] = useState(false);

  async function fetchCreateAction() {
    setLoading(true);
    await fetchFormated('/api/action', {
      method: 'POST',
      body: JSON.stringify({...action}),
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        if (data.id) {
          navigation.navigate('Actions', {id: brickId});
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

  async function fetchEditAction() {
    setLoading(true);
    await fetchFormated(`/api/action/${action.id}`, {
      method: 'PATCH',
      body: JSON.stringify({...action}),
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        if (data.id) {
          navigation.navigate('Actions', {id: brickId});
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

  async function fetchDeleteAction() {
    setLoading(true);
    await fetchFormated(`/api/action/${action.id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        if (data.id) {
          navigation.navigate('Actions', {id: brickId});
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

  async function fetchServiceType() {
    setLoading(true);
    await fetchFormated('/api/action/types', {
      method: 'GET',
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        if (Array.isArray(data)) {
          setServiceTypesList(data);
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
    navigation.navigate('Actions', {id: brickId});
  }

  function getitems() {
    if (!action.serviceName || !serviceTypesList) return [];

    const items = serviceTypesList.map((item: ServiceType) => {
      if (
        item.isInput !== action.isInput ||
        item.service !== action.serviceName
      )
        return;
      return {
        label: item.type,
        value: item.type,
      };
    });
    return items.filter(item => item !== undefined) as {
      label: string;
      value: string;
    }[];
  }

  useEffect(() => {
    fetchService();
    fetchServiceType();
  }, []);

  return (
    <Wrapper>
      <View style={tw('w-full h-full px-2')}>
        <Container>
          <View style={tw('opacity-100')}>
            {error && <Error errorMsg={error} />}
            <View style={tw('flex flex-col justify-center pb-5')}>
              <View style={tw('py-3')}>
                <DropDownPicker
                  theme="DARK"
                  zIndex={3000}
                  zIndexInverse={1000}
                  multiple={false}
                  open={openService}
                  value={action.serviceName}
                  items={
                    serviceList
                      ? serviceList.map(item => ({
                          label: item.title,
                          value: item.title,
                        }))
                      : []
                  }
                  setOpen={setOpenService}
                  setValue={value => {
                    setAction({
                      ...action,
                      serviceName: value.toString(),
                    });
                  }}
                />
              </View>

              <View style={tw('py-3')}>
                <DropDownPicker
                  theme="DARK"
                  zIndex={1000}
                  zIndexInverse={3000}
                  multiple={false}
                  open={openTypesList}
                  value={action.actionType}
                  disabled={!action.serviceName}
                  items={getitems()}
                  setOpen={setOpenTypesList}
                  setValue={value => {
                    setAction({
                      ...action,
                      actionType: value.toString(),
                    });
                  }}
                />
              </View>
              <Input
                disabled={true}
                style={tw('text-white')}
                placeholder="arguments"
                placeholderTextColor="#FFFFFFBD"
                value={action.argumentsStr}
                onChangeText={text =>
                  setAction({
                    ...action,
                    argumentsStr: text,
                  })
                }
              />
              <Input
                disabled={true}
                style={tw('text-white')}
                placeholder="description"
                placeholderTextColor="#FFFFFFBD"
                value={action.description}
                onChangeText={text => setAction({...action, description: text})}
              />
            </View>

            <View style={tw('flex flex-row justify-between')}>
              <Button
                title="Cancel"
                buttonStyle={tw(`p-4 py-2 rounded-full bg-gray-500`)}
                onPress={handleCancelPress}
              />
              {action.id !== -1 && (
                <Button
                  title="Delete"
                  loading={loading}
                  buttonStyle={tw(`p-4 py-2 rounded-full bg-red-500`)}
                  onPress={fetchDeleteAction}
                />
              )}
              <Button
                title={action.id === -1 ? 'Create' : 'Edit'}
                loading={loading}
                buttonStyle={tw('p-4 py-2 rounded-full')}
                onPress={action.id === -1 ? fetchCreateAction : fetchEditAction}
              />
            </View>
          </View>
        </Container>
      </View>
    </Wrapper>
  );
}
