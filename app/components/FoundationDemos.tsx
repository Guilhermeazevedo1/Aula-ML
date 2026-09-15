"use client";

import { useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };

const supervisedPoints = [
  { x: 18, y: 30, c: 0 }, { x: 24, y: 54, c: 0 }, { x: 31, y: 42, c: 0 },
  { x: 37, y: 67, c: 0 }, { x: 42, y: 28, c: 0 }, { x: 56, y: 72, c: 1 },
  { x: 64, y: 48, c: 1 }, { x: 71, y: 69, c: 1 }, { x: 79, y: 42, c: 1 },
  { x: 84, y: 76, c: 1 }, { x: 52, y: 37, c: 1 }, { x: 25, y: 74, c: 0 },
];

const knnPoints = [
  { x: 15, y: 26, c: 0 }, { x: 22, y: 58, c: 0 }, { x: 28, y: 39, c: 0 },
  { x: 36, y: 72, c: 0 }, { x: 39, y: 48, c: 0 }, { x: 45, y: 22, c: 0 },
  { x: 53, y: 67, c: 1 }, { x: 61, y: 43, c: 1 }, { x: 68, y: 76, c: 1 },
  { x: 73, y: 29, c: 1 }, { x: 79, y: 57, c: 1 }, { x: 88, y: 70, c: 1 },
  { x: 84, y: 38, c: 1 }, { x: 55, y: 30, c: 1 }, { x: 31, y: 83, c: 0 },
];

export function IntroPipeline() {
  const items = ["DADOS", "PADRÕES", "MODELO", "NOVOS DADOS", "PREDIÇÃO"];
  return (
    <div className="pipeline" aria-label="Dados geram padrões, um modelo e predições">
      {items.map((item, index) => (
        <div className="pipeline-step" key={item} style={{ animationDelay: `${index * 120}ms` }}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{item}</strong>
          {index < items.length - 1 && <i aria-hidden="true">→</i>}
        </div>
      ))}
    </div>
  );
}

function LearningScatter({ labeled }: { labeled: boolean }) {
  return (
    <svg className="plot" viewBox="0 0 520 300" role="img" aria-label={labeled ? "Pontos com classes conhecidas" : "Pontos sem rótulos formando dois grupos"}>
      <title>{labeled ? "Exemplos rotulados" : "Padrões sem respostas"}</title>
      <path className="plot-grid" d="M50 20V265H500M50 80H500M50 140H500M50 200H500" />
      {supervisedPoints.map((point, index) => (
        <g key={index} transform={`translate(${50 + point.x * 4.3} ${270 - point.y * 2.35})`}>
          <circle className={labeled ? `data-point class-${point.c}` : "data-point unlabeled"} r="9" />
          {labeled && <text className="point-symbol" textAnchor="middle" dy="4">{point.c === 0 ? "●" : "◆"}</text>}
        </g>
      ))}
      <text className="axis-label" x="450" y="292">feature 1</text>
      <text className="axis-label" x="8" y="26">feature 2</text>
    </svg>
  );
}

const maze = {
  cols: 6,
  rows: 4,
  obstacles: new Set([8, 9, 15, 22]),
  goal: 23,
};

