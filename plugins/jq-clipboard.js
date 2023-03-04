function clipboard() {
  const articleContent = document.getElementById("article-content");
  if (!articleContent) return;
  const allPre = articleContent.getElementsByTagName("pre");

  for (let i = 0; i < allPre.length; i++) {
    const onePre = document.getElementsByTagName("pre")[i];
    onePre.innerHTML += '<div class="btn"><button class="btn-tip">已复制！</button><button class="btn" data-clipboard-action="copy">复制</button></div>';
  }

  const pres = document.getElementsByTagName("pre");
  for (let i = 0; i < pres.length; i++) {
    pres[i].setAttribute('id', "pre" + i);
    const btns = pres[i].querySelectorAll("button");
    for (let j = 0; j < btns.length; j++) {
      btns[j].setAttribute('data-clipboard-target', "#pre" + i);
    }
  }

  const clipboard = new ClipboardJS('.btn');
  clipboard.on('success', function () {
    const btnTips = document.querySelectorAll(".btn-tip");
    for (let i = 0; i < btnTips.length; i++) {
      btnTips[i].style.display = "block";
      setTimeout(() => {
        btnTips[i].style.display = "none";
      }, 1000);
    }
  });
}

export default clipboard;
