// api/submit.js
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import keys from '../secret-key.json'; // 설정하신 파일명 확인

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST 요청만 허용됩니다.' });
  }

  try {
    // 1. 서비스 계정 인증 (열쇠 사용)
    const serviceAccountAuth = new JWT({
      email: keys.client_email,
      key: keys.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // 2. 구글 시트 연결
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

    // 3. 시트 정보 로드 및 첫 번째 탭 선택
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // 4. 앱(App.jsx)에서 보낸 데이터 받아오기
    // 성별, 예배참여, 샘참여 등의 항목을 추가로 받아옵니다.
    const { date, name, gender, worship, cell, phone, birthday, note } = req.body;

    // 5. [마법의 한 줄] 시트 헤더와 매칭하여 데이터 추가
    // '순번'은 시트에서 수식으로 처리하거나 비워둘 수 있어 여기서는 제외했습니다.
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
    console.error('에러 상세:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}