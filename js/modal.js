//! Бєк-дроп з модальним вікном
const openModalBtn = document.querySelector("[data-modal-open]");
const modal = document.querySelector("[data-modal]");
const closeModalBtn = document.querySelector("[data-modal-close]");
const form = document.querySelector("[modal-form]");
const submitButton = form.querySelector("[modal-submit]");
const requiredInputs = form.querySelectorAll("[required]");

openModalBtn.addEventListener("click", toggleModal);
closeModalBtn.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-hidden");
  document.body.classList.toggle("no-scroll");
}

const phoneInput = form.querySelector('input[name="tel"]');
const emailInput = form.querySelector('input[name="email"]');

const phoneRegex = /^\+\d{1,3}-\d{2,3}-\d{3}-\d{2}-\d{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const displayErrorMessage = (inputElement, message) => {
  let insertionPoint = inputElement;
  if (inputElement.closest(".modal-input")) {
    insertionPoint = inputElement.closest(".modal-input");
  } else if (inputElement.classList.contains("modal-textarea-comment")) {
    insertionPoint = inputElement;
  } else if (inputElement.type === "checkbox") {
    insertionPoint = inputElement.closest(".modal-label-comment");
  }

  removeErrorMessage(inputElement);

  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = message;

  //   errorMessage.style.color = "red";
  //   errorMessage.style.fontSize = "12px";
  //   errorMessage.style.marginTop = "5px";

  if (insertionPoint) {
    insertionPoint.after(errorMessage);
  }
};

const removeErrorMessage = (inputElement) => {
  let checkElement = inputElement;
  if (inputElement.closest(".modal-input")) {
    checkElement = inputElement.closest(".modal-input");
  } else if (inputElement.type === "checkbox") {
    checkElement = inputElement.closest(".modal-label-comment");
  }

  const nextElement = checkElement.nextElementSibling;

  if (nextElement && nextElement.classList.contains("error-message")) {
    nextElement.remove();
  }
};

const checkFormValidity = () => {
  let allFilledAndValid = true;

  requiredInputs.forEach((input) => {
    removeErrorMessage(input);

    let isValid = true;

    if (input.value.trim() === "") {
      isValid = false;
      displayErrorMessage(input, "Поле повинно бути заповнено.");
    }

    if (input.type === "checkbox" && !input.checked) {
      isValid = false;
    }

    if (input === phoneInput && input.value.trim() !== "") {
      if (!phoneRegex.test(input.value)) {
        isValid = false;
        displayErrorMessage(
          input,
          "Номер телефону некорректний. Формат: +XX-XXX-XXX-XX-XX."
        );
      }
    }
    if (input === emailInput && input.value.trim() !== "") {
      if (!emailRegex.test(input.value)) {
        isValid = false;
        displayErrorMessage(input, "Адреса некорректна.");
      }
    }

    if (!isValid) {
      allFilledAndValid = false;
    }
  });

  submitButton.disabled = !allFilledAndValid;
};

checkFormValidity();

requiredInputs.forEach((input) => {
  if (input.type === "checkbox") {
    input.addEventListener("change", checkFormValidity);
  } else {
    input.addEventListener("input", checkFormValidity);
  }
});

if (phoneInput) {
  phoneInput.addEventListener("input", checkFormValidity);
}
if (emailInput) {
  emailInput.addEventListener("input", checkFormValidity);
}