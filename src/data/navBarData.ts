export interface MenuItem {
  label: string;
  href: string;
  submenu?: MenuItem[];
  isButton?: boolean;
}

export const navBarData: MenuItem[] = [
  {
    label: "Solutions",
    href: "#",
    submenu: [
      { label: "Custom Software Development", href: "#" },
      { label: "Web Application Development", href: "#" },
      { label: "Mobile App Development", href: "#" },
      { label: "Cloud Solutions", href: "#" },
      { label: "UI/UX Design", href: "#" },
    ],
  },
  {
    label: "Show Case",
    href: "#",
  },
  {
    label: "Resources",
    href: "#",
    submenu: [
      { label: "Blog", href: "#" },
      { label: "Whitepapers", href: "#" },
      { label: "Webinars", href: "#" },
    ],
  },
  {
    label: "About Us",
    href: "#",
  },
  {
    label: "Contact",
    href: "#",
  },
];
