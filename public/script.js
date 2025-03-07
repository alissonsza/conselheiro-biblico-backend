// URL da API do backend no Netlify
const API_URL = "const API_URL = "https://conselheirobiblico.netlify.app/.netlify/functions/api";
";

// Função para buscar conselho na API
async function pedirConselho() {
    const textoUsuario = document.getElementById("inputTexto").value.trim();

    if (!textoUsuario) {
        alert("Por favor, digite uma pergunta antes de pedir um conselho.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/advice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ texto: textoUsuario })
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar conselho. Tente novamente.");
        }

        const data = await resposta.json();

        document.getElementById("resultado").innerHTML = `
            <h3>Conselho:</h3>
            <p>${data.conselho}</p>
            <h3>Versículo relacionado:</h3>
            <p>${data.versiculo}</p>
        `;

    } catch (erro) {
        console.error("Erro:", erro);
        document.getElementById("resultado").innerHTML = `<p style="color:red;">Erro ao buscar conselho. Tente novamente.</p>`;
    }
}

// Função para buscar versículos sobre um tema
async function buscarTema() {
    const tema = document.getElementById("inputTexto").value.trim();

    if (!tema) {
        alert("Digite um tema para buscar na Bíblia.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/tema/${encodeURIComponent(tema)}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar versículos.");
        }

        const data = await resposta.json();

        if (data.error) {
            document.getElementById("resultado").innerHTML = `<p style="color:red;">Tema não encontrado na Bíblia.</p>`;
            return;
        }

        let listaVersiculos = "<h3>Passagens Bíblicas:</h3><ul>";
        data.forEach(item => {
            listaVersiculos += `<li><strong>${item.versiculo}</strong>: ${item.texto}</li>`;
        });
        listaVersiculos += "</ul>";

        document.getElementById("resultado").innerHTML = listaVersiculos;

    } catch (erro) {
        console.error("Erro:", erro);
        document.getElementById("resultado").innerHTML = `<p style="color:red;">Erro ao buscar tema. Tente novamente.</p>`;
    }
}

// Modal de Contribuição
function mostrarContribuicao() {
    document.getElementById("modalContribuir").style.display = "flex";
}

function fecharContribuicao() {
    document.getElementById("modalContribuir").style.display = "none";
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById("modalContribuir");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
