import { darkColors, lightColors } from "../../theme/colors";
import { CometToggleTheme } from "./types";

export const light: CometToggleTheme = {
  handleBackground: lightColors.backgroundAlt,
  handleShadow: lightColors.textDisabled,
};

export const dark: CometToggleTheme = {
  handleBackground: darkColors.backgroundAlt,
  handleShadow: darkColors.textDisabled,
};
