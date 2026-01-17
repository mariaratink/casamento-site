// firebaseConfig (copiada do console)
const firebaseConfig = {
  apiKey: "AIzaSyCvMuKYdUnE9ckMt82rmJ2AV0tFtIRmKKs",
  authDomain: "casamento-maria-henrique.firebaseapp.com",
  projectId: "casamento-maria-henrique",
  storageBucket: "casamento-maria-henrique.firebasestorage.app",
  messagingSenderId: "1006994295553",
  appId: "1:1006994295553:web:0ee61ec65794bab8aea900"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const authDiv = document.getElementById('auth');
const panel = document.getElementById('panel');
const authMsg = document.getElementById('authMsg');

document.getElementById('btnLogin').onclick = async () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('pass').value;
  try{
    await auth.signInWithEmailAndPassword(email, pass);
    authMsg.innerText = '';
  }catch(err){
    authMsg.innerText = 'Erro: ' + err.message;
  }
};

document.getElementById('btnCreate').onclick = async () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('pass').value;
  if(!email || !pass){ authMsg.innerText = 'Preencha email e senha para criar.'; return; }
  try{
    await auth.createUserWithEmailAndPassword(email, pass);
    authMsg.innerText = 'Usuário criado! Agora faça login.';
  }catch(err){
    authMsg.innerText = 'Erro: ' + err.message;
  }
};

document.getElementById('logout').onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
  if(user){
    authDiv.style.display = 'none';
    panel.style.display = 'block';
    loadRSVPs();
  } else {
    authDiv.style.display = 'block';
    panel.style.display = 'none';
  }
});

async function loadRSVPs(){
  const list = document.getElementById('list');
  list.innerText = 'Carregando RSVPs...';
  try{
    const snapshot = await db.collection('rsvps').orderBy('criadoEm','desc').get();
    if(snapshot.empty){ list.innerHTML = '<i>Nenhum RSVP ainda.</i>'; return; }
    list.innerHTML = '';
    snapshot.forEach(doc => {
      const d = doc.data();
      const div = document.createElement('div');
      div.className = 'rsvp';
      const criado = d.criadoEm && d.criadoEm.toDate ? d.criadoEm.toDate().toLocaleString() : '';
      div.innerHTML = `<strong>${d.nome}</strong> — ${d.confirmado || ''} — adultos: ${d.adultos||''} — crianças: ${d.criancas||''} <br/>
        <small>${d.email || ''} — ${criado}</small>
        <p>${d.obs || ''}</p>`;
      list.appendChild(div);
    });
  }catch(err){
    list.innerText = 'Erro ao carregar: ' + err.message;
  }
}

