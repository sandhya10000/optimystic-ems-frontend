import { useMemo, useState } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tooltip,
} from "@mui/material";

import {
  CalendarMonth,
  People,
  CheckCircle,
  Cancel,
  AccessTime,
  Search,
  Download,
  Edit,
  Visibility,
  Add,
  Close,
  Schedule,
  Business,
  LaptopMac,
  HomeWork,
} from "@mui/icons-material";

const COLORS = {
  dark: "#0B403C",
  primary: "#0F887D",
  orange: "#F59E0B",
  background: "#F0F8F6",
  white: "#FFFFFF",
  border: "#DCEBE7",
  text: "#174D47",
  secondary: "#64748B",
  red: "#DC6464",
  blue: "#4F83CC",
};

const initialAttendance = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "Rahul Sharma",
    department: "Development",
    date: "2026-11-12",
    checkIn: "09:15 AM",
    checkOut: "06:10 PM",
    workMode: "WFO",
    status: "Present",
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Priya Verma",
    department: "HR",
    date: "2026-11-12",
    checkIn: "09:05 AM",
    checkOut: "06:00 PM",
    workMode: "WFO",
    status: "Present",
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "Amit Kumar",
    department: "Finance",
    date: "2026-11-12",
    checkIn: "09:45 AM",
    checkOut: "06:15 PM",
    workMode: "WFH",
    status: "Late",
  },
  {
    id: 4,
    employeeId: "EMP004",
    employeeName: "Neha Singh",
    department: "Marketing",
    date: "2026-11-12",
    checkIn: "--",
    checkOut: "--",
    workMode: "--",
    status: "Absent",
  },
  {
    id: 5,
    employeeId: "EMP005",
    employeeName: "Vikas Gupta",
    department: "Development",
    date: "2026-11-12",
    checkIn: "09:20 AM",
    checkOut: "--",
    workMode: "WFO",
    status: "Present",
  },
  {
    id: 6,
    employeeId: "EMP006",
    employeeName: "Anjali Singh",
    department: "Design",
    date: "2026-11-12",
    checkIn: "09:10 AM",
    checkOut: "06:05 PM",
    workMode: "WFH",
    status: "Present",
  },
  {
    id: 7,
    employeeId: "EMP007",
    employeeName: "Rohit Verma",
    department: "Sales",
    date: "2026-11-12",
    checkIn: "--",
    checkOut: "--",
    workMode: "--",
    status: "On Leave",
  },
];

const employeeOptions = [
  { id: "EMP001", name: "Rahul Sharma" },
  { id: "EMP002", name: "Priya Verma" },
  { id: "EMP003", name: "Amit Kumar" },
  { id: "EMP004", name: "Neha Singh" },
  { id: "EMP005", name: "Vikas Gupta" },
  { id: "EMP006", name: "Anjali Singh" },
  { id: "EMP007", name: "Rohit Verma" },
];

const departments = [
  "Development",
  "HR",
  "Finance",
  "Marketing",
  "Design",
  "Sales",
];

