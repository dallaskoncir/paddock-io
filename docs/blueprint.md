# Paddock.io - Senior Staff Monorepo Architecture Blueprint

## The Concept
A modern, high-performance SaaS platform for track day registration and event management, built to replace outdated systems like MotorsportReg. 

## 1. The Foundation (Tooling & Configs)
* **Package Manager:** `pnpm` (Industry standard for strict dependency trees)
* **Build System:** `TurboRepo` (For caching and orchestrating monorepo tasks)
* **Shared Configs (`packages/config`):** 
  * Extracted `eslint`, `prettier`, `tsconfig`, and `tailwind.config.js`.
  * *Note: This is the exact architectural play to pitch for the CARFAX codebase.*

## 2. The Design System (`packages/ui` -> `@paddock/ui`)
* **Tech Stack:** `shadcn/ui` (Radix Primitives + Tailwind CSS)
* **The Architecture:** Components are isolated from the main app. You fully own the code and customize the Class Variance Authority (`cva`) configurations.
* **Domain-Specific Variants:** 
  * `Badge`: `tech-passed` (green), `tech-failed` (red), `novice-driver` (yellow).
* **Documentation:** Integrated `Storybook` so other developers can view the UI library independently.

## 3. The Business Logic Engine (`packages/api` & `packages/utils` -> `@paddock/api`)
* **Validation (Zod Schemas):**
  * `vehicleSchema`: Validates Make, Model, Year, Drivetrain (RWD/FWD/AWD), and mods.
  * `techSchema`: Validates safety gear (e.g., throws an error if helmet Snell certification is older than 10 years).
* **Pricing Utilities:** Pure TypeScript functions like `calculateEventTotal()` that handle base fees, transponder rentals, and early-bird discounts.
* **State Management:** `Zustand` slice to persist registration data across multiple wizard steps.

## 4. The Consuming App (`apps/web`)
* **Tech Stack:** Next.js (App Router)
* **The UI Flow:** A multi-step registration wizard using `react-hook-form` + `@hookform/resolvers/zod`.
  * **Step 1: Garage:** Select from saved vehicles or add a new one.
  * **Step 2: Driver Profile:** Track experience, run group selection, emergency contacts.
  * **Step 3: Tech Inspection:** Dynamic checklist rendered based on the selected vehicle.
  * **Step 4: Checkout:** A clean summary dashboard (using `@paddock/ui`) simulating the final payment and platform configuration.

## The Interview Narrative (The Flex)
"I built Paddock.io to solve the UX nightmare of legacy track registration systems. I used a TurboRepo monorepo to separate concerns: UI primitives live in their own package using Radix for accessibility, and complex tech-inspection business logic is isolated in a pure TypeScript package using Zod. This allowed the Next.js consuming app to remain incredibly lightweight, focusing purely on server-side rendering and routing."
