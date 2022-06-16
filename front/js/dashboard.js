const welcome = document.getElementById('welcome');
const numberAccount = document.getElementById('numberAccount');

const bankAccount = JSON.parse(localStorage.getItem('bankAccount'));

if (!bankAccount) {
  window.location.href = './login.html';
}

welcome.innerHTML = `Bienvenido ${bankAccount.user.firstName} ${bankAccount.user.lastName}`;
numberAccount.innerHTML = `Numero de cuenta: ${bankAccount.numberAccount} | Tipo de cuenta: ${bankAccount.typeAccount}`;

const buttonCurrentBalance = document.getElementById('buttonCurrentBalance');
const currentBalance = document.getElementById('currentBalance');

buttonCurrentBalance.addEventListener('click', async (e) => {
  e.preventDefault();

  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/bankAccount/${bankAccount.id}/current-balance`
  );

  const data = await response.json();

  if (response.status === 200) {
    currentBalance.innerHTML = `Saldo actual: ${data.data.currentBalance}`;
  }
});

const buttonWithdraw = document.getElementById('buttonWithdraw');
const messageModal = document.getElementById('messageModal');

buttonWithdraw.addEventListener('click', async (e) => {
  e.preventDefault();

  const amount = document.getElementById('withdrawAmount').value;

  if (amount.length > 0) {
    const data = {
      amount: parseInt(amount),
    };
    const response = await fetch(
      `http://127.0.0.1:3000/api/v1/bankAccount/${bankAccount.id}/withdraw`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    messageModal.innerHTML = 'Retiro con exito. Agarre su dinero.';
  }
});

const buttonDeposit = document.getElementById('buttonDeposit');

buttonDeposit.addEventListener('click', async (e) => {
  e.preventDefault();

  const amount = document.getElementById('depositAmount').value;

  if (amount.length > 0) {
    const data = {
      amount: parseInt(amount),
    };

    const response = await fetch(
      `http://127.0.0.1:3000/api/v1/bankAccount/${bankAccount.id}/deposit`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    messageModal.innerHTML = 'Deposito con exito.';
  }
});

const buttonTransaction = document.getElementById('buttonTransaction');

buttonTransaction.addEventListener('click', async (e) => {
  e.preventDefault();

  const amount = document.getElementById('transactionAmount').value;
  const numberAccount = document.getElementById(
    'transactionNumberAccount'
  ).value;

  if (amount.length > 0) {
    const data = {
      destinationAccountNumberAccount: numberAccount,
      amount: parseInt(amount),
    };

    const response = await fetch(
      `http://127.0.0.1:3000/api/v1/bankAccount/${bankAccount.id}/performTransaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    messageModal.innerHTML = 'Transaccion con exito.';
  }
});

const buttonExit = document.getElementById('buttonExit');

buttonExit.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('bankAccount');
  window.location.href = './login.html';
});
