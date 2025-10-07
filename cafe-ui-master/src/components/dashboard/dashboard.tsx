import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CategoryIcon from "@mui/icons-material/Category";
import Toolbar from "@mui/material/Toolbar";
import Navbar from "../navbar/navbar";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { getJwtToken, logout } from "../../shared/utils";
import { useEffect, useState } from "react";
import { AlertColor } from "@mui/material";
import Toaster from "../toaster/toaster";
import Home from "./components/home/home";
import Category from "./components/category/category";
import Product from "./components/product/product";
import Bill from "./components/bill/bill";
import User from "./components/user/user";
import Order from "./components/order/order";
import {
  ALERT_COLOR_INFO,
  DASHBOARD_ITEMS,
  DRAWER_WIDTH,
  ROLES,
  TOASTER_SEVERITY_WARNING,
} from "../../shared/constants";

const drawerWidth = DRAWER_WIDTH;

interface Props {
  window?: () => Window;
}

export default function Dashboard(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>(ALERT_COLOR_INFO);
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");
  const { userData, expired } = getJwtToken();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const dashboardItems = [
    {
      label: DASHBOARD_ITEMS.DASHBOARD,
      component: <SpaceDashboardIcon />,
    },
    {
      label: DASHBOARD_ITEMS.MANAGE_CATEGORY,
      component: <CategoryIcon />,
    },
    {
      label: DASHBOARD_ITEMS.MANAGE_PRODUCT,
      component: <Inventory2Icon />,
    },
    {
      label: DASHBOARD_ITEMS.MANAGE_ORDER,
      component: <ShoppingCartIcon />,
    },
    {
      label: DASHBOARD_ITEMS.VIEW_BILL,
      component: <ReceiptLongIcon />,
    },
    {
      label: DASHBOARD_ITEMS.MANAGE_USERS,
      component: <PeopleAltIcon />,
    },
  ];

  const renderComponent = () => {
    // Add logic to render the component based on the selected item
    switch (selectedItem) {
      case DASHBOARD_ITEMS.DASHBOARD:
        return <Home />;
      case DASHBOARD_ITEMS.MANAGE_CATEGORY:
        return <Category role={userData?.role} />;

      case DASHBOARD_ITEMS.MANAGE_PRODUCT:
        return <Product role={userData?.role} />;

      case DASHBOARD_ITEMS.MANAGE_ORDER:
        return <Order />;

      case DASHBOARD_ITEMS.VIEW_BILL:
        return <Bill />;

      case DASHBOARD_ITEMS.MANAGE_USERS:
        return <User />;

      default:
        return <Home />;
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (label: string) => {
    setSelectedItem(label);
  };

  useEffect(() => {
    if (expired) {
      setIsAlert(true);
      setSeverity(TOASTER_SEVERITY_WARNING);
      setAutoHideDuration(4000);
      setAlertMessage("Session Expired!! Please Login Again!");
      logout(userData);
    }
  }, [expired, userData]);

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {dashboardItems.map((items, index) =>
          userData?.role !== ROLES.ADMIN &&
          items.label === DASHBOARD_ITEMS.MANAGE_USERS ? null : (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={selectedItem === items.label}
                onClick={() => handleListItemClick(items.label)}
              >
                <ListItemIcon>{items.component}</ListItemIcon>
                <ListItemText primary={items.label} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </div>
  );

  const handleClose = () => {
    setIsAlert(false);
  };

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        {isAlert && alertMessage && (
          <Toaster
            isAlert={isAlert}
            severity={severity}
            autoHideDuration={autoHideDuration}
            handleClose={handleClose}
            alertMessage={alertMessage}
          />
        )}
        <Navbar />
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderComponent()}
      </Box>
    </Box>
  );
}
