document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) {
    alert('Preencha todos os campos!');
    return;
  }
  alert('Login realizado! (apenas visual)');
});
