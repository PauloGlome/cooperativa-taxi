import { auth, database } from "../firebase-config.js";

import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    ref,
    push,
    set,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const NUMERO_ADMIN_TESTE = "+244976468654";
// ===============================
// ELEMENTOS DO HTML
// ===============================

const loginSection = document.getElementById("loginSection");
const painelAdmin = document.getElementById("painelAdmin");

const loginBtn = document.getElementById("loginAdmin");
const codigoArea = document.getElementById("codigoArea");
const confirmarCodigo = document.getElementById("confirmarCodigo");

const adminUser = document.getElementById("adminUser");
const codigoSMS = document.getElementById("codigoSMS");

const btnSair = document.getElementById("btnSair");

const btnNovoMotorista = document.getElementById("novoMotorista");
const formMotorista = document.getElementById("formMotorista");

const guardarMotorista = document.getElementById("guardarMotorista");
const listaMotoristas = document.getElementById("listaMotoristas");

const pesquisaMotorista = document.getElementById("pesquisaMotorista");


// ===============================
// RECAPTCHA
// ===============================

// ===============================
// RECAPTCHA
// ===============================

window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
        size: "normal",
        callback: () => {
            console.log("reCAPTCHA concluído");
        },
        "expired-callback": () => {
            alert("O reCAPTCHA expirou. Tente novamente.");
        }
    }
);


// ===============================
// LOGIN POR SMS
// ===============================

loginBtn.addEventListener("click", async () => {

    let numero = adminUser.value.trim();

 if (numero !== NUMERO_ADMIN_TESTE) {
    alert("Este número não está autorizado a entrar no painel.");
    return;
}

    if (!numero.startsWith("+244")) {

        alert("digite o numero no formato +2449xxxxxxxx");
        return;
    }

    try {

        const confirmationResult =
            await signInWithPhoneNumber(
                auth,
                numero,
                window.recaptchaVerifier
            );

        window.confirmationResult = confirmationResult;

        codigoArea.style.display = "block";

        alert("Código SMS enviado com sucesso!");
} catch (erro) {

    console.error("ERRO COMPLETO:", erro);

    alert(
        "Código: " + erro.code +
        "\n\nMensagem: " + erro.message
    );

}

});


// ===============================
// CONFIRMAR CÓDIGO SMS
// ===============================

confirmarCodigo.addEventListener("click", async () => {

    const codigo = codigoSMS.value.trim();

    if (codigo === "") {

        alert("Digite o código SMS.");

        return;
    }

    try {

        await window.confirmationResult.confirm(codigo);

        alert("Login efetuado com sucesso!");

        loginSection.style.display = "none";

        painelAdmin.style.display = "block";

        carregarMotoristas();

    } catch (erro) {

        console.error(erro);

        alert("Código inválido.");

    }

});


// ===============================
// TERMINAR SESSÃO
// ===============================

btnSair.addEventListener("click", async () => {

    await signOut(auth);

    painelAdmin.style.display = "none";

    loginSection.style.display = "block";

    alert("Sessão terminada.");

});


// ===============================
// MOSTRAR / ESCONDER FORMULÁRIO
// ===============================

btnNovoMotorista.addEventListener("click", () => {

    if (formMotorista.style.display === "none") {

        formMotorista.style.display = "block";

        btnNovoMotorista.textContent =
            "❌ Fechar Formulário";

    } else {

        formMotorista.style.display = "none";

        btnNovoMotorista.textContent =
            "➕ Adicionar Motorista";

    }

});


// ===============================
// GUARDAR MOTORISTA
// ===============================

