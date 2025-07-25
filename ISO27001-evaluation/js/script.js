// Este archivo contiene la lógica de JavaScript para manejar el formulario de evaluación, generar gráficos y mostrar alertas y recomendaciones.

let radarChartInstance = null;

// Etiquetas en español para el gráfico
const labelsEs = [
  "Política documentada",
  "Política revisada",
  "Roles definidos",
  "Comité de seguridad",
  "Verificación de antecedentes",
  "Capacitación en seguridad",
  "Inventario de activos",
  "Clasificación de activos",
  "Control de acceso",
  "Revisión de accesos"
];

document.getElementById("isoEvaluationForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const scores = Array.from(formData.values()).map(Number);

  // Validación: todas las preguntas deben ser respondidas
  if (scores.length < labelsEs.length || scores.some(isNaN)) {
    document.getElementById("alertSection").innerHTML = `
      <div class="alert alert-danger">
        <strong style="color:#d32f2f;">&#9888; Por favor responde todas las preguntas antes de evaluar.</strong>
      </div>
    `;
    return;
  }

  const totalScore = scores.reduce((acc, score) => acc + score, 0);
  const maxScore = scores.length * 3; // Cada pregunta puede puntuar hasta 3

  // Destruir la instancia anterior del gráfico si existe
  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  const radarChartCanvas = document.getElementById("radarChart").getContext('2d');

  let bgColor = "rgba(252, 104, 104, 0.51)"; // Rojo pastel por defecto
  let borderColor = "#d32f2f"; // Rojo por defecto

  if (totalScore === maxScore) {
    // Cumplimiento total: verde
    bgColor = "rgba(56, 142, 60, 0.35)";
    borderColor = "#388e3c";
  } else if (totalScore === 0) {
    // Sin cumplimiento: rojo fuerte y visible
    bgColor = "rgba(220, 53, 69, 0.45)"; // Rojo más intenso
    borderColor = "#dc3545"; // Rojo Bootstrap
  } else if (totalScore < maxScore / 2) {
    // Bajo cumplimiento: naranja/amarillo
    bgColor = "rgba(251, 192, 45, 0.35)";
    borderColor = "#fbc02d";
  } else {
    // Parcial: azul
    bgColor = "rgba(44, 62, 80, 0.25)";
    borderColor = "#23497c";
  }

  radarChartInstance = new Chart(radarChartCanvas, {
    type: "radar",
    data: {
      labels: labelsEs,
      datasets: [
        {
          label: "Nivel de Implementación",
          data: scores,
          backgroundColor: bgColor,
          borderColor: borderColor,
          pointBackgroundColor: "#2c8ff8ff",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#ffc107",
          pointHoverBorderColor: "#333",
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        r: {
          angleLines: { color: "#46caf7ff" }, // líneas de telaraña
          grid: { color: "#acdff7ff" }, // color del fondo de la telaraña
          pointLabels: { color: "#007bff", font: { size: 14 } }, // etiquetas
        }
      }
    }
  });

  // Segmentación de resultados
  let malo = "";
  let bueno = "";
  let bien = "";

  labelsEs.forEach((label, index) => {
    const score = scores[index];
    let description = "";
    let implementationPlan = "";
    let extraAdvice = "";

    switch (score) {
      case 0:
        description = "No implementado. Requiere atención inmediata.";
        implementationPlan = "Debes iniciar el desarrollo e implementación de este control. Revisa la documentación oficial de ISO 27001 y asigna responsables para su ejecución.";
        extraAdvice = "<ul><li>Realiza un análisis de riesgos para entender el impacto de no tener este control.</li><li>Define un cronograma de implementación.</li><li>Capacita al personal involucrado.</li></ul>";
        malo += `
          <div class="mt-3 recommendation-card">
            <div class="card-body">
              <strong>${label}:</strong>
              <div><strong>Descripción:</strong> ${description}</div>
              <div><strong>Acciones recomendadas:</strong> ${implementationPlan}</div>
              <div><strong>Pasos sugeridos:</strong> ${extraAdvice}</div>
            </div>
          </div>
        `;
        break;
      case 1:
        description = "Parcialmente implementado. Necesita mejoras.";
        implementationPlan = "Revisa el control actual, identifica las brechas y documenta un plan de mejora. Prioriza las acciones según el riesgo.";
        extraAdvice = "<ul><li>Solicita retroalimentación de los responsables.</li><li>Actualiza procedimientos y políticas.</li><li>Realiza pruebas de efectividad.</li></ul>";
        bueno += `
          <div class="mt-3 recommendation-card">
            <div class="card-body">
              <strong>${label}:</strong>
              <div><strong>Descripción:</strong> ${description}</div>
              <div><strong>Acciones recomendadas:</strong> ${implementationPlan}</div>
              <div><strong>Pasos sugeridos:</strong> ${extraAdvice}</div>
            </div>
          </div>
        `;
        break;
      case 2:
        description = "Mayormente implementado. Algunas áreas necesitan ajustes.";
        implementationPlan = "Realiza una revisión para identificar detalles que puedan optimizarse. Documenta las mejoras y realiza seguimiento.";
        extraAdvice = "<ul><li>Verifica la actualización de registros y evidencias.</li><li>Solicita auditoría interna.</li><li>Monitorea indicadores de desempeño.</li></ul>";
        bueno += `
          <div class="mt-3 recommendation-card">
            <div class="card-body">
              <strong>${label}:</strong>
              <div><strong>Descripción:</strong> ${description}</div>
              <div><strong>Acciones recomendadas:</strong> ${implementationPlan}</div>
              <div><strong>Pasos sugeridos:</strong> ${extraAdvice}</div>
            </div>
          </div>
        `;
        break;
      case 3:
        description = "Completamente implementado. Se mantiene el control.";
        implementationPlan = "Continúa con la supervisión y mejora continua. Mantén la documentación y realiza auditorías periódicas.";
        extraAdvice = "<ul><li>Realiza revisiones periódicas.</li><li>Actualiza la documentación cuando sea necesario.</li><li>Comparte buenas prácticas con otros equipos.</li></ul>";
        bien += `
          <div class="mt-3 recommendation-card">
            <div class="card-body">
              <strong>${label}:</strong>
              <div><strong>Descripción:</strong> ${description}</div>
              <div><strong>Acciones recomendadas:</strong> ${implementationPlan}</div>
              <div><strong>Buenas prácticas:</strong> ${extraAdvice}</div>
            </div>
          </div>
        `;
        break;
      default:
        break;
    }
  });

  let resultadoGeneral = "";
  if (totalScore === maxScore) {
    resultadoGeneral = `<div class="alert alert-success" style="margin-bottom:16px;">
      <strong style="color:#388e3c;">&#9989; ¡Felicidades! Todos los controles están completamente implementados. Cumplos con el máximo nivel de la norma ISO 27001.</strong>
    </div>`;
  } else if (totalScore === 0) {
    resultadoGeneral = `<div class="alert alert-danger" style="margin-bottom:16px;">
      <strong style="color:#d32f2f;">&#9888; Atención: Ningún control está implementado. Es necesario iniciar el proceso de cumplimiento de la norma ISO 27001.</strong>
    </div>`;
  } else if (totalScore < maxScore / 2) {
    resultadoGeneral = `<div class="alert alert-warning" style="margin-bottom:16px;">
      <strong style="color:#fbc02d;">&#128310; Nivel bajo de cumplimiento. Revisa los controles críticos y prioriza acciones de mejora.</strong>
    </div>`;
  } else {
    resultadoGeneral = `<div class="alert alert-info" style="margin-bottom:16px;">
      <strong style="color:#23497c;">&#128310; Cumplimiento parcial. Hay oportunidades de mejora para alcanzar el máximo nivel.</strong>
    </div>`;
  }

  let resultsHTML = resultadoGeneral;
  resultsHTML += `<div class="alert alert-info"><strong>Puntaje Total:</strong> ${totalScore} de ${maxScore}<br>
  <em>El puntaje total es la suma de todas las respuestas. El máximo posible es ${maxScore} (todas las preguntas completamente implementadas).</em></div>`;

  if (malo) {
    resultsHTML += `<div class="alert alert-danger">
    <strong style="color:#d32f2f;">&#9888; Controles Críticos: Requieren Atención Inmediata</strong>
    ${malo}
  </div>`;
  }
  if (bueno) {
    resultsHTML += `<div class="alert alert-warning">
    <strong style="color:#fbc02d;">&#128310; Controles Parcialmente o Mayormente Implementados</strong>
    ${bueno}
  </div>`;
  }
  if (bien) {
    resultsHTML += `<div class="alert alert-success">
    <strong style="color:#388e3c;">&#9989; Controles Completamente Implementados</strong>
    ${bien}
  </div>`;
  }

  alertSection.innerHTML = resultsHTML;

  const progressPercent = Math.round((totalScore / maxScore) * 100);
  let progressColor = "#388e3c"; // verde por defecto

  if (progressPercent === 0) {
    progressColor = "#dc3545"; // rojo visible para 0%
  } else if (progressPercent < 50) {
    progressColor = "#fbc02d"; // amarillo para bajo cumplimiento
  }

  // document.getElementById("progressBarContainer").innerHTML = `
  //   <div style="background: #807f7dff; border-radius:8px; overflow:hidden;">
  //     <div style="width:${progressPercent}%; background:${progressColor}; color:#fff; text-align:center; padding:6px 0; font-weight:600;">
  //       ${progressPercent}% cumplimiento
  //     </div>
  //   </div>
  // `;
  document.getElementById("progressBarContainer").innerHTML = `
  <div class="progress-bar-container">
    <div class="progress-bar-fill" style="width:${progressPercent}%; background:${progressColor};"></div>
    <span class="progress-bar-text">${progressPercent}% cumplimiento</span>
  </div>
`;


});

