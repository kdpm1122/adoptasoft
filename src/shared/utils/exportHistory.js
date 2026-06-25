// src/shared/utils/exportHistory.js
// Exporta el historial médico a PDF (vía impresión del navegador) o Word (.doc).
// No requiere ninguna librería externa.

const TYPE_LABELS = {
  vacuna: "Vacuna",
  diagnostico: "Diagnóstico",
  control: "Control",
};

const TYPE_COLORS = {
  vacuna: "#16a34a",
  diagnostico: "#2563eb",
  control: "#ea580c",
};

/**
 * Genera el HTML del historial con estilos embebidos.
 * Se reutiliza tanto para el PDF como para el Word.
 */
function buildHTML(petName, records, forWord = false) {
  const today = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const rows = records
    .map((r) => {
      const color = TYPE_COLORS[r.type] || "#6b7280";
      const label = TYPE_LABELS[r.type] || r.type;
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f0ebe3;">
            <span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;
                         background:${color}18;color:${color};">${label}</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0ebe3;font-weight:600;color:#1c1c1c;">${r.title}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0ebe3;color:#6b6b6b;font-size:13px;">${r.doctor}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0ebe3;color:#6b6b6b;font-size:13px;">${r.date}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0ebe3;color:#6b6b6b;font-size:13px;">
            ${r.nextDate ? r.nextDate : "—"}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0ebe3;color:#6b6b6b;font-size:13px;">
            ${r.detail || "—"}
          </td>
        </tr>`;
    })
    .join("");

  const printStyle = forWord
    ? ""
    : `<style>
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
        }
      </style>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Historial Médico — ${petName}</title>
  ${printStyle}
</head>
<body style="font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:32px;background:#fff;color:#1c1c1c;">

  <!-- Encabezado -->
  <div style="display:flex;align-items:center;justify-content:space-between;
              border-bottom:3px solid #e07b1a;padding-bottom:16px;margin-bottom:24px;">
    <div>
      <div style="font-size:22px;font-weight:700;color:#e07b1a;">🐾 Adoptasoft</div>
      <div style="font-size:12px;color:#888;margin-top:2px;">Sistema de Gestión Veterinaria</div>
    </div>
    <div style="text-align:right;font-size:12px;color:#888;">
      <div>Generado el ${today}</div>
    </div>
  </div>

  <!-- Título -->
  <h1 style="font-size:20px;font-weight:700;margin:0 0 4px;">📋 Historial Médico</h1>
  <p style="font-size:14px;color:#888;margin:0 0 24px;">${petName}</p>

  <!-- Resumen -->
  <div style="display:flex;gap:16px;margin-bottom:28px;flex-wrap:wrap;">
    <div style="flex:1;min-width:120px;background:#fff8f0;border:1px solid #f0ebe3;
                border-radius:10px;padding:14px;text-align:center;">
      <div style="font-size:24px;font-weight:700;color:#e07b1a;">${records.length}</div>
      <div style="font-size:11px;color:#888;margin-top:2px;">Registros totales</div>
    </div>
    <div style="flex:1;min-width:120px;background:#f0fdf4;border:1px solid #dcfce7;
                border-radius:10px;padding:14px;text-align:center;">
      <div style="font-size:24px;font-weight:700;color:#16a34a;">
        ${records.filter((r) => r.type === "vacuna").length}
      </div>
      <div style="font-size:11px;color:#888;margin-top:2px;">Vacunas</div>
    </div>
    <div style="flex:1;min-width:120px;background:#eff6ff;border:1px solid #dbeafe;
                border-radius:10px;padding:14px;text-align:center;">
      <div style="font-size:24px;font-weight:700;color:#2563eb;">
        ${records.filter((r) => r.type === "diagnostico").length}
      </div>
      <div style="font-size:11px;color:#888;margin-top:2px;">Diagnósticos</div>
    </div>
    <div style="flex:1;min-width:120px;background:#fff7ed;border:1px solid #ffedd5;
                border-radius:10px;padding:14px;text-align:center;">
      <div style="font-size:24px;font-weight:700;color:#ea580c;">
        ${records.filter((r) => r.type === "control").length}
      </div>
      <div style="font-size:11px;color:#888;margin-top:2px;">Controles</div>
    </div>
  </div>

  <!-- Tabla -->
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <thead>
      <tr style="background:#fff8f0;">
        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;
                   color:#888;text-transform:uppercase;letter-spacing:.05em;">Tipo</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;
                   color:#888;text-transform:uppercase;letter-spacing:.05em;">Descripción</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;
                   color:#888;text-transform:uppercase;letter-spacing:.05em;">Veterinario</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;
                   color:#888;text-transform:uppercase;letter-spacing:.05em;">Fecha</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;
                   color:#888;text-transform:uppercase;letter-spacing:.05em;">Próxima cita</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;
                   color:#888;text-transform:uppercase;letter-spacing:.05em;">Detalle</th>
      </tr>
    </thead>
    <tbody>
      ${rows.length > 0 ? rows : `
        <tr>
          <td colspan="6" style="padding:32px;text-align:center;color:#aaa;">
            No hay registros en el historial.
          </td>
        </tr>`}
    </tbody>
  </table>

  <!-- Pie -->
  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #f0ebe3;
              font-size:11px;color:#bbb;text-align:center;">
    Adoptasoft · Sistema de Gestión Veterinaria · Documento generado automáticamente
  </div>

</body>
</html>`;
}

/**
 * Abre una ventana de impresión del navegador con el historial formateado.
 * El usuario puede elegir "Guardar como PDF" desde el diálogo de impresión.
 */
export function exportToPdf(petName, records) {
  const html = buildHTML(petName, records, false);
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert("El navegador bloqueó la ventana emergente. Permite las ventanas emergentes para este sitio e intenta de nuevo.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  // Pequeño delay para que los estilos carguen antes de imprimir.
  setTimeout(() => {
    win.print();
  }, 400);
}

/**
 * Descarga el historial como archivo .doc que Word abre directamente.
 * Usa un truco conocido: Word acepta HTML con la cabecera correcta de Word.
 */
export function exportToWord(petName, records) {
  const innerHtml = buildHTML(petName, records, true);

  const wordHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8" />
      <!--[if gte mso 9]>
      <xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml>
      <![endif]-->
    </head>
    <body>
      ${innerHtml}
    </body>
    </html>`;

  const blob = new Blob(["\ufeff", wordHtml], {
    type: "application/msword",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `historial_${petName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "")}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
