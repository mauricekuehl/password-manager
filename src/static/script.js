document
  .querySelector("#loginForm")
  .addEventListener("submit", async (form) => {
    const username = form.originalTarget.username.value;
    const password = form.originalTarget.password.value;
    const key = await digestMessage(username + password);
    const data = await fetch("/api", { headers: { Authorization: "1" } }).then(
      (response) => response.json()
    );
    console.log(data);
  });

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}
