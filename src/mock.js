'use strict';

const server = require('./page/server');

const data = `{"id":9,"card_uid":"01010310660d0a0c",
  "card_type":3,"created_at":"2018-01-03T23:57:04.966+09:00",
  "updated_at":"2018-01-03T23:57:04.966+09:00",
  "url":"http://localhost:3000/punch_logs/9.json",
  "user_name":"Jerry Lee",
  "slack_url":"https://hooks.slack.com/services/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",
  "slack_room_id":"felica-punch","slack_name":"jerrywdlee","description":"Lee Suica"}`;

setInterval(() => {
  server.emit(data)
}, 10000);
