import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  People,
  PersonAdd,
  Person,
  CalendarMonth,
  ReceiptLong,
  LaptopMac,
  TrendingUp,
  MoreVert,
  ArrowForward,
  CheckCircle,
  PendingActions,
  AssignmentTurnedIn,
  Business,
  Refresh,
} from "@mui/icons-material";

import { adminAPI } from "../../services/authService";

// --------------------------------------------------
// COLORS
// --------------------------------------------------

const COLORS = {
  dark: "#0B403C",
  primary: "#0F887D",
  light: "#E5F4F0",
  orange: "#F59E0B",
  background: "#F0F8F6",
  white: "#FFFFFF",
  border: "#DCEBE7",
  text: "#174D47",
  secondary: "#64748B",
  red: "#DC6464",
  blue: "#4F83CC",
};

// --------------------------------------------------
// QUICK ACTIONS
// --------------------------------------------------

const quickActions = [
  {
    title: "Add Employee",
    description: "Register a new employee",
    icon: <PersonAdd />,
    color: COLORS.primary,
    bg: "#E5F4F0",
    path: "/admin/employees",
  },
  {
    title: "Manage Profiles",
    description: "View employee profiles",
    icon: <Person />,
    color: COLORS.blue,
    bg: "#EAF1FC",
    path: "/admin/employee-profile",
  },
  {
    title: "Salary Slips",
    description: "Create and manage salary slips",
    icon: <ReceiptLong />,
    color: COLORS.orange,
    bg: "#FFF4DD",
    path: "/admin/salary-slips",
  },
  {
    title: "Manage Assets",
    description: "Add and assign assets",
    icon: <LaptopMac />,
    color: "#8B70C9",
    bg: "#F0ECFA",
    path: "/admin/assets",
  },
];

