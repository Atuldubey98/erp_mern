import { Route, Routes } from "react-router-dom";
import DashboardPage from "./features/dashboard";
import LoginPage from "./features/login";
import OrgPage from "./features/organizations";
import RegisterPage from "./features/register";
import CustomersPage from "./features/customers";
import ProductsPage from "./features/products";
import EstimatesPage from "./features/estimates";
import CreateEstimatePage from "./features/estimates/create";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/:orgId">
        <Route element={<DashboardPage />} path="dashboard" />
        <Route element={<ProductsPage />} path="products" />
        <Route element={<CustomersPage />} path="customers" />
        <Route path="estimates" >
          <Route  element={<EstimatesPage />} path=""/>
          <Route  element={<CreateEstimatePage />} path="create"/>
        </Route>
      </Route>
      <Route path="/organizations" element={<OrgPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
