import {PropsWithChildren, useEffect, useState} from 'react';
import {useAppDispatch} from '../../app/redux/store';
import capture from '../../app/capture';
import {initializeSocket} from '../../app/rbtvApi/rbtvSocketApiSlice';
import {initializeAuthToken} from '../auth/authTokenSlice';

function InitializeAppGate({children}: PropsWithChildren) {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    capture(
      (async () => {
        await dispatch(initializeSocket());
        await dispatch(initializeAuthToken());
        setIsInitialized(true);
      })(),
    );
  }, [dispatch]);

  return isInitialized ? children : null;
}

export default InitializeAppGate;
