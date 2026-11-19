import { useEffect, useState } from "react";
import { kycAPI } from "../../../services/authService";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
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
  CreditCard,
  VerifiedUser,
  History,
  Refresh,
  Search,
} from "@mui/icons-material";

const PanVerification = () => {
  const [panNumber, setPanNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [verificationResult, setVerificationResult] = useState(null);
  const [history, setHistory] = useState([]);

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

  // ======================================
  // GET PAN VERIFICATION HISTORY
  // ======================================
  const fetchPANHistory = async () => {
    try {
      setHistoryLoading(true);

      const response = await kycAPI.panKyc();

      if (response.success) {
        setHistory(response.data || []);
      }
    } catch (err) {
      console.error(
        "PAN History Error:",
        err.response?.data?.message || err.message,
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchPANHistory();
  }, []);

  // ======================================
  // VERIFY PAN
  // ======================================
  const handleVerifyPAN = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setVerificationResult(null);

    const pan = panNumber.trim().toUpperCase();

    if (!pan) {
      setError("Please enter your PAN number.");
      return;
    }

    if (!panRegex.test(pan)) {
      setError("Please enter a valid PAN number.");
      return;
    }

    try {
      setLoading(true);

      const response = await kycAPI.panVerify({
        panNumber: pan,
      });

      if (response.success) {
        setSuccess(response.message || "PAN verification successful.");

        setVerificationResult(response);
        setPanNumber("");

        await fetchPANHistory();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to verify PAN. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // FORMAT DATE
  // ======================================
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ======================================
  // UI
  // ======================================
  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* PAGE HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#0f172a">
            PAN Verification
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Verify PAN details securely using PAN Comprehensive verification.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* PAN FORM */}
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    backgroundColor: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CreditCard sx={{ color: "#4f46e5" }} />
                </Box>

                <Box>
                  <Typography fontWeight={700}>Enter PAN Details</Typography>

                  <Typography variant="caption" color="text.secondary">
                    Enter your 10-character PAN number
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

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

              <Box component="form" onSubmit={handleVerifyPAN}>
                <TextField
                  fullWidth
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) =>
                    setPanNumber(
                      e.target.value
                        .toUpperCase()
                        .replace(/\s/g, "")
                        .slice(0, 10),
                    )
                  }
                  disabled={loading}
                  inputProps={{
                    maxLength: 10,
                    style: {
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      fontWeight: 600,
                    },
                  }}
                  helperText={`${panNumber.length}/10 characters`}
                />

                <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
                  PAN format: 5 letters, 4 digits and 1 letter.
                </Alert>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || !panNumber.trim()}
                  startIcon={
                    loading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <Search />
                    )
                  }
                  sx={{
                    py: 1.4,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    backgroundColor: "#0f172a",
                    "&:hover": {
                      backgroundColor: "#1e293b",
                    },
                  }}
                >
                  {loading ? "Verifying PAN..." : "Verify PAN"}
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                textAlign="center"
                mt={2}
              >
                Your PAN details are processed securely.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* VERIFICATION RESULT */}
        {verificationResult && (
          <Grid item xs={12}>
            {(() => {
              const result = verificationResult.data || {};

              const DetailItem = ({ label, value }) => (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    {label}
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ wordBreak: "break-word" }}
                  >
                    {value !== null && value !== undefined && value !== ""
                      ? value
                      : "-"}
                  </Typography>
                </Box>
              );

              const SectionTitle = ({ children }) => (
                <Typography
                  fontWeight={700}
                  fontSize={15}
                  sx={{ mb: 2, color: "#1e293b" }}
                >
                  {children}
                </Typography>
              );

              return (
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  {/* HEADER */}
                  <Box
                    sx={{
                      p: 3,
                      background: "#f0fdf4",
                      borderBottom: "1px solid #bbf7d0",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 45,
                            height: 45,
                            borderRadius: 2,
                            background: "#dcfce7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <VerifiedUser
                            sx={{ color: "#15803d", fontSize: 27 }}
                          />
                        </Box>

                        <Box>
                          <Typography fontWeight={700} fontSize={18}>
                            PAN Verification Result
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {verificationResult.message}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        icon={<VerifiedUser />}
                        label="Verified Successfully"
                        color="success"
                        variant="filled"
                      />
                    </Stack>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* BASIC INFORMATION */}
                    <SectionTitle>Personal Information</SectionTitle>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="Full Name"
                          value={result.full_name}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="PAN Number"
                          value={result.pan_number}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem label="Date of Birth" value={result.dob} />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="Gender"
                          value={
                            result.gender === "M"
                              ? "Male"
                              : result.gender === "F"
                                ? "Female"
                                : result.gender
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="PAN Category"
                          value={result.category}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem label="PAN Status" value={result.message} />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2.5 }} />

                    {/* CONTACT INFORMATION 11 */}
                    <SectionTitle>Contact Information</SectionTitle>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="Email Address"
                          value={result.email}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="Mobile Number"
                          value={result.phone_number}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="Aadhaar Number"
                          value={result.masked_aadhaar || "Not Available"}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2.5 }} />

                    {/* ADDRESS INFORMATION */}
                    <SectionTitle>Address Information</SectionTitle>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="State"
                          value={result.address?.state}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="District"
                          value={result.address?.district_name}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="District Code"
                          value={result.address?.district_code}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="State Code"
                          value={result.address?.state_code}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2.5 }} />

                    {/* ADDITIONAL VERIFICATION */}
                    <SectionTitle>Additional Verification Details</SectionTitle>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="Aadhaar Linked"
                          value={result.aadhaar_linked ? "Yes" : "No"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="Director Status"
                          value={result.is_director?.found}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="Sole Proprietor"
                          value={result.is_sole_proprietor?.found}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <DetailItem
                          label="Date of Incorporation"
                          value={result.doi}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2.5 }} />
                  </CardContent>
                </Card>
              );
            })()}
          </Grid>
        )}

        {/* PAN HISTORY */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                mb={2}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <History color="primary" />
                  <Typography fontWeight={700}>
                    PAN Verification History
                  </Typography>
                </Stack>

                <Button
                  size="small"
                  startIcon={<Refresh />}
                  onClick={fetchPANHistory}
                  disabled={historyLoading}
                >
                  Refresh
                </Button>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {historyLoading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : history.length === 0 ? (
                <Box textAlign="center" py={5}>
                  <CreditCard sx={{ fontSize: 45, color: "#94a3b8", mb: 1 }} />

                  <Typography fontWeight={600}>
                    No PAN verification history
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Your PAN verification records will appear here.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                        <TableCell>
                          <b>PAN Number</b>
                        </TableCell>

                        <TableCell>
                          <b>Document Type</b>
                        </TableCell>
                        <TableCell>
                          <b>Status</b>
                        </TableCell>
                        <TableCell>
                          <b>Date</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {history.map((item) => (
                        <TableRow key={item._id} hover>
                          <TableCell>{item.panNumber || "-"}</TableCell>

                          <TableCell>{item.documentType || "-"}</TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={item.verificationStatus || "pending"}
                              color={
                                item.verificationStatus === "verified"
                                  ? "success"
                                  : item.verificationStatus === "failed"
                                    ? "error"
                                    : "warning"
                              }
                            />
                          </TableCell>

                          <TableCell>{formatDate(item.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PanVerification;
