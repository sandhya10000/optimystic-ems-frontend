import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      setMessage(
        response.data.message ||
          "If an account exists, password reset instructions will be sent.",
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to process your request.",
      );
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
        backgroundColor: "#f1f5f9",
        p: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 430, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={1}>
          Forgot Password?
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Enter your registered email address. We will send password reset
          instructions if the account exists.
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, py: 1.3, textTransform: "none" }}
          >
            {loading ? (
              <CircularProgress size={23} color="inherit" />
            ) : (
              "Send Reset Instructions"
            )}
          </Button>
        </Box>

        <Typography textAlign="center" mt={3}>
          <Link
            to="/login"
            style={{ color: "#2563eb", textDecoration: "none" }}
          >
            Back to Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
