// Renderização dinâmica dos módulos do tutorial
function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function getStatusIcon(status) {
  if (status === 'completed') {
    return '<i class="fa fa-check-circle status-completed"></i>';
  } else if (status === 'in-progress') {
    return '<i class="fa fa-circle status-inprogress"></i>';
  } else {
    return '<i class="fa fa-lock status-locked"></i>';
  }
}

function renderModules() {
  const tutorialId = getParam('tutorialId');
  const list = document.getElementById('modulesList');
  const error = document.getElementById('errorMsg');

  if (!tutorialId || !window.tutorials) {
    error.style.display = 'block';
    error.innerText = 'Tutorial não encontrado.';
    return;
  }

  const tutorial = window.tutorials.find(t => t.tutorialId === tutorialId);
  if (!tutorial) {
    error.style.display = 'block';
    error.innerText = 'Tutorial não encontrado.';
    return;
  }

  tutorial.modules.forEach(module => {
    const item = document.createElement('a');
    item.className = 'module-item';
    item.href = `player.html?videoId=${module.videoId}`;
    item.innerHTML = `
      <span class="drag-handle"><i class="fa fa-grip-vertical"></i></span>
      <span class="module-title">${module.title}</span>
      <span class="module-status">${getStatusIcon(module.status)}</span>
    `;
    list.appendChild(item);
  });
}

document.addEventListener('DOMContentLoaded', renderModules);
