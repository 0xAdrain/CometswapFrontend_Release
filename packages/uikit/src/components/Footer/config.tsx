import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, YoutubeIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.cometswap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://blog.cometswap.finance/",
      },
      {
        label: "Community",
        href: "https://docs.cometswap.finance/contact-us/telegram",
      },
      {
        label: "COMET",
        href: "https://docs.cometswap.finance/tokenomics/comet",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://cometswap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.cometswap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.cometswap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.cometswap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/cometswap",
      },
      {
        label: "Documentation",
        href: "https://docs.cometswap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@cometswap-1/s/cometswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.cometswap.finance/help/faq#is-cometswap-safe-has-cometswap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.cometswap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/cometswap",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/cometswap",
      },
      {
        label: "Bahasa Indonesia",
        href: "https://t.me/cometswapIndonesia",
      },
      {
        label: "中文",
        href: "https://t.me/cometswap_CN",
      },
      {
        label: "Tiếng Việt",
        href: "https://t.me/CometSwapVN",
      },
      {
        label: "Italiano",
        href: "https://t.me/cometswap_Ita",
      },
      {
        label: "русский",
        href: "https://t.me/cometswap_ru",
      },
      {
        label: "Türkiye",
        href: "https://t.me/cometswapturkiye",
      },
      {
        label: "Português",
        href: "https://t.me/cometswapPortuguese",
      },
      {
        label: "Español",
        href: "https://t.me/cometswapES",
      },
      {
        label: "日本語",
        href: "https://t.me/cometswapJP",
      },
      {
        label: "Français",
        href: "https://t.me/cometswapFR",
      },
      {
        label: "Deutsch",
        href: "https://t.me/cometswap_DE",
      },
      {
        label: "Filipino",
        href: "https://t.me/cometswap_PH",
      },
      {
        label: "ქართული ენა",
        href: "https://t.me/cometswapGeorgia",
      },
      {
        label: "हिन्दी",
        href: "https://t.me/cometswap_INDIA",
      },
      {
        label: "Announcements",
        href: "https://t.me/CometSwapAnn",
      },
    ],
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: "https://reddit.com/r/cometswap",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "https://instagram.com/cometswap_official",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/cometswap/",
  },
  {
    label: "Discord",
    icon: DiscordIcon,
    href: "https://discord.gg/cometswap",
  },
  {
    label: "Youtube",
    icon: YoutubeIcon,
    href: "https://www.youtube.com/@cometswap_official",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
