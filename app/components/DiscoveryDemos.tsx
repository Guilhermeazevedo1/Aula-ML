"use client";

import { useEffect, useMemo, useState } from "react";

type Dot = { x: number; y: number };
type Center = Dot;

const clusterPoints: Dot[] = Array.from({ length: 72 }, (_, index) => {
  const group = index % 4;
  const centers = [{ x: 22, y: 29 }, { x: 72, y: 28 }, { x: 50, y: 72 }, { x: 82, y: 76 }];
  const angle = index * 2.13;
  const radius = 4 + ((index * 11) % 14);
  return { x: centers[group].x + Math.cos(angle) * radius, y: centers[group].y + Math.sin(angle) * radius * .72 };
});

const targetCenters = [{ x: 22, y: 29 }, { x: 72, y: 28 }, { x: 50, y: 72 }, { x: 82, y: 76 }, { x: 35, y: 55 }];
const initialCenters = [{ x: 16, y: 82 }, { x: 42, y: 18 }, { x: 88, y: 48 }, { x: 68, y: 88 }, { x: 35, y: 48 }];

function nearest(point: Dot, centers: Center[]) {
  let best = 0;
  let bestDistance = Infinity;
  centers.forEach((center, index) => {
    const distance = Math.hypot(point.x - center.x, point.y - center.y);
    if (distance < bestDistance) { bestDistance = distance; best = index; }
  });
  return best;
}

export function ClusteringIntro() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="clustering-intro">
      <svg className="plot" viewBox="0 0 620 340" role="img" aria-label="Nuvem de pontos formando grupos sem rótulos">
        <title>Dados sem rótulos com estrutura de grupos</title>
        {clusterPoints.map((point, index) => <g key={index} transform={`translate(${35 + point.x * 5.5} ${315 - point.y * 2.9})`}><circle className={revealed ? `cluster-point cluster-${index % 4}` : "cluster-point unknown"} r="8" /><text className="point-symbol" textAnchor="middle" dy="4">{revealed ? ["●", "◆", "▲", "■"][index % 4] : "·"}</text></g>)}
      </svg>
      <div className="reveal-line"><span>Sem conhecer as respostas, você percebe grupos?</span><button className="primary-button" type="button" onClick={() => setRevealed(true)}>{revealed ? "CLUSTERING" : "Revelar estrutura"}</button></div>
    </div>
  );
}

export function KMeansDemo() {
  const [k, setK] = useState(3);
  const [iteration, setIteration] = useState(0);
  const [running, setRunning] = useState(false);
  const progress = Math.min(1, iteration / 4);
  const centers = initialCenters.slice(0, k).map((center, index) => ({ x: center.x + (targetCenters[index].x - center.x) * progress, y: center.y + (targetCenters[index].y - center.y) * progress }));
  const assignments = clusterPoints.map((point) => nearest(point, centers));

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setIteration((value) => {
      if (value >= 4) { setRunning(false); return value; }
      return value + 1;
    }), 650);
    return () => window.clearInterval(timer);
  }, [running]);

  const steps = ["Selecionar centróides", "Associar pontos", "Mover centróides", "Repetir", "Convergência"];
  function reset(nextK = k) { setK(nextK); setIteration(0); setRunning(false); }
  return (
    <div className="kmeans-demo">
      <div className="step-indicator">{steps.map((step, index) => <span className={index === iteration ? "active" : index < iteration ? "done" : ""} key={step}><b>{index + 1}</b>{step}</span>)}</div>
      <svg className="plot" viewBox="0 0 620 360" role="img" aria-label={`K-Means com ${k} grupos na iteração ${iteration}`}>
        <title>Animação do algoritmo K-Means</title>
        {clusterPoints.map((point, index) => <circle className={`cluster-point cluster-${assignments[index]}`} key={index} cx={35 + point.x * 5.5} cy={330 - point.y * 3} r="7" />)}
        {centers.map((center, index) => <g key={index} transform={`translate(${35 + center.x * 5.5} ${330 - center.y * 3})`}><circle className={`centroid cluster-${index}`} r="16" /><text textAnchor="middle" dy="5">×</text></g>)}
      </svg>
      <div className="demo-toolbar split-toolbar">
        <label className="range-control"><span>Número de grupos <strong>K = {k}</strong></span><input type="range" min="2" max="5" value={k} onChange={(event) => reset(Number(event.target.value))} /></label>
        <button type="button" onClick={() => setIteration((value) => Math.min(4, value + 1))}>Próxima iteração</button>
        <button className="primary-button" type="button" onClick={() => setRunning(true)} disabled={iteration >= 4}>Executar</button>
        <button className="text-button" type="button" onClick={() => reset()}>Resetar</button>
      </div>
      <p className="closing-line">O K-Means encontra os centros. Mas <strong>quem escolhe K?</strong></p>
    </div>
  );
}

const moonPoints: Dot[] = [
  ...Array.from({ length: 42 }, (_, index) => {
    const t = Math.PI * index / 41;
    return { x: 27 + Math.cos(t) * 23 + ((index * 7) % 5 - 2), y: 48 + Math.sin(t) * 27 + ((index * 11) % 5 - 2) };
  }),
  ...Array.from({ length: 42 }, (_, index) => {
    const t = Math.PI * index / 41;
    return { x: 65 - Math.cos(t) * 23 + ((index * 13) % 5 - 2), y: 52 - Math.sin(t) * 27 + ((index * 17) % 5 - 2) };
  }),
  { x: 8, y: 82 }, { x: 92, y: 17 }, { x: 51, y: 93 },
];

