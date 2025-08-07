#!/bin/bash

echo "Setting up Cloudability Cost Model Prototype..."

# Create all component files
touch src/components/QuickStart.tsx
touch src/components/GuidedSetup.tsx
touch src/components/AdvancedMode.tsx
touch src/components/CostDashboard.tsx

# Create data and utils files
touch src/data/vmwareData.ts
touch src/utils/costCalculations.ts

echo "All files created! Now copy the code into each file."
echo ""
echo "Files to populate:"
echo "1. src/App.tsx"
echo "2. src/data/vmwareData.ts"
echo "3. src/utils/costCalculations.ts"
echo "4. src/components/QuickStart.tsx"
echo "5. src/components/GuidedSetup.tsx"
echo "6. src/components/AdvancedMode.tsx"
echo "7. src/components/CostDashboard.tsx"
