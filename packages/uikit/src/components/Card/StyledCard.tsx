import shouldForwardProp from "@styled-system/should-forward-prop";
import { styled, css, DefaultTheme } from "styled-components";
import { space } from "styled-system";
import { promotedGradient } from "../../util/animationToolkit";
import { Box } from "../Box";
import { CardProps } from "./types";

interface StyledCardProps extends CardProps {
  theme: DefaultTheme;
}

/**
 * Priority: Warning --> Success --> Active
 */
const getBorderColor = ({ isActive, isSuccess, isWarning, borderBackground, theme }: StyledCardProps) => {
  if (borderBackground) {
    return borderBackground;
  }
  if (isWarning) {
    return theme.colors.warning;
  }

  if (isSuccess) {
    return theme.colors.success;
  }

  if (isActive) {
    return `linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary})`;
  }

  return theme.colors.cardBorder;
};

export const StyledCard = styled.div.withConfig({
  shouldForwardProp,
})<StyledCardProps>`
  background: ${getBorderColor};
  border-radius: ${({ theme }) => theme.radii.card}; /* CometSwap: 现在使用12px圆角 */
  color: ${({ theme, isDisabled }) => theme.colors[isDisabled ? "textDisabled" : "text"]};
  overflow: hidden;
  position: relative;
  /* CometSwap: 添加现代化阴影和过渡效果 */
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* CometSwap: 现代化悬停效果 */
  @media (hover: hover) {
    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.cardHover};
      transform: translateY(-2px);
    }
  }

  ${({ isActive }) =>
    isActive &&
    css`
      animation: ${promotedGradient} 3s ease infinite;
      background-size: 400% 400%;
    `}

  padding: 1px 1px 3px 1px;

  ${space}
`;

export const StyledCardInner = styled(Box)<{ background?: string; hasCustomBorder: boolean }>`
  width: 100%;
  height: 100%;
  overflow: ${({ hasCustomBorder }) => (hasCustomBorder ? "initial" : "inherit")};
  background: ${({ theme, background }) => background ?? theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
`;

StyledCard.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
  isDisabled: false,
};
