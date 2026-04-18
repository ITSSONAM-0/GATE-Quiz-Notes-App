
const container = document.getElementById('quizContainer');
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const nextBtn = document.querySelector('.nextBtn');
const prevBtn = document.querySelector('.prevBtn');
const scoreCard = document.getElementById('scoreCard');
const timer = document.querySelector('.timer');
const subjectButtons = document.querySelectorAll('.subjectBtn');
const notesBox = document.getElementById('notesBox');
const pdfFrame = document.getElementById('pdfFrame');
const downloadPDF = document.getElementById('downloadPDF');
const leaderboardList = document.getElementById('leaderboardList');
const toggleNotesBtn = document.getElementById('toggleNotes');
const progress = document.getElementById('progress');
const appTitle = document.getElementById('appTitle');
const welcomeBtn = document.getElementById('welcomeBtn');
const themeToggle = document.getElementById('themeToggle');


let quiz = [], currentQuestionIndex = 0, userAnswers = [], score = 0, timerID = null, timeLeft = 15, currentSubject = "";
let pomodoroID = null, pomodoroRunning = false;
let scoreChart = null;

const syllabusData = [
    "Engg. Mathematics", "Digital Logic", "Comp. Organization", "Data Structures", 
    "Algorithms", "Theory of Comp.", "Compiler Design", "Operating Systems", 
    "Databases", "Comp. Networks", "Software Engg."
];

const achievementsData = [
    { id: 'first_quiz', icon: 'fa-rocket', title: 'First Flight', desc: 'Complete your first quiz', criteria: (h) => h.length >= 1 },
    { id: 'streak_3', icon: 'fa-fire', title: 'Three Day Fire', desc: 'Maintain a 3-day streak', criteria: () => (parseInt(localStorage.getItem('userStreak')) || 0) >= 3 },
    { id: 'perfect_100', icon: 'fa-star', title: 'Perfectionist', desc: 'Get 100% in any quiz', criteria: (h) => h.some(i => i.score >= 4) }, // Assuming 4 questions per quiz in my new data
    { id: 'xp_500', icon: 'fa-crown', title: 'XP King', desc: 'Reach 500 total XP', criteria: (h) => h.reduce((acc, curr) => acc + curr.score, 0) * 10 >= 500 },
    { id: 'syllabus_half', icon: 'fa-book-open', title: 'Halfway There', desc: 'Complete 50% of syllabus', criteria: () => (JSON.parse(localStorage.getItem('syllabusCompleted')) || []).length >= (syllabusData.length / 2) }
];

const gateFormulas = [
    "Pipelining: Speedup (S) = 1 / [(1-f) + f/k]",
    "Amdahl's Law: S = 1 / (S_lat) = 1 / [(1-p) + p/s]",
    "Discrete Math: Number of relations = 2^(n^2)",
    "OS: Effective Access Time = p * (Page Fault Service Time) + (1-p) * (Memory Access Time)",
    "DBMS: Number of tables in M:N relationship with attributes = 3"
];

const flashcardsBtn = document.getElementById('flashcardsBtn');
const pomodoroBtn = document.getElementById('pomodoroBtn');
const calcToggle = document.getElementById('calcToggle');
const calcOverlay = document.getElementById('calcOverlay');
const closeCalc = document.getElementById('closeCalc');
const flashcardSection = document.getElementById('flashcardSection');
const flashcard = document.getElementById('flashcard');
const closeFlashcards = document.querySelector('.close-flashcards');
const nextCardBtn = document.getElementById('nextCard');
const prevCardBtn = document.getElementById('prevCard');
const cardFront = document.getElementById('cardFrontText');
const cardBack = document.getElementById('cardBackText');



