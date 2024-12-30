function dummy() {
    const cheonanCenters = {
        dongnam: { lat: 36.8152, lng: 127.1139 }, // 동남구 중심 좌표
        seobuk: { lat: 36.8325, lng: 127.1443 }, // 서북구 중심 좌표
    };

    const generateData = (center, count, weightRange) => {
        const data = [];
        for (let i = 0; i < count; i++) {
            const randomLat = center.lat + (Math.random() - 0.5) * 0.05; // 랜덤 좌표 생성
            const randomLng = center.lng + (Math.random() - 0.5) * 0.05;
            const randomWeight = Math.floor(Math.random() * (weightRange.max - weightRange.min)) + weightRange.min;

            // 현재 시간 데이터
            data.push({
                location: new window.google.maps.LatLng(randomLat, randomLng),
                weight: randomWeight,
                time: "now",
            });

            // 1시간 전 데이터 (미세한 움직임 추가)
            data.push({
                location: new window.google.maps.LatLng(
                    randomLat + (Math.random() - 0.5) * 0.002, // 약간의 변화
                    randomLng + (Math.random() - 0.5) * 0.002 // 약간의 변화
                ),
                weight: randomWeight,
                time: "1hourAgo",
            });
        }
        return data;
    };

    // 데이터 생성
    const dongnamData = generateData(cheonanCenters.dongnam, 40, { min: 10, max: 35 }); // 동남구 데이터
    const seobukData = generateData(cheonanCenters.seobuk, 30, { min: 40, max: 90 }); // 서북구 데이터

    // 데이터 병합
    const dummyData = [...dongnamData, ...seobukData];

    console.log(dummyData); // 콘솔에 데이터 출력
    return dummyData;
}

export default dummy;
