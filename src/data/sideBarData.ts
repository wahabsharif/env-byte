import { AiFillHome } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { FaFileShield } from "react-icons/fa6";

export const sideBarData = [
  {
    title: "Dashboard",
    icon: AiFillHome,
    path: "/dash",
  },
  {
    title: "Clients",
    icon: FaUsers,
    path: "/clients",
  },
  {
    title: "Projects",
    icon: FaFileShield,
    path: "/projects",
  },
];
