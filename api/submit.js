import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST 요청만 허용됩니다.' });
  }

  try {
    // 1. 구글 시트 객체 생성 (시트 ID는 기존처럼 환경변수에서 가져옴)
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    // 2. Vercel 환경 변수에 저장한 이메일과 키를 불러옵니다.
    // .replace(/\\n/g, '\n')는 줄바꿈 기호를 실제 줄바꿈으로 바꿔주는 필수 코드입니다.
    const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const private_key = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    // 3. 인증 실행
    await doc.useServiceAccountAuth({
      client_email,
      private_key,
    });

    // 4. 정보 로드 및 시트 선택
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // 5. 데이터 받기
    const { date, name, gender, worship, cell, phone, birthday, note } = req.body;

    // 6. 데이터 추가
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

    return res.status(200).json({ success: true, message: '성공적으로 기록되었습니다.' });

  } catch (error) {
    console.error('환경 변수 방식 에러:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      detail: "환경 변수 인증 중 오류가 발생했습니다."
    });
  }
}