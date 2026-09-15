import { mkdir, writeFile } from "node:fs/promises";

const cells = [];
const lines = (text) => text.trim().split("\n").map((line) => `${line}\n`);
const md = (text) => cells.push({ cell_type: "markdown", metadata: {}, source: lines(text) });
const code = (text) => cells.push({ cell_type: "code", execution_count: null, metadata: {}, outputs: [], source: lines(text) });

md(`# Aprendizagem de Máquina — aula de 16/09

Este notebook acompanha a apresentação **“Se uma máquina pode aprender... como ela aprende?”**.

A proposta é repetir sempre o mesmo ciclo: observar o problema, preparar dados, treinar, prever, avaliar e interpretar. Execute as células na ordem.`);

md(`## 00 — Preparação

Usaremos apenas datasets locais do Scikit-learn. Assim, a aula funciona sem internet.`);
code(`import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.datasets import (
    load_breast_cancer, load_iris, load_wine,
    make_blobs, make_classification, make_moons, make_regression,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)
plt.rcParams["figure.figsize"] = (8, 4.5)

print("Ambiente pronto.")`);

md(`## 01 — Regressão Linear

**Problema:** prever um valor numérico. A reta resume a tendência dos exemplos.`);
code(`from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

X, y = make_regression(n_samples=120, n_features=1, noise=18, random_state=RANDOM_STATE)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE
)

model = LinearRegression()
model.fit(X_train, y_train)
pred = model.predict(X_test)

mse = mean_squared_error(y_test, pred)
print("MAE :", round(mean_absolute_error(y_test, pred), 2))
print("MSE :", round(mse, 2))
print("RMSE:", round(np.sqrt(mse), 2))
print("R²  :", round(r2_score(y_test, pred), 2))

order = np.argsort(X_test[:, 0])
plt.scatter(X_test[:, 0], y_test, label="real")
plt.plot(X_test[order, 0], pred[order], color="tomato", label="reta aprendida")
plt.title("Regressão Linear")
plt.legend()
plt.show()`);
md(`**Conclusão:** a linha não precisa tocar todos os pontos. Ela precisa capturar uma tendência que funcione em dados novos.`);

md(`## 02 — K-Nearest Neighbors

**Problema:** de qual classe um novo ponto parece fazer parte? O KNN consulta os vizinhos mais próximos.`);
code(`from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

X, y = make_moons(n_samples=260, noise=0.22, random_state=RANDOM_STATE)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=RANDOM_STATE
)

rows = []
for k in [1, 3, 5, 15]:
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    model = KNeighborsClassifier(n_neighbors=k)
    model.fit(X_train_scaled, y_train)
    pred = model.predict(X_test_scaled)
    rows.append({"k": k, "accuracy": accuracy_score(y_test, pred)})

pd.DataFrame(rows)`);
md(`**Observe:** K muito pequeno reage a detalhes locais; K grande suaviza a decisão e pode ignorar estruturas úteis.`);

md(`## 03 — Decision Tree

Uma árvore aprende perguntas que dividem os exemplos. A profundidade controla quantas perguntas podem ser feitas.`);
code(`from sklearn.tree import DecisionTreeClassifier, plot_tree

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, stratify=iris.target, random_state=RANDOM_STATE
)

fig, axes = plt.subplots(1, 3, figsize=(16, 4))
for ax, depth in zip(axes, [1, 3, None]):
    model = DecisionTreeClassifier(max_depth=depth, random_state=RANDOM_STATE)
    model.fit(X_train, y_train)
    plot_tree(
        model, ax=ax, max_depth=2, filled=True,
        feature_names=iris.feature_names, class_names=iris.target_names,
    )
    ax.set_title(f"max_depth={depth} | teste={model.score(X_test, y_test):.2f}")
plt.tight_layout()
plt.show()`);
md(`**Conclusão:** profundidade sem limite aumenta a complexidade e pode fazer a árvore memorizar detalhes do treino.`);

