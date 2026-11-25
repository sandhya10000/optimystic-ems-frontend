import { useState, useEffect } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Chip,
} from "@mui/material";

import {
  PersonAddAlt1,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Refresh,
  Badge,
  VerifiedUser,
} from "@mui/icons-material";

import { employeeAPI } from "../../services/authService";

const initialForm = {
  email: "",
  password: "",
};

// Handles different possible API response structures
const getEmployeeData = (response) => {
  const data = response?.data ?? response;

  return (
    data?.user ||
    data?.employee ||
    data?.data?.user ||
    data?.data?.employee ||
    data?.data ||
    data
  );
};

const CreateEmployee = () => {
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [fetchingEmployee, setFetchingEmployee] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [createdEmployee, setCreatedEmployee] = useState(null);

  // -----------------------------------------
  // HANDLE INPUT CHANGE
  // -----------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------
  // GET EMPLOYEE BY EMPLOYEE ID
  // -----------------------------------------
  const fetchEmployee = async (employeeId) => {
    try {
      setFetchingEmployee(true);

      console.log("Fetching Employee:", employeeId);

      const response = await employeeAPI.getEmployee(employeeId);

      console.log("GET Employee Response:", response.data);

      const employee = getEmployeeData(response);

      if (!employee || (!employee.employeeId && !employee.email)) {
        throw new Error("Employee details not found in GET response.");
      }

      setCreatedEmployee(employee);

      return employee;
    } catch (error) {
      console.error("Fetch Employee Error:", error);

      // Do not remove the details already received from CREATE API.
      setMessage({
        type: "warning",
        text: "Employee account was created successfully, but fetching complete details failed. ",
      });

      return null;
    } finally {
      setFetchingEmployee(false);
    }
  };
  useEffect(() => {
    fetchEmployee();
  }, []);

  // -----------------------------------------
  // CREATE EMPLOYEE
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    setCreatedEmployee(null);

    if (!formData.email.trim()) {
      setMessage({
        type: "error",
        text: "Please enter employee email.",
      });
      return;
    }

    if (formData.password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }

    try {
      setLoading(true);

      // STEP 1: CREATE EMPLOYEE
      const response = await employeeAPI.createEmployee({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("Create Employee Response:", response.data);

      if (!response.data?.success || !response.data?.user) {
        throw new Error(
          response.data?.message || "Unable to create employee account.",
        );
      }

      const newEmployee = response.data.user;

      // Show CREATE API response immediately
      setCreatedEmployee(newEmployee);

      setFormData(initialForm);

      setMessage({
        type: "success",
        text: response.data.message || "Employee account created successfully.",
      });

      // STEP 2: GET EMPLOYEE USING GENERATED EMPLOYEE ID
      if (newEmployee.employeeId) {
        await fetchEmployee(newEmployee.employeeId);
      } else {
        setMessage({
          type: "warning",
          text: "Employee created successfully, but employeeId was not returned by the CREATE API.",
        });
      }
    } catch (error) {
      console.error("Create Employee Error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Unable to create employee account.",
      });
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // RESET FORM
  // -----------------------------------------
  const handleReset = () => {
    setFormData(initialForm);
    setCreatedEmployee(null);
    setMessage({
      type: "",
      text: "",
    });
    setShowPassword(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* PAGE HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Create Employee Account
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Create employee login credentials for EMS Portal.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
          disabled={loading || fetchingEmployee}
        >
          Reset
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* FORM SECTION */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                <Box
                  sx={{
                    bgcolor: "#E8F5E9",
                    color: "#2E7D32",
                    p: 1.2,
                    borderRadius: 2,
                    display: "flex",
                  }}
                >
                  <PersonAddAlt1 />
                </Box>

                <Box>
                  <Typography fontWeight={700}>
                    Employee Login Details
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Enter the employee's account information.
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {message.text && (
                <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
                  {message.text}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  {/* EMAIL */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Employee Email"
                      name="email"
                      placeholder="employee@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* PASSWORD */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Temporary Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter temporary password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      helperText="Minimum 8 characters."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="flex-end"
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleReset}
                    disabled={loading || fetchingEmployee}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || fetchingEmployee}
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <PersonAddAlt1 />
                      )
                    }
                    sx={{
                      bgcolor: "#166534",
                      "&:hover": {
                        bgcolor: "#14532D",
                      },
                      px: 3,
                    }}
                  >
                    {loading ? "Creating..." : "Create Employee"}
                  </Button>
                </Stack>
              </Box>

              {/* FETCHING EMPLOYEE */}
              {fetchingEmployee && (
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    Fetching employee details...
                  </Typography>
                </Box>
              )}

              {/* EMPLOYEE DETAILS */}
              {createdEmployee && (
                <Box sx={{ mt: 4 }}>
                  <Divider sx={{ mb: 3 }} />

                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <CheckCircle color="success" />

                    <Typography variant="h6" fontWeight={700}>
                      Employee Details
                    </Typography>
                  </Stack>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: "1px solid",
                      borderColor: "#BBF7D0",
                      borderRadius: 2,
                      bgcolor: "#F0FDF4",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={2}
                      mb={3}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Employee account created successfully
                        </Typography>

                        <Typography variant="h5" fontWeight={700}>
                          {createdEmployee.employeeId || "N/A"}
                        </Typography>
                      </Box>

                      <Chip
                        icon={<VerifiedUser />}
                        label="Account Created"
                        color="success"
                        variant="outlined"
                      />
                    </Stack>

                    <Grid container spacing={3}>
                      {/* EMPLOYEE ID */}
                      <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Badge color="action" />

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Employee ID
                            </Typography>

                            <Typography fontWeight={600}>
                              {createdEmployee.employeeId || "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* EMAIL */}
                      <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Email color="action" />

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Email Address
                            </Typography>

                            <Typography fontWeight={600}>
                              {createdEmployee.email || "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* NAME */}
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Employee Name
                          </Typography>

                          <Typography fontWeight={600}>
                            {[
                              createdEmployee.firstName,
                              createdEmployee.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ") || "Not Updated Yet"}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* PHONE */}
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Phone Number
                          </Typography>

                          <Typography fontWeight={600}>
                            {createdEmployee.phone || "Not Updated Yet"}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* ROLE */}
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Role
                          </Typography>

                          <Typography fontWeight={600}>
                            {createdEmployee.role || "employee"}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* PROFILE STATUS */}
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Profile Status
                          </Typography>

                          <Box mt={0.5}>
                            <Chip
                              size="small"
                              label={
                                createdEmployee.profileCompleted
                                  ? "Completed"
                                  : "Pending"
                              }
                              color={
                                createdEmployee.profileCompleted
                                  ? "success"
                                  : "warning"
                              }
                            />
                          </Box>
                        </Box>
                      </Grid>

                      {/* ACCOUNT STATUS */}
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Account Status
                          </Typography>

                          <Typography fontWeight={600}>
                            {createdEmployee.accountStatus || "approved"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* INFORMATION SECTION */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              bgcolor: "#F8FAFC",
            }}
          >
            <Typography fontWeight={700} mb={2}>
              Account Creation Process
            </Typography>

            <Stack spacing={2.5}>
              {[
                "Admin creates employee login account.",
                "Employee receives welcome email.",
                "Employee logs in using credentials.",
                "Employee completes Basic Profile.",
                "Employee accesses dashboard.",
              ].map((item, index) => (
                <Stack
                  direction="row"
                  spacing={1.5}
                  key={index}
                  alignItems="flex-start"
                >
                  <CheckCircle
                    sx={{
                      color: "#16A34A",
                      fontSize: 20,
                    }}
                  />

                  <Typography variant="body2">{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>

          <Alert severity="info" sx={{ mt: 2 }}>
            Admin only creates login credentials. Employees will complete their
            personal information after login.
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateEmployee;