function obtenerTextoLegible(label) {
  switch (label) {
    case "policy_documented":
      return "¿Existe una política de seguridad documentada y aprobada?";
    case "policy_reviewed":
      return "¿Se revisan y actualizan las políticas de seguridad regularmente?";
    case "roles_defined":
      return "¿Están definidos los roles y responsabilidades de seguridad?";
    case "security_committee":
      return "¿Existe un comité de seguridad o un responsable de seguridad designado?";
    case "background_checks":
      return "¿Se realizan verificaciones de antecedentes para el personal de seguridad?";
    case "security_training":
      return "¿Se proporciona capacitación en seguridad a los empleados?";
    case "asset_inventory":
      return "¿Se tiene un inventario de activos de información?";
    case "asset_classification":
      return "¿Se clasifican los activos de información según su criticidad?";
    case "access_control":
      return "¿Existen controles de acceso a la información?";
    case "access_review":
      return "¿Se revisan los permisos de acceso regularmente?";
    default:
      return label;
  }
}

// document.getElementById("clearButton").addEventListener("click", function () {
//   document.getElementById("isoEvaluationForm").reset();
//   document.getElementById("alertSection").innerHTML = "";

//   if (radarChartInstance) {
//     radarChartInstance.destroy();
//     radarChartInstance = null;
//   }

