const Jimp = require("jimp");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot("5716895097:AAFriyu13C__xRMuLk4dph4S4e-ZMkho_dI", {
  polling: true,
});

// Клавіатури з кнопками
function createMenuKeyboard() {
  return {
    keyboard: [
      ["/start", "/reactions"],
      ["/addbuttons", "/movebuttons"],
      ["/disablebuttons"],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
}

function sendMenuMessage(chatId) {
  bot.sendMessage(chatId, "Меню:", {
    reply_markup: JSON.stringify(createMenuKeyboard()),
  });
}

bot.onText(/\/menu/, (msg) => {
  console.log("Received /menu command");
  const chatId = msg.chat.id;
  sendMenuMessage(chatId);
});

let buttons = [["Нова кнопка 1", "Нова кнопка 2"], ["Нова кнопка 3"]];

// Таблиця доступних реакцій у телеграм
const reactionTable = [
  ["👍", "👎"],
  ["😄", "😢"],
  ["😂", "😡"],
];

bot.onText(/\/start/, (msg) => {
  console.log("Received /start command");
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Привіт! Я бот автосповіщень.");

  const options = {
    parse_mode: "HTML",
  };

  // Зображення над текстом
  bot.sendMessage(chatId, "Тут може бути зображення над текстом", options);

  // Зображення під текстом
  bot.sendMessage(chatId, "Тут може бути зображення під текстом", options);

  // Додати клавіатуру з кнопками
  const replyMarkup = {
    keyboard: buttons,
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  bot.sendMessage(chatId, "Ось деякі кнопки:", {
    reply_markup: JSON.stringify(replyMarkup),
  });

  // Додати кнопку для команди /reactions
  const reactionButton = {
    text: "Вибрати реакцію",
    callback_data: "/reactions",
  };

  const inlineKeyboard = {
    inline_keyboard: [[reactionButton]],
  };

  // Відправити повідомлення з кнопкою для команди /reactions
  bot.sendMessage(chatId, "Доступні дії:", { reply_markup: inlineKeyboard });

  // Додати кнопку /menu
  const menuButton = {
    text: "Меню",
    callback_data: "/menu",
  };

  const inlineMenuButton = {
    inline_keyboard: [[menuButton]],
  };

  bot.sendMessage(chatId, "Ось кнопка /menu:", {
    reply_markup: inlineMenuButton,
  });

  bot.sendMessage(
    chatId,
    "Ласкаво просимо! Ви можете надіслати свою заявку, і ми її опрацюємо."
  );

  bot.sendMessage(
    chatId,
    'Отримуйте останні новини та спеціальні пропозиції у наших рекламних розсилках. Якщо бажаєте підписатися, натисніть кнопку "Підписатися" нижче.',
    {
      reply_markup: {
        keyboard: [["Підписатися"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
});

bot.onText(/Підписатися/, (msg) => {
  console.log("Received subscription request");
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Ви успішно підписалися на рекламну розсилку! Будь ласка, залишайтеся на зв'язку для отримання останніх новин та спеціальних пропозицій."
  );
});

bot.onText(/\/advertise/, (msg) => {
  console.log("Received /advertise command");
  const chatId = msg.chat.id;

  // Перевірити, чи є підписка на рекламну розсилку

  if (advertise) {
    // Відправити повідомлення для розсилки реклами
    bot.sendMessage(chatId, "Ось наша остання рекламна пропозиція:");
    bot.sendMessage(
      chatId,
      "Тут можна вказати деталі рекламного повідомлення і його формат."
    );

    //деталізації пропозиції

    // const keyboard = {
    //   inline_keyboard: [
    //     [
    //       { text: 'Детальніше', url: 'http://example.com' }
    //     ]
    //   ]
    // };
    // bot.sendMessage(chatId, 'Дізнайтеся більше про нашу пропозицію:', { reply_markup: keyboard });
  } else {
    bot.sendMessage(
      chatId,
      'Ви не підписані на рекламну розсилку. Щоб підписатися, натисніть кнопку "Підписатися".'
    );
  }
});

bot.onText(/\/disablebuttons/, (msg) => {
  console.log("Received /disablebuttons command");
  const chatId = msg.chat.id;

  const replyMarkup = {
    remove_keyboard: true,
  };

  bot.sendMessage(chatId, "Кнопки вимкнено.", {
    reply_markup: JSON.stringify(replyMarkup),
  });
});

bot.onText(/\/addbuttons/, (msg) => {
  console.log("Received /addbuttons command");
  const chatId = msg.chat.id;

  const replyMarkup = {
    keyboard: buttons,
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  bot.sendMessage(chatId, "Додано нові кнопки.", {
    reply_markup: JSON.stringify(replyMarkup),
  });
});

bot.onText(/\/movebuttons/, (msg) => {
  console.log("Received /movebuttons command");
  const chatId = msg.chat.id;

  // Перемішуємо кнопки випадковим чином
  buttons = shuffleButtons(buttons);

  // Оновлюємо клавіатуру з перемішаними кнопками
  const replyMarkup = {
    keyboard: buttons,
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  // Відправляємо повідомлення з перемішаними кнопками
  bot.sendMessage(chatId, "Переміщено кнопки.", {
    reply_markup: JSON.stringify(replyMarkup),
  });
});

function shuffleButtons(buttons) {
  const shuffledButtons = [...buttons];

  for (let i = shuffledButtons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledButtons[i], shuffledButtons[j]] = [
      shuffledButtons[j],
      shuffledButtons[i],
    ];
  }

  return shuffledButtons;
}

bot.onText(/\/reactions/, (msg) => {
  console.log("Received /reactions command");
  const chatId = msg.chat.id;

  // Створюємо клавіатуру з доступними реакціями
  const replyMarkup = {
    keyboard: reactionTable,
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  // Відправляємо повідомлення з таблицею реакцій
  bot.sendMessage(chatId, "Оберіть реакцію:", {
    reply_markup: JSON.stringify(replyMarkup),
  });
});

bot.onText(/\/disablereaction (.+)/, (msg, match) => {
  console.log("Received /disablereaction command");
  const chatId = msg.chat.id;
  const reaction = match[1];

  for (let i = 0; i < reactionTable.length; i++) {
    const row = reactionTable[i];
    const index = row.indexOf(reaction);
    if (index !== -1) {
      row.splice(index, 1);
      break;
    }
  }

  const replyMarkup = {
    keyboard: reactionTable,
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  bot.sendMessage(chatId, `Реакцію ${reaction} вимкнено.`, {
    reply_markup: JSON.stringify(replyMarkup),
  });
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  if (data === "/reactions") {
    console.log("Received /reactions inline button");
    const replyMarkup = {
      keyboard: reactionTable,
      resize_keyboard: true,
      one_time_keyboard: true,
    };
    bot.sendMessage(chatId, "Оберіть реакцію:", {
      reply_markup: JSON.stringify(replyMarkup),
    });
  } else {
    console.log("Received reaction:", data);
    bot.deleteMessage(chatId, messageId);
    const replyMarkup = {
      keyboard: buttons,
    };
    bot.sendMessage(chatId, "Ось деякі кнопки:", {
      reply_markup: JSON.stringify(replyMarkup),
    });
  }
});

// Заборонені слова для коментарів
const stopWords = ["спам", "оскорбление", "неприйнятно"];

// Функція для перевірки коментарів на наявність заборонених слів
function checkComment(text) {
  for (let i = 0; i < stopWords.length; i++) {
    if (text.toLowerCase().includes(stopWords[i])) {
      return true;
    }
  }
  return false;
}

bot.on("message", (msg) => {
  console.log("Received comment:", msg.text);
  const chatId = msg.chat.id;

  if (checkComment(msg.text)) {
    bot.sendMessage(chatId, "Ваш коментар не прийнятний і буде заблоковано.");
    bot.deleteMessage(chatId, msg.message_id);
    return;
  }

  // Відповідь на значний коментар
  if (msg.text.length > 20) {
    bot.sendMessage(chatId, "Дякуємо за ваш коментар!");
    return;
  }
});

// Обробник команди /disablereaction
bot.onText(/\/disablereaction (.+)/, (msg, match) => {
  console.log("Received /disablereaction command");
  const chatId = msg.chat.id;
  const reaction = match[1];

  for (let i = 0; i < reactionTable.length; i++) {
    const row = reactionTable[i];
    const index = row.indexOf(reaction);
    if (index !== -1) {
      row.splice(index, 1);
      break;
    }
  }

  // Оновлюємо клавіатуру з реакціями
  const replyMarkup = {
    keyboard: reactionTable,
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  // Відправляємо повідомлення з оновленою таблицею реакцій
  bot.sendMessage(chatId, `Реакцію ${reaction} вимкнено.`, {
    reply_markup: JSON.stringify(replyMarkup),
  });
});

const channelId = 1;
// Таймер видалення з каналу
function scheduleMessageDeletion(chatId, messageId, delay) {
  setTimeout(() => {
    bot.deleteMessage(chatId, messageId);
  }, delay);
}
bot.sendMessage(channelId, "Текст повідомлення").then((sentMessage) => {
  const messageId = sentMessage.message_id;
  const delay = 60 * 60 * 1000; // 1 година

  scheduleMessageDeletion(channelId, messageId, delay);
});

function deleteNewsAndCompetitions(channelId, messages) {
  const delay = 24 * 60 * 60 * 1000; // 24 години

  messages.forEach((message) => {
    scheduleMessageDeletion(channelId, message.message_id, delay);
  });
}
const newsAndCompetitions = [
  { message_id: 1, text: "Перше повідомлення" },
  { message_id: 2, text: "Друге повідомлення" },
];

deleteNewsAndCompetitions(channelId, newsAndCompetitions);

//пересилання постів у кілька каналів і обмеження кількості публікацій постів у день
const targetChannels = ["channel1", "channel2", "channel3"];
function sendPostToChannels(post) {
  targetChannels.forEach((channel) => {
    bot.sendMessage(channel, post);
  });
}
// Приклад пересилання посту
const post = "Це новий пост!";
const maxPostsPerDay = 10;

sendPostToChannels(post);
let postsPublishedToday = 0;
if (postsPublishedToday < maxPostsPerDay) {
  sendPostToChannels(post);
  postsPublishedToday++;
} else {
  console.log("Досягнуто максимальної кількості публікацій у день.");
}
function resetPostsCounter() {
  const now = new Date();
  const nextDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  const timeUntilNextDay = nextDay.getTime() - now.getTime();

  setTimeout(() => {
    postsPublishedToday = 0;
    resetPostsCounter();
  }, timeUntilNextDay);
}

resetPostsCounter();

//Редагування медіа

async function resizeImage(imagePath, width, height) {
  const image = await Jimp.read(imagePath);
  await image.resize(width, height).writeAsync(imagePath);
}

//Редагування тексту
function editText(text) {
  return text.toUpperCase();
}

//Додавання водяних знаків
Jimp.read("шлях_до_оригінального_зображення")
  .then((image) => {
    return Jimp.read("шлях_до_водяного_знаку").then((watermark) => {
      image.composite(watermark, x, y, options);
      return image.write("шлях_до_нового_зображення");
    });
  })
  .catch((err) => {
    console.error(err);
  });

// Функція для надсилання звітності у канал
function sendReportToChannel(channelId, report) {
  bot.sendMessage(channelId, report);
}


bot.startPolling();
