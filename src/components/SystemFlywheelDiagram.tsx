import { useRef, useEffect, useState, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────

interface Box {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  border: string;
  fontSize?: number;
  fontWeight?: number;
  textColor?: string;
  children?: Box[];
  dashed?: boolean;
}

interface Arrow {
  from: string;
  to: string;
  dashed?: boolean;
  color?: string;
  fromSide?: "bottom" | "top" | "left" | "right";
  toSide?: "bottom" | "top" | "left" | "right";
}

// ─── Layout Data ────────────────────────────────────────────────────

const BOXES: Box[] = [
  // ── Product Ground Truth ──
  {
    id: "pgt",
    label: "Product Ground Truth",
    x: 240,
    y: 0,
    w: 400,
    h: 110,
    color: "#eef2f7",
    border: "#b0c4de",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#3a5a7c",
    children: [
      {
        id: "pgt-api",
        label: "Third Party API Data",
        x: 18,
        y: 42,
        w: 160,
        h: 36,
        color: "#fff",
        border: "#ccd6e0",
      },
      {
        id: "pgt-ub",
        label: "User Behavior Data",
        x: 220,
        y: 42,
        w: 155,
        h: 36,
        color: "#fff",
        border: "#ccd6e0",
      },
    ],
  },

  // ── User AI (Business) ──
  {
    id: "ai-biz",
    label: "User AI (Business)",
    x: 20,
    y: 160,
    w: 330,
    h: 110,
    color: "#eef6ee",
    border: "#a5d6a7",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#2e6e32",
    children: [
      {
        id: "cs",
        label: "Customer Support",
        x: 18,
        y: 42,
        w: 140,
        h: 36,
        color: "#fff",
        border: "#c8e6c9",
      },
      {
        id: "cf",
        label: "Cashflow Forecasting",
        x: 172,
        y: 42,
        w: 145,
        h: 36,
        color: "#fff",
        border: "#c8e6c9",
      },
    ],
  },

  // ── User AI (Investor) ──
  {
    id: "ai-inv",
    label: "User AI (Investor)",
    x: 550,
    y: 160,
    w: 310,
    h: 110,
    color: "#eef6ee",
    border: "#a5d6a7",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#2e6e32",
    children: [
      {
        id: "to",
        label: "Tax Optimization",
        x: 15,
        y: 42,
        w: 130,
        h: 36,
        color: "#fff",
        border: "#c8e6c9",
      },
      {
        id: "ya",
        label: "Yield Analysis",
        x: 163,
        y: 42,
        w: 130,
        h: 36,
        color: "#fff",
        border: "#c8e6c9",
      },
    ],
  },

  // ── Business App ──
  {
    id: "biz",
    label: "Business (Capital Demand)",
    x: 80,
    y: 330,
    w: 260,
    h: 90,
    color: "#f5f0e8",
    border: "#deb887",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#7a5c2e",
    children: [
      {
        id: "ba",
        label: "Business App",
        x: 60,
        y: 38,
        w: 120,
        h: 36,
        color: "#fff",
        border: "#e0d0b8",
      },
    ],
  },

  // ── Investor App ──
  {
    id: "inv",
    label: "Investor (Capital Supply)",
    x: 550,
    y: 330,
    w: 260,
    h: 90,
    color: "#f5f0e8",
    border: "#deb887",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#7a5c2e",
    children: [
      {
        id: "ia",
        label: "Investor App",
        x: 65,
        y: 38,
        w: 120,
        h: 36,
        color: "#fff",
        border: "#e0d0b8",
      },
    ],
  },

  // ── Financial Products ──
  {
    id: "fp",
    label: "Financial Products",
    x: 60,
    y: 490,
    w: 450,
    h: 140,
    color: "#f0edf5",
    border: "#b39ddb",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#5a3d8a",
    children: [
      {
        id: "fp-fact",
        label: "Factoring",
        x: 15,
        y: 35,
        w: 195,
        h: 90,
        color: "#f5f0fa",
        border: "#e53935",
        dashed: true,
        fontSize: 12,
        fontWeight: 600,
        textColor: "#5a3d8a",
        children: [
          {
            id: "fp-if",
            label: "Invoice Factoring",
            x: 18,
            y: 38,
            w: 130,
            h: 36,
            color: "#fff",
            border: "#d0c0e0",
          },
        ],
      },
      {
        id: "fp-lend",
        label: "Lending",
        x: 235,
        y: 35,
        w: 195,
        h: 90,
        color: "#f5f0fa",
        border: "#ccc",
        fontSize: 12,
        fontWeight: 600,
        textColor: "#5a3d8a",
        children: [
          {
            id: "fp-loan",
            label: "Loan",
            x: 55,
            y: 38,
            w: 80,
            h: 36,
            color: "#fff",
            border: "#d0c0e0",
          },
        ],
      },
    ],
  },

  // ── Internal Execution ──
  {
    id: "ie",
    label: "Internal Execution",
    x: 640,
    y: 490,
    w: 220,
    h: 90,
    color: "#f5f2e8",
    border: "#deb887",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#7a5c2e",
    children: [
      {
        id: "hq",
        label: "HQ App",
        x: 65,
        y: 38,
        w: 90,
        h: 36,
        color: "#fff",
        border: "#e0d0b8",
      },
    ],
  },

  // ── Financial Rails ──
  {
    id: "fr",
    label: "Financial Rails",
    x: 20,
    y: 700,
    w: 530,
    h: 140,
    color: "#eef0f2",
    border: "#b0bec5",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#455a64",
    children: [
      {
        id: "fr-on",
        label: "Onchain",
        x: 15,
        y: 35,
        w: 240,
        h: 90,
        color: "#e8ecf0",
        border: "#b0bec5",
        fontSize: 12,
        fontWeight: 600,
        textColor: "#455a64",
        children: [
          {
            id: "sc",
            label: "Smart Contracts",
            x: 10,
            y: 38,
            w: 120,
            h: 36,
            color: "#fff",
            border: "#c0ccd4",
          },
          {
            id: "wl",
            label: "Wallets",
            x: 145,
            y: 38,
            w: 80,
            h: 36,
            color: "#fff",
            border: "#c0ccd4",
          },
        ],
      },
      {
        id: "fr-off",
        label: "Offchain",
        x: 275,
        y: 35,
        w: 240,
        h: 90,
        color: "#e8ecf0",
        border: "#b0bec5",
        fontSize: 12,
        fontWeight: 600,
        textColor: "#455a64",
        children: [
          {
            id: "tpr",
            label: "Traditional Payment Rails",
            x: 8,
            y: 38,
            w: 130,
            h: 36,
            color: "#fff",
            border: "#c0ccd4",
          },
          {
            id: "bk",
            label: "Bank Accounts",
            x: 148,
            y: 38,
            w: 80,
            h: 36,
            color: "#fff",
            border: "#c0ccd4",
          },
        ],
      },
    ],
  },

  // ── Internal AI ──
  {
    id: "iai",
    label: "Internal AI",
    x: 620,
    y: 640,
    w: 260,
    h: 100,
    color: "#f5f2e8",
    border: "#deb887",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#7a5c2e",
    children: [
      {
        id: "fs",
        label: "Financial Strategy",
        x: 12,
        y: 40,
        w: 120,
        h: 36,
        color: "#fff",
        border: "#e0d0b8",
      },
      {
        id: "pa",
        label: "Product Architecture",
        x: 145,
        y: 40,
        w: 105,
        h: 36,
        color: "#fff",
        border: "#e0d0b8",
      },
    ],
  },

  // ── Internal Ground Truth ──
  {
    id: "igt",
    label: "Internal Ground Truth",
    x: 650,
    y: 800,
    w: 220,
    h: 90,
    color: "#f5f2e8",
    border: "#deb887",
    fontSize: 13,
    fontWeight: 600,
    textColor: "#7a5c2e",
    children: [
      {
        id: "id",
        label: "Internal Docs",
        x: 50,
        y: 38,
        w: 110,
        h: 36,
        color: "#fff",
        border: "#e0d0b8",
      },
    ],
  },
];

const ARROWS: Arrow[] = [
  // Product Ground Truth → AI agents
  { from: "pgt", to: "ai-biz", fromSide: "bottom", toSide: "top" },
  { from: "pgt", to: "ai-inv", fromSide: "bottom", toSide: "top" },

  // AI agents → User Apps
  { from: "ai-biz", to: "biz", fromSide: "bottom", toSide: "top" },
  { from: "ai-inv", to: "inv", fromSide: "bottom", toSide: "top" },

  // Financial Products → Users (dashed)
  {
    from: "fp",
    to: "biz",
    fromSide: "top",
    toSide: "bottom",
    dashed: true,
    color: "#aaa",
  },
  {
    from: "fp",
    to: "inv",
    fromSide: "top",
    toSide: "bottom",
    dashed: true,
    color: "#aaa",
  },

  // Users → Product Ground Truth (dashed feedback)
  {
    from: "biz",
    to: "pgt",
    fromSide: "left",
    toSide: "left",
    dashed: true,
    color: "#aaa",
  },
  {
    from: "inv",
    to: "pgt",
    fromSide: "right",
    toSide: "right",
    dashed: true,
    color: "#aaa",
  },

  // Financial Rails → Financial Products
  { from: "fr", to: "fp", fromSide: "top", toSide: "bottom" },

  // Internal Execution → Financial Products
  { from: "ie", to: "fp", fromSide: "left", toSide: "right" },

  // Internal loop (gold)
  {
    from: "ie",
    to: "igt",
    fromSide: "bottom",
    toSide: "top",
    color: "#b08030",
  },
  {
    from: "igt",
    to: "iai",
    fromSide: "top",
    toSide: "bottom",
    color: "#b08030",
  },
  {
    from: "iai",
    to: "ie",
    fromSide: "right",
    toSide: "right",
    color: "#b08030",
  },

  // Product Ground Truth → Internal Ground Truth (cross-link)
  {
    from: "pgt",
    to: "igt",
    fromSide: "right",
    toSide: "left",
    dashed: true,
    color: "#6a8caf",
  },

  // Onchain → Offchain
  {
    from: "fr-on",
    to: "fr-off",
    fromSide: "right",
    toSide: "left",
    color: "#aaa",
  },
];

// ─── Geometry Helpers ───────────────────────────────────────────────

type AbsRect = { x: number; y: number; w: number; h: number };

function buildAbsMap(boxes: Box[], ox = 0, oy = 0): Map<string, AbsRect> {
  const m = new Map<string, AbsRect>();
  for (const b of boxes) {
    const ax = ox + b.x;
    const ay = oy + b.y;
    m.set(b.id, { x: ax, y: ay, w: b.w, h: b.h });
    if (b.children) {
      for (const [k, v] of buildAbsMap(b.children, ax, ay)) m.set(k, v);
    }
  }
  return m;
}

function anchorPoint(
  r: AbsRect,
  side: "top" | "bottom" | "left" | "right"
): [number, number] {
  switch (side) {
    case "top":
      return [r.x + r.w / 2, r.y];
    case "bottom":
      return [r.x + r.w / 2, r.y + r.h];
    case "left":
      return [r.x, r.y + r.h / 2];
    case "right":
      return [r.x + r.w, r.y + r.h / 2];
  }
}

function buildPath(
  from: [number, number],
  fromSide: string,
  to: [number, number],
  toSide: string
): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const offset = 20;

  // Simple smoothstep: straight out from source, then to target
  let cx1 = x1,
    cy1 = y1,
    cx2 = x2,
    cy2 = y2;

  if (fromSide === "bottom") cy1 = y1 + offset;
  if (fromSide === "top") cy1 = y1 - offset;
  if (fromSide === "left") cx1 = x1 - offset;
  if (fromSide === "right") cx1 = x1 + offset;

  if (toSide === "bottom") cy2 = y2 + offset;
  if (toSide === "top") cy2 = y2 - offset;
  if (toSide === "left") cx2 = x2 - offset;
  if (toSide === "right") cx2 = x2 + offset;

  return `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
}

// ─── Render Helpers ─────────────────────────────────────────────────

function renderBox(box: Box) {
  const isLeaf = !box.children || box.children.length === 0;
  return (
    <div
      key={box.id}
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        background: box.color,
        border: box.dashed
          ? `2.5px dashed ${box.border}`
          : `${isLeaf ? "1.5" : "2"}px solid ${box.border}`,
        borderRadius: isLeaf ? 8 : 12,
        padding: isLeaf ? "8px 12px" : "8px 12px",
        fontSize: box.fontSize || 11,
        fontWeight: box.fontWeight || 400,
        color: box.textColor || "#555",
        fontFamily: "system-ui, -apple-system, sans-serif",
        whiteSpace: isLeaf ? ("nowrap" as const) : ("normal" as const),
        display: "flex",
        alignItems: isLeaf ? "center" : "flex-start",
        justifyContent: isLeaf ? "center" : "flex-start",
        boxSizing: "border-box" as const,
      }}
    >
      {(!box.children || box.children.length === 0) && box.label}
      {box.children && box.children.length > 0 && (
        <>
          <span style={{ position: "relative", zIndex: 1 }}>{box.label}</span>
          {box.children.map((child) => renderBox(child))}
        </>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

export default function SystemFlywheelDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const absMap = buildAbsMap(BOXES);

  // Determine canvas bounds
  const canvasW = 900;
  const canvasH = 920;

  // Fit view on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const sx = cw / canvasW;
    const sy = ch / canvasH;
    const s = Math.min(sx, sy, 1) * 0.92;
    setScale(s);
    setTranslate({
      x: (cw - canvasW * s) / 2,
      y: (ch - canvasH * s) / 2,
    });
  }, []);

  // Pan handlers
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      setDragging(true);
      setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [translate]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      setTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [dragging, dragStart]
  );

  const onPointerUp = useCallback(() => setDragging(false), []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.95 : 1.05;
      const newScale = Math.min(Math.max(scale * factor, 0.3), 2);
      // Zoom toward cursor
      const rect = containerRef.current!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      setTranslate({
        x: cx - ((cx - translate.x) / scale) * newScale,
        y: cy - ((cy - translate.y) / scale) * newScale,
      });
      setScale(newScale);
    },
    [scale, translate]
  );

  return (
    <div
      className="not-content"
      ref={containerRef}
      style={{
        width: "100%",
        height: 700,
        border: "1px solid #e0e0e0",
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        margin: "24px 0",
        background: "#fafafa",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          width: canvasW,
          height: canvasH,
        }}
      >
        {/* SVG layer for arrows */}
        <svg
          width={canvasW}
          height={canvasH}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            {["#888", "#aaa", "#b08030", "#6a8caf"].map((c) => (
              <marker
                key={c}
                id={`arrow-${c.replace("#", "")}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="8"
                markerHeight="8"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
              </marker>
            ))}
          </defs>
          {ARROWS.map((a, i) => {
            const fromRect = absMap.get(a.from);
            const toRect = absMap.get(a.to);
            if (!fromRect || !toRect) return null;
            const fs = a.fromSide || "bottom";
            const ts = a.toSide || "top";
            const color = a.color || "#888";
            const p1 = anchorPoint(fromRect, fs);
            const p2 = anchorPoint(toRect, ts);
            const d = buildPath(p1, fs, p2, ts);
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray={a.dashed ? "6 3" : undefined}
                markerEnd={`url(#arrow-${color.replace("#", "")})`}
              />
            );
          })}
        </svg>

        {/* Box layer */}
        {BOXES.map((box) => renderBox(box))}
      </div>
    </div>
  );
}
