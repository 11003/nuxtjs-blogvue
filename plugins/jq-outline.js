function outline() {
  const pc = isPc();
  if(!pc) return;
  const articleContent = document.querySelector("#article-content");
  const children = articleContent.children;
  for (let i = 0; i < children.length; i++) {
    const tagName = children[i].tagName;
    if (tagName.substr(0, 1).toUpperCase() === "H") {
      document.querySelector("#two .inner").classList.add('right-nav-inner');
      const substrTagName = tagName.substr(1, 1);
      const dis = HContentPaddingLeft(substrTagName);
      const tagContent = children[i].textContent.trim();
      if (tagContent !== '') {
        const navId = `nav-${tagName}-${i.toString()}`
        children[i].setAttribute("id", navId);
        const newItem = document.createElement('li');
        newItem.classList.add('right-nav-item', `toc-${dis}`);
        newItem.title = tagContent;
        newItem.innerHTML = `<a href="javascript:;" data-id="${navId}">${tagContent}</a>`;
        const existingItem = document.querySelector(`.right-nav-item [data-id="${navId}"]`);
        if (!existingItem) {
          document.querySelector(".right-nav").appendChild(newItem);
          document.querySelector(".right-nav").style.display = "block";
        }
      }
    }
  }
  if (!document.querySelector('.right-nav-item')) return;
  const header_wrap = document.querySelector("#header").offsetHeight + 50;
  const rightNav = document.querySelector(".right-nav");
  window.addEventListener('scroll', function () {
    const cur_pos = window.scrollY;
    const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headers.forEach(function (header) {
      const top = header.offsetTop - header_wrap;
      const bottom = top + header.offsetHeight;
      if (cur_pos >= top && cur_pos <= bottom) {
        rightNav.querySelectorAll('li').forEach(function (li) {
          li.classList.remove('current');
        });
        const headerId = header.getAttribute('id');
        if (!headerId) return;
        const currentNavItem = rightNav.querySelector(`a[data-id="${headerId}"]`);
        if (!currentNavItem) return;
        const currentNavItemClass = currentNavItem.parentNode;
        currentNavItemClass.classList.add('current');
      }
    });
  });
  document.querySelectorAll(".right-nav-item").forEach(function (item) {
    item.addEventListener('click', function () {
      document.querySelectorAll(".right-nav-item").forEach(function (li) {
        li.classList.remove('current');
      });
      this.classList.add('current');
      const id = this.querySelector('a').dataset.id;
      const target = document.querySelector(`#${id}`);
      const targetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
}

function HContentPaddingLeft(tagName) {
  let tagNameNum = +tagName;
  if(tagNameNum <= 6) {
    return `h${tagName}`
  } else {
    return 'h1'
  }
}
function isPc() {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    return false
  }
  return true
}
export default outline;
