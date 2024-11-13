"use client";

import React, { useEffect, useState } from "react";

const test = () => {
    const [bikeData, setBikeData] = useState([]);
    const [testData, setTestData] = useState('props테스트');

    useEffect(() => {
        // 서울 자전거 API에서 데이터 가져오기
        const fetchBikeData = async () => {
            try {
                const response = await fetch("https://www.bikeseoul.com/app/station/getStationRealtimeStatus.do");
                const data = await response.json();

                // 데이터를 상태에 저장
                setBikeData(data);

                // 콘솔에 출력
                console.log("자전거 데이터:", data);
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };
        fetchBikeData();
    }, []);
    return (
        <div>
            <h1>카카오1 맵</h1>
            {/* 여기서 카카오 맵을 표시하는 코드 추가 */}
            {/* 자전거 데이터도 필요한 곳에서 사용할 수 있습니다. */}
        </div>
    );
};

const test2 = () => {
    
}

export default KakaoMap;