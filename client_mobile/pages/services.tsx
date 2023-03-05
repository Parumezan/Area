import {StackNavigationProp} from '@react-navigation/stack';
import Container from '../components/Container';
import Wrapper from '../components/Wrapper';
import {RootStackParamList} from '../types/RootStackParamList';
import {FlatList, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTailwind} from 'tailwind-rn/dist';
import {Button, Image, Text} from '@rneui/themed';

type ServicesNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Services'
>;

interface Service {
  name: string;
  img: string;
  login: () => void;
}

export default function Services() {
  const tw = useTailwind();
  const navigation = useNavigation<ServicesNavigationProp>();

  async function twitterLogin() {
    navigation.navigate('TwitterLogin');
  }

  async function twitchLogin() {
    navigation.navigate('TwitchLogin');
  }

  const services: Service[] = [
    {
      name: 'Twitter',
      img: 'https://www.icsdevon.co.uk/wp-content/uploads/2021/09/Twitter-logo.png',
      login: twitterLogin,
    },
    {
      name: 'Twitch',
      img: 'https://cdn.pixabay.com/photo/2021/12/10/16/38/twitch-6860918_960_720.png',
      login: twitchLogin,
    },
  ];

  return (
    <Wrapper>
      <View style={tw('p-5')}>
        <Container>
          <FlatList
            data={services}
            renderItem={({item}) => (
              <Button
                buttonStyle={tw(
                  'flex flex-row justify-between p-1 bg-transparent p-3',
                )}
                onPress={item.login}>
                <Text style={tw('text-2xl font-bold text-white my-auto')}>
                  {item.name}
                </Text>

                <Image
                  source={{
                    uri: item.img,
                  }}
                  style={tw('w-32 h-32')}
                />
              </Button>
            )}
          />
        </Container>
      </View>
    </Wrapper>
  );
}