export function ReinforcementBoard({ compact = false }: { compact?: boolean }) {
  const [agent, setAgent] = useState(0);
  const [reward, setReward] = useState(0);
  const [history, setHistory] = useState<number[]>([0]);

  function move(dx: number, dy: number) {
    const x = agent % maze.cols;
    const y = Math.floor(agent / maze.cols);
    const nextX = Math.max(0, Math.min(maze.cols - 1, x + dx));
    const nextY = Math.max(0, Math.min(maze.rows - 1, y + dy));
    const next = nextY * maze.cols + nextX;
    if (next === agent || maze.obstacles.has(next)) {
      setReward(-10);
      return;
    }
    setAgent(next);
    setHistory((items) => [...items.slice(-8), next]);
    setReward(next === maze.goal ? 100 : -1);
  }

  function reset() {
    setAgent(0);
    setReward(0);
    setHistory([0]);
  }

  return (
    <div className={`reinforcement-demo ${compact ? "compact-demo" : ""}`}>
      <div className="maze" aria-label="Ambiente com agente, obstáculos e objetivo">
        {Array.from({ length: maze.cols * maze.rows }, (_, index) => (
          <div
            className={`maze-cell ${maze.obstacles.has(index) ? "obstacle" : ""} ${index === maze.goal ? "goal" : ""}`}
            key={index}
          >
            {index === agent && <span className="agent" aria-label="Agente">A</span>}
            {index === maze.goal && <span aria-hidden="true">◎</span>}
          </div>
        ))}
      </div>
      <div className="agent-panel">
        <div className="reward-readout">
          <span>recompensa</span>
          <strong className={reward < 0 ? "negative" : reward > 0 ? "positive" : ""}>{reward > 0 ? `+${reward}` : reward}</strong>
        </div>
        <div className="direction-pad" aria-label="Mover agente">
          <button type="button" aria-label="Mover para cima" onClick={() => move(0, -1)}>↑</button>
          <button type="button" aria-label="Mover para esquerda" onClick={() => move(-1, 0)}>←</button>
          <button type="button" aria-label="Mover para baixo" onClick={() => move(0, 1)}>↓</button>
          <button type="button" aria-label="Mover para direita" onClick={() => move(1, 0)}>→</button>
        </div>
        <button className="text-button" type="button" onClick={reset}>Resetar</button>
        {!compact && <p>ESTADO → AÇÃO → RECOMPENSA → NOVO ESTADO</p>}
        {!compact && <div className="state-history" aria-label="Últimos estados visitados">{history.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div>}
      </div>
    </div>
  );
}

export function LearningModes() {
  const [mode, setMode] = useState<"supervised" | "unsupervised" | "reinforcement">("supervised");
  return (
    <div className="demo-stack">
      <div className="segmented-control" role="tablist" aria-label="Três formas de aprender">
        {[
          ["supervised", "Supervisionado"],
          ["unsupervised", "Não supervisionado"],
          ["reinforcement", "Reforço"],
        ].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => setMode(id as typeof mode)}>{label}</button>
        ))}
      </div>
      <div className="mode-stage">
        {mode === "supervised" && (
          <>
            <LearningScatter labeled />
            <div className="mode-caption"><strong>Tenho exemplos e respostas.</strong><span><code>X</code> características + <code>y</code> target</span></div>
          </>
        )}
        {mode === "unsupervised" && (
          <>
            <LearningScatter labeled={false} />
            <div className="mode-caption"><strong>Ninguém me disse a resposta.</strong><span>Quais estruturas você percebe?</span></div>
          </>
        )}
        {mode === "reinforcement" && (
          <>
            <ReinforcementBoard compact />
            <div className="mode-caption"><strong>Aprendo pelas consequências.</strong><span>Ações alteram o ambiente e geram recompensas.</span></div>
          </>
        )}
      </div>
    </div>
  );
}

export function ScikitFlow() {
  const [algorithm, setAlgorithm] = useState("LinearRegression()");
  const algorithms = ["LinearRegression()", "KNeighborsClassifier()", "DecisionTreeClassifier()", "RandomForestClassifier()", "GaussianNB()"];
  return (
    <div className="sklearn-demo">
      <div className="algorithm-switcher" aria-label="Escolha um algoritmo">
        {algorithms.map((item) => <button type="button" aria-pressed={algorithm === item} onClick={() => setAlgorithm(item)} key={item}>{item.replace("Classifier", "").replace("Regression", "")}</button>)}
      </div>
      <div className="code-window" aria-label="Padrão de uso do scikit-learn">
        <div><span>01</span><code>model = <mark>{algorithm}</mark></code></div>
        <div><span>02</span><code>model.fit(X_train, y_train)</code></div>
        <div><span>03</span><code>predicao = model.predict(X_test)</code></div>
        <div><span>04</span><code>avaliar(y_test, predicao)</code></div>
      </div>
      <div className="flow-caption"><strong>O algoritmo muda.</strong><strong>O fluxo continua parecido.</strong></div>
    </div>
  );
}

const initialRegressionPoints: Point[] = [
  { x: 0.8, y: 31 }, { x: 1.7, y: 39 }, { x: 2.8, y: 47 }, { x: 4.1, y: 59 },
  { x: 5.4, y: 72 }, { x: 6.5, y: 78 }, { x: 7.6, y: 91 }, { x: 9.1, y: 106 },
];

