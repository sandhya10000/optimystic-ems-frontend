import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Tooltip,
} from "@mui/material";

import {
  Add,
  Search,
  Edit,
  Visibility,
  Laptop,
  Smartphone,
  Monitor,
  Keyboard,
  AssignmentReturn,
  Inventory2,
} from "@mui/icons-material";

const initialAssets = [
  {
    id: "AST-001",
    name: "Dell Laptop",
    category: "Laptop",
    brand: "Dell",
    model: "Latitude 5420",
    serialNumber: "DL5420-001",
    employeeName: "Rahul Sharma",
    employeeId: "EMP-001",
    issueDate: "2026-10-01",
    condition: "Good",
    status: "Assigned",
  },
  {
    id: "AST-002",
    name: "HP Monitor",
    category: "Monitor",
    brand: "HP",
    model: "P22 G5",
    serialNumber: "HP22-002",
    employeeName: "Priya Singh",
    employeeId: "EMP-002",
    issueDate: "2026-10-05",
    condition: "New",
    status: "Assigned",
  },
  {
    id: "AST-003",
    name: "Samsung Mobile",
    category: "Mobile",
    brand: "Samsung",
    model: "Galaxy A55",
    serialNumber: "SAM-A55-003",
    employeeName: "-",
    employeeId: "-",
    issueDate: "-",
    condition: "New",
    status: "Available",
  },
];

const emptyForm = {
  name: "",
  category: "",
  brand: "",
  model: "",
  serialNumber: "",
  employeeName: "",
  employeeId: "",
  issueDate: "",
  condition: "New",
};

