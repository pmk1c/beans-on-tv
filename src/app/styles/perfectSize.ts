import {PixelRatio, Dimensions} from 'react-native';
import {create} from 'react-native-pixel-perfect';


let displayProps = {
  width: PixelRatio.roundToNearestPixel(
    Dimensions.get('window').width * PixelRatio.get(),
  ),
  height: PixelRatio.roundToNearestPixel(
    Dimensions.get('window').height * PixelRatio.get(),
  ),
};

const perfectSize = create(displayProps);


export default perfectSize;
