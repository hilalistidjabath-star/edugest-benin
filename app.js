const SUPABASE_URL = 'https://lmpqmeuswifvjdrrkbmi.supabase.co';
const SUPABASE_KEY = 'sb_publishable__RKcoyjJbrO2M90ExI5NOg_QpyKtbiA';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// INSCRIPTION DU DIRECTEUR
const signupForm = document.getElementById('signupForm');

signupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = document.getElementById('signupMessage');

  const fullName = signupForm.querySelector('[name="name"]').value;
  const email = signupForm.querySelector('[name="email"]').value;
  const phone = signupForm.querySelector('[name="phone"]').value;
  const password = signupForm.querySelector('[name="password"]').value;

  message.textContent = 'Inscription en cours...';

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone
      }
    }
  });

  message.textContent = error
    ? error.message
    : 'Inscription réussie ! Vérifiez votre adresse e-mail pour confirmer votre compte.';
});

// CONNEXION
const loginForm = document.getElementById('loginForm');

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = document.getElementById('loginMessage');

  const email = loginForm.querySelector('[type="email"]').value;
  const password = loginForm.querySelector('[type="password"]').value;

  message.textContent = 'Connexion en cours...';

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  message.textContent = error
    ? error.message
    : 'Connexion réussie !';
});
