import { PixelRatio, Dimensions } from "react-native";
import { create } from "react-native-pixel-perfect";

const displayProps = {
  width: PixelRatio.roundToNearestPixel(Dimensions.get("window").width * PixelRatio.get()) || 1920,
  height:
    PixelRatio.roundToNearestPixel(Dimensions.get("window").height * PixelRatio.get()) || 1080,
};

const perfectSize = create(displayProps);

export default perfectSize;
