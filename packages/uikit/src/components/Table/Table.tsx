import { styled } from "styled-components";
import { space } from "styled-system";
import { Td } from "./Cell";

const Table = styled.table`
  max-width: 100%;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  /* CometSwap: 现代化表格样式 */
  tbody tr {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* 斑马纹背景 */
    &:nth-child(even) {
      background-color: ${({ theme }) => theme.colors.backgroundAlt};
    }
    
    /* 悬停高亮效果 */
    @media (hover: hover) {
      &:hover {
        background-color: ${({ theme }) => theme.colors.tertiary};
        transform: scale(1.01);
        box-shadow: ${({ theme }) => theme.shadows.level1};
      }
    }
  }

  tbody tr:last-child {
    ${Td} {
      border-bottom: 0;
    }
  }

  ${space}
`;

export default Table;