function regression(points: Point[]) {
  const xMean = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const yMean = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const numerator = points.reduce((sum, point) => sum + (point.x - xMean) * (point.y - yMean), 0);
  const denominator = points.reduce((sum, point) => sum + (point.x - xMean) ** 2, 0) || 1;
  const slope = numerator / denominator;
  return { slope, intercept: yMean - slope * xMean };
}

const rx = (x: number) => 58 + x * 52;
const ry = (y: number) => 294 - (y - 20) * 2.38;

export function LinearRegressionDemo() {
  const [points, setPoints] = useState(initialRegressionPoints);
  const [revealed, setRevealed] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const line = regression(points);
  const prediction = line.intercept + line.slope * 5;

  function fromPointer(clientX: number, clientY: number) {
    const bounds = svgRef.current?.getBoundingClientRect();
    if (!bounds) return { x: 5, y: 70 };
    return {
      x: Math.max(0, Math.min(10, ((clientX - bounds.left) / bounds.width * 620 - 58) / 52)),
      y: Math.max(20, Math.min(120, 20 + (294 - ((clientY - bounds.top) / bounds.height * 340)) / 2.38)),
    };
  }

  function addPoint(event: React.PointerEvent<SVGSVGElement>) {
    if ((event.target as Element).closest("[data-point]") || points.length >= 14) return;
    setPoints((items) => [...items, fromPointer(event.clientX, event.clientY)]);
  }

  function movePoint(event: React.PointerEvent<SVGSVGElement>) {
    if (dragging === null) return;
    const next = fromPointer(event.clientX, event.clientY);
    setPoints((items) => items.map((point, index) => index === dragging ? next : point));
  }

  function reset() {
    setPoints(initialRegressionPoints);
    setRevealed(false);
    setShowErrors(false);
    setDragging(null);
  }

  return (
    <div className="interactive-plot">
      <svg ref={svgRef} className="plot regression-plot" viewBox="0 0 620 340" role="img" aria-label="Experiência profissional e salário com reta ajustável" onPointerDown={addPoint} onPointerMove={movePoint} onPointerUp={() => setDragging(null)} onPointerLeave={() => setDragging(null)}>
        <title>Gráfico interativo de regressão linear</title>
        <path className="plot-grid" d="M58 20V294H594M58 294H594M58 232H594M58 170H594M58 108H594M58 46H594" />
        {[0, 2, 4, 6, 8, 10].map((tick) => <text key={tick} className="axis-label" x={rx(tick)} y="320" textAnchor="middle">{tick}</text>)}
        {[20, 45, 70, 95, 120].map((tick) => <text key={tick} className="axis-label" x="45" y={ry(tick) + 4} textAnchor="end">{tick}k</text>)}
        {revealed && points.map((point, index) => showErrors && <line className="error-line" key={`e-${index}`} x1={rx(point.x)} y1={ry(point.y)} x2={rx(point.x)} y2={ry(line.intercept + line.slope * point.x)} />)}
        {revealed && <line className="regression-line" x1={rx(0)} y1={ry(line.intercept)} x2={rx(10)} y2={ry(line.intercept + line.slope * 10)} />}
        {points.map((point, index) => (
          <circle data-point="true" key={index} className="drag-point" cx={rx(point.x)} cy={ry(point.y)} r="9" onPointerDown={(event) => { event.stopPropagation(); setDragging(index); (event.currentTarget as SVGCircleElement).setPointerCapture(event.pointerId); }} />
        ))}
        {revealed && <g transform={`translate(${rx(5)} ${ry(prediction)})`}><circle className="prediction-point" r="13" /><text className="prediction-label" x="18" y="5">5 anos ≈ R$ {Math.round(prediction)}k</text></g>}
        <text className="axis-label" x="455" y="336">anos de experiência</text>
      </svg>
      <div className="demo-toolbar">
        <button className="primary-button" type="button" onClick={() => setRevealed(true)}>Encontrar uma tendência</button>
        <label className="toggle"><input type="checkbox" checked={showErrors} onChange={(event) => setShowErrors(event.target.checked)} disabled={!revealed} /><span>Mostrar erros</span></label>
        <button className="text-button" type="button" onClick={() => setPoints((items) => items.slice(0, -1))} disabled={points.length <= 3}>Remover ponto</button>
        <button className="text-button" type="button" onClick={reset}>Resetar</button>
      </div>
      <div className="reveal-line" aria-live="polite"><span>Qual seria o salário para 5 anos?</span><strong>{revealed ? "REGRESSÃO LINEAR" : "Pense antes de revelar"}</strong></div>
    </div>
  );
}