const quizData = {
  EM: [
    { question: "What is the rank of a 3x3 matrix where all elements are 1?", choices: ["1", "2", "3", "0"], answer: "1", explanation: "All rows are identical, so there's only one linearly independent row. Thus, rank is 1." },
    { question: "Value of lim (x->0) (sin x / x)?", choices: ["0", "1", "Infinity", "Undefined"], answer: "1", explanation: "This is a standard limit result in calculus, often proved using L'Hopital's rule or Squeeze theorem." },
    { question: "If P(A) = 0.4 and P(B) = 0.5, and A & B are independent, what is P(A ∩ B)?", choices: ["0.9", "0.1", "0.2", "0.45"], answer: "0.2", explanation: "For independent events, P(A ∩ B) = P(A) * P(B) = 0.4 * 0.5 = 0.2." },
    { question: "Eigenvalues of a symmetric matrix are always?", choices: ["Imaginary", "Real", "Zero", "Positive"], answer: "Real", explanation: "A fundamental property of real symmetric matrices is that all their eigenvalues are real numbers." }
  ],
  DL: [
    { question: "How many selection lines are in a 16-to-1 multiplexer?", choices: ["2", "4", "8", "16"], answer: "4", explanation: "A 2^n to 1 MUX has n selection lines. Since 16 = 2^4, n = 4." },
    { question: "What is the 2's complement of 1010?", choices: ["0101", "0110", "1011", "0001"], answer: "0110", explanation: "1's complement of 1010 is 0101. Adding 1 gives 0110." },
    { question: "Which logic gate is known as the Universal Gate?", choices: ["AND", "OR", "NAND", "XOR"], answer: "NAND", explanation: "NAND and NOR gates are universal because any boolean function can be implemented using only these gates." },
    { question: "Standard SOP form stands for?", choices: ["Sum of Products", "Smallest of Products", "System of Products", "Set of Products"], answer: "Sum of Products", explanation: "SOP is a common way to represent boolean expressions by summing mini-terms." }
  ],
  COA: [
    { question: "Which addressing mode uses the value inside the instruction as the operand?", choices: ["Direct", "Indirect", "Immediate", "Register"], answer: "Immediate", explanation: "In immediate addressing, the operand is part of the instruction itself (e.g., ADDI R1, #10)." }
  ],
  DS: [
    { question: "Which data structure is used for BFS in a graph?", choices: ["Stack", "Queue", "Priority Queue", "Tree"], answer: "Queue", explanation: "Breadth-First Search (BFS) uses a Queue to keep track of nodes to visit in a level-order fashion." }
  ],
  ALGO: [
    { question: "Worst-case time complexity of Quick Sort?", choices: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"], answer: "O(n^2)", explanation: "Quick Sort hits O(n^2) when the pivot is consistently the smallest or largest element, e.g., in an already sorted array." }
  ],
  TOC: [
    { question: "Which of the following is NOT a regular language?", choices: ["{a^n b^n | n >= 0}", "{a^n | n is even}", "{w | w contains 'ab'}", "All are regular"], answer: "{a^n b^n | n >= 0}", explanation: "a^n b^n requires infinite memory (a stack) to match the number of a's with b's, so it is Context-Free but not Regular." }
  ],
  CD: [
    { question: "A compiler that runs on one machine and generates code for another is called?", choices: ["Cross Compiler", "One-pass Compiler", "Incremental Compiler", "Multi-pass Compiler"], answer: "Cross Compiler", explanation: "Cross compilers are used to build software for platforms other than the one where the compiler is running (e.g., building ARM code on x86)." }
  ],
  OS: [
    { question: "Which of the following is NOT a condition for Deadlock?", choices: ["Mutual Exclusion", "No Preemption", "Hold and Wait", "Circular Wait", "Preemption"], answer: "Preemption", explanation: "The four conditions for deadlock are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If Preemption is allowed, deadlock can be avoided." }
  ],
  DBMS: [
    { question: "Which normal form deals with Transitive Dependency?", choices: ["1NF", "2NF", "3NF", "BCNF"], answer: "3NF", explanation: "A relation is in 3NF if it is in 2NF and there is no transitive dependency of non-prime attributes on the primary key." }
  ],
  CN: [
    { question: "Which layer of OSI model is responsible for routing?", choices: ["Data Link", "Network", "Transport", "Physical"], answer: "Network", explanation: "The Network layer (Layer 3) handles routing, logical addressing (IP), and packet forwarding." }
  ],
  SE: [
    { question: "The spiral model of software development is?", choices: ["Risk-driven", "Linear", "Iterative", "Waterfall"], answer: "Risk-driven", explanation: "The Spiral model is a risk-driven process model generator for software projects." }
  ]
};

// Navigation Logic
const navLinks = document.querySelectorAll('.nav-link');
const headerOffset = 85; 

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        // Ensure dashboard is visible
        resetToDashboard();

        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

function resetToDashboard() {
    // Hide Quiz if active
    if (container) container.style.display = 'none';
    if (scoreCard) scoreCard.style.display = 'none';
    
    // Show sections
    const landing = document.querySelector('.landing');
    const stats = document.querySelector('.stats-sections');
    const notes = document.getElementById('notesRepo');
    const tracker = document.getElementById('syllabusTracker');
    const achievements = document.getElementById('achievementsBox');

    if (landing) landing.style.display = 'block';
    if (stats) stats.style.display = 'grid';
    if (notes) notes.style.display = 'block';
    if (tracker) tracker.style.display = 'block';
    if (achievements) achievements.style.display = 'block';
    
    // Reset App Title
    if (appTitle) appTitle.textContent = 'GATE Master';
}


// Search Logic
const subjectSearch = document.getElementById('subjectSearch');
if (subjectSearch) {
    subjectSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        subjectButtons.forEach(btn => {
            const subject = btn.dataset.subject.toLowerCase();
            btn.style.display = subject.includes(term) ? 'flex' : 'none';
        });
    });
}

