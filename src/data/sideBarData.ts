import { AiFillHome } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { FaFileShield } from "react-icons/fa6";

export const sideBarData = [
  {
    title: "Dashboard",
    icon: AiFillHome,
    path: "/dashboard",
  },
  {
    title: "Clients",
    icon: FaUsers,
    path: "/dashboard/clients",
  },
  {
    title: "Projects",
    icon: FaFileShield,
    path: "/dashboard/projects",
  },
];
