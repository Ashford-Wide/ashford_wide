(function () {
  var facade = document.getElementById('youtube-facade');
  if (!facade) return;
  function load() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + facade.dataset.videoId + '?autoplay=1';
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    iframe.title = facade.getAttribute('aria-label') || 'Video';
    facade.parentNode.replaceChild(iframe, facade);
  }
  facade.addEventListener('click', load);
  facade.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); }
  });
})();
