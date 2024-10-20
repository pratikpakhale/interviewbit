// to proxy cors
const requestHeaders = {
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'max-age=0',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
};

const topicsMap = {
  JavaScript: 'javascript',
  SQL: 'sql',
  DBMS: 'dbms',
  'Operating System': 'operating-system',
  'Data Structures': 'data-structure',
  NodeJS: 'node-js',
  OOPs: 'oops',
  'Computer Networks': 'networking',
  TypeScript: 'typescript',
  'Machine Learning': 'machine-learning',
  'System Design': 'system-design',
  React: 'react',
  Vue: 'vue-js',
};

const customTopics = JSON.parse(localStorage.getItem('customTopics')) || {};

const elements = {
  time: document.getElementById('time'),
  date: document.getElementById('date'),
  question: document.getElementById('question'),
  answer: document.getElementById('answer'),
  topic: document.getElementById('topic'),
};

function updateTime() {
  const now = new Date();
  elements.time.textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  elements.date.textContent = now.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function fetchRandomQuestion() {
  blurUnblur(true);
  const storedTopics =
    JSON.parse(localStorage.getItem('selectedTopics')) ||
    Object.values(topicsMap);
  if (storedTopics.length === 0) {
    elements.question.textContent = 'Please select topics in settings';
    elements.answer.textContent = '';
    return;
  }
  const randomTopic =
    storedTopics[Math.floor(Math.random() * storedTopics.length)];
  const url = `https://www.interviewbit.com/${randomTopic}-interview-questions/`;

  const topicName = Object.keys({ ...topicsMap, ...customTopics }).find(
    key => topicsMap[key] === randomTopic || customTopics[key] === randomTopic
  );

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: requestHeaders,
      credentials: 'include',
    });
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const questionElements = doc.querySelectorAll('.ibpage-article-header');

    if (questionElements.length > 0) {
      const randomElement =
        questionElements[Math.floor(Math.random() * questionElements.length)];
      const questionId = randomElement.id;
      const question = randomElement.querySelector('h3').textContent;
      const answer = randomElement.querySelector('article').innerHTML;

      elements.topic.textContent = topicName;
      document.getElementById(
        'question'
      ).innerHTML = `<a href="${url}#${questionId}" target="_blank">${question}</a>`;
      elements.answer.innerHTML = answer;

      // Fix data-src issues and change anchor colors
      const answerContainer = elements.answer;
      answerContainer.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
      answerContainer.querySelectorAll('a').forEach(anchor => {
        anchor.style.color = '#4fc3f7';
      });
    } else {
      throw new Error('No questions found');
    }
  } catch (error) {
    console.error('Error fetching question:', error);
    elements.question.textContent = 'Error loading question';
    elements.answer.textContent = 'Please try again later';
  }
}

function addCustomTopic(url, name) {
  if (
    !url.startsWith('https://www.interviewbit.com/') ||
    !url.endsWith('-interview-questions/')
  ) {
    throw new Error('Invalid URL format');
  }

  const slug = url
    .split('/')
    .filter(Boolean)
    .pop()
    .replace('-interview-questions', '');
  customTopics[name] = slug;
  console.log(slug);
  localStorage.setItem('customTopics', JSON.stringify(customTopics));
  displayTopics(); // Refresh the topics list
}

function displayTopics() {
  const topicsList = document.getElementById('topics-list');
  topicsList.innerHTML = '';
  const storedTopics =
    JSON.parse(localStorage.getItem('selectedTopics')) ||
    Object.values(topicsMap);

  const allTopics = new Map([
    ...Object.entries(topicsMap),
    ...Object.entries(customTopics),
  ]);

  const sortedTopics = Array.from(allTopics).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const fragment = document.createDocumentFragment();

  sortedTopics.forEach(([displayName, urlName]) => {
    const topicItem = document.createElement('div');
    topicItem.className = 'topic-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = urlName;
    checkbox.value = urlName;
    checkbox.checked = storedTopics.includes(urlName);
    console.log(displayName, urlName, checkbox.checked);

    const label = document.createElement('label');
    label.htmlFor = urlName;
    label.textContent = displayName;

    topicItem.append(checkbox, label);
    fragment.appendChild(topicItem);
  });

  topicsList.appendChild(fragment);
}
document.getElementById('add-custom-topic').addEventListener('click', () => {
  document.getElementById('settings-modal').style.display = 'none';
  document.getElementById('add-custom-topic-modal').style.display = 'block';
});

document.getElementById('save-custom-topic').addEventListener('click', () => {
  const url = document.getElementById('custom-topic-url').value;
  const name = document.getElementById('custom-topic-name').value;
  if (url && name) {
    addCustomTopic(url, name);
    document.getElementById('add-custom-topic-modal').style.display = 'none';
  } else {
    alert('Please enter both URL and name for the custom topic.');
  }

  document.getElementById('settings-modal').style.display = 'block';
});

document.getElementById('close-custom-topic').addEventListener('click', () => {
  document.getElementById('add-custom-topic-modal').style.display = 'none';
});

function saveSettings() {
  const selectedTopics = Array.from(
    document.querySelectorAll('#topics-list input[type="checkbox"]:checked')
  ).map(el => el.value);
  localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics));
}

document.addEventListener('DOMContentLoaded', () => {
  updateTime();
  setInterval(updateTime, 1000);
  fetchRandomQuestion();

  document
    .getElementById('refresh-icon')
    .addEventListener('click', fetchRandomQuestion);
  document.getElementById('settings-icon').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'block';
    displayTopics();
  });
  document.getElementById('close-settings').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'none';
    fetchRandomQuestion();
  });
  document.getElementById('topics-list').addEventListener('change', event => {
    if (event.target.type === 'checkbox') {
      saveSettings();
    }
  });
});

function blurUnblur(blur) {
  const answerElement = elements.answer;
  if (blur === undefined) {
    answerElement.classList.toggle('blurred');
  } else if (blur === true) {
    answerElement.classList.add('blurred');
  } else {
    answerElement.classList.remove('blurred');
  }
}

elements.answer.addEventListener('click', () => {
  blurUnblur(false);
});
