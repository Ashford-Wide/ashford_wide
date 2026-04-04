(function () {
  var filters = document.querySelectorAll('.biz-filter');
  var cards = document.querySelectorAll('.biz-card');
  var empty = document.getElementById('biz-empty');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.dataset.filter;
      filters.forEach(function (b) {
        b.classList.remove('bg-surface', 'text-white', 'border-surface');
        b.classList.add('bg-white', 'text-text');
      });
      this.classList.remove('bg-white', 'text-text');
      this.classList.add('bg-surface', 'text-white', 'border-surface');
      var visible = 0;
      cards.forEach(function (card) {
        var show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      empty.style.display = visible === 0 ? 'block' : 'none';
    });
  });
})();
