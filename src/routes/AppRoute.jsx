import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageLoading from "@/components/common/PageLoading";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/layouts/Layout";
import GlobalLoader from "@/routes/GlobalLoader";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RequirePermission from "@/routes/RequirePermission";
import { protectedRoutes, publicRoutes } from "@/routes/routeConfig";

const renderPublicRoute = ({ path, element }) => (
  <Route key={path} path={path} element={element} />
);

const renderProtectedRoute = ({ index, path, permission, element }) => {
  const routeProps = index ? { index: true } : { path };

  return (
    <Route
      key={index ? "index" : path}
      {...routeProps}
      element={<RequirePermission perm={permission}>{element}</RequirePermission>}
    />
  );
};

const AppRoute = () => (
  <BrowserRouter>
    <AuthProvider>
      <GlobalLoader>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {publicRoutes.map(renderPublicRoute)}

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {protectedRoutes.map(renderProtectedRoute)}
              <Route path="*" element={<div>404 Not Found</div>} />
            </Route>
          </Routes>
        </Suspense>
      </GlobalLoader>
    </AuthProvider>
  </BrowserRouter>
);

export default AppRoute;
