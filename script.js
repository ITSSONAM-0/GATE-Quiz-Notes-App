
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

const mockTestBtn = document.getElementById('mockTestBtn');
const flashcardsBtn = document.getElementById('flashcardsBtn');
const pomodoroBtn = document.getElementById('pomodoroBtn');
const flashcardSection = document.getElementById('flashcardSection');
const flashcard = document.getElementById('flashcard');
const closeFlashcards = document.querySelector('.close-flashcards');
const nextCardBtn = document.getElementById('nextCard');
const prevCardBtn = document.getElementById('prevCard');
const cardFront = document.getElementById('cardFrontText');
const cardBack = document.getElementById('cardBackText');



const quizData = {
  EM:[{question:"Derivative of x^2?",choices:["2x","x^2","x","1"],answer:"2x"},{question:"Integral of 1/x?",choices:["ln x","1/x","x","e^x"],answer:"ln x"}],
  DL:[{question:"Logic gate with AND behavior?",choices:["OR","AND","XOR","NOT"],answer:"AND"},{question:"NOT gate symbol?",choices:["Triangle","Circle","Inverter","Square"],answer:"Inverter"}],
  COA:[{question:"Full form of FSM?",choices:["Finite State Machine","First State Machine","Fixed State Machine","Fast State Machine"],answer:"Finite State Machine"}],
  DS:[{question:"Queue uses?",choices:["FIFO","LIFO","Stack","Array"],answer:"FIFO"}],
  ALGO:[{question:"Binary search complexity?",choices:["O(n)","O(log n)","O(n^2)","O(1)"],answer:"O(log n)"}],
  TOC:[{question:"Regular languages are accepted by?",choices:["DFA","NFA","PDA","Turing Machine"],answer:"DFA"}],
  CD:[{question:"Syntax analysis phase in compiler?",choices:["Lexical Analysis","Parsing","Code Generation","Optimization"],answer:"Parsing"}],
  OS:[{question:"CPU scheduling algorithm?",choices:["FCFS","LRU","Binary Search","DFS"],answer:"FCFS"}],
  DBMS:[{question:"SQL full form?",choices:["Structured Query Language","Simple Query Language","Structured Question Language","Sequential Query Language"],answer:"Structured Query Language"}],
  CN:[{question:"IP stands for?",choices:["Internet Protocol","Internet Process","Internal Protocol","Interface Protocol"],answer:"Internet Protocol"}],
  SE:[{question:"SDLC stands for?",choices:["Software Development Life Cycle","System Development Life Cycle","Software Design Life Cycle","System Design Life Cycle"],answer:"Software Development Life Cycle"}]
};


function displayAlert(msg, timeout=2000){
  const a = document.createElement('div'); a.className='alert'; a.textContent = msg; document.body.appendChild(a);
  setTimeout(()=> a.remove(), timeout);
}


function playClick(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 700; g.gain.value = 0.02;
    o.connect(g); g.connect(ctx.destination);
    o.start(); setTimeout(()=>{ o.stop(); ctx.close(); }, 80);
  }catch(e){/*ignore on unsupported*/}
}


let dark = true;
function toggleTheme(){
  dark = !dark;
  document.documentElement.style.setProperty('--bg-1', dark? '#0f1724' : '#f2f6fb');
  document.documentElement.style.setProperty('--bg-2', dark? '#172033' : '#e6eef6');
  document.body.style.color = dark? '#e6eef6' : '#122034';
}
themeToggle.addEventListener('click', toggleTheme);

welcomeBtn.addEventListener('click', ()=> showWelcome());
function showWelcome(){
  Swal.fire({
    title: 'Welcome Sonam!',
    text: 'Start practicing — choose a subject and try a short quiz.',
    icon: 'info',
    confirmButtonText: 'Let\'s go!'
  });
}


toggleNotesBtn.addEventListener('click', ()=>{
  const visible = notesBox.style.display === 'block';
  notesBox.style.display = visible? 'none':'block';
});

