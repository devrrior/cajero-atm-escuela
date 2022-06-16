const formLogin = document.getElementById('formLogin');

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const numberAccount = e.target.numberAccount.value;
  const nip = e.target.nip.value;

  if (numberAccount.length === 20 && nip.length > 0) {
    const user = {
      numberAccount,
      nip,
    };

    const response = await fetch(
      'http://127.0.0.1:3000/api/v1/bankAccount/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }
    );

    const data = await response.json();

    if (response.status === 404) {
      formLogin.reset();
      alert('Usuario o contraseña incorrectos');
      return;
    }

    alert('Bienvenido ' + data.data.user.firstName);
    localStorage.setItem('bankAccount', JSON.stringify(data.data));

    window.location.href = './dashboard.html';
  } else {
    alert('Numero de cuenta o contraseña no validos');
    formLogin.reset();
  }
});