// Update active link on scroll
window.addEventListener('scroll', () => {
    let current = 'landing';
    const sections = [
        { id: 'subjectSearch', name: 'quizzes' },
        { id: 'notesRepo', name: 'notes' },
        { id: 'statsBox', name: 'stats' },
        { id: 'syllabusTracker', name: 'tracker' },
        { id: 'achievementsBox', name: 'badges' }
    ];

    sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150) current = s.name;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });
});


const subjectIcons = {
  EM: "fa-calculator",
  DL: "fa-microchip",
  COA: "fa-server",
  DS: "fa-tree",
  ALGO: "fa-code",
  TOC: "fa-brain",
  CD: "fa-terminal",
  OS: "fa-window-maximize",
  DBMS: "fa-database",
  CN: "fa-network-wired",
  SE: "fa-gears"
};

subjectButtons.forEach(btn => {
  const subject = btn.dataset.subject;
  const iconClass = subjectIcons[subject] || "fa-book";
  btn.innerHTML = `<i class="fas ${iconClass}"></i><span>${subject}</span>`;
});


function displayAlert(msg, timeout = 3000) {
  const a = document.createElement('div');
  a.style.cssText = `
    position: fixed; top: 100px; right: 20px; 
    background: var(--bg-card); backdrop-filter: blur(10px);
    border: 1px solid var(--accent-secondary); color: var(--text-main);
    padding: 1rem 2rem; border-radius: 12px; z-index: 9999;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1); animation: slideIn 0.3s ease-out;
  `;
  a.textContent = msg;
  document.body.appendChild(a);
  setTimeout(() => {
    a.style.opacity = '0';
    a.style.transform = 'translateX(20px)';
    setTimeout(() => a.remove(), 300);
  }, timeout);
}


let dark = localStorage.getItem('theme') !== 'light';
if (!dark) document.body.classList.add('light-theme');

