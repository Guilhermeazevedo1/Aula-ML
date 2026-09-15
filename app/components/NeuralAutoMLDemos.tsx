"use client";

import { useEffect, useMemo, useState } from "react";

const nodePositions = {
  input: [56, 116, 176, 236],
  hidden: [46, 96, 146, 196, 246],
  output: [112, 190],
};

export function NeuralNetworkDemo() {
  const [inputs, setInputs] = useState([.7, .3, .9]);
  const weights = [.8, -.45, .62];
  const sum = inputs.reduce((total, value, index) => total + value * weights[index], 0);
  const output = 1 / (1 + Math.exp(-sum));
  return (
    <div className="neural-demo">
      <div className="single-neuron">
        <div className="input-sliders">{inputs.map((value, index) => <label key={index}><span>x{index + 1} <strong>{value.toFixed(1)}</strong></span><input type="range" min="0" max="1" step="0.1" value={value} onChange={(event) => setInputs((items) => items.map((item, itemIndex) => itemIndex === index ? Number(event.target.value) : item))} /></label>)}</div>
        <div className="neuron-equation"><div><span>pesos</span><strong>{weights.map((weight) => weight.toFixed(2)).join(" · ")}</strong></div><i aria-hidden="true">→</i><div><span>soma</span><strong>{sum.toFixed(2)}</strong></div><i aria-hidden="true">→</i><div><span>ativação</span><strong>{output.toFixed(2)}</strong></div></div>
      </div>
      <div className="network-diagram" role="img" aria-label="Um neurônio se expandindo para uma rede com camadas">
        <svg viewBox="0 0 680 310">
          <title>Rede neural com camada de entrada, camada oculta e saída</title>
          {nodePositions.input.flatMap((y, inputIndex) => nodePositions.hidden.map((hiddenY, hiddenIndex) => <line className="neural-edge" key={`i-${inputIndex}-${hiddenIndex}`} x1="100" y1={y} x2="340" y2={hiddenY} style={{ animationDelay: `${(inputIndex + hiddenIndex) * 40}ms` }} />))}
          {nodePositions.hidden.flatMap((y, hiddenIndex) => nodePositions.output.map((outputY, outputIndex) => <line className="neural-edge" key={`h-${hiddenIndex}-${outputIndex}`} x1="340" y1={y} x2="580" y2={outputY} style={{ animationDelay: `${(hiddenIndex + outputIndex + 4) * 40}ms` }} />))}
          {nodePositions.input.map((y, index) => <g key={`i-${y}`}><circle className="neural-node input" cx="100" cy={y} r="16" /><text x="65" y={y + 5}>x{index + 1}</text></g>)}
          {nodePositions.hidden.map((y) => <circle className="neural-node hidden" key={`h-${y}`} cx="340" cy={y} r="16" />)}
          {nodePositions.output.map((y, index) => <g key={`o-${y}`}><circle className="neural-node output" cx="580" cy={y} r="16" /><text x="610" y={y + 5}>y{index + 1}</text></g>)}
          <text className="layer-label" x="74" y="292">ENTRADA</text><text className="layer-label" x="305" y="292">HIDDEN LAYER</text><text className="layer-label" x="558" y="292">SAÍDA</text>
        </svg>
      </div>
      <p className="closing-line">Uma rede neural combina muitos pequenos cálculos organizados em camadas.</p>
    </div>
  );
}

export function DeepLearningDemo() {
  const [layers, setLayers] = useState(3);
  const columns = useMemo(() => Array.from({ length: layers + 2 }, (_, column) => ({
    count: column === 0 ? 5 : column === layers + 1 ? 2 : 4 + (column % 3),
    kind: column === 0 ? "entrada" : column === layers + 1 ? "saída" : `camada ${column}`,
  })), [layers]);
  return (
    <div className="deep-demo">
      <div className="deep-stage" role="img" aria-label={`Rede neural com ${layers} camadas ocultas`}>
        {columns.map((column, index) => <div className="deep-column" key={index}><div>{Array.from({ length: column.count }, (_, node) => <span key={node} />)}</div><small>{column.kind}</small>{index < columns.length - 1 && <i aria-hidden="true">→</i>}</div>)}
      </div>
      <label className="range-control"><span>Camadas ocultas <strong>{layers}</strong></span><input type="range" min="1" max="10" value={layers} onChange={(event) => setLayers(Number(event.target.value))} /></label>
      <div className="ml-family"><div><strong>Machine Learning</strong><span>Regressão · k-NN · Árvores · Random Forest · Bayes</span></div><div><strong>Redes neurais</strong><span>MLPClassifier</span></div><div className={layers >= 5 ? "active" : ""}><strong>Deep Learning</strong><span>PyTorch · TensorFlow · Keras</span></div></div>
    </div>
  );
}

