function setViewportUnits() {
  let svh = window.innerHeight * 0.01;
  let svw = document.documentElement.clientWidth * 0.01;
  w = window.innerWidth * 0.01;
  ratio = svw / w;
  console.log(svh, svw, w, ratio);
  document.documentElement.style.setProperty('--svh', `${svh}px`);
  document.documentElement.style.setProperty('--svw', `${svw}px`);
}
setViewportUnits();
window.addEventListener('resize', setViewportUnits);

document.addEventListener("DOMContentLoaded", function() {
  var prevScrollpos = window.scrollY;
  window.onscroll = function() {
    var currentScrollPos = window.scrollY;
    var navbar = document.getElementById("navbar-container");
    if (navbar) { // Check if the element exists
      if (prevScrollpos > currentScrollPos) {
        navbar.style.top = "0";
      } else {
        navbar.style.top = "-100px";
      }
      navbar.style.transition = "top 1s"; // Add 2s transition
    }
    prevScrollpos = currentScrollPos;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger-icon');
  const menuDrawer = document.querySelector('.menu-drawer');
  const body = document.body;

  if (hamburger && menuDrawer) {
    hamburger.addEventListener('click', () => {
      menuDrawer.classList.toggle('open');
      hamburger.classList.toggle('active');
      body.classList.toggle('menu-open');
      console.log('Menu clicked'); // Debugging line
    });
  } else {
    console.error('Hamburger or menu drawer not found'); // Debugging line
  }
});

/*
document.addEventListener('DOMContentLoaded', function() {
  let scrolling;
  document.addEventListener('scroll', function() {
      clearTimeout(scrolling);
      document.body.classList.remove('hide-scrollbar');
      scrolling = setTimeout(function() {
          document.body.classList.add('hide-scrollbar');
      }, 1000);
  }, false);
});
*/
// Pointer Code Below
document.addEventListener('DOMContentLoaded', function() {
const canvas = document.querySelector("canvas");
canvas.style.pointerEvents = 'none';
const ctx = canvas.getContext('2d');

// for intro motion
let mouseMoved = false;

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 40,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}

window.addEventListener("click", e => {
  updateMousePosition(e.clientX, e.clientY);
});
window.addEventListener("mousemove", e => {
  mouseMoved = true;
  updateMousePosition(e.clientX, e.clientY);
});
window.addEventListener("touchmove", e => {
  mouseMoved = true;
  updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
});

function updateMousePosition(eX, eY) {
  pointer.x = eX - canvas.getBoundingClientRect().left;
  pointer.y = eY - canvas.getBoundingClientRect().top;
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);


function update(t) {

    // for intro motion
    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    ctx.lineCap = "round";
	  ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();
    
    window.requestAnimationFrame(update);
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
})


