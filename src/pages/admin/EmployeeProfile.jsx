import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";

import {
  Search,
  Edit,
  Person,
  Work,
  Badge as BadgeIcon,
  Close,
  Refresh,
} from "@mui/icons-material";

import { adminAPI } from "../../services/authService";

// ==================================================
// RESPONSE HELPERS
// ==================================================

const getResponseData = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.employees)) return response.employees;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.employees)) {
    return response.data.employees;
  }

  return [];
};

const getEmployeeResponse = (response) => {
  return (
    response?.employee || response?.data?.employee || response?.data || response
  );
};

const getEmployeeId = (employee) =>
  employee?._id || employee?.id || employee?.employeeId || "";

const getDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (typeof value === "object") {
    return value.name || value.label || value.email || value.title || "";
  }

  return String(value);
};

const getEmployeeName = (employee) => {
  if (employee?.name) return getDisplayValue(employee.name);

  const firstName =
    employee?.firstName || employee?.personalDetails?.firstName || "";

  const lastName =
    employee?.lastName || employee?.personalDetails?.lastName || "";

  return `${firstName} ${lastName}`.trim();
};

const getEmployeeStatus = (employee) =>
  getDisplayValue(employee?.employmentStatus || employee?.status) ||
  "Not specified";

const getEmployeeDepartment = (employee) =>
  getDisplayValue(employee?.department || employee?.departmentName);

const getEmployeeDesignation = (employee) =>
  getDisplayValue(employee?.designation || employee?.jobTitle);

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong. Please try again.";

const getDateValue = (value) => {
  if (!value) return "";

  return String(value).slice(0, 10);
};

// ==================================================
// REUSABLE DETAIL ITEM
// IMPORTANT: Defined outside EmployeeProfile
// ==================================================

const DetailItem = ({ label, value }) => {
  const displayValue = getDisplayValue(value);

  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography
        fontSize={14}
        fontWeight={600}
        sx={{ overflowWrap: "anywhere" }}
      >
        {displayValue || "Not provided"}
      </Typography>
    </Box>
  );
};

// ==================================================
// EMPLOYEE PROFILE COMPONENT
// ==================================================

