import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {useCreateCodeMutation} from './authApi';

function AuthScreen(): JSX.Element {
  const [createCode, {data: code}] = useCreateCodeMutation();

  useEffect(() => {
    createCode();
  }, [createCode]);

  return <Text style={{flex: 1, backgroundColor: 'red'}}>{code}</Text>;
}

export default AuthScreen;
