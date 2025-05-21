let etapa = 0;
let respostas = {};

const perguntas = [
  {
    pergunta: "Você já tinha plano anterior?",
    opcoes: ["Sim", "Não"],
    chave: "temPlanoAnterior"
  },
  {
    pergunta: "Qual é o tipo do novo plano?",
    opcoes: ["Conveniado (GEAP/ASSEFAZ)", "Não conveniado (ressarcimento)"],
    chave: "tipoPlanoNovo"
  },
  {
    pergunta: "Qual era o tipo do plano anterior?",
    opcoes: ["Conveniado", "Não conveniado"],
    chave: "tipoPlanoAnterior",
    condicao: () => respostas.temPlanoAnterior === "Sim"
  },
  {
    pergunta: "Você possui dependentes?",
    opcoes: ["Sim", "Não"],
    chave: "temDependentes"
  }
];

function proximaPergunta() {
  const area = document.getElementById("perguntas");
  const botao = document.getElementById("botao");

  if (etapa > 0) {
    const anterior = perguntas[etapa - 1];
    const selecionada = document.querySelector('input[name="resposta"]:checked');
    if (selecionada) {
      respostas[anterior.chave] = selecionada.value;
    } else {
      alert("Por favor, selecione uma opção.");
      return;
    }
  }

  if (etapa >= perguntas.length) {
    mostrarResultado();
    return;
  }

  while (etapa < perguntas.length && perguntas[etapa].condicao && !perguntas[etapa].condicao()) {
    etapa++;
  }

  if (etapa >= perguntas.length) {
    mostrarResultado();
    return;
  }

  const atual = perguntas[etapa];
  area.innerHTML = `<p><strong>${atual.pergunta}</strong></p>`;
  atual.opcoes.forEach(opcao => {
    area.innerHTML += `<label><input type="radio" name="resposta" value="${opcao}"> ${opcao}</label><br>`;
  });

  botao.innerText = "Avançar";
  etapa++;
}

function mostrarResultado() {
  const area = document.getElementById("perguntas");
  const botao = document.getElementById("botao");
  botao.style.display = "none";

  let situacao = "";

  if (respostas.temPlanoAnterior === "Não") {
    if (respostas.tipoPlanoNovo === "Conveniado (GEAP/ASSEFAZ)") {
      situacao = "Situação 1.1: Cadastro de plano conveniado (GEAP/ASSEFAZ)";
    } else {
      situacao = "Situação 1.2: Cadastro de plano não conveniado (ressarcimento)";
    }
  } else {
    if (
      respostas.tipoPlanoNovo === "Conveniado (GEAP/ASSEFAZ)" &&
      respostas.tipoPlanoAnterior === "Conveniado"
    ) {
      situacao = "Situação 2.1: Troca de plano conveniado para conveniado";
    } else if (
      respostas.tipoPlanoNovo === "Não conveniado (ressarcimento)" &&
      respostas.tipoPlanoAnterior === "Conveniado"
    ) {
      situacao = "Situação 2.2: Troca de plano conveniado para não conveniado";
    } else if (
      respostas.tipoPlanoNovo === "Conveniado (GEAP/ASSEFAZ)" &&
      respostas.tipoPlanoAnterior === "Não conveniado"
    ) {
      situacao = "Situação 2.3: Troca de plano não conveniado para conveniado";
    } else if (
      respostas.tipoPlanoNovo === "Não conveniado (ressarcimento)" &&
      respostas.tipoPlanoAnterior === "Não conveniado"
    ) {
      situacao = "Situação 2.4: Troca de plano não conveniado para não conveniado";
    }
  }

  area.innerHTML = `
    <h2>Resultado</h2>
    <p><strong>${situacao}</strong></p>
    <p>Você pode agora consultar o procedimento correspondente no manual do IFB ou clique abaixo para ver instruções detalhadas (em breve).</p>
  `;
}
