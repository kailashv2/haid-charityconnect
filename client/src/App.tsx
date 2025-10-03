import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import HomePage from "@/pages/home-new";
import DonateItemsPage from "@/pages/donate-items";
import DonateMoneyPage from "@/pages/donate-money";
import RegisterNeedyPage from "@/pages/register-needy";
import AnalyticsPage from "@/pages/analytics";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/donate-items" component={DonateItemsPage} />
      <Route path="/donate-money" component={DonateMoneyPage} />
      <Route path="/register-needy" component={RegisterNeedyPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="haid-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