md(`## 04 — Random Forest

Várias árvores treinadas com variações dos dados votam juntas.`);
code(`from sklearn.ensemble import RandomForestClassifier

tree = DecisionTreeClassifier(random_state=RANDOM_STATE)
forest = RandomForestClassifier(n_estimators=150, random_state=RANDOM_STATE)

for name, model in {"Árvore": tree, "Random Forest": forest}.items():
    model.fit(X_train, y_train)
    print(name, "accuracy:", round(model.score(X_test, y_test), 3))

pd.Series(
    forest.feature_importances_, index=iris.feature_names
).sort_values().plot.barh(title="Importância das features")
plt.show()`);
md(`**Conclusão:** combinar árvores tende a reduzir decisões frágeis de uma única árvore.`);

md(`## 05 — Naive Bayes

O modelo combina evidências e produz tanto uma classe quanto probabilidades por classe.`);
code(`from sklearn.naive_bayes import GaussianNB

X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, stratify=iris.target, random_state=RANDOM_STATE
)

model = GaussianNB()
model.fit(X_train, y_train)

print("Classe prevista:", iris.target_names[model.predict(X_test[:1])[0]])
print("Probabilidades:")
display(pd.DataFrame(model.predict_proba(X_test[:1]), columns=iris.target_names).round(3))`);
md(`**Conclusão:** \`predict()\` entrega a decisão; \`predict_proba()\` mostra quanta confiança relativa existe em cada classe.`);

md(`## 06 — Avaliação de Classificação

Vamos usar um conjunto desbalanceado para mostrar por que accuracy pode enganar.`);
code(`from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

X, y = make_classification(
    n_samples=1000, n_features=8, weights=[0.95, 0.05],
    flip_y=0, random_state=RANDOM_STATE,
)
y_pred_ruim = np.zeros_like(y)

print("Accuracy :", accuracy_score(y, y_pred_ruim))
print("Precision:", precision_score(y, y_pred_ruim, zero_division=0))
print("Recall   :", recall_score(y, y_pred_ruim))
print("F1       :", f1_score(y, y_pred_ruim))`);
md(`**Conclusão:** o modelo acertou 95% e, ainda assim, não encontrou nenhum caso positivo.`);

md(`## 07 — Matriz de Confusão

A matriz separa acertos e erros em TP, FP, FN e TN.`);
code(`from sklearn.metrics import ConfusionMatrixDisplay, classification_report

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=RANDOM_STATE
)
model = RandomForestClassifier(n_estimators=120, class_weight="balanced", random_state=RANDOM_STATE)
model.fit(X_train, y_train)
pred = model.predict(X_test)

print(classification_report(y_test, pred, target_names=["normal", "positivo"]))
ConfusionMatrixDisplay.from_predictions(y_test, pred, display_labels=["normal", "positivo"], cmap="Blues")
plt.title("Matriz de confusão")
plt.show()`);

md(`## 08 — Precision, Recall e F1

Alterar o threshold muda quais probabilidades viram previsões positivas.`);
code(`proba = model.predict_proba(X_test)[:, 1]
rows = []

for threshold in [0.2, 0.4, 0.5, 0.7, 0.9]:
    pred_threshold = (proba >= threshold).astype(int)
    rows.append({
        "threshold": threshold,
        "precision": precision_score(y_test, pred_threshold, zero_division=0),
        "recall": recall_score(y_test, pred_threshold, zero_division=0),
        "f1": f1_score(y_test, pred_threshold, zero_division=0),
    })

pd.DataFrame(rows).round(3)`);
md(`**Pergunta:** em uma triagem médica, qual custa mais: um falso alarme ou deixar um caso passar? A resposta orienta a métrica.`);

md(`## 09 — Avaliação de Regressão

MAE, MSE, RMSE e R² contam histórias diferentes sobre os mesmos erros.`);
code(`X, y = make_regression(n_samples=180, n_features=1, noise=25, random_state=RANDOM_STATE)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=RANDOM_STATE)
model = LinearRegression().fit(X_train, y_train)
pred = model.predict(X_test)

mse = mean_squared_error(y_test, pred)
pd.Series({
    "MAE": mean_absolute_error(y_test, pred),
    "MSE": mse,
    "RMSE": np.sqrt(mse),
    "R²": r2_score(y_test, pred),
}).round(3)`);

