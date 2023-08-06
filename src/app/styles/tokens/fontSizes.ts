import perfectSize from "../perfectSize";

const rem = perfectSize(16);
const fontSize = {
  '2xs': 0.579 * rem,
  xs: 0.694 * rem,
  s: 0.833 * rem,
  m: 1 * rem,
  l: 1.2 * rem,
  xl: 1.44 * rem,
  '2xl': 1.728 * rem,
  '3xl': 2.074 * rem,
  '4xl': 2.488 * rem,
  '5xl': 2.986 * rem,
  '6xl': 5 * rem,
};

export default fontSize;
