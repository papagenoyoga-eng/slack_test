const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = JSON.parse(req.body.payload);
    const actionId = payload.actions[0].action_id;
    const user = payload.user.username;
    const channel = payload.channel.id;

    let message = '';
    if (actionId === 'button_done') {
      message = `✅ ${user} さんが「完了」を押しました！`;
    } else if (actionId === 'button_stop') {
      message = `🛑 ${user} さんが「停止」を押しました！`;
    }

    await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${SLACK_BOT_TOKEN}`
      },
      body: JSON.stringify({ channel, text: message })
    });

    return res.status(200).send();
  } catch (error) {
    console.error("Slackボタン処理エラー:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
