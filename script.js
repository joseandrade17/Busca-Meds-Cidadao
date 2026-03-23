// Carregar JSON
let medicamentos = [];

fetch("medicamentos.json")
  .then(res => res.json())
  .then(data => {
    medicamentos = data;
    console.log("✅ JSON carregado:", medicamentos.length);
  })
  .catch(() => {
    document.getElementById("resultado").innerHTML =
      "<p style='color:#f87171; text-align:center;'>Erro ao carregar medicamentos.</p>";
  });

// Escape HTML
function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 🔥 CORREÇÃO PRINCIPAL (mapa de letras bugadas)
function corrigirTexto(texto) {
  return String(texto)
    .replace(/Α/g, "A")
    .replace(/Β/g, "B")
    .replace(/Ε/g, "E")
    .replace(/Ζ/g, "Z")
    .replace(/Η/g, "H")
    .replace(/Ι/g, "I")
    .replace(/Κ/g, "K")
    .replace(/Μ/g, "M")
    .replace(/Ν/g, "N")
    .replace(/Ο/g, "O") // 🔥 ESSA É A DO OMEPRAZOL
    .replace(/Ρ/g, "P")
    .replace(/Τ/g, "T")
    .replace(/Χ/g, "X")
    .replace(/Υ/g, "Y");
}

