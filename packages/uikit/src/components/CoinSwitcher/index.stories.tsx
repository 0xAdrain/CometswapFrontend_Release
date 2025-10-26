import React from "react";
import { SequencePlayer } from "./SequencePlayer";
import { bnb2veCometImages, cake2BnbImages } from "./constant";

export default {
  title: "Components/CoinSwitcher",
  component: SequencePlayer,
  argTypes: {},
};

export const Bnb2veComet: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <SequencePlayer images={bnb2veCometImages()} />
    </div>
  );
};

export const veComet2Bnb: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <SequencePlayer images={cake2BnbImages()} />
    </div>
  );
};
