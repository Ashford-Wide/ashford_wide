(function () {
  var facade = document.getElementById('vimeo-facade');
  if (!facade) return;
  function load() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://player.vimeo.com/video/' + facade.dataset.videoId +
      '?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1';
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
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