const candidates = [
  { name: "Logistic Regression", base: 73, speed: 1.0 },
  { name: "k-NN", base: 76, speed: .76 },
  { name: "Decision Tree", base: 71, speed: 1.12 },
  { name: "Random Forest", base: 82, speed: .62 },
  { name: "LightGBM", base: 85, speed: .48 },
  { name: "XGBoost", base: 84, speed: .41 },
];

export function AutoMlDemo() {
  const [budget, setBudget] = useState(10);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setElapsed((value) => {
      if (value >= budget) { setRunning(false); return value; }
      return Math.min(budget, value + 1);
    }), 160);
    return () => window.clearInterval(timer);
  }, [running, budget]);

  const ranked = candidates.map((item, index) => ({ ...item, score: Math.min(item.base + 7, item.base + Math.round(Math.min(elapsed, budget) * item.speed / 4) + (index % 2)) })).sort((a, b) => b.score - a.score);
  const progress = budget ? elapsed / budget : 0;
  function start() { setElapsed(0); setRunning(true); }
  return (
    <div className="automl-demo">
      <div className="automl-pipeline"><span>DADOS</span><i>→</i><span>MODELOS</span><i>→</i><span>CONFIGURAÇÕES</span><i>→</i><span>AVALIAÇÃO</span><i>→</i><strong>MELHOR MODELO</strong></div>
      <div className="model-race" aria-label="Modelos competindo por melhor desempenho">{ranked.map((item, index) => <div key={item.name}><span>{item.name}</span><div><i style={{ width: `${Math.max(8, progress * item.score)}%` }} /></div><strong>{elapsed === 0 ? "—" : `${item.score}%`}</strong>{elapsed >= budget && index === 0 && <b>melhor</b>}</div>)}</div>
      <div className="demo-toolbar split-toolbar"><label className="range-control"><span>Tempo da busca <strong>{budget}s</strong></span><input type="range" min="5" max="30" step="5" value={budget} onChange={(event) => { setBudget(Number(event.target.value)); setElapsed(0); setRunning(false); }} /></label><button className="primary-button" type="button" onClick={start} disabled={running}>{running ? `Testando… ${elapsed}s` : "Executar AutoML"}</button></div>
      <div className="flaml-callout"><div><span>LIB DA AULA</span><strong>FLAML</strong><small>Leve, direta e com limite de tempo explícito.</small></div><code>automl.fit(..., time_budget={budget})</code></div>
      <p className="closing-line"><strong>AutoML não elimina a necessidade de entender Machine Learning.</strong> O problema, o target, a métrica, vazamentos e vieses continuam sendo decisões humanas.</p>
    </div>
  );
}

export function ClosingSynthesis() {
  return (
    <div className="closing-synthesis">
      <div className="learning-answer"><div><span>COM EXEMPLOS</span><strong>Aprendizado supervisionado</strong></div><div><span>COM PADRÕES</span><strong>Aprendizado não supervisionado</strong></div><div><span>COM EXPERIÊNCIA</span><strong>Aprendizado por reforço</strong></div></div>
      <div className="closing-pipeline"><span>DADOS</span><i>→</i><span>REPRESENTAÇÃO</span><i>→</i><span>ALGORITMO</span><i>→</i><span>MODELO</span><i>→</i><strong>GENERALIZAÇÃO</strong></div>
      <blockquote>“Dados não são conhecimento.<br />O aprendizado está em encontrar uma função, estrutura ou estratégia que generalize para algo que a máquina ainda não viu.”</blockquote>
      <button className="primary-button" type="button" onClick={() => document.getElementById("capitulo-01")?.scrollIntoView({ behavior: "smooth" })}>Voltar ao início</button>
    </div>
  );
}
