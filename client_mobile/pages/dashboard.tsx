import {SafeAreaView} from 'react-native';
import {Button, Divider, Layout, TopNavigation} from '@ui-kitten/components';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {stackParams} from '../components/stackparams';

type DashBoardNavigationProp = StackNavigationProp<stackParams, 'DashBoard'>;

export default function DashBoard() {
  const navigation = useNavigation<DashBoardNavigationProp>();

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation title="DashBoard" alignment="center" />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button onPress={() => navigation.navigate('Connection')}>
          Open Details
        </Button>
      </Layout>
    </SafeAreaView>
  );
}