const EmployeeProfile = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [openProfile, setOpenProfile] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [form, setForm] = useState({});

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ==================================================
  // NOTIFICATION
  // ==================================================

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const closeNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // ==================================================
  // FETCH ALL EMPLOYEES
  // GET /api/admin/getAllEmployees
  // ==================================================

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminAPI.getAllEmployees();

      if (response?.success === false) {
        throw new Error(response.message || "Unable to fetch employees.");
      }

      const employeeList = getResponseData(response);

      setEmployees(employeeList);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ==================================================
  // FETCH SINGLE EMPLOYEE
  // GET /api/admin/getEmployeeBy/:id
  // ==================================================

  const handleViewProfile = async (employee) => {
    const employeeId = getEmployeeId(employee);

    if (!employeeId) {
      showNotification("Employee ID is missing.", "error");
      return;
    }

    try {
      setProfileLoading(true);
      setOpenProfile(true);
      setSelectedEmployee(null);

      const response = await adminAPI.getEmployeeBy(employeeId);

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to fetch employee details.",
        );
      }

      const employeeData = getEmployeeResponse(response);

      if (!employeeData || !getEmployeeId(employeeData)) {
        throw new Error("Employee details not found.");
      }

      setSelectedEmployee(employeeData);
    } catch (err) {
      setOpenProfile(false);
      showNotification(getErrorMessage(err), "error");
    } finally {
      setProfileLoading(false);
    }
  };

  // ==================================================
  // OPEN EDIT DIALOG
  // ==================================================

  const handleEdit = (employee) => {
    const employeeId = getEmployeeId(employee);

    if (!employeeId) {
      showNotification("Employee ID is missing.", "error");
      return;
    }

    setSelectedEmployee(employee);

    setForm({
      name: getEmployeeName(employee),
      email: employee.email || "",
      phone: employee.phone || employee.mobile || "",
      gender: employee.gender || "",
      dob: getDateValue(employee.dob || employee.dateOfBirth),
      address: getDisplayValue(employee.address),
      emergencyContact: getDisplayValue(employee.emergencyContact),
      department: getEmployeeDepartment(employee),
      designation: getEmployeeDesignation(employee),
      joiningDate: getDateValue(employee.joiningDate),
      employmentType: employee.employmentType || "",
      reportingManager: getDisplayValue(employee.reportingManager),
      salary: employee.salary ?? "",
      employmentStatus: getEmployeeStatus(employee),
    });

    setOpenEdit(true);
  };

  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // UPDATE EMPLOYEE
  // PUT /api/admin/updateEmployee/:id
  // ==================================================

  const handleSave = async () => {
    const employeeId = getEmployeeId(selectedEmployee);

    if (!employeeId) {
      showNotification("Employee ID is missing.", "error");
      return;
    }

    if (!form.name?.trim() || !form.email?.trim()) {
      showNotification("Name and email are required.", "error");
      return;
    }

    if (
      form.salary !== "" &&
      (!Number.isFinite(Number(form.salary)) || Number(form.salary) < 0)
    ) {
      showNotification("Please enter a valid salary.", "error");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        salary: form.salary === "" ? undefined : Number(form.salary),
      };

      const response = await adminAPI.updateEmployee(employeeId, payload);

      if (response?.success === false) {
        throw new Error(response.message || "Employee update failed.");
      }

      const updatedEmployee = getEmployeeResponse(response);

      if (updatedEmployee && getEmployeeId(updatedEmployee)) {
        setSelectedEmployee(updatedEmployee);
      }

      setOpenEdit(false);

      showNotification(
        response?.message || "Employee profile updated successfully.",
        "success",
      );

      // Refresh employee directory.
      await fetchEmployees();

      // Refresh selected employee separately.
      try {
        const updatedResponse = await adminAPI.getEmployeeBy(employeeId);

        if (updatedResponse?.success !== false) {
          const latestEmployee = getEmployeeResponse(updatedResponse);

          if (latestEmployee && getEmployeeId(latestEmployee)) {
            setSelectedEmployee(latestEmployee);
          }
        }
      } catch (refreshError) {
        console.error("Unable to refresh employee details:", refreshError);
      }
    } catch (err) {
      showNotification(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // DEPARTMENT FILTER
  // ==================================================

  const departments = useMemo(() => {
    const values = employees.map(getEmployeeDepartment).filter(Boolean);

    return ["All", ...new Set(values)];
  }, [employees]);

  // ==================================================
  // FILTER EMPLOYEES
  // ==================================================

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const name = getEmployeeName(employee).toLowerCase();

      const email = String(employee.email || "").toLowerCase();

      const employeeId = String(getEmployeeId(employee)).toLowerCase();

      const department = getEmployeeDepartment(employee);

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        employeeId.includes(searchValue);

      const matchesDepartment =
        departmentFilter === "All" || department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, departmentFilter]);

  // ==================================================
  // EMPLOYEE COUNTS
  // ==================================================

  const activeCount = useMemo(
    () =>
      employees.filter(
        (employee) => getEmployeeStatus(employee).toLowerCase() === "active",
      ).length,
    [employees],
  );

  const inactiveCount = useMemo(
    () =>
      employees.filter(
        (employee) => getEmployeeStatus(employee).toLowerCase() === "inactive",
      ).length,
    [employees],
  );

  // ==================================================
  // UI
  // ==================================================

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        bgcolor: "#F0F8F6",
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
            Employee Profile
          </Typography>

          <Typography color="text.secondary" fontSize={14} mt={0.5}>
            View and manage employee personal and professional information.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchEmployees}
          disabled={loading}
          sx={{
            color: "#0F887D",
            borderColor: "#0F887D",
            textTransform: "none",
          }}
        >
          Refresh
        </Button>
      </Stack>

      {/* ERROR */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchEmployees}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* STATISTICS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            label: "Total Employees",
            value: employees.length,
            icon: <Person />,
          },
          {
            label: "Active Employees",
            value: activeCount,
            icon: <Work />,
          },
          {
            label: "Inactive Employees",
            value: inactiveCount,
            icon: <BadgeIcon />,
          },
        ].map((item) => (
          <Card key={item.label} sx={{ borderRadius: 3, boxShadow: "none" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" fontSize={13}>
                    {item.label}
                  </Typography>

                  <Typography variant="h4" fontWeight={800} color="#174D47">
                    {loading ? "—" : item.value}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor: "#E1F3EF",
                    color: "#0F887D",
                  }}
                >
                  {item.icon}
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* SEARCH AND FILTER */}

      <Card sx={{ borderRadius: 3, boxShadow: "none", mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "2fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search employee by name, ID or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              fullWidth
              size="small"
              label="Department"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
            >
              {departments.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* EMPLOYEE DIRECTORY */}

      <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
        <CardContent>
          <Typography fontWeight={700} fontSize={17} color="#174D47" mb={2}>
            Employee Directory
          </Typography>

          {loading ? (
            <Box py={6} display="flex" justifyContent="center">
              <CircularProgress sx={{ color: "#0F887D" }} />
            </Box>
          ) : filteredEmployees.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Person sx={{ fontSize: 48, color: "#A0B8B3" }} />

              <Typography color="text.secondary" mt={1}>
                No employee records found.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {filteredEmployees.map((employee) => {
                const employeeName = getEmployeeName(employee);
                const status = getEmployeeStatus(employee);
                const employeeId = getEmployeeId(employee);

                return (
                  <Box
                    key={employeeId}
                    sx={{
                      p: 2,
                      border: "1px solid #E1ECE9",
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      flexWrap: "wrap",
                      bgcolor: "#FFFFFF",
                      "&:hover": {
                        borderColor: "#0F887D",
                        bgcolor: "#FAFDFC",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={employee.profilePhoto || employee.avatar || ""}
                        sx={{
                          bgcolor: "#DDF3EF",
                          color: "#0F887D",
                          width: 48,
                          height: 48,
                          fontWeight: 700,
                        }}
                      >
                        {employeeName?.charAt(0)?.toUpperCase() || <Person />}
                      </Avatar>

                      <Box>
                        <Typography fontWeight={700}>
                          {employeeName || "Employee"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {employee.employeeCode || employeeId}
                          {" • "}
                          {getEmployeeDesignation(employee) || "—"}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {employee.email || "Email not provided"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      {getEmployeeDepartment(employee) && (
                        <Chip
                          size="small"
                          label={getEmployeeDepartment(employee)}
                          sx={{
                            bgcolor: "#EEF4F3",
                            color: "#42635E",
                          }}
                        />
                      )}

                      <Chip
                        size="small"
                        label={status}
                        color={
                          status.toLowerCase() === "active"
                            ? "success"
                            : "default"
                        }
                        variant="outlined"
                      />

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewProfile(employee)}
                        sx={{
                          color: "#0F887D",
                          borderColor: "#0F887D",
                          textTransform: "none",
                        }}
                      >
                        View Profile
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(employee)}
                        sx={{
                          bgcolor: "#0F887D",
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: "#0B6F66",
                          },
                        }}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* VIEW PROFILE DIALOG */}

      <Dialog
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#174D47",
            fontWeight: 800,
          }}
        >
          Employee Details
          <IconButton onClick={() => setOpenProfile(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {profileLoading ? (
            <Box py={6} display="flex" justifyContent="center">
              <CircularProgress sx={{ color: "#0F887D" }} />
            </Box>
          ) : selectedEmployee ? (
            <>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Avatar
                  src={
                    selectedEmployee.profilePhoto ||
                    selectedEmployee.avatar ||
                    ""
                  }
                  sx={{
                    width: 65,
                    height: 65,
                    bgcolor: "#DDF3EF",
                    color: "#0F887D",
                    fontSize: 25,
                  }}
                >
                  {getEmployeeName(selectedEmployee)?.charAt(0)?.toUpperCase()}
                </Avatar>

                <Box>
                  <Typography fontWeight={800} fontSize={19}>
                    {getEmployeeName(selectedEmployee)}
                  </Typography>

                  <Typography color="text.secondary" fontSize={13}>
                    {selectedEmployee.employeeCode ||
                      getEmployeeId(selectedEmployee)}
                  </Typography>

                  <Chip
                    size="small"
                    label={getEmployeeStatus(selectedEmployee)}
                    color={
                      getEmployeeStatus(selectedEmployee).toLowerCase() ===
                      "active"
                        ? "success"
                        : "default"
                    }
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Typography fontWeight={700} color="#0F887D" mb={2}>
                Personal Information
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 3,
                  mb: 3,
                }}
              >
                <DetailItem
                  label="Full Name"
                  value={getEmployeeName(selectedEmployee)}
                />

                <DetailItem label="Email" value={selectedEmployee.email} />

                <DetailItem
                  label="Phone"
                  value={selectedEmployee.phone || selectedEmployee.mobile}
                />

                <DetailItem label="Gender" value={selectedEmployee.gender} />

                <DetailItem
                  label="Date of Birth"
                  value={selectedEmployee.dob || selectedEmployee.dateOfBirth}
                />

                <DetailItem
                  label="Emergency Contact"
                  value={selectedEmployee.emergencyContact}
                />

                <DetailItem label="Address" value={selectedEmployee.address} />
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography fontWeight={700} color="#0F887D" mb={2}>
                Professional Information
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                <DetailItem
                  label="Department"
                  value={getEmployeeDepartment(selectedEmployee)}
                />

                <DetailItem
                  label="Designation"
                  value={getEmployeeDesignation(selectedEmployee)}
                />

                <DetailItem
                  label="Joining Date"
                  value={selectedEmployee.joiningDate}
                />

                <DetailItem
                  label="Employment Type"
                  value={selectedEmployee.employmentType}
                />

                <DetailItem
                  label="Reporting Manager"
                  value={selectedEmployee.reportingManager}
                />

                <DetailItem
                  label="Work Location"
                  value={selectedEmployee.workLocation}
                />
              </Box>
            </>
          ) : (
            <Typography color="text.secondary" py={3}>
              Employee details are not available.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenProfile(false)}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>

          {selectedEmployee && (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => {
                setOpenProfile(false);
                handleEdit(selectedEmployee);
              }}
              sx={{
                bgcolor: "#0F887D",
                textTransform: "none",
              }}
            >
              Edit Profile
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* EDIT EMPLOYEE DIALOG */}

      <Dialog
        open={openEdit}
        onClose={() => !saving && setOpenEdit(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#174D47",
            fontWeight: 800,
          }}
        >
          Edit Employee Profile
          <IconButton onClick={() => setOpenEdit(false)} disabled={saving}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography fontWeight={700} color="#0F887D" mb={2}>
            Personal Information
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              label="Full Name"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Email Address"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Phone Number"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={form.dob || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              select
              label="Gender"
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              label="Emergency Contact"
              name="emergencyContact"
              value={form.emergencyContact || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Address"
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              multiline
              minRows={2}
              sx={{ gridColumn: { sm: "span 2" } }}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography fontWeight={700} color="#0F887D" mb={2}>
            Professional Information
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Department"
              name="department"
              value={form.department || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Designation"
              name="designation"
              value={form.designation || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={form.joiningDate || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              select
              label="Employment Type"
              name="employmentType"
              value={form.employmentType || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Intern">Intern</MenuItem>
            </TextField>

            <TextField
              label="Reporting Manager"
              name="reportingManager"
              value={form.reportingManager || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              label="Monthly Salary"
              name="salary"
              type="number"
              value={form.salary ?? ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              select
              label="Employment Status"
              name="employmentStatus"
              value={form.employmentStatus || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenEdit(false)}
            disabled={saving}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              bgcolor: "#0F887D",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#0B6F66",
              },
            }}
          >
            {saving ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NOTIFICATION */}

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={notification.severity}
          onClose={closeNotification}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeProfile;
