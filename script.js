// ============================================================
// MISTERIOS DO SERTAO - Logica do jogo
// ============================================================

// Objeto que guarda as escolhas do jogador
// Usado para verificar se o final secreto deve ser desbloqueado
const escolhasDoJogador = {
    estado: null,       // pernambuco ou bahia (passo 2)
    ruinas: null        // investigar-ruinas ou voltar-vila (passo 6)
};

// Total de passos (sem contar a capa)
const TOTAL_CAPITULOS = 12;

// ============================================================
// DESAFIO: Titulos diferentes na aba do navegador (document.title)
// ============================================================
const titulosDaAba = {
    0:  "Misterios do Sertao",
    1:  "Cap. I - O Chamado",
    2:  "Cap. II - A Encruzilhada",
    3:  "Cap. III - A Chegada",
    4:  "Cap. IV - Dona Cleonice",
    5:  "Cap. V - A Trilha",
    6:  "Cap. VI - As Ruinas",
    7:  "Cap. VII - O Fragmento",
    8:  "Cap. VIII - A Caverna",
    9:  "Cap. IX - No Coracao da Pedra",
    10: "Cap. X - O Enigma",
    11: "Cap. XI - O Tesouro",
    12: "Capitulo Oculto - O Verdadeiro Tesouro"
};

// ============================================================
// DESAFIO: Classe de fundo diferente para cada cenario
// ============================================================
const fundosDoCenario = {
    0:  "fundo-capa",
    1:  "fundo-sertao",
    2:  "fundo-sertao",
    3:  "fundo-sertao",
    4:  "fundo-mata",
    5:  "fundo-mata",
    6:  "fundo-mata",
    7:  "fundo-mata",
    8:  "fundo-caverna",
    9:  "fundo-caverna",
    10: "fundo-caverna",
    11: "fundo-caverna",
    12: "fundo-secreto"
};

// ============================================================
// Anotacoes que vao aparecendo no diario de bordo
// ============================================================
const anotacoesDoDiario = {
    1:  "Recebi uma carta misteriosa do meu bisavo Sebastiao.",
    3:  "Cheguei a uma pequena cidade no nordeste.",
    4:  "Dona Cleonice me deu um conselho importante.",
    6:  "Encontrei ruinas de uma capela antiga.",
    7:  "Achei um fragmento de mapa entre as pedras!",
    8:  "Cheguei a uma caverna escondida atras da cachoeira.",
    11: "Encontrei um pequeno bau com um relicario de Sebastiao.",
    12: "Descobri o verdadeiro tesouro escondido por geracoes!"
};

// ============================================================
// DESAFIO: Mensagens aleatorias no final
// ============================================================
const mensagensFinalComum = [
    "Voce voltou para casa rico de moedas, e mais ainda de historias para contar.",
    "O tesouro era pequeno, mas a jornada valeu cada passo. Ate a proxima!",
    "Sebastiao sorriria do alem vendo sua coragem. Bom trabalho, aventureiro(a)!",
    "Talvez existam outros caminhos nao explorados... Sera que voce encontrou tudo?",
    "A vida e feita de pequenos tesouros. E voce achou um deles."
];

const mensagensFinalSecreto = [
    "Lendas dizem que poucos conseguem chegar ate aqui. Voce e um(a) deles.",
    "O brilho do ouro reflete na sua coragem. Voce desvendou o maior segredo!",
    "Geracoes futuras sabarao da sua historia. Parabens, lenda viva!",
    "Sebastiao deixou tudo isso esperando alguem com sua determinacao.",
    "Voce nao apenas encontrou o tesouro, voce se tornou parte da lenda."
];