function toggleTheme() {
  dark = !dark;
  document.body.classList.toggle('light-theme', !dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  themeToggle.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}
themeToggle.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
themeToggle.addEventListener('click', toggleTheme);



const userNameDisplay = document.getElementById('userNameDisplay');
const userLevelDisplay = document.getElementById('userLevel');

function updateLeveling() {
  const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
  const totalCorrect = history.reduce((acc, curr) => acc + curr.score, 0);
  const xp = totalCorrect * 10;
  const level = Math.floor(xp / 100) + 1;
  const storedName = localStorage.getItem('userName') || 'Sonam';

  // Streak Logic
  const lastDate = localStorage.getItem('lastActiveDate');
  const today = new Date().toLocaleDateString();
  let streak = parseInt(localStorage.getItem('userStreak')) || 0;

  if (lastDate) {
    const last = new Date(lastDate);
    const curr = new Date(today);
    const diff = Math.floor((curr - last) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      streak++;
      localStorage.setItem('userStreak', streak);
    } else if (diff > 1) {
      streak = 1;
      localStorage.setItem('userStreak', streak);
    }
  } else {
    streak = 1;
    localStorage.setItem('userStreak', streak);
  }
  localStorage.setItem('lastActiveDate', today);

  userNameDisplay.textContent = storedName;
  userLevelDisplay.innerHTML = `
    <span class="level-tag">Level ${level}</span>
    <span class="xp-tag">${xp} XP</span>
    <span class="streak-tag">🔥 ${streak} Day Streak</span>
  `;
}
updateLeveling();

welcomeBtn.addEventListener('click', () => showNameEditor());
function showNameEditor() {
  Swal.fire({
    title: 'Edit Profile',
    html: `
            <div style="text-align:left;">
                <label>Your Name</label>
                <input id="swal-name" class="swal2-input" value="${localStorage.getItem('userName') || 'Sonam'}">
            </div>
        `,
    focusConfirm: false,
    showCancelButton: true,
    background: '#0f172a',
    color: '#fff',
    preConfirm: () => {
      return document.getElementById('swal-name').value;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const name = result.value;
      if (name.trim()) {
        localStorage.setItem('userName', name);
        updateLeveling();
        displayAlert('Name updated!');
      }
    }
  });
}


function showWelcome() {
  const storedName = localStorage.getItem('userName') || 'Sonam';
  Swal.fire({
    title: `Welcome back, ${storedName}!`,
    text: 'Prepare with excellence. Your level depends on your correct answers.',
    icon: 'info',
    background: '#0f172a',
    color: '#fff',
    confirmButtonColor: '#6366f1',
    confirmButtonText: 'Let\'s go!'
  });
}



toggleNotesBtn.addEventListener('click', () => {
  const isHidden = notesBox.style.display === 'none';
  notesBox.style.display = isHidden ? 'block' : 'none';
  toggleNotesBtn.textContent = isHidden ? 'Hide Notes' : 'Show Notes';
});

function loadNotes(subject) {
  const pdfPath = `notes/${subject}.pdf`;
  pdfFrame.src = pdfPath;
  downloadPDF.href = pdfPath;
}


subjectButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    startQuiz(btn.dataset.subject, btn.dataset.subject);
  });
});

function startQuiz(subject, title) {
  currentSubject = subject;
  if (subject === 'MOCK') {
    quiz = Object.values(quizData).flat().sort(() => Math.random() - 0.5).slice(0, 10);
    title = "Full Mock Test";
  } else {
    quiz = quizData[subject] || [];
    loadNotes(subject);
    notesBox.style.display = 'block';
    toggleNotesBtn.textContent = 'Hide Notes';
  }

  if (!quiz.length) return Swal.fire({
    title: 'Coming Soon',
    text: 'Quiz for this subject is being added.',
    icon: 'info',
    background: '#0f172a',
    color: '#fff'
  });

  document.querySelector('.landing').style.display = 'none';
  document.querySelector('.stats-sections').style.display = 'none';
  userAnswers = [];
  currentQuestionIndex = 0;
  container.style.display = 'block';
  container.setAttribute('aria-hidden', 'false');
  document.getElementById('subjectTitle').textContent = title;
  showQuestion();
  appTitle.textContent = `${title} — GATE Master`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  playSound('click');
}

mockTestBtn.addEventListener('click', () => startQuiz('MOCK', 'Full Mock Test'));


function showQuestion() {
  const q = quiz[currentQuestionIndex];
  questionBox.textContent = q.question;
  choicesBox.innerHTML = '';
  const explanationBox = document.getElementById('explanationBox');
  explanationBox.style.display = 'none';

  q.choices.forEach(choice => {
    const div = document.createElement('div'); div.className = 'choice'; div.textContent = choice; div.setAttribute('role', 'button');
    if (userAnswers[currentQuestionIndex] === choice) { div.classList.add('selected'); div.classList.add(choice === q.answer ? 'correct' : 'wrong'); }
    div.addEventListener('click', () => {
      if (userAnswers[currentQuestionIndex]) return; // prevent multiple clicks
      const isCorrect = div.textContent === q.answer;
      document.querySelectorAll('.choice').forEach(c => c.classList.remove('selected', 'correct', 'wrong'));
      div.classList.add('selected'); div.classList.add(isCorrect ? 'correct' : 'wrong');
      userAnswers[currentQuestionIndex] = div.textContent;
      stopTimer();

      // Show Explanation
      explanationBox.innerHTML = `<strong>Explanation:</strong> ${q.explanation || 'No explanation available.'}`;
      explanationBox.style.display = 'block';

      setTimeout(() => {
        if (currentQuestionIndex < quiz.length - 1) { currentQuestionIndex++; showQuestion(); }
        else showScore();
      }, 2500); // Give user time to read explanation
      playSound(isCorrect ? 'correct' : 'wrong');
    });
    choicesBox.appendChild(div);
  });
  timeLeft = 15;
  startTimer();
  progress.style.width = ((currentQuestionIndex + 1) / quiz.length) * 100 + '%';
}

