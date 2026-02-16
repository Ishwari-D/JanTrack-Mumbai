import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { useEffect, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Static import for Home to ensure fast LCP
import Home from "@/pages/home";

// Lazy imports for other pages
const NotFound = lazy(() => import("@/pages/not-found"));
const CandidateProfile = lazy(() => import("@/pages/candidate-profile"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ReportIssue = lazy(() => import("@/pages/report-issue"));
const AuthPage = lazy(() => import("@/pages/auth"));
const CandidatesPage = lazy(() => import("@/pages/candidates"));
const ComparePage = lazy(() => import("@/pages/compare"));
const AdminPage = lazy(() => import("@/pages/admin"));
const WardMap = lazy(() => import("@/pages/ward-map"));
const AboutUs = lazy(() => import("@/pages/about-us"));

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  const [location] = useLocation();

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }>
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/about-us" component={AboutUs} />
            <Route path="/candidates" component={CandidatesPage} />
            <Route path="/compare" component={ComparePage} />
            <Route path="/candidate/:id" component={CandidateProfile} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/report-issue" component={ReportIssue} />
            <Route path="/admin/login" component={AuthPage} />
            <Route path="/admin/signup" component={AuthPage} />
            <Route path="/login" component={AuthPage} />
            <Route path="/signup" component={AuthPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/ward-map" component={WardMap} />
            {/* Fallback to 404 */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Toaster />
            <Router />
          </ThemeProvider>
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