function dbscan(points: Dot[], eps: number, minSamples: number) {
  const labels = Array(points.length).fill(-2);
  const neighbors = points.map((point) => points.map((candidate, index) => Math.hypot(point.x - candidate.x, point.y - candidate.y) <= eps ? index : -1).filter((index) => index >= 0));
  let cluster = 0;
  for (let index = 0; index < points.length; index++) {
    if (labels[index] !== -2) continue;
    if (neighbors[index].length < minSamples) { labels[index] = -1; continue; }
    labels[index] = cluster;
    const queue = [...neighbors[index]];
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const current = queue[cursor];
      if (labels[current] === -1) labels[current] = cluster;
      if (labels[current] !== -2) continue;
      labels[current] = cluster;
      if (neighbors[current].length >= minSamples) neighbors[current].forEach((neighbor) => { if (!queue.includes(neighbor)) queue.push(neighbor); });
    }
    cluster++;
  }
  return { labels, count: cluster };
}

export function DbscanDemo() {
  const [eps, setEps] = useState(9);
  const [minSamples, setMinSamples] = useState(4);
  const result = useMemo(() => dbscan(moonPoints, eps, minSamples), [eps, minSamples]);
  const noise = result.labels.filter((label) => label === -1).length;
  return (
    <div className="dbscan-demo">
      <div className="comparison-plots">
        <div><span>K-MEANS: divide pelo centro</span><svg className="plot" viewBox="0 0 420 300" role="img" aria-label="K-Means separando duas luas de forma inadequada">{moonPoints.map((point, index) => <circle key={index} className={`cluster-point cluster-${point.x < 50 ? 0 : 1}`} cx={20 + point.x * 3.8} cy={280 - point.y * 2.55} r="6" />)}</svg></div>
        <div><span>DBSCAN: conecta densidades</span><svg className="plot" viewBox="0 0 420 300" role="img" aria-label={`DBSCAN encontrando ${result.count} grupos e ${noise} outliers`}>{moonPoints.map((point, index) => <g key={index} transform={`translate(${20 + point.x * 3.8} ${280 - point.y * 2.55})`}><circle className={result.labels[index] === -1 ? "cluster-point outlier" : `cluster-point cluster-${result.labels[index] % 5}`} r="6" />{result.labels[index] === -1 && <text className="point-symbol" textAnchor="middle" dy="4">×</text>}</g>)}</svg></div>
      </div>
      <div className="demo-toolbar split-toolbar"><label className="range-control"><span>Raio da vizinhança <strong>eps {eps}</strong></span><input type="range" min="5" max="15" value={eps} onChange={(event) => setEps(Number(event.target.value))} /></label><label className="range-control"><span>Mínimo de vizinhos <strong>{minSamples}</strong></span><input type="range" min="2" max="8" value={minSamples} onChange={(event) => setMinSamples(Number(event.target.value))} /></label></div>
      <div className="dbscan-status"><span><strong>{result.count}</strong> grupos</span><span><strong>{noise}</strong> outliers</span><p>E se os grupos não forem circulares?</p></div>
    </div>
  );
}

const pcaPoints = Array.from({ length: 40 }, (_, index) => {
  const t = index / 39;
  return { x: t * 2 - 1, y: Math.sin(index * 1.7) * .22, z: Math.cos(index * .83) * .28, c: index < 20 ? 0 : 1 };
});

export function PcaDemo() {
  const [projection, setProjection] = useState(0);
  return (
    <div className="pca-demo">
      <div className="feature-cloud"><div className="feature-list">{["idade", "renda", "experiência", "horas de estudo", "nota", "frequência", "sono"].map((feature, index) => <span key={feature} style={{ opacity: Math.max(.2, 1 - projection / 120 * index) }}>{feature}</span>)}</div><strong>{projection < 50 ? "MUITAS DIMENSÕES" : "NOVA REPRESENTAÇÃO"}</strong></div>
      <svg className="plot" viewBox="0 0 620 340" role="img" aria-label="Nuvem de dados sendo projetada em duas componentes">
        <title>PCA reduzindo muitas dimensões para duas</title>
        <line className="principal-axis" x1="75" y1="276" x2="552" y2="70" /><line className="secondary-axis" x1="182" y1="54" x2="446" y2="292" />
        {pcaPoints.map((point, index) => {
          const originalX = 305 + point.x * 205 + point.z * 80;
          const originalY = 175 - point.x * 78 + point.y * 170 - point.z * 45;
          const projectedX = 305 + point.x * 232;
          const projectedY = 175 - point.x * 100 + point.y * 24;
          const t = projection / 100;
          return <circle key={index} className={`data-point class-${point.c}`} cx={originalX * (1 - t) + projectedX * t} cy={originalY * (1 - t) + projectedY * t} r="8" />;
        })}
      </svg>
      <label className="range-control"><span>Projetar para 2D <strong>{projection}%</strong></span><input type="range" min="0" max="100" value={projection} onChange={(event) => setProjection(Number(event.target.value))} /></label>
      <p className="closing-line"><strong>PCA</strong> encontra novas direções que preservam o máximo possível da informação.</p>
    </div>
  );
}
