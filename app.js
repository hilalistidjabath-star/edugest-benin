const SUPABASE_URL = 'https://lmpqmeuswifvjdrrkbmi.supabase.co';
const SUPABASE_KEY = 'sb_publishable__RKcoyjJbrO2M90ExI5NOg_QpyKtbiA';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const signupForm = document.getElementById('signupForm');

signupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = document.getElementById('signupMessage');
  const email = signupForm.querySelector('[type="email"]').value;
  const password = signupForm.querySelector('[type="password"]').value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  message.textContent = error
    ? error.message
    : 'Inscription enregistrée. Vérifiez votre adresse e-mail.';
});

const loginForm = document.getElementById('loginForm');

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = document.getElementById('loginMessage');
  const email = loginForm.querySelector('[type="email"]').value;
  const password = loginForm.querySelector('[type="password"]').value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  message.textContent = error
    ? error.message
    : 'Connexion réussie !';
});
