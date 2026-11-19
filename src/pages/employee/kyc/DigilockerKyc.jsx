import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  VerifiedUser,
  OpenInNew,
  Refresh,
} from "@mui/icons-material";

import { kycAPI } from "../../../services/authService";

const REDIRECTION_URL = import.meta.env.VITE_DIGILOCKER_REDIRECTION_URL;
const WEBHOOK_URL = import.meta.env.VITE_DIGILOCKER_WEBHOOK_URL;

const DigilockerKyc = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    emailId: "",
    isSendOtp: true,
    isHideExplanationScreen: true,
    failOnDocNotFound: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (event) => {
    const { name, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setVerificationResult(null);

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const mobile = formData.mobile.trim();
    const emailId = formData.emailId.trim().toLowerCase();

    if (!firstName || !lastName || !mobile || !emailId) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!REDIRECTION_URL || !WEBHOOK_URL) {
      setError(
        "DigiLocker URL configuration is missing. Please contact the administrator.",
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        firstName,
        lastName,
        mobile,
        emailId,
        redirectionUrl: REDIRECTION_URL,
        webhookUrl: WEBHOOK_URL,
        isSendOtp: formData.isSendOtp,
        isHideExplanationScreen: formData.isHideExplanationScreen,
        failOnDocNotFound: formData.failOnDocNotFound,
        expiry: "345600000",
      };

      const response = await kycAPI.generateDigilockerLink(payload);

      if (response?.success) {
        setVerificationResult(response.data);
        setSuccess(
          response.message || "DigiLocker link generated successfully.",
        );
      } else {
        setError(response?.message || "Unable to generate DigiLocker link.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while generating DigiLocker link.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      mobile: "",
      emailId: "",
      isSendOtp: true,
      isHideExplanationScreen: true,
      failOnDocNotFound: false,
    });

    setVerificationResult(null);
    setSuccess("");
    setError("");
  };

  const openDigilocker = () => {
    const url = verificationResult?.url || verificationResult?.kycUrl;

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: "#ede9fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VerifiedUser sx={{ color: "#6d28d9", fontSize: 28 }} />
        </Box>

        <Box>
          <Typography variant="h5" fontWeight={700}>
            DigiLocker KYC Verification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate a secure DigiLocker link to complete your KYC.
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <AccountCircle color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Personal Information
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Enter your details to generate the DigiLocker verification link.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Mobile Number"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(event) => {
                        const value = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);

                        setFormData((prev) => ({
                          ...prev,
                          mobile: value,
                        }));
                      }}
                      inputProps={{ maxLength: 10 }}
                      placeholder="10-digit mobile number"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Email Address"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" fontWeight={700} mb={1}>
                  Verification Settings
                </Typography>

                <Stack spacing={0.5}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isSendOtp"
                        checked={formData.isSendOtp}
                        onChange={handleOptionChange}
                        color="primary"
                      />
                    }
                    label="Send OTP to user's mobile"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isHideExplanationScreen"
                        checked={formData.isHideExplanationScreen}
                        onChange={handleOptionChange}
                        color="primary"
                      />
                    }
                    label="Hide DigiLocker explanation screen"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        name="failOnDocNotFound"
                        checked={formData.failOnDocNotFound}
                        onChange={handleOptionChange}
                        color="primary"
                      />
                    }
                    label="Fail verification if document is not found"
                  />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <VerifiedUser />
                      )
                    }
                    sx={{
                      py: 1.4,
                      borderRadius: 2,
                      bgcolor: "#6d28d9",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "#5b21b6" },
                    }}
                  >
                    {loading
                      ? "Generating Link..."
                      : "Generate DigiLocker Link"}
                  </Button>

                  <Button
                    type="button"
                    variant="outlined"
                    color="inherit"
                    onClick={handleReset}
                    disabled={loading}
                    startIcon={<Refresh />}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Verification Status
              </Typography>

              {!verificationResult ? (
                <Box
                  sx={{
                    minHeight: 250,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  <VerifiedUser
                    sx={{ fontSize: 55, color: "#c4b5fd", mb: 1 }}
                  />
                  <Typography fontWeight={600}>No Verification Yet</Typography>
                  <Typography variant="body2" mt={0.5}>
                    Your DigiLocker transaction details will appear here after
                    generating the link.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f0fdf4",
                      borderRadius: 2,
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight={700}>Link Generated</Typography>
                      <Chip label="Pending" color="warning" size="small" />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Your DigiLocker link is ready. Open it to continue the KYC
                      process.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      {verificationResult.transactionId || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Verification Code
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {verificationResult.code || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Expiry Date
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {verificationResult.expiresAt
                        ? new Date(
                            verificationResult.expiresAt,
                          ).toLocaleString()
                        : "-"}
                    </Typography>
                  </Box>

                  <Divider />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={openDigilocker}
                    disabled={
                      !verificationResult.url && !verificationResult.kycUrl
                    }
                    endIcon={<OpenInNew />}
                    sx={{
                      py: 1.3,
                      borderRadius: 2,
                      bgcolor: "#6d28d9",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "#5b21b6" },
                    }}
                  >
                    Open DigiLocker
                  </Button>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Complete the verification on the DigiLocker page.
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DigilockerKyc;
