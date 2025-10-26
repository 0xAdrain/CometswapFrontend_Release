import React, { useContext } from "react";
import { motion } from "framer-motion";
import { MenuContext } from "../../widgets/Menu/context";
import { Flex } from "../Box";
import AnimatedIconComponent from "../Svg/AnimatedIconComponent";
import { StyledBottomNavItem, StyledBottomNavText } from "./styles";
import { BottomNavItemProps } from "./types";

// CometSwap: 底部导航动画配置
const navItemVariants = {
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  }
}

const BottomNavItem: React.FC<React.PropsWithChildren<BottomNavItemProps>> = ({
  label,
  icon,
  fillIcon,
  href,
  showItemsOnMobile = false,
  isActive = false,
  disabled = false,
  ...props
}) => {
  const { linkComponent } = useContext(MenuContext);
  
  // CometSwap: 带动画的底部导航内容
  const bottomNavItemContent = (
    <motion.div
      variants={navItemVariants}
      whileTap="tap"
      whileHover="hover"
      style={{ width: '100%', height: '100%' }}
    >
      <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
        {icon && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ 
              scale: isActive ? 1.1 : 1,
              rotate: isActive ? [0, -5, 5, 0] : 0
            }}
            transition={{ 
              scale: { duration: 0.2 },
              rotate: { duration: 0.4, ease: "easeInOut" }
            }}
          >
            <AnimatedIconComponent
              icon={icon}
              fillIcon={fillIcon}
              height="22px"
              width="21px"
              color={isActive ? "secondary" : "textSubtle"}
              isActive={isActive}
              activeBackgroundColor="backgroundAlt"
            />
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isActive ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          <StyledBottomNavText
            color={isActive ? "text" : "textSubtle"}
            fontWeight={isActive ? "600" : "400"}
            fontSize="10px"
          >
            {label}
          </StyledBottomNavText>
        </motion.div>
      </Flex>
    </motion.div>
  );

  return showItemsOnMobile ? (
    <StyledBottomNavItem style={{ opacity: disabled ? 0.5 : 1 }} type="button" {...props}>
      {bottomNavItemContent}
    </StyledBottomNavItem>
  ) : (
    <StyledBottomNavItem style={{ opacity: disabled ? 0.5 : 1 }} as={linkComponent} href={href} {...props}>
      {bottomNavItemContent}
    </StyledBottomNavItem>
  );
};

export default BottomNavItem;