const today = "2026-11-12";

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState(initialAttendance);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    date: today,
    checkIn: "",
    checkOut: "",
    workMode: "WFO",
    status: "Present",
  });

  const stats = useMemo(() => {
    const dayRecords = attendance.filter((item) => item.date === selectedDate);

    return [
      {
        title: "Total Employees",
        value: employeeOptions.length,
        icon: <People />,
        color: COLORS.primary,
        bg: "#E5F4F0",
      },
      {
        title: "Present",
        value: dayRecords.filter((item) =>
          ["Present", "Late"].includes(item.status),
        ).length,
        icon: <CheckCircle />,
        color: "#27966E",
        bg: "#E5F5EC",
      },
      {
        title: "Absent",
        value: dayRecords.filter((item) => item.status === "Absent").length,
        icon: <Cancel />,
        color: COLORS.red,
        bg: "#FCEAEA",
      },
      {
        title: "Late Arrivals",
        value: dayRecords.filter((item) => item.status === "Late").length,
        icon: <AccessTime />,
        color: COLORS.orange,
        bg: "#FFF4DD",
      },
    ];
  }, [attendance, selectedDate]);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.employeeName.toLowerCase().includes(searchText) ||
        item.employeeId.toLowerCase().includes(searchText);

      const matchesDate = item.date === selectedDate;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" || item.department === departmentFilter;

      return matchesSearch && matchesDate && matchesStatus && matchesDepartment;
    });
  }, [attendance, search, selectedDate, statusFilter, departmentFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return { bg: "#E5F5EC", color: "#27966E" };
      case "Absent":
        return { bg: "#FCEAEA", color: COLORS.red };
      case "Late":
        return { bg: "#FFF4DD", color: "#C08014" };
      case "On Leave":
        return { bg: "#EAF1FC", color: COLORS.blue };
      default:
        return { bg: "#F1F5F9", color: COLORS.secondary };
    }
  };

  const openAddDialog = () => {
    setEditingRecord(null);

    setForm({
      employeeId: "",
      date: selectedDate,
      checkIn: "",
      checkOut: "",
      workMode: "WFO",
      status: "Present",
    });

    setDialogOpen(true);
  };

  const openEditDialog = (record) => {
    setEditingRecord(record);

    setForm({
      employeeId: record.employeeId,
      date: record.date,
      checkIn: record.checkIn === "--" ? "" : record.checkIn,
      checkOut: record.checkOut === "--" ? "" : record.checkOut,
      workMode: record.workMode === "--" ? "WFO" : record.workMode,
      status: record.status,
    });

    setDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAttendance = () => {
    if (!form.employeeId || !form.date || !form.status) return;

    const employee = employeeOptions.find(
      (item) => item.id === form.employeeId,
    );

    if (!employee) return;

    const existingRecord = attendance.find(
      (item) =>
        item.employeeId === form.employeeId &&
        item.date === form.date &&
        item.id !== editingRecord?.id,
    );

    if (existingRecord) {
      alert("Attendance already exists for this employee on this date.");
      return;
    }

    const record = {
      id: editingRecord?.id || Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      department: editingRecord?.department || departments[0],
      date: form.date,
      checkIn: form.checkIn || "--",
      checkOut: form.checkOut || "--",
      workMode: form.workMode || "--",
      status: form.status,
    };

    if (editingRecord) {
      setAttendance((prev) =>
        prev.map((item) => (item.id === editingRecord.id ? record : item)),
      );
    } else {
      setAttendance((prev) => [record, ...prev]);
    }

    setDialogOpen(false);
  };

  const handleExport = () => {
    const headers = [
      "Employee ID",
      "Employee Name",
      "Department",
      "Date",
      "Check In",
      "Check Out",
      "Work Mode",
      "Status",
    ];

    const rows = filteredAttendance.map((item) => [
      item.employeeId,
      item.employeeName,
      item.department,
      item.date,
      item.checkIn,
      item.checkOut,
      item.workMode,
      item.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `attendance-${selectedDate}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "calc(100vh - 70px)",
        bgcolor: COLORS.background,
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
          <Typography variant="h5" fontWeight={800} color={COLORS.dark}>
            Attendance Management
          </Typography>

          <Typography fontSize={13} color={COLORS.secondary} mt={0.5}>
            Monitor and manage employee attendance records.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            sx={{
              borderColor: COLORS.primary,
              color: COLORS.primary,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
            sx={{
              bgcolor: COLORS.primary,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { bgcolor: COLORS.dark, boxShadow: "none" },
            }}
          >
            Mark Attendance
          </Button>
        </Stack>
      </Stack>

      {/* Statistics */}
      <Grid container spacing={2.5} mb={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      fontSize={13}
                      color={COLORS.secondary}
                      fontWeight={600}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color={COLORS.dark}
                      mt={1}
                    >
                      {item.value}
                    </Typography>
                  </Box>

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
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters and Attendance Table */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
            mb={2.5}
          >
            <Box>
              <Typography fontSize={17} fontWeight={800} color={COLORS.dark}>
                Daily Attendance Records
              </Typography>

              <Typography fontSize={12} color={COLORS.secondary} mt={0.5}>
                Employee check-in and check-out details
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              width={{ xs: "100%", md: "auto" }}
            >
              <TextField
                type="date"
                size="small"
                label="Attendance Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 165 }}
              />

              <TextField
                size="small"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 210 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                select
                size="small"
                label="Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="All">All Departments</MenuItem>
                {departments.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 130 }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: 2,
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F5FAF8" }}>
                  {[
                    "Employee",
                    "Department",
                    "Check In",
                    "Check Out",
                    "Work Mode",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        color: COLORS.dark,
                        fontWeight: 800,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => {
                    const statusStyle = getStatusStyle(record.status);

                    return (
                      <TableRow
                        key={record.id}
                        hover
                        sx={{
                          "& td": {
                            borderColor: COLORS.border,
                            py: 1.5,
                          },
                        }}
                      >
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.2}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "#E5F4F0",
                                color: COLORS.primary,
                                width: 38,
                                height: 38,
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {record.employeeName
                                .split(" ")
                                .map((word) => word[0])
                                .join("")}
                            </Avatar>

                            <Box>
                              <Typography
                                fontSize={12.5}
                                fontWeight={700}
                                color={COLORS.dark}
                              >
                                {record.employeeName}
                              </Typography>

                              <Typography
                                fontSize={10.5}
                                color={COLORS.secondary}
                              >
                                {record.employeeId}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Typography fontSize={12}>
                            {record.department}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            fontSize={12}
                            fontWeight={600}
                            color={COLORS.text}
                          >
                            {record.checkIn}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            fontSize={12}
                            fontWeight={600}
                            color={COLORS.text}
                          >
                            {record.checkOut}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {record.workMode === "WFO" ? (
                            <Chip
                              icon={<Business />}
                              label="WFO"
                              size="small"
                              sx={{
                                bgcolor: "#E5F4F0",
                                color: COLORS.primary,
                                fontWeight: 700,
                              }}
                            />
                          ) : record.workMode === "WFH" ? (
                            <Chip
                              icon={<HomeWork />}
                              label="WFH"
                              size="small"
                              sx={{
                                bgcolor: "#EAF1FC",
                                color: COLORS.blue,
                                fontWeight: 700,
                              }}
                            />
                          ) : (
                            <Typography fontSize={12} color={COLORS.secondary}>
                              --
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={record.status}
                            size="small"
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 700,
                              fontSize: 10,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Edit Attendance">
                              <IconButton
                                size="small"
                                onClick={() => openEditDialog(record)}
                                sx={{ color: COLORS.primary }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => openEditDialog(record)}
                                sx={{ color: COLORS.blue }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CalendarMonth
                        sx={{ fontSize: 42, color: "#A0B8B1", mb: 1 }}
                      />

                      <Typography fontWeight={700} color={COLORS.dark}>
                        No attendance records found
                      </Typography>

                      <Typography
                        fontSize={12}
                        color={COLORS.secondary}
                        mt={0.5}
                      >
                        Try changing the selected date or filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography fontSize={11} color={COLORS.secondary} mt={2}>
            Showing {filteredAttendance.length} attendance records
          </Typography>
        </CardContent>
      </Card>

      {/* Mark / Edit Attendance Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: COLORS.dark,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {editingRecord ? "Edit Attendance" : "Mark Attendance"}

          <IconButton onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Employee"
                name="employeeId"
                value={form.employeeId}
                onChange={handleFormChange}
                disabled={Boolean(editingRecord)}
              >
                {employeeOptions.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.id})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                size="small"
                label="Attendance Date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                size="small"
                label="Attendance Status"
                name="status"
                value={form.status}
                onChange={handleFormChange}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                size="small"
                label="Check In Time"
                name="checkIn"
                value={form.checkIn}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                size="small"
                label="Check Out Time"
                name="checkOut"
                value={form.checkOut}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                size="small"
                label="Work Mode"
                name="workMode"
                value={form.workMode}
                onChange={handleFormChange}
              >
                <MenuItem value="WFO">Work From Office</MenuItem>
                <MenuItem value="WFH">Work From Home</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              color: COLORS.secondary,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveAttendance}
            disabled={!form.employeeId || !form.date}
            sx={{
              bgcolor: COLORS.primary,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: COLORS.dark },
            }}
          >
            {editingRecord ? "Update Attendance" : "Save Attendance"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceManagement;
