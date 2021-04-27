function outline() {
  const pc = isPc();
  if(!pc) return;
  $("#article-content").children().each(function (index) {
    let tagName = $(this).get(0).tagName;
    if (tagName.substr(0, 1).toUpperCase() === "H") {
      $(" #two .inner").addClass('right-nav-inner');
      let substrTagName = tagName.substr(1, 1);
      let dis = HContentPaddingLeft(substrTagName);
      let tagContent = $(this).text();
      if (tagContent !== '') {
        let navId = "nav-" + tagName + "-" + index.toString();
        $(this).attr("id", navId);
        $(".right-nav").append("<li class='right-nav-item toc-" + dis + "' title='" + tagContent + "'><a data-id='" + navId + "'>" + tagContent + "</a></li>").show()
      }
    }
  });
  let BigRightNav = $('.rightNav');
  if(!$('.right-nav-item')) return;
  let header_wrap = $("#header").outerHeight() + 50;
  let rightNav = $(".right-nav");
  let articleContentHeight = $('#article-content').height();
  let top = articleContentHeight + 250;
  $(window).on('scroll', function () {
    let cur_pos = $(this).scrollTop();
    if(cur_pos>=48) {BigRightNav.css('position','fixed')} else {BigRightNav.css('position','absolute')}
    if(cur_pos>=articleContentHeight) {BigRightNav.css('position','absolute');BigRightNav.css('top',top)} else {BigRightNav.css('position','fixed');BigRightNav.css('top','')}
    $(":header").each(function () {
      let top = $(this).offset().top - header_wrap, bottom = top + $(this).outerHeight();
      if (cur_pos >= top && cur_pos <= bottom) {
        rightNav.find('li').removeClass('current');
        rightNav.find('a[data-id="' + $(this).attr('id') + '"]').parent("li").addClass('current')
      }
    })
  });
  $(".right-nav-item").on('click', function () {
    $(".right-nav-item").siblings('li').removeClass('current');
    $(this).addClass('current');
    let id = $(this).children('a').data('id');
    id = $("#" + id);
    $("html, body").stop().animate({scrollTop: id.offset().top - 80}, 1)
  })
}


function HContentPaddingLeft(tagName) {
  switch (tagName) {
    case"2":
      tagName = "h2";
      break;
    case"3":
      tagName = "h3";
      break;
    case"4":
      tagName = "h4";
      break;
    case"5":
      tagName = "h5";
      break;
    case"6":
      tagName = "h6";
      break;
    default:
      tagName = "h1"
  }
  return tagName
}
function isPc() {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    return false
  }
  return true
}
export default outline;
