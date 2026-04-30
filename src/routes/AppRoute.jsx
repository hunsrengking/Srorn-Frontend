import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Layout from "../layouts/Layout";
import { AuthProvider } from "../auth/auth";

import ProtectedRoute from "./ProtectedRoute";
import RequirePermission from "./RequirePermission";

import Loading from "../components/common/Loanding";
import GlobalLoading from "../components/common/GlobalLoading";
import { useLoading } from "../context/LoadingContext";

import CreateTicket from "../views/tickets/CreateTicket";
import TicketChecker from "../views/setting/checker/Checker";
import TicketCheckerView from "../views/setting/checker/CheckerView";
import DepartmentList from "../views/setting/department/Department";
import DepartmentCreate from "../views/setting/department/CreateDepartment";
import Telegram from "../views/setting/configuration/Telegram";
import GeneralSettings from "../views/setting/configuration/GeneralSettings";
import DepartmentMember from "../views/setting/department/DepartmentMember";
import Report from "../views/report/Report";
import Position from "../views/setting/positions/Positions";
import Organization from "../views/organization/Organization";
import PrintCard from "../views/organization/card/PrintCard";
import PrintCardNew from "../views/organization/card/PrintCardNew";
import PrintCardView from "../views/organization/card/PrintCardView";
import PrintCardEdit from "../views/organization/card/PrintCardEdit";

/* ---------- Lazy-loaded pages ---------- */
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const Users = lazy(() => import("../views/user/User"));
const Settings = lazy(() => import("../views/setting/Settings"));

const RolePermission = lazy(
  () => import("../views/setting/roles/RolePermission"),
);
const RoleCreate = lazy(() => import("../views/setting/roles/RoleCreate"));
const RoleList = lazy(() => import("../views/setting/roles/RoleList"));

const Login = lazy(() => import("../views/auth/Login"));

const UserCreate = lazy(() => import("../views/user/UserCreate"));
const UserEdit = lazy(() => import("../views/user/UserEdit"));
const UsersView = lazy(() => import("../views/user/UserView"));

const NoPermission = lazy(() => import("../views/errors/NoPermission"));

const Ticket = lazy(() => import("../views/tickets/Ticket"));
const ViewTicket = lazy(() => import("../views/tickets/ViewTicket"));

const Students = lazy(() => import("../views/student/Student"));
const StudentCreate = lazy(() => import("../views/student/StudentCreate"));
const StudentEdit = lazy(() => import("../views/student/StudentEdit"));
const Inventory = lazy(() => import("../views/Inventory/Inventory"));
const Product = lazy(() => import("../views/Inventory/product/Product"));
const ProductCreate = lazy(() => import("../views/Inventory/product/ProductCreate"));
const ProductEdit = lazy(() => import("../views/Inventory/product/ProductEdit"));
const Stock = lazy(() => import("../views/Inventory/stock/Stock"));
const StockAdjust = lazy(() => import("../views/Inventory/stock/StockAdjust"));
const Asset = lazy(() => import("../views/Inventory/asset/Asset"));
const AssetCreate = lazy(() => import("../views/Inventory/asset/AssetCreate"));
const AssetEdit = lazy(() => import("../views/Inventory/asset/AssetEdit"));
const AssetView = lazy(() => import("../views/Inventory/asset/AssetView"));
const Office = lazy(() => import("../views/organization/office/Office"));
const OfficeCreate = lazy(() => import("../views/organization/office/OfficeCreate"));
const OfficeEdit = lazy(() => import("../views/organization/office/OfficeEdit"));
const OfficeView = lazy(() => import("../views/organization/office/ViewOffice"));
const Staff = lazy(() => import("../views/setting/staff/Staff"));
const StaffCreate = lazy(() => import("../views/setting/staff/StaffCreate"));
const StaffEdit = lazy(() => import("../views/setting/staff/StaffEdit"));
const StaffView = lazy(() => import("../views/setting/staff/ViewStaff"));

/* ---------- Global loading helper ---------- */
const GlobalLoaderFix = ({ children }) => {
  const { loading } = useLoading();
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && loading && <GlobalLoading />}
      {children}
    </>
  );
};

