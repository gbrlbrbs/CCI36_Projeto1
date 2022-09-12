# CCI-36 - Tangram

Equipe: Gabriel Martinz e Marina Moreira

## Como rodar

É necessário ter o [Node](https://nodejs.org/en/) com o `npm` instalado. Após clonar o repositório, deve-se instalar os pacotes listados no `package.json` com:

```npm install```

No `root` do reposítório. Após isso, basta escrever o comando

```npm run dev```

Para iniciar o servidor local com o jogo.

## Relatório

O jogo foi implementado no [three.js](https://threejs.org/). Isso possibilitou algumas facilidades na hora de implementar funcionalidades pedidas:

1. Ao invés de checar se o ponto do cursor do mouse está sobre um polígono, foi utilizado um *raycaster* que já conseguia retornar as intersecções com *meshes*;

2. Para encontrar a área de intersecção entre dois polígonos, foi utilizado um algoritmo de *clipping* (o algoritmo de [Sutherland-Hodgman](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)) para encontrar o polígono da intersecção e calcular a área dele pela [shoelace formula](https://en.wikipedia.org/wiki/Shoelace_formula);

3. O tratamento de eventos está em *event listeners* no código em JavaScript. O final do jogo acontece a partir de checagens na função `animate()`;

4. A rotação foi resolvida utilizando as *bounding boxes* das *meshes*;

5. Foi necessário cuidado para assegurar que a movimentação e a rotação aconteçam apenas em um plano.

Também houveram problemas na parte de renderizar durante o projeto, devido a falta de documentação do three.js nesse quesito.