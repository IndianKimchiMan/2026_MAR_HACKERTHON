/**
 * LLM 서비스 레이어
 * ChatInterface와 실제 LLM API 호출 로직을 분리하는 서비스 모듈
 *
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4
 */

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

/**
 * 키워드 기반 mock 응답 생성
 */
function getMockResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('수강') || lower.includes('강의') || lower.includes('과목')) {
    return '수강 신청 관련 문의는 학교 포털(portal.hanyang.ac.kr)에서 확인하실 수 있습니다. 수강 신청 기간, 정정 기간 등 일정은 학사일정 페이지를 참고해 주세요.';
  }

  if (lower.includes('시간표')) {
    return '시간표 관련 정보는 학교 포털에서 확인하실 수 있습니다. 원하시는 강의의 시간표를 조회하거나 수강 신청 시 시간 충돌 여부를 확인해 보세요.';
  }

  if (lower.includes('학식') || lower.includes('메뉴') || lower.includes('식당')) {
    return '오늘의 학식 메뉴는 사이드바의 "오늘의 메뉴" 버튼을 클릭하시면 확인하실 수 있습니다.';
  }

  if (lower.includes('학사') || lower.includes('일정')) {
    return '학사일정은 사이드바의 "학사일정" 버튼을 클릭하시면 한양대학교 공식 학사일정 페이지로 이동합니다.';
  }

  if (lower.includes('시설') || lower.includes('대관') || lower.includes('강의실')) {
    return '시설 대관 신청은 사이드바의 "시설대관" 버튼을 클릭하시면 신청 페이지로 이동합니다.';
  }

  if (lower.includes('포털') || lower.includes('로그인')) {
    return '학교 포털은 사이드바의 "학교포털" 버튼을 클릭하시면 이동합니다. 포털에서 수강 신청, 성적 조회 등 다양한 서비스를 이용하실 수 있습니다.';
  }

  return '안녕하세요! HY-Planner입니다. 수강 신청, 시간표, 학사일정, 시설 대관 등 한양대학교 생활에 관한 질문을 도와드릴 수 있습니다. 무엇이 궁금하신가요?';
}

/**
 * LLM 서비스 단일 공개 인터페이스
 *
 * - VITE_LLM_API_KEY 환경변수가 없으면 mock 응답 반환 (Req 6.3)
 * - 있으면 실제 OpenAI API 호출 (Req 6.1, 6.2)
 * - async/await 비동기 방식으로 UI 블로킹 방지 (Req 6.4)
 */
export async function sendMessage(message: string, profileSummary?: string): Promise<string> {
  const apiKey = import.meta.env.VITE_LLM_API_KEY;

  if (!apiKey) {
    return getMockResponse(message);
  }

  const systemPrompt = [
    '당신은 한양대학교 학생들을 위한 AI 어시스턴트 HY-Planner입니다. 수강 신청, 학사일정, 시설 이용 등 학교 생활 전반에 대해 도움을 드립니다.',
    profileSummary && profileSummary !== '프로필 미입력'
      ? `\n\n[사용자 정보] ${profileSummary}`
      : '',
  ].join('');

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: message },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API 오류: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== 'string') {
    throw new Error('API 응답 형식이 올바르지 않습니다.');
  }

  return content;
}