md(`## 10 — Overfitting

Compare o desempenho da árvore no treino e no teste conforme a profundidade cresce.`);
code(`X, y = make_classification(
    n_samples=550, n_features=10, n_informative=5,
    flip_y=0.12, random_state=RANDOM_STATE,
)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, stratify=y, random_state=RANDOM_STATE
)

rows = []
for depth in range(1, 16):
    model = DecisionTreeClassifier(max_depth=depth, random_state=RANDOM_STATE)
    model.fit(X_train, y_train)
    rows.append({"profundidade": depth, "treino": model.score(X_train, y_train), "teste": model.score(X_test, y_test)})

pd.DataFrame(rows).set_index("profundidade").plot(marker="o")
plt.ylabel("accuracy")
plt.title("Complexidade: treino vs teste")
plt.show()`);
md(`**Observe:** o treino continua melhorando, mas o teste pode parar de melhorar ou piorar. Isso é perda de generalização.`);

md(`## 11 — K-Means

Sem usar rótulos, o algoritmo associa pontos a centróides e move os centros repetidamente.`);
code(`from sklearn.cluster import KMeans

X, _ = make_blobs(n_samples=360, centers=3, cluster_std=1.05, random_state=RANDOM_STATE)
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

for ax, k in zip(axes, [2, 3, 4]):
    model = KMeans(n_clusters=k, n_init=10, random_state=RANDOM_STATE)
    clusters = model.fit_predict(X)
    ax.scatter(X[:, 0], X[:, 1], c=clusters, cmap="viridis", s=18)
    ax.scatter(*model.cluster_centers_.T, marker="X", c="red", s=160)
    ax.set_title(f"K = {k}")
plt.show()`);
md(`**Pergunta:** o K-Means encontrou grupos, mas quem escolheu a quantidade de grupos? Nós escolhemos K.`);

md(`## 12 — DBSCAN

Em formas irregulares, proximidade e densidade podem ser mais úteis que centros.`);
code(`from sklearn.cluster import DBSCAN

X, _ = make_moons(n_samples=420, noise=0.08, random_state=RANDOM_STATE)
X_scaled = StandardScaler().fit_transform(X)

kmeans_labels = KMeans(n_clusters=2, n_init=10, random_state=RANDOM_STATE).fit_predict(X_scaled)
dbscan_labels = DBSCAN(eps=0.25, min_samples=6).fit_predict(X_scaled)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].scatter(*X_scaled.T, c=kmeans_labels, cmap="viridis", s=18)
axes[0].set_title("K-Means")
axes[1].scatter(*X_scaled.T, c=dbscan_labels, cmap="viridis", s=18)
axes[1].set_title("DBSCAN (-1 indica outlier)")
plt.show()`);

md(`## 13 — PCA

O PCA cria novas direções que preservam o máximo possível da variação dos dados.`);
code(`from sklearn.decomposition import PCA

wine = load_wine()
X_scaled = StandardScaler().fit_transform(wine.data)
X_2d = PCA(n_components=2).fit_transform(X_scaled)

plt.scatter(X_2d[:, 0], X_2d[:, 1], c=wine.target, cmap="viridis")
plt.xlabel("Componente principal 1")
plt.ylabel("Componente principal 2")
plt.title("13 features representadas em 2 dimensões")
plt.show()`);
md(`**Conclusão:** cada ponto continua sendo a mesma amostra, mas agora é descrito por duas novas coordenadas.`);

md(`## 14 — Rede Neural com MLPClassifier

\`hidden_layer_sizes\` define quantos neurônios existem em cada camada oculta.`);
code(`from sklearn.neural_network import MLPClassifier
from sklearn.inspection import DecisionBoundaryDisplay

X, y = make_moons(n_samples=420, noise=0.2, random_state=RANDOM_STATE)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=RANDOM_STATE)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = MLPClassifier(hidden_layer_sizes=(16, 8), max_iter=1000, random_state=RANDOM_STATE)
model.fit(X_train_scaled, y_train)
print("Accuracy:", round(model.score(X_test_scaled, y_test), 3))

DecisionBoundaryDisplay.from_estimator(model, X_train_scaled, alpha=0.3)
plt.scatter(*X_train_scaled.T, c=y_train, edgecolor="white", s=24)
plt.title("MLPClassifier com camadas (16, 8)")
plt.show()`);

