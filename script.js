const boardEl = document.getElementById('bingoBoard');
const generateBtn = document.getElementById('generateBtn');
const worseBtn = document.getElementById('worseBtn');
const shareBtn = document.getElementById('shareBtn');
const chaosSlider = document.getElementById('chaosSlider');
const chaosValue = document.getElementById('chaosValue');

const cardKey = 'cap-bingo-card-v1';
const markKey = 'cap-bingo-marks-v1';

const normalPool = [
  'Someone says “per regulation”', 'Form signed in wrong spot', 'Printer failure',
  'Reply-all email storm', 'Last-minute suspense', 'Forgot sign-in sheet',
  'PowerPoint over 85 slides', 'Mandatory training link broken', 'Commander asks for volunteers',
  'Can everyone hear me?', 'Projector refuses to cooperate', 'Meeting starts 20 minutes late',
  'Awkward silence after questions', 'Coffee disappears instantly', 'Someone says “synergy” unironically',
  'Radio battery dead', 'Van fuel below 1/4 tank', 'Ground team waiting around',
  'Aircrew says “one more pass”', 'Weather delay', 'Mission paperwork chaos',
  'Cadet asks if this is mandatory', 'Uniform item missing', 'Cadet falls asleep at attention',
  'Hydration reminder', 'Promotion delayed by paperwork', 'Discussion about Hobbs time',
  'Pilot explains weather dramatically', 'Fuel receipt missing', 'Aircraft discrepancy discovered late',
  'No one sent photo captions', 'Wrong rank in press release', 'Need social post immediately',
  'Semper Vigilans pronounced incorrectly', 'Reflective belt appears', 'Tactical backpack',
  'Van smells weird', 'Someone forgot sunscreen', 'Mission pilot discussing fuel burn',
  'Someone can’t open the PowerPoint', 'Coffee identified as probable carcinogen'
];

const chaosPool = [
  'ELT is treadmill', 'Laptop at 3% battery', 'Safety briefing forgotten',
  'Coffee achieves sentience', 'Someone brought their own laminator', 'Missing extension cord',
  'PowerPoint font changes mid-slide', 'Nobody knows who has keys', 'Cadet acquires traffic cone',
  'Unexpected bagpipes', 'Clicker stops working during key slide', 'Weather app debate escalates',
  '“Living the dream” with dead eyes', 'Muted on Zoom while speaking', 'CAP van door won’t close'
];

const freeSpacePool = [
  'Hydrate', 'Semper Gumby', 'Coffee Required', 'Safety First',
  'CAP Van Smell', 'Muted on Zoom', 'Reflective Belt', 'Outstanding Volunteerism'
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function generateCard(extraChaos = 0) {
  const chaosPct = Math.min(100, Number(chaosSlider.value) + extraChaos);
  const chaosCount = Math.max(2, Math.round((chaosPct / 100) * 24));
  const normalCount = 24 - chaosCount;

  const picks = [
    ...shuffle(normalPool).slice(0, normalCount),
    ...shuffle(chaosPool).slice(0, chaosCount)
  ];

  const board = shuffle(picks);
  board.splice(12, 0, `FREE SPACE: ${shuffle(freeSpacePool)[0]}`);

  localStorage.setItem(cardKey, JSON.stringify(board));
  localStorage.removeItem(markKey);
  renderBoard(board, []);
}

function renderBoard(board, marks = []) {
  boardEl.innerHTML = '';
  board.forEach((text, idx) => {
    const square = document.createElement('button');
    square.type = 'button';
    square.className = 'square';
    square.setAttribute('role', 'gridcell');
    if (idx === 12) square.classList.add('free');
    if (marks.includes(idx)) square.classList.add('marked');
    square.textContent = text;

    square.addEventListener('click', () => {
      square.classList.toggle('marked');
      const currentMarks = [...document.querySelectorAll('.square.marked')].map(el => [...boardEl.children].indexOf(el));
      localStorage.setItem(markKey, JSON.stringify(currentMarks));
    });

    boardEl.appendChild(square);
  });
}

async function shareCardImage() {
  if (!window.html2canvas) {
    alert('Screenshot helper unavailable. Use a browser screenshot for now.');
    return;
  }
  const canvas = await window.html2canvas(boardEl, { backgroundColor: '#1d2226' });
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  const file = new File([blob], 'cap-bingo-card.png', { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ title: 'CAP Bingo Card', files: [file] });
  } else {
    const link = document.createElement('a');
    link.download = 'cap-bingo-card.png';
    link.href = canvas.toDataURL();
    link.click();
  }
}

function init() {
  chaosValue.textContent = `${chaosSlider.value}%`;
  const savedBoard = JSON.parse(localStorage.getItem(cardKey) || 'null');
  const savedMarks = JSON.parse(localStorage.getItem(markKey) || '[]');

  if (savedBoard?.length === 25) {
    renderBoard(savedBoard, savedMarks);
  } else {
    generateCard();
  }
}

generateBtn.addEventListener('click', () => generateCard());
worseBtn.addEventListener('click', () => generateCard(35));
shareBtn.addEventListener('click', shareCardImage);
chaosSlider.addEventListener('input', () => {
  chaosValue.textContent = `${chaosSlider.value}%`;
});

init();
