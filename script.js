const boardEl = document.getElementById('bingoBoard');
const generateBtn = document.getElementById('generateBtn');
const worseBtn = document.getElementById('worseBtn');
const shareBtn = document.getElementById('shareBtn');
const chaosSlider = document.getElementById('chaosSlider');
const chaosValue = document.getElementById('chaosValue');
const themeToggleBtn = document.getElementById('themeToggleBtn');

const cardKey = 'cap-bingo-card-v1';
const markKey = 'cap-bingo-marks-v1';
const themeKey = 'cap-bingo-theme-v1';

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
  'Someone can’t open the PowerPoint', 'Coffee identified as probable carcinogen',
  'Budget spreadsheet from 2014 resurfaces', 'Two people bring the same clipboard',
  'Meeting room thermostat set to arctic', 'Color guard practices nearby',
  'Reminder email marked URGENT x3', 'Someone asks for a fillable PDF',
  'Uniform inspection starts early', 'Confusion over meeting location',
  'Extension cord becomes tripping hazard', 'Whiteboard marker completely dry',
  'Someone says “circle back”', 'Laptop update starts during briefing',
  'Name tag written in Sharpie', 'Van key is on the wrong keyring',
  'Phone alarm goes off in formation', 'Cadet asks where the snacks are',
  'Someone prints in grayscale by accident', 'Clipboard goes missing for 10 minutes',
  'Agenda changed without warning', 'Side conversation gets louder than speaker',
  'Someone quotes CAPR from memory', 'Password expires at worst time',
  'Water cooler is empty', 'Mission number written incorrectly',
  'Parking lot radio check', 'Safety vest appears from nowhere',
  'Late arrival with iced coffee', 'Discussion about who has authority',
  'Old checklist with outdated date', 'Someone forgets to hit record',
  'Email attachment missing again', 'Reminder to submit receipts today',
  'Map printed at wrong scale', 'Someone asks for hard copies only',
  'Speakerphone echo for entire call', 'Uniform lint roller gets passed around',
  'Quick question takes 20 minutes', 'Someone confuses sortie and mission',
  'Sign-in sheet runs out of lines', 'Background music from adjacent room',
  'Training video has no sound', 'Projector cable disappears',
  'Calendar invite sent to wrong squadron', 'Last name misspelled on certificate',
  'Someone insists this is a quick fix', 'Mission debrief turns into story time',
  'Binder clip shortage', 'Someone asks if this counts for credit',
  'Debate about proper acronym usage', 'Random flyover interrupts briefing',
  'Coffee pot labeled “do not touch”', 'Someone asks where the stapler lives',
  'Form version mismatch discovered', 'Battery charger borrowed indefinitely',
  'Quick weather check becomes full brief', 'Discussion about reflective belt policy',
  'Someone uses Comic Sans accidentally', 'Door alarm chirps every minute',
  'Announcement starts with “real quick”', 'Two radios on same channel squeal',
  'Someone brought donuts to win favor', 'Clipboards stacked like Jenga',
  'Polo shirt not tucked in debate', 'One pen for entire room',
  'Cadet asks about ES patches', 'Printer defaults to double-sided',
  'Meeting starts with mic test', 'Someone says “boots on ground”',
  'GPS app needs immediate update', 'Someone forgot their CAPID',
  'Roster has duplicate names', 'Mission board magnets fall off',
  'Random software license prompt appears', 'Snack table empties before break',
  'Somebody says “work smarter not harder”', 'Chains of command clarified twice',
  'One person taking notes for everyone', 'Google Drive permissions denied',
  'Last-minute room reassignment', 'Someone forgot the squadron banner',
  'Training slide still says TBD', 'Hydration brief repeated',
  'Photo op requested mid-task', 'Someone asks for a restroom break',
  'Signage points to wrong entrance', 'Misplaced vehicle mileage log',
  'Long pause before “any questions?”', 'Someone says “voluntold”',
  'Roster printed with tiny font', 'Radio earpiece mysteriously tangled',
  'Shoe shine kit appears unexpectedly', 'Discussion of previous weekend mission',
  'Someone asks to resend that link', 'Clipboard flips in the wind',
  'Wi-Fi network disappears', 'Checklist item read twice for emphasis'
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

function pickRandom(pool, count) {
  if (count <= 0) return [];
  const picks = [];
  while (picks.length < count) {
    picks.push(...shuffle(pool));
  }
  return picks.slice(0, count);
}

function generateCard(extraChaos = 0) {
  const chaosPct = Math.min(100, Number(chaosSlider.value) + extraChaos);
  const chaosCount = Math.max(2, Math.round((chaosPct / 100) * 24));
  const normalCount = 24 - chaosCount;

  const picks = [
    ...pickRandom(normalPool, normalCount),
    ...pickRandom(chaosPool, chaosCount)
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
  const pageBg = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#ffffff';
  const canvas = await window.html2canvas(boardEl, { backgroundColor: pageBg });
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


function applyTheme(theme) {
  const normalizedTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', normalizedTheme);
  const isDark = normalizedTheme === 'dark';
  themeToggleBtn.textContent = isDark ? '☀️ Day Mode' : '🌙 Night Mode';
  themeToggleBtn.setAttribute('aria-pressed', String(isDark));
  localStorage.setItem(themeKey, normalizedTheme);
}

function init() {
  const savedTheme = localStorage.getItem(themeKey) || 'light';
  applyTheme(savedTheme);
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
themeToggleBtn.addEventListener('click', () => {
  const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
});

chaosSlider.addEventListener('input', () => {
  chaosValue.textContent = `${chaosSlider.value}%`;
});

init();
