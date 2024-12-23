function dummy() {
    const fetchDummyData = () => {
        const generateRandomData = () => {
            const data = [];

            // 수도권 중심 좌표
            const sudogwonCenters = [
                { lat: 37.5665, lng: 126.978 }, // 서울
                { lat: 37.3942, lng: 127.111 }, // 성남
                { lat: 37.4563, lng: 126.705 }, // 인천
                { lat: 37.4563, lng: 127.206 }, // 용인
            ];

            // 강원도 중심 좌표
            const gangwonCenters = [
                { lat: 37.8813, lng: 127.7298 }, // 춘천
                { lat: 37.641, lng: 128.392 }, // 강릉
                { lat: 38.207, lng: 128.591 }, // 속초
                { lat: 37.446, lng: 128.226 }, // 원주
            ];

            // 전라도 중심 좌표
            const jeollaCenters = [
                { lat: 35.8242, lng: 127.148 }, // 전주
                { lat: 34.761, lng: 127.662 }, // 순천
                { lat: 34.989, lng: 126.715 }, // 목포
                { lat: 35.412, lng: 126.919 }, // 광주
            ];

            // 경상도 중심 좌표
            const gyeongsangCenters = [
                { lat: 35.8714, lng: 128.601 }, // 대구
                { lat: 35.1796, lng: 129.0756 }, // 부산
                { lat: 35.539, lng: 129.311 }, // 울산
                { lat: 36.332, lng: 128.337 }, // 안동
            ];

            // 데이터 생성 함수
            const createData = (centers, count, weightRange) => {
                centers.forEach((center) => {
                    for (let i = 0; i < count; i++) {
                        const randomLat = center.lat + (Math.random() - 0.5) * 0.05;
                        const randomLng = center.lng + (Math.random() - 0.5) * 0.05;
                        const randomWeight = Math.floor(Math.random() * (weightRange.max - weightRange.min)) + weightRange.min;
                        data.push({
                            location: new window.google.maps.LatLng(randomLat, randomLng),
                            weight: randomWeight,
                        });
                    }
                });
            };

            // 각 지역의 데이터 생성
            createData(sudogwonCenters, 50, { min: 10, max: 40 }); // 수도권 (좋음)
            createData(gangwonCenters, 50, { min: 20, max: 50 }); // 강원도 (양호)
            createData(jeollaCenters, 50, { min: 40, max: 70 }); // 전라도 (보통)
            createData(gyeongsangCenters, 50, { min: 60, max: 90 }); // 경상도 (나쁨)

            return data;
        };

        const randomData = generateRandomData(); // 랜덤 데이터 생성
        return randomData;
    };

    return fetchDummyData();
}

export default dummy;
