import { useState } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
  Stack,
  Alert,
} from "@mui/material";

import {
  Person,
  Email,
  Phone,
  Business,
  Work,
  Edit,
  Save,
  Cancel,
  Badge,
  CalendarMonth,
  LocationOn,
  AccountCircle,
} from "@mui/icons-material";

// ======================================================
// THEME COLORS
// ======================================================

const COLORS = {
  darkGreen: "#0B403C",
  teal: "#0F887D",
  lightMint: "#F0F8F6",
  border: "#DCEBE7",
  text: "#24433F",
  muted: "#718783",
  white: "#FFFFFF",
};

// ======================================================
// SAFE VALUE CONVERSION
// ======================================================

const safeText = (value) => {
  if (value === null || value === undefined) return "";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(safeText).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    const displayValue =
      value.name ??
      value.title ??
      value.label ??
      value.value ??
      value.firstName;

    if (displayValue !== undefined) {
      return safeText(displayValue);
    }

    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }

  return "";
};

// ======================================================
// GET LOGGED-IN USER
// ======================================================

const getLoggedInUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return {};

    const parsedUser = JSON.parse(storedUser);

    if (
      !parsedUser ||
      typeof parsedUser !== "object" ||
      Array.isArray(parsedUser)
    ) {
      return {};
    }

    return parsedUser;
  } catch {
    return {};
  }
};

// ======================================================
// REUSABLE SECTION HEADING
// ======================================================