function classifyAt(x: number, y: number, k: number) {
  const nearest = knnPoints
    .map((point, index) => ({ ...point, index, distance: Math.hypot(point.x - x, point.y - y) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
  const blue = nearest.filter((point) => point.c === 0).length;
  return { nearest, blue, red: k - blue, result: blue >= k - blue ? 0 : 1 };
}

export function KnnDemo() {
  const [k, setK] = useState(5);
  const [query, setQuery] = useState({ x: 49, y: 48 });
  const [guess, setGuess] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const result = useMemo(() => classifyAt(query.x, query.y, k), [query, k]);
  const neighborIds = new Set(result.nearest.map((point) => point.index));
  const boundary = useMemo(() => Array.from({ length: 96 }, (_, index) => {
    const col = index % 12;
    const row = Math.floor(index / 12);
    const x = 8 + col * 8;
    const y = 9 + row * 12;
    return { x, y, c: classifyAt(x, y, k).result };
  }), [k]);

  function placeQuery(event: React.PointerEvent<SVGSVGElement>) {
    const bounds = svgRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setQuery({ x: Math.max(3, Math.min(97, (event.clientX - bounds.left) / bounds.width * 100)), y: Math.max(3, Math.min(97, 100 - (event.clientY - bounds.top) / bounds.height * 100)) });
    setRevealed(false);
    setGuess(null);
  }

  return (
    <div className="interactive-plot knn-demo">
      <svg ref={svgRef} className="plot" viewBox="0 0 600 340" role="img" aria-label="Classificação por vizinhos próximos" onPointerDown={placeQuery}>
        <title>Laboratório interativo de k vizinhos mais próximos</title>
        {boundary.map((cell, index) => <rect key={index} className={`boundary-cell class-${cell.c}`} x={cell.x * 6 - 24} y={(100 - cell.y) * 3.4 - 10} width="49" height="42" />)}
        {result.nearest.map((point) => <line key={`n-${point.index}`} className="neighbor-line" x1={query.x * 5.4 + 30} y1={(100 - query.y) * 3 + 20} x2={point.x * 5.4 + 30} y2={(100 - point.y) * 3 + 20} />)}
        {knnPoints.map((point, index) => <g key={index} transform={`translate(${point.x * 5.4 + 30} ${(100 - point.y) * 3 + 20})`}><circle className={`data-point class-${point.c} ${neighborIds.has(index) ? "neighbor" : ""}`} r={neighborIds.has(index) ? 11 : 8} /><text className="point-symbol" textAnchor="middle" dy="4">{point.c === 0 ? "●" : "◆"}</text></g>)}
        <g transform={`translate(${query.x * 5.4 + 30} ${(100 - query.y) * 3 + 20})`}><circle className="query-point" r="14" /><text className="query-mark" textAnchor="middle" dy="5">?</text></g>
      </svg>
      <div className="demo-toolbar split-toolbar">
        <label className="range-control"><span>Vizinhos <strong>K = {k}</strong></span><input type="range" min="1" max="15" step="2" value={k} onChange={(event) => { setK(Number(event.target.value)); setRevealed(false); }} /></label>
        <div className="guess-buttons" aria-label="Escolha uma classe"><button type="button" aria-pressed={guess === 0} onClick={() => setGuess(0)}>● Azul</button><button type="button" aria-pressed={guess === 1} onClick={() => setGuess(1)}>◆ Vermelho</button></div>
        <button className="primary-button" type="button" onClick={() => setRevealed(true)}>Revelar</button>
      </div>
      <div className="vote-bar" aria-live="polite"><span>● Azul: <strong>{result.blue}</strong></span><span>◆ Vermelho: <strong>{result.red}</strong></span><b>{revealed ? `K-NEAREST NEIGHBORS → ${result.result === 0 ? "AZUL" : "VERMELHO"}${guess !== null ? (guess === result.result ? " · você acertou" : " · observe os vizinhos") : ""}` : "De qual grupo este ponto parece fazer parte?"}</b></div>
    </div>
  );
}