md(`## 15 — Introdução prática a Deep Learning (opcional)

Keras é um framework específico para redes profundas. Esta célula é opcional porque TensorFlow é uma dependência grande e não está no \`requirements.txt\` principal.

Para executá-la: \`pip install tensorflow\`.`);
code(`# Célula opcional
try:
    from tensorflow import keras

    deep_model = keras.Sequential([
        keras.layers.Input(shape=(2,)),
        keras.layers.Dense(12, activation="relu"),
        keras.layers.Dense(8, activation="relu"),
        keras.layers.Dense(1, activation="sigmoid"),
    ])
    deep_model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
    deep_model.fit(X_train_scaled, y_train, epochs=40, verbose=0)
    print(deep_model.evaluate(X_test_scaled, y_test, verbose=0))
except ImportError:
    print("TensorFlow não instalado. Esta demonstração é opcional.")`);

md(`## 16 — AutoML com FLAML

O FLAML testa algoritmos e configurações respeitando um orçamento de tempo. Ele não decide o problema, o target ou a métrica por nós.`);
code(`from flaml import AutoML

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=RANDOM_STATE
)

automl = AutoML()
automl.fit(
    X_train=X_train,
    y_train=y_train,
    task="classification",
    metric="accuracy",
    time_budget=10,
    verbose=0,
)

pred = automl.predict(X_test)
print("Melhor estimador:", automl.best_estimator)
print("Melhor configuração:", automl.best_config)
print("Accuracy:", round(accuracy_score(y_test, pred), 3))`);

md(`## 17 — Comparação Final

Execute vários modelos clássicos no mesmo conjunto de treino e teste. Depois discuta: qual você escolheria e por quê?`);
code(`from sklearn.linear_model import LogisticRegression

models = {
    "Logistic Regression": LogisticRegression(max_iter=2000),
    "KNN": KNeighborsClassifier(n_neighbors=7),
    "Decision Tree": DecisionTreeClassifier(max_depth=4, random_state=RANDOM_STATE),
    "Random Forest": RandomForestClassifier(n_estimators=150, random_state=RANDOM_STATE),
    "Naive Bayes": GaussianNB(),
}

rows = []
for name, model in models.items():
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    rows.append({
        "modelo": name,
        "accuracy": accuracy_score(y_test, pred),
        "precision": precision_score(y_test, pred),
        "recall": recall_score(y_test, pred),
        "f1": f1_score(y_test, pred),
    })

pd.DataFrame(rows).sort_values("f1", ascending=False).round(3)`);
md(`## Encerramento

Dados não são conhecimento. Aprender é encontrar uma função, estrutura ou estratégia que **generalize** para algo que a máquina ainda não viu.

Perguntas para a turma:

- Qual modelo você escolheria se precisasse explicar cada decisão?
- Qual erro é mais grave no seu problema?
- O que mudaria se os dados de produção fossem diferentes dos dados de treino?
- O AutoML encontrou um modelo. Isso basta para confiar nele?`);

const notebook = {
  cells,
  metadata: {
    kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
    language_info: { name: "python", version: "3.11", mimetype: "text/x-python", codemirror_mode: { name: "ipython", version: 3 }, file_extension: ".py", nbconvert_exporter: "python", pygments_lexer: "ipython3" },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

await mkdir("notebooks", { recursive: true });
await mkdir("public/notebooks", { recursive: true });
const output = `${JSON.stringify(notebook, null, 2)}\n`;
await Promise.all([
  writeFile("notebooks/aprendizagem_de_maquina.ipynb", output, "utf8"),
  writeFile("public/notebooks/aprendizagem_de_maquina.ipynb", output, "utf8"),
]);

console.log(`Notebook criado com ${cells.length} células.`);
