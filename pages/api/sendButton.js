const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN; // 環境変数に設定
const CHANNEL_ID = process.env.SLACK_CHANNEL_ID;     // 特定のチャンネルIDを環境変数に設定

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Slack APIにリクエスト
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${SLACK_BOT_TOKEN}`
      },
      body: JSON.stringify({
        channel: CHANNEL_ID,
        text: "作業が終わったら「完了」を押してください👇",
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "作業が終わったら「完了」を押してください👇"
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": { "type": "plain_text", "text": "完了" },
                "action_id": "button_done",
                "style": "primary",
                "value": "done"
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    return res.status(200).json({ success: true, message: "ボタン付きメッセージを送信しました" });
  } catch (error) {
    console.error("Slack送信エラー:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
