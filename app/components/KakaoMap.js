'use client';

import Header from '../header';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // dynamic import 추가

const KakaoMap = () => {
    const [map, setMap] = useState(null);
    const [bikeStations, setBikeStations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 클라이언트 사이드에서만 카카오 지도 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.978), 
                    level: 3,
                };
                const createdMap = new window.kakao.maps.Map(container, options);
                setMap(createdMap);
            });
        };
    }, []);

    const fetchAllBikeStations = async () => {
        setIsLoading(true);
        try {
            const responses = await Promise.all([
                fetch('http://openapi.seoul.go.kr:8088/757a4f6f476265653330745a755265/json/bikeList/1/1000', { cache: 'no-store' }),
                fetch('http://openapi.seoul.go.kr:8088/757a4f6f476265653330745a755265/json/bikeList/1001/2000', { cache: 'no-store' }),
                fetch('http://openapi.seoul.go.kr:8088/757a4f6f476265653330745a755265/json/bikeList/2001/3000', { cache: 'no-store' }),
            ]);

            const dataPromises = responses.map(response => response.json());
            const allData = await Promise.all(dataPromises);

            const allStations = allData.flatMap(data => data.rentBikeStatus.row);
            setBikeStations(allStations);
        } catch (error) {
            console.error('API 호출 오류', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 데이터가 로드되면 따릉이 마커 표시
    useEffect(() => {
        if (map && bikeStations.length > 0) {
            bikeStations.forEach(station => {
                const position = new window.kakao.maps.LatLng(station.stationLatitude, station.stationLongitude);
                const marker = new window.kakao.maps.Marker({
                    position: position,
                    map: map,
                });
            });
        }
    }, [map, bikeStations]);

    useEffect(() => {
        fetchAllBikeStations();
    }, []);

    return (
        <>
            <Header />
            <div id="map" style={{ width: '100%', height: '400px' }}></div>
            {isLoading && <div>로딩 중...</div>}
        </>
    );
};

export default dynamic(() => Promise.resolve(KakaoMap), { ssr: false });