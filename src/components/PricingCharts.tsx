import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

// ================================================================
// Chart 1: Repayment Timing vs Effective Daily Return
// Shows how r_eff drops as client takes longer to pay
// ================================================================

const repaymentTimingData = [
  { day: 30, rEff: 15.0, label: "15.0" },
  { day: 35, rEff: 12.9, label: "12.9" },
  { day: 40, rEff: 11.3, label: "11.3" },
  { day: 45, rEff: 10.0, label: "10.0" },
];

export function RepaymentTimingChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={repaymentTimingData}
          margin={{ left: 15, right: 30, top: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id="rEffGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#66BB6A" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#66BB6A" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            dataKey="day"
            tickFormatter={(v: number) => `Day ${v}`}
          />
          <YAxis
            domain={[9, 16]}
            tickFormatter={(v: number) => `${v}`}
            label={{
              value: "r_eff (bps/day)",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(v: number) => [`${v} bps/day`, "Effective daily rate"]}
            labelFormatter={(v: number) => `Payment on Day ${v}`}
          />
          <ReferenceLine
            y={10}
            stroke="#EF5350"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: "Floor = r (10 bps)",
              position: "insideBottomRight",
              fill: "#C62828",
              fontSize: 11,
              fontWeight: 600,
            }}
          />
          <Area
            type="monotone"
            dataKey="rEff"
            stroke="#2E7D32"
            strokeWidth={2.5}
            fill="url(#rEffGradient)"
            dot={{ r: 5, fill: "#2E7D32" }}
          >
            <LabelList
              dataKey="label"
              position="top"
              style={{ fontSize: 12, fill: "#2E7D32", fontWeight: 600 }}
              offset={10}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 2: Across Invoice Terms — Discount, Investor, Orbbit
// Stacked bar showing how fee splits across terms
// ================================================================

const invoiceTermData = [
  { term: "Net 30", investorPct: 3.15, orbbitPct: 1.35 },
  { term: "Net 45", investorPct: 4.2, orbbitPct: 1.8 },
  { term: "Net 60", investorPct: 5.25, orbbitPct: 2.25 },
  { term: "Net 90", investorPct: 7.35, orbbitPct: 3.15 },
];

export function InvoiceTermComparisonChart() {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={invoiceTermData}
          margin={{ left: 15, right: 20, top: 20, bottom: 10 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey="term" />
          <YAxis
            tickFormatter={(v: number) => `${v}%`}
            label={{
              value: "% of face value",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(v: number, name: string) => [
              `${v}% of F`,
              name === "investorPct" ? "Investor yield" : "Orbbit fee",
            ]}
          />
          <Legend
            formatter={(value: string) =>
              value === "investorPct"
                ? "Investor yield (70%)"
                : "Orbbit fee (30%)"
            }
          />
          <Bar
            dataKey="investorPct"
            stackId="a"
            fill="#42A5F5"
            name="investorPct"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="orbbitPct"
            stackId="a"
            fill="#FFA726"
            name="orbbitPct"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              formatter={(v: number) => {
                return `${v.toFixed(1)}%`;
              }}
              position="top"
              style={{ fontSize: 12, fill: "#333", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 3: r_eff Upside Band by Invoice Term
// Shows the range between best-case and worst-case r_eff
// ================================================================

const rEffBandData = [
  { term: "Net 30", best: 15.0, worst: 10.0, upside: "50%" },
  { term: "Net 45", best: 13.3, worst: 10.0, upside: "33%" },
  { term: "Net 60", best: 12.5, worst: 10.0, upside: "25%" },
  { term: "Net 75", best: 12.0, worst: 10.0, upside: "20%" },
  { term: "Net 90", best: 11.7, worst: 10.0, upside: "17%" },
];

export function ReffUpsideBandChart() {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={rEffBandData}
          margin={{ left: 15, right: 40, top: 20, bottom: 10 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey="term" />
          <YAxis
            domain={[8, 16]}
            tickFormatter={(v: number) => `${v}`}
            label={{
              value: "r_eff (bps/day)",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(v: number, name: string) => [
              `${v} bps/day`,
              name === "best"
                ? "Best case (paid on Day T)"
                : "Worst case (paid on Day T+G)",
            ]}
          />
          <Legend
            formatter={(value: string) =>
              value === "best"
                ? "Best case (paid Day T)"
                : "Worst case (paid Day T+G)"
            }
          />
          <ReferenceLine
            y={10}
            stroke="#EF5350"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: "Floor = r (10 bps)",
              position: "insideTopRight",
              fill: "#C62828",
              fontSize: 11,
              fontWeight: 600,
            }}
          />
          <Bar dataKey="worst" fill="#FFCDD2" name="worst" stackId="range">
            <LabelList
              dataKey="worst"
              position="center"
              style={{ fontSize: 10, fill: "#C62828" }}
              formatter={(v: number) => `${v}`}
            />
          </Bar>
          <Bar dataKey="best" fill="#66BB6A" name="best">
            <LabelList
              dataKey="upside"
              position="top"
              style={{ fontSize: 11, fill: "#2E7D32", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 4: Flat r Problem — Gross Annual Return (flat) vs Risk
// Line chart showing constant gross return and declining risk-adj
// ================================================================

const flatRData = [
  { term: 30, gross: 36.5, riskAdj: 33.8, feeDeal: 4.5, turns: 8.1 },
  { term: 45, gross: 36.5, riskAdj: 30.4, feeDeal: 6.0, turns: 6.1 },
  { term: 60, gross: 36.5, riskAdj: 25.2, feeDeal: 7.5, turns: 4.9 },
  { term: 90, gross: 36.5, riskAdj: 16.2, feeDeal: 10.5, turns: 3.5 },
];

export function FlatRReturnChart() {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart
          data={flatRData}
          margin={{ left: 15, right: 30, top: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            dataKey="term"
            tickFormatter={(v: number) => `Net ${v}`}
          />
          <YAxis
            domain={[0, 42]}
            tickFormatter={(v: number) => `${v}%`}
            label={{
              value: "Annualized return (% of F)",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(v: number, name: string) => [
              `${v}%`,
              name === "gross" ? "Gross annual return" : "Risk-adjusted return",
            ]}
            labelFormatter={(v: number) => `Net ${v}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="gross"
            stroke="#66BB6A"
            strokeWidth={2.5}
            strokeDasharray="8 4"
            dot={{ r: 4, fill: "#66BB6A" }}
            name="Gross annual return"
          />
          <Line
            type="monotone"
            dataKey="riskAdj"
            stroke="#EF5350"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#EF5350" }}
            name="Risk-adjusted return"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 5: PD Scaling by Term — Linear, Convex, Step
// Multi-line chart showing three PD growth assumptions
// ================================================================

// Normalize so PD(30) = 2% baseline
const pdData = [
  { term: 30, linear: 2.0, convex: 2.0, step: 2.0 },
  { term: 45, linear: 3.0, convex: 3.2, step: 2.5 },
  { term: 60, linear: 4.0, convex: 4.9, step: 3.0 },
  { term: 75, linear: 5.0, convex: 6.5, step: 3.5 },
  { term: 90, linear: 6.0, convex: 8.4, step: 10.0 },
];

export function PDScalingChart() {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer>
        <LineChart
          data={pdData}
          margin={{ left: 15, right: 30, top: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            dataKey="term"
            tickFormatter={(v: number) => `Net ${v}`}
          />
          <YAxis
            domain={[0, 12]}
            tickFormatter={(v: number) => `${v}%`}
            label={{
              value: "Probability of default",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(v: number, name: string) => {
              const labels: Record<string, string> = {
                linear: "Linear",
                convex: "Convex (likely)",
                step: "Step function",
              };
              return [`${v}%`, labels[name] || name];
            }}
            labelFormatter={(v: number) => `Net ${v}`}
          />
          <Legend
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                linear: "Linear",
                convex: "Convex (likely)",
                step: "Step function",
              };
              return labels[value] || value;
            }}
          />
          <Line
            type="monotone"
            dataKey="linear"
            stroke="#42A5F5"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ r: 3, fill: "#42A5F5" }}
          />
          <Line
            type="monotone"
            dataKey="convex"
            stroke="#EF5350"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#EF5350" }}
          />
          <Line
            type="monotone"
            dataKey="step"
            stroke="#FFA726"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={{ r: 3, fill: "#FFA726" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 6: Risk-Adjusted Pricing — Gross Fee vs Expected Loss
// Grouped bar showing gross fee, expected loss, and net
// ================================================================

const riskAdjPricingData = [
  { term: "Net 30", grossFee: 4.5, expLoss: 1.9, riskAdj: 2.6, impliedR: 10.0 },
  { term: "Net 45", grossFee: 6.0, expLoss: 3.0, riskAdj: 3.0, impliedR: 10.3 },
  { term: "Net 60", grossFee: 7.5, expLoss: 4.5, riskAdj: 3.0, impliedR: 11.4 },
  { term: "Net 90", grossFee: 10.5, expLoss: 7.5, riskAdj: 3.0, impliedR: 14.2 },
];

export function RiskAdjustedPricingChart() {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer>
        <BarChart
          data={riskAdjPricingData}
          margin={{ left: 15, right: 20, top: 20, bottom: 10 }}
          barCategoryGap="20%"
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey="term" />
          <YAxis
            tickFormatter={(v: number) => `${v}%`}
            label={{
              value: "% of face value",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip formatter={(v: number) => [`${v}%`]} />
          <Legend />
          <Bar
            dataKey="grossFee"
            fill="#42A5F5"
            name="Gross fee"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expLoss"
            fill="#EF5350"
            name="Expected loss"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="riskAdj"
            fill="#66BB6A"
            name="Risk-adjusted fee"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="riskAdj"
              position="top"
              style={{ fontSize: 11, fill: "#2E7D32", fontWeight: 600 }}
              formatter={(v: number) => `${v}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 7: B2B Payment Terms Distribution
// Horizontal bar chart showing market share of each term bucket
// ================================================================

const b2bDistData = [
  { term: "Net 30", pct: 54 },
  { term: "Net 45/60/90+", pct: 35 },
  { term: "Due on receipt", pct: 11 },
];

const b2bColors = ["#42A5F5", "#FFA726", "#BDBDBD"];

export function B2BTermsDistributionChart() {
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <BarChart
          data={b2bDistData}
          layout="vertical"
          margin={{ left: 110, right: 50, top: 10, bottom: 10 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 60]}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis type="category" dataKey="term" width={105} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Market share"]} />
          <Bar dataKey="pct" name="Share of US B2B" radius={[0, 4, 4, 0]}>
            {b2bDistData.map((entry, index) => (
              <Cell key={entry.term} fill={b2bColors[index]} />
            ))}
            <LabelList
              dataKey="pct"
              position="right"
              formatter={(v: number) => `${v}%`}
              style={{ fontSize: 13, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 8: APR Equivalence by Term
// Grouped bar: APR using T vs APR using T+G
// ================================================================

const aprData = [
  { term: "Net 30", aprT: 57.3, aprTG: 38.2 },
  { term: "Net 45", aprT: 51.8, aprTG: 38.8 },
  { term: "Net 60", aprT: 49.5, aprTG: 39.5 },
  { term: "Net 90", aprT: 47.8, aprTG: 40.9 },
];

export function APREquivalenceChart() {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={aprData}
          margin={{ left: 15, right: 20, top: 20, bottom: 10 }}
          barCategoryGap="25%"
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey="term" />
          <YAxis
            domain={[0, 65]}
            tickFormatter={(v: number) => `${v}%`}
            label={{
              value: "Estimated APR",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip formatter={(v: number) => [`${v}%`]} />
          <Legend />
          <Bar
            dataKey="aprT"
            fill="#EF5350"
            name="APR using T (disclosure)"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="aprT"
              position="top"
              style={{ fontSize: 11, fill: "#C62828", fontWeight: 600 }}
              formatter={(v: number) => `${v}%`}
            />
          </Bar>
          <Bar
            dataKey="aprTG"
            fill="#BDBDBD"
            name="APR using T+G (internal)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 9: Implied r Needed for Flat Risk-Adjusted Return
// Bar chart showing how much r would need to increase per term
// ================================================================

const impliedRData = [
  { term: "Net 30", impliedR: 10.0, label: "10.0" },
  { term: "Net 45", impliedR: 10.3, label: "10.3" },
  { term: "Net 60", impliedR: 11.4, label: "11.4" },
  { term: "Net 90", impliedR: 14.2, label: "14.2" },
];

const impliedRColors = ["#66BB6A", "#81C784", "#FFA726", "#EF5350"];

export function ImpliedRChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={impliedRData}
          margin={{ left: 15, right: 20, top: 20, bottom: 10 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey="term" />
          <YAxis
            domain={[0, 16]}
            tickFormatter={(v: number) => `${v}`}
            label={{
              value: "r needed (bps/day)",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(v: number) => [
              `${v} bps/day`,
              "Implied r for flat risk-adj return",
            ]}
          />
          <ReferenceLine
            y={10}
            stroke="#42A5F5"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: "Current flat r = 10",
              position: "insideTopRight",
              fill: "#1565C0",
              fontSize: 11,
              fontWeight: 600,
            }}
          />
          <Bar dataKey="impliedR" name="Implied r" radius={[4, 4, 0, 0]}>
            {impliedRData.map((entry, index) => (
              <Cell key={entry.term} fill={impliedRColors[index]} />
            ))}
            <LabelList
              dataKey="label"
              position="top"
              style={{ fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart: Fee Floor by Invoice Term
// Shows fee rate (Y) vs actual days T_inv + G_grace (X)
// Flat 4.5% floor for short tenors, linear 10bps/day above Net 30
// ================================================================

const feeFloorData = [
  { days: 30, fee: 4.5, label: "4.5%", term: "Net 15", breakdown: "15 + 15" },
  { days: 35, fee: 4.5, label: "", term: "Net 20", breakdown: "20 + 15" },
  { days: 40, fee: 4.5, label: "", term: "Net 25", breakdown: "25 + 15" },
  { days: 45, fee: 4.5, label: "4.5%", term: "Net 30", breakdown: "30 + 15" },
  { days: 50, fee: 5.0, label: "5.0%", term: "Net 35", breakdown: "35 + 15" },
  { days: 55, fee: 5.5, label: "", term: "Net 40", breakdown: "40 + 15" },
  { days: 60, fee: 6.0, label: "6.0%", term: "Net 45", breakdown: "45 + 15" },
];

export function FeeFloorChart() {
  return (
    <>
      <div style={{ width: "100%", height: 340 }}>
        <ResponsiveContainer>
          <AreaChart
            data={feeFloorData}
            margin={{ left: 20, right: 30, top: 25, bottom: 20 }}
          >
            <defs>
              <linearGradient
                id="feeFloorGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#42A5F5" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#42A5F5" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <ReferenceArea
              x1={25}
              x2={30}
              fill="#FFEBEE"
              fillOpacity={0.6}
              label={{
                value: "REJECTED",
                fill: "#C62828",
                fontSize: 11,
                fontWeight: 700,
              }}
            />
            <XAxis
              dataKey="days"
              type="number"
              domain={[25, 65]}
              ticks={[30, 35, 40, 45, 50, 55, 60]}
              tickFormatter={(v: number) => `${v}d`}
              label={{
                value: "Actual Days  (T_inv + G_grace)",
                position: "insideBottom",
                offset: -10,
                style: { fontSize: 12 },
              }}
            />
            <YAxis
              domain={[3.0, 7.0]}
              ticks={[3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0]}
              tickFormatter={(v: number) => `${v}%`}
              label={{
                value: "Fee Rate (D_disc)",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                style: { fontSize: 12 },
              }}
            />
            <Tooltip
              formatter={(v: number) => [`${v}%`, "Fee rate"]}
              labelFormatter={(_v: unknown, payload: readonly unknown[]) => {
                const entry = payload?.[0] as
                  | {
                      payload?: { breakdown?: string; term?: string };
                    }
                  | undefined;
                const d = entry?.payload;
                return d ? `${d.term}  (${d.breakdown} days)` : "";
              }}
            />
            {/* 4.5% floor reference line */}
            <ReferenceLine
              y={4.5}
              stroke="#EF5350"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: "4.5% floor (Net 30 minimum)",
                position: "insideTopLeft",
                fill: "#C62828",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            {/* Min remaining tenor boundary */}
            <ReferenceLine
              x={30}
              stroke="#EF5350"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: "Min 15d remaining",
                position: "insideTopRight",
                fill: "#C62828",
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            {/* Slope annotation in the linear region */}
            <ReferenceLine
              x={53}
              stroke="transparent"
              label={{
                value: "10 bps/day -->",
                position: "insideTop",
                fill: "#1565C0",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <Area
              type="linear"
              dataKey="fee"
              stroke="#1565C0"
              strokeWidth={2.5}
              fill="url(#feeFloorGradient)"
              dot={{ r: 5, fill: "#1565C0", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 7, fill: "#1565C0" }}
            >
              <LabelList
                dataKey="label"
                position="top"
                style={{ fontSize: 12, fill: "#1565C0", fontWeight: 600 }}
                offset={10}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <FeeFloorByTermChartInner />
    </>
  );
}

// ================================================================
// Chart: Fee Floor by Pricing Term (T_due only, no grace period)
// Same shape as FeeFloorChart but x-axis = T_due (days before due)
// ================================================================

const feeFloorByTermData = [
  { days: 15, fee: 4.5, label: "4.5%", term: "Net 15" },
  { days: 20, fee: 4.5, label: "", term: "Net 20" },
  { days: 25, fee: 4.5, label: "", term: "Net 25" },
  { days: 30, fee: 4.5, label: "4.5%", term: "Net 30" },
  { days: 35, fee: 5.0, label: "5.0%", term: "Net 35" },
  { days: 40, fee: 5.5, label: "", term: "Net 40" },
  { days: 45, fee: 6.0, label: "6.0%", term: "Net 45" },
];

function FeeFloorByTermChartInner() {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer>
        <AreaChart
          data={feeFloorByTermData}
          margin={{ left: 20, right: 30, top: 25, bottom: 20 }}
        >
          <defs>
            <linearGradient
              id="feeFloorByTermGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#42A5F5" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#42A5F5" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <ReferenceArea
            x1={10}
            x2={15}
            fill="#FFEBEE"
            fillOpacity={0.6}
            label={{
              value: "REJECTED",
              fill: "#C62828",
              fontSize: 11,
              fontWeight: 700,
            }}
          />
          <XAxis
            dataKey="days"
            type="number"
            domain={[10, 50]}
            ticks={[15, 20, 25, 30, 35, 40, 45]}
            tickFormatter={(v: number) => `${v}d`}
            label={{
              value: "Pricing Term T_due (days before due date)",
              position: "insideBottom",
              offset: -10,
              style: { fontSize: 12 },
            }}
          />
          <YAxis
            domain={[3.0, 7.0]}
            ticks={[3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0]}
            tickFormatter={(v: number) => `${v}%`}
            label={{
              value: "Fee Rate (D_disc)",
              angle: -90,
              position: "insideLeft",
              offset: -5,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(v: number) => [`${v}%`, "Fee rate"]}
            labelFormatter={(_v: unknown, payload: readonly unknown[]) => {
              const entry = payload?.[0] as {
                payload?: { term?: string; days?: number };
              } | undefined;
              const d = entry?.payload;
              return d ? `${d.term}  (T_due = ${d.days}d)` : "";
            }}
          />
          {/* 4.5% floor reference line */}
          <ReferenceLine
            y={4.5}
            stroke="#EF5350"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: "4.5% floor (Net 30 minimum)",
              position: "insideTopLeft",
              fill: "#C62828",
              fontSize: 11,
              fontWeight: 600,
            }}
          />
          {/* Min remaining tenor boundary */}
          <ReferenceLine
            x={15}
            stroke="#EF5350"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: "Min 15d remaining",
              position: "insideTopRight",
              fill: "#C62828",
              fontSize: 10,
              fontWeight: 600,
            }}
          />
          {/* Slope annotation in the linear region */}
          <ReferenceLine
            x={38}
            stroke="transparent"
            label={{
              value: "10 bps/day -->",
              position: "insideTop",
              fill: "#1565C0",
              fontSize: 11,
              fontWeight: 600,
            }}
          />
          <Area
            type="linear"
            dataKey="fee"
            stroke="#1565C0"
            strokeWidth={2.5}
            fill="url(#feeFloorByTermGradient)"
            dot={{ r: 5, fill: "#1565C0", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 7, fill: "#1565C0" }}
          >
            <LabelList
              dataKey="label"
              position="top"
              style={{ fontSize: 12, fill: "#1565C0", fontWeight: 600 }}
              offset={10}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
