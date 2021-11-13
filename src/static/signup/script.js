document
  .querySelector("#signupForm")
  .addEventListener("submit", async (form) => {
    const username = form.srcElement.username.value;
    const password = form.srcElement.password.value;
    const key = await digestMessage(username + password);
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { Authorization: key },
      });
      localStorage.setItem("key", key);
      window.location.replace("/login");
    } catch (error) {
      console.error(error);
      alert(error);
    }
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
