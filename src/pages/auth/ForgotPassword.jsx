import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("Password reset functionality will be available soon.");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f1f8f7",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={800}
          color="#103f3d"
          textAlign="center"
        >
          Forgot Password?
        </Typography>

        <Typography color="text.secondary" textAlign="center" mt={2} mb={3}>
          Enter your registered email address.
        </Typography>

        {message && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {message}
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
            margin="normal"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              py: 1.3,
              bgcolor: "#0e8278",
              "&:hover": { bgcolor: "#096c64" },
            }}
          >
            Submit
          </Button>
        </Box>

        <Typography textAlign="center" mt={3}>
          <Link
            to="/login"
            style={{
              color: "#0e8278",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back to Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
