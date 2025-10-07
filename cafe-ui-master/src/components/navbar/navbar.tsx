import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Button,
  AlertColor,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../assets/logo.png";
import NavAvatar from "../avatar/avatar";
import LoginModal from "../modal/login-modal";
import Toaster from "../toaster/toaster";
import { UserData, getJwtToken, logout } from "../../shared/utils";
import { useNavigate } from "react-router-dom";
import { pages } from "../../shared/constants";
import ForgotPasswordModal from "../modal/forgot-password-modal";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");
  const [userData, setUserData] = useState<UserData | undefined>();
  const [expired, setExpired] = useState<boolean | undefined>(true);
  const [profile, setProfile] = useState(false);
  const [isForgotPassword,setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null);
    setOpen(false);
  };

  const handleClose = () => {
    setIsAlert(false);
  };

  const handleModalClose = () => {
    setProfile(false);
  };

  const settings = [
    {
      label: "Dashboard",
      route: "/dashboard",
    },
    {
      label: "Profile",
      route: "/profile",
      states: { profile: profile, setProfile: handleModalClose },
    },
    {
      label: "Logout",
      route: "/",
    },
  ];

  const handleOptionClose = (label: string) => {
    setAnchorElNav(null);
    switch (label) {
      case "Login": {
        setOpen(true);
        setIsLogin(true);
        return;
      }
      case "Signup": {
        setOpen(true);
        setIsLogin(false);
        return;
      }
      case "Forgot Password?" : {
        setIsForgotPassword(true);
        return;
      }
    }
  };

  useEffect(() => {
    const { userData, expired } = getJwtToken();
    setUserData(userData);
    setExpired(expired);
    if (expired) {
      setIsAlert(true);
      setSeverity("warning");
      setAutoHideDuration(4000);
      setAlertMessage("Session Expired!! Please Login Again!");
      logout(userData);
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (isAlert) {
      setTimeout(() => {
        setIsAlert(false);
      }, autoHideDuration);
    }
  }, [isAlert, autoHideDuration, setIsAlert]);
  return (
    <AppBar position="static">
      {isAlert && alertMessage && (
        <Toaster
          isAlert={isAlert}
          severity={severity}
          autoHideDuration={autoHideDuration}
          handleClose={handleClose}
          alertMessage={alertMessage}
        />
      )}
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            className="hidden lg:block cursor-pointer"
            src={Logo}
            width={"40px"}
            alt="..."
            onClick={()=>navigate('/')}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 3,
              ml: 1,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Cafe Management System
          </Typography>
          {!expired && <Box sx={{ flexGrow: 1 }} />}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {!expired && (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            )}
            {expired && (
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleOptionClose(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
          <img src={Logo} width={"30px"} alt="..." className="md:hidden" />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              ml: 1,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Cafe Management System
          </Typography>
          {expired && <Box sx={{ flexGrow: 20 }} />}
          {expired && (
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleOptionClose(page)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          )}
          {!expired && (
            <NavAvatar
              settings={settings}
              avatarText={userData?.sub?.toUpperCase().charAt(0)}
            />
          )}
          <LoginModal open={open} setOpen={setOpen} isLogin={isLogin} setIsLogin={setIsLogin}/>
          <ForgotPasswordModal  open={isForgotPassword} setOpen={setIsForgotPassword}/>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
