import { GoogleSpreadsheet } from 'google-spreadsheet';
import keys from '../secret-key.json'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST 요청만 허용됩니다.' });
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    // [중요] private_key의 줄바꿈 문자가 깨졌을 경우를 대비해 처리합니다.
    const formattedPrivateKey = keys.private_key.replace(/\\n/g, '\n');

    await doc.useServiceAccountAuth({
      client_email: keys.client_email,
      private_key: formattedPrivateKey, // 수정된 키 사용
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const { date, name, gender, worship, cell, phone, birthday, note } = req.body;

    await sheet.addRow({
      "날짜": date || new Date().toLocaleDateString('ko-KR'),
      "이름": name,
      "성별": gender,
      "예배참여": worship,
      "샘참여": cell,
      "폰번호": phone,
      "생일": birthday,
      "비고": note
    });

    return res.status(200).json({ success: true, message: '기록 완료!' });
  } catch (error) {
    console.error('서버 에러 상세:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}