const SectionHeading = ({ icon, title, subtitle }) => (
  <Box sx={{ mb: 3 }}>
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: COLORS.lightMint,
          color: COLORS.teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography fontWeight={700} color={COLORS.darkGreen} fontSize={17}>
          {title}
        </Typography>

        {subtitle && (
          <Typography fontSize={12} color={COLORS.muted}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Box>
);

// ======================================================
// PROFILE COMPONENT
// ======================================================

const MyProfile = () => {
  const loggedInUser = getLoggedInUser();

  const initialProfile = {
    employeeId: safeText(loggedInUser.employeeId),
    firstName: safeText(loggedInUser.firstName),
    lastName: safeText(loggedInUser.lastName),
    email: safeText(loggedInUser.email),
    phone: safeText(loggedInUser.phone),
    department: safeText(loggedInUser.department),
    designation: safeText(loggedInUser.designation),
    joiningDate: safeText(loggedInUser.joiningDate).slice(0, 10),
    employmentType: safeText(loggedInUser.employmentType),
    reportingManager: safeText(loggedInUser.reportingManager),
    address: safeText(loggedInUser.address),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const accountStatus = safeText(loggedInUser.accountStatus) || "Unknown";

  const normalizedStatus = accountStatus.toLowerCase();

  const statusColor =
    normalizedStatus === "approved"
      ? "success"
      : normalizedStatus === "pending"
        ? "warning"
        : "default";

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Employee";

  const initials =
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase() || "E";

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  const handleSave = () => {
    try {
      const updatedUser = {
        ...loggedInUser,
        ...profile,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setOriginalProfile({ ...profile });
      setIsEditing(false);
      setSuccess("Your profile has been updated successfully.");
      setError("");
    } catch {
      setError("Unable to save profile. Please try again.");
      setSuccess("");
    }
  };

  // ======================================================
  // CANCEL EDITING
  // ======================================================

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
    setSuccess("");
    setError("");
  };

  // ======================================================
  // PROFILE FIELDS
  // ======================================================

  const personalFields = [
    { label: "First Name", name: "firstName" },
    { label: "Last Name", name: "lastName" },
    { label: "Email Address", name: "email", type: "email" },
    { label: "Phone Number", name: "phone" },
    { label: "Address", name: "address", multiline: true },
  ];

  const employmentFields = [
    { label: "Employee ID", name: "employeeId" },
    { label: "Department", name: "department" },
    { label: "Designation", name: "designation" },
    { label: "Joining Date", name: "joiningDate", type: "date" },
    { label: "Employment Type", name: "employmentType" },
    { label: "Reporting Manager", name: "reportingManager" },
  ];

  // ======================================================
  // COMMON FIELD STYLE
  // ======================================================

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: isEditing ? COLORS.white : "#F8FBFA",
      "& fieldset": {
        borderColor: COLORS.border,
      },
      "&:hover fieldset": {
        borderColor: COLORS.teal,
      },
      "&.Mui-focused fieldset": {
        borderColor: COLORS.teal,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: COLORS.teal,
    },
  };

  const renderFields = (fields) =>
    fields.map((field) => (
      <Grid item xs={12} sm={6} key={field.name}>
        <TextField
          fullWidth
          label={field.label}
          name={field.name}
          value={profile[field.name]}
          onChange={handleChange}
          disabled={!isEditing}
          size="small"
          type={field.type || "text"}
          multiline={field.multiline || false}
          minRows={field.multiline ? 2 : undefined}
          InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
          sx={textFieldStyle}
        />
      </Grid>
    ));

  // ======================================================
  // UI
  // ======================================================

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        color: COLORS.text,
      }}
    >
      {/* PAGE HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color={COLORS.darkGreen}>
            My Profile
          </Typography>

          <Typography color={COLORS.muted} fontSize={13} mt={0.5}>
            View and manage your personal and employment information.
          </Typography>
        </Box>

        {!isEditing ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => {
              setSuccess("");
              setError("");
              setIsEditing(true);
            }}
            sx={{
              bgcolor: COLORS.darkGreen,
              borderRadius: 2,
              px: 2.5,
              py: 1,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                bgcolor: COLORS.teal,
              },
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              sx={{
                borderColor: COLORS.border,
                color: COLORS.darkGreen,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  borderColor: COLORS.teal,
                  bgcolor: COLORS.lightMint,
                },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{
                bgcolor: COLORS.teal,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  bgcolor: COLORS.darkGreen,
                },
              }}
            >
              Save Changes
            </Button>
          </Stack>
        )}
      </Box>

      {/* ALERT MESSAGES */}

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* LEFT PROFILE CARD */}

        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: COLORS.white,
            }}
          >
            {/* GREEN PROFILE HEADER */}

            <Box
              sx={{
                height: 115,
                background: `linear-gradient(120deg, ${COLORS.darkGreen}, ${COLORS.teal})`,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  border: "25px solid rgba(255,255,255,0.07)",
                  right: -35,
                  top: -65,
                }}
              />
            </Box>

            <CardContent
              sx={{
                textAlign: "center",
                px: 3,
                pb: 3,
                mt: -7,
                position: "relative",
              }}
            >
              <Avatar
                sx={{
                  width: 105,
                  height: 105,
                  mx: "auto",
                  mb: 1.5,
                  bgcolor: COLORS.lightMint,
                  color: COLORS.darkGreen,
                  fontSize: 34,
                  fontWeight: 800,
                  border: `5px solid ${COLORS.white}`,
                  boxShadow: "0 3px 12px rgba(11,64,60,0.12)",
                }}
              >
                {initials}
              </Avatar>

              <Typography
                variant="h6"
                fontWeight={800}
                color={COLORS.darkGreen}
              >
                {fullName}
              </Typography>

              <Typography color={COLORS.muted} fontSize={13} mb={1.5}>
                {profile.designation || "Employee"}
              </Typography>

              <Chip
                label={
                  normalizedStatus === "approved"
                    ? "Active Employee"
                    : normalizedStatus === "pending"
                      ? "Pending Approval"
                      : accountStatus
                }
                color={statusColor}
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: 1.5,
                }}
              />

              <Divider sx={{ my: 3, borderColor: COLORS.border }} />

              {/* PROFILE QUICK DETAILS */}

              <Stack spacing={2.2} textAlign="left">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      bgcolor: COLORS.lightMint,
                      color: COLORS.teal,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Badge fontSize="small" />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontSize={11} color={COLORS.muted}>
                      Employee ID
                    </Typography>
                    <Typography fontWeight={700} fontSize={13}>
                      {profile.employeeId || "-"}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      bgcolor: COLORS.lightMint,
                      color: COLORS.teal,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Email fontSize="small" />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontSize={11} color={COLORS.muted}>
                      Email Address
                    </Typography>
                    <Typography
                      fontWeight={700}
                      fontSize={13}
                      sx={{ wordBreak: "break-word" }}
                    >
                      {profile.email || "-"}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      bgcolor: COLORS.lightMint,
                      color: COLORS.teal,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Phone fontSize="small" />
                  </Box>

                  <Box>
                    <Typography fontSize={11} color={COLORS.muted}>
                      Phone Number
                    </Typography>
                    <Typography fontWeight={700} fontSize={13}>
                      {profile.phone || "-"}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      bgcolor: COLORS.lightMint,
                      color: COLORS.teal,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Business fontSize="small" />
                  </Box>

                  <Box>
                    <Typography fontSize={11} color={COLORS.muted}>
                      Department
                    </Typography>
                    <Typography fontWeight={700} fontSize={13}>
                      {profile.department || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT PROFILE DETAILS */}

        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* PERSONAL INFORMATION */}

            <Card
              elevation={0}
              sx={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <SectionHeading
                  icon={<Person />}
                  title="Personal Information"
                  subtitle="Your basic personal and contact details"
                />

                <Grid container spacing={2.5}>
                  {renderFields(personalFields)}
                </Grid>
              </CardContent>
            </Card>

            {/* EMPLOYMENT INFORMATION */}

            <Card
              elevation={0}
              sx={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <SectionHeading
                  icon={<Work />}
                  title="Employment Information"
                  subtitle="Your job and company-related details"
                />

                <Grid container spacing={2.5}>
                  {renderFields(employmentFields)}
                </Grid>
              </CardContent>
            </Card>

            {/* PROFILE INFORMATION NOTE */}

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 2,
                borderRadius: 2,
                bgcolor: COLORS.lightMint,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <AccountCircle sx={{ color: COLORS.teal, mt: 0.2 }} />

              <Box>
                <Typography
                  fontWeight={700}
                  fontSize={13}
                  color={COLORS.darkGreen}
                >
                  Keep your profile updated
                </Typography>

                <Typography fontSize={12} color={COLORS.muted} mt={0.3}>
                  Make sure your contact and employment information is correct
                  so your organization can reach you when needed.
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyProfile;
