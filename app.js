import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll
} from "./firebase.js";

// Select elements
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const fileList = document.getElementById("fileList");

// Upload File
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Select a file first!");

  const fileRef = ref(storage, "files/" + file.name);
  
  try {
    await uploadBytes(fileRef, file);
    alert("Uploaded ✅");
    fileInput.value = "";
    loadFiles(); // refresh list
  } catch (err) {
    alert("Upload failed ❌");
    console.log(err);
  }
});

// Load & Display Files
async function loadFiles() {
  fileList.innerHTML = "Loading...";

  const listRef = ref(storage, "files/");
  const res = await listAll(listRef);

  fileList.innerHTML = "";

  res.items.forEach(async (itemRef) => {
    const url = await getDownloadURL(itemRef);

    const div = document.createElement("div");
    div.className = "file-item";
    div.innerHTML = `
      <strong>${itemRef.name}</strong><br>
      <a href="${url}" target="_blank">View / Download</a>
    `;

    fileList.appendChild(div);
  });
}

// Load files when page opens
loadFiles();
