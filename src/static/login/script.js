document
  .querySelector("#loginForm")
  .addEventListener("submit", async (form) => {
    try {
      const username = form.srcElement.username.value;
      const password = form.srcElement.password.value;
      const key = await digestMessage(username + password);
      let res = await fetch("/api", {
        headers: { Authorization: key },
      });
      if (!res.ok) throw new Error(res.status);
      res = res.json();
      sessionStorage.setItem("key", key);
      sessionStorage.setItem("data", JSON.stringify(res));
      window.location.replace("/app");
    } catch (error) {
      wrongLogin();
      console.error(error);
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
