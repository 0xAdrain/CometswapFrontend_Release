import { CometTheme } from '@cometswap/uikit'
import { createGlobalStyle } from 'styled-components'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends CometTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    /* 移除固定背景色，让交互式背景可见 */
    background: transparent;
    overflow-x: hidden;

    img {
      height: auto;
      max-width: 100%;
    }
  }

  #__next {
    position: relative;
    z-index: 1;
    /* 确保主容器背景透明 */
    background: transparent;
  }

  #portal-root {
    position: relative;
    z-index: 2;
  }

  /* 确保所有可能的容器背景都是透明的，让交互式背景可见 */
  [data-theme] {
    background: transparent !important;
  }
  
  /* 针对可能的页面容�?*/
  main, .page-container, [class*="Page"], [class*="page"] {
    background: transparent !important;
  }

  /* CometSwap: 修复 TWAP UI 黑色主题下的样式问题 */
  ${({ theme }) => theme.isDark && `
    /* 修复 ButtonMenu 中未选中按钮的文字颜�?*/
    button[class*="InactiveButton"] {
      color: #a1a1aa !important; /* 未选中按钮：浅灰色可见 */
    }

    /* 选中状态的按钮：白色文�?*/
    div[class*="ButtonMenu"] button:not([class*="InactiveButton"]) {
      color: #ffffff !important; /* 选中按钮：白色文�?*/
    }
  `}
  
  /* 确保所有可能的容器背景都是透明的，让交互式背景可见 */
  [data-theme] {
    background: transparent !important;
  }
  
  /* 针对可能的页面容�?*/
  main, .page-container, [class*="Page"], [class*="page"] {
    background: transparent !important;
  }
`

export default GlobalStyle