function startTimer() {
  clearInterval(timerID);
  timer.textContent = timeLeft; timer.classList.remove('warning');
  timerID = setInterval(() => {
    timeLeft--; timer.textContent = timeLeft;
    if (timeLeft <= 5) timer.classList.add('warning');
    if (timeLeft === 0) {
      const q = quiz[currentQuestionIndex];
      displayAlert(`Time's up! Correct: ${q.answer}`);
      document.querySelectorAll('.choice').forEach(c => { if (c.textContent === q.answer) c.classList.add('correct'); });

      const explanationBox = document.getElementById('explanationBox');
      explanationBox.innerHTML = `<strong>Time's Up! Explanation:</strong> ${q.explanation || 'No explanation available.'}`;
      explanationBox.style.display = 'block';

      stopTimer();
      setTimeout(() => { if (currentQuestionIndex < quiz.length - 1) { currentQuestionIndex++; showQuestion(); } else showScore(); }, 3000);
    }
  }, 1000);
}
function stopTimer() { clearInterval(timerID); }

nextBtn.addEventListener('click', () => {
  if (!userAnswers[currentQuestionIndex]) return displayAlert('Please select an answer!');
  if (currentQuestionIndex < quiz.length - 1) { currentQuestionIndex++; showQuestion(); }
  else showScore();
});
prevBtn.addEventListener('click', () => { if (currentQuestionIndex > 0) { currentQuestionIndex--; showQuestion(); } });

function showScore() {
  container.style.display = 'none'; container.setAttribute('aria-hidden', 'true');
  score = userAnswers.filter((ans, i) => ans === quiz[i].answer).length;

  const percentage = (score / quiz.length) * 100;
  let feedback = "Keep Practicing!";
  if (percentage === 100) {
    feedback = "Perfect! GATE Master 🏆";
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#6366f1', '#06b6d4', '#f59e0b'] });
    playSound('correct');
  } else if (percentage >= 70) {
    feedback = "Excellent Work! 🚀";
    confetti({ particleCount: 150, spread: 60, origin: { y: 0.6 } });
    playSound('correct');
  }

  scoreCard.innerHTML = `
    <div class="score-summary">
        <h2>${feedback}</h2>
        <p>You secured <strong>${score} / ${quiz.length}</strong> marks</p>
        <button id="restartBtn">Back to Dashboard</button>
    </div>
  `;
  scoreCard.style.display = 'block';
  document.getElementById('restartBtn').addEventListener('click', () => location.reload());
  saveHistory();
}


function saveHistory() {
  let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
  history.push({ subject: currentSubject, score: score, date: new Date().toLocaleString() });
  localStorage.setItem('quizHistory', JSON.stringify(history));
  updateLeaderboard();
  updateLeveling();
  renderAchievements();
}

function updateLeaderboard() {
  let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
  history.sort((a, b) => new Date(b.date) - new Date(a.date));
  leaderboardList.innerHTML = '';
  history.slice(0, 5).forEach((item, index) => {
    const li = document.createElement('li');
    const subjectIcon = subjectIcons[item.subject] || "fa-book";
    li.innerHTML = `
        <i class="fas ${subjectIcon}" style="color: var(--accent-secondary)"></i>
        <span>${item.subject}</span> 
        <strong>${item.score}</strong> 
        <small>${item.date.split(',')[0]}</small>
    `;
    leaderboardList.appendChild(li);
  });
  updateChart(history);
}

