import React from "react";
import { CometPrice, CometPriceProps } from ".";
import { Flex } from "../Box";

export default {
  title: "Components/CometPrice",
  component: CometPrice,
};

const Template: React.FC<React.PropsWithChildren<CometPriceProps>> = ({ ...args }) => {
  return (
    <Flex p="10px">
      <CometPrice {...args} />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.args = {
  cakePriceUsd: 20.0,
};