function loadNotes(subject){
  const pdfPath = `notes/${subject}.pdf`;
  pdfFrame.src = pdfPath;
  downloadPDF.href = pdfPath;
}


subjectButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    startQuiz(btn.dataset.subject, btn.textContent);
  });
});

function startQuiz(subject, title){
    currentSubject = subject;
    if(subject === 'MOCK'){
        quiz = Object.values(quizData).flat().sort(()=>Math.random()-0.5).slice(0, 10);
        title = "Full Mock Test";
    } else {
        quiz = quizData[subject] || [];
        loadNotes(subject);
        notesBox.style.display = 'block';
    }

    if(!quiz.length) return Swal.fire('Error', 'No quiz available', 'error');
    
    document.querySelector('.landing').style.display = 'none';
    document.getElementById('statsBox').style.display = 'none';
    userAnswers = [];
    currentQuestionIndex = 0;
    container.style.display = 'block'; 
    container.setAttribute('aria-hidden','false');
    document.getElementById('subjectTitle').textContent = title;
    showQuestion();
    appTitle.textContent = `${title} — GATE App`;
    window.scrollTo({top:0,behavior:'smooth'});
    playClick();
}

mockTestBtn.addEventListener('click', () => startQuiz('MOCK', 'Full Mock Test'));


function showQuestion(){
  const q = quiz[currentQuestionIndex];
  questionBox.textContent = q.question;
  choicesBox.innerHTML = '';
  q.choices.forEach(choice=>{
    const div = document.createElement('div'); div.className='choice'; div.textContent = choice; div.setAttribute('role','button');
    if(userAnswers[currentQuestionIndex]===choice){ div.classList.add('selected'); div.classList.add(choice===q.answer? 'correct':'wrong'); }
    div.addEventListener('click', ()=>{
      document.querySelectorAll('.choice').forEach(c=>c.classList.remove('selected','correct','wrong'));
      div.classList.add('selected'); div.classList.add(div.textContent===q.answer? 'correct':'wrong');
      userAnswers[currentQuestionIndex]=div.textContent; stopTimer();
      setTimeout(()=>{
        if(currentQuestionIndex<quiz.length-1){ currentQuestionIndex++; showQuestion(); }
        else showScore();
      },800);
      playClick();
    });
    choicesBox.appendChild(div);
  });
  timeLeft = 15;
  startTimer();
  progress.style.width = ((currentQuestionIndex + 1) / quiz.length) * 100 + '%';
}

function startTimer(){
  clearInterval(timerID);
  timer.textContent = timeLeft; timer.classList.remove('warning');
  timerID = setInterval(()=>{
    timeLeft--; timer.textContent = timeLeft;
    if(timeLeft<=5) timer.classList.add('warning');
    if(timeLeft===0){
      displayAlert(`Time's up! Correct: ${quiz[currentQuestionIndex].answer}`);
      document.querySelectorAll('.choice').forEach(c=>{ if(c.textContent===quiz[currentQuestionIndex].answer) c.classList.add('correct'); });
      stopTimer();
      setTimeout(()=>{ if(currentQuestionIndex<quiz.length-1){ currentQuestionIndex++; showQuestion(); } else showScore(); },900);
    }
  },1000);
}
function stopTimer(){ clearInterval(timerID); }

nextBtn.addEventListener('click', ()=>{
  if(!userAnswers[currentQuestionIndex]) return displayAlert('Select an answer!');
  if(currentQuestionIndex<quiz.length-1){ currentQuestionIndex++; showQuestion(); }
  else showScore();
});
prevBtn.addEventListener('click', ()=>{ if(currentQuestionIndex>0){ currentQuestionIndex--; showQuestion(); } });