let soundEnabled = localStorage.getItem('sound') !== 'false';
const soundToggle = document.getElementById('soundToggle');

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('sound', soundEnabled);
  soundToggle.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
}
soundToggle.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
soundToggle.addEventListener('click', toggleSound);

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);

    if (type === 'correct') {
      o.type = 'sine';
      o.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      o.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.1); // A5
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      o.start(); o.stop(ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(220.00, ctx.currentTime); // A3
      o.frequency.linearRampToValueAtTime(110.00, ctx.currentTime + 0.2); // A2
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      o.start(); o.stop(ctx.currentTime + 0.3);
    } else {
      o.type = 'sine';
      o.frequency.setValueAtTime(440, ctx.currentTime);
      g.gain.setValueAtTime(0.02, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      o.start(); o.stop(ctx.currentTime + 0.1);
    }
  } catch (e) { }
}

function updateChart(history) {
  const canvas = document.getElementById('scoreChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const last10 = history.slice(-10);
  const labels = last10.map(h => h.subject);
  const data = last10.map(h => h.score);

  if (scoreChart) scoreChart.destroy();
  scoreChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Score',
        data: data,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#6366f1',
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 8
        }
      }
    }
  });
}
updateLeaderboard();

const aiQuizBtn = document.getElementById('aiQuizBtn');

const aiTopicsPool = {
  "AI": [
    { question: "What is Turing Test?", choices: ["Test for AI Intelligence", "Test for Hardware", "Test for Speed", "Test for Memory"], answer: "Test for AI Intelligence", explanation: "The Turing test, originally called the imitation game by Alan Turing in 1950, is a test of a machine's ability to exhibit intelligent behaviour equivalent to, or indistinguishable from, that of a human." },
    { question: "What is Supervised Learning?", choices: ["Learning with Labels", "Learning without Labels", "Random Learning", "No Learning"], answer: "Learning with Labels", explanation: "Supervised learning is an approach to creating artificial intelligence (AI), where a computer algorithm is trained on input data that has been labeled for a particular output." }
  ],
  "PYTHON": [
    { question: "Is Python compiled or interpreted?", choices: ["Compiled", "Interpreted", "Both", "None"], answer: "Interpreted", explanation: "Python is an interpreted, high-level, general-purpose programming language." },
    { question: "Which keyword is used for functions?", choices: ["func", "def", "function", "define"], answer: "def", explanation: "In Python, you define a function with the 'def' keyword." }
  ],
  "CLOUD": [
    { question: "Which of these is a Cloud Service Provider?", choices: ["AWS", "Windows 95", "Notepad", "VLC"], answer: "AWS", explanation: "Amazon Web Services (AWS) is a subsidiary of Amazon that provides on-demand cloud computing platforms." }
  ],
  "GENERAL": [
    { question: "Who is the father of AI?", choices: ["John McCarthy", "Alan Turing", "Elon Musk", "Steve Jobs"], answer: "John McCarthy", explanation: "John McCarthy was an American computer scientist and cognitive scientist. He was one of the founders of the discipline of artificial intelligence." }
  ]
};

function getRecommendation() {
  const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
  if (history.length === 0) return "Start with Engineering Mathematics (EM)!";
  
  const subjects = Object.keys(quizData);
  const attempted = history.map(h => h.subject);
  const pending = subjects.filter(s => !attempted.includes(s));
  
  if (pending.length > 0) return `Try a new subject: ${pending[0]}!`;
  
  // Find subject with lowest average score
  const scores = {};
  history.forEach(h => {
    if (!scores[h.subject]) scores[h.subject] = [];
    scores[h.subject].push(h.score);
  });
  
  let lowSub = "", minAvg = 100;
  for (let s in scores) {
    const avg = scores[s].reduce((a, b) => a + b, 0) / scores[s].length;
    if (avg < minAvg) { minAvg = avg; lowSub = s; }
  }
  
  return `Focus on ${lowSub} to improve your score!`;
}

aiQuizBtn.addEventListener('click', () => {
  Swal.fire({
    title: 'AI Quiz Generator',
    text: 'Enter a topic (AI, Python, or anything) to generate a custom quiz.',
    input: 'text',
    inputPlaceholder: 'e.g. Artificial Intelligence',
    showCancelButton: true,
    background: '#0f172a',
    color: '#fff',
    confirmButtonText: '⚡ Generate'
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      showAIGenerating(result.value);
    }
  });
});

