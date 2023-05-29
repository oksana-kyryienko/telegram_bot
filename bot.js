const TelegramBot = require("node-telegram-bot-api");
const Vibrant = require("node-vibrant");

const bot = new TelegramBot("5716895097:AAFriyu13C__xRMuLk4dph4S4e-ZMkho_dI", {
  polling: true,
});

const mainMenu = {
  reply_markup: {
    keyboard: [
      ["📚 Інструкції"],
      ["🔗 Посилання"],
      ["📷 Настроїти медіа"],
      ["🖼️ Додати водяний знак"],
      ["💬 Коментарі"],
      ["⏰ Таймер видалення"],
      ["Більше налаштувань"],
      ["🔴 Редагувати кнопки"],
      ["Автопідпис"]
    ],
    resize_keyboard: true,
  },
};

const instructionsMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Інструкція 1", callback_data: "instruction_1" },
        { text: "Інструкція 2", callback_data: "instruction_2" },
      ],
      [{ text: "Назад", callback_data: "back_to_main_menu" }],
    ],
  },
};

const linksMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Посилання 1", url: "http://example.com/link1" },
        { text: "Посилання 2", url: "http://example.com/link2" },
      ],
      [{ text: "Назад", callback_data: "back_to_main_menu" }],
    ],
  },
};

const postEditMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Автопідпис", callback_data: "add_signature" }],
    ],
  },
};

const reactionsMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "❤️", callback_data: "reaction_heart" },
        { text: "😏", callback_data: "reaction_smirk" },
      ],
      [{ text: "Применить", callback_data: "apply_reactions" }],
    ],
  },
};

const reactionMapping = {
  reaction_heart: "👍",
  reaction_smirk: "👎",
};

const editButtonsMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "🔄 Редактировать кнопки", callback_data: "edit_buttons" },
      ],
      [{ text: "Назад", callback_data: "back_to_main_menu" }],
    ],
  },
};


let postReactions = [];

const commentsButton = { text: "💬", callback_data: "reaction_comment" };

const commentsMenu = {
  reply_markup: {
    inline_keyboard: [
      [commentsButton],
      [{ text: "💬 Коментарі", callback_data: "comments" }],
      [{ text: "Примінити", callback_data: "apply_comments" }],
    ],
  },
};

let hasComments = false;
let copyChannels = [];

let mediaPosition = "above";

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Вітаю! Виберіть дію:", mainMenu);
});

bot.onText(/📚 Інструкції/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Оберіть інструкцію:", instructionsMenu);
});

bot.onText(/ Автопідпис/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Автопідпис:", postEditMenu);
});

bot.onText(/🔗 Посилання/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Оберіть посилання:", linksMenu);
});

bot.onText(/📷 Настроїти медіа/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Над текстом", callback_data: "position_above" },
          { text: "Під текстом", callback_data: "position_below" },
        ],
        [{ text: "Реакції", callback_data: "reactions" }],
      ],
    },
  };
  bot.sendMessage(chatId, "Оберіть розташування медіа:", options);
});

bot.onText(/💬 Коментарі/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Оберіть коментарі:", commentsMenu);
});

bot.onText(/⏰ Таймер удалення/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Введіть тривалість таймера (у годинах):");
});

bot.onText(/🖼️ Додати водяний знак/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Відправте фото, до якого потрібно додати водяний знак."
  );
});

bot.onText(/Більше налаштувань/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Виберіть дію:", {
    reply_markup: {
      keyboard: [
        ["📤 Копирование постов"],
      ],
      resize_keyboard: true,
    },
  });
});

bot.onText(/📤 Копіювання постов/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Виберіть канали для копіювання:", {
    reply_markup: {
      keyboard: [
        ["📤 Вибрати всі канали"],
        ["📥 Зняти виділення з усіх каналів"],
        ["✅ Зберегти налаштування"],
      ],
      resize_keyboard: true,
    },
  });
});

bot.onText(/📤 Вибрати всі канали/, (msg) => {
  const chatId = msg.chat.id;
  copyChannels = ["channel1", "channel2", "channel3"];
  bot.sendMessage(chatId, "Всі канали були вибрані для копіювання.");
});

