import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingPage from "./pages/LoadingPage";

const AdminRoute = lazy(() => import("./components/AdminRoute"));
const UpdateRecipe = lazy(() => import("./pages/UpdateRecipe"));
const RecipePage = lazy(() => import("./pages/RecipePage"));
const AddRecipie = lazy(() => import("./pages/AddRecipie"));
const Applayout = lazy(() => import("./Applayout"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));

const App = () => {
  return (
    <div>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route element={<Applayout />}>
            <Route path="/" exact element={<Home />} />
            <Route element={<AdminRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addRecipe" element={<AddRecipie />} />
              <Route path="/updateRecipe/:id" element={<UpdateRecipe />} />
            </Route>
            <Route path="/recipe/:slug" element={<RecipePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
