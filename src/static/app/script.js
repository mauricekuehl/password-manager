if ("key" in sessionStorage && "data" in sessionStorage) {
  renderData();
} else {
  window.location.replace("/login");
}
document.querySelector("#reload").addEventListener("click", (elm) => {
  if ("key" in sessionStorage) {
    const key = sessionStorage.getItem("key");
    try {
      fetch("/api", {
        headers: { Authorization: key },
      })
        .then((res) => res.json())
        .then((res) => {
          const data = res;
          sessionStorage.setItem("key", key);
          sessionStorage.setItem("data", JSON.stringify(data));
        });
      renderData();
    } catch (error) {
      console.error(error);
      alert(error);
      window.location.replace("/login");
    }
  } else {
    window.location.replace("/login");
  }
});
function renderData() {
  try {
    console.log(JSON.parse(sessionStorage.getItem("data")));
  } catch (error) {
    console.error(error);
    //window.location.replace("/login");
  }
}
document.querySelector("#addRecordForm").addEventListener("submit", (form) => {
  const username = form.srcElement.username.value;
  const data = {
    name: form.srcElement.name.value,
    username: form.srcElement.username.value,
    password: form.srcElement.password.value,
    url: form.srcElement.url.value,
    totp: form.srcElement.totp.value,
    notes: form.srcElement.notes.value,
  };
  fetch("/api", {
    method: "POST",
    headers: {
      Authorization: sessionStorage.getItem("key"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let newData = JSON.parse(sessionStorage.getItem("data"));
  newData[form.srcElement.name.value] = data;
  sessionStorage.setItem("data", JSON.stringify(newData));
  document.querySelector("#addRecordModal .close-button").click();
  form.preventDefault();
});
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});
overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});
closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});
function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}
function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}