async function showAIGenerating(topic) {
  const key = localStorage.getItem('gemini_key');

  Swal.fire({
    title: key ? 'Gemini is generating...' : 'AI is thinking...',
    html: `Generating fresh questions for <b>${topic}</b>...`,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
      playSound('click');
    },
    background: '#0f172a',
    color: '#fff'
  });

  if (key) {
    try {
      const prompt = `Generate a JSON array of 5 multiple choice questions about "${topic}". 
            Each object must have: "question" (string), "choices" (array of 4 strings), "answer" (string matching one choice), and "explanation" (brief string).
            Return only the JSON array, no markdown markers.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      let text = data.candidates[0].content.parts[0].text.trim();

      // Basic cleanup if Gemini includes markdown code blocks
      text = text.replace(/```json|```/g, '');

      const generated = JSON.parse(text);
      quiz = generated;
      Swal.close();
      startAIQuiz(`Gemini AI: ${topic}`);
    } catch (error) {
      console.error(error);
      Swal.fire('API Error', 'Could not connect to Gemini. Falling back to Mock AI.', 'error');
      setTimeout(() => runMockAI(topic), 2000);
    }
  } else {
    setTimeout(() => runMockAI(topic), 3000);
  }
}

function runMockAI(topic) {
  const normalized = topic.toUpperCase();
  let generatedSet = aiTopicsPool[normalized] || aiTopicsPool["GENERAL"];

  if (!aiTopicsPool[normalized]) {
    generatedSet = [
      {
        question: `What is the primary goal of ${topic}?`,
        choices: ["Efficiency", "Automation", "Security", "Scale"],
        answer: "Efficiency",
        explanation: `In the context of ${topic}, efficiency is often the core objective for optimization.`
      },
      {
        question: `Which layer is most critical for ${topic}?`,
        choices: ["Data Layer", "Logic Layer", "UI Layer", "Network Layer"],
        answer: "Logic Layer",
        explanation: `${topic} heavily relies on complex logical structures.`
      }
    ];
  }

  quiz = generatedSet.sort(() => Math.random() - 0.5);
  Swal.close();
  startAIQuiz(`AI Generated: ${topic}`);
}

function startAIQuiz(title) {
  document.querySelector('.landing').style.display = 'none';
  document.querySelector('.stats-sections').style.display = 'none';
  userAnswers = [];
  currentQuestionIndex = 0;
  container.style.display = 'block';
  container.setAttribute('aria-hidden', 'false');
  document.getElementById('subjectTitle').textContent = title;
  showQuestion();
  appTitle.textContent = title;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  playSound('correct');
}
const flashcardData = [
  { q: "Pipelining in COA", a: "Technique to execute multiple instructions simultaneously." },
  { q: "Dijkstra's Algorithm", a: "Finds the shortest path from a source to all other nodes." },
  { q: "ACID Properties", a: "Atomicity, Consistency, Isolation, Durability (DBMS)." },
  { q: "Deadlock", a: "Two processes wait for each other to release resources, causing a freeze." },
  { q: "NP-Hard", a: "Class of problems at least as hard as the hardest problems in NP." }
];

flashcardsBtn.addEventListener('click', () => {
  flashcardSection.style.display = 'flex';
  showCard();
});

closeFlashcards.addEventListener('click', () => flashcardSection.style.display = 'none');

flashcard.addEventListener('click', () => {
  flashcard.classList.toggle('flipped');
});

function showCard() {
  const card = flashcardData[currentCardIndex];
  cardFront.textContent = card.q;
  cardBack.textContent = card.a;
  flashcard.classList.remove('flipped');
  
  const progress = document.getElementById('cardProgress');
  if (progress) {
    progress.textContent = `${currentCardIndex + 1} / ${flashcardData.length}`;
  }
}

nextCardBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentCardIndex = (currentCardIndex + 1) % flashcardData.length;
  showCard();
});

prevCardBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentCardIndex = (currentCardIndex - 1 + flashcardData.length) % flashcardData.length;
  showCard();
});

// Pomodoro Timer Logic
pomodoroBtn.addEventListener('click', () => {
    if (pomodoroRunning) {
        clearInterval(pomodoroID);
        pomodoroRunning = false;
        pomodoroBtn.textContent = '⏱️ Study Timer';
        displayAlert('Timer Stopped');
    } else {
        let mins = 25, secs = 0;
        pomodoroRunning = true;
        pomodoroID = setInterval(() => {
            if (secs === 0) {
                if (mins === 0) {
                    clearInterval(pomodoroID);
                    Swal.fire({
                        title: 'Break Time!',
                        text: 'Focus session complete. Take a 5-min break!',
                        icon: 'success',
                        background: '#0f172a',
                        color: '#fff'
                    });
                    pomodoroRunning = false;
                    pomodoroBtn.textContent = '⏱️ Study Timer';
                    return;
                }
                mins--; secs = 59;
            } else {
                secs--;
            }
            pomodoroBtn.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs} 🛑 Stop`;
        }, 1000);
    }
});

