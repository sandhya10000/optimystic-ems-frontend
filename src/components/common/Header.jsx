import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Close as CloseIcon,
  BusinessCenter,
} from "@mui/icons-material";

import { Link as RouterLink, useNavigate } from "react-router-dom";

const COLORS = {
  darkGreen: "#0b403d",
  green: "#0e8278",
  greenHover: "#096c64",
  orange: "#f59e0b",
  lightGreen: "#f1f8f7",
  white: "#ffffff",
};

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/" },
  { label: "Contact", path: "/" },
];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setDrawerOpen(false);

    if (path.includes("#")) {
      const [route, section] = path.split("#");

      if (window.location.pathname !== route) {
        navigate(route || "/");

        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({
            behavior: "smooth",
          });
        }, 100);
      } else {
        document.getElementById(section)?.scrollIntoView({
          behavior: "smooth",
        });
      }

      return;
    }

    navigate(path);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: COLORS.white,
          borderBottom: "1px solid #dce8e7",
          color: COLORS.darkGreen,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: 76,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                textDecoration: "none",
                color: COLORS.darkGreen,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  backgroundColor: COLORS.darkGreen,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BusinessCenter
                  sx={{
                    color: COLORS.orange,
                    fontSize: 25,
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ color: COLORS.darkGreen }}
              >
                EMS
                <Box component="span" sx={{ color: COLORS.green, ml: 0.5 }}>
                  Portal
                </Box>
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 3,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: COLORS.darkGreen,
                    fontWeight: 600,
                    "&:hover": {
                      color: COLORS.green,
                      backgroundColor: COLORS.lightGreen,
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Auth Buttons */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Button
                component={RouterLink}
                to="/login"
                sx={{
                  color: COLORS.green,
                  fontWeight: 700,
                }}
              >
                Login
              </Button>

              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                sx={{
                  backgroundColor: COLORS.green,
                  color: COLORS.white,
                  fontWeight: 700,
                  px: 2.5,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: COLORS.greenHover,
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>

            {/* Mobile Menu */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: COLORS.darkGreen,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 280,
            backgroundColor: COLORS.white,
            minHeight: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              backgroundColor: COLORS.darkGreen,
            }}
          >
            <Typography fontWeight={800} sx={{ color: COLORS.white }}>
              EMS Portal
            </Typography>

            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ color: COLORS.orange }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    "&:hover": {
                      backgroundColor: COLORS.lightGreen,
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: COLORS.darkGreen,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            <ListItem>
              <Button
                fullWidth
                component={RouterLink}
                to="/login"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  color: COLORS.green,
                  fontWeight: 700,
                }}
              >
                Login
              </Button>
            </ListItem>

            <ListItem>
              <Button
                fullWidth
                component={RouterLink}
                to="/signup"
                variant="contained"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  backgroundColor: COLORS.green,
                  color: COLORS.white,
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: COLORS.greenHover,
                  },
                }}
              >
                Sign Up
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
