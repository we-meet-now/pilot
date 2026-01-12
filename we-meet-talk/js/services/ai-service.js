/**
 * AI Service
 * Google Gemini API를 사용하여 장소를 추천하는 서비스
 */

const AIService = {
    /**
     * 장소 추천 요청
     * @param {string} meetingType - 모임 타입 (예: "스터디 모임", "데이트")
     * @param {string} location - 지역 또는 좌표 (예: "강남역", "37.5,127.0")
     * @param {string} time - 시간 (예: "19:00")
     * @returns {Promise<Array>} - 추천 장소 리스트
     */
    async getRecommendations(meetingType, location, time) {
        if (!AI_CONFIG.API_KEY || AI_CONFIG.API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            console.warn('AI API Key is missing');
            // 키가 없을 경우를 대비한 Fallback (기존 Mock 데이터와 유사하게 반환 가능하지만, 여기서는 에러 처리)
            throw new Error('API_KEY_MISSING');
        }

        const prompt = `
            너는 센스있는 모임 장소 추천 전문가야.
            다음 조건에 맞는 장소 3곳을 추천해줘.
            
            [조건]
            - 모임 성격: ${meetingType}
            - 위치: ${location} 근처
            - 시간: ${time || '시간 미정'}

            [출력 형식]
            반드시 아래 JSON 형식으로만 답변해줘. 마크다운이나 다른 설명은 절대 포함하지 마.
            [
                {
                    "name": "장소명",
                    "address": "대략적인 주소 (동/구 단위)",
                    "reason": "한줄 추천 이유 (분위기, 특징 등)"
                }
            ]
        `;

        try {
            // v1beta 로 복귀 (Gemini 1.5 지원)
            // 초기 시도 모델
            let currentModel = AI_CONFIG.MODEL;
            const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models`;

            const makeRequest = async (modelName) => {
                const url = `${baseUrl}/${modelName}:generateContent?key=${AI_CONFIG.API_KEY}`;
                console.log('DEBUG AI URL:', url);

                return fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });
            };

            let response = await makeRequest(currentModel);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error Details:', errorData);

                // 404 또는 503 에러 시: 사용 가능한 모델을 찾아 순차적으로 재시도
                if (response.status === 404 || response.status === 503 || response.status === 500) {
                    console.log(`🚀 API Error (${response.status}): Attempting to discover and use available models...`);

                    try {
                        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${AI_CONFIG.API_KEY}`;
                        const listResp = await fetch(listUrl);
                        const listData = await listResp.json();

                        console.log('✅ AVAILABLE MODELS:', listData);

                        // 생성(generateContent)이 가능한 모델 찾기 (gemini 포함)
                        // 우선순위: gemini-1.5 > gemini-2.0 > flash > pro
                        let validModels = listData.models?.filter(m =>
                            m.name.includes('gemini') &&
                            m.supportedGenerationMethods?.includes('generateContent')
                        ) || [];

                        // 모델명만 추출 ("models/" 제거)
                        validModels = validModels.map(m => m.name.replace('models/', ''));

                        console.log('📋 Candidate Models:', validModels);

                        if (validModels.length === 0) {
                            throw new Error('No compatible Gemini model found in the list');
                        }

                        // 순차적으로 재시도
                        let successResponse = null;

                        for (const modelName of validModels) {
                            console.log(`♻️ Retrying with model: ${modelName}...`);
                            try {
                                const retryResp = await makeRequest(modelName);
                                if (retryResp.ok) {
                                    console.log(`🎉 Success with model: ${modelName}`);
                                    successResponse = retryResp;
                                    break; // 성공하면 루프 종료
                                } else {
                                    console.warn(`⚠️ Failed with ${modelName} (${retryResp.status})`);
                                }
                            } catch (retryErr) {
                                console.warn(`⚠️ Request error with ${modelName}:`, retryErr);
                            }
                        }

                        if (successResponse) {
                            response = successResponse;
                        } else {
                            throw new Error('All discovered models failed');
                        }

                    } catch (e) {
                        console.error('❌ Auto-discovery and retry failed:', e);
                        throw new Error(`API Request Failed: ${response.status} - ${errorData.error?.message || 'Unknown Error'}`);
                    }
                } else {
                    throw new Error(`API Request Failed: ${response.status} - ${errorData.error?.message || 'Unknown Error'}`);
                }
            }

            const data = await response.json();

            // 응답 파싱
            const textResponse = data.candidates[0].content.parts[0].text;

            // JSON 문자열만 추출 (혹시 모를 마크다운 제거)
            const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(jsonStr);

        } catch (error) {
            console.error('AI Recommendation Error:', error);
            throw error;
        }
    }
};