bot.onText(/📥 Зняти виділення з усіх каналів/, (msg) => {
  const chatId = msg.chat.id;
  copyChannels = [];
  bot.sendMessage(chatId, "Виділення з усіх каналів було знято.");
});

bot.onText(/✅ Зберегти налаштування/, (msg) => {
  const chatId = msg.chat.id;
  if (copyChannels.length > 0) {
    bot.sendMessage(chatId, `Канали для копіювання були збережені: ${copyChannels.join(", ")}.`);
    copyPostToChannels(copyChannels);
  } else {
    bot.sendMessage(chatId, "Ви не вибрали жодного каналу для копіювання.");
  }
});

bot.onText(/🔴 Редагувати кнопки/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Виберіть кнопку для редагування:", editButtonsMenu);
});

function handleMediaPosition(chatId, messageId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Над текстом", callback_data: "position_above" },
          { text: "Під текстом", callback_data: "position_below" },
        ],
      ],
    },
  };
  bot.editMessageText("Оберіть розташування медіа:", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: options.reply_markup,
  });
}

function addWatermark(imagePath, watermarkText, callback) {
  Vibrant.from(imagePath)
    .getPalette()
    .then((palette) => {
      const dominantColor = palette.Vibrant.hex;
      const watermarkedImagePath = "path/to/watermarked/image.jpg";
      callback(watermarkedImagePath);
    })
    .catch((error) => {
      console.error("Ошибка при обработке изображения:", error);
      callback(null);
    });
}

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  if (data === "add_signature") {
    bot.answerCallbackQuery(query.id, "Ви обрали додати автопідпис");
    bot.sendMessage(chatId, "Введіть текст автопідпису:");
  }

  if (data.startsWith("select_signature_")) {
    const selectedIndex = parseInt(data.slice(17)); 
    const selectedSignature = getSignatureByIndex(chatId, selectedIndex);

    bot.answerCallbackQuery(query.id, "Ви обрали варіант автопідпису");
  }

  if (data === "edit_buttons") {
    bot.sendMessage(chatId, "Оберіть кнопку для редагування:", editButtonsMenu);
  }

  if (data.startsWith("edit_button_text_")) {
    const buttonText = data.replace("edit_button_text_", "");
    bot.sendMessage(chatId, `Введіть новий текст для кнопки "${buttonText}":`);
  }

  if (data === "reactions") {
    bot.editMessageText("Оберіть реакції:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: reactionsMenu.reply_markup,
    });
  } else if (data.startsWith("reaction_")) {
    const reaction = data.replace("reaction_", "");
    const index = postReactions.indexOf(reaction);

    if (index === -1) {
      postReactions.push(reaction);
    } else {
      postReactions.splice(index, 1);
    }

    const updatedReactionsMenu = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "❤️", callback_data: "reaction_heart" },
            { text: "😏", callback_data: "reaction_smirk" },
          ],
          [{ text: "Применить", callback_data: "apply_reactions" }],
        ],
      },
    };

    if (postReactions.length > 0) {
      updatedReactionsMenu.reply_markup.inline_keyboard.unshift(
        postReactions.map((reaction) => ({
          text: reactionMapping[reaction],
          callback_data: `reaction_${reaction}`,
        }))
      );
    }

    bot.editMessageReplyMarkup(
      {
        inline_keyboard: updatedReactionsMenu.reply_markup.inline_keyboard,
      },
      {
        chat_id: chatId,
        message_id: messageId,
      }
    );
  } else if (data === "apply_reactions") {
    bot.answerCallbackQuery(query.id, "Реакції успішно застосовані");
  }

  if (data === "back_to_main_menu") {
    bot.editMessageText("Виберіть дію:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: mainMenu.reply_markup,
    });
  } else if (data === "instruction_1") {
    // Обробка вибору першої інструкції
    bot.answerCallbackQuery(query.id, "Ви обрали Інструкцію 1");
    handleMediaPosition(chatId, messageId);
  } else if (data === "instruction_2") {
    // Обробка вибору другої інструкції
    bot.answerCallbackQuery(query.id, "Ви обрали Інструкцію 2");
    handleMediaPosition(chatId, messageId);
  } else if (data === "position_above") {
    mediaPosition = "above";
    bot.answerCallbackQuery(query.id, "Медіа буде розташовано над текстом");
  } else if (data === "position_below") {
    mediaPosition = "below";
    bot.answerCallbackQuery(query.id, "Медіа буде розташовано під текстом");
  } else if (data === "comments") {
    bot.editMessageText("Оберіть коментарі:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: commentsMenu.reply_markup,
    });
  } else if (data === "reaction_comment") {
    hasComments = !hasComments;

    const updatedCommentsMenu = {
      reply_markup: {
        inline_keyboard: [
          [commentsButton],
          [{ text: "Применить", callback_data: "apply_comments" }],
        ],
      },
    };

    if (hasComments) {
      updatedCommentsMenu.reply_markup.inline_keyboard.unshift([
        { text: "✅ Коментарі", callback_data: "comments" },
      ]);
    }

    bot.editMessageReplyMarkup(
      {
        inline_keyboard: updatedCommentsMenu.reply_markup.inline_keyboard,
      },
      {
        chat_id: chatId,
        message_id: messageId,
      }
    );
  } else if (data === "apply_comments") {
    bot.answerCallbackQuery(query.id, "Коментарі успішно застосовані");
  }

  if (data === "copy_post") {
    bot.answerCallbackQuery(query.id, "Откроется полный список настроек публикации");
    // Додайте код для відображення повного списку настроек публікації, де можна вибрати канали для копіювання
    const copyPostMenu = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📤 Вибрати всі канали", callback_data: "select_all_channels" },
          ],
          // Додайте інші кнопки або пункти меню за потреби
        ],
      },
    };

    bot.editMessageText("Повний список настроек публікації:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: copyPostMenu.reply_markup,
    });
  }

  if (data === "select_all_channels") {
    // Додайте код для вибору всіх каналів для копіювання
    copyChannels = ["channel1", "channel2", "channel3"]; // Замініть на власну логіку вибору всіх каналів
    bot.answerCallbackQuery(query.id, "Всі канали були вибрані для копіювання");
  }

});

