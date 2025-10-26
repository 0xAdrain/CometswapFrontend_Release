import React, { useState } from "react";
import CometToggle from "./CometToggle";

export default {
  title: "Components/CometToggle",
  component: CometToggle,
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => setIsChecked(!isChecked);

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <CometToggle checked={isChecked} onChange={toggle} />
      </div>
      <div style={{ marginBottom: "32px" }}>
        <CometToggle checked={isChecked} onChange={toggle} scale="md" />
      </div>
      <div>
        <CometToggle checked={isChecked} onChange={toggle} scale="sm" />
      </div>
    </>
  );
};
