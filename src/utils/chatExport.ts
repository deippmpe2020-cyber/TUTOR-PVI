/**
 * Utilities for exporting Tutor PVI chat sessions to PDF and Text (.txt)
 * Polícia Militar de Pernambuco - Diretoria de Ensino, Instrução e Pesquisa (DEIP / CEaD)
 */

import { jsPDF } from 'jspdf';

export interface ExportMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface ExportOptions {
  studentName?: string;
  courseTitle?: string;
  courseUrl?: string;
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getFileTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}`;
}

/**
 * Export conversation to a clean, structured Plain Text file (.txt)
 */
export function exportChatToText(messages: ExportMessage[], options?: ExportOptions): void {
  const dateStr = formatDate(Date.now());
  const userInteractions = messages.filter((m) => m.role === 'user').length;

  let content = '';
  content += '========================================================================\n';
  content += '     POLÍCIA MILITAR DE PERNAMBUCO - PMPE\n';
  content += '     DIRETORIA DE ENSINO, INSTRUÇÃO E PESQUISA (DEIP)\n';
  content += '     COORDENAÇÃO DE ENSINO A DISTÂNCIA (CEaD)\n';
  content += '     PLATAFORMA VIRTUAL DE INSTRUÇÃO (PVI)\n';
  content += '========================================================================\n\n';
  content += 'REGISTRO DE CONSULTA E ATENDIMENTO - TUTOR PVI\n';
  content += `Data e Hora da Emissão: ${dateStr}\n`;
  content += `Plataforma Oficial: http://pvi.pm.pe.gov.br/\n`;
  content += `Legislação Estadual: https://legis.alepe.pe.gov.br/\n`;
  content += `Curso/Contexto: ${options?.courseTitle || 'Plataforma Virtual de Instrução (PVI / PMPE)'}\n`;
  content += `Total de Consultas Realizadas: ${userInteractions}\n`;
  content += '------------------------------------------------------------------------\n\n';

  let interactionNumber = 1;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const time = formatDate(msg.timestamp);

    if (msg.role === 'user') {
      content += `[CONSULTA #${interactionNumber}] - ${time}\n`;
      content += `ALUNO / INSTRUTOR:\n`;
      content += `${msg.text}\n\n`;
    } else {
      content += `RESPOSTA FUNDAMENTADA DO TUTOR PVI:\n`;
      content += `${msg.text}\n\n`;
      content += '------------------------------------------------------------------------\n\n';
      interactionNumber++;
    }
  }

  content += '========================================================================\n';
  content += 'Documento gerado para registro acadêmico e consulta doutrinária da PMPE.\n';
  content += 'As informações prestadas têm como fontes obrigatórias os cursos da PVI,\n';
  content += 'diretrizes da DEIP e legislação estadual da ALEPE.\n';
  content += '========================================================================\n';

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Tutor_PVI_PMPE_Atendimento_${getFileTimestamp()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export conversation to an institutional PDF document (.pdf)
 */
export function exportChatToPdf(messages: ExportMessage[], options?: ExportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      drawHeaderFooter();
      y = 30; // space after page header
    }
  };

  const drawHeaderFooter = () => {
    // Top banner border
    doc.setDrawColor(11, 60, 116); // #0B3C74
    doc.setLineWidth(0.8);
    doc.line(margin, 22, pageWidth - margin, 22);

    // Mini header on subsequent pages
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(11, 60, 116);
    doc.text('POLÍCIA MILITAR DE PERNAMBUCO • DEIP • TUTOR PVI', margin, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    const dateStr = formatDate(Date.now());
    doc.text(dateStr, pageWidth - margin, 18, { align: 'right' });
  };

  // --- FIRST PAGE INSTITUTIONAL HEADER ---
  // Top Header Box
  doc.setFillColor(11, 60, 116); // PMPE Blue #0B3C74
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Gold accent bar
  doc.setFillColor(197, 155, 39); // PMPE Gold #C59B27
  doc.rect(margin, y + 24, contentWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('POLÍCIA MILITAR DE PERNAMBUCO', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(220, 235, 255);
  doc.text('DIRETORIA DE ENSINO, INSTRUÇÃO E PESQUISA (DEIP) • CEaD', margin + 6, y + 13);
  doc.text('Plataforma Virtual de Instrução (PVI) • legis.alepe.pe.gov.br', margin + 6, y + 19);

  // Status Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(197, 155, 39);
  doc.text('REGISTRO OFICIAL', pageWidth - margin - 6, y + 13, { align: 'right' });

  y += 32;

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(11, 60, 116);
  doc.text('REGISTRO DE CONSULTA E ATENDIMENTO - TUTOR PVI', margin, y);
  y += 6;

  // Metadata Panel Box
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(200, 215, 235);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text('Emissão:', margin + 4, y + 6);
  doc.text('Contexto:', margin + 4, y + 11);
  doc.text('Fontes:', margin + 4, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(formatDate(Date.now()), margin + 20, y + 6);
  doc.text(
    options?.courseTitle || 'Plataforma Virtual de Instrução (PVI / PMPE) - http://pvi.pm.pe.gov.br/',
    margin + 20,
    y + 11
  );
  doc.text(
    'Módulos PVI PMPE, Legislação da ALEPE e Diretrizes da DEIP',
    margin + 20,
    y + 16
  );

  y += 28;

  // Filter messages to display (skip intro if user had questions, or include all)
  const userInteractions = messages.filter((m) => m.role === 'user');
  let interactionCount = 1;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const isUser = msg.role === 'user';
    const isAssistant = msg.role === 'assistant';

    // Skip welcome message if there are subsequent user interactions
    if (msg.id === 'pvi-initial-msg' && userInteractions.length > 0) {
      continue;
    }

    if (isUser) {
      checkPageBreak(25);

      // Question Header Banner
      doc.setFillColor(235, 242, 255);
      doc.setDrawColor(180, 205, 240);
      doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(11, 60, 116);
      doc.text(`CONSULTA #${interactionCount} - ALUNO / INSTRUTOR`, margin + 3, y + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.text(formatDate(msg.timestamp), pageWidth - margin - 3, y + 4.8, { align: 'right' });

      y += 9;

      // Question Content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(20, 20, 20);

      const splitQuestion = doc.splitTextToSize(msg.text, contentWidth - 4);
      checkPageBreak(splitQuestion.length * 4.5 + 4);

      doc.text(splitQuestion, margin + 2, y);
      y += splitQuestion.length * 4.5 + 4;
    } else if (isAssistant) {
      checkPageBreak(30);

      // Assistant Header Banner
      doc.setFillColor(245, 248, 252);
      doc.setDrawColor(11, 60, 116);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(11, 60, 116);
      doc.text('RESPOSTA FUNDAMENTADA - TUTOR PVI', margin + 3, y + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.text('Base Oficial DEIP / ALEPE', pageWidth - margin - 3, y + 4.8, { align: 'right' });

      y += 9;

      // Assistant Content (clean markdown formatting for clean PDF display)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 30, 30);

      // Clean basic markdown asterisks for plain readability
      const cleanedText = msg.text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1');

      const splitAnswer = doc.splitTextToSize(cleanedText, contentWidth - 6);

      // We can chunk long answers across pages if needed
      let lineIndex = 0;
      while (lineIndex < splitAnswer.length) {
        const remainingSpace = pageHeight - margin - 15 - y;
        const linesCanFit = Math.max(1, Math.floor(remainingSpace / 4.2));
        const chunk = splitAnswer.slice(lineIndex, lineIndex + linesCanFit);

        doc.text(chunk, margin + 3, y);
        y += chunk.length * 4.2;
        lineIndex += linesCanFit;

        if (lineIndex < splitAnswer.length) {
          doc.addPage();
          drawHeaderFooter();
          y = 30;
        }
      }

      y += 6;

      // Thin divider line between interactions
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      interactionCount++;
    }
  }

  // --- FOOTER ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);

    // Bottom line
    doc.setDrawColor(210, 215, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text(
      'Documento de instrução e estudo • Plataforma Virtual de Instrução (PVI / PMPE)',
      margin,
      pageHeight - 7
    );
    doc.text(`Página ${p} de ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // Save PDF file
  doc.save(`Tutor_PVI_PMPE_Atendimento_${getFileTimestamp()}.pdf`);
}
