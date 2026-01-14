import { reviews, subjects } from './reviews_data.js';

document.addEventListener('DOMContentLoaded', () => {
    initLucide();
    initCountdown();
    initCounterUp();
    init3DTilt();
    renderInitialContent();
    setupScrollReveal();
});

function initLucide() {
    lucide.createIcons();
}

function initCountdown() {

    const targetDate = new Date('February 17, 2026 00:00:00').getTime();
    
    const update = () => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff < 0) return;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(d).padStart(2, '0');
        document.getElementById('hours').innerText = String(h).padStart(2, '0');
        document.getElementById('mins').innerText = String(m).padStart(2, '0');
        document.getElementById('secs').innerText = String(s).padStart(2, '0');
    };

    update();
    setInterval(update, 1000);
}

function initCounterUp() {
    const counter = document.getElementById('student-counter');
    const target = 700;
    const duration = 2000;
    let started = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            let start = 0;
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const current = Math.min(Math.floor((progress / duration) * target), target);
                counter.innerText = current;
                if (progress < duration) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        }
    });

    observer.observe(counter);
}

function init3DTilt() {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

function renderInitialContent() {

    const reviewsGrid = document.getElementById('reviews-grid');
    reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'glass-card p-8 card-3d flex flex-col h-full';
        card.innerHTML = `
            <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center font-bold text-lg shadow-lg">
                    ${review.initial}
                </div>
                <div>
                    <h4 class="font-bold">${review.name}</h4>
                    <p class="text-xs text-slate-400 uppercase tracking-widest">${review.stream}</p>
                </div>
            </div>
            <p class="text-slate-200 italic leading-relaxed flex-grow">"${review.text}"</p>
            <div class="mt-4 flex gap-1 text-yellow-500">
                ${'<i data-lucide="star" class="w-4 h-4 fill-current"></i>'.repeat(5)}
            </div>
        `;
        reviewsGrid.appendChild(card);
    });


    const grade10Grid = document.getElementById('grade-10-grid');
    subjects["10"].forEach(sub => {
        grade10Grid.appendChild(createSubjectCard(sub.name, sub.icon));
    });

    initLucide();
}

function createSubjectCard(name, icon) {
    const div = document.createElement('div');
    div.className = 'glass-card p-6 text-center card-3d border-white/5 hover:border-indigo-500/50 transition-all group';
    div.innerHTML = `
        <i data-lucide="${icon}" class="w-10 h-10 mx-auto mb-4 text-indigo-400 group-hover:scale-125 transition-transform"></i>
        <h5 class="font-bold mb-1">${name}</h5>
        <p class="text-xs text-slate-500 mb-4">Complete Set</p>
        <div class="text-xl font-black mb-4 gradient-text-indigo">₹99</div>
        <button class="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors ripple">Get This</button>
    `;
    return div;
}

window.toggleGrade = (grade) => {
    const g10 = document.getElementById('grade-10-content');
    const g12 = document.getElementById('grade-12-content');
    
    if (grade === '10') {
        g10.classList.add('show-section');
        g10.classList.remove('hidden-section');
        g12.classList.add('hidden-section');
        g12.classList.remove('show-section');
    } else {
        g12.classList.add('show-section');
        g12.classList.remove('hidden-section');
        g10.classList.add('hidden-section');
        g10.classList.remove('show-section');
    }
};

window.selectStream = (stream) => {

    document.querySelectorAll('.stream-card').forEach(card => card.classList.remove('selected'));
    

    const activeBtn = document.querySelector(`[data-stream="${stream}"]`);
    if(activeBtn) activeBtn.classList.add('selected');


    const sections = ['pcm', 'pcb', 'commerce', 'arts'];
    sections.forEach(s => {
        const el = document.getElementById(`${s}-subjects`);
        el.classList.add('hidden-section');
        el.classList.remove('show-section');
        el.innerHTML = ''; // Clear for fresh render
    });


    const container = document.getElementById('stream-subjects');
    container.classList.remove('hidden-section');
    container.classList.add('show-section');


    const target = document.getElementById(`${stream}-subjects`);
    target.classList.remove('hidden-section');
    target.classList.add('show-section');


    subjects["12"][stream].forEach(sub => {
        target.appendChild(createSubjectCard(sub.name, sub.icon));
    });

    initLucide();
    init3DTilt(); // Re-initialize for new cards
};

function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card, h2').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(el);
    });
}
