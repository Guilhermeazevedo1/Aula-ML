"use client";

import { useMemo, useState } from "react";

export function AccuracyTrap() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="accuracy-trap">
      <div className="transaction-grid" aria-label="Cem transações, cinco fraudulentas">
        {Array.from({ length: 100 }, (_, index) => <span className={index >= 95 ? "fraud" : "normal"} key={index}>{index >= 95 ? "◆" : "●"}</span>)}
      </div>
      <div className="trap-copy">
        <p>100 transações · 95 normais · 5 fraudulentas</p>
        <blockquote>O modelo prevê: <strong>“todas são normais”</strong></blockquote>
        <button className="primary-button" type="button" onClick={() => setRevealed(true)}>Qual é a accuracy?</button>
        {revealed && <div className="trap-answer"><strong>95%</strong><span>Mas encontrou <b>0 de 5</b> fraudes.</span><p>Acertar a maioria não garante que o modelo resolva o problema.</p></div>}
      </div>
    </div>
  );
}

const confusionInfo = {
  TP: ["Verdadeiro positivo", "O modelo disse positivo e estava certo.", "Fraude detectada"],
  FP: ["Falso positivo", "O modelo disse positivo, mas estava errado.", "Compra normal bloqueada"],
  FN: ["Falso negativo", "O modelo disse negativo, mas estava errado.", "Fraude liberada"],
  TN: ["Verdadeiro negativo", "O modelo disse negativo e estava certo.", "Compra normal liberada"],
} as const;

export function ConfusionMatrixDemo() {
  const [selected, setSelected] = useState<keyof typeof confusionInfo>("FN");
  return (
    <div className="confusion-demo">
      <div className="matrix-wrap">
        <span className="matrix-title predicted">PREVISTO</span><span className="matrix-title actual">REAL</span>
        <div className="matrix-grid">
          <span /><strong>Positivo</strong><strong>Negativo</strong>
          <strong>Positivo</strong><button type="button" className="correct" aria-pressed={selected === "TP"} onClick={() => setSelected("TP")}><b>TP</b><small>42</small></button><button type="button" className="error" aria-pressed={selected === "FN"} onClick={() => setSelected("FN")}><b>FN</b><small>8</small></button>
          <strong>Negativo</strong><button type="button" className="error" aria-pressed={selected === "FP"} onClick={() => setSelected("FP")}><b>FP</b><small>5</small></button><button type="button" className="correct" aria-pressed={selected === "TN"} onClick={() => setSelected("TN")}><b>TN</b><small>45</small></button>
        </div>
      </div>
      <div className="matrix-detail" aria-live="polite"><span>{selected}</span><h3>{confusionInfo[selected][0]}</h3><p>{confusionInfo[selected][1]}</p><strong>{confusionInfo[selected][2]}</strong></div>
    </div>
  );
}

const thresholdData = [
  { score: .96, real: 1 }, { score: .91, real: 1 }, { score: .84, real: 0 }, { score: .80, real: 1 },
  { score: .72, real: 0 }, { score: .68, real: 1 }, { score: .61, real: 1 }, { score: .55, real: 0 },
  { score: .47, real: 1 }, { score: .41, real: 0 }, { score: .35, real: 0 }, { score: .29, real: 1 },
  { score: .22, real: 0 }, { score: .16, real: 0 }, { score: .09, real: 0 }, { score: .04, real: 0 },
];

