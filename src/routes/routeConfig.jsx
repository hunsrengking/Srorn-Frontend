import { lazy } from "react";

const Dashboard = lazy(() => import("@/views/dashboard/Dashboard"));
const Login = lazy(() => import("@/views/auth/Login"));
const NoPermission = lazy(() => import("@/views/errors/NoPermission"));

const Ticket = lazy(() => import("@/views/tickets/Ticket"));
const CreateTicket = lazy(() => import("@/views/tickets/CreateTicket"));
const ViewTicket = lazy(() => import("@/views/tickets/ViewTicket"));
const TicketChecker = lazy(() => import("@/views/setting/checker/Checker"));
const TicketCheckerView = lazy(
  () => import("@/views/setting/checker/CheckerView"),
);

const Users = lazy(() => import("@/views/user/User"));
const UserCreate = lazy(() => import("@/views/user/UserCreate"));
const UserEdit = lazy(() => import("@/views/user/UserEdit"));
const UsersView = lazy(() => import("@/views/user/UserView"));

const Students = lazy(() => import("@/views/student/Student"));
const StudentCreate = lazy(() => import("@/views/student/StudentCreate"));
const StudentEdit = lazy(() => import("@/views/student/StudentEdit"));
const StudentView = lazy(() => import("@/views/student/StudentView"));

const Settings = lazy(() => import("@/views/setting/Settings"));
const RolePermission = lazy(
  () => import("@/views/setting/roles/RolePermission"),
);
const RoleCreate = lazy(() => import("@/views/setting/roles/RoleCreate"));
const RoleList = lazy(() => import("@/views/setting/roles/RoleList"));
const DepartmentList = lazy(
  () => import("@/views/organization/department/Department"),
);
const DepartmentCreate = lazy(
  () => import("@/views/organization/department/CreateDepartment"),
);
const DepartmentMember = lazy(
  () => import("@/views/organization/department/DepartmentMember"),
);
const Telegram = lazy(() => import("@/views/setting/configuration/Telegram"));
const GeneralSettings = lazy(
  () => import("@/views/setting/configuration/GeneralSettings"),
);
const Position = lazy(() => import("@/views/organization/positions/Positions"));
const Code = lazy(() => import("@/views/setting/code/Code"));
const CodeCreate = lazy(() => import("@/views/setting/code/CodeCreate"));
const CodeValueList = lazy(() => import("@/views/setting/code/CodeValueList"));
const CodeValueForm = lazy(() => import("@/views/setting/code/CodeValueForm"));
const Staff = lazy(() => import("@/views/organization/staff/Staff"));
const StaffCreate = lazy(() => import("@/views/organization/staff/StaffCreate"));
const StaffEdit = lazy(() => import("@/views/organization/staff/StaffEdit"));
const StaffView = lazy(() => import("@/views/organization/staff/ViewStaff"));

const Report = lazy(() => import("@/views/report/Report"));
const PrintCardReport = lazy(() => import("@/views/report/PrintCardReport"));

const Organization = lazy(() => import("@/views/organization/Organization"));
const Office = lazy(() => import("@/views/organization/office/Office"));
const OfficeCreate = lazy(
  () => import("@/views/organization/office/OfficeCreate"),
);
const OfficeEdit = lazy(() => import("@/views/organization/office/OfficeEdit"));
const OfficeView = lazy(() => import("@/views/organization/office/ViewOffice"));
const PrintCard = lazy(() => import("@/views/organization/card/PrintCard"));
const PrintCardNew = lazy(
  () => import("@/views/organization/card/PrintCardNew"),
);
const PrintCardView = lazy(
  () => import("@/views/organization/card/PrintCardView"),
);

const PrintCardEdit = lazy(
  () => import("@/views/organization/card/PrintCardEdit"),
);

const Inventory = lazy(() => import("@/views/Inventory/Inventory"));
const Product = lazy(() => import("@/views/Inventory/product/Product"));
const ProductCreate = lazy(
  () => import("@/views/Inventory/product/ProductCreate"),
);
const ProductEdit = lazy(() => import("@/views/Inventory/product/ProductEdit"));
const Stock = lazy(() => import("@/views/Inventory/stock/Stock"));
const StockAdjust = lazy(() => import("@/views/Inventory/stock/StockAdjust"));
const Asset = lazy(() => import("@/views/Inventory/asset/Asset"));
const AssetCreate = lazy(() => import("@/views/Inventory/asset/AssetCreate"));
const AssetEdit = lazy(() => import("@/views/Inventory/asset/AssetEdit"));
const AssetView = lazy(() => import("@/views/Inventory/asset/AssetView"));

export const publicRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/403", element: <NoPermission /> },
];

