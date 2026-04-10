import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Label,
  Cell,
  LabelList,
} from "recharts";

// ================================================================
// Chart 1: Loss Multiplier — how many good deals to cover one bad
// ================================================================

const lossMultiplierData = [
  {
    party: "Orbbit",
    gain: 1,
    loss: -7.1,
    gainLabel: "+$135",
    lossLabel: "-$955 (7.1x)",
  },
  {
    party: "Investor",
    gain: 1,
    loss: -27.3,
    gainLabel: "+$315",
    lossLabel: "-$8,595 (27.3x)",
  },
];

export function LossMultiplierChart() {
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <BarChart
          data={lossMultiplierData}
          layout="vertical"
          margin={{ left: 70, right: 120, top: 10, bottom: 10 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[-32, 4]}
            tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}x`}
          />
          <YAxis type="category" dataKey="party" width={65} />
          <Tooltip
            formatter={(value: number, name: string) => {
              const label =
                name === "gain"
                  ? "Gain (1 good deal)"
                  : "Loss (1 write-off)";
              return [`${value > 0 ? "+" : ""}${value}x`, label];
            }}
          />
          <ReferenceLine x={0} stroke="#333" strokeWidth={1} />
          <Bar dataKey="gain" fill="#66BB6A" name="gain" radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="gainLabel"
              position="right"
              style={{ fontSize: 11, fill: "#2E7D32", fontWeight: 600 }}
            />
          </Bar>
          <Bar dataKey="loss" fill="#EF5350" name="loss" radius={[4, 0, 0, 4]}>
            <LabelList
              dataKey="lossLabel"
              position="left"
              style={{ fontSize: 11, fill: "#C62828", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 2: Orbbit Portfolio P&L by Write-Off Rate
// ================================================================

const orbbitData = Array.from({ length: 21 }, (_, i) => ({
  x: i,
  pnl: (100 - i) * 135 - i * 955,
}));

export function OrbbitPnLChart() {
  return (
    <div style={{ width: "100%", height: 380 }}>
      <ResponsiveContainer>
        <LineChart
          data={orbbitData}
          margin={{ left: 15, right: 30, top: 20, bottom: 35 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />

          {/* Colored zones */}
          <ReferenceArea
            x1={0}
            x2={12.4}
            fill="#E8F5E9"
            fillOpacity={0.2}
          />
          <ReferenceArea
            x1={12}
            x2={20}
            fill="#FFEBEE"
            fillOpacity={0.2}
          />

          <XAxis
            dataKey="x"
            label={{
              value: "Write-off rate (%)",
              position: "bottom",
              offset: 15,
            }}
          />
          <YAxis
            tickFormatter={(v: number) =>
              v === 0 ? "$0" : `$${(v / 1000).toFixed(0)}K`
            }
            label={{
              value: "P&L per 100 deals",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(v: number) => [
              `$${v.toLocaleString()}`,
              "Orbbit P&L",
            ]}
            labelFormatter={(v: number) => `Write-off rate: ${v}%`}
          />

          {/* Zero line */}
          <ReferenceLine y={0} stroke="#666" strokeWidth={1} />

          {/* Break-even marker */}
          <ReferenceLine
            x={12.4}
            stroke="#2E7D32"
            strokeDasharray="6 4"
            strokeWidth={1.5}
          >
            <Label
              value="Break-even: 12.4%"
              position="insideTopLeft"
              fill="#2E7D32"
              fontSize={12}
              fontWeight={600}
            />
          </ReferenceLine>

          {/* P&L line */}
          <Line
            type="monotone"
            dataKey="pnl"
            stroke="#66BB6A"
            strokeWidth={2.5}
            dot={false}
            name="Orbbit P&L"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 3: Investor Portfolio P&L by Write-Off Rate
// ================================================================

const investorData = Array.from({ length: 16 }, (_, i) => ({
  x: i,
  pnl: (100 - i) * 315 - i * 8595,
}));

export function InvestorPnLChart() {
  return (
    <div style={{ width: "100%", height: 380 }}>
      <ResponsiveContainer>
        <LineChart
          data={investorData}
          margin={{ left: 20, right: 30, top: 20, bottom: 35 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />

          {/* Colored zones */}
          <ReferenceArea
            x1={0}
            x2={3.5}
            fill="#E8F5E9"
            fillOpacity={0.2}
          />
          <ReferenceArea
            x1={3.5}
            x2={15}
            fill="#FFEBEE"
            fillOpacity={0.2}
          />

          <XAxis
            dataKey="x"
            label={{
              value: "Write-off rate (%)",
              position: "bottom",
              offset: 15,
            }}
          />
          <YAxis
            tickFormatter={(v: number) =>
              v === 0 ? "$0" : `$${(v / 1000).toFixed(0)}K`
            }
            label={{
              value: "P&L per 100 deals",
              angle: -90,
              position: "insideLeft",
              offset: -5,
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(v: number) => [
              `$${v.toLocaleString()}`,
              "Investor P&L",
            ]}
            labelFormatter={(v: number) => `Write-off rate: ${v}%`}
          />

          {/* Zero line */}
          <ReferenceLine y={0} stroke="#666" strokeWidth={1} />

          {/* Break-even marker */}
          <ReferenceLine
            x={3.5}
            stroke="#1565C0"
            strokeDasharray="6 4"
            strokeWidth={1.5}
          >
            <Label
              value="Break-even: 3.5%"
              position="insideTopLeft"
              fill="#1565C0"
              fontSize={12}
              fontWeight={600}
            />
          </ReferenceLine>

          {/* P&L line */}
          <Line
            type="monotone"
            dataKey="pnl"
            stroke="#42A5F5"
            strokeWidth={2.5}
            dot={false}
            name="Investor P&L"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ================================================================
// Chart 4: Break-Even Threshold Comparison
// ================================================================

const breakEvenData = [
  { party: "Investor", threshold: 3.5 },
  { party: "Orbbit", threshold: 12.4 },
];

const breakEvenColors = ["#42A5F5", "#66BB6A"];

export function BreakEvenThresholdChart() {
  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveContainer>
        <BarChart
          data={breakEvenData}
          layout="vertical"
          margin={{ left: 70, right: 50, top: 10, bottom: 10 }}
          barCategoryGap="35%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 15]}
            tickFormatter={(v: number) => `${v}%`}
            label={{
              value: "Write-off rate at break-even",
              position: "bottom",
              offset: 5,
            }}
          />
          <YAxis type="category" dataKey="party" width={65} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Break-even"]} />
          <Bar dataKey="threshold" name="Break-even" radius={[0, 4, 4, 0]}>
            {breakEvenData.map((entry, index) => (
              <Cell key={entry.party} fill={breakEvenColors[index]} />
            ))}
            <LabelList
              dataKey="threshold"
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
