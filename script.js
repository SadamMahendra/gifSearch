const submitBtn = document.querySelector("#submit-btn");
const wrapperEl = document.querySelector(".wrapper");
const loader = document.querySelector(".loader");

let generateGif = () => {
  // menampilkan loader sampai gif tampil
  loader.style.display = "block";
  wrapperEl.style.display = "none";

  // mendapatkan gif search value
  let q = document.querySelector("#search-box").value;

  // angka untuk menampilkan berapa banyak gif
  let gifCount = 10;

  // api url
  let finalUrl = `https://api.giphy.com/v1/gifs/search${apiKey}&q=${q}&limit=${gifCount}&offset=0&rating=g&lang=en`;
  wrapperEl.innerHTML = "";

  // function untuk memanggil api
  loadGif(finalUrl, gifCount);
};

async function loadGif(finalUrl, gifCount) {
  try {
    const api = await fetch(finalUrl);
    const info = await api.json();

    // semua gifs
    let gifsData = info.data;
    gifsData.forEach((gif) => {
      // menambahkan card untuk setiap gif
      let container = document.createElement("div");
      container.classList.add("container");
      let iframe = document.createElement("img");
      iframe.setAttribute("src", gif.images.downsized_medium.url);
      iframe.addEventListener("load", function () {
        // jika iframe sudah load degan benar, kurangi count setiap gif
        gifCount--;
        if (gifCount == 0) {
          // ketika semua gifs sudah keload, hilangkan loader dan display gif ui
          loader.style.display = "none";
          wrapperEl.style.display = "grid";
        }
      });
      container.append(iframe);

      // copy link button
      let copyBtn = document.createElement("button");
      copyBtn.innerText = "Salin link";
      copyBtn.addEventListener("click", function () {
        let copylink = `https://media4.giphy.com/media/${gif.id}/giphy.mp4`;

        navigator.clipboard
          .writeText(copylink)
          .then(() => {
            alert("Gif Copied to clipboard");
          })
          .catch(() => {
            alert("Gif copied to clipboard");

            let hiddenInput = document.createElement("input");

            hiddenInput.setAttribute("type", "text");
            document.body.appendChild(hiddenInput);
            hiddenInput.value = copylink;
            // select value
            hiddenInput.select();
            // copy value
            document.execCommand("copy");
            // menghilangkan input
            document.body.removeChild(hiddenInput);
          });
      });
      container.append(copyBtn);

      wrapperEl.append(container);
    });
  } catch (error) {
    console.log(error);
  }
}

// generate gif di screen load atau ketika user click submit
submitBtn.addEventListener("click", generateGif);
window.addEventListener("load", generateGif);
