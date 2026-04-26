import os
import re
import urllib.request
import json
from datetime import datetime, timedelta, timezone

# --- 設定 ---
# 気象庁APIから滋賀県（彦根）の予報を取得し、竜王町の近似値として使用
WEATHER_API_URL = "https://www.jma.go.jp/bosai/forecast/data/forecast/250000.json"
HTML_FILE_PATH = "next-gen-farm-ai-report.html"

# --- 辻澤氏の「現場の暗黙知」ロジック ---
def calculate_directive(forecast_temp, weather_str):
    # ターゲット適温
    target_min, target_max = 20, 25
    
    # 天候による「温室効果」の加算（快晴+25, 曇天+8, 雨天+1）
    if "晴" in weather_str:
        greenhouse_effect = 25
        weather_type = "快晴・晴れ"
    elif "雨" in weather_str or "雪" in weather_str:
        greenhouse_effect = 1
        weather_type = "雨天"
    else:
        greenhouse_effect = 8
        weather_type = "曇天"

    predicted_max_internal_temp = forecast_temp + greenhouse_effect

    # 換気（開放度）の計算とリスク評価
    if predicted_max_internal_temp >= 30:
        risk_level = "高（徒長・高温障害の危険大）"
        open_percent = min(100, int(((predicted_max_internal_temp - target_max) / greenhouse_effect) * 100) + 10) # 安全マージン+10%
        directive_text = f"本日は日射による急激なハウス内温度上昇が予測されます（密閉時推定 {predicted_max_internal_temp}℃）。目標温度{target_min}〜{target_max}℃を死守するため、側面・換気口の【{open_percent}%開放】をただちに実施してください。"
    elif predicted_max_internal_temp > 25:
        risk_level = "中"
        open_percent = int(((predicted_max_internal_temp - target_max) / greenhouse_effect) * 100)
        directive_text = f"本日は穏やかな温度上昇が見込まれます。目標温度{target_min}〜{target_max}℃を維持するため、側面・換気口を【{open_percent}%開放】して微調整を行ってください。"
    else:
        risk_level = "低（低温注意）"
        open_percent = 0
        directive_text = f"本日は温度が上がりきらない予報です（推定 {predicted_max_internal_temp}℃）。保温を最優先とし、ハウスは【密閉（0%開放）】を維持してください。"

    return open_percent, risk_level, directive_text

# --- メイン処理 ---
def update_html():
    try:
        # 1. 天気予報の取得
        req = urllib.request.Request(WEATHER_API_URL)
        with urllib.request.urlopen(req) as res:
            weather_data = json.loads(res.read())
            
        # 今日の天気と最高気温を抽出（※気象庁APIの構造に基づく）
        today_weather = weather_data[0]['timeSeries'][0]['areas'][0]['weatherCodes'][0] # 天気コード(ここでは簡易的に晴れを想定して処理を進めます。本来はコード変換が必要ですが、今回はデモとして固定値か簡易判定を入れます)
        # 簡易的に文字列から判定するため、文字情報を取得
        today_weather_str = weather_data[0]['timeSeries'][0]['areas'][0]['weathers'][0]
        # 最高気温
        today_max_temp_str = weather_data[0]['timeSeries'][2]['areas'][0]['temps'][1] # 日中の最高気温
        
        try:
             today_max_temp = int(today_max_temp_str)
        except ValueError:
             today_max_temp = 20 # 取得失敗時のデフォルト

        # 2. ロジックによる計算
        open_percent, risk_level, directive_text = calculate_directive(today_max_temp, today_weather_str)

        # 3. HTMLファイルの読み込み
        with open(HTML_FILE_PATH, 'r', encoding='utf-8') as f:
            html_content = f.read()

        # 4. HTMLの書き換え（正規表現で対象箇所を置換）
        # JSTの日付
        JST = timezone(timedelta(hours=+9), 'JST')
        today_date = datetime.now(JST).strftime("%Y-%m-%d")
        display_date = datetime.now(JST).strftime("%Y年%m月%d日")
        
        # HTMLの該当箇所を書き換える（※実際のHTML構造に合わせて調整が必要な場合があります）
        html_content = re.sub(r'<div id="report-date".*?>.*?</div>', f'<div id="report-date" class="text-xl font-bold">{display_date}</div>', html_content, flags=re.DOTALL)
        html_content = re.sub(r'<span id="forecast-temp".*?>.*?</span>', f'<span id="forecast-temp" class="text-xl font-bold">{today_max_temp}℃</span>', html_content, flags=re.DOTALL)
        html_content = re.sub(r'<span id="forecast-weather".*?>.*?</span>', f'<span id="forecast-weather">{today_weather_str}</span>', html_content, flags=re.DOTALL)
        html_content = re.sub(r'<div id="ai-directive-text".*?>.*?</div>', f'<div id="ai-directive-text" class="text-sm text-slate-700 leading-relaxed"><span class="font-bold text-slate-900 bg-amber-100 px-1 rounded mr-1">AI</span>{directive_text}</div>', html_content, flags=re.DOTALL)

        # 5. HTMLファイルの上書き保存
        with open(HTML_FILE_PATH, 'w', encoding='utf-8') as f:
            f.write(html_content)
            
        print(f"✅ HTML updated successfully: Temp={today_max_temp}℃, Weather={today_weather_str[:5]}..., Open={open_percent}%")

    except Exception as e:
        print(f"❌ Error updating HTML: {e}")

if __name__ == "__main__":
    update_html()
# --- ここから下を最後に追加 ---
import os
import urllib.request
import json

def send_line_notify(message):
    token = os.environ.get("LINE_CHANNEL_ACCESS_TOKEN", "").strip()
    user_id = os.environ.get("LINE_USER_ID", "").strip()
    
    if not token or not user_id:
        print("LINE credentials not found. Skipping LINE notification.")
        return

    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    data = {
        "to": user_id,
        "messages": [{"type": "text", "text": message}]
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req) as res:
            print("LINE notification sent successfully.")
    except Exception as e:
        print(f"Failed to send LINE notification: {e}")

# レポート完成後にLINEへ通知
dashboard_url = "https://takayuki-aidriven.github.io/aquatic-rice-field/next-gen-farm-ai-report.html"
line_message = f"【竜王AI司令室】\n本日のAI現場指令が更新されました。\n\n▼最新のダッシュボードを確認\n{dashboard_url}"
send_line_notify(line_message)