export function ThresholdDemo() {
  const [threshold, setThreshold] = useState(.5);
  const [scenario, setScenario] = useState<"spam" | "cancer">("cancer");
  const metrics = useMemo(() => {
    let tp = 0, fp = 0, fn = 0, tn = 0;
    thresholdData.forEach((item) => {
      const predicted = item.score >= threshold ? 1 : 0;
      if (item.real && predicted) tp++; else if (!item.real && predicted) fp++; else if (item.real && !predicted) fn++; else tn++;
    });
    const precision = tp / (tp + fp || 1);
    const recall = tp / (tp + fn || 1);
    return { tp, fp, fn, tn, precision, recall, f1: 2 * precision * recall / (precision + recall || 1) };
  }, [threshold]);

  return (
    <div className="threshold-demo">
      <div className="scenario-tabs" role="tablist" aria-label="Cenário da avaliação"><button type="button" role="tab" aria-selected={scenario === "spam"} onClick={() => setScenario("spam")}>Filtro de spam</button><button type="button" role="tab" aria-selected={scenario === "cancer"} onClick={() => setScenario("cancer")}>Triagem de câncer</button></div>
      <label className="threshold-control"><span>Threshold <strong>{threshold.toFixed(2)}</strong></span><input type="range" min="0.05" max="0.95" step="0.05" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} /></label>
      <div className="score-axis" aria-label="Casos ordenados por score e threshold atual">
        <div className="threshold-line" style={{ left: `${threshold * 100}%` }}><span>{threshold.toFixed(2)}</span></div>
        {thresholdData.map((item, index) => <div className={`score-case real-${item.real} predicted-${item.score >= threshold ? 1 : 0}`} key={index} style={{ left: `${item.score * 100}%`, top: `${24 + (index % 4) * 42}px` }}><span>{item.real ? "◆" : "●"}</span><small>{item.score.toFixed(2)}</small></div>)}
        <span className="axis-side left">prevê negativo</span><span className="axis-side right">prevê positivo</span>
      </div>
      <div className="metric-strip">
        <div><span>Precision</span><strong>{Math.round(metrics.precision * 100)}%</strong></div>
        <div><span>Recall</span><strong>{Math.round(metrics.recall * 100)}%</strong></div>
        <div><span>F1</span><strong>{Math.round(metrics.f1 * 100)}%</strong></div>
        <div><span>FP / FN</span><strong>{metrics.fp} / {metrics.fn}</strong></div>
      </div>
      <p className="scenario-question">{scenario === "cancer" ? "Um falso negativo pode atrasar um diagnóstico. Aqui, recall costuma merecer atenção especial." : "Um falso positivo manda uma mensagem legítima para o spam. Aqui, precision pode pesar mais."}</p>
    </div>
  );
}

const realValues = [28, 36, 43, 55, 63, 70, 82, 88, 99];
const predictedValues = [31, 32, 47, 53, 58, 74, 78, 101, 94];
const metricText = {
  MAE: ["Erro absoluto médio", "Trata cada distância de forma linear.", "unidade original"],
  MSE: ["Erro quadrático médio", "Amplifica erros grandes ao elevar distâncias ao quadrado.", "unidade²"],
  RMSE: ["Raiz do erro quadrático", "Também pune erros grandes, mas volta à unidade original.", "unidade original"],
  "R²": ["Coeficiente de determinação", "Compara o modelo com a previsão pela média.", "quanto mais perto de 1, melhor"],
} as const;

