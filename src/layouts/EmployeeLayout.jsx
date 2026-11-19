import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

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
  Collapse,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard,
  AssignmentTurnedIn,
  Person,
  CalendarMonth,
  LaptopMac,
  AccountBalanceWallet,
  Business,
  Logout,
  Close,
  ExpandLess,
  ExpandMore,
  Description,
  Badge,
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
    path: "/employee",
    icon: <Dashboard />,
    end: true,
  },
  {
    title: "KYC",
    icon: <AssignmentTurnedIn />,
    children: [
      {
        title: "PAN Verification",
        path: "/employee/kyc/pan-verification",
        icon: <Description />,
      },
      {
        title: "Aadhaar Verification",
        path: "/employee/kyc/aadhaar-verification",
        icon: <Badge />,
      },
    ],
  },
  {
    title: "My Profile",
    path: "/employee/profile",
    icon: <Person />,
  },
  {
    title: "Attendance",
    path: "/employee/attendance",
    icon: <CalendarMonth />,
  },
  {
    title: "Assets",
    path: "/employee/assets",
    icon: <LaptopMac />,
  },
  {
    title: "Salary Slip",
    path: "/employee/payslips",
    icon: <AccountBalanceWallet />,
  },
];

const EmployeeLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [kycOpen, setKycOpen] = useState(
    location.pathname.startsWith("/employee/kyc"),
  );

  // Automatically expand KYC when one of its pages is active
  useEffect(() => {
    if (location.pathname.startsWith("/employee/kyc")) {
      setKycOpen(true);
    }
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const handleNavigation = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

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
              Portal
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

      {/* Navigation */}
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
          MAIN MENU
        </Typography>
      </Box>

      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => {
          // KYC parent menu
          if (item.children) {
            const isKycActive = location.pathname.startsWith("/employee/kyc");

            return (
              <Box key={item.title}>
                <ListItemButton
                  onClick={() => setKycOpen((prev) => !prev)}
                  sx={{
                    borderRadius: "10px",
                    mb: 0.7,
                    py: 1.3,
                    color: isKycActive ? COLORS.white : "#D6EAE6",
                    bgcolor: isKycActive
                      ? "rgba(15,136,125,0.25)"
                      : "transparent",

                    "& .MuiListItemIcon-root": {
                      color: isKycActive ? COLORS.orange : "#A7D8CE",
                      minWidth: 40,
                    },

                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.10)",
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>

                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  />

                  {kycOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={kycOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        component={NavLink}
                        to={child.path}
                        onClick={handleNavigation}
                        sx={{
                          pl: 5,
                          py: 1.1,
                          mb: 0.5,
                          borderRadius: "10px",
                          color: "#D6EAE6",

                          "& .MuiListItemIcon-root": {
                            color: "#A7D8CE",
                            minWidth: 34,
                          },

                          "&.active": {
                            bgcolor: COLORS.primary,
                            color: COLORS.white,

                            "& .MuiListItemIcon-root": {
                              color: COLORS.orange,
                            },
                          },

                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.10)",
                          },
                        }}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>

                        <ListItemText
                          primary={child.title}
                          primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          // Normal navigation items
          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              end={item.end || false}
              onClick={handleNavigation}
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
                  fontSize: 14,
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          );
        })}
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
            Employee Dashboard
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
            Welcome, Employee
          </Typography>

          <Avatar
            sx={{
              bgcolor: COLORS.orange,
              color: COLORS.dark,
              width: 38,
              height: 38,
            }}
          >
            E
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

export default EmployeeLayout;
