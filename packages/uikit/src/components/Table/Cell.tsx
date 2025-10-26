import { styled } from "styled-components";
import { typography, TypographyProps } from "styled-system";

export const Td = styled.td<TypographyProps>`
  color: ${({ theme }) => theme.colors.text};
  padding: 20px 16px; /* CometSwap: 增加垂直间距，更好的行间距 */
  vertical-align: middle;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  /* CometSwap: 添加过渡效果 */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${typography}
`;

export const Th = styled(Td).attrs({ as: "th" })<TypographyProps>`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 600; /* CometSwap: 增加表头字重 */
  text-transform: uppercase;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.colors.backgroundAlt}; /* CometSwap: 表头背景色 */
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder}; /* CometSwap: 更明显的表头分隔线 */

  ${typography}
`;
