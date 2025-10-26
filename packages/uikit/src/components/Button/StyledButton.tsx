import { styled, DefaultTheme, css } from "styled-components";
import { space, layout, variant } from "styled-system";
import { scaleVariants, styleVariants } from "./theme";
import { BaseButtonProps } from "./types";

interface ThemedButtonProps extends BaseButtonProps {
  theme: DefaultTheme;
}

interface TransientButtonProps extends ThemedButtonProps {
  $isLoading?: boolean;
}

const getDisabledStyles = ({ $isLoading, theme }: TransientButtonProps) => {
  if ($isLoading === true) {
    return `
      &:disabled,
      &.comet-button--disabled {
        cursor: not-allowed;
      }
    `;
  }

  return `
    &:disabled,
    &.comet-button--disabled {
      background-color: ${theme.colors.backgroundDisabled};
      border-color: ${theme.colors.backgroundDisabled};
      box-shadow: none;
      color: ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  `;
};

/**
 * This is to get around an issue where if you use a Link component
 * React will throw a invalid DOM attribute error
 * @see https://github.com/styled-components/styled-components/issues/135
 */

const getOpacity = ({ $isLoading = false }: TransientButtonProps) => {
  return $isLoading ? ".5" : "1";
};

const StyledButton = styled("button").withConfig({
  shouldForwardProp: (props) => !["fullWidth"].includes(props),
})<BaseButtonProps>`
  position: relative;
  align-items: center;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.default}; /* CometSwap: 使用更新的圆角值 8px */
  box-shadow: ${({ theme }) => theme.shadows.button}; /* CometSwap: 使用现代化阴影 */
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  opacity: ${getOpacity};
  outline: 0;
  /* CometSwap: 增加更多过渡属性，更流畅的交互 */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  @media (hover: hover) {
    &:hover:not(:disabled):not(.comet-button--disabled):not(.comet-button--disabled):not(:active) {
      /* CometSwap: 现代化悬停效果 - 使用阴影而非透明度 */
      box-shadow: ${({ theme }) => theme.shadows.buttonHover};
      transform: translateY(-1px);
    }
  }

  &:active:not(:disabled):not(.comet-button--disabled):not(.comet-button--disabled) {
    /* CometSwap: 现代化激活效果 */
    transform: translateY(0px);
    box-shadow: ${({ theme }) => theme.shadows.button};
  }

  ${getDisabledStyles}
  ${variant({
    prop: "scale",
    variants: scaleVariants,
  })}
  ${variant({
    variants: styleVariants,
  })}
  ${layout}
  ${space}
  ${({ decorator, theme }) =>
    decorator &&
    css`
      &::before {
        content: "${decorator.text}";
        position: absolute;
        border-bottom: 20px solid ${decorator.backgroundColor ?? theme.colors.secondary};
        border-left: 34px solid transparent;
        border-right: 12px solid transparent;
        height: 0;
        top: -1px;
        right: -12px;
        width: 75px;
        text-align: center;
        padding-right: 30px;
        line-height: 20px;
        font-size: 12px;
        font-weight: 400;
        transform: rotate(31.17deg);
        color: ${decorator.color ?? "white"};
      }
    `}
`;

export default StyledButton;
