if (key in sessionStorage && data in sessionStorage) {
  renderData();
} else {
  window.location.replace("/login");
}
document.querySelector("#reload").addEventListener(onclick, (elm) => {
  if (key in sessionStorage) {
    const key = sessionStorage.getItem("key");
    try {
      const data = await fetch("/api", {
        headers: { Authorization: key },
      }).then((response) => {
        if (response.status == 409) {
          window.location.replace("/login");
        } else {
          response.json();
          sessionStorage.setItem("key", key);
          sessionStorage.setItem("data", response.body);
          window.location.replace("/app");
          console.log("login", key);
        }
      });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  } else {
    window.location.replace("/login");
  }
});
function renderData(data) {
  console.log(data);
}