// Normalizar texto
function normalizarTexto(texto) {
  return corrigirTexto(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acento
    .replace(/[^a-zA-Z0-9\s]/g, "") // remove lixo
    .toLowerCase()
    .trim();
}

// Busca
function buscar() {
  const input = document.getElementById("busca");
  const resultado = document.getElementById("resultado");
  let busca = input.value.trim();

  resultado.innerHTML = "";

  if (medicamentos.length === 0) {
    resultado.innerHTML = "⏳ Carregando medicamentos...";
    return;
  }

  if (busca === "") {
    resultado.innerHTML =
      "<p style='color:#fbbf24; text-align:center;'>⚠️ Digite o nome do medicamento.</p>";
    return;
  }

  const buscaNormalizada = normalizarTexto(busca);

  let filtrados = medicamentos
    .filter(med => (med.tipo || "").toUpperCase() === "UBS")
    .filter(med => {
      const nome = normalizarTexto(med.nome || "");
      const dosagem = normalizarTexto(med.dosagem || "");
      const forma = normalizarTexto(med.forma || "");
      const classe = normalizarTexto(med.classe || "");

      return (
        nome.includes(buscaNormalizada) ||
        dosagem.includes(buscaNormalizada) ||
        forma.includes(buscaNormalizada) ||
        classe.includes(buscaNormalizada)
      );
    });

  filtrados.sort((a, b) =>
    (a.nome || "").localeCompare(b.nome || "")
  );

  if (filtrados.length === 0) {
    resultado.innerHTML =
      "<b>❌ Nenhum medicamento encontrado.</b><br><br>Verifique a grafia.";
    return;
  }

  let html = `<h2>✅ Resultado (${filtrados.length})</h2>`;

  filtrados.forEach(med => {
    html += `
      <div class="card">
        <b>Nome:</b> ${escapeHtml(med.nome)}<br>
        <b>Dosagem:</b> ${escapeHtml(med.dosagem)}<br>
        <b>Forma:</b> ${escapeHtml(med.forma)}<br>
        <b>Classe:</b> ${escapeHtml(med.classe)}
      </div>
    `;
  });

  resultado.innerHTML = html;
}
// Documentos necessários
function mostrarDocumentos() {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  resultado.innerHTML = `
    <div class="documentos">
      <h2>📋 Documentos Necessários</h2>
      
      <div class="item">
        <span class="numero">1</span>
        <strong>Receita Médica</strong><br>
        Apresente a receita válida e legível, emitida por um profissional de saúde.
      </div>

      <div class="item">
        <span class="numero">2</span>
        <strong>Documento de Identificação com Foto</strong><br>
        RG, CNH, Carteira de Habilitação ou outro documento oficial com foto.
      </div>

      <div class="item">
        <span class="numero">3</span>
        <strong>Se outra pessoa for retirar o medicamento</strong><br>
        A pessoa responsável deve apresentar:
        <ul style="margin-top:8px; padding-left:20px;">
          <li>Seu próprio documento oficial com foto</li>
          <li>Documento de identificação do paciente</li>
        </ul>
      </div>

      <div class="item">
        <span class="numero">4</span>
        <strong>Caso o paciente não tenha cadastro na farmácia</strong><br>
        É necessário apresentar:
        <ul style="margin-top:8px; padding-left:20px;">
          <li>Comprovante de endereço em nome do paciente</li>
         <li> RG, CNH, Carteira de Habilitação ou outro documento oficial com foto.</li>
          <li>OU Declaração do Agente de Saúde comprovando residência</li>
        </ul>
      </div>

      <p style="text-align:center; margin-top:25px; color:#86efac; font-size:17px; background:#334155; padding:15px; border-radius:8px;">
        <strong>💡 Dica importante:</strong> Leve todos os documentos originais para evitar ter que voltar outra vez.
      </p>
    </div>
  `;
}

// Mostrar UBS

function mostrarUBS() {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  resultado.innerHTML = `
    <h2>📍 Onde Retirar os Medicamentos em Caieiras</h2>
    
    <div style="background:#334155; padding:15px; border-radius:10px; margin-bottom:20px; text-align:center; font-size:15.5px;">
      <strong>🗺️ Toque no endereço para abrir o mapa</strong><br>
      <strong>📞 Toque no número para ligar direto!</strong>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Santa Inês</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=Estr.+Osvaldo+Panelli,+08+-+Santa+Inês,+Caieiras" target="_blank">📍 Estr. Osvaldo Panelli, 08 - Santa Inês</a><br>
      <a href="tel:1144418897" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4441-8897
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Jardim Marcelino</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=R.+Maria+Margarete+da+Cruz,+787+-+Serpa,+Caieiras" target="_blank">📍 R. Maria Margarete da Cruz, 787 - Serpa</a><br>
      <a href="tel:1146053653" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4605-3653
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Portal das Laranjeiras</b><br>
      <a href="https://maps.app.goo.gl/TJmAjJ1TCMYvNe4y9" target="_blank">📍 Rua Cardeal - Jardim San Diego</a><br>
      <a href="tel:1148005024" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4800-5024
      </a><br>
      
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Sítio Aparecida</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=Av.+Leila,+06+-+Sítio+Aparecida,+Caieiras" target="_blank">📍 Av. Leila, 06 - Sítio Aparecida</a><br>
      <a href="tel:1144410901" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4441-0901
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Calcárea</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=Rua+da+Gruta,+S/N+-+Calcárea,+Caieiras" target="_blank">📍 Rua da Gruta, S/N - Calcárea</a><br>
      <a href="tel:1144071350" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4407-1350
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Vila dos Pinheiros</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=R.+Luzia+Rizzo+Pesente,+278,+Caieiras" target="_blank">📍 R. Luzia Rizzo Pesente, 278</a><br>
      <a href="tel:1144451795" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4445-1795
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Morro Grande</b><br>
      <a href="https://maps.app.goo.gl/rbrCyDLEBvKHVH1aA" target="_blank">📍 R. Márciano Dartora, 79</a><br>
      <a href="tel:1144425522" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4442-5522
      </a><br>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Jardim dos Eucaliptos</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=Av.+Armando+Sestini,+426,+Caieiras" target="_blank">📍 Av. Armando Sestini, 426</a><br>
      <a href="tel:1146055469" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4605-5469
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS CIAS</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=R.+Ambrosina+do+Carmo+Buonaguide,+310+-+Cresciúma,+Caieiras" target="_blank">📍 R. Ambrosina do Carmo Buonaguide, 310 - Cresciúma</a><br>
      <a href="tel:1144424200" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4442-4200
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Vila Rosina I</b><br>
      <a href="https://maps.app.goo.gl/ZyRke7MShsqyXcZ59" target="_blank">📍 Av. Rodolfo Polidoro, 45</a><br>
      <a href="tel:1149345365" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4934-5365
      </a><br>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Laranjeiras</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=Av.+Paulicéia,+360,+Caieiras" target="_blank">📍 Av. Paulicéia, 360</a><br>
      <a href="tel:1148993367" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4899-3367 
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Nova Era</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=R.+Paraná,+228,+Caieiras" target="_blank">📍 R. Paraná, 228</a><br>
      <a href="tel:1144421556" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4442-1556
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Vila Rosina</b><br>
      <a href="https://maps.app.goo.gl/KRFjmSuZQAiezvMR7" target="_blank">📍 Vila Rosina</a><br>
      <a href="tel:1148994408" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4899-4408
      </a>
    </div>

    <div class="ubs-item">
      <b>🏥 UBS Jardim Vitória</b><br>
      <a href="https://www.google.com/maps/search/?api=1&query=R.+Dom+Pedro+I,+164,+Caieiras" target="_blank">📍 R. Dom Pedro I, 164</a><br>
      <a href="tel:1148993535" style="color:#86efac; font-weight:bold; text-decoration:none;">
        📞 (11) 4899-3535
      </a>
    </div>

    <p style="margin-top:20px; text-align:center; color:#94a3b8; font-size:14px;">
      🔗 Toque no endereço para abrir o mapa e no número para ligar diretamente<br>
      ℹ️ Telefones de fontes públicas.
    </p>
  `;
}

// Compartilhar nativo (Web Share API)
function compartilharPagina() {
  if (navigator.share) {
    navigator.share({
      title: 'Busca Meds Cidadão - Caieiras',
      text: 'Busque medicamentos gratuitos no SUS em Caieiras: nomes, dosagens, documentos necessários e UBS com mapas!',
      url: window.location.href
    }).catch(err => {
      console.error('Erro ao compartilhar:', err);
    });
  } else {
    alert('Seu navegador não suporta compartilhamento nativo.\nCopie o link: ' + window.location.href);
  }
}
