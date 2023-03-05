import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Text} from '@rneui/themed';
import {View} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';
import {ActionProps} from '../types/ActionProps';
import {RootStackParamList} from '../types/RootStackParamList';
import Container from './Container';

type NavBarNavigationProp = StackNavigationProp<RootStackParamList>;

export default function Action(props: ActionProps) {
  const tw = useTailwind();
  const navigation = useNavigation<NavBarNavigationProp>();

  function handleEditPress() {
    console.log(props.serviceName);
    // TODO serviceName sus

    navigation.navigate('ActionsEdit', {...props});
  }

  return (
    <Button
      buttonStyle={tw('bg-transparent p-0 my-1')}
      onPress={handleEditPress}>
      <Container>
        <View style={tw('flex flex-col')}>
          <Text style={tw('text-white py-2')}>
            Name: {props.serviceName ?? '-'}
          </Text>
          <Text style={tw('text-white py-2')}>
            Description: {props.description ?? '-'}
          </Text>
        </View>
      </Container>
    </Button>
  );
}
