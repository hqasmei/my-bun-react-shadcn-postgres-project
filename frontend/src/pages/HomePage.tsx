import { Button } from "@/components/ui/button";
import {
  ChefHat,
  ChevronRight,
  Import,
  Library,
  PlusCircle,
  Search,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <main>
        <section className="container px-4 py-12">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <motion.h1
              className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your simple recipe collection.
              <br />
              All in one place.
            </motion.h1>
            <motion.p
              className="max-w-[750px] text-lg text-muted-foreground sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Save, organize, and access your favorite recipes from anywhere. No more scattered
              bookmarks or lost recipe cards.
            </motion.p>
          </div>

          <motion.div
            className="mx-auto mt-8 max-w-[980px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-72 w-72 bg-blue-200 rounded-full blur-3xl opacity-20" />
              <div className="absolute -bottom-4 -right-4 h-72 w-72 bg-orange-200 rounded-full blur-3xl opacity-20" />
              <img
                src="hero-image.png"
                alt="RecipeBudd App Interface"
                className="relative z-10 w-full rounded-2xl border bg-background shadow-xl"
              />
            </div>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 flex max-w-[980px] flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <UtensilsCrossed className="h-5 w-5" />
              <span className="text-lg">Ready to cook?</span>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Store your favorite recipes
            </h2>
            <p className="text-center text-muted-foreground">
              Add your recipes, attach photos, and include links to your favorite cooking sites.
            </p>

            <Button onClick={() => navigate("/recipes")} size="lg" className="gap-2">
              <PlusCircle className="h-5 w-5" />
              Add Your First Recipe
            </Button>
          </motion.div>

          <div className="mx-auto mt-24 grid max-w-[980px] gap-8 md:grid-cols-3">
            <motion.div
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Library className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Organize Collections</h3>
              <p className="text-sm text-muted-foreground">
                Group your recipes into collections like weeknight dinners or holiday favorites
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Quick Search</h3>
              <p className="text-sm text-muted-foreground">
                Find any recipe instantly with powerful search and filtering
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Cooking Mode</h3>
              <p className="text-sm text-muted-foreground">
                Follow recipes with a clean, easy-to-read interface while cooking
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mx-auto mt-24 max-w-[980px] rounded-2xl border bg-white p-8 text-center shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold">Start Your Recipe Collection Today</h2>
            <p className="mt-2 text-muted-foreground">
              Join thousands of home cooks who trust RecipeBudd to organize their recipes
            </p>
            <Button size="lg" className="mt-6 gap-2" onClick={() => navigate("/recipes")}>
              Get Started
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
