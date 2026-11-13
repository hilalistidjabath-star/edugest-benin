// Maquette de démonstration uniquement : aucune donnée n'est envoyée à un serveur.
const signupForm = document.getElementById('signupForm');
signupForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('signupMessage').textContent =
    'Compte de démonstration simulé. La création réelle sera activée après configuration de Supabase.';
  signupForm.reset();
});
document.getElementById('loginForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('loginMessage').textContent =
    'Interface de connexion de démonstration. Authentification réelle non encore activée.';
});