bot.on("photo", (msg) => {
  const photo = msg.photo[0];
  const fileId = photo.file_id;
  const filePath = bot.getFileLink(fileId);

  addWatermark(filePath, "Ваш водяной знак", (watermarkedImagePath) => {
    if (watermarkedImagePath) {
      bot.sendPhoto(msg.chat.id, watermarkedImagePath);
    } else {
      bot.sendMessage(
        msg.chat.id,
        "Виникла помилка при додаванні водяного знака"
      );
    }
  });
});

bot.onText(/(\d+)/, (msg, match) => {
  if (timerDuration === null) {
    timerDuration = parseInt(match[0]);

    if (timerDuration > 0) {
      setTimeout(() => {
        bot.sendMessage(msg.chat.id, "Deleting the post...");
        timerDuration = null;
      }, timerDuration * 3600000);
      bot.sendMessage(msg.chat.id, `Таймер встановлено на ${timerDuration} годин(и).`);
    } else {
      bot.sendMessage(msg.chat.id, "Неприпустима тривалість таймера. Будь ласка, введіть додатнє число.");
      timerDuration = null;
    }
  }
});

bot.onText(/(.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const messageText = match[0];

  if (messageText.startsWith("Введіть новий текст для кнопки")) {
    const buttonText = messageText.replace("Введіть новий текст для кнопки ", "");
    bot.answerCallbackQuery(query.id, `Текст кнопки "${buttonText}" було оновлено`);
  }

});

bot.onText(/\/signature (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const signature = match[1];

  saveSignature(chatId, signature);
  bot.sendMessage(chatId, "Автопідпис додано!");
});

function saveSignature(chatId, signature) {
  //код для збереження автопідпису за chatId
  //база даних для збереження автопідписів
}

