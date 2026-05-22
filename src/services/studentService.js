import axiosClient from "@/api/axiosClient";

export const studentService = {
  getAllStudents: (params) => axiosClient.get("/students", { params }),

  getStudents: (params) => axiosClient.get("/students", { params }),

  getStudentById: (id) => axiosClient.get(`/students/${id}`),

  getStudent: (id) => axiosClient.get(`/students/${id}`),

  createStudent: (studentData) => axiosClient.post("/students", studentData),

  updateStudent: (id, studentData) =>
    axiosClient.put(`/students/${id}`, studentData),

  deleteStudent: (id) => axiosClient.delete(`/students/${id}`),
};

export default studentService;
