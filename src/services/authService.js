import axios from "axios";

// ======================================================
// API CONFIGURATION
// ======================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// COMMON ERROR HANDLER
// ======================================================

const getErrorMessage = (error, fallbackMessage) => {
  const serverMessage = error?.response?.data?.message;

  if (typeof serverMessage === "string" && serverMessage.trim()) {
    return serverMessage;
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
};

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;
    const errorCode = error?.response?.data?.code;

    // Unauthorized
    if (status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // Account deactivated
    if (status === 403 && errorCode === "ACCOUNT_DEACTIVATED") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  },
);

// ======================================================
// AUTH SERVICE
// ======================================================

export const authService = {
  // ========================================
  // EMPLOYEE REGISTRATION
  // POST /api/auth/register
  // ========================================

  registerEmployee: async (registrationData) => {
    try {
      const response = await api.post("/auth/register", registrationData);

      return response.data;
    } catch (error) {
      console.log("Registration API Status:", error?.response?.status);

      throw new Error(getErrorMessage(error, "Registration failed."));
    }
  },

  // ========================================
  // EMPLOYEE LOGIN
  // POST /api/auth/login
  // ========================================

  loginUser: async (loginData) => {
    try {
      const response = await api.post("/auth/login", loginData);

      const data = response.data;

      // Validate response before saving session
      if (
        data?.success === true &&
        typeof data?.token === "string" &&
        data.token.trim() &&
        data?.user &&
        typeof data.user === "object" &&
        !Array.isArray(data.user)
      ) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.log("Login API Status:", error?.response?.status);

      throw new Error(getErrorMessage(error, "Login failed."));
    }
  },

  // ========================================
  // EMPLOYEE APPROVAL
  // PATCH /api/auth/employees/:id/approval
  // ========================================

  updateEmployeeApproval: async (id, status) => {
    try {
      const response = await api.patch(`/auth/employees/${id}/approval`, {
        status,
      });

      return response.data;
    } catch (error) {
      console.log("Approval API Status:", error?.response?.status);

      throw new Error(getErrorMessage(error, "Approval update failed."));
    }
  },

  // ========================================
  // GET EMPLOYEE PROFILE
  // GET /api/auth/profile
  // ========================================

  getEmployeeProfile: async () => {
    try {
      const response = await api.get("/auth/profile");

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to fetch employee profile."),
      );
    }
  },

  // ========================================
  // LOGOUT
  // POST /api/auth/logout
  // ========================================

  logoutUser: async () => {
    try {
      const response = await api.post("/auth/logout");

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Logout failed."));
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};

export const adminAPI = {
  // ========================================
  // ADMIN APIs
  // ========================================

  // GET ADMIN DASHBOARD DATA
  getAdminDashboard: async () => {
    try {
      const response = await api.get("/admin/dashboard");
      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to fetch admin dashboard."),
      );
    }
  },

  // ADMIN GET ALL EMPLOYEES
  getAllEmployees: async () => {
    try {
      const response = await api.get("/admin/getAllEmployees");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to fetch employees."));
    }
  },

  // GET EMPLOYEE BY ID
  getEmployeeBy: async (id) => {
    try {
      const response = await api.get(`/admin/getEmployeeBy/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to fetch employee details."),
      );
    }
  },

  // UPDATE EMPLOYEE
  updateEmployee: async (id) => {
    try {
      const response = await api.get(`/admin/updateEmployee/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to update employee."));
    }
  },

  // GENERATE SALARY SLIP
  generateSalarySlip: async (salaryData) => {
    try {
      const response = await api.post(
        "/admin/salary-slips/generate",
        salaryData,
      );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to generate salary slip."),
      );
    }
  },
  // GET ALL ATTENDANCE data
  getAllAttendance: async () => {
    try {
      const response = await api.get("/admin/attendance/getAllAttendance");
      console.log(response, "response get all attendence");
      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to generate salary slip."),
      );
    }
  },
};

export const employeeAPI = {
  // ========================================
  // EMPLOYEE APIs
  // ========================================

  // GET EMPLOYEE DASHBOARD
  getEmployeeDashboard: async () => {
    try {
      const response = await api.get("/employee/dashboard");
      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to fetch employee dashboard."),
      );
    }
  },

  // GET TODAY'S ATTENDANCE
  getTodayAttendance: async () => {
    try {
      const response = await api.get("/employee/attendance/today");
      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to fetch today's attendance."),
      );
    }
  },

  // GET MONTHLY ATTENDANCE
  getMyAttendance: async (month) => {
    try {
      const response = await api.get("/employee/attendance/my", {
        params: { month },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to fetch attendance history."),
      );
    }
  },

  // EMPLOYEE CHECK-IN
  employeeCheckIn: async () => {
    try {
      const response = await api.post("/employee/attendance/check-in");

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Check-in failed."));
    }
  },

  // EMPLOYEE CHECK-OUT
  employeeCheckOut: async () => {
    try {
      const response = await api.post("/employee/attendance/check-out");

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Check-out failed."));
    }
  },
};
export const salarySlipAPI = {
  // ========================================
  // SALARY SLIP APIs
  // ========================================

  // GET ALL SALARY SLIPS
  getSalarySlips: async () => {
    try {
      const response = await api.get("/salary-slips");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to fetch salary slips."));
    }
  },

  // GET SALARY SLIP BY ID
  getSalarySlipById: async (id) => {
    try {
      const response = await api.get(`/salary-slips/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to fetch salary slip."));
    }
  },

  // GENERATE SALARY SLIP
  generateSalarySlipRecord: async (salaryData) => {
    try {
      const response = await api.post("/salary-slips/generate", salaryData);

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to generate salary slip."),
      );
    }
  },

  // UPDATE SALARY SLIP
  updateSalarySlip: async (id, salaryData) => {
    try {
      const response = await api.put(`/salary-slips/${id}`, salaryData);

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to update salary slip."));
    }
  },

  // DOWNLOAD SALARY SLIP PDF
  downloadSalarySlipPDF: async (id) => {
    try {
      const response = await api.get(`/salary-slips/${id}/pdf`, {
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to download salary slip PDF."),
      );
    }
  },

  // DELETE SALARY SLIP
  deleteSalarySlip: async (id) => {
    try {
      const response = await api.delete(`/salary-slips/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to delete salary slip."));
    }
  },
};
