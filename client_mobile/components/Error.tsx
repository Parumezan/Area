import Icon from 'react-native-vector-icons/Feather';
import {View} from 'react-native';
import {Text} from '@rneui/themed';
import {useTailwind} from 'tailwind-rn/dist';

type ErrorProps = {
  errorMsg: string;
};

export default function Error(props: ErrorProps) {
  const tw = useTailwind();

  return (
    <View style={tw('pt-3')}>
      <View
        style={tw(
          'w-2/3 p-3 bg-red-300 bg-opacity-50 border-2 border-red-500 m-auto flex flex-row justify-center rounded-full',
        )}>
        <Icon name="alert-triangle" color="#FFFFFF" size={20} />
        <Text style={tw('px-2 text-white text-center')}>{props.errorMsg}</Text>
      </View>
    </View>
  );
}