function showScore(){
  container.style.display = 'none'; container.setAttribute('aria-hidden','true');
  score = userAnswers.filter((ans,i)=>ans===quiz[i].answer).length;
  
  const percentage = (score/quiz.length)*100;
  let feedback = "Keep Practicing!";
  if(percentage === 100){
      feedback = "Perfect Score! You're a GATE Master! 🏆";
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  } else if(percentage >= 70){
      feedback = "Great Job! Almost there! 🚀";
      confetti({ particleCount: 100, spread: 50, origin: { y: 0.6 } });
  }

  scoreCard.innerHTML = `
    <div class="score-summary">
        <h2>${feedback}</h2>
        <p>Your Score: <strong>${score} / ${quiz.length}</strong></p>
        <button id="restartBtn">Try Another Quiz</button>
    </div>
  `;
  scoreCard.style.display = 'block';
  document.getElementById('restartBtn').addEventListener('click', ()=> location.reload());
  displayAlert('Quiz Completed!');
  saveHistory();
}


function saveHistory(){
  let history = JSON.parse(localStorage.getItem('quizHistory'))||[];
  history.push({subject:currentSubject,score:score,date:new Date().toLocaleString()});
  localStorage.setItem('quizHistory',JSON.stringify(history));
  updateLeaderboard();
}

function updateLeaderboard(){
  let history = JSON.parse(localStorage.getItem('quizHistory'))||[];
  history.sort((a,b)=>b.score-a.score);
  leaderboardList.innerHTML = '';
  history.slice(0,5).forEach((item, index)=>{
    const li = document.createElement('li');
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤';
    li.innerHTML = `<span>${medal} ${item.subject}</span> <strong>${item.score}</strong> <small>${item.date.split(',')[0]}</small>`; 
    leaderboardList.appendChild(li);
  });
  updateChart(history);
}

function updateChart(history){
    const ctx = document.getElementById('scoreChart').getContext('2d');
    const last10 = history.slice(-10).reverse();
    const labels = last10.map(h => h.subject + ' (' + h.date.split(',')[0] + ')');
    const data = last10.map(h => h.score);

    if(scoreChart) scoreChart.destroy();
    scoreChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quiz Scores',
                data: data,
                borderColor: '#00e5ff',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}
updateLeaderboard();

// Flashcards Logic
let currentCardIndex = 0;
const flashcardData = [
    {q: "Pipelining in COA", a: "Technique to execute multiple instructions simultaneously."},
    {q: "Dijkstra's Algorithm", a: "Finds the shortest path from a source to all other nodes."},
    {q: "ACID Properties", a: "Atomicity, Consistency, Isolation, Durability (DBMS)."},
    {q: "Deadlock", a: "Situation where two processes wait for each other to release resources."},
    {q: "NP-Hard", a: "Class of problems at least as hard as the hardest problems in NP."}
];

flashcardsBtn.addEventListener('click', () => {
    flashcardSection.style.display = 'flex';
    showCard();
});

closeFlashcards.addEventListener('click', () => flashcardSection.style.display = 'none');

flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
});

function showCard(){
    const card = flashcardData[currentCardIndex];
    cardFront.textContent = card.q;
    cardBack.textContent = card.a;
    flashcard.classList.remove('flipped');
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
    if(pomodoroRunning){
        clearInterval(pomodoroID);
        pomodoroRunning = false;
        pomodoroBtn.textContent = '⏱️ Study Timer';
        displayAlert('Timer Stopped');
    } else {
        let mins = 25, secs = 0;
        pomodoroRunning = true;
        pomodoroID = setInterval(() => {
            if(secs === 0){
                if(mins === 0){
                    clearInterval(pomodoroID);
                    Swal.fire('Break Time!', 'Focus session complete. Take a 5-min break!', 'success');
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



if(window.particlesJS){
  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 1000 } },
      color: { value: ['#00e5ff', '#ffcc00', '#ffffff'] },
      shape: { type: 'circle' },
      opacity: { value: 0.2, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: '#00e5ff', opacity: 0.1, width: 1 },
      move: { enable: true, speed: 0.8, direction: 'none', random: true, straight: false, out_mode: 'out' }
    },
    interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } } },
    retina_detect: true
  });
}


window.addEventListener('load', ()=>{
  if(!localStorage.getItem('seenWelcome')){
    showWelcome(); localStorage.setItem('seenWelcome','1');
  }
});
