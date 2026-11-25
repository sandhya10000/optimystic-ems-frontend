import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard,
  VerifiedUser,
  People,
  Person,
  ReceiptLong,
  LaptopMac,
  CalendarMonth,
  Business,
  Logout,
  Close,
} from "@mui/icons-material";

const DRAWER_WIDTH = 260;

const COLORS = {
  dark: "#0B403C",
  primary: "#0F887D",
  orange: "#F59E0B",
  background: "#F0F8F6",
  white: "#FFFFFF",
  border: "#DCEBE7",
  text: "#174D47",
  secondary: "#64748B",
};

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: <Dashboard />,
    end: true,
  },
  {
    title: "Create Employee",
    path: "/admin/createEmployee",
    icon: <Dashboard />,
    end: true,
  },

  {
    title: "KYC Management",
    path: "/admin/kyc",
    icon: <VerifiedUser />,
  },

  {
    title: "Employee Profile",
    path: "/admin/employee-profile",
    icon: <Person />,
  },
  {
    title: "Salary Slip Management",
    path: "/admin/salary-slips",
    icon: <ReceiptLong />,
  },
  {
    title: "Asset Management",
    path: "/admin/assets",
    icon: <LaptopMac />,
  },
  {
    title: "Attendance Management",
    path: "/admin/attendance",
    icon: <CalendarMonth />,
  },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  // Logged-in admin details
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const adminName = storedUser?.name || storedUser?.fullName || "Admin";

  const adminInitial = adminName.charAt(0).toUpperCase();

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: COLORS.dark,
        color: COLORS.white,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 75,
          display: "flex",
          alignItems: "center",
          px: 2.5,
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: COLORS.orange,
            color: COLORS.dark,
            width: 42,
            height: 42,
          }}
        >
          <Business />
        </Avatar>

        <Box>
          <Typography fontWeight={800} fontSize={20}>
            EMS{" "}
            <Box component="span" sx={{ color: "#36B5A6" }}>
              Admin
            </Box>
          </Typography>

          <Typography fontSize={11} color="#A7D8CE">
            Employee Management System
          </Typography>
        </Box>

        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: "#FFFFFF", ml: "auto" }}
          >
            <Close />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

      {/* Navigation Heading */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography
          sx={{
            color: "#A7D8CE",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            mb: 1.5,
          }}
        >
          ADMIN MENU
        </Typography>
      </Box>

      {/* Navigation Links */}
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.end || false}
            onClick={() => {
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              borderRadius: "10px",
              mb: 0.7,
              py: 1.3,
              color: "#D6EAE6",
              transition: "0.2s",

              "& .MuiListItemIcon-root": {
                color: "#A7D8CE",
                minWidth: 40,
              },

              "&.active": {
                bgcolor: COLORS.primary,
                color: COLORS.white,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",

                "& .MuiListItemIcon-root": {
                  color: COLORS.orange,
                },
              },

              "&:hover": {
                bgcolor: "rgba(255,255,255,0.10)",
              },

              "&.active:hover": {
                bgcolor: COLORS.primary,
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: 13.5,
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Divider
          sx={{
            borderColor: "rgba(255,255,255,0.12)",
            mb: 2,
          }}
        />

        <Button
          fullWidth
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            color: "#FFFFFF",
            justifyContent: "flex-start",
            px: 2,
            py: 1.2,
            borderRadius: "10px",
            textTransform: "none",

            "&:hover": {
              bgcolor: "rgba(255,255,255,0.10)",
            },
          }}
        >
          Logout
        </Button>

        <Typography textAlign="center" color="#A7D8CE" fontSize={10} mt={2}>
          © {new Date().getFullYear()} EMS Portal
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: COLORS.background,
      }}
    >
      {/* Top Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: COLORS.white,
          color: COLORS.dark,
          borderBottom: `1px solid ${COLORS.border}`,
          zIndex: theme.zIndex.drawer + 1,
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: "70px !important" }}>
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: COLORS.dark, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            fontWeight={800}
            fontSize={{ xs: 16, md: 19 }}
            color={COLORS.dark}
          >
            Admin Dashboard
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Typography
            variant="body2"
            color={COLORS.secondary}
            sx={{
              mr: 1.5,
              display: { xs: "none", sm: "block" },
            }}
          >
            Welcome, {adminName}
          </Typography>

          <Avatar
            sx={{
              bgcolor: COLORS.orange,
              color: COLORS.dark,
              width: 38,
              height: 38,
              fontWeight: 700,
            }}
          >
            {adminInitial}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              border: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              border: "none",
              position: "fixed",
              height: "100vh",
              overflowY: "auto",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: "70px !important" }} />

        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
