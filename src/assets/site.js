/* global anchors */

// add anchor links to headers
anchors.options.placement = 'left';
anchors.add('h3');

var items = document.getElementsByClassName('toggle-sibling');
for (var j = 0; j < items.length; j++) {
  items[j].addEventListener('click', toggleSibling);
}

function toggleSibling() {
  var stepSibling = this.parentNode.getElementsByClassName('toggle-target')[0];
  var sibling = this.parentNode.getElementsByClassName('toggle-sibling')[0];
  var icon = this.getElementsByClassName('icon')[0];
  var klass = 'display-none';
  var red = 'ppn__menu-item-red';
  if (stepSibling.classList.contains(klass)) {
    stepSibling.classList.remove(klass);
    icon.innerHTML = '▾';
    sibling.classList.add(red);
  } else {
    stepSibling.classList.add(klass);
    icon.innerHTML = '▸';
    sibling.classList.remove(red);
  }
}

function showHashTarget(targetId) {
  if (targetId) {
    var hashTarget = document.getElementById(targetId);
    // new target is hidden
    if (
      hashTarget &&
      hashTarget.offsetHeight === 0 &&
      hashTarget.parentNode.parentNode.classList.contains('display-none')
    ) {
      hashTarget.parentNode.parentNode.classList.remove('display-none');
    }
  }
}

function scrollIntoView(targetId) {
  // Only scroll to element if we don't have a stored scroll position.
  if (targetId && !history.state) {
    var hashTarget = document.getElementById(targetId);
    if (hashTarget) {
      hashTarget.scrollIntoView();
    }
  }
}

function gotoCurrentTarget() {
  showHashTarget(location.hash.substring(1));
  scrollIntoView(location.hash.substring(1));
}

window.addEventListener('hashchange', gotoCurrentTarget);
gotoCurrentTarget();

var toclinks = document.getElementsByClassName('pre-open');
for (var k = 0; k < toclinks.length; k++) {
  toclinks[k].addEventListener('mousedown', preOpen, false);
}

function preOpen() {
  showHashTarget(this.hash.substring(1));
}

var split_left = document.querySelector('#split-left');
var split_right = document.querySelector('#split-right');


// Chrome doesn't remember scroll position properly so do it ourselves.
// Also works on Firefox and Edge.

function updateState() {
  history.replaceState(
    {
      left_top: split_left.scrollTop,
      right_top: split_right.scrollTop
    },
    document.title
  );
}

function loadState(ev) {
  if (ev) {
    // Edge doesn't replace change history.state on popstate.
    history.replaceState(ev.state, document.title);
  }
  if (history.state) {
    split_left.scrollTop = history.state.left_top;
    split_right.scrollTop = history.state.right_top;
  }
}

window.addEventListener('load', function() {
  // Restore after Firefox scrolls to hash.
  setTimeout(function() {
    loadState();
    // Update with initial scroll position.
    updateState();
    // Update scroll positions only after we've loaded because Firefox
    // emits an initial scroll event with 0.
    split_left.addEventListener('scroll', updateState);
    split_right.addEventListener('scroll', updateState);
  }, 1);
});

window.addEventListener('popstate', loadState);
