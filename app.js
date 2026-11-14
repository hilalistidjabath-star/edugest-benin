const SUPABASE_URL = 'https://lmpqmeuswifvjdrrkbmi.supabase.co';
const SUPABASE_KEY = 'sb_publishable__RKcoyjJbrO2M90ExI5NOg_QpyKtbiA';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ESPACE DE L'APPLICATION
function showDashboard(user) {
  let dashboard = document.getElementById('directorDashboard');

  if (!dashboard) {
    dashboard = document.createElement('section');
    dashboard.id = 'directorDashboard';
    dashboard.className = 'section';
    document.querySelector('main').appendChild(dashboard);
  }

  dashboard.innerHTML = `
    <h2>Mon espace directeur</h2>
    <p>Bienvenue ${user.user_metadata?.full_name || user.email}.</p>

    <h3>Créer mon établissement</h3>

    <form id="schoolForm">
      <label>Nom de l'établissement</label>
      <input name="schoolName" required placeholder="Nom de l'école">

      <label>Type d'établissement</label>
      <select name="schoolType" required>
        <option value="">Choisir</option>
        <option value="primaire">Primaire</option>
        <option value="secondaire">Secondaire</option>
        <option value="les_deux">Primaire et secondaire</option>
      </select>

      <label>Adresse</label>
      <input name="address" placeholder="Adresse de l'établissement">

      <label>Ville</label>
      <input name="city" value="Bénin">

      <button type="submit">Enregistrer mon établissement</button>
      <p id="schoolMessage"></p>
    </form>

    <button id="logoutButton" type="button">Déconnexion</button>
  `;

  document.getElementById('schoolForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById('schoolMessage');

    message.textContent = 'Enregistrement en cours...';

    const { data, error } = await supabaseClient.rpc(
      'create_school_and_director',
      {
        p_name: form.schoolName.value.trim(),
        p_school_type: form.schoolType.value,
        p_address: form.address.value.trim() || null,
        p_city: form.city.value.trim() || 'Bénin'
      }
    );

    if (error) {
      message.textContent = 'Erreur : ' + error.message;
      return;
    }

    message.textContent =
      'Établissement enregistré ! Votre demande sera soumise à validation.';

    form.reset();
  });

  document.getElementById('logoutButton').addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    location.reload();
  });
}

// INSCRIPTION DU DIRECTEUR
const signupForm = document.getElementById('signupForm');

signupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = document.getElementById('signupMessage');

  const fullName = signupForm.querySelector('[name="name"]').value.trim();
  const email = signupForm.querySelector('[name="email"]').value.trim();
  const phone = signupForm.querySelector('[name="phone"]').value.trim();
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
    ? 'Erreur : ' + error.message
    : 'Inscription enregistrée. Vérifiez votre e-mail pour confirmer votre compte.';
});

// CONNEXION
const loginForm = document.getElementById('loginForm');

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = document.getElementById('loginMessage');
  const email = loginForm.querySelector('[type="email"]').value.trim();
  const password = loginForm.querySelector('[type="password"]').value;

  message.textContent = 'Connexion en cours...';

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = 'Erreur : ' + error.message;
    return;
  }

  message.textContent = 'Connexion réussie !';
  showDashboard(data.user);
});

// RESTAURATION DE SESSION
async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    showDashboard(data.session.user);
  }
}

checkSession();

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    showDashboard(session.user);
  }
});