export const protectedRoutes = [
  { index: true, permission: "VIEW_DASHBOARD", element: <Dashboard /> },
  { path: "dashboard", permission: "VIEW_DASHBOARD", element: <Dashboard /> },

  { path: "ticket", permission: "VIEW_TICKET", element: <Ticket /> },
  {
    path: "ticket/create",
    permission: "CREATE_TICKET",
    element: <CreateTicket />,
  },
  {
    path: "ticket/views/:id",
    permission: "VIEW_TICKET",
    element: <ViewTicket />,
  },
  {
    path: "checkermaker",
    permission: "MAKER_CHECKER",
    element: <TicketChecker />,
  },
  {
    path: "checkermaker/view/:id",
    permission: "MAKER_CHECKER",
    element: <TicketCheckerView />,
  },

  { path: "users", permission: "VIEW_USER", element: <Users /> },
  { path: "users/create", permission: "CREATE_USER", element: <UserCreate /> },
  { path: "users/:id/view", permission: "VIEW_USER", element: <UsersView /> },
  { path: "users/:id/edit", permission: "UPDATE_USER", element: <UserEdit /> },

  { path: "students", permission: "VIEW_STUDENTS", element: <Students /> },
  {
    path: "students/create",
    permission: "CREATE_STUDENTS",
    element: <StudentCreate />,
  },
  {
    path: "students/:id/view",
    permission: "VIEW_STUDENTS",
    element: <StudentView />,
  },
  {
    path: "students/views/:id",
    permission: "VIEW_STUDENTS",
    element: <StudentView />,
  },
  {
    path: "students/:id/edit",
    permission: "UPDATE_STUDENTS",
    element: <StudentEdit />,
  },

  { path: "setting", permission: "VIEW_SETTING", element: <Settings /> },
  { path: "settings/roles", permission: "VIEW_ROLES", element: <RoleList /> },
  {
    path: "settings/roles/create",
    permission: "CREATE_ROLES",
    element: <RoleCreate />,
  },
  {
    path: "settings/roles/:id/permissions",
    permission: "UPDATE_PERMISSIONS",
    element: <RolePermission />,
  },
  {
    path: "settings/departments",
    permission: "VIEW_DEPARTMENT",
    element: <DepartmentList />,
  },
  {
    path: "settings/department/create",
    permission: "CREATE_DEPARTMENT",
    element: <DepartmentCreate />,
  },
  {
    path: "settings/department/:id/members",
    permission: "VIEW_DEPARTMENT",
    element: <DepartmentMember />,
  },
  {
    path: "settings/telegram",
    permission: "UPDATE_PERMISSIONS",
    element: <Telegram />,
  },
  {
    path: "settings/general",
    permission: "MANAGE_SYSTEM",
    element: <GeneralSettings />,
  },
  {
    path: "settings/positions",
    permission: "UPDATE_PERMISSIONS",
    element: <Position />,
  },
  { path: "settings/codes", permission: "READ_CODE", element: <Code /> },
  {
    path: "settings/codes/create",
    permission: "READ_CODE",
    element: <CodeCreate />,
  },
  {
    path: "settings/codes/:codeId/values",
    permission: "READ_CODE",
    element: <CodeValueList />,
  },
  {
    path: "settings/codes/:codeId/values/create",
    permission: "READ_CODE",
    element: <CodeValueForm />,
  },
  {
    path: "settings/codes/:codeId/values/:valueId/edit",
    permission: "READ_CODE",
    element: <CodeValueForm />,
  },
  { path: "settings/employees", permission: "VIEW_STAFF", element: <Staff /> },
  {
    path: "settings/employees/create",
    permission: "CREATE_STAFF",
    element: <StaffCreate />,
  },
  {
    path: "settings/employees/:id/edit",
    permission: "UPDATE_STAFF",
    element: <StaffEdit />,
  },
  {
    path: "settings/employees/:id/view",
    permission: "VIEW_STAFF",
    element: <StaffView />,
  },

  { path: "reports/summary", permission: "VIEW_REPORTS", element: <Report /> },
  {
    path: "reports/printcards",
    permission: "VIEW_REPORTS",
    element: <PrintCardReport />,
  },

  {
    path: "organization",
    permission: "VIEW_ORGANIZATION",
    element: <Organization />,
  },
  {
    path: "organization/office",
    permission: "VIEW_OFFICE",
    element: <Office />,
  },
  {
    path: "organization/office/create",
    permission: "CREATE_OFFICE",
    element: <OfficeCreate />,
  },
  {
    path: "organization/office/:id/edit",
    permission: "UPDATE_OFFICE",
    element: <OfficeEdit />,
  },
  {
    path: "organization/office/:id/view",
    permission: "VIEW_OFFICE",
    element: <OfficeView />,
  },
  {
    path: "organization/printcard",
    permission: "VIEW_ORGANIZATION",
    element: <PrintCard />,
  },
  {
    path: "organization/printcard/:id",
    permission: "VIEW_ORGANIZATION",
    element: <PrintCardView />,
  },

  {
    path: "organization/printcard/:id/edit",
    permission: "VIEW_ORGANIZATION",
    element: <PrintCardEdit />,
  },
  {
    path: "printcard/:id/:type",
    permission: "VIEW_ORGANIZATION",
    element: <PrintCardNew />,
  },

  { path: "inventory", permission: "VIEW_INVENTORY", element: <Inventory /> },
  {
    path: "inventory/product",
    permission: "MANAGE_PRODUCT",
    element: <Product />,
  },
  {
    path: "inventory/product/create",
    permission: "MANAGE_PRODUCT",
    element: <ProductCreate />,
  },
  {
    path: "inventory/product/:id/edit",
    permission: "MANAGE_PRODUCT",
    element: <ProductEdit />,
  },
  { path: "inventory/stock", permission: "MANAGE_STOCK", element: <Stock /> },
  {
    path: "inventory/stock/adjust",
    permission: "MANAGE_STOCK",
    element: <StockAdjust />,
  },
  { path: "inventory/asset", permission: "MANAGE_STOCK", element: <Asset /> },
  {
    path: "inventory/asset/create",
    permission: "MANAGE_STOCK",
    element: <AssetCreate />,
  },
  {
    path: "inventory/asset/:id/edit",
    permission: "MANAGE_STOCK",
    element: <AssetEdit />,
  },
  {
    path: "inventory/asset/:id/view",
    permission: "MANAGE_STOCK",
    element: <AssetView />,
  },
];
