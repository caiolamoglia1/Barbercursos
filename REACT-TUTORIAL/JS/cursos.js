// Interatividade básica: cursor pointer já está no CSS
// Exemplo: alert ao clicar em um card

document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('click', () => {
    alert('Abrir detalhes do curso (exemplo visual)');
  });
});
