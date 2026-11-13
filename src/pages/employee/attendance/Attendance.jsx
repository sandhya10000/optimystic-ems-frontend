import { useEffect, useState, useCallback } from "react";
import {
  getTodayAttendance,
  getMyAttendance,
  employeeCheckIn,
  employeeCheckOut,
} from "../../../services/employeeService";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from "@mui/material";

import {
  Login,
  Logout,
  AccessTime,
  Business,
  HomeWork,
  CalendarMonth,
  Refresh,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

// Home Page Green & Orange Theme
const COLORS = {
  darkGreen: "#0b403d",
  green: "#0e8278",
  greenHover: "#096c64",
  orange: "#f59e0b",
  orangeHover: "#e88b00",
  lightGreen: "#f1f8f7",
  paleGreen: "#eaf4f1",
  border: "#dce8e7",
  text: "#103f3d",
  secondary: "#526779",
  white: "#ffffff",
};

const cardStyle = {
  border: `1px solid ${COLORS.border}`,
  borderRadius: 3,
  height: "100%",
  backgroundColor: COLORS.white,
  boxShadow: "0 3px 12px rgba(11, 64, 61, 0.04)",
};

const Attendance = () => {
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Use local date instead of UTC date
  const currentDate = new Date();
  const currentMonth = [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, "0"),
  ].join("-");

  // API request helper
  const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  };

  // Fetch today's attendance and monthly history
  // Fetch today's attendance and monthly history
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [todayData, historyData] = await Promise.all([
        getTodayAttendance(),
        getMyAttendance(currentMonth),
      ]);

      setToday(todayData.attendance || null);
      setHistory(historyData.attendance || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch attendance",
      );
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  // Check In
  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setError("");

      await employeeCheckIn();

      await fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Check in failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Check Out
  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setError("");

      await employeeCheckOut();

      await fetchAttendance();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Check out failed",
      );
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const formatTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAttendanceChipStyle = (type) => {
    const styles = {
      WFO: {
        color: COLORS.greenHover,
        backgroundColor: "#e5f4ef",
      },
      WFH: {
        color: COLORS.darkGreen,
        backgroundColor: "#eaf4f1",
      },
      Absent: {
        color: "#b42318",
        backgroundColor: "#fee4e2",
      },
      "Half Day": {
        color: "#a15c00",
        backgroundColor: "#fff2d6",
      },
    };

    return {
      ...(styles[type] || {
        color: COLORS.secondary,
        backgroundColor: "#f1f5f4",
      }),
      fontWeight: 700,
    };
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn) return "--";

    const start = new Date(checkIn);
    const end = checkOut ? new Date(checkOut) : new Date();

    const minutes = Math.max(0, Math.floor((end - start) / 60000));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  };

  const attendanceType = today?.attendanceType;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress sx={{ color: COLORS.green }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100%",
        backgroundColor: COLORS.lightGreen,
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ color: COLORS.darkGreen }}
          >
            Attendance Management
          </Typography>

          <Typography color="text.secondary" mt={0.5} fontSize={14}>
            Track your daily attendance and working hours
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchAttendance}
          sx={{
            color: COLORS.green,
            borderColor: COLORS.green,
            fontWeight: 700,
            borderRadius: 2,
            px: 2.5,
            "&:hover": {
              borderColor: COLORS.greenHover,
              backgroundColor: COLORS.paleGreen,
            },
          }}
        >
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Today's Attendance */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Today's Attendance
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={800}
                    mt={1}
                    sx={{ color: COLORS.darkGreen }}
                  >
                    {formatDate(new Date())}
                  </Typography>
                </Box>

                {today?.attendanceType && (
                  <Chip
                    icon={
                      attendanceType === "WFO" ? <Business /> : <HomeWork />
                    }
                    label={
                      attendanceType === "WFO"
                        ? "Work From Office"
                        : "Work From Home"
                    }
                    sx={getAttendanceChipStyle(attendanceType)}
                  />
                )}
              </Stack>

              <Divider
                sx={{
                  my: 3,
                  borderColor: COLORS.border,
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography color="text.secondary" variant="body2">
                    Check In
                  </Typography>

                  <Typography
                    fontWeight={800}
                    variant="h6"
                    mt={1}
                    sx={{ color: COLORS.darkGreen }}
                  >
                    {formatTime(today?.checkIn)}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography color="text.secondary" variant="body2">
                    Check Out
                  </Typography>

                  <Typography
                    fontWeight={800}
                    variant="h6"
                    mt={1}
                    sx={{ color: COLORS.darkGreen }}
                  >
                    {formatTime(today?.checkOut)}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography color="text.secondary" variant="body2">
                    Working Hours
                  </Typography>

                  <Typography
                    fontWeight={800}
                    variant="h6"
                    mt={1}
                    sx={{ color: COLORS.darkGreen }}
                  >
                    {calculateWorkingHours(today?.checkIn, today?.checkOut)}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography color="text.secondary" variant="body2">
                    Status
                  </Typography>

                  <Box mt={1}>
                    <Chip
                      size="small"
                      label={
                        today?.checkIn
                          ? today?.checkOut
                            ? "Completed"
                            : "Checked In"
                          : "Not Checked In"
                      }
                      sx={
                        today?.checkIn
                          ? getAttendanceChipStyle("WFO")
                          : getAttendanceChipStyle("Absent")
                      }
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider
                sx={{
                  my: 3,
                  borderColor: COLORS.border,
                }}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Login />}
                  onClick={handleCheckIn}
                  disabled={actionLoading || Boolean(today?.checkIn)}
                  sx={{
                    backgroundColor: COLORS.green,
                    color: COLORS.white,
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    "&:hover": {
                      backgroundColor: COLORS.greenHover,
                    },
                    "&.Mui-disabled": {
                      backgroundColor: COLORS.border,
                      color: "#78908d",
                    },
                  }}
                >
                  Check In
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Logout />}
                  onClick={handleCheckOut}
                  disabled={
                    actionLoading || !today?.checkIn || Boolean(today?.checkOut)
                  }
                  sx={{
                    backgroundColor: COLORS.orange,
                    color: COLORS.darkGreen,
                    fontWeight: 800,
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    "&:hover": {
                      backgroundColor: COLORS.orangeHover,
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#f5e8c9",
                      color: "#9b8a68",
                    },
                  }}
                >
                  Check Out
                </Button>
              </Stack>

              {actionLoading && (
                <CircularProgress
                  size={22}
                  sx={{ ml: 2, mt: 1, color: COLORS.green }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance Type Information */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                fontWeight={800}
                variant="h6"
                sx={{ color: COLORS.darkGreen }}
              >
                Attendance Location
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: COLORS.lightGreen,
                  border: `1px solid ${COLORS.border}`,
                  textAlign: "center",
                }}
              >
                {attendanceType === "WFO" ? (
                  <Business sx={{ fontSize: 45, color: COLORS.green }} />
                ) : attendanceType === "WFH" ? (
                  <HomeWork sx={{ fontSize: 45, color: COLORS.orange }} />
                ) : (
                  <AccessTime sx={{ fontSize: 45, color: COLORS.green }} />
                )}

                <Typography
                  fontWeight={800}
                  mt={1}
                  sx={{ color: COLORS.darkGreen }}
                >
                  {attendanceType === "WFO"
                    ? "Office Attendance"
                    : attendanceType === "WFH"
                      ? "Work From Home"
                      : "Awaiting Check In"}
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={1}>
                  {attendanceType
                    ? "Attendance type detected by the server"
                    : "Your attendance type will be detected when you check in"}
                </Typography>
              </Box>

              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  backgroundColor: COLORS.paleGreen,
                  color: COLORS.darkGreen,
                  "& .MuiAlert-icon": {
                    color: COLORS.green,
                  },
                }}
              >
                Your attendance type is determined automatically using your
                network's public IP address.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Attendance History */}
      <Card elevation={0} sx={cardStyle}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ color: COLORS.darkGreen }}
              >
                Attendance History
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Your monthly attendance records
              </Typography>
            </Box>

            <CalendarMonth
              sx={{
                color: COLORS.orange,
                fontSize: 30,
              }}
            />
          </Stack>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: COLORS.paleGreen,
                    "& th": {
                      color: COLORS.darkGreen,
                      fontWeight: 800,
                      borderBottom: `1px solid ${COLORS.border}`,
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <TableCell>Date</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Working Hours</TableCell>
                  <TableCell>Attendance Type</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {history.length > 0 ? (
                  history.map((record) => (
                    <TableRow
                      key={record._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: COLORS.lightGreen,
                        },
                        "& td": {
                          borderBottom: `1px solid ${COLORS.border}`,
                          color: COLORS.text,
                        },
                      }}
                    >
                      <TableCell>{formatDate(record.date)}</TableCell>

                      <TableCell>{formatTime(record.checkIn)}</TableCell>

                      <TableCell>{formatTime(record.checkOut)}</TableCell>

                      <TableCell>
                        {calculateWorkingHours(record.checkIn, record.checkOut)}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={record.attendanceType || "--"}
                          sx={getAttendanceChipStyle(record.attendanceType)}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={record.status || "Present"}
                          sx={getAttendanceChipStyle(
                            record.status === "Absent"
                              ? "Absent"
                              : record.status === "Half Day"
                                ? "Half Day"
                                : "WFO",
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{
                        py: 5,
                        color: COLORS.secondary,
                      }}
                    >
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Attendance;
