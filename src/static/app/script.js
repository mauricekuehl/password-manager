if ("key" in sessionStorage && "data" in sessionStorage) {
  renderData();
} else {
  window.location.replace("/login");
}
document.querySelector("#reload").addEventListener("click", (elm) => {
  if ("key" in sessionStorage) {
    const key = sessionStorage.getItem("key");
    fetch("/api", {
      headers: { Authorization: key },
    })
      .then((res) => res.json())
      .then((res) => {
        const data = res;
        sessionStorage.setItem("key", key);
        sessionStorage.setItem("data", JSON.stringify(data));
      })
      .catch((error) => {
        console.error(error);
        alert(error);
        window.location.replace("/login");
      });
    renderData();
  } else {
    window.location.replace("/login");
  }
});
function renderData() {
  const data = JSON.parse(sessionStorage.getItem("data"));
  let html = "";
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const elm = data[key];
      if (elm.url === "") {
        var hostname = "";
      } else {
        var hostname = new URL(elm.url).hostname;
      }
      html += `<div class="record">
        <img data-value="${elm.name}" class="logo"
          height="64"
          width="64"
          src="https://icons.duckduckgo.com/ip3/${hostname}.ico"
        />
        <button class="copyToClipboard" data-value="${elm.username}" >copy username</button>
        <button class="copyToClipboard" data-value="${elm.password}" >copy password</button>
        <a href="${elm.url}" target="_blank" rel="">
          <img src="" alt="go to url" data-value="${elm.url}" />
        </a>
        <p>${elm.name}</p>
      </div>`;
    }
  }
  //I am aware that this is vulnerable to XSS, but there are bigger problems in case someone gets access to your passwords.
  document.querySelector("#entries").innerHTML = html;
  //  document.querySelectorAll("[data-modal-target]").click;
}
document.querySelectorAll(".record .logo").forEach((img) => {
  img.addEventListener("click", (elm) => {
    const form = document.querySelector("#addRecordForm");
    const data = JSON.parse(sessionStorage.getItem("data"))[
      elm.srcElement.dataset.value
    ];
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        form[key].value = data[key];
      }
    }
    document.querySelector("#openModal").click();
  });
});
document.querySelectorAll(".copyToClipboard").forEach((button) => {
  button.addEventListener("click", (elm) => {
    navigator.clipboard.writeText(elm.srcElement.dataset.value);
  });
});
function clearForm(form) {
  form.name.value = "";
  form.username.value = "";
  form.password.value = "";
  form.url.value = "";
  form.totp.value = "";
  form.notes.value = "";
}
document.querySelector("#addRecordForm").addEventListener("submit", (form) => {
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
  renderData();
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
  clearForm(document.querySelector("#addRecordForm"));
}
