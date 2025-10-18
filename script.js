
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
    currentSubject = btn.dataset.subject;
    loadNotes(currentSubject);
    quiz = quizData[currentSubject] || [];
    if(!quiz.length) return displayAlert('No quiz available for this subject');
    userAnswers = [];
    currentQuestionIndex = 0;
    container.style.display = 'block'; container.setAttribute('aria-hidden','false');
    document.getElementById('subjectTitle').textContent = `${btn.textContent} Quiz`;
    showQuestion();
    notesBox.style.display = 'block';
    appTitle.textContent = `${btn.textContent} — GATE Quiz`;
    window.scrollTo({top:0,behavior:'smooth'});
    playClick();
  });
});

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
  scoreCard.innerHTML = `<h2>Your Score: ${score} / ${quiz.length}</h2><button id=\"restartBtn\">Restart Quiz</button>`;
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
  history.slice(0,5).forEach(item=>{
    const li = document.createElement('li'); li.textContent = `${item.subject} - ${item.score} - ${item.date}`; leaderboardList.appendChild(li);
  });
}
updateLeaderboard();


if(window.particlesJS){
  particlesJS('particles-js', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: '#00ffcc' },
      shape: { type: 'circle' },
      opacity: { value: 0.12 },
      size: { value: 4 },
      line_linked: { enable: true, distance: 160, color: '#00ffcc', opacity:0.08, width:1 },
      move: { enable: true, speed: 1 }
    },
    interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'repulse' } } },
    retina_detect: true
  });
}


window.addEventListener('load', ()=>{
  if(!localStorage.getItem('seenWelcome')){
    showWelcome(); localStorage.setItem('seenWelcome','1');
  }
});
