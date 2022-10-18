const addresForm = document.querySelector("#addres-form");
const cepInput = document.querySelector("#cep");
const addresInput = document.querySelector("#addres");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");
const messageSuccess = document.querySelector("#success");
const messageErro = document.querySelector("#erro");
const fadeElement = document.querySelector("#fade");

// Validate CEP input
cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]/;
  const key = String.fromCharCode(e.keyCode);
  // bloquear o usuário de digitar algo além de números
  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});

// Get addres event
cepInput.addEventListener("keyup", (e) => {
  const inputValue = e.target.value; // pegar valor do input
  if (inputValue.length === 8) {
    getAddres(inputValue);
  }
});

// Get customer addres from API
const getAddres = async (cep) => {
  toggleLoader();
  cepInput.blur();

  const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Show error and reset form
  if (data.erro === "true") {
    if (!addresInput.hasAttribute("disabled")) {
      toggleDisabled();
    }

    addresForm.reset();
    messageSuccess.classList.add("hide");
    messageErro.classList.remove("hide");
    toggleLoader();
    toggleMessage("CEP inválido, tente novamente.");
    return;
  }

  if (addresInput.value === "") {
    toggleDisabled();
  }

  addresInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;

  toggleLoader();
};

// Add or remove disabled attribute
const toggleDisabled = () => {
  if (regionInput.hasAttribute("disabled")) {
    formInputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
  } else {
    formInputs.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  }
};

// Show or hide loader
const toggleLoader = () => {
  const loaderElement = document.querySelector("#loader");

  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
};

// Show or hide message
const toggleMessage = (msg) => {
  const messageElement = document.querySelector("#message");
  const messageElementText = document.querySelector("#message p");

  messageElementText.innerText = msg;

  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
};

// Close massage modal
closeButton.addEventListener("click", () => toggleMessage());

// Save addres
addresForm.addEventListener("submit", (e) => {
  e.preventDefault();

  toggleLoader();

  setTimeout(() => {
    messageErro.classList.add("hide");
    messageSuccess.classList.remove("hide");

    toggleLoader();
    toggleMessage("Endereço salvo com sucesso!");

    addresForm.reset();
    toggleDisabled();
  }, 1500);
});