// --------------------------------------------------
// ADMIN DASHBOARD
// --------------------------------------------------

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH DASHBOARD DATA
  // --------------------------------------------------

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminAPI.getAdminDashboard();

      if (response?.success) {
        setDashboardData(response.dashboard || {});
      } else {
        setDashboardData(null);
        setError(response?.message || "Unable to load dashboard data.");
      }
    } catch (error) {
      console.error("Admin Dashboard API Error:", error);

      setDashboardData(null);
      setError(
        error?.message || "Something went wrong while loading dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // LOAD API ON COMPONENT MOUNT
  // --------------------------------------------------

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const handleNavigate = (path) => {
    navigate(path);
  };

  // --------------------------------------------------
  // API RESPONSE DATA
  // --------------------------------------------------

  const statsData = dashboardData?.stats || {};

  const attendance = statsData.todayAttendance || {};

  const attendanceOverview = dashboardData?.attendanceOverview || {};

  const pendingTasks = dashboardData?.pendingTasks || {};

  const organization = dashboardData?.organizationSummary || {};

  const recentEmployees = Array.isArray(dashboardData?.recentEmployees)
    ? dashboardData.recentEmployees
    : [];

  // --------------------------------------------------
  // STATISTICS CARDS
  // --------------------------------------------------

  const stats = [
    {
      title: "Total Employees",
      value: statsData.totalEmployees ?? 0,
      change: "",
      description: "Total registered employees",
      icon: <People />,
      color: COLORS.primary,
      bg: "#E3F4EF",
    },
    {
      title: "Active Employees",
      value: statsData.activeEmployees ?? 0,
      change: "",
      description: "Currently active",
      icon: <CheckCircle />,
      color: "#27966E",
      bg: "#E5F5EC",
    },
    {
      title: "Pending KYC",
      value: statsData.pendingKyc ?? 0,
      change: "Needs attention",
      description: "Awaiting verification",
      icon: <PendingActions />,
      color: COLORS.orange,
      bg: "#FFF4DD",
    },
    {
      title: "Today's Attendance",
      value: attendance.present ?? 0,
      change: `${attendance.attendanceRate ?? 0}%`,
      description: "Attendance rate",
      icon: <CalendarMonth />,
      color: COLORS.blue,
      bg: "#EAF1FC",
    },
  ];

  // --------------------------------------------------
  // ATTENDANCE DATA
  // --------------------------------------------------

  const attendanceData = [
    {
      label: "Present",
      value: attendanceOverview.present ?? 0,
      color: COLORS.primary,
    },
    {
      label: "Absent",
      value: attendanceOverview.absent ?? 0,
      color: COLORS.red,
    },
    {
      label: "On Leave",
      value: attendanceOverview.onLeave ?? 0,
      color: COLORS.orange,
    },
    {
      label: "Work From Home",
      value: attendanceOverview.workFromHome ?? 0,
      color: COLORS.blue,
    },
  ];

  // --------------------------------------------------
  // PENDING TASKS
  // --------------------------------------------------

  const taskList = [
    {
      title: "KYC Verification",
      count: `${pendingTasks.pendingKyc ?? 0} Pending`,
      icon: <AssignmentTurnedIn />,
      color: COLORS.orange,
      path: "/admin/employee-profile",
    },
    {
      title: "Salary Slip Processing",
      count: `${pendingTasks.salarySlipsToGenerate ?? 0} To Generate`,
      icon: <ReceiptLong />,
      color: COLORS.primary,
      path: "/admin/salary-slips",
    },
    {
      title: "Asset Assignment",
      count: `${pendingTasks.unassignedAssets ?? 0} Unassigned`,
      icon: <LaptopMac />,
      color: COLORS.blue,
      path: "/admin/assets",
    },
  ];

  // --------------------------------------------------
  // ORGANIZATION SUMMARY
  // --------------------------------------------------

  const organizationSummary = [
    {
      label: "Total Departments",
      value: organization.totalDepartments ?? 0,
    },
    {
      label: "Total Assets",
      value: organization.totalAssets ?? 0,
    },
    {
      label: "On Leave Today",
      value: organization.onLeaveToday ?? 0,
    },
    {
      label: "New This Month",
      value: organization.newEmployeesThisMonth ?? 0,
    },
  ];

  // --------------------------------------------------
  // EMPLOYEE INITIALS
  // --------------------------------------------------

  const getInitials = (name = "") => {
    return (
      String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "NA"
    );
  };

  // --------------------------------------------------
  // LOADING UI
  // --------------------------------------------------

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          bgcolor: COLORS.background,
        }}
      >
        <CircularProgress sx={{ color: COLORS.primary }} />

        <Typography color={COLORS.secondary}>Loading dashboard...</Typography>
      </Box>
    );
  }

  // --------------------------------------------------
  // ERROR UI
  // --------------------------------------------------

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          p: 3,
          bgcolor: COLORS.background,
        }}
      >
        <Alert
          severity="error"
          sx={{
            maxWidth: 500,
            width: "100%",
          }}
        >
          {error}
        </Alert>

        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchDashboard}
          sx={{
            bgcolor: COLORS.primary,
            textTransform: "none",
            "&:hover": {
              bgcolor: COLORS.dark,
            },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: COLORS.background,
        minHeight: "calc(100vh - 70px)",
      }}
    >
      {/* PAGE HEADER */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color={COLORS.dark}>
            Dashboard Overview
          </Typography>

          <Typography variant="body2" color={COLORS.secondary} mt={0.5}>
            Welcome back! Here's what's happening in your organization.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={fetchDashboard}
            sx={{
              color: COLORS.primary,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Refresh
          </Button>

          <Chip
            icon={<CalendarMonth />}
            label={new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            sx={{
              bgcolor: COLORS.white,
              color: COLORS.text,
              border: `1px solid ${COLORS.border}`,
              fontWeight: 600,
              height: 38,
              px: 1,
            }}
          />
        </Stack>
      </Stack>

      {/* STATISTICS CARDS */}

      <Grid container spacing={2.5} mb={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${COLORS.border}`,
                height: "100%",
                transition: "0.25s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(11,64,60,0.08)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Avatar
                    sx={{
                      bgcolor: item.bg,
                      color: item.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <IconButton size="small">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Stack>

                <Typography
                  color={COLORS.secondary}
                  fontSize={13}
                  fontWeight={600}
                  mt={2}
                >
                  {item.title}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                  <Typography variant="h4" fontWeight={800} color={COLORS.dark}>
                    {item.value}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.7}
                  mt={1}
                  flexWrap="wrap"
                >
                  {item.change && (
                    <Typography
                      fontSize={11}
                      fontWeight={700}
                      color={item.color}
                    >
                      {item.change}
                    </Typography>
                  )}

                  <Typography fontSize={11} color={COLORS.secondary}>
                    {item.description}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* QUICK ACTIONS */}

      <Box mb={3}>
        <Typography variant="h6" fontWeight={800} color={COLORS.dark} mb={2}>
          Quick Actions
        </Typography>

        <Grid container spacing={2}>
          {quickActions.map((action) => (
            <Grid item xs={12} sm={6} md={3} key={action.title}>
              <Card
                elevation={0}
                onClick={() => handleNavigate(action.path)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  border: `1px solid ${COLORS.border}`,
                  transition: "0.2s",
                  "&:hover": {
                    borderColor: COLORS.primary,
                    transform: "translateY(-3px)",
                    boxShadow: "0 5px 18px rgba(11,64,60,0.07)",
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: action.bg,
                        color: action.color,
                        width: 45,
                        height: 45,
                      }}
                    >
                      {action.icon}
                    </Avatar>

                    <Box flex={1}>
                      <Typography
                        fontWeight={700}
                        color={COLORS.dark}
                        fontSize={14}
                      >
                        {action.title}
                      </Typography>

                      <Typography
                        fontSize={11}
                        color={COLORS.secondary}
                        mt={0.4}
                      >
                        {action.description}
                      </Typography>
                    </Box>

                    <ArrowForward
                      sx={{
                        color: COLORS.secondary,
                        fontSize: 18,
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* MAIN DASHBOARD SECTIONS */}

      <Grid container spacing={2.5}>
        {/* ATTENDANCE OVERVIEW */}

        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2.5}
              >
                <Box>
                  <Typography
                    fontWeight={800}
                    color={COLORS.dark}
                    fontSize={16}
                  >
                    Attendance Overview
                  </Typography>

                  <Typography fontSize={12} color={COLORS.secondary} mt={0.5}>
                    Today's employee attendance
                  </Typography>
                </Box>

                <CalendarMonth sx={{ color: COLORS.primary }} />
              </Stack>

              <Box textAlign="center" mb={3}>
                <Typography variant="h3" fontWeight={800} color={COLORS.dark}>
                  {attendanceOverview.present ?? 0}
                </Typography>

                <Typography fontSize={12} color={COLORS.secondary}>
                  Employees Present
                </Typography>
              </Box>

              {attendanceData.map((item) => {
                const activeEmployees = Number(statsData.activeEmployees) || 0;

                const progressValue = activeEmployees
                  ? Math.min((Number(item.value) / activeEmployees) * 100, 100)
                  : 0;

                return (
                  <Box key={item.label} mb={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mb={0.7}
                    >
                      <Typography fontSize={12} color={COLORS.text}>
                        {item.label}
                      </Typography>

                      <Typography
                        fontSize={12}
                        fontWeight={700}
                        color={COLORS.dark}
                      >
                        {item.value}
                      </Typography>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={progressValue}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: "#E9F0ED",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: item.color,
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                );
              })}

              <Button
                fullWidth
                endIcon={<ArrowForward />}
                onClick={() => handleNavigate("/admin/attendance")}
                sx={{
                  mt: 1,
                  color: COLORS.primary,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View Attendance
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* RECENT EMPLOYEES */}

        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box>
                  <Typography
                    fontWeight={800}
                    color={COLORS.dark}
                    fontSize={16}
                  >
                    Recent Employees
                  </Typography>

                  <Typography fontSize={12} color={COLORS.secondary} mt={0.5}>
                    Recently added employees
                  </Typography>
                </Box>

                <Button
                  endIcon={<ArrowForward />}
                  onClick={() => handleNavigate("/admin/employees")}
                  sx={{
                    color: COLORS.primary,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: 12,
                  }}
                >
                  View All
                </Button>
              </Stack>

              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee, index) => (
                  <Box key={employee._id || employee.employeeId || index}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      py={1.4}
                    >
                      <Avatar
                        sx={{
                          bgcolor:
                            index % 2 === 0 ? COLORS.primary : COLORS.dark,
                          width: 42,
                          height: 42,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(employee.name)}
                      </Avatar>

                      <Box flex={1} minWidth={0}>
                        <Typography
                          fontSize={13}
                          fontWeight={700}
                          color={COLORS.dark}
                        >
                          {employee.name || "N/A"}
                        </Typography>

                        <Typography
                          fontSize={11}
                          color={COLORS.secondary}
                          noWrap
                        >
                          {employee.employeeId || "N/A"} •{" "}
                          {employee.department || "N/A"}
                        </Typography>
                      </Box>

                      <Chip
                        label={employee.status || "N/A"}
                        size="small"
                        sx={{
                          bgcolor:
                            String(employee.status).toLowerCase() === "active"
                              ? "#E5F5EC"
                              : "#FFF4DD",
                          color:
                            String(employee.status).toLowerCase() === "active"
                              ? "#27966E"
                              : "#C08014",
                          fontWeight: 700,
                          fontSize: 10,
                        }}
                      />
                    </Stack>

                    {index !== recentEmployees.length - 1 && (
                      <Divider sx={{ borderColor: COLORS.border }} />
                    )}
                  </Box>
                ))
              ) : (
                <Box py={4} textAlign="center">
                  <People
                    sx={{
                      fontSize: 40,
                      color: "#B5CCC5",
                      mb: 1,
                    }}
                  />

                  <Typography color={COLORS.secondary} fontSize={13}>
                    No employees found.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* PENDING TASKS */}

        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                fontWeight={800}
                fontSize={16}
                color={COLORS.dark}
                mb={2}
              >
                Pending Tasks
              </Typography>

              {taskList.map((task) => (
                <Stack
                  key={task.title}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  py={1.4}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#EAF4F1",
                      color: task.color,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {task.icon}
                  </Avatar>

                  <Box flex={1}>
                    <Typography
                      fontSize={13}
                      fontWeight={700}
                      color={COLORS.dark}
                    >
                      {task.title}
                    </Typography>

                    <Typography fontSize={11} color={COLORS.secondary}>
                      {task.count}
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => handleNavigate(task.path)}
                  >
                    <ArrowForward
                      sx={{
                        fontSize: 18,
                        color: COLORS.primary,
                      }}
                    />
                  </IconButton>
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* ORGANIZATION SUMMARY */}

        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${COLORS.border}`,
              height: "100%",
              background: `linear-gradient(135deg, ${COLORS.dark}, ${COLORS.primary})`,
              color: COLORS.white,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Business />

                <Typography fontWeight={800} fontSize={16}>
                  Organization Summary
                </Typography>
              </Stack>

              <Typography fontSize={13} color="rgba(255,255,255,0.75)" mb={2.5}>
                Your workforce at a glance
              </Typography>

              <Grid container spacing={2}>
                {organizationSummary.map((item) => (
                  <Grid item xs={6} key={item.label}>
                    <Typography fontSize={12} color="#B8E4DA">
                      {item.label}
                    </Typography>

                    <Typography variant="h4" fontWeight={800} mt={0.5}>
                      {item.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              <Divider
                sx={{
                  borderColor: "rgba(255,255,255,0.2)",
                  my: 2.5,
                }}
              />

              <Stack direction="row" alignItems="center" spacing={1}>
                <TrendingUp sx={{ color: "#A7E7C2" }} />

                <Typography fontSize={12} color="#D7F4EB">
                  Workforce management at one place
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FOOTER */}

      <Typography
        textAlign="center"
        color={COLORS.secondary}
        fontSize={11}
        mt={4}
      >
        EMS Admin Portal • {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default AdminDashboard;
