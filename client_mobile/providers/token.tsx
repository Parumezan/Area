import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getLocalApiUrl() {
  try {
    const value = await AsyncStorage.getItem('@apiUrl');
    if (value === null) {
      await AsyncStorage.setItem('@apiUrl', 'http://localhost:8080');
    } else return value;
  } catch (error) {
    console.log(error);
  }
}

export async function getStorageToken(token: string) {
  try {
    const value = await AsyncStorage.getItem(token);
    if (value !== null) {
      return value;
    } else return null;
  } catch (error) {
    console.log(error);
  }
}