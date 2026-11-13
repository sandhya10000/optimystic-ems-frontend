import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Stack,
  InputAdornment,
  Snackbar,
  Divider,
} from "@mui/material";

import {
  Refresh,
  Search,
  CalendarMonth,
  People,
  CheckCircle,
  Cancel,
  AccessTime,
  Visibility,
  FileDownload,
} from "@mui/icons-material";

import { adminAPI } from "../../services/authService";

// =====================================================
// DATE HELPERS
// =====================================================

const getDateValue = (value) => {
  if (!value) return "";

  // API date is already YYYY-MM-DD
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// TIME FORMATTER
// =====================================================

const formatAttendanceTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// =====================================================
// DATE FORMATTER FOR UI
// =====================================================

const formatDisplayDate = (value) => {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =====================================================
// EXTRACT ATTENDANCE ARRAY
// =====================================================

const extractAttendanceArray = (response) => {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.attendance)) {
    return response.attendance;
  }

  if (Array.isArray(response?.data?.attendance)) {
    return response.data.attendance;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.records)) {
    return response.records;
  }

  return [];
};

// =====================================================
// NORMALIZE ATTENDANCE API RESPONSE
// =====================================================

const normalizeAttendance = (item, index) => {
  const employee = item?.employee || {};

  const employeeName = [employee?.firstName, employee?.lastName]
    .filter(Boolean)
    .join(" ");

  return {
    id: item?._id || item?.id || index,

    employeeId: employee?.employeeId || employee?._id || `EMP-${index + 1}`,

    employeeName: employeeName || "Unknown Employee",

    email: employee?.email || "-",

    phone: employee?.phone || "-",

    department:
      employee?.department || employee?.departmentName || "Not Assigned",

    designation: employee?.designation || employee?.role || "-",

    date: getDateValue(item?.date || item?.createdAt),

    checkIn: formatAttendanceTime(item?.checkIn),

    checkOut: formatAttendanceTime(item?.checkOut),

    status: item?.status || "Pending",

    workMode: item?.attendanceType || "Office",

    checkInIp: item?.checkInIp || "-",

    checkOutIp: item?.checkOutIp || "-",

    raw: item,
  };
};

// =====================================================
// STATUS COLORS
// =====================================================

const getStatusColor = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "present" || value === "approved") {
    return "success";
  }

  if (value === "absent" || value === "rejected") {
    return "error";
  }

  if (value === "late") {
    return "warning";
  }

  if (value === "half day" || value === "half-day") {
    return "info";
  }

  return "default";
};

// =====================================================
// WORK MODE COLORS
// =====================================================

