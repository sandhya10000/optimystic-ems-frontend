import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

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
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { kycAPI } from "../../services/authService";
import {
  Search,
  Refresh,
  Visibility,
  VerifiedUser,
  Badge,
  Fingerprint,
  Person,
  Close,
} from "@mui/icons-material";

// ======================================
// HELPERS
// ======================================

const getToken = () => localStorage.getItem("token");

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEmployeeName = (user) => {
  if (!user || typeof user !== "object") return "Unknown Employee";

  return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown";
};

const getStatusColor = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "verified":
    case "success":
    case "completed":
      return "success";

    case "pending":
    case "initiated":
      return "warning";

    case "rejected":
    case "failed":
    case "error":
      return "error";

    default:
      return "default";
  }
};

const DetailItem = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant="body2"
      fontWeight={600}
      sx={{ wordBreak: "break-word" }}
    >
      {value || "N/A"}
    </Typography>
  </Grid>
);

// ======================================
// MAIN COMPONENT
// ======================================

const AdminKYC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [panData, setPanData] = useState([]);
  const [digilockerData, setDigilockerData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isPAN = activeTab === 0;

  // ======================================
  // FETCH KYC DATA
  // ======================================

  const fetchKYCData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (statusFilter !== "all") {
        params.verificationStatus = statusFilter;
      }

      // Call service based on active tab
      const result = isPAN
        ? await kycAPI.getAllPANVerifications(params)
        : await kycAPI.getAllDigilockerVerifications(params);

      if (!result.success) {
        throw new Error(result.message || "Unable to fetch KYC records");
      }

      const records = result.data || [];

      if (isPAN) {
        setPanData(records);
      } else {
        setDigilockerData(records);
      }

      setPagination({
        total: result.pagination?.total ?? records.length,
        totalPages: result.pagination?.totalPages ?? 1,
      });
    } catch (err) {
      console.error("Admin KYC Fetch Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while fetching KYC records",
      );
    } finally {
      setLoading(false);
    }
  }, [isPAN, page, rowsPerPage, statusFilter]);

  useEffect(() => {
    fetchKYCData();
  }, [fetchKYCData]);

  // ======================================
  // TAB CHANGE
  // ======================================

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
    setSearch("");
    setStatusFilter("all");
    setSelectedRecord(null);
    setDialogOpen(false);
  };

  // ======================================
  // SEARCH
  // ======================================

  const currentData = isPAN ? panData : digilockerData;

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return currentData;

    return currentData.filter((item) => {
      const employee = getEmployeeName(item.userId).toLowerCase();

      const email = item.userId?.email?.toLowerCase() || "";

      const documentNumber = (
        item.panNumber ||
        item.mobile ||
        item.transactionId ||
        ""
      ).toLowerCase();

      return (
        employee.includes(keyword) ||
        email.includes(keyword) ||
        documentNumber.includes(keyword)
      );
    });
  }, [currentData, search]);

  // ======================================
  // VIEW DETAILS
  // ======================================

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRecord(null);
  };

  // ======================================
  // TABLE PAGINATION
  // ======================================

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // ======================================
  // RENDER
  // ======================================

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* HEADER */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            KYC Management
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage and monitor all employee PAN and DigiLocker verifications.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchKYCData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Stack>

      {/* SUMMARY CARDS */}

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}>
                  <Badge />
                </Avatar>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    PAN Records
                  </Typography>

                  <Typography variant="h5" fontWeight={700}>
                    {isPAN ? pagination.total : "—"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#e8f5e9", color: "#2e7d32" }}>
                  <Fingerprint />
                </Avatar>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    DigiLocker Records
                  </Typography>

                  <Typography variant="h5" fontWeight={700}>
                    {!isPAN ? pagination.total : "—"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#fff3e0", color: "#ed6c02" }}>
                  <VerifiedUser />
                </Avatar>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Page Records
                  </Typography>

                  <Typography variant="h5" fontWeight={700}>
                    {currentData.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MAIN CARD */}

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<Badge />}
              iconPosition="start"
              label="PAN Verification"
            />

            <Tab
              icon={<Fingerprint />}
              iconPosition="start"
              label="DigiLocker Verification"
            />
          </Tabs>
        </Box>

        <CardContent>
          {/* FILTERS */}

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            mb={3}
          >
            <TextField
              size="small"
              placeholder={
                isPAN
                  ? "Search employee, email or PAN..."
                  : "Search employee, email, mobile or transaction..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: "100%", md: 400 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              label="Verification Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              sx={{ width: { xs: "100%", md: 220 } }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </TextField>
          </Stack>

          {/* ERROR */}

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={fetchKYCData}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* TABLE */}

          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 850 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell>
                    <strong>Employee</strong>
                  </TableCell>

                  <TableCell>
                    <strong>{isPAN ? "PAN Number" : "Mobile"}</strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      {isPAN ? "Document Type" : "Transaction ID"}
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>Provider</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>

                  <TableCell align="center">
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={30} />
                      <Typography variant="body2" mt={1}>
                        Loading KYC records...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No KYC records found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((record) => (
                    <TableRow hover key={record._id}>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Avatar sx={{ width: 34, height: 34 }}>
                            <Person fontSize="small" />
                          </Avatar>

                          <Box>
                            <Typography fontWeight={600} variant="body2">
                              {getEmployeeName(record.userId)}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {record.userId?.email || "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        {isPAN
                          ? record.panNumber || "N/A"
                          : record.mobile || "N/A"}
                      </TableCell>

                      <TableCell>
                        {isPAN
                          ? record.documentType || "PAN Premium"
                          : record.transactionId || "N/A"}
                      </TableCell>

                      <TableCell>{record.provider || "N/A"}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={record.verificationStatus || "Unknown"}
                          color={getStatusColor(record.verificationStatus)}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(record.createdAt)}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            onClick={() => handleViewDetails(record)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}

          <TablePagination
            component="div"
            count={pagination.total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </CardContent>
      </Card>

      {/* DETAILS DIALOG */}

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {isPAN ? "PAN Verification Details" : "DigiLocker Details"}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Employee KYC Information
              </Typography>
            </Box>

            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {selectedRecord && (
            <Stack spacing={3}>
              {/* EMPLOYEE DETAILS */}

              <Box>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                  Employee Information
                </Typography>

                <Grid container spacing={2}>
                  <DetailItem
                    label="Employee Name"
                    value={getEmployeeName(selectedRecord.userId)}
                  />

                  <DetailItem
                    label="Email"
                    value={selectedRecord.userId?.email}
                  />

                  <DetailItem
                    label="Role"
                    value={selectedRecord.userId?.role}
                  />
                </Grid>
              </Box>

              <Divider />

              {/* KYC DETAILS */}

              <Box>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                  {isPAN ? "PAN Information" : "DigiLocker Information"}
                </Typography>

                <Grid container spacing={2}>
                  {isPAN ? (
                    <>
                      <DetailItem
                        label="PAN Number"
                        value={selectedRecord.panNumber}
                      />

                      <DetailItem
                        label="Document Type"
                        value={selectedRecord.documentType}
                      />

                      <DetailItem
                        label="Provider Reference ID"
                        value={selectedRecord.providerReferenceId}
                      />
                    </>
                  ) : (
                    <>
                      <DetailItem
                        label="First Name"
                        value={selectedRecord.firstName}
                      />

                      <DetailItem
                        label="Last Name"
                        value={selectedRecord.lastName}
                      />

                      <DetailItem
                        label="Mobile"
                        value={selectedRecord.mobile}
                      />

                      <DetailItem
                        label="Email"
                        value={selectedRecord.emailId}
                      />

                      <DetailItem
                        label="Transaction ID"
                        value={selectedRecord.transactionId}
                      />

                      <DetailItem label="Code" value={selectedRecord.code} />

                      <DetailItem
                        label="Expiry"
                        value={selectedRecord.expiry}
                      />

                      <DetailItem
                        label="Expires At"
                        value={formatDate(selectedRecord.expiresAt)}
                      />
                    </>
                  )}

                  <DetailItem
                    label="Provider"
                    value={selectedRecord.provider}
                  />

                  <DetailItem
                    label="Verification Status"
                    value={selectedRecord.verificationStatus}
                  />

                  <DetailItem
                    label="Created At"
                    value={formatDate(selectedRecord.createdAt)}
                  />

                  <DetailItem
                    label="Verified At"
                    value={formatDate(selectedRecord.verifiedAt)}
                  />

                  {selectedRecord.digilockerUrl && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        component="a"
                        href={selectedRecord.digilockerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open DigiLocker Link
                      </Button>
                    </Grid>
                  )}

                  {selectedRecord.kycUrl && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        component="a"
                        href={selectedRecord.kycUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open KYC URL
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminKYC;
