document
  .querySelector("#loginForm")
  .addEventListener("submit", async (form) => {
    //try {
    const username = form.srcElement.username.value;
    const password = form.srcElement.password.value;
    const key = await digestMessage(username + password);
    try {
      fetch("/api", {
        headers: { Authorization: key },
      })
        .then((res) => res.json())
        .then((res) => {
          const data = res;
          localStorage.setItem("key", key);
          sessionStorage.setItem("key", key);
          sessionStorage.setItem("data", JSON.stringify(data));
          window.location.replace("/app");
        });
    } catch (error) {
      console.error(error);
      wrongLogin();
      alert(error);
    }
  });

function wrongLogin() {
  console.log("wrongLogin");
}
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}
