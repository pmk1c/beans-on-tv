/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
import perfectSize from "../perfectSize";

enum borderRadius {
  full = perfectSize(1000),
  large = perfectSize(12),
  small = perfectSize(5),
}

export default borderRadius;
