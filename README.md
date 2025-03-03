# Startup Projection Calculator

This project is a startup projection calculator built with Next.js, TypeScript, and React. It allows users to input various financial parameters and visualize the projected revenue, profit, and client growth.

## Project Structure

The project is structured as follows:

- `.gitignore`: Specifies intentionally untracked files that Git should ignore.
- `next.config.ts`: Configuration file for Next.js.
- `package-lock.json`, `package.json`, `pnpm-lock.yaml`: Dependency management files.
- `postcss.config.mjs`: Configuration file for PostCSS.
- `README.md`: This file.
- `tsconfig.json`: Configuration file for TypeScript.
- `public/`: Contains static assets such as images.
- `src/`: Contains the source code.
  - `app/`: Contains the Next.js app.
    - `favicon.ico`: Favicon for the app.
    - `globals.css`: Global CSS file.
    - `layout.tsx`: Layout component for the app.
    - `page.tsx`: Main page component for the app.
  - `components/`: Contains React components.
    - `Calculator.tsx`: A component that handles the input and calculation logic.
    - `Card.tsx`, `CardContent.tsx`, `CardHeader.tsx`, `CardTitle.tsx`: Reusable card components for structuring the UI.
    - `ClientChart.tsx`: A component that displays the projected client growth in a chart.
    - `ProfitChart.tsx`: A component that displays the projected profit in a chart.
    - `ProjectionCharts.tsx`: A component that orchestrates and displays various projection charts.
    - `ProjectionTableViz.tsx`: A component that visualizes the projection data in a table format.
    - `RevenueChart.tsx`: A component that displays the projected revenue in a chart.
    - `StartupProjectionCalculator.tsx`: The main component that integrates all other components to provide the startup projection functionality.
  - `types/`: Contains TypeScript types.
    - `Inputs.tsx`: Defines the types for the input data used in the calculator.
    - `MonthlyData.tsx`: Defines the types for monthly data.
    - `YearlyData.tsx`: Defines the types for yearly data.

## Project Logic

The main component is `StartupProjectionCalculator.tsx`, which integrates the `Calculator.tsx` component for handling user inputs and the `ProjectionCharts.tsx` component for visualizing the results. The `Calculator` component takes user inputs and calculates the projected revenue, profit, and client growth based on the provided parameters. The calculated data is then passed to the `ProjectionCharts` component, which uses various chart components (`RevenueChart.tsx`, `ProfitChart.tsx`, `ClientChart.tsx`) to display the data visually. The `ProjectionTableViz.tsx` component displays the data in a tabular format.

The project uses TypeScript types defined in the `types/` directory to ensure type safety and code maintainability.

## Running the Project

1.  Install dependencies: `pnpm install` or `npm install` or `yarn install`
2.  Run the development server: `npm run dev` or `yarn dev` or `pnpm dev`
3.  Open your browser and navigate to `http://localhost:3000`

**Note:** Replace the default `favicon.ico` file in the `public/` directory with your own favicon. You may also want to add different sizes of favicons for different devices.

Here's how to generate a favicon using [Favicon.io](https://favicon.io/):

1.  Go to [https://favicon.io/](https://favicon.io/).
2.  You can either upload an image to convert it into a favicon, or you can create a favicon from text.
3.  If you choose to upload an image, make sure it's a high-resolution image.
4.  If you choose to create a favicon from text, you can select the font, size, and background color.
5.  Once you're happy with the favicon, click the "Download" button.

You can also upload an SVG file to Favicon.io to convert it to a favicon.

6.  Extract the downloaded ZIP file.
7.  Replace the `favicon.ico` file in the `public/` directory with the `favicon.ico` file from the extracted ZIP file.
8.  You may also want to add the other files from the extracted ZIP file to the `public/` directory to support different devices.

You can also use [Real Favicon Generator](https://realfavicongenerator.net/) to generate favicons for different platforms.

Make sure the `favicon.ico` file in the `public/` directory is being used by the browser. You may need to clear your browser cache to see the changes.

The header image `header.jpg` in the `public/` directory is now being used as the OG image.

For header images, you can create a simple image with the app name and logo using tools like [Canva](https://www.canva.com/) or [Adobe Spark](https://spark.adobe.com/). You can also find free images on websites like [Unsplash](https://unsplash.com/) or [Pexels](https://www.pexels.com/).

## Calculation Logic

The calculation logic is implemented in the `Calculator.tsx` component. The component takes the following inputs:

- `initialClients`: The initial number of clients.
- `monthlyRevenuePerClient`: The monthly revenue per client.
- `cac`: The customer acquisition cost.
- `churnRate`: The annual churn rate.
- `salesCycleLengthMonths`: The length of the sales cycle in months.
- `netMarginPercentage`: The net margin percentage.
- `marketingReinvestmentPercentage`: The percentage of profit that is reinvested in marketing.
- `seedMarketingBudget`: The initial marketing budget.
- `seedMarketingMonths`: The number of months to use the seed marketing budget.

The component calculates the projected revenue, profit, and client growth for 5 years (60 months). The calculations are performed as follows:

1.  **Monthly Churn Rate:** The annual churn rate is converted to a monthly churn rate by dividing by 12.
2.  **Monthly Seed Budget:** The seed marketing budget is distributed monthly by dividing by the number of seed marketing months.
3.  **Monthly Projections:** For each month, the following calculations are performed:
    - **Monthly Revenue:** The monthly revenue is calculated by multiplying the current number of clients by the monthly revenue per client.
    - **Monthly Profit:** The monthly profit is calculated by multiplying the monthly revenue by the net margin percentage.
    - **Monthly Marketing Budget:** The monthly marketing budget is determined as follows:
        - If the month is within the seed marketing period, the monthly seed budget is used.
        - Otherwise, the monthly marketing budget is calculated by multiplying the monthly profit by the marketing reinvestment percentage.
    - **New Clients:** The number of new clients is calculated by dividing the monthly marketing budget by the customer acquisition cost.
    - **Churned Clients:** The number of churned clients is calculated by multiplying the current number of clients by the monthly churn rate.
    - **Current Clients:** The current number of clients is updated by adding the number of new clients and subtracting the number of churned clients.
    - **Cumulative Revenue:** The cumulative revenue is updated by adding the monthly revenue.
    - **Cumulative Profit:** The cumulative profit is updated by adding the monthly profit.
    - **Customer Lifetime Value (LTV):** The customer lifetime value is calculated as follows:
        - Average Lifetime (in months) = 1 / Monthly Churn Rate
        - Customer LTV = Monthly Revenue per Client * Net Margin % * Average Lifetime (in months)
    - **LTV to CAC Ratio:** The LTV to CAC ratio is calculated by dividing the customer LTV by the customer acquisition cost.
    - **Net Profit:** The net profit is calculated by subtracting the monthly marketing budget from the monthly profit.
4.  **Yearly Summary Metrics:** For each year, the following summary metrics are calculated:
    - **Annual Revenue:** The sum of the monthly revenue for the year.
    - **Annual Profit:** The sum of the monthly profit for the year.
    - **Annual Marketing Spend:** The sum of the monthly marketing budget for the year.
    - **Annual Net Profit:** The sum of the monthly net profit for the year.
    - **CAC Payback Months:** The number of months it takes to pay back the customer acquisition cost, calculated as CAC / (Monthly Revenue per Client * (Net Margin %)).

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.
