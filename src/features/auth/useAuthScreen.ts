import {useDispatch, useSelector} from 'react-redux';
import {useCreateCodeMutation, useGetTokenMutation} from './authApi';
import {
  resetAuthToken,
  selectAuthToken,
  selectAuthTokenInitialized,
  setAuthToken,
} from './authTokenSlice';
import {useCallback, useEffect, useState} from 'react';
import {AppDispatch} from '../../app/store';

type AuthScreenState =
  | {
      step: 'creatingCode' | 'done';
    }
  | {
      step: 'pollingToken';
      code: string;
    };

function useCreateCodeStep() {
  const [createCode] = useCreateCodeMutation();

  return useCallback(() => {
    return createCode().unwrap();
  }, [createCode]);
}

function usePollAuthTokenStep() {
  const [getToken] = useGetTokenMutation();
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    (code: string) => {
      return new Promise(async resolve => {
        let tokenPollingTimeout: number;
        const pollToken = async () => {
          const token = await getToken(code).unwrap();
          if (token) {
            clearTimeout(tokenPollingTimeout);
            await dispatch(setAuthToken(token));
            resolve(undefined);
          } else {
            tokenPollingTimeout = setTimeout(pollToken, 1000);
          }
        };
        pollToken();
      });
    },
    [dispatch, getToken],
  );
}

function useLogout() {
  const dispatch = useDispatch<AppDispatch>();

  return () => dispatch(resetAuthToken());
}

export function useAuthScreen() {
  const [state, setState] = useState<AuthScreenState>({
    step: 'creatingCode',
  });
  const authTokenInitialized = useSelector(selectAuthTokenInitialized);
  const authToken = useSelector(selectAuthToken);
  const createCode = useCreateCodeStep();
  const pollAuthToken = usePollAuthTokenStep();

  useEffect(() => {
    if (!authTokenInitialized) {
      return;
    }

    if (authToken) {
      setState({step: 'done'});
      return;
    }

    (async () => {
      const code = await createCode();
      setState({step: 'pollingToken', code});
      await pollAuthToken(code);
    })();
  }, [authToken, authTokenInitialized, createCode, pollAuthToken]);

  const logout = useLogout();

  return {state, logout};
}