guardarMotorista.addEventListener("click", async () => {

    const nome =
        document.getElementById("nomeMotorista").value.trim();

    const viatura =
        document.getElementById("viaturaMotorista").value.trim();

    const telefone =
        document.getElementById("telefoneMotorista").value.trim();

    const whatsapp =
        document.getElementById("whatsappMotorista").value.trim();

    const estado =
        document.getElementById("estadoMotorista").value;


    if (!nome || !viatura || !telefone || !whatsapp) {

        alert("Preencha todos os campos.");

        return;
    }


    try {

        const motoristasRef =
            ref(database, "motoristas");

        const novoMotorista =
            push(motoristasRef);

        await set(novoMotorista, {

            nome,
            viatura,
            telefone,
            whatsapp,
            estado

        });

        alert("Motorista guardado com sucesso!");

        limparFormulario();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao guardar motorista.");

    }

});


// ===============================
// CARREGAR MOTORISTAS
// ===============================

function carregarMotoristas() {

    const motoristasRef =
        ref(database, "motoristas");

    onValue(motoristasRef, (snapshot) => {

        listaMotoristas.innerHTML = "";

        let numero = 1;

        snapshot.forEach((item) => {

            const motorista = item.val();

            const tr =
                document.createElement("tr");

            tr.innerHTML = `

                <td>${numero}</td>

                <td>${motorista.nome}</td>

                <td>${motorista.viatura}</td>

                <td>${motorista.estado}</td>

                <td>${motorista.whatsapp}</td>

                <td>${motorista.telefone}</td>

                <td>

                    <button
                        class="btnEditar"
                        data-id="${item.key}">
                        ✏️
                    </button>

                    <button
                        class="btnRemover"
                        data-id="${item.key}">
                        ❌
                    </button>

                </td>

            `;

            listaMotoristas.appendChild(tr);

            numero++;

        });

        atualizarEstatisticas();

    });

}


// ===============================
// REMOVER MOTORISTA
// ===============================

listaMotoristas.addEventListener("click", async (evento) => {

    if (!evento.target.classList.contains("btnRemover")) {

        return;
    }

    const id =
        evento.target.dataset.id;

    const confirmar =
        confirm("Deseja remover este motorista?");

    if (!confirmar) {

        return;
    }

    await remove(
        ref(database, "motoristas/" + id)
    );

});


// ===============================
// PESQUISAR MOTORISTA
// ===============================

pesquisaMotorista.addEventListener("input", () => {

    const texto =
        pesquisaMotorista.value.toLowerCase();

    const linhas =
        listaMotoristas.querySelectorAll("tr");

    linhas.forEach((linha) => {

        const conteudo =
            linha.textContent.toLowerCase();

        linha.style.display =
            conteudo.includes(texto)
                ? ""
                : "none";

    });

});


// ===============================
// ESTATÍSTICAS
// ===============================

function atualizarEstatisticas() {

    const linhas =
        listaMotoristas.querySelectorAll("tr");

    let total = linhas.length;

    let disponiveis = 0;

    let ocupados = 0;


    linhas.forEach((linha) => {

        const estado =
            linha.cells[3].textContent.trim();

        if (estado.includes("Disponível")) {

            disponiveis++;

        }

        if (estado.includes("Ocupado")) {

            ocupados++;

        }

    });


    document.getElementById("totalMotoristas")
        .textContent = total;

    document.getElementById("totalDisponiveis")
        .textContent = disponiveis;

    document.getElementById("totalOcupados")
        .textContent = ocupados;

}


// ===============================
// LIMPAR FORMULÁRIO
// ===============================

function limparFormulario() {

    document.getElementById("nomeMotorista").value = "";

    document.getElementById("viaturaMotorista").value = "";

    document.getElementById("telefoneMotorista").value = "";

    document.getElementById("whatsappMotorista").value = "";

    document.getElementById("estadoMotorista").value =
        "Disponível";

}


// ===============================
// VERIFICAR SESSÃO
// ===============================

onAuthStateChanged(auth, (user) => {

    if (user) {

        loginSection.style.display = "none";

        painelAdmin.style.display = "block";

        carregarMotoristas();

    } else {

        loginSection.style.display = "block";

        painelAdmin.style.display = "none";

    }

});