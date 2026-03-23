# Composables для чатов

Набор переиспользуемых composables для экранов чатов, профиля и floating chat.

## useChatMessages

Управляет загрузкой и отправкой сообщений.

Пример:

```js
const {
   loading,
   isSending,
   loadMessages,
   sendChatMessage,
   groupedMessages,
   hasMessages
} = useChatMessages()
```

Основные методы:

- `loadMessages(currentChat, toUserId)` — загрузка сообщений диалога.
- `sendChatMessage({ message, files, currentChat, toUserId, selectedTopic, onSuccess, onError })` — отправка сообщения.

## useChatScroll

Отвечает за прокрутку чата и поведение списка сообщений.

Пример:

```js
const { scrollToBottom, isAtBottom } = useChatScroll(chatContainerRef, inputRef)
```

Основные методы:

- `scrollToBottom({ force, smooth })` — прокрутка вниз.
- `scrollToMessage(messageId, smooth)` — прокрутка к конкретному сообщению.
- `updateIsAtBottom()` — обновление состояния «пользователь внизу списка».

## useFileUpload

Работает с прикреплёнными файлами и валидацией.

Пример:

```js
const {
   files,
   addFiles,
   removeFile,
   clearFiles,
   isImage,
   getFilePreview,
   handleFileChange
} = useFileUpload()
```

Особенности:

- валидация размера файлов;
- валидация типа;
- очистка preview URL;
- ограничение количества вложений.

## useDragAndDrop

Обрабатывает drag and drop файлов.

Пример:

```js
const {
   isDragging,
   handleDragEnter,
   handleDragOver,
   handleDragLeave,
   handleDrop
} = useDragAndDrop((files) => {
   addFiles(files)
})
```

## useChatUtils

Небольшие утилиты форматирования для чатов.

Основные методы:

- `formatTime(dateString)` — форматирование времени;
- `formatMessageDate(dateString)` — форматирование даты разделителя;
- `getMessageKey(message, index)` — стабильный ключ сообщения.
