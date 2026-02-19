import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Agentation } from "agentation";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import RequireAuth from "./components/auth/RequireAuth";
import GuestOnlyRoute from "./components/auth/GuestOnlyRoute";

const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const Calendar = lazy(() => import("./pages/Calendar"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const Blank = lazy(() => import("./pages/Blank"));
const UsageComparison = lazy(() => import("./pages/Automation/UsageComparison"));
const RolePermissions = lazy(() => import("./pages/System/RolePermissions"));
const UserRoles = lazy(() => import("./pages/System/UserRoles"));

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            {/* Authenticated Routes */}
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route index path="/" element={<Home />} />

                {/* Others Page */}
                <Route path="/profile" element={<UserProfiles />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/blank" element={<Blank />} />

                {/* Forms */}
                <Route path="/form-elements" element={<FormElements />} />

                {/* Tables */}
                <Route path="/basic-tables" element={<BasicTables />} />

                {/* Ui Elements */}
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/avatars" element={<Avatars />} />
                <Route path="/badge" element={<Badges />} />
                <Route path="/buttons" element={<Buttons />} />
                <Route path="/images" element={<Images />} />
                <Route path="/videos" element={<Videos />} />

                {/* Charts */}
                <Route path="/line-chart" element={<LineChart />} />
                <Route path="/bar-chart" element={<BarChart />} />

                {/* Automation */}
                <Route path="/usage-comparison" element={<UsageComparison />} />

                {/* System */}
                <Route path="/system/role-permissions" element={<RolePermissions />} />
                <Route path="/system/user-roles" element={<UserRoles />} />
              </Route>
            </Route>

            {/* Guest Routes */}
            <Route element={<GuestOnlyRoute />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
      <Agentation />
    </>
  );
}
