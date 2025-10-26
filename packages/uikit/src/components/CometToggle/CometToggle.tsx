import React from "react";
import { CometStack, CometInput, CometLabel } from "./StyledCometToggle";
import { CometToggleProps, scales } from "./types";

const CometToggle: React.FC<React.PropsWithChildren<CometToggleProps>> = ({
  checked,
  scale = scales.LG,
  ...props
}) => (
  <CometStack scale={scale}>
    <CometInput id={props.id || "comet-toggle"} scale={scale} type="checkbox" checked={checked} {...props} />
    <CometLabel scale={scale} checked={checked} htmlFor={props.id || "comet-toggle"}>
      <div className="comets">
        <div className="comet" />
        <div className="comet" />
        <div className="comet" />
        <div className="butter" />
      </div>
    </CometLabel>
  </CometStack>
);

export default CometToggle;
