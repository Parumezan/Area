import AsyncStorage from '@react-native-async-storage/async-storage';

type Headers = {
  'Content-Type': string;
  Authorization?: string;
};

export default async function fetchFormated(
  input: string,
  init?: RequestInit,
  isProtected = true,
): Promise<Response> {
  const apiUrl = await AsyncStorage.getItem('@apiUrl');

  const headers: Headers = {
    'Content-Type': 'application/json',
  };
  if (isProtected) {
    headers.Authorization = `Bearer ${await AsyncStorage.getItem('@apiToken')}`;
  }

  return fetch(`${apiUrl}${input}`, {
    ...init,
    headers,
  });
}