// Calculator Logic
calcToggle.addEventListener('click', () => {
    calcOverlay.style.display = 'flex';
    playSound('click');
});
if (closeCalc) closeCalc.addEventListener('click', () => calcOverlay.style.display = 'none');



if (window.particlesJS) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 1200 } },
      color: { value: ['#6366f1', '#06b6d4', '#ffffff'] },
      shape: { type: 'circle' },
      opacity: { value: 0.15, random: true },
      size: { value: 2, random: true },
      line_linked: { enable: true, distance: 180, color: '#6366f1', opacity: 0.1, width: 1 },
      move: { enable: true, speed: 0.6, direction: 'none', random: true, straight: false, out_mode: 'out' }
    },
    interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } } },
    retina_detect: true
  });
}


const quotes = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "The best way to predict the future is to create it.",
  "Don't stop until you're proud.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Hard work beats talent when talent doesn't work hard."
];

function setRandomQuote() {
  const text = document.getElementById('quoteText');
  if (text) text.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
}
setRandomQuote();

function updateRecommendation() {
  const recBox = document.getElementById('recommendationBox');
  if (recBox) {
    recBox.innerHTML = `<i class="fas fa-lightbulb"></i> AI Suggestion: ${getRecommendation()}`;
  }
}
updateRecommendation();

function renderNotesRepository() {
    const grid = document.getElementById('notesRepositoryGrid');
    if (!grid) return;

    const subjects = Object.keys(subjectIcons).filter(s => s !== 'SE'); // SE doesn't have a PDF yet
    grid.innerHTML = subjects.map(s => `
        <div class="note-card">
            <i class="fas ${subjectIcons[s]}"></i>
            <span>${s}</span>
            <a href="notes/${s}.pdf" download class="btn-download-note">
                <i class="fas fa-download"></i> Download
            </a>
        </div>
    `).join('');
}
renderNotesRepository();

function updateFormula() {
    const fText = document.getElementById('formulaText');
    if (fText) {
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        fText.textContent = gateFormulas[dayOfYear % gateFormulas.length];
    }
}
updateFormula();

function renderSyllabus() {
    const grid = document.getElementById('syllabusGrid');
    if (!grid) return;
    const completed = JSON.parse(localStorage.getItem('syllabusCompleted')) || [];
    grid.innerHTML = '';
    
    syllabusData.forEach(topic => {
        const isSet = completed.includes(topic);
        const item = document.createElement('div');
        item.className = `syllabus-item ${isSet ? 'completed' : ''}`;
        item.innerHTML = `
            <div class="checkbox-custom"></div>
            <span>${topic}</span>
        `;
        item.onclick = () => { toggleSyllabus(topic); renderAchievements(); };
        grid.appendChild(item);
    });
}

function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
    grid.innerHTML = '';
    
    achievementsData.forEach(ach => {
        const isUnlocked = ach.criteria(history);
        const item = document.createElement('div');
        item.className = `achievement-badge ${isUnlocked ? 'unlocked' : ''}`;
        item.innerHTML = `
            <i class="fas ${ach.icon}"></i>
            <span>${ach.title}</span>
            <small>${ach.desc}</small>
        `;
        grid.appendChild(item);
    });
}
renderAchievements();

function toggleSyllabus(topic) {
    let completed = JSON.parse(localStorage.getItem('syllabusCompleted')) || [];
    if (completed.includes(topic)) {
        completed = completed.filter(t => t !== topic);
    } else {
        completed.push(topic);
        playSound('click');
    }
    localStorage.setItem('syllabusCompleted', JSON.stringify(completed));
    renderSyllabus();
}
renderSyllabus();

window.addEventListener('load', () => {
    if (!localStorage.getItem('seenWelcome')) {
        showWelcome(); localStorage.setItem('seenWelcome', '1');
    }
});
