import VideoToken from '../../types/VideoToken';
import {VideoToken as RbtvVideoToken} from '../types';

const toVideoToken = (videoToken?: RbtvVideoToken): VideoToken | undefined =>
  videoToken
    ? {
        id: videoToken.id.toString(),
        token: videoToken.token,
      }
    : undefined;

export default toVideoToken;
