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
  document.querySelector("#addRecordModal").style.visibility = "hidden";
});
document.querySelector("#openModal").addEventListener("click", (elm) => {
  document.querySelector("#addRecordModal").style.visibility = "visible";
});
document.querySelector("#closeModal").addEventListener("click", (elm) => {
  document.querySelector("#addRecordModal").style.visibility = "hidden";
});
