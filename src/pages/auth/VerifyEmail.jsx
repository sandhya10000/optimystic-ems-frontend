import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("Verification token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/auth/verify-email`, {
          params: { token },
        });

        setSuccess(true);
        setMessage(response.data.message || "Email verified successfully.");
      } catch (err) {
        setSuccess(false);
        setMessage(
          err.response?.data?.message ||
            "Email verification failed. The link may have expired.",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

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
      <Paper
        sx={{
          width: "100%",
          maxWidth: 430,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        {loading ? (
          <>
            <CircularProgress />
            <Typography mt={2}>Verifying your email...</Typography>
          </>
        ) : (
          <>
            {success ? (
              <CheckCircleOutline
                sx={{ fontSize: 65, color: "success.main" }}
              />
            ) : (
              <ErrorOutline sx={{ fontSize: 65, color: "error.main" }} />
            )}

            <Typography variant="h5" fontWeight={700} mt={2}>
              {success ? "Email Verified!" : "Verification Failed"}
            </Typography>

            <Alert severity={success ? "success" : "error"} sx={{ mt: 2 }}>
              {message}
            </Alert>

            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{ mt: 3, textTransform: "none" }}
            >
              Go to Login
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
