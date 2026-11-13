import { useState } from "react";
import { loginUser } from "../../services/authService";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  Business,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

const ADMIN_ROLES = ["super_admin", "hr_admin", "finance_payroll", "manager"];

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // API call
      const response = await loginUser({
        email,
        password,
      });

      // Support both Axios response and response.data
      const result = response?.data ?? response;

      // Validate response
      if (!result || typeof result !== "object" || Array.isArray(result)) {
        throw new Error("Invalid response received from server.");
      }

      const { success, token, user, message } = result;

      if (success !== true) {
        throw new Error(
          typeof message === "string" && message.trim()
            ? message
            : "Login failed. Please check your credentials.",
        );
      }

      // Validate token
      if (typeof token !== "string" || !token.trim()) {
        throw new Error("Authentication token is missing.");
      }

      // Validate user object
      if (!user || typeof user !== "object" || Array.isArray(user)) {
        throw new Error("Invalid user information received.");
      }

      // Validate role
      if (typeof user.role !== "string" || !user.role.trim()) {
        throw new Error("User role is missing. Please contact administrator.");
      }

      const role = user.role.trim().toLowerCase();

      // Save session
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful");
      console.log("User role:", role);

      // Employee navigation
      if (role === "employee") {
        navigate("/employee", { replace: true });
        return;
      }

      // Admin navigation
      if (ADMIN_ROLES.includes(role)) {
        navigate("/admin", { replace: true });
        return;
      }

      // Unauthorized role
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/unauthorized", { replace: true });
    } catch (err) {
      // Extract only a safe string message
      const errorMessage =
        typeof err?.message === "string"
          ? err.message
          : "Login failed. Please try again.";

      console.log("Login failed:", errorMessage);

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f1f8f7 0%, #ffffff 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: "1px solid #dce8e7",
          boxShadow: "0 15px 40px rgba(11,64,61,0.10)",
        }}
      >
        {/* Logo and Heading */}
        <Box textAlign="center" mb={3}>
          <Box
            sx={{
              width: 62,
              height: 62,
              borderRadius: 2,
              backgroundColor: "#0b403d",
              color: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <Business fontSize="large" />
          </Box>

          <Typography variant="h5" fontWeight={800} sx={{ color: "#103f3d" }}>
            Employee Management
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Sign in to access your account
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="email"
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#0e8278",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0e8278",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: "#0e8278" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="current-password"
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#0e8278",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0e8278",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "#0e8278" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    aria-label="Toggle password visibility"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: "#0e8278" }} />
                    ) : (
                      <Visibility sx={{ color: "#0e8278" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Forgot Password */}
          <Box textAlign="right" mt={1}>
            <Typography
              component={Link}
              to="/forgot-password"
              sx={{
                color: "#0e8278",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                "&:hover": {
                  color: "#096c64",
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password?
            </Typography>
          </Box>

          {/* Login Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.3,
              bgcolor: "#0e8278",
              color: "#ffffff",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              fontSize: 15,
              "&:hover": {
                bgcolor: "#096c64",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Secure Employee Management System
        </Typography>

        {/* Signup */}
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          Don't have an account?{" "}
          <Typography
            component={Link}
            to="/signup"
            sx={{
              color: "#0e8278",
              textDecoration: "none",
              fontWeight: 700,
              "&:hover": {
                color: "#096c64",
                textDecoration: "underline",
              },
            }}
          >
            Sign Up
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
