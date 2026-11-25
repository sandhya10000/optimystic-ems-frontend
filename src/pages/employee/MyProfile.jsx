import { useState, useEffect } from "react";
import { authService, employeeAPI } from "../../services/authService";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
};

const MyProfile = () => {
  const [formData, setFormData] = useState(initialForm);
  const [profileData, setProfileData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Convert date for HTML date input
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toISOString().split("T")[0];
  };

  // Fetch logged-in employee profile
  const fetchEmployeeProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await employeeAPI.getMyProfile();

      console.log("Complete Profile Response:", response);

      // Handle different possible API response structures
      const user =
        response?.user ||
        response?.profile ||
        response?.data?.user ||
        response?.data?.profile ||
        response?.data;

      console.log("Fetched User:", user);

      if (!user || typeof user !== "object") {
        throw new Error("Employee profile data not found.");
      }

      // Save profile data for UI
      setProfileData(user);

      // Check profile completion
      if (user.profileCompleted === true) {
        setSubmitted(true);
      } else {
        setSubmitted(false);
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to fetch employee profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("Please enter your first name.");
      return false;
    }

    if (!formData.lastName.trim()) {
      setError("Please enter your last name.");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (
      formData.emergencyContactNumber &&
      !/^[6-9]\d{9}$/.test(formData.emergencyContactNumber.trim())
    ) {
      setError("Please enter a valid emergency contact number.");
      return false;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setError("Please enter a valid 6-digit PIN code.");
      return false;
    }

    return true;
  };

  // Submit employee profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const profileDetails = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactNumber: formData.emergencyContactNumber.trim(),
      };

      // Submit profile
      const submitResponse = await employeeAPI.completeProfile(profileDetails);

      console.log("PUT API RESPONSE:", submitResponse);

      // Fetch updated profile from GET API
      const profileResponse = await employeeAPI.getMyProfile();

      console.log("GET API RESPONSE:", profileResponse);

      const user =
        profileResponse?.user ||
        profileResponse?.profile ||
        profileResponse?.data?.user ||
        profileResponse?.data?.profile ||
        profileResponse?.data ||
        profileResponse;

      if (!user?._id) {
        throw new Error("Unable to load updated employee profile.");
      }

      setProfileData(user);
      setSubmitted(user.profileCompleted === true);

      if (user.profileCompleted) {
        setSuccess("Your profile has been submitted successfully.");
      } else {
        setError(
          "Profile submission could not be confirmed. Please refresh and check.",
        );
      }
    } catch (error) {
      console.error("Profile Submission Error:", error);
      console.error("Backend Error:", error.response?.data);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to submit your profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Reusable form field
  const renderField = (label, name, options = {}) => (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        size="small"
        label={label}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        required={options.required ?? false}
        type={options.type || "text"}
        select={Boolean(options.select)}
        multiline={Boolean(options.multiline)}
        rows={options.rows || 1}
        autoComplete="off"
        inputProps={options.inputProps}
        InputLabelProps={options.type === "date" ? { shrink: true } : undefined}
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: "#0e8278",
            borderWidth: 2,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#0e8278",
          },
        }}
      >
        {options.options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );

  // Read-only profile field
  const showProfileField = (label, value) => (
    <Grid item xs={12} sm={6}>
      <Box
        sx={{
          p: 1.5,
          border: "1px solid #dce8e7",
          borderRadius: 2,
          minHeight: 65,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>

        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            color: "#103f3d",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {value || "Not provided"}
        </Typography>
      </Box>
    </Grid>
  );

  const getGender = (value) => {
    const options = {
      male: "Male",
      female: "Female",
      other: "Other",
      prefer_not_to_say: "Prefer not to say",
    };

    return options[value] || value;
  };

  const getMaritalStatus = (value) => {
    const options = {
      single: "Single",
      married: "Married",
      other: "Other",
    };

    return options[value] || value;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f1f8f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "850px",
          mx: "auto",
          p: { xs: 2.5, sm: 4 },
          border: "1px solid #dce8e7",
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(11, 64, 61, 0.08)",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 2,
              bgcolor: "#0b403d",
              color: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              fontSize: 19,
              fontWeight: 800,
            }}
          >
            EMS
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: "#103f3d",
              fontSize: { xs: 25, sm: 32 },
            }}
          >
            My Profile
          </Typography>

          <Typography color="text.secondary" mt={1}>
            {submitted
              ? "Your employee profile information"
              : "Complete your employee profile information"}
          </Typography>

          <Box
            sx={{
              width: 55,
              height: 4,
              bgcolor: "#f59e0b",
              borderRadius: 5,
              mx: "auto",
              mt: 2,
            }}
          />
        </Box>

        {/* Loading */}
        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={5}
          >
            <CircularProgress sx={{ color: "#0e8278" }} />
          </Box>
        )}

        {!loading && (
          <>
            {/* Messages */}
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

            {/* Completed Profile - Read Only */}
            {submitted ? (
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                  mb={3}
                >
                  <Typography variant="h6" fontWeight={800} color="#0b403d">
                    Employee Profile Details
                  </Typography>

                  <Chip
                    label="Profile Completed"
                    color="success"
                    variant="outlined"
                  />
                </Box>

                {/* Employee Information */}
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#0b403d"
                  mb={2}
                >
                  1. Personal Information
                </Typography>

                <Grid container spacing={2}>
                  {showProfileField("First Name", profileData?.firstName)}

                  {showProfileField("Last Name", profileData?.lastName)}

                  {showProfileField("Employee ID", profileData?.employeeId)}

                  {showProfileField("Email Address", profileData?.email)}

                  {showProfileField(
                    "Date of Birth",
                    profileData?.dateOfBirth
                      ? formatDate(profileData.dateOfBirth)
                      : "",
                  )}

                  {showProfileField("Gender", getGender(profileData?.gender))}

                  {showProfileField(
                    "Marital Status",
                    getMaritalStatus(profileData?.maritalStatus),
                  )}
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

                {/* Contact Information */}
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#0b403d"
                  mb={2}
                >
                  2. Contact Information
                </Typography>

                <Grid container spacing={2}>
                  {showProfileField("Mobile Number", profileData?.phone)}

                  {showProfileField("City", profileData?.city)}

                  {showProfileField("State", profileData?.state)}

                  {showProfileField("PIN Code", profileData?.pincode)}

                  {showProfileField("Complete Address", profileData?.address)}
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

                {/* Emergency Contact */}
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#0b403d"
                  mb={2}
                >
                  3. Emergency Contact
                </Typography>

                <Grid container spacing={2}>
                  {showProfileField(
                    "Contact Person Name",
                    profileData?.emergencyContactName,
                  )}

                  {showProfileField(
                    "Emergency Mobile Number",
                    profileData?.emergencyContactNumber,
                  )}
                </Grid>

                <Alert severity="success" sx={{ mt: 3 }}>
                  Your profile has been successfully completed.
                </Alert>
              </Box>
            ) : (
              /* Profile Completion Form */
              <Box component="form" onSubmit={handleSubmit}>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#0b403d"
                  mb={2}
                >
                  1. Personal Information
                </Typography>

                <Grid container spacing={2}>
                  {renderField("First Name", "firstName", {
                    required: true,
                  })}

                  {renderField("Last Name", "lastName", {
                    required: true,
                  })}

                  {renderField("Date of Birth", "dateOfBirth", {
                    type: "date",
                    required: true,
                  })}

                  {renderField("Gender", "gender", {
                    select: true,
                    required: true,
                    options: [
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                      {
                        value: "prefer_not_to_say",
                        label: "Prefer not to say",
                      },
                    ],
                  })}

                  {renderField("Marital Status", "maritalStatus", {
                    select: true,
                    options: [
                      { value: "single", label: "Single" },
                      { value: "married", label: "Married" },
                      { value: "other", label: "Other" },
                    ],
                  })}
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#0b403d"
                  mb={2}
                >
                  2. Contact Information
                </Typography>

                <Grid container spacing={2}>
                  {renderField("Email Address", "email", {
                    type: "email",
                  })}

                  {renderField("Mobile Number", "phone", {
                    required: true,
                    inputProps: { maxLength: 10 },
                  })}

                  {renderField("Complete Address", "address", {
                    required: true,
                    multiline: true,
                    rows: 2,
                  })}

                  {renderField("City", "city", {
                    required: true,
                  })}

                  {renderField("State", "state", {
                    required: true,
                  })}

                  {renderField("PIN Code", "pincode", {
                    required: true,
                    inputProps: { maxLength: 6 },
                  })}
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#0b403d"
                  mb={2}
                >
                  3. Emergency Contact
                </Typography>

                <Grid container spacing={2}>
                  {renderField("Contact Person Name", "emergencyContactName")}

                  {renderField(
                    "Emergency Mobile Number",
                    "emergencyContactNumber",
                    {
                      inputProps: { maxLength: 10 },
                    },
                  )}
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#dce8e7" }} />

                <Alert severity="info" sx={{ mb: 2 }}>
                  Please verify all your details before submitting your profile.
                </Alert>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    bgcolor: "#0e8278",
                    color: "#ffffff",
                    borderRadius: 2,
                    fontWeight: 800,
                    fontSize: 15,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "#096c64",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit Profile"
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MyProfile;
