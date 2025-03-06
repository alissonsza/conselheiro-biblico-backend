// Aceitar termos
function aceitarTermos() {
  const checkbox = document.getElementById('aceiteTermos');
  if (!checkbox.checked) {
    alert("Você precisa aceitar os termos para continuar.");
    return;
  }
  document.getElementById('termosAceite').style.display = 'none';
}

async function buscarResposta(tipo) {
  const termosAceitos = document.getElementById('termosAceite').style.display === 'none';
  if (!termosAceitos) {
    alert("Aceite os termos antes de continuar!");
    return;
  }

  const texto = document.getElementById('textoUsuario').value.trim();
  if (!texto) {
    alert("Digite claramente sua situação ou tema.");
    return;
  }

  let url = (tipo === 'conselho') ? '/api/advice' : `/api/tema/${texto.toLowerCase()}`;
  let options = (tipo === 'conselho') ? {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({texto})
  } : {};

  const res = await fetch(url, options);
  const resultado = await res.json();

  if (resultado.error) {
    alert(resultado.error);
    return;
  }

  let html = '';

  if (tipo === 'conselho') {
    html = `<h3>Conselho para você:</h3><p>${resultado.conselho}</p><p><strong>${resultado.versiculo}</strong></p>`;
  } else {
    html = `<h3>Versículos sobre "${texto}":</h3><ul>`;
    resultado.forEach(item => {
      html += `<li><strong>${item.versiculo}</strong>: ${item.conselho}</li>`;
    });
    html += "</ul>";
  }

  document.getElementById('resultado').innerHTML = html;
  document.getElementById('resultado').style.display = 'block';
}

// Modal Contribuir
function mostrarContribuicao() {
  document.getElementById('modalContribuir').style.display = 'flex';
}

function fecharContribuicao() {
  document.getElementById('modalContribuir').style.display = 'none';
}

// Fechar modal clicando fora
window.onclick = function(event) {
  const modal = document.getElementById('modalContribuir');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}
