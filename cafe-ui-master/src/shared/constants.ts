import { AlertColor } from "@mui/material";

export const paymentMethods = [
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "UPI",
    label: "UPI",
  },
  {
    value: "Card",
    label: "Card",
  },
];

export const availability = [
  {
    value: "true",
    label: "Yes",
  },
  {
    value: "false",
    label: "No",
  },
];

export const status = [
  {
    value: "true",
    label: "true",
  },
  {
    value: "false",
    label: "false",
  },
];

export const pages = ["Login", "Signup", "Forgot Password?"];

export const ROLES = {
  ADMIN: "ADMIN",
};

export const ROUTES = {
  ROOT: "/",
  PROFILE: "/profile",
  DASHBOARD: "/dashboard",
};

export const LABELS = {
  PROFILE: "Profile",
};

export const ALERT_COLOR_INFO: AlertColor = "info";

export const DASHBOARD_ITEMS = {
  DASHBOARD: "Dashboard",
  MANAGE_CATEGORY: "Manage Category",
  MANAGE_PRODUCT: "Manage Product",
  MANAGE_ORDER: "Manage Order",
  VIEW_BILL: "View Bill",
  MANAGE_USERS: "Manage Users",
};

export const DRAWER_WIDTH = 240;

export const TOASTER_SEVERITY_WARNING: AlertColor = "warning";
export const TABLE_HEADER_COLOR = "#3559E0";
export const ROWS_PER_PAGE = "Rows per page:";
