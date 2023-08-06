declare module "react-native-pixel-perfect" {
  export function create(displayProps: {width: number, height: number}): (size: number) => number;
}