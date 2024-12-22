import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MapComponent() {
  const [position, setPosition] = useState(null); // 초기 위치는 null로 설정

  // Geolocation API로 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]); // 현재 위치로 상태 업데이트
        },
        (error) => {
          console.error("Error fetching location: ", error);
          // 에러 발생 시 기본 위치서울특별시청으로 설정
          setPosition([37.5665, 126.9780]);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setPosition([37.5665, 126.9780]); // Geolocation 미지원 시 기본 위치
    }
  }, []);

  if (!position) {
    // 위치를 가져오는 동안 로딩 표시
    return <div>지도 정보를 가져오는 중입니다...</div>;
  }

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
      />
      <Marker position={position}>
        <Popup>
          현재 위치: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapComponent;
