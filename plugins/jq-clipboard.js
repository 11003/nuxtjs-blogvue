function clipboard () {
  let articleContent = document.getElementById("article-content");
  if(!articleContent) return;
  let allpre = articleContent.getElementsByTagName("pre");
  for (let i = 0; i < allpre.length; i++) {
    let onepre = document.getElementsByTagName("pre")[i];
    onepre.innerHTML += '<div class="btn"><button class="btn-tip">已复制！</button><button class="btn" data-clipboard-action="copy">复制</button></div>'
  }
  $("pre").each(function () {
    $(this).attr('id', "pre" + $(this).index());
    let btns = $(this).find("button");
    $(btns).attr('data-clipboard-target', "#pre" + $(this).index())
  });
  let clipboard = new ClipboardJS('.btn');
  clipboard.on('success', function () {
    $(".btn").each(function () {
      let btntip = $(this).find("button.btn-tip");
      $(btntip).css("display", "block").delay(1000).fadeOut(200)
    });
  });
}

export default clipboard;
