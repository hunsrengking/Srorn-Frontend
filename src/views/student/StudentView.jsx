import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faEye,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import studentService from "@/services/studentService";
import { formatDate } from "@/utils/formatdate";
import { hasPermission } from "../../utils/permission";

const StudentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStudent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await studentService.getStudent(id);
      setStudent(res.data || null);
    } catch (err) {
      console.error("Error loading student:", err);
      setError("Failed to load student.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  if (loading) {
    return <div className="text-sm text-slate-500">Loading student...</div>;
  }

  if (error || !student) {
    return (
      <div className="text-sm text-red-500">
        {error || "Student not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm
                   flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faEye} />
            Student Details
          </h1>
          <p className="text-sm text-slate-500">
            View student profile, status, and position information.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate("/students")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm
                       border border-slate-200 rounded-xl text-slate-600
                       hover:bg-slate-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>

          {hasPermission("UPDATE_STUDENTS") && (
            <button
              onClick={() => navigate(`/students/${id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm
                         bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div
              className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600
                         flex items-center justify-center text-3xl"
            >
              <FontAwesomeIcon icon={faUserGraduate} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {student.display_name ||
                `${student.firstname || ""} ${student.lastname || ""}`.trim() ||
                "-"}
            </h2>
            <p className="text-sm text-slate-500">
              {student.position_name || "Student"}
            </p>
            <span
              className={`mt-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${student.is_active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-red-50 text-red-700 border border-red-100"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5
                  ${student.is_active ? "bg-emerald-500" : "bg-red-500"}`}
              />
              {student.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <Info label="Student ID" value={student.id} />
            <Info label="Position" value={student.position_name} />
            <Info label="First Name" value={student.firstname} />
            <Info label="Last Name" value={student.lastname} />
            <Info label="Khmer First Name" value={student.khmer_firstname} />
            <Info label="Khmer Last Name" value={student.khmer_lastname} />
            <Info label="Created At" value={formatDate(student.created_at)} />
            <Info label="Updated At" value={formatDate(student.updated_at)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-slate-900">{value || "-"}</p>
  </div>
);

export default StudentView;