//   const radarChartCanvas = document.getElementById("radarChart");
//   const ctx = radarChartCanvas.getContext("2d");
//   ctx.clearRect(0, 0, radarChartCanvas.width, radarChartCanvas.height);
// });

document.getElementById("clearButton").addEventListener("click", function () {
  const form = document.getElementById("isoEvaluationForm");
  form.reset();

  document.getElementById("alertSection").innerHTML = "";

  if (radarChartInstance) {
    radarChartInstance.destroy();
    radarChartInstance = null;
  }

  const radarChartCanvas = document.getElementById("radarChart");
  const ctx = radarChartCanvas.getContext("2d");
  ctx.clearRect(0, 0, radarChartCanvas.width, radarChartCanvas.height);

  // Reiniciar barra de progreso al 0%
  const progressBarContainer = document.getElementById("progressBarContainer");
  progressBarContainer.innerHTML = `
    <div class="progress-bar-container">
      <div class="progress-bar-fill" style="width:0%; background:#dc3545;"></div>
      <span class="progress-bar-text">0% cumplimiento</span>
    </div>
  `;
});


document.getElementById("downloadButton").addEventListener("click", function () {
  const element = document.querySelector('.container');

  // Agrega cabecera personalizada
  const company = document.getElementById("companyName").value || "Empresa";
  const auditor = document.getElementById("auditorName").value || "Auditor";
  const date = document.getElementById("auditDate").value || new Date().toLocaleDateString();

  // Crea un encabezado temporal
  const header = document.createElement('div');
  header.innerHTML = `
    <h2 style="text-align:center;">Reporte de Evaluación ISO 27001</h2>
    <p><strong>Empresa:</strong> ${company} &nbsp; <strong>Auditor:</strong> ${auditor} &nbsp; <strong>Fecha:</strong> ${date}</p>
    <hr>
  `;
  element.prepend(header);

  // const opt = {
  //   margin: [0.3, 0.3, 0.3, 0.3],
  //   filename: 'reporte_iso27001.pdf',
  //   image: { type: 'jpeg', quality: 0.98 },
  //   html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
  //   jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  //   pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  // };

const opt = {
  margin: [0.5, 0.5, 0.5, 0.5], // aumenta los márgenes para evitar cortes
  filename: 'reporte_iso27001.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
  jsPDF: {
    unit: 'in',
    format: 'a4',
    orientation: 'portrait',
  },
  pagebreak: { mode: ['css', 'legacy', 'avoid-all'] }, // modo para evitar saltos no deseados
};


  html2pdf().set(opt).from(element).save().then(() => {
    header.remove(); // Elimina el encabezado temporal después de generar el PDF
  });
});

document.getElementById("printButton").addEventListener("click", function () {
  window.print();
});

// CSS para evitar saltos de página en elementos específicos
const style = document.createElement('style');
style.innerHTML = `
  .no-break {
    page-break-inside: avoid;
  }
`;
document.head.appendChild(style);

// Antes de generar el PDF, ajusta el tamaño del canvas:
const radarCanvas = document.getElementById('radarChart');
const originalWidth = radarCanvas.width;
const originalHeight = radarCanvas.height;

// Tamaño óptimo para A4 suele ser 500x350px
radarCanvas.width = 500;
radarCanvas.height = 350;

// Si usas Chart.js, deberías llamar a update() para que se re-renderice al nuevo tamaño
if (radarChartInstance) {
  radarChartInstance.resize();
}

// Sigue con la exportación...
html2pdf().set(opt).from(element).save().then(() => {
  // Después de exportar, restaura el tamaño original
  radarCanvas.width = originalWidth;
  radarCanvas.height = originalHeight;
  if (radarChartInstance) {
    radarChartInstance.resize();
  }
});