const AppRoute = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalLoaderFix>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* -------- Public -------- */}
              <Route path="/login" element={<Login />} />
              <Route path="/403" element={<NoPermission />} />

              {/* -------- Protected -------- */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <RequirePermission perm="VIEW_DASHBOARD">
                      <Dashboard />
                    </RequirePermission>
                  }
                />

                <Route
                  path="dashboard"
                  element={
                    <RequirePermission perm="VIEW_DASHBOARD">
                      <Dashboard />
                    </RequirePermission>
                  }
                />

                <Route
                  path="ticket"
                  element={
                    <RequirePermission perm="VIEW_TICKET">
                      <Ticket />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/ticket/create"
                  element={
                    <RequirePermission perm="CREATE_TICKET">
                      <CreateTicket />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/ticket/views/:id"
                  element={
                    <RequirePermission perm="VIEW_TICKET">
                      <ViewTicket />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/checkermaker"
                  element={
                    <RequirePermission perm="MAKER_CHECKER">
                      <TicketChecker />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/checkermaker/view/:id"
                  element={
                    <RequirePermission perm="MAKER_CHECKER">
                      <TicketCheckerView />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/users"
                  element={
                    <RequirePermission perm="VIEW_USER">
                      <Users />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/users/create"
                  element={
                    <RequirePermission perm="CREATE_USER">
                      <UserCreate />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/users/:id/view"
                  element={
                    <RequirePermission perm="VIEW_USER">
                      <UsersView />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/users/:id/edit"
                  element={
                    <RequirePermission perm="UPDATE_USER">
                      <UserEdit />
                    </RequirePermission>
                  }
                />

                <Route
                  path="setting"
                  element={
                    <RequirePermission perm="VIEW_SETTING">
                      <Settings />
                    </RequirePermission>
                  }
                />

                <Route
                  path="settings/roles"
                  element={
                    <RequirePermission perm="VIEW_ROLES">
                      <RoleList />
                    </RequirePermission>
                  }
                />

                <Route
                  path="settings/roles/create"
                  element={
                    <RequirePermission perm="CREATE_ROLES">
                      <RoleCreate />
                    </RequirePermission>
                  }
                />

                <Route
                  path="settings/roles/:id/permissions"
                  element={
                    <RequirePermission perm="UPDATE_PERMISSIONS">
                      <RolePermission />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/departments"
                  element={
                    <RequirePermission perm="VIEW_DEPARTMENT">
                      <DepartmentList />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/department/create"
                  element={
                    <RequirePermission perm="CREATE_DEPARTMENT">
                      <DepartmentCreate />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/department/:id/members"
                  element={
                    <RequirePermission perm="VIEW_DEPARTMENT">
                      <DepartmentMember />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/telegram"
                  element={
                    <RequirePermission perm="UPDATE_PERMISSIONS">
                      <Telegram />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/settings/general"
                  element={
                    <RequirePermission perm="MANAGE_SYSTEM">
                      <GeneralSettings />
                    </RequirePermission>
                  }
                />
                <Route
                  path="settings/positions"
                  element={
                    <RequirePermission perm="UPDATE_PERMISSIONS">
                      <Position />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/employees"
                  element={
                    <RequirePermission perm="VIEW_STAFF">
                      <Staff />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/employees/create"
                  element={
                    <RequirePermission perm="CREATE_STAFF">
                      <StaffCreate />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/employees/:id/edit"
                  element={
                    <RequirePermission perm="UPDATE_STAFF">
                      <StaffEdit />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/employees/:id/view"
                  element={
                    <RequirePermission perm="VIEW_STAFF">
                      <StaffView />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/reports/summary"
                  element={
                    <RequirePermission perm="VIEW_REPORTS">
                      <Report />
                    </RequirePermission>
                  }
                />
                
                <Route
                  path="/organization"
                  element={
                    <RequirePermission perm="VIEW_ORGANIZATION">
                      <Organization />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/organization/office"
                  element={
                    <RequirePermission perm="VIEW_OFFICE">
                      <Office />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/organization/office/create"
                  element={
                    <RequirePermission perm="CREATE_OFFICE">
                      <OfficeCreate />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/organization/office/:id/edit"
                  element={
                    <RequirePermission perm="UPDATE_OFFICE">
                      <OfficeEdit />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/organization/office/:id/view"
                  element={
                    <RequirePermission perm="VIEW_OFFICE">
                      <OfficeView />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/organization/printcard"
                  element={
                    <RequirePermission perm="VIEW_ORGANIZATION">
                      <PrintCard />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/organization/printcard/newcard"
                  element={
                    <RequirePermission perm="VIEW_ORGANIZATION">
                      <PrintCardNew />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/organization/printcard/:id"
                  element={
                    <RequirePermission perm="VIEW_ORGANIZATION">
                      <PrintCardView />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/organization/printcard/:id/edit"
                  element={
                    <RequirePermission perm="VIEW_ORGANIZATION">
                      <PrintCardEdit />
                    </RequirePermission>
                  }
                />

                {/* student routes */}
                <Route
                  path="/students"
                  element={
                    <RequirePermission perm="VIEW_STUDENTS">
                      <Students />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/students/create"
                  element={
                    <RequirePermission perm="CREATE_STUDENTS">
                      <StudentCreate />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/students/:id/edit"
                  element={
                    <RequirePermission perm="UPDATE_STUDENTS">
                      <StudentEdit />
                    </RequirePermission>
                  }
                />
                {/* end student routes */}

                {/* inventory routes */}
                <Route
                  path="/inventory"
                  element={
                    <RequirePermission perm="VIEW_INVENTORY">
                      <Inventory />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/inventory/product"
                  element={
                    <RequirePermission perm="MANAGE_PRODUCT">
                      <Product />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/inventory/product/create"
                  element={
                    <RequirePermission perm="MANAGE_PRODUCT">
                      <ProductCreate />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/inventory/product/:id/edit"
                  element={
                    <RequirePermission perm="MANAGE_PRODUCT">
                      <ProductEdit />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/inventory/stock"
                  element={
                    <RequirePermission perm="MANAGE_STOCK">
                      <Stock />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/inventory/stock/adjust"
                  element={
                    <RequirePermission perm="MANAGE_STOCK">
                      <StockAdjust />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/inventory/asset"
                  element={
                    <RequirePermission perm="MANAGE_STOCK">
                      <Asset />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/inventory/asset/create"
                  element={
                    <RequirePermission perm="MANAGE_STOCK">
                      <AssetCreate />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/inventory/asset/:id/edit"
                  element={
                    <RequirePermission perm="MANAGE_STOCK">
                      <AssetEdit />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/inventory/asset/:id/view"
                  element={
                    <RequirePermission perm="MANAGE_STOCK">
                      <AssetView />
                    </RequirePermission>
                  }
                />
                {/* end inventory routes */}

                <Route path="*" element={<div>404 Not Found</div>} />
              </Route>
            </Routes>
          </Suspense>
        </GlobalLoaderFix>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoute;
