import { Outlet, Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 10 && previous <= 10) {
      setIsScrolled(true);
    } else if (latest <= 10 && previous > 10) {
      setIsScrolled(false);
    }
  });

  return (
    <HelmetProvider>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background">
        {isHomePage ? (
          <>
            {/* Scroll-aware header for home page only */}
            <motion.header 
              className="fixed top-0 left-0 right-0 z-50 w-full bg-background backdrop-blur-sm"
              initial={{ borderBottomColor: "rgba(0,0,0,0)", boxShadow: "none" }}
              animate={{ 
                borderBottomColor: isScrolled ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0)",
                boxShadow: isScrolled ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                borderBottomWidth: isScrolled ? "1px" : "0px"
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-2">
                    <img src="icon.png" alt="RecipeBudd Logo" className="h-12 w-12" />
                    <h1 className="text-xl font-bold">RecipeBudd</h1>
                  </Link>
                  <nav className="flex items-center gap-4">
                    <Link to="/">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Button>
                    </Link>
                    <Link to="/recipes">
                      <Button variant="ghost" size="sm">
                        Recipes
                      </Button>
                    </Link>
                  </nav>
                </div>
              </div>
            </motion.header>
            
            {/* Spacer for fixed header */}
            <div className="h-[72px]"></div>
          </>
        ) : (
          <>
            {/* Regular header with border for all other pages */}
            <header className="border-b sticky top-0 z-50 bg-background">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-2">
                    <img src="icon.png" alt="RecipeBudd Logo" className="h-12 w-12" />
                    <h1 className="text-xl font-bold">RecipeBudd</h1>
                  </Link>
                  <nav className="flex items-center gap-4">
                    <Link to="/">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Button>
                    </Link>
                    <Link to="/recipes">
                      <Button variant="ghost" size="sm">
                        Recipes
                      </Button>
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
          </>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16 flex-grow">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t mt-auto">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p> {new Date().getFullYear()} RecipeBudd. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
}

export default App;
