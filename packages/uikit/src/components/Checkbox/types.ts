import { CometTheme } from "../../theme";

export const scales = {
  XS: "xs",
  SM: "sm",
  MD: "md",
} as const;

export type Scales = (typeof scales)[keyof typeof scales];

export interface CheckboxProps {
  scale?: Scales | string;
  colors?: {
    background?: keyof CometTheme["colors"];
    checkedBackground?: keyof CometTheme["colors"];
    checkedColor?: keyof CometTheme["colors"];
    border?: keyof CometTheme["colors"];
  };
  indeterminate?: boolean;
}
