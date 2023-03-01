import {Text} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';

type TextFieldProps = {
  text: string;
};

export default function TextField(props: TextFieldProps) {
  const tw = useTailwind();

  return <Text style={tw('text-white text-center my-auto')}>{props.text}</Text>;
}
