const canvas = document.getElementById("jogoCanvas");
const ctx = canvas.getContext("2d"); // O ctx é o nosso "pincel" para desenhar na tela

const tamanhoBloco = 20; // Tamanho de cada quadradinho do jogo
const quantidadeBlocos = canvas.width / tamanhoBloco; // 400 / 20 = 20 blocos de largura/altura

// 1. Criando a Cobrinha (uma lista de quadradinhos com posições X e Y)
let cobra = [
    { x: 10, y: 10 } // Ela começa exatamente no meio da grade (bloco 10, 10)
];

// 2. Criando a Frutinha
let fruta = {
    x: Math.floor(Math.random() * quantidadeBlocos),
    y: Math.floor(Math.random() * quantidadeBlocos)
};

// 3. Direção inicial da cobra (andando para a direita)
let direcaoX = 1;
let direcaoY = 0;

// Função principal que roda o jogo inteiro
function rodarJogo() {
    atualizarPosicaoCobra();
    
    if (verificarFimDeJogo()) {
        alert("Game Over! 😢 Sua cobra bateu!");
        reiniciarJogo();
        return;
    }

    desenharTela();
    
    // Faz o jogo rodar de novo daqui a 100 milissegundos (controla a velocidade)
    setTimeout(rodarJogo, 150);
}

// Move a cobra mudando a posição do primeiro bloco
function atualizarPosicaoCobra() {
    let novaX = cobra[0].x + direcaoX;
    let novaY = cobra[0].y + direcaoY;

    // Se passar da parede direita, sai na esquerda
    if (novaX >= quantidadeBlocos) novaX = 0;
    // Se passar da parede esquerda, sai na direita
    if (novaX < 0) novaX = quantidadeBlocos - 1;
    // Se passar do chão, sai no teto
    if (novaY >= quantidadeBlocos) novaY = 0;
    // Se passar do teto, sai no chão
    if (novaY < 0) novaY = quantidadeBlocos - 1;

    const novaCabeca = { x: novaX, y: novaY };
    cobra.unshift(novaCabeca);

    if (novaCabeca.x === fruta.x && novaCabeca.y === fruta.y) {
        fruta = {
            x: Math.floor(Math.random() * quantidadeBlocos),
            y: Math.floor(Math.random() * quantidadeBlocos)
        };
    } else {
        cobra.pop();
    }
}

// Desenha tudo na tela preta do Canvas
function desenharTela() {
    // Limpa a tela inteira antes de redesenhar
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a Cobrinha (Verde neon)
    ctx.fillStyle = "#00ff88";
    cobra.forEach(pedaco => {
        ctx.fillRect(pedaco.x * tamanhoBloco, pedaco.y * tamanhoBloco, tamanhoBloco - 2, tamanhoBloco - 2);
    });

    // Desenha a Frutinha (Vermelha)
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(fruta.x * tamanhoBloco, fruta.y * tamanhoBloco, tamanhoBloco - 2, tamanhoBloco - 2);
}

// Verifica se a cobra bateu nas paredes ou nela mesma
function verificarFimDeJogo() {
    const cabeca = cobra[0];

    // Bateu nas paredes?
    const bateuParedeEsquerda = cabeca.x < 0;
    const bateuParedeDireita = cabeca.x >= quantidadeBlocos;
    const bateuTeto = cabeca.y < 0;
    const bateuChao = cabeca.y >= quantidadeBlocos;

    if (bateuParedeEsquerda || bateuParedeDireita || bateuTeto || bateuChao) {
        return true;
    }

    // Bateu no próprio corpo? (Começa a checar a partir do bloco 1 do corpo, ignorando a cabeça)
    for (let i = 1; i < cobra.length; i++) {
        if (cabeca.x === cobra[i].x && cabeca.y === cobra[i].y) {
            return true;
        }
    }

    return false;
}

// Reseta o jogo do zero
function reiniciarJogo() {
    cobra = [{ x: 10, y: 10 }];
    direcaoX = 1;
    direcaoY = 0;
    rodarJogo();
}

// 4. Escutando os cliques do teclado para mudar a direção
window.addEventListener("keydown", evento => {
    switch (evento.key) {
        case "ArrowUp":
            if (direcaoY === 1) break;
            direcaoX = 0; direcaoY = -1;
            break;
        case "ArrowDown":
            if (direcaoY === -1) break;
            direcaoX = 0; direcaoY = 1;
            break;
        case "ArrowLeft":
            if (direcaoX === 1) break;
            direcaoX = -1; direcaoY = 0;
            break;
        case "ArrowRight":
            if (direcaoX === -1) break;
            direcaoX = 1; direcaoY = 0;
            break;
    }
});

// Inicia o jogo pela primeira vez
rodarJogo();
