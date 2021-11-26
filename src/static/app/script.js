getData();
function getData() {
  if ("key" in sessionStorage && "vaultKey" in sessionStorage) {
    var key = sessionStorage.getItem("key");
    var vaultKey = sessionStorage.getItem("vaultKey");
  } else if ("key" in localStorage && "vaultKey" in localStorage) {
    var key = localStorage.getItem("key");
    var vaultKey = localStorage.getItem("vaultKey");
  } else {
    window.location.replace("/login");
    return;
  }
  fetch("/api", {
    headers: { Authorization: key },
  })
    .then((res) => res.json())
    .then((res) => {
      let data = res;
      Object.keys(data).map((hashedName) => {
        data[hashedName] = JSON.parse(
          CryptoJS.AES.decrypt(data[hashedName], vaultKey).toString(
            CryptoJS.enc.Utf8
          )
        );
      });
      sessionStorage.setItem(
        "data",
        JSON.stringify(
          Object.keys(data)
            .sort((a, b) => (data[a].name > data[b].name ? 1 : -1))
            .reduce((r, k) => ((r[k] = data[k]), r), {})
        )
      );
      renderData();
    })
    .catch((error) => {
      console.error(error);
      alert(error);
      window.location.replace("/login");
    });
}
function renderData() {
  const data = JSON.parse(sessionStorage.getItem("data"));
  let html = "";
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      let elm = data[key];
      if (elm.url === "") {
        elm.url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        var hostname = "";
      } else {
        var hostname = new URL(elm.url).hostname;
      }
      html += `<div class="record">
        <div id="nav">
          <img src="../images/user.svg" class="copyToClipboard" data-value="${elm.username}" alt="copy username"/>
          <img src="../images/key.svg" class="copyToClipboard" data-value="${elm.password}" alt="copy password"/>
          <img src="../images/bin.svg" id="deleteRecord" data-value="${key}" alt="delete"/>
          <a href="${elm.url}" target="_blank" rel="">
            <img src="../images/link.png" alt="go to url"/>
          </a>
        </div>
        <div id="logo" data-value="${key}">
          <img src="https://icons.duckduckgo.com/ip3/${hostname}.ico" alt="change record"/>
          <p>${elm.name}</p>  
        </div>
      </div>`;
    }
  }
  //I am aware that this is vulnerable to XSS, but there are bigger problems in case someone gets access to your passwords.
  document.querySelector("#entries").innerHTML = html;
  document.querySelectorAll("#deleteRecord").forEach((button) => {
    button.addEventListener("click", (elm) => {
      openRecordModal(document.querySelector("#deleteConfirmation"));
      document.querySelector("#approvedDeletion").dataset.key =
        elm.srcElement.dataset.value;
    });
  });
  document
    .querySelector("#approvedDeletion")
    .addEventListener("click", (elm) => {
      const key = elm.srcElement.dataset.key;
      let newData = JSON.parse(sessionStorage.getItem("data"));
      delete newData[key];
      sessionStorage.setItem("data", JSON.stringify(newData));
      fetch("/api", {
        method: "DELETE",
        headers: {
          Authorization: sessionStorage.getItem("key"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: key }),
      });
      closeModal(document.querySelector("#deleteConfirmation"));
      renderData();
    });
  document.querySelectorAll(".copyToClipboard").forEach((button) => {
    button.addEventListener("click", (elm) => {
      navigator.clipboard.writeText(elm.srcElement.dataset.value);
    });
  });
  document.querySelectorAll(".record #logo").forEach((record) => {
    record.addEventListener("click", (elm) => {
      const form = document.querySelector("#recordForm");
      const data = JSON.parse(sessionStorage.getItem("data"))[
        elm.srcElement.parentElement.dataset.value
      ];
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          form[key].value = data[key];
        }
      }
      document.querySelector("#openRecordModal").click();
    });
  });
}
document.querySelector("#reload").addEventListener("click", getData);
document.querySelector("#recordForm").addEventListener("submit", (form) => {
  const data = {
    name: form.srcElement.name.value,
    username: form.srcElement.username.value,
    password: form.srcElement.password.value,
    url: form.srcElement.url.value,
    totp: form.srcElement.totp.value,
    notes: form.srcElement.notes.value,
  };
  const hashedName = CryptoJS.SHA256(data.name).toString();
  const encrypedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    sessionStorage.getItem("vaultKey")
  ).toString();
  fetch("/api", {
    method: "POST",
    headers: {
      Authorization: sessionStorage.getItem("key"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: hashedName, content: encrypedData }),
  });
  let newData = JSON.parse(sessionStorage.getItem("data"));
  newData[hashedName] = data;
  sessionStorage.setItem("data", JSON.stringify(newData));
  document.querySelector("#recordModal .close-button").click();
  form.preventDefault();
  renderData();
});
document.querySelectorAll("[data-modal-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openRecordModal(modal);
  });
});
document.getElementById("overlay").addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});
document.querySelectorAll("[data-close-button]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});
function openRecordModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  document.getElementById("overlay").classList.add("active");
}
function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
  form = document.querySelector("#recordForm");
  form.name.value = "";
  form.username.value = "";
  form.password.value = "";
  form.url.value = "";
  form.totp.value = "";
  form.notes.value = "";
}
