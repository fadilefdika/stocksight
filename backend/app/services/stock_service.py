from datetime import datetime, timedelta
from fastapi import HTTPException, Request
import json
import traceback
import numpy as np
import yfinance as yf

async def fetch_stock_data(symbol: str, redis, model, request: Request):
    scaler = request.app.state.scaler

    # Cek cache Redis
    cached_data = await redis.get(symbol)
    if cached_data:
        return json.loads(cached_data)

    # Ambil data dari yfinance
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period="90d")
    if hist.empty:
        raise HTTPException(status_code=404, detail="Stock data not found")
    if len(hist) < 60:
        raise HTTPException(status_code=400, detail="Not enough data to predict")

    # Ambil data terbaru
    latest = hist.iloc[-1]
    latest_data = {
        "symbol": symbol,
        "date": str(latest.name.date()),
        "open": round(latest["Open"], 2),
        "high": round(latest["High"], 2),
        "low": round(latest["Low"], 2),
        "close": round(latest["Close"], 2),
        "volume": int(latest["Volume"])
    }

    # Prediksi harga
    try:
        features = ["Open", "High", "Low", "Close", "Volume"]
        last_60 = hist[features].values[-60:]
        scaled_input = scaler.transform(last_60)
        input_array = np.array(scaled_input).reshape(1, 60, 5)

        prediction = model.predict(input_array)
        pred_scaled = prediction[0][0]

        # Inverse transform hanya untuk kolom Close (indeks 3)
        dummy = np.zeros((1, 5))
        dummy[0][3] = pred_scaled
        inversed = scaler.inverse_transform(dummy)
        predicted_close = float(inversed[0][3])

        print("Prediction:", pred_scaled)
        print("Predicted Close (inversed):", predicted_close)

    except Exception as e:
        print("❌ Prediction error:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Prediction failed")

    # Tentukan tanggal prediksi = hari setelah data terbaru
    prediction_date = datetime.strptime(latest_data['date'], "%Y-%m-%d") + timedelta(days=1)

    # Buat hasil akhir
    result = {
        "latest": latest_data,
        "predicted": {
            "date": prediction_date.strftime("%Y-%m-%d"),
            "price": predicted_close
        }
    }

    # Cache ke Redis selama 1 jam
    await redis.set(symbol, json.dumps(result), ex=3600)

    return result
