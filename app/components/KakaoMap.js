'use client'; // 클라이언트 컴포넌트로 설정
import Header from '../header'
import { useEffect, useState } from 'react';

const KakaoMap = () => {
    const [map, setMap] = useState(null); // 지도 상태
    const [marker, setMarker] = useState(null); // 마커 상태
    const [currentMarker, setCurrentMarker] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null); // 현재 위치 저장
    const [bikeStations, setBikeStations] = useState([]); // 따릉이 저장소 데이터 상태
    const [bikeMarker, setBikeMarker] = useState([]); // 따릉이 마커
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [isActive, setIsActive] = useState(false); // 대여소정보 info
    const [nameBox, setNameBox] = useState('');
    const [quantityBox, setQuantityBox] = useState();
    const [inputValue, setInputValue] = useState(''); // header에서 가져오는 props


    const moveToStation = (station) => {
        const stationPosition = new window.kakao.maps.LatLng(station.stationLatitude, station.stationLongitude)
        map.setCenter(stationPosition);
        setIsActive(true);
        setNameBox(station.stationName);
        setQuantityBox(station.parkingBikeTotCnt);
    }   

    const searchAuto = () => {
        const inputSearch = document.querySelector('.auto-lists');

        if (inputValue.trim() === '' || inputValue.trim().length < 2) {
            inputSearch.innerHTML = '';
            return;
        }

        const matchingStation = bikeStations.filter((station) => 
            station.stationName.includes(inputValue)
        )

        if (matchingStation.length > 0) {
            const htmlComponet = matchingStation
                .map( (el) => 
                    `<li data-bikeName="${el.stationName}">${el.stationName}</li>`)
                .join('')
                

            inputSearch.innerHTML = htmlComponet;

            const searchLists = document.querySelectorAll('.auto-lists > li');
            
            searchLists.forEach((el) => {
                el.addEventListener('click', () => {
                    const bikeName = el.getAttribute('data-bikeName');
                    const clickPosition = bikeStations.find((place) => {
                        return place.stationName === bikeName 
                    })
                    moveToStation(clickPosition);
                })
            })

            // console.log(matchingStation);
        } else {
            console.log('검색 결과가 없습니다.')
        }
    }



    
    // useEffect( () => {
    //     const searchLists = document.querySelectorAll('.auto-lists > li');
    //     searchLists.forEach((el) => {
    //         el.addEventListener('click', () => {
    //             alert('클릭하였습니다.')
    //         })
    //     })
    // }, [inputValue])
    

    useEffect( () => {
        searchAuto();
    }, [inputValue])

    // 따릉이 API 호출 함수
    const fetchAllBikeStations = async () => {
        setIsLoading(true);
        let allStations = []; // 전체 데이터를 저장할 배열

   
        try {
            // 모든 API 호출을 Promise.all로 처리
            const responses = await Promise.all([
                fetch('http://openapi.seoul.go.kr:8088/757a4f6f476265653330745a755265/json/bikeList/1/1000', { cache: 'no-store' }),
                fetch('http://openapi.seoul.go.kr:8088/757a4f6f476265653330745a755265/json/bikeList/1001/2000', { cache: 'no-store' }),
                fetch('http://openapi.seoul.go.kr:8088/757a4f6f476265653330745a755265/json/bikeList/2001/3000', { cache: 'no-store' }),
            ]);

            // 각 응답의 JSON 데이터 파싱
            const dataPromises = responses.map(response => response.json());
            const allData = await Promise.all(dataPromises);

            // 모든 데이터를 합침
            allData.forEach(data => {
                allStations = allStations.concat(data.rentBikeStatus.row);
            });

            console.log(allStations);
            setBikeStations(allStations); // 전체 데이터 저장
        } catch (error) {
            console.error('API 호출 오류', error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        // 카카오 지도 API 로드
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map'); // 지도를 표시할 div
                const options = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울
                    level: 3, // 줌 레벨
                };
                const createdMap = new window.kakao.maps.Map(container, options); // 지도 생성
                setMap(createdMap);


                const firstDiv = container.querySelector('div'); // 첫 번째 자식 div 선택
                if (firstDiv) {
                    firstDiv.remove(); // 첫 번째 div 제거
                }


                
                // Geolocation API를 사용하여 현재 위치 가져오기
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude; // 위도
                            const lon = position.coords.longitude; // 경도

                            const newPosition = new window.kakao.maps.LatLng(lat, lon);
                            setCurrentPosition(newPosition); // 현재 위치 저장
                            createdMap.setCenter(newPosition); // 현재 위치로 지도 중심 변경

                            // 현재 위치에 마커 추가
                            const currentMarker = new window.kakao.maps.Marker({
                                position: newPosition,
                            });
                            // currentMarker.setMap(createdMap);
                            currentMarker.setMap(createdMap);
                            setCurrentMarker(currentMarker);

                            // 수정사항
                            // setMarker(currentMarker);


                        },
                        (error) => {
                            console.error('Geolocation error:', error);
                            alert('현재 위치를 가져오는 데 실패했습니다.');
                        }
                    );
                } else {
                    alert('Geolocation이 지원되지 않는 브라우저입니다.');
                }

                // 따릉이 저장소 정보 가져오기
                fetchAllBikeStations();
            });
        };

    }, []);


    // 따릉이 저장소 마커 표시
    // useEffect2
    useEffect(() => {
        if (map && bikeStations.length > 0) {

            bikeMarker.forEach( marker => marker.setMap(null));
            const newMarkers = [];

            // 지도 줌 레벨 변경 시 이벤트 리스너 추가
            window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
                const currentZoomLevel = map.getLevel();
                console.log('현재 줌 레벨:', currentZoomLevel);

            });

            bikeStations.forEach((station) => {

                // 마커 이미지 설정
                const position = new window.kakao.maps.LatLng(station.stationLatitude,
                     station.stationLongitude);

                // marker-bike 요소 생성
                const markerElement = document.createElement('div');
                markerElement.className = 'marker-bike';
                markerElement.innerHTML = `<p>${station.parkingBikeTotCnt}</p>`;

                // 클릭 이벤트 리스너 추가
                markerElement.addEventListener('click', () => {
                    console.log('marker-bike clicked!', station);
                    console.log(station.stationName);

                    setIsActive(true)


                    // 클릭 한 저장소 저장
                    setNameBox(station.stationName);
                    setQuantityBox(station.parkingBikeTotCnt);
                    console.log(nameBox);

                });
                const customOverlay = new window.kakao.maps.CustomOverlay({
                    position: position,
                    content: markerElement,
                    map: map
                });

                newMarkers.push(customOverlay);
            });

            setBikeMarker(newMarkers)
        }

    }, [map, bikeStations]); // 지도가 생성되었고 따릉이 저장소 데이터가 있을 때 마커 생성

    // 버튼 클릭 시 지도 중심을 현재 위치로 다시 설정하고 최대 확대
    const handleButtonClick = () => {
        if (map && currentPosition) {
            map.relayout(); // 지도의 크기를 재조정
            map.setCenter(currentPosition); // 현재 위치로 지도 중심을 다시 설정
            map.setLevel(1); // 최대 확대
        }
    };

    // 대여소 정보 refresh
    const handleRefreshClick = () => {
        fetchAllBikeStations();
        alert('새로고침 완료')
    }
    
    return (
        <>
            <Header searchAuto={searchAuto} setInputValue={setInputValue}></Header>
            <div className="map-wrap">
                <div id="map" style={{ width: '100%', height: '400px' }}></div>
                <div className={isActive ? "bike-location active" : "bike-location"}>
                    <div className="location-info">
                        <h1>{`${nameBox}`}</h1>
                        <div className="location-close" onClick={ () => {setIsActive(false)}}>
                            <img src="/images/close2.png" alt="" />
                        </div>
                    </div>
                    <div className="location-quantity">
                        <div>
                            <span>일반 따릉이</span>
                            <b>
                                {
                                    `${quantityBox}`
                                }
                            </b>
                        </div>
                    </div>

                </div>
            </div>
            <div className="button-group">
                <button className="current_location" onClick={handleButtonClick}><img src="/images/location.png" alt="" /></button>
                <button className="refresh" onClick={handleRefreshClick}><img src="/images/refresh.png" alt="" /></button>
            </div>

            {isLoading ? (<div className="loading">
                <div className="spinner"></div>
                <div className="loading-text">로드 중...</div>
            </div>) : false}


            {/* <div className="loading">
                <div className="spinner"></div>
                <div className="loading-text">로드 중...</div>
            </div> */}
        </>
    );
};

export default KakaoMap;