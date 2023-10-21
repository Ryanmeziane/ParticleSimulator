const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
const G = 2;
const speedLimit = 3;

class Particle {
  constructor(x, y, mass) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.vx = Math.random() * 3;
    this.vy = Math.random() * 3;
    this.isDead = false;
  }

  Pull(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const force = G * (this.mass * other.mass) / (distance * distance);
    const ax = force * dx / distance;
    const ay = force * dy / distance;

    this.vx += ax / this.mass;
    this.vy += ay / this.mass;

    if (distance < Math.sqrt(this.mass) + Math.sqrt(other.mass)) {
      const newVx = (this.vx * (this.mass - other.mass) + (2 * other.mass * other.vx)) / (this.mass + other.mass);
      const newVy = (this.vy * (this.mass - other.mass) + (2 * other.mass * other.vy)) / (this.mass + other.mass);
      this.vx = newVx;
      this.vy = newVy;

      other.isDead = true;
      this.mass += Math.pow(other.mass, 1.01);
    }
  }

  update() {
    // Apply speed limit
    let oldVx = this.vx;
    let oldVy = this.vy;

    this.vx = Math.min(Math.max(this.vx, -speedLimit), speedLimit);
    this.vy = Math.min(Math.max(this.vy, -speedLimit), speedLimit);
    
    this.x += (this.vx + oldVx) / 2;
    this.y += (this.vy + oldVy) / 2;
    // Boundary checks for x
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1; // Reverse the x-velocity
    } else if (this.x > canvas.width) {
      this.x = canvas.width;
      this.vx *= -1; // Reverse the x-velocity
    }

    // Boundary checks for y
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -1; // Reverse the y-velocity
    } else if (this.y > canvas.height) {
      this.y = canvas.height;
      this.vy *= -1; // Reverse the y-velocity
    }
  }

  render() {
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(this.x, this.y, Math.sqrt(this.mass), 0, Math.PI * 2);
    context.fill();
  }
}

let particles = [];

// Initialize some random particles
for (let i = 0; i < 100; i++) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const mass = 60;//Math.random() * 50 + 1;
  particles.push(new Particle(x, y, mass));
}

function animate() {
  // Clear the canvas
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Update particle positions and handle pulling particles together
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      particles[j].Pull(particles[i]);
    }
    particles[i].update();
    particles[i].render();
  }
  particles = particles.filter(p => !p.isDead);
  requestAnimationFrame(animate);
}

animate();
