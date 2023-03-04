function addLineAndCopy() {
  // markdown code is stored in pre code tags
  document.querySelectorAll('pre code').forEach(codeBlock => {
    // add copy button
    const copyBtn = document.createElement('div');
    copyBtn.classList.add('code-copy', 'el-icon-document-copy');
    copyBtn.textContent = '复制';

    codeBlock.parentNode.classList.add('code');
    codeBlock.parentNode.appendChild(copyBtn);
  });

  // listen for click events on the copy button
  document.querySelectorAll('pre.code .code-copy').forEach(copyBtn => {
    copyBtn.addEventListener('click', (e) => {
      if (e.target.textContent === '已复制') return;
      const code = e.target.previousElementSibling.textContent;
      const tempEl = document.createElement('textarea');
      tempEl.value = code;
      document.body.appendChild(tempEl);
      tempEl.select();
      document.execCommand('copy');
      document.body.removeChild(tempEl);
      // custom message notification component
      e.target.textContent = '已复制';
      setTimeout(() => {
        e.target.textContent = '复制';
      }, 1000);
    });
  });
}

export default addLineAndCopy;
