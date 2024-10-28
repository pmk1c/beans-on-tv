import { Platform } from "react-native";

import perfectSize from "../perfectSize";

const fontFamily = {
  primary: "ArchivoRoman-Black",
};

const rem = perfectSize(16);
const fontSize = {
  "2xs": 0.579 * rem,
  xs: 0.694 * rem,
  s: 0.833 * rem,
  m: 1 * rem,
  l: 1.2 * rem,
  xl: 1.44 * rem,
  "2xl": 1.728 * rem,
  "3xl": 2.074 * rem,
  "4xl": 2.488 * rem,
  "5xl": 2.986 * rem,
  "6xl": 5 * rem,
};

const fontPresets = {
  l: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.l,
    lineHeight: 1.35 * fontSize.l,
    fontWeight: "normal",
  },
  xl: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    lineHeight: 1.35 * fontSize.xl,
    fontWeight: "bold",
  },
} as const;

export default fontPresets;
