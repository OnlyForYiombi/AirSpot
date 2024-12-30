function dummy() {
    const fetchDummyData = () => {
        const generateRandomData = () => {
            const data = [];

            // 천안 중심 좌표
            const cheonanCenters = {
                dongnam: { lat: 36.8152, lng: 127.1139 }, // 동남구
                seobuk: { lat: 36.8325, lng: 127.1443 }, // 서북구
            };

            // 데이터 생성 함수
            const createData = (center, count, weightRange, time) => {
                for (let i = 0; i < count; i++) {
                    const randomLat = center.lat + (Math.random() - 0.5) * 0.05;
                    const randomLng = center.lng + (Math.random() - 0.5) * 0.05;
                    const randomWeight = Math.floor(Math.random() * (weightRange.max - weightRange.min)) + weightRange.min;
                    data.push({
                        location: new window.google.maps.LatLng(randomLat, randomLng),
                        weight: randomWeight,
                        time: time,
                    });
                }
            };
            const now = new Date(); // 현재 시간
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); 

            // 천안 데이터 생성
            createData(cheonanCenters.dongnam, 30, { min: 10, max: 35 }); // 동남구 (좋음)
            createData(cheonanCenters.seobuk, 30, { min: 40, max: 90 }); // 서북구 (나쁨)

            return data;
        };

        const randomData = generateRandomData(); // 랜덤 데이터 생성
        return randomData;
    };
    const dummyData = fetchDummyData();
    console.log(dummyData); // 콘솔에 출력
    return fetchDummyData();
    
}

export default dummy;
