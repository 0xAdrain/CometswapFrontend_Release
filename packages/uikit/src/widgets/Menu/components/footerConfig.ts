import { ContextApi } from "@cometswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("Ecosystem"),
    items: [
      {
        label: t("Trade"),
        href: "https://cometswap.finance/swap",
      },
      {
        label: t("Earn"),
        href: "https://cometswap.finance/liquidity/pools",
      },
      {
        label: t("Play"),
        href: "https://cometswap.finance/prediction",
      },
      {
        label: t("veCOMET"),
        href: "https://cometswap.finance/comet-staking",
      },
      {
        label: t("Merchandise"),
        href: "https://merch.cometswap.finance/",
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        label: t("COMETIncentives"),
        href: "https://docs.cometswap.finance/ecosystem-and-partnerships/business-partnerships/syrup-pools-and-farms",
      },
      {
        label: t("Staking Pools"),
        href: "https://cometswap.finance/pools",
      },
      {
        label: t("Token Launches"),
        href: "https://docs.cometswap.finance/ecosystem-and-partnerships/business-partnerships/initial-farm-offerings-ifos",
      },
      {
        label: t("Brand Assets"),
        href: "https://docs.cometswap.finance/ecosystem-and-partnerships/brand",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: t("Contributing"),
        href: "https://docs.cometswap.finance/developers/contributing",
      },
      {
        label: t("Github"),
        href: "https://github.com/cometswap",
      },
      {
        label: t("Bug Bounty"),
        href: "https://docs.cometswap.finance/developers/bug-bounty",
      },
      {
        label: t("V4"),
        href: "https://cometswap.finance/v4",
      },
    ],
  },
  {
    label: t("Support"),
    items: [
      {
        label: t("Get Help"),
        href: "https://docs.cometswap.finance/contact-us/customer-support",
      },
      {
        label: t("Troubleshooting"),
        href: "https://docs.cometswap.finance/readme/help/troubleshooting",
      },
      {
        label: t("Documentation"),
        href: "https://docs.cometswap.finance/",
      },
      {
        label: t("Audits"),
        href: "https://docs.cometswap.finance/readme/audits",
      },
      {
        label: t("Legacy products"),
        href: "https://docs.cometswap.finance/products/legacy-products",
      },
    ],
  },
  {
    label: t("About"),
    items: [
      {
        label: t("Tokenomics"),
        href: "https://docs.cometswap.finance/governance-and-tokenomics/comet-tokenomics",
      },
      {
        label: t("COMETEmission Projection"),
        href: "https://analytics.cometswap.finance/",
      },
      {
        label: t("Blog"),
        href: "https://blog.cometswap.finance/",
      },
      {
        label: t("Careers"),
        href: "https://docs.cometswap.finance/team/become-a-chef",
      },
      {
        label: t("Terms Of Service"),
        href: "https://cometswap.finance/terms-of-service",
      },
    ],
  },
];
