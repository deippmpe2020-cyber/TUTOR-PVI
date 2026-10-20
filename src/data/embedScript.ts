/**
 * Embed script generator for Tutor PVI floating widget in Moodle
 * Can be used as a standalone /embed/tutor-pvi.js or copied as an inline snippet
 */

export function generateEmbedScript(serverUrl: string = '', position: 'bottom-right' | 'bottom-left' = 'bottom-right'): string {
  return `(function () {
  if (window.__TUTOR_PVI_EMBED_INITIALIZED__) return;
  window.__TUTOR_PVI_EMBED_INITIALIZED__ = true;

  // Auto-detect server URL if not explicitly provided
  var scriptTag = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var userConfig = window.TutorPviConfig || {};
  var serverBase = userConfig.serverUrl || (scriptTag && scriptTag.getAttribute('data-server')) || '${serverUrl}' || window.location.origin;
  serverBase = serverBase.replace(/\\/+$/, '');
  
  var position = userConfig.position || (scriptTag && scriptTag.getAttribute('data-position')) || '${position}';
  var isRight = position !== 'bottom-left';

  // Inject CSS Styles
  var style = document.createElement('style');
  style.id = 'tutor-pvi-styles';
  style.textContent = [
    '#tutor-pvi-container { position: fixed; bottom: 24px; ' + (isRight ? 'right: 24px;' : 'left: 24px;') + ' z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: ' + (isRight ? 'flex-end;' : 'flex-start;') + ' }',
    '#tutor-pvi-launcher { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #0B3C74 0%, #082952 100%); border: 2.5px solid #C59B27; box-shadow: 0 8px 24px rgba(11, 60, 116, 0.45); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; user-select: none; }',
    '#tutor-pvi-launcher:hover { transform: scale(1.08); box-shadow: 0 12px 28px rgba(11, 60, 116, 0.6); border-color: #E6B837; }',
    '#tutor-pvi-launcher:active { transform: scale(0.96); }',
    '#tutor-pvi-badge-dot { position: absolute; top: 1px; right: 1px; width: 14px; height: 14px; background: #10B981; border: 2.5px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 8px rgba(16, 185, 129, 0.8); }',
    '#tutor-pvi-tooltip { background: #0B3C74; color: #FFFFFF; padding: 7px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.18); border: 1px solid #C59B27; white-space: nowrap; cursor: pointer; transition: opacity 0.2s; display: flex; align-items: center; gap: 6px; }',
    '#tutor-pvi-tooltip:hover { background: #082952; }',
    '#tutor-pvi-dialog { width: 400px; height: 680px; max-width: calc(100vw - 32px); max-height: calc(100vh - 100px); background: #FFFFFF; border-radius: 16px; border: 2px solid #0B3C74; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25); margin-bottom: 14px; display: none; flex-direction: column; overflow: hidden; transform-origin: ' + (isRight ? 'bottom right' : 'bottom left') + '; animation: tutorPviPop 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards; }',
    '@keyframes tutorPviPop { 0% { opacity: 0; transform: scale(0.92) translateY(16px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }',
    '#tutor-pvi-iframe { width: 100%; height: 100%; border: none; background: #FFFFFF; }',
    '@media (max-width: 480px) { #tutor-pvi-dialog { width: calc(100vw - 20px); height: calc(100vh - 80px); bottom: 10px; ' + (isRight ? 'right: 10px;' : 'left: 10px;') + ' } }'
  ].join('\\n');
  document.head.appendChild(style);

  // Build Container
  var container = document.createElement('div');
  container.id = 'tutor-pvi-container';

  // Tooltip
  var tooltip = document.createElement('div');
  tooltip.id = 'tutor-pvi-tooltip';
  tooltip.innerHTML = '<span style="color:#C59B27;">✦</span> Tutor PVI PMPE <span style="font-size:10px; opacity:0.85;">(Dúvidas)</span>';

  // Floating Dialog
  var dialog = document.createElement('div');
  dialog.id = 'tutor-pvi-dialog';

  var iframe = document.createElement('iframe');
  iframe.id = 'tutor-pvi-iframe';
  iframe.src = serverBase + '/?widget=true';
  iframe.title = 'Tutor PVI - Assistente Virtual PMPE';
  iframe.setAttribute('allow', 'clipboard-write');
  dialog.appendChild(iframe);

  // Launcher Button
  var launcher = document.createElement('div');
  launcher.id = 'tutor-pvi-launcher';
  launcher.title = 'Abrir Tutor PVI - Plataforma Virtual de Instrução PMPE';
  launcher.setAttribute('role', 'button');
  launcher.setAttribute('aria-label', 'Abrir Assistente Virtual Tutor PVI');

  // SVG Icon (Official Police Shield & Star)
  launcher.innerHTML = [
    '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">',
    '  <path d="M12 2L4 5V11.5C4 16.5 7.4 21.1 12 22.3C16.6 21.1 20 16.5 20 11.5V5L12 2Z" fill="#C59B27" stroke="#FFFFFF" stroke-width="1.2"/>',
    '  <path d="M12 6L13.5 9.5H17L14.2 11.6L15.3 15L12 12.8L8.7 15L9.8 11.6L7 9.5H10.5L12 6Z" fill="#0B3C74"/>',
    '</svg>',
    '<div id="tutor-pvi-badge-dot"></div>'
  ].join('');

  var isOpen = false;

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      dialog.style.display = 'flex';
      tooltip.style.display = 'none';
      launcher.style.transform = 'scale(0.92)';
      launcher.style.borderColor = '#10B981';
      launcher.title = 'Minimizar Tutor PVI';
    } else {
      dialog.style.display = 'none';
      tooltip.style.display = 'flex';
      launcher.style.transform = '';
      launcher.style.borderColor = '#C59B27';
      launcher.title = 'Abrir Tutor PVI - Plataforma Virtual de Instrução PMPE';
    }
  }

  launcher.addEventListener('click', toggleChat);
  tooltip.addEventListener('click', toggleChat);

  // Listen for close/minimize events from iframe inside
  window.addEventListener('message', function (event) {
    if (event.data === 'tutor-pvi-close' || (event.data && event.data.action === 'close')) {
      if (isOpen) toggleChat();
    }
  });

  container.appendChild(dialog);
  container.appendChild(tooltip);
  container.appendChild(launcher);
  document.body.appendChild(container);
})();
`;
}
