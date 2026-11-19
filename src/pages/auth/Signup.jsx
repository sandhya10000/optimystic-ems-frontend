import { useState } from "react";
import { authService } from "../../services/authService";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Link,
} from "@mui/material";

import { Link as RouterLink, useNavigate } from "react-router-dom";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  employeeId: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Mobile number validation
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    // Emergency contact validation
    if (
      formData.emergencyContactNumber &&
      !/^[6-9]\d{9}$/.test(formData.emergencyContactNumber)
    ) {
      setError("Please enter a valid emergency contact number.");
      return;
    }

    // PIN code validation
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    try {
      setLoading(true);

      // Remove confirmPassword before sending data
      const { confirmPassword, ...registrationData } = formData;

      // Call registration API through authService
      const response = await authService.registerEmployee(registrationData);

      setSuccess(
        response.message ||
          "Registration submitted successfully. Please wait for HR approval.",
      );

      // Reset form
      setFormData(initialForm);

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration Error:", err);

      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reusable form field
  const renderField = (label, name, options = {}) => (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        size="small"
        label={label}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={options.required ?? false}
        type={options.type || "text"}
        select={Boolean(options.select)}
        multiline={Boolean(options.multiline)}
        rows={options.rows || 1}
        autoComplete="off"
        inputProps={options.inputProps}
        InputLabelProps={options.type === "date" ? { shrink: true } : undefined}
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: "#0e8278",
            borderWidth: 2,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#0e8278",
          },
        }}
      >
        {options.options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f1f8f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "650px",
          mx: "auto",
          p: { xs: 2.5, sm: 4 },
          border: "1px solid #dce8e7",
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(11, 64, 61, 0.08)",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 2,
              bgcolor: "#0b403d",
              color: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              fontSize: 19,
              fontWeight: 800,
            }}
          >
            EMS
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: "#103f3d",
              fontSize: { xs: 25, sm: 32 },
            }}
          >
            Employee Registration
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Create your EMS employee account
          </Typography>

          <Box
            sx={{
              width: 55,
              height: 4,
              bgcolor: "#f59e0b",
              borderRadius: 5,
              mx: "auto",
              mt: 2,
            }}
          />
        </Box>

        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Typography variant="h6" fontWeight={800} color="#0b403d" mb={2}>
            1. Personal Information
          </Typography>

          <Grid container spacing={2}>
            {renderField("First Name", "firstName", {
              required: true,
            })}

            {renderField("Last Name", "lastName", {
              required: true,
            })}

            {renderField("Date of Birth", "dateOfBirth", {
              type: "date",
              required: true,
            })}

            {renderField("Gender", "gender", {
              select: true,
              required: true,
              options: [
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
                {
                  value: "prefer_not_to_say",
                  label: "Prefer not to say",
                },
              ],
            })}

            {renderField("Marital Status", "maritalStatus", {
              select: true,
              options: [
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "other", label: "Other" },
              ],
            })}
          </Grid>

          <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

          {/* Contact Information */}
          <Typography variant="h6" fontWeight={800} color="#0b403d" mb={2}>
            2. Contact Information
          </Typography>

          <Grid container spacing={2}>
            {renderField("Email Address", "email", {
              type: "email",
              required: true,
            })}

            {renderField("Mobile Number", "phone", {
              required: true,
              inputProps: { maxLength: 10 },
            })}

            {renderField("Complete Address", "address", {
              required: true,
              multiline: true,
              rows: 2,
            })}

            {renderField("City", "city", {
              required: true,
            })}

            {renderField("State", "state", {
              required: true,
            })}

            {renderField("PIN Code", "pincode", {
              required: true,
              inputProps: { maxLength: 6 },
            })}
          </Grid>

          <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

          {/* Emergency Contact */}
          <Typography variant="h6" fontWeight={800} color="#0b403d" mb={2}>
            3. Emergency Contact
          </Typography>

          <Grid container spacing={2}>
            {renderField("Contact Person Name", "emergencyContactName")}

            {renderField("Emergency Mobile Number", "emergencyContactNumber", {
              inputProps: { maxLength: 10 },
            })}
          </Grid>

          <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

          {/* Employment Information */}
          <Typography variant="h6" fontWeight={800} color="#0b403d" mb={1}>
            4. Employment Information
          </Typography>

          <Typography color="text.secondary" fontSize={13} mb={2}>
            Enter the employee ID provided by your HR department.
          </Typography>

          <Grid container spacing={2}>
            {renderField("Employee ID", "employeeId", {
              required: true,
            })}
          </Grid>

          <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

          {/* Account Security */}
          <Typography variant="h6" fontWeight={800} color="#0b403d" mb={2}>
            5. Account Security
          </Typography>

          <Grid container spacing={2}>
            {renderField("Password", "password", {
              type: "password",
              required: true,
            })}

            {renderField("Confirm Password", "confirmPassword", {
              type: "password",
              required: true,
            })}
          </Grid>

          {/* Information Alert */}
          <Alert
            severity="info"
            sx={{
              mt: 3,
              borderRadius: 2,
              "& .MuiAlert-icon": {
                color: "#0e8278",
              },
            }}
          >
            Your registration will be subject to employee ID verification and HR
            approval. Do not enter bank account, PAN or Aadhaar details on this
            public registration form.
          </Alert>

          {/* Submit Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              bgcolor: "#0e8278",
              color: "#ffffff",
              borderRadius: 2,
              fontWeight: 800,
              fontSize: 15,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#096c64",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit Registration"
            )}
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

        {/* Login Link */}
        <Typography textAlign="center" color="text.secondary" fontSize={14}>
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            fontWeight={800}
            sx={{
              color: "#0e8278",
              "&:hover": {
                color: "#096c64",
              },
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;