const getWorkModeColor = (mode) => {
  const value = String(mode || "").toUpperCase();

  if (value === "WFH") return "info";

  if (value === "WFO" || value === "OFFICE") {
    return "success";
  }

  return "default";
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const AttendanceManagement = () => {
  // Attendance states
  const [attendance, setAttendance] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Filter states
  const [search, setSearch] = useState("");

  // Empty date means show all records
  const [selectedDate, setSelectedDate] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [workModeFilter, setWorkModeFilter] = useState("All");

  // Details dialog
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  // ===================================================
  // GET ALL ATTENDANCE API
  // ===================================================

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminAPI.getAllAttendance();

      console.log("Attendance API Response:", response);

      const records = extractAttendanceArray(response);

      console.log("Attendance Records:", records);

      const normalizedRecords = records.map((item, index) =>
        normalizeAttendance(item, index),
      );

      console.log("Normalized Attendance Records:", normalizedRecords);

      setAttendance(normalizedRecords);
    } catch (err) {
      console.error("Attendance API Error:", err);

      setError(err?.message || "Unable to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // INITIAL API CALL
  // ===================================================

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // ===================================================
  // DEPARTMENT OPTIONS
  // ===================================================

  const departments = useMemo(() => {
    const departmentList = attendance
      .map((item) => item.department)
      .filter((department) => department && department !== "Not Assigned");

    return ["All", ...new Set(departmentList)];
  }, [attendance]);

  // ===================================================
  // FILTER ATTENDANCE
  // ===================================================

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.employeeName.toLowerCase().includes(searchValue) ||
        String(item.employeeId).toLowerCase().includes(searchValue) ||
        item.email.toLowerCase().includes(searchValue) ||
        item.phone.toLowerCase().includes(searchValue);

      const matchesDate = !selectedDate || item.date === selectedDate;

      const matchesStatus =
        statusFilter === "All" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDepartment =
        departmentFilter === "All" || item.department === departmentFilter;

      const matchesWorkMode =
        workModeFilter === "All" ||
        item.workMode.toLowerCase() === workModeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesDate &&
        matchesStatus &&
        matchesDepartment &&
        matchesWorkMode
      );
    });
  }, [
    attendance,
    search,
    selectedDate,
    statusFilter,
    departmentFilter,
    workModeFilter,
  ]);

  // ===================================================
  // ATTENDANCE STATISTICS
  // ===================================================

  const stats = useMemo(() => {
    const present = filteredAttendance.filter(
      (item) => item.status.toLowerCase() === "present",
    ).length;

    const absent = filteredAttendance.filter(
      (item) => item.status.toLowerCase() === "absent",
    ).length;

    const late = filteredAttendance.filter(
      (item) => item.status.toLowerCase() === "late",
    ).length;

    const checkedOut = filteredAttendance.filter(
      (item) => item.checkOut !== "-",
    ).length;

    return {
      total: filteredAttendance.length,
      present,
      absent,
      late,
      checkedOut,
    };
  }, [filteredAttendance]);

  // ===================================================
  // VIEW ATTENDANCE DETAILS
  // ===================================================

  const handleView = (item) => {
    setSelectedAttendance(item);
    setDetailsOpen(true);
  };

  // ===================================================
  // RESET FILTERS
  // ===================================================

  const handleResetFilters = () => {
    setSearch("");
    setSelectedDate("");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setWorkModeFilter("All");
  };

  // ===================================================
  // EXPORT CSV
  // ===================================================

  const exportCSV = () => {
    if (!filteredAttendance.length) {
      setSnackbar({
        open: true,
        message: "No attendance records available to export.",
      });

      return;
    }

    const headers = [
      "Employee ID",
      "Employee Name",
      "Email",
      "Phone",
      "Department",
      "Designation",
      "Date",
      "Check In",
      "Check Out",
      "Work Mode",
      "Status",
    ];

    const rows = filteredAttendance.map((item) => [
      item.employeeId,
      item.employeeName,
      item.email,
      item.phone,
      item.department,
      item.designation,
      item.date,
      item.checkIn,
      item.checkOut,
      item.workMode,
      item.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `attendance-${selectedDate || "all"}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: "Attendance CSV exported successfully.",
    });
  };

  // ===================================================
  // STAT CARD COMPONENT
  // ===================================================

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography color="text.secondary" fontSize={14}>
              {title}
            </Typography>

            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
              {value}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: `${color}18`,
              color,
              width: 52,
              height: 52,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );

  // ===================================================
  // RENDER UI
  // ===================================================

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Attendance Management
          </Typography>

          <Typography color="text.secondary" fontSize={14} mt={0.5}>
            Monitor and manage employee attendance records.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAttendance}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={exportCSV}
          >
            Export CSV
          </Button>
        </Stack>
      </Stack>

      {/* ERROR */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchAttendance}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* STATISTICS */}

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Records"
            value={stats.total}
            icon={<People />}
            color="#2563eb"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Present"
            value={stats.present}
            icon={<CheckCircle />}
            color="#16a34a"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Absent"
            value={stats.absent}
            icon={<Cancel />}
            color="#dc2626"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Late"
            value={stats.late}
            icon={<AccessTime />}
            color="#d97706"
          />
        </Grid>
      </Grid>

      {/* FILTERS */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "none",
          mb: 3,
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography fontWeight={600}>Filter Attendance</Typography>

            <Button size="small" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {/* SEARCH */}

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* DATE */}

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Attendance Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* STATUS */}

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {["All", "Present", "Absent", "Late", "Pending"].map(
                  (status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Grid>

            {/* DEPARTMENT */}

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {departments.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* WORK MODE */}

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Work Mode"
                value={workModeFilter}
                onChange={(e) => setWorkModeFilter(e.target.value)}
              >
                {["All", "Office", "WFH", "WFO"].map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ATTENDANCE TABLE */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            p={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={700}>Attendance Records</Typography>

              <Typography variant="caption" color="text.secondary">
                Employee attendance details
              </Typography>
            </Box>

            <Chip
              label={`${filteredAttendance.length} Records`}
              color="primary"
              variant="outlined"
            />
          </Box>

          <Divider />

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ width: "100%", overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 950 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {[
                    "Employee",
                    "Department",
                    "Date",
                    "Check In",
                    "Check Out",
                    "Work Mode",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={30} />

                      <Typography color="text.secondary" mt={1}>
                        Loading attendance records...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <People
                        sx={{
                          fontSize: 40,
                          color: "#94a3b8",
                          mb: 1,
                        }}
                      />

                      <Typography color="text.secondary" fontWeight={600}>
                        No attendance records found.
                      </Typography>

                      <Typography color="text.secondary" variant="caption">
                        Try changing your filters or refresh the data.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((item) => (
                    <TableRow hover key={item.id}>
                      {/* EMPLOYEE */}

                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#dbeafe",
                              color: "#1d4ed8",
                              fontWeight: 700,
                            }}
                          >
                            {item.employeeName.charAt(0).toUpperCase()}
                          </Avatar>

                          <Box>
                            <Typography
                              fontWeight={600}
                              fontSize={14}
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              {item.employeeName}
                            </Typography>

                            <Typography fontSize={12} color="text.secondary">
                              {item.employeeId}
                            </Typography>

                            <Typography fontSize={11} color="text.secondary">
                              {item.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* DEPARTMENT */}

                      <TableCell>
                        <Typography fontSize={13}>{item.department}</Typography>
                      </TableCell>

                      {/* DATE */}

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDisplayDate(item.date)}
                      </TableCell>

                      {/* CHECK IN */}

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          color="success.main"
                        >
                          {item.checkIn}
                        </Typography>
                      </TableCell>

                      {/* CHECK OUT */}

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          color={
                            item.checkOut === "-"
                              ? "text.secondary"
                              : "error.main"
                          }
                        >
                          {item.checkOut}
                        </Typography>
                      </TableCell>

                      {/* WORK MODE */}

                      <TableCell>
                        <Chip
                          size="small"
                          label={item.workMode}
                          color={getWorkModeColor(item.workMode)}
                          variant="outlined"
                        />
                      </TableCell>

                      {/* STATUS */}

                      <TableCell>
                        <Chip
                          size="small"
                          label={item.status}
                          color={getStatusColor(item.status)}
                        />
                      </TableCell>

                      {/* ACTION */}

                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleView(item)}
                          size="small"
                          title="View Attendance Details"
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* ATTENDANCE DETAILS DIALOG */}

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Attendance Details</DialogTitle>

        <DialogContent dividers>
          {selectedAttendance && (
            <Box>
              {/* EMPLOYEE HEADER */}

              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    width: 55,
                    height: 55,
                    bgcolor: "#dbeafe",
                    color: "#1d4ed8",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {selectedAttendance.employeeName.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography fontWeight={700}>
                    {selectedAttendance.employeeName}
                  </Typography>

                  <Typography color="text.secondary" fontSize={13}>
                    {selectedAttendance.employeeId}
                  </Typography>

                  <Typography color="text.secondary" fontSize={12}>
                    {selectedAttendance.email}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* DETAILS */}

              <Grid container spacing={2}>
                {[
                  ["Employee Name", selectedAttendance.employeeName],
                  ["Employee ID", selectedAttendance.employeeId],
                  ["Email", selectedAttendance.email],
                  ["Phone", selectedAttendance.phone],
                  ["Department", selectedAttendance.department],
                  ["Designation", selectedAttendance.designation],
                  [
                    "Attendance Date",
                    formatDisplayDate(selectedAttendance.date),
                  ],
                  ["Check In", selectedAttendance.checkIn],
                  ["Check Out", selectedAttendance.checkOut],
                  ["Work Mode", selectedAttendance.workMode],
                  ["Status", selectedAttendance.status],
                  ["Check In IP", selectedAttendance.checkInIp],
                  ["Check Out IP", selectedAttendance.checkOutIp],
                ].map(([label, value]) => (
                  <Grid item xs={12} sm={6} key={label}>
                    <Typography fontSize={12} color="text.secondary">
                      {label}
                    </Typography>

                    <Typography
                      fontWeight={600}
                      fontSize={14}
                      mt={0.5}
                      sx={{ wordBreak: "break-word" }}
                    >
                      {value || "-"}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              {/* STATUS CHIPS */}

              <Stack
                direction="row"
                spacing={1}
                mt={3}
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  label={selectedAttendance.status}
                  color={getStatusColor(selectedAttendance.status)}
                />

                <Chip
                  label={selectedAttendance.workMode}
                  color={getWorkModeColor(selectedAttendance.workMode)}
                  variant="outlined"
                />
              </Stack>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailsOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        message={snackbar.message}
      />
    </Box>
  );
};

export default AttendanceManagement;
