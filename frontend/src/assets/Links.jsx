import {
  CreditCardIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ArchiveBoxArrowDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

export const NavLinks = [
  {
    name: "home",
    link: "/",
  },
  {
    name: "about",
    link: "/about",
  },
];

export const FeaturesDes = [
  {
    name: "Transparency",
    link: "transparency_icon.svg",
  },
  {
    name: "Immutability",
    link: "immutability_icon.svg",
  },
  {
    name: "Decentralized",
    link: "decentralization_icon.svg",
  },
  {
    name: "Accessibility",
    link: "accessibility_icon.svg",
  },
];

export const MenuLinks = [
  {
    name: "Dashboard",
    link: "",
    icon: <CreditCardIcon className=" h-5 w-5 bg-inherit text-inherit" />,
  },
  {
    name: "Election",
    link: "create-election",
    icon: <ArchiveBoxIcon className=" h-5 w-5 bg-inherit text-inherit" />,
  },
  {
    name: "Candidates",
    link: "candidate-list",
    icon: <UsersIcon className=" h-5 w-5 bg-inherit text-inherit" />,
  },
  {
    name: "Voters",
    link: "voter-list",
    icon: (
      <ClipboardDocumentListIcon className=" h-6 w-6 bg-inherit text-inherit" />
    ),
  },
];

export const VoterMenuLinks = [
  {
    name: "Elections",
    link: "",
    icon: (
      <ArchiveBoxArrowDownIcon className="h-6 w-6 bg-inherit text-inherit" />
    ),
  },
  {
    name: "Help",
    link: "help",
    icon: <InformationCircleIcon className="h-6 w-6 bg-inherit text-inherit" />,
  },
];
