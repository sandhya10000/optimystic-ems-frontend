import { useEffect, useMemo, useState, useCallback } from "react";

import { salarySlipAPI, adminAPI } from "../../services/authService";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Download,
  Edit,
  PictureAsPdf,
  Search,
  Visibility,
  Refresh,
  Close,
} from "@mui/icons-material";

// ==================================================
// INITIAL FORM
// ==================================================

const initialForm = {
  employee: "",
  month: "",
  year: new Date().getFullYear(),
  basicSalary: "",
  allowances: "",
  deductions: "",
  paymentDate: "",
  status: "Pending",
};

// ==================================================
// RESPONSE HELPERS
// ==================================================

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong. Please try again.";

const getSalarySlips = (response) => {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.salarySlips)) {
    return response.salarySlips;
  }

  if (Array.isArray(response?.slips)) {
    return response.slips;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.salarySlips)) {
    return response.data.salarySlips;
  }

  if (Array.isArray(response?.data?.slips)) {
    return response.data.slips;
  }

  return [];
};

const getEmployees = (response) => {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.employees)) {
    return response.employees;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.employees)) {
    return response.data.employees;
  }

  return [];
};

// ==================================================
// EMPLOYEE HELPERS
// ==================================================

const getEmployeeId = (employee) => {
  if (!employee) return "";

  if (typeof employee === "string") return employee;

  return employee._id || employee.id || employee.employeeId || "";
};

const getEmployeeName = (employee) => {
  if (!employee) return "N/A";

  if (typeof employee === "string") {
    return employee;
  }

  if (employee.name) {
    if (typeof employee.name === "object") {
      return (
        employee.name.fullName ||
        employee.name.name ||
        `${employee.name.firstName || ""} ${employee.name.lastName || ""}`.trim() ||
        "N/A"
      );
    }

    return employee.name;
  }

  if (employee.fullName) return employee.fullName;

  const firstName =
    employee.firstName || employee.personalDetails?.firstName || "";

  const lastName =
    employee.lastName || employee.personalDetails?.lastName || "";

  return (
    `${firstName} ${lastName}`.trim() ||
    employee.employeeCode ||
    employee.employeeId ||
    "N/A"
  );
};

// ==================================================
// CURRENCY AND STATUS HELPERS
// ==================================================

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const getStatusColor = (status) => {
  const value = String(status || "").toLowerCase();

  if (value === "paid") return "success";
  if (value === "pending") return "warning";
  if (value === "failed") return "error";

  return "default";
};

const getNetSalary = (slip) => {
  if (slip?.netSalary !== undefined && slip?.netSalary !== null) {
    return Number(slip.netSalary) || 0;
  }

  return (
    Number(slip?.basicSalary || 0) +
    Number(slip?.allowances || 0) -
    Number(slip?.deductions || 0)
  );
};

// ==================================================
// MONTHS
// ==================================================

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ==================================================
// MAIN COMPONENT
// ==================================================

