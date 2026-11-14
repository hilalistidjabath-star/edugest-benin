const SUPABASE_URL = 'https://lmpqmeuswifvjdrrkbmi.supabase.co';
const SUPABASE_KEY = 'sb_publishable__RKcoyjJbrO2M90ExI5NOg_QpyKtbiA';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const showMessage = (id, message) => {
  const element = document.getElementById(id);
  if (element) element.textContent = message;
};

// INSCRIPTION
const signupForm = document.getElementById('signupForm');

signupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  showMessage('signupMessage', 'Inscription en cours...');

  try {
    const fullName = signupForm.querySelector('[name="name"]').value.trim();
    const email = signupForm.querySelector('[name="email"]').value.trim();
    const phone = signupForm.querySelector('[name="phone"]').value.trim();
    const password = signupForm.querySelector('[name="password"]').value;

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone
        }
      }
    });

    if (error) throw error;

    showMessage(
      'signupMessage',
      data.session
        ? 'Compte créé avec succès. Vous pouvez vous connecter.'
        : 'Inscription enregistrée. Vérifiez votre boîte e-mail pour confirmer votre compte.'
    );

  } catch (error) {
    showMessage('signupMessage', 'Erreur : ' + error.message);
  }
});

// CONNEXION
const loginForm = document.getElementById('loginForm');

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  showMessage('loginMessage', 'Connexion en cours...');

  try {
    const email = loginForm.querySelector('[type="email"]').value.trim();
    const password = loginForm.querySelector('[type="password"]').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    showMessage('loginMessage', 'Connexion réussie !');
    showDashboard(data.user);

  } catch (error) {
    showMessage('loginMessage', 'Erreur : ' + error.message);
  }
});

// TABLEAU DE BORD DIRECTEUR
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
      <input name="schoolName" required>

      <label>Type d'établissement</label>
      <select name="schoolType" required>
        <option value="">Choisir</option>
        <option value="primaire">Primaire</option>
        <option value="secondaire">Secondaire</option>
        <option value="les_deux">Primaire et secondaire</option>
      </select>

      <label>Adresse</label>
      <input name="address">

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
    showMessage('schoolMessage', 'Enregistrement en cours...');

    try {
      const { error } = await supabaseClient.rpc(
        'create_school_and_director',
        {
          p_name: form.elements.schoolName.value.trim(),
          p_school_type: form.elements.schoolType.value,
          p_address: form.elements.address.value.trim() || null,
          p_city: form.elements.city.value.trim() || 'Bénin'
        }
      );

      if (error) throw error;

      showMessage(
        'schoolMessage',
        'Établissement enregistré. Il reste à le faire valider.'
      );

      form.reset();

    } catch (error) {
      showMessage('schoolMessage', 'Erreur : ' + error.message);
    }
  });

  document.getElementById('logoutButton').addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    location.reload();
  });
}

// RESTAURATION DE SESSION
async function checkSession() {
  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) throw error;

    if (data.session) showDashboard(data.session.user);

  } catch (error) {
    console.error('Erreur de session :', error.message);
  }
}

checkSession();
