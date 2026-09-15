# Como uma máquina aprende?

Projeto educacional para uma aula introdutória de Aprendizagem de Máquina. Ele combina uma apresentação web interativa com um Jupyter Notebook que reproduz, em Python e Scikit-learn, as ideias exploradas visualmente.

## O que a aula cobre

- Aprendizado supervisionado, não supervisionado e por reforço
- Regressão, classificação e o fluxo do Scikit-learn
- Regressão Linear, KNN, Decision Tree, Random Forest e Naive Bayes
- Accuracy, Precision, Recall, F1, matriz de confusão, MAE, MSE, RMSE e R²
- Underfitting, overfitting e generalização
- K-Means, DBSCAN e PCA
- Redes neurais, Deep Learning e AutoML com FLAML

O site foi pensado para apresentação ao vivo em projetor. Use as setas esquerda/direita ou `Page Up`/`Page Down` para mudar de capítulo, `Espaço` para avançar e `Esc` para abrir a visão geral.

## Estrutura principal

```text
app/
  components/                 demonstrações interativas por tema
  globals.css                 tema, layout e responsividade
  page.tsx                    narrativa dos 24 capítulos
notebooks/
  aprendizagem_de_maquina.ipynb
public/notebooks/             cópia disponível para download no site
scripts/
  build-notebook.mjs          gera e sincroniza o notebook
requirements.txt             dependências Python
```

## Executar o site

Pré-requisito: Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal. O site não usa backend nem APIs externas essenciais e continua funcional sem internet depois que as dependências forem instaladas.

Para validar a versão de produção:

```bash
npm test
```

## Executar o notebook

Pré-requisito: Python 3.10 ou superior.

No Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
jupyter notebook
```

Abra `notebooks/aprendizagem_de_maquina.ipynb`.

A seção de Deep Learning com Keras é opcional para evitar uma instalação pesada. Para executá-la:

```bash
pip install tensorflow
```

## Atualizar o notebook

O arquivo editável que define as células é `scripts/build-notebook.mjs`. Para regenerar a versão de trabalho e a cópia pública:

```bash
npm run notebook:build
```

## Publicar no GitHub Pages

O frontend usa Vite por meio do runtime atual do projeto. Para uma publicação futura no GitHub Pages, gere a pasta `dist` com `npm run build` e configure uma GitHub Action para enviar os arquivos estáticos compatíveis com o destino escolhido. Como esta versão também está preparada para Sites/Cloudflare Workers, preserve a configuração atual em uma branch separada caso adapte a saída para hospedagem estritamente estática.

## Observação sobre AutoML

Nesta aula foi escolhido o **FLAML** porque ele permite limitar explicitamente o tempo da busca e mantém a demonstração curta. AutoML automatiza testes de algoritmos e hiperparâmetros, mas não substitui decisões sobre dados, target, métricas, vazamento de dados, vieses e validade do resultado.
