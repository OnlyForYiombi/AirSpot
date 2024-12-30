function dummy() {
    const dummyData = [
        // 동남구 데이터 - 현재 시간
        { location: new window.google.maps.LatLng(36.8001, 127.1001), weight: 20, time: "now" },
        { location: new window.google.maps.LatLng(36.8054, 127.1058), weight: 22, time: "now" },
        { location: new window.google.maps.LatLng(36.8107, 127.1123), weight: 18, time: "now" },
        { location: new window.google.maps.LatLng(36.8156, 127.1195), weight: 24, time: "now" },
        { location: new window.google.maps.LatLng(36.8202, 127.1289), weight: 19, time: "now" },
        { location: new window.google.maps.LatLng(36.8258, 127.1357), weight: 21, time: "now" },
        { location: new window.google.maps.LatLng(36.8304, 127.1422), weight: 25, time: "now" },
        { location: new window.google.maps.LatLng(36.8351, 127.1498), weight: 23, time: "now" },
        { location: new window.google.maps.LatLng(36.8407, 127.1573), weight: 20, time: "now" },
        { location: new window.google.maps.LatLng(36.8455, 127.1650), weight: 22, time: "now" },

        // 서북구 데이터 - 현재 시간
        { location: new window.google.maps.LatLng(36.8502, 127.1702), weight: 45, time: "now" },
        { location: new window.google.maps.LatLng(36.8556, 127.1755), weight: 48, time: "now" },
        { location: new window.google.maps.LatLng(36.8601, 127.1832), weight: 50, time: "now" },
        { location: new window.google.maps.LatLng(36.8654, 127.1905), weight: 46, time: "now" },
        { location: new window.google.maps.LatLng(36.8707, 127.1981), weight: 49, time: "now" },
        { location: new window.google.maps.LatLng(36.8753, 127.2056), weight: 51, time: "now" },
        { location: new window.google.maps.LatLng(36.8806, 127.2132), weight: 52, time: "now" },
        { location: new window.google.maps.LatLng(36.8858, 127.2208), weight: 47, time: "now" },
        { location: new window.google.maps.LatLng(36.8903, 127.2283), weight: 53, time: "now" },
        { location: new window.google.maps.LatLng(36.8955, 127.2359), weight: 55, time: "now" },

        // 동남구 데이터 - 1시간 전
        { location: new window.google.maps.LatLng(36.8003, 127.1003), weight: 20, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8056, 127.1060), weight: 22, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8109, 127.1125), weight: 18, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8158, 127.1197), weight: 24, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8204, 127.1291), weight: 19, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8260, 127.1359), weight: 21, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8306, 127.1424), weight: 25, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8353, 127.1500), weight: 23, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8409, 127.1575), weight: 20, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8457, 127.1652), weight: 22, time: "1hourAgo" },

        // 서북구 데이터 - 1시간 전
        { location: new window.google.maps.LatLng(36.8504, 127.1704), weight: 45, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8558, 127.1757), weight: 48, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8603, 127.1834), weight: 50, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8656, 127.1907), weight: 46, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8709, 127.1983), weight: 49, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8755, 127.2058), weight: 51, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8808, 127.2134), weight: 52, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8860, 127.2210), weight: 47, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8905, 127.2285), weight: 53, time: "1hourAgo" },
        { location: new window.google.maps.LatLng(36.8957, 127.2361), weight: 55, time: "1hourAgo" },
    ];

    console.log(dummyData); // 콘솔에 데이터 출력
    return dummyData;
}

export default dummy;
