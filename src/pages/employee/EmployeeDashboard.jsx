import { useEffect, useState } from "react";
import { CircularProgress, Alert } from "@mui/material";
import { getEmployeeDashboard } from "../../services/employeeService";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Divider,
  Chip,
} from "@mui/material";

import {
  Person,
  AccessTime,
  Email,
  CalendarMonth,
  NotificationsNone,
  HelpOutline,
  AccountCircle,
} from "@mui/icons-material";

// EMS Portal Theme
const COLORS = {
  dark: "#0B403C",
  primary: "#0F887D",
  orange: "#F59E0B",
  background: "#F0F8F6",
  white: "#FFFFFF",
  text: "#174D47",
  secondary: "#64748B",
  border: "#DCEBE7",
  lightGreen: "#E5F3F0",
};

// Get logged-in employee
const getLoggedInUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    return {};
  }
};

const EmployeeDashboard = () => {
  const [user, setUser] = useState(getLoggedInUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await getEmployeeDashboard();

        if (response.success) {
          const employee = response.data.employee;

          setUser(employee);

          // Keep latest employee details in localStorage
          localStorage.setItem("user", JSON.stringify(employee));
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Keep your existing employeeName, employeeEmail,
  // employeeRole, initials and dashboard UI below.

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";

  const employeeName =
    `${firstName} ${lastName}`.trim() ||
    user.name ||
    user.username ||
    "Employee";

  const employeeEmail = user.email || "Email not available";

  const employeeRole = user.role
    ? user.role
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Employee";

  const initials = employeeName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.background,
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* ================= WELCOME BANNER ================= */}

      <Box
        sx={{
          background: `linear-gradient(120deg, ${COLORS.dark}, ${COLORS.primary})`,
          borderRadius: "20px",
          p: { xs: 3, md: 4 },
          color: COLORS.white,
          position: "relative",
          overflow: "hidden",
          mb: 4,
          boxShadow: "0 12px 30px rgba(11,64,60,0.12)",
        }}
      >
        {/* Decorative Circle */}

        <Box
          sx={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            border: "35px solid rgba(255,255,255,0.07)",
            right: -60,
            top: -100,
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={3}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box>
            <Chip
              label="EMPLOYEE DASHBOARD"
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.15)",
                color: COLORS.white,
                fontWeight: 700,
                mb: 2,
                letterSpacing: 1,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1.5,
                fontSize: { xs: 25, md: 34 },
              }}
            >
              Welcome Back, {employeeName}!
            </Typography>

            <Typography
              sx={{
                color: "#D6F1EB",
                fontSize: { xs: 14, md: 16 },
                maxWidth: 550,
                lineHeight: 1.8,
              }}
            >
              We are happy to have you here. Manage your employee information
              and stay updated with your work.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonth sx={{ color: COLORS.orange, fontSize: 20 }} />
                <Typography variant="body2" color="#E2F5F0">
                  {currentDate}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTime sx={{ color: COLORS.orange, fontSize: 20 }} />
                <Typography variant="body2" color="#E2F5F0">
                  {currentTime}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: COLORS.orange,
              color: COLORS.dark,
              fontSize: 30,
              fontWeight: 800,
              border: "5px solid rgba(255,255,255,0.2)",
            }}
          >
            {initials}
          </Avatar>
        </Stack>
      </Box>

      {/* ================= PAGE HEADING ================= */}

      <Box mb={3}>
        <Typography variant="h5" fontWeight={800} color={COLORS.dark}>
          Dashboard Overview
        </Typography>

        <Typography variant="body2" color={COLORS.secondary} mt={0.5}>
          Here is your personal employee workspace.
        </Typography>
      </Box>

      {/* ================= EMPLOYEE INFORMATION ================= */}

      <Grid container spacing={3} mb={4}>
        {/* Employee Profile Card */}

        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: "16px",
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.white,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar
                  sx={{
                    bgcolor: COLORS.lightGreen,
                    color: COLORS.primary,
                    width: 52,
                    height: 52,
                  }}
                >
                  <Person />
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight={800} color={COLORS.dark}>
                    My Information
                  </Typography>

                  <Typography variant="body2" color={COLORS.secondary}>
                    Your registered account details
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor: COLORS.border, mb: 2.5 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5}>
                    <AccountCircle sx={{ color: COLORS.primary }} />

                    <Box>
                      <Typography variant="caption" color={COLORS.secondary}>
                        Employee Name
                      </Typography>

                      <Typography fontWeight={700} color={COLORS.dark}>
                        {employeeName}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5}>
                    <Email sx={{ color: COLORS.primary }} />

                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color={COLORS.secondary}>
                        Email Address
                      </Typography>

                      <Typography
                        fontWeight={700}
                        color={COLORS.dark}
                        sx={{ wordBreak: "break-word" }}
                      >
                        {employeeEmail}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5}>
                    <Person sx={{ color: COLORS.primary }} />

                    <Box>
                      <Typography variant="caption" color={COLORS.secondary}>
                        Account Role
                      </Typography>

                      <Typography fontWeight={700} color={COLORS.dark}>
                        {employeeRole}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                {user.employeeId && (
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1.5}>
                      <AccountCircle sx={{ color: COLORS.primary }} />

                      <Box>
                        <Typography variant="caption" color={COLORS.secondary}>
                          Employee ID
                        </Typography>

                        <Typography fontWeight={700} color={COLORS.dark}>
                          {user.employeeId}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Date and Time Card */}

        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: "16px",
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.white,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: "#FFF5DF",
                    color: COLORS.orange,
                    width: 52,
                    height: 52,
                  }}
                >
                  <CalendarMonth />
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight={800} color={COLORS.dark}>
                    Today's Overview
                  </Typography>

                  <Typography variant="body2" color={COLORS.secondary}>
                    Current date and time
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor: COLORS.border, mb: 2 }} />

              <Typography variant="h5" fontWeight={800} color={COLORS.primary}>
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>

              <Typography color={COLORS.secondary} mt={1}>
                {currentDate}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                <AccessTime sx={{ color: COLORS.orange }} />

                <Typography fontWeight={700} color={COLORS.dark}>
                  {currentTime}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ================= NOTIFICATIONS ================= */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.white,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: COLORS.lightGreen,
                    color: COLORS.primary,
                  }}
                >
                  <NotificationsNone />
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight={800} color={COLORS.dark}>
                    Recent Updates
                  </Typography>

                  <Typography variant="body2" color={COLORS.secondary}>
                    Important employee announcements
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor: COLORS.border, mb: 2 }} />

              <Box
                sx={{
                  textAlign: "center",
                  py: 3,
                }}
              >
                <NotificationsNone
                  sx={{
                    fontSize: 40,
                    color: "#A7C9C1",
                    mb: 1,
                  }}
                />

                <Typography fontWeight={700} color={COLORS.dark}>
                  No New Updates
                </Typography>

                <Typography variant="body2" color={COLORS.secondary} mt={0.5}>
                  You are all caught up! Check back later for new announcements.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Help & Support */}

        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: `1px solid ${COLORS.border}`,
              bgcolor: COLORS.white,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: "#FFF5DF",
                    color: COLORS.orange,
                  }}
                >
                  <HelpOutline />
                </Avatar>

                <Typography variant="h6" fontWeight={800} color={COLORS.dark}>
                  Help & Support
                </Typography>
              </Stack>

              <Divider sx={{ borderColor: COLORS.border, mb: 2 }} />

              <Typography
                variant="body2"
                color={COLORS.secondary}
                lineHeight={1.8}
              >
                Need assistance with your profile, attendance, KYC or salary
                details? Contact your HR department.
              </Typography>

              <Box
                sx={{
                  bgcolor: COLORS.lightGreen,
                  borderRadius: "10px",
                  p: 2,
                  mt: 2,
                }}
              >
                <Typography fontWeight={700} color={COLORS.dark}>
                  Employee Support
                </Typography>

                <Typography variant="body2" color={COLORS.primary} mt={0.5}>
                  Contact your HR Administrator
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ================= FOOTER ================= */}

      <Box textAlign="center" mt={4} pb={1}>
        <Typography variant="body2" color={COLORS.secondary}>
          © {new Date().getFullYear()} EMS Portal. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;
