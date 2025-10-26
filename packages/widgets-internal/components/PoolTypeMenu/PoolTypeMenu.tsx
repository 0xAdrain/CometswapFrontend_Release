import { Protocol } from "@cometswap/farms";
import { ButtonMenu, ButtonMenuItem } from "@cometswap/uikit";

export interface IPoolTypeMenuProps {
  data: { label: string; value: Protocol | null }[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export const PoolTypeMenu: React.FC<IPoolTypeMenuProps> = ({ data, activeIndex, onChange }) => (
  <ButtonMenu scale="sm" activeIndex={activeIndex ?? 0} onItemClick={onChange} variant="subtle">
    {data.map(({ label, value }) => (
      <ButtonMenuItem key={value} height="38px">
        {label}
      </ButtonMenuItem>
    ))}
  </ButtonMenu>
);
