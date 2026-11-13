import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tooltip,
} from "@mui/material";

import {
  LaptopMac,
  Add,
  Search,
  Inventory2,
  AssignmentInd,
  CheckCircle,
  Build,
  Edit,
  Delete,
  PersonAdd,
  Replay,
  Close,
  Devices,
  Monitor,
  Smartphone,
  MoreVert,
} from "@mui/icons-material";

const COLORS = {
  dark: "#0B403C",
  primary: "#0F887D",
  orange: "#F59E0B",
  background: "#F0F8F6",
  white: "#FFFFFF",
  border: "#DCEBE7",
  text: "#174D47",
  secondary: "#64748B",
};

const initialAssets = [
  {
    id: 1,
    assetName: "Dell Latitude 5420",
    assetCode: "AST-001",
    category: "Laptop",
    serialNumber: "DLL5420-001",
    assignedTo: "Rahul Sharma",
    employeeId: "EMP001",
    purchaseDate: "2025-01-15",
    condition: "Good",
    status: "Assigned",
  },
  {
    id: 2,
    assetName: "HP Monitor 24 inch",
    assetCode: "AST-002",
    category: "Monitor",
    serialNumber: "HPM-24002",
    assignedTo: "Priya Verma",
    employeeId: "EMP002",
    purchaseDate: "2025-02-10",
    condition: "Excellent",
    status: "Assigned",
  },
  {
    id: 3,
    assetName: "Lenovo ThinkPad",
    assetCode: "AST-003",
    category: "Laptop",
    serialNumber: "LEN-TP-003",
    assignedTo: "",
    employeeId: "",
    purchaseDate: "2025-03-05",
    condition: "Good",
    status: "Available",
  },
  {
    id: 4,
    assetName: "Samsung Mobile",
    assetCode: "AST-004",
    category: "Mobile",
    serialNumber: "SAM-MOB-004",
    assignedTo: "Amit Kumar",
    employeeId: "EMP003",
    purchaseDate: "2025-04-12",
    condition: "Fair",
    status: "Assigned",
  },
  {
    id: 5,
    assetName: "Dell Desktop",
    assetCode: "AST-005",
    category: "Desktop",
    serialNumber: "DELL-DT-005",
    assignedTo: "",
    employeeId: "",
    purchaseDate: "2024-12-20",
    condition: "Needs Repair",
    status: "Maintenance",
  },
];

const employees = [
  { id: "EMP001", name: "Rahul Sharma" },
  { id: "EMP002", name: "Priya Verma" },
  { id: "EMP003", name: "Amit Kumar" },
  { id: "EMP004", name: "Neha Singh" },
];

const emptyForm = {
  assetName: "",
  category: "Laptop",
  serialNumber: "",
  purchaseDate: "",
  condition: "Good",
};

const AssetManagement = () => {
  const navigate = useNavigate();

  const [assets, setAssets] = useState(initialAssets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const [editingAsset, setEditingAsset] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const stats = useMemo(() => {
    return [
      {
        title: "Total Assets",
        value: assets.length,
        icon: <Inventory2 />,
        color: COLORS.primary,
        bg: "#E5F4F0",
      },
      {
        title: "Assigned Assets",
        value: assets.filter((a) => a.status === "Assigned").length,
        icon: <AssignmentInd />,
        color: "#4F83CC",
        bg: "#EAF1FC",
      },
      {
        title: "Available Assets",
        value: assets.filter((a) => a.status === "Available").length,
        icon: <CheckCircle />,
        color: "#27966E",
        bg: "#E5F5EC",
      },
      {
        title: "Under Maintenance",
        value: assets.filter((a) => a.status === "Maintenance").length,
        icon: <Build />,
        color: COLORS.orange,
        bg: "#FFF4DD",
      },
    ];
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        asset.assetName.toLowerCase().includes(searchText) ||
        asset.assetCode.toLowerCase().includes(searchText) ||
        asset.serialNumber.toLowerCase().includes(searchText) ||
        asset.assignedTo.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || asset.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || asset.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [assets, search, statusFilter, categoryFilter]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Laptop":
        return <LaptopMac />;
      case "Monitor":
        return <Monitor />;
      case "Mobile":
        return <Smartphone />;
      default:
        return <Devices />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Assigned":
        return { bg: "#EAF1FC", color: "#4F83CC" };
      case "Available":
        return { bg: "#E5F5EC", color: "#27966E" };
      case "Maintenance":
        return { bg: "#FFF4DD", color: "#C08014" };
      default:
        return { bg: "#F1F5F9", color: COLORS.secondary };
    }
  };

  const openAddDialog = () => {
    setEditingAsset(null);
    setForm(emptyForm);
    setAssetDialogOpen(true);
  };

  const openEditDialog = (asset) => {
    setEditingAsset(asset);
    setForm({
      assetName: asset.assetName,
      category: asset.category,
      serialNumber: asset.serialNumber,
      purchaseDate: asset.purchaseDate,
      condition: asset.condition,
    });
    setAssetDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAsset = () => {
    if (
      !form.assetName.trim() ||
      !form.serialNumber.trim() ||
      !form.purchaseDate
    ) {
      return;
    }

    if (editingAsset) {
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === editingAsset.id ? { ...asset, ...form } : asset,
        ),
      );
    } else {
      const newAsset = {
        id: Date.now(),
        ...form,
        assetCode: `AST-${String(assets.length + 1).padStart(3, "0")}`,
        assignedTo: "",
        employeeId: "",
        status: "Available",
      };

      setAssets((prev) => [newAsset, ...prev]);
    }

    setAssetDialogOpen(false);
    setForm(emptyForm);
    setEditingAsset(null);
  };

  const openAssignDialog = (asset) => {
    setSelectedAsset(asset);
    setSelectedEmployee("");
    setAssignDialogOpen(true);
  };

  const handleAssignAsset = () => {
    if (!selectedEmployee || !selectedAsset) return;

    const employee = employees.find((item) => item.id === selectedEmployee);

    if (!employee) return;

    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === selectedAsset.id
          ? {
              ...asset,
              assignedTo: employee.name,
              employeeId: employee.id,
              status: "Assigned",
            }
          : asset,
      ),
    );

    setAssignDialogOpen(false);
    setSelectedAsset(null);
  };

  const handleReturnAsset = (assetId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this asset as returned?",
    );

    if (!confirmed) return;

    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              assignedTo: "",
              employeeId: "",
              status: "Available",
            }
          : asset,
      ),
    );
  };

  const handleDeleteAsset = (assetId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this asset?",
    );

    if (!confirmed) return;

    setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "calc(100vh - 70px)",
        bgcolor: COLORS.background,
      }}
    >
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color={COLORS.dark}>
            Asset Management
          </Typography>

          <Typography fontSize={13} color={COLORS.secondary} mt={0.5}>
            Manage company assets, assignments and returns.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openAddDialog}
          sx={{
            bgcolor: COLORS.primary,
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": { bgcolor: COLORS.dark, boxShadow: "none" },
          }}
        >
          Add New Asset
        </Button>
      </Stack>

      {/* Statistics */}
      <Grid container spacing={2.5} mb={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      fontSize={13}
                      fontWeight={600}
                      color={COLORS.secondary}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color={COLORS.dark}
                      mt={1}
                    >
                      {item.value}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: item.bg,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Asset Inventory */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
            mb={2.5}
          >
            <Box>
              <Typography fontWeight={800} fontSize={17} color={COLORS.dark}>
                Asset Inventory
              </Typography>

              <Typography fontSize={12} color={COLORS.secondary} mt={0.5}>
                View and manage all company assets
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              width={{ xs: "100%", md: "auto" }}
            >
              <TextField
                size="small"
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: { sm: 220 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 135 }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Assigned">Assigned</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ minWidth: 135 }}
              >
                <MenuItem value="All">All Categories</MenuItem>
                <MenuItem value="Laptop">Laptop</MenuItem>
                <MenuItem value="Desktop">Desktop</MenuItem>
                <MenuItem value="Monitor">Monitor</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: 2,
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 950 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F5FAF8" }}>
                  {[
                    "Asset",
                    "Asset Code",
                    "Category",
                    "Assigned To",
                    "Purchase Date",
                    "Condition",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        color: COLORS.dark,
                        fontWeight: 800,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => {
                    const statusStyle = getStatusColor(asset.status);

                    return (
                      <TableRow
                        key={asset.id}
                        hover
                        sx={{
                          "& td": {
                            borderColor: COLORS.border,
                            py: 1.5,
                          },
                        }}
                      >
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.2}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "#E5F4F0",
                                color: COLORS.primary,
                                width: 38,
                                height: 38,
                              }}
                            >
                              {getCategoryIcon(asset.category)}
                            </Avatar>

                            <Box>
                              <Typography
                                fontSize={12.5}
                                fontWeight={700}
                                color={COLORS.dark}
                              >
                                {asset.assetName}
                              </Typography>

                              <Typography
                                fontSize={10.5}
                                color={COLORS.secondary}
                              >
                                {asset.serialNumber}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Typography fontSize={12} fontWeight={600}>
                            {asset.assetCode}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography fontSize={12}>
                            {asset.category}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {asset.assignedTo ? (
                            <Box>
                              <Typography
                                fontSize={12}
                                fontWeight={600}
                                color={COLORS.dark}
                              >
                                {asset.assignedTo}
                              </Typography>

                              <Typography
                                fontSize={10.5}
                                color={COLORS.secondary}
                              >
                                {asset.employeeId}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography fontSize={12} color={COLORS.secondary}>
                              Not Assigned
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Typography fontSize={12}>
                            {asset.purchaseDate}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography fontSize={12}>
                            {asset.condition}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={asset.status}
                            size="small"
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 700,
                              fontSize: 10,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={0.3}>
                            <Tooltip title="Edit Asset">
                              <IconButton
                                size="small"
                                onClick={() => openEditDialog(asset)}
                                sx={{ color: COLORS.primary }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {asset.status === "Available" && (
                              <Tooltip title="Assign Asset">
                                <IconButton
                                  size="small"
                                  onClick={() => openAssignDialog(asset)}
                                  sx={{ color: COLORS.blue }}
                                >
                                  <PersonAdd fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {asset.status === "Assigned" && (
                              <Tooltip title="Return Asset">
                                <IconButton
                                  size="small"
                                  onClick={() => handleReturnAsset(asset.id)}
                                  sx={{ color: COLORS.orange }}
                                >
                                  <Replay fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip title="Delete Asset">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteAsset(asset.id)}
                                sx={{ color: "#DC6464" }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Inventory2
                        sx={{ fontSize: 40, color: "#A0B8B1", mb: 1 }}
                      />

                      <Typography fontWeight={700} color={COLORS.dark}>
                        No assets found
                      </Typography>

                      <Typography
                        fontSize={12}
                        color={COLORS.secondary}
                        mt={0.5}
                      >
                        Try changing your search or filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography fontSize={11} color={COLORS.secondary} mt={2}>
            Showing {filteredAssets.length} of {assets.length} assets
          </Typography>
        </CardContent>
      </Card>

      {/* Add / Edit Asset Dialog */}
      <Dialog
        open={assetDialogOpen}
        onClose={() => setAssetDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            color: COLORS.dark,
            fontWeight: 800,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editingAsset ? "Edit Asset" : "Add New Asset"}

          <IconButton onClick={() => setAssetDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Asset Name"
                name="assetName"
                value={form.assetName}
                onChange={handleFormChange}
                placeholder="e.g. Dell Latitude Laptop"
                size="small"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={form.category}
                onChange={handleFormChange}
                size="small"
              >
                <MenuItem value="Laptop">Laptop</MenuItem>
                <MenuItem value="Desktop">Desktop</MenuItem>
                <MenuItem value="Monitor">Monitor</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Serial Number"
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleFormChange}
                size="small"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Purchase Date"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleFormChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Condition"
                name="condition"
                value={form.condition}
                onChange={handleFormChange}
                size="small"
              >
                <MenuItem value="Excellent">Excellent</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Fair">Fair</MenuItem>
                <MenuItem value="Needs Repair">Needs Repair</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setAssetDialogOpen(false)}
            sx={{ color: COLORS.secondary, textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveAsset}
            disabled={
              !form.assetName.trim() ||
              !form.serialNumber.trim() ||
              !form.purchaseDate
            }
            sx={{
              bgcolor: COLORS.primary,
              textTransform: "none",
              px: 3,
              "&:hover": { bgcolor: COLORS.dark },
            }}
          >
            {editingAsset ? "Update Asset" : "Save Asset"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Asset Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ color: COLORS.dark, fontWeight: 800 }}>
          Assign Asset
        </DialogTitle>

        <DialogContent>
          <Typography fontSize={13} color={COLORS.secondary} mb={2}>
            {selectedAsset?.assetName} ({selectedAsset?.assetCode})
          </Typography>

          <TextField
            select
            fullWidth
            label="Select Employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            size="small"
          >
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.name} ({employee.id})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setAssignDialogOpen(false)}
            sx={{ textTransform: "none", color: COLORS.secondary }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAssignAsset}
            disabled={!selectedEmployee}
            sx={{
              bgcolor: COLORS.primary,
              textTransform: "none",
              "&:hover": { bgcolor: COLORS.dark },
            }}
          >
            Assign Asset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetManagement;