export function RegressionMetricsDemo() {
  const [metric, setMetric] = useState<keyof typeof metricText>("MAE");
  const errors = realValues.map((value, index) => predictedValues[index] - value);
  const mae = errors.reduce((sum, value) => sum + Math.abs(value), 0) / errors.length;
  const mse = errors.reduce((sum, value) => sum + value ** 2, 0) / errors.length;
  const mean = realValues.reduce((sum, value) => sum + value, 0) / realValues.length;
  const r2 = 1 - errors.reduce((sum, value) => sum + value ** 2, 0) / realValues.reduce((sum, value) => sum + (value - mean) ** 2, 0);
  const values = { MAE: mae, MSE: mse, RMSE: Math.sqrt(mse), "R²": r2 };
  return (
    <div className="regression-metrics-demo">
      <div className="metric-tabs" role="tablist" aria-label="Métricas de regressão">{Object.keys(metricText).map((item) => <button type="button" role="tab" aria-selected={metric === item} onClick={() => setMetric(item as keyof typeof metricText)} key={item}>{item}</button>)}</div>
      <svg className="plot" viewBox="0 0 620 340" role="img" aria-label="Valores reais e previstos com seus erros">
        <title>Comparação de valores reais e previstos</title>
        <path className="plot-grid" d="M52 25V295H596M52 295H596M52 228H596M52 160H596M52 93H596M52 25H596" />
        <line className="perfect-line" x1="65" y1="282" x2="570" y2="35" />
        {realValues.map((real, index) => {
          const x = 55 + real * 5.15;
          const yReal = 300 - real * 2.58;
          const yPred = 300 - predictedValues[index] * 2.58;
          return <g key={real}><line className={metric === "MSE" || metric === "RMSE" ? "metric-error emphasized" : "metric-error"} x1={x} y1={yReal} x2={x} y2={yPred} style={{ strokeWidth: metric === "MSE" ? Math.max(2, Math.abs(errors[index]) / 2) : 3 }} /><circle className="real-point" cx={x} cy={yReal} r="7" /><rect className="predicted-point" x={x - 6} y={yPred - 6} width="12" height="12" /></g>;
        })}
        <text className="axis-label" x="470" y="326">valor real</text><text className="axis-label" x="7" y="24">previsto</text>
      </svg>
      <div className="metric-interpretation"><div><span>{metric}</span><strong>{values[metric].toFixed(metric === "R²" ? 2 : 1)}</strong><small>{metricText[metric][2]}</small></div><p><strong>{metricText[metric][0]}</strong>{metricText[metric][1]}</p></div>
    </div>
  );
}

const fitPoints = Array.from({ length: 22 }, (_, index) => {
  const x = index / 21;
  const noise = (((index * 19) % 13) - 6) * .018;
  return { x, y: .32 + .45 * x + Math.sin(x * 7) * .13 + noise };
});

export function FitDemo() {
  const [complexity, setComplexity] = useState(5);
  const path = useMemo(() => Array.from({ length: 80 }, (_, index) => {
    const x = index / 79;
    const smooth = .32 + .45 * x + Math.sin(x * 7) * .13;
    const under = .43 + .20 * x;
    const over = smooth + Math.sin(x * 38) * .08;
    const t = complexity <= 5 ? (complexity - 1) / 4 : (complexity - 5) / 5;
    const y = complexity <= 5 ? under * (1 - t) + smooth * t : smooth * (1 - t) + over * t;
    return `${index === 0 ? "M" : "L"}${45 + x * 525},${285 - y * 300}`;
  }).join(" "), [complexity]);
  const state = complexity <= 3 ? "UNDERFITTING" : complexity <= 7 ? "GOOD FIT" : "OVERFITTING";
  return (
    <div className="fit-demo">
      <div className="fit-state"><span>complexidade {complexity}/10</span><strong>{state}</strong><small>{state === "UNDERFITTING" ? "simples demais" : state === "GOOD FIT" ? "generaliza bem" : "começa a memorizar"}</small></div>
      <svg className="plot" viewBox="0 0 620 330" role="img" aria-label={`Curva com ${state.toLowerCase()}`}>
        <title>Complexidade do modelo e generalização</title><path className="plot-grid" d="M45 20V290H585M45 290H585" />
        <path className={`fit-curve state-${state.toLowerCase().replace(" ", "-")}`} d={path} />
        {fitPoints.map((point, index) => <circle className="fit-point" key={index} cx={45 + point.x * 525} cy={285 - point.y * 300} r="6" />)}
      </svg>
      <label className="range-control"><span>Complexidade do modelo <strong>{complexity}</strong></span><input type="range" min="1" max="10" value={complexity} onChange={(event) => setComplexity(Number(event.target.value))} /></label>
      <p className="closing-line">O objetivo não é memorizar o treino. É funcionar bem em dados que o modelo ainda não viu.</p>
    </div>
  );
}
