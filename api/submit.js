import { GoogleSpreadsheet } from 'google-spreadsheet';
import keys from '../secret-key.json'; 

export default async function handler(req, res) {
  // 1. POST 요청인지 확인
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST 요청만 허용됩니다.' });
  }

  try {
    // 2. 구글 시트 객체 생성 (환경 변수 사용)
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    // 3. 서비스 계정 인증 (가장 중요한 부분!)
    // secret-key.json의 정보를 사용하여 인증을 초기화합니다.
    await doc.useServiceAccountAuth({
      client_email: keys.client_email,
      private_key: keys.private_key,
    });

    // 4. 시트 정보 로드 및 첫 번째 탭 선택
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // 5. 앱(App.jsx)에서 보낸 데이터 받아오기
    const { date, name, gender, worship, cell, phone, birthday, note } = req.body;

    // 6. 시트 헤더와 매칭하여 데이터 추가
    // '순번'은 시트 자체 수식으로 처리하는 것이 좋으므로 제외했습니다.
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
    // 어떤 에러인지 프론트엔드(App.jsx)에서도 알 수 있게 메시지를 보냅니다.
    return res.status(500).json({ success: false, error: error.message });
  }
}