const Asset = () => {
  const [assets, setAssets] = useState(initialAssets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewAsset, setViewAsset] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const searchValue = search.toLowerCase();

      const matchesSearch = [
        asset.id,
        asset.name,
        asset.category,
        asset.employeeName,
        asset.serialNumber,
      ].some((value) => value.toLowerCase().includes(searchValue));

      const matchesStatus =
        statusFilter === "All" || asset.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [assets, search, statusFilter]);

  const totalAssets = assets.length;
  const assignedAssets = assets.filter(
    (asset) => asset.status === "Assigned",
  ).length;
  const availableAssets = assets.filter(
    (asset) => asset.status === "Available",
  ).length;
  const repairAssets = assets.filter(
    (asset) => asset.status === "Under Repair",
  ).length;

  const handleAddAsset = () => {
    setSelectedAsset(null);
    setForm(emptyForm);
    setOpenDialog(true);
  };

  const handleEditAsset = (asset) => {
    setSelectedAsset(asset);
    setForm({
      name: asset.name,
      category: asset.category,
      brand: asset.brand,
      model: asset.model,
      serialNumber: asset.serialNumber,
      employeeName: asset.employeeName === "-" ? "" : asset.employeeName,
      employeeId: asset.employeeId === "-" ? "" : asset.employeeId,
      issueDate: asset.issueDate === "-" ? "" : asset.issueDate,
      condition: asset.condition,
    });
    setOpenDialog(true);
  };

  const handleSaveAsset = () => {
    if (!form.name.trim() || !form.category || !form.serialNumber.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    if (selectedAsset) {
      setAssets((previous) =>
        previous.map((asset) =>
          asset.id === selectedAsset.id
            ? {
                ...asset,
                ...form,
                status: form.employeeId ? "Assigned" : "Available",
                employeeName: form.employeeName || "-",
                employeeId: form.employeeId || "-",
                issueDate: form.issueDate || "-",
              }
            : asset,
        ),
      );
    } else {
      const newAsset = {
        id: `AST-${String(assets.length + 1).padStart(3, "0")}`,
        ...form,
        employeeName: form.employeeName || "-",
        employeeId: form.employeeId || "-",
        issueDate: form.issueDate || "-",
        status: form.employeeId ? "Assigned" : "Available",
      };

      setAssets((previous) => [...previous, newAsset]);
    }

    setOpenDialog(false);
    setForm(emptyForm);
    setSelectedAsset(null);
  };

  const handleReturnAsset = (assetId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this asset as returned?",
    );

    if (!confirmed) return;

    setAssets((previous) =>
      previous.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              status: "Available",
              employeeName: "-",
              employeeId: "-",
              issueDate: "-",
            }
          : asset,
      ),
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Assigned":
        return "primary";
      case "Available":
        return "success";
      case "Under Repair":
        return "warning";
      case "Retired":
        return "default";
      default:
        return "default";
    }
  };

  const getAssetIcon = (category) => {
    switch (category) {
      case "Laptop":
        return <Laptop />;
      case "Mobile":
        return <Smartphone />;
      case "Monitor":
        return <Monitor />;
      case "Keyboard":
        return <Keyboard />;
      default:
        return <Inventory2 />;
    }
  };

  const summaryCards = [
    {
      title: "Total Assets",
      value: totalAssets,
      icon: <Inventory2 />,
      color: "#2563eb",
    },
    {
      title: "Assigned Assets",
      value: assignedAssets,
      icon: <Laptop />,
      color: "#7c3aed",
    },
    {
      title: "Available Assets",
      value: availableAssets,
      icon: <AssignmentReturn />,
      color: "#16a34a",
    },
    {
      title: "Under Repair",
      value: repairAssets,
      icon: <Monitor />,
      color: "#ea580c",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Employee Assets
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Manage company assets and employee assignments
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddAsset}
        >
          Add New Asset
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {card.title}
                    </Typography>

                    <Typography variant="h4" fontWeight={700} mt={1}>
                      {card.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: `${card.color}15`,
                      color: card.color,
                      width: 46,
                      height: 46,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search asset, employee, serial number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Assigned">Assigned</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Under Repair">Under Repair</MenuItem>
                <MenuItem value="Retired">Retired</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Assets Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell>Asset</TableCell>
                  <TableCell>Asset ID</TableCell>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getAssetIcon(asset.category)}

                          <Box>
                            <Typography fontWeight={600}>
                              {asset.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {asset.brand} {asset.model}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>{asset.id}</TableCell>
                      <TableCell>{asset.serialNumber}</TableCell>
                      <TableCell>
                        {asset.employeeName}
                        {asset.employeeId !== "-" && (
                          <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            {asset.employeeId}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>{asset.issueDate}</TableCell>
                      <TableCell>{asset.condition}</TableCell>

                      <TableCell>
                        <Chip
                          label={asset.status}
                          color={getStatusColor(asset.status)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            onClick={() => setViewAsset(asset)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Asset">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditAsset(asset)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {asset.status === "Assigned" && (
                          <Tooltip title="Return Asset">
                            <IconButton
                              color="warning"
                              onClick={() => handleReturnAsset(asset.id)}
                            >
                              <AssignmentReturn fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No assets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Asset Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedAsset ? "Edit Asset" : "Add New Asset"}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Asset Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category *"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {[
                  "Laptop",
                  "Desktop",
                  "Mobile",
                  "Monitor",
                  "Keyboard",
                  "Mouse",
                  "ID Card",
                  "SIM Card",
                  "Vehicle",
                  "Other",
                ].map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Serial Number *"
                value={form.serialNumber}
                onChange={(e) =>
                  setForm({ ...form, serialNumber: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee Name"
                value={form.employeeName}
                onChange={(e) =>
                  setForm({ ...form, employeeName: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={form.employeeId}
                onChange={(e) =>
                  setForm({ ...form, employeeId: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Issue Date"
                InputLabelProps={{ shrink: true }}
                value={form.issueDate}
                onChange={(e) =>
                  setForm({ ...form, issueDate: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Condition"
                value={form.condition}
                onChange={(e) =>
                  setForm({ ...form, condition: e.target.value })
                }
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Fair">Fair</MenuItem>
                <MenuItem value="Damaged">Damaged</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSaveAsset}>
            {selectedAsset ? "Update Asset" : "Save Asset"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Asset Dialog */}
      <Dialog
        open={Boolean(viewAsset)}
        onClose={() => setViewAsset(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Asset Details</DialogTitle>

        <DialogContent>
          {viewAsset && (
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Typography>
                <strong>Asset:</strong> {viewAsset.name}
              </Typography>
              <Typography>
                <strong>Asset ID:</strong> {viewAsset.id}
              </Typography>
              <Typography>
                <strong>Category:</strong> {viewAsset.category}
              </Typography>
              <Typography>
                <strong>Brand:</strong> {viewAsset.brand}
              </Typography>
              <Typography>
                <strong>Model:</strong> {viewAsset.model}
              </Typography>
              <Typography>
                <strong>Serial Number:</strong> {viewAsset.serialNumber}
              </Typography>
              <Typography>
                <strong>Employee:</strong> {viewAsset.employeeName}
              </Typography>
              <Typography>
                <strong>Employee ID:</strong> {viewAsset.employeeId}
              </Typography>
              <Typography>
                <strong>Issue Date:</strong> {viewAsset.issueDate}
              </Typography>
              <Typography>
                <strong>Condition:</strong> {viewAsset.condition}
              </Typography>
              <Typography>
                <strong>Status:</strong> {viewAsset.status}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setViewAsset(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Asset;
