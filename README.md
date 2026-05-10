# Taiwan Stock Game (TWSTOCKGAME)

台灣股票購買遊戲 - 與其他玩家競爭看誰能賺最多！

## 功能特點

✅ **真實股票數據**
- 台灣50大上市公司股票
- 開盤時間使用真實股價
- 關盤後使用智能模擬數據

✅ **完整交易系統**
- 買入/賣出功能
- 自動計算手續費
- 交易歷史記錄
- 即時投資組合更新

✅ **K線圖分析**
- 每隻股票完整K線數據
- 支持多時期查看
- 技術分析工具

✅ **全球排行榜**
- 實時排名系統
- 獲利對比
- 個人統計數據

✅ **進度保存**
- 用戶賬戶系統
- 自動保存投資組合
- 交易歷史永久記錄

## 遊戲規則

- **初始資金**: 新台幣 100 萬元
- **手續費**: 0.1425% (與台灣實際交易相同)
- **遊戲時間**: 台灣股市營業時間 09:00-13:30
- **競爭目標**: 與其他玩家競爭誰能累積最多財富

## 技術棧

### 後端
- Node.js + Express
- MongoDB
- Socket.IO (實時更新)
- JWT 認證

### 前端
- React + TypeScript
- Redux (狀態管理)
- Chart.js / ECharts (K線圖)
- Tailwind CSS (樣式)

## 安裝

### 後端安裝

```bash
npm install
cp .env.example .env
# 編輯 .env 文件配置 MongoDB 和 JWT
npm run dev
```

### 前端安裝

```bash
cd client
npm install
npm start
```

## API 文檔

### 認證
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登錄
- `GET /api/auth/me` - 獲取當前用戶信息

### 股票
- `GET /api/stocks` - 獲取所有台灣50股票
- `GET /api/stocks/:symbol` - 獲取單一股票信息
- `GET /api/stocks/:symbol/kline` - 獲取K線數據

### 投資組合
- `GET /api/portfolio` - 獲取用戶投資組合
- `GET /api/portfolio/stats` - 獲取資產統計

### 交易
- `POST /api/trades/buy` - 買入股票
- `POST /api/trades/sell` - 賣出股票
- `GET /api/trades/history` - 獲取交易歷史

### 排行榜
- `GET /api/leaderboard` - 獲取全球排行榜
- `GET /api/leaderboard/user/stats` - 獲取用戶排名和統計

## WebSocket 事件

- `stock-update` - 股票價格更新
- `market-simulation` - 市場模擬數據
- `portfolio-update` - 投資組合更新
- `leaderboard-update` - 排行榜更新

## 市場開盤時間

台灣股票交易所營業時間：
- 週一至週五
- 上午 09:00 - 中午 13:30
- 國定假日休市

## 數據更新邏輯

- **開盤時間（09:00-13:30）**: 使用真實 TWSE API 股票數據
- **關盤時間（13:30-09:00 隔天）**: 使用模擬數據，基於關盤前的真實股價進行隨機波動
- **更新頻率**: ���分鐘更新一次

## 許可證

MIT

## 作者

CPMRm
