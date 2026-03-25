// src/views/settings/department/DepartmentMember.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useError } from "../../../context/ErrorContext";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faTrash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;

const DepartmentMember = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useError();
  const [department, setDepartment] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  // Load department + members
  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/department/${id}`);
      setDepartment(res.data || null);
      setMembers(res.data?.members || []);
    } catch (err) {
      console.error(err);
      setError(t("departments.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line
  }, [id]);

  // Load users for add modal
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosClient.get("/api/users/without/departmemt");
      setAllUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  // Search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => {
      const name = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
      const email = (m.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [members, query]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Add member
  const candidateUsers = useMemo(() => {
    const ids = new Set(members.map((m) => m.id));
    return allUsers.filter((u) => !ids.has(u.id));
  }, [members, allUsers]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/api/department/${id}/members/add`, {
        userId: selectedUserId,
      });
      setIsAddOpen(false);
      loadMembers();
      showSuccess(t("departments.member_added"));
    } catch (err) {
      console.error(err);
      showError(
        err?.response?.data?.message || err?.message ||
          t("departments.add_failed")
      );
    }
  };

  // Remove member
  const handleRemove = async (userId, name) => {
    if (!window.confirm(t("departments.remove_confirm", { name }))) return;
    try {
      await axiosClient.delete(`/api/department/${id}/members/${userId}remove`);
      setMembers((prev) => prev.filter((m) => m.id !== userId));
      showSuccess(t("departments.member_removed"));
    } catch (err) {
      console.error(err);
      showError(
        err?.response?.data?.message || err?.message ||
          t("departments.remove_failed")
      );
    }
  };

  if (loading)
    return <p className="text-sm text-slate-500">{t("departments.loading_members")}</p>;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faUsers} />
            {t("departments.members_title", { name: department?.name })}
          </h1>
          <p className="text-sm text-slate-500">
            {t("departments.members_desc")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={t("users.search_placeholder", "Search users...")}
              className="bg-transparent outline-none text-sm w-44"
            />
          </div>

          {/* Add */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            {t("departments.add_member")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">{t("departments.number")}</th>
                <th className="px-4 py-3">{t("departments.member_name")}</th>
                <th className="px-4 py-3">{t("users.email")}</th>
                <th className="px-4 py-3">{t("departments.job_title")}</th>
                <th className="px-4 py-3 text-right">{t("users.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                   <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("departments.no_members")}
                  </td>
                </tr>
              ) : (
                pageItems.map((m, index) => (
                  <tr
                    key={m.id}
                    className="transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {m.firstName} {m.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{m.email}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {m.jobTitle || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleRemove(m.id, `${m.firstName} ${m.lastName}`)
                          }
                          className="inline-flex items-center justify-center h-8 px-3 rounded-lg
                                   text-red-600 bg-red-50 hover:bg-red-100
                                   transition-colors text-xs font-medium"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-1" />
                          {t("common.delete", "Remove")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <span>
            {t("tickets.pagination_page", { current: page, total: totalPages })}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2 py-1 text-xs border border-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              {t("Student.previous")}
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 text-xs border border-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              {t("Student.next")}
            </button>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsAddOpen(false)}
          />
          <form
            onSubmit={handleAddMember}
            className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">{t("departments.add_member")}</h3>

            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm"
              required
            >
              <option value="">{t("departments.select_user")}</option>
              {loadingUsers ? (
                <option disabled>{t("common.loading")}</option>
              ) : (
                candidateUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} — {u.email}
                  </option>
                ))
              )}
            </select>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 border rounded-xl text-sm"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
              >
                {t("departments.add_member", "Add")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DepartmentMember;