const SalarySlipManagement = () => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [viewSlip, setViewSlip] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ==================================================
  // NOTIFICATION
  // ==================================================

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  // ==================================================
  // FETCH SALARY SLIPS
  // GET /api/salary-slips
  // ==================================================

  const fetchSalarySlips = useCallback(async () => {
    try {
      setLoading(true);

      const response = await salarySlipAPI.getSalarySlips();

      if (response?.success === false) {
        throw new Error(response.message || "Unable to fetch salary slips.");
      }

      const salarySlipList = getSalarySlips(response);

      setSalarySlips(salarySlipList);
    } catch (error) {
      console.error("Fetch Salary Slips Error:", error);

      showMessage(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================================================
  // FETCH ALL EMPLOYEES
  // GET /api/admin/getAllEmployees
  // ==================================================

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await adminAPI.getAllEmployees();

      if (response?.success === false) {
        throw new Error(response.message || "Unable to fetch employees.");
      }

      const employeeList = getEmployees(response);

      setEmployees(employeeList);
    } catch (error) {
      console.error("Fetch Employees Error:", error);

      showMessage(getErrorMessage(error), "error");
    }
  }, []);

  // ==================================================
  // INITIAL API CALLS
  // ==================================================

  useEffect(() => {
    fetchSalarySlips();
    fetchEmployees();
  }, [fetchSalarySlips, fetchEmployees]);

  // ==================================================
  // FILTER SALARY SLIPS
  // ==================================================

  const filteredSlips = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return salarySlips.filter((slip) => {
      const employeeName = getEmployeeName(slip.employee);

      const employeeId = slip.employeeId || getEmployeeId(slip.employee);

      const matchesSearch =
        employeeName.toLowerCase().includes(searchValue) ||
        String(employeeId).toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        String(slip.status || "").toLowerCase() === statusFilter.toLowerCase();

      const matchesMonth =
        monthFilter === "All" || String(slip.month || "") === monthFilter;

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [salarySlips, search, statusFilter, monthFilter]);

  // ==================================================
  // DASHBOARD CALCULATIONS
  // ==================================================

  const totalPaid = useMemo(() => {
    return salarySlips
      .filter((slip) => String(slip.status || "").toLowerCase() === "paid")
      .reduce((sum, slip) => sum + getNetSalary(slip), 0);
  }, [salarySlips]);

  const pendingCount = useMemo(() => {
    return salarySlips.filter(
      (slip) => String(slip.status || "").toLowerCase() === "pending",
    ).length;
  }, [salarySlips]);

  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================================================
  // OPEN GENERATE DIALOG
  // ==================================================

  const handleOpenAdd = () => {
    setSelectedSlip(null);

    setForm({
      ...initialForm,
      year: new Date().getFullYear(),
    });

    setOpenDialog(true);
  };

  // ==================================================
  // OPEN EDIT DIALOG
  // ==================================================

  const handleOpenEdit = (slip) => {
    setSelectedSlip(slip);

    setForm({
      employee: getEmployeeId(slip.employee),

      month: slip.month || "",
      year: slip.year || new Date().getFullYear(),

      basicSalary: slip.basicSalary ?? "",
      allowances: slip.allowances ?? "",
      deductions: slip.deductions ?? "",

      paymentDate: slip.paymentDate
        ? String(slip.paymentDate).slice(0, 10)
        : "",

      status: slip.status || "Pending",
    });

    setOpenDialog(true);
  };

  // ==================================================
  // CLOSE DIALOG
  // ==================================================

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setSelectedSlip(null);
    setForm(initialForm);
  };

  // ==================================================
  // GENERATE / UPDATE SALARY SLIP
  // ==================================================

  const handleSubmit = async () => {
    if (!selectedSlip && !form.employee) {
      showMessage("Please select an employee.", "warning");
      return;
    }

    if (form.basicSalary === "" || form.basicSalary === null) {
      showMessage("Please enter basic salary.", "warning");
      return;
    }

    const basicSalary = Number(form.basicSalary);
    const allowances = Number(form.allowances || 0);
    const deductions = Number(form.deductions || 0);

    if (
      !Number.isFinite(basicSalary) ||
      !Number.isFinite(allowances) ||
      !Number.isFinite(deductions) ||
      basicSalary < 0 ||
      allowances < 0 ||
      deductions < 0
    ) {
      showMessage("Please enter valid salary amounts.", "warning");
      return;
    }

    if (selectedSlip && (!form.month || !form.year)) {
      showMessage("Please select month and year.", "warning");
      return;
    }

    try {
      setSaving(true);

      if (selectedSlip?._id) {
        // UPDATE SALARY SLIP

        const updatePayload = {
          basicSalary,
          allowances,
          deductions,
          month: form.month,
          year: Number(form.year),
          paymentDate: form.paymentDate || null,
          status: form.status,
        };

        const response = await salarySlipAPI.updateSalarySlip(
          selectedSlip._id,
          updatePayload,
        );

        if (response?.success === false) {
          throw new Error(response.message || "Salary slip update failed.");
        }

        showMessage(
          response?.message || "Salary slip updated successfully.",
          "success",
        );
      } else {
        // GENERATE SALARY SLIP

        const generatePayload = {
          employee: form.employee,
          basicSalary,
          allowances,
          deductions,
        };

        const response =
          await salarySlipAPI.generateSalarySlipRecord(generatePayload);

        if (response?.success === false) {
          throw new Error(response.message || "Salary slip generation failed.");
        }

        showMessage(
          response?.message || "Salary slip generated successfully.",
          "success",
        );
      }

      setOpenDialog(false);
      setSelectedSlip(null);
      setForm(initialForm);

      await fetchSalarySlips();
    } catch (error) {
      console.error("Salary Slip Submit Error:", error);

      showMessage(getErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // DOWNLOAD SALARY SLIP PDF
  // ==================================================

  const handleDownload = async (slip) => {
    try {
      if (!slip?._id) {
        showMessage("Invalid salary slip ID.", "error");
        return;
      }

      setDownloadingId(slip._id);

      // Service returns Blob directly.
      const blob = await salarySlipAPI.downloadSalarySlipPDF(slip._id);

      if (!(blob instanceof Blob) || blob.size === 0) {
        throw new Error("PDF file is empty or invalid.");
      }

      const pdfUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = pdfUrl;
      link.download = `Salary-Slip-${slip.employeeId || slip._id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 1000);

      showMessage("Salary slip PDF downloaded successfully.", "success");
    } catch (error) {
      console.error("PDF Download Error:", error);

      showMessage(getErrorMessage(error), "error");
    } finally {
      setDownloadingId(null);
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: "#F0F8F6",
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
          <Typography variant="h5" fontWeight={800} color="#174D47">
            Salary Slip Management
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Create, manage and track employee salary slips.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchSalarySlips}
            disabled={loading}
            sx={{
              color: "#0F887D",
              borderColor: "#0F887D",
              textTransform: "none",
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAdd}
            sx={{
              bgcolor: "#0F887D",
              "&:hover": {
                bgcolor: "#0B403C",
              },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Generate Salary Slip
          </Button>
        </Stack>
      </Stack>

      {/* DASHBOARD CARDS */}

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 3px 14px #174d4710",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Salary Slips
              </Typography>

              <Typography variant="h4" fontWeight={800} color="#174D47">
                {loading ? "—" : salarySlips.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 3px 14px #174d4710",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Paid Amount
              </Typography>

              <Typography variant="h4" fontWeight={800} color="#0F887D">
                {loading ? "—" : formatCurrency(totalPaid)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 3px 14px #174d4710",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Pending Payments
              </Typography>

              <Typography variant="h4" fontWeight={800} color="#F59E0B">
                {loading ? "—" : pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SEARCH AND FILTERS */}

      <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search employee..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Payment Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {["All", "Paid", "Pending", "Failed"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Month"
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
            >
              <MenuItem value="All">All Months</MenuItem>

              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* SALARY SLIP TABLE */}

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={800} color="#174D47">
            Employee Salary Records
          </Typography>

          <Chip
            label={`${filteredSlips.length} Records`}
            size="small"
            sx={{
              bgcolor: "#E1F3EF",
              color: "#0F887D",
              fontWeight: 700,
            }}
          />
        </Box>

        <Divider />

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: "#0F887D" }} />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#E7F3F0" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>

                  <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>

                  <TableCell sx={{ fontWeight: 700 }}>Basic Salary</TableCell>

                  <TableCell sx={{ fontWeight: 700 }}>Net Salary</TableCell>

                  <TableCell sx={{ fontWeight: 700 }}>Payment Date</TableCell>

                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>

                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredSlips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <PictureAsPdf
                        sx={{
                          fontSize: 45,
                          color: "#A0B8B3",
                        }}
                      />

                      <Typography color="text.secondary" mt={1}>
                        No salary slips found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSlips.map((slip) => {
                    const employeeName = getEmployeeName(slip.employee);

                    const slipId = slip._id;

                    return (
                      <TableRow hover key={slipId}>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "#D9EFEB",
                                color: "#0F887D",
                              }}
                            >
                              {employeeName.charAt(0).toUpperCase()}
                            </Avatar>

                            <Box>
                              <Typography fontWeight={700}>
                                {employeeName}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {slip.employeeId ||
                                  getEmployeeId(slip.employee)}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          {slip.month || "—"} {slip.year || ""}
                        </TableCell>

                        <TableCell>
                          {formatCurrency(slip.basicSalary)}
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700 }}>
                          {formatCurrency(getNetSalary(slip))}
                        </TableCell>

                        <TableCell>
                          {slip.paymentDate
                            ? new Date(slip.paymentDate).toLocaleDateString(
                                "en-IN",
                              )
                            : "—"}
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={slip.status || "Pending"}
                            color={getStatusColor(slip.status)}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Stack direction="row" justifyContent="center">
                            <IconButton
                              title="View"
                              color="primary"
                              onClick={() => setViewSlip(slip)}
                            >
                              <Visibility />
                            </IconButton>

                            <IconButton
                              title="Edit"
                              color="success"
                              onClick={() => handleOpenEdit(slip)}
                            >
                              <Edit />
                            </IconButton>

                            <IconButton
                              title="Download PDF"
                              color="error"
                              onClick={() => handleDownload(slip)}
                              disabled={downloadingId === slipId}
                            >
                              {downloadingId === slipId ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Download />
                              )}
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* GENERATE / UPDATE DIALOG */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#174D47",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {selectedSlip ? "Update Salary Slip" : "Generate Salary Slip"}

          <IconButton onClick={handleCloseDialog} disabled={saving}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} mt={0}>
            {/* EMPLOYEE */}

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Employee"
                name="employee"
                value={form.employee}
                onChange={handleFormChange}
                required
                disabled={Boolean(selectedSlip)}
              >
                {employees.map((employee) => {
                  const employeeId = getEmployeeId(employee);

                  return (
                    <MenuItem key={employeeId} value={employeeId}>
                      {getEmployeeName(employee)}
                    </MenuItem>
                  );
                })}
              </TextField>

              {employees.length === 0 && (
                <Typography
                  variant="caption"
                  color="error"
                  mt={0.5}
                  display="block"
                >
                  No employees available. Please check employee API.
                </Typography>
              )}
            </Grid>

            {/* MONTH AND YEAR */}

            {selectedSlip && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Month"
                    name="month"
                    value={form.month}
                    onChange={handleFormChange}
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Year"
                    name="year"
                    value={form.year}
                    onChange={handleFormChange}
                  />
                </Grid>
              </>
            )}

            {/* BASIC SALARY */}

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Basic Salary"
                name="basicSalary"
                value={form.basicSalary}
                onChange={handleFormChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* ALLOWANCES */}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Allowances"
                name="allowances"
                value={form.allowances}
                onChange={handleFormChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* DEDUCTIONS */}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Deductions"
                name="deductions"
                value={form.deductions}
                onChange={handleFormChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* PAYMENT DATE AND STATUS */}

            {selectedSlip && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Payment Date"
                    name="paymentDate"
                    value={form.paymentDate}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Payment Status"
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    {["Pending", "Paid", "Failed"].map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </>
            )}

            {!selectedSlip && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Salary month, year and payment date will be generated
                  automatically by the backend.
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit" disabled={saving}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving || (!selectedSlip && employees.length === 0)}
            sx={{
              bgcolor: "#0F887D",
              "&:hover": {
                bgcolor: "#0B403C",
              },
              textTransform: "none",
            }}
          >
            {saving ? (
              <CircularProgress size={22} color="inherit" />
            ) : selectedSlip ? (
              "Update Salary Slip"
            ) : (
              "Generate Salary Slip"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* VIEW SALARY SLIP DIALOG */}

      <Dialog
        open={Boolean(viewSlip)}
        onClose={() => setViewSlip(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#174D47",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Salary Slip Details
          <IconButton onClick={() => setViewSlip(null)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {viewSlip && (
            <Stack spacing={2} mt={1}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "#D9EFEB",
                    color: "#0F887D",
                    width: 50,
                    height: 50,
                  }}
                >
                  {getEmployeeName(viewSlip.employee).charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography fontWeight={800}>
                    {getEmployeeName(viewSlip.employee)}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {viewSlip.employeeId || getEmployeeId(viewSlip.employee)}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              {[
                ["Month", `${viewSlip.month || ""} ${viewSlip.year || ""}`],
                ["Basic Salary", formatCurrency(viewSlip.basicSalary)],
                ["Allowances", formatCurrency(viewSlip.allowances)],
                ["Deductions", formatCurrency(viewSlip.deductions)],
                ["Net Salary", formatCurrency(getNetSalary(viewSlip))],
                [
                  "Payment Date",
                  viewSlip.paymentDate
                    ? new Date(viewSlip.paymentDate).toLocaleDateString("en-IN")
                    : "—",
                ],
              ].map(([label, value]) => (
                <Stack
                  key={label}
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography color="text.secondary">{label}</Typography>

                  <Typography fontWeight={700}>{value}</Typography>
                </Stack>
              ))}

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary">Payment Status</Typography>

                <Chip
                  size="small"
                  label={viewSlip.status || "Pending"}
                  color={getStatusColor(viewSlip.status)}
                />
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewSlip(null)}>Close</Button>

          {viewSlip && (
            <Button
              startIcon={<PictureAsPdf />}
              color="error"
              onClick={() => handleDownload(viewSlip)}
              disabled={downloadingId === viewSlip._id}
            >
              Download PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SalarySlipManagement;
