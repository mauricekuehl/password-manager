document
  .querySelector("#loginForm")
  .addEventListener("submit", async (form) => {
    const username = form.srcElement.username.value;
    const password = form.srcElement.password.value;
    const key = await digestMessage(username + password);
    const vaultKey = await digestMessage(password + key);
    const res = await fetch("/api/login", {
      headers: { Authorization: key },
    });
    if (!res.ok) {
      if (res.status == 409) wrongLogin();
      return;
    }
    if (form.srcElement.safe.checked === "on") {
      localStorage.setItem("vaultKey", vaultKey);
      localStorage.setItem("key", key);
    } else {
      sessionStorage.setItem("vaultKey", vaultKey);
      sessionStorage.setItem("key", key);
    }
    window.location.replace("/app");
  });
function wrongLogin() {
  const elm = document.querySelector("#wrongLogin");
  elm.style.display = "block";
  elm.classList.remove("wrongLoginAni");
  void elm.offsetWidth;
  elm.classList.add("wrongLoginAni");
}
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}
