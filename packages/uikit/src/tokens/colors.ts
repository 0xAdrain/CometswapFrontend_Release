export const baseColors = {
  white: "white",
  failure: "#ef4444", // 现代红色
  failure33: "#ef444433",
  // CometSwap: 紫色科技感主色调
  primary: "#8b5cf6", // 紫色主色
  primary0f: "#8b5cf60f",
  primary3D: "#8b5cf63D",
  primaryBright: "#a855f7", // 亮紫色
  primaryDark: "#7c3aed", // 深紫色
  success: "#10b981", // 现代绿色
  success19: "#10b98119",
  warning: "#f59e0b", // 现代橙色
  warning2D: "#f59e0b2D",
  warning33: "#f59e0b33",
};

export const additionalColors = {
  binance: "#F0B90B",
  overlay: "#452a7a",
  gold: "#FFC700",
  silver: "#B2B2B2",
  bronze: "#E7974D",
  yellow: "#D67E0A",
};

export const lightColors = {
  ...baseColors,
  ...additionalColors,
  // CometSwap: 统一紫色主题
  secondary: "#8b5cf6", // 紫色按钮
  secondary80: "#8b5cf680",
  background: "#FAF9FA",
  backgroundDisabled: "#E9EAEB",
  backgroundAlt: "#FFFFFF",
  backgroundAlt2: "rgba(255, 255, 255, 0.7)",
  backgroundHover: "rgba(0, 0, 0, 0.02)",
  backgroundTapped: "rgba(0, 0, 0, 0.04)",
  card: "#FFFFFF",
  cardBorder: "#E7E3EB",
  contrast: "#191326",
  dropdown: "#F6F6F6",
  dropdownDeep: "#EEEEEE",
  invertedContrast: "#FFFFFF",
  input: "#eeeaf4",
  inputSecondary: "#d7caec",
  tertiary: "#EFF4F5",
  tertiary20: "#E2EDEE",
  text: "#280D5F",
  text99: "#280D5F99",
  textDisabled: "#BDC2C4",
  textSubtle: "#7A6EAA",
  disabled: "#E9EAEB",
  primary10: "#EEFBFC",
  primary20: "#C1EDF0",
  primary60: "#02919D",
  positive10: "#EAFBF7",
  positive20: "#BCEFE2",
  positive60: "#129E7D",
  destructive10: "#FFF0F9",
  destructive20: "#FED2E8",
  destructive60: "#D14293",
  destructive: "#ED4B9E",
  gradientPrimary: "linear-gradient(228.54deg, #1FC7D4 -13.69%, #7645D9 91.33%)",
  gradientBubblegum: "linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)",
  gradientInverseBubblegum: "linear-gradient(139.73deg, #F3EFFF 0%, #E5FDFF 100%)",
  gradientCardHeader: "linear-gradient(111.68deg, #F2ECF2 0%, #E8F2F6 100%)",
  gradientBlue: "linear-gradient(180deg, #A7E8F1 0%, #94E1F2 100%)",
  gradientViolet: "linear-gradient(180deg, #E2C9FB 0%, #CDB8FA 100%)",
  gradientVioletAlt: "linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)",
  gradientGold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
  gradientBold: "linear-gradient(#53DEE9, #7645D9)",
};

export const darkColors = {
  ...baseColors,
  ...additionalColors,
  // CometSwap: 科技感紫色主题
  secondary: "#8B5CF6", // 紫色按钮
  secondary80: "#8B5CF680",
  background: "#000000", // 纯黑色背景
  backgroundDisabled: "#1a1a1a",
  backgroundAlt: "#0a0a0a", // 深黑色
  backgroundAlt2: "rgba(10, 10, 10, 0.9)",
  backgroundHover: "rgba(139, 92, 246, 0.1)", // 紫色悬停
  backgroundTapped: "rgba(139, 92, 246, 0.2)",
  card: "#0f0f0f", // 深黑卡片
  cardBorder: "#2a2a2a", // 深灰边框
  contrast: "#FFFFFF",
  dropdown: "#0a0a0a",
  dropdownDeep: "#000000",
  invertedContrast: "#000000",
  input: "#1a1a1a", // 深色输入框
  inputSecondary: "#151515",
  primaryDark: "#7c3aed", // 深紫色
  tertiary: "#1a1a1a",
  tertiary20: "#2a2a2a",
  text: "#FFFFFF", // 纯白文字
  text99: "#FFFFFF99",
  textDisabled: "#666666",
  textSubtle: "#a1a1aa", // 浅灰副文本
  disabled: "#333333",
  primary10: "#1e1b4b", // 深紫背景
  primary20: "#312e81",
  primary60: "#a855f7", // 亮紫色
  positive10: "#064e3b",
  positive20: "#065f46",
  positive60: "#10b981", // 绿色保持
  destructive10: "#7f1d1d",
  destructive20: "#991b1b",
  destructive60: "#f87171", // 红色保持
  destructive: "#ef4444",
  // CometSwap: 科技感渐变
  gradientPrimary: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
  gradientBubblegum: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
  gradientInverseBubblegum: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
  gradientCardHeader: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
  gradientBlue: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
  gradientViolet: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a855f7 100%)",
  gradientVioletAlt: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  gradientGold: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
  gradientBold: "linear-gradient(135deg, #8b5cf6, #a855f7)",
};
