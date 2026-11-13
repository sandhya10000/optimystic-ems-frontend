import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

import { Search, Visibility, Close, VerifiedUser } from "@mui/icons-material";

const initialKycData = [
  {
    id: "KYC001",
    employeeId: "EMP001",
    employeeName: "Rahul Sharma",
    documentType: "PAN Card",
    submittedDate: "2026-10-20",
    status: "Verified",
  },
  {
    id: "KYC002",
    employeeId: "EMP002",
    employeeName: "Priya Verma",
    documentType: "Aadhaar",
    submittedDate: "2026-10-22",
    status: "Pending",
  },
  {
    id: "KYC003",
    employeeId: "EMP003",
    employeeName: "Amit Kumar",
    documentType: "PAN Card",
    submittedDate: "2026-10-25",
    status: "Rejected",
  },
];

const Kyc = () => {
  const [kycData, setKycData] = useState(initialKycData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedKyc, setSelectedKyc] = useState(null);

  const filteredData = kycData.filter((item) => {
    const matchesSearch =
      item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, status) => {
    setKycData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    setSelectedKyc(null);
  };

  const getStatusColor = (status) => {
    if (status === "Verified") return "success";
    if (status === "Pending") return "warning";
    if (status === "Rejected") return "error";
    return "default";
  };

  const verifiedCount = kycData.filter(
    (item) => item.status === "Verified",
  ).length;

  const pendingCount = kycData.filter(
    (item) => item.status === "Pending",
  ).length;

  const rejectedCount = kycData.filter(
    (item) => item.status === "Rejected",
  ).length;

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>
          KYC Management
        </Typography>

        <Typography color="text.secondary">
          Manage employee identity verification records
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total KYC", value: kycData.length },
          { label: "Verified", value: verifiedCount },
          { label: "Pending", value: pendingCount },
          { label: "Rejected", value: rejectedCount },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography color="text.secondary">{item.label}</Typography>

              <Typography variant="h4" fontWeight={700} mt={1}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Box
          display="flex"
          gap={2}
          flexWrap="wrap"
          justifyContent="space-between"
          mb={3}
        >
          <TextField
            size="small"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", sm: 280 } }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />,
            }}
          />

          <TextField
            select
            size="small"
            label="Filter Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Verified">Verified</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>KYC ID</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Document Type</TableCell>
                <TableCell>Submitted Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {item.employeeName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.employeeId}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.documentType}</TableCell>
                  <TableCell>{item.submittedDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => setSelectedKyc(item)}
                      aria-label="View KYC"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No KYC records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={Boolean(selectedKyc)}
        onClose={() => setSelectedKyc(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedKyc && (
          <>
            <DialogTitle>
              KYC Details
              <IconButton
                onClick={() => setSelectedKyc(null)}
                sx={{ position: "absolute", right: 12, top: 12 }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <VerifiedUser color="primary" />
                <Typography fontWeight={600}>Employee Verification</Typography>
              </Box>

              <Typography mb={1}>
                <strong>Employee:</strong> {selectedKyc.employeeName}
              </Typography>

              <Typography mb={1}>
                <strong>Employee ID:</strong> {selectedKyc.employeeId}
              </Typography>

              <Typography mb={1}>
                <strong>Document:</strong> {selectedKyc.documentType}
              </Typography>

              <Typography mb={1}>
                <strong>Submitted:</strong> {selectedKyc.submittedDate}
              </Typography>

              <Typography mb={1}>
                <strong>Status:</strong> {selectedKyc.status}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Demo record: actual identity documents are not stored or
                verified by this UI.
              </Typography>
            </DialogContent>

            <DialogActions>
              <Button
                color="error"
                onClick={() => updateStatus(selectedKyc.id, "Rejected")}
              >
                Reject
              </Button>

              <Button
                variant="contained"
                onClick={() => updateStatus(selectedKyc.id, "Verified")}
              >
                Mark Verified
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Kyc;
