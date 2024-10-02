export const createReduxEnhancer = () => (next: unknown) => next;
export const init = () => null;
export const wrap = (component: unknown) => component;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ReactNativeTracing {}
export class ReactNavigationInstrumentation {
  registerNavigationContainer() {
    return;
  }
}
