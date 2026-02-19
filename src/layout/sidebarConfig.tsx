import type { ReactNode } from "react";
import {
  BoxCubeIcon,
  CalenderIcon,
  GridIcon,
  ListIcon,
  LockIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import type { TranslationKey } from "../i18n/translations";

export type SidebarSubItem = {
  labelKey: TranslationKey;
  path: string;
  badge?: "new" | "pro";
};

export type SidebarItem = {
  labelKey: TranslationKey;
  icon: ReactNode;
  path?: string;
  subItems?: SidebarSubItem[];
};

export const mainNavItems: SidebarItem[] = [
  {
    icon: <GridIcon />,
    labelKey: "sidebar.dashboard",
    subItems: [{ labelKey: "sidebar.ecommerce", path: "/" }],
  },
  {
    icon: <TableIcon />,
    labelKey: "sidebar.automation",
    subItems: [{ labelKey: "sidebar.usageComparison", path: "/usage-comparison" }],
  },
];

export const otherNavItems: SidebarItem[] = [
  {
    icon: <CalenderIcon />,
    labelKey: "sidebar.calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    labelKey: "sidebar.userProfile",
    path: "/profile",
  },
  {
    labelKey: "sidebar.forms",
    icon: <ListIcon />,
    subItems: [{ labelKey: "sidebar.formElements", path: "/form-elements" }],
  },
  {
    labelKey: "sidebar.tables",
    icon: <TableIcon />,
    subItems: [{ labelKey: "sidebar.basicTables", path: "/basic-tables" }],
  },
  {
    labelKey: "sidebar.pages",
    icon: <PageIcon />,
    subItems: [
      { labelKey: "sidebar.blankPage", path: "/blank" },
      { labelKey: "sidebar.error404", path: "/error-404" },
    ],
  },
  {
    icon: <PieChartIcon />,
    labelKey: "sidebar.charts",
    subItems: [
      { labelKey: "sidebar.lineChart", path: "/line-chart" },
      { labelKey: "sidebar.barChart", path: "/bar-chart" },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    labelKey: "sidebar.uiElements",
    subItems: [
      { labelKey: "sidebar.alerts", path: "/alerts" },
      { labelKey: "sidebar.avatar", path: "/avatars" },
      { labelKey: "sidebar.badge", path: "/badge" },
      { labelKey: "sidebar.buttons", path: "/buttons" },
      { labelKey: "sidebar.images", path: "/images" },
      { labelKey: "sidebar.videos", path: "/videos" },
    ],
  },
  {
    icon: <PlugInIcon />,
    labelKey: "sidebar.authentication",
    subItems: [
      { labelKey: "sidebar.signIn", path: "/signin" },
      { labelKey: "sidebar.signUp", path: "/signup" },
    ],
  },
];

export const systemNavItems: SidebarItem[] = [
  {
    icon: <LockIcon />,
    labelKey: "sidebar.systemMenu",
    subItems: [
      { labelKey: "sidebar.rolePermissions", path: "/system/role-permissions" },
      { labelKey: "sidebar.userRoles", path: "/system/user-roles" },
    ],
  },
];