// ============================================================
// FUNCAO PRINCIPAL: mostrar um passo da aventura
// ============================================================
function mostrarPasso(numeroPasso) {
    // 1) Esconde todos os passos
    const todosPassos = document.querySelectorAll(".passo");
    todosPassos.forEach(function(passo) {
        passo.classList.remove("ativo");
    });

    // 2) Mostra apenas o passo desejado
    const passoAtual = document.querySelector('[data-passo="' + numeroPasso + '"]');
    if (passoAtual) {
        passoAtual.classList.add("ativo");
    }

    // 3) DESAFIO: Atualiza o titulo da aba do navegador
    document.title = titulosDaAba[numeroPasso] || "Misterios do Sertao";

    // 4) DESAFIO: Muda a classe de fundo do body (cor diferente por cenario)
    document.body.classList.remove(
        "fundo-capa", "fundo-sertao", "fundo-mata",
        "fundo-caverna", "fundo-secreto"
    );
    if (fundosDoCenario[numeroPasso]) {
        document.body.classList.add(fundosDoCenario[numeroPasso]);
    }

    // 5) Atualiza a barra de progresso
    atualizarProgresso(numeroPasso);

    // 6) Adiciona uma anotacao no diario, se houver
    if (anotacoesDoDiario[numeroPasso]) {
        adicionarAoDiario(anotacoesDoDiario[numeroPasso]);
    }

    // 7) Se chegou no final comum, sorteia mensagem
    if (numeroPasso === 11) {
        sortearMensagem("mensagem-final-comum", mensagensFinalComum);
    }

    // 8) Se chegou no final secreto, sorteia mensagem secreta
    if (numeroPasso === 12) {
        sortearMensagem("mensagem-final-secreto", mensagensFinalSecreto);
    }

    // 9) No passo 8, verifica se o botao secreto deve aparecer
    if (numeroPasso === 8) {
        verificarBotaoSecreto();
    }

    // 10) Se voltou para a capa, reseta tudo
    if (numeroPasso === 0) {
        escolhasDoJogador.estado = null;
        escolhasDoJogador.ruinas = null;
        limparDiario();
    }

    // 11) Rola a pagina para o topo
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================
// Atualiza a barra de progresso
// ============================================================
function atualizarProgresso(numeroPasso) {
    const barra = document.getElementById("progresso-barra");
    const texto = document.getElementById("progresso-texto");

    // No final secreto (passo 12), mostra 100% com destaque
    const percentual = (numeroPasso / TOTAL_CAPITULOS) * 100;
    barra.style.width = percentual + "%";
    texto.textContent = "Capitulo " + numeroPasso + " de " + TOTAL_CAPITULOS;
}

// ============================================================
// Adiciona uma anotacao no diario de bordo
// ============================================================
function adicionarAoDiario(texto) {
    const lista = document.getElementById("inventario-lista");

    // Remove a mensagem "vazio" se existir
    const vazio = lista.querySelector(".inventario-vazio");
    if (vazio) vazio.remove();

    // Verifica se ja existe uma anotacao igual (evita duplicar)
    const itensExistentes = lista.querySelectorAll("li");
    for (let i = 0; i < itensExistentes.length; i++) {
        if (itensExistentes[i].textContent === texto) return;
    }

    // Cria o novo item
    const novoItem = document.createElement("li");
    novoItem.textContent = texto;
    novoItem.classList.add("item-novo");
    lista.appendChild(novoItem);
}

// ============================================================
// Limpa o diario (quando recomeca o jogo)
// ============================================================
function limparDiario() {
    const lista = document.getElementById("inventario-lista");
    lista.innerHTML = '<li class="inventario-vazio">Sua jornada ainda nao comecou...</li>';
}

// ============================================================
// DESAFIO: sorteia uma mensagem aleatoria
// ============================================================
function sortearMensagem(idDoElemento, listaDeMensagens) {
    const indiceSorteado = Math.floor(Math.random() * listaDeMensagens.length);
    const mensagem = listaDeMensagens[indiceSorteado];
    document.getElementById(idDoElemento).textContent = mensagem;
}

// ============================================================
// LOGICA DO FINAL SECRETO
// Se o jogador escolheu "Pernambuco" (passo 2) E
// "Investigar as ruinas" (passo 6), o botao secreto aparece
// no passo 8 e leva ao passo 12 (Final Secreto)
// ============================================================
function verificarBotaoSecreto() {
    const botaoSecreto = document.getElementById("botao-secreto");

    if (escolhasDoJogador.estado === "pernambuco" &&
        escolhasDoJogador.ruinas === "investigar-ruinas") {
        botaoSecreto.classList.remove("escondido");
        console.log("Voce desbloqueou o botao secreto!");
    } else {
        botaoSecreto.classList.add("escondido");
    }
}

// ============================================================
// DESAFIO: addEventListener nos botoes de AVANCAR
// ============================================================
const botoesAvancar = document.querySelectorAll(".botao-avancar");
botoesAvancar.forEach(function(botao) {
    botao.addEventListener("click", function() {
        // Guarda a escolha do jogador, se o botao tiver data-escolha
        const escolha = botao.getAttribute("data-escolha");
        if (escolha) {
            const passoAtual = botao.closest(".passo").getAttribute("data-passo");

            if (passoAtual === "2") {
                escolhasDoJogador.estado = escolha;
                console.log("Voce escolheu o estado:", escolha);
            }
            if (passoAtual === "6") {
                escolhasDoJogador.ruinas = escolha;
                console.log("Voce escolheu nas ruinas:", escolha);
            }
        }

        // Avanca para o proximo passo
        const proximoPasso = parseInt(botao.getAttribute("data-proximo"));
        mostrarPasso(proximoPasso);
    });
});

// ============================================================
// DESAFIO: addEventListener nos botoes de VOLTAR
// Usa o atributo data-voltar para saber para qual passo retornar
// ============================================================
const botoesVoltar = document.querySelectorAll(".botao-voltar");
botoesVoltar.forEach(function(botao) {
    botao.addEventListener("click", function() {
        const passoAnterior = parseInt(botao.getAttribute("data-voltar"));
        mostrarPasso(passoAnterior);
    });
});

// ============================================================
// INICIA A AVENTURA NA TELA DE CAPA (passo 0)
// ============================================================
mostrarPasso(0);