import { Button as ExpoButton } from "@expo/ui";

import borderRadius from "../styles/tokens/borderRadius";
import color from "../styles/tokens/color";
import spacing from "../styles/tokens/spacing";

type ButtonProps = {
  buttonType?: "destructive";
  title?: string;
  onPress?: () => void;
};

function Button({ buttonType, title, onPress }: ButtonProps) {
  return (
    <ExpoButton
      label={title}
      onPress={onPress}
      style={
        buttonType === "destructive"
          ? {
              backgroundColor: color.red700,
              borderRadius: borderRadius.full,
              paddingHorizontal: spacing.l,
              paddingVertical: spacing.m,
            }
          : {
              borderRadius: borderRadius.full,
              paddingHorizontal: spacing.l,
              paddingVertical: spacing.m,
            }
      }
    />
  );
}

export default Button